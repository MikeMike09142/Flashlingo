import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Flashcard, Category, SortOption, ViewMode, ThemeConfig, LanguageLevel, StudyModeOption } from '../types';

const masterFlashcards: Omit<Flashcard, 'studyProgress' | 'created_at'>[] = [
  { id: 'card-1', englishWord: 'Book', spanishTranslation: 'Libro', frenchTranslation: 'Livre', englishSentence: 'I read a book every day.', spanishSentence: 'Leo un libro todos los días.', frenchSentence: 'Je lis un livre chaque jour.', categoryIds: ['objects'], isFavorite: false, level: 'A1', imageUrl: '/images/flashcards/book.jpg' },
  { id: 'card-2', englishWord: 'House', spanishTranslation: 'Casa', frenchTranslation: 'Maison', englishSentence: 'I live in a big house.', spanishSentence: 'Vivo en una casa grande.', frenchSentence: 'Je vis dans une grande maison.', categoryIds: ['places'], isFavorite: false, level: 'A1', imageUrl: '/images/flashcards/house.jpg' },
  { id: 'card-3', englishWord: 'Dog', spanishTranslation: 'Perro', frenchTranslation: 'Chien', englishSentence: 'My dog is very friendly.', spanishSentence: 'Mi perro es muy amigable.', frenchSentence: 'Mon chien est très amical.', categoryIds: ['animals'], isFavorite: false, level: 'A1', imageUrl: '/images/flashcards/dog.jpg' },
  { id: 'card-4', englishWord: 'Cat', spanishTranslation: 'Gato', frenchTranslation: 'Chat', englishSentence: 'I have a black cat.', spanishSentence: 'Tengo un gato negro.', frenchSentence: "J'ai un chat noir.", categoryIds: ['animals'], isFavorite: false, level: 'A1', imageUrl: '/images/flashcards/cat.jpg' },
  { id: 'card-5', englishWord: 'Table', spanishTranslation: 'Mesa', frenchTranslation: 'Table', englishSentence: 'There is a table in the room.', spanishSentence: 'Hay una mesa en la habitación.', frenchSentence: 'Il y a une table dans la chambre.', categoryIds: ['furniture'], isFavorite: false, level: 'A1', imageUrl: '/images/flashcards/table.jpg' },
  { id: 'card-6', englishWord: 'Pen', spanishTranslation: 'Bolígrafo', frenchTranslation: 'Stylo', englishSentence: 'I use a pen to write.', spanishSentence: 'Uso un bolígrafo para escribir.', frenchSentence: "J'utilise un stylo pour écrire.", categoryIds: ['objects'], isFavorite: false, level: 'A1', imageUrl: '/images/flashcards/pen.jpg' },
  { id: 'card-7', englishWord: 'Apple', spanishTranslation: 'Manzana', frenchTranslation: 'Pomme', englishSentence: 'I like eating apples.', spanishSentence: 'Me gusta comer manzanas.', frenchSentence: "J'aime manger des pommes.", categoryIds: ['fruits'], isFavorite: false, level: 'A1', imageUrl: '/images/flashcards/apple.jpg' },
  { id: 'card-8', englishWord: 'Car', spanishTranslation: 'Coche', frenchTranslation: 'Voiture', englishSentence: 'I drive a red car.', spanishSentence: 'Conduzco un coche rojo.', frenchSentence: 'Je conduis une voiture rouge.', categoryIds: ['transport'], isFavorite: false, level: 'A1', imageUrl: '/images/flashcards/car.jpg' },
  { id: 'card-9', englishWord: 'Window', spanishTranslation: 'Ventana', frenchTranslation: 'Fenêtre', englishSentence: 'The window is open.', spanishSentence: 'La ventana está abierta.', frenchSentence: 'La fenêtre est ouverte.', categoryIds: ['furniture'], isFavorite: false, level: 'A1', imageUrl: '/images/flashcards/window.jpg' },
  { id: 'card-10', englishWord: 'Friend', spanishTranslation: 'Amigo', frenchTranslation: 'Ami', englishSentence: 'My friend is coming tomorrow.', spanishSentence: 'Mi amigo viene mañana.', frenchSentence: 'Mon ami vient demain.', categoryIds: ['people'], isFavorite: false, level: 'A1', imageUrl: '/images/flashcards/friend.jpg' }
];

