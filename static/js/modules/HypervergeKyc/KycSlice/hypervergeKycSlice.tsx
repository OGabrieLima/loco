import {
  getKycDetails,
  getKycPrompt,
  UploadBankDocument,
  UploadPanDocument,
} from '@api/apiRequest'
import store, { AppThunk } from '@app/Store'
import { createSlice } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import {
  bankAccountEvent,
  PanAccountEvent,
  PanLivenessEvent,
  PanNameMatchEvent,
} from '../kyc_events'
const SLICE_NAME = 'hypervergekycDetails'

export type IKycStatus = 'KYC_NOT_INITIATED' | 'KYC_PENDING' | 'KYC_COMPLETED'

export type IKycStatusMessage =
  | 'PAN_REQUIRED'
  | 'BANK_ACCOUNT_REQUIRED'
  | 'PAN_BANK_NAME_MISMATCH'
  | 'PAN_BANK_NAME_MATCHED'
  | 'KYC_NOT_INITIATED_MESSAGE'

export type IVerificationStatus =
  | 'VERIFIED'
  | 'MANUAL_VERIFICATION_REQUIRED'
  | 'VERIFICATION_FAILED'

export interface IPanDetails {
  type: string | 'PAN' | 'pan'
  details: {
    date_of_issue: string
    dob: string
    document_id: string
    document_type: string
    father_name: string
    name: string
  }
  verification_status: IVerificationStatus
}

export interface IBankDetails {
  ifsc: string
  account_name: string
  account_number: string
}
export interface IOptions {
  status?: 'success' | 'error' | 'pending' | 'warning'
  hideButton?: boolean
  disabled?: boolean
}
interface initialStateInterface {
  isSkipApiCall: boolean
  isKycDetailsFetched: boolean
  loading: boolean
  loadingPan: boolean
  loadingBank: boolean
  showKycPrompt: boolean
  kyc_status: IKycStatus
  kyc_status_message: IKycStatusMessage

  panErrorCode: null | string
  panErrorMessage: null | string
  panSuccessMessage: null | string

  bankErrorCode: null | string
  bankErrorMessage: null | string
  bankSuccessMessage: null | string

  messageToShow: null | string
  modalTitleToShow: null | string
  modalMessageToShow: null | string

  panDetail: null | IPanDetails
  panOptions: IOptions

  bankDetail: null | IBankDetails
  bankOptions: IOptions
}
const initialState: initialStateInterface = {
  isSkipApiCall: false,
  isKycDetailsFetched: false,
  loading: false,
  loadingPan: false,
  loadingBank: false,
  showKycPrompt: false,
  kyc_status: 'KYC_NOT_INITIATED',
  kyc_status_message: 'KYC_NOT_INITIATED_MESSAGE',

  panErrorCode: null,
  panErrorMessage: null,
  panSuccessMessage: null,

  bankErrorCode: null,
  bankErrorMessage: null,
  bankSuccessMessage: null,

  messageToShow: null,
  modalTitleToShow: null,
  modalMessageToShow: null,

  bankDetail: null,
  bankOptions: {},

  panDetail: null,
  panOptions: {},
}

const handleCommonEventForNameMatch = (state?: {
  kyc_status: IKycStatus
  kyc_status_message: IKycStatusMessage
  panDetail: null | IPanDetails
  bankDetail: null | IBankDetails
}) => {
  if (!state?.bankDetail || !state?.panDetail) {
    return
  }
  const {
    showKycPrompt,
    panDetail,
    bankDetail,
    kyc_status,
  } = store.getState().hypervergeKyc

  if (state?.kyc_status_message === 'PAN_BANK_NAME_MISMATCH') {
    PanNameMatchEvent({
      kyc_status: state?.kyc_status || kyc_status,
      isKycEligible: !!(state?.panDetail || panDetail) || showKycPrompt,
      verfication_status: 'failed',
      reason: (state?.bankDetail || bankDetail)?.account_name
        ? 'PAN_BANK_NAME_MISMATCH'
        : 'BANK_NAME_NOT_PRESENT',
    })
  } else {
    PanNameMatchEvent({
      kyc_status: state?.kyc_status || kyc_status,
      isKycEligible: !!(state?.panDetail || panDetail) || showKycPrompt,
      verfication_status: 'success',
      reason: '',
    })
  }
}
const handleKycUpdateState = (state: initialStateInterface) => {
  const bankDetail = state.bankDetail
  const panDetail = state.panDetail
  // const kyc_status = state.kyc_status;
  const kyc_status_message = state.kyc_status_message
  // const showKycPrompt = state.showKycPrompt;

  if (bankDetail) {
    state.bankOptions = { status: 'success' }
  } else {
    state.bankOptions = {}
  }

  if (panDetail) {
    state.panOptions = { status: 'pending' }
    if (panDetail.verification_status === 'MANUAL_VERIFICATION_REQUIRED') {
      state.panErrorCode = panDetail.verification_status
      state.panErrorMessage = 'Maximum attempts reached'
      state.bankOptions = { status: 'error', hideButton: true, disabled: true }
      state.panOptions = { status: 'error', hideButton: true, disabled: true }
      state.messageToShow =
        'You can reach out to help__and__support in case you are unable to verify PAN card or Bank Account'
      return
    } else if (panDetail.verification_status === 'VERIFICATION_FAILED') {
      state.panOptions = { status: 'error' }
      state.panErrorCode = panDetail.verification_status
      state.panErrorMessage = 'PAN Card verification unsuccessful'
      state.messageToShow =
        'Your PAN verification has failed, please try again.'
    } else if (panDetail.verification_status === 'VERIFIED') {
      state.panOptions = {
        status: 'success',
        hideButton: !!bankDetail,
        disabled: !!bankDetail,
      }
    }
  } else {
    state.panOptions = {}
  }

  if (
    kyc_status_message === 'PAN_BANK_NAME_MISMATCH' &&
    panDetail &&
    bankDetail
  ) {
    state.panOptions = { status: 'warning' }
    state.bankOptions = { status: 'warning' }
    state.messageToShow =
      'Your bank account details failed to match with your PAN Card. Please try again'
    if (!bankDetail.account_name) {
      state.messageToShow =
        'We are unable to fetch bank details. Please add another bank account.\n For more information, please contact help__and__support.'
    }
  }
}

const fetchPANInfo = (response: any): null | IPanDetails => {
  let panInfo = null
  if (response && Array.isArray(response['documents'])) {
    for (const document of response['documents']) {
      const type: string = document?.type || ''
      if (type.toLowerCase().search('pan') >= 0) {
        panInfo = document
        break
      }
    }
  }
  return panInfo
}

const API_CALL_REQUEST: any = {
  bank: null,
  pan: null,
  isBankAPIProcessing: false,
  isPanAPIProcessing: false,
}

const populateKycInfo = (
  res?: any,
  state?: any
): {
  kyc_status: IKycStatus
  kyc_status_message: IKycStatusMessage
  panDetail: null | IPanDetails
  bankDetail: null | IBankDetails
} => {
  state = state || {}
  if (res['bank_profile']) {
    state.bankDetail = res['bank_profile']
  }
  if (res['documents'] && Array.isArray(res['documents'])) {
    state.panDetail = fetchPANInfo(res)
  }
  if (res['kyc_status'] || res['kyc_status_message']) {
    state.kyc_status = res['kyc_status']
    state.kyc_status_message = res['kyc_status_message']
  }
  return state
}
const kycDetailsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = !!action.payload
    },
    setPanLoading(state, action) {
      state.loadingPan = !!action.payload
    },
    setBankLoading(state, action) {
      state.loadingBank = !!action.payload
    },
    setIsSkipApiCall(state, action) {
      state.isSkipApiCall = !!action.payload
    },
    setPanCardMessage(state, action) {
      state.panErrorCode = action.payload.errorCode
      state.panErrorMessage = action.payload.errorMessage
      state.panSuccessMessage = action.payload.successMessage
    },
    setBankAccMessage(state, action) {
      state.bankErrorCode = action.payload.errorCode
      state.bankErrorMessage = action.payload.errorMessage
      state.bankSuccessMessage = action.payload.successMessage
    },
    setMessageToShow(state, action) {
      state.messageToShow = action.payload
    },
    setModalMessageToShow(state, action) {
      state.modalTitleToShow = action.payload?.title || null
      state.modalMessageToShow = action.payload?.message || null
    },
    setBankOptionDetails(state, action) {
      state.bankOptions = action.payload || {}
    },
    setPanOptionDetails(state, action) {
      state.panOptions = action.payload || {}
    },
    setKycDetails(state, action) {
      if (state.isKycDetailsFetched === false) {
        API_CALL_REQUEST.bank = null
        API_CALL_REQUEST.pan = null
        API_CALL_REQUEST.isBankAPIProcessing = false
        API_CALL_REQUEST.isPanAPIProcessing = false
      }
      state.isKycDetailsFetched = true

      const res = action.payload
      populateKycInfo(res, state)
      handleKycUpdateState(state)
    },
    setKycPrompt(state, action) {
      state.showKycPrompt = !!action.payload
      handleKycUpdateState(state)
    },
  },
})

