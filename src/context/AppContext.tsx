import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Flashcard, Category, SortOption, ViewMode, ThemeConfig, LanguageLevel, StudyModeOption } from '../types';
import { defaultFlashcards, defaultCategories } from '../data/defaultData';

// Versión simplificada del contexto para una app 100% local
interface AppContextType {
  flashcards: Flashcard[];
  categories: Category[];
  activeCategory: string | null;
  searchTerm: string;
  sortOption: SortOption;
  viewMode: ViewMode;
  theme: ThemeConfig;
  studyMode: StudyModeOption;
  studyTargetLanguage: 'spanish' | 'french';
  isLoading: boolean;
  
  setFlashcards: (flashcards: Flashcard[]) => void;
  setCategories: (categories: Category[]) => void;
  setActiveCategory: (categoryId: string | null) => void;
  setSearchTerm: (term: string) => void;
  setSortOption: (option: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setStudyTargetLanguage: (language: 'spanish' | 'french') => void;
  setStudyMode: (mode: StudyModeOption) => void;
  toggleTheme: () => void;
  updateStudyTimerSettings: (enabled: boolean, duration: number) => void;
  updateCardChangeSound: (enabled: boolean) => void;
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'created_at'>) => void;
  updateFlashcard: (id: string, updates: Partial<Omit<Flashcard, 'id' | 'created_at'>>) => void;
  deleteFlashcard: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'created_at'>>) => void;
  deleteCategory: (id: string) => void;
  filteredFlashcards: Flashcard[];
  getFlashcardById: (id: string) => Flashcard | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carga inicial de datos desde defaultData y localStorage
  useEffect(() => {
    try {
      // Cargar categorías
      const storedCategories = localStorage.getItem('categories');
      setCategories(storedCategories ? JSON.parse(storedCategories) : defaultCategories);

      // Cargar y fusionar flashcards
      const storedFlashcards = localStorage.getItem('flashcards');
      if (storedFlashcards) {
        const userFlashcards: Flashcard[] = JSON.parse(storedFlashcards);
        const userFlashcardsMap = new Map(userFlashcards.map(card => [card.id, card]));

        const mergedFlashcards = defaultFlashcards.map(defaultCard => {
          const userCard = userFlashcardsMap.get(defaultCard.id);
          return userCard ? { ...defaultCard, ...userCard } : defaultCard;
        });
        
        // Añadir tarjetas creadas por el usuario que no están en los datos por defecto
        userFlashcards.forEach(userCard => {
            if (!mergedFlashcards.some(c => c.id === userCard.id)) {
                mergedFlashcards.push(userCard);
            }
        });

        setFlashcards(mergedFlashcards);
      } else {
        // Si no hay nada en local storage, usar las de por defecto
        setFlashcards(defaultFlashcards.map(card => ({
          ...card,
          studyProgress: { level: 1, consecutiveCorrect: 0 }
        })));
      }
    } catch (error) {
      console.error("Error loading data, falling back to default data.", error);
      setFlashcards(defaultFlashcards);
      setCategories(defaultCategories);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar en localStorage cada vez que cambien los datos
  useEffect(() => {
    if (!isLoading) {
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }
  }, [flashcards, isLoading]);

  useEffect(() => {
    if (!isLoading) {
        localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories, isLoading]);


  // Funciones CRUD que operan solo en el estado local y localStorage
  const addFlashcard = (flashcard: Omit<Flashcard, 'id' | 'created_at'>) => {
      const newFlashcard: Flashcard = {
        ...flashcard,
      id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
      studyProgress: {
        level: 1,
        consecutiveCorrect: 0,
      },
      };
      setFlashcards(prev => [...prev, newFlashcard]);
  };

  const updateFlashcard = (id: string, updates: Partial<Omit<Flashcard, 'id' | 'created_at'>>) => {
    setFlashcards(prev => prev.map(card => (card.id === id ? { ...card, ...updates } : card)));
  };

  const deleteFlashcard = (id: string) => {
      setFlashcards(prev => prev.filter(card => card.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setFlashcards(prev => prev.map(card =>
      card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
    ));
  };

  const addCategory = (category: Omit<Category, 'id' | 'created_at'>) => {
    const newCategory: Category = {
      ...category,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Omit<Category, 'id' | 'created_at'>>) => {
    setCategories(prev => prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // Opcional: desasignar la categoría de las flashcards
    setFlashcards(prev => prev.map(card => ({
      ...card,
      categoryIds: card.categoryIds.filter(catId => catId !== id),
    })));
  };
  
  // El resto de los estados y funciones que no dependen de Supabase
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [studyMode, setStudyMode] = useState<StudyModeOption>('audio_image_text');
  const [studyTargetLanguage, setStudyTargetLanguage] = useState<'spanish' | 'french'>(() => {
    const stored = localStorage.getItem('studyTargetLanguage');
    return (stored as 'spanish' | 'french') || 'spanish';
  });

  // Log para depuración: cada vez que cambia el idioma de estudio
  useEffect(() => {
    console.log('[AppContext] studyTargetLanguage state has been updated to:', studyTargetLanguage);
    localStorage.setItem('studyTargetLanguage', studyTargetLanguage);
  }, [studyTargetLanguage]);

  const [theme, setTheme] = useState<ThemeConfig>(() => {
    // ... Lógica del tema sin cambios
    return { isDarkMode: true, studyTimerEnabled: false, studyTimerDuration: 10, cardChangeSoundEnabled: true };
  });

  const toggleTheme = () => setTheme(prev => ({...prev, isDarkMode: !prev.isDarkMode}));
  const updateStudyTimerSettings = (enabled: boolean, duration: number) => setTheme(prev => ({...prev, studyTimerEnabled: enabled, studyTimerDuration: duration}));
  const updateCardChangeSound = (enabled: boolean) => setTheme(prev => ({...prev, cardChangeSoundEnabled: enabled}));

  const filteredFlashcards = useMemo(() => {
    let filtered = [...flashcards];
    if (activeCategory) {
      filtered = filtered.filter(card => card.categoryIds?.includes(activeCategory));
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(card =>
        (card.englishWord && card.englishWord.toLowerCase().includes(lowerSearchTerm)) ||
        (card.spanishTranslation && card.spanishTranslation.toLowerCase().includes(lowerSearchTerm)) ||
        (card.frenchTranslation && card.frenchTranslation.toLowerCase().includes(lowerSearchTerm))
      );
    }
    // ... add other filters if needed
    return filtered;
  }, [flashcards, activeCategory, searchTerm]);

  const getFlashcardById = (id: string) => flashcards.find(card => card.id === id);


  const contextValue: AppContextType = {
    flashcards,
    categories,
    activeCategory,
    searchTerm,
    sortOption,
    viewMode,
    theme,
    studyMode,
    studyTargetLanguage,
    isLoading,
    setFlashcards,
    setCategories,
    setActiveCategory,
    setSearchTerm,
    setSortOption,
    setViewMode,
    setStudyTargetLanguage,
    setStudyMode,
    toggleTheme,
    updateStudyTimerSettings,
    updateCardChangeSound,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    toggleFavorite,
    addCategory,
    updateCategory,
    deleteCategory,
    filteredFlashcards,
    getFlashcardById,
  };

  useEffect(() => {
    console.log('[AppContext] Provider re-rendered. Current language:', studyTargetLanguage);
  }, [studyTargetLanguage]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};