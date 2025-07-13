# Configuración de OneSignal para FlashLingo

## ¿Qué es OneSignal?

OneSignal es una plataforma gratuita para enviar notificaciones push web que es mucho más fácil de configurar que Firebase Cloud Messaging (FCM).

## Pasos para configurar OneSignal

### 1. Crear cuenta en OneSignal

1. Ve a [onesignal.com](https://onesignal.com)
2. Haz clic en "Get Started Free"
3. Crea tu cuenta con email y contraseña
4. Verifica tu email

### 2. Crear una nueva aplicación

1. Una vez en el dashboard, haz clic en "New App/Website"
2. Selecciona "Web Push" como plataforma
3. Dale un nombre a tu app (ej: "FlashLingo")
4. Haz clic en "Create"

### 3. Configurar Web Push

1. En la configuración de Web Push:
   - **Site Name**: FlashLingo
   - **Site URL**: Tu URL de Vercel (ej: https://flashlingo.vercel.app)
   - **Default Notification Icon**: Puedes subir un ícono 192x192
   - **Default Notification Title**: FlashLingo
   - **Default Notification Message**: ¡Hora de estudiar!

2. Haz clic en "Save"

### 4. Obtener tu App ID

1. En el dashboard, ve a "Settings" > "Keys & IDs"
2. Copia tu **App ID** (es una cadena larga de caracteres)

### 5. Configurar en tu código

1. Abre el archivo `src/config/onesignal.ts`
2. Reemplaza `'TU-APP-ID-AQUI'` con tu App ID real:

```typescript
export const ONESIGNAL_CONFIG = {
  APP_ID: 'tu-app-id-real-aqui',
  // ... resto de la configuración
};
```

### 6. Probar las notificaciones

1. Ejecuta tu aplicación localmente o despliégala
2. Ve a la página de Settings
3. En la sección "Notifications", haz clic en "Activar Notificaciones"
4. Acepta los permisos del navegador
5. Prueba el botón "Enviar Notificación de Prueba"

## Funcionalidades incluidas

### ✅ Lo que ya está implementado:

- **Suscripción/Desuscripción**: Los usuarios pueden activar/desactivar notificaciones
- **Verificación de estado**: La app verifica si el usuario ya está suscrito
- **Interfaz de usuario**: Componente integrado en la página de Settings
- **Configuración centralizada**: Todo configurado en un solo archivo
- **Mensajes predefinidos**: Notificaciones para recordatorios de estudio

### 🔄 Lo que puedes personalizar:

- **Mensajes de notificación**: Edita los mensajes en `src/config/onesignal.ts`
- **Configuración de OneSignal**: Modifica las opciones en el dashboard
- **Diseño del componente**: Personaliza el estilo en `OneSignalNotification.tsx`

## Enviar notificaciones desde el backend

Para enviar notificaciones automáticas (ej: recordatorios diarios), necesitarás:

1. **API Key de OneSignal**: Obtén esto desde el dashboard
2. **Backend**: Usa la API REST de OneSignal para enviar notificaciones
3. **Programación**: Configura cron jobs o webhooks

### Ejemplo de API call:

```javascript
// Desde tu backend
const response = await fetch('https://onesignal.com/api/v1/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic TU-API-KEY'
  },
  body: JSON.stringify({
    app_id: 'TU-APP-ID',
    included_segments: ['All'],
    headings: { en: '¡Hora de estudiar!' },
    contents: { en: 'Mantén tu rutina de estudio diaria.' }
  })
});
```

## Solución de problemas

### Error: "OneSignal is not defined"
- Verifica que el script de OneSignal se esté cargando correctamente
- Revisa la consola del navegador para errores

### Error: "App ID not found"
- Asegúrate de haber reemplazado 'TU-APP-ID-AQUI' con tu App ID real
- Verifica que el App ID sea correcto

### Las notificaciones no aparecen
- Verifica que el navegador permita notificaciones
- Asegúrate de que la URL esté en HTTPS (requerido para notificaciones push)
- Revisa la configuración de OneSignal en el dashboard

### Error de CSP (Content Security Policy)
- El archivo `index.html` ya incluye los dominios necesarios de OneSignal
- Si tienes problemas, verifica que la CSP permita `https://*.onesignal.com`

## Recursos adicionales

- [Documentación oficial de OneSignal](https://documentation.onesignal.com/)
- [API Reference](https://documentation.onesignal.com/reference)
- [Web Push SDK](https://documentation.onesignal.com/docs/web-push-sdk-setup)

## Plan gratuito de OneSignal

- ✅ Hasta 10,000 suscriptores
- ✅ Notificaciones ilimitadas
- ✅ Dashboard completo
- ✅ API REST
- ✅ Soporte por email

¡Perfecto para aplicaciones pequeñas y medianas! 