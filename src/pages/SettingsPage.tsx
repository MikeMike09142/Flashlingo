import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AlertTriangle } from 'lucide-react';
import BulkImport from '../components/import/BulkImport';

const SettingsPage: React.FC = () => {
  const { 
    studyTargetLanguage, 
    setStudyTargetLanguage,
    setCreationTargetLanguage,
    theme,
    updateStudyTimerSettings,
    updateCardChangeSound
  } = useAppContext();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const handleLanguageChange = (language: 'spanish' | 'french') => {
    setStudyTargetLanguage(language);
    setCreationTargetLanguage(language);
  };

  const handleTimerDurationChange = (duration: number) => {
    updateStudyTimerSettings(theme.studyTimerEnabled, duration);
  };

  const handleTimerEnabledChange = (enabled: boolean) => {
    updateStudyTimerSettings(enabled, theme.studyTimerDuration);
  };

  const handleCardChangeSoundChange = (enabled: boolean) => {
    updateCardChangeSound(enabled);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Settings</h1>
        <p className="text-neutral-600">Manage your preferences and data</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-lg font-semibold text-neutral-800">Data</h2>
          
          <div className="space-y-6">
            {/* Bulk Import Section */}
            <div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 mb-2">Importar Flashcards</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Importa múltiples flashcards desde un archivo CSV o JSON.
              </p>
              <BulkImport />
            </div>

            {/* Language Settings Section */}
            <div>
              <h3 className="font-medium text-neutral-700 mb-2">Language Settings</h3>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-neutral-700 mb-1">
                    Target Language
                  </label>
                  <select
                    id="language"
                    value={studyTargetLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value as 'spanish' | 'french')}
                    className="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="spanish">English</option>
                    <option value="french">French</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Study Timer Settings Section */}
            <div>
              <h3 className="font-medium text-neutral-700 mb-2">Study Timer Settings</h3>
              
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="timerEnabled"
                    checked={theme.studyTimerEnabled}
                    onChange={(e) => handleTimerEnabledChange(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label htmlFor="timerEnabled" className="text-sm font-medium text-neutral-700">
                    Enable Study Timer
                  </label>
                </div>

                {theme.studyTimerEnabled && (
                  <div>
                    <label htmlFor="timerDuration" className="block text-sm font-medium text-neutral-700 mb-1">
                      Timer Duration (seconds)
                    </label>
                    <input
                      type="number"
                      id="timerDuration"
                      min="5"
                      max="60"
                      value={theme.studyTimerDuration}
                      onChange={(e) => handleTimerDurationChange(Number(e.target.value))}
                      className="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-24"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sound Settings Section */}
            <div>
              <h3 className="font-medium text-neutral-700 mb-2">Sound Settings</h3>
              
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="cardChangeSound"
                    checked={theme.cardChangeSoundEnabled}
                    onChange={(e) => handleCardChangeSoundChange(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label htmlFor="cardChangeSound" className="text-sm font-medium text-neutral-700">
                    Enable Card Change Sound
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-neutral-700 mb-2">Local Storage</h3>
              <p className="text-sm text-neutral-500 mb-2">
                FlashLingo saves all your data in your browser's local storage.
              </p>
              <p className="text-sm text-neutral-500 mb-4">
                Clearing your browser data or using private browsing will make your data inaccessible.
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">About FlashLingo</h2>
          
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              FlashLingo is a modern flashcard application designed to help you learn English vocabulary 
              with Spanish translations.
            </p>
            <p className="text-sm text-neutral-600">
              Features include spaced repetition for optimized learning, natural pronunciation, 
              categories for organization, and progress tracking.
            </p>
            <p className="text-sm text-neutral-600">
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;