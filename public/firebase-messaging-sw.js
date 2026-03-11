/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js",
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
const firebaseConfig = {
  apiKey: "AIzaSyBP5Q8s0Ap7tyHEs875Lloxc9ugx2cpD_8",
  authDomain: "fisiohome-e4db3.firebaseapp.com",
  projectId: "fisiohome-e4db3",
  storageBucket: "fisiohome-e4db3.firebasestorage.app",
  messagingSenderId: "951091719948",
  appId: "1:951091719948:web:d04c080a5e3abfbaf66329",
  measurementId: "G-KQ5FD00PD0",
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  if (payload.notification) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/icon.png", // Use the app's icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
