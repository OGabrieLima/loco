import { createSlice } from '@reduxjs/toolkit'
import { AppThunk } from '@src/app/Store'

type IModalType = null | 'PHONE_LOGIN' | 'PHONE_LINKING'

interface loginSliceStateInterface {
  isInitialized: boolean
  modal_type: IModalType

  code: string
  phone: string
  phoneLoading: boolean
  phoneError: null | string

  otpRetries: number // to count retries
  otpMethod: 'SMS' | 'WHATSAPP'
  otpLoading: boolean
  otpError: null | string
}

const initialState: loginSliceStateInterface = {
  isInitialized: false,
  modal_type: null,
  code: '',
  phone: '',
  phoneLoading: false,
  phoneError: null,
  otpRetries: 0,
  otpMethod: 'SMS',
  otpLoading: false,
  otpError: null,
}

const otplessSlice = createSlice({
  name: 'otpless',
  initialState,
  reducers: {
    setIsInitialized: (state, action) => {
      state.isInitialized = !!action.payload
    },
    setModalType: (state, action) => {
      state.modal_type = action.payload

      // reset all states
      state.code = ''
      state.phone = ''
      state.phoneLoading = false
      state.phoneError = null
      state.otpRetries = 0
      state.otpMethod = 'SMS'
      state.otpLoading = false
      state.otpError = null
    },
    setPhoneNumberStart: (state, action) => {
      state.code = action.payload.code
      state.phone = action.payload.phone
      state.phoneLoading = true
      state.phoneError = null
    },
    setPhoneNumberError: (state, action) => {
      state.phoneError = action.payload || null
      state.phoneLoading = false
    },
    setOtpSendMethod: (state, action) => {
      state.otpMethod = action.payload === 'WHATSAPP' ? 'WHATSAPP' : 'SMS'
    },
    setOtpFlowStart: (state) => {
      state.otpLoading = true
      state.otpError = null
    },
    setOtpRetries: (state, action) => {
      state.otpRetries = action.payload
    },
    setOtpFlowError: (state, action) => {
      state.otpLoading = false
      state.otpError = action.payload || null
    },
  },
})

const {
  setIsInitialized,
  setPhoneNumberStart,
  setPhoneNumberError,
  setModalType,
  setOtpFlowStart,
  setOtpSendMethod: _setOtpSendMethod,
  setOtpRetries,
  setOtpFlowError,
} = otplessSlice.actions

const openLoginLinkingModal = ({
  modal_type,
}: {
  modal_type: IModalType
}): AppThunk => async (dispatch) => {
  if (
    modal_type === 'PHONE_LOGIN' ||
    modal_type === 'PHONE_LINKING' ||
    modal_type === null
  ) {
    dispatch(setModalType(modal_type))
  } else {
    throw new Error(`Invalid Modaltype:${modal_type} for otpless`)
  }
}

const setOtpSendMethod = ({
  otp_method,
}: {
  otp_method: 'WHATSAPP' | 'SMS'
}): AppThunk => async (dispatch) => {
  dispatch(_setOtpSendMethod(otp_method))
}
// To Do not export all internal functions
export {
  openLoginLinkingModal,
  setIsInitialized,
  setOtpFlowError,
  setOtpFlowStart,
  setOtpRetries,
  setOtpSendMethod,
  setPhoneNumberError,
  setPhoneNumberStart,
}
export default otplessSlice.reducer
