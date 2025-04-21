import {
  setIsFetchUserLoginInProgress,
  setLoader as setLoginLoaderW,
  setMeLoader as setNewLoginLoader,
} from '@modules/Login/loginSlice'
import { createSlice } from '@reduxjs/toolkit'
import { LANGUAGE_PRESET } from '@src/i18n/constants'
import { eventActions, eventConstants, eventPropsTypes } from '@utils/Amplitude'
import i18n from 'i18next'
import { batch } from 'react-redux'

import {
  // streamerLogin,
  fetchWithAllErrorHandle,
  googleLoginApi,
  missingInfoApi,
  refreshTokenApi,
  registerDeviceProfile,
} from '../api/apiRequest'
import { clientID, clientSecret, serverUrlv3 } from '../constent'
import { setToasts } from '../hoc/WithToasts/withToastsSlice'
import { browserDetailDelection } from '../utils/browserDetailDetection'
import { getFingerprint } from '../utils/fingerprint'
import { getAccessToken, getRefreshToken } from '../utils/manageTokens'
import { handleEventCapture } from '../utils/sentryEventCapture'
import { isWebViewBuild } from './../constent'
import { AppThunk } from './Store'

const setLoginLoader = (value: boolean): AppThunk => async (dispatch) => {
  dispatch(setLoginLoaderW(value))
  dispatch(setNewLoginLoader(value))
}
export enum LoginScreenENUM {
  LoginOptionsScreen,
  PhoneNumberScreen,
  OTPNumberScreen,
}
export interface appSliceStateInterface {
  accessToken: string
  refreshToken: string
  loading: boolean
  error: any | null
  is_device_profile_registered: boolean
  otpRetryCount: number
  previousVisit: any
  isDrawerOpen: boolean
  loginScreen: LoginScreenENUM
  phoneNumber: string | null
  countryCode: string
  phoneCode: string | null
  phoneNumberLoginLoading: boolean
  phoneNumberLoginError: any
  OTPLoginLoading: boolean
  OTPLoginError: string | null
  noProfileError: any
  notStreamerError: string | null
  linkedPhoneNumber: string | null
  linkedGmail: string | null
  languageSelctionOriginModal: 'login_modal' | 'profile_section' | null
  langToBeChanged: LANGUAGE_PRESET | null
  requestCountryCode: string
}

const initialState: appSliceStateInterface = {
  accessToken: localStorage.getItem('access_token') ?? '',
  refreshToken: localStorage.getItem('refresh_token') ?? '',
  loading: false,
  error: null,
  is_device_profile_registered: false,
  otpRetryCount: 0,
  previousVisit: '',
  isDrawerOpen: false,
  loginScreen: LoginScreenENUM.LoginOptionsScreen,
  phoneNumber: null,
  countryCode: 'IN',
  phoneCode: null,
  phoneNumberLoginLoading: false,
  noProfileError: null,
  notStreamerError: null,
  phoneNumberLoginError: null,
  OTPLoginLoading: false,
  OTPLoginError: null,
  linkedPhoneNumber: null,
  linkedGmail: null,
  languageSelctionOriginModal: null,
  langToBeChanged: null, // this will open confirmation modal for login user
  requestCountryCode: '',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoader(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload
    },
    setPreviousVisit(state, action) {
      state.previousVisit = action.payload
    },
    setIsDrawerOpen(state, action) {
      state.isDrawerOpen = action.payload
    },
    setLoginScreen(state, action) {
      state.loginScreen = action.payload
    },
    setPhoneNumber(state, action) {
      state.phoneNumber = action.payload
    },
    setCountryCode(state, action) {
      state.countryCode = action.payload
    },
    setphoneCode(state, action) {
      state.phoneCode = action.payload
    },
    setPhoneNumberLoginStart(state) {
      state.phoneNumberLoginLoading = true
      state.noProfileError = null
    },
    setPhoneNumberLoginSuccess(state) {
      state.phoneNumberLoginLoading = false
      state.loginScreen = LoginScreenENUM.OTPNumberScreen
      state.phoneNumberLoginError = null
      state.OTPLoginError = null
      state.noProfileError = null
    },
    setPhoneNumberLoginError(state, action) {
      state.phoneNumberLoginLoading = false
      state.phoneNumberLoginError = action.payload
    },
    setOtpRetryCount(state, action) {
      if (action.payload === 0) {
        state.otpRetryCount = 0
      } else if (action.payload === 1) {
        state.otpRetryCount = state.otpRetryCount + 1
      }
    },
    setOTPLoginStart(state) {
      state.OTPLoginLoading = true
      state.OTPLoginError = null
      state.notStreamerError = null
    },
    setOTPLoginError(state, action) {
      state.OTPLoginLoading = false
      state.OTPLoginError = action.payload
    },
    setOTPLoginSucess(state) {
      state.OTPLoginLoading = false
      state.OTPLoginError = null
      state.notStreamerError = null
    },
    setNoProfileError(state, action) {
      state.phoneNumberLoginLoading = false
      state.noProfileError = action.payload
    },
    setNotStreamerError(state, action) {
      state.OTPLoginLoading = false
      state.notStreamerError = action.payload
    },
    setLinkedPhoneNumber(state, action) {
      state.linkedPhoneNumber = action.payload
    },
    setLinkedGmail(state, action) {
      state.linkedGmail = action.payload
    },
    setDeviceProfileRegistered(state, action) {
      state.is_device_profile_registered = !!action.payload
    },
    setlanguageSelctionOriginModal(state, action) {
      state.languageSelctionOriginModal = action.payload
    },
    setLangToBeChanged(state, action) {
      state.langToBeChanged = action.payload
    },
    setRequestCountryCode(state, action) {
      state.requestCountryCode = action.payload
    },
  },
})

export const {
  setLoader,
  setError,
  setAccessToken,
  setOtpRetryCount,
  setRefreshToken,
  setPreviousVisit,
  setIsDrawerOpen,
  setLoginScreen,
  setPhoneNumber,
  setCountryCode,
  setphoneCode,
  setLangToBeChanged,
  setPhoneNumberLoginStart,
  setPhoneNumberLoginSuccess,
  setPhoneNumberLoginError,
  setOTPLoginError,
  setOTPLoginStart,
  setOTPLoginSucess,
  setNoProfileError,
  setNotStreamerError,
  setLinkedPhoneNumber,
  setLinkedGmail,
  setDeviceProfileRegistered,
  setRequestCountryCode,
} = appSlice.actions

export default appSlice.reducer

export const setlanguageSelctionOriginModal = (
  languageSelctionOriginModal: 'login_modal' | 'profile_section' | null
): AppThunk => async (dispatch) => {
  dispatch(
    appSlice.actions.setlanguageSelctionOriginModal(languageSelctionOriginModal)
  )
}

export const fetchRefreshToken = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoader(true))
    const res = await refreshTokenApi()
    if (res.access_token && res.refresh_token) {
      batch(() => {
        dispatch(setRefreshToken(res.refresh_token))
        dispatch(setAccessToken(res.access_token))
      })
    } else if (res?.statusCode) {
      dispatch(setError(res))
    }
  } catch (err) {
    dispatch(setError('Error'))
  } finally {
    dispatch(setLoader(false))
  }
}

export const googleStreamerLogin = (
  googleTokenId: string,
  userEmail: string
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoader(true))
    const res = await googleLoginApi(googleTokenId)
    // const res = await streamerLogin(googleTokenId);
    if (res.access_token && res.refresh_token) {
      const params: eventPropsTypes.dashboard_login_event = {
        email: userEmail,
        login_mode: 'google',
        response: 'success',
        failure_msg: undefined,
        trigger: 'onboarding',
        platform: eventConstants.platform,
        source_name: undefined,
      }
      eventActions.sendAmplitudeData(
        eventConstants.dashboard_login_event,
        params
      )
      batch(() => {
        dispatch(setRefreshToken(res.refresh_token))
        dispatch(setAccessToken(res.access_token))
        dispatch(setLoginLoader(true))
      })
    } else if (res?.statusCode) {
      dispatch(setIsFetchUserLoginInProgress(false)) // post auth login, will fetch user details failed
      const params: eventPropsTypes.dashboard_login_event = {
        email: userEmail,
        login_mode: 'google',
        response: 'fail',
        failure_msg: res?.message || 'Login Api Throws Error',
        trigger: 'onboarding',
        platform: eventConstants.platform,
        source_name: undefined,
      }
      eventActions.sendAmplitudeData(
        eventConstants.dashboard_login_event,
        params
      )
      dispatch(setError(res))
    }
  } catch (_err) {
    dispatch(setIsFetchUserLoginInProgress(false)) // post auth login, will fetch user details failed
    const err = _err as any
    const params: eventPropsTypes.dashboard_login_event = {
      email: userEmail,
      login_mode: 'google',
      response: 'fail',
      failure_msg: err?.message || 'Login Api Failed',
      trigger: 'onboarding',
      platform: eventConstants.platform,
      source_name: undefined,
    }
    eventActions.sendAmplitudeData(eventConstants.dashboard_login_event, params)
    dispatch(setError(err))
  } finally {
    dispatch(setLoader(false))
    dispatch(setLoginLoader(false))
  }
}

export const findMissingLinking = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoader(true))
    const res = await missingInfoApi()
    if (res?.gmail || res?.phone) {
      batch(() => {
        dispatch(setLinkedGmail(res?.gmail))
        dispatch(setLinkedPhoneNumber(res?.phone))
        if (res?.gmail && res?.phone) {
          localStorage.setItem('required_account_linked', 'true')
        }
      })
    } else {
      dispatch(setLoginLoader(false))
      localStorage.removeItem('prev_logged_in')
    }
  } catch (err) {
    dispatch(setError('Error'))
    dispatch(setLoginLoader(false))
  } finally {
    dispatch(setLoader(false))
  }
}

export const sentOtpToNumber = (): AppThunk => async (dispatch, getState) => {
  const fingerprint = await getFingerprint()
  const {
    app: { phoneNumber, countryCode },
  } = getState()
  const params = {
    client_id: clientID,
    country: `${countryCode}`,
    client_secret: clientSecret,
    phone: `${phoneNumber}`,
  }
  dispatch(setPhoneNumberLoginStart())
  const result = await fetchWithAllErrorHandle
    .url(`${serverUrlv3}/user/send-otp/`)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'DEVICE-ID': fingerprint,
      'X-PLATFORM': '7',
    })
    .post(params)
    .badRequest((error, originalRequest) => {
      dispatch(
        setNoProfileError(
          error.message ? error.message : 'Something went wrong'
        )
      )
      handleEventCapture(
        originalRequest._url,
        error?.message
          ? JSON.parse(error.message).message
          : 'Failed to Fetch Api',
        400
      )
    })
    .json()
    .catch((error) => {
      handleEventCapture(
        `${serverUrlv3}/user/send-otp/`,
        error?.message ? error.message : 'Failed to fetch api'
      )
    })
  if (result && result.message && result.message === 'Otp sent') {
    batch(() => {
      dispatch(
        setToasts({
          position: 'top',
          title: i18n.t('login.phoneNumber.success'),
          description: `${i18n.t('login.phoneNumber.otpToast')} ${phoneNumber}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      )
      dispatch(setPhoneNumberLoginSuccess())
    })
  } else {
    dispatch(setPhoneNumberLoginError(result))
  }
}

export const OTPVerify = (OTP: string): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    const fingerprint = await getFingerprint()
    const {
      app: { phoneNumber, otpRetryCount },
    } = getState()
    const {
      browser,
      browserMajorVersion,
      os,
      osVersion,
    } = browserDetailDelection()
    const params = {
      client_id: clientID,
      client_secret: clientSecret,
      phone: `${phoneNumber}`,
      code: `${OTP}`,
      device_info: {
        model: browser + browserMajorVersion,
        os_ver: osVersion,
        os_name: os,
        app_ver: window.navigator.appVersion,
        info_json: {
          browser_name: browser,
        },
      },
    }
    dispatch(setOTPLoginStart())
    const result = await fetchWithAllErrorHandle
      .url(`${serverUrlv3}/user/verify-otp/`)
      .headers({
        'Content-Type': 'application/json;charset=utf-8',
        'DEVICE-ID': fingerprint,
        'X-PLATFORM': '7',
      })
      .post(params)
      .json()
      .catch((error) => {
        handleEventCapture(
          `${serverUrlv3}/user/verify-otp/`,
          error?.message ? error.message : 'Failed to fetch api'
        )
      })

    const phone_isd_code_from_server = result?.phone_isd_code || undefined
    const phone_from_server = result?.phone || undefined

    if (result && result.access_token) {
      const params: eventPropsTypes.dashboard_login_event = {
        otp_resend_count: otpRetryCount,
        phone_number: phone_from_server || phoneNumber,
        phone_isd_code: phone_isd_code_from_server,
        mode: 'manual',
        medium: 'sms',
        login_mode: 'phone_number_otp',
        response: 'success',
        failure_msg: undefined,
        trigger: 'onboarding',
        platform: eventConstants.platform,
        source_name: undefined,
      }
      eventActions.sendAmplitudeData(
        eventConstants.dashboard_login_event,
        params
      )
      window.localStorage.setItem('access_token', result.access_token)
      window.localStorage.setItem('refresh_token', result.refresh_token)
      batch(() => {
        dispatch(setRefreshToken(result.refresh_token))
        dispatch(setAccessToken(result.access_token))
        dispatch(setOTPLoginSucess())
        dispatch(setLoginLoader(true))
      })
    } else if (result && result.message && result.error_code) {
      const params: eventPropsTypes.dashboard_login_event = {
        otp_resend_count: otpRetryCount,
        phone_number: phone_from_server || phoneNumber,
        phone_isd_code: phone_isd_code_from_server,
        mode: 'manual',
        login_mode: 'phone_number_otp',
        medium: 'sms',
        response: 'fail',
        failure_msg: result?.message || 'Api throws error',
        trigger: 'onboarding',
        platform: eventConstants.platform,
        source_name: undefined,
      }
      eventActions.sendAmplitudeData(
        eventConstants.dashboard_login_event,
        params
      )

      if (result.error_code === 'E013') {
        dispatch(setNotStreamerError(result?.message))
      } else if (result.error_code === 'E153') {
        dispatch(setOTPLoginError(result?.message))
      }
    } else {
      const params: eventPropsTypes.dashboard_login_event = {
        otp_resend_count: otpRetryCount,
        phone_number: phone_from_server || phoneNumber,
        phone_isd_code: phone_isd_code_from_server,
        mode: 'manual',
        login_mode: 'phone_number_otp',
        response: 'fail',
        medium: 'sms',
        failure_msg: result?.message || 'Api throws error',
        trigger: 'onboarding',
        platform: eventConstants.platform,
        source_name: undefined,
      }
      eventActions.sendAmplitudeData(
        eventConstants.dashboard_login_event,
        params
      )
      dispatch(setPhoneNumberLoginError(result))
    }
  } catch (err) {
    console.warn(err)
  } finally {
    dispatch(setLoginLoader(false))
  }
}

export const getTokenAsync = (): AppThunk => async (dispatch) => {
  try {
    const a = !!localStorage.getItem('access_token')
    let prevLoggedIn = localStorage.getItem('prev_logged_in')
    if (!isWebViewBuild && prevLoggedIn && !a) {
      // Keep system same in webview as there is no login flow
      localStorage.removeItem('prev_logged_in')
      prevLoggedIn = null
    }
    if (prevLoggedIn) return
    dispatch(setLoader(true))
    if (!isWebViewBuild) {
      dispatch(setDeviceProfileRegistered(false))
      await registerDeviceProfile()
      dispatch(setDeviceProfileRegistered(true))
    }
    const [access_token_async, refresh_token_async] = await Promise.all([
      getAccessToken(),
      getRefreshToken(),
    ])
    batch(() => {
      dispatch(setAccessToken(access_token_async))
      dispatch(setRefreshToken(refresh_token_async))
    })
  } catch (err) {
    console.warn(err)
  } finally {
    dispatch(setLoader(false))
  }
}
