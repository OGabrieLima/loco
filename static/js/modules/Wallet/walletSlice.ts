import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { batch } from 'react-redux'

import {
  beanWalletDetails,
  convertBeansToDiamond,
  convertBeansToMoney,
  getWalletCurrencyDetails,
  getWalletDetails,
  newWithdrawBeansDetails,
  validateConvertBeans,
  validateWithdrawBeans,
  walletTranscationsLog,
  withdrawBeansDetails,
  withdrawBeansRequest,
} from '../../api/apiRequest'
import { AppThunk } from '../../app/Store'
import { setToasts } from '../../hoc/WithToasts/withToastsSlice'
import { fetchGoldAndBeansAndGifts } from '../Analytics/analyticsSlice'

// interface beanWalletRes {
//   balance: number
//   beans_to_diamond_detail: {
//     conversion_rate: { left: number; right: number }
//     status_message: string
//   }
//   beans_to_inr_detail: {
//     conversion_rate: { left: number; right: number }
//     status_message: string
//   }
//   // beans_about_to_expire: {
//   //   beans: number
//   //   expire_date: string
//   // }
// }
interface beansRateSheetRes {
  currency_list: {
    conversion_rate: {
      left: number
      right: number
    }
    symbol: string
  }[]
}

export interface gift {
  amount: number
  currency_type: number
  icon: string
  message: string
  timestamp: number
  transaction_status: number
  transaction_type: number
  transaction_uid: string
  user_uid: string
}
export interface withdrawalSuccessInterface {
  amount_deposited: string
  amount_withdrawn: string
  content_type: number
  created_at: string
  komparify_response: string
  loco_cut_amount: string
  meta: string
  object_id: number
  profile_details: {
    category_name: string
    phone?: string
    account_number?: string
    upi_id?: string
  }
  request_id: string
  status_check_due_at: null
  status_checks_count: number
  tds_amount: string
  transaction_scheduled_at: string
  transaction_state: number
  txn_uid: string
  updated_at: string
  user_uid: string
  withdrawal_category: number
}
const initialState: {
  loading: boolean
  transcationLoading: boolean
  conversionLoading: boolean
  error: any
  beanWallet: null | {
    balance: number
    beans_to_currency_detail: {
      conversion_rate: {
        left: number
        right: number
      }
      currency_symbol: string
      status_message: string
    }
    beans_about_to_expire?: {
      beans: number
      expire_date: string
    }
    total_amount?: number
    tds?: number
    redeemable_amount?: number
    wallet_type?: number
    minimum_redeemable_beans: number
  }
  next: string | null
  transcationLogError: any
  rateList: beansRateSheetRes | null
  giftLogs: gift[]
  transcationLog: any[]
  transcationLogNext: string | null
  //transactionBeans
  beansTransactionValue: string | number | null
  //conversion
  conversion: {
    diamonds?: string | number | null
    deductibleBeans?: string | number | null
  } | null
  conversionError: string | null
  conversionSuccess: any
  //withdrawal
  withdrawal: {
    amount_withdrawn?: number | string | undefined
    tds?: number | string | undefined
    amount_deposited?: number | string | undefined
    deducted_beans?: number[] | undefined
    beans_amount: number | undefined
    transaction_fee: number | undefined
    beans_to_currency: number | undefined
  } | null
  withdrawalError: string | null
  withdrawalSuccess: withdrawalSuccessInterface | null
  //wallet_details
  walletDetails:
    | {
        exists: boolean
        is_eligible: boolean
        logo_url: string
        name: string
        reason: string | null
        code: string | number | null
        user_details: { phone: string | null; account_number: string | null }
      }[]
    | null
  //amount_details
  amountDetails: {
    amount_withdrawn?: number | string | undefined
    tds?: number | string | undefined
    amount_deposited?: number | string | undefined
    deducted_beans: number[] | undefined
    beans_amount: number | undefined
    transaction_fee: number | undefined
    beans_to_currency: number | undefined
  } | null
  //conversionToMoney
  conversionDetails: {
    amount_deposited: number
    amount_withdrawn: number
    expected_date: string
    loco_cut_amount: number
    profile_details: {
      account_number: string
      category_name: string
    }
    beans_withdrawn: number
    success: boolean
    tds_amount: number
    txn_uid: string
  } | null
} = {
  conversionLoading: false,
  loading: false,
  transcationLoading: false,
  error: null,
  beanWallet: null,
  rateList: null,
  next: '0',
  giftLogs: [],
  transcationLogError: null,
  transcationLog: [],
  transcationLogNext: null,
  //transactionBeans
  beansTransactionValue: null,
  //conversion
  conversion: null,
  conversionError: null,
  conversionSuccess: null,
  //withdrawal
  withdrawal: null,
  withdrawalError: null,
  withdrawalSuccess: null,
  //wallet_details
  walletDetails: null,
  //amount_details
  amountDetails: null,
  conversionDetails: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConversionLoading(state, action) {
      state.conversionLoading = action.payload
    },
    setBeanWalletStart(state) {
      state.loading = true
      state.error = null
    },
    setBeanWalletEnd(state, action) {
      state.error = action.payload
      state.loading = false
    },
    setBeanWalletSuccess(state, action) {
      state.beanWallet = action.payload
      state.loading = false
      state.error = null
    },
    setBeanWalletLoader(state, action) {
      state.loading = action.payload
    },
    setRateList(state, action) {
      state.rateList = action.payload || null
    },
    // transcation log
    setTranscationLogStart(state) {
      state.transcationLoading = true
      state.error = null
    },
    setTranscationLogEnd(state, action) {
      state.error = action.payload
      state.transcationLoading = false
    },
    setTranscationSuccess(state, action) {
      let updateGiftLogs = null
      if (state.next) {
        updateGiftLogs = _.unionWith(state.giftLogs, action.payload, _.isEqual)
      } else {
        updateGiftLogs = action.payload
      }
      state.transcationLoading = false
      state.giftLogs = updateGiftLogs
      state.loading = false
      state.error = null
    },
    setTranscationLoader(state, action) {
      state.loading = action.payload
    },
    setNext(state, action) {
      state.next = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    //transactionBeans
    setBeansTransactionValue(state, action) {
      state.beansTransactionValue = action.payload
    },
    //conversion
    setConversionError(state, action) {
      state.conversionError = action.payload
    },
    setConversion(state, action) {
      state.conversion = action.payload
    },
    setConsversionSuccess(state, action) {
      state.conversionSuccess = action.payload
    },
    //withdrawal
    setWithdrawal(state, action) {
      state.withdrawal = action.payload
    },
    setWithdrawalError(state, action) {
      state.withdrawalError = action.payload
    },
    setWithdrawalSuccess(state, action) {
      state.withdrawalSuccess = action.payload
    },
    //wallet_details
    setWalletDetails(state, action) {
      state.walletDetails = action.payload
    },
    //amount_details
    setAmountDetails(state, action) {
      state.amountDetails = action.payload
    },
    //transactionLog
    setBeansTransactionLog(state, action) {
      let updateGiftLogs = null
      if (state.next) {
        updateGiftLogs = _.unionWith(
          state.transcationLog,
          action.payload,
          _.isEqual
        )
      } else {
        updateGiftLogs = action.payload
      }

      state.transcationLog = updateGiftLogs
      state.loading = false
      state.error = null
    },
    setTranscationLogNext(state, action) {
      state.transcationLogNext = action.payload
    },
    setConversionDetails(state, action) {
      state.conversionDetails = action.payload
    },
    resetTransactionData: (state, action) => {
      if (action.payload === 10) {
        state.giftLogs = []
        state.next = ''
      } else if (action.payload === 20) {
        state.transcationLog = []
        state.transcationLogNext = ''
      }
    },
  },
})

export const {
  setBeanWalletStart,
  setBeanWalletEnd,
  setBeanWalletSuccess,
  setTranscationLogStart,
  setTranscationLogEnd,
  setTranscationSuccess,
  setNext,
  setLoading,
  setError,
  setRateList,
  //beans Transaction
  setBeansTransactionValue,
  //conversion
  setConversionError,
  setConversion,
  setConsversionSuccess,
  //withdrawal
  setWithdrawal,
  setWithdrawalError,
  setWithdrawalSuccess,
  //wallet_details
  setWalletDetails,
  //amount_details
  setAmountDetails,
  setTranscationLogNext,
  setBeansTransactionLog,
  setConversionDetails,
  setConversionLoading,
  resetTransactionData,
} = walletSlice.actions

export default walletSlice.reducer

export const fetchBeanWallet = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setBeanWalletStart())
    const [res, walletDetails, rateListSheet] = await Promise.all([
      beanWalletDetails(),
      getWalletDetails(),
      getWalletCurrencyDetails(),
    ])

    dispatch(
      setRateList((rateListSheet?.currency_list && rateListSheet) || null)
    )

    // @ts-ignore
    if (res.beans_to_currency_detail && walletDetails?.streamer_wallet) {
      const payload = {
        balance: walletDetails?.streamer_wallet?.beans,
        beans_to_currency_detail: res?.beans_to_currency_detail,
        beans_about_to_expire:
          walletDetails?.streamer_wallet?.beans_about_to_expire
            ?.beans_about_to_expire,
        total_amount: walletDetails?.streamer_wallet?.beans,
        redeemable_amount: walletDetails.streamer_wallet.redeemable_beans,
        wallet_type: walletDetails.streamer_wallet.wallet_type,
        //@ts-ignore
        minimum_redeemable_beans: res.minimum_redeemable_beans,
      }

      dispatch(setBeanWalletSuccess(payload))
      dispatch(setBeanWalletEnd(res))
      //@ts-ignore
    } else if (res?.statusCode) {
      dispatch(setBeanWalletEnd(res))
    } else {
      // @upneet: Must need to send error, if no data found
    }
  } catch (err) {
    dispatch(setBeanWalletEnd(err))
  }
}

