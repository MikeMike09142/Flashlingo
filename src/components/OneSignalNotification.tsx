import { useEffect, useState } from 'react';
import { getOneSignalAppId, isOneSignalConfigured } from '../config/onesignal';

interface OneSignalNotificationProps {
  appId?: string;
}

declare global {
  interface Window {
    OneSignal: any;
    OneSignalInitialized?: boolean;
  }
}

export const OneSignalNotification: React.FC<OneSignalNotificationProps> = ({ appId: propAppId }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Usar el App ID de props o el de la configuración
  const appId = propAppId || getOneSignalAppId();

  useEffect(() => {
    // Solo inicializar si OneSignal no está ya inicializado
    const loadOneSignal = () => {
      if (typeof window !== 'undefined' && !window.OneSignalInitialized) {
        window.OneSignal = window.OneSignal || [];
        window.OneSignal.push(function() {
          window.OneSignal.init({
            appId: appId,
            allowLocalhostAsSecureOrigin: true,
            autoRegister: false, // No suscribir automáticamente
            notifyButton: {
              enable: true,
              showAfterSubscribed: false,
            },
            welcomeNotification: {
              title: "¡Bienvenido a FlashLingo!",
              message: "Gracias por suscribirte a nuestras notificaciones de estudio.",
            },
          });

          // Verificar si ya está suscrito
          window.OneSignal.isPushNotificationsEnabled().then((isEnabled: boolean) => {
            setIsSubscribed(isEnabled);
            setIsLoading(false);
          });
        });
        window.OneSignalInitialized = true;
      } else if (typeof window !== 'undefined' && window.OneSignalInitialized) {
        // Ya inicializado, solo verificar estado
        window.OneSignal.isPushNotificationsEnabled().then((isEnabled: boolean) => {
          setIsSubscribed(isEnabled);
          setIsLoading(false);
        });
      }
    };

    // Cargar el script de OneSignal si no está cargado
    if (typeof window !== 'undefined') {
      if (!document.querySelector('script[src*="OneSignalSDK"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
        script.async = true;
        script.defer = true;
        script.onload = loadOneSignal;
        document.head.appendChild(script);
      } else {
        loadOneSignal();
      }
    }
  }, [appId]);

  const subscribeToNotifications = async () => {
    try {
      setIsLoading(true);
      await window.OneSignal.registerForPushNotifications();
      const isEnabled = await window.OneSignal.isPushNotificationsEnabled();
      setIsSubscribed(isEnabled);
      if (isEnabled) {
        console.log('Usuario suscrito exitosamente a las notificaciones');
      }
    } catch (error) {
      console.error('Error al suscribirse a las notificaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      setIsLoading(true);
      await window.OneSignal.setSubscription(false);
      setIsSubscribed(false);
      console.log('Usuario desuscrito de las notificaciones');
    } catch (error) {
      console.error('Error al desuscribirse de las notificaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      alert('Para enviar notificaciones reales, usa la API de OneSignal desde tu backend.');
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  };

  // Si OneSignal no está configurado, mostrar mensaje de configuración
  if (!isOneSignalConfigured()) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">Configuración Requerida</h3>
        <p className="text-yellow-700 mb-3">
          Para activar las notificaciones, necesitas configurar OneSignal:
        </p>
        <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
          <li>Crea una cuenta en <a href="https://onesignal.com" target="_blank" rel="noopener noreferrer" className="underline">OneSignal.com</a></li>
          <li>Crea una nueva app de Web Push</li>
          <li>Copia tu App ID</li>
          <li>Reemplaza 'TU-APP-ID-AQUI' en <code className="bg-yellow-100 px-1 rounded">src/config/onesignal.ts</code></li>
        </ol>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-600">Configurando notificaciones...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Notificaciones de Estudio</h3>
      <div className="space-y-3">
        {!isSubscribed ? (
          <div>
            <p className="text-gray-600 mb-3">
              Recibe recordatorios para estudiar y notificaciones sobre tu progreso.
            </p>
            <button
              onClick={subscribeToNotifications}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Suscribiendo...' : 'Activar Notificaciones'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-green-600 mb-3">
              ✅ Notificaciones activadas. Recibirás recordatorios de estudio.
            </p>
            <div className="space-y-2">
              <button
                onClick={sendTestNotification}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Enviar Notificación de Prueba
              </button>
              <button
                onClick={unsubscribeFromNotifications}
                disabled={isLoading}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50"
              >
                {isLoading ? 'Desuscribiendo...' : 'Desactivar Notificaciones'}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Tip:</strong> Las notificaciones te ayudarán a mantener una rutina de estudio consistente.
        </p>
      </div>
    </div>
  );
}; 