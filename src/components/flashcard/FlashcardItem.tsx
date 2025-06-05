import React, { useState } from 'react';
import { Star, StarOff, Volume2, Pencil, Trash2 } from 'lucide-react';
import { Flashcard as FlashcardType, Category } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface FlashcardItemProps {
  flashcard: FlashcardType;
  onSelect?: () => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ flashcard, onSelect }) => {
  console.log('Rendering FlashcardItem for:', flashcard.englishWord, flashcard.id); // Log de depuración
  console.log('Flashcard data:', flashcard); // Nuevo log para ver todos los datos
  const [isFlipped, setIsFlipped] = useState(false);
  console.log('isFlipped:', isFlipped); // Nuevo log para ver el estado de volteo
  const { toggleFavorite, getCategoryById, deleteFlashcard, studyTargetLanguage } = useAppContext();
  const navigate = useNavigate();
  
  const handleFlip = () => {
    console.log('Flipping card, current state:', isFlipped);
    setIsFlipped(!isFlipped);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(flashcard.id);
  };
  
  const handlePronunciation = (e: React.MouseEvent, text: string, lang: string) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit/${flashcard.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      deleteFlashcard(flashcard.id);
    }
  };
  
  const getCategories = (): Category[] => {
    // Verificar si categoryIds existe y es un array antes de intentar mapear
    if (!flashcard.categoryIds || !Array.isArray(flashcard.categoryIds)) {
      return []; // Devolver un array vacío si categoryIds no es válido
    }
    return flashcard.categoryIds
      .map(id => getCategoryById(id))
      .filter((cat): cat is Category => cat !== undefined);
  };
  
  const categories = getCategories();
  
  return (
    <div className="w-full h-full">
      <div
        className="w-full h-full text-left cursor-pointer bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5 relative"
        onClick={handleFlip}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Top Section: Categories, Level, and Favorite */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-wrap gap-1">
              {categories.map(category => (
                <span 
                  key={category.id}
                  className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                >
                  {category.name}
                </span>
              ))}
              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full dark:bg-neutral-700 dark:text-neutral-300">
                {flashcard.level}
              </span>
            </div>
             {/* Favorite button */}
             <button 
               onClick={handleFavoriteToggle}
               className={`p-1.5 hover:bg-primary-50 rounded-full transition-colors duration-200 ${flashcard.isFavorite ? 'text-warning-500 dark:text-warning-300' : 'text-neutral-400 hover:text-warning-500 dark:text-neutral-400 dark:hover:text-warning-300'}`}
               aria-label={flashcard.isFavorite ? "Remove from favorites" : "Add to favorites"}
             >
               {flashcard.isFavorite ? <Star size={18} /> : <StarOff size={18} />}
             </button>
          </div>

          {/* Edit Button (Top Center) */}
          <button
            onClick={handleEditClick}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200 z-10"
            aria-label="Edit flashcard"
          >
            <Pencil size={18} />
          </button>

          {/* Content Section: Word/Translation and Sentence */}
          <div className="flex-1 flex flex-col justify-center items-center text-center overflow-y-auto">
            {isFlipped ? (
              // Back side: Show Spanish or French based on content
              <>
                 {(flashcard.spanishTranslation || flashcard.frenchTranslation) ? (
                    <>
                       <div className="flex items-center justify-center mb-2 break-words">
                         <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mr-2">{flashcard.spanishTranslation || flashcard.frenchTranslation}</h2>
                         {(flashcard.spanishTranslation || flashcard.frenchTranslation) && (
                           <button
                             onClick={(e) => handlePronunciation(e, flashcard.spanishTranslation || flashcard.frenchTranslation || '', studyTargetLanguage === 'french' ? 'fr-FR' : 'es-ES')}
                             className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200"
                             aria-label={`Pronounce ${studyTargetLanguage === 'french' ? 'French translation' : 'Spanish translation'}`}
                           >
                             <Volume2 size={20} />
                           </button>
                         )}
                       </div>
                       {(flashcard.spanishSentence || flashcard.frenchSentence) && (
                         <div className="flex items-center justify-center mb-2 break-words">
                           <p className="text-neutral-600 dark:text-neutral-300 italic mr-2">{flashcard.spanishSentence || flashcard.frenchSentence}</p>
                           <button
                             onClick={(e) => handlePronunciation(e, flashcard.spanishSentence || flashcard.frenchSentence || '', studyTargetLanguage === 'french' ? 'fr-FR' : 'es-ES')}
                             className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200"
                             aria-label={`Pronounce ${studyTargetLanguage === 'french' ? 'French sentence' : 'Spanish sentence'}`}
                           >
                             <Volume2 size={20} />
                           </button>
                         </div>
                       )}
                    </>
                 ) : (
                    <p className="text-neutral-600 dark:text-neutral-300 italic mb-2 break-words">No Translation Available</p>
                 )}
              </>
            ) : (
              // Front side: Always show English
              <>
                 <div className="flex items-center justify-center mb-2 break-words">
                   <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mr-2">{flashcard.englishWord}</h2>
                   <button
                     onClick={(e) => handlePronunciation(e, flashcard.englishWord, 'en-US')}
                     className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200"
                     aria-label="Pronounce word"
                   >
                     <Volume2 size={20} />
                   </button>
                 </div>
                 {(flashcard.englishSentence) && (
                   <div className="flex items-center justify-center mb-2 break-words">
                     <p className="text-neutral-600 dark:text-neutral-300 italic mr-2">{flashcard.englishSentence}</p>
                     <button
                       onClick={(e) => handlePronunciation(e, flashcard.englishSentence || '', 'en-US')}
                       className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200"
                       aria-label="Pronounce sentence"
                     >
                       <Volume2 size={20} />
                     </button>
                   </div>
                 )}
              </>
            )}
             {flashcard.imageUrl && (
              <div className="mt-4 rounded-lg overflow-hidden w-full max-h-40">
                <img 
                  src={flashcard.imageUrl} 
                  alt={flashcard.englishWord} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Tap Hint */}
          <div className="mt-auto text-center pt-4 border-t border-neutral-100 dark:border-neutral-700">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
               Tap to see {isFlipped ? (studyTargetLanguage === 'french' ? 'English meaning' : 'English word') : (studyTargetLanguage === 'french' ? 'French translation' : 'Spanish translation')}
            </div>
          </div>

          {/* Delete Button (Bottom Right) */}
          <button
            onClick={handleDelete}
            className="absolute bottom-4 right-4 p-1.5 text-neutral-500 hover:text-error-600 hover:bg-error-50 rounded-full transition-colors duration-200 z-10"
            aria-label="Delete flashcard"
          >
            <Trash2 size={18} />
          </button>

        </div>
      </div>
    </div>
  );
};

export { FlashcardItem };
export default FlashcardItem;