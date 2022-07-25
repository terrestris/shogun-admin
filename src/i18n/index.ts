import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {
  initReactI18next
} from 'react-i18next';

import resources from './translations';

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
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
