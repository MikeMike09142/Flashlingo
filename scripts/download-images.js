import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const PEXELS_API_KEY = '2ErEjL9aYqR46iwHbmn6ZDFS9X9n0DXazOqFxnXPwRlDmE3tBKEIgpXW'; // Reemplaza con tu API key de Pexels
const OUTPUT_DIR = 'C:\\Users\\migue\\Desktop\\project\\public\\images\\flashcards';

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

// Función para hacer pausa entre requests para evitar rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para descargar una imagen
function downloadImage(url, filepath) {
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

// Función para buscar imagen en Pexels
async function searchImageOnPexels(query) {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;
    
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

// Función principal para procesar una palabra
async function processWord(flashcard) {
  const word = flashcard.englishWord.toLowerCase();
  const filename = `${word}.jpg`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  console.log(`Procesando: ${word} (${flashcard.id})`);
  
  try {
    // Verificar si la imagen ya existe
    if (fs.existsSync(filepath)) {
      console.log(`  ✅ ${filename} ya existe, saltando...`);
      return { success: true, skipped: true };
    }
    
    // Buscar imagen en Pexels
    console.log(`  🔍 Buscando imagen para "${word}"...`);
    const imageUrl = await searchImageOnPexels(word);
    
    // Descargar imagen
    console.log(`  📥 Descargando imagen...`);
    await downloadImage(imageUrl, filepath);
    
    console.log(`  ✅ ${filename} descargado exitosamente`);
    return { success: true, skipped: false };
    
  } catch (error) {
    console.error(`  ❌ Error procesando "${word}": ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando descarga de imágenes de Pexels...');
  console.log(`📁 Directorio de salida: ${OUTPUT_DIR}`);
  console.log(`📊 Total de flashcards a procesar: ${flashcards.length}`);
  console.log('');
  
  // Crear directorio si no existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Directorio creado: ${OUTPUT_DIR}`);
  }
  
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  
  // Procesar cada palabra con pausa entre requests
  for (let i = 0; i < flashcards.length; i++) {
    const flashcard = flashcards[i];
    const result = await processWord( flashcard);
    
    if (result.success) {
      if (result.skipped) {
        skippedCount++;
      } else {
        successCount++;
      }
    } else {
      errorCount++;
    }
    
    // Pausa entre requests para evitar rate limiting (1 segundo)
    if (i < flashcards.length - 1) {
      console.log('  ⏳ Esperando 1 segundo...');
      await sleep(1000);
    }
    
    console.log('');
  }
  
  // Resumen final
  console.log('📊 RESUMEN FINAL:');
  console.log(`✅ Descargadas exitosamente: ${successCount}`);
  console.log(`⏭️  Saltadas (ya existían): ${skippedCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📁 Total procesadas: ${successCount + skippedCount + errorCount}`);
  
  if (errorCount > 0) {
    console.log('\n⚠️  Algunas imágenes no se pudieron descargar. Revisa los errores arriba.');
  } else {
    console.log('\n🎉 ¡Todas las imágenes se procesaron exitosamente!');
  }
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