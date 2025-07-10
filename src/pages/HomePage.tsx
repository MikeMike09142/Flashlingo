import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, BookOpen, ChevronDown, Download, Upload } from 'lucide-react';
import FlashcardItem from '../components/flashcard/FlashcardItem';
import { LanguageLevel, Flashcard } from '../types';
import { requestNotificationPermission } from '../firebase';

const HomePage: React.FC = () => {
  const {
    filteredFlashcards,
    categories,
    activeCategory,
    searchTerm,
    sortOption,
    viewMode,
    setActiveCategory,
    setSearchTerm,
    setSortOption,
    setViewMode,
    flashcards: allFlashcards,
    setFlashcards,
    isLoading,
  } = useAppContext();

  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    setSearchTerm('');
  }, []);

  const flashcardsOnScreen = selectedLevel
    ? filteredFlashcards.filter(card => card.level === selectedLevel)
    : filteredFlashcards;

  const handleLevelChange = (level: LanguageLevel | null) => {
    setSelectedLevel(level);
    setIsLevelDropdownOpen(false);
  };

  const toggleLevelDropdown = () => {
    setIsLevelDropdownOpen(prev => !prev);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(allFlashcards, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'my_flashcards.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        try {
          const importedFlashcards = JSON.parse(e.target?.result as string) as Flashcard[];
          // Basic validation
          if (Array.isArray(importedFlashcards) && importedFlashcards.every(card => 'id' in card && 'englishWord' in card)) {
            setFlashcards((prev: Flashcard[]) => {
              const newOnes = importedFlashcards.filter(
                imported => !prev.some((existing: Flashcard) => existing.id === imported.id)
              );
              return [...prev, ...newOnes];
            });
            alert('Flashcards imported successfully!');
          } else {
            throw new Error('Invalid file format.');
          }
        } catch (error) {
          console.error("Error importing flashcards:", error);
          alert('Failed to import flashcards. Please check the file format.');
        }
      };
    }
  };

  const handleAllowNotifications = async () => {
    await requestNotificationPermission("BP8Cs5f7FOuYwWub76EhOv9_bYmgSdyURf8vu-LhX26NXWK_jenzKSujh4QTudoSK9Bs7Z52HBplWgFzo213Rvl");
    setNotificationPermission(Notification.permission);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900 text-gray-900 dark:text-white">
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón para permitir notificaciones push */}
      {notificationPermission !== 'granted' && (
        <div className="mb-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={handleAllowNotifications}
          >
            Allow Notifications
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">My Flashcards</h1>
        <div className="flex items-center flex-wrap justify-start md:justify-end gap-2">
          <Link
            to="/flashcards/new"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Flashcard
          </Link>
        </div>
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
        </div>
      </div>

      {/* Sólo modo galería */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcardsOnScreen.map(flashcard => (
          <div key={flashcard.id} className="h-full min-h-[260px] max-h-[380px] flex">
            <FlashcardItem flashcard={flashcard} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;