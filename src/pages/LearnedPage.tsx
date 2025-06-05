import React from 'react';
import { useAppContext } from '../context/AppContext';
import FlashcardGrid from '../components/flashcard/FlashcardGrid';
import FlashcardList from '../components/flashcard/FlashcardList';
import EmptyState from '../components/ui/EmptyState';
import { CheckCircle, LayoutGrid, Layers } from 'lucide-react';

const LearnedPage: React.FC = () => {
  const { flashcards, viewMode, setViewMode } = useAppContext();
  
  const learnedCards = flashcards.filter(card => card.isLearned);
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Learned Cards</h1>
          <p className="text-neutral-600">Words and phrases you've mastered</p>
        </div>
        
        <div className="inline-flex overflow-hidden rounded-lg border border-neutral-200">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 ${
              viewMode === 'cards'
                ? 'bg-primary-50 text-primary-600'
                : 'bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
            aria-label="Card view"
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${
              viewMode === 'list'
                ? 'bg-primary-50 text-primary-600'
                : 'bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
            aria-label="List view"
          >
            <Layers size={20} />
          </button>
        </div>
      </div>
      
      {learnedCards.length === 0 ? (
        <EmptyState
          title="No Learned Cards"
          description="You haven't marked any cards as learned yet. Study cards to mark them as learned."
          icon={<CheckCircle size={24} className="text-success-500" />}
          actionText="Start Studying"
          actionLink="/study"
        />
      ) : (
        <>
          {viewMode === 'cards' ? (
            <FlashcardGrid 
              flashcards={learnedCards} 
              emptyMessage="No learned cards found"
            />
          ) : (
            <FlashcardList 
              flashcards={learnedCards}
              emptyMessage="No learned cards found"
            />
          )}
        </>
      )}
    </div>
  );
};

export default LearnedPage;