const masterCategories: Category[] = [
    { id: 'objects', name: 'Objects', color: '#3b82f6', created_at: new Date().toISOString() },
    { id: 'places', name: 'Places', color: '#10b981', created_at: new Date().toISOString() },
    { id: 'animals', name: 'Animals', color: '#f97316', created_at: new Date().toISOString() },
    { id: 'furniture', name: 'Furniture', color: '#8b5cf6', created_at: new Date().toISOString() },
    { id: 'fruits', name: 'Fruits', color: '#ef4444', created_at: new Date().toISOString() },
    { id: 'transport', name: 'Transport', color: '#eab308', created_at: new Date().toISOString() },
    { id: 'people', name: 'People', color: '#ec4899', created_at: new Date().toISOString() },
    { id: 'nature', name: 'Nature', color: '#22c55e', created_at: new Date().toISOString() },
    { id: 'clothing', name: 'Clothing', color: '#64748b', created_at: new Date().toISOString() },
    { id: 'sports', name: 'Sports', color: '#facc15', created_at: new Date().toISOString() },
    { id: 'professions', name: 'Professions', color: '#06b6d4', created_at: new Date().toISOString() },
    { id: 'family', name: 'Family', color: '#d946ef', created_at: new Date().toISOString() },
    { id: 'time', name: 'Time', color: '#a3a3a3', created_at: new Date().toISOString() },
    { id: 'body', name: 'Body', color: '#f472b6', created_at: new Date().toISOString() },
    { id: 'colors', name: 'Colors', color: '#84cc16', created_at: new Date().toISOString() },
    { id: 'numbers', name: 'Numbers', color: '#2dd4bf', created_at: new Date().toISOString() },
    { id: 'verbs', name: 'Verbs', color: '#c084fc', created_at: new Date().toISOString() },
    { id: 'food', name: 'Food', color: '#fb923c', created_at: new Date().toISOString() },
    { id: 'weather', name: 'Weather', color: '#0ea5e9', created_at: new Date().toISOString() },
    { id: 'business', name: 'Business', color: '#14b8a6', created_at: new Date().toISOString() },
    { id: 'emotions', name: 'Emotions', color: '#f43f5e', created_at: new Date().toISOString() },
    { id: 'adjectives', name: 'Adjectives', color: '#f59e0b', created_at: new Date().toISOString() },
    { id: 'adverbs', name: 'Adverbs', color: '#6366f1', created_at: new Date().toISOString() },
    { id: 'conjunctions', name: 'Conjunctions', color: '#d946ef', created_at: new Date().toISOString() },
    { id: 'prepositions', name: 'Prepositions', color: '#0891b2', created_at: new Date().toISOString() },
    { id: 'interjections', name: 'Interjections', color: '#e11d48', created_at: new Date().toISOString() }
];

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

  useEffect(() => {
    try {
      setCategories(masterCategories);

      const storedFlashcards = localStorage.getItem('flashcards');
      const userFlashcards: Flashcard[] = storedFlashcards ? JSON.parse(storedFlashcards) : [];
      const userFlashcardsMap = new Map(userFlashcards.map(card => [card.id, card]));

      const mergedFlashcards: Flashcard[] = masterFlashcards.map(masterCard => {
        const userCard = userFlashcardsMap.get(masterCard.id);
        const studyProgress = userCard?.studyProgress ?? { level: 1, consecutiveCorrect: 0 };
        const isFavorite = userCard?.isFavorite ?? masterCard.isFavorite;
        
        return { 
          ...masterCard,
          created_at: new Date().toISOString(), // Añadir fecha de creación
          studyProgress,
          isFavorite,
        };
      });
      
      userFlashcards.forEach(userCard => {
          if (!masterFlashcards.some(c => c.id === userCard.id)) {
              mergedFlashcards.push(userCard);
          }
      });

      setFlashcards(mergedFlashcards);

    } catch (error) {
      console.error("Error initializing data, falling back to clean master data.", error);
      const cleanMasterFlashcards: Flashcard[] = masterFlashcards.map(card => ({
        ...card,
        created_at: new Date().toISOString(),
        studyProgress: { level: 1, consecutiveCorrect: 0 }
      }));
      setFlashcards(cleanMasterFlashcards);
      setCategories(masterCategories);
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