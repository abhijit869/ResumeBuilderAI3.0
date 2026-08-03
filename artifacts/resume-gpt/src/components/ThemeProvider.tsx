import { useEffect, type ReactNode } from 'react';
import { applyThemeMode, getThemeMode, setThemeMode } from '@/lib/theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const mode = getThemeMode();
    applyThemeMode(mode);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (getThemeMode() === 'system') applyThemeMode('system');
    };
    media.addEventListener?.('change', handleSystemChange);
    return () => media.removeEventListener?.('change', handleSystemChange);
  }, []);

  return (
    <>{children}</>
  );
}