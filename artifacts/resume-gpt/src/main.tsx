import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';
import { applyThemeMode, getThemeMode } from './lib/theme';
import { AppErrorBoundary } from './components/AppErrorBoundary';

applyThemeMode(getThemeMode());

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
