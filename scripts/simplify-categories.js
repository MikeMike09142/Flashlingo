import fs from 'fs';

const appContextPath = 'src/context/AppContext.tsx';

const SIMPLIFY_MAP = {
  school: 'places',
  calendar: 'places',
  events: 'places',
  seasons: 'nature'
};

// Reasigna las categorías en las flashcards
function simplifyFlashcardCategories() {
  let content = fs.readFileSync(appContextPath, 'utf8');
  Object.entries(SIMPLIFY_MAP).forEach(([from, to]) => {
    // Reemplaza en arrays de una sola categoría
    const regex1 = new RegExp(`"categoryIds":\s*\[\s*"${from}"\s*\]`, 'g');
    content = content.replace(regex1, `"categoryIds": ["${to}"]`);
    // Reemplaza en arrays con múltiples categorías
    const regex2 = new RegExp(`"${from}"`, 'g');
    content = content.replace(regex2, `"${to}"`);
  });
  fs.writeFileSync(appContextPath, content, 'utf8');
}

// Limpia masterCategories eliminando las que ya no se usan
function cleanMasterCategories() {
  let content = fs.readFileSync(appContextPath, 'utf8');
  // Extrae el array actual
  const match = content.match(/const masterCategories: Category\[\] = \[(.*?)\];/s);
  if (!match) return;
  let arrayStr = match[1];
  // Elimina las categorías simplificadas
  Object.keys(SIMPLIFY_MAP).forEach(cat => {
    const regex = new RegExp(`\s*{[^}]*id: ['"]${cat}['"][^}]*},?`, 'g');
    arrayStr = arrayStr.replace(regex, '');
  });
  // Reconstruye el array limpio
  const newArray = 'const masterCategories: Category[] = [' + arrayStr.trim() + '\n];';
  content = content.replace(/const masterCategories: Category\[\] = \[.*?\];/s, newArray);
  fs.writeFileSync(appContextPath, content, 'utf8');
}

simplifyFlashcardCategories();
cleanMasterCategories();
console.log('✅ Categorías simplificadas y masterCategories limpio.'); 