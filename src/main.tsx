import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <Router>
        <App />
      </Router>
    </AppProvider>
  </StrictMode>
);
