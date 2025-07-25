import React, { useState } from 'react';
import { Menu, X, Search, Plus, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const { searchTerm, setSearchTerm, theme, toggleTheme } = useAppContext();
  const { t } = useTranslation();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();
  
  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm('');
    }
  };
  
  const handleCreateCard = () => {
    navigate('/flashcard/new');
  };
  
  return (
    <header className="bg-white dark:bg-neutral-800 shadow-sm z-10 sticky top-0 border-b border-neutral-200 dark:border-neutral-700">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200 md:hidden"
            aria-label={sidebarOpen ? t('closeMenu') : t('openMenu')}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400 hidden sm:block">FlashLingo</h1>
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400 sm:hidden">FL</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isSearchVisible ? (
            <div className="relative animate-fade-in">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <button
                onClick={handleSearchToggle}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleSearchToggle}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
                aria-label={t('search')}
              >
                <Search size={20} className="text-neutral-600 dark:text-neutral-300" />
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
                aria-label={theme.isDarkMode ? t('switchToLightMode') : t('switchToDarkMode')}
              >
                {theme.isDarkMode ? (
                  <Sun size={20} className="text-neutral-600 dark:text-neutral-300" />
                ) : (
                  <Moon size={20} className="text-neutral-600 dark:text-neutral-300" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;