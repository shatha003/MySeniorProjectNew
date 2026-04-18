'use client';

import { useTranslation } from 'react-i18next';
import { useTheme } from './theme-provider';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation('common');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const currentLang = i18n.language || 'en';
  const isRTL = currentLang === 'ar';

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    // Store in localStorage
    localStorage.setItem('chea-website-language', newLang);
    // Reload page to apply RTL/LTR changes and ensure consistent rendering
    window.location.reload();
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant/20 bg-surface-container-high hover:bg-surface-container-highest transition-all duration-300 active:scale-95 font-headline font-semibold text-sm ${isDark ? 'text-on-surface' : 'text-on-surface'}`}
      aria-label={isRTL ? 'Switch to English' : 'التبديل للعربية'}
    >
      <span className="material-symbols-outlined text-lg">
        translate
      </span>
      <span className="hidden sm:inline">{isRTL ? 'English' : 'العربية'}</span>
    </button>
  );
}
