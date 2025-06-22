import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo AppContext.tsx
const appContextPath = path.join(__dirname, '../src/context/AppContext.tsx');
let content = fs.readFileSync(appContextPath, 'utf8');

// Estas son las palabras que estaban en "places" y deben moverse a "time"
const wordsToMoveToTime = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
  'Hour', 'Minute', 'Second', 'Morning', 'Afternoon', 'Evening', 'Night',
  'Today', 'Tomorrow', 'Yesterday', 'Week', 'Festival'
];

// Correcciones de otras categorías
const corrections = {
  'Rain': 'nature',
  'Pencil': 'objects',
  'Notebook': 'objects'
};

console.log('🔄 Re-ejecutando la subdivisión de la categoría "places"...');

let changes = 0;

// Función para cambiar la categoría de una flashcard buscando por su nombre en inglés
function changeCategory(word, newCategory) {
  // Regex para encontrar la flashcard completa y cambiar solo la categoría
  const flashcardRegex = new RegExp(`(\\{[^\\}]*"englishWord":\\s*"${word}"[^\\}]*?"categoryIds":\\s*\\[)"places"(\\][^\\}]*\\})`, 'g');
  
  if (flashcardRegex.test(content)) {
    content = content.replace(flashcardRegex, `$1"${newCategory}"$2`);
    console.log(`✅ Movida "${word}" de "places" a "${newCategory}"`);
    changes++;
  } else {
    // Comprobar si ya está en la categoría correcta (por si el script se ejecuta de nuevo)
    const alreadyCorrectRegex = new RegExp(`(\\{[^\\}]*"englishWord":\\s*"${word}"[^\\}]*?"categoryIds":\\s*\\[)"${newCategory}"(\\][^\\}]*\\})`, 'g');
    if (alreadyCorrectRegex.test(content)) {
      console.log(`- "${word}" ya está en la categoría "${newCategory}".`);
    } else {
      console.log(`❌ No se encontró "${word}" en la categoría "places" para mover.`);
    }
  }
}

// Mover flashcards a 'time'
wordsToMoveToTime.forEach(word => {
  changeCategory(word, 'time');
});

// Aplicar otras correcciones
for (const [word, newCategory] of Object.entries(corrections)) {
  changeCategory(word, newCategory);
}

// Asegurarse de que la categoría "time" exista
const timeCategory = {
  id: 'time',
  name: 'Tiempo',
  color: '#8B5CF6',
  description: 'Tiempo, calendario, horas, fechas'
};

const masterCategoriesRegex = /(const masterCategories: Category\[\] = \[)([\s\S]*?)(\];)/;
if (!content.includes('"id": "time"')) {
    const match = content.match(masterCategoriesRegex);
    if (match) {
        let categoriesContent = match[2];
        // Añadir una coma si no es el primer elemento
        if (categoriesContent.trim().length > 0 && !categoriesContent.trim().endsWith(',')) {
            categoriesContent += ',';
        }
        const timeCategoryString = `\n  ${JSON.stringify(timeCategory, null, 2).replace(/\n/g, '\n  ')}`;
        
        const newCategoriesContent = categoriesContent + timeCategoryString;
        content = content.replace(masterCategoriesRegex, `$1${newCategoriesContent}\n$3`);
        
        console.log('✅ Categoría "time" agregada a masterCategories');
    } else {
        console.log('❌ No se pudo encontrar el array masterCategories para agregar "time".');
    }
} else {
    console.log('- La categoría "time" ya existe en masterCategories.');
}

if (changes > 0) {
    fs.writeFileSync(appContextPath, content, 'utf8');
    console.log(`\n✅ Script finalizado. Se actualizaron ${changes} flashcards.`);
} else {
    console.log("\n✅ No se necesitaron cambios, el archivo ya está actualizado.");
} 