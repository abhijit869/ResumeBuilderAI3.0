export type ThemeMode = 'system' | 'light' | 'dark';

const THEME_STORAGE_KEY = 'resumegpt-theme';
const THEME_EVENT = 'resumegpt-theme-change';

export function getThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

export function applyThemeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', mode === 'dark' || (mode === 'system' && prefersDark));
  document.documentElement.dataset.theme = mode;
}

export function setThemeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  applyThemeMode(mode);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: mode }));
}

export function subscribeToThemeChanges(listener: (mode: ThemeMode) => void) {
  if (typeof window === 'undefined') return () => undefined;
  const handleThemeChange = (event: Event) => {
    const mode = (event as CustomEvent<ThemeMode>).detail;
    if (mode === 'system' || mode === 'light' || mode === 'dark') listener(mode);
  };
  window.addEventListener(THEME_EVENT, handleThemeChange);
  return () => window.removeEventListener(THEME_EVENT, handleThemeChange);
}