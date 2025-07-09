import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import StudyPage from './pages/StudyPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import FlashcardFormPage from './pages/FlashcardFormPage';
import FlashcardDetailPage from './pages/FlashcardDetailPage';
import CategoryFormPage from './pages/CategoryFormPage';
import AchievementsPage from './pages/AchievementsPage';
import WelcomeScreen from './components/WelcomeScreen';
import { requestNotificationPermission } from './firebase';

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
  const [showWelcome, setShowWelcome] = React.useState<boolean>(() => !localStorage.getItem('hasSeenWelcome'));

  // Inicializar SpeechSynthesis al cargar la app para evitar delay en el primer audio
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      // Reproducir un utterance vacío para "despertar" la voz
      const utterance = new window.SpeechSynthesisUtterance(' ');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    // Solicita permiso de notificaciones push al cargar la app
    requestNotificationPermission("BP8Cs5f7FOuYwWub76EhOv9_bYmgSdyURf8vu-LhX26NXWK_jenzKSujh4QTudoSK9Bs7Z52HBpIWgFzo213Rvl");
  }, []);

  if (showWelcome) {
    return (
      <>
        <ThemeManager />
        <WelcomeScreen
          onFinish={() => {
            localStorage.setItem('hasSeenWelcome', 'true');
            setShowWelcome(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <ThemeManager />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="study" element={<StudyPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="flashcards/new" element={<FlashcardFormPage />} />
          <Route path="flashcards/edit/:id" element={<FlashcardFormPage />} />
          <Route path="flashcards/:id" element={<FlashcardDetailPage />} />
          <Route path="category/new" element={<CategoryFormPage />} />
          <Route path="category/edit/:id" element={<CategoryFormPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;