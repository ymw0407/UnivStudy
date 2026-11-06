import { useEffect, useState } from 'react';
import * as s from './ThemeToggle.css';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'os-book:theme';

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  const attr = document.documentElement.dataset.theme;
  if (attr === 'dark' || attr === 'light') return attr;
  return 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage blocked — ignore */
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const label = theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';

  return (
    <button type="button" className={s.button} onClick={toggle} aria-label={label} title={label}>
      <span className={s.icon} aria-hidden>
        {theme === 'dark' ? '☀︎' : '☾'}
      </span>
    </button>
  );
}
