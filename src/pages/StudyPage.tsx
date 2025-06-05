import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import StudyCard from '../components/study/StudyCard';
import EmptyState from '../components/ui/EmptyState';
import { Check, BookOpen } from 'lucide-react';
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
    audio.play().then(() => {
      console.log('Sound playback started successfully.'); // Log si play() tiene éxito
    }).catch(error => {
      console.error('Error playing sound:', soundFileName, error); // Log si play() falla
    });
  } catch (error) {
    console.error('Error creating audio object or other sync error:', error); // Log si falla al crear el objeto Audio
  }
};

const StudyPage: React.FC = () => {
  const { filteredFlashcards, studyTargetLanguage, theme, studyMode, setStudyMode } = useAppContext();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studyComplete, setStudyComplete] = useState(false);
  const nextRoundDontKnowCards = useRef<Flashcard[]>([]);
  const [currentRoundCards, setCurrentRoundCards] = useState<Flashcard[]>([]);
  const [isReviewSession, setIsReviewSession] = useState(false);
  const [totalInitialCards, setTotalInitialCards] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // Estado para el tiempo restante
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Referencia para el ID del temporizador

  // Definición de funciones de manejo de tarjetas y navegación
  const moveToNextCard = useCallback(() => {
    // Reproducir sonido solo si está habilitado
    if (theme.cardChangeSoundEnabled) {
      playSound('playSound.mp3');
    }

    const nextIndex = currentCardIndex + 1;

    if (nextIndex < currentRoundCards.length) {
      setCurrentCardIndex(nextIndex);
    } else {
      console.log('End of current study round. Cards for next round:', nextRoundDontKnowCards.current);
      const cardsForNextRound = [...nextRoundDontKnowCards.current];
      nextRoundDontKnowCards.current = [];

      if (cardsForNextRound.length > 0) {
        console.log('Starting next review round with', cardsForNextRound.length, 'cards.');
        setCurrentRoundCards(cardsForNextRound);
        setCurrentCardIndex(0);
        setStudyComplete(false);
        setIsReviewSession(true);
      } else {
        console.log('All cards reviewed. Overall study complete.');
        setStudyComplete(true);
        setIsReviewSession(true);
        setCurrentCardIndex(0);
        setCurrentRoundCards([]);
      }
    }
  }, [currentCardIndex, currentRoundCards.length]);

  const handleKnow = useCallback(() => {
     console.log('Card known:', currentRoundCards[currentCardIndex]?.englishWord);
     // Limpiar el temporizador actual antes de pasar a la siguiente tarjeta
     if (timerRef.current) {
       clearInterval(timerRef.current);
       timerRef.current = null; // Resetear la referencia
     }
     moveToNextCard();
  }, [currentCardIndex, currentRoundCards, moveToNextCard]);

  const handleDontKnow = useCallback(() => {
     console.log('Card not known:', currentRoundCards[currentCardIndex]?.englishWord);
     // Limpiar el temporizador actual antes de pasar a la siguiente tarjeta
     if (timerRef.current) {
       clearInterval(timerRef.current);
       timerRef.current = null; // Resetear la referencia
     }
     const currentCard = currentRoundCards[currentCardIndex];
     if (currentCard) {
       nextRoundDontKnowCards.current.push(currentCard);
     }
     moveToNextCard();
  }, [currentCardIndex, currentRoundCards, moveToNextCard]);

  // Efecto para inicializar la sesión de estudio
  useEffect(() => {
    console.log('Initializing study session with filteredFlashcards:', filteredFlashcards);
    setCurrentRoundCards([...filteredFlashcards]);
    setTotalInitialCards(filteredFlashcards.length);
    setCurrentCardIndex(0);
    setStudyComplete(filteredFlashcards.length === 0);
    setIsReviewSession(false);
    nextRoundDontKnowCards.current = [];
  }, [filteredFlashcards]);

  // Efecto para manejar el temporizador por cada tarjeta
  useEffect(() => {
    // Limpiar cualquier temporizador existente
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Si el temporizador está habilitado, hay tarjetas y no hemos terminado, iniciar nuevo temporizador
    if (theme.studyTimerEnabled && !studyComplete && currentRoundCards.length > 0 && currentCardIndex < currentRoundCards.length) {
      setTimeLeft(theme.studyTimerDuration); // Usar la duración configurada

      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // Tiempo agotado: marcar como 'No lo sé' y pasar a la siguiente
            if (timerRef.current) {
              clearInterval(timerRef.current); // Limpiar temporizador
            }
            handleDontKnow(); // Llamar a handleDontKnow
            return 0; // Establecer tiempo a 0
          } else {
            return prevTime - 1; // Decrementar tiempo
          }
        });
      }, 1000); // Intervalo de 1 segundo
    }

    // Función de limpieza: limpiar el temporizador cuando el componente se desmonte
    // o cuando las dependencias cambien
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // Dependencias del efecto: se re-ejecuta cuando cambia la tarjeta, o las funciones de manejo
  }, [currentCardIndex, currentRoundCards.length, studyComplete, handleDontKnow, theme.studyTimerEnabled, theme.studyTimerDuration]); // Añadir dependencias del tema

  const restartStudy = () => {
    console.log('Restarting study session.');
    setCurrentRoundCards([...filteredFlashcards]);
    setTotalInitialCards(filteredFlashcards.length);
    setCurrentCardIndex(0);
    setStudyComplete(filteredFlashcards.length === 0);
    setIsReviewSession(false);
    nextRoundDontKnowCards.current = [];
  };

  const currentCard = !studyComplete && currentRoundCards.length > 0 ? currentRoundCards[currentCardIndex] : undefined;

  const showEmptyState = filteredFlashcards.length === 0 && studyComplete;
  const showCompleteScreen = studyComplete && filteredFlashcards.length > 0;

  if (showEmptyState) {
     console.log('Rendering EmptyState');
    return (
      <EmptyState
        title="No Cards to Study"
        description="You have no cards to review at the moment based on current filters. Try adjusting your filters or add new cards."
        icon={<BookOpen size={24} className="text-neutral-400" />}
        actionText="Add New Card"
        actionLink="/create"
      />
    );
  }

  if (showCompleteScreen) {
     console.log('Rendering Study Complete Screen');
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mb-6">
          <Check size={36} className="text-success-500" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2 dark:text-neutral-100">Study Session Complete!</h2>
        <p className="text-neutral-600 mb-6 dark:text-neutral-300">
          You've reviewed all your cards based on the current filters.
        </p>
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 w-full mb-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">{totalInitialCards}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Cards in Session (initial)</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={restartStudy}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Study Again (with current filters)
          </button>
          <Link
            to="/"
            className="px-6 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors duration-200 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-600"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (currentCard) {
      console.log('Rendering StudyCard for:', currentCard.englishWord, 'Index:', currentCardIndex, 'Total in round:', currentRoundCards.length);
     return (
       <div className="py-4">
         <div className="mb-6">
           <h1 className="text-2xl font-bold text-neutral-800">Study Session</h1>
           <p className="text-neutral-600">Review your flashcards to improve retention</p>
            {isReviewSession && (
                <p className="text-orange-600 dark:text-orange-400 font-medium mt-1">Reviewing cards you didn't know</p>
            )}
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Studying in: {studyTargetLanguage === 'spanish' ? 'Español' : 'Français'}</p>

            {/* Control para el modo de estudio */}
            <div className="flex items-center mt-2">
              <label htmlFor="studyModeSelect" className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mr-2">
                Modo de Estudio:
              </label>
              <select
                id="studyModeSelect"
                value={studyMode}
                onChange={(e) => {
                  const selectedMode = e.target.value as StudyModeOption;
                  console.log('Changing study mode to:', selectedMode);
                  setStudyMode(selectedMode);
                }}
                className="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="audio_image_text">Audio + Imagen + Palabras</option>
                <option value="audio_image">Audio + Imagen</option>
                <option value="audio_only">Solo Audio</option>
                <option value="image_only">Solo Imagen</option>
              </select>
            </div>

         </div>
         <StudyCard
           flashcard={currentCard}
           onKnow={handleKnow}
           onDontKnow={handleDontKnow}
         />
          {/* Mostrar el tiempo restante solo si el temporizador está habilitado */}
         {theme.studyTimerEnabled && (
           <div className="mt-4 text-center text-lg font-semibold text-primary-600 dark:text-primary-400">
               Tiempo restante: {timeLeft}s
           </div>
         )}

          <div className="mt-8 text-center text-neutral-600 dark:text-neutral-300">
              Card {currentCardIndex + 1} of {currentRoundCards.length} {isReviewSession && '(Review Round)'}
          </div>
       </div>
     );
  }

   console.log('Rendering null - unexpected state or waiting for useEffect.', {studyComplete, currentCard: !!currentCard, hasInitialStudyCards: filteredFlashcards.length > 0, isReviewSession, studyCardsLength: currentRoundCards.length, nextRoundDontKnowCardsLength: nextRoundDontKnowCards.current.length, totalInitialCards});
  return null;
};

export default StudyPage;