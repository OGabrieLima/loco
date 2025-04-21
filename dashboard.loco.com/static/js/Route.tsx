import { Flex, Icon, PseudoBox, Text } from '@chakra-ui/core'
import React, { lazy, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  useHistory,
} from 'react-router-dom'

import { RootState } from './app/RootReducer'
import { useCustomToast } from './components/customToast'
import { FullSpinnerPage } from './components/FullSpinnerPage'
import DetectAppLanguage from './components/i18nLanguageSelector/DetectAppLanguage'
import Header from './components/layout/Header'
import NotFoundDashboard from './components/NotFound/NotFoundDashboard'
import { InternalError } from './modules/InternalError'
import { Login } from './modules/Login/Login'
import { Logout } from './modules/Logout'
import { NotFound } from './modules/NotFound'
import { StorageError } from './modules/StorageError'
import { paths } from './routers/constants'
import DashboardRoutes from './routers/dashboardRoutes'
import SentryRoute from './SentryRoute'
import {
  PrivacyPolicy,
  StreamerAgreement,
  TermsConditions,
} from './webview/IFrame'

const LanguageSelector = lazy(() =>
  import('./components/i18nLanguageSelector/LanguageSelector')
)

const LazyComponentOtpless = lazy(() =>
  import(/* webpackChunkName: `LazyComponentOtpless` */ '@modules/OtplessV3')
)
const TermsAndConditionModal = lazy(() =>
  import(
    /* webpackChunkName: `TermsAndConditionModal` */ '@components/TermsAndConditionModal'
  )
)

const ProtectedRouteWithHeader = React.memo(() => {
  const { accessToken, loading } = useSelector((state: RootState) => state.app)
  const { me } = useSelector((state: RootState) => state.login)
  const access_token = accessToken || localStorage.getItem('access_token')
  const isUserPresent = !!(access_token && me?.username)

  return loading ? (
    <FullSpinnerPage />
  ) : (
    <>
      <Suspense fallback={null}>
        <LanguageSelector />
      </Suspense>
      <Header />
      <Suspense fallback={<></>}>
        <>
          <TermsAndConditionModal />
        </>
      </Suspense>
      <Switch>
        <SentryRoute
          path={paths.dashboard.default}
          render={(props) => {
            if (isUserPresent) {
              return <DashboardRoutes />
            } else {
              return (
                <Redirect
                  to={{
                    pathname: paths.login,
                    state: { from: props.location },
                  }}
                />
              )
            }
          }}
        />
      </Switch>
    </>
  )
})
ProtectedRouteWithHeader.displayName = 'ProtectedRouteWithHeader'

const routes = [
  {
    path: paths.login,
    component: Login,
    exact: true,
  },
  {
    path: paths.logout,
    component: Logout,
    exact: true,
  },
  // {
  //   path: paths.signup,
  //   component: Signup,
  //   exact: true,
  // },
  {
    path: paths['500'],
    component: InternalError,
    exact: true,
  },
  {
    path: paths['403'],
    component: NotFound,
    exact: true,
  },
  {
    path: paths.storageError,
    component: StorageError,
    exact: true,
  },
  {
    path: paths.privacy,
    component: PrivacyPolicy,
    exact: true,
  },
  {
    path: paths.agreement,
    component: StreamerAgreement,
    exact: true,
  },
  {
    path: paths.terms,
    component: TermsConditions,
    exact: true,
  },
  // {
  //   path: paths.streamerAcademy,
  //   component: HowToStream,
  //   exact: true,
  // },
  // {
  //   path: paths.academyHowToStream,
  //   component: CategoryContent,
  //   exact: true,
  // },
  // {
  //   path: paths.academyContent,
  //   component: CategoryContent,
  //   exact: true,
  // },
  // {
  //   path: paths.academyMonetisation,
  //   component: CategoryContent,
  //   exact: true,
  // },
  // {
  //   path: paths.howToStreamId,
  //   component: HTSans,
  //   exact: true,
  // },
  // {
  //   path: paths.lookback,
  //   component: Lookback2022,
  //   exact: true,
  // },
  {
    path: paths.dashboard.default,
    component: ProtectedRouteWithHeader,
    exact: false,
  },
]

const Routes = React.memo(() => {
  const toast = useCustomToast()
  const { t } = useTranslation()

  useEffect(() => {
    function notify() {
      toast({
        position: 'top',
        title: t('error.internet'),
        description: t('error.internetSubtitle'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    }
    window.addEventListener('offline', notify)
    return () => {
      window.removeEventListener('offline', notify)
    }
  }, [])

  return (
    <>
      <DetectAppLanguage />
      <Suspense fallback={<></>}>
        <LazyComponentOtpless />
      </Suspense>
      <Router>
        {/* On Redirection, somehow dashboard.getloconow.com is redirect to index.html thus add redirect */}
        <SentryRoute
          exact
          path="/index.html"
          render={() => <Redirect to={'/'} />}
        />
        <Switch>
          <SentryRoute
            exact
            path="/"
            render={() => <Redirect to={paths.login} />}
          />
          {routes.map((route) => (
            <SentryRoute
              key={route.path}
              exact={route.exact}
              path={route.path}
              render={(props) => <route.component {...props} />}
            />
          ))}
          <SentryRoute component={NotFoundWithHeader} />
        </Switch>
      </Router>
    </>
  )
})

const NotFoundWithHeader = () => {
  const { t } = useTranslation()
  const history = useHistory()
  return (
    <>
      <Flex
        bg="brand.loco-black"
        display={'flex'}
        h={['56px']}
        align="center"
        justify="flex-start"
        boxSizing="border-box"
        w="full"
        color="white"
        borderBottom={'1px solid #3A3A3A'}
        px={['20px', 0]}
        whiteSpace={'nowrap'}
      >
        <PseudoBox
          display="flex"
          alignItems="center"
          cursor={'pointer'}
          onClick={() => {
            history.push(paths.login)
          }}
        >
          <Icon
            //@ts-ignore
            name="loco"
            color="white"
            height={'22px'}
            width={'150px'}
            ml={6}
            mr={['12px', '24px']}
          />
          <Text
            as="span"
            fontSize={['xs', 'xs']}
            fontWeight={['black', 'bold']}
            color="white"
          >
            {t('header.title')}
          </Text>
        </PseudoBox>
      </Flex>
      <NotFoundDashboard />
    </>
  )
}
Routes.displayName = 'Routes'

export default Routes
