import React from 'react';
import { useAppContext } from '../context/AppContext';
import EmptyState from '../components/ui/EmptyState';
import { BarChart2 } from 'lucide-react';

const StatisticsPage: React.FC = () => {
  const { flashcards } = useAppContext();

  // Helper function to format date or show placeholder
  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (flashcards.length === 0) {
    return (
      <EmptyState
        title="No hay tarjetas para mostrar estadísticas"
        description="Añade algunas tarjetas para ver tus estadísticas de repetición espaciada aquí."
        icon={<BarChart2 size={24} className="text-neutral-400" />}
        actionText="Añadir Nueva Tarjeta"
        actionLink="/create"
      />
    );
  }

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Estadísticas de Repetición Espaciada</h1>
      
      <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg overflow-hidden">
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {flashcards.map(card => (
            <li key={card.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{card.englishWord} / {card.spanishTranslation}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">Categoría: {card.categoryIds.map(id => id).join(', ')} {/* Simple category display */}</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-700 dark:text-neutral-200 space-y-1 sm:space-y-0 sm:space-x-4">
                  <p>Revisada por última vez: <span className="font-medium">{formatDate(card.lastReviewed)}</span></p>
                  <p>Próxima revisión: <span className="font-medium">{formatDate(card.nextReviewDate)}</span></p>
                  <p>Veces revisada: <span className="font-medium">{card.reviewCount ?? 0}</span></p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StatisticsPage; 