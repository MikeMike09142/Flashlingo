import fs from 'fs';
import path from 'path';

// Función para leer el archivo AppContext.tsx y extraer las flashcards
function extractFlashcards() {
  try {
    const appContextPath = 'src/context/AppContext.tsx';
    const content = fs.readFileSync(appContextPath, 'utf8');
    
    // Buscar el array masterFlashcards
    const startIndex = content.indexOf('const masterFlashcards:');
    if (startIndex === -1) {
      throw new Error('No se encontró el array masterFlashcards');
    }
    
    // Extraer el contenido del array
    let braceCount = 0;
    let arrayStart = -1;
    let arrayEnd = -1;
    
    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === '[' && arrayStart === -1) {
        arrayStart = i;
        braceCount = 1;
      } else if (content[i] === '[' && arrayStart !== -1) {
        braceCount++;
      } else if (content[i] === ']' && arrayStart !== -1) {
        braceCount--;
        if (braceCount === 0) {
          arrayEnd = i;
          break;
        }
      }
    }
    
    if (arrayStart === -1 || arrayEnd === -1) {
      throw new Error('No se pudo extraer el array masterFlashcards');
    }
    
    const arrayContent = content.substring(arrayStart, arrayEnd + 1);
    
    // Limpiar el contenido para hacerlo JavaScript válido
    let cleanContent = arrayContent
      .replace(/const masterFlashcards:\s*Omit<Flashcard,\s*'studyProgress'\s*\|\s*'created_at'>\[\]\s*=\s*/, '')
      .replace(/;\s*$/, '');
    
    // Convertir las comillas dobles a comillas simples para las claves
    cleanContent = cleanContent.replace(/"([^"]+)":/g, "'$1':");
    
    // Evaluar el array
    const flashcardsData = eval(cleanContent);
    return flashcardsData;
    
  } catch (error) {
    console.error('Error leyendo las flashcards:', error.message);
    console.error('Detalles del error:', error);
    return [];
  }
}

// Función para analizar las flashcards
function analyzeFlashcards(flashcards) {
  const stats = {
    total: flashcards.length,
    uniqueWords: new Set(),
    categories: {},
    levels: {},
    favorites: 0,
    withImages: 0,
    withoutImages: 0
  };
  
  flashcards.forEach(card => {
    // Contar palabras únicas (englishWord)
    stats.uniqueWords.add(card.englishWord);
    
    // Contar por categorías
    if (card.categoryIds && Array.isArray(card.categoryIds)) {
      card.categoryIds.forEach(categoryId => {
        stats.categories[categoryId] = (stats.categories[categoryId] || 0) + 1;
      });
    }
    
    // Contar por niveles
    if (card.level) {
      stats.levels[card.level] = (stats.levels[card.level] || 0) + 1;
    }
    
    // Contar favoritos
    if (card.isFavorite) {
      stats.favorites++;
    }
    
    // Contar con/sin imágenes
    if (card.imageUrl && card.imageUrl !== '') {
      stats.withImages++;
    } else {
      stats.withoutImages++;
    }
  });
  
  return stats;
}

// Función para mostrar las estadísticas
function displayStats(stats) {
  console.log('📊 ESTADÍSTICAS DE FLASHCARDS');
  console.log('=' .repeat(50));
  
  console.log(`\n📝 TOTAL DE FLASHCARDS: ${stats.total}`);
  console.log(`🔤 PALABRAS ÚNICAS: ${stats.uniqueWords.size}`);
  console.log(`⭐ FAVORITOS: ${stats.favorites}`);
  console.log(`🖼️  CON IMÁGENES: ${stats.withImages}`);
  console.log(`❌ SIN IMÁGENES: ${stats.withoutImages}`);
  
  // Mostrar por niveles
  console.log('\n📚 POR NIVELES:');
  Object.entries(stats.levels).forEach(([level, count]) => {
    const percentage = ((count / stats.total) * 100).toFixed(1);
    console.log(`   ${level}: ${count} (${percentage}%)`);
  });
  
  // Mostrar por categorías
  console.log('\n🏷️  POR CATEGORÍAS:');
  const sortedCategories = Object.entries(stats.categories)
    .sort(([,a], [,b]) => b - a);
  
  sortedCategories.forEach(([category, count]) => {
    const percentage = ((count / stats.total) * 100).toFixed(1);
    console.log(`   ${category}: ${count} (${percentage}%)`);
  });
  
  // Mostrar algunas palabras de ejemplo
  console.log('\n💡 EJEMPLOS DE PALABRAS:');
  const wordsArray = Array.from(stats.uniqueWords);
  const examples = wordsArray.slice(0, 10).join(', ');
  console.log(`   ${examples}${wordsArray.length > 10 ? '...' : ''}`);
  
  console.log('\n' + '=' .repeat(50));
}

// Función para buscar una palabra específica
function searchWord(flashcards, searchTerm) {
  const results = flashcards.filter(card => 
    card.englishWord.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.spanishTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.frenchTranslation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (results.length === 0) {
    console.log(`❌ No se encontraron flashcards con "${searchTerm}"`);
    return;
  }
  
  console.log(`\n🔍 RESULTADOS PARA "${searchTerm}":`);
  console.log('=' .repeat(50));
  
  results.forEach((card, index) => {
    console.log(`\n${index + 1}. ${card.englishWord}`);
    console.log(`   Español: ${card.spanishTranslation}`);
    console.log(`   Francés: ${card.frenchTranslation}`);
    console.log(`   Categorías: ${card.categoryIds.join(', ')}`);
    console.log(`   Nivel: ${card.level}`);
    console.log(`   Favorito: ${card.isFavorite ? '⭐' : '❌'}`);
    console.log(`   Imagen: ${card.imageUrl ? '✅' : '❌'}`);
  });
}

// Función principal
function main() {
  const flashcards = extractFlashcards();
  
  if (flashcards.length === 0) {
    console.error('❌ No se pudieron cargar las flashcards');
    process.exit(1);
  }
  
  const stats = analyzeFlashcards(flashcards);
  displayStats(stats);
  
  // Si se proporciona un término de búsqueda como argumento
  const searchTerm = process.argv[2];
  if (searchTerm) {
    searchWord(flashcards, searchTerm);
  }
}

// Ejecutar el script
main(); 