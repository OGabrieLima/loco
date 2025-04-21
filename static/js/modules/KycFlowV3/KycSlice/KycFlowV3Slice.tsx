import {
  addBankAccountBrazil,
  AddKycTaxIdForm,
  editBankAccountBrazil,
  EditKycTaxIdForm,
  getKycDetails_v4,
} from '@api/apiRequest'
import store, { AppThunk } from '@app/Store'
import { createSlice } from '@reduxjs/toolkit'
import { eventActions, eventConstants } from '@src/utils/Amplitude'
import { batch } from 'react-redux'

import {
  IBankFormData,
  IKycModalTypesEnum,
  IKycProfileApiResponse,
  IKycV3Status,
  IKycV3StatusMessage,
  ITaxFormData,
} from '../constants_kycv3'

const SLICE_NAME = 'kycv3Details'

interface initialStateInterface {
  modal_name: IKycModalTypesEnum | null
  loading: boolean
  showKycPrompt: boolean
  tax_residency: '' | 'IN' | 'BR' | null
  kyc_form_details: ITaxFormData | null
  documents: any | null
  bank_form_details: IBankFormData | null
  kyc_status: null | IKycV3Status
  kyc_status_message: null | IKycV3StatusMessage
  sdk_token: string | null
}

const initialState: initialStateInterface = {
  modal_name: null,
  loading: true,
  documents: null,
  showKycPrompt: false,
  tax_residency: '',
  kyc_form_details: null,
  bank_form_details: null,
  sdk_token: null,

  kyc_status: null, // 'KYC_NOT_INITIATED',
  kyc_status_message: null, //'KYC_NOT_INITIATED_MESSAGE',
}

const kycDetailsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = !!action.payload
    },
    setKycModalName(state, action) {
      state.modal_name = action.payload
      // Here, we If needed can reset the states as well
    },
    setTaxResidency(state, action) {
      state.tax_residency = action.payload
    },
    setBankFormDetails(state, action) {
      state.bank_form_details = action.payload
    },
    setKycFormDetails(state, action) {
      state.kyc_form_details = action.payload
    },
    setKycPrompt(state, action) {
      state.showKycPrompt = !!action.payload
    },
    setKycDocuments(state, action) {
      state.documents = action.payload
    },
    setKycStatusAndMessagePrompt(state, action) {
      state.kyc_status = action.payload?.kyc_status || null
      state.kyc_status_message = action.payload?.kyc_status_message || null
    },
    setSdkToken(state, action) {
      state.sdk_token = action.payload
    },
  },
})

export const {
  setLoading,
  setKycPrompt,
  setKycDocuments,
} = kycDetailsSlice.actions

export default kycDetailsSlice.reducer

// export const resetKycForm = (): AppThunk => async (dispatch) => {
//   dispatch(kycDetailsSlice.actions.setKycFormDetails(null))
//   dispatch(kycDetailsSlice.actions.setBankFormDetails(null))
//   dispatch(kycDetailsSlice.actions.setKycDocuments(null))
// }

export const setSdkToken = (
  sdk_token: IKycModalTypesEnum | null
): AppThunk => async (dispatch) => {
  dispatch(kycDetailsSlice.actions.setSdkToken(sdk_token))
}

export const setKycModalName = (
  modal_name: IKycModalTypesEnum | null
): AppThunk => async (dispatch) => {
  dispatch(kycDetailsSlice.actions.setKycModalName(modal_name))
}

export const setTaxResidency = (
  tax_residency: '' | 'IN' | 'BR' | null
): AppThunk => async (dispatch) => {
  dispatch(kycDetailsSlice.actions.setTaxResidency(tax_residency || ''))
}
export const setKycFormDetails = (
  kycFormData: ITaxFormData | null
): AppThunk => async (dispatch) => {
  dispatch(kycDetailsSlice.actions.setKycFormDetails(kycFormData || null))
}

export const setBankFormDetails = (
  bank_form_details: IBankFormData | null
): AppThunk => async (dispatch) => {
  dispatch(
    kycDetailsSlice.actions.setBankFormDetails(bank_form_details || null)
  )
}

export const fetchKycDetailsV4 = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    await makeKycProfileApiCall({ dispatch })
  } catch (err) {
    console.error(`Fetch profile failed ~ err:`, err)
    dispatch(kycDetailsSlice.actions.setKycStatusAndMessagePrompt({})) // setting values to null
  } finally {
    dispatch(setLoading(false))
  }
}

export const handleKycFormSubmitFlow = (
  params: { isEdit: boolean; data: ITaxFormData | null },
  cb?: () => void
): AppThunk => async (dispatch) => {
  const me = store.getState().login?.me
  const previousVisitStore = store.getState().app?.previousVisit
  try {
    if (!params.data) {
      throw new Error('params.data is missing')
    }
    if (params.isEdit) {
      await EditKycTaxIdForm(params.data)
    } else {
      await AddKycTaxIdForm(params.data)
    }

    dispatch(setKycFormDetails(params.data))

    //   // Now move to next screen in Case of Success
    dispatch(setKycModalName(IKycModalTypesEnum.KYC_IDWALL_COMPONENT)) // id wall component
  } catch (e) {
    const eventProperties = {
      source_name: previousVisitStore,
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_full_name: me?.full_name,
      streamer_type: me?.user_type,
      // kyc_flow/bank/document_upload
      origin: 'kyc_flow',
      // success/failed/error/pending
      modal_type: 'error',
    }
    eventActions.sendAmplitudeData(
      eventConstants.kyc_toast_modal_viewed,
      eventProperties
    )
    dispatch(setKycModalName(IKycModalTypesEnum.TOAST_ERROR))
  } finally {
    typeof cb === 'function' && cb()
  }
}

export const handleBankFormSubmitFlow = (
  params: { isEdit: boolean; data: IBankFormData | null },
  cb?: () => void
): AppThunk => async (dispatch) => {
  const me = store.getState().login?.me
  const previousVisitStore = store.getState().app?.previousVisit
  try {
    if (!params.data) {
      throw new Error('params.data is missing')
    }
    if (params.isEdit) {
      await editBankAccountBrazil({
        ...params.data,
        description: 'Editing payee',
      })
    } else {
      await addBankAccountBrazil({
        ...params.data,
        description: 'Adding payee',
      })
    }

    const eventProperties = {
      source_name: previousVisitStore,
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_full_name: me?.full_name,
      streamer_type: me?.user_type,
      // success/failed/not_initiated
      success_status: 'success',

      failure_reason: '',
      // add/edit/save
      trigger_point: 'save',
      // new/edit
      trigger_mode: params.isEdit ? 'edit' : 'new',
    }
    eventActions.sendAmplitudeData(
      eventConstants.kyc_bank_details,
      eventProperties
    )
    const kycProfileResult = await makeKycProfileApiCall({ dispatch })

    const eventProperties2 = {
      source_name: previousVisitStore,
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_full_name: me?.full_name,
      streamer_type: me?.user_type,
      // kyc_flow/bank/document_upload
      origin: 'bank',
      // success/failed/error/pending
      modal_type:
        kycProfileResult?.bank_profile?.approval_status === '1'
          ? 'success'
          : 'pending',
    }
    eventActions.sendAmplitudeData(
      eventConstants.kyc_toast_modal_viewed,
      eventProperties2
    )

    // TaxId Upload Success
    if (kycProfileResult?.bank_profile?.approval_status === '1') {
      // Move to bank screen
      dispatch(setKycModalName(IKycModalTypesEnum.TOAST_BANK_SUCCESS))
    } else {
      dispatch(setKycModalName(IKycModalTypesEnum.TOAST_PENDING))
    }
  } catch (e) {
    const eventProperties1 = {
      source_name: previousVisitStore,
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_full_name: me?.full_name,
      streamer_type: me?.user_type,
      // kyc_flow/bank/document_upload
      origin: 'bank',
      // success/failed/error/pending
      modal_type: 'error',
    }
    eventActions.sendAmplitudeData(
      eventConstants.kyc_toast_modal_viewed,
      eventProperties1
    )
    dispatch(setKycModalName(IKycModalTypesEnum.TOAST_ERROR))
    const eventProperties = {
      source_name: previousVisitStore,
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_full_name: me?.full_name,
      streamer_type: me?.user_type,

      // success/failed/not_initiated
      success_status: 'failed',

      // @ts-ignore
      failure_reason: '' + (e?.message || 'failed'),
      // add/edit/save
      trigger_point: 'save',
      // new/edit
      trigger_mode: params.isEdit ? 'edit' : 'new',
    }
    eventActions.sendAmplitudeData(
      eventConstants.kyc_bank_details,
      eventProperties
    )
  } finally {
    typeof cb === 'function' && cb()
  }
}

export const makeKycProfileApiCall = async ({
  dispatch,
}: {
  dispatch: any
}) => {
  await new Promise((res) => setTimeout(res, 250)) // 250ms delay
  const res = await getKycDetails_v4()

  const {
    kyc_status,
    kyc_status_message,
    kyc_profile_details,
    documents,
    bank_profile,
  } = ((res || {}) as unknown) as IKycProfileApiResponse

  const currentTaxResidency = kyc_profile_details?.country || ''

  batch(() => {
    // other v4 kyc profile changes
    dispatch(
      setTaxResidency(
        currentTaxResidency === 'BR'
          ? 'BR'
          : currentTaxResidency === 'IN'
          ? 'IN'
          : null
      )
    )
    dispatch(kycDetailsSlice.actions.setKycFormDetails(kyc_profile_details))
    dispatch(kycDetailsSlice.actions.setKycDocuments(documents || null))
    dispatch(kycDetailsSlice.actions.setBankFormDetails(bank_profile || null))
    dispatch(
      kycDetailsSlice.actions.setKycStatusAndMessagePrompt({
        kyc_status: kyc_status,
        kyc_status_message: kyc_status_message,
      })
    )
  })
  return {
    kyc_status,
    kyc_status_message,
    kyc_profile_details,
    documents,
    bank_profile,
  }
}
