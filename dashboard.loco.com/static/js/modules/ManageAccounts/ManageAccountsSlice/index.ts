import { createSlice } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import {
  BankDetailsParams,
  deleteAccount,
  getAllAccounts,
  getBankDetails,
  getUpiDetails,
  postBankDetails,
  postSendOtp,
  postUpiDetails,
  postVerifyOtp,
  postWalletDetails,
} from '../../../api/apiRequest'
import { AppThunk } from '../../../app/Store'
import { setToasts } from '../../../hoc/WithToasts/withToastsSlice'
import { paths } from '../../../routers/constants'

export interface accountInterface {
  name: string
  logo_url: string
  exists: boolean
  code: number
}
export interface walletDetailsInterface {
  amount_deposited: string
  amount_withdrawn: string
  created_at: string
  id: string | number
  is_active: boolean
  is_verified: boolean
  phone: string
  updated_at: string
  user_uid: string
  withdrawal_category: string | number
}
export interface upiDetailsInterface {
  user_uid: string
  upi_id: string
}

export interface bankDetailsInterface {
  account_number: string
  address: string
  ifsc: string
  name: string
  phone: string
  user_uid?: string
}
interface initialStateInterface {
  loading: boolean
  error: any | null
  allAccounts: accountInterface[]
  otpDetails: {
    phone_number: string
    country_code: '+91'
    withdrawal_category_code: number | string
    code?: string
  }
  otpSent: boolean
  walletDetails: walletDetailsInterface | null
  upiDetails: upiDetailsInterface | null
  bankDetails: bankDetailsInterface | null
}

const initialState: initialStateInterface = {
  allAccounts: [],
  otpDetails: {
    phone_number: '',
    country_code: '+91',
    withdrawal_category_code: '',
  },
  otpSent: false,
  walletDetails: null,
  upiDetails: null,
  bankDetails: null,
  loading: false,
  error: null,
}

const manageAccountsSlice = createSlice({
  name: 'manageAccounts',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    setAllAccounts(state, action) {
      state.allAccounts = action.payload
    },
    setOtpDetails(state, action) {
      state.otpDetails = { ...state.otpDetails, ...action.payload }
    },
    setOtpSent(state, action) {
      state.otpSent = action.payload
    },
    setWalletDetails(state, action) {
      state.walletDetails = action.payload
    },
    setUpiDetails(state, action) {
      state.upiDetails = action.payload
    },
    setBankDetails(state, action) {
      state.bankDetails = action.payload
    },
  },
})
export const {
  setAllAccounts,
  setLoading,
  setError,
  setOtpDetails,
  setOtpSent,
  setWalletDetails,
  setUpiDetails,
  setBankDetails,
} = manageAccountsSlice.actions
export default manageAccountsSlice.reducer

export const fetchAllAccounts = (): AppThunk => async (dispatch) => {
  try {
    setLoading(true)
    const res = await getAllAccounts()
    if (res?.length) {
      dispatch(setAllAccounts(res))
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}

export const createSendOtp = (params: {
  phone_number: string
  country_code: string
  withdrawal_category_code: number | string
}): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await postSendOtp(params)
    if (res?.success) {
      dispatch(setOtpSent(true))
    }
  } catch (err) {
    setError(err)
  } finally {
    dispatch(setLoading(false))
  }
}

export const createVerifyOtp = (
  params: {
    phone_number: string
    country_code: string
    withdrawal_category_code: number | string
    code: string
  },
  history: any
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await postVerifyOtp(params)
    if (res?.success) {
      batch(() => {
        dispatch(
          setToasts({
            position: 'top',
            title: 'Verified',
            description: 'Verification Successfull',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        )
        dispatch(fetchAllAccounts())
      })
      history.push(paths.dashboard.manageAccounts)
    } else {
      dispatch(
        setToasts({
          position: 'top',
          title: 'Something went wrong',
          description: 'Try again later.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      )
    }
  } catch (err) {
    setError(err)
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchWalletDetails = (params: {
  code: string | number
}): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await postWalletDetails(params)
    if (res) {
      dispatch(setWalletDetails(res))
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}
export const fetchUpiDetails = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await getUpiDetails()
    if (res) {
      dispatch(setUpiDetails(res))
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}
export const createUpiDetails = (
  params: {
    upi_id: string
    re_upi_id: string
  },
  history: any
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await postUpiDetails(params)
    if (res?.success) {
      batch(() => {
        dispatch(
          setToasts({
            position: 'top',
            title: 'Account Added',
            description: 'Account Added Successfully',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        )
        dispatch(fetchAllAccounts())
      })
      history.push(paths.dashboard.manageAccounts)
    } else {
      dispatch(
        setToasts({
          position: 'top',
          title: 'Something went wrong',
          description: 'Cannot add account. Try again later.',
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
export const fetchBankDetails = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await getBankDetails()
    if (res) {
      dispatch(setBankDetails(res))
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}
export const createBankDetails = (
  params: BankDetailsParams,
  history: any
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await postBankDetails(params)
    if (res?.success) {
      batch(() => {
        dispatch(
          setToasts({
            position: 'top',
            title: 'Account Added',
            description: 'Account Added Successfully',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        )
        dispatch(fetchAllAccounts())
      })
      history.push(paths.dashboard.manageAccounts)
    } else {
      dispatch(
        setToasts({
          position: 'top',
          title: 'Something went wrong',
          description: 'Cannot add account. Try again later.',
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

// delete account

export const deleteAccountDetail = (params: {
  code: string | number
}): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await deleteAccount(params)
    if (res?.success) {
      batch(() => {
        dispatch(fetchAllAccounts())
      })
    } else {
      dispatch(
        setToasts({
          position: 'top',
          title: 'Something went wrong',
          description: 'Cannot delete account. Try again later.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      )
    }
    return res
  } catch (err) {
    return err
  } finally {
    dispatch(setLoading(false))
  }
}
