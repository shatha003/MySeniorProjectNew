'use client';

import { useTheme } from './theme-provider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant/20 bg-surface-container-high hover:bg-surface-container-highest transition-all duration-300 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>light_mode</span>
      ) : (
        <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>dark_mode</span>
      )}
      <span className="text-on-surface-variant text-sm headline font-semibold">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
