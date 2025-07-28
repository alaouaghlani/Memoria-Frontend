import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-react-native-language-detector';

import en from './locales/en.json';
import fr from './locales/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // 👈 important: this links i18n with react-i18next
  .init({
    compatibilityJSON: 'v3', // for React Native compatibility
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    interpolation: {
      escapeValue: false, // not needed for React
    },
    debug: true, // Optional: log info to console
  });

export default i18n;