export const {
  setIsSkipApiCall,
  setPanCardMessage,
  setBankAccMessage,
  setMessageToShow,
  setModalMessageToShow,
  setLoading,
  setPanLoading,
  setBankLoading,
  setKycPrompt,
  setKycDetails,
  setBankOptionDetails,
  setPanOptionDetails,
} = kycDetailsSlice.actions

export default kycDetailsSlice.reducer

const checkErrorMessage = (err: any) => {
  const errorCode = err?.message
  switch (errorCode) {
    case 'DUPLICATE_USER_KYC_DOCUMENT':
      return 'PAN Card is already registered'
    case 'KYC_ALREADY_COMPLETED':
      return 'Kyc is already completed for user'
    case 'PAN_BANK_NAME_MISMATCH':
      return 'Your bank account details failed to match with your PAN Card'
    case 'INACTIVE_BANK_ACCOUNT':
      return 'Bank account is inactive. Please try with different account'
    case 'LIVENESS_REQUIRED':
      return 'Face not detected in image'
    case 'INVALID_ACCOUNT_NUMBER_OR_IFSC':
      return 'Incorrect Account Number / IFSC Code'
    default:
      return null
  }
}

export const checkKycPrompt = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const result = await getKycPrompt()
    if (typeof result['required'] !== undefined) {
      dispatch(setKycPrompt(!!result['required']))
    }
  } catch (err) {
    // dispatch(setError('' + err));
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchKycDetails = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await getKycDetails()
    dispatch(setKycDetails(res))
  } catch (err) {
    dispatch(
      setMessageToShow('Something went wrong. Please try again after some time')
    )
  } finally {
    dispatch(setLoading(false))
  }
}

const handleBankError = (err: any): AppThunk => async (dispatch) => {
  batch(() => {
    dispatch(setBankOptionDetails({ status: 'error' }))
    dispatch(
      setBankAccMessage({
        errorMessage:
          checkErrorMessage(err) || 'Bank Account verification failed',
      })
    )
    if (err?.message === 'NAME_MISMATCH') {
      dispatch(
        setMessageToShow(
          'Your bank account details failed to match with your PAN Card. Please try again'
        )
      )
    }
  })
}

const DecideAPICall = (): AppThunk => async (dispatch) => {
  if (API_CALL_REQUEST.bank && API_CALL_REQUEST.isPanAPIProcessing === false) {
    dispatch(MakeBankDetailsApiCall())
  } else if (
    API_CALL_REQUEST.pan &&
    API_CALL_REQUEST.isBankAPIProcessing === false
  ) {
    dispatch(MakePanDetailsApiCall())
  }
}

const MakeBankDetailsApiCall = (): AppThunk => async (dispatch) => {
  try {
    API_CALL_REQUEST.isBankAPIProcessing = true
    const result = await UploadBankDocument(API_CALL_REQUEST.bank)
    try {
      const populatedResult = populateKycInfo(result)
      const { kyc_status, panDetail, bankDetail } = populatedResult
      const showKycPrompt = store.getState().hypervergeKyc.showKycPrompt
      bankAccountEvent({
        kyc_status,
        isKycEligible: !!panDetail || showKycPrompt,
        bank_name: bankDetail?.account_name || '',
        verfication_status: 'success',
        reason: '',
      })
      handleCommonEventForNameMatch(populatedResult)
    } catch (err) {
      // Do nothing
    }
    API_CALL_REQUEST.bank = null
    batch(() => {
      dispatch(setKycDetails(result))
      dispatch(
        setBankAccMessage({
          successMessage: 'Bank Account added',
        })
      )
    })
  } catch (_err) {
    const err = _err as any
    const {
      kyc_status,
      panDetail,
      bankDetail,
      showKycPrompt,
    } = store.getState().hypervergeKyc
    bankAccountEvent({
      kyc_status: kyc_status,
      isKycEligible: !!panDetail || showKycPrompt,
      bank_name: bankDetail?.account_name || '',
      verfication_status: 'failed',
      reason: err?.message || 'Something went wrong',
    })
    dispatch(handleBankError(err))
  } finally {
    API_CALL_REQUEST.bank = null
    API_CALL_REQUEST.isBankAPIProcessing = false
    dispatch(DecideAPICall())
    dispatch(setBankLoading(false))
  }
}

