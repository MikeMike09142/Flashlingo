import React, { useEffect } from 'react';
import { Flashcard } from '../../types';
import FlashcardItem from './FlashcardItem';
import { useNavigate, useLocation } from 'react-router-dom';

interface FlashcardGridProps {
  flashcards: Flashcard[];
  emptyMessage?: string;
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({ 
  flashcards, 
  emptyMessage = "No flashcards found"
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Guardar la posición de desplazamiento cuando se navega
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Restaurar la posición de desplazamiento cuando se regresa
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
      sessionStorage.removeItem('scrollPosition');
    }
  }, [location]);
  
  const handleSelectCard = (id: string) => {
    // Guardar la posición actual antes de navegar
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    navigate(`/flashcard/${id}`);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {flashcards.map(flashcard => (
        <div key={flashcard.id} className="h-full min-h-[260px] max-h-[380px] flex">
          <FlashcardItem 
            flashcard={flashcard} 
            onSelect={() => handleSelectCard(flashcard.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default FlashcardGrid;