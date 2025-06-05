import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import './styles/globals.css';

// Pages (Lazy Loaded)
const HomePage = lazy(() => import('./pages/HomePage'));
const StudyPage = lazy(() => import('./pages/StudyPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const LearnedPage = lazy(() => import('./pages/LearnedPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const FlashcardDetailPage = lazy(() => import('./pages/FlashcardDetailPage'));
const FlashcardFormPage = lazy(() => import('./pages/FlashcardFormPage'));
const CategoryFormPage = lazy(() => import('./pages/CategoryFormPage'));

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<div>Cargando...</div>}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="study" element={<StudyPage />} />
                  <Route path="favorites" element={<FavoritesPage />} />
                  <Route path="learned" element={<LearnedPage />} />
                  <Route path="stats" element={<StatsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="flashcard/:id" element={<FlashcardDetailPage />} />
                  <Route path="create" element={<FlashcardFormPage />} />
                  <Route path="edit/:id" element={<FlashcardFormPage />} />
                  <Route path="create-category" element={<CategoryFormPage />} />
                </Route>
              </Routes>
            </Suspense>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;