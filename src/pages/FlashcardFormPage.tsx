import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Image, Plus, X } from 'lucide-react';
import { Flashcard, LanguageLevel } from '../types/index';

interface FormData {
  englishWord: string;
  spanishTranslation: string;
  englishSentence: string;
  spanishSentence: string;
  frenchTranslation: string;
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
    creationTargetLanguage
  } = useAppContext();
  
  const [formData, setFormData] = useState<FormData>({
    englishWord: '',
    spanishTranslation: '',
    englishSentence: '',
    spanishSentence: '',
    frenchTranslation: '',
    frenchSentence: '',
    imageUrl: '',
    categoryIds: [],
    isFavorite: false,
    level: 'A1'
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  // Load existing data if editing
  useEffect(() => {
    if (isEditing) {
      const flashcard = getFlashcardById(id);
      if (flashcard) {
        setFormData({
          englishWord: flashcard.englishWord,
          spanishTranslation: flashcard.spanishTranslation || '',
          englishSentence: flashcard.englishSentence || '',
          spanishSentence: flashcard.spanishSentence || '',
          frenchTranslation: flashcard.frenchTranslation || '',
          frenchSentence: flashcard.frenchSentence || '',
          imageUrl: flashcard.imageUrl || '',
          categoryIds: flashcard.categoryIds,
          isFavorite: flashcard.isFavorite,
          level: flashcard.level || 'A1',
        });
      } else {
        // Handle case where flashcard isn't found
        navigate('/');
      }
    }
  }, [isEditing, id, getFlashcardById, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
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
      newErrors.englishWord = 'New word to learn is required';
    }
    
    if (creationTargetLanguage === 'spanish' && !formData.spanishTranslation.trim()) {
      newErrors.spanishTranslation = 'Spanish translation is required';
    } else if (creationTargetLanguage === 'french' && !formData.frenchTranslation.trim()) {
      newErrors.frenchTranslation = 'French translation is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    // Prepare data for add/update based on creationTargetLanguage
    const flashcardData = {
      englishWord: formData.englishWord,
      spanishTranslation: creationTargetLanguage === 'spanish' ? formData.spanishTranslation : '', // Save Spanish only if creating in Spanish
      englishSentence: formData.englishSentence,
      spanishSentence: creationTargetLanguage === 'spanish' ? formData.spanishSentence : '', // Save Spanish only if creating in Spanish
      frenchTranslation: creationTargetLanguage === 'french' ? formData.frenchTranslation : '', // Save French only if creating in French
      frenchSentence: creationTargetLanguage === 'french' ? formData.frenchSentence : '', // Save French only if creating in French
      imageUrl: formData.imageUrl,
      categoryIds: formData.categoryIds,
      isFavorite: formData.isFavorite,
      level: formData.level,
      lastReviewed: null, // Reset review data for new/updated cards
      nextReviewDate: Date.now(), // Set as due now for initial study
      reviewCount: 0,
    };
    
    if (isEditing) {
      // For update, pass only fields that might have changed
      const updateData: Partial<Flashcard> = {
        englishWord: flashcardData.englishWord,
        englishSentence: flashcardData.englishSentence,
        imageUrl: flashcardData.imageUrl,
        categoryIds: flashcardData.categoryIds,
        isFavorite: flashcardData.isFavorite,
        level: flashcardData.level,
        // Include translation/sentence based on creationTargetLanguage
        ...(creationTargetLanguage === 'spanish' && { spanishTranslation: flashcardData.spanishTranslation, spanishSentence: flashcardData.spanishSentence }),
        ...(creationTargetLanguage === 'french' && { frenchTranslation: flashcardData.frenchTranslation, frenchSentence: flashcardData.frenchSentence }),
        // Do NOT update mastery level, review counts, dates here
      };
      updateFlashcard(id, updateData);
    } else {
      addFlashcard(flashcardData);
    }
    
    navigate('/');
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to all cards
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neutral-800 mb-6">
            {isEditing ? 'Edit Flashcard' : 'Create New Flashcard'}
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    New word to learn
                  </label>
                  <input
                    type="text"
                    name="englishWord"
                    value={formData.englishWord}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.englishWord ? 'border-error-500' : 'border-neutral-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter the English word"
                  />
                  {errors.englishWord && (
                    <p className="mt-1 text-sm text-error-500">{errors.englishWord}</p>
                  )}
                </div>
                
                {creationTargetLanguage === 'spanish' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Translation (Spanish)
                      </label>
                      <input
                        type="text"
                        name="spanishTranslation"
                        value={formData.spanishTranslation}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.spanishTranslation ? 'border-error-500' : 'border-neutral-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        placeholder="Enter the Spanish translation"
                      />
                      {errors.spanishTranslation && (
                        <p className="mt-1 text-sm text-error-500">{errors.spanishTranslation}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Sentence translation (Spanish)
                      </label>
                      <textarea
                        name="spanishSentence"
                        value={formData.spanishSentence}
                        onChange={handleChange}
                        rows={2}
                        className={`w-full px-3 py-2 border ${
                          errors.spanishSentence ? 'border-error-500' : 'border-neutral-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        placeholder="Write the Spanish translation of the example sentence"
                      ></textarea>
                      {errors.spanishSentence && (
                        <p className="mt-1 text-sm text-error-500">{errors.spanishSentence}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Translation (French)
                      </label>
                      <input
                        type="text"
                        name="frenchTranslation"
                        value={formData.frenchTranslation}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.frenchTranslation ? 'border-error-500' : 'border-neutral-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        placeholder="Enter the French translation"
                      />
                      {errors.frenchTranslation && (
                        <p className="mt-1 text-sm text-error-500">{errors.frenchTranslation}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Sentence translation (French)
                      </label>
                      <textarea
                        name="frenchSentence"
                        value={formData.frenchSentence}
                        onChange={handleChange}
                        rows={2}
                        className={`w-full px-3 py-2 border ${
                          errors.frenchSentence ? 'border-error-500' : 'border-neutral-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        placeholder="Write the French translation of the example sentence"
                      ></textarea>
                      {errors.frenchSentence && (
                        <p className="mt-1 text-sm text-error-500">{errors.frenchSentence}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  New sentence example
                </label>
                <textarea
                  name="englishSentence"
                  value={formData.englishSentence}
                  onChange={handleChange}
                  rows={2}
                  className={`w-full px-3 py-2 border ${
                    errors.englishSentence ? 'border-error-500' : 'border-neutral-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="Write an example sentence using this word"
                ></textarea>
                {errors.englishSentence && (
                  <p className="mt-1 text-sm text-error-500">{errors.englishSentence}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Image URL (optional)
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter an image URL"
                  />
                </div>
                <p className="mt-1 text-sm text-neutral-500">
                  Add an image that helps illustrate the word
                </p>
                
                {formData.imageUrl && (
                  <div className="mt-3 relative">
                    <div className="rounded-lg overflow-hidden border border-neutral-200">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
                    >
                      <X size={16} className="text-neutral-700" />
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <label
                      key={category.id}
                      className="inline-flex items-center px-3 py-1 border border-neutral-300 rounded-full cursor-pointer text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        value={category.id}
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={handleCategoryChange}
                        className="form-checkbox h-4 w-4 text-primary-600 transition duration-150 ease-in-out mr-1"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFavorite"
                    name="isFavorite"
                    checked={formData.isFavorite}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label htmlFor="isFavorite" className="ml-2 text-sm text-neutral-700">
                    Mark as favorite
                  </label>
                </div>
              </div>
              
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-neutral-700 mb-1">
                  Nivel
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Basic</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Mastery</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 border-t border-neutral-200 pt-6">
                <Link
                  to="/"
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  {isEditing ? 'Update Flashcard' : 'Create Flashcard'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlashcardFormPage;