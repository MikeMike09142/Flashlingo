import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BulkImport from '../components/import/BulkImport';
import { OneSignalNotification } from '../components/OneSignalNotification';

const SettingsPage: React.FC = () => {
  const { 
    theme,
    studyTargetLanguage,
    setStudyTargetLanguage,
    updateCardChangeSound,
  } = useAppContext();

  const handleCardChangeSoundChange = (enabled: boolean) => {
    updateCardChangeSound(enabled);
    localStorage.setItem('cardChangeSoundEnabled', enabled ? 'true' : 'false');
  };

  const handleLanguageChange = (language: 'spanish' | 'french') => {
    console.log('[SettingsPage] handleLanguageChange called with:', language);
    setStudyTargetLanguage(language);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-300">Manage your preferences and data</p>
      </div>
      
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Data</h2>
          
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 mb-2">Study Language</h3>
              <div className="space-y-4 mt-2">
                <div>
                  <label htmlFor="studyLanguage" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Target Language for Study
                  </label>
                  <select
                    id="studyLanguage"
                    value={studyTargetLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value as 'spanish' | 'french')}
                    className="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="spanish">English</option>
                    <option value="french">French</option>
                  </select>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Choose which language you want to study. This affects the translations shown during study sessions.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 mb-2">Sound Settings</h3>
              
              <div className="space-y-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="cardChangeSound"
                    checked={theme.cardChangeSoundEnabled}
                    onChange={(e) => handleCardChangeSoundChange(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label htmlFor="cardChangeSound" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Enable Card Change Sound
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 mb-2">Notifications</h3>
              <div className="mt-2">
                <OneSignalNotification />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-neutral-700 dark:text-neutral-200 mb-2">Local Storage</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                All your data (flashcards, categories, and progress) is saved automatically in your browser's local storage.
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                If you clear your browser data, all your progress will be lost.
              </p>
            </div>

            {studyTargetLanguage === 'french' && (
              <div className="mt-4 text-sm text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500 bg-blue-900 rounded p-3">
                <b>If you don't have French voice in your device:</b> To hear French pronunciation, please install a French voice in your device settings.<br />
                <b>Windows:</b> Settings &gt; Time &amp; Language &gt; Language &gt; Add a language &gt; French &gt; Options &gt; Download voice.<br />
                <b>Android:</b> Settings &gt; System &gt; Languages &amp; input &gt; Text-to-speech &gt; Install French voice.<br />
                <b>iOS:</b> Settings &gt; General &gt; Language &amp; Region &gt; Add language &gt; French.
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">About FlashLingo</h2>
          
          <div className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              FlashLingo is a modern flashcard application designed to help you learn vocabulary.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Version 1.1.0 (Local Only)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;