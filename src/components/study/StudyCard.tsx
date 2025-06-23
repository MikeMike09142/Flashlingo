import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Flashcard } from '../../types/index';
import { Volume2, ArrowRight, Check, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import ImageWithFallback from '../ui/ImageWithFallback';

interface StudyCardProps {
  flashcard: Flashcard;
  onKnow: () => void;
  onDontKnow: () => void;
  isProcessing?: boolean;
}

const StudyCard: React.FC<StudyCardProps> = ({ flashcard, onKnow, onDontKnow, isProcessing }) => {
  const { categories, studyMode, studyTargetLanguage } = useAppContext();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null);
  
  const [{ y, rotate, scale }, api] = useSpring(() => ({
    y: 0,
    rotate: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

  // Reset card state when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
    setIsTransitioning(false);
    setSwipeDirection(null);
    api.start({ y: 0, rotate: 0, scale: 1 });
  }, [flashcard.id, api]);

  const handleFlip = useCallback((e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    if (isTransitioning) return;
    setIsFlipped(f => !f);
  }, [isTransitioning]);

  // Vertical swipe gesture for mobile
  const bind = useDrag(
    ({ down, movement: [mx, my], direction: [xDir, yDir], velocity: [vx, vy] }) => {
      const trigger = vy > 0.2; // Vertical velocity threshold
      const horizontalThreshold = Math.abs(mx) < 100; // Prevent horizontal swipes from triggering
      
      if (!down && trigger && horizontalThreshold) {
        const dir = yDir < 0 ? -1 : 1; // Up -1 (I know), Down 1 (I don't know)
        
        // Haptic feedback for mobile devices
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        if (dir === -1) {
          // Swipe up - I know
          setSwipeDirection('up');
          onKnow();
          api.start({
            y: -window.innerHeight,
            rotate: -20,
            scale: 0.8,
            config: { friction: 50, tension: 200 },
          });
        } else {
          // Swipe down - I don't know
          setSwipeDirection('down');
          onDontKnow();
          api.start({
            y: window.innerHeight,
            rotate: 20,
            scale: 0.8,
            config: { friction: 50, tension: 200 },
          });
        }
      } else {
        // During drag or reset
        const yMovement = down ? my : 0;
        const rotation = down ? my / 20 : 0; // Gentle rotation during drag
        const scaleValue = down ? 1 - Math.abs(my) / 1000 : 1; // Slight scale effect
        
        // Set swipe direction for visual feedback
        if (down && Math.abs(my) > 30) {
          setSwipeDirection(my < 0 ? 'up' : 'down');
        } else if (!down) {
          setSwipeDirection(null);
        }
        
        api.start({ 
          y: yMovement, 
          rotate: rotation, 
          scale: scaleValue,
          config: { friction: 50, tension: 500 } 
        });
      }
    },
    { 
      filterTaps: true, 
      rubberband: true,
      bounds: { top: -100, bottom: 100 }, // Limit vertical movement
      axis: 'y' // Restrict to vertical movement
    }
  );

  const handlePronounceWord = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(flashcard.englishWord);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [flashcard.englishWord]);

  const handlePronounceEnglishSentence = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(flashcard.englishSentence);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [flashcard.englishSentence]);

  const handlePronounceTargetTranslation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const text = studyTargetLanguage === 'french' ? flashcard.frenchTranslation : flashcard.spanishTranslation;
    const lang = studyTargetLanguage === 'french' ? 'fr-FR' : 'es-ES';
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  }, [flashcard.spanishTranslation, flashcard.frenchTranslation, studyTargetLanguage]);

  const handlePronounceTargetSentence = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const text = studyTargetLanguage === 'french' ? flashcard.frenchSentence : flashcard.spanishSentence;
    const lang = studyTargetLanguage === 'french' ? 'fr-FR' : 'es-ES';
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  }, [flashcard.spanishSentence, flashcard.frenchSentence, studyTargetLanguage]);

  const categoriesList = (flashcard.categoryIds ?? [])
    .map((id: string) => categories.find((cat: any) => cat.id === id))
    .filter((cat: any) => cat !== undefined);

  // Get target language content
  const targetTranslation = studyTargetLanguage === 'french' ? flashcard.frenchTranslation : flashcard.spanishTranslation;
  const targetSentence = studyTargetLanguage === 'french' ? flashcard.frenchSentence : flashcard.spanishSentence;
  const targetLang = studyTargetLanguage === 'french' ? 'fr-FR' : 'es-ES';
  const targetLangName = studyTargetLanguage === 'french' ? 'French' : 'Spanish';

  if (!isFlipped) return (
    <div className="max-w-2xl mx-auto relative pb-20 swipe-container">
      {/* Swipe indicators */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'up' 
            ? 'bg-green-600 text-white scale-110 shadow-lg' 
            : 'bg-green-500 text-white'
        }`}>
          <Check size={16} className="mr-1" />
          I Know
        </div>
        <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'down' 
            ? 'bg-red-600 text-white scale-110 shadow-lg' 
            : 'bg-red-500 text-white'
        }`}>
          <X size={16} className="mr-1" />
          I Don't Know
        </div>
      </div>
      
      <animated.div
        {...bind()}
        style={{ y, rotate, scale }}
        className={`rounded-xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing swipe-card transition-colors duration-200 ${
          swipeDirection === 'up' 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : swipeDirection === 'down' 
            ? 'bg-red-50 dark:bg-red-900/20'
            : 'bg-white dark:bg-neutral-800'
        }`}
        onClick={handleFlip}
        tabIndex={0}
        role="button"
        aria-label={`Tap to see ${targetLangName} translation`}
      >
        <div className="p-6" style={{ minHeight: '300px' }}>
          {/* Front side */}
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex justify-end space-x-2">
              {categoriesList.map((category: any) => (
                <span
                  key={category!.id}
                  className="px-2 py-1 text-xs rounded-full text-white"
                  style={{ backgroundColor: category!.color }}
                >
                  {category!.name}
                </span>
              ))}
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              {flashcard.imageUrl && (
                <ImageWithFallback
                  src={flashcard.imageUrl}
                  alt="Flashcard"
                  className="max-h-48 mb-4 rounded-lg object-cover"
                  fallbackText="Imagen no disponible"
                />
              )}
              
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{flashcard.englishWord}</h2>
                <button
                  onClick={handlePronounceWord}
                  className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="text-center text-neutral-500 dark:text-neutral-400">
              <p>Tap to see translation • Swipe up/down to answer</p>
              <ArrowRight className="mx-auto mt-2" size={20} />
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto relative pb-20 swipe-container">
      {/* Swipe indicators */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'up' 
            ? 'bg-green-600 text-white scale-110 shadow-lg' 
            : 'bg-green-500 text-white'
        }`}>
          <Check size={16} className="mr-1" />
          I Know
        </div>
        <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'down' 
            ? 'bg-red-600 text-white scale-110 shadow-lg' 
            : 'bg-red-500 text-white'
        }`}>
          <X size={16} className="mr-1" />
          I Don't Know
        </div>
      </div>
      
      <animated.div
        {...bind()}
        style={{ y, rotate, scale }}
        className={`rounded-xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing swipe-card transition-colors duration-200 ${
          swipeDirection === 'up' 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : swipeDirection === 'down' 
            ? 'bg-red-50 dark:bg-red-900/20'
            : 'bg-white dark:bg-neutral-800'
        }`}
        onClick={handleFlip}
        tabIndex={0}
        role="button"
        aria-label="Tap to see English word"
      >
        <div className="p-6" style={{ minHeight: '300px' }}>
          {/* Back side */}
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex justify-end space-x-2">
              {categoriesList.map((category: any) => (
                <span
                  key={category!.id}
                  className="px-2 py-1 text-xs rounded-full text-white"
                  style={{ backgroundColor: category!.color }}
                >
                  {category!.name}
                </span>
              ))}
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{targetTranslation}</h2>
                <button
                  onClick={handlePronounceTargetTranslation}
                  className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              
              {targetSentence && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{targetSentence}</p>
                  <button
                    onClick={handlePronounceTargetSentence}
                    className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-center text-neutral-500 dark:text-neutral-400">
              <p>Tap to see English word • Swipe up/down to answer</p>
              <ArrowRight className="mx-auto mt-2" size={20} />
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default StudyCard;