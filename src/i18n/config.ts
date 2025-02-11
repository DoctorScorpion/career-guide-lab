
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
  react: {
    useSuspense: false,
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
  },
  partialBundledLanguages: false,
  load: 'all',
});

// Handle RTL/LTR direction changes
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'he' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
  // Force re-render of RTL sensitive components
  window.dispatchEvent(new Event('resize'));
});

export default i18n;
