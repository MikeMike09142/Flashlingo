import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, Star, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AchievementsPage: React.FC = () => {
  const { flashcards, categories, studyTargetLanguage } = useAppContext();
  const navigate = useNavigate();

  // Cálculo de logros
  const achievements = useMemo(() => {
    const totalCards = flashcards.length;
    const level1Cards = flashcards.filter(card => (card.studyProgress?.[studyTargetLanguage]?.level || 1) === 1).length;
    const level2Cards = flashcards.filter(card => (card.studyProgress?.[studyTargetLanguage]?.level || 1) === 2).length;
    const level3Cards = flashcards.filter(card => (card.studyProgress?.[studyTargetLanguage]?.level || 1) >= 3).length;
    const level1Progress = totalCards > 0 ? ((totalCards - level1Cards) / totalCards) * 100 : 0;
    const level2Progress = totalCards > 0 ? (level2Cards / totalCards) * 100 : 0;
    const level3Progress = totalCards > 0 ? (level3Cards / totalCards) * 100 : 0;
    const list: { id: string, icon: React.ReactNode, title: string, description: string }[] = [];
    // Level 2 unlock
    if (level1Progress >= 50) {
      list.push({
        id: 'level2-unlock',
        icon: <CheckCircle className="h-8 w-8 text-green-500" />, 
        title: 'Level 2 Unlocked!',
        description: 'You have completed 50% of Level 1. Now you can access Level 2!'
      });
    }
    // Level 3 unlock
    if (level2Progress >= 100) {
      list.push({
        id: 'level3-unlock',
        icon: <Trophy className="h-8 w-8 text-yellow-500" />, 
        title: 'Level 3 Unlocked!',
        description: 'You have completed 100% of Level 2. Now you can access Level 3!'
      });
    }
    // Categorías dominadas
    categories.forEach(cat => {
      const categoryCards = flashcards.filter(card => card.categoryIds.includes(cat.id));
      if (categoryCards.length >= 10 && categoryCards.every(card => (card.studyProgress?.[studyTargetLanguage]?.level || 1) > 1)) {
        list.push({
          id: `category-${cat.id}-level1`,
          icon: <Trophy className="h-8 w-8 text-blue-500" />, 
          title: `${cat.name} Mastered!`,
          description: `You have completed the cards in ${cat.name} level 2.`
        });
      }
    });
    // Primera sesión completada (si hay al menos una tarjeta en nivel 2 o más)
    if (level2Cards > 0) {
      list.push({
        id: 'first-session-complete',
        icon: <Star className="h-8 w-8 text-purple-500" />, 
        title: 'First Session Completed!',
        description: 'You have completed your first study session.'
      });
    }
    return list;
  }, [flashcards, categories, studyTargetLanguage]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Achievements</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      {achievements.length === 0 ? (
        <div className="text-center text-neutral-500 mt-16">No achievements yet. Keep studying to unlock them!</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {achievements.map(a => (
            <div key={a.id} className="flex items-center gap-4 bg-white dark:bg-neutral-800 rounded-lg shadow p-4 border border-neutral-200 dark:border-neutral-700">
              {a.icon}
              <div>
                <h2 className="font-semibold text-lg mb-1">{a.title}</h2>
                <p className="text-neutral-600 dark:text-neutral-400">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage; 