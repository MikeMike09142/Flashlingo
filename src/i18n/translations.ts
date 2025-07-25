export const translations = {
  en: {
    // Navigation
    home: 'Home',
    studyCards: 'Study Cards',
    favorites: 'Favorites',
    settings: 'Settings',
    
    // Header
    searchPlaceholder: 'Search flashcards...',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    search: 'Search',
    switchToLightMode: 'Switch to light mode',
    switchToDarkMode: 'Switch to dark mode',
    
    // Sidebar
    categories: 'Categories',
    allCategories: 'All Categories',
    addNewCategory: 'Add new category',
    categoryNamePlaceholder: 'Category name...',
    createCategory: 'Create category',
    cancelCategoryCreation: 'Cancel category creation',
    deleteCategoryConfirm: 'Are you sure you want to delete this category? This will also remove the category from all associated cards.',
    
    // Study
    startStudy: 'Start Study',
    studySession: 'Study Session',
    showAnswer: 'Show Answer',
    nextCard: 'Next Card',
    previousCard: 'Previous Card',
    correct: 'Correct',
    incorrect: 'Incorrect',
    studyComplete: 'Study Complete!',
    studyAgain: 'Study Again',
    
    // Flashcard Form
    createFlashcard: 'Create Flashcard',
    editFlashcard: 'Edit Flashcard',
    englishWord: 'English Word',
    spanishTranslation: 'Spanish Translation',
    frenchTranslation: 'French Translation',
    englishSentence: 'English Sentence',
    spanishSentence: 'Spanish Sentence',
    frenchSentence: 'French Sentence',
    selectCategories: 'Select Categories',
    selectLevel: 'Select Level',
    imageUrl: 'Image URL (optional)',
    save: 'Save',
    cancel: 'Cancel',
    
    // General
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    
    // Levels
    level: 'Level',
    beginner: 'Beginner',
    elementary: 'Elementary',
    intermediate: 'Intermediate',
    upperIntermediate: 'Upper Intermediate',
    advanced: 'Advanced',
    proficient: 'Proficient',
    
    // Settings
    language: 'Language',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    systemDefault: 'System Default',
    
    // Study modes
    flashcardMode: 'Flashcard Mode',
    quizMode: 'Quiz Mode',
    reviewMode: 'Review Mode',
  },
  es: {
    // Navigation
    home: 'Inicio',
    studyCards: 'Estudiar Tarjetas',
    favorites: 'Favoritos',
    settings: 'Configuración',
    
    // Header
    searchPlaceholder: 'Buscar tarjetas...',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    search: 'Buscar',
    switchToLightMode: 'Cambiar a modo claro',
    switchToDarkMode: 'Cambiar a modo oscuro',
    
    // Sidebar
    categories: 'Categorías',
    allCategories: 'Todas las Categorías',
    addNewCategory: 'Agregar nueva categoría',
    categoryNamePlaceholder: 'Nombre de categoría...',
    createCategory: 'Crear categoría',
    cancelCategoryCreation: 'Cancelar creación de categoría',
    deleteCategoryConfirm: '¿Estás seguro de que quieres eliminar esta categoría? Esto también eliminará la categoría de todas las tarjetas asociadas.',
    
    // Study
    startStudy: 'Comenzar Estudio',
    studySession: 'Sesión de Estudio',
    showAnswer: 'Mostrar Respuesta',
    nextCard: 'Siguiente Tarjeta',
    previousCard: 'Tarjeta Anterior',
    correct: 'Correcto',
    incorrect: 'Incorrecto',
    studyComplete: '¡Estudio Completado!',
    studyAgain: 'Estudiar de Nuevo',
    
    // Flashcard Form
    createFlashcard: 'Crear Tarjeta',
    editFlashcard: 'Editar Tarjeta',
    englishWord: 'Palabra en Inglés',
    spanishTranslation: 'Traducción al Español',
    frenchTranslation: 'Traducción al Francés',
    englishSentence: 'Oración en Inglés',
    spanishSentence: 'Oración en Español',
    frenchSentence: 'Oración en Francés',
    selectCategories: 'Seleccionar Categorías',
    selectLevel: 'Seleccionar Nivel',
    imageUrl: 'URL de Imagen (opcional)',
    save: 'Guardar',
    cancel: 'Cancelar',
    
    // General
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    confirm: 'Confirmar',
    
    // Levels
    level: 'Nivel',
    beginner: 'Principiante',
    elementary: 'Elemental',
    intermediate: 'Intermedio',
    upperIntermediate: 'Intermedio Superior',
    advanced: 'Avanzado',
    proficient: 'Competente',
    
    // Settings
    language: 'Idioma',
    theme: 'Tema',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    systemDefault: 'Predeterminado del Sistema',
    
    // Study modes
    flashcardMode: 'Modo Tarjetas',
    quizMode: 'Modo Quiz',
    reviewMode: 'Modo Repaso',
  }
};

export type TranslationKey = keyof typeof translations.en;
export type Language = keyof typeof translations;