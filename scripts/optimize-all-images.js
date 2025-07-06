import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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

    // Eliminar la optimización con imagemin, solo usar sharp
    // Forzar compresión y redimensionado de todas las imágenes
    for (const file of imageFiles) {
      const filePath = path.join(IMAGES_DIR, file);
      console.log(`🔧 Forzando compresión y redimensionado de ${file}...`);
      await sharp(filePath)
        .resize({ width: 900, withoutEnlargement: true })
        .jpeg({ quality: 70 })
        .toFile(filePath + '.tmp');
      fs.renameSync(filePath + '.tmp', filePath);
      console.log(`✅ ${file} comprimida y redimensionada.`);
    }
    
  } catch (error) {
    console.error('❌ Error durante la optimización:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
optimizeAllImages(); 