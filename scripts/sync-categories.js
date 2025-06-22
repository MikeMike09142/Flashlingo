import fs from 'fs';

const appContextPath = 'src/context/AppContext.tsx';

// Lee el archivo y extrae las categorías de las flashcards
function getUsedCategories() {
  const content = fs.readFileSync(appContextPath, 'utf8');
  const lines = content.split('\n');
  const used = new Set();
  for (const line of lines) {
    const match = line.match(/"categoryIds":\s*\[([^\]]+)\]/);
    if (match) {
      const cats = match[1].match(/"([^"]+)"/g);
      if (cats) cats.forEach(cat => used.add(cat.replace(/"/g, '')));
    }
  }
  return Array.from(used);
}

// Lee el array masterCategories
function getMasterCategories() {
  const content = fs.readFileSync(appContextPath, 'utf8');
  const match = content.match(/const masterCategories: Category\[\] = \[(.*?)\];/s);
  if (!match) return [];
  const arrayStr = match[1];
  const cats = [];
  const regex = /{\s*id: ['"]([^'"]+)['"],\s*name: ['"]([^'"]+)['"],\s*color: ['"]([^'"]+)['"],/g;
  let m;
  while ((m = regex.exec(arrayStr)) !== null) {
    cats.push({ id: m[1], name: m[2], color: m[3] });
  }
  return cats;
}

// Genera un color aleatorio pastel
function randomColor() {
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h}, 70%, 80%)`;
}

// Actualiza el array masterCategories en el archivo
function updateMasterCategories(newCategories) {
  const content = fs.readFileSync(appContextPath, 'utf8');
  const newArray =
    'const masterCategories: Category[] = [\n' +
    newCategories
      .map(
        c => `    { id: '${c.id}', name: '${c.name}', color: '${c.color}', created_at: new Date().toISOString() }`
      )
      .join(',\n') +
    '\n];';
  const updated = content.replace(
    /const masterCategories: Category\[\] = \[.*?\];/s,
    newArray
  );
  fs.writeFileSync(appContextPath, updated, 'utf8');
}

// MAIN
const used = getUsedCategories();
const master = getMasterCategories();
const masterIds = master.map(c => c.id);
const missing = used.filter(cat => !masterIds.includes(cat));

if (missing.length === 0) {
  console.log('✅ Todas las categorías usadas ya existen en masterCategories.');
} else {
  console.log('➕ Se agregarán nuevas categorías simplificadas:');
  missing.forEach(cat => console.log('   -', cat));
  const newCats = [
    ...master,
    ...missing.map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1), color: randomColor() }))
  ];
  updateMasterCategories(newCats);
  console.log('✅ masterCategories actualizado.');
}

console.log('\nResumen de categorías usadas:', used.join(', ')); 