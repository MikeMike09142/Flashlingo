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

    let successCount = 0;
    let errorCount = 0;
    const failedFiles = [];

    // Procesar cada imagen individualmente para manejar errores
    for (const file of imageFiles) {
      const filePath = path.join(IMAGES_DIR, file);
      const tempPath = filePath + '.tmp';
      
      try {
        console.log(`🔧 Procesando ${file}...`);
        
        // Verificar si el archivo existe y es accesible
        if (!fs.existsSync(filePath)) {
          console.log(`⚠️  ${file} no existe, saltando...`);
          continue;
        }

        // Intentar optimizar la imagen
        await sharp(filePath)
          .resize({ width: 900, withoutEnlargement: true })
          .jpeg({ quality: 70 })
          .toFile(tempPath);

        // Intentar reemplazar el archivo original
        try {
          fs.renameSync(tempPath, filePath);
          console.log(`✅ ${file} optimizada exitosamente.`);
          successCount++;
        } catch (renameError) {
          // Si falla el rename, eliminar el archivo temporal
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
          throw renameError;
        }
        
      } catch (error) {
        console.log(`❌ Error procesando ${file}: ${error.message}`);
        errorCount++;
        failedFiles.push(file);
        
        // Limpiar archivo temporal si existe
        if (fs.existsSync(tempPath)) {
          try {
            fs.unlinkSync(tempPath);
          } catch (cleanupError) {
            console.log(`⚠️  No se pudo limpiar archivo temporal para ${file}`);
          }
        }
        
        // Continuar con el siguiente archivo en lugar de detener todo el proceso
        continue;
      }
    }
    
    // Resumen final
    console.log('\n📊 Resumen de optimización:');
    console.log(`✅ Imágenes optimizadas exitosamente: ${successCount}`);
    console.log(`❌ Imágenes con errores: ${errorCount}`);
    
    if (failedFiles.length > 0) {
      console.log('\n📋 Archivos que fallaron:');
      failedFiles.forEach(file => console.log(`   - ${file}`));
      console.log('\n💡 Sugerencias:');
      console.log('   - Cierra todos los navegadores y editores de imágenes');
      console.log('   - Verifica que no haya procesos usando estos archivos');
      console.log('   - Elimina manualmente los archivos problemáticos');
    }
    
  } catch (error) {
    console.error('❌ Error general durante la optimización:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
optimizeAllImages(); 