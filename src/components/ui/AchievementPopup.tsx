import React, { useEffect } from 'react';
import { Achievement } from '../../types';

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({ 
  achievement, 
  onClose, 
  autoClose = true, 
  autoCloseDelay = 5000 
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [onClose, autoClose, autoCloseDelay]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg max-w-md mx-4 animate-bounce">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-4xl mb-2">{achievement.icon || '🎉'}</div>
          <h2 className="text-2xl font-bold mb-2 text-center">Achievement Unlocked!</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 text-2xl">⭐</span>
            <span className="font-semibold text-lg text-center">{achievement.title || 'First Session Completed!'}</span>
          </div>
          <p className="text-center text-neutral-400 mb-4">{achievement.description || 'You have completed your first study session.'}</p>
          <button
            onClick={onClose}
            className="mt-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup; 