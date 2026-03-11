import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";
import {
  getAnalytics,
  Analytics,
  isSupported as isAnalyticsSupported,
} from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP5Q8s0Ap7tyHEs875Lloxc9ugx2cpD_8",
  authDomain: "fisiohome-e4db3.firebaseapp.com",
  projectId: "fisiohome-e4db3",
  storageBucket: "fisiohome-e4db3.firebasestorage.app",
  messagingSenderId: "951091719948",
  appId: "1:951091719948:web:d04c080a5e3abfbaf66329",
  measurementId: "G-KQ5FD00PD0",
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics conditionally (only supported in browser environments)
let analytics: Analytics | null = null;
isAnalyticsSupported().then((isSupported) => {
  if (isSupported) {
    analytics = getAnalytics(app);
  }
});

// Initialize Messaging conditionally (only supported in browser environments where Service Workers are supported)
let messaging: Messaging | null = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export { app, analytics, messaging };
