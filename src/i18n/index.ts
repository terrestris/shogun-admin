import i18n, { use } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {
  initReactI18next
} from 'react-i18next';

import resources from './translations';

// eslint-disable-next-line react-hooks/rules-of-hooks
use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    supportedLngs: ['de', 'en']
  });

export default i18n;
