import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@src/app/RootReducer'

import {
  fetchAffiliateData,
  fetchHasAcceptedTermsData,
  updateUserTermsForMonetisation,
} from '../../api/apiRequest'
import { AffiliateData, AffiliateTask, MonetisationState } from './types'

// Initial state
export const initialState: MonetisationState = {
  loading: true, // default must be true
  affiliateLoading: true,
  error: null,
  affiliate: null,
  has_user_accepted_monetization_tnc: false,
  tier: 'Unknown',
}

const monetisationSlice = createSlice({
  name: 'monetisation',
  initialState,
  reducers: {
    setTier(state, action: PayloadAction<MonetisationState['tier']>) {
      state.tier = action.payload
    },
    setAcceptedTerms(state, action: PayloadAction<boolean>) {
      state.has_user_accepted_monetization_tnc = action.payload
    },
    setloading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    updateTask(
      state,
      action: PayloadAction<{
        taskId: AffiliateTask['id']
        updates: Partial<AffiliateTask>
      }>
    ) {
      const { taskId, updates } = action.payload
      const currentData = state.affiliate
      if (!currentData) return
      const ALL_TASKS_ = currentData?.data?.tasks
      const ALL_TASKS = Array.isArray(ALL_TASKS_) ? ALL_TASKS_ : []

      if (currentData && currentData.data && ALL_TASKS.length) {
        const NEW_TASKS = []
        for (const item of ALL_TASKS) {
          const isIdSame = item.id === taskId
          if (isIdSame) {
            NEW_TASKS.push(
              Object.assign({}, item, updates, {
                id: item.id, // can not change ID
              })
            )
          } else {
            NEW_TASKS.push(item)
          }
        }
        currentData.data.tasks = NEW_TASKS
      }
      state.affiliate = currentData
    },
    resetAffiliateState(state) {
      state.affiliate = null
      //add more monetisation state variables
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAffiliateInfo.pending, (state) => {
        state.affiliateLoading = true
        state.error = null
      })
      .addCase(
        fetchAffiliateInfo.fulfilled,
        (state, action: PayloadAction<{ data: AffiliateData }>) => {
          state.affiliateLoading = false
          state.affiliate = action.payload
        }
      )
      .addCase(fetchAffiliateInfo.rejected, (state, action) => {
        state.affiliateLoading = false
        state.error =
          action.error.message || 'Failed to fetch monetisation data.'
      })
      .addCase(fetchHasUserAcceptedMonetizationTnc.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchHasUserAcceptedMonetizationTnc.fulfilled,
        (
          state,
          action: PayloadAction<{
            has_user_accepted_monetization_tnc: boolean
            tier: MonetisationState['tier']
          }>
        ) => {
          state.has_user_accepted_monetization_tnc =
            action.payload.has_user_accepted_monetization_tnc
          state.tier = action.payload.tier
          state.loading = false
        }
      )
      .addCase(
        fetchHasUserAcceptedMonetizationTnc.rejected,
        (state, action) => {
          state.loading = false
          state.error =
            action.error.message || 'Failed to fetch TnC acceptance data.'
        }
      )
      .addCase(acceptUserTermsForMonetisation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(acceptUserTermsForMonetisation.fulfilled, (state, action) => {
        state.loading = false
        state.has_user_accepted_monetization_tnc = action.payload.success
        state.tier = action.payload.tier
        // state.tier= action.payload
      })
  },
})

export const fetchHasUserAcceptedMonetizationTnc = createAsyncThunk(
  'monetisation/fetchHasUserAcceptedMonetizationTnc',
  async () => {
    const response = await fetchHasAcceptedTermsData()
    return response
  }
)

// Async thunk for fetchAffiliateData
export const fetchAffiliateInfo = createAsyncThunk(
  'monetisation/fetchAffiliateInfo',
  async () => {
    const response = await fetchAffiliateData()
    return response
  }
)

export const acceptUserTermsForMonetisation = createAsyncThunk(
  'monetisation/acceptUserTermsForMonetisation',
  async () => {
    const response = await updateUserTermsForMonetisation()
    return response
  }
)

export const {
  updateTask: updateAffiliateTask,
  resetAffiliateState,
  setError,
} = monetisationSlice.actions

export default monetisationSlice.reducer
