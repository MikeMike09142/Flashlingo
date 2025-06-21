import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import StudyPage from './pages/StudyPage';
import StatsPage from './pages/StatsPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import FlashcardFormPage from './pages/FlashcardFormPage';
import FlashcardDetailPage from './pages/FlashcardDetailPage';
import CategoryFormPage from './pages/CategoryFormPage';

// Componente para manejar el tema
const ThemeManager: React.FC = () => {
  const { theme } = useAppContext();

  useEffect(() => {
    if (theme.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.isDarkMode]);

  return null; // Este componente no renderiza nada
};

const App: React.FC = () => {
  return (
    <>
      <ThemeManager />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="study" element={<StudyPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="flashcards/new" element={<FlashcardFormPage />} />
          <Route path="flashcards/edit/:id" element={<FlashcardFormPage />} />
          <Route path="flashcards/:id" element={<FlashcardDetailPage />} />
          <Route path="category/new" element={<CategoryFormPage />} />
          <Route path="category/edit/:id" element={<CategoryFormPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;