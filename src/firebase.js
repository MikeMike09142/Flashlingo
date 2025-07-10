// Configuración de Firebase para FlashLingo
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

// Elimina cualquier export o función relacionada a FCM o notificaciones push. 