export const fetchTranscationLogs = (
  limit: number,
  offset: string,
  transaction_type: number
): AppThunk => async (dispatch) => {
  try {
    dispatch(setTranscationLogStart())
    const res = await walletTranscationsLog({
      limit: limit,
      offset: offset,
      transaction_type: transaction_type,
    })
    //@ts-ignore
    if (res?.results?.length) {
      if (transaction_type === 10) {
        dispatch(setTranscationLogNext(''))
        if (!offset) {
          dispatch(setTranscationSuccess(res.results as gift[]))
        } else {
          dispatch(setTranscationSuccess([...res.results] as gift[]))
        }
        dispatch(setNext(res.next))
      }
      if (transaction_type === 20) {
        dispatch(setNext(''))
        if (!offset) {
          dispatch(setBeansTransactionLog(res.results as gift[]))
        } else {
          dispatch(setBeansTransactionLog([...res.results] as gift[]))
        }
        dispatch(setTranscationLogNext(res.next))
      }
      dispatch(setTranscationLogEnd(null))
      //@ts-ignore
    } else if (res?.results?.length === 0) {
      if (transaction_type === 10) {
        dispatch(setTranscationSuccess([]))
      } else {
        dispatch(setBeansTransactionLog([]))
      }
      dispatch(setNext(''))
      dispatch(setTranscationLogNext(''))
      dispatch(setTranscationLogEnd(null))
      //@ts-ignore
    } else if (res?.statusCode) {
      dispatch(setTranscationLogEnd(res))
    } else {
      dispatch(setTranscationLogEnd(null))
    }
  } catch (err) {
    dispatch(setTranscationLogEnd(err))
  }
}

export const fetchValidateConvertBeansToDiamonds = (
  beans: string | number
): AppThunk => async (dispatch) => {
  try {
    batch(() => {
      dispatch(setLoading(true))
      dispatch(setConversionError(null))
      dispatch(setConversion(null))
    })
    const res = await validateConvertBeans({ beans })
    if (res?.statusCode) {
      dispatch(setConversionError(res?.message))
      dispatch(setConversion(null))
    } else {
      dispatch(setConversion(res))
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}
export const fetchConvertBeansToMoney = (
  code: number,
  existingBeans: number,
  onSuccess: () => void,
  onError?: (errMessage: string) => void
): AppThunk => async (dispatch) => {
  dispatch(setConversionLoading(true))
  try {
    const res = await convertBeansToMoney(code)

    if (!res.error_code) {
      dispatch(setConversionDetails({ ...res, beans_withdrawn: existingBeans }))
      dispatch(fetchBeanWallet())
      onSuccess()
      return
    }
    onError?.(res.message)
  } catch (err) {
    const errMessage = (err as any)?.message || 'Something went wrong'
    dispatch(setError(err))
    onError?.(errMessage)
  } finally {
    dispatch(setConversionLoading(false))
  }
}
export const fetchConvertBeansToDiamond = (
  beans: string | number
): AppThunk => async (dispatch) => {
  try {
    batch(() => {
      dispatch(setLoading(true))
      dispatch(setConversionError(null))
      dispatch(setConsversionSuccess(null))
    })
    const res = await convertBeansToDiamond({ beans })
    if (res?.statusCode) {
      batch(() => {
        dispatch(setConversionError(res?.message))
        dispatch(setConsversionSuccess(null))
      })
    } else {
      if (res['30']) {
        dispatch(setConsversionSuccess(res))
      }
      batch(() => {
        dispatch(fetchBeanWallet())
        dispatch(fetchGoldAndBeansAndGifts())
      })
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}
export const fetchValidateWithdrawBeansToMoney = (
  beans: string | number
): AppThunk => async (dispatch) => {
  try {
    batch(() => {
      dispatch(setLoading(true))
      dispatch(setWithdrawalError(null))
      dispatch(setWithdrawal(null))
    })
    const res = await validateWithdrawBeans({ beans })
    if (res?.statusCode) {
      dispatch(setWithdrawalError(res?.message))
      dispatch(setWithdrawal(null))
    } else {
      dispatch(setWithdrawal(res))
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}
export const fetchNewWithdrawBeansDetails = (): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    batch(() => {
      dispatch(setLoading(true))
      dispatch(setWalletDetails(null))
      dispatch(setAmountDetails(null))
    })
    const res = await newWithdrawBeansDetails()

    if (res) {
      if (res['wallet_details']) {
        dispatch(setWalletDetails(res.wallet_details))
      }
      if (res['amount_details']) {
        dispatch(setAmountDetails(res.amount_details))
      }
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchWithdrawBeansDetails = (): AppThunk => async (
  dispatch,
  state
) => {
  const {
    wallet: { beansTransactionValue: beans },
  } = state()
  try {
    batch(() => {
      dispatch(setLoading(true))
      dispatch(setWithdrawalError(null))
      dispatch(setAmountDetails(null))
      dispatch(setWalletDetails(null))
    })
    if (beans) {
      const res = await withdrawBeansDetails({ beans })
      if (res?.statusCode) {
        // dispatch(setWithdrawalError(res?.message));
        dispatch(setWithdrawal(null))
      } else {
        if (res['wallet_details']) {
          dispatch(setWalletDetails(res.wallet_details))
        }
        if (res['amount_details']) {
          dispatch(setAmountDetails(res.amount_details))
        }
      }
      return res
    }
  } catch (err) {
    dispatch(setError(err))
    return err
  } finally {
    dispatch(setLoading(false))
  }
}

export const createWithdrawBeansRequest = ({
  code,
}: {
  code: string | number
}): AppThunk => async (dispatch, state) => {
  const {
    wallet: { beansTransactionValue: beans },
  } = state()
  try {
    dispatch(setLoading(true))
    if (beans && code) {
      const res = await withdrawBeansRequest({ beans: +beans, code: +code })
      if (res?.txn_uid) {
        batch(() => {
          dispatch(setWithdrawalSuccess(res))
          dispatch(fetchBeanWallet())
          dispatch(fetchGoldAndBeansAndGifts())
        })
      } else {
        dispatch(
          setToasts({
            position: 'top',
            title: 'Something went wrong',
            description: 'Cannot fetch transaction details. Try again later.',
            status: 'error',
            duration: 2000,
            isClosable: true,
          })
        )
      }
    }
  } catch (err) {
    dispatch(setWithdrawalError(err))
  } finally {
    dispatch(setLoading(false))
  }
}
