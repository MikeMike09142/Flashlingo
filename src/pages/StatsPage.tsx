import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Star, BookOpen } from 'lucide-react';

const StatsPage: React.FC = () => {
  const { flashcards, categories } = useAppContext();
  
  // Calculate basic stats
  const totalCards = flashcards.length;
  const favoriteCards = flashcards.filter(card => card.isFavorite).length;
  
  // Calculate category stats
  const categoryStats = categories.map(category => {
    const categoryCards = flashcards.filter(card => card.categoryIds.includes(category.id));
    const total = categoryCards.length;
    
    return {
      id: category.id,
      name: category.name,
      total,
    };
  });
  
  // Sort categories by number of cards
  categoryStats.sort((a, b) => b.total - a.total);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Statistics</h1>
        <p className="text-neutral-600">Track your learning progress</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Total Cards</p>
              <p className="text-3xl font-bold text-neutral-800">{totalCards}</p>
            </div>
            <div className="p-2 bg-neutral-100 rounded-full">
              <BookOpen size={20} className="text-neutral-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Favorites</p>
              <p className="text-3xl font-bold text-warning-500">{favoriteCards}</p>
              <p className="text-xs text-neutral-500">
                {totalCards > 0 ? Math.round((favoriteCards / totalCards) * 100) : 0}% of total
              </p>
            </div>
            <div className="p-2 bg-warning-50 rounded-full">
              <Star size={20} className="text-warning-500" />
            </div>
          </div>
        </div>
        
        <div>
           
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Category Progress</h2>
          
          {categoryStats.length === 0 ? (
            <p className="text-neutral-500">No categories created yet.</p>
          ) : (
            <div className="space-y-4">
              {categoryStats.map(stat => (
                <div key={stat.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-neutral-600">{stat.name}</span>
                    <span className="text-sm font-medium text-neutral-800">
                      {stat.total} cards
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${stat.total > 0 ? 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Study Habits</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Cards Per Category</p>
            <p className="text-2xl font-bold text-neutral-800">
              {categories.length > 0 
                ? Math.round(totalCards / categories.length) 
                : 0}
            </p>
            <p className="text-xs text-neutral-500">average</p>
          </div>
          
          <div>
            <p className="text-sm text-neutral-500 mb-1">Learning Efficiency</p>
            <p className="text-2xl font-bold text-neutral-800">
              {totalCards > 0 
                ? `${Math.round((favoriteCards / totalCards) * 100)}%`
                : "0%"}
            </p>
            <p className="text-xs text-neutral-500">of total cards favorited</p>
          </div>
          
          <div>
            <p className="text-sm text-neutral-500 mb-1">Total Categories</p>
            <p className="text-2xl font-bold text-neutral-800">{categories.length}</p>
            <p className="text-xs text-neutral-500">categorías</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;