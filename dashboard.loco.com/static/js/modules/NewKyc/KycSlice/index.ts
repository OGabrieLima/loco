import { createSlice } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import {
  getKycDetails,
  getKycPrompt,
  kycDetailsParamsInterface,
  postKycDetails,
} from '../../../api/apiRequest'
import { AppThunk } from '../../../app/Store'
import { setToasts } from '../../../hoc/WithToasts/withToastsSlice'
import { paths } from '../../../routers/constants'

interface requestInterface {
  created_at: string
  dob: string
  doc_type: number
  front_doc_image: string
  id_number: string
  is_verified: false
  meta: { full_name: string; fathers_name: string }
  name: string
  uid: string
  updated_at: string
  user_uid: string
  verification_check_count: number
  verification_status: number
  verizy_request_id: string
  verizy_response: string
  verizy_verdict: number
}
interface profileInterface {
  created_at: string
  id: number
  is_active: true
  is_verified: false
  updated_at: string
  user_uid: string
  verizy_request: {
    created_at: string
    dob: string
    doc_type: number
    front_doc_image: string
    id_number: string
    is_verified: true
    meta: { full_name: string; fathers_name: string }
    name: string
    uid: string
    updated_at: string
    user_uid: string
    verification_check_count: number
    verification_status: number
    verizy_request_id: string
    verizy_response: any
    verizy_verdict: number
  }
}

export interface KycDetailsInterface {
  profile: profileInterface | null
  request: requestInterface | null
}

interface initialStateInterface {
  loading: boolean
  error: any
  kycDetails: KycDetailsInterface | null
  kycPromptRequired: boolean
  kycPromptStatus: {
    status: string
    message: string
    subMessage: string
  } | null
}

const initialState: initialStateInterface = {
  loading: false,
  error: null,
  kycDetails: null,
  kycPromptRequired: false,
  kycPromptStatus: null,
}

const kycDetailsSlice = createSlice({
  name: 'kycDetails',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    setKycDetails(state, action) {
      state.kycDetails = action.payload
    },
    setKycPromptRequired(state, action) {
      state.kycPromptRequired = action.payload
    },
    setKycPromptStatus(state, action) {
      state.kycPromptStatus = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  setKycDetails,
  setKycPromptRequired,
  setKycPromptStatus,
} = kycDetailsSlice.actions
export default kycDetailsSlice.reducer

export const fetchKycDetails = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await getKycDetails()
    if (res.statusCode === 429) {
      dispatch(
        setToasts({
          position: 'top',
          title: 'Too many requests',
          description: res?.message
            ? res.message
            : 'Multiple attempts have been encountered.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      )
    }
    if (res['profile'] || res['request']) {
      dispatch(setKycDetails(res))
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}
export const createKycDetails = (
  params: kycDetailsParamsInterface,
  history: any
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await postKycDetails(params)
    if (res.statusCode === 429) {
      dispatch(
        setToasts({
          position: 'top',
          title: 'Too many requests',
          description: res?.message
            ? res.message
            : 'Multiple attempts have been encountered.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      )
    }
    if (res?.success) {
      batch(() => {
        dispatch(
          setToasts({
            position: 'top',
            title: 'Details Submitted',
            description: 'KYC verification details has been submitted.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        )
        dispatch(fetchKycDetails())
      })
      history.replace(paths.dashboard.kyc)
    } else {
      dispatch(
        setToasts({
          position: 'top',
          title: 'Something went wrong',
          description:
            'Your request cannot be processed. Please try again later.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      )
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}
enum requestStatus {
  VERIZY_REQUEST_INITIATED = 10,
  VERIZY_REQUEST_PENDING = 20,
  VERIZY_REQUEST_PROCESSED = 30,
}
export const createKycPrompt = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await getKycPrompt()
    if (res.statusCode === 429) {
      dispatch(
        setToasts({
          position: 'top',
          title: 'Too many requests',
          description: res?.message
            ? res.message
            : 'Multiple attempts have been encountered.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      )
    }
    if (res['required']) {
      dispatch(setKycPromptRequired(res?.required))
      // dispatch(setKycPromptRequired(true));
    }

    let status: any = null
    let message: string | null = null
    let subMessage: string | null = null

    if (res['request']) {
      const verification_status = res?.request?.verification_status
      // let verification_status = 10;
      const verizy_verdict = res?.request?.verizy_verdict
      if (
        verification_status === requestStatus.VERIZY_REQUEST_PROCESSED &&
        verizy_verdict === 20
      ) {
        status = 'success'
        message = null
      } else if (
        verification_status === requestStatus.VERIZY_REQUEST_PENDING ||
        verification_status === requestStatus.VERIZY_REQUEST_INITIATED
      ) {
        status = 'pending'
        message = 'KYC verification is in progress'
        subMessage = ''
      } else if (
        verification_status === requestStatus.VERIZY_REQUEST_PROCESSED
      ) {
        status = 'error'
        message = 'KYC verification failed'
        subMessage = 'Please provide your PAN details again.'
      }
    }
    // status = null;
    // message = null;
    // subMessage = null;
    dispatch(setKycPromptStatus({ status, message, subMessage }))
  } catch (err) {
    // dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}
