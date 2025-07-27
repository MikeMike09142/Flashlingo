import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Flashcard, StudySession } from '../../types';
import { 
  BookOpen, 
  BrainCircuit,
  ChevronDown,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from '../../hooks/useTranslation';

const CARDS_PER_SESSION = 30;

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const EnhancedStudySystem: React.FC<{ onStartSession: (session: StudySession) => void; }> = ({ onStartSession }) => {
  const { flashcards, categories, studyTargetLanguage } = useAppContext();
  const { t } = useTranslation();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const progressStats = useMemo(() => {
    let learning = 0;
    let practicing = 0;
    let mastered = 0;
    const masteredByLevel: Record<string, number> = {};

    flashcards.forEach(c => {
      const progress = c.studyProgress?.[studyTargetLanguage] || { studyLevel: 0, recognitionLevel: 0 };
      const isMastered = progress.recognitionLevel > 0;
      const hasStudied = progress.studyLevel > 0;

      if (isMastered) {
        mastered++;
        masteredByLevel[c.level] = (masteredByLevel[c.level] || 0) + 1;
      } else if (hasStudied) {
        practicing++;
      } else {
        learning++;
      }
    });

    return {
      pieData: [
        { name: 'Learning', value: learning },
        { name: 'Practicing', value: practicing },
        { name: 'Mastered', value: mastered },
      ],
      mastered,
      masteredByLevel
    };
  }, [flashcards, studyTargetLanguage]);
  
  const sessionDecks = useMemo(() => {
    const reviewDeck = flashcards.filter(c => (c.studyProgress?.[studyTargetLanguage]?.studyLevel || 0) === 0).map(c => c.id);
    const recognitionDeck = flashcards.filter(c => (c.studyProgress?.[studyTargetLanguage]?.recognitionLevel || 0) === 0).map(c => c.id);
    return { reviewDeck, recognitionDeck };
  }, [flashcards, studyTargetLanguage]);

  const handleStartSession = (mode: 'review' | 'recognition' | 'freestyle_review', cardIds: string[]) => {
    if (cardIds.length === 0) return;

    const shuffledIds = shuffleArray(cardIds);
    const sessionCardIds = mode === 'freestyle_review' ? shuffledIds : shuffledIds.slice(0, CARDS_PER_SESSION);

    let sessionMode: StudySession['mode'];
    if (mode === 'recognition') sessionMode = 'image';
    if (mode === 'freestyle_review') sessionMode = 'freestyle_review';
    
    const session: StudySession = {
      id: `${mode}-session-${Date.now()}`,
      cards: sessionCardIds,
      mode: sessionMode,
      sessionNumber: 1,
      totalSessions: 1,
      completedCards: [],
      currentCardIndex: 0,
      isCompleted: false,
      startedAt: new Date().toISOString(),
    };
    onStartSession(session);
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

  // Colores para cada nivel de dominio, usados en las chips de Mastered
  const LEVEL_COLORS: Record<string, string> = {
    A1: 'bg-green-600/20 text-green-400',
    A2: 'bg-blue-600/20 text-blue-400',
    B1: 'bg-purple-600/20 text-purple-400',
    B2: 'bg-pink-600/20 text-pink-400',
    C1: 'bg-yellow-500/20 text-yellow-500',
    C2: 'bg-red-600/20 text-red-400',
  };

  const getCategoryDecks = (categoryId: string) => {
    const categoryCards = flashcards.filter(c => c.categoryIds.includes(categoryId));
    const review = categoryCards.filter(c => (c.studyProgress?.[studyTargetLanguage]?.studyLevel || 0) === 0).map(c=>c.id);
    const recognition = categoryCards.filter(c => (c.studyProgress?.[studyTargetLanguage]?.recognitionLevel || 0) === 0).map(c=>c.id);
    return { review, recognition };
  };

  return (
    <div className="space-y-6 md:space-y-8 p-2 md:p-4 select-none">
      <div className="text-center select-none">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 select-none">{t('studyDashboard')}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1 select-none">{t('yourProgressAtGlance')}</p>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-md select-none">
        <h2 className="text-xl font-semibold mb-4 text-center select-none">{t('overallProgress')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="h-64 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={progressStats.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={'80%'} labelLine={false}>
                  {progressStats.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="select-none">
            <h3 className="text-lg font-semibold mb-2 select-none">{t('overallProgress')}</h3>
            <ul className="space-y-2 select-none">
              <li className="flex items-center gap-2 select-none">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: COLORS[0] }}></span>
                <span className="font-bold select-none">{t('learning')}</span>
                <span className="ml-2 text-sm text-blue-400 font-bold select-none">{progressStats.pieData[0].value}</span>
                <span className="ml-1 text-sm text-neutral-400 select-none">{t('cardsNotReviewedYet')}</span>
              </li>
              <li className="flex items-center gap-2 select-none">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: COLORS[1] }}></span>
                <span className="font-bold select-none">{t('practicing')}</span>
                <span className="ml-2 text-sm text-purple-400 font-bold select-none">{progressStats.pieData[1].value}</span>
                <span className="ml-1 text-sm text-neutral-400 select-none">{t('reviewedCardsNeedPractice')}</span>
              </li>
              <li className="flex items-start gap-2 flex-wrap select-none">
                <span className="w-3 h-3 rounded-full inline-block mt-1" style={{ backgroundColor: COLORS[2] }}></span>
                <div className="flex-1 min-w-0 select-none">
                  <div className="flex items-center gap-1 flex-wrap select-none">
                    <span className="font-bold select-none">{t('mastered')}</span>
                    <span className="text-sm text-green-400 font-bold select-none">{progressStats.mastered}</span>
                    <span className="ml-1 text-sm text-neutral-400 select-none">{t('passedRecognitionTest')}</span>
                  </div>
                  {Object.keys(progressStats.masteredByLevel).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 select-none">
                      {Object.entries(progressStats.masteredByLevel).map(([level, count]) => (
                        <span
                          key={level}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium select-none ${LEVEL_COLORS[level] || 'bg-neutral-600/20 text-neutral-400'}`}
                        >
                          {level}: {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-md select-none">
        <h2 className="text-xl font-semibold mb-4 select-none">{t('studyHub')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => handleStartSession('review', sessionDecks.reviewDeck)} disabled={sessionDecks.reviewDeck.length === 0} className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold disabled:bg-neutral-400 text-center"><h3 className="text-lg">{t('studyCards')}</h3><p>({sessionDecks.reviewDeck.length} {t('cards')})</p></button>
            <button onClick={() => handleStartSession('recognition', sessionDecks.recognitionDeck)} disabled={sessionDecks.recognitionDeck.length === 0} className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold disabled:bg-neutral-400 text-center"><h3 className="text-lg">{t('practiceRecognition')}</h3><p>({sessionDecks.recognitionDeck.length} {t('cards')})</p></button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-md select-none">
        <h2 className="text-xl font-semibold mb-4 select-none">{t('studyByCategory')}</h2>
        <div className="space-y-2">
          {categories.map(category => {
            const categoryCards = flashcards.filter(c => c.categoryIds.includes(category.id));
            if (categoryCards.length === 0) return null;
            const masteredInCategory = categoryCards.filter(c => (c.studyProgress?.[studyTargetLanguage]?.recognitionLevel || 0) > 0).length;
            const progress = categoryCards.length > 0 ? Math.round((masteredInCategory / categoryCards.length) * 100) : 0;
            const categoryDecks = getCategoryDecks(category.id);
            const isCompleted = progress === 100;

            return (
              <div key={category.id} className="border dark:border-neutral-700 rounded-lg select-none">
                <button onClick={() => !isCompleted && setOpenCategory(openCategory === category.id ? null : category.id)} className={`w-full p-3 flex items-center justify-between select-none ${isCompleted ? 'cursor-default' : ''}`}>
                  <span className="font-semibold select-none">{category.name} ({categoryCards.length})</span>
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-sm text-neutral-500 select-none">{progress}% {t('mastered')}</span>
                    {!isCompleted && <ChevronDown className={`transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`} />}
                  </div>
                </button>
                {isCompleted ? (
                   <div className="p-3 border-t dark:border-neutral-700">
                     <button onClick={() => handleStartSession('freestyle_review', categoryCards.map(c => c.id))} className="w-full p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">{t('review')}</button>
                   </div>
                ) : (
                  openCategory === category.id && (
                    <div className="p-3 border-t dark:border-neutral-700 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <button onClick={() => handleStartSession('review', categoryDecks.review)} disabled={categoryDecks.review.length === 0} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-neutral-400">{t('study')} ({categoryDecks.review.length})</button>
                      <button onClick={() => handleStartSession('recognition', categoryDecks.recognition)} disabled={categoryDecks.recognition.length === 0} className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-neutral-400">{t('recognition')} ({categoryDecks.recognition.length})</button>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnhancedStudySystem;