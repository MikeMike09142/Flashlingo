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

// Verificar imágenes faltantes
function checkMissingImages() {
  console.log('🔍 Verificando imágenes faltantes...');
  
  const usedImages = extractImageUrlsFromContext();
  const allImages = getAllImagesInFolder();
  
  console.log(`📊 Flashcards en la app: ${usedImages.length}`);
  console.log(`📊 Imágenes en carpeta: ${allImages.length}`);
  
  const missingImages = usedImages.filter(image => !allImages.includes(image));
  const extraImages = allImages.filter(image => !usedImages.includes(image));
  
  console.log(`📊 Imágenes faltantes: ${missingImages.length}`);
  console.log(`📊 Imágenes extra: ${extraImages.length}`);
  
  if (missingImages.length > 0) {
    console.log('\n📋 Imágenes faltantes (flashcards sin imagen):');
    missingImages.forEach(image => console.log(`   - ${image}`));
  }
  
  if (extraImages.length > 0) {
    console.log('\n📋 Imágenes extra (no usadas en flashcards):');
    extraImages.forEach(image => console.log(`   - ${image}`));
  }
  
  if (missingImages.length === 0 && extraImages.length === 0) {
    console.log('\n✅ Perfecto: Todas las flashcards tienen imagen y no hay imágenes extra');
  }
  
  return { missingImages, extraImages };
}

// Ejecutar el script
checkMissingImages(); 