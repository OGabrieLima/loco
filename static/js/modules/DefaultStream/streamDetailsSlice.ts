import { createSlice } from '@reduxjs/toolkit'
import i18n from 'i18next'
import _ from 'lodash'
import { batch } from 'react-redux'

import {
  getUserSettings,
  regenerateStreamKey,
  setUserSettings,
  setUserSettingsParams,
  updateUserSettings,
} from '../../api/apiRequest'
import { setError } from '../../app/appSlice'
import { AppThunk } from '../../app/Store'
import { isWebViewBuild } from '../../constent'
import { ApiContext } from '../../context/ApiConnector/types'
import { setToasts } from '../../hoc/WithToasts/withToastsSlice'

interface streamConfigInterface {
  stream_key: string
  ingest_url: string
  streaming_config_text?: string
}
export interface streamDetailsStateInterface {
  defaultStreamDetails: null | ApiContext['defaultStreamDetails']
  isStreamSetupCompleted: boolean
  loading: boolean
  error: null | any
  streamConfig: null | streamConfigInterface
  streamConfigLoader: boolean
  currentLiveStreamDetailsLoader: boolean
  userSettingCreatingLoader: boolean
}

const initialState: streamDetailsStateInterface = {
  defaultStreamDetails: null,
  isStreamSetupCompleted: false,
  currentLiveStreamDetailsLoader: false,
  loading: isWebViewBuild ? true : false,
  error: null,
  streamConfig: null,
  streamConfigLoader: false,
  userSettingCreatingLoader: false,
}

const streamDetailsSlice = createSlice({
  name: 'streamDetails',
  initialState,
  reducers: {
    setFetchStreamDetailsStart(state) {
      state.loading = true
      state.error = null
    },
    setDefaultStreamDetailsSuccess(state, action) {
      const defaultStreamDetails = {
        ...action.payload,
      }

      state.defaultStreamDetails = defaultStreamDetails
      const showSetupStream =
        !defaultStreamDetails?.title ||
        !defaultStreamDetails?.description ||
        !defaultStreamDetails?.game ||
        !defaultStreamDetails?.tags ||
        !defaultStreamDetails?.thumbnail

      state.isStreamSetupCompleted = !showSetupStream
      state.loading = false
    },
    setFetchStreamDetailsFail(state, action) {
      state.loading = false
      state.error = action.payload
    },
    setLoader(state, action) {
      state.loading = action.payload
    },
    setFetchStreamConfigStart(state) {
      state.streamConfigLoader = true
      state.error = null
    },
    setStreamConfigSuccess(state, action) {
      state.streamConfig = action.payload
      state.streamConfigLoader = false
    },
    setFetchStreamConfigFaild(state, action) {
      state.streamConfigLoader = false
      state.error = action.payload
    },
    setStreamConfigLoader(state, action) {
      state.streamConfigLoader = action.payload
    },
    setUserSettingCreatingLoader(state, action) {
      state.userSettingCreatingLoader = action.payload
    },
  },
})
export const {
  setFetchStreamDetailsStart,
  setDefaultStreamDetailsSuccess,
  setFetchStreamDetailsFail,
  setLoader,
  setFetchStreamConfigStart,
  setStreamConfigSuccess,
  setStreamConfigLoader,
  setFetchStreamConfigFaild,
  setUserSettingCreatingLoader,
} = streamDetailsSlice.actions

export default streamDetailsSlice.reducer

export const fetchDefaultStreamDetails = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setFetchStreamDetailsStart())
    const user = await getUserSettings()
    if (user.title) {
      dispatch(setDefaultStreamDetailsSuccess(user))
      dispatch(
        setStreamConfigSuccess({
          stream_key: user.stream_key,
          ingest_url: user.ingest_url,
          streaming_config_text: user.streaming_config_text,
        })
      )
    } else if (user?.statusCode) {
      dispatch(setFetchStreamDetailsFail(null))
    }
  } catch (err) {
    // Not showing error
    dispatch(setFetchStreamDetailsFail(null))
  } finally {
    dispatch(setLoader(false))
  }
}

export const handleStreamKeyGenerate = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setFetchStreamConfigStart())
    const result = await regenerateStreamKey()
    if (result?.settings?.stream_key && result?.settings?.ingest_url) {
      batch(() => {
        dispatch(
          setStreamConfigSuccess({
            stream_key: result?.settings?.stream_key,
            ingest_url: result?.settings?.ingest_url,
          })
        )
        dispatch(
          setToasts({
            position: 'top',
            description: i18n.t('home.todayStream.streamKey'),
            title: i18n.t('home.todayStream.updateSuccessTitle'),
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        )
      })
    } else if (result?.statusCode) {
      dispatch(setFetchStreamConfigFaild(result))
    }
    return result
  } catch (err) {
    dispatch(setFetchStreamConfigFaild(err))
    return err
  } finally {
    dispatch(setStreamConfigLoader(false))
  }
}

export const handleUpdateUserSettings = (
  params: setUserSettingsParams
): AppThunk => async (dispatch) => {
  try {
    batch(() => {
      dispatch(setLoader(true))
      dispatch(setError(null))
    })

    //@ts-ignore
    const response = await updateUserSettings(_.omitBy(params, _.isUndefined))
    if (response.stream_key) {
      batch(() => {
        dispatch(fetchDefaultStreamDetails())
        dispatch(
          setToasts({
            position: 'top',
            description: i18n.t('home.todayStream.updateSucessDiscription'),
            title: i18n.t('home.todayStream.updateSuccessTitle'),
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        )
      })
    } else if (response?.statusCode) {
      dispatch(setError(response))
    }
    dispatch(setLoader(false))
  } catch (error) {
    batch(() => {
      dispatch(setLoader(false))
      dispatch(setError(error))
    })
  }
}

export const handleSetUserSettings = (
  params: setUserSettingsParams
): AppThunk => async (dispatch) => {
  try {
    batch(() => {
      dispatch(setUserSettingCreatingLoader(true))
      dispatch(setError(null))
    })
    const response = await setUserSettings(params)
    if (response.stream_key) {
      batch(() => {
        dispatch(fetchDefaultStreamDetails())
        dispatch(
          setToasts({
            position: 'top',
            description: i18n.t('home.todayStream.updateSucessDiscription'),
            title: i18n.t('home.todayStream.updateSuccessTitle'),
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        )
      })
    } else if (response?.statusCode) {
      dispatch(setError(response))
    }
    dispatch(setUserSettingCreatingLoader(false))
  } catch (error) {
    batch(() => {
      dispatch(setUserSettingCreatingLoader(false))
      dispatch(setError(error))
    })
  }
}
