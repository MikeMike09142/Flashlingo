import fs from 'fs';

// Mapeo de categorías antiguas a nuevas
const categoryMapping = {
  // Objetos (incluye furniture, sports, body, colors, numbers)
  'objects': 'objects',
  'furniture': 'objects',
  'sports': 'objects',
  'body': 'objects',
  'colors': 'objects',
  'numbers': 'objects',
  
  // Lugares (incluye time, weather)
  'places': 'places',
  'time': 'places',
  'weather': 'places',
  
  // Animales
  'animals': 'animals',
  
  // Comida (incluye fruits, food)
  'fruits': 'food',
  'food': 'food',
  
  // Transporte
  'transport': 'transport',
  
  // Personas (incluye people, professions, family)
  'people': 'people',
  'professions': 'people',
  'family': 'people',
  
  // Naturaleza
  'nature': 'nature',
  
  // Ropa
  'clothing': 'clothing',
  
  // Verbos
  'verbs': 'verbs',
  
  // Emociones (incluye adjectives, adverbs, interjections)
  'emotions': 'emotions',
  'adjectives': 'emotions',
  'adverbs': 'emotions',
  'interjections': 'emotions',
  
  // Negocios
  'business': 'business',
  
  // Gramática (incluye conjunctions, prepositions)
  'grammar': 'grammar',
  'conjunctions': 'grammar',
  'prepositions': 'grammar'
};

// Función para actualizar las categorías en las flashcards
function updateFlashcardCategories() {
  try {
    const appContextPath = 'src/context/AppContext.tsx';
    let content = fs.readFileSync(appContextPath, 'utf8');
    
    // Buscar y reemplazar las categorías en las flashcards
    Object.entries(categoryMapping).forEach(([oldCategory, newCategory]) => {
      if (oldCategory !== newCategory) {
        // Reemplazar en categoryIds arrays
        const regex = new RegExp(`"categoryIds":\\s*\\[\\s*"${oldCategory}"\\s*\\]`, 'g');
        content = content.replace(regex, `"categoryIds": ["${newCategory}"]`);
        
        // Reemplazar en arrays con múltiples categorías
        const regex2 = new RegExp(`"${oldCategory}"`, 'g');
        content = content.replace(regex2, `"${newCategory}"`);
      }
    });
    
    // Escribir el archivo actualizado
    fs.writeFileSync(appContextPath, content, 'utf8');
    
    console.log('✅ Categorías actualizadas correctamente');
    console.log('📋 Mapeo aplicado:');
    Object.entries(categoryMapping).forEach(([oldCat, newCat]) => {
      if (oldCat !== newCat) {
        console.log(`   ${oldCat} → ${newCat}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error actualizando categorías:', error.message);
  }
}

// Función para mostrar estadísticas de las categorías
function showCategoryStats() {
  try {
    const appContextPath = 'src/context/AppContext.tsx';
    const content = fs.readFileSync(appContextPath, 'utf8');
    
    const lines = content.split('\n');
    const categoryCounts = {};
    
    for (const line of lines) {
      const match = line.match(/"categoryIds":\s*\[([^\]]+)\]/);
      if (match) {
        const categories = match[1].match(/"([^"]+)"/g);
        if (categories) {
          categories.forEach(cat => {
            const category = cat.replace(/"/g, '');
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
        }
      }
    }
    
    console.log('\n📊 ESTADÍSTICAS DE CATEGORÍAS:');
    console.log('=' .repeat(40));
    Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} flashcards`);
      });
    
  } catch (error) {
    console.error('❌ Error mostrando estadísticas:', error.message);
  }
}

// Ejecutar las funciones
console.log('🔄 Actualizando categorías de flashcards...');
updateFlashcardCategories();
showCategoryStats(); 