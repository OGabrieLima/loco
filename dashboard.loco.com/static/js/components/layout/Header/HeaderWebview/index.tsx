import { Flex } from '@chakra-ui/core'
import { IOTPLESS } from '@src/modules/OtplessV3/otpless_types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { RootState } from '../../../../app/RootReducer'
import { extractPathFromWebviewUrl, paths } from '../../../../routers/constants'
import exitWebView from '../../../../utils/exitWebview'
import HeaderMobileLeft from './HeaderMobileLeft'
import HeaderMobileRight from './HeaderMobileRight'

declare global {
  interface Window {
    NativeUIWebInterface: any
    DashboardInterface: any
    webkit: any
    Verloop?: any
    OTPless: IOTPLESS
    idwSDKWeb?: (config: {
      token: string
      onRender: () => void
      onComplete: (data: { token: string }) => void
      onError?: (error: any) => void
    }) => void
  }
}

const HeaderWebview = () => {
  const { pathname, search } = useLocation()
  const { t } = useTranslation()
  const { isLive } = useSelector((state: RootState) => state.liveStreamManager)
  let label = ''
  switch (pathname) {
    case paths.dashboard.home:
      label = t('headerWebview.todayStreamDetails')
      break
    case paths.dashboard.analytics:
      label = t('headerWebview.streamerAnalytics')
      break
    case paths.dashboard.streamerLeaderboard:
      label = t('headerWebview.streamerLeaderboard')
      break
    case paths.dashboard.videos:
      label = t('headerWebview.videos')
      break
    case paths.dashboard.clips:
      label = t('headerWebview.clips')
      break
    case paths.dashboard.profile:
      label = t('headerWebview.profile')
      break
    case paths.dashboard.wallet:
      label = t('headerWebview.streamerWallet')
      break
    case paths.dashboard.stream:
      label = t('headerWebview.liveStreamManager')
      break
    case paths.dashboard.community.moderators:
      label = t('headerWebview.moderators')
      break
    case paths.dashboard.WhatsNew:
      label = t('headerWebview.whatsNewReleaseNotes')
      break
    case paths.dashboard.manageAccounts:
      label = t('headerWebview.streamerWallet')
      // label = t('headerWebview.manageAccounts')
      break
    case paths.dashboard.kyc:
    case paths.dashboard.kycPancard:
    case paths.dashboard.kycbankAccount:
      label = t('headerWebview.streamerWallet')
      // label = t('headerWebview.manageAccounts')
      break
    default:
      label = t('headerWebview.streamingCenter')
      break
  }
  const showLive = isLive && paths.dashboard.stream === pathname

  const isWhatsNew = paths.dashboard.WhatsNew === pathname
  const isVIP = paths.dashboard.vipLeaderboard === pathname

  //@ts-ignore
  const defaultUrlForDeepLink: string = window?.NativeUIWebInterface
    ?.getInitialLoadURL
    ? (window as any)?.NativeUIWebInterface?.getInitialLoadURL()
    : ''
  const formattedDefaultUrlForDeepLink = defaultUrlForDeepLink
    ? extractPathFromWebviewUrl(defaultUrlForDeepLink)
    : ''

  return (
    <Flex w="full" justify="space-between">
      <HeaderMobileLeft
        label={label}
        showLive={showLive}
        isWhatsNew={isWhatsNew}
        isVIP={isVIP}
        headerRight={
          paths.dashboard.menu === pathname || paths.dashboard.home === pathname
        }
        handleBackProps={
          paths.dashboard.menu === pathname ||
          (paths.dashboard.default === pathname && !search) ||
          formattedDefaultUrlForDeepLink === pathname ||
          (paths.dashboard.incentives === pathname &&
          //@ts-ignore
          window?.DashboardInterface?.isStudio
            ? //@ts-ignore
              window?.DashboardInterface?.isStudio()
            : false)
            ? () => {
                exitWebView()
              }
            : undefined
        }
      />
      {paths.dashboard.menu === pathname && <HeaderMobileRight />}
    </Flex>
  )
}

export default HeaderWebview
