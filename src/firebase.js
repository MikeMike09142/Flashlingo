// Configuración de Firebase para FlashLingo
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBmYL4oiYm_r1_k5ot5f1IfzJgQ7uKqE-U",
  authDomain: "flashlingo-9ea2f.firebaseapp.com",
  projectId: "flashlingo-9ea2f",
  storageBucket: "flashlingo-9ea2f.firebasestorage.app",
  messagingSenderId: "593446153586",
  appId: "1:593446153586:web:111c3499b23e3ce7ba01eb",
  measurementId: "G-PWWG0FXLXW"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa Firebase Cloud Messaging
const messaging = getMessaging(app);

// Función para pedir permiso y obtener el token de notificaciones push
export async function requestNotificationPermission(vapidKey) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey });
      console.log("Token FCM:", token);
      return token;
    } else {
      console.warn("Permiso de notificaciones no concedido");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el token de notificaciones:", error);
    return null;
  }
}

// Para escuchar mensajes cuando la app está en primer plano
export { messaging, onMessage }; 