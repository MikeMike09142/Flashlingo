import { Flashcard, Category, UserSettings } from '../types';

export const sampleCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Food & Drink',
    color: 'primary',
  },
  {
    id: 'cat-2',
    name: 'Travel',
    color: 'accent',
  },
  {
    id: 'cat-3',
    name: 'Business',
    color: 'warning',
  },
  {
    id: 'cat-4',
    name: 'Technology',
    color: 'success',
  },
  {
    id: 'cat-5',
    name: 'Health',
    color: 'error',
  },
];

export const sampleFlashcards: Flashcard[] = [
  {
    id: '1',
    englishWord: 'Delicious',
    spanishTranslation: 'Delicioso',
    frenchTranslation: 'Délicieux',
    englishSentence: 'The cake was absolutely delicious.',
    spanishSentence: 'El pastel estaba absolutamente delicioso.',
    frenchSentence: 'Le gâteau était absolument délicieux.',
    categoryIds: ['1'],
    isFavorite: true,
    created_at: new Date().toISOString(),
    level: 'A1',
    imageUrl: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    studyProgress: { level: 1, consecutiveCorrect: 0 }
  },
  {
    id: 'card-2',
    englishWord: 'Journey',
    spanishTranslation: 'Viaje',
    frenchTranslation: 'Voyage',
    englishSentence: 'The journey to the mountains was breathtaking.',
    spanishSentence: 'El viaje a las montañas fue impresionante.',
    frenchSentence: 'Le voyage vers les montagnes était à couper le souffle.',
    imageUrl: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg',
    categoryIds: ['cat-2'],
    isFavorite: false,
    created_at: new Date().toISOString(),
    level: 'A1',
    studyProgress: { level: 1, consecutiveCorrect: 0 }
  },
  {
    id: 'card-3',
    englishWord: 'Negotiate',
    spanishTranslation: 'Negociar',
    frenchTranslation: 'Négocier',
    englishSentence: 'We need to negotiate the terms of the contract.',
    spanishSentence: 'Necesitamos negociar los términos del contrato.',
    frenchSentence: 'Nous devons négocier les termes du contrat.',
    imageUrl: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
    categoryIds: ['cat-3'],
    isFavorite: false,
    created_at: new Date().toISOString(),
    level: 'A2',
    studyProgress: { level: 1, consecutiveCorrect: 0 }
  },
  {
    id: 'card-4',
    englishWord: 'Innovation',
    spanishTranslation: 'Innovación',
    frenchTranslation: 'Innovation',
    englishSentence: 'The company is known for its innovation in technology.',
    spanishSentence: 'La empresa es conocida por su innovación en tecnología.',
    frenchSentence: "L'entreprise est connue pour son innovation dans la technologie.",
    imageUrl: 'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg',
    categoryIds: ['cat-3', 'cat-4'],
    isFavorite: true,
    created_at: new Date().toISOString(),
    level: 'A2',
    studyProgress: { level: 1, consecutiveCorrect: 0 }
  },
  {
    id: 'card-5',
    englishWord: 'Wellness',
    spanishTranslation: 'Bienestar',
    frenchTranslation: 'Bien-être',
    englishSentence: 'Mental wellness is as important as physical health.',
    spanishSentence: 'El bienestar mental es tan importante como la salud física.',
    frenchSentence: 'Le bien-être mental est aussi important que la santé physique.',
    imageUrl: 'https://images.pexels.com/photos/3757954/pexels-photo-3757954.jpeg',
    categoryIds: ['cat-5'],
    isFavorite: false,
    created_at: new Date().toISOString(),
    level: 'A2',
    studyProgress: { level: 1, consecutiveCorrect: 0 }
  },
  {
    id: 'card-6',
    englishWord: 'Recipe',
    spanishTranslation: 'Receta',
    frenchTranslation: 'Recette',
    englishSentence: 'This recipe has been in my family for generations.',
    spanishSentence: 'Esta receta ha estado en mi familia por generaciones.',
    frenchSentence: 'Cette recette est dans ma famille depuis des générations.',
    imageUrl: 'https://images.pexels.com/photos/256318/pexels-photo-256318.jpeg',
    categoryIds: ['cat-1'],
    isFavorite: false,
    created_at: new Date().toISOString(),
    level: 'A1',
    studyProgress: { level: 1, consecutiveCorrect: 0 }
  },
  {
    id: 'card-7',
    englishWord: 'Algorithm',
    spanishTranslation: 'Algoritmo',
    frenchTranslation: 'Algorithme',
    englishSentence: 'The search algorithm quickly finds relevant results.',
    spanishSentence: 'El algoritmo de búsqueda encuentra rápidamente resultados relevantes.',
    frenchSentence: "L'algorithme de recherche trouve rapidement des résultats pertinents.",
    imageUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
    categoryIds: ['cat-4'],
    isFavorite: false,
    created_at: new Date().toISOString(),
    level: 'A2',
    studyProgress: { level: 1, consecutiveCorrect: 0 }
  },
];

export const initialUserProgress = {
  learnedCount: 2,
  totalCount: 7,
  streakDays: 3,
  lastStudyDate: Date.now() - 86400000, // yesterday
};

// Script utilitario para rellenar frenchTranslation en todas las tarjetas de ejemplo
export function fillFrenchTranslations(cards: any[]) {
  return cards.map(card => ({
    ...card,
    frenchTranslation: card.frenchTranslation || `FR_${card.englishWord}`,
    frenchSentence: card.frenchSentence || `Phrase en français pour ${card.englishWord}`,
  }));
}