import { LoginScreenENUM, setLoginScreen } from '@app/appSlice'
import { RootState } from '@app/RootReducer'
import { Flex, useDisclosure } from '@chakra-ui/core'
import { FullSpinnerPage } from '@components/FullSpinnerPage'
import MobileDrawer from '@components/layout/MobileDrawer'
import SideBar from '@components/layout/Sidebar'
import { fetchCurrentLiveStream } from '@modules/LiveStreamManager/LiveStreamManagerSlice'
import { getNotificationDetails } from '@modules/Login/loginSlice'
import NotFoundDashboard from '@src/components/NotFound/NotFoundDashboard'
import {
  IS_TESTING_TARGET_ENABLED,
  isLanguageSelectionEnabled,
  isWebViewBuild,
  TARGET_ENV,
} from '@src/constent'
import SentryRoute from '@src/SentryRoute'
import React, { lazy, Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Switch } from 'react-router-dom'

import { paths } from '../constants'

const ChangeUserLanguageMWEb = lazy(() =>
  import(
    /* webpackChunkName: `ChangeUserLanguage` */ '@modules/ChangeUserLanguage'
  )
)
const ConfirmLanguageModal = lazy(() =>
  import(
    /* webpackChunkName: `ConfirmLanguageModal` */ '@components/i18nLanguageSelector/ConfirmLanguageModal'
  )
)
const Onboarding = lazy(() =>
  import(/* webpackChunkName: `Onboarding` */ '@modules/Onboarding')
)
const SetupStream = lazy(() =>
  import(/* webpackChunkName: `SetupStream` */ '@modules/SetupStream')
)
const CommonModal = lazy(() =>
  import(
    /* webpackChunkName: `CommonModal` */ '@modules/NotificationSettings/NotificationSettingsModal/CommonModal'
  )
)
export interface RoutesProps {
  key: string
  path?: string
  exact: boolean
  component?: React.ElementType
  subComponent?: React.ElementType
  icon?: string
  name?: string
  isNew?: boolean
  tooltip?: string
  showInSidebar?: boolean
  displayOnlyIn?: 'mweb' | 'web' // only mweb or only web
  withSidebar?: boolean
  showInWebViewMenu?: boolean
  level?: number
  routes?: RoutesProps[]
}

const webRoutes: RoutesProps[] = [
  {
    key: paths.dashboard.home,
    path: paths.dashboard.home,
    exact: true,
    component: lazy(() =>
      import(/* webpackChunkName: `home` */ '@modules/Home')
    ),
    icon: 'sidebar_home',
    name: 'sidenav.home',

    isNew: false,
    showInSidebar: true,
    withSidebar: true,
  },
  {
    key: paths.dashboard.stream,
    path: paths.dashboard.stream,
    exact: true,
    component: lazy(() =>
      import(
        /* webpackChunkName: `liveStreamManager` */ '@modules/LiveStreamManager'
      )
    ),
    icon: 'sidebar_stream',
    name: 'sidenav.manageliveStream',

    isNew: false,
    showInSidebar: true,
    withSidebar: false,
  },
  {
    key: paths.dashboard.profile,
    path: paths.dashboard.profile,
    exact: true,
    component: lazy(() =>
      import(/* webpackChunkName: `profile` */ '@modules/StreamerProfile')
    ),
    icon: 'sidebar_profile',
    name: 'sidenav.profile',
    isNew: false,
    showInSidebar: true,
    withSidebar: true,
    subComponent: lazy(() =>
      import(/* webpackChunkName: `profile` */ '@modules/Pending2faTest')
    ),
  },
  {
    key: paths.dashboard.stickers,
    path: paths.dashboard.stickers,
    exact: false,
    component: lazy(() => import('@modules/Stickers/StickerRoutes')),
    icon: 'sidebar_stickers',
    name: 'sidenav.stickers',
    isNew: false,
    showInSidebar: true,
    showInWebViewMenu: true,
    withSidebar: true,
  },
  {
    key: paths.dashboard.analytics,
    path: paths.dashboard.analytics,
    exact: true,
    component: lazy(() => import('@modules/Analytics/Dashboard')),
    icon: 'sidebar_analytics',
    name: 'sidenav.anlytics',
    isNew: false,
    showInSidebar: true,
    withSidebar: true,
  },
  {
    key: paths.dashboard.StreamEditId,
    path: paths.dashboard.StreamEditId,
    exact: true,
    name: 'header.editVideosTitle',
    isNew: false,
    component: lazy(() =>
      import(
        /* webpackChunkName: `editVideos` */ '@modules/EditStreamOrVOD/EditStreamContainer'
      )
    ),
    showInSidebar: false,
    withSidebar: true,
  },
  {
    key: paths.dashboard.videos,
    path: paths.dashboard.videos,
    exact: true,
    component: lazy(() =>
      import(/* webpackChunkName: `videos` */ '@modules/Videos')
    ),
    icon: 'sidebar_videos',
    name: 'sidenav.videos',
    isNew: false,
    showInSidebar: true,
    withSidebar: true,
  },
  // {
  //   key: paths.dashboard.clips,
  //   path: paths.dashboard.clips,
  //   exact: true,
  //   component: lazy(() =>
  //     import(/* webpackChunkName: `videos` */ '@modules/Clips')
  //   ),
  //   icon: 'sidebar_videos',
  //   name: 'sidenav.clips',
  //   isNew: false,
  //   showInSidebar: true,
  //   withSidebar: true,
  // },
  {
    key: paths.dashboard.kyc,
    path: paths.dashboard.kyc,
    exact: false,
    component: lazy(() =>
      import(/* webpackChunkName: `KycFlowV3` */ '@modules/KycFlowV3')
    ),
    // icon: 'kyc',
    name: 'headerWebview.kycVerification',
    isNew: false,
    showInSidebar: false,
    withSidebar: true,
  },
  {
    key: paths.dashboard.manageAccounts,
    path: paths.dashboard.manageAccounts,
    exact: false,
    component: lazy(() =>
      import(/* webpackChunkName: `KycFlowV31` */ '@modules/KycFlowV3')
    ),
    // icon: 'sidebar_manageAccount',
    name: 'headerWebview.manageAccounts',
    isNew: false,
    showInSidebar: false,
    withSidebar: true,
  },
  {
    key: paths.dashboard.wallet,
    path: paths.dashboard.wallet,
    exact: false,
    component: lazy(() =>
      import(/* webpackChunkName: `streamerWallet` */ '@modules/Wallet')
    ),
    icon: 'sidebar_streamerwallet',
    name: 'sidenav.wallet',
    isNew: false,
    showInSidebar: true,
    withSidebar: true,
  },
  // {
  //   key: paths.dashboard.streamerLeaderboard,
  //   path: paths.dashboard.streamerLeaderboard,
  //   exact: true,
  //   component: lazy(() =>
  //     import(
  //       /* webpackChunkName: `streamerLeaderboard` */ '@modules/StreamerLeaderboard'
  //     )
  //   ),
  //   icon: 'sidebar_streamerleaderboard',
  //   name: 'sidenav.streamerLeaderboard',
  //   isNew: false,
  //   showInSidebar: true,
  //   withSidebar: true,
  // },
  {
    key: 'community',
    icon: 'sidebar_community',
    name: 'sidenav.community',
    isNew: false,
    exact: false,
    showInSidebar: true,
    withSidebar: true,
    routes: [
      {
        key: paths.dashboard.community.moderators,
        path: paths.dashboard.community.moderators,
        exact: true,
        component: lazy(() =>
          import(
            /* webpackChunkName: `moderatorsList` */ '@modules/Community/Moderator/Moderator'
          )
        ),
        name: 'sidenav.moderators',
        withSidebar: true,
        showInSidebar: true,
        level: 1,
      },
      {
        key: paths.dashboard.community.blockedWords,
        path: paths.dashboard.community.blockedWords,
        exact: true,
        component: lazy(() =>
          import(
            /* webpackChunkName: `moderatorsList` */ '@modules/Community/BlockWords/BlockWords'
          )
        ),
        name: 'sidenav.blockWordsText',
        withSidebar: true,
        showInSidebar: true,
        level: 1,
      },
      {
        key: paths.dashboard.community.blockedUsers,
        path: paths.dashboard.community.blockedUsers,
        exact: true,
        component: lazy(() =>
          import(
            /* webpackChunkName: `moderatorsList` */ '@modules/Community/MutedUsers/index'
          )
        ),
        name: 'sidenav.mutedUsers',
        withSidebar: true,
        showInSidebar: true,
        level: 1,
      },
      {
        key: paths.dashboard.community.activities,
        path: paths.dashboard.community.activities,
        exact: true,
        component: lazy(() =>
          import(
            /* webpackChunkName: `moderatorsList` */ '@modules/Community/Activities/Logs'
          )
        ),
        name: 'sidenav.activities',
        withSidebar: true,
        showInSidebar: true,
        level: 1,
      },
    ],
  },
  {
    key: paths.dashboard.guidelines,
    path: paths.dashboard.guidelines,
    exact: true,
    component: lazy(() =>
      import(
        /* webpackChunkName: `streamerLeaderboard` */ '@modules/Guidelines'
      )
    ),
    icon: 'sidebar_guideline',
    name: 'sidenav.guidelines',

    isNew: false,
    showInSidebar: true,
    withSidebar: true,
  },
  {
    key: 'changeUserLanguage',
    // path: paths.dashboard.changeUserLanguage,
    exact: true,
    subComponent: lazy(() =>
      import(
        /* webpackChunkName: `ShowCurrentLang` */ '@modules/ChangeUserLanguage/ShowCurrentLang'
      )
    ),
    displayOnlyIn: 'mweb',
    icon: 'globe_white_icon',
    name: 'sidenav.languageText',
    showInSidebar: isLanguageSelectionEnabled() ? true : false,
    withSidebar: isLanguageSelectionEnabled() ? true : false,
  },
  {
    key: paths.dashboard.notificationsettings,
    path: paths.dashboard.notificationsettings,
    name: 'sidenav.notificationsettings',
    exact: true,
    component: lazy(() =>
      import(
        /* webpackChunkName: `streamerLeaderboard` */ '@modules/NotificationSettings'
      )
    ),
    icon: 'notificationBellIcon',
    isNew: false,
    showInSidebar: true,
    withSidebar: true,
  },
  {
    key: paths.dashboard.help,
    path: paths.dashboard.help,
    exact: true,
    component: lazy(() =>
      import(/* webpackChunkName: `help&support` */ '@modules/Help')
    ),
    icon: 'sidebar_help',
    name: 'sidenav.help',

    isNew: false,
    showInSidebar: true,
    withSidebar: true,
  },

  // {
  //   key: paths.dashboard.ITRInformation,
  //   path: paths.dashboard.ITRInformation,
  //   exact: true,
  //   component: lazy(() =>
  //     import(
  //       /* webpackChunkName: `logout` */ '@modules/Wallet/IncomeTax/ITRInformation'
  //     )
  //   ),
  //   name: 'ITRInformation',
  //   withSidebar: true,
  // },

  // Hiding this for now as translation is not done with notion link
  // {
  //   key: paths.dashboard.comingSoon,
  //   path: paths.dashboard.comingSoon,
  //   exact: true,
  //   component: lazy(() =>
  //     import(/* webpackChunkName: `help&support` */ '@modules/ComingSoon')
  //   ),
  //   icon: 'sidebar_comingsoon',
  //   name: 'sidenav.comingsoon',
  //   isNew: false,
  //   showInSidebar: true,
  //   withSidebar: true,
  // },

  {
    // This must be at the last of modal, must always at last
    key: paths.logout,
    path: paths.logout,
    exact: true,
    component: lazy(() =>
      import(/* webpackChunkName: `logout` */ '@modules/Logout')
    ),
    icon: 'sidebar_logout',
    name: 'sidenav.logout',

    showInSidebar: true,
    withSidebar: true,
  },
  // {
  //   key: paths.dashboard.WhatsNew,
  //   path: paths.dashboard.WhatsNew,
  //   exact: true,
  //   component: lazy(() =>
  //     import(/* webpackChunkName: `WhatsNew` */ '@modules/WhatsNew')
  //   ),
  //   name: 'sidenav.whatsNew',
  //   withSidebar: true,
  // },
]
const webViewRoutes: RoutesProps[] = [
  {
    key: paths.dashboard.profile,
    path: paths.dashboard.profile,
    exact: true,
    component: lazy(() => import('@modules/StreamerProfile')),
    icon: 'sidebar_profile',
    name: 'sidenav.profile',
    isNew: false,
    showInWebViewMenu: true,
  },
  {
    key: paths.dashboard.streamConfig,
    exact: true,
    // component: lazy(() => import('@modules/Home')),
    icon: 'streamSetup',
    name: 'sidenav.streamKeyUrl',
    isNew: false,
    showInWebViewMenu: true,
  },
  {
    key: paths.dashboard.home,
    path: paths.dashboard.home,
    exact: true,
    component: lazy(() => import('@modules/Home')),
    icon: 'sidebar_stream',
    name: 'sidenav.todayStreamDetails',
    isNew: false,
    showInWebViewMenu: true,
  },
  {
    key: paths.dashboard.stream,
    path: paths.dashboard.stream,
    exact: true,
    component: lazy(() => import('@modules/LiveStreamManager')),
    icon: 'sidebar_stream',
    name: 'sidenav.manageliveStream',
    isNew: false,
    showInWebViewMenu: false,
  },
  {
    key: paths.dashboard.menu,
    path: paths.dashboard.menu,
    exact: true,
    component: lazy(() => import('@modules/Menu')),
    icon: 'sidebar_home',
    name: 'Menu',
    isNew: false,
    showInWebViewMenu: false,
  },
  {
    key: paths.dashboard.stickers,
    path: paths.dashboard.stickers,
    exact: false,
    component: lazy(() => import('@modules/Stickers/StickerRoutes')),
    icon: 'sidebar_stickers',
    name: 'sidenav.stickers',
    isNew: false,
    showInSidebar: true,
    showInWebViewMenu: true,
  },
  {
    key: paths.dashboard.analytics,
    path: paths.dashboard.analytics,
    exact: true,
    component: lazy(() => import('@modules/Analytics/Dashboard')),
    icon: 'sidebar_analytics',
    name: 'sidenav.anlytics',
    isNew: false,
    showInWebViewMenu: true,
  },
  {
    key: paths.dashboard.videos,
    path: paths.dashboard.videos,
    exact: true,
    component: lazy(() => import('@modules/Videos')),
    icon: 'sidebar_videos',
    name: 'sidenav.videos',
    isNew: false,
    showInWebViewMenu: true,
  },
  // {
  //   key: paths.dashboard.clips,
  //   path: paths.dashboard.clips,
  //   exact: true,
  //   component: lazy(() => import('@modules/Clips')),
  //   icon: 'sidebar_videos',
  //   name: 'sidenav.clips',
  //   isNew: false,
  //   showInWebViewMenu: true,
  // },
  {
    key: paths.dashboard.StreamEditId,
    path: paths.dashboard.StreamEditId,
    exact: true,
    name: 'header.editVideosTitle',
    isNew: false,
    component: lazy(() =>
      import(
        /* webpackChunkName: `editVideos` */ '@modules/EditStreamOrVOD/EditStreamContainer'
      )
    ),
    showInSidebar: false,
    withSidebar: true,
  },
  {
    key: paths.dashboard.manageAccounts,
    path: paths.dashboard.manageAccounts,
    exact: false,
    component: lazy(() =>
      import(/* webpackChunkName: `KycFlowV31` */ '@modules/KycFlowV3')
    ),
    // icon: 'sidebar_manageAccount',
    name: 'headerWebview.manageAccounts',
    isNew: false,
    showInWebViewMenu: false,
    showInSidebar: false,
  },
  {
    key: paths.dashboard.kyc,
    path: paths.dashboard.kyc,
    exact: false,
    component: lazy(() =>
      import(/* webpackChunkName: `KycFlowV3` */ '@modules/KycFlowV3')
    ),
    // icon: 'kyc',
    name: 'headerWebview.kycVerification',
    isNew: false,
    showInWebViewMenu: false,
  },
  {
    key: paths.dashboard.wallet,
    path: paths.dashboard.wallet,
    exact: false,
    component: lazy(() => import('@modules/Wallet')),
    icon: 'sidebar_streamerwallet',
    name: 'sidenav.wallet',
    isNew: false,
    showInWebViewMenu: true,
  },
  // {
  //   key: paths.dashboard.streamerLeaderboard,
  //   path: paths.dashboard.streamerLeaderboard,
  //   exact: true,
  //   component: lazy(() => import('@modules/StreamerLeaderboard')),
  //   icon: 'sidebar_streamerleaderboard',
  //   name: 'sidenav.streamerLeaderboard',
  //   isNew: false,
  //   showInWebViewMenu: true,
  // },
  {
    key: 'community',
    icon: 'sidebar_community',
    name: 'sidenav.community',
    showInWebViewMenu: true,
    exact: false,
    isNew: false,
    routes: [
      {
        key: paths.dashboard.community.moderators,
        path: paths.dashboard.community.moderators,
        exact: true,
        component: lazy(() =>
          import(
            /* webpackChunkName: `moderatorsList` */ '@modules/Community/Moderator/Moderator'
          )
        ),
        name: 'sidenav.moderators',
        showInWebViewMenu: true,
        level: 1,
      },
      {
        key: paths.dashboard.community.blockedWords,
        path: paths.dashboard.community.blockedWords,
        exact: true,
        component: lazy(() =>
          import(
            /* webpackChunkName: `moderatorsList` */ '@modules/Community/BlockWords/BlockWords'
          )
        ),
        name: 'sidenav.blockWordsText',
        showInWebViewMenu: true,
        level: 1,
      },
      {
        key: paths.dashboard.community.blockedUsers,
        path: paths.dashboard.community.blockedUsers,
        exact: true,
        component: lazy(() =>
          import(
            /* webpackChunkName: `moderatorsList` */ '@modules/Community/MutedUsers/index'
          )
        ),
        name: 'sidenav.mutedUsers',
        showInWebViewMenu: true,
        level: 1,
      },
      {
        key: paths.dashboard.community.activities,
        path: paths.dashboard.community.activities,
        exact: true,
        component: lazy(() =>
          import(
            /* webpackChunkName: `moderatorsList` */ '@modules/Community/Activities/Logs'
          )
        ),
        name: 'sidenav.activities',
        showInWebViewMenu: true,
        level: 1,
      },
    ],
  },
  {
    key: paths.dashboard.guidelines,
    path: paths.dashboard.guidelines,
    exact: true,
    component: lazy(() =>
      import(
        /* webpackChunkName: `streamerLeaderboard` */ '@modules/Guidelines'
      )
    ),
    icon: 'sidebar_guideline',
    name: 'sidenav.guidelines',
    isNew: false,
    showInWebViewMenu: true,
  },
  {
    key: paths.dashboard.notificationsettings,
    path: paths.dashboard.notificationsettings,
    exact: true,
    component: lazy(() =>
      import(
        /* webpackChunkName: `streamerLeaderboard` */ '@modules/NotificationSettings'
      )
    ),
    icon: 'notificationBellIcon',
    name: 'sidenav.notificationsettings',
    isNew: false,
    showInWebViewMenu: true,
  },
  {
    key: paths.dashboard.help,
    path: paths.dashboard.help,
    exact: true,
    component: lazy(() => import('@modules/Help')),
    name: 'sidenav.help',
    isNew: false,
    showInWebViewMenu: false,
  },
  // { // not showing in webview
  //   key: paths.dashboard.comingSoon,
  //   path: paths.dashboard.comingSoon,
  //   exact: true,
  //   component: lazy(() =>
  //     import(/* webpackChunkName: `help&support` */ '@modules/ComingSoon')
  //   ),
  //   icon: 'sidebar_comingsoon',
  //   name: 'sidenav.comingsoon',
  //   isNew: false,
  //   showInWebViewMenu: true,
  // },
  // {
  //   key: paths.dashboard.WhatsNew,
  //   path: paths.dashboard.WhatsNew,
  //   exact: true,
  //   component: lazy(() => import('@modules/WhatsNew')),
  //   showInWebViewMenu: false,
  //   name: 'sidenav.whatsNew',
  // },
  // {
  //   key: paths.dashboard.ITRInformation,
  //   path: paths.dashboard.ITRInformation,
  //   exact: true,
  //   component: lazy(() =>
  //     import(
  //       /* webpackChunkName: `logout` */ '@modules/Wallet/IncomeTax/ITRInformation'
  //     )
  //   ),
  //   name: 'ITRInformation',
  // },
]

function renderRoutes(routes: RoutesProps[]) {
  return routes.map((route) => {
    const temp: React.ReactNode[] = []
    if (route.component) {
      temp.push(
        <SentryRoute
          key={route.key || route.name}
          path={route.path}
          exact={route.exact}
          render={(routeProps) => (
            <Suspense fallback={<FullSpinnerPage />}>
              {/* @ts-ignore */}
              <route.component {...routeProps} routes={routes} />
            </Suspense>
          )}
        />
      )
    }
    if (route.routes?.length) {
      temp.push(...renderRoutes(route.routes))
    }
    return temp
  })
}

// const performanceRoute: RoutesProps = {
//   key: paths.dashboard.performance,
//   path: paths.dashboard.performance,
//   exact: true,
//   component: lazy(() => import('@modules/Performance')),
//   icon: 'sidebar_analytics',
//   name: 'Streamer Performance',
//   isNew: false,
//   showInSidebar: true,
//   withSidebar: true,
//   showInWebViewMenu: true,
// }

// Currently we don't have VIP LeaderBoard
// const vipLeaderboard: RoutesProps = {
//   key: paths.dashboard.vipLeaderboard,
//   path: paths.dashboard.vipLeaderboard,
//   exact: true,
//   component: lazy(() => import('@modules/VipLeaderboard')),
// icon: 'sidebar_vip_leaderboard',
//   name: 'VIP Leaderboard',
//   isNew: false,
//   showInSidebar: true,
//   withSidebar: true,
//   showInWebViewMenu: true,
// }

