"use client";

import { useEffect, useState } from "react";
import { getToken, onMessage, Unsubscribe } from "firebase/messaging";
import { messaging } from "../firebase";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { registerFCMToken } from "../api";
import { usePathname } from "next/navigation";

export const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          // Verify service worker is registered
          navigator.serviceWorker.register("/firebase-messaging-sw.js", {
            scope: "/",
          });

          // Request permission if not already granted
          const permission = await Notification.requestPermission();
          setPermissionStatus(permission);

          if (permission === "granted") {
            if (messaging) {
              const currentToken = await getToken(messaging, {
                // By not specifying vapidKey, Firebase will still generate a token for basic push setup,
                // or you can add your `vapidKey` configuration here if required by web push constraints later.
              });
              if (currentToken) {
                setToken(currentToken);
                console.log("FCM Token: ", currentToken);

                // Registration to backend is handled by a separate useEffect
              } else {
                console.warn(
                  "No registration token available. Request permission to generate one.",
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("An error occurred while retrieving token: ", error);
      }
    };

    retrieveToken();
  }, []);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (token && accessToken) {
      Cookies.set("fcm_token", token, { expires: 365 });
      registerFCMToken({ token, source: "WEB" })
        .then(() =>
          console.log("FCM token successfully registered to backend."),
        )
        .catch((err) =>
          console.error("Failed to register FCM token to backend:", err),
        );
    }
  }, [token, pathname]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    if (messaging) {
      unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received: ", payload);
        if (payload.notification) {
          toast.info(payload.notification.title || "New Notification", {
            description: payload.notification.body,
          });
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { token, permissionStatus };
};
