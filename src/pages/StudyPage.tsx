import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import StudyCard from '../components/study/StudyCard';
import ProductionCard from '../components/study/ProductionCard';
import EmptyState from '../components/ui/EmptyState';
import { Check, BookOpen, Lock, Zap, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Flashcard, StudyModeOption } from '../types';

// Función para reproducir sonido (asumiendo que el archivo está en /public)
const playSound = (soundFileName: string) => {
  console.log('Attempting to play sound:', soundFileName); // Log al inicio de la función
  try {
    const audio = new Audio(`/${soundFileName}`); // Ruta relativa a la carpeta public
    console.log('Audio object created for:', `/${soundFileName}`); // Log después de crear el objeto
    audio.volume = 0.3; // Reducir volumen al 50%
    console.log('Audio volume set to:', audio.volume);
    // Prevent overlapping play/pause
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    audio.play().catch((e) => {
      // Ignore AbortError
      if (e.name !== 'AbortError') {
        console.error('Error playing sound:', soundFileName, e);
      }
    });
  } catch (error) {
    console.error('Error creating audio object or other sync error:', error); // Log si falla al crear el objeto Audio
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

const StudyLevelSelector: React.FC<{ onSelectLevel: (level: number) => void }> = ({ onSelectLevel }) => {
  const { flashcards } = useAppContext();

  const levelCounts = useMemo(() => {
    const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0 };
    flashcards.forEach(card => {
      const level = card.studyProgress?.level || 1;
      if (counts[level] !== undefined) {
        counts[level]++;
      }
    });
    return counts;
  }, [flashcards]);

  const allLevel1Done = levelCounts[1] === 0;
  const allLevel2Done = allLevel1Done && levelCounts[2] === 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Elige un Nivel de Dificultad</h2>
      <button onClick={() => onSelectLevel(1)} className="w-full text-left p-4 border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition">
        <h3 className="font-semibold">Nivel 1: Aprendizaje Guiado</h3>
        <p className="text-sm text-neutral-500">Imagen + Palabra + Audio. Ideal para empezar.</p>
        <span className="text-xs">{levelCounts[1]} tarjetas disponibles</span>
      </button>
      <button onClick={() => onSelectLevel(2)} disabled={!allLevel1Done} className="w-full text-left p-4 border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
        <h3 className="font-semibold flex items-center">{!allLevel1Done && <Lock className="mr-2 h-4 w-4" />}Nivel 2: Reconocimiento</h3>
        <p className="text-sm text-neutral-500">Practica con solo imagen o solo audio.</p>
        <span className="text-xs">{levelCounts[2]} tarjetas disponibles</span>
      </button>
      <button onClick={() => onSelectLevel(3)} disabled={!allLevel2Done} className="w-full text-left p-4 border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
        <h3 className="font-semibold flex items-center">{!allLevel2Done && <Lock className="mr-2 h-4 w-4" />}Nivel 3: Producción Activa</h3>
        <p className="text-sm text-neutral-500">Usa tu voz para nombrar lo que ves o escuchas.</p>
        <span className="text-xs">{levelCounts[3]} tarjetas disponibles</span>
      </button>
    </div>
  );
};

const CompletionScreen: React.FC<{
  completedLevel: number;
  onNextLevel: (level: number) => void;
  onReset: () => void;
  onStudyAgain: (level: number) => void;
}> = ({ completedLevel, onNextLevel, onReset, onStudyAgain }) => {
  const { flashcards } = useAppContext();

  const nextLevel = completedLevel + 1;

  const isNextLevelUnlocked = useMemo(() => {
    if (completedLevel >= 3) return false;
    const cardsInCompletedLevel = flashcards.filter(c => (c.studyProgress?.level || 1) === completedLevel).length;
    return cardsInCompletedLevel === 0;
  }, [flashcards, completedLevel]);

  return (
    <div className="p-4 text-center flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold text-green-500 mb-4">¡Nivel {completedLevel} Completado!</h2>
      <p className="text-neutral-400 max-w-md mx-auto mb-8">
        ¡Felicidades! Has dominado todas las tarjetas de este nivel. Estás un paso más cerca de tus metas de aprendizaje.
      </p>
      
      <div className="w-full max-w-sm space-y-4">
        {nextLevel <= 3 && isNextLevelUnlocked && (
          <button
            onClick={() => onNextLevel(nextLevel)}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            Empezar Nivel {nextLevel}
          </button>
        )}
        <button
          onClick={() => onStudyAgain(completedLevel)}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Estudiar Nivel {completedLevel} de Nuevo
        </button>
        <button
          onClick={onReset}
          className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
        >
          Volver a la Selección de Niveles
        </button>
      </div>
    </div>
  );
};

