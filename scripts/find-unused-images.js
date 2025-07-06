import fs from 'fs';
import path from 'path';

const IMAGES_DIR = 'public/images/flashcards';

// Extraer las rutas de imágenes del archivo AppContext.tsx
function extractImageUrlsFromContext() {
  try {
    const contextContent = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
    const imageUrlMatches = contextContent.match(/imageUrl":\s*"\/images\/flashcards\/([^"]+)"/g);
    
    if (!imageUrlMatches) {
      console.log('❌ No se encontraron rutas de imágenes en AppContext.tsx');
      return [];
    }
    
    const imageFiles = imageUrlMatches.map(match => {
      const fileName = match.match(/\/([^"]+)"$/)[1];
      return fileName;
    });
    
    return imageFiles;
  } catch (error) {
    console.error('❌ Error leyendo AppContext.tsx:', error.message);
    return [];
  }
}

// Obtener todas las imágenes en la carpeta
function getAllImagesInFolder() {
  try {
    const files = fs.readdirSync(IMAGES_DIR);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
  } catch (error) {
    console.error('❌ Error leyendo carpeta de imágenes:', error.message);
    return [];
  }
}

// Encontrar imágenes no utilizadas
function findUnusedImages() {
  console.log('🔍 Buscando imágenes no utilizadas...');
  
  const usedImages = extractImageUrlsFromContext();
  const allImages = getAllImagesInFolder();
  
  console.log(`📊 Imágenes utilizadas en la app: ${usedImages.length}`);
  console.log(`📊 Total de imágenes en carpeta: ${allImages.length}`);
  
  const unusedImages = allImages.filter(image => !usedImages.includes(image));
  
  console.log(`📊 Imágenes no utilizadas: ${unusedImages.length}`);
  
  if (unusedImages.length > 0) {
    console.log('\n📋 Lista de imágenes no utilizadas:');
    unusedImages.forEach(image => console.log(`   - ${image}`));
    
    console.log('\n💡 Sugerencias:');
    console.log('   - Estas imágenes pueden ser eliminadas para reducir el tamaño del proyecto');
    console.log('   - O pueden ser agregadas como nuevas flashcards en AppContext.tsx');
  } else {
    console.log('\n✅ Todas las imágenes están siendo utilizadas en la app');
  }
  
  return unusedImages;
}

// Ejecutar el script
findUnusedImages(); 