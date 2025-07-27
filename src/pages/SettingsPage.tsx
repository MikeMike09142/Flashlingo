import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppContext } from '../context/AppContext';

const SettingsPage: React.FC = () => {
  const { t, language, changeLanguage } = useTranslation();
  const { theme, toggleTheme, studyTargetLanguage, setStudyTargetLanguage } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-8">
        {t('settings')}
      </h1>
      
      <div className="space-y-6">
        {/* Interface Language Settings */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
            Interface {t('language')}
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

        {/* Flashcard Content Language Settings */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
            {t('studyTargetLanguage')}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            {t('studyTargetLanguageDescription')}
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="studyTargetLanguage"
                value="spanish"
                checked={studyTargetLanguage === 'spanish'}
                onChange={() => setStudyTargetLanguage('spanish')}
                className="mr-3"
              />
              <span className="text-neutral-700 dark:text-neutral-300">Spanish (Español) & English (Inglés)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="studyTargetLanguage"
                value="french"
                checked={studyTargetLanguage === 'french'}
                onChange={() => setStudyTargetLanguage('french')}
                className="mr-3"
              />
              <span className="text-neutral-700 dark:text-neutral-300">French (Français) & English (Inglés)</span>
            </label>
          </div>
        </div>
        
        {/* Theme Settings */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
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