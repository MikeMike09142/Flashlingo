import React from 'react';
import { useAppContext } from '../context/AppContext';
import FlashcardGrid from '../components/flashcard/FlashcardGrid';
import FlashcardList from '../components/flashcard/FlashcardList';
import EmptyState from '../components/ui/EmptyState';
import { Star } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { flashcards, viewMode, setViewMode } = useAppContext();
  
  const favoriteCards = flashcards.filter(card => card.isFavorite);
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Favorite Cards</h1>
          <p className="text-neutral-600">Your most important words and phrases</p>
        </div>
        
        <div />
      </div>
      
      {favoriteCards.length === 0 ? (
        <EmptyState
          title="No Favorite Cards"
          description="You haven't marked any cards as favorites yet. Mark cards you want to revisit frequently as favorites."
          icon={<Star size={24} className="text-warning-500" />}
          actionText="Back to All Cards"
          actionLink="/"
        />
      ) : (
        <>
          <FlashcardGrid 
            flashcards={favoriteCards} 
            emptyMessage="No favorite cards found"
          />
        </>
      )}
    </div>
  );
};

export default FavoritesPage;