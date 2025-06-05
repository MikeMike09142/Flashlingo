import { Flashcard, Category, UserProgress } from '../types';

export const sampleCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Food & Drink',
    icon: 'utensils',
    color: 'primary',
  },
  {
    id: 'cat-2',
    name: 'Travel',
    icon: 'plane',
    color: 'accent',
  },
  {
    id: 'cat-3',
    name: 'Business',
    icon: 'briefcase',
    color: 'warning',
  },
  {
    id: 'cat-4',
    name: 'Technology',
    icon: 'laptop',
    color: 'success',
  },
  {
    id: 'cat-5',
    name: 'Health',
    icon: 'heart',
    color: 'error',
  },
];

export const sampleFlashcards: Flashcard[] = [
  {
    id: 'card-1',
    englishWord: 'Delicious',
    spanishTranslation: 'Delicioso',
    englishSentence: 'The cake was absolutely delicious.',
    spanishSentence: 'El pastel estaba absolutamente delicioso.',
    imageUrl: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    categoryIds: ['cat-1'],
    isFavorite: true,
    isLearned: false,
    lastReviewed: null,
    nextReviewDate: null,
    reviewCount: 0,
    level: 'A1'
  },
  {
    id: 'card-2',
    englishWord: 'Journey',
    spanishTranslation: 'Viaje',
    englishSentence: 'The journey to the mountains was breathtaking.',
    spanishSentence: 'El viaje a las montañas fue impresionante.',
    imageUrl: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg',
    categoryIds: ['cat-2'],
    isFavorite: false,
    isLearned: false,
    lastReviewed: null,
    nextReviewDate: null,
    reviewCount: 0,
    level: 'A2'
  },
  {
    id: 'card-3',
    englishWord: 'Negotiate',
    spanishTranslation: 'Negociar',
    englishSentence: 'We need to negotiate the terms of the contract.',
    spanishSentence: 'Necesitamos negociar los términos del contrato.',
    imageUrl: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
    categoryIds: ['cat-3'],
    isFavorite: false,
    isLearned: true,
    lastReviewed: Date.now() - 86400000 * 3,
    nextReviewDate: Date.now() + 86400000 * 4,
    reviewCount: 2,
    level: 'B2'
  },
  {
    id: 'card-4',
    englishWord: 'Innovation',
    spanishTranslation: 'Innovación',
    englishSentence: 'The company is known for its innovation in technology.',
    spanishSentence: 'La empresa es conocida por su innovación en tecnología.',
    imageUrl: 'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg',
    categoryIds: ['cat-3', 'cat-4'],
    isFavorite: true,
    isLearned: false,
    lastReviewed: Date.now() - 86400000,
    nextReviewDate: Date.now() + 86400000,
    reviewCount: 1,
    level: 'C1'
  },
  {
    id: 'card-5',
    englishWord: 'Wellness',
    spanishTranslation: 'Bienestar',
    englishSentence: 'Mental wellness is as important as physical health.',
    spanishSentence: 'El bienestar mental es tan importante como la salud física.',
    imageUrl: 'https://images.pexels.com/photos/3757954/pexels-photo-3757954.jpeg',
    categoryIds: ['cat-5'],
    isFavorite: false,
    isLearned: false,
    lastReviewed: null,
    nextReviewDate: null,
    reviewCount: 0,
    level: 'B1'
  },
  {
    id: 'card-6',
    englishWord: 'Recipe',
    spanishTranslation: 'Receta',
    englishSentence: 'This recipe has been in my family for generations.',
    spanishSentence: 'Esta receta ha estado en mi familia por generaciones.',
    imageUrl: 'https://images.pexels.com/photos/256318/pexels-photo-256318.jpeg',
    categoryIds: ['cat-1'],
    isFavorite: false,
    isLearned: false,
    lastReviewed: null,
    nextReviewDate: null,
    reviewCount: 0,
    level: 'A1'
  },
  {
    id: 'card-7',
    englishWord: 'Algorithm',
    spanishTranslation: 'Algoritmo',
    englishSentence: 'The search algorithm quickly finds relevant results.',
    spanishSentence: 'El algoritmo de búsqueda encuentra rápidamente resultados relevantes.',
    imageUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
    categoryIds: ['cat-4'],
    isFavorite: false,
    isLearned: true,
    lastReviewed: Date.now() - 86400000 * 2,
    nextReviewDate: Date.now() + 86400000 * 3,
    reviewCount: 3,
    level: 'C2'
  },
];

export const initialUserProgress: UserProgress = {
  learnedCount: 2,
  totalCount: 7,
  streakDays: 3,
  lastStudyDate: Date.now() - 86400000, // yesterday
};