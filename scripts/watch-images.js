import chokidar from 'chokidar';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

// Configuración
const IMAGES_DIR = 'public/images/flashcards';
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

// Cola para evitar procesar la misma imagen múltiples veces
const processingQueue = new Set();

// Función para optimizar una imagen específica
async function optimizeImage(imagePath) {
  if (processingQueue.has(imagePath)) {
    console.log(`⏳ ${path.basename(imagePath)} ya está siendo procesada...`);
    return;
  }

  processingQueue.add(imagePath);
  
  try {
    console.log(`🔄 Optimizando: ${path.basename(imagePath)}`);
    
    const ext = path.extname(imagePath).toLowerCase();
    let plugin = '';
    
    if (ext === '.jpg' || ext === '.jpeg') {
      plugin = '--plugin=jpegtran';
    } else if (ext === '.png') {
      plugin = '--plugin=pngquant';
    } else if (ext === '.webp') {
      plugin = '--plugin=webp';
    } else {
      console.log(`❌ Formato no soportado: ${ext}`);
      return;
    }
    
    const command = `imagemin "${imagePath}" --out-dir="${path.dirname(imagePath)}" ${plugin}`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.log(`⚠️  Advertencia: ${stderr}`);
    }
    
    if (stdout) {
      console.log(`✅ Optimizada: ${path.basename(imagePath)}`);
    }
    
  } catch (error) {
    console.error(`❌ Error optimizando ${path.basename(imagePath)}:`, error.message);
  } finally {
    processingQueue.delete(imagePath);
  }
}

// Función para optimizar todas las imágenes existentes
async function optimizeAllImages() {
  console.log('🔄 Optimizando todas las imágenes existentes...');
  
  try {
    const command = `imagemin ${IMAGES_DIR}/* --out-dir=${IMAGES_DIR} --plugin=jpegtran --plugin=pngquant`;
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.log(`⚠️  Advertencias: ${stderr}`);
    }
    
    console.log('✅ Todas las imágenes han sido optimizadas');
    
  } catch (error) {
    console.error('❌ Error optimizando todas las imágenes:', error.message);
  }
}

// Función principal
async function startWatching() {
  console.log('👀 Iniciando monitoreo de imágenes...');
  console.log(`📁 Monitoreando: ${IMAGES_DIR}`);
  console.log('💡 Agrega imágenes a la carpeta y se optimizarán automáticamente');
  console.log('📋 Formatos soportados:', SUPPORTED_FORMATS.join(', '));
  console.log('⏹️  Presiona Ctrl+C para detener\n');

  // Verificar que la carpeta existe
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ La carpeta ${IMAGES_DIR} no existe`);
    process.exit(1);
  }

  // Optimizar imágenes existentes al inicio
  await optimizeAllImages();

  // Configurar el watcher
  const watcher = chokidar.watch(IMAGES_DIR, {
    ignored: /(^|[\/\\])\../, // Ignorar archivos ocultos
    persistent: true,
    ignoreInitial: true // No procesar archivos existentes al inicio
  });

  // Eventos del watcher
  watcher
    .on('add', (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        console.log(`📸 Nueva imagen detectada: ${path.basename(filePath)}`);
        optimizeImage(filePath);
      }
    })
    .on('change', (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        console.log(`📝 Imagen modificada: ${path.basename(filePath)}`);
        optimizeImage(filePath);
      }
    })
    .on('error', (error) => {
      console.error('❌ Error en el watcher:', error);
    });

  // Manejar cierre del proceso
  process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo monitoreo...');
    watcher.close();
    process.exit(0);
  });
}

// Ejecutar el script
startWatching().catch(console.error); 