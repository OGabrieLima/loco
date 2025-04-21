import { createSlice } from '@reduxjs/toolkit'
import isEmpty from 'lodash/isEmpty'

import { getLookback } from '../../../api/apiRequest'
import { AppThunk } from '../../../app/Store'

export interface lookbackInterface {
  followers: any
  started_at: any
  hours_streamed: any
  total_views: any
  game_name: any
}
interface initialStateInterface {
  lookback: lookbackInterface | any
}
const initialState: initialStateInterface = {
  lookback: null,
}

const lookbackSlice = createSlice({
  name: 'lookback',
  initialState,
  reducers: {
    setLookback(state, action) {
      state.lookback = action.payload
    },
  },
})

export const { setLookback } = lookbackSlice.actions

export default lookbackSlice.reducer

export const fetchLookback = (): AppThunk => async (dispatch) => {
  try {
    const res = await getLookback()
    if (res?.results) {
      if (!isEmpty(res.results)) dispatch(setLookback(res.results))
    }
  } catch (err) {
    console.warn(err)
  }
}
