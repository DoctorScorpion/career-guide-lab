
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

i18n.use(initReactI18next).init({
  resources: {
    he: { translation: translations.he },
    en: { translation: translations.en },
  },
  lng: 'he', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  // Add these options for better RTL support
  react: {
    useSuspense: false,
  },
});

// Set initial direction
document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language;

export default i18n;
