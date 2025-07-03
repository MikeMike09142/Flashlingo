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

export interface StudySession {
  id: string;
  sessionNumber: number;
  totalSessions: number;
  cards: string[]; // Array of card IDs
  completedCards: string[];
  currentCardIndex: number;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
  mode?: 'audio' | 'image' | 'freestyle_review';
  onComplete?: () => void;
}

export interface StudyProgress {
  studyLevel: number; // 0: not seen, 1: seen/reviewed
  recognitionLevel: number; // 0: not passed, 1, 2, 3... times passed
  lastReviewed?: number;
}

export interface CategoryProgress {
  categoryId: string;
  level1Completed: boolean;
  level2Unlocked: boolean;
  level3Unlocked: boolean;
  totalCards: number;
  masteredCards: number;
  lastStudied?: number;
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
  studyProgress?: { [lang: string]: StudyProgress };
  completedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
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

export interface StudyStats {
  totalCards: number;
  masteredCards: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number;
  sessionsCompleted: number;
  level1Progress: number;
  level2Progress: number;
  level3Progress: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}