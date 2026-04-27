import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enNav from './locales/en/nav.json';
import enDashboard from './locales/en/dashboard.json';
import enLinkScanner from './locales/en/linkScanner.json';
import enFileScanner from './locales/en/fileScanner.json';
import enPasswordGenerator from './locales/en/passwordGenerator.json';
import enPasswordChecker from './locales/en/passwordChecker.json';
import enEncryption from './locales/en/encryption.json';
import enVault from './locales/en/vault.json';
import enSettings from './locales/en/settings.json';
import enAiAgent from './locales/en/aiAgent.json';
import enQuiz from './locales/en/quiz.json';
import enPhishing from './locales/en/phishing.json';
import enImagePrivacy from './locales/en/imagePrivacy.json';
import enCalculator from './locales/en/calculator.json';
import enLanding from './locales/en/landing.json';
import enTerms from './locales/en/terms.json';
import enPrivacy from './locales/en/privacy.json';
import enComponents from './locales/en/components.json';
import enScenarioSimulator from './locales/en/scenarioSimulator.json';
import enSecurityBuddy from './locales/en/securityBuddy.json';
import enPhishingAI from './locales/en/phishingAI.json';
import enScanAIAnalysis from './locales/en/scanAIAnalysis.json';
import enAttackNarrative from './locales/en/attackNarrative.json';
import enSecurityPosture from './locales/en/securityPosture.json';

import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';
import arNav from './locales/ar/nav.json';
import arDashboard from './locales/ar/dashboard.json';
import arLinkScanner from './locales/ar/linkScanner.json';
import arFileScanner from './locales/ar/fileScanner.json';
import arPasswordGenerator from './locales/ar/passwordGenerator.json';
import arPasswordChecker from './locales/ar/passwordChecker.json';
import arEncryption from './locales/ar/encryption.json';
import arVault from './locales/ar/vault.json';
import arSettings from './locales/ar/settings.json';
import arAiAgent from './locales/ar/aiAgent.json';
import arQuiz from './locales/ar/quiz.json';
import arPhishing from './locales/ar/phishing.json';
import arImagePrivacy from './locales/ar/imagePrivacy.json';
import arCalculator from './locales/ar/calculator.json';
import arLanding from './locales/ar/landing.json';
import arTerms from './locales/ar/terms.json';
import arPrivacy from './locales/ar/privacy.json';
import arComponents from './locales/ar/components.json';
import arScenarioSimulator from './locales/ar/scenarioSimulator.json';
import arSecurityBuddy from './locales/ar/securityBuddy.json';
import arPhishingAI from './locales/ar/phishingAI.json';
import arScanAIAnalysis from './locales/ar/scanAIAnalysis.json';
import arAttackNarrative from './locales/ar/attackNarrative.json';
import arSecurityPosture from './locales/ar/securityPosture.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    nav: enNav,
    dashboard: enDashboard,
    linkScanner: enLinkScanner,
    fileScanner: enFileScanner,
    passwordGenerator: enPasswordGenerator,
    passwordChecker: enPasswordChecker,
    encryption: enEncryption,
    vault: enVault,
    settings: enSettings,
    aiAgent: enAiAgent,
    quiz: enQuiz,
    phishing: enPhishing,
    imagePrivacy: enImagePrivacy,
    calculator: enCalculator,
    landing: enLanding,
    terms: enTerms,
    privacy: enPrivacy,
    components: enComponents,
    scenarioSimulator: enScenarioSimulator,
    securityBuddy: enSecurityBuddy,
    phishingAI: enPhishingAI,
    scanAIAnalysis: enScanAIAnalysis,
    attackNarrative: enAttackNarrative,
    securityPosture: enSecurityPosture,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    nav: arNav,
    dashboard: arDashboard,
    linkScanner: arLinkScanner,
    fileScanner: arFileScanner,
    passwordGenerator: arPasswordGenerator,
    passwordChecker: arPasswordChecker,
    encryption: arEncryption,
    vault: arVault,
    settings: arSettings,
    aiAgent: arAiAgent,
    quiz: arQuiz,
    phishing: arPhishing,
    imagePrivacy: arImagePrivacy,
    calculator: arCalculator,
    landing: arLanding,
    terms: arTerms,
    privacy: arPrivacy,
    components: arComponents,
    scenarioSimulator: arScenarioSimulator,
    securityBuddy: arSecurityBuddy,
    phishingAI: arPhishingAI,
    scanAIAnalysis: arScanAIAnalysis,
    attackNarrative: arAttackNarrative,
    securityPosture: arSecurityPosture,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: [
      'common', 'auth', 'nav', 'dashboard', 'linkScanner', 'fileScanner',
      'passwordGenerator', 'passwordChecker', 'encryption', 'vault',
      'settings', 'aiAgent', 'quiz', 'phishing', 'imagePrivacy',
      'calculator', 'landing', 'terms', 'privacy', 'components',
      'scenarioSimulator', 'securityBuddy', 'phishingAI',
      'scanAIAnalysis', 'attackNarrative', 'securityPosture',
    ],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'chea-language',
    },
  });

export default i18n;
