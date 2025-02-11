
import { navTranslations } from './translations/nav';
import { heroTranslations } from './translations/hero';
import { servicesTranslations } from './translations/services';
import { valuesTranslations } from './translations/values';
import { aboutTranslations } from './translations/about';
import { contactTranslations } from './translations/contact';
import { resumeTranslations } from './translations/resume';

export const translations = {
  he: {
    ...navTranslations.he,
    ...heroTranslations.he,
    ...servicesTranslations.he,
    ...valuesTranslations.he,
    ...aboutTranslations.he,
    ...contactTranslations.he,
    ...resumeTranslations.he,
  },
  en: {
    ...navTranslations.en,
    ...heroTranslations.en,
    ...servicesTranslations.en,
    ...valuesTranslations.en,
    ...aboutTranslations.en,
    ...contactTranslations.en,
    ...resumeTranslations.en,
  },
};