const monetisationRoute = {
  // paths.dashboard.videos before videos
  key: paths.dashboard.monetisation,
  path: paths.dashboard.monetisation,
  exact: true,
  component: lazy(() =>
    import(/* webpackChunkName: `Monetisation` */ '@modules/Monetisation')
  ),
  icon: 'sidebar_monetisation',
  name: 'sidenav.monetisation',
  isNew: false,
  showInSidebar: true,
  withSidebar: true,
  showInWebViewMenu: true,
}

const communicationCenterRoute = {
  key: paths.dashboard.communicationCenter,
  path: paths.dashboard.communicationCenter,
  exact: true,
  component: lazy(() => import('@modules/CommunicationCenter')),
  icon: 'sidebar_communication',
  name: 'sidenav.communicationCenter',
  isNew: false,
  showInSidebar: true,
  withSidebar: true,
  showInWebViewMenu: true,
}

const NewDashboardRoute = () => {
  const dispatch = useDispatch()

  const {
    isOpen: isWhatsappNotifOpen,
    onClose: onWhatsappNotifClose,
  } = useDisclosure()
  const permissions = useSelector(
    (state: RootState) => state.login.viewerLeaderboardPermissions
  )

  const { whatsappNotifStatus, emailNotificationStatus } = useSelector(
    (state: RootState) => state.login
  )

  const {
    login: {
      me,
      isOnboardingCompleted,
      loading: meLoading,
      // vipLeaderboardPermissions,
    },
    streamDetails: {
      defaultStreamDetails,
      isStreamSetupCompleted,
      loading: streamDetailsLoading,
    },
    liveStreamManager: { isLive },
  } = useSelector((state: RootState) => state)

  // const vipLeaderboardEnabled = vipLeaderboardPermissions?.vip_leaderboard

  const webViewBuild = isWebViewBuild
  const isEnableForMonetisationFeature =
    me?.country_iso_code === 'BR' || IS_TESTING_TARGET_ENABLED

  const isEnableForCommunicationTab =
    me?.country_iso_code === 'BR' || IS_TESTING_TARGET_ENABLED

  // **************** HERE TO PUSH  / REMOVE Path from routes ******************** /
  const _webRoutes = (() => {
    let allRoutes = webRoutes
    if (permissions?.show_performance_target_analytics === 20) {
      const firstHalf = allRoutes.slice(0, 5)
      const secoondHalf = allRoutes.slice(5)
      allRoutes = [
        ...firstHalf,
        // performanceRoute,
        ...secoondHalf,
      ]
    }

    if (isEnableForMonetisationFeature) {
      // Append Monatisation before Videos
      const firstHalf = allRoutes.slice(0, 6)
      const secoondHalf = allRoutes.slice(6)
      allRoutes = [...firstHalf, monetisationRoute, ...secoondHalf]
    }

    if (isEnableForCommunicationTab) {
      // Append Monatisation before Stickers
      const firstHalf = allRoutes.slice(0, 3)
      const secoondHalf = allRoutes.slice(3)
      allRoutes = [...firstHalf, communicationCenterRoute, ...secoondHalf]
    }
    return allRoutes
  })()

  const _webViewRoutes = (() => {
    let allRoutes = webViewRoutes
    if (permissions?.show_performance_target_analytics === 20) {
      const firstHalf = allRoutes.slice(0, 10)
      const secoondHalf = allRoutes.slice(10)
      allRoutes = [
        ...firstHalf,
        // performanceRoute,
        ...secoondHalf,
      ]
    }

    if (isEnableForMonetisationFeature) {
      // Append Monatisation before Videos
      const firstHalf = allRoutes.slice(0, 7)
      const secoondHalf = allRoutes.slice(7)
      allRoutes = [...firstHalf, monetisationRoute, ...secoondHalf]
    }

    if (isEnableForCommunicationTab) {
      // Append Monatisation before Videos
      const firstHalf = allRoutes.slice(0, 3)
      const secoondHalf = allRoutes.slice(3)
      allRoutes = [...firstHalf, communicationCenterRoute, ...secoondHalf]
    }
    return allRoutes
  })()
  // **************** ABOVE ABOVE TO PUSH  / REMOVE Path from routes ******************** /
  const updatedWebRoutes = _webRoutes.map((route) => {
    // These, Just to change Streamer Leaderboard to Viewer or VIP leaderboard
    // if (
    //   vipLeaderboardEnabled &&
    //   route.key === paths.dashboard.viewerLeaderboard
    // ) {
    // return vipLeaderboard
    // }
    return route
  })

  const updatedWebviewRoutes = _webViewRoutes.map((route) => {
    // These, Just to change Streamer Leaderboard to Viewer or VIP leaderboard
    // if (
    //   vipLeaderboardEnabled &&
    //   route.key === paths.dashboard.viewerLeaderboard
    // ) {
    //   return vipLeaderboard
    // }
    return route
  })

  let routes = webViewBuild ? updatedWebviewRoutes : updatedWebRoutes

  const withSidebarPaths: string[] = []
  const withoutSidebarPaths: string[] = []
  if (!defaultStreamDetails?.can_battleup) {
    routes = routes.filter((route) => route.name !== 'Battle Up')
  }

  function mapRoutesToSideBar(routes: RoutesProps[]) {
    routes.forEach((route) => {
      if (route.routes) {
        mapRoutesToSideBar(route.routes)
      } else if (route.path) {
        route.withSidebar || route.showInWebViewMenu
          ? withSidebarPaths.push(route.path)
          : withoutSidebarPaths.push(route.path)
      }
    })
  }

  mapRoutesToSideBar(routes)

  useEffect(() => {
    dispatch(setLoginScreen(LoginScreenENUM.LoginOptionsScreen))
  }, [])

  useEffect(() => {
    if (!me?.user_uid || !isStreamSetupCompleted) {
      return
    }
    const interval = setInterval(() => {
      if (window.navigator.onLine) {
        if (me?.user_uid && isStreamSetupCompleted) {
          dispatch(fetchCurrentLiveStream(me?.user_uid))
        }
      }
    }, 10 * 1000)
    return () => clearInterval(interval)
  }, [isLive, me, isStreamSetupCompleted])

  // make sure me details and default stream details are there. user have accepted terms and condition and whatsappNotifStatus is null

  useEffect(() => {
    if (
      isOnboardingCompleted &&
      isStreamSetupCompleted &&
      // me?.is_sip_agreement_accept &&
      (whatsappNotifStatus === null || emailNotificationStatus === null)
    ) {
      dispatch(getNotificationDetails())
    }
  }, [
    emailNotificationStatus,
    isOnboardingCompleted,
    isStreamSetupCompleted,
    whatsappNotifStatus,
  ])

  return (
    <Flex
      h="calc(100% - 56px)"
      flexDirection="column"
      boxSizing="border-box"
      maxH="calc(100% - 56px)"
      overflow="hidden"
    >
      <Flex h="full" w="full" overflow="hidden">
        {isLanguageSelectionEnabled() ? (
          <>
            <Suspense fallback={<></>}>
              <ConfirmLanguageModal />
            </Suspense>
            <Suspense fallback={<></>}>
              <div style={{ zIndex: 10000 }}>
                {/* ONly to show modal on mweb */}
                <ChangeUserLanguageMWEb />
              </div>
            </Suspense>
          </>
        ) : null}
        {meLoading || streamDetailsLoading ? (
          <FullSpinnerPage position="relative" />
        ) : !isOnboardingCompleted ? (
          <Flex h="full" w="full" overflow="auto">
            <Suspense fallback={<FullSpinnerPage />}>
              <Onboarding />
            </Suspense>
          </Flex>
        ) : !isStreamSetupCompleted ? (
          <>
            {!webViewBuild && (
              <Flex w={['18%']} display={['none', 'flex', 'flex']} h="100%">
                <SideBar
                  routes={routes}
                  menuListDisabled={!isStreamSetupCompleted}
                />
              </Flex>
            )}
            <Flex h="100%" w={['100%', '82%']} overflow="auto">
              <Suspense fallback={<FullSpinnerPage />}>
                <SetupStream defaultStreamDetails={defaultStreamDetails} />
              </Suspense>
            </Flex>
          </>
        ) : (
          <Switch>
            <SentryRoute path={[...withoutSidebarPaths]}>
              {routes.map((route) => {
                return route.component ? (
                  <SentryRoute
                    key={route.key || route.name}
                    path={route.path}
                    exact={route.exact}
                    render={(routeProps) => (
                      <Suspense fallback={<FullSpinnerPage />}>
                        {/* @ts-ignore */}
                        <route.component {...routeProps} routes={routes} />
                      </Suspense>
                    )}
                  />
                ) : null
              })}
            </SentryRoute>
            <SentryRoute path={[...withSidebarPaths]}>
              <>
                {!webViewBuild && (
                  <Flex
                    w={'18%'}
                    display={['none', 'flex', 'flex']}
                    minWidth={['234px']}
                  >
                    <SideBar
                      routes={routes}
                      menuListDisabled={!isStreamSetupCompleted}
                    />
                  </Flex>
                )}
                {!webViewBuild && <MobileDrawer routes={routes} />}
                <Flex h="100%" w={['100%', '82%', '82%']} overflow="auto">
                  <Switch>{renderRoutes(routes)}</Switch>
                </Flex>
              </>
            </SentryRoute>
            <Redirect
              exact
              from={paths.dashboard.default}
              to={webViewBuild ? paths.dashboard.menu : paths.dashboard.home}
            />
            <SentryRoute component={NotFoundDashboard} />
          </Switch>
        )}
      </Flex>
      {isWhatsappNotifOpen && (
        <Suspense fallback={<></>}>
          <CommonModal
            isOpen={isWhatsappNotifOpen}
            onClose={onWhatsappNotifClose}
          />
        </Suspense>
      )}
    </Flex>
  )
}
export default React.memo(NewDashboardRoute)
