import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Flashcard, Category, SortOption, ViewMode, ThemeConfig, AvailableIcon, LanguageLevel, StudyModeOption } from '../types';
import { sampleFlashcards, sampleCategories } from '../data/sampleData';
import { supabase } from '../lib/supabase';

interface AppContextType {
  flashcards: Flashcard[];
  categories: Category[];
  activeCategory: string | null;
  searchTerm: string;
  sortOption: SortOption;
  viewMode: ViewMode;
  theme: ThemeConfig;
  availableIcons: AvailableIcon[];
  studyTargetLanguage: 'spanish' | 'french';
  creationTargetLanguage: 'spanish' | 'french';
  selectedLevel: LanguageLevel | null;
  studyMode: StudyModeOption;
  
  setFlashcards: (flashcards: Flashcard[]) => void;
  setCategories: (categories: Category[]) => void;
  setActiveCategory: (categoryId: string | null) => void;
  setSearchTerm: (term: string) => void;
  setSortOption: (option: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleTheme: () => void;
  updateStudyTimerSettings: (enabled: boolean, duration: number) => void;
  updateCardChangeSound: (enabled: boolean) => void;
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'level'> & { level?: LanguageLevel }) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  filteredFlashcards: Flashcard[];
  homePageFlashcards: Flashcard[];
  getFlashcardById: (id: string) => Flashcard | undefined;
  getCategoryById: (id: string) => Category | undefined;
  addAvailableIcon: (iconName: string) => void;
  setStudyTargetLanguage: (language: 'spanish' | 'french') => void;
  setCreationTargetLanguage: (language: 'spanish' | 'french') => void;
  setSelectedLevel: (level: LanguageLevel | null) => void;
  setStudyMode: (mode: StudyModeOption) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const initialIcons: AvailableIcon[] = [
    { value: 'book', label: 'Book' },
    { value: 'briefcase', label: 'Business' },
    { value: 'utensils', label: 'Food' },
    { value: 'heart', label: 'Health' },
    { value: 'laptop', label: 'Technology' },
    { value: 'plane', label: 'Travel' },
    { value: 'music', label: 'Music' },
    { value: 'film', label: 'Entertainment' },
  ];

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [theme, setTheme] = useState<ThemeConfig>({ 
    isDarkMode: false,
    studyTimerEnabled: true,
    studyTimerDuration: 10,
    cardChangeSoundEnabled: true
  });
  const [availableIcons, setAvailableIcons] = useState<AvailableIcon[]>(initialIcons);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [studyTargetLanguage, setStudyTargetLanguage] = useState<'spanish' | 'french'>('spanish');
  const [creationTargetLanguage, setCreationTargetLanguage] = useState<'spanish' | 'french'>('spanish');
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studyMode, setStudyMode] = useState<StudyModeOption>('audio_image_text');

  // Cargar datos iniciales o filtrar datos del servidor para la página principal
  useEffect(() => {
    console.log('useEffect de carga/filtrado para página principal disparado.');
    const loadAndFilterHomePageData = async () => {
      try {
        console.log('Iniciando carga/filtrado de datos desde Supabase para página principal con filtros:', {
          activeCategory,
          searchTerm,
          selectedLevel,
          creationTargetLanguage
        });
        
        setIsLoading(true); // Indicar que estamos cargando/filtrando

        let query = supabase
          .from('flashcards')
          .select('*');

        // Aplicar filtro por categoría
        if (activeCategory) {
          query = query.contains('category_ids', [activeCategory]);
        }

        // Aplicar filtro por nivel
        if (selectedLevel) {
          query = query.eq('level', selectedLevel);
        }

        // Aplicar filtro por idioma de creación (tarjeta debe tener contenido en ese idioma)
        const targetTranslationColumn = creationTargetLanguage === 'spanish' ? 'spanish_translation' : 'french_translation';
        const targetSentenceColumn = creationTargetLanguage === 'spanish' ? 'spanish_sentence' : 'french_sentence';
        
        // Filtro para asegurar que tenga contenido en el idioma objetivo (traducción o frase no vacía)
        query = query.or(`${targetTranslationColumn}.neq.,${targetSentenceColumn}.neq.`);

        // Aplicar filtro de búsqueda por término (en varias columnas de texto)
        if (searchTerm) {
          const searchPattern = `%${searchTerm.toLowerCase()}%`;
          // Usamos ilike para búsqueda insensible a mayúsculas/minúsculas
          query = query.or(
            `english_word.ilike.${searchPattern},
             english_sentence.ilike.${searchPattern},
             spanish_translation.ilike.${searchPattern},
             spanish_sentence.ilike.${searchPattern},
             french_translation.ilike.${searchPattern},
             french_sentence.ilike.${searchPattern}`
          );
        }

        // TODO: Implementar ordenación si es necesario en la consulta (opcional)
        // Supabase soporta .order()

        const { data: flashcardsData, error: flashcardsError } = await query;

        if (flashcardsError) {
          console.error('Error al cargar/filtrar flashcards para página principal:', flashcardsError);
          throw flashcardsError;
        }
        console.log('Flashcards cargadas/filtradas para página principal (snake_case):', flashcardsData);

        // Mapear datos de snake_case a camelCase para el estado local
        const mappedFlashcards: Flashcard[] = (flashcardsData || []).map(card => ({
            id: card.id,
            englishWord: card.english_word,
            englishSentence: card.english_sentence,
            spanishTranslation: card.spanish_translation,
            spanishSentence: card.spanish_sentence,
            frenchTranslation: card.french_translation,
            frenchSentence: card.french_sentence,
            categoryIds: card.category_ids || [], // Asegurar que sea un array
            isFavorite: card.is_favorite,
            imageUrl: card.image_url,
            level: card.level,
            lastReviewed: card.last_reviewed,
            nextReviewDate: card.next_review_date,
            reviewCount: card.review_count
        }));

        setFlashcards(mappedFlashcards); // Guardar los datos filtrados para página principal
        console.log('Estado de flashcards después de la carga/filtrado para página principal (camelCase):', mappedFlashcards);

        // Cargar categorías solo una vez al inicio si aún no están cargadas
        if (categories.length === 0) {
           const { data: categoriesData, error: categoriesError } = await supabase
             .from('categories')
             .select('*');

           if (categoriesError) {
             console.error('Error al cargar categorías:', categoriesError);
             // Continuar a pesar del error, usando categorías por defecto o un array vacío si no hay datos anteriores
             setCategories(sampleCategories);
           } else {
              console.log('Categorías cargadas:', categoriesData);
              setCategories(categoriesData || []);
           }
        }

        // Cargar configuración desde localStorage solo una vez al inicio
        if (Object.keys(theme).length === 0) { // Verificar si el tema aún no se ha cargado
           const savedSettings = localStorage.getItem('userSettings');
           if (savedSettings) {
             const settings = JSON.parse(savedSettings);
             setTheme(settings.theme);
             setStudyTargetLanguage(settings.study_target_language);
             setCreationTargetLanguage(settings.creation_target_language);
             setViewMode(settings.view_mode);
             setSortOption(settings.sort_option);
             setStudyMode(settings.study_mode || 'audio_image_text');
           }
        }

      } catch (error) {
        console.error('Error al cargar/filtrar datos para página principal:', error);
        // En caso de error, podrías decidir mostrar un mensaje o cargar datos de muestra si están disponibles
        // setFlashcards(sampleFlashcards);
        // setCategories(sampleCategories);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndFilterHomePageData();

    // Dependencias: re-ejecutar este efecto cuando cambian los filtros relevantes para la página principal
  }, [activeCategory, searchTerm, selectedLevel, creationTargetLanguage]);

  // Filtro del lado del cliente para las tarjetas de la página de estudio (usa las flashcards ya cargadas/filtradas para la página principal)
  const studyPageFlashcards = useMemo(() => {
    console.log('Aplicando filtro de estudio del lado del cliente. Current studyTargetLanguage:', studyTargetLanguage);
    return flashcards.filter(card => {
      // Filter by study target language - card must have content in the target language
      const hasTargetLanguageContent = studyTargetLanguage === 'spanish'
        ? (card.spanishTranslation?.trim() || card.spanishSentence?.trim())
        : (card.frenchTranslation?.trim() || card.frenchSentence?.trim());

       console.log(`Card: ${card.englishWord}. Study Language: ${studyTargetLanguage}, Has Target Content: ${!!hasTargetLanguageContent}`);

      return hasTargetLanguageContent; // Solo aplicar el filtro de idioma de estudio aquí
    });
  }, [flashcards, studyTargetLanguage]); // Depende de las flashcards (ya filtradas por homepage) y del idioma de estudio

  // homePageFlashcards son las flashcards cargadas/filtradas directamente del servidor
  const homePageFlashcards = flashcards;

  // Guardar cambios en categorías
  useEffect(() => {
    const saveCategories = async () => {
      if (isLoading) return;
      
      try {
        console.log('Guardando categorías en Supabase:', categories);
        const { error } = await supabase
          .from('categories')
          .upsert(categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            icon: cat.icon,
            color: cat.color
          })));

        if (error) {
          console.error('Error al guardar categorías:', error);
          throw error;
        }
        console.log('Categorías guardadas exitosamente');
      } catch (error) {
        console.error('Error al guardar categorías:', error);
      }
    };

    saveCategories();
  }, [categories, isLoading]);

  // Guardar configuración de usuario
  const saveUserSettings = async () => {
    if (isLoading) return;
    
    try {
      console.log('Guardando configuración');
      
      // Por ahora, guardamos la configuración en localStorage en lugar de Supabase
      // hasta que implementemos la autenticación completa
      const settings = {
        theme: {
          isDarkMode: theme.isDarkMode,
          studyTimerEnabled: theme.studyTimerEnabled,
          studyTimerDuration: theme.studyTimerDuration,
          cardChangeSoundEnabled: theme.cardChangeSoundEnabled,
        },
        study_target_language: studyTargetLanguage,
        creation_target_language: creationTargetLanguage,
        view_mode: viewMode,
        sort_option: sortOption,
        study_mode: studyMode,
      };

      localStorage.setItem('userSettings', JSON.stringify(settings));
      console.log('Configuración guardada exitosamente en localStorage');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  };

  // Guardar configuración cuando cambie
  useEffect(() => {
    if (!isLoading) {
      saveUserSettings();
    }
  }, [theme, studyTargetLanguage, creationTargetLanguage, viewMode, sortOption, studyMode, isLoading]);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
    } catch (error) {
      console.error('Error al guardar flashcards:', error);
      // Si hay un error de almacenamiento, intentar limpiar datos antiguos
      try {
        localStorage.removeItem('flashcards');
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
      } catch (retryError) {
        console.error('Error al intentar guardar flashcards después de limpiar:', retryError);
      }
    }
  }, [flashcards]);
  
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);
  
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
    if (theme.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('availableIcons', JSON.stringify(availableIcons));
  }, [availableIcons]);
  
  // New persistence effect for studyTargetLanguage
  useEffect(() => {
    localStorage.setItem('studyTargetLanguage', studyTargetLanguage);
  }, [studyTargetLanguage]);
  
  // New persistence effect for creationTargetLanguage
  useEffect(() => {
    localStorage.setItem('creationTargetLanguage', creationTargetLanguage);
  }, [creationTargetLanguage]);
  
  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = { ...prev, isDarkMode: !prev.isDarkMode };
      return newTheme;
    });
  };

  const updateStudyTimerSettings = (enabled: boolean, duration: number) => {
    setTheme(prev => ({
      ...prev,
      studyTimerEnabled: enabled,
      studyTimerDuration: duration
    }));
  };

  const updateCardChangeSound = (enabled: boolean) => {
    setTheme(prev => ({
      ...prev,
      cardChangeSoundEnabled: enabled
    }));
  };
  
  const addFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'level'> & { level?: LanguageLevel }) => {
    // Prepare data for insertion - OMITTING the client-generated ID
    const flashcardDataForSupabase = {
      english_word: flashcard.englishWord,
      english_sentence: flashcard.englishSentence,
      spanish_translation: flashcard.spanishTranslation || null,
      spanish_sentence: flashcard.spanishSentence || null,
      french_translation: flashcard.frenchTranslation || null,
      french_sentence: flashcard.frenchSentence || null,
      category_ids: flashcard.categoryIds || [],
      is_favorite: flashcard.isFavorite,
      image_url: flashcard.imageUrl || null,
      level: flashcard.level || 'A1', // Asegurar que siempre haya un nivel, por defecto 'A1'
      // Inicializar campos de revisión para Supabase
      last_reviewed: null, // Usar snake_case para la base de datos
      next_review_date: null, // Usar snake_case para la base de datos
      review_count: 0 // Usar snake_case para la base de datos
    };

    try {
      console.log('Intentando insertar nueva flashcard en Supabase:', flashcardDataForSupabase);
      // Usar insert para que Supabase genere el ID
      const { data, error } = await supabase
        .from('flashcards')
        .insert([flashcardDataForSupabase]) // insert espera un array
        .select(); // Solicitar los datos insertados (incluido el ID generado)

      if (error) {
        console.error('Error al insertar nueva flashcard en Supabase:', error);
        throw error; // Propagar el error
      }

      if (data && data.length > 0) {
        const insertedFlashcardData = data[0];
        // Mapear de vuelta a camelCase para el estado local
        const newFlashcardWithId: Flashcard = {
          id: insertedFlashcardData.id,
          englishWord: insertedFlashcardData.english_word,
          englishSentence: insertedFlashcardData.english_sentence,
          spanishTranslation: insertedFlashcardData.spanish_translation,
          spanishSentence: insertedFlashcardData.spanish_sentence,
          frenchTranslation: insertedFlashcardData.french_translation,
          frenchSentence: insertedFlashcardData.french_sentence,
          categoryIds: insertedFlashcardData.category_ids || [],
          isFavorite: insertedFlashcardData.is_favorite,
          imageUrl: insertedFlashcardData.image_url,
          level: insertedFlashcardData.level,
          lastReviewed: insertedFlashcardData.last_reviewed,
          nextReviewDate: insertedFlashcardData.next_review_date,
          reviewCount: insertedFlashcardData.review_count
        };

        // Actualizar estado local con la flashcard que tiene el ID de Supabase
        setFlashcards(prevFlashcards => [...prevFlashcards, newFlashcardWithId]);

        console.log('Nueva flashcard insertada y estado local actualizado:', newFlashcardWithId.id);
      } else {
        console.error('Insert exitoso en Supabase, pero no se retornaron datos.');
      }

    } catch (error) {
      console.error('Error general en addFlashcard al guardar en Supabase:', error);
    }
  };
  
  const updateFlashcard = async (id: string, updates: Partial<Flashcard>) => {
    // Actualizar estado local primero
    setFlashcards(prevFlashcards => prevFlashcards.map(card => 
      card.id === id ? { ...card, ...updates, level: updates.level || card.level || 'A1' } : card
    ));

    // Preparar datos para upsert en Supabase - mapeando a snake_case y manejando opcionales
    const updatedDataForSupabase: any = { id }; // Siempre incluimos el ID para upsert

    if (updates.englishWord !== undefined) updatedDataForSupabase.english_word = updates.englishWord;
    if (updates.englishSentence !== undefined) updatedDataForSupabase.english_sentence = updates.englishSentence;
    if (updates.spanishTranslation !== undefined) updatedDataForSupabase.spanish_translation = updates.spanishTranslation || null;
    if (updates.spanishSentence !== undefined) updatedDataForSupabase.spanish_sentence = updates.spanishSentence || null;
    if (updates.frenchTranslation !== undefined) updatedDataForSupabase.french_translation = updates.frenchTranslation || null;
    if (updates.frenchSentence !== undefined) updatedDataForSupabase.french_sentence = updates.frenchSentence || null;
    if (updates.categoryIds !== undefined) updatedDataForSupabase.category_ids = updates.categoryIds || [];
    if (updates.isFavorite !== undefined) updatedDataForSupabase.is_favorite = updates.isFavorite;
    if (updates.imageUrl !== undefined) updatedDataForSupabase.image_url = updates.imageUrl || null;
    if (updates.level !== undefined) updatedDataForSupabase.level = updates.level || 'A1';
    if (updates.lastReviewed !== undefined) updatedDataForSupabase.last_reviewed = updates.lastReviewed || null;
    if (updates.nextReviewDate !== undefined) updatedDataForSupabase.next_review_date = updates.nextReviewDate || null;
    if (updates.reviewCount !== undefined) updatedDataForSupabase.review_count = updates.reviewCount ?? 0;
    
    try {
      console.log('Intentando actualizar flashcard en Supabase:', id, updatedDataForSupabase);
      // Usar upsert para actualizar
      const { error } = await supabase
        .from('flashcards')
        .upsert([updatedDataForSupabase]); // upsert espera un array

      if (error) {
        console.error('Error al actualizar flashcard en Supabase:', id, error);
        // Opcional: Revertir la actualización local si falla el guardado en Supabase
        // (Requiere guardar el estado previo o tener una copia de seguridad)
        throw error; // Propagar el error
      }
      console.log('Flashcard actualizada exitosamente en Supabase:', id);
    } catch (error) {
      console.error('Error general en updateFlashcard al guardar en Supabase:', error);
    }
  };
  
  const deleteFlashcard = async (id: string) => {
    // Actualizar estado local primero
    setFlashcards(prevFlashcards => prevFlashcards.filter(card => card.id !== id));

    // Eliminar en Supabase inmediatamente
    try {
      console.log('Intentando eliminar flashcard en Supabase:', id);
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id); // Eliminar donde el ID coincide

      if (error) {
        console.error('Error al eliminar flashcard en Supabase:', id, error);
        // Opcional: Revertir la eliminación local si falla el guardado en Supabase
        // (Requiere añadir de nuevo la flashcard eliminada)
        throw error; // Propagar el error
      }
      console.log('Flashcard eliminada exitosamente en Supabase:', id);
    } catch (error) {
      console.error('Error general en deleteFlashcard al eliminar en Supabase:', error);
    }
  };
  
  const toggleFavorite = async (id: string) => {
    // Actualizar estado local
    setFlashcards(prevFlashcards => prevFlashcards.map(card => 
      card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
    ));

    // Obtener el estado actualizado para enviar a Supabase
    const cardToUpdate = flashcards.find(card => card.id === id);
    if (!cardToUpdate) return; // No hacer nada si no se encuentra la tarjeta

    try {
      console.log('Intentando actualizar favorito en Supabase para flashcard:', id, 'isFavorite:', !cardToUpdate.isFavorite);
      const { error } = await supabase
        .from('flashcards')
        .update({ is_favorite: !cardToUpdate.isFavorite }) // Usar snake_case para la base de datos
        .eq('id', id);

      if (error) {
        console.error('Error al actualizar favorito en Supabase para flashcard:', id, error);
        // Opcional: Revertir el cambio local si falla el guardado en Supabase
        // setFlashcards(prevFlashcards => prevFlashcards.map(card => 
        //   card.id === id ? { ...card, isFavorite: cardToUpdate.isFavorite } : card
        // ));
        throw error; // Propagar el error
      }
      console.log('Favorito actualizado exitosamente en Supabase para flashcard:', id);
    } catch (error) {
      console.error('Error general en toggleFavorite al guardar en Supabase:', error);
    }
  };
  
  const addCategory = async (category: Omit<Category, 'id'>) => {
    // Preparar datos para la inserción - omitiendo el ID ya que Supabase lo generará
    const categoryDataForSupabase = {
      name: category.name,
      icon: category.icon,
      color: category.color || 'primary', // Asegurar un color por defecto
    };

    try {
      console.log('Intentando insertar nueva categoría en Supabase:', categoryDataForSupabase);
      // Usar insert para que Supabase genere el ID
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryDataForSupabase]) // insert espera un array
        .select(); // Solicitar los datos insertados (incluido el ID generado)

      if (error) {
        console.error('Error al insertar nueva categoría en Supabase:', error);
        throw error; // Propagar el error
      }

      if (data && data.length > 0) {
        const insertedCategoryData = data[0];
        // Actualizar estado local con la categoría que tiene el ID de Supabase
        setCategories(prevCategories => [...prevCategories, insertedCategoryData]);
        console.log('Nueva categoría insertada y estado local actualizado:', insertedCategoryData.id);
      } else {
        console.error('Insert exitoso en Supabase, pero no se retornaron datos para la categoría.');
      }

    } catch (error) {
      console.error('Error general en addCategory al guardar en Supabase:', error);
    }
  };
  
  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };
  
  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
    
    setFlashcards(flashcards.filter(card => !card.categoryIds.includes(id)));
  };
  
  const addAvailableIcon = (iconName: string) => {
    if (iconName.trim() && !availableIcons.some(icon => icon.value === iconName.trim().toLowerCase())) {
      const newIcon = { value: iconName.trim().toLowerCase(), label: iconName.trim() };
      setAvailableIcons(prev => [...prev, newIcon]);
    }
  };
  
  // filteredFlashcards ahora es simplemente el estado flashcards
  const filteredFlashcards = flashcards;
  
  const getFlashcardById = (id: string) => {
    return flashcards.find(card => card.id === id);
  };
  
  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };
  
  const contextValue: AppContextType = {
    flashcards,
    categories,
    activeCategory,
    searchTerm,
    sortOption,
    viewMode,
    theme,
    availableIcons,
    studyTargetLanguage,
    creationTargetLanguage,
    selectedLevel,
    studyMode,
    
    setFlashcards,
    setCategories,
    setActiveCategory,
    setSearchTerm,
    setSortOption,
    setViewMode,
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
    homePageFlashcards,
    getFlashcardById,
    getCategoryById,
    addAvailableIcon,
    setStudyTargetLanguage,
    setCreationTargetLanguage,
    setSelectedLevel,
    setStudyMode,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;