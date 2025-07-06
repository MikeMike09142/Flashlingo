import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = 'public/images/flashcards';

// Lista de archivos .webp problemáticos
const problematicWebpFiles = [
  'camera.webp',
  'caretaker.webp', 
  'friend.webp',
  'judge.webp',
  'june.webp',
  'lamp.webp',
  'rain.webp',
  'scared.webp',
  'table.webp',
  'verb-come.webp',
  'verb-do.webp',
  'verb-get.webp',
  'verb-hear.webp',
  'verb-know.webp',
  'verb-need.webp',
  'volunteer.webp',
  'water.webp',
  'witness.webp'
];

async function fixWebpFiles() {
  console.log('🔧 Iniciando corrección de archivos .webp problemáticos...');
  
  let successCount = 0;
  let errorCount = 0;

  for (const webpFile of problematicWebpFiles) {
    const webpPath = path.join(IMAGES_DIR, webpFile);
    const jpgPath = path.join(IMAGES_DIR, webpFile.replace('.webp', '.jpg'));
    
    try {
      console.log(`🔧 Procesando ${webpFile}...`);
      
      // Verificar si el archivo .webp existe
      if (!fs.existsSync(webpPath)) {
        console.log(`⚠️  ${webpFile} no existe, saltando...`);
        continue;
      }

      // Convertir .webp a JPEG optimizado
      await sharp(webpPath)
        .resize({ width: 900, withoutEnlargement: true })
        .jpeg({ quality: 70 })
        .toFile(jpgPath + '.tmp');

      // Reemplazar el archivo .jpg existente
      fs.renameSync(jpgPath + '.tmp', jpgPath);
      
      // Eliminar el archivo .webp problemático
      fs.unlinkSync(webpPath);
      
      console.log(`✅ ${webpFile} convertido y optimizado exitosamente.`);
      successCount++;
      
    } catch (error) {
      console.log(`❌ Error procesando ${webpFile}: ${error.message}`);
      errorCount++;
      
      // Limpiar archivo temporal si existe
      if (fs.existsSync(jpgPath + '.tmp')) {
        try {
          fs.unlinkSync(jpgPath + '.tmp');
        } catch (cleanupError) {
          console.log(`⚠️  No se pudo limpiar archivo temporal para ${webpFile}`);
        }
      }
    }
  }
  
  console.log('\n📊 Resumen de corrección:');
  console.log(`✅ Archivos corregidos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
}

// Ejecutar el script
fixWebpFiles(); 