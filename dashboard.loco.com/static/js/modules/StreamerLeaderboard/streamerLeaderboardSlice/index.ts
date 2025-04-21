import { createSlice } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import {
  getStreamerLeaderboardMeRank,
  getStreamerLeaderboardRanks,
} from '../../../api/apiRequest'
import { AppThunk } from '../../../app/Store'

interface initialState {
  loading: boolean
  error: string | null
  tabValue: 10 | 20 | 30
  timelineValue: 10 | 20 | 30
  ranksResults: rankResultProps[]
  selfRank: any
  ranksLimit: number
  allRanksError: any | null
  selfRankError: any | null
}
export interface rankResultProps {
  avatar_url: string
  categories_following_count: number
  created_at: 1583333147027
  email: string
  followees_count: number
  followers_count: number
  full_name: string
  gender: number
  is_live: true
  profile_tags: any[]
  rank: number
  streams_count: number
  total_stream_views_count: number
  updated_at: number
  user_type: number
  user_uid: string
  username: string
  value: number
  views_count: number
}
const initialState: initialState = {
  loading: false,
  error: null,
  allRanksError: null,
  tabValue: 20,
  timelineValue: 10,
  ranksResults: [],
  selfRank: {},
  selfRankError: null,
  ranksLimit: 20,
}

const streamerLeaderboardSlice = createSlice({
  name: 'streamerLeaderboard',
  initialState,
  reducers: {
    setLoader(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    setTabValue(state, action) {
      state.tabValue = action.payload
    },
    setTimelineValue(state, action) {
      state.timelineValue = action.payload
    },
    setRankResults(state, action) {
      state.ranksResults = action.payload
    },
    setSelfRank(state, action) {
      state.selfRank = action.payload
    },
    setRanksLimit(state, action) {
      state.ranksLimit = action.payload
    },
    setAllRanksError(state, action) {
      state.allRanksError = action.payload
    },
    setSelfRankError(state, action) {
      state.selfRankError = action.payload
    },
  },
})

export const {
  setLoader,
  setError,
  setTabValue,
  setTimelineValue,
  setRankResults,
  setSelfRank,
  setRanksLimit,
  setAllRanksError,
  setSelfRankError,
} = streamerLeaderboardSlice.actions

export default streamerLeaderboardSlice.reducer

export const fetchStreamerLeaderboardRanks = (): AppThunk => async (
  dispatch,
  state
) => {
  const {
    streamerLeaderboard: {
      tabValue: category,
      timelineValue: type,
      ranksLimit: limit,
    },
  } = state()
  try {
    batch(() => {
      dispatch(setLoader(true))
      dispatch(setAllRanksError(null))
    })
    const response = await getStreamerLeaderboardRanks({
      type,
      category,
      limit,
    })

    if (response?.count > 0 && response?.results.length > 0) {
      batch(() => {
        dispatch(setRankResults(response.results))
        dispatch(setLoader(false))
      })
    } else {
      batch(() => {
        dispatch(setLoader(false))
        dispatch(setAllRanksError(response))
      })
    }
  } catch (err) {
    dispatch(setLoader(false))
  }
}
export const fetchStreamerLeaderboardMeRank = (): AppThunk => async (
  dispatch,
  state
) => {
  const {
    streamerLeaderboard: { tabValue: category, timelineValue: type },
  } = state()
  try {
    batch(() => {
      dispatch(setLoader(true))
      dispatch(setSelfRankError(null))
      dispatch(setSelfRank({}))
    })
    const response = await getStreamerLeaderboardMeRank({
      type,
      category,
    })

    if (response?.success && response?.results) {
      batch(() => {
        dispatch(setSelfRank(response.results))
        dispatch(setLoader(false))
      })
      return response.results
    } else {
      batch(() => {
        dispatch(setLoader(false))
        dispatch(setSelfRankError(response))
      })
    }
  } catch (err) {
    dispatch(setLoader(false))
  }
}
