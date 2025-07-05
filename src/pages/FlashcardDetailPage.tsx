import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  Star, 
  StarOff, 
  Check, 
  CheckCircle, 
  Volume2, 
  ArrowLeft, 
  Pencil, 
  Trash2,
  Image
} from 'lucide-react';
import { Category } from '../types';

const FlashcardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getFlashcardById, 
    getCategoryById, 
    toggleFavorite, 
    deleteFlashcard,
    studyTargetLanguage
  } = useAppContext();
  console.log('studyTargetLanguage en detalle:', studyTargetLanguage);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const flashcard = getFlashcardById(id || '');
  
  if (!flashcard) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Flashcard Not Found</h2>
        <p className="text-neutral-600 mb-6">
          The flashcard you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handlePronunciation = () => {
    const utterance = new SpeechSynthesisUtterance(
      isFlipped ? (flashcard.spanishSentence || '') : flashcard.englishWord
    );
    utterance.lang = isFlipped ? 'es-ES' : 'en-US'; // Assuming Spanish for back, English for front
     if (isFlipped) {
       if (flashcard.spanishTranslation) utterance.lang = 'es-ES';
       else if (flashcard.frenchTranslation) utterance.lang = 'fr-FR';
     } else {
       utterance.lang = 'en-US';
     }

    window.speechSynthesis.speak(utterance);
  };
  
  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteFlashcard(flashcard.id);
      navigate('/');
    } else {
      setShowDeleteConfirm(true);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  const handleEdit = () => {
    navigate(`/edit/${flashcard.id}`);
  };

  const getCategories = () => {
     return flashcard.categoryIds
       .map(id => getCategoryById(id))
       .filter((cat): cat is Category => cat !== undefined);
  };

  const categories = getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden relative flex flex-col h-full">
          {/* Image */}
          {flashcard.imageUrl && (
            <div className="w-full overflow-hidden flex-shrink-0">
              <img
                src={flashcard.imageUrl}
                alt={`Image for ${flashcard.englishWord}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Favorite Button (Top Left) */}
          <button
            onClick={() => toggleFavorite(flashcard.id)}
            className={`absolute top-4 left-4 p-1.5 rounded-full transition-colors duration-200 z-10 ${flashcard.isFavorite ? 'text-warning-500 dark:text-warning-300 hover:bg-warning-50 dark:hover:bg-warning-900' : 'text-neutral-400 hover:text-warning-500 dark:text-neutral-400 dark:hover:text-warning-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}
            aria-label={flashcard.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {flashcard.isFavorite ? <Star size={24} /> : <StarOff size={24} />}
          </button>

          <div className="p-5 pb-12 flex flex-col justify-center items-stretch text-center min-h-[150px]">
            {/* Front/Back Content */}
            <div 
              className={`relative text-center cursor-pointer transition-transform duration-600 ${isFlipped ? '[transform:rotateY(180deg)]' : ''} flex-1 flex flex-col justify-center items-center`}
              onClick={handleFlip}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side */}
              <div className={`absolute inset-0 [backface-visibility:hidden] ${isFlipped ? 'hidden' : ''}`}>
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                   {/* Front side: Always show English */}
                   <div className="flex items-center justify-center mb-2 break-words">
                     <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mr-2">{flashcard.englishWord}</h2>
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         const utterance = new SpeechSynthesisUtterance(flashcard.englishWord || '');
                         utterance.lang = 'en-US';
                         window.speechSynthesis.speak(utterance);
                       }}
                       className="p-2.5 bg-sky-500/20 hover:bg-sky-500/30 rounded-full transition-colors duration-200"
                       aria-label="Pronounce word"
                     >
                       <Volume2 size={26} className="text-sky-600" />
                     </button>
                   </div>
                   {flashcard.englishSentence && (
                     <div className="flex items-center justify-center mb-2 break-words">
                       <p className="text-neutral-600 dark:text-neutral-300 italic mr-2">{flashcard.englishSentence || ''}</p>
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           const utterance = new SpeechSynthesisUtterance(flashcard.englishSentence || '');
                           utterance.lang = 'en-US';
                           window.speechSynthesis.speak(utterance);
                         }}
                         className="p-2 bg-sky-500/20 hover:bg-sky-500/30 rounded-full transition-colors duration-200"
                         aria-label="Pronounce sentence"
                       >
                         <Volume2 size={22} className="text-sky-600" />
                       </button>
                     </div>
                   )}
                </div>
              </div>

              {/* Back Side */}
              <div className={`absolute inset-0 [backface-visibility:hidden] ${isFlipped ? '' : 'hidden'} [transform:rotateY(180deg)]`}>
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                   {/* Back side: Show translation and sentence based on studyTargetLanguage */}
                   {(studyTargetLanguage === 'french' ? flashcard.frenchTranslation : flashcard.spanishTranslation) ? (
                      <>
                         <div className="flex items-center justify-center mb-2 break-words">
                           <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mr-2">
                              {studyTargetLanguage === 'french' ? flashcard.frenchTranslation : flashcard.spanishTranslation}
                           </h2>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               const text = studyTargetLanguage === 'french' ? flashcard.frenchTranslation : flashcard.spanishTranslation;
                               const lang = studyTargetLanguage === 'french' ? 'fr-FR' : 'es-ES';
                               if (text) {
                                 const utterance = new SpeechSynthesisUtterance(text);
                                 utterance.lang = lang;
                                 window.speechSynthesis.speak(utterance);
                               }
                             }}
                             className="p-2.5 bg-sky-500/20 hover:bg-sky-500/30 rounded-full transition-colors duration-200"
                             aria-label={`Pronounce ${studyTargetLanguage === 'french' ? 'French translation' : 'Spanish translation'}`}
                           >
                             <Volume2 size={26} className="text-sky-600" />
                           </button>
                         </div>
                         {(studyTargetLanguage === 'french' ? flashcard.frenchSentence : flashcard.spanishSentence) && (
                           <div className="flex items-center justify-center mb-2 break-words">
                             <p className="text-neutral-600 dark:text-neutral-300 italic mr-2">
                                {studyTargetLanguage === 'french' ? flashcard.frenchSentence : flashcard.spanishSentence}
                             </p>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 const text = studyTargetLanguage === 'french' ? flashcard.frenchSentence : flashcard.spanishSentence;
                                 const lang = studyTargetLanguage === 'french' ? 'fr-FR' : 'es-ES';
                                 if (text) {
                                   const utterance = new SpeechSynthesisUtterance(text);
                                   utterance.lang = lang;
                                   window.speechSynthesis.speak(utterance);
                                 }
                               }}
                               className="p-2 bg-sky-500/20 hover:bg-sky-500/30 rounded-full transition-colors duration-200"
                               aria-label={`Pronounce ${studyTargetLanguage === 'french' ? 'French sentence' : 'Spanish sentence'}`}
                             >
                               <Volume2 size={22} className="text-sky-600" />
                             </button>
                           </div>
                         )}
                      </>
                   ) : (
                      <p className="text-neutral-600 dark:text-neutral-300 italic mb-2 break-words">No Translation Available</p>
                   )}
                </div>
              </div>
            </div>

            {/* Edit and Delete Buttons (Top Right) */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
               {/* Edit Button */}
                <button
                  onClick={handleEdit}
                  className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200 dark:text-neutral-400 dark:hover:text-primary-400 dark:hover:bg-primary-900"
                  aria-label="Edit flashcard"
                >
                  <Pencil size={18} />
                </button>
                
                {/* Delete Button */}
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-neutral-500 hover:text-error-600 hover:bg-error-50 rounded-full transition-colors duration-200 dark:text-neutral-400 dark:hover:text-error-400 dark:hover:bg-error-900"
                  aria-label={showDeleteConfirm ? 'Confirm Delete' : 'Delete flashcard'}
                >
                  <Trash2 size={18} />
                </button>
                 {showDeleteConfirm && (
                     <button
                         onClick={cancelDelete}
                         className="p-1.5 text-neutral-500 hover:text-neutral-600 hover:bg-neutral-50 rounded-full transition-colors duration-200 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hover:bg-neutral-700"
                         aria-label="Cancel delete"
                     >
                         Cancel
                     </button>
                 )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardDetailPage;