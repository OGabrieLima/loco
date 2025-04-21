import { updateUserLanguage } from '@api/apiRequest'
import { updateMe } from '@modules/Login/loginSlice'
import { parseSelectedLanguage } from '@src/i18n/utils'
import { eventActions, eventConstants, eventPropsTypes } from '@utils/Amplitude'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../app/RootReducer'
import { isLanguageSelectionEnabled, isWebViewBuild } from '../../constent'

const DetectAppLanguage = () => {
  // use this at root level only
  const dispatch = useDispatch()
  const langParamRef = useRef('')
  const { i18n } = useTranslation()

  const { me } = useSelector((state: RootState) => state.login)

  const { accessToken, refreshToken, previousVisit } = useSelector(
    (state: RootState) => state.app
  )

  const isTokenPresent = !!(accessToken && refreshToken)
  const isUserPresent = !!(isTokenPresent && me?.username)
  if (typeof window !== 'undefined') {
    const queryLanguage = new URLSearchParams(window.location.search)
    const lang = queryLanguage.get('lang') || null
    langParamRef.current = langParamRef.current || lang || ''
  }

  useEffect(() => {
    if (!isWebViewBuild) return
    const queryLanguage = new URLSearchParams(window.location.search)
    const queryLang = queryLanguage.get('lang')
    langParamRef.current =
      me?.language?.toLowerCase() ||
      langParamRef.current ||
      queryLang?.toLowerCase() ||
      ''

    if (langParamRef.current) {
      langParamRef.current = parseSelectedLanguage(langParamRef.current)
    }

    const lang = langParamRef.current

    // Fetch from QueryParam & update the language here
    if (lang && i18n.resolvedLanguage !== lang) {
      const parsedLang = parseSelectedLanguage(lang)
      i18n.changeLanguage(parsedLang)
      const eventProperties: eventPropsTypes.language_change_client = {
        source_name: previousVisit,
        platform: eventConstants.platform,
        username: me?.username,
        userid: me?.user_uid,
        user_type: me?.user_type,
        language_client: parsedLang,
        source: 'onboarding',
        trigger: 'client_override',
      }
      eventActions.sendAmplitudeData(eventConstants.language_change_client, {
        ...eventProperties,
      })
    }
  }, [])

  useEffect(() => {
    if (!isUserPresent || isWebViewBuild) {
      return
    }
    if (!isLanguageSelectionEnabled()) {
      const parsedLang = parseSelectedLanguage(i18n.resolvedLanguage)
      i18n.changeLanguage(parsedLang)
      return
    }
    const lang = me?.language
    if (lang && i18n.resolvedLanguage !== lang) {
      const parsedLang = parseSelectedLanguage(lang)
      i18n.changeLanguage(parsedLang)
      const eventProperties: eventPropsTypes.language_change_client = {
        source_name: previousVisit,
        platform: eventConstants.platform,
        username: me?.username,
        userid: me?.user_uid,
        user_type: me?.user_type,
        language_client: parsedLang,
        source: 'onboarding',
        trigger: 'client_override',
      }
      eventActions.sendAmplitudeData(eventConstants.language_change_client, {
        ...eventProperties,
      })
    } else if (!lang) {
      const clientLang = i18n.resolvedLanguage
      const parsedLang = parseSelectedLanguage(clientLang)
      // overwriting the language in the backend
      updateUserLanguage({ language: parsedLang }).then(() => {
        dispatch(updateMe({ language: parsedLang }))
      })
    }
  }, [isUserPresent])

  return <></>
}

export default DetectAppLanguage