export const updateBankDetails = (
  bankDetails: IBankDetails
): AppThunk => async (dispatch) => {
  try {
    batch(() => {
      dispatch(setIsSkipApiCall(true))
      dispatch(setBankLoading(true))
      dispatch(setMessageToShow(''))
      dispatch(
        setModalMessageToShow({
          title: 'Bank Account Verification',
          message:
            'Your bank account details have been uploaded. Please wait till they are verified.',
        })
      )
    })

    if (!bankDetails?.ifsc || !bankDetails?.account_number) {
      throw new Error('Something went wrong')
    }
    API_CALL_REQUEST.bank = {
      ifsc: bankDetails.ifsc,
      account_number: bankDetails.account_number,
    }
    dispatch(DecideAPICall())
  } catch (err) {
    API_CALL_REQUEST.bank = null
    dispatch(handleBankError(err))
    dispatch(setBankLoading(false))
  }
}
const handlePanError = (err: any): AppThunk => async (dispatch) => {
  batch(() => {
    dispatch(setPanOptionDetails({ status: 'error' }))
    dispatch(
      setPanCardMessage({
        errorMessage:
          checkErrorMessage(err) || 'PAN Card verification unsuccessful',
      })
    )
  })
}

// kyc is only need when user is winning more 10k in lifetime
// kyc is required but winning is still being paid through paytm and amazon

const MakePanDetailsApiCall = (): AppThunk => async (dispatch) => {
  const mode = API_CALL_REQUEST.pan?.mode
  try {
    API_CALL_REQUEST.isPanAPIProcessing = true
    const livenessInfo =
      (API_CALL_REQUEST.pan?.documents || []).filter(
        ({ type }: any) => type === 'liveness'
      )[0]?.details || ({} as any)
    const {
      live,
      ['liveness-score']: liveness_score,
      ['to-be-reviewed']: to_be_reviewed,
    } = livenessInfo
    const result = await UploadPanDocument({
      documents: API_CALL_REQUEST.pan.documents,
    })
    API_CALL_REQUEST.pan = null
    const populatedResult = populateKycInfo(result)
    const { kyc_status, panDetail } = populatedResult
    const isVerified = panDetail?.verification_status === 'VERIFIED'
    try {
      const showKycPrompt = store.getState().hypervergeKyc.showKycPrompt
      PanLivenessEvent({
        kyc_status,
        isKycEligible: !!panDetail || showKycPrompt,
        liveness_score: `live:${live},liveness_score:${liveness_score},to_be_reviewed:${to_be_reviewed}`,
        verfication_status: 'success',
        reason: '',
      })
      PanAccountEvent({
        kyc_status,
        isKycEligible: !!panDetail || showKycPrompt,
        mode: mode,
        verfication_status: isVerified ? 'success' : 'failed',
        reason: isVerified
          ? ''
          : panDetail?.verification_status || 'verification failed',
      })
      handleCommonEventForNameMatch(populatedResult)
    } catch (err) {
      // Do nothing
    }
    batch(() => {
      dispatch(setKycDetails(result))
      if (isVerified) {
        dispatch(
          setPanCardMessage({
            successMessage: 'PAN Card successfully verified',
          })
        )
      } else {
        dispatch(
          setPanCardMessage({
            errorMessage: 'PAN Card verification unsuccessful',
          })
        )
      }
    })
  } catch (_err) {
    const err = _err as any
    const {
      kyc_status,
      panDetail,
      showKycPrompt,
    } = store.getState().hypervergeKyc
    PanLivenessEvent({
      kyc_status,
      isKycEligible: !!panDetail || showKycPrompt,
      liveness_score: '',
      verfication_status: 'failed',
      reason: err?.message || 'Something went wrong',
    })
    PanAccountEvent({
      kyc_status: kyc_status,
      isKycEligible: !!panDetail || showKycPrompt,
      mode: mode,
      verfication_status: 'failed',
      reason: err?.message || 'Something went wrong',
    })
    API_CALL_REQUEST.pan = null
    API_CALL_REQUEST.isPanAPIProcessing = false
    dispatch(handlePanError(err))
  } finally {
    API_CALL_REQUEST.pan = null
    API_CALL_REQUEST.isPanAPIProcessing = false
    dispatch(DecideAPICall())
    dispatch(setPanLoading(false))
  }
}

export const updatePanDetails = (panDetails: any): AppThunk => async (
  dispatch
) => {
  try {
    batch(() => {
      dispatch(setIsSkipApiCall(true))
      dispatch(setPanLoading(true))
      dispatch(setMessageToShow(''))
      dispatch(
        setModalMessageToShow({
          title: 'KYC Verification',
          message:
            'Your documents have been successfully uploaded. Please wait till they are verified.',
        })
      )
    })

    if (!panDetails?.documents) {
      throw new Error('Something went wrong')
    }
    API_CALL_REQUEST.pan = {
      documents: panDetails.documents,
      mode: panDetails.mode,
    }
    dispatch(DecideAPICall())
  } catch (err) {
    API_CALL_REQUEST.pan = null
    dispatch(handlePanError(err))
    dispatch(setPanLoading(false))
  }
}
