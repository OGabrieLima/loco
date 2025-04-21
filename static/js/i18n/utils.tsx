import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_PRESET,
  SUPPORTED_LANGUAGE,
} from './constants'

export const useRtlTranslation = () => {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  return lang === 'ar'
}

export const parseSelectedLanguage = (language?: string): LANGUAGE_PRESET => {
  // Direct match
  if (SUPPORTED_LANGUAGE[language as LANGUAGE_PRESET]) {
    return language as LANGUAGE_PRESET
  }
  // Match first two characters
  const langPrefix = language?.split('-')[0]
  const matchedLang = langPrefix
    ? Object.keys(SUPPORTED_LANGUAGE).find((key) => key.startsWith(langPrefix))
    : ''

  return (matchedLang as LANGUAGE_PRESET) || DEFAULT_LANGUAGE // Default to English if no match found
}

export const useRedirectUtilParams = () => {
  // using same login in Server-Side and Client-Side
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage

  const queryToAppend = useMemo(() => {
    let thisLang = lang
    if (Array.isArray(thisLang)) {
      thisLang = thisLang[0]
    }
    thisLang = parseSelectedLanguage(thisLang)
    if (thisLang === DEFAULT_LANGUAGE) return null
    return thisLang.toLowerCase()
  }, [lang])

  const modifyUrl = (url: string) => {
    if (!url || !queryToAppend) return url
    const [urlPrefix, ...restSearchParams] = url.split('?')
    url = urlPrefix
    if (!url.endsWith('/')) {
      url = url + '/'
    }
    const restPartsJoined = restSearchParams.join('&') // because we never have two ? in the url
    const searchParams = new URLSearchParams(restPartsJoined || '')
    searchParams.set('lang', queryToAppend)
    return url + '?' + searchParams.toString()
  }
  return { modifyUrl }
}
