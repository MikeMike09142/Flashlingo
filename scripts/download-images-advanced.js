const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuración
const PEXELS_API_KEY = '2ErEjL9aYqR46iwHbmn6ZDFS9X9n0DXazOqFxnXPwRlDmE3tBKEIgpXW'; // API key actualizada
const OUTPUT_DIR = 'C:\\Users\\migue\\Desktop\\project\\public\\images\\flashcards';
const DELAY_BETWEEN_REQUESTS = 1000; // 1 segundo entre requests
const MAX_RETRIES = 3; // Máximo número de reintentos por imagen
const LOG_FILE = 'download-log.txt'; // Archivo de log

// Datos de las flashcards desde el AppContext (desde card-101 hasta el final)
const flashcards = [
  { "id": "card-101", "englishWord": "Cloud" },
  { "id": "card-102", "englishWord": "Desk" },
  { "id": "card-103", "englishWord": "Wallet" },
  { "id": "card-104", "englishWord": "Fan" },
  { "id": "card-105", "englishWord": "Backpack" },
  { "id": "card-106", "englishWord": "Stairs" },
  { "id": "card-107", "englishWord": "Road" },
  { "id": "card-108", "englishWord": "Bridge" },
  { "id": "card-109", "englishWord": "Moon" },
  { "id": "card-110", "englishWord": "Star" },
  { "id": "card-111", "englishWord": "Rock" },
  { "id": "card-112", "englishWord": "Fire" },
  { "id": "card-113", "englishWord": "Desk" },
  { "id": "card-114", "englishWord": "Pan" },
  { "id": "card-115", "englishWord": "Fork" },
  { "id": "card-116", "englishWord": "Knife" },
  { "id": "card-117", "englishWord": "Spoon" },
  { "id": "card-118", "englishWord": "Plate" },
  { "id": "card-119", "englishWord": "Napkin" },
  { "id": "card-120", "englishWord": "Horse" },
  { "id": "card-121", "englishWord": "Sofa" },
  { "id": "card-122", "englishWord": "Curtain" },
  { "id": "card-123", "englishWord": "Ceiling" },
  { "id": "card-124", "englishWord": "Wall" },
  { "id": "card-125", "englishWord": "Floor" },
  { "id": "card-126", "englishWord": "Ceiling fan" },
  { "id": "card-127", "englishWord": "Light" },
  { "id": "card-128", "englishWord": "Bottle" },
  { "id": "card-129", "englishWord": "Toothpaste" },
  { "id": "card-130", "englishWord": "Soap" },
  { "id": "card-131", "englishWord": "Office" },
  { "id": "card-132", "englishWord": "Job" },
  { "id": "card-133", "englishWord": "Boss" },
  { "id": "card-134", "englishWord": "Money" },
  { "id": "card-135", "englishWord": "Meeting" },
  { "id": "card-136", "englishWord": "Email" },
  { "id": "card-137", "englishWord": "Phonecall" },
  { "id": "card-138", "englishWord": "Rabbit" },
  { "id": "card-139", "englishWord": "Paper" },
  { "id": "card-140", "englishWord": "Cow" },
  { "id": "card-141", "englishWord": "Team" },
  { "id": "card-142", "englishWord": "Sale" },
  { "id": "card-143", "englishWord": "Client" },
  { "id": "card-144", "englishWord": "Invoice" },
  { "id": "card-145", "englishWord": "Report" },
  { "id": "card-146", "englishWord": "Happy" },
  { "id": "card-147", "englishWord": "Sad" },
  { "id": "card-148", "englishWord": "Angry" },
  { "id": "card-149", "englishWord": "Excited" },
  { "id": "card-150", "englishWord": "Scared" },
  { "id": "card-151", "englishWord": "Tired" },
  { "id": "card-152", "englishWord": "Calm" },
  { "id": "card-153", "englishWord": "Nervous" },
  { "id": "card-154", "englishWord": "Bored" },
  { "id": "card-155", "englishWord": "Lonely" },
  { "id": "card-156", "englishWord": "Surprised" },
  { "id": "card-157", "englishWord": "Confused" },
  { "id": "card-158", "englishWord": "Proud" },
  { "id": "card-159", "englishWord": "Shy" },
  { "id": "card-160", "englishWord": "Friendly" },
  { "id": "card-161", "englishWord": "January" },
  { "id": "card-162", "englishWord": "February" },
  { "id": "card-163", "englishWord": "March" },
  { "id": "card-164", "englishWord": "April" },
  { "id": "card-165", "englishWord": "May" },
  { "id": "card-166", "englishWord": "June" },
  { "id": "card-167", "englishWord": "July" },
  { "id": "card-168", "englishWord": "August" },
  { "id": "card-169", "englishWord": "September" },
  { "id": "card-170", "englishWord": "October" },
  { "id": "card-171", "englishWord": "November" },
  { "id": "card-172", "englishWord": "December" },
  { "id": "card-173", "englishWord": "Festival" },
  { "id": "card-174", "englishWord": "Honey" },
  { "id": "card-175", "englishWord": "Lantern" },
  { "id": "card-176", "englishWord": "Hour" },
  { "id": "card-177", "englishWord": "Minute" },
  { "id": "card-178", "englishWord": "Second" },
  { "id": "card-179", "englishWord": "Morning" },
  { "id": "card-180", "englishWord": "Afternoon" },
  { "id": "card-181", "englishWord": "Evening" },
  { "id": "card-182", "englishWord": "Night" },
  { "id": "card-183", "englishWord": "Spring" },
  { "id": "card-184", "englishWord": "Summer" },
  { "id": "card-185", "englishWord": "Autumn" },
  { "id": "card-186", "englishWord": "Winter" },
  { "id": "card-187", "englishWord": "Today" },
  { "id": "card-188", "englishWord": "Tomorrow" },
  { "id": "card-189", "englishWord": "Yesterday" },
  { "id": "card-190", "englishWord": "Week" },
  { "id": "card-191", "englishWord": "Windowpane" },
  { "id": "card-192", "englishWord": "Shadow" },
  { "id": "card-193", "englishWord": "Fence" },
  { "id": "card-194", "englishWord": "Bell" },
  { "id": "card-195", "englishWord": "Puzzle" },
  { "id": "card-196", "englishWord": "Farm" },
  { "id": "card-197", "englishWord": "Feather" },
  { "id": "card-198", "englishWord": "Button" },
  { "id": "card-199", "englishWord": "Lantern" },
  { "id": "card-200", "englishWord": "Bench" }
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
  logger.log(`📊 Flashcards a cambiar: ${flashcardsToChange.length}`);
  logger.log(`📋 Lista: ${flashcardsToChange.map(f => f.englishWord).join(', ')}`);
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
  
  // Procesar solo las flashcards que quieres cambiar
  for (let i = 0; i < flashcardsToChange.length; i++) {
    const flashcard = flashcardsToChange[i];
    const result = await processWord(flashcard, logger);
    
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Mostrar progreso
    const progress = ((i + 1) / flashcardsToChange.length * 100).toFixed(1);
    logger.log(`📈 Progreso: ${i + 1}/${flashcardsToChange.length} (${progress}%)`);
    
    // Pausa entre requests para evitar rate limiting
    if (i < flashcardsToChange.length - 1) {
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
  logger.log('1. Edita la lista "flashcardsToChange" en este script');
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