const StudyPage: React.FC = () => {
  const { flashcards, updateFlashcard, setStudyMode, studyMode } = useAppContext();
  const [selectedStudyLevel, setSelectedStudyLevel] = useState<number | null>(null);
  const [recognitionMode, setRecognitionMode] = useState<'image_only' | 'audio_only' | null>(null);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [studyComplete, setStudyComplete] = useState(false);
  const reviewPileRef = useRef<Set<string>>(new Set());
  const [isReviewRound, setIsReviewRound] = useState(false);
  
  // Usamos una ref para tener la versión más actualizada de las flashcards sin causar un re-render del useEffect
  const flashcardsRef = useRef(flashcards);
  useEffect(() => {
    flashcardsRef.current = flashcards;
  }, [flashcards]);

  const initializeSession = useCallback((level: number) => {
    if (level === 2 && !recognitionMode) {
        setSessionCards([]);
        return;
    }
    
    const currentFlashcards = flashcardsRef.current;
    const filtered = currentFlashcards.filter(c => (c.studyProgress?.level || 1) === level);
    
    setSessionCards(filtered.sort(() => Math.random() - 0.5));
    setCurrentCardIndex(0);
    setStudyComplete(false);
    reviewPileRef.current.clear();
    setIsReviewRound(false);

    if (level === 1) setStudyMode('audio_image_text');
    else if (level === 2 && recognitionMode) setStudyMode(recognitionMode);
    else if (level === 3) setStudyMode('production');
  }, [recognitionMode, setStudyMode]);

  // Initialize or reinicia la sesión
  useEffect(() => {
    if (selectedStudyLevel !== null) {
      initializeSession(selectedStudyLevel);
    } else {
      setSessionCards([]);
    }
  }, [selectedStudyLevel, initializeSession]);

  const handleStudyAgain = (level: number) => {
    if (level === 2) {
      // For level 2, we need to show the recognition mode selector again
      setStudyComplete(false);
      setRecognitionMode(null);
      setSelectedStudyLevel(level); // Keep the level selected
    } else {
      initializeSession(level);
    }
  };

  const moveToNextCard = useCallback(() => {
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      const reviewCards = sessionCards.filter(card => reviewPileRef.current.has(card.id));

      if (reviewCards.length > 0) {
        reviewPileRef.current.clear();
        setSessionCards(reviewCards.sort(() => Math.random() - 0.5));
        setCurrentCardIndex(0);
        setIsReviewRound(true);
      } else {
        setStudyComplete(true);
      }
    }
  }, [currentCardIndex, sessionCards]);

  const handleKnow = useCallback(() => {
    const card = sessionCards[currentCardIndex];
    if (!card) return;
    
    reviewPileRef.current.delete(card.id);

    if (selectedStudyLevel === 1) {
      updateFlashcard(card.id, { studyProgress: { level: 2, consecutiveCorrect: 0 } });
    } else if (selectedStudyLevel === 2 || selectedStudyLevel === 3) {
      const progress = card.studyProgress || { level: selectedStudyLevel, consecutiveCorrect: 0 };
      const newConsecutive = progress.consecutiveCorrect + 1;
      
      if (newConsecutive >= 3) {
        if (selectedStudyLevel === 2) {
            updateFlashcard(card.id, { studyProgress: { level: 3, consecutiveCorrect: 0 } });
        } else {
            // Tarjeta dominada
            updateFlashcard(card.id, { studyProgress: { level: 4, consecutiveCorrect: 0 } });
        }
      } else {
        updateFlashcard(card.id, { studyProgress: { ...progress, consecutiveCorrect: newConsecutive } });
      }
    }
    moveToNextCard();
  }, [currentCardIndex, sessionCards, selectedStudyLevel, updateFlashcard, moveToNextCard]);

  const handleDontKnow = useCallback(() => {
    const card = sessionCards[currentCardIndex];
    if (!card) return;

    reviewPileRef.current.add(card.id);

    if (selectedStudyLevel === 2) {
      updateFlashcard(card.id, { studyProgress: { ...card.studyProgress, level: 2, consecutiveCorrect: 0 } });
    }
    moveToNextCard();
  }, [currentCardIndex, sessionCards, selectedStudyLevel, updateFlashcard, moveToNextCard]);

  const resetSession = () => {
    setSelectedStudyLevel(null);
    setRecognitionMode(null);
    setStudyMode('audio_image_text');
  };

  const currentCard = sessionCards[currentCardIndex];

  // Render principal del componente
  if (!selectedStudyLevel) {
    return (
      <div className="p-4">
        <StudyLevelSelector onSelectLevel={setSelectedStudyLevel} />
      </div>
    );
  }

  if (selectedStudyLevel === 2 && !recognitionMode) {
    return (
      <div className="p-4">
        <button onClick={resetSession} className="mb-4">&larr; Volver a niveles</button>
        <h2 className="text-xl font-bold mb-4">Nivel 2: Reconocimiento</h2>
        <p className="mb-4">Elige cómo quieres practicar.</p>
        <div className="space-y-4">
          <button onClick={() => setRecognitionMode('image_only')} className="w-full text-left p-4 border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition">
            <h3 className="font-semibold">Solo Imagen</h3>
            <p className="text-sm text-neutral-500">Se te mostrará una imagen y deberás reconocer la palabra.</p>
          </button>
          <button onClick={() => setRecognitionMode('audio_only')} className="w-full text-left p-4 border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition">
            <h3 className="font-semibold">Solo Audio</h3>
            <p className="text-sm text-neutral-500">Escucharás el audio y deberás reconocer la palabra.</p>
          </button>
        </div>
      </div>
    );
  }
  
  if (studyComplete || (selectedStudyLevel && sessionCards.length === 0 && !isReviewRound)) {
    return (
      <CompletionScreen
        completedLevel={selectedStudyLevel!}
        onNextLevel={(level) => {
          setRecognitionMode(null);
          setSelectedStudyLevel(level);
        }}
        onReset={resetSession}
        onStudyAgain={handleStudyAgain}
      />
    );
  }

  return (
    <div className="py-4">
      <div className="mb-6 px-4">
        <button onClick={resetSession} className="mb-4 text-sm text-primary-600 dark:text-primary-400">&larr; Cambiar de nivel</button>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Sesión de Estudio - Nivel {selectedStudyLevel}</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          {selectedStudyLevel === 1 && 'Aprendizaje Guiado: familiarízate con las tarjetas.'}
          {selectedStudyLevel === 2 && `Reconocimiento: modo ${recognitionMode === 'image_only' ? 'Solo Imagen' : 'Solo Audio'}.`}
          {selectedStudyLevel === 3 && 'Producción Activa: di la palabra en voz alta.'}
        </p>
        {isReviewRound && <p className="text-orange-400 font-semibold mt-1">Repasando las tarjetas que no sabías...</p>}
      </div>
      <div className="mb-4 text-center text-sm text-neutral-500">
        Tarjeta {currentCardIndex + 1} de {sessionCards.length}
      </div>
      {currentCard && (
        selectedStudyLevel === 3 ? (
          <ProductionCard
            flashcard={currentCard}
            onKnow={handleKnow}
            onDontKnow={handleDontKnow}
          />
        ) : (
          <StudyCard
            flashcard={currentCard}
            onKnow={handleKnow}
            onDontKnow={handleDontKnow}
          />
        )
      )}
    </div>
  );
};

export default StudyPage;