import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Flashcard } from '../../types/index';
import { Volume2, ArrowRight } from 'lucide-react';
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
  
  const [{ x, rotate }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    config: { tension: 300, friction: 30 },
  }));

  // Reset card state when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
    setIsTransitioning(false);
    api.start({ x: 0, rotate: 0 });
  }, [flashcard.id, api]);

  const handleFlip = useCallback((e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    if (isTransitioning) return;
    setIsFlipped(f => !f);
  }, [isTransitioning]);

  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = vx > 0.2;
      if (!down && trigger) {
        const dir = xDir < 0 ? -1 : 1; // Izquierda -1, Derecha 1
        if (dir === 1) onKnow();
        else onDontKnow();

        api.start({
          x: (200 + window.innerWidth) * dir,
          rotate: mx / 100 + (dir * 10 * vx),
          config: { friction: 50, tension: down ? 800 : trigger ? 200 : 500 },
        });
      } else {
        api.start({ x: down ? mx : 0, rotate: down ? mx / 10 : 0, config: { friction: 50, tension: 500 } });
      }
    },
    { filterTaps: true, rubberband: true }
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
    <div className="max-w-2xl mx-auto relative pb-20">
      <animated.div
        {...bind()}
        style={{ x, rotate }}
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden"
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
              <p>Tap to see translation</p>
              <ArrowRight className="mx-auto mt-2" size={20} />
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto relative pb-20">
      <animated.div
        {...bind()}
        style={{ x, rotate }}
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden"
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
              <p>Tap to see English word</p>
              <ArrowRight className="mx-auto mt-2" size={20} />
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default StudyCard;