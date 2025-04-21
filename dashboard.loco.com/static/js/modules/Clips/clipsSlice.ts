import { createSlice } from '@reduxjs/toolkit'
import isEqual from 'lodash/isEqual'
import unionWith from 'lodash/unionWith'

import { moderationClips, userClips } from '../../api/apiRequest'
import { AppThunk } from '../../app/Store'

export interface clipDetail {
  clip_id: string
  clip_data: {
    uid: string
    clip_desc: string
    title: string
    hash_tags: string[]
    created_at: number
    duration: number
    game_name: string
  }
  created_at: number
  description: string
  downloadLink: string
  game_uid: string
  clip_video_data: {
    duration: number
  }
  tags: string[]
  hashTags: string[]
  clip_thumbnail_url: string
  title: string
  uid: string
  approval_status?: string
  clip_file_upload_status?: number
  duration: number
  game_name: string
  viewersCurrent: number
}

type Uploading = {
  [x: string]: { percent: number; isUploading: boolean }
}
interface videoSliceStateInterface {
  tab: number
  clipLoading: boolean
  liveClips: clipDetail[]
  deleteLoading: boolean
  error: any | null
  processingClips: clipDetail[]
  uploadingClips: clipDetail[]
  retryUploadingClip: any
  processingClipNext: null | string
  hasMoreProcessingClips: boolean
  liveClipNext: null | string
  hasMoreLiveClips: boolean
  clipDuration: number
  uploadingClipsData: Uploading
}

export enum VideoType {
  LIVE = 10,
  PROCESSING = 20,
}

const initialState: videoSliceStateInterface = {
  tab: VideoType.LIVE,
  clipLoading: false,
  liveClips: [],
  deleteLoading: false,
  error: null,
  processingClips: [],
  uploadingClips: [],
  retryUploadingClip: {},
  processingClipNext: null,
  hasMoreProcessingClips: false,
  liveClipNext: null,
  hasMoreLiveClips: false,
  clipDuration: 0,
  uploadingClipsData: {},
}

const clipSlice = createSlice({
  name: 'clips',
  initialState,
  reducers: {
    setClipStart(state) {
      state.clipLoading = true
      state.error = null
    },
    setTab(state, action) {
      state.tab = action.payload
    },

    setLiveClipSuccess(state, action) {
      state.liveClips = action.payload
      state.clipLoading = false
    },

    setClipFail(state, action) {
      state.error = action.payload
      state.clipLoading = false
    },
    setDeleteClipStart(state) {
      state.deleteLoading = true
    },
    setDeleteClipSuccess(state, action) {
      state.deleteLoading = action.payload
    },
    setUploadingClips(state, action) {
      state.uploadingClips = [action.payload, ...state.uploadingClips]
    },
    resetUploadingClips(state, action) {
      state.uploadingClips = state.uploadingClips.filter(
        (item) => item.clip_data.uid !== action.payload
      )
    },
    setProcessingClipSuccess(state, action) {
      // const newClips = action.payload.filter(
      //   (item: any) => !state.processingClips.some((it) => it.uid === item.uid)
      // )
      state.processingClips = action.payload
      state.clipLoading = false
    },
    setRetryUploadingClip(state, action) {
      state.retryUploadingClip = action.payload
    },
    setProcessingClipNext(state, action) {
      state.processingClipNext = action.payload
    },
    setHasMoreProcessingClips(state, action) {
      state.hasMoreProcessingClips = action.payload
    },
    setLiveClipNext(state, action) {
      state.liveClipNext = action.payload
    },
    setHasMoreLiveClips(state, action) {
      state.hasMoreLiveClips = action.payload
    },
    setClipDuration(state, action) {
      state.clipDuration = action.payload
    },
    setClipsUploadingData(state, action) {
      state.uploadingClipsData = {
        ...state.uploadingClipsData,
        ...action.payload,
      }
    },
  },
})

export const {
  setClipFail,
  setClipStart,
  setLiveClipSuccess,
  setTab,
  setDeleteClipStart,
  setDeleteClipSuccess,
  setUploadingClips,
  resetUploadingClips,
  setProcessingClipSuccess,
  setRetryUploadingClip,
  setProcessingClipNext,
  setHasMoreProcessingClips,
  setLiveClipNext,
  setHasMoreLiveClips,
  setClipDuration,
  setClipsUploadingData,
} = clipSlice.actions

export default clipSlice.reducer

export const fetchClips = (status: number, next?: string): AppThunk => async (
  dispatch,
  getState
) => {
  const {
    clips: { liveClips, processingClips },
  } = getState()
  if (status === VideoType.LIVE) {
    try {
      dispatch(setClipStart())
      const response: any = await userClips(next)
      const allvidoes = response?.results
      if (allvidoes && allvidoes.length) {
        const sortedClips = unionWith(liveClips, allvidoes, isEqual).sort(
          (time1, time2) => {
            return time1.created_at > time2.created_at ? -1 : 1
          }
        )
        dispatch(setLiveClipSuccess(sortedClips))
        dispatch(setLiveClipNext(response?.next ? response.next : null))
        dispatch(setHasMoreLiveClips(response?.next ? true : false))
      } else if (response.statusCode) {
        dispatch(setClipFail(response))
      } else {
        dispatch(setClipFail(response))
      }
    } catch (error) {
      dispatch(setClipFail(error))
    }
  }
  if (status === VideoType.PROCESSING) {
    try {
      dispatch(setClipStart())
      const response: any = await moderationClips(next)

      const allvidoes = response?.result
      if (allvidoes.length === 0) {
        dispatch(setProcessingClipSuccess([...processingClips]))
        dispatch(setProcessingClipNext(null))
        dispatch(setHasMoreProcessingClips(false))
      } else if (allvidoes && allvidoes.length > 0) {
        const sortedClips = unionWith(processingClips, allvidoes, isEqual).sort(
          (time1, time2) => {
            return time1.clip_data.created_at > time2.clip_data.created_at
              ? -1
              : 1
          }
        )
        const uniqueArray = sortedClips.reduce((accumulator, currentValue) => {
          if (
            !accumulator.some((item) => item?.clip_id === currentValue?.clip_id)
          ) {
            accumulator.push(currentValue)
          }
          return accumulator
        }, [] as clipDetail[])
        dispatch(setProcessingClipSuccess(uniqueArray))
        dispatch(setProcessingClipNext(response?.next ? response.next : null))
        dispatch(setHasMoreProcessingClips(response?.next ? true : false))
      } else if (response.statusCode) {
        dispatch(setClipFail(response))
      } else {
        dispatch(setClipFail(response))
      }
    } catch (error) {
      dispatch(setClipFail(error))
    }
  }
}
