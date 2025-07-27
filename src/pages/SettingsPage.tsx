import React, { useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppContext } from '../context/AppContext';
import { AlertTriangle, Download, Upload } from 'lucide-react';
import { Flashcard } from '../types';

const SettingsPage: React.FC = () => {
  const { t, language, changeLanguage } = useTranslation();
  const { 
    theme, 
    toggleTheme, 
    studyTargetLanguage, 
    setStudyTargetLanguage,
    updateStudyTimerSettings,
    updateCardChangeSound,
    flashcards, 
    setFlashcards } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(flashcards, null, 2);
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
            alert(t('flashcardsImportedSuccessfully'));
          } else {
            throw new Error('Invalid file format.');
          }
        } catch (error) {
          console.error("Error importing flashcards:", error);
          alert(t('failedToImportFlashcards'));
        }
      };
    }
    // Reset the input value to allow importing the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Add timer settings handlers
  // Remove these timer handlers (lines 60-66):
  // const handleTimerToggle = (enabled: boolean) => {
  //   updateStudyTimerSettings(enabled, theme.studyTimerDuration);
  // };
  // 
  // const handleTimerDurationChange = (duration: number) => {
  //   updateStudyTimerSettings(theme.studyTimerEnabled, duration);
  // };
  
  // Keep only the sound handler:
  const handleSoundToggle = (enabled: boolean) => {
    updateCardChangeSound(enabled);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-8">
        {t('settings')}
      </h1>
      
      <div className="space-y-6">
        {/* Data Storage Warning */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                {t('dataStorageWarning')}
              </h2>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                {t('dataStorageWarningText')}
              </p>
            </div>
          </div>
        </div>

        {/* Backup & Restore Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
            {t('backupRestore')}
          </h2>
          
          <div className="space-y-4">
            {/* Export Section */}
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-1">
                  {t('exportFlashcards')}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  {t('exportDescription')}
                </p>
                <button
                  onClick={handleExport}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('exportFlashcards')}
                </button>
              </div>
            </div>

            {/* Import Section */}
            <div className="flex items-start space-x-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex-1">
                <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-1">
                  {t('importFlashcards')}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  {t('importDescription')}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <button
                  onClick={triggerFileInput}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t('selectFile')}
                </button>
              </div>
            </div>
          </div>
        </div>

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

        {/* Study Settings */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
            {t('studySettings')}
          </h2>
          
          <div className="space-y-6">
            {/* Card Change Sound Setting */}
            <div>
              <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-2">
                {t('cardChangeSound')}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                {t('cardChangeSoundDescription')}
              </p>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={theme.cardChangeSoundEnabled}
                  onChange={(e) => handleSoundToggle(e.target.checked)}
                  className="mr-3"
                />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {t('enableCardChangeSound')}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;