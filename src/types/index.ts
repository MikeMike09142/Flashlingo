export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type StudyMode = 'learn' | 'review';
export type StudyModeOption = 'audio_image_text' | 'image_only' | 'audio_only' | 'production';

export interface UserSettings {
  targetLanguage: 'english' | 'french' | 'spanish';
  creationTargetLanguage: 'english' | 'french' | 'spanish';
  studyTargetLanguage: 'english' | 'french' | 'spanish';
  studyMode: StudyModeOption;
  user_id?: string;
}

export interface Flashcard {
  id: string;
  englishWord: string;
  spanishTranslation: string;
  frenchTranslation?: string;
  englishSentence?: string;
  spanishSentence?: string;
  frenchSentence?: string;
  imageUrl?: string;
  audioUrl?: string;
  categoryIds: string[];
  isFavorite: boolean;
  created_at?: string;
  user_id?: string;
  level: LanguageLevel;
  studyProgress?: {
    level: number; // 1: Guided, 2: Recognition, 3: Production
    consecutiveCorrect: number;
  };
}

export interface Category {
  id: string;
  name: string;
  color: string;
  created_at?: string;
  user_id?: string;
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

export interface AppContextType {
  filteredFlashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  homePageFlashcards: Flashcard[];
}