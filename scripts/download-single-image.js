import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const PEXELS_API_KEY = '2ErEjL9aYqR46iwHbmn6ZDFS9X9n0DXazOqFxnXPwRlDmE3tBKEIgpXW';
const OUTPUT_DIR = 'C:\\Users\\migue\\Desktop\\project\\public\\images\\flashcards';

// FUNCIÓN: Cambia esta palabra por la que quieres descargar
const WORD_TO_DOWNLOAD = 'june'; // Cambia aquí la palabra que quieres

// Función para descargar una imagen
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Error HTTP: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Función para buscar imagen en Pexels
async function searchImageOnPexels(query) {
  return new Promise((resolve, reject) => {
    // Usar términos de búsqueda mejorados para obtener mejores resultados
    const searchTerms = {
      'june': 'june calendar month',
      'cloud': 'white cloud sky',
      'desk': 'wooden desk office',
      'wallet': 'leather wallet',
      'fan': 'ceiling fan',
      'backpack': 'school backpack',
      // Añade más términos específicos aquí...
    };
    
    const searchQuery = searchTerms[query] || query;
    const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`;
    
    const options = {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    };
    
    https.get(searchUrl, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.photos && response.photos.length > 0) {
            const photo = response.photos[0];
            const imageUrl = photo.src.medium || photo.src.small || photo.src.original;
            resolve(imageUrl);
          } else {
            reject(new Error(`No se encontraron imágenes para: ${searchQuery}`));
          }
        } catch (error) {
          reject(new Error(`Error al parsear respuesta: ${error.message}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Función principal
async function main() {
  console.log(`🚀 Descargando imagen para: ${WORD_TO_DOWNLOAD}`);
  console.log(`📁 Directorio de salida: ${OUTPUT_DIR}`);
  console.log('');
  
  // Crear directorio si no existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Directorio creado: ${OUTPUT_DIR}`);
  }
  
  const filename = `${WORD_TO_DOWNLOAD}.jpg`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  try {
    // Verificar si la imagen ya existe
    if (fs.existsSync(filepath)) {
      console.log(`⚠️  ${filename} ya existe, se reemplazará...`);
    }
    
    // Buscar imagen en Pexels
    console.log(`🔍 Buscando imagen para "${WORD_TO_DOWNLOAD}"...`);
    const imageUrl = await searchImageOnPexels(WORD_TO_DOWNLOAD);
    
    // Descargar imagen
    console.log(`📥 Descargando imagen...`);
    await downloadImage(imageUrl, filepath);
    
    console.log(`✅ ${filename} descargado exitosamente`);
    console.log(`📁 Ubicación: ${filepath}`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.log('\n💡 Sugerencias:');
    console.log('1. Verifica tu conexión a internet');
    console.log('2. Intenta con una palabra diferente');
    console.log('3. Descarga manualmente desde Pexels/Unsplash');
  }
}

// Verificar API key
if (PEXELS_API_KEY === 'TU_API_KEY_AQUI') {
  console.error('❌ ERROR: Debes configurar tu API key de Pexels');
  process.exit(1);
}

// Ejecutar script
main().catch(console.error); 