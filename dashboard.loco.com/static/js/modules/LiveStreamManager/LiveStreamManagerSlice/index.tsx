import { resetLiveModerators } from '@modules/Community/Moderator/moderatorSlice'
import { createSlice } from '@reduxjs/toolkit'
import { fetchDefaultStreamDetails } from '@src/modules/DefaultStream/streamDetailsSlice'
import i18n from 'i18next'
import { isEqual } from 'lodash'
import { batch } from 'react-redux'

import {
  confirmSelectGivewayWinnerApi,
  currentLiveStream,
  editStreamOrVOD,
  editStreamOrVODParams,
  endStream,
  getGivewayDetailsApi,
  getStreamHealth,
  selectRandowGivewayWinnerDetailsApi,
  updateChatSettings,
  updateChatSettingsParams,
} from '../../../api/apiRequest'
import { AppThunk } from '../../../app/Store'
import { streamDetailsInterface } from '../../../context/ApiConnector/types'
import { setToasts } from '../../../hoc/WithToasts/withToastsSlice'
import { paths } from '../../../routers/constants'

export interface NextWinnerInterface {
  avatar_url: string
  full_name: string
  user_uid: string
  username: string
}

export interface WinnerInterface {
  avatar_url: string
  full_name: string
  gameIds: { 20097: string }
  userUid: string
  user_uid: string
  username: string
}

export interface GivewayDetailsInterface {
  streamUid: string
  totalParticipants: number
  totalValidParticipants: number
  userUid: string
  winners: WinnerInterface[]
}
export interface RandomGivewayWinnerApiInterface {
  nextWinner: NextWinnerInterface
  streamUid: string
  totalParticipants: number
  totalValidParticipants: number
  userUid: string
  winners: WinnerInterface[]
}
export interface ConfirmGivewayWinnerInterface {
  streamUid: string
  totalParticipants: number
  totalValidParticipants: number
  userUid: string
  winners: WinnerInterface[]
}

export interface StreamHealthDetailsInterface {
  color: string
  alerts: string[]
  realtime: {
    bitrate: number
    fps: number
    stream_live: boolean
  }
  encoder_settings: {
    resolution: string
    encoder: string
    audio_codec: string
    video_codec: string
    framerate: number
    video_bitrate: number
    audio_bitrate: number
  }
}

export interface LiveStreamManagerStateInterface {
  currentLiveStreamDetails: streamDetailsInterface | null
  liveViews: number
  loading: boolean
  error: any | null
  isLive: boolean
  activityTab: 10 | 20 | 30 | 40
  totalValidParticipants: 0
  winners: WinnerInterface[]
  givewayDetailsLoading: boolean
  randomWinnerLoading: boolean
  selectedRandomWinner: NextWinnerInterface | null
  confirmGivewayWinnerLoading: boolean
  sticker_default_time?: number
  streamHealthDetails: StreamHealthDetailsInterface | null
  showModeratorLogs: boolean
  lastStreamConfigChangeTime: number
  isDisconnected: boolean
  liveStreamResponse: any
  isStreamEndedFromDashboard?: boolean
  isDisconnectedModalOpen?: boolean
  streamCoolDownTime: number
  streamInfraType?: number
}

const initialState: LiveStreamManagerStateInterface = {
  currentLiveStreamDetails: null,
  totalValidParticipants: 0,
  liveViews: 0,
  winners: [],
  loading: false,
  error: null,
  isLive: false,
  activityTab: 20,
  givewayDetailsLoading: false,
  randomWinnerLoading: false,
  selectedRandomWinner: null,
  confirmGivewayWinnerLoading: false,
  streamHealthDetails: null,
  showModeratorLogs: true,
  lastStreamConfigChangeTime: 0,
  isDisconnected: false,
  liveStreamResponse: null,
  isStreamEndedFromDashboard: false,
  isDisconnectedModalOpen: false,
  streamCoolDownTime: -1,
}

