import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import StudyCard from '../components/study/StudyCard';
import ProductionCard from '../components/study/ProductionCard';
import EnhancedStudySystem from '../components/study/EnhancedStudySystem';
import SessionStudyCard from '../components/study/SessionStudyCard';
import EmptyState from '../components/ui/EmptyState';
import { Check, BookOpen, Lock, Zap, Mic, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Flashcard, StudyModeOption, StudySession } from '../types';

// Función para reproducir sonido (asumiendo que el archivo está en /public)
export const playSound = (soundFileName: string) => {
  console.log('Attempting to play sound:', soundFileName);
  try {
    const audio = new Audio(`/${soundFileName}`);
    console.log('Audio object created for:', `/${soundFileName}`);
    audio.volume = 0.3;
    console.log('Audio volume set to:', audio.volume);
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    audio.play().catch((e) => {
      if (e.name !== 'AbortError') {
        console.error('Error playing sound:', soundFileName, e);
      }
    });
  } catch (error) {
    console.error('Error creating audio object or other sync error:', error);
  }
};

const SESSION_COMPLETE_KEY = 'studySessionComplete';

const LEVEL_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: 'A1', label: 'A1 BASIC' },
  { value: 'A2', label: 'A2 BASIC' },
];

const LEVEL_MAP: Record<string, string> = {
  'beginner': 'beginner',
};

const StudyPage: React.FC = () => {
  const { flashcards, updateFlashcard, setStudyMode, studyMode, studyTargetLanguage, categories } = useAppContext();
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  
  const flashcardsRef = useRef(flashcards);
  useEffect(() => {
    flashcardsRef.current = flashcards;
  }, [flashcards]);

  // Enhanced study system handlers
  const handleStartSession = (session: StudySession) => {
    if (!session.cards || session.cards.length === 0) {
      setSessionError('No cards available for this session. Please check your filters or add more cards.');
      return;
    }
    setSessionError(null);
    setCurrentSession(session);
  };

  const handleSessionComplete = (completedSession: StudySession) => {
    setCurrentSession(null);
  };

  const handleCardComplete = (cardId: string, knew: boolean) => {
    if (knew && currentSession) {
      const card = flashcardsRef.current.find(f => f.id === cardId);
      if (!card) return;

      const lang = studyTargetLanguage;
      const currentProgress = card.studyProgress?.[lang] || { studyLevel: 0, recognitionLevel: 0 };
      let updatedProgress = { ...currentProgress };

      switch (currentSession.mode) {
        case 'audio':
        case 'image':
          updatedProgress.recognitionLevel = (updatedProgress.recognitionLevel || 0) + 1;
          break;
        case 'freestyle_review':
          return; // Do not update progress for freestyle reviews
        default: // Study session
          updatedProgress.studyLevel = 1;
          break;
      }

      updateFlashcard(cardId, {
        studyProgress: {
          ...card.studyProgress,
          [lang]: {
            ...updatedProgress,
            lastReviewed: Date.now(),
          },
        },
      });
    }
  };

  const handleExitSession = () => {
    setCurrentSession(null);
  };

  // Render enhanced study system
  if (!currentSession) {
    return (
      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
              Enhanced Study System
            </h1>
          </div>
        </div>
        {sessionError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
            {sessionError}
          </div>
        )}
        <EnhancedStudySystem 
          onStartSession={handleStartSession} 
          />
      </div>
    );
  }

  // Render session study card
  if (currentSession) {
    return (
      <>
        <SessionStudyCard
          session={currentSession}
          onSessionComplete={handleSessionComplete}
          onCardComplete={handleCardComplete}
          onExitSession={handleExitSession}
        />
      </>
    );
  }

  return null;
};

export default StudyPage;