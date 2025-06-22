import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const IMAGES_DIR = 'public/images/flashcards';

async function optimizeAllImages() {
  console.log('🔄 Iniciando optimización de todas las imágenes...');
  console.log(`📁 Carpeta: ${IMAGES_DIR}`);
  
  // Verificar que la carpeta existe
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ La carpeta ${IMAGES_DIR} no existe`);
    process.exit(1);
  }

  try {
    // Contar imágenes antes de optimizar
    const files = fs.readdirSync(IMAGES_DIR);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
    
    console.log(`📊 Encontradas ${imageFiles.length} imágenes para optimizar`);
    
    if (imageFiles.length === 0) {
      console.log('ℹ️  No se encontraron imágenes para optimizar');
      return;
    }

    // Optimizar todas las imágenes
    const command = `imagemin ${IMAGES_DIR}/* --out-dir=${IMAGES_DIR} --plugin=jpegtran --plugin=pngquant`;
    
    console.log('⏳ Optimizando imágenes...');
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.log(`⚠️  Advertencias: ${stderr}`);
    }
    
    console.log('✅ ¡Optimización completada!');
    console.log('📋 Imágenes optimizadas:');
    imageFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
    
  } catch (error) {
    console.error('❌ Error durante la optimización:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
optimizeAllImages(); 