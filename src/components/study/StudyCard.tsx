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
  
  const [{ x, rotate, scale, opacity }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    config: { tension: 300, friction: 30 },
  }));

  // Reset card state when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
    setIsTransitioning(false);
    setSwipeDirection(null);
    api.start({ x: 0, rotate: 0, scale: 1, opacity: 1 });
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
            scale: 0.9,
            opacity: 0,
            config: { friction: 50, tension: 200 },
          });
        } else {
          // Swipe left - I don't know
          setSwipeDirection('left');
          onDontKnow();
          api.start({
            x: -window.innerWidth,
            rotate: -20,
            scale: 0.9,
            opacity: 0,
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
          opacity: 1,
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
    <div className="flex flex-1 justify-center items-center w-full min-h-screen bg-neutral-900 px-2 sm:px-0 relative swipe-container overflow-hidden" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
      {/* Swipe indicators */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'right' 
            ? 'bg-green-500/20 text-green-600 scale-110' 
            : 'bg-green-500/10 text-green-500'
        }`}>
          <Check size={16} className="mr-1" />
          <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>I Know</span>
        </div>
        <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'left' 
            ? 'bg-red-500/20 text-red-600 scale-110' 
            : 'bg-red-500/10 text-red-500'
        }`}>
          <X size={16} className="mr-1" />
          <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>I Don't Know</span>
        </div>
      </div>
      
      <animated.div
        {...bind()}
        style={{ 
          x, 
          rotate, 
          scale, 
          touchAction: 'pan-y', 
          opacity,
          height: 'calc(100dvh - 100px)',
          minHeight: '400px',
        }}
        className={`w-full sm:max-w-[400px] mx-auto self-center rounded-xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing swipe-card transition-colors duration-200 flex flex-col items-center bg-white dark:bg-neutral-800`}
        onClick={handleFlip}
        tabIndex={0}
        role="button"
        aria-label={`Tap to see ${targetLangName} translation`}
      >
        <div className="p-4 w-full flex flex-col items-center gap-y-2 select-none">
          {/* Front/Back side */}
          <div className="w-full flex flex-col items-center gap-y-2 select-none">
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
            <div className="flex flex-col items-center">
              {flashcard.imageUrl && (
                <div className="mb-2 sm:mb-4 w-40 h-40 sm:w-60 sm:h-60 rounded-lg overflow-hidden study-card-image">
                <ImageWithFallback
                  src={flashcard.imageUrl}
                    alt={flashcard.englishWord}
                    className="w-full h-full object-cover"
                />
                </div>
              )}
              <div className="text-center select-none">
                <h2 className="text-2xl font-bold mb-2 select-none">{targetTranslation}</h2>
                <button
                  onClick={handlePronounceTargetTranslation}
                  className="p-3 rounded-full bg-sky-500/20 hover:bg-sky-500/30 transition-colors"
                >
                  <Volume2 size={24} className="text-sky-600" />
                </button>
              </div>
              
              {targetSentence && (
                <div className="mt-4 text-center select-none flex flex-row items-center justify-center gap-2">
                  <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mb-2 select-none">{targetSentence}</p>
                  <button
                    onClick={handlePronounceTargetSentence}
                    className="p-2.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 transition-colors"
                    aria-label="Pronounce sentence"
                  >
                    <Volume2 size={20} className="text-sky-600" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      const utterance = new SpeechSynthesisUtterance(targetSentence);
                      utterance.lang = targetLang;
                      utterance.rate = 0.5;
                      window.speechSynthesis.speak(utterance);
                    }}
                    className="p-2.5 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors ml-1"
                    aria-label="Pronounce sentence slowly"
                    title="Slow audio"
                  >
                    <span role="img" aria-label="slow">🐌</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Botones de acción + instrucciones */}
          <div className="w-full">
            <div className="flex flex-row justify-between gap-4 mt-2 w-full max-w-xs mx-auto">
              <button
                onClick={onDontKnow}
                className="flex items-center justify-center px-1 py-4 w-1/2 max-w-[160px] rounded-xl bg-red-600 text-white text-lg font-semibold shadow-lg hover:bg-red-700 transition-colors"
                aria-label="I Don't Know"
              >
                <X size={28} />
              </button>
              <button
                onClick={onKnow}
                className="flex items-center justify-center px-1 py-4 w-1/2 max-w-[160px] rounded-xl bg-green-600 text-white text-lg font-semibold shadow-lg hover:bg-green-700 transition-colors"
                aria-label="I Know"
              >
                <Check size={28} />
              </button>
            </div>
            <div className="text-center text-neutral-500 dark:text-neutral-400 select-none mt-2">
              <p className="select-none text-xs sm:text-sm">Tap to see translation • Swipe left/right to answer</p>
              <ArrowRight className="mx-auto mt-2" size={20} />
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  )

  return (
    <div className="flex flex-1 justify-center items-center w-full min-h-screen bg-neutral-900 px-2 sm:px-0 relative swipe-container overflow-hidden" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
      {/* Swipe indicators */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'right' 
            ? 'bg-green-500/20 text-green-600 scale-110' 
            : 'bg-green-500/10 text-green-500'
        }`}>
          <Check size={16} className="mr-1" />
          <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>I Know</span>
        </div>
        <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
          swipeDirection === 'left' 
            ? 'bg-red-500/20 text-red-600 scale-110' 
            : 'bg-red-500/10 text-red-500'
        }`}>
          <X size={16} className="mr-1" />
          <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>I Don't Know</span>
        </div>
      </div>
      
      <animated.div
        {...bind()}
        style={{ 
          x, 
          rotate, 
          scale, 
          touchAction: 'pan-y', 
          opacity,
          height: 'calc(100dvh - 100px)',
          minHeight: '400px',
        }}
        className={`w-full sm:max-w-[400px] mx-auto self-center rounded-xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing swipe-card transition-colors duration-200 flex flex-col items-center bg-white dark:bg-neutral-800`}
        onClick={handleFlip}
        tabIndex={0}
        role="button"
        aria-label={`Tap to see ${targetLangName} translation`}
      >
        <div className="p-4 w-full flex flex-col items-center gap-y-2 select-none">
          {/* Front/Back side */}
          <div className="w-full flex flex-col items-center gap-y-2 select-none">
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
            <div className="flex flex-col items-center">
              <div className="text-center select-none">
                <h2 className="text-2xl font-bold mb-2 select-none">{targetTranslation}</h2>
                <button
                  onClick={handlePronounceTargetTranslation}
                  className="p-3 rounded-full bg-sky-500/20 hover:bg-sky-500/30 transition-colors"
                >
                  <Volume2 size={24} className="text-sky-600" />
                </button>
              </div>
              
              {targetSentence && (
                <div className="mt-4 text-center select-none flex flex-row items-center justify-center gap-2">
                  <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mb-2 select-none">{targetSentence}</p>
                  <button
                    onClick={handlePronounceTargetSentence}
                    className="p-2.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 transition-colors"
                    aria-label="Pronounce sentence"
                  >
                    <Volume2 size={20} className="text-sky-600" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      const utterance = new SpeechSynthesisUtterance(targetSentence);
                      utterance.lang = targetLang;
                      utterance.rate = 0.5;
                      window.speechSynthesis.speak(utterance);
                    }}
                    className="p-2.5 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors ml-1"
                    aria-label="Pronounce sentence slowly"
                    title="Slow audio"
                  >
                    <span role="img" aria-label="slow">🐌</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Botones de acción + instrucciones */}
          <div className="w-full">
            <div className="flex flex-row justify-between gap-4 mt-2 w-full max-w-xs mx-auto">
              <button
                onClick={onDontKnow}
                className="flex items-center justify-center px-1 py-4 w-1/2 max-w-[160px] rounded-xl bg-red-600 text-white text-lg font-semibold shadow-lg hover:bg-red-700 transition-colors"
                aria-label="I Don't Know"
              >
                <X size={28} />
              </button>
              <button
                onClick={onKnow}
                className="flex items-center justify-center px-1 py-4 w-1/2 max-w-[160px] rounded-xl bg-green-600 text-white text-lg font-semibold shadow-lg hover:bg-green-700 transition-colors"
                aria-label="I Know"
              >
                <Check size={28} />
              </button>
            </div>
            <div className="text-center text-neutral-500 dark:text-neutral-400 select-none mt-2">
              <p className="select-none text-xs sm:text-sm">Tap to see translation • Swipe left/right to answer</p>
              <ArrowRight className="mx-auto mt-2" size={20} />
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default StudyCard;