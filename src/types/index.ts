export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Flashcard {
  id: string;
  englishWord: string;
  englishSentence?: string;
  spanishTranslation?: string;
  spanishSentence?: string;
  frenchTranslation?: string;
  frenchSentence?: string;
  categoryIds: string[];
  isFavorite: boolean;
  imageUrl?: string;
  level?: LanguageLevel;
  lastReviewed: number | null;
  nextReviewDate: number | null;
  reviewCount: number;
  creationTargetLanguage?: 'spanish' | 'french'; // Language the flashcard was created in
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type SortOption = 'newest' | 'oldest' | 'english' | 'spanish' | 'french' | 'level';
export type ViewMode = 'grid' | 'list';

export interface ThemeConfig {
  isDarkMode: boolean;
  studyTimerEnabled: boolean;
  studyTimerDuration: number;
  cardChangeSoundEnabled: boolean;
}

export interface AvailableIcon {
  value: string;
  label: string;
}

export type StudyModeOption = 'audio_image_text' | 'audio_image' | 'audio_only' | 'image_only';