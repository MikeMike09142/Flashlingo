import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de imágenes necesarias
const imageList = [
  'book', 'house', 'dog', 'cat', 'table', 'pen', 'apple', 'car', 'window', 'friend',
  'chair', 'bird', 'school', 'sun', 'water', 'shirt', 'food', 'phone', 'bag', 'ball',
  'bed', 'shoe', 'street', 'watch', 'coffee', 'ice-cream', 'lamp', 'shoes', 'cup', 'computer',
  'flower', 'rain', 'egg', 'hat', 'clock', 'tshirt', 'bicycle', 'pizza', 'door', 'camera',
  'pencil', 'key', 'bread', 'notebook', 'bus', 'hotel', 'television', 'train', 'cake', 'fish',
  'milk', 'laptop', 'picture',
  // Verbos
  'verb-eat', 'verb-drink', 'verb-sleep', 'verb-read', 'verb-write', 'verb-play', 'verb-work',
  'verb-study', 'verb-go', 'verb-come', 'verb-have', 'verb-do', 'verb-say', 'verb-get',
  'verb-make', 'verb-take', 'verb-give', 'verb-look', 'verb-find', 'verb-swim', 'verb-run',
  'verb-walk', 'verb-see', 'verb-hear', 'verb-speak', 'verb-listen', 'verb-think', 'verb-know',
  'verb-want', 'verb-need'
];

// Crear directorio si no existe
const imagesDir = path.join(__dirname, '../public/images/flashcards');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ Directorio creado:', imagesDir);
}

// Función para descargar imagen (CORREGIDA)
function downloadImage(filename) {
  return new Promise((resolve, reject) => {
    const initialUrl = `https://picsum.photos/400/300?random=${Math.random()}`;
    
    const performGet = (url) => {
      https.get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // Si es una redirección, llamamos de nuevo con la nueva URL
          performGet(response.headers.location);
        } else if (response.statusCode === 200) {
          // Si es una descarga correcta, guardamos el archivo
          const filepath = path.join(imagesDir, `${filename}.jpg`);
          const fileStream = fs.createWriteStream(filepath);
          response.pipe(fileStream);
          
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`✅ Descargada: ${filename}.jpg`);
            resolve();
          });

          fileStream.on('error', (err) => {
            console.error(`❌ Error guardando ${filename}:`, err.message);
            fs.unlink(filepath, () => reject(err));
          });
        } else {
          // Si hay otro tipo de error
          reject(new Error(`Fallo al descargar ${filename}. Status Code: ${response.statusCode}`));
        }
      }).on('error', (err) => {
        console.error(`❌ Error en petición para ${filename}:`, err.message);
        reject(err);
      });
    };

    performGet(initialUrl);
  });
}

// Función principal
async function generateImages() {
  console.log('🚀 Iniciando descarga de imágenes...');
  console.log(`📁 Directorio de destino: ${imagesDir}`);
  console.log(`📊 Total de imágenes a descargar: ${imageList.length}`);
  
  const promises = imageList.map((imageName, index) => {
    // Añadir delay para no sobrecargar la API
    return new Promise(resolve => {
      setTimeout(async () => {
        try {
          await downloadImage(imageName);
          resolve();
        } catch (error) {
          console.error(`Error con ${imageName}:`, error);
          resolve();
        }
      }, index * 100); // 100ms entre descargas
    });
  });
  
  try {
    await Promise.all(promises);
    console.log('\n🎉 ¡Todas las imágenes han sido descargadas!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Revisa las imágenes en public/images/flashcards/');
    console.log('2. Reemplaza las imágenes de placeholder con imágenes reales');
    console.log('3. Ejecuta npm run dev para probar la aplicación');
    console.log('\n💡 Sugerencias:');
    console.log('- Usa Unsplash, Pexels o Pixabay para imágenes gratuitas');
    console.log('- Optimiza las imágenes para web (máximo 200KB)');
    console.log('- Mantén un tamaño consistente (400x300px recomendado)');
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar si se llama directamente
generateImages();

export { generateImages, imageList }; 