# Script de Descarga de Imágenes de Pexels

Este script descarga automáticamente imágenes de Pexels para las flashcards de la aplicación, empezando desde la flashcard con ID 101.

## 📋 Requisitos Previos

1. **Node.js** instalado en tu sistema
2. **API Key gratuita de Pexels**

## 🔑 Obtener API Key de Pexels

1. Ve a [https://www.pexels.com/api/](https://www.pexels.com/api/)
2. Regístrate para una cuenta gratuita
3. Una vez registrado, obtén tu API key desde el dashboard
4. La API gratuita permite hasta 200 requests por hora

## ⚙️ Configuración

1. Abre el archivo `scripts/download-images.js`
2. Reemplaza `'TU_API_KEY_AQUI'` con tu API key real de Pexels:

```javascript
const PEXELS_API_KEY = '2ErEjL9aYqR46iwHbmn6ZDFS9X9n0DXazOqFxnXPwRlDmE3tBKEIgpXW';
```

3. Verifica que la ruta de salida sea correcta:

```javascript
const OUTPUT_DIR = 'C:\\Users\\migue\\Desktop\\project\\public\\images\\flashcards';
```

## 🚀 Ejecutar el Script

### Desde la línea de comandos:

```bash
# Navegar al directorio del proyecto
cd C:\Users\migue\Desktop\project

# Ejecutar el script
node scripts/download-images.js
```

### Desde el directorio scripts:

```bash
cd scripts
node download-images.js
```

## 📊 Funcionalidades

- **Descarga automática**: Descarga imágenes para todas las flashcards desde la ID 101 hasta la 200
- **Evita duplicados**: No descarga imágenes que ya existen
- **Rate limiting**: Incluye pausas de 1 segundo entre requests para evitar límites de la API
- **Manejo de errores**: Captura y reporta errores de descarga
- **Progreso detallado**: Muestra el progreso en tiempo real
- **Resumen final**: Proporciona estadísticas al finalizar

## 📁 Estructura de Archivos

El script descargará las imágenes con los siguientes nombres:

```
public/images/flashcards/
├── cloud.jpg
├── desk.jpg
├── wallet.jpg
├── fan.jpg
├── backpack.jpg
├── stairs.jpg
├── road.jpg
├── bridge.jpg
├── moon.jpg
├── star.jpg
├── rock.jpg
├── fire.jpg
├── pan.jpg
├── fork.jpg
├── knife.jpg
├── spoon.jpg
├── plate.jpg
├── napkin.jpg
├── horse.jpg
├── sofa.jpg
├── curtain.jpg
├── ceiling.jpg
├── wall.jpg
├── floor.jpg
├── ceiling-fan.jpg
├── light.jpg
├── bottle.jpg
├── toothpaste.jpg
├── soap.jpg
├── office.jpg
├── job.jpg
├── boss.jpg
├── money.jpg
├── meeting.jpg
├── email.jpg
├── phonecall.jpg
├── rabbit.jpg
├── paper.jpg
├── cow.jpg
├── team.jpg
├── sale.jpg
├── client.jpg
├── invoice.jpg
├── report.jpg
├── happy.jpg
├── sad.jpg
├── angry.jpg
├── excited.jpg
├── scared.jpg
├── tired.jpg
├── calm.jpg
├── nervous.jpg
├── bored.jpg
├── lonely.jpg
├── surprised.jpg
├── confused.jpg
├── proud.jpg
├── shy.jpg
├── friendly.jpg
├── january.jpg
├── february.jpg
├── march.jpg
├── april.jpg
├── may.jpg
├── june.jpg
├── july.jpg
├── august.jpg
├── september.jpg
├── october.jpg
├── november.jpg
├── december.jpg
├── festival.jpg
├── honey.jpg
├── lantern.jpg
├── hour.jpg
├── minute.jpg
├── second.jpg
├── morning.jpg
├── afternoon.jpg
├── evening.jpg
├── night.jpg
├── spring.jpg
├── summer.jpg
├── autumn.jpg
├── winter.jpg
├── today.jpg
├── tomorrow.jpg
├── yesterday.jpg
├── week.jpg
├── windowpane.jpg
├── shadow.jpg
├── fence.jpg
├── bell.jpg
├── puzzle.jpg
├── farm.jpg
├── feather.jpg
├── button.jpg
└── bench.jpg
```

## ⚠️ Limitaciones de la API Gratuita

- **200 requests por hora**: El script incluye pausas para respetar este límite
- **1 imagen por búsqueda**: El script descarga solo la primera imagen encontrada
- **Tamaño de imagen**: Usa imágenes medianas o pequeñas para optimizar el espacio

## 🔧 Personalización

### Cambiar el directorio de salida:

```javascript
const OUTPUT_DIR = 'tu/ruta/personalizada/aqui';
```

### Cambiar el tiempo de pausa entre requests:

```javascript
await sleep(2000); // 2 segundos en lugar de 1
```

### Modificar el tamaño de imagen preferido:

```javascript
const imageUrl = photo.src.large || photo.src.medium || photo.src.small;
```

## 📝 Logs y Debugging

El script proporciona logs detallados:

- `🚀 Iniciando descarga...` - Inicio del proceso
- `Procesando: palabra (card-xxx)` - Procesando cada flashcard
- `🔍 Buscando imagen...` - Realizando búsqueda en Pexels
- `📥 Descargando imagen...` - Descargando la imagen
- `✅ Descargado exitosamente` - Descarga completada
- `⏭️ Ya existe, saltando...` - Imagen ya existe
- `❌ Error procesando...` - Error en la descarga
- `📊 RESUMEN FINAL` - Estadísticas finales

## 🛠️ Solución de Problemas

### Error: "Debes configurar tu API key"
- Verifica que hayas reemplazado `'TU_API_KEY_AQUI'` con tu API key real

### Error: "No se encontraron imágenes para: palabra"
- Algunas palabras pueden no tener imágenes disponibles en Pexels
- El script continuará con la siguiente palabra

### Error: "Error HTTP: 429"
- Has excedido el límite de requests por hora
- Espera una hora y ejecuta el script nuevamente

### Error: "Error al parsear respuesta"
- Problema temporal con la API de Pexels
- Intenta ejecutar el script nuevamente

## 📈 Monitoreo del Progreso

El script muestra:
- Progreso en tiempo real
- Contador de imágenes descargadas
- Contador de errores
- Contador de imágenes saltadas
- Resumen final con estadísticas

## 🔄 Re-ejecutar el Script

Puedes ejecutar el script múltiples veces de forma segura:
- Las imágenes existentes se saltarán automáticamente
- Solo se descargarán las imágenes faltantes
- No se sobrescribirán imágenes existentes 