import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const PEXELS_API_KEY = '2ErEjL9aYqR46iwHbmn6ZDFS9X9n0DXazOqFxnXPwRlDmE3tBKEIgpXW'; // API key actualizada
const OUTPUT_DIR = 'C:\\Users\\migue\\Desktop\\project\\public\\images\\flashcards';
const DELAY_BETWEEN_REQUESTS = 1000; // 1 segundo entre requests
const MAX_RETRIES = 3; // Máximo número de reintentos por imagen
const LOG_FILE = 'download-log.txt'; // Archivo de log

// Datos de las flashcards desde el AppContext (desde card-201 hasta card-300)
const flashcards = [
  { "id": "card-201", "englishWord": "Neighbor" },
  { "id": "card-202", "englishWord": "Traffic" },
  { "id": "card-203", "englishWord": "Elevator" },
  { "id": "card-204", "englishWord": "Message" },
  { "id": "card-205", "englishWord": "Credit card" },
  { "id": "card-206", "englishWord": "Receipt" },
  { "id": "card-207", "englishWord": "Appointment" },
  { "id": "card-208", "englishWord": "Schedule" },
  { "id": "card-209", "englishWord": "Waiter" },
  { "id": "card-210", "englishWord": "Customer" },
  { "id": "card-211", "englishWord": "Remote" },
  { "id": "card-212", "englishWord": "Charger" },
  { "id": "card-213", "englishWord": "Raincoat" },
  { "id": "card-214", "englishWord": "Luggage" },
  { "id": "card-215", "englishWord": "Credit card" },
  { "id": "card-216", "englishWord": "Stranger" },
  { "id": "card-217", "englishWord": "Cousin" },
  { "id": "card-218", "englishWord": "Uncle" },
  { "id": "card-219", "englishWord": "Aunt" },
  { "id": "card-220", "englishWord": "Nephew" },
  { "id": "card-221", "englishWord": "Niece" },
  { "id": "card-222", "englishWord": "Neighbor" },
  { "id": "card-223", "englishWord": "Roommate" },
  { "id": "card-224", "englishWord": "Boyfriend" },
  { "id": "card-225", "englishWord": "Girlfriend" },
  { "id": "card-226", "englishWord": "Classmate" },
  { "id": "card-227", "englishWord": "Employee" },
  { "id": "card-228", "englishWord": "Friendship" },
  { "id": "card-229", "englishWord": "Teenager" },
  { "id": "card-230", "englishWord": "Partner" },
  { "id": "card-231", "englishWord": "Interview" },
  { "id": "card-232", "englishWord": "Passport" },
  { "id": "card-233", "englishWord": "Rent" },
  { "id": "card-234", "englishWord": "Bank" },
  { "id": "card-235", "englishWord": "Bill" },
  { "id": "card-236", "englishWord": "Medicine" },
  { "id": "card-237", "englishWord": "Temperature" },
  { "id": "card-238", "englishWord": "Loud" },
  { "id": "card-239", "englishWord": "Quiet" },
  { "id": "card-240", "englishWord": "Tourist" },
  { "id": "card-241", "englishWord": "Guide" },
  { "id": "card-242", "englishWord": "Map" },
  { "id": "card-243", "englishWord": "Noise" },
  { "id": "card-244", "englishWord": "Stage" },
  { "id": "card-245", "englishWord": "Actor" },
  { "id": "card-246", "englishWord": "Painting" },
  { "id": "card-247", "englishWord": "Artist" },
  { "id": "card-248", "englishWord": "Festival" },
  { "id": "card-249", "englishWord": "Firefighter" },
  { "id": "card-250", "englishWord": "Police officer" },
  { "id": "card-251", "englishWord": "Crowd" },
  { "id": "card-252", "englishWord": "Painter" },
  { "id": "card-253", "englishWord": "Concert" },
  { "id": "card-254", "englishWord": "Garbage" },
  { "id": "card-255", "englishWord": "Helmet" },
  { "id": "card-256", "englishWord": "Uniform" },
  { "id": "card-257", "englishWord": "Helmet" },
  { "id": "card-258", "englishWord": "Flight attendant" },
  { "id": "card-259", "englishWord": "Tour" },
  { "id": "card-260", "englishWord": "Remote" },
  { "id": "card-261", "englishWord": "Wallet" },
  { "id": "card-262", "englishWord": "Soap" },
  { "id": "card-263", "englishWord": "Receipt" },
  { "id": "card-264", "englishWord": "Elevator" },
  { "id": "card-265", "englishWord": "Menu" },
  { "id": "card-266", "englishWord": "Dish" },
  { "id": "card-267", "englishWord": "Receipt" },
  { "id": "card-268", "englishWord": "Nurse" },
  { "id": "card-269", "englishWord": "Passport" },
  { "id": "card-270", "englishWord": "Suitcase" },
  { "id": "card-271", "englishWord": "Painter" },
  { "id": "card-272", "englishWord": "Mechanic" },
  { "id": "card-273", "englishWord": "Plumber" },
  { "id": "card-274", "englishWord": "Baker" },
  { "id": "card-275", "englishWord": "Pilot" },
  { "id": "card-276", "englishWord": "Dentist" },
  { "id": "card-277", "englishWord": "Electrician" },
  { "id": "card-278", "englishWord": "Chef" },
  { "id": "card-279", "englishWord": "Librarian" },
  { "id": "card-280", "englishWord": "Scientist" },
  { "id": "card-281", "englishWord": "Waiter" },
  { "id": "card-282", "englishWord": "Receptionist" },
  { "id": "card-283", "englishWord": "Musician" },
  { "id": "card-284", "englishWord": "Farmer" },
  { "id": "card-285", "englishWord": "Cleaner" },
  { "id": "card-286", "englishWord": "Cashier" },
  { "id": "card-287", "englishWord": "Firefighter" },
  { "id": "card-288", "englishWord": "Police officer" },
  { "id": "card-289", "englishWord": "Coach" },
  { "id": "card-290", "englishWord": "Boss" },
  { "id": "card-291", "englishWord": "Colleague" },
  { "id": "card-292", "englishWord": "Delivery" },
  { "id": "card-293", "englishWord": "Emergency" },
  { "id": "card-294", "englishWord": "Schedule" },
  { "id": "card-295", "englishWord": "Traffic" },
  { "id": "card-296", "englishWord": "Accident" },
  { "id": "card-297", "englishWord": "Visit" },
  { "id": "card-298", "englishWord": "Gift" },
  { "id": "card-299", "englishWord": "Text-message" },
  { "id": "card-300", "englishWord": "Invitation" }
];

// Clase para logging
class Logger {
  constructor(logFile) {
    this.logFile = logFile;
    this.startTime = new Date();
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type}] ${message}`;
    
    console.log(logMessage);
    
    // Escribir al archivo de log
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  error(message) {
    this.log(message, 'ERROR');
  }

  success(message) {
    this.log(message, 'SUCCESS');
  }

  warning(message) {
    this.log(message, 'WARNING');
  }
}

// Función para hacer pausa entre requests
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para descargar una imagen con reintentos
function downloadImage(url, filepath, retries = 0) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
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
        fs.unlink(filepath, () => {}); // Eliminar archivo parcial
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Función para buscar imagen en Pexels con reintentos
async function searchImageOnPexels(query, retries = 0) {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
    
    const options = {
      headers: {
        'Authorization': PEXELS_API_KEY,
        'User-Agent': 'Flashcard-Image-Downloader/1.0'
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
            // Usar imagen mediana (medium) o pequeña (small) si está disponible
            const photo = response.photos[0];
            const imageUrl = photo.src.medium || photo.src.small || photo.src.original;
            resolve(imageUrl);
          } else {
            reject(new Error(`No se encontraron imágenes para: ${query}`));
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

// Función para procesar una palabra con reintentos
async function processWord(flashcard, logger) {
  const word = flashcard.englishWord.toLowerCase();
  const filename = `${word}.jpg`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  logger.log(`Procesando: ${word} (${flashcard.id})`);
  
  try {
    // Verificar si la imagen ya existe
    if (fs.existsSync(filepath)) {
      logger.warning(`${filename} ya existe, pero se reemplazará...`);
      // No saltamos, continuamos para reemplazar la imagen
    }
    
    // Buscar imagen en Pexels con reintentos
    let imageUrl;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        logger.log(`  🔍 Buscando imagen para "${word}" (intento ${attempt}/${MAX_RETRIES})...`);
        imageUrl = await searchImageOnPexels(word);
        break;
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          throw error;
        }
        logger.warning(`  ⚠️ Intento ${attempt} falló, reintentando en 2 segundos...`);
        await sleep(2000);
      }
    }
    
    // Descargar imagen con reintentos
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        logger.log(`  📥 Descargando imagen (intento ${attempt}/${MAX_RETRIES})...`);
        await downloadImage(imageUrl, filepath);
        break;
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          throw error;
        }
        logger.warning(`  ⚠️ Descarga falló, reintentando en 2 segundos...`);
        await sleep(2000);
      }
    }
    
    logger.success(`${filename} descargado exitosamente`);
    return { success: true, skipped: false };
    
  } catch (error) {
    logger.error(`Error procesando "${word}": ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Función principal
async function main() {
  const logger = new Logger(LOG_FILE);
  
  logger.log('🚀 Iniciando descarga de imágenes específicas...');
  logger.log(`📁 Directorio de salida: ${OUTPUT_DIR}`);
  logger.log(`📊 Flashcards a cambiar: ${flashcards.length}`);
  logger.log(`📋 Lista: ${flashcards.map(f => f.englishWord).join(', ')}`);
  logger.log(`⏱️  Delay entre requests: ${DELAY_BETWEEN_REQUESTS}ms`);
  logger.log(`🔄 Máximo reintentos: ${MAX_RETRIES}`);
  logger.log('');
  
  // Crear directorio si no existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    logger.log(`📁 Directorio creado: ${OUTPUT_DIR}`);
  }
  
  let successCount = 0;
  let errorCount = 0;
  const startTime = Date.now();
  
  // Procesar todas las flashcards
  for (let i = 0; i < flashcards.length; i++) {
    const flashcard = flashcards[i];
    const result = await processWord(flashcard, logger);
    
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Mostrar progreso
    const progress = ((i + 1) / flashcards.length * 100).toFixed(1);
    logger.log(`📈 Progreso: ${i + 1}/${flashcards.length} (${progress}%)`);
    
    // Pausa entre requests para evitar rate limiting
    if (i < flashcards.length - 1) {
      logger.log(`  ⏳ Esperando ${DELAY_BETWEEN_REQUESTS}ms...`);
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
    
    logger.log('');
  }
  
  const endTime = Date.now();
  const totalTime = ((endTime - startTime) / 1000 / 60).toFixed(2);
  
  // Resumen final
  logger.log('📊 RESUMEN FINAL:');
  logger.log(`✅ Descargadas exitosamente: ${successCount}`);
  logger.log(`❌ Errores: ${errorCount}`);
  logger.log(`📁 Total procesadas: ${successCount + errorCount}`);
  logger.log(`⏱️  Tiempo total: ${totalTime} minutos`);
  logger.log(`📄 Log guardado en: ${LOG_FILE}`);
  
  if (errorCount > 0) {
    logger.warning('⚠️  Algunas imágenes no se pudieron descargar. Revisa los errores arriba.');
  } else {
    logger.success('🎉 ¡Todas las imágenes se procesaron exitosamente!');
  }
  
  logger.log('\n💡 Para cambiar más imágenes:');
  logger.log('1. Edita la lista "flashcards" en este script');
  logger.log('2. Ejecuta el script nuevamente');
  logger.log('3. O coloca manualmente las imágenes en el directorio de flashcards');
}

// Manejo de errores global
process.on('unhandledRejection', (reason, promise) => {
  console.error('Error no manejado:', reason);
  process.exit(1);
});

// Verificar API key
if (PEXELS_API_KEY === 'TU_API_KEY_AQUI') {
  console.error('❌ ERROR: Debes configurar tu API key de Pexels en la variable PEXELS_API_KEY');
  console.log('📝 Para obtener una API key gratuita:');
  console.log('   1. Ve a https://www.pexels.com/api/');
  console.log('   2. Regístrate para una cuenta gratuita');
  console.log('   3. Obtén tu API key');
  console.log('   4. Reemplaza "TU_API_KEY_AQUI" en el script');
  process.exit(1);
}

// Ejecutar script
main().catch(console.error); 