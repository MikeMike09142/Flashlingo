import React, { useState, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface WelcomeScreenProps {
  onFinish: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const messages = [
    t('welcomeMessage1'),
    t('welcomeMessage2'),
    t('welcomeMessage3'),
    t('welcomeMessage4')
  ];

  const handleNext = useCallback(() => {
    if (index < messages.length - 1) {
      setIndex(idx => idx + 1);
    } else {
      onFinish();
    }
  }, [index, onFinish, messages.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 p-6 select-none"
      onClick={handleNext}
    >
      <div className="max-w-xs text-center text-lg font-medium leading-relaxed">
        {messages[index]}
      </div>
      <div className="mt-8 flex gap-2">
        {messages.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-blue-600 dark:bg-blue-400' : 'bg-blue-300 dark:bg-blue-700'}`}
          />
        ))}
      </div>
      <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">{t('tapToContinue')}</p>
    </div>
  );
};

export default WelcomeScreen;