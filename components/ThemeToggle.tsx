'use client';

import { useEffect, useState } from 'react';

// Manual override on top of the system-preference default set in
// layout.tsx's inline script. Persists to localStorage so a choice
// sticks across visits — layout.tsx's script checks the same key before
// falling back to system preference.
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('sanctum-theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      className="rounded-full border border-text-muted/30 px-3 py-1 font-sans text-xs text-text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
