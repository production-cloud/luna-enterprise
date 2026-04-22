import { useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';
const KEY = 'luna.theme';

const readInitial = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(KEY);
  return stored === 'dark' ? 'dark' : 'light';
};

const apply = (t: Theme) => {
  const root = document.documentElement;
  if (t === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(readInitial);

  useEffect(() => {
    apply(theme);
    try { window.localStorage.setItem(KEY, theme); } catch {}
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle, setTheme };
};