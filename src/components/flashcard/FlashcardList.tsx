import React from 'react';
import { Flashcard } from '../../types';
import { Star, Volume2, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface FlashcardListProps {
  flashcards: Flashcard[];
  emptyMessage?: string;
}

const FlashcardList: React.FC<FlashcardListProps> = ({
  flashcards,
  emptyMessage = "No flashcards found"
}) => {
  const { toggleFavorite, categories } = useAppContext();
  const navigate = useNavigate();
  
  const handlePronunciation = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };
  
  const handleSelectCard = (id: string) => {
    navigate(`/flashcards/edit/${id}`);
  };
  
  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-neutral-400 text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-medium text-neutral-700 mb-2">{emptyMessage}</h3>
        <p className="text-neutral-500 max-w-md">
          Try adjusting your search or filters, or create new flashcards to start learning.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
      <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
        {flashcards.map(flashcard => {
          const categoriesList = (flashcard.categoryIds || [])
            .map(id => categories.find(cat => cat.id === id))
            .filter(cat => cat !== undefined);
            
          return (
            <div 
              key={flashcard.id}
              className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200 cursor-pointer"
              onClick={() => handleSelectCard(flashcard.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 truncate mr-2">
                      {flashcard.englishWord}
                    </h3>
                    
                    <button
                      onClick={(e) => handlePronunciation(e, flashcard.englishWord)}
                      className="p-1.5 bg-sky-500/20 hover:bg-sky-500/30 rounded-full transition-colors duration-200"
                      aria-label="Pronounce word"
                    >
                      <Volume2 size={18} className="text-sky-600" />
                    </button>
                    
                    {flashcard.isFavorite && (
                      <Star size={16} className="text-warning-500 ml-1" />
                    )}
                  </div>
                  {/* Pronounce sentence button */}
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 italic truncate mr-2">
                      {flashcard.englishSentence}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const utterance = new SpeechSynthesisUtterance(flashcard.englishSentence);
                        utterance.lang = 'en-US';
                        window.speechSynthesis.speak(utterance);
                      }}
                      className="p-1.5 bg-sky-500/20 hover:bg-sky-500/30 rounded-full transition-colors duration-200"
                      aria-label="Pronounce English sentence"
                    >
                      <Volume2 size={18} className="text-sky-600" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {categoriesList.map(category => category && (
                      <span
                        key={category.id}
                        className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                    {flashcard.spanishTranslation}
                  </p>
                </div>
                
                <ChevronRight size={18} className="text-neutral-400 ml-2" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlashcardList;