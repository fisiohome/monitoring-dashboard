import Cookies from "js-cookie";
import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

function handleLogout() {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user_email");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// --- API Helper ---
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = Cookies.get("access_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      console.warn("Unauthorized access, attempting to refresh token...");

      const refreshToken = Cookies.get("refresh_token");

      if (!refreshToken) {
        handleLogout();
        throw new ApiError("Session expired. Please log in again.", 401);
      }

      const originalRequest = {
        endpoint,
        options,
      };

      if (isRefreshing) {
        return new Promise<T>((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              const newHeaders = {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              };
              fetch(`${API_BASE_URL}${originalRequest.endpoint}`, {
                ...originalRequest.options,
                headers: newHeaders,
              })
                .then(async (newRes) => {
                  if (!newRes.ok)
                    throw new ApiError("Retry failed", newRes.status);
                  const json = await newRes.json();
                  if (json.data && json.meta && typeof json.data === "object") {
                    json.data.meta = json.meta;
                  }
                  resolve((json.data || json) as T);
                })
                .catch(reject);
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!refreshRes.ok) {
          throw new ApiError("Refresh failed", refreshRes.status);
        }

        const refreshData = await refreshRes.json();

        if (refreshData.success && refreshData.data?.access_token) {
          Cookies.set("access_token", refreshData.data.access_token, {
            expires: 1,
          });
          if (refreshData.data.refresh_token) {
            Cookies.set("refresh_token", refreshData.data.refresh_token, {
              expires: 7,
            });
          }

          processQueue(null, refreshData.data.access_token);

          // Retry the original request
          headers["Authorization"] = `Bearer ${refreshData.data.access_token}`;
          res = await fetch(`${API_BASE_URL}${originalRequest.endpoint}`, {
            ...originalRequest.options,
            headers,
          });

          if (!res.ok) {
            handleLogout();
            throw new ApiError(
              `API Request failed after retry: ${res.statusText}`,
              res.status,
            );
          }
        } else {
          throw new ApiError("Invalid refresh response", 401);
        }
      } catch (err: any) {
        processQueue(err, null);
        handleLogout();
        throw new ApiError("Session expired. Please log in again.", 401);
      } finally {
        isRefreshing = false;
      }
    } else {
      let errorMsg = `API Request failed: ${res.statusText}`;
      let errorData = null;
      try {
        errorData = await res.json();
        errorMsg = errorData?.message || errorData?.error || errorMsg;
      } catch (e) {}
      throw new ApiError(errorMsg, res.status, errorData);
    }
  }

  const json = await res.json();

  // Preserve meta if it exists alongside data
  if (json.data && json.meta && typeof json.data === "object") {
    json.data.meta = json.meta;
  }

  return json.data || json; // Handle wrapped .data structure or direct response
}
