import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

import {
  getAnalyticsChartData,
  getStickersOrGiftsDetails,
  getWalletDetails,
} from '../../api/apiRequest'
import { AppThunk } from '../../app/Store'
import { formatFractionalHours, formatHour } from '../../utils/formatHour'
import { getLocalTimezoneOffset } from './utils'

type currentInitialState = {
  loading: boolean
  error: any | null
  scaleInterval: string | null
  activeTabObj: Record<string, unknown> | any
  gold: string | number | null
  beans: string | number | null
  gifts: string | number | null
  range: string | null
  chartData: Record<string, unknown>[] | any
  total: number
  dateRange: string | null
  maxYAxisValue: number
  selectedPointX: any | null
  selectedPointY: any | null
  timeZone: string | null
}
const initialState: currentInitialState = {
  loading: false,
  error: null,
  gold: 0,
  beans: 0,
  gifts: 0,
  activeTabObj: {},
  scaleInterval: null,
  range: null,
  chartData: [],
  total: 0,
  maxYAxisValue: 0,
  dateRange: null,
  selectedPointX: null,
  selectedPointY: null,
  timeZone: 'LOCAL',
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setLoader(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    setActiveTabObj(state, action) {
      state.activeTabObj = { ...action.payload }
    },
    setScaleInterval(state, action) {
      state.scaleInterval = action.payload
    },
    setRange(state, action) {
      state.range = action.payload
    },
    setTimeZone(state, action) {
      state.timeZone = action.payload
    },
    setChartDataStart(state) {
      state.loading = true
      state.error = null
    },
    setChartDataFail(state, action) {
      state.error = action.payload
      state.loading = false
    },
    setChartDataSuccess(state, action) {
      state.chartData = action.payload
      state.loading = false
      state.error = null
    },
    setGold(state, action) {
      state.gold = action.payload
    },
    setBeans(state, action) {
      state.beans = action.payload
    },
    setGifts(state, action) {
      state.gifts = action.payload
    },
    setTotal(state, action) {
      state.total = action.payload
    },
    setDateRange(state, action) {
      state.dateRange = action.payload
    },
    setMaxYAxisValue(state, action) {
      state.maxYAxisValue = action.payload
    },
    setSelectedPointX(state, action) {
      state.selectedPointX = action.payload
    },
    setSelectedPointY(state, action) {
      state.selectedPointY = action.payload
    },
  },
})
export const {
  setError,
  setLoader,
  setActiveTabObj,
  setScaleInterval,
  setRange,
  setChartDataStart,
  setChartDataFail,
  setChartDataSuccess,
  setBeans,
  setGold,
  setGifts,
  setTotal,
  setDateRange,
  setMaxYAxisValue,
  setSelectedPointX,
  setSelectedPointY,
  setTimeZone,
} = analyticsSlice.actions

export default analyticsSlice.reducer

export const fetchAnalyticsChartData = (): AppThunk => async (
  dispatch,
  state
) => {
  try {
    dispatch(setChartDataStart())
    const {
      analytics: {
        activeTabObj: { id },
        scaleInterval,
        range,
        timeZone,
      },
    } = state()
    if (range && id && id !== 'overview') {
      const duration: any = range?.split(' ')
      const startDate = moment()
        .utc()
        .subtract(duration[1], duration[2])
        .startOf(duration[2])
        .valueOf()

      const offsetParam = timeZone === 'UTC' ? 0 : getLocalTimezoneOffset() * 60
      const endDate = moment()
        .utc()
        .valueOf()

      const res = await getAnalyticsChartData(
        id,
        scaleInterval,
        startDate,
        endDate,
        offsetParam
      )
      if (res?.data) {
        const updatedData: any = []
        let maxYValue = 0
        const isAllDataZero = res.data.every((data: any) => {
          return data.y === 0
        })
        let total = 0
        let updatedResponse: any = null

        if (isAllDataZero) {
          updatedResponse = []
        } else {
          res.data.map((d: any) => {
            const updatedDataObj: { y: string; x: string } = { y: '', x: '' }
            const updateY =
              id === 'hours_watched' ||
              id === 'hours_streamed_v2' ||
              id === 'live_watch_hours_v2'
                ? formatFractionalHours(d.y)
                : d.y
            maxYValue = updateY > maxYValue ? updateY : maxYValue
            updatedDataObj['y'] = updateY
            total = total + d.y
            updatedDataObj['x'] = moment({
              y: d.x.year,
              M: d.x.month - 1,
              d: d.x.day,
              h: d.x.hour,
              m: 0,
            }).format('DD-MM-YYYY hh:mm A')
            if (updatedDataObj?.x !== 'Invalid date') {
              updatedData.push(updatedDataObj)
            }
          })
          updatedResponse = [
            {
              id: res.label.y,
              color: 'hsl(18, 100%, 54%)',
              data: [...updatedData],
            },
          ]
        }
        dispatch(
          setTotal(
            id === 'hours_watched' ||
              id === 'hours_streamed_v2' ||
              id === 'live_watch_hours_v2'
              ? formatHour(res.total)
              : res.total
          )
        )
        dispatch(setMaxYAxisValue(maxYValue))
        dispatch(setChartDataSuccess(updatedResponse))
        dispatch(
          setDateRange(
            `${moment(startDate).format('DD, MMM, YYYY hh:mm A')} - ${moment(
              endDate
            ).format('DD, MMMM, YYYY hh:mm A')}`
          )
        )
      } else if (res?.statusCode) {
        dispatch(setChartDataFail(res))
      }
    }
  } catch (err) {
    dispatch(setChartDataFail(err))
  } finally {
    dispatch(setLoader(false))
  }
}
export const fetchGoldAndBeansAndGifts = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoader(true))
    const res = await Promise.all([
      getWalletDetails(),
      getStickersOrGiftsDetails(),
    ])
    if (res[0]?.streamer_wallet) {
      dispatch(setGold(res[0]?.streamer_wallet?.gold))
      dispatch(setBeans(res[0]?.streamer_wallet?.beans))
    }
    if (res[1]?.sticker_count) {
      dispatch(setGifts(res[1]?.sticker_count))
    }
  } catch (err) {
    dispatch(setChartDataFail(err))
  } finally {
    dispatch(setLoader(false))
  }
}
