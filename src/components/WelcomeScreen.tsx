import React, { useState, useCallback } from 'react';
import { requestNotificationPermission } from '../firebase';

interface WelcomeScreenProps {
  onFinish: () => void;
}

const messages = [
  'Welcome to FlashLingo! Boost your vocabulary with fun flashcards.',
  'Swipe through images, listen to audio, and master new words.',
  'Track your progress anywhere – even offline. Let\'s get started!'
];

const VAPID_KEY = "BP8Cs5f7FOuYwWub76EhOv9_bYmgSdyURf8vu-LhX26NXWK_jenzKSujh4QTudoSK9Bs7Z52HBpIWgFzo213RvI";

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const [index, setIndex] = useState(0);

  const handleNext = useCallback(() => {
    if (index < messages.length - 1) {
      setIndex(idx => idx + 1);
    } else {
      onFinish();
    }
  }, [index, onFinish]);

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
      <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">Tap or swipe to continue</p>
      <button
        onClick={() => requestNotificationPermission(VAPID_KEY)}
        style={{ marginTop: 16, padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 4 }}
      >
        Allow Notifications
      </button>
    </div>
  );
};

export default WelcomeScreen; 