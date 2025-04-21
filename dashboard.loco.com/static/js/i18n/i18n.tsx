import {
  isLanguageSelectionEnabled,
  isPRODUCTION,
  isWebViewBuild,
} from '@src/constent'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import translation_en from './en/common.json'
import translation_es from './es-AR/common.json'
import translation_fil from './fil/common.json'
import translation_id from './id/common.json'
import translation_ko from './ko/common.json'
import translation_nl from './nl/common.json'
import translation_pt from './pt-BR/common.json'
import translation_ru from './ru/common.json'
import translation_tr from './tr/common.json'

const resources = {
  en: { translation: translation_en },
  'es-AR': { translation: translation_es },
  fil: { translation: translation_fil },
  id: { translation: translation_id },
  ko: { translation: translation_ko },
  nl: { translation: translation_nl },
  'pt-BR': { translation: translation_pt },
  ru: { translation: translation_ru },
  tr: { translation: translation_tr },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: isLanguageSelectionEnabled() && !isPRODUCTION, // Enable this for debugging
    resources: resources,
    ns: ['translation'],
    defaultNS: ['translation'],
    fallbackLng: 'en',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: isWebViewBuild
        ? ['localStorage', 'cookie']
        : ['querystring', 'localStorage', 'cookie', 'sessionStorage'],
      lookupQuerystring: 'lang',
      caches: ['localStorage', 'cookie'],
      lookupCookie: 'language',
      lookupLocalStorage: 'language',
      lookupSessionStorage: 'language',
    },
  })

export default i18n
