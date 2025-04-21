import { createSlice } from '@reduxjs/toolkit'
import isEqual from 'lodash/isEqual'
import unionWith from 'lodash/unionWith'
import { batch } from 'react-redux'

import {
  fetchWithAllErrorHandle,
  getVODDownloadInfo,
  streamsByStatus,
} from '../../api/apiRequest'
import { AppThunk } from '../../app/Store'
import { ivoryUrlv1 } from '../../constent'
import { setToasts } from '../../hoc/WithToasts/withToastsSlice'
import { getAccessToken } from '../../utils/manageTokens'
import { handleEventCapture } from '../../utils/sentryEventCapture'

export interface videoDetail {
  VODUrl: string
  akamai_live_playback_url: string
  alias: string
  block_status: number
  can_battleup: boolean
  categories: { uid: string; label: string; category: string; color: string }[]
  comments_count: number
  conf: {
    hls: string
  }
  created_at: number
  currrentViews: number
  description: string
  downloadLink: string
  duration: number
  ended_at: number
  flag_count: number
  game: { uid: string; name: string }
  game_color: string
  game_name: string
  game_uid: string
  is_active: boolean
  is_uploaded: boolean
  is_vod_available: boolean
  primary_language: string
  secondary_language: string[]
  likes: number
  msl4_publish_url: string
  priority_flag_count: number
  started_at: number
  status: number
  streamer: {
    user_uid: string
    username: string
    avatar_url: string
    bio: string
    full_name: string
    is_loco_verified: boolean
    user_type: number
  }
  tags: string[]
  thumbnail_url_small: string
  title: string
  total_live_views_count: number
  total_live_watch_count: number
  total_peak_views_count: number
  total_views: number
  total_vod_views_count: number
  total_vod_watch_count: number
  uid: string
  updated_at: number
  user_uid: string
  viewersCurrent: number
  visibility: number
  vod_duration: number
  vod_enabled: boolean
  vod_url: string
  download_status: number
  downloadInfo: DownloadVideoProcessing
}
interface videoSliceStateInterface {
  VODVideos: videoDetail[]
  tab: number
  videoLoading: boolean
  videoVODNext: null | string
  hasMoreVODVideos: boolean
  streamVideos: videoDetail[]
  videoStreamNext: null | string
  hasMoreStreamVideos: boolean
  deleteLoading: boolean
  error: any | null
  deleteError: any | null
  requestedDownloadVideoID: string | null
  requestedDownloadVideoLoading: boolean
  requestedDownloadVideoError: any
  requestedDownloadLink: string | null
  inProcessStreamVideoIds: string[]
  inProcessVideoData: DownloadVideoProcessing[]
  inProcessVideoError: ''
  ProcessingVideos: videoDetail[]
}

export type DownloadVideoProcessing = {
  eta: string
  percent: string
  status: string
  stream_id: string
  download_status: 10 | 20 | 30 | 40
}

export enum VideoType {
  UPLOADED = 40,
  STREAMED = 30,
  PROCESSING = 15,
}

const initialState: videoSliceStateInterface = {
  VODVideos: [],
  tab: VideoType.STREAMED,
  videoLoading: false,
  videoVODNext: null,
  hasMoreVODVideos: false,
  streamVideos: [],
  videoStreamNext: null,
  hasMoreStreamVideos: false,
  deleteLoading: false,
  error: null,
  deleteError: null,
  requestedDownloadVideoID: null,
  requestedDownloadLink: null,
  requestedDownloadVideoLoading: false,
  requestedDownloadVideoError: null,
  inProcessStreamVideoIds: [],
  inProcessVideoData: [],
  inProcessVideoError: '',
  ProcessingVideos: [],
}

const vidoeSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    setVideoStart(state) {
      state.videoLoading = true
      state.error = null
    },
    setTab(state, action) {
      state.tab = action.payload
    },
    setVODVideoSuccess(state, action) {
      state.VODVideos = action.payload
      state.videoLoading = false
    },
    setVODVideoNext(state, action) {
      state.videoVODNext = action.payload
    },
    setHasMoreVODVideos(state, action) {
      state.hasMoreVODVideos = action.payload
    },
    setStreamVideoSuccess(state, action) {
      state.streamVideos = action.payload
      state.videoLoading = false
    },
    setStreamVideoNext(state, action) {
      state.videoStreamNext = action.payload
    },
    setHasMoreStreamVideos(state, action) {
      state.hasMoreStreamVideos = action.payload
    },
    setVideoFail(state, action) {
      state.error = action.payload
      state.videoLoading = false
    },
    setDeleteVideoStart(state) {
      state.deleteLoading = true
    },
    setDeleteVideoSuccess(state, action) {
      state.deleteLoading = action.payload
    },
    setDeleteVideoFail(state, action) {
      state.deleteLoading = false
      state.deleteError = action.payload
    },
    setRequestedDownloadVideoStart(state, action) {
      state.requestedDownloadVideoLoading = true
      state.requestedDownloadLink = null
      state.requestedDownloadVideoError = null
      state.requestedDownloadVideoID = action.payload
    },
    setRequestedDownloadVideoSuccess(state, action) {
      state.requestedDownloadLink = action.payload
      state.requestedDownloadVideoLoading = false
    },
    setRequestedDownloadVideoError(state, action) {
      state.requestedDownloadVideoLoading = false
      state.requestedDownloadVideoError = action.payload
    },
    setInProcessStreamVideoIds(state, action) {
      state.inProcessStreamVideoIds = action.payload
    },
    addToInProcessStreamVideoIds(state, action) {
      if (!state.inProcessStreamVideoIds.includes(action.payload)) {
        state.inProcessStreamVideoIds.push(action.payload)
      }
    },
    removeToInProcessStreamVideoIds(state, action) {
      state.inProcessStreamVideoIds = state.inProcessStreamVideoIds.filter(
        (id) => id !== action.payload
      )
    },
    updateInProcessVideoData(state, action) {
      state.inProcessVideoData = action.payload
    },
    setInProcessVideoError(state, action) {
      state.inProcessVideoError = action.payload
    },
    setProcessingVideoSuccess(state, action) {
      state.ProcessingVideos = action.payload
      state.videoLoading = false
    },
  },
})

export const {
  setVideoFail,
  setVideoStart,
  setHasMoreStreamVideos,
  setStreamVideoNext,
  setStreamVideoSuccess,
  setVODVideoNext,
  setHasMoreVODVideos,
  setVODVideoSuccess,
  setTab,
  setDeleteVideoStart,
  setDeleteVideoSuccess,
  setDeleteVideoFail,
  setRequestedDownloadVideoStart,
  setRequestedDownloadVideoSuccess,
  setRequestedDownloadVideoError,
  setInProcessStreamVideoIds,
  updateInProcessVideoData,
  addToInProcessStreamVideoIds,
  removeToInProcessStreamVideoIds,
  setInProcessVideoError,
  setProcessingVideoSuccess,
} = vidoeSlice.actions

export default vidoeSlice.reducer

export const fetchVidoes = (
  status: number,
  user_uid: string,
  next?: string
): AppThunk => async (dispatch, getState) => {
  const {
    videos: { VODVideos, streamVideos, ProcessingVideos },
  } = getState()
  try {
    dispatch(setVideoStart())
    const response: any = await streamsByStatus({
      status: status,
      streamerID: user_uid,
      next: next,
    })
    const allvidoes = response?.results
    if (allvidoes && allvidoes.length && status === VideoType.STREAMED) {
      const inProcessStreamVideoIds: string[] = []
      const inProcessVideoData: DownloadVideoProcessing[] = []
      const sortedVideos = unionWith(streamVideos, allvidoes, isEqual)
        .filter((video: videoDetail) => {
          if (
            video.download_status === 20 &&
            video.duration !== -1 &&
            video.downloadInfo?.status === 'success' &&
            !video.is_uploaded
          ) {
            inProcessStreamVideoIds.push(video.uid)
            inProcessVideoData.push(video.downloadInfo)
          }
          if (
            video.is_uploaded ||
            (video['is_active'] && !video.is_active) ||
            video.duration === -1
          ) {
            // do nothing
          } else {
            return video
          }
        })
        .sort((time1, time2) => {
          return time1.created_at > time2.created_at ? -1 : 1
        })
      dispatch(setStreamVideoSuccess(sortedVideos))
      if (inProcessStreamVideoIds.length > 0) {
        dispatch(setInProcessStreamVideoIds(inProcessStreamVideoIds))
        dispatch(updateInProcessVideoData(inProcessVideoData))
      }
      dispatch(setStreamVideoNext(response?.next ? response.next : null))
      dispatch(setHasMoreStreamVideos(response?.next ? true : false))
    } else if (allvidoes && allvidoes.length && status === VideoType.UPLOADED) {
      const sortedVideos = unionWith(VODVideos, allvidoes, isEqual)
        .filter((video: any) => {
          if (
            !video.is_uploaded ||
            (video['is_active'] && !video.is_active) ||
            video.duration === -1
          ) {
            // do nothing
          } else {
            return video
          }
        })
        .sort((time1, time2) => {
          return time1.created_at > time2.created_at ? -1 : 1
        })
      dispatch(setVODVideoSuccess(sortedVideos))
      dispatch(setVODVideoNext(response?.next ? response.next : null))
      dispatch(setHasMoreVODVideos(response?.next ? true : false))
    } else if (
      allvidoes &&
      allvidoes.length &&
      status === VideoType.PROCESSING
    ) {
      const sortedVideos = unionWith(ProcessingVideos, allvidoes, isEqual)
        .filter((video: any) => {
          if (
            !video.is_uploaded ||
            (video['is_active'] && !video.is_active) ||
            video.duration === -1
          ) {
            // do nothing
          } else {
            return video
          }
        })
        .sort((time1, time2) => {
          return time1.created_at > time2.created_at ? -1 : 1
        })
      dispatch(setProcessingVideoSuccess(sortedVideos))
    } else if (response.statusCode) {
      dispatch(setVideoFail(response))
    } else {
      dispatch(setVideoFail(response))
    }
  } catch (error) {
    dispatch(setVideoFail(error))
  }
}

export const downloadVideoStreamer = (videoID: string): AppThunk => async (
  dispatch
) => {
  const Authorization = await getAccessToken()
  dispatch(setRequestedDownloadVideoStart(videoID))
  const response = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/download/${videoID}/`)
    .auth(Authorization!)
    .get()
    .json((res) => {
      return res
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/download/${videoID}/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })

  if (response.download_url && response.status === 30) {
    dispatch(setRequestedDownloadVideoSuccess(response.download_url))
  }
  if (response.status === 20) {
    // do nothing
  } else {
    batch(() => {
      if (response?.statusCode === 403)
        dispatch(
          setToasts({
            position: 'top',
            title: 'Acess Denied',
            description: "You don't have permission to download the videos.",
            status: 'error',
            duration: 2000,
            isClosable: true,
          })
        )
      dispatch(setRequestedDownloadVideoError(response))
    })
  }
}

export const fetchVODDownloadInfo = (
  all_stream_id: string[]
): AppThunk => async (dispatch) => {
  const res = await getVODDownloadInfo(all_stream_id)
  if (res) {
    let error
    const data = res.reduce(
      (acc: DownloadVideoProcessing[], _res: DownloadVideoProcessing) => {
        if (_res.status === 'error' && _res.download_status === 20) return acc
        if (_res.status === 'success') {
          acc.push(_res)
        } else {
          error = 'Something went wrong in processing'
        }
        return acc
      },
      []
    )
    dispatch(setInProcessVideoError(error))
    dispatch(updateInProcessVideoData(data as DownloadVideoProcessing[]))
  }
}
