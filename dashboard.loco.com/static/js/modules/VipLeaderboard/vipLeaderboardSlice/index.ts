import { getVipLeaderboardRanks } from '@api/apiRequest'
import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { batch } from 'react-redux'

import { AppThunk } from '../../../app/Store'

const currentTime = dayjs(new Date())

const initialState = {
  loading: false,
  rankRowsLoading: false,
  leaderboardData: {
    count: 0,
    rankingList: null,
    endTime: 0,
    pageCount: 10,
    offset: null,
  },
  historyLeaderboardData: {
    count: 0,
    rankingList: null,
    endTime: 0,
    pageCount: 10,
    offset: null,
  },
  leaderboardOffset: 0,
  selectedDay: {
    year: currentTime.year(),
    month: currentTime.month() + 1,
    day: currentTime.date(),
  },
}

const vipLeaderboardSlice = createSlice({
  name: 'vipLeaderboard',
  initialState,
  reducers: {
    setLoader(state, action) {
      state.loading = action.payload
    },
    setRankRowsLoader(state, action) {
      state.rankRowsLoading = action.payload
    },
    setLeaderboardData(state, action) {
      state.leaderboardData = action.payload
    },
    setHistoryLeaderboardData(state, action) {
      state.historyLeaderboardData = action.payload
    },
    setSelectedDay(state, action) {
      state.selectedDay = action.payload
    },
    setLeaderboardOffset(state, action) {
      state.leaderboardOffset = action.payload
    },
  },
})

export const {
  setLoader,
  setRankRowsLoader,
  setLeaderboardData,
  setSelectedDay,
  setHistoryLeaderboardData,
  setLeaderboardOffset,
} = vipLeaderboardSlice.actions

export default vipLeaderboardSlice.reducer

export const fetchTopRanks = (): AppThunk => async (dispatch, state) => {
  const { leaderboardData }: { leaderboardData: any } = state().vipLeaderboard
  const { me } = state().login
  try {
    dispatch(setLoader(true))

    const response = await getVipLeaderboardRanks({
      streamer_uid: me?.user_uid ?? '',
      board_type: 10,
      leaderboard_offset: 0,
      limit: leaderboardData?.pageCount,
      // offset: 0,
    })

    const newData = {
      ...leaderboardData,
      count: response?.count,
      rankingList: response?.results,
      endTime: response?.info?.end_time,
      offset: response?.offset,
    }
    batch(() => {
      dispatch(setLeaderboardData(newData))
      dispatch(setLoader(false))
    })
  } catch (err) {
    dispatch(setLoader(false))
  }
}

export const fetchHistoryTopRanks = (): AppThunk => async (dispatch, state) => {
  const {
    historyLeaderboardData,
    leaderboardOffset,
  }: {
    leaderboardData: any
    historyLeaderboardData: any
    leaderboardOffset: number
  } = state().vipLeaderboard
  const { me } = state().login
  try {
    dispatch(setLoader(true))
    const response = await getVipLeaderboardRanks({
      streamer_uid: me?.user_uid ?? '',
      board_type: 10,
      leaderboard_offset: leaderboardOffset,
      limit: 10,
      // offset: 0,
    })

    const newData = {
      ...historyLeaderboardData,
      count: response?.count ?? 0,
      rankingList: response?.results,
      offset: response?.offset ?? 0,
    }
    batch(() => {
      dispatch(setHistoryLeaderboardData(newData))
      dispatch(setLoader(false))
    })
  } catch (err) {
    dispatch(setLoader(false))
  }
}

export const loadMoreLeaderboardData = (dataType: string): AppThunk => async (
  dispatch,
  state
) => {
  const {
    historyLeaderboardData,
    leaderboardData,
    leaderboardOffset,
  }: {
    leaderboardData: any
    historyLeaderboardData: any
    leaderboardOffset: number
  } = state().vipLeaderboard

  const data = dataType === 'current' ? leaderboardData : historyLeaderboardData

  const { me } = state().login
  try {
    dispatch(setRankRowsLoader(true))

    const response = await getVipLeaderboardRanks({
      streamer_uid: me?.user_uid ?? '',
      board_type: 10,
      leaderboard_offset: leaderboardOffset,
      limit: data?.pageCount + 10,
    })

    const newData = {
      ...data,
      rankingList: [...response?.results],
      pageCount: data?.pageCount + 10,
      offset: response?.offset,
      count: response.count,
    }
    batch(() => {
      dataType === 'current'
        ? dispatch(setLeaderboardData(newData))
        : dispatch(setHistoryLeaderboardData(newData))
      dispatch(setRankRowsLoader(false))
    })
  } catch (err) {
    dispatch(setRankRowsLoader(false))
  }
}
