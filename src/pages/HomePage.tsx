import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LanguageLevel } from '../types';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Grid, 
  List, 
  Filter,
  ChevronDown
} from 'lucide-react';
import { FixedSizeList as ListWindow } from 'react-window';
import { ListChildComponentProps } from 'react-window';
import FlashcardItem from '../components/flashcard/FlashcardItem';
import FlashcardGrid from '../components/flashcard/FlashcardGrid';
import FlashcardList from '../components/flashcard/FlashcardList';

const HomePage: React.FC = () => {
  const { 
    homePageFlashcards,
    categories,
    activeCategory,
    searchTerm,
    sortOption,
    viewMode,
    selectedLevel,
    setActiveCategory,
    setSearchTerm,
    setSortOption,
    setViewMode,
    setSelectedLevel,
    creationTargetLanguage
  } = useAppContext();

  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

  const handleLevelChange = (level: LanguageLevel | null) => {
    setSelectedLevel(level);
    setIsLevelDropdownOpen(false);
  };

  const toggleLevelDropdown = () => {
    setIsLevelDropdownOpen(prev => !prev);
  };

  // Logs de depuración
  console.log('Rendering Home Page. homePageFlashcards count:', homePageFlashcards.length, 'Filters:', { activeCategory, searchTerm, selectedLevel, creationTargetLanguage });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-800">My Flashcards</h1>
        <Link
          to="/create"
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Flashcard
        </Link>
      </div>

      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-neutral-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">

          {/* Level Filter */}
          <div className="relative">
            <button
              className="flex items-center px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
              onClick={toggleLevelDropdown}
            >
              <BookOpen className="w-5 h-5 mr-2 text-neutral-400" />
              {selectedLevel ? `Level ${selectedLevel}` : 'All Levels'}
              <ChevronDown className={`w-4 h-4 ml-2 text-neutral-400 transform transition-transform ${isLevelDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {isLevelDropdownOpen && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-neutral-50"
                  onClick={() => handleLevelChange(null)}
                >
                  All Levels
                </button>
                {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as LanguageLevel[]).map(level => (
                  <button
                    key={level}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-50"
                    onClick={() => handleLevelChange(level)}
                  >
                    Level {level}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Options */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-neutral-400 hover:bg-neutral-100'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-neutral-400 hover:bg-neutral-100'}`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Flashcards Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {homePageFlashcards.map(flashcard => (
            <div key={flashcard.id} className="h-full min-h-[260px] max-h-[380px] flex">
              <FlashcardItem flashcard={flashcard} />
            </div>
          ))}
        </div>
      ) : (
        <ListWindow
          height={600}
          itemCount={homePageFlashcards.length}
          itemSize={120}
          width="100%"
        >
          {({ index, style }: ListChildComponentProps) => {
            const flashcard = homePageFlashcards[index];
            return (
              <div style={style} key={flashcard.id}>
                <FlashcardItem flashcard={flashcard} />
              </div>
            );
          }}
        </ListWindow>
      )}
    </div>
  );
};

export default HomePage;