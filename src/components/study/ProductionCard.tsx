import React, { useState, useEffect, useMemo } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Flashcard } from '../../types/index';
import { Mic } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface ProductionCardProps {
  flashcard: Flashcard;
  onKnow: () => void;
  onDontKnow: () => void;
}

const ProductionCard: React.FC<ProductionCardProps> = ({ flashcard, onKnow, onDontKnow }) => {
  const { studyTargetLanguage } = useAppContext();
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleFlip = () => {
    if (feedback === null) { // Only allow flipping if there's no active feedback
      setIsFlipped(prev => !prev);
    }
  };

  // Determine the target word and language code for speech recognition
  const targetWord = useMemo(() => {
    if (studyTargetLanguage === 'french' && flashcard.frenchTranslation) {
      return flashcard.frenchTranslation;
    }
    return flashcard.englishWord;
  }, [studyTargetLanguage, flashcard]);

  const targetSentence = useMemo(() => {
    return studyTargetLanguage === 'french' ? flashcard.frenchSentence : flashcard.englishSentence;
  }, [studyTargetLanguage, flashcard]);

  const languageCode = useMemo(() => {
    return studyTargetLanguage === 'french' ? 'fr-FR' : 'en-US';
  }, [studyTargetLanguage]);

  // Reset card state when flashcard changes
  useEffect(() => {
    resetTranscript();
    setFeedback(null);
    setIsFlipped(false);
  }, [flashcard.id, resetTranscript]);

  // Handle speech recognition results
  useEffect(() => {
    if (!listening && transcript) {
      const expected = targetWord.toLowerCase().trim();
      const actual = transcript.toLowerCase().trim();

      if (expected === actual) {
        setFeedback('correct');
        setTimeout(() => {
          onKnow(); // Advance to next card
        }, 1200);
      } else {
        setFeedback('incorrect');
        // Don't call onDontKnow, allow user to retry
        setTimeout(() => {
          resetTranscript();
          setFeedback(null);
        }, 1500);
      }
    }
  }, [listening, transcript, targetWord, onKnow, resetTranscript]);
  
  const handleListen = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping when mic is clicked
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setFeedback(null);
      SpeechRecognition.startListening({ language: languageCode });
    }
  };

  const getDashedWord = () => {
    if (!targetWord) return '';
    return targetWord.replace(/[a-zA-Z]/g, '_').split(' ').map((word: string) => `<span class="mr-2">${word}</span>`).join('');
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-8 text-center bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Navegador no compatible</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Tu navegador no soporta reconocimiento de voz. 
          Por favor, usa Google Chrome para esta funcionalidad.
        </p>
      </div>
    );
  }

  const feedbackColor = feedback === 'correct' 
    ? 'bg-green-100 dark:bg-green-900 border-green-500' 
    : feedback === 'incorrect' 
    ? 'bg-red-100 dark:bg-red-900 border-red-500' 
    : 'bg-white dark:bg-neutral-800 border-transparent';

  return (
    <div 
      onClick={handleFlip}
      className={`transition-colors duration-300 relative w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto rounded-2xl shadow-lg border-4 ${feedbackColor} cursor-pointer select-none min-h-[100dvh] flex flex-col justify-center items-center`}
      style={{paddingBottom: 'env(safe-area-inset-bottom)'}}
    >
      {isFlipped ? (
        <div className="flex flex-col items-center justify-center flex-1 w-full text-center select-none">
          <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 select-none">{targetWord}</h2>
          {targetSentence && (
              <p className="text-lg mt-2 italic text-neutral-600 dark:text-neutral-400 select-none">{targetSentence}</p>
          )}
          <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400 select-none">Toca para volver a intentar</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center flex-1 w-full text-center select-none">
            {/* Image */}
            {flashcard.imageUrl && (
              <img 
                src={flashcard.imageUrl} 
                alt="Flashcard image" 
                className="w-full max-h-48 sm:max-h-60 md:max-h-72 object-cover mb-4 sm:mb-6 rounded-lg shadow-md" 
              />
            )}
            
            {/* Dashed word hint */}
            <div 
              className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 tracking-widest text-neutral-700 dark:text-neutral-300 select-none" 
              dangerouslySetInnerHTML={{ __html: getDashedWord() }} 
            />
            
            {/* Status text */}
            <p className="h-8 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base select-none">
              {listening ? 'Escuchando...' : (transcript || 'Toca el micrófono para hablar')}
            </p>
          </div>

          {/* Microphone button */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2">
            <button
              onClick={handleListen}
              className={`transition-all p-4 rounded-full text-white shadow-lg ${
                listening 
                  ? 'bg-red-500 animate-pulse hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={feedback !== null}
            >
              <Mic size={28} />
            </button>
          </div>

          {/* Feedback for incorrect answers */}
          {feedback === 'incorrect' && (
            <div className="absolute top-4 right-4 text-sm font-bold text-red-500 bg-white dark:bg-neutral-800 px-2 py-1 rounded select-none">
              Correcto: {targetWord}
            </div>
          )}

          {/* Success feedback */}
          {feedback === 'correct' && (
            <div className="absolute top-4 right-4 text-sm font-bold text-green-500 bg-white dark:bg-neutral-800 px-2 py-1 rounded select-none">
              ¡Correcto!
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductionCard; 