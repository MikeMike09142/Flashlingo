import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppContext } from '../context/AppContext';

const SettingsPage: React.FC = () => {
  const { t, language, changeLanguage } = useTranslation();
  const { theme, toggleTheme } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-8">
        {t('settings')}
      </h1>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
        {/* Language Settings */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
            {t('language')}
          </h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={() => changeLanguage('en')}
                className="mr-3"
              />
              <span className="text-neutral-700 dark:text-neutral-300">English</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="language"
                value="es"
                checked={language === 'es'}
                onChange={() => changeLanguage('es')}
                className="mr-3"
              />
              <span className="text-neutral-700 dark:text-neutral-300">Español</span>
            </label>
          </div>
        </div>
        
        {/* Theme Settings */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
            {t('theme')}
          </h2>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {theme.isDarkMode ? t('lightMode') : t('darkMode')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;