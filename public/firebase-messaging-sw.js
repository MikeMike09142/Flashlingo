// Service Worker para Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBmYL4oiYm_r1_k5ot5f1IfzJgQ7uKqE-U",
  authDomain: "flashlingo-9ea2f.firebaseapp.com",
  projectId: "flashlingo-9ea2f",
  storageBucket: "flashlingo-9ea2f.firebasestorage.app",
  messagingSenderId: "593446153586",
  appId: "1:593446153586:web:111c3499b23e3ce7ba01eb",
  measurementId: "G-PWWG0FXLXW"
});

const messaging = firebase.messaging();

// Maneja notificaciones en background
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Recibido mensaje en background:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png' // Cambia el icono si tienes uno personalizado
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 