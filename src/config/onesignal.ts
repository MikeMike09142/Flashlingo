// Configuración de OneSignal
// App ID y API Key proporcionados por el usuario

export const ONESIGNAL_CONFIG = {
  APP_ID: '22347e76-6fb4-470c-a82d-bc095c91cb1d',
  // La API Key solo debe usarse en backend, no en frontend
  API_KEY: 'os_v2_app_ei2h45tpwrdqzkbnxqevzeoldvufdpilguoujo5puvuhcgn6aaxxiq44vjw4dcfcrwz4mzqwi5stodz5ylqpofjmfm4wjq2mtbl62yi',
  SETTINGS: {
    allowLocalhostAsSecureOrigin: true,
    autoRegister: false,
    notifyButton: {
      enable: true,
      showAfterSubscribed: false,
    },
    welcomeNotification: {
      title: "¡Bienvenido a FlashLingo!",
      message: "Gracias por suscribirte a nuestras notificaciones de estudio.",
    },
  },
  NOTIFICATIONS: {
    STUDY_REMINDER: {
      title: "¡Hora de estudiar! 📚",
      message: "Mantén tu rutina de estudio. ¡Solo 5 minutos pueden hacer la diferencia!",
    },
    PROGRESS_UPDATE: {
      title: "¡Excelente progreso! 🎉",
      message: "Has completado tu sesión de estudio de hoy. ¡Sigue así!",
    },
    STREAK_REMINDER: {
      title: "¡No rompas tu racha! 🔥",
      message: "Has mantenido una racha de estudio. ¡Continúa hoy!",
    },
  },
};

export const getOneSignalAppId = (): string => {
  return ONESIGNAL_CONFIG.APP_ID;
};

export const isOneSignalConfigured = (): boolean => {
  return ONESIGNAL_CONFIG.APP_ID !== '' && ONESIGNAL_CONFIG.APP_ID !== 'TU-APP-ID-AQUI';
}; 