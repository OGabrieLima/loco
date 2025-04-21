import { Box, Flex, Icon, Image, PseudoBox, Text } from '@chakra-ui/core'
import {
  checkPremiumUser,
  fetchBasicDataBeforeUserLogin,
  setIsFetchUserLoginInProgress,
} from '@modules/Login/loginSlice'
import I18nLanguageSelector from '@src/components/i18nLanguageSelector'
import LanguageSelector from '@src/components/i18nLanguageSelector/LanguageSelector'
import { eventActions, eventConstants, eventPropsTypes } from '@utils/Amplitude'
import { resetAmplitudeSession } from '@utils/Amplitude/amplitude'
import React, { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {
  googleStreamerLogin,
  LoginScreenENUM,
  setError,
} from '../../app/appSlice'
import { RootState } from '../../app/RootReducer'
import { FullSpinnerPage } from '../../components/FullSpinnerPage'
import { isLanguageSelectionEnabled, isWebViewBuild } from '../../constent'
import withToasts from '../../hoc/WithToasts'
import loginRightChildBg from '../../images/login/right_side_bg.png'
import { paths } from '../../routers/constants'
import { streamDetailsStateInterface } from '../DefaultStream/streamDetailsSlice'
import { GoogleAndMobileOptionLoginScreen } from './GoogleAndMobileOptionLoginScreen'
import TermsModalLogin from './TermsModalLogin'
import { WebViewLoginError } from './WebViewLoginError'

const LoginComponent = (props: any): JSX.Element => {
  const { state: redirectState } = props.location
  const dispatch = useDispatch()
  const history = useHistory()
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage
  const { modal_type } = useSelector((state: RootState) => state.otpless)
  const isModalOpen = !!modal_type
  const {
    me,
    loading: meLoading,
    meProfileLoading,
    isTermsAccepted,
    isFetchBasicDataBeforeUserLoginInProgress,
    isFetchUserLoginInProgress,
  } = useSelector((state: RootState) => state.login)

  const { loginScreen, accessToken, refreshToken } = useSelector(
    (state: RootState) => state.app
  )

  const {
    loading: defaultStreamDetailsLoading,
  }: streamDetailsStateInterface = useSelector(
    (state: RootState) => state.streamDetails
  )

  const isTokenPresent = !!(accessToken && refreshToken)
  const isUserPresent = !!(isTokenPresent && me?.username)

  const isShowTermsModal = isUserPresent && isTermsAccepted === false
  const loading =
    meLoading ||
    meProfileLoading ||
    defaultStreamDetailsLoading ||
    isFetchBasicDataBeforeUserLoginInProgress ||
    isFetchUserLoginInProgress

  useEffect(() => {
    if (isUserPresent && isTermsAccepted) {
      // POST login by otpless or google,
      // this effect will be responsible to redirect user into home
      const redirectPath = redirectState
        ? redirectState.from.pathname
        : paths.dashboard.default
      history.replace(redirectPath)
      localStorage.setItem('prev_logged_in', 'yes')
    }
  }, [isUserPresent, isTermsAccepted])

  useEffect(() => {
    if (isTokenPresent) {
      batch(() => {
        dispatch(fetchBasicDataBeforeUserLogin())
        dispatch(checkPremiumUser())
      })
    } else {
      // reset amplitude session details, if user is not present
      resetAmplitudeSession()
    }
  }, [isTokenPresent])

  const responseGoogle = (response: any): void => {
    const userEmail = response?.profileObj?.email
    let ErrorEvent: null | string = response?.error || null

    if (
      response &&
      //@ts-ignore
      response.error &&
      //@ts-ignore
      response.error === 'popup_closed_by_user'
    ) {
      // do nothing
    }
    //@ts-ignore
    else if (response?.error === 'idpiframe_initialization_failed') {
      const errorObj = {
        statusCode: 101,
        title: 'Localstorage Error',
        //@ts-ignore
        message: response.details,
      }
      dispatch(setError(errorObj))
    } else {
      //@ts-ignore
      if (response?.tokenId) {
        //@ts-ignore
        ErrorEvent = null
        dispatch(setIsFetchUserLoginInProgress(true)) // post auth login, will fetch user details
        dispatch(googleStreamerLogin(response.tokenId, userEmail))
      }
    }
    if (ErrorEvent) {
      const params: eventPropsTypes.dashboard_login_event = {
        email: userEmail,
        login_mode: 'google',
        response: 'fail',
        failure_msg: ErrorEvent || 'Login Api Throws Error',
        trigger: 'onboarding',
        platform: eventConstants.platform,
        source_name: undefined,
      }
      eventActions.sendAmplitudeData(
        eventConstants.dashboard_login_event,
        params
      )
    }
  }

  const LoginLeftChild = useMemo(() => {
    switch (loginScreen) {
      case LoginScreenENUM.LoginOptionsScreen:
        return (
          <GoogleAndMobileOptionLoginScreen responseGoogle={responseGoogle} />
        )

      // case LoginScreenENUM.PhoneNumberScreen:
      //   return <LoginPhoneScreen />

      // case LoginScreenENUM.OTPNumberScreen:
      //   return <LoginOTPScreen />

      default:
        return <></>
    }
  }, [loginScreen, currentLanguage])

  const LoginRightChild = useMemo(() => {
    return (
      <Box
        width={['100%', '400px']}
        height={['100%', '600px']}
        position={'relative'}
      >
        <Image
          zIndex={1}
          src={loginRightChildBg}
          alt="login_bg"
          h="full"
          w="full"
          objectFit={'cover'}
          objectPosition={'top right'}
          left="0"
          right={0}
          top={0}
          bottom={0}
          position={'absolute'}
        />
        <Flex
          zIndex={2}
          position={'relative'}
          h={['100%', 'auto']}
          mt={['25px', '40px']}
          ml={['36px', '52px']}
          direction={'column'}
          // justifyContent={['space-between', 'flex-start']}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Icon
              //@ts-ignore
              name="loco"
              color="white"
              height={'22px'}
              width={'150px'}
              mr={['12px', '24px']}
            />

            {isLanguageSelectionEnabled() && window.innerWidth < 640 ? (
              <Flex
                color="white"
                display={['flex', 'none']}
                alignItems="center"
                justifyContent="flex-end"
                mr="16px"
                position="relative"
              >
                {/* THere must be only 1 instance of this */}
                <I18nLanguageSelector origin="login_modal" />
              </Flex>
            ) : null}
          </Flex>
          <Box color={'brand.loco-primary'} pb="40px">
            <Text
              mt={['72px', '110px']}
              letterSpacing={'-3%'}
              lineHeight={['80px', '72px']}
              fontWeight="900"
              fontSize={['90px', '80px']}
            >
              {t('login.header_go')}
              <br />
              {t('login.header_live')}
            </Text>
            <Text
              mt="24px"
              letterSpacing={'-1%'}
              lineHeight={['15.52px', '23.28px']}
              fontWeight="700"
              fontSize={['16px', '24px']}
            >
              {t('login.header_text_1')}
            </Text>
            <Text
              letterSpacing={'-1%'}
              lineHeight={['15.52px', '23.28px']}
              fontWeight="700"
              fontSize={['16px', '24px']}
            >
              {t('login.header_text_2')}
            </Text>
          </Box>
        </Flex>
      </Box>
    )
  }, [currentLanguage])

  return (
    <>
      <Helmet>
        <title>{t('header.loco_streaming_center')}</title>
      </Helmet>
      <Flex
        id="parentLoginPage"
        direction="column"
        w="full"
        height={['100dvh', 'full']}
        bg="brand.loco-black"
      >
        <Flex
          bg="brand.loco-black"
          display={isShowTermsModal ? 'flex' : ['none', 'flex', 'flex']}
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
          <PseudoBox display="flex" alignItems="center">
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
        <Flex
          m={['0', 'auto']}
          flex={1}
          maxW={['100%', '760px']}
          maxH={['100%', '600px']}
          h="full"
          w="full"
          direction={['row', 'column']}
          alignItems="center"
          justifyContent={'center'}
        >
          {!loading && !isWebViewBuild ? (
            <Flex
              flex={1}
              h="full"
              w="full"
              position="relative"
              overflow="visible"
              color="black"
              direction={['column', 'row']}
            >
              {isShowTermsModal ? (
                <TermsModalLogin />
              ) : isModalOpen ? (
                <></>
              ) : (
                <>
                  {LoginRightChild}
                  {LoginLeftChild}
                </>
              )}
            </Flex>
          ) : !loading && isWebViewBuild ? (
            <>
              {isShowTermsModal ? <TermsModalLogin /> : <WebViewLoginError />}
            </>
          ) : (
            <FullSpinnerPage h="auto" />
          )}
        </Flex>
      </Flex>
      <LanguageSelector />
    </>
  )
}
const Login = withToasts(LoginComponent)
export { Login }
