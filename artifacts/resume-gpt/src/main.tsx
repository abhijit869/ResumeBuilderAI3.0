import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';
import { applyThemeMode, getThemeMode } from './lib/theme';

applyThemeMode(getThemeMode());

createRoot(document.getElementById('root')!).render(<App />);
