import { useState, useEffect } from 'react';
import { translations, TranslationKey, Language } from '../i18n/translations';

const getSystemLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('es')) {
    return 'es';
  }
  return 'en'; // Default to English
};

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('flashlingo-language');
    if (saved && (saved === 'en' || saved === 'es')) {
      return saved as Language;
    }
    return getSystemLanguage();
  });

  useEffect(() => {
    localStorage.setItem('flashlingo-language', language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return {
    t,
    language,
    changeLanguage,
    isSpanish: language === 'es'
  };
};