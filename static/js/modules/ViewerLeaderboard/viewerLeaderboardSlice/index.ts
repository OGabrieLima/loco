import {
  getHistoryDetails,
  getViewerLeaderboardRanks,
} from '@api/viewerLeaderboard/api'
import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { batch } from 'react-redux'

import { AppThunk } from './../../../app/Store'
import { selectedValueType, StateDataType } from './../utils/types'

const currentTime = dayjs(new Date())

const initialState = {
  loading: false,
  rankRowsLoading: false,
  tabValue: 'daily',
  leaderboardData: {
    daily: {
      count: 0,
      rankingList: null,
      endTime: 0,
      pageCount: 10,
      offset: null,
    },
    weekly: {
      count: 0,
      rankingList: null,
      endTime: 0,
      pageCount: 10,
      offset: null,
    },
    monthly: {
      count: 0,
      rankingList: null,
      endTime: 0,
      pageCount: 10,
      offset: null,
    },
  },
  historyLeaderboardData: {
    daily: {
      count: 0,
      rankingList: null,
      endTime: 0,
      pageCount: 10,
      offset: null,
    },
    weekly: {
      count: 0,
      rankingList: null,
      endTime: 0,
      pageCount: 10,
      offset: null,
    },
    monthly: {
      count: 0,
      rankingList: null,
      endTime: 0,
      pageCount: 10,
      offset: null,
    },
  },
  historyDateData: [],
  selectedValue: {
    daily: '',
    weekly: '',
    monthly: '',
  },
  todayValue: {
    daily: '',
    weekly: '',
    monthly: '',
  },
  leaderboardOffset: 0,
  selectedDay: {
    year: currentTime.year(),
    month: currentTime.month() + 1,
    day: currentTime.date(),
  },
}

const viewerLeaderboardSlice = createSlice({
  name: 'viewerLeaderboard',
  initialState,
  reducers: {
    setLoader(state, action) {
      state.loading = action.payload
    },
    setRankRowsLoader(state, action) {
      state.rankRowsLoading = action.payload
    },
    setTabValue(state, action) {
      state.tabValue = action.payload
    },
    setLeaderboardData(state, action) {
      state.leaderboardData = action.payload
    },
    setHistoryLeaderboardData(state, action) {
      state.historyLeaderboardData = action.payload
    },
    setHistoryDateData(state, action) {
      state.historyDateData = action.payload
    },
    setSelectedDay(state, action) {
      state.selectedDay = action.payload
    },
    setTodayValue(state, action) {
      state.todayValue = action.payload
    },
    setSelectedValue(state, action) {
      state.selectedValue = action.payload
    },
    setLeaderboardOffset(state, action) {
      state.leaderboardOffset = action.payload
    },
  },
})

export const {
  setLoader,
  setRankRowsLoader,
  setTabValue,
  setLeaderboardData,
  setHistoryDateData,
  setSelectedDay,
  setTodayValue,
  setSelectedValue,
  setHistoryLeaderboardData,
  setLeaderboardOffset,
} = viewerLeaderboardSlice.actions

export default viewerLeaderboardSlice.reducer

export const fetchTopRanks = (): AppThunk => async (dispatch, state) => {
  const {
    leaderboardData,
  }: { leaderboardData: StateDataType } = state().viewerLeaderboard
  const { me } = state().login
  try {
    dispatch(setLoader(true))

    const [responseDaily, responseWeekly, responseMonthly] = await Promise.all([
      getViewerLeaderboardRanks({
        streamer_uid: me?.user_uid ?? '',
        board_type: 10,
        leaderboard_offset: 0,
        limit: leaderboardData?.daily?.pageCount,
        offset: 0,
      }),
      getViewerLeaderboardRanks({
        streamer_uid: me?.user_uid ?? '',
        board_type: 20,
        leaderboard_offset: 0,
        limit: leaderboardData?.weekly?.pageCount,
        offset: 0,
      }),
      getViewerLeaderboardRanks({
        streamer_uid: me?.user_uid ?? '',
        board_type: 30,
        leaderboard_offset: 0,
        limit: leaderboardData?.monthly?.pageCount,
        offset: 0,
      }),
    ])
    const newData = {
      daily: {
        ...leaderboardData?.daily,
        count: responseDaily?.count,
        rankingList: responseDaily?.results,
        endTime: responseDaily?.info?.end_time,
        offset: responseDaily?.offset,
      },
      weekly: {
        ...leaderboardData?.weekly,
        count: responseWeekly?.count,
        rankingList: responseWeekly?.results,
        endTime: responseWeekly?.info?.end_time,
        offset: responseWeekly?.offset,
      },
      monthly: {
        ...leaderboardData?.monthly,
        count: responseMonthly?.count,
        rankingList: responseMonthly?.results,
        endTime: responseMonthly?.info?.end_time,
        offset: responseMonthly?.offset,
      },
    }
    batch(() => {
      dispatch(setLeaderboardData(newData))
      dispatch(setLoader(false))
    })
  } catch (err) {
    dispatch(setLoader(false))
  }
}

const tabValueMapperType: { [id: string]: number } = {
  daily: 10,
  weekly: 20,
  monthly: 30,
}

export const fetchHistory = (): AppThunk => async (dispatch, state) => {
  const {
    tabValue,
    todayValue,
    selectedValue,
  }: {
    tabValue: string
    todayValue: selectedValueType
    selectedValue: selectedValueType
  } = state().viewerLeaderboard
  try {
    dispatch(setLoader(true))
    const response = await getHistoryDetails({
      board_type: tabValueMapperType[tabValue],
    })
    const newTodayValue = {
      ...todayValue,
      [tabValue]: response.results[0].leaderboard_name,
    }
    if (selectedValue[tabValue] === '') {
      const newSelectedValue = {
        ...selectedValue,
        [tabValue]: response.results[0].leaderboard_name,
      }
      dispatch(setSelectedValue(newSelectedValue))
    }
    batch(() => {
      dispatch(setTodayValue(newTodayValue))
      dispatch(setHistoryDateData(response.results))
      dispatch(setLoader(false))
    })
  } catch (err) {
    dispatch(setLoader(false))
  }
}

export const fetchHistoryTopRanks = (): AppThunk => async (dispatch, state) => {
  const {
    historyLeaderboardData,
    tabValue,
    todayValue,
    selectedValue,
    leaderboardOffset,
  }: {
    leaderboardData: StateDataType
    historyLeaderboardData: StateDataType
    tabValue: string
    todayValue: selectedValueType
    selectedValue: selectedValueType
    leaderboardOffset: number
  } = state().viewerLeaderboard
  const { me } = state().login
  try {
    if (todayValue[tabValue] === selectedValue[tabValue]) return
    dispatch(setLoader(true))

    const response = await getViewerLeaderboardRanks({
      streamer_uid: me?.user_uid ?? '',
      board_type: tabValueMapperType[tabValue],
      leaderboard_offset: leaderboardOffset,
      limit: 10,
      offset: 0,
    })

    const newData = {
      ...historyLeaderboardData,
      [tabValue]: {
        ...historyLeaderboardData[tabValue],
        count: response?.count ?? 0,
        rankingList: response?.results,
        offset: response?.offset,
      },
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
    tabValue,
    leaderboardOffset,
  }: {
    leaderboardData: StateDataType
    historyLeaderboardData: StateDataType
    tabValue: string
    todayValue: selectedValueType
    selectedValue: selectedValueType
    leaderboardOffset: number
  } = state().viewerLeaderboard

  const data = dataType === 'current' ? leaderboardData : historyLeaderboardData

  const { me } = state().login
  try {
    dispatch(setRankRowsLoader(true))

    const response = await getViewerLeaderboardRanks({
      streamer_uid: me?.user_uid ?? '',
      board_type: tabValueMapperType[tabValue],
      leaderboard_offset: leaderboardOffset,
      limit: data[tabValue]?.pageCount + 10,
      offset: data[tabValue]?.pageCount,
    })

    const newData = {
      ...data,
      [tabValue]: {
        ...data[tabValue],
        rankingList: [...data[tabValue]?.rankingList, ...response?.results],
        pageCount: data?.daily?.pageCount + 10,
        offset: response?.offset,
      },
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
