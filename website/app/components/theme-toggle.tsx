'use client';

import { useTheme } from './theme-provider';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === 'dark';

  // Prevent hydration mismatch by showing placeholder until mounted
  if (!mounted) {
    return (
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant/20 bg-surface-container-high"
        aria-label="Toggle theme"
        disabled
      >
        <span className="material-symbols-outlined text-neon-crimson text-xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>dark_mode</span>
        <span className="text-on-surface-variant text-sm font-headline font-semibold">Dark</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant/20 bg-surface-container-high hover:bg-surface-container-highest transition-all duration-300 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <span className={`material-symbols-outlined text-xl ${isDark ? 'text-neon-crimson' : 'text-neon-violet'}`} style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>light_mode</span>
      ) : (
        <span className={`material-symbols-outlined text-xl ${isDark ? 'text-neon-crimson' : 'text-neon-violet'}`} style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>dark_mode</span>
      )}
      <span className="text-on-surface-variant text-sm font-headline font-semibold">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
