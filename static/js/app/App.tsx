import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import { GoogleOAuthProvider } from '@components/GoogleLogin/GoogleLogin'
import { useInitializeExperiment } from '@src/hooks/useInitializeExperiment'
import { useRtlTranslation } from '@src/i18n/utils'
import dayjs from 'dayjs'
import dayjsLocale_es from 'dayjs/locale/es'
import dayjsLocale_fil from 'dayjs/locale/fi'
import dayjsLocale_id from 'dayjs/locale/id'
import dayjsLocale_ko from 'dayjs/locale/ko'
import dayjsLocale_nl from 'dayjs/locale/nl'
import dayjsLocale_pt from 'dayjs/locale/pt-br'
import dayjsLocale_ru from 'dayjs/locale/ru'
import dayjsLocale_tr from 'dayjs/locale/tr'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import useVerloopChat from '../components/VerloopChat'
import { CLEVERTAP_ACCOUNT_ID } from '../constent'
import {
  fetchStreamerPermissions,
  fetchViewerLeaderboardPermissions,
  fetchVipLeaderboardPermissions,
} from '../modules/Login/loginSlice'
import Routes from '../Route'
import customTheme from '../theme'
import { findMissingLinking, getTokenAsync } from './appSlice'
import { RootState } from './RootReducer'

dayjs.locale('pt-BR', dayjsLocale_pt, true)
dayjs.locale('es-AR', dayjsLocale_es, true)
dayjs.locale('fil', dayjsLocale_fil, true)
dayjs.locale('id', dayjsLocale_id, true)
dayjs.locale('ko', dayjsLocale_ko, true)
dayjs.locale('nl', dayjsLocale_nl, true)
dayjs.locale('ru', dayjsLocale_ru, true)
dayjs.locale('tr', dayjsLocale_tr, true)

dayjs.extend(advancedFormat)

const App = (): JSX.Element => {
  const { i18n } = useTranslation()
  const isRTL = useRtlTranslation()
  dayjs.locale(i18n.resolvedLanguage)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTokenAsync())
  }, [])
  useVerloopChat()
  useInitializeExperiment()

  const {
    app: {
      accessToken: storeAccessToken,
      refreshToken: storeRefreshToken,
      linkedGmail,
      linkedPhoneNumber,
    },
    login: { me },
  } = useSelector((state: RootState) => state)

  useEffect(() => {
    const clevertap = {
      event: [],
      profile: [],
      account: [],
      onUserLogin: [],
      notifications: [],
      privacy: [],
    }
    // replace with the CLEVERTAP_ACCOUNT_ID with the actual ACCOUNT ID value from your Dashboard -> Settings page
    //@ts-ignore
    clevertap.account.push({ id: CLEVERTAP_ACCOUNT_ID })
    //@ts-ignore
    clevertap.privacy.push({ optOut: false }) //set the flag to true, if the user of the device opts out of sharing their data
    //@ts-ignore
    clevertap.privacy.push({ useIP: false }) //set the flag to true, if the user agrees to share their IP data
    ;(function() {
      if (document.getElementById('clever-tab-id')) return
      //@ts-ignore
      window.clevertap = clevertap
      const wzrk = document.createElement('script')
      wzrk.type = 'text/javascript'
      wzrk.id = 'clever-tab-id'
      wzrk.async = true
      wzrk.src =
        ('https:' == document.location.protocol
          ? 'https://d2r1yp2w7bby2u.cloudfront.net'
          : 'http://static.clevertap.com') + '/js/a.js'

      document.body.appendChild(wzrk)
    })()
  }, [])

  useEffect(() => {
    //@ts-ignore
    window?.NativeUIWebInterface?.showNativeHeader(false)
    //@ts-ignore
    window?.NativeUIWebInterface?.shouldDisableNativeBackButton(true)
  }, [])

  const isUserPresent = !!(
    me?.username &&
    storeAccessToken &&
    storeRefreshToken
  )
  const isAccountLinked = isUserPresent && linkedPhoneNumber && linkedGmail

  useEffect(() => {
    const reqAccountLinked = localStorage.getItem('required_account_linked')
    const isAccountLinked_storage = isUserPresent && reqAccountLinked
    if (isAccountLinked_storage || isAccountLinked || isUserPresent) {
      dispatch(fetchViewerLeaderboardPermissions())
      dispatch(fetchVipLeaderboardPermissions())
    }
    if (isUserPresent) {
      dispatch(findMissingLinking())
    }
  }, [isAccountLinked, isUserPresent])

  useEffect(() => {
    if (isUserPresent) {
      dispatch(fetchStreamerPermissions())
    }
  }, [isUserPresent])

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={i18n.language}
      className="h-screen"
      style={{
        // height: '100vh',
        overflow: 'auto',
        backgroundColor: '#050506',
      }}
    >
      <GoogleOAuthProvider>
        <ThemeProvider theme={customTheme}>
          <CSSReset />
          <Routes />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </div>
  )
}

export default App

// content use