const liveStreamManagerSlice = createSlice({
  name: 'liveStreamManager',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    setIsLive(state, action) {
      state.isLive = action.payload
    },
    setCurrentLiveStreamDetails(state, action) {
      state.currentLiveStreamDetails = action.payload
    },
    setActivityTab(state, action) {
      state.activityTab = action.payload
    },
    setGivewayDetailsLoading(state, action) {
      state.givewayDetailsLoading = action.payload
    },
    setTotalValidParticals(state, action) {
      state.totalValidParticipants = action.payload
    },
    setWinnersOfGiveway(state, action) {
      state.winners = action.payload
    },
    setRandomWinnerLoading(state, action) {
      state.randomWinnerLoading = action.payload
    },
    setSelectedRandomWinner(state, action) {
      state.selectedRandomWinner = action.payload
    },
    setConfirmGivewayWinnerLoading(state, action) {
      state.confirmGivewayWinnerLoading = action.payload
    },
    setStickerOnyChatDuration(state, action) {
      state.sticker_default_time = action.payload
    },
    setStreamHealthDetails(state, action) {
      state.streamHealthDetails = action.payload
    },
    setLiveViews(state, action) {
      state.liveViews = action.payload
    },
    setShowModeratorLogs(state, action) {
      state.showModeratorLogs = action.payload
    },
    setLastStreamConfigChangeTime(state, action) {
      state.lastStreamConfigChangeTime = action.payload
    },
    setIsDisconnected(state, action) {
      state.isDisconnected = action.payload
    },
    setLiveStreamResponse(state, action) {
      state.liveStreamResponse = action.payload
    },
    setIsStreamEndedFromDashboard(state, action) {
      state.isStreamEndedFromDashboard = action.payload
    },
    setIsDisconnectedModalOpen(state, action) {
      state.isDisconnectedModalOpen = action.payload
    },
    setStreamCoolDownTime(state, action) {
      state.streamCoolDownTime = action.payload
    },
    setStreamInfraType(state, action) {
      state.streamInfraType = action.payload
    },
  },
})
export const {
  setCurrentLiveStreamDetails,
  setError,
  setLoading,
  setIsLive,
  setActivityTab,
  setTotalValidParticals,
  setWinnersOfGiveway,
  setGivewayDetailsLoading,
  setRandomWinnerLoading,
  setSelectedRandomWinner,
  setConfirmGivewayWinnerLoading,
  setStickerOnyChatDuration,
  setStreamHealthDetails,
  setLiveViews,
  setShowModeratorLogs,
  setLastStreamConfigChangeTime,
  setIsDisconnected,
  setLiveStreamResponse,
  setIsStreamEndedFromDashboard,
  setIsDisconnectedModalOpen,
  setStreamCoolDownTime,
  setStreamInfraType,
} = liveStreamManagerSlice.actions

export default liveStreamManagerSlice.reducer

export const fetchCurrentLiveStream = (user_uid: string): AppThunk => async (
  dispatch,
  state
) => {
  const { currentLiveStreamDetails } = state().liveStreamManager
  try {
    const res = await currentLiveStream(user_uid)
    if (res.stream_data) {
      if (
        currentLiveStreamDetails?.uid === res?.stream_data?.uid &&
        currentLiveStreamDetails?.title === res?.stream_data?.title &&
        currentLiveStreamDetails?.description ===
          res?.stream_data?.description &&
        currentLiveStreamDetails?.game_uid === res?.stream_data?.game_uid &&
        isEqual(currentLiveStreamDetails?.tags, res?.stream_data?.tags) &&
        currentLiveStreamDetails?.thumbnail_url_small ===
          res?.stream_data?.thumbnail_url_small &&
        isEqual(
          currentLiveStreamDetails?.chat_config,
          res?.stream_data?.chat_config
        ) &&
        currentLiveStreamDetails?.notification_metadata.status ===
          res?.stream_data?.notification_metadata.status &&
        currentLiveStreamDetails?.has_mature_content ===
          res?.stream_data?.has_mature_content &&
        currentLiveStreamDetails?.primary_language ===
          res?.stream_data?.primary_language &&
        isEqual(
          currentLiveStreamDetails?.secondary_language,
          res?.stream_data?.secondary_language
        )
      ) {
        return
      }
      batch(() => {
        dispatch(setCurrentLiveStreamDetails(res?.stream_data))
        dispatch(
          setStickerOnyChatDuration(res?.stream_data?.sticker_default_time)
        )
        dispatch(setStreamCoolDownTime(res?.cool_down_end_time || -1))
        dispatch(setStreamInfraType(res?.stream_infra_type))

        dispatch(setIsLive(true))
      })
    } else if (!res.stream_data) {
      dispatch(setStreamCoolDownTime(res?.cool_down_end_time || -1))
      if (!currentLiveStreamDetails) {
        return
      }
      batch(() => {
        dispatch(setCurrentLiveStreamDetails(null))
        dispatch(setIsLive(false))
        dispatch(resetLiveModerators())
      })
      localStorage.removeItem(currentLiveStreamDetails?.uid)
    } else if (res?.statusCode) {
      batch(() => {
        dispatch(setError(res))
        dispatch(setIsLive(false))
        dispatch(resetLiveModerators())
      })
    }
  } catch (err) {
    batch(() => {
      dispatch(setError(err))
      dispatch(setIsLive(false))
      dispatch(resetLiveModerators())
    })
  }
}

export const updateCurrentLiveStreamDetails = (
  params: editStreamOrVODParams
): AppThunk => async (dispatch, state) => {
  const {
    login: { me },
  } = state()
  try {
    dispatch(setLoading(true))
    const res = await editStreamOrVOD(params)
    if (me?.user_uid) dispatch(fetchCurrentLiveStream(me.user_uid))
    if (typeof res.message === 'string') {
      dispatch(fetchDefaultStreamDetails())
      dispatch(
        setToasts({
          position: 'top',
          // title: `${i18n.t('manageLiveStream.streamInfo.success')}`,
          note: `${i18n.t('manageLiveStream.streamInfo.updateDetails')}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      )
    } else {
      dispatch(setError(res))
    }
  } catch (err) {
    // do nothing
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateStreamEnd = (history: any): AppThunk => async (
  dispatch,
  state
) => {
  const {
    liveStreamManager: { currentLiveStreamDetails },
  } = state()
  try {
    dispatch(setLoading(true))
    const res = await endStream()
    if (res?.statusCode) {
      dispatch(setError(res))
    } else if (res) {
      batch(() => {
        if (currentLiveStreamDetails?.uid) {
          localStorage.removeItem(currentLiveStreamDetails?.uid)
        }
        dispatch(setCurrentLiveStreamDetails(null))
        dispatch(setIsLive(false))
        dispatch(setLoading(false))
        dispatch(setIsStreamEndedFromDashboard(true))
      })
    } else {
      const errorObj = {
        statusCode: 404,
        message: 'omething went wrong. we could not end your stream',
      }
      dispatch(setError(errorObj))
    }
  } catch (err) {
    batch(() => {
      dispatch(setError(err))
      dispatch(setLoading(false))
    })
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateChatPreference = (
  params: updateChatSettingsParams
): AppThunk => async (dispatch, state) => {
  const {
    login: { me },
  } = state()
  try {
    dispatch(setLoading(true))
    const res = await updateChatSettings(params)
    if (me?.user_uid) dispatch(fetchCurrentLiveStream(me.user_uid))
    if (typeof res.message === 'string') {
      let note = ''
      if (params.sticker_chat_enable === 10) {
        note = i18n.t('manageLiveStream.chat.chatSettings.successNote')
      }
      dispatch(
        setToasts({
          position: 'top',
          note: note
            ? note
            : i18n.t('manageLiveStream.chat.chatSettings.updateSettings'),
          description: note
            ? i18n.t('manageLiveStream.chat.chatSettings.updateSettings')
            : undefined,
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      )
    } else {
      dispatch(setError(res))
    }
  } catch (err) {
    // do nothing
  } finally {
    dispatch(setLoading(false))
  }
}

export const getGivewayDetails = (streamId: string): AppThunk => async (
  dispatch
) => {
  try {
    dispatch(setGivewayDetailsLoading(true))
    const res: GivewayDetailsInterface = await getGivewayDetailsApi(streamId)
    dispatch(setGivewayDetailsLoading(false))
    if (res?.streamUid) {
      dispatch(setTotalValidParticals(res.totalValidParticipants))
      dispatch(setWinnersOfGiveway(res?.winners))
    } else {
      dispatch(setError(res))
    }
  } catch (err) {
    // do nothing
  } finally {
    dispatch(setGivewayDetailsLoading(false))
  }
}

export const selectRandomGivewayWinner = (streamId: string): AppThunk => async (
  dispatch
) => {
  try {
    dispatch(setRandomWinnerLoading(true))
    const res: RandomGivewayWinnerApiInterface = await selectRandowGivewayWinnerDetailsApi(
      streamId
    )
    if (res?.nextWinner?.user_uid) {
      dispatch(setTotalValidParticals(res.totalValidParticipants))
      dispatch(setWinnersOfGiveway(res?.winners))
      dispatch(setSelectedRandomWinner(res.nextWinner))
    } else {
      dispatch(setError(res))
    }
    dispatch(setRandomWinnerLoading(false))
  } catch (error) {
    // do nothing
  } finally {
    dispatch(setRandomWinnerLoading(false))
  }
}

export const confirmGivewayWinner = (streamId: string): AppThunk => async (
  dispatch
) => {
  try {
    dispatch(setConfirmGivewayWinnerLoading(true))
    const res: ConfirmGivewayWinnerInterface = await confirmSelectGivewayWinnerApi(
      streamId
    )
    if (res.winners.length > 0 && res.totalParticipants) {
      dispatch(setTotalValidParticals(res.totalValidParticipants))
      dispatch(setWinnersOfGiveway(res?.winners))
      dispatch(setSelectedRandomWinner(null))
    } else {
      dispatch(setError(res))
    }
    dispatch(setConfirmGivewayWinnerLoading(false))
  } catch (error) {
    // do nothing
  }
}

export const getLiveStreamHealthStatus = (): AppThunk => async (
  dispatch,
  state
) => {
  const {
    liveStreamManager: { currentLiveStreamDetails },
  } = state()
  try {
    if (currentLiveStreamDetails?.uid) {
      const res = await getStreamHealth(currentLiveStreamDetails?.uid)
      dispatch(setStreamHealthDetails(res))
    }
  } catch (error) {
    // do nothing
  }
}
