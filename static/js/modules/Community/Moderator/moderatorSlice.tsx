import { RootState } from '@app/RootReducer'
import store from '@app/Store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { parseSelectedLanguage } from '@src/i18n/utils'
import { getAccessToken } from '@utils/manageTokens'
import Axios, { AxiosError } from 'axios'
import i18next from 'i18next'

import { ivoryUrlv1 } from '../../../constent'
import { InitialStateType } from '../types'

export const validateUsername = async (username: string) => {
  const url = `${ivoryUrlv1}/dashboard/moderator/validate/?username=${username}`
  const Authorization = await getAccessToken()
  return Axios({
    url,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-PLATFORM': '7',
      authorization: Authorization,
      'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
      'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
    },
  })
}

export const addModerator = createAsyncThunk(
  'moderators/addModerator',
  async ({ username }: { username: string }, { getState, dispatch }) => {
    const state = getState() as RootState
    const currentLiveStreamUID = store.getState().liveStreamManager
      .currentLiveStreamDetails?.uid
    const url = `${ivoryUrlv1}/dashboard/moderator/add/`
    return Axios({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PLATFORM': '7',
        authorization: state.app.accessToken,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
      data: {
        username,
        stream_uid: currentLiveStreamUID ? currentLiveStreamUID : 'stream',
      },
    })
      .then(() => {
        dispatch(fetchModerators())
      })
      .catch((error: AxiosError) => {
        throw error.response?.data.message
      })
  }
)

export const removeModerator = createAsyncThunk(
  'moderators/removeModerator',
  async ({ user_uid }: { user_uid: string }, { getState }) => {
    const state = getState() as RootState
    const currentLiveStreamUID = store.getState().liveStreamManager
      .currentLiveStreamDetails?.uid
    const url = `${ivoryUrlv1}/dashboard/moderator/delete/`
    return Axios({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PLATFORM': '7',
        authorization: state.app.accessToken,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
      data: {
        user_uid,
        stream_uid: currentLiveStreamUID ? currentLiveStreamUID : 'stream',
      },
    })
      .then((res) => res.data)
      .catch((error: AxiosError) => error.response?.data.message)
  }
)

export const fetchModerators = createAsyncThunk(
  'moderators/getModerators',
  async (offset: string | undefined, { getState }) => {
    const state = getState() as RootState
    let url = `${ivoryUrlv1}/dashboard/moderator/fetch/`
    if (offset) {
      url = `${url}?offset=${offset}`
    }
    return Axios({
      url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PLATFORM': '7',
        authorization: state.app.accessToken,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
    })
      .then((res) => res.data.message)
      .catch((error: AxiosError) => {
        throw error.response?.data.message
      })
  }
)

export const fetchLiveModerators = createAsyncThunk(
  'moderators/getLiveModerators',
  async (stream_id: string, { getState }) => {
    const state = getState() as RootState
    const url = `${ivoryUrlv1}/moderator/fetch_live/${stream_id}/`
    return Axios({
      url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PLATFORM': '7',
        authorization: state.app.accessToken,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
    }).then((res) => res.data)
  }
)

export const fetchBlockedWords = createAsyncThunk(
  'moderators/fetchBlockedWords',
  async (offset: string | null, { getState }) => {
    const state = getState() as RootState
    let url = `${ivoryUrlv1}/dashboard/moderator/blocked_words/?limit=21`
    if (offset) {
      url = `${url}&offset=${offset}`
    }
    return Axios({
      url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PLATFORM': '7',
        authorization: state.app.accessToken,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
    })
      .then((res) => res.data.message)
      .catch((error: AxiosError) => {
        throw error.response?.data.message
      })
  }
)

export const addBlockWord = createAsyncThunk(
  'moderators/addBlockWord',
  async (
    args: { word: string; stream_id: string; user_uid: string },
    { getState }
  ) => {
    const { word, stream_id } = args
    const state = getState() as RootState
    const url = `${ivoryUrlv1}/dashboard/moderator/word/add/`
    return Axios({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PLATFORM': '7',
        authorization: state.app.accessToken,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
      data: {
        word,
        stream_id,
      },
    })
      .then((res) => res.data)
      .catch((error: AxiosError) => {
        throw error.response?.data.message
      })
  }
)

export const removeBlockWord = createAsyncThunk(
  'moderators/removeBlockWord',
  async (word: string, { getState }) => {
    const state = getState() as RootState
    const currentLiveStreamUID = store.getState().liveStreamManager
      .currentLiveStreamDetails?.uid
    const url = `${ivoryUrlv1}/dashboard/moderator/word/delete/`
    return Axios({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PLATFORM': '7',
        authorization: state.app.accessToken,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
      data: {
        word,
        stream_id: currentLiveStreamUID ? currentLiveStreamUID : 'stream',
      },
    })
      .then((res) => res.data)
      .catch((error: AxiosError) => error.response?.data.message)
  }
)

export const fetchBlockedUsers = createAsyncThunk(
  'moderators/fetchBlockedUsers',
  async (
    { offset, block_type }: { offset?: string | null; block_type: number },
    { getState }
  ) => {
    const state = getState() as RootState
    let url = `${ivoryUrlv1}/dashboard/moderator/blocked_users/?limit=24&block_type=${block_type}`
    if (offset) {
      url = `${url}&offset=${offset}`
    }
    return Axios({
      url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PLATFORM': '7',
        authorization: state.app.accessToken,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
    })
      .then((res) => ({ response: res.data.message, type: block_type }))
      .catch((error: AxiosError) => {
        throw { error: error.response?.data.message, type: block_type }
      })
  }
)

export const unBlockUser = createAsyncThunk(
  'moderators/unBlockUser',
  async (
    {
      user_uid,
      unblock_type,
      stream_id,
    }: {
      user_uid: string
      unblock_type: 20 | 80
      stream_id: string | undefined
    },
    { getState }
  ) => {
    const state = getState() as RootState
    const url = `${ivoryUrlv1}/dashboard/moderator/user/unblock/`
    return Axios({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PLATFORM': '7',
        authorization: state.app.accessToken,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
      data: {
        user_uid,
        stream_id,
        unblock_type,
      },
    })
      .then((res) => ({ response: res.data.message, type: unblock_type }))
      .catch((error: AxiosError) => {
        throw error.response?.data.message
      })
  }
)

export const fetchActivityLogs = createAsyncThunk(
  'moderators/fetchActivityLogs',
  async (offset: string | null, { getState }) => {
    const state = getState() as RootState
    let url = `${ivoryUrlv1}/dashboard/moderator/logs/?limit=12`
    if (offset) {
      url = `${url}&offset=${offset}`
    }
    return Axios({
      url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PLATFORM': '7',
        authorization: state.app.accessToken,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
    })
      .then((res) => res.data.message)
      .catch((error: AxiosError) => {
        throw error.response?.data.message
      })
  }
)

const initialState: InitialStateType = {
  moderators: { data: [], loading: true, error: '', addModeratorError: '' },
  activityLogs: { data: [], loading: true, next_offset: null },
  blockWords: {
    data: [],
    loading: true,
    next_offset: null,
    addBlockWordError: '',
  },
  mutedUsers: { data: [], loading: true, error: '', next_offset: null },
  timedOutUsers: { data: [], loading: true, error: '', next_offset: null },
  liveModerators: [],
}

const moderatorSlice = createSlice({
  name: 'moderators',
  initialState,
  reducers: {
    clearActivityLogs(state) {
      state.activityLogs.data = []
    },
    resetModeratorAddError(state) {
      state.moderators.addModeratorError = ''
    },
    resetBlockWordAddError(state) {
      state.blockWords.addBlockWordError = ''
    },
    resetLiveModerators(state) {
      state.liveModerators = []
    },
    resetMutedUsers(state) {
      state.mutedUsers = {
        data: [],
        loading: true,
        error: '',
        next_offset: null,
      }
      state.timedOutUsers = {
        data: [],
        loading: true,
        error: '',
        next_offset: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModerators.pending, (state) => {
        state.moderators.loading = true
      })
      .addCase(fetchModerators.fulfilled, (state, action) => {
        state.moderators.loading = false
        state.moderators.data = action.payload.moderators
      })
      .addCase(fetchModerators.rejected, (state, action) => {
        state.moderators.loading = false
        state.moderators.error = action.error.message
      })
      .addCase(fetchBlockedWords.pending, (state) => {
        state.blockWords.loading = true
      })
      .addCase(fetchBlockedWords.fulfilled, (state, action) => {
        state.blockWords.loading = false
        state.blockWords.next_offset = action.payload.banWordList.next_offset
        state.blockWords.data.push(...action.payload.banWordList.arr)
      })
      .addCase(fetchBlockedWords.rejected, (state, action) => {
        state.blockWords.loading = false
        state.blockWords.error = action.error.message
      })
      .addCase(addBlockWord.rejected, (state, action) => {
        state.blockWords.addBlockWordError = action.error.message
      })
      .addCase(addBlockWord.fulfilled, (state, action) => {
        state.blockWords.data.unshift({
          block_word: action.meta.arg.word,
          created_at: new Date().getTime(),
          streamer_user_uid: action.meta.arg.user_uid,
          updated_at: new Date().getTime(),
        })
      })
      .addCase(removeBlockWord.fulfilled, (state, action) => {
        state.blockWords.data = state.blockWords.data.filter(
          (_data) => _data.block_word !== action.meta.arg
        )
      })
      .addCase(fetchActivityLogs.pending, (state) => {
        state.activityLogs.loading = true
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.activityLogs.loading = false
        state.activityLogs.error = action.error.message
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.activityLogs.loading = false
        state.activityLogs.next_offset = action.payload.streamerLogs.next_offset
        state.activityLogs.data.push(...action.payload.streamerLogs.arr)
      })
      .addCase(addModerator.rejected, (state, action) => {
        state.moderators.addModeratorError = action.error.message
      })
      .addCase(removeModerator.fulfilled, (state, action) => {
        state.moderators.data = state.moderators.data.filter(
          (_data) => _data.moderator_user_id !== action.meta.arg.user_uid
        )
      })
      .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
        if (action.payload.type === 10) {
          state.mutedUsers.loading = false
          state.mutedUsers.next_offset =
            action.payload.response.banUsersList.next_offset

          state.mutedUsers.data.push(
            ...action.payload.response.banUsersList.arr
          )
        } else {
          state.timedOutUsers.loading = false
          state.timedOutUsers.next_offset =
            action.payload.response.banUsersList.next_offset
          state.timedOutUsers.data.push(
            ...action.payload.response.banUsersList.arr
          )
        }
      })
      .addCase(unBlockUser.fulfilled, (state, action) => {
        if (action.payload.type === 20) {
          state.mutedUsers.data = state.mutedUsers.data.filter(
            (_data) => _data.blocked_user_uid !== action.meta.arg.user_uid
          )
        } else {
          state.timedOutUsers.data = state.timedOutUsers.data.filter(
            (_data) => _data.blocked_user_uid !== action.meta.arg.user_uid
          )
        }
      })
      .addCase(fetchLiveModerators.fulfilled, (state, action) => {
        state.liveModerators = action.payload
      })
  },
})

export const {
  clearActivityLogs,
  resetModeratorAddError,
  resetBlockWordAddError,
  resetLiveModerators,
  resetMutedUsers,
} = moderatorSlice.actions

export default moderatorSlice.reducer
