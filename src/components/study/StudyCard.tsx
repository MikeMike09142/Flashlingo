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
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  const [{ x, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

  // Reset card state when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
    setIsTransitioning(false);
    setSwipeDirection(null);
    api.start({ x: 0, rotate: 0, scale: 1 });
  }, [flashcard.id, api]);

  const handleFlip = useCallback((e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    if (isTransitioning) return;
    setIsFlipped(f => !f);
  }, [isTransitioning]);

  // Horizontal swipe gesture for mobile
  const bind = useDrag(
    ({ down, movement: [mx, my], direction: [xDir, yDir], velocity: [vx, vy] }) => {
      const trigger = vx > 0.1; // Horizontal velocity threshold
      const verticalThreshold = Math.abs(my) < 150; // Prevent vertical swipes from triggering
      const distanceThreshold = Math.abs(mx) > 80; // Distance threshold for easier triggering
      
      // Multiple ways to trigger the swipe
      const shouldTrigger = !down && verticalThreshold && (
        trigger || // Fast swipe with velocity
        distanceThreshold || // Slow swipe with distance
        Math.abs(mx) > 120 || // Very slow but long swipe
        Math.abs(mx) > 60 // Fallback: any significant horizontal movement
      );
      
      // Debug logging
      if (!down && Math.abs(mx) > 30) {
        console.log('Swipe Debug:', {
          velocity: vx,
          distance: Math.abs(mx),
          direction: xDir,
          vertical: Math.abs(my),
          trigger,
          distanceThreshold,
          shouldTrigger,
          verticalThreshold
        });
      }
      
      if (shouldTrigger) {
        const dir = xDir < 0 ? -1 : 1; // Left -1 (I don't know), Right 1 (I know)
        
        // Haptic feedback for mobile devices
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        if (dir === 1) {
          // Swipe right - I know
          setSwipeDirection('right');
          onKnow();
          api.start({
            x: window.innerWidth,
            rotate: 20,
            scale: 0.8,
            config: { friction: 50, tension: 200 },
          });
        } else {
          // Swipe left - I don't know
          setSwipeDirection('left');
          onDontKnow();
          api.start({
            x: -window.innerWidth,
            rotate: -20,
            scale: 0.8,
            config: { friction: 50, tension: 200 },
          });
        }
      } else {
        // During drag or reset
        const xMovement = down ? mx : 0;
        const rotation = down ? mx / 20 : 0; // Gentle rotation during drag
        const scaleValue = down ? 1 - Math.abs(mx) / 1000 : 1; // Slight scale effect
        
        // Set swipe direction for visual feedback
        if (down && Math.abs(mx) > 20) { // Reduced threshold for visual feedback
          setSwipeDirection(mx < 0 ? 'left' : 'right');
        } else if (!down) {
          setSwipeDirection(null);
        }
        
        api.start({ 
          x: xMovement, 
          rotate: rotation, 
          scale: scaleValue,
          config: { friction: 50, tension: 500 } 
        });
      }
    },
    { 
      filterTaps: true, 
      rubberband: true,
      bounds: { left: -300, right: 300 }, // Horizontal bounds
      axis: 'x', // Restrict to horizontal movement
      threshold: 10, // Very low threshold for starting the gesture
      delay: 0 // No delay
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
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'right' 
            ? 'bg-green-600 text-white scale-110 shadow-lg' 
            : 'bg-green-500 text-white'
        }`}>
          <Check size={16} className="mr-1" />
          I Know
        </div>
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'left' 
            ? 'bg-red-600 text-white scale-110 shadow-lg' 
            : 'bg-red-500 text-white'
        }`}>
          <X size={16} className="mr-1" />
          I Don't Know
        </div>
      </div>
      
      <animated.div
        {...bind()}
        style={{ x, rotate, scale }}
        className={`rounded-xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing swipe-card transition-colors duration-200 ${
          swipeDirection === 'right' 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : swipeDirection === 'left' 
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
              <p>Tap to see translation • Swipe left/right to answer</p>
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
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'right' 
            ? 'bg-green-600 text-white scale-110 shadow-lg' 
            : 'bg-green-500 text-white'
        }`}>
          <Check size={16} className="mr-1" />
          I Know
        </div>
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'left' 
            ? 'bg-red-600 text-white scale-110 shadow-lg' 
            : 'bg-red-500 text-white'
        }`}>
          <X size={16} className="mr-1" />
          I Don't Know
        </div>
      </div>
      
      <animated.div
        {...bind()}
        style={{ x, rotate, scale }}
        className={`rounded-xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing swipe-card transition-colors duration-200 ${
          swipeDirection === 'right' 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : swipeDirection === 'left' 
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
              <p>Tap to see English word • Swipe left/right to answer</p>
              <ArrowRight className="mx-auto mt-2" size={20} />
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default StudyCard;