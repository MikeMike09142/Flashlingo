import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Flashcard, StudySession } from '../../types';
import { Volume2, ArrowRight, Check, X, Target, Clock, Mic, MicOff } from 'lucide-react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import ImageWithFallback from '../ui/ImageWithFallback';
import { playSound } from '../../pages/StudyPage';
import { useTranslation } from '../../hooks/useTranslation';

interface SessionStudyCardProps {
  session: StudySession;
  onSessionComplete: (session: StudySession) => void;
  onCardComplete: (cardId: string, knew: boolean) => void;
  onExitSession: () => void;
}

const SessionStudyCard: React.FC<SessionStudyCardProps> = ({
  session,
  onSessionComplete,
  onCardComplete,
  onExitSession
}) => {
  const { flashcards, categories, studyTargetLanguage, updateFlashcard, theme } = useAppContext();
  const { t } = useTranslation();
  
  const [currentCardIndex, setCurrentCardIndex] = useState(session.currentCardIndex);
  // Remove this line - it's the duplicate that's causing the issue
  // const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const pendingProgress = useRef<{ [cardId: string]: any }>({});
  const failCounts = useRef<{ [cardId: string]: number }>({});
  const hasStartedRef = useRef(false);
  const knownCardsRef = useRef<Set<string>>(new Set());
  const reviewPileCardsRef = useRef<string[] | null>(null);
  const [slowRevealStep, setSlowRevealStep] = useState(0);
  const [reviewPile, setReviewPile] = useState<string[]>([]);
  const [isReviewRound, setIsReviewRound] = useState(false);
  const hasInitializedRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'success' | 'fail'>('none');
  let recognitionRef = useRef<any>(null);
  const [frontLearning, setFrontLearning] = useState<boolean>(() => {
    const saved = localStorage.getItem('frontLearning');
    return saved ? saved === 'true' : true; // default: learning language al frente
  });
  const [showImages, setShowImages] = useState<boolean>(() => {
    const saved = localStorage.getItem('recognitionShowImages');
    return saved !== 'false'; // default true
  });
  
  // Keep this line - it's the correct initialization
  const [isFlipped, setIsFlipped] = useState(() => !frontLearning);
  const [{ x, rotate, scale, opacity }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    config: { tension: 300, friction: 30 },
  }));

  // Refresca las tarjetas de la sesión solo cuando cambia la sesión (session.cards), sin tocar el índice
  useEffect(() => {
    // Solo refrescar la pila si NO estamos en review
    if (!isReviewRound) {
      const cards = session.cards
        .map(cardId => flashcards.find(card => card.id === cardId))
        .filter((card): card is Flashcard => card !== undefined);
      setSessionCards(cards);
      // NO modificar el currentCardIndex aquí
      // hasInitializedRef.current = false; // Esto solo se reinicia al terminar la sesión
    }
  }, [session.cards, flashcards]);

  // Reset card state when card changes
  useEffect(() => {
    console.log('[DEBUG] useEffect currentCardIndex changed:', {
      currentCardIndex,
      frontLearning,
      willSetIsFlipped: false, // Always start on front side
      timestamp: new Date().toISOString()
    });
    setIsTransitioning(false);
    setSwipeDirection(null);
    // Fix: Always start cards on the front side (isFlipped=false)
    setIsFlipped(false);
    api.start({ x: 0, rotate: 0, scale: 1, opacity: 1 });
  }, [currentCardIndex, api]); // Keep frontLearning out of dependencies!
  
  // Remove this entire useEffect - it's causing conflicts
  // useEffect(() => {
  //   // When user changes the Start: Front/Back preference, update current card
  //   setIsFlipped(!frontLearning);
  // }, [frontLearning]);
  
  // Solo resetea el índice si cambia la cantidad de tarjetas (nueva ronda o repaso)
  const prevSessionCardsLength = useRef(sessionCards.length);
  useEffect(() => {
    if (sessionCards.length !== prevSessionCardsLength.current) {
      console.log('[DEBUG] sessionCards.length changed:', {
        oldLength: prevSessionCardsLength.current,
        newLength: sessionCards.length,
        frontLearning,
        willSetIsFlipped: false, // Always start on front side
        timestamp: new Date().toISOString()
      });
      setCurrentCardIndex(0);
      // Fix: Always start new cards on the front side
      setIsFlipped(false);
      prevSessionCardsLength.current = sessionCards.length;
    }
  }, [sessionCards.length, frontLearning]);

  // Add debug logging for isFlipped state changes
  useEffect(() => {
    console.log('[DEBUG] isFlipped state changed:', {
      isFlipped,
      frontLearning,
      currentCardIndex,
      timestamp: new Date().toISOString()
    });
  }, [isFlipped, frontLearning, currentCardIndex]);

  // Add debug logging for frontLearning changes
  useEffect(() => {
    console.log('[DEBUG] frontLearning preference changed:', {
      frontLearning,
      currentCardIndex,
      currentIsFlipped: isFlipped,
      timestamp: new Date().toISOString()
    });
  }, [frontLearning]);

  const currentCard = sessionCards[currentCardIndex];
  const effectiveProgress = ((currentCardIndex + 1) / sessionCards.length) * 100;
  const effectiveTimeElapsed = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);

  // Prepare category and translation variables for use in all render paths
  const categoriesList = currentCard?.categoryIds
    ? currentCard.categoryIds
        .map(id => categories.find(cat => cat.id === id))
        .filter(cat => cat !== undefined)
    : [];
  const targetTranslation = studyTargetLanguage === 'french' ? currentCard?.frenchTranslation : currentCard?.spanishTranslation;
  const targetSentence = studyTargetLanguage === 'french' ? currentCard?.frenchSentence : currentCard?.spanishSentence;

  // Add a helper to refresh sessionCards from global flashcards
  const refreshSessionCards = useCallback(() => {
    const updatedCards = session.cards
      .map(cardId => flashcards.find(card => card.id === cardId))
      .filter((card): card is Flashcard => card !== undefined);
    setSessionCards(updatedCards);
  }, [flashcards, session.cards]);

  const handleFlip = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if(e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (isTransitioning) {
      console.log('[DEBUG] handleFlip blocked - isTransitioning:', isTransitioning);
      return;
    }
    
    console.log('[DEBUG] handleFlip called:', {
      currentIsFlipped: isFlipped,
      willToggleTo: !isFlipped,
      frontLearning,
      timestamp: new Date().toISOString()
    });
    
    // Set transitioning to prevent useEffect interference
    setIsTransitioning(true);
    setIsFlipped(f => !f);
    
    // Reset transitioning after a brief moment
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning, isFlipped, frontLearning]);

  const moveToNextCard = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    console.log('[DEBUG] moveToNextCard called:', {
      currentCardIndex,
      frontLearning,
      willSetIsFlipped: false, // Always start on front side
      timestamp: new Date().toISOString()
    });
    // Fix: Always start new cards on the front side
    setIsFlipped(false);
    setCurrentCardIndex(prev => prev + 1);
    if (theme.cardChangeSoundEnabled) {
      try {
        console.log('[DEBUG] Intentando reproducir sonido de cambio de tarjeta...');
        playSound('playSound.mp3');
      } catch (err) {
        alert('Error al intentar reproducir el sonido: ' + err);
        console.error('Error al intentar reproducir el sonido:', err);
      }
    }
  }, [theme, frontLearning]);

  // Add debug logging for card progression
  useEffect(() => {
    console.log('[DEBUG] useEffect: currentCardIndex:', currentCardIndex, 'sessionCards:', sessionCards.map(c => c.id).join(','));
  }, [currentCardIndex, sessionCards]);

  const handleKnow = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;
    if (session.mode !== 'freestyle_review') {
      hasStartedRef.current = true;
      setReviewPile(prev => prev.filter(id => id !== currentCard.id));
      onCardComplete(currentCard.id, true);
    }
    moveToNextCard();
  }, [currentCard, onCardComplete, moveToNextCard, session.mode]);

  const handleDontKnow = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;

    if (session.mode !== 'freestyle_review') {
      hasStartedRef.current = true;
      
      const progress = currentCard.studyProgress?.[studyTargetLanguage] || { studyLevel: 0, recognitionLevel: 0 };
      const levelKey = session.mode === 'image' ? 'recognitionLevel' : 'studyLevel';
      const level = progress[levelKey];

      if (level < 3) {
          setReviewPile(prev => (prev.includes(currentCard.id) ? prev : [...prev, currentCard.id]));
      }
      onCardComplete(currentCard.id, false);
    }
    moveToNextCard();
  }, [currentCard, onCardComplete, moveToNextCard, studyTargetLanguage, session.mode]);

  // Swipe gesture handling
  const bind = useDrag(
    ({ down, movement: [mx, my], direction: [xDir, yDir], velocity: [vx, vy] }) => {
      const trigger = Math.abs(mx) > 100 || (Math.abs(vx) > 0.5 && Math.abs(mx) > 50);
      
      if (!down && trigger) {
        const dir = xDir < 0 ? -1 : 1;
        
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        const animateOut = (direction: 'left' | 'right') => {
          api.start({
            x: direction === 'right' ? window.innerWidth : -window.innerWidth,
            rotate: direction === 'right' ? 20 : -20,
            scale: 0.9,
            opacity: 0,
            config: { friction: 50, tension: 200 },
          });
        };
        
        setSwipeDirection(dir === 1 ? 'right' : 'left');
        
        if (dir === 1) { // Swipe right
          handleKnow();
        } else { // Swipe left
          handleDontKnow();
        }
        animateOut(dir === 1 ? 'right' : 'left');

      } else {
        const xMovement = down ? mx : 0;
        const rotation = down ? mx / 20 : 0;
        const scaleValue = down ? 1 - Math.abs(mx) / 1000 : 1;
        
        if (down && Math.abs(mx) > 20) {
          setSwipeDirection(mx < 0 ? 'left' : 'right');
        } else if (!down) {
          setSwipeDirection(null);
        }
        
        api.start({ 
          x: xMovement, 
          rotate: rotation, 
          scale: scaleValue,
          opacity: 1,
          config: { friction: 50, tension: 500 } 
        });
      }
    },
    { 
      filterTaps: false,
      rubberband: true,
      bounds: { left: -300, right: 300 },
      axis: 'x',
      threshold: 10,
      delay: 0
    }
  );

  const handlePronounceWord = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    const utterance = new SpeechSynthesisUtterance(currentCard.englishWord);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [currentCard]);

  const handlePronounceSentence = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    if (currentCard.englishSentence) {
      const utterance = new SpeechSynthesisUtterance(currentCard.englishSentence);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, [currentCard]);

  const handlePronounceTargetTranslation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    const text = studyTargetLanguage === 'french' ? currentCard.frenchTranslation : currentCard.spanishTranslation;
    const lang = studyTargetLanguage === 'french' ? 'fr-FR' : 'es-ES';
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentCard, studyTargetLanguage]);

  const handlePronounceTargetSentence = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    const text = studyTargetLanguage === 'french' ? currentCard.frenchSentence : currentCard.spanishSentence;
    const lang = studyTargetLanguage === 'french' ? 'fr-FR' : 'es-ES';
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentCard, studyTargetLanguage]);

  // If the user exits the session early, discard all pending progress
  const handleExitSession = useCallback(() => {
    pendingProgress.current = {};
    onExitSession();
  }, [onExitSession]);

  // Add a useEffect to handle session completion after every update
  useEffect(() => {
    console.log('[DEBUG][EFFECT] currentCardIndex:', currentCardIndex, 'sessionCards:', sessionCards.map(c => c.id).join(','), 'reviewPile:', reviewPile, 'isReviewRound:', isReviewRound, 'hasInitializedRef:', hasInitializedRef.current);
    // Solo reiniciar la pila original al inicio real de la sesión (cuando currentCardIndex === 0, sessionCards está vacío, no estamos en review y no se ha inicializado)
    if (
      sessionCards.length === 0 &&
      !isReviewRound &&
      currentCardIndex === 0 &&
      !hasInitializedRef.current
    ) {
      console.log('[DEBUG][INIT] Reiniciando pila original de tarjetas');
      const cards = session.cards
        .map(cardId => flashcards.find(card => card.id === cardId))
        .filter((card): card is Flashcard => card !== undefined);
      setSessionCards(cards);
      setCurrentCardIndex(0);
      setIsReviewRound(false);
      setReviewPile([]);
      hasInitializedRef.current = true;
      return;
    }

    // Cuando se terminan todas las tarjetas de la ronda actual
    if (currentCardIndex >= sessionCards.length) {
      if (reviewPile.length > 0) {
        console.log('[DEBUG][REVIEW] Iniciando ronda de repaso solo con las tarjetas falladas:', reviewPile);
        // Iniciar una nueva ronda de repaso solo con las tarjetas falladas
        const reviewCards = reviewPile
          .map(cardId => flashcards.find(card => card.id === cardId))
          .filter((card): card is Flashcard => card !== undefined);
        setSessionCards(reviewCards);
        setCurrentCardIndex(0);
        setIsReviewRound(true);
        setReviewPile([]); // Limpiar para la siguiente ronda
        return;
      } else {
        console.log('[DEBUG][COMPLETE] No hay más tarjetas para repasar, la sesión termina');
        // No hay más tarjetas para repasar, la sesión termina
        Object.entries(pendingProgress.current).forEach(([cardId, studyProgress]) => {
          if (knownCardsRef.current.has(cardId)) {
            const langProgress = studyProgress[studyTargetLanguage] || {};
            if (!langProgress.level || langProgress.level < 3) {
              studyProgress[studyTargetLanguage] = { ...langProgress, level: 3 };
            }
          }
          updateFlashcard(cardId, { studyProgress });
        });
        pendingProgress.current = {};
        const completedSession = {
          ...session,
          isCompleted: true,
          completedAt: new Date().toISOString(),
          completedCards: session.cards,
        };
        if (sessionCards.length > 0) {
          onSessionComplete(completedSession);
        }
        // Llama a la función de onComplete si existe
        session.onComplete?.();
        knownCardsRef.current = new Set();
        setIsReviewRound(false);
        // Permitir reinicio en una nueva sesión si el usuario vuelve a empezar
        hasInitializedRef.current = false;
      }
    }
  }, [
    currentCardIndex,
    sessionCards,
    reviewPile,
    isReviewRound,
    flashcards,
    session,
    studyTargetLanguage,
    updateFlashcard,
    onSessionComplete
  ]);

  // Debug: log every update to currentCardIndex
  useEffect(() => {
    console.log('[DEBUG] currentCardIndex updated:', currentCardIndex);
  }, [currentCardIndex]);

  const expectedWord = currentCard?.englishWord?.toLowerCase().trim();

  // Limpiar feedback y recognizedText solo cuando cambie la tarjeta
  useEffect(() => {
    setRecognizedText('');
    setFeedback('none');
  }, [currentCardIndex]);

  const handleStartRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('La API de reconocimiento de voz no está soportada en este navegador.');
      return;
    }
    setIsRecording(true);
    setFeedback('none');
    setRecognizedText('');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase().trim();
      setRecognizedText(text);
      // Nueva lógica: aceptar repeticiones accidentales y evitar error si está vacío
      if (!text) {
        setFeedback('none'); // No mostrar error si no se reconoció nada
      } else {
        const expected = expectedWord;
        const words = text.split(/\s+/).filter(Boolean);
        const allMatch = words.length > 0 && words.every((w: string) => w === expected);
        if (expected && allMatch) {
          setFeedback('success');
        } else {
          setFeedback('fail');
        }
      }
      setIsRecording(false);
    };
    recognition.onerror = () => {
      setIsRecording(false);
      setFeedback('fail');
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleFrontLanguage = useCallback(() => {
    setFrontLearning(prev => {
      localStorage.setItem('frontLearning', (!prev).toString());
      return !prev;
    });
  }, []);

  const toggleShowImages = useCallback(() => {
    setShowImages(prev => {
      localStorage.setItem('recognitionShowImages', (!prev).toString());
      return !prev;
    });
  }, []);

  if (!currentCard) {
    return (
      <div
        className="flex flex-1 justify-center items-center w-full min-h-screen bg-neutral-100 dark:bg-neutral-900 px-2 sm:px-0"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
          overflow: 'hidden',
        }}
      >
        <p className="text-neutral-500">No more cards to review.</p>
      </div>
    );
  }

  // Determina el modo de la sesión
  const sessionMode = session.mode || 'default';

  // --------- Cálculo del idioma frontal/trasero basado en preferencia ---------
  const learningWord = studyTargetLanguage === 'spanish'
    ? currentCard?.spanishTranslation || ''
    : studyTargetLanguage === 'french'
    ? currentCard?.frenchTranslation || ''
    : '';

  const learningSentence = studyTargetLanguage === 'spanish'
    ? currentCard?.spanishSentence || ''
    : studyTargetLanguage === 'french'
    ? currentCard?.frenchSentence || ''
    : '';

  const learningLang = studyTargetLanguage === 'spanish'
    ? 'es-ES'
    : studyTargetLanguage === 'french'
    ? 'fr-FR'
    : '';

  const englishWordOnly = currentCard?.englishWord || '';
  const englishSentenceOnly = currentCard?.englishSentence || '';

  // Fixed logic:
  // frontLearning=true ("Start: Front"): front shows Spanish, back shows English
  // frontLearning=false ("Start: Back"): front shows English, back shows Spanish
  const showLearningLanguage = frontLearning ? !isFlipped : isFlipped;
  
  let word = showLearningLanguage ? learningWord : englishWordOnly;
  let sentence = showLearningLanguage ? learningSentence : englishSentenceOnly;
  let lang = showLearningLanguage ? learningLang : 'en-US';
  
  // Remove the image mode override that was breaking "Start: Back" mode
  // The base logic above already handles frontLearning preference correctly
  // No special handling needed for image mode

  const showText = !(sessionMode === 'image' && !isFlipped);

  console.log('[DEBUG] render index', currentCardIndex, 'isFlipped', isFlipped, 'targetLang', studyTargetLanguage, 'word', word);

  return (
    <div
      className="flex flex-1 justify-center items-center w-full min-h-screen bg-neutral-100 dark:bg-neutral-900 px-2 sm:px-0"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        overflow: 'hidden',
      }}
    >
      {/* Session Header */}
      <div className="absolute top-0 left-0 right-0 mt-3 mb-2 z-10 w-full flex flex-col items-center px-2 sm:px-4 md:px-0 md:mt-6 md:mb-8 md:space-y-2 session-header">
        <div className="flex items-center justify-center w-full mb-2 md:mb-6">
          <button
            onClick={handleExitSession}
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            ← {t('exitSession')}
          </button>
          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {Math.floor(effectiveTimeElapsed / 60)}:{(effectiveTimeElapsed % 60).toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              {currentCardIndex + 1} of {sessionCards.length}
            </div>
            {sessionMode === 'image' && (
              <button
                onClick={toggleShowImages}
                className="px-3 py-1 text-xs rounded-full border border-neutral-500 dark:border-neutral-400 text-neutral-300 dark:text-neutral-300 active:scale-95 transition"
              >
                {showImages ? t('hideImages') : t('showImages')}
              </button>
            )}
            <button
              onClick={toggleFrontLanguage}
              className="px-4 py-2 text-sm rounded-full border border-neutral-500 dark:border-neutral-400 text-neutral-300 dark:text-neutral-300 active:scale-95 transition font-medium"
            >
              {frontLearning ? t('startFront') : t('startBack')}
            </button>
          </div>
          </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-4 mt-2 progress-bar">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${effectiveProgress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm select-none mt-2">
          {/* Eliminar la línea que muestra el número de sesión */}
        </div>
      </div>

      {/* Card */}
      <animated.div
        key={currentCardIndex}
        {...bind()}
        style={{ 
          x, 
          rotate, 
          scale, 
          touchAction: 'pan-y', 
          opacity,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          height: 'calc(100dvh - 200px)',
          minHeight: '400px',
        }}
        className={`w-full sm:max-w-[400px] mx-auto self-center rounded-xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing swipe-card transition-colors duration-200 select-none flex flex-col bg-white dark:bg-neutral-800`}
        tabIndex={0}
        role="button"
        aria-label="Tap to see translation"
        onClick={handleFlip}
      >
        <div className="w-full h-full flex flex-col items-center gap-y-2 bg-white dark:bg-neutral-800 p-2 sm:p-6 rounded-xl select-none">
            
            {/* Force image display in landscape mode */}
            {((sessionMode !== 'image' || showImages) && currentCard.imageUrl) && (
            <div className="mb-2 sm:mb-4 w-40 h-40 sm:w-60 sm:h-60 rounded-lg overflow-hidden study-card-image mobile-landscape-image">
                <ImageWithFallback
                  src={currentCard.imageUrl}
                  alt={word}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {showText && (
            <div className="text-center select-none">
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 select-none truncate card-title">{word}</h2>
              </div>
            )}
          <div className="text-center select-none flex flex-row items-center justify-center gap-2 mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.lang = lang;
                window.speechSynthesis.speak(utterance);
              }}
              className="p-3 rounded-full bg-sky-500/20 hover:bg-sky-500/30 transition-colors audio-button"
              aria-label="Pronounce word"
            >
              <Volume2 size={24} className="text-sky-600" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.lang = lang;
                utterance.rate = 0.5;
                window.speechSynthesis.speak(utterance);
              }}
              className="p-3 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors ml-1 audio-button"
              aria-label="Pronounce word slowly"
              title="Slow audio"
            >
              <span role="img" aria-label="slow">🐌</span>
            </button>
          </div>
            {sentence && (
            <div className="mt-4 text-center select-none flex flex-row items-center justify-center gap-2 sentence-container">
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mb-1 sm:mb-2 select-none break-words">{showText ? sentence : ''}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const utterance = new SpeechSynthesisUtterance(sentence);
                  utterance.lang = lang;
                  window.speechSynthesis.speak(utterance);
                }}
                className="p-2.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 transition-colors audio-button"
                aria-label="Pronounce sentence"
              >
                <Volume2 size={20} className="text-sky-600" />
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  const utterance = new SpeechSynthesisUtterance(sentence);
                  utterance.lang = lang;
                  utterance.rate = 0.5;
                  window.speechSynthesis.speak(utterance);
                }}
                className="p-2.5 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors ml-1 audio-button"
                aria-label="Pronounce sentence slowly"
                title="Slow audio"
              >
                <span role="img" aria-label="slow">🐌</span>
              </button>
            </div>
            )}
          {/* Botones de acción + instrucciones */}
          <div className="w-full">
            <div className={`flex flex-row gap-4 mt-2 w-[320px] max-w-full mx-auto action-buttons ${
              sessionMode === 'freestyle_review' ? 'justify-center' : 'justify-between'
            }`}>
              {sessionMode === 'freestyle_review' ? (
                <button
                  onClick={(e) => !isTransitioning && moveToNextCard(e)}
                  className="flex items-center justify-center px-1 py-4 w-full max-w-[140px] rounded-xl bg-orange-500 text-white text-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors"
                  aria-label={t('cardReviewed')}
                >
                  <Check size={28} className="mr-2" /> {t('cardReviewed')}
                </button>
              ) : (
                <>
                  <button
                    onClick={(e) => handleDontKnow(e)}
                    className="flex items-center justify-center px-1 py-4 w-1/2 max-w-[140px] rounded-xl bg-red-600 text-white text-lg font-semibold shadow-lg hover:bg-red-700 transition-colors"
                    aria-label={t('iDontKnow')}
                  >
                    <X size={28} />
                  </button>
                  <button
                    onClick={(e) => handleKnow(e)}
                    className="flex items-center justify-center px-1 py-4 w-1/2 max-w-[140px] rounded-xl bg-green-600 text-white text-lg font-semibold shadow-lg hover:bg-green-700 transition-colors"
                    aria-label={t('iKnow')}
                  >
                    <Check size={28} />
                  </button>
                </>
              )}
            </div>
            <div className="text-center text-neutral-500 dark:text-neutral-400 select-none mt-2">
              <p className="select-none text-xs sm:text-sm">
                {!isFlipped 
                ? `${t('tapToSeeTranslation')} • ${t('swipeOrUseButtons')}` 
                : `${t('tapToReturn')} • ${t('swipeOrUseButtons')}`
              }
            </p>
            <ArrowRight className="mx-auto mt-2" size={20} />
          </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default SessionStudyCard;


