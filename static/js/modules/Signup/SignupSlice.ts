// import { fetchWithAllErrorHandle } from '@api/apiRequest';
import { AppThunk } from '@app/Store'
import { createSlice } from '@reduxjs/toolkit'
// import { getFingerprint } from '@utils/fingerprint';
// import { clientID, clientSecret } from '../../constent';

export enum SignupScreenENUM {
  SignupOptionsScreen,
  PhoneNumberScreen,
  OTPNumberScreen,
}
export interface appSliceStateInterface {
  sign_accessToken: string
  sign_refreshToken: string
  email: null | boolean
  loading: boolean
  error: any | null
  previousVisit: any
  otpRetryCount: number
  isDrawerOpen: boolean
  signUpScreen: SignupScreenENUM
  phoneNumber: string | null
  phoneNumberSignUpLoading: boolean
  phoneNumberSignUpError: any
  OTPSignUpLoading: boolean
  OTPSignUpError: string | null
  noProfileError: any
  notStreamerError: string | null
}

const initialState: appSliceStateInterface = {
  sign_accessToken: '',
  sign_refreshToken: '',
  email: null,
  otpRetryCount: 0,
  loading: false,
  error: null,
  previousVisit: '',
  isDrawerOpen: false,
  signUpScreen: SignupScreenENUM.SignupOptionsScreen,
  phoneNumber: null,
  phoneNumberSignUpLoading: false,
  noProfileError: null,
  notStreamerError: null,
  phoneNumberSignUpError: null,
  OTPSignUpLoading: false,
  OTPSignUpError: null,
}

const signUp = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setLoader(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    setEmail(state, action) {
      state.email = action.payload
    },
    setSignUpAccessToken(state, action) {
      state.sign_accessToken = action.payload
    },
    setSignUpRefreshToken(state, action) {
      state.sign_refreshToken = action.payload
    },
    setPreviousVisit(state, action) {
      state.previousVisit = action.payload
    },
    setIsDrawerOpen(state, action) {
      state.isDrawerOpen = action.payload
    },
    setSignUpScreen(state, action) {
      state.signUpScreen = action.payload
    },
    setPhoneNumber(state, action) {
      state.phoneNumber = action.payload
    },
    setPhoneNumberSignupStart(state) {
      state.phoneNumberSignUpLoading = true
      state.noProfileError = null
    },
    setSignupOtpRetryCount(state, action) {
      if (action.payload === 0) {
        state.otpRetryCount = 0
      } else if (action.payload === 1) {
        state.otpRetryCount = state.otpRetryCount + 1
      }
    },
    setPhoneNumberSignUpSuccess(state) {
      state.phoneNumberSignUpLoading = false
      state.signUpScreen = SignupScreenENUM.OTPNumberScreen
      state.phoneNumberSignUpError = null
      state.OTPSignUpError = null
      state.noProfileError = null
    },
    setPhoneNumberSignUpError(state, action) {
      state.phoneNumberSignUpLoading = false
      state.phoneNumberSignUpError = action.payload
    },
    setOTPSignUpStart(state) {
      state.OTPSignUpLoading = true
      state.OTPSignUpError = null
      state.notStreamerError = null
    },
    setOTPSignUpError(state, action) {
      state.OTPSignUpLoading = false
      state.OTPSignUpError = action.payload
    },
    setOTPSignUpSucess(state) {
      state.OTPSignUpLoading = false
      state.OTPSignUpError = null
      state.notStreamerError = null
    },
    setNoProfileError(state, action) {
      state.phoneNumberSignUpLoading = false
      state.noProfileError = action.payload
    },
    setNotStreamerError(state, action) {
      state.OTPSignUpLoading = false
      state.notStreamerError = action.payload
    },
  },
})

export const {
  setLoader,
  setError,
  setSignupOtpRetryCount,
  setSignUpAccessToken,
  setSignUpRefreshToken,
  setPreviousVisit,
  setIsDrawerOpen,
  setSignUpScreen,
  setPhoneNumber,
  setPhoneNumberSignupStart,
  setOTPSignUpError,
  setOTPSignUpStart,
  setOTPSignUpSucess,
  setPhoneNumberSignUpError,
  setPhoneNumberSignUpSuccess,
  setNoProfileError,
  setNotStreamerError,
  setEmail,
} = signUp.actions

export default signUp.reducer

export const sentOtpToNumber = (): AppThunk => async (dispatch) => {
  dispatch(setPhoneNumberSignupStart())
  dispatch(setPhoneNumberSignUpSuccess())
}
