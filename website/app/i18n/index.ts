import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import enCommon from './locales/en/common.json';
import enNav from './locales/en/nav.json';
import enHero from './locales/en/hero.json';
import enFeatures from './locales/en/features.json';
import enGallery from './locales/en/gallery.json';
import enTraining from './locales/en/training.json';
import enAI from './locales/en/ai.json';
import enAvatars from './locales/en/avatars.json';
import enFooter from './locales/en/footer.json';
import enCTA from './locales/en/cta.json';
import enPrivacy from './locales/en/privacy.json';
import enTerms from './locales/en/terms.json';

// Arabic translations
import arCommon from './locales/ar/common.json';
import arNav from './locales/ar/nav.json';
import arHero from './locales/ar/hero.json';
import arFeatures from './locales/ar/features.json';
import arGallery from './locales/ar/gallery.json';
import arTraining from './locales/ar/training.json';
import arAI from './locales/ar/ai.json';
import arAvatars from './locales/ar/avatars.json';
import arFooter from './locales/ar/footer.json';
import arCTA from './locales/ar/cta.json';
import arPrivacy from './locales/ar/privacy.json';
import arTerms from './locales/ar/terms.json';

const resources = {
  en: {
    common: enCommon,
    nav: enNav,
    hero: enHero,
    features: enFeatures,
    gallery: enGallery,
    training: enTraining,
    ai: enAI,
    avatars: enAvatars,
    footer: enFooter,
    cta: enCTA,
    privacy: enPrivacy,
    terms: enTerms,
  },
  ar: {
    common: arCommon,
    nav: arNav,
    hero: arHero,
    features: arFeatures,
    gallery: arGallery,
    training: arTraining,
    ai: arAI,
    avatars: arAvatars,
    footer: arFooter,
    cta: arCTA,
    privacy: arPrivacy,
    terms: arTerms,
  },
};

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Get initial language - only check localStorage on client side
const getInitialLanguage = () => {
  if (isBrowser) {
    const stored = localStorage.getItem('chea-website-language');
    if (stored && (stored === 'en' || stored === 'ar')) {
      return stored;
    }
  }
  return 'en'; // Default to English for SSR
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(), // Set initial language synchronously
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'nav', 'hero', 'features', 'gallery', 'training', 'ai', 'avatars', 'footer', 'cta', 'privacy', 'terms'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'chea-website-language',
    },
  });

// On client side, after hydration, we can change language if needed
if (isBrowser) {
  // Check if there's a stored language different from current
  const storedLang = localStorage.getItem('chea-website-language');
  if (storedLang && storedLang !== i18n.language) {
    // Use setTimeout to ensure this happens after hydration
    setTimeout(() => {
      i18n.changeLanguage(storedLang);
    }, 0);
  }
}

export default i18n;
