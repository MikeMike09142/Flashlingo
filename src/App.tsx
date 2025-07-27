import React, { useEffect, useState } from 'react';
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

// Component to handle rotation overlay
const RotationOverlay: React.FC = () => {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscapeMode = window.innerHeight < window.innerWidth && window.innerHeight < 500;
      setIsLandscape(isLandscapeMode);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isLandscape) return null;

  return (
    <div className="rotation-overlay">
      <div className="rotation-icon">📱</div>
      <div>
        <h2 style={{ marginBottom: '10px', fontSize: '20px' }}>Please rotate your device</h2>
        <p>This app works best in portrait mode</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = React.useState<boolean>(() => {
    // Check if running in APK/TWA environment
    const isAPK = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone === true ||
                  document.referrer.includes('android-app://');
    
    // For APK, always show welcome on first launch
    if (isAPK) {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      return !hasSeenWelcome;
    }
    
    // For web, use existing logic
    return !localStorage.getItem('hasSeenWelcome');
  });

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

  // Enhanced orientation lock
  useEffect(() => {
    // Lock screen orientation to portrait if supported
    if ('screen' in window && 'orientation' in window.screen) {
      const screen = window.screen as any;
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait').catch((err: any) => {
          console.log('Orientation lock not supported:', err);
        });
      }
    }
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    const preventZoom = (e: TouchEvent) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };
    
    document.addEventListener('touchend', preventZoom, { passive: false });
    
    return () => {
      document.removeEventListener('touchend', preventZoom);
    };
  }, []);

  if (showWelcome) {
    return (
      <>
        <ThemeManager />
        <RotationOverlay />
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
      <RotationOverlay />
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