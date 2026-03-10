import { apiFetch } from "./client";

export interface RegisterFCMTokenRequest {
  token: string;
  source: string;
}

export interface RegisterFCMTokenResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export const registerFCMToken = (data: RegisterFCMTokenRequest) => {
  return apiFetch<RegisterFCMTokenResponse>(
    "/api/v1/notifications/fcm/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
};

export interface UnregisterFCMTokenRequest {
  token: string;
}

export const unregisterFCMToken = (data: UnregisterFCMTokenRequest) => {
  return apiFetch<RegisterFCMTokenResponse>(
    "/api/v1/notifications/fcm/unregister",
    {
      method: "DELETE",
      body: JSON.stringify(data),
    },
  );
};
