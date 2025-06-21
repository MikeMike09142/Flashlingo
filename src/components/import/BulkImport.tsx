import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Flashcard, LanguageLevel, Category } from '../../types';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const BulkImport: React.FC = () => {
  const { addFlashcard, creationTargetLanguage, categories, studyTargetLanguage } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.type === 'application/json') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Por favor, selecciona un archivo CSV o JSON');
        setFile(null);
      }
    }
  };

  const processCSV = async (content: string, currentCreationTargetLanguage: 'spanish' | 'french') => {
    const lines = content.split('\n');
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    
    console.log('Processing CSV. Current creationTargetLanguage:', currentCreationTargetLanguage);
    
    // Validar headers requeridos basados en el idioma de creación
    const requiredTranslationHeader = currentCreationTargetLanguage === 'spanish' ? 'spanishtranslation' : 'frenchtranslation';
    const requiredHeaders = ['englishword', requiredTranslationHeader, 'level'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const totalLines = lines.length - 1; // Excluir header
    let processed = 0;

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(',').map(v => v.trim());
      const flashcard: Partial<Flashcard> = {
        englishWord: values[headers.indexOf('englishword')],
        spanishTranslation: currentCreationTargetLanguage === 'spanish' ? values[headers.indexOf('spanishtranslation')] : undefined,
        frenchTranslation: currentCreationTargetLanguage === 'french' ? values[headers.indexOf('frenchtranslation')] : undefined,
        level: (values[headers.indexOf('level')] || 'A1') as LanguageLevel,
        categoryIds: values[headers.indexOf('categoryids')] ? values[headers.indexOf('categoryids')].split(',').map((id: string) => id.trim()) : [], // Manejar categoryIds como lista separada por comas
        isFavorite: values[headers.indexOf('isfavorite')]?.toLowerCase() === 'true' || false // Manejar isFavorite (opcional)
      };

      // Campos opcionales
      if (headers.includes('englishsentence')) {
        flashcard.englishSentence = values[headers.indexOf('englishsentence')];
      }
      if (headers.includes('spanishsentence') && currentCreationTargetLanguage === 'spanish') {
        flashcard.spanishSentence = values[headers.indexOf('spanishsentence')];
      }
      if (headers.includes('frenchsentence') && currentCreationTargetLanguage === 'french') {
        flashcard.frenchSentence = values[headers.indexOf('frenchsentence')];
      }
      if (headers.includes('imageurl')) {
        flashcard.imageUrl = values[headers.indexOf('imageurl')];
      }

      await addFlashcard(flashcard as any);
      processed++;
      setProgress(Math.round((processed / totalLines) * 100));
    }
  };

  const processJSON = async (content: string, availableCategories: Category[]) => {
    const flashcards = JSON.parse(content);
    if (!Array.isArray(flashcards)) {
      throw new Error('El archivo JSON debe contener un array de flashcards');
    }

    const total = flashcards.length;
    let processed = 0;

    for (const flashcard of flashcards) {
      // Validar campos requeridos basados en creationTargetLanguage
      if (!flashcard.englishWord || !(creationTargetLanguage === 'spanish' ? flashcard.spanishTranslation : flashcard.frenchTranslation)) {
        const requiredField = creationTargetLanguage === 'spanish' ? 'spanishTranslation' : 'frenchTranslation';
        throw new Error(`Each flashcard must have at least englishWord and ${requiredField}`);
      }

      // Mapear nombres/slugs de categoría a IDs
      const categoryIdsFromJSON = Array.isArray(flashcard.categoryIds) ? flashcard.categoryIds : (typeof flashcard.categoryIds === 'string' ? [flashcard.categoryIds] : []);
      const mappedCategoryIds = categoryIdsFromJSON
        .map((catName: string) => availableCategories.find(cat => cat.name === catName)?.id)
        .filter((id: string | undefined): id is string => id !== undefined);

      await addFlashcard({
        ...flashcard,
        level: flashcard.level || 'A1',
        categoryIds: mappedCategoryIds, // Usar los IDs mapeados
        isFavorite: flashcard.isFavorite || false
      });

      processed++;
      setProgress(Math.round((processed / total) * 100));
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      const content = await file.text();
      // Usar el creationTargetLanguage del contexto de nivel superior
      console.log('creationTargetLanguage from context in handleImport:', creationTargetLanguage);

      if (file.type === 'text/csv') {
        await processCSV(content, creationTargetLanguage);
      } else {
        await processJSON(content, categories);
      }

      setSuccess('Importación completada exitosamente');
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700 transition-colors"
        >
          <Upload size={20} />
          <span>{studyTargetLanguage === 'french' ? 'Select file' : 'Seleccionar archivo'}</span>
        </label>
        {file && (
          <span className="text-sm text-neutral-600 dark:text-neutral-300">
            {file.name}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {isLoading && (
        <div className="w-full bg-neutral-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {file && !isLoading && (
        <button
          onClick={handleImport}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {studyTargetLanguage === 'french' ? 'Import Flashcards' : 'Importar Flashcards'}
        </button>
      )}

      <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
        <h4 className="font-medium mb-2">Formato del archivo:</h4>
        <p className="mb-2">Para CSV, las columnas requeridas son:</p>
        <ul className="list-disc list-inside mb-4">
          <li>englishWord (requerido)</li>
          <li>spanishTranslation (requerido)</li>
          <li>level (opcional, por defecto A1)</li>
          <li>englishSentence (opcional)</li>
          <li>spanishSentence (opcional)</li>
          <li>frenchTranslation (opcional)</li>
          <li>frenchSentence (opcional)</li>
          <li>imageUrl (opcional)</li>
        </ul>
        <p className="mb-2">Para JSON, cada flashcard debe tener al menos:</p>
        <pre className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded text-xs text-neutral-800 dark:text-neutral-200">
{`{
  "englishWord": "palabra",
  "spanishTranslation": "traducción",
  "level": "A1" // opcional
}`}
        </pre>
      </div>
    </div>
  );
};

export default BulkImport; 