import React, { useState, useCallback, useEffect } from 'react';
import { Flashcard } from '../../types/index';
import { Volume2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { StudyModeOption } from '../../types';

interface StudyCardProps {
  flashcard: Flashcard;
  onKnow: () => void; // Callback for "I Know"
  onDontKnow: () => void; // Callback for "I Don't Know"
}

const StudyCard: React.FC<StudyCardProps> = ({ flashcard, onKnow, onDontKnow }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { getCategoryById, studyTargetLanguage, studyMode } = useAppContext();
  
  const [props, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    config: { tension: 300, friction: 30 },
  }));

  // Logs para depuración de imagen y modo de estudio
  console.log('StudyCard Render - Current studyMode:', studyMode);
  console.log('StudyCard Render - Flashcard imageUrl:', flashcard.imageUrl);
  console.log('StudyCard Render - Card Flipped:', isFlipped);

  // Add useDrag gesture
  const bind = useDrag(
    (state) => {
      const { down, movement, velocity, direction, cancel } = state;
      const [mx, my] = movement;
      const [vx, vy] = velocity;
      const [xDir, yDir] = direction;

      // If card is flicked hard enough to the left or right
      const trigger = Math.sqrt(mx * mx + my * my) > 100; // Calcular la distancia usando el teorema de Pitágoras

      if (!down && trigger) { // Card is released and meets threshold
        setIsTransitioning(true); // Keep in transition state
        // Determine action based on direction
        if (xDir > 0) { // Swiped right (I Know)
          api.start({ x: window.innerWidth, rotate: 10, config: { friction: 20 }, onRest: onKnow });
        } else { // Swiped left (I Don't Know)
          api.start({ x: -window.innerWidth, rotate: -10, config: { friction: 20 }, onRest: onDontKnow });
        }
        // isTransitioning state will be handled by onRest or similar logic if needed
      } else if (down) { // Card is being dragged
         setIsTransitioning(true); // Prevent flip while dragging
        api.start({
          x: down ? mx : 0, // Follow mouse when dragging, return to 0 when released
          rotate: down ? mx / 20 : 0, // Rotate slightly based on drag distance
          config: { tension: down ? 800 : 300, friction: down ? 40 : 30 },
        });
      } else { // Card is released but doesn't meet threshold
         setIsTransitioning(false); // Allow flip again
         api.start({ x: 0, rotate: 0, config: { tension: 300, friction: 30 } }); // Return to original position
      }

      // Si quieres verificar los tipos, puedes añadir un console.log
      // console.log('Movement:', movement, 'Velocity:', velocity, 'Direction:', direction);
    }
  );

  // Reset card state when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
    setIsTransitioning(false);
    setIsVisible(true);
    api.start({ x: 0, rotate: 0 });
  }, [flashcard.id, api]);
  
  const handleFlip = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isTransitioning) {
      setIsTransitioning(true); // Start transition state
      setTimeout(() => {
        setIsFlipped(!isFlipped);
        setIsTransitioning(false); // End transition state after flip
      }, 1000); // 1 second delay
    }
  }, [isFlipped, isTransitioning]);
  
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

  const handlePronounceSpanishSentence = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(flashcard.spanishSentence);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  }, [flashcard.spanishSentence]);

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

  const categories = flashcard.categoryIds
    .map(id => getCategoryById(id))
    .filter(cat => cat !== undefined);

  if (!isVisible) return null;

  return (
    <div className="max-w-2xl mx-auto relative pb-20">
      <animated.div
        {...bind()} // Bind the drag gesture
        style={props}
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden"
        onClick={handleFlip} // Move onClick here
        tabIndex={0} // Ensure focusable for accessibility
        role="button" // Indicate interactive element
        aria-label={isFlipped ? (studyTargetLanguage === 'french' ? 'Tap to see French translation' : 'Tap to see English word') : (studyTargetLanguage === 'french' ? 'Tap to see English meaning' : 'Tap to see Spanish translation')}
      >
        {/* Ensure flip is only active when not transitioning/dragging */}
        <div className="p-6" style={{ minHeight: '300px' }}> {/* Remove onClick and accessibility attributes from here */}
          
          {isFlipped ? (
            // Back side
            <div className="w-full h-full flex flex-col justify-between">
              <div className="flex justify-end space-x-2">
                {/* Audio buttons for the back side */}
                {studyTargetLanguage === 'french' ? (
                   // Back side in French study: Show French audio buttons
                   <>
                      {flashcard.frenchTranslation && (
                        <button
                          onClick={handlePronounceTargetTranslation}
                          className="flex items-center p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full transition-colors duration-200"
                          aria-label="Pronounce French translation"
                        >
                          <Volume2 size={24} />
                        </button>
                      )}
                      {flashcard.frenchSentence && (
                        <button
                          onClick={handlePronounceTargetSentence}
                          className="flex items-center p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full transition-colors duration-200"
                          aria-label="Pronounce French sentence"
                        >
                          <Volume2 size={16} />
                        </button>
                      )}
                   </>
                ) : (
                   // Back side in Spanish study: Show Spanish audio buttons
                   <>
                      <button
                        onClick={handlePronounceTargetTranslation}
                        className="flex items-center p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full transition-colors duration-200"
                        aria-label="Pronounce Spanish translation"
                      >
                        <Volume2 size={24} />
                      </button>
                     {flashcard.spanishSentence && (
                       <button
                         onClick={handlePronounceTargetSentence}
                         className="flex items-center p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full transition-colors duration-200"
                         aria-label="Pronounce Spanish sentence"
                       >
                         <Volume2 size={16} />
                       </button>
                     )}
                   </>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                {/* Content for the back side */}
                {studyTargetLanguage === 'french' ? (
                   // Back side in French study: Show French translation
                   flashcard.frenchTranslation ? (
                      <>
                         <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 break-words">{flashcard.frenchTranslation}</h2>
                         {flashcard.frenchSentence && (<p className="text-lg text-neutral-600 dark:text-neutral-300 italic break-words">{flashcard.frenchSentence}</p>)}
                      </>
                   ) : (
                      <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 break-words">No French Translation</h2>
                   )
                ) : (
                   // Back side in Spanish study: Show Spanish translation
                   flashcard.spanishTranslation ? (
                      <>
                         <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 break-words">{flashcard.spanishTranslation}</h2>
                         {flashcard.spanishSentence && (<p className="text-lg text-neutral-600 dark:text-neutral-300 italic break-words">{flashcard.spanishSentence}</p>)}
                      </>
                   ) : (
                      <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 break-words">No Spanish Translation</h2>
                   )
                )}
                {/* Added image display for the back side */}
                {flashcard.imageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img
                    src={flashcard.imageUrl}
                    alt={flashcard.englishWord}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                </div>
                )}
              </div>
              <div className="mt-auto text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Tap to see the {studyTargetLanguage === 'french' ? 'French translation' : 'English word'}</p>
              </div>
            </div>
          ) : (
            // Front side
            <div className="w-full h-full flex flex-col justify-between">
              <div className="flex justify-end space-x-2">
                {/* Audio buttons for the front side */}
                {/* Show audio buttons based on study mode */}
                {(studyMode === 'audio_image' || studyMode === 'audio_only' || studyMode === 'audio_image_text') && (
                  studyTargetLanguage === 'french' ? (
                    // Front side in French study: Show English audio buttons
                    <>
                      <button
                        onClick={handlePronounceWord}
                        className="flex items-center p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full transition-colors duration-200"
                        aria-label="Pronounce word"
                      >
                        <Volume2 size={24} />
                      </button>
                      {flashcard.englishSentence && (
                        <button
                          onClick={handlePronounceEnglishSentence}
                          className="flex items-center p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full transition-colors duration-200"
                          aria-label="Pronounce English sentence"
                        >
                          <Volume2 size={16} />
                        </button>
                      )}
                    </>
                  ) : (
                    // Front side in Spanish study: Show English audio buttons
                    <>
                      <button
                        onClick={handlePronounceWord}
                        className="flex items-center p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full transition-colors duration-200"
                        aria-label="Pronounce word"
                      >
                        <Volume2 size={24} />
                      </button>
                      {flashcard.englishSentence && (
                        <button
                          onClick={handlePronounceEnglishSentence}
                          className="flex items-center p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full transition-colors duration-200"
                          aria-label="Pronounce English sentence"
                        >
                          <Volume2 size={16} />
                        </button>
                      )}
                    </>
                  )
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                {/* Content for the front side based on study mode */}
                {/* Show text based on study mode */}
                {(studyMode === 'audio_image_text') && (
                  <>
                    <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 break-words">{flashcard.englishWord}</h2>
                    {flashcard.englishSentence && (<p className="text-lg text-neutral-600 dark:text-neutral-300 italic break-words">{flashcard.englishSentence}</p>)}
                  </>
                )}
                {/* Show image based on study mode */}
                {(studyMode === 'audio_image' || studyMode === 'image_only' || studyMode === 'audio_image_text') && flashcard.imageUrl && (
                  <div className="mt-4 rounded-lg overflow-hidden">
                    <img
                      src={flashcard.imageUrl}
                      alt={flashcard.englishWord}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                {/* Display message if no content is available for the selected mode */}
                {((studyMode === 'audio_only' && !flashcard.englishWord && !flashcard.englishSentence && !(studyTargetLanguage === 'french' && (flashcard.frenchTranslation || flashcard.frenchSentence))) ||
                  (studyMode === 'image_only' && !flashcard.imageUrl) ||
                  (studyMode === 'audio_image' && !flashcard.imageUrl) || // Audio + Image without image
                  (studyMode === 'audio_image_text' && !flashcard.englishWord && !flashcard.englishSentence && !flashcard.imageUrl && !(studyTargetLanguage === 'french' && (flashcard.frenchTranslation || flashcard.frenchSentence)))) && (
                    <p className="text-lg text-neutral-600 dark:text-neutral-300">No content available for this mode.</p>
                  )}
              </div>
              <div className="mt-auto text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Tap to see the {studyTargetLanguage === 'french' ? 'English meaning' : 'Spanish translation'}</p>
              </div>
            </div>
          )}
        </div>
      </animated.div>

      {/* Buttons: I Know / I Don't Know */}
      
         <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-4 z-10">
           <button
             onClick={(e) => { e.stopPropagation(); onKnow(); }}
             className="flex-1 px-4 py-2 border border-green-500 text-green-700 dark:border-green-300 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-200"
             aria-label="I Know"
           >
             I Know
           </button>
           <button
             onClick={(e) => { e.stopPropagation(); onDontKnow(); }}
             className="flex-1 px-4 py-2 border border-red-500 text-red-700 dark:border-red-300 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors duration-200"
             aria-label="I Don't Know"
           >
             I Don't Know
           </button>
        </div>
      
    </div>
  );
};

export default StudyCard;