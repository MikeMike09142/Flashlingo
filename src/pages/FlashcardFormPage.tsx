import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Image, Plus, X } from 'lucide-react';
import { Flashcard, LanguageLevel } from '../types/index';

interface FormData {
  englishWord: string;
  spanishTranslation: string;
  frenchTranslation: string;
  englishSentence: string;
  spanishSentence: string;
  frenchSentence: string;
  imageUrl: string;
  categoryIds: string[];
  isFavorite: boolean;
  level: LanguageLevel;
}

const FlashcardFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { 
    getFlashcardById, 
    addFlashcard, 
    updateFlashcard,
    categories,
    studyTargetLanguage,
  } = useAppContext();
  
  const [formData, setFormData] = useState<FormData>({
    englishWord: '',
    spanishTranslation: '',
    frenchTranslation: '',
    englishSentence: '',
    spanishSentence: '',
    frenchSentence: '',
    imageUrl: '',
    categoryIds: [],
    isFavorite: false,
    level: 'A1' as LanguageLevel
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  useEffect(() => {
    if (isEditing && id) {
      const flashcard = getFlashcardById(id);
      if (flashcard) {
        setFormData({
          englishWord: flashcard.englishWord,
          spanishTranslation: flashcard.spanishTranslation || '',
          frenchTranslation: flashcard.frenchTranslation || '',
          englishSentence: flashcard.englishSentence || '',
          spanishSentence: flashcard.spanishSentence || '',
          frenchSentence: flashcard.frenchSentence || '',
          imageUrl: flashcard.imageUrl || '',
          categoryIds: flashcard.categoryIds || [],
          isFavorite: flashcard.isFavorite,
          level: flashcard.level || 'A1',
        });
      } else {
        console.error(`Flashcard with id ${id} not found.`);
        navigate('/');
      }
    }
  }, [isEditing, id, getFlashcardById, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      categoryIds: checked
        ? [...prev.categoryIds, value]
        : prev.categoryIds.filter(id => id !== value),
    }));
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.englishWord.trim()) {
      newErrors.englishWord = 'English word is required';
    }
    
    if (!formData.spanishTranslation.trim()) {
      newErrors.spanishTranslation = 'Spanish translation is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    if (isEditing && id) {
      updateFlashcard(id, {
        englishWord: formData.englishWord,
        spanishTranslation: formData.spanishTranslation,
        frenchTranslation: formData.frenchTranslation,
        englishSentence: formData.englishSentence,
        spanishSentence: formData.spanishSentence,
        frenchSentence: formData.frenchSentence,
        imageUrl: formData.imageUrl,
        categoryIds: formData.categoryIds,
        isFavorite: formData.isFavorite,
        level: formData.level,
      });
    } else {
      addFlashcard({
        englishWord: formData.englishWord,
        spanishTranslation: formData.spanishTranslation,
        frenchTranslation: formData.frenchTranslation,
        englishSentence: formData.englishSentence,
        spanishSentence: formData.spanishSentence,
        frenchSentence: formData.frenchSentence,
        imageUrl: formData.imageUrl,
        categoryIds: formData.categoryIds,
        isFavorite: formData.isFavorite,
        level: formData.level,
      });
    }
    
    navigate('/');
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4 dark:text-neutral-100">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors duration-200"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to all cards
        </Link>
      </div>
      
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
            {isEditing ? 'Edit Flashcard' : 'Create New Flashcard'}
          </h1>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="englishWord" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    English Word
                  </label>
                  <input
                    type="text"
                    name="englishWord"
                    id="englishWord"
                    value={formData.englishWord}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700 ${
                      errors.englishWord ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                    placeholder="e.g., House"
                  />
                  {errors.englishWord && (
                    <p className="mt-1 text-sm text-red-500">{errors.englishWord}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="spanishTranslation" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Spanish Translation
                  </label>
                  <input
                    type="text"
                    name="spanishTranslation"
                    id="spanishTranslation"
                    value={formData.spanishTranslation}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700 ${
                      errors.spanishTranslation ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                    placeholder="e.g., Casa"
                  />
                  {errors.spanishTranslation && (
                    <p className="mt-1 text-sm text-red-500">{errors.spanishTranslation}</p>
                  )}
                </div>
              </div>
              
              {studyTargetLanguage === 'french' && (
                <div className="mt-6">
                  <label htmlFor="frenchTranslation" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    French Translation
                  </label>
                  <input
                    type="text"
                    name="frenchTranslation"
                    id="frenchTranslation"
                    value={formData.frenchTranslation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700"
                    placeholder="e.g., Maison"
                  />
                </div>
              )}

              <div>
                <label htmlFor="englishSentence" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Example Sentence (English)
                </label>
                <textarea
                  name="englishSentence"
                  id="englishSentence"
                  value={formData.englishSentence}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700"
                  placeholder="e.g., The house is big."
                ></textarea>
              </div>

              {studyTargetLanguage === 'spanish' && (
                <div>
                  <label htmlFor="spanishSentence" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Example Sentence (Spanish)
                  </label>
                  <textarea
                    name="spanishSentence"
                    id="spanishSentence"
                    value={formData.spanishSentence}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700"
                    placeholder="e.g., La casa es grande."
                  ></textarea>
                </div>
              )}

              {studyTargetLanguage === 'french' && (
                <div>
                  <label htmlFor="frenchSentence" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Example Sentence (French)
                  </label>
                  <textarea
                    name="frenchSentence"
                    id="frenchSentence"
                    value={formData.frenchSentence}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700"
                    placeholder="e.g., La maison est grande."
                  ></textarea>
                </div>
              )}

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Image URL
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="imageUrl"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700"
                    placeholder="https://example.com/image.png"
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img src={formData.imageUrl} alt="Preview" className="h-24 w-auto rounded-lg object-cover" />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  id="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Categories
                </label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        value={category.id}
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={handleCategoryChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFavorite"
                  id="isFavorite"
                  checked={formData.isFavorite}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="isFavorite" className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Mark as favorite
                </label>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-semibold"
              >
                {isEditing ? 'Save Changes' : 'Create Flashcard'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlashcardFormPage;