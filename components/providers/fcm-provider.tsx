"use client";

import { useFcmToken } from "@/lib/hooks/useFcmToken";

export function FCMProvider({ children }: { children: React.ReactNode }) {
  // Using the hook implicitly triggers permission requests and listens to foreground notifications
  useFcmToken();

  return <>{children}</>;
}
