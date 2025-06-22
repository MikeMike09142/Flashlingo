import fs from 'fs';
import path from 'path';

const FLASHCARDS_DIR = 'public/images/flashcards';

// Función para obtener todas las imágenes en el directorio
function getImageFiles() {
  try {
    const files = fs.readdirSync(FLASHCARDS_DIR);
    return files.filter(file => file.endsWith('.jpg'));
  } catch (error) {
    console.error('Error leyendo el directorio:', error);
    return [];
  }
}

// Función para eliminar archivo
function deleteFile(filename) {
  const filepath = path.join(FLASHCARDS_DIR, filename);
  try {
    fs.unlinkSync(filepath);
    console.log(`🗑️  Eliminado: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Error eliminando ${filename}:`, error.message);
    return false;
  }
}

// Función principal
function main() {
  console.log('🔍 Buscando imágenes duplicadas...\n');
  
  const imageFiles = getImageFiles();
  console.log(`📁 Total de imágenes encontradas: ${imageFiles.length}`);
  
  // Lista de archivos a eliminar (duplicados identificados)
  const filesToDelete = [
    'ceiling fan.jpg',  // Ya eliminado manualmente
    // Agregar otros duplicados si los encuentras
  ];
  
  console.log('\n📋 Archivos marcados para eliminación:');
  filesToDelete.forEach(file => {
    console.log(`  - ${file}`);
  });
  
  console.log('\n🗑️  Eliminando archivos...');
  let deletedCount = 0;
  
  filesToDelete.forEach(filename => {
    if (fs.existsSync(path.join(FLASHCARDS_DIR, filename))) {
      if (deleteFile(filename)) {
        deletedCount++;
      }
    } else {
      console.log(`⚠️  Archivo no encontrado: ${filename}`);
    }
  });
  
  console.log(`\n📊 Resumen:`);
  console.log(`✅ Archivos eliminados: ${deletedCount}`);
  console.log(`📁 Imágenes restantes: ${getImageFiles().length}`);
}

// Ejecutar script
main(); 