import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/lib/api/config";
import { ApiError } from "@/lib/api/client";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }

      if (!res.ok) {
        throw new ApiError(
          data?.message || data?.error || "Login failed",
          res.status,
          data,
        );
      }

      if (data?.success) {
        // Role validation
        const roles = data.data.user?.roles || [];
        const hasAccess = roles.some((role: string) =>
          ["ADMIN", "STAFF"].includes(role.toUpperCase()),
        );

        if (!hasAccess) {
          throw new ApiError(
            "Anda tidak memiliki akses sebagai Admin/Staff",
            403,
          );
        }

        Cookies.set("access_token", data.data.access_token, { expires: 1 });
        if (data.data.refresh_token) {
          Cookies.set("refresh_token", data.data.refresh_token, { expires: 7 }); // e.g. 7 days
        }
        Cookies.set("user_email", data.data.user.email);
        router.push("/dashboard");
      } else {
        throw new ApiError(data?.message || "Login failed", 400);
      }
    } catch (err: any) {
      if (err.name === "ApiError") {
        setError(err.message);
        toast.error("Gagal Masuk", { description: err.message });
      } else {
        const msg = err.message || "An unexpected error occurred";
        setError(msg);
        toast.error("Terjadi Kesalahan", { description: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
}
