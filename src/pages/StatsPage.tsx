import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Star, BookOpen, CheckCircle, LayoutGrid, Layers } from 'lucide-react';
import FlashcardGrid from '../components/flashcard/FlashcardGrid';
import FlashcardList from '../components/flashcard/FlashcardList';
import EmptyState from '../components/ui/EmptyState';
import { format } from 'date-fns';
import { Flashcard } from '../types';

const LEVEL_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: 'A1', label: 'A1 BASIC' },
  { value: 'A2', label: 'A2 BASIC' },
  { value: 'B1', label: 'INTERMEDIATE B1' },
  { value: 'B2', label: 'INTERMEDIATE B2' },
  { value: 'C1', label: 'ADVANCED C1' },
  { value: 'C2', label: 'ADVANCED C2' },
];

const StatsPage: React.FC = () => {
  const { flashcards, categories, viewMode, setViewMode, filteredFlashcards } = useAppContext();
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filter flashcards by selected level and category
  const filteredForSession = useMemo(() => {
    const now = Date.now();
    return filteredFlashcards.filter(card => {
      if (selectedLevel && card.level !== selectedLevel) return false;
      if (selectedCategory && !(card.categoryIds || []).includes(selectedCategory)) return false;
      if ((card.repetitionLevel || 1) >= 5) return false;
      if (!card.englishWord || !card.spanishTranslation) return false;
      // Solo mostrar si la tarjeta está 'due' (o nunca estudiada)
      if (card.nextReviewDate) {
        const reviewTimestamp = typeof card.nextReviewDate === 'string'
          ? new Date(card.nextReviewDate).getTime()
          : card.nextReviewDate;
        if (reviewTimestamp > now) return false;
      }
      return true;
    });
  }, [filteredFlashcards, selectedLevel, selectedCategory]);

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
  
  // Study progress calculations (now language-specific)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = (timestamp: number | null | undefined) => {
    if (!timestamp) return false;
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const reviewedToday = filteredForSession.filter(card => isToday(card.lastReviewed)).length;
  const totalReviews = filteredForSession.reduce((sum, card) => sum + (typeof card.reviewCount === 'number' ? card.reviewCount : 0), 0);
  const lastStudyDate = useMemo(() => {
    const dates = filteredForSession
      .map(card => {
        if (!card.lastReviewed) return null;
        const d = new Date(card.lastReviewed);
        return isNaN(d.getTime()) ? null : d.getTime();
      })
      .filter(Boolean) as number[];
    if (dates.length === 0) return null;
    return new Date(Math.max(...dates));
  }, [filteredForSession]);

  // Streak calculation (language-specific)
  const getStreak = () => {
    const reviewedDates = Array.from(new Set(
      filteredForSession
        .map(card => card.lastReviewed)
        .filter(Boolean)
        .map(ts => {
          const d = new Date(ts as number);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
    ));
    if (reviewedDates.length === 0) return { current: 0, longest: 0 };
    reviewedDates.sort((a, b) => b - a);
    let currentStreak = 0;
    let longestStreak = 1;
    let streak = 1;
    for (let i = 1; i < reviewedDates.length; i++) {
      const diff = (reviewedDates[i - 1] - reviewedDates[i]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        if (streak > longestStreak) longestStreak = streak;
      } else if (diff > 1) {
        streak = 1;
      }
    }
    // Check if today is included for current streak
    if (reviewedDates[0] === today.getTime()) {
      currentStreak = streak;
    } else {
      currentStreak = 0;
    }
    return { current: currentStreak, longest: longestStreak };
  };
  const { current: currentStreak, longest: longestStreak } = getStreak();

  // Learned cards (language-specific)
  const LEARNED_LEVEL = 5;
  const learnedCards = filteredForSession.filter(card => (card.repetitionLevel || 1) >= LEARNED_LEVEL);

  // Recently reviewed cards (last 7 days, language-specific)
  const recentReviewed = filteredForSession
    .filter(card => card.lastReviewed && (Date.now() - (card.lastReviewed as number)) < 7 * 24 * 60 * 60 * 1000)
    .sort((a, b) => (b.lastReviewed || 0) - (a.lastReviewed || 0))
    .slice(0, 10);

  // Spaced repetition intervals in days
  const spacedRepetitionIntervals = [1, 3, 7, 15, 30, 60, 120];

  // Helper to get interval and days until next review
  function getIntervalAndNext(card: Flashcard) {
    const level = card.repetitionLevel || 1;
    const interval = spacedRepetitionIntervals[Math.min(level - 1, spacedRepetitionIntervals.length - 1)];
    let nextDate = card.nextReviewDate ? new Date(card.nextReviewDate) : null;
    let daysUntil = null;
    if (nextDate) {
      const now = new Date();
      daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
    return { level, interval, nextDate, daysUntil };
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Study Progress</h1>
        <p className="text-neutral-600">Your flashcard learning activity and milestones (for the current language section)</p>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="level-select" className="block text-sm font-medium text-neutral-700 mb-1">Level</label>
          <select
            id="level-select"
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {LEVEL_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category-select" className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        {(selectedLevel || selectedCategory) && (
          <div className="flex items-end">
            <button
              onClick={() => { setSelectedLevel(''); setSelectedCategory(''); }}
              className="ml-4 px-4 py-2 bg-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-300"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Total Cards</p>
          <p className="text-3xl font-bold text-neutral-800">{filteredForSession.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Cards Reviewed Today</p>
          <p className="text-3xl font-bold text-neutral-800">{reviewedToday}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Total Reviews</p>
          <p className="text-3xl font-bold text-neutral-800">{totalReviews}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-neutral-800">{currentStreak} days</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Longest Streak</p>
          <p className="text-3xl font-bold text-neutral-800">{longestStreak} days</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Last Study Date</p>
          <p className="text-3xl font-bold text-neutral-800">{lastStudyDate ? lastStudyDate.toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Learned Cards</p>
          <p className="text-3xl font-bold text-neutral-800">{learnedCards.length}</p>
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
      
      <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Recently Reviewed Cards</h2>
            <p className="text-neutral-600">Words and phrases you've recently reviewed</p>
          </div>
          <div className="inline-flex overflow-hidden rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
              aria-label="Card view"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
              aria-label="List view"
            >
              <Layers size={20} />
            </button>
          </div>
        </div>
        {recentReviewed.length === 0 ? (
          <p className="text-neutral-500">No cards reviewed in the last 7 days.</p>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <FlashcardGrid 
                flashcards={recentReviewed} 
                emptyMessage="No recently reviewed cards found"
              />
            ) : (
              <FlashcardList 
                flashcards={recentReviewed}
                emptyMessage="No recently reviewed cards found"
              />
            )}
          </>
        )}
      </div>

      {/* Spaced repetition table */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Spaced Repetition Progress</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Word</th>
                <th className="px-2 py-1 text-left">Repetition Level</th>
                <th className="px-2 py-1 text-left">Interval (days)</th>
                <th className="px-2 py-1 text-left">Next Review Date</th>
                <th className="px-2 py-1 text-left">Days Until Review</th>
              </tr>
            </thead>
            <tbody>
              {filteredForSession.map(card => {
                const { level, interval, nextDate, daysUntil } = getIntervalAndNext(card);
                return (
                  <tr key={card.id} className="border-b last:border-b-0">
                    <td className="px-2 py-1">{card.englishWord}</td>
                    <td className="px-2 py-1">{level}</td>
                    <td className="px-2 py-1">{interval}</td>
                    <td className="px-2 py-1">{nextDate ? nextDate.toLocaleDateString() : 'N/A'}</td>
                    <td className="px-2 py-1">{daysUntil !== null ? (daysUntil >= 0 ? daysUntil : 0) : 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;