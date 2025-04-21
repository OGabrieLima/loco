import { isLanguageSelectionEnabled } from '@src/constent'

export type LANGUAGE_PRESET =
  | 'en'
  | 'pt-BR'
  | 'es-AR'
  | 'id'
  | 'ru'
  | 'ko'
  | 'tr'
  | 'nl'
  | 'fil'

export interface LangName {
  nativeName: string
}

export const DEFAULT_LANGUAGE = 'en' as const

export const SUPPORTED_LANGUAGE: Record<LANGUAGE_PRESET, LangName> = {
  en: { nativeName: 'English' },
  'pt-BR': { nativeName: 'Português (Brasil)' },
  'es-AR': { nativeName: 'Español' },
  id: { nativeName: 'Bahasa Indonesia' },
  ru: { nativeName: 'Русский' },
  ko: { nativeName: '한국어' },
  tr: { nativeName: 'Türkçe' },
  nl: { nativeName: 'Nederlands' },
  fil: { nativeName: 'Filipino' },
}
