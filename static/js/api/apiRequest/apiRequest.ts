import {
  IMeProfileInfo,
  streamerDetailsInterface,
} from '@context/ApiConnector/MeInterfaceType'
import { Dispatch } from '@reduxjs/toolkit'
import * as Sentry from '@sentry/react'
import { setRequestCountryCode } from '@src/app/appSlice'
import { parseSelectedLanguage } from '@src/i18n/utils'
import i18n from 'i18next'
import i18next from 'i18next'
import queryString from 'query-string'

import {
  chatUrlv2,
  clientID,
  clientSecret,
  drmUrlv1,
  ivoryBaseUrl,
  ivoryUrlv1,
  ivoryUrlv2,
  LOCO_API_URL,
  paymentsUrlv3,
  serverUrlv1,
  serverUrlv3,
  storeUrlv1,
  storeUrlv2,
  strapiUrl,
  taskServerUrl,
  yenCleintSecret,
  yenClientID,
  yenUrlv1,
} from '../../constent'
import { getFingerprint } from '../../utils/fingerprint'
import { handleEventCapture } from '../../utils/sentryEventCapture'
import {
  fetchWithAllErrorHandle,
  GET_FE_CAHCE_KEY,
  getAccessToken,
  removeAccessTokenFromStoreAndLocal,
  removeRefreshTokenToStoreAndLocal,
  setAccessTokenToStoreAndLocal,
  setRefreshTokenToStoreAndLocal,
} from './helper'

export const streamerLogin = async (googletokenID: string) => {
  const params = {
    social_platform: 10,
    client_id: clientID,
    country: 'IN',
    client_secret: clientSecret,
    token: googletokenID,
  }
  const isDeviceIdPresent = !!localStorage.getItem('fingerprint')
  const fingerprint = await getFingerprint()
  if (!isDeviceIdPresent) {
    await registerDeviceProfile()
  }

  const result = await fetchWithAllErrorHandle
    .url(`${serverUrlv3}/streamer/login/`)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'DEVICE-ID': fingerprint,
      'X-PLATFORM': '7',
    })
    .post(params)
    .json((json) => {
      if (json?.access_token && json?.refresh_token) {
        setAccessTokenToStoreAndLocal(json.access_token)
        setRefreshTokenToStoreAndLocal(json.refresh_token)
      } else {
        removeAccessTokenFromStoreAndLocal()
        removeRefreshTokenToStoreAndLocal()
      }
      return json
    })
    .catch((error) => {
      handleEventCapture(`${serverUrlv3}/streamer/login/`, error)
      return error
    })
  return result
}

export const streamerLogout = async ({
  refresh_token,
  access_token,
}: {
  refresh_token: string
  access_token: string
}) => {
  const fingerprint = await getFingerprint()
  const url = `${serverUrlv3}/user/signout/`
  const params = { refresh_token: refresh_token, old_token: access_token }
  const result: any = await fetchWithAllErrorHandle
    .url(url)
    .headers({
      Authorization: access_token,
      'DEVICE-ID': fingerprint,
      'X-PLATFORM': '7',
      'X-CLIENT-ID': clientID!,
      'X-CLIENT-SECRET': clientSecret!,
    })
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      return error
    })

  removeAccessTokenFromStoreAndLocal()
  removeRefreshTokenToStoreAndLocal()
  return result
}

export const missingInfoApi = async () => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${serverUrlv3}/user/missing_info/`)
    .headers({
      Authorization: Authorization,
    })
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${serverUrlv3}/user/missing_info/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const googleLoginApi = async (googletokenID: string) => {
  const params = {
    social_platform: 10,
    client_id: clientID,
    country: 'IN',
    client_secret: clientSecret,
    token: googletokenID,
  }
  const isDeviceIdPresent = !!localStorage.getItem('fingerprint')
  const fingerprint = await getFingerprint()
  if (!isDeviceIdPresent) {
    const res = await registerDeviceProfile()
  }

  const url = `${serverUrlv3}/user/signin/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'DEVICE-ID': fingerprint,
      'X-PLATFORM': '7',
    })
    .post(params)
    .json((json) => {
      if (json?.access_token && json?.refresh_token) {
        setAccessTokenToStoreAndLocal(json.access_token)
        setRefreshTokenToStoreAndLocal(json.refresh_token)
      } else {
        removeAccessTokenFromStoreAndLocal()
        removeRefreshTokenToStoreAndLocal()
      }
      return json
    })
    .catch((error) => {
      handleEventCapture(url, error)
      return error
    })
  return result
}

export const linkSocialAccounts = async (
  token: string,
  social_platform: number
) => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${serverUrlv3}/user/link_social/`)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'X-CLIENT-ID': clientID,
      'X-CLIENT-SECRET': clientSecret,
      'X-PLATFORM': '7',
      Authorization,
    })
    .post(JSON.stringify({ token, social_platform }))
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(`${serverUrlv3}/user/link_social/`, error)
      return error
    })
  return result
}

export const registerDeviceProfile = async () => {
  const fingerprint = await getFingerprint()
  const params = {
    platform: 7,
    client_id: clientID,
    client_secret: clientSecret,
    model: window.navigator.appCodeName,
    os_ver: window.navigator.appVersion,
    os_name: window.navigator.platform,
    app_ver: window.navigator.appVersion,
  }

  const result = await fetchWithAllErrorHandle
    .url(`${serverUrlv3}/user/device_profile/`)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'DEVICE-ID': fingerprint as string,
      'X-CLIENT-ID': clientID,
      'X-CLIENT-SECRET': clientSecret,
      'X-PLATFORM': '7',
    })
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(`${serverUrlv3}/user/device_profile/`, error)
      return error
    })

  if (result && result?.access_token && result?.refresh_token) {
    Sentry.getGlobalScope().setUser({
      username: 'Non-logged-in',
      user_uid: '-',
      device_id: fingerprint,
      // email: result?.email,
      // phone_number: result?.phone,
    })
  }
  return result
}

export interface updateProfileParams {
  bio: string
  full_name: string
  username: string
  timezone?: string
  gender: number
  dob: string
  tags: string[]
  game: string
  country?: string
}

export const updateStreamerProfile = async (params: updateProfileParams) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${serverUrlv3}/streamer/profile/`)
    .auth(Authorization!)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${serverUrlv3}/streamer/profile/`,
        error?.message ? error.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const updateUserLanguage = async (params: { language: string }) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/profile/update/`)
    .auth(Authorization!)
    .post(params)
    .json((json) => json)
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/profile/update/`,
        error?.message ? error.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getTokenFromCode = async (code: string) => {
  const params = { code }
  const url = `${LOCO_API_URL}/auth/gettoken`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
    })
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      return error
    })
  return result
}

export const meStreamer = async () => {
  const Authorization = getAccessToken()
  if (Authorization) {
    let request_country_code = ''
    const result = await fetchWithAllErrorHandle
      .url(`${ivoryUrlv1}/profile/me/`)
      .auth(Authorization!)
      .get()
      .json((json) => {
        request_country_code = json.request_country_code
        const request_timezone = json.request_timezone || null
        const result = json.data
        result['timezone'] = result['timezone'] || null
        result['request_timezone'] = request_timezone
        return result
      })
      .catch((error) => {
        handleEventCapture(`${ivoryUrlv1}/profile/me/`, error)
        return error
      })
    return { ...result, request_country_code }
  }
  return false
}

export const fetchMeProfileApi = async (): Promise<any> => {
  const Authorization = getAccessToken()
  const fingerprint = await getFingerprint()
  if (Authorization) {
    const result = await fetchWithAllErrorHandle
      .url(`${serverUrlv3}/user/me-profile/`)
      .headers({
        'Content-Type': 'application/json',
        'X-PLATFORM': '7',
      })
      .auth(Authorization!)
      .get()
      .json((json) => json as IMeProfileInfo)
      .catch((error) => {
        handleEventCapture(`${serverUrlv3}/user/me-profile/`, error)
        return error
      })

    if (result && result?.user_id) {
      result.user_uid = result.user_id
      result.avatar_url = result.avatar

      Sentry.getGlobalScope().setUser({
        username: result?.username,
        user_uid: result?.user_uid,
        device_id: fingerprint,
        // email: data?.email,
        // phone_number: data?.phone,
      })
    }
    return result
  }
  return false
}

export const fetchAllMeProfileResponse = async () => {
  const [meProfileResp, profileResp, meResp] = await Promise.allSettled([
    fetchMeProfileApi(),
    getProfileInfo(),
    meStreamer(),
  ])
  const meProfileResult: IMeProfileInfo =
    meProfileResp.status === 'fulfilled' ? meProfileResp.value || {} : {}
  const profileResult =
    profileResp.status === 'fulfilled' ? profileResp.value || {} : {}
  const meResult = meResp.status === 'fulfilled' ? meResp.value || {} : {}

  if (!meProfileResult?.username) {
    return meProfileResp.status === 'fulfilled'
      ? meProfileResp.value
      : meProfileResp.reason
  }
  const result: streamerDetailsInterface = {
    ...profileResult,
    ...meResult,
    ...meProfileResult,
    user_uid: meProfileResult.user_id,
    avatar_url: meProfileResult.avatar,
    is_username_changed: profileResult?.is_username_changed,
    social_link_info: profileResult?.social_link_info,
    can_stream: meResult?.can_stream,
    profile_tags: meResult?.profile_tags,
    game_ids: meResult?.game_ids,
    is_clip_upload_enabled: meResult?.is_clip_upload_enabled,
    country_iso_code: meResult?.country_iso_code ?? meResult.iso_code,
    primary_game: meResult?.primary_game,
    categories_following_count: meResult?.categories_following_count,
    created_at: meResult?.created_at,
    followees_count: meResult?.followees_count,
    followers_count: meResult?.followers_count,
    is_live: meResult?.is_live,
    streams_count: meResult?.streams_count,
    total_stream_views_count: meResult?.total_stream_views_count,
    updated_at: meResult?.updated_at,
    views_count: meResult?.views_count,
    watch_count: meResult?.watch_count,
    is_sip_agreement_accept: meResult?.is_sip_agreement_accept,
    // country: meResult?.country,
  }

  return result
}

export const streamerPermissions = async (streamer_id: string) => {
  const Authorization = getAccessToken()
  if (Authorization) {
    const result = await fetchWithAllErrorHandle
      .url(`${ivoryBaseUrl}/v2/profile/${streamer_id}/`)
      .auth(Authorization!)
      .get()
      .json((json) => {
        const result = json.data
        return result
      })
      .catch((error) => {
        handleEventCapture(`${ivoryUrlv1}/profile/${streamer_id}/`, error)
        return error
      })
    return result
  }
  return false
}

export const allGames = async (params?: { next: string }) => {
  const nextUrl = typeof params?.next === 'string' ? params.next : ''
  const Authorization = getAccessToken()
  const pointUrl = nextUrl
    ? `${ivoryBaseUrl}${nextUrl}`
    : `${ivoryUrlv1}/dashboard/all_games/?limit=50`
  const result = await fetchWithAllErrorHandle
    .url(pointUrl)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        pointUrl,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getSpecificGames = async () => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/categories/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/categories/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const allTags = async (next?: string) => {
  const Authorization = getAccessToken()

  const pointUrl = ivoryBaseUrl

  const url = next
    ? `${pointUrl}${next}`
    : `${pointUrl}/v1/dashboard/all_tags/?limit=60`

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getProfileTags = async (next?: string) => {
  const Authorization = getAccessToken()

  const pointUrl = ivoryBaseUrl

  const url = next
    ? `${pointUrl}${next}`
    : `${pointUrl}/v1/profile/tags/?limit=60`

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getNormalTags = async (next?: string) => {
  const Authorization = getAccessToken()

  const pointUrl = ivoryBaseUrl

  const url = next
    ? `${pointUrl}${next}`
    : `${pointUrl}/v1/games/categories/tags/`

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export interface goLiveParams {
  file: File
  title: string
  description: string
  primary_language: string
  game_uid: number
  tags?: []
}

export interface goLiveRespone {
  stream_key: string
  save_vod: boolean
  ingest_url: string
}
export const goLive = async (params: goLiveParams) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/streams/golive/`)
    .auth(Authorization!)
    .formData(params)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/streams/golive/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export interface uploadVodParams {
  game_uid: string
  title: string
  description: string
  primary_language: string
  thumb_file: string
  video_file: string
  tags?: string[]
  has_mature_content?: boolean
}

export const uploadVod = async (params: uploadVodParams) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/get_signed_url/`)
    .auth(Authorization!)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/get_signed_url/`,
        error?.message ? error.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getStreamSByStreamerId = async (
  streamerUID: string,
  next?: string
) => {
  const Authorization = getAccessToken()

  const pointUrl = ivoryBaseUrl
  const url = next
    ? `${pointUrl}${next}`
    : `${pointUrl}/v1/profile/${streamerUID}/streams/?limit=50`

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const fetchStreamResponse = async (stream_uid: string) => {
  const Authorization = getAccessToken()
  const streamResponse = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv2}/streams/${stream_uid}`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      return error
    })
  return streamResponse
}

export const getStreamConfig = async (stream_uid: string) => {
  const Authorization = getAccessToken()
  const res = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/streams/${stream_uid}/config/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      return error
    })
  return res
}

export const currentLiveStream = async (streamerUID: string) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/stream/config/`)
    .auth(Authorization!)
    .get()
    .error(503, () => {
      // do nothing
    })
    .json((json) => {
      return json
    })
    .catch((error) => {
      // handleEventCapture(
      //   `${serverUrl}/streams/${streamerUID}/manifest.m3u8`,
      //   error?.message ? JSON.stringify(error?.message) : 'Failed to Fetch Api'
      // );
      return error
    })
  return result
}

export const userSetting = async () => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/streams/user_settings/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/streams/user_settings/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const isUsernameAvailable = async (username: string) => {
  const Authorization = getAccessToken()
  const language = i18n.resolvedLanguage
  const result = await fetchWithAllErrorHandle
    .url(`${serverUrlv3}/user/username_hai_kya/?username=${username}`)
    .headers({
      'X-APP-LANGUAGE': language === 'en' ? '1' : '9',
    })
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${serverUrlv3}/user/username_hai_kya/?username=${username}`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

interface streamerAvatarParams {
  avatar: any
}

export const streamerAvatar = async (params: streamerAvatarParams) => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${serverUrlv3}/user/upload_avatar/`)
    .auth(Authorization!)
    .formData(params)
    .post()
    .json(async (json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${serverUrlv3}/user/upload_avatar/`,
        error?.message ? error.message : 'Failed to Fetch Api'
      )
      return error
    })

  return result
}

export const endStream = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/end_stream/`)
    .auth(Authorization!)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/end_stream/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })

  return result
}

export const getStreamByUID = async (streamId: string) => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/streams/${streamId}`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/streams/${streamId}`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export interface editStreamOrVODParams {
  stream_key: string | undefined
  file?: File
  title?: string
  description?: string
  primary_language?: string
  secondary_language?: string[]
  game_uid?: string
  tags?: []
  has_mature_content?: boolean
}

export const editStreamOrVOD = async (params: editStreamOrVODParams) => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/edit_stream/`)
    .auth(Authorization!)
    .formData(params)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/edit_stream/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getWalletDetails = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${storeUrlv1}/wallet/all/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${storeUrlv1}/wallet/all/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getWalletCurrencyDetails = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${storeUrlv1}/streamer/ratesheet/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${storeUrlv1}/streamer/ratesheet/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getStreamerWallet = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${yenUrlv1}/internal/wallet/`)
    .headers({
      'client-id': yenClientID,
      'client-secret': yenCleintSecret,
    })
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${yenUrlv1}/internal/wallet/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getStreamerStickerCount = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${yenUrlv1}/internal/stickers/`)
    .headers({
      'client-id': yenClientID,
      'client-secret': yenCleintSecret,
    })
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${yenUrlv1}/internal/stickers/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const regenerateStreamKey = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/regenerate_streamKey/`)
    .auth(Authorization!)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/egenerate_streamKey/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getUserSettings = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/get_user_settings/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/get_user_settings/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export interface setUserSettingsParams {
  title: string
  description: string
  primary_language?: string
  secondary_language?: string
  game_uid: number | string
  file: any
  tags?: any[]
  has_mature_content?: boolean
}
export const setUserSettings = async (params: setUserSettingsParams) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/set_user_settings/`)
    .auth(Authorization!)
    .formData(params)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/set_user_settings/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export interface updateUserSettingsParams {
  title: string
  description: string
  primary_language: string
  secondary_language?: string
  game_uid: number
  file?: any
  tags?: []
  has_mature_content?: boolean
}
export const updateUserSettings = async (params: updateUserSettingsParams) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/update_user_settings/`)
    .auth(Authorization!)
    .formData(params)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/update_user_settings/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const deleteVOD = async (videoID: string) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/delete_vod/`)
    .auth(Authorization!)
    .post({ stream_uid: videoID })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/delete_vod`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

interface streamsByStatusParams {
  status: number
  streamerID: string
  next?: string
}
export const streamsByStatus = async (params: streamsByStatusParams) => {
  const Authorization = getAccessToken()

  const pointUrl = ivoryBaseUrl
  const url = params.next
    ? `${pointUrl}${params.next}`
    : `${pointUrl}/v1/profile/${params.streamerID}/streamsbystatus/?limit=12&status=${params.status}`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
    })
  return result
}
// Analytics APIs

export const getAnalyticsChartData = async (
  data: string,
  scaleInterval: any,
  startDate: any,
  endDate: any,
  offsetParam: number
) => {
  const analytics = data.toLowerCase()
  const start_date = startDate
  const end_date = endDate
  const params = {
    granularity: scaleInterval.toLowerCase(),
    start_date,
    end_date,
    timezone_offset: offsetParam,
  }
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv2}/dashboard/analytics/${analytics}/`)
    .auth(Authorization)
    .query(params)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/analytics/${data}`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
//wallets APIs
export const beanWalletDetails = async () => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${storeUrlv2}/streamer/beans/`)

    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${storeUrlv2}/streamer/beans/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
    })

  return result
}

interface walletTranscationsLogParams {
  offset: string
  limit: number
  transaction_type: number
}
export const walletTranscationsLog = async (
  params: walletTranscationsLogParams
) => {
  // This api is cached at browser level, So added userUid so that data can fetched differently

  const url = params.offset
    ? `${params.offset}`
    : `${yenUrlv1}/streamer/logs/?offset=&limit=${
        params.limit
      }&transaction_type=${
        params.transaction_type
      }&fe_cahche_key=${GET_FE_CAHCE_KEY()}`
  // So that it will not cache on browser level
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
    })

  return result
}

export const getStickersOrGiftsDetails = async () => {
  const Authorization = getAccessToken()
  if (!Authorization) return false
  const result = await fetchWithAllErrorHandle
    .url(`${yenUrlv1}/streamer/stickers/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${yenUrlv1}/streamer/stickers/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const getStreamerLeaderboardRanks = async ({
  type,
  category,
  limit,
}: {
  type: number
  category: number
  limit: number
}) => {
  const Authorization = getAccessToken()
  const params = {
    type,
    category,
    limit,
  }
  if (type == 30) {
    //@ts-ignore
    delete params.type
  }
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/leaderboard/`)
    .auth(Authorization!)
    .query(params)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/leaderboard/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const getStreamerLeaderboardMeRank = async ({
  type,
  category,
}: {
  type: number
  category: number
}) => {
  const Authorization = getAccessToken()
  const params = {
    type: type,
    category: category,
  }
  if (type == 30) {
    //@ts-ignore
    delete params.type
  }
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/leaderboard/me/`)
    .auth(Authorization!)
    .query(params)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/leaderboard/me/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getDeepShortUrl = async (params: any) => {
  const Authorization = getAccessToken()
  const getLocoNowUrl = queryString.stringifyUrl({
    url: 'https://loco.com/client',
    query: { ...params, type: '5', play_latest: true },
  })
  const result = await fetchWithAllErrorHandle
    .url(`${serverUrlv1}/dynamic_share_link/`)
    .auth(Authorization)
    .headers({
      'X-Platform': '7',
    })
    .post({
      url: getLocoNowUrl,
    })
    .json((json) => {
      return json.share_link_v2 || json.share_link || null
    })
    .catch((error) => {
      handleEventCapture(
        `${serverUrlv1}/dynamic-share-link/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const getShortUrl = async (params: any) => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/create_short_url/`)
    .auth(Authorization)
    .formData(params)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/create_short_url/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export interface updateChatSettingsParams {
  stream_key: string
  slow_mode_time?: number
  chat_mode?: number
  sticker_chat_enable?: number
}
export const updateChatSettings = async (params: updateChatSettingsParams) => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/update/chat_config/`)
    .auth(Authorization)
    // .formData(params)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/update/chat_config/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

//payments apis

export const validateConvertBeans = async (params: {
  beans: string | number
}) => {
  const Authorization = getAccessToken()
  const beans = Number(params.beans)
  const result = await fetchWithAllErrorHandle
    .url(`${yenUrlv1}/streamer/convert/beans/validate/`)
    .auth(Authorization)
    // .formData(params)
    .post({ beans })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${yenUrlv1}/streamer/convert/beans/validate/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const convertBeansToDiamond = async (params: {
  beans: string | number
}) => {
  const Authorization = getAccessToken()
  const beans = Number(params.beans)
  const result = await fetchWithAllErrorHandle
    .url(`${yenUrlv1}/streamer/convert/beans/`)
    .auth(Authorization)
    // .formData(params)
    .post({ beans })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${yenUrlv1}/streamer/convert/beans/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const validateWithdrawBeans = async (params: {
  beans: string | number
}) => {
  const Authorization = getAccessToken()
  const beans = Number(params.beans)
  const result = await fetchWithAllErrorHandle
    .url(`${yenUrlv1}/streamer/withdraw/beans/validate/`)
    .auth(Authorization)
    // .formData(params)
    .post({ beans })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${yenUrlv1}/streamer/withdraw/beans/validate/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const withdrawBeansDetails = async (params: {
  beans: string | number
}) => {
  const Authorization = getAccessToken()
  const beans = Number(params.beans)
  const result = await fetchWithAllErrorHandle
    .url(`${yenUrlv1}/streamer/withdraw/beans/`)
    .auth(Authorization)
    // .formData(params)
    .post({ beans })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${yenUrlv1}/streamer/withdraw/beans/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const newWithdrawBeansDetails = async () => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${storeUrlv2}/streamer/withdraw/beans/`)
    .auth(Authorization)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${yenUrlv1}/streamer/withdraw/beans/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const withdrawBeansRequest = async (params: {
  beans: string | number
  code: string | number
}) => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${yenUrlv1}/streamer/withdraw/request/`)
    .auth(Authorization)
    // .formData(params)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${yenUrlv1}/streamer/withdraw/request/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const convertBeansToMoney = async (code: number) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${storeUrlv2}/streamer/withdraw/request/`)
    .auth(Authorization)
    .post({ code })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${storeUrlv2}/streamer/withdraw/request/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
//manage accounts
export const getAllAccounts = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${paymentsUrlv3}/manage-accounts/`)
    .headers({
      'X-AUTH-TOKEN': Authorization,
    })
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${paymentsUrlv3}/manage-accounts/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const deleteAccount = async (params: { code: string | number }) => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${paymentsUrlv3}/deactivate/profile/`)
    .headers({
      'X-AUTH-TOKEN': Authorization,
    })
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${paymentsUrlv3}/deactivate/profile/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

//wallet
export const postWalletDetails = async (params: { code: string | number }) => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${paymentsUrlv3}/wallet-detail/`)
    .headers({
      'X-AUTH-TOKEN': Authorization,
    })
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${paymentsUrlv3}/wallet-detail/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
//otp apis
export interface postSendOtpParams {
  phone_number: string
  country_code: string
  withdrawal_category_code: number | string
}
export const postSendOtp = async (params: postSendOtpParams) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${paymentsUrlv3}/link/withdraw-wallet/send-otp/`)
    .headers({
      'X-AUTH-TOKEN': Authorization,
    })
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${paymentsUrlv3}/link/withdraw-wallet/send-otp/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const postVerifyOtp = async (params: postSendOtpParams) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${paymentsUrlv3}/link/withdraw-wallet/verify-otp/`)
    .headers({
      'X-AUTH-TOKEN': Authorization,
    })
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${paymentsUrlv3}/link/withdraw-wallet/verify-otp/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
//upi
export const getUpiDetails = async () => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${paymentsUrlv3}/upi-detail/`)
    .headers({
      'X-AUTH-TOKEN': Authorization,
    })
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${paymentsUrlv3}/upi-detail/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const postUpiDetails = async (params: {
  upi_id: string
  re_upi_id: string
}) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${paymentsUrlv3}/upi-detail/`)
    .headers({
      'X-AUTH-TOKEN': Authorization,
    })
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${paymentsUrlv3}/upi-detail/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
//bank
export const getBankDetails = async () => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${paymentsUrlv3}/bank-detail/`)
    .headers({
      'X-AUTH-TOKEN': Authorization,
    })
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${paymentsUrlv3}/bank-detail/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export interface BankDetailsParams {
  name: string
  account_number: string
  re_account_number: string
  address: string
  phone_number: string
  ifsc: string
}

export const postBankDetails = async (params: BankDetailsParams) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${paymentsUrlv3}/bank-detail/`)
    .headers({
      'X-AUTH-TOKEN': Authorization,
    })
    .post({ ...params })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${paymentsUrlv3}/bank-detail/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const getIfscDetails = async (ifscCode: string) => {
  const result = await fetchWithAllErrorHandle
    .url(`https://ifsc.razorpay.com/${ifscCode}`)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `https://ifsc.razorpay.com/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

//kyc
// export const getKycDetails = async () => {
//   const Authorization = getAccessToken();
//   const url = `${paymentsUrl3}/kyc-detail/`;

//   const result = await fetchWithAllErrorHandle
//     .url(url)
//     .headers({
//       'X-AUTH-TOKEN': Authorization,
//     })
//     .get()
//     .error(429, err => {
//       let message;
//       try {
//         message = err?.message
//           ? JSON.parse(err.message)?.message
//           : 'Failed to Fetch Api';
//       } catch (err) {
//         message = 'Multiple request have been encountered.';
//       }
//       return {
//         statusCode: 429,
//         message: message,
//       };
//     })
//     .json(json => {
//       return json;
//     })
//     .catch(error => {
//       handleEventCapture(
//         url,
//         error?.message ? error?.message : 'Failed to Fetch Api'
//       );
//       return error;
//     });
//   return result;
// };

export interface kycDetailsParamsInterface {
  front_pan: any
  user_uid?: string
  pan_number: string
  full_name: string
  fathers_name: string
  dob: string
}

export const postKycDetails = async (params: kycDetailsParamsInterface) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${paymentsUrlv3}/kyc-detail/`)
    .headers({
      'X-AUTH-TOKEN': Authorization,
    })
    .formData(params)
    .post()
    .error(429, (err) => {
      let message
      try {
        message = err?.message
          ? JSON.parse(err.message)?.message
          : 'Failed to Fetch Api'
      } catch (err) {
        message = 'Multiple request have been encountered.'
      }
      return {
        statusCode: 429,
        message: message,
      }
    })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${paymentsUrlv3}/kyc-detail/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

// quiz & poll

export const getSentQuestions = async (currentStreamId: string) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/instream/${currentStreamId}/ `
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const getClosedQuestions = async (
  currentStreamId: string,
  next: string | null
) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1.substring(0, ivoryUrlv1.length - 3)}${
    next ? next : `/v1/instream/${currentStreamId}/results/`
  }`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export interface postQuizAndPolltQuestionParamsInterface {
  question?: string
  options?: any
  correctAnswer?: string
  questionType?: number
  duration?: number
}

export const postQuizAndPolltQuestion = async (
  currentStreamId: string,
  params: postQuizAndPolltQuestionParamsInterface
) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/instream/${currentStreamId}/ `
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const updateQuizAndPolltQuestion = async (
  currentStreamId: string,
  questionUid: string,
  params: postQuizAndPolltQuestionParamsInterface
) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/instream/${currentStreamId}/${questionUid}/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const getPollAndQuestionStatus = async (currentStreamId: string) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/instream/${currentStreamId}/status/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

//lookback 2020
export const getLookback = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/lookback2020/ `)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/lookback2020/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

// incentive plans

//ttable data
export const getTableData = async () => {
  const Authorization = getAccessToken()
  const url = `${yenUrlv1}/incentive/all/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
//calculate hours
export const postCalculateIncentive = async (params: {
  live_watch_hour: number
}) => {
  const Authorization = getAccessToken()
  const url = `${yenUrlv1}/incentive/beans-value/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getIncentiveData = async () => {
  const Authorization = getAccessToken()
  const url = `https://ivory.getloconow.com/v3/dashboard/performance/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getPerformanceData = async () => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/performance/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getGivewayDetailsApi = async (streamUid: string) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/giveaway/${streamUid}/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const selectRandowGivewayWinnerDetailsApi = async (
  streamUid: string
) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/giveaway/${streamUid}/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const confirmSelectGivewayWinnerApi = async (streamUid: string) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/giveaway/${streamUid}/confirm/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

interface BlockUserInterface {
  user_uid: string
  stream_id: any
  timeout?: number
  reason?: string
  block_chats?: number
}

export const blockUser = async (params: BlockUserInterface) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/moderator/user/block/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post({ reason: 'Improper language', ...params })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      if (error instanceof Error) {
        const message = error.message || 'Failed to Fetch Api'
        // @ts-ignore
        const statusCode = error?.code || '000'
        error = {
          statusCode,
          message,
        }
      }
      return error
    })

  return result
}

interface deleteUserMessageInterface {
  chat_id: string
  stream_uid: string
}

export const deleteUserMessage = async (params: deleteUserMessageInterface) => {
  const Authorization = getAccessToken()
  const url = `${chatUrlv2}/streams/${params.stream_uid}/delete/chat/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .headers({
      'X-CLIENT-ID': clientID!,
      'X-CLIENT-SECRET': clientSecret!,
      'X-PLATFORM': '7',
    })
    .post({ ...params })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })

  return result
}

interface SIPTermsandAgreementParams {
  aggrement_bool: boolean
}

export const SIPTermsandAgreement = async (
  params: SIPTermsandAgreementParams
) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/sip/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })

  return result
}

export const beansWalletError = async () => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/error_group/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getBlockedUsers = async (params: any | null) => {
  const Authorization = getAccessToken()
  let url = `${ivoryUrlv1}/dashboard/moderator/blocked_users/?limit=24&block_type=10`
  if (params) {
    url = `${url}&${params}`
  }
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })

  return result
}

export const referralPost = async (params: any) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/profile/referral/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })

  return result
}

interface UnblockParams {
  viewer_user_uid: string
}

export const unBlockUser = async (params: UnblockParams) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/block/remove/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })

  return result
}

export const referralGet = async () => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/profile/referral/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })

  return result
}

export const requestLeaderboard = async () => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryBaseUrl}/v1/leaderboard/feature_request/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      const result = json.state
      return result
    })
    .catch((error) => {
      handleEventCapture(`${ivoryUrlv1}/v1/leaderboard/feature_request/`, error)
      return error
    })
  return result
}

export const getVODDownloadInfo = async (all_stream_id: string[]) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/dashboard/download/info/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization!)
    .post({
      all_stream_id,
    })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
    })
  return result
}

export const getStreamHealth = async (stream_id: string) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/stream/${stream_id}/health/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/stream/${stream_id}/health/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const viewerLeaderboardPermissions = async () => {
  const Authorization = getAccessToken()
  if (Authorization) {
    const result = await fetchWithAllErrorHandle
      .url(`${ivoryUrlv1}/dashboard/permissions/`)
      .auth(Authorization!)
      .get()
      .json((json) => {
        const result = json.data
        return result
      })
      .catch((error) => {
        handleEventCapture(`${ivoryUrlv1}/dashboard/permissions/`, error)
        return error
      })
    return result
  }
  return false
}

export const strapiDetails = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${strapiUrl}/changelogs/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${strapiUrl}/changelogs/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const sendMessageApi = async ({ streamId, params }: any) => {
  const url = new URL(`${chatUrlv2}/streams/${streamId}/chat/?send=true`)

  const authToken = localStorage.getItem('access_token') as string
  const result = await fetchWithAllErrorHandle
    .url(url.href)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'X-CLIENT-ID': clientID!,
      'X-CLIENT-SECRET': clientSecret!,
      'X-PLATFORM': '7',
    })
    .auth(authToken)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      return error
    })
  return result
}

export const getChatData = async (streamID: string) => {
  const url = `${chatUrlv2}/streams/${streamID}/streamer/chat/?get=true`
  const token = localStorage.getItem('access_token')
  const result = await fetchWithAllErrorHandle
    .url(url)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'X-CLIENT-ID': clientID!,
      'X-CLIENT-SECRET': clientSecret!,
      'X-PLATFORM': '7',
    })
    .auth(token!)
    .get()
    .error(404, () => {
      return []
    })
    .error(403, () => {
      return []
    })
    .json((json) => {
      return json
    })
    .catch((error) => {
      return error
    })
  return result
}
interface ChatMessageAttributes {
  username_text_color: string
  username_text_weight: number
  chat_text_color: string
  chat_text_weight: number
  diamond_sticker_bg_attributes?: {
    border: {
      color: string
      fill_type: string
      gradient: {
        end_color: string
        start_color: string
      }
    }
    shadow: {
      color: string
      fill_type: string
      gradient: {
        end_color: string
        start_color: string
      }
    }
    content_box: {
      color: string
      fill_type: string
      gradient: {
        end_color: string
        start_color: string
      }
    }
  }
}
export interface IOptimisticDataResp {
  badge_thumbnails?: string[] | []
  self_chat_attributes?: ChatMessageAttributes
}
export const getOptimisticChatData = async (
  stream_id: string
): Promise<IOptimisticDataResp | undefined> => {
  const token = getAccessToken()
  const url = new URL(`${taskServerUrl}/reward/chat/profile/me/v1/`)
  url.searchParams.append('stream_id', stream_id)
  const result = await fetchWithAllErrorHandle
    .url(url.href)
    .auth(token!)
    .get()
    .json((json) => json)
    .catch((error) => error)

  return result
}

export interface IUserProfileChatData {
  header_bg_color?: string
  user_id?: string
  bio?: string
  badges?:
    | {
        reward_id: string
        reward_name: string
        icon: string
        times_earned: number
      }[]
    | []
  username?: string
  thumbnail_url?: string
  username_badge_thumbnails?: string[]
  badge_replacement_text?: string
  footer_text?: string
  is_quest_active?: boolean
  is_mod?: boolean
}
export const getUserProfileChatData = async (
  stream_id: string,
  user_id: string
): Promise<IUserProfileChatData> => {
  const token = getAccessToken()
  const url = new URL(`${ivoryBaseUrl}/quests/reward/profile/v1/`)
  url.searchParams.append('stream_id', stream_id)
  url.searchParams.append('user_id', user_id)
  const result = await fetchWithAllErrorHandle
    .url(url.href)
    .auth(token!)
    .get()
    .json((json) => json)
    .catch((error) => error)

  return result
}

export const languages = async () => {
  const SERVER =
    process.env.REACT_APP_ENV === 'production'
      ? 'https://api.getloconow.com/v4'
      : 'https://dev.getloconow.com/v4'
  const result = await fetchWithAllErrorHandle
    .url(`${SERVER}/options/?option_type=language&filter=is_stream_language`)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${SERVER}/options/?option_type=language`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getCountries = async () => {
  const SERVER =
    process.env.REACT_APP_ENV === 'production'
      ? 'https://api.getloconow.com/v1'
      : 'https://dev.getloconow.com/v1'
  const result = await fetchWithAllErrorHandle
    .url(`${SERVER}/options/?option_type=country`)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${SERVER}/options/?option_type=country`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
export const isUploadDone = async (streamUID: string | null) => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/${streamUID}/upload_done/`)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'X-PLATFORM': '7',
    })
    .auth(Authorization!)
    .post()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/dashboard/${streamUID}/upload_done`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const updateGratitudeMessage = async (
  message_id: string,
  status: string
) => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/lookback/gratitude-messages/update`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization!)
    .post({
      message_id,
      status,
    })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getGratitudeMessage = async () => {
  const Authorization = getAccessToken()
  const url = `${ivoryUrlv1}/lookback/gratitude-messages?type=streamer`

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export interface uploadClipParams {
  game_id?: string
  title: string
  description: string
  duration?: number
  tags?: string[]
  upload_platform?: string
}

export const uploadClip = async (params: uploadClipParams) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/clips/moderation/`)
    .auth(Authorization!)
    .post(params)
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/clips/moderation/`,
        error?.message ? error.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const userClips = async (next?: string) => {
  const Authorization = getAccessToken()
  const url = next
    ? `${ivoryUrlv1}/clips/me/?offset=${next}`
    : `${ivoryUrlv1}/clips/me/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const moderationClips = async (next?: string) => {
  const Authorization = getAccessToken()

  const pointUrl = ivoryBaseUrl
  const url = next
    ? `${pointUrl}${next}`
    : `${pointUrl}/v1/clips/moderation/status/?limit=10`

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const deleteLiveClip = async (clipID: string) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/clips/delete/`)
    .auth(Authorization!)
    .post({ stream_id: clipID })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/clips/delete/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const deleteProcessingClip = async (clipID: string) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/clips/moderation/delete/`)
    .auth(Authorization!)
    .post({ clip_id: clipID })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/clips/moderation/delete/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const retryUploadingClip = async (clipID: string) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/clips/moderation/retry/`)
    .auth(Authorization!)
    .post({ clip_id: clipID })
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/clips/moderation/retry/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const getVipLeaderboardRanks = async ({
  streamer_uid,
  board_type,
  leaderboard_offset,
  limit,
}: // offset,
{
  streamer_uid: string
  board_type: number
  leaderboard_offset: number
  limit: number
  // offset: number
}) => {
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(
      `${ivoryUrlv1}/leaderboard/vip/paginated/${streamer_uid}/?leaderboard_type=${board_type}&leaderboard_offset=${leaderboard_offset}&limit=${limit}`
    )
    .headers({
      Authorization: Authorization,
    })
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${ivoryUrlv1}/leaderboard/vip/paginated/TGDANZM19U/?leaderboard_type=10&leaderboard_offset=${leaderboard_offset}&limit=10`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const vipLeaderboardPermissions = async () => {
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(`${ivoryUrlv1}/dashboard/config/`)
    .auth(Authorization!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(`${ivoryUrlv1}/dashboard/config/`, error)
      return error
    })
  return result
}

export const getProfileInfo = async () => {
  const Authorization = getAccessToken()
  if (Authorization) {
    const result = await fetchWithAllErrorHandle
      .url(`${serverUrlv3}/user/profile_info/`)
      .headers({
        'Content-Type': 'application/json',
        'X-PLATFORM': '7',
      })
      .auth(Authorization!)
      .get()
      .json((json) => {
        return json
      })
      .catch((error) => {
        handleEventCapture(`${serverUrlv3}/user/profile_info/`, error)
        return error
      })
    return result
  }
  return false
}

export const getPlayBackUrl = async (streamId: string) => {
  const URL_TO_CALL = `${drmUrlv1}/streams/playback/?stream_uid=${streamId}`
  const Authorization = getAccessToken()
  let apiResponse: any
  try {
    const playbackDetails = await fetch(`${URL_TO_CALL}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: Authorization!,
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
      },
    })
    const textApiResponse = await playbackDetails.text()
    try {
      apiResponse = JSON.parse(textApiResponse)
    } catch (error) {
      apiResponse = null
    }
    // !200 response from DRM api
    if (!playbackDetails.ok) {
      throw { code: playbackDetails.status, message: textApiResponse || '' }
    }
    return { status: playbackDetails.status, data: apiResponse }
  } catch (error) {
    return {
      // @ts-ignore
      status: error?.code,
      // @ts-ignore
      error_message: error?.message,
      data: apiResponse,
    }
  }
}

export const checkIsTermsAcceptedByUser = async () => {
  const Authorization = getAccessToken()
  if (Authorization) {
    const result = await fetchWithAllErrorHandle
      .url(`${ivoryUrlv1}/dashboard/show_tnc/`)
      .headers({
        'Content-Type': 'application/json',
        'X-PLATFORM': '7',
      })
      .auth(Authorization!)
      .get()
      .json((json) => json)
      .catch((error) => {
        handleEventCapture(`${ivoryUrlv1}/dashboard/show_tnc/`, error)
        return error
      })
    return result
  }
  return false
}

export const checkIs2faCompleted = async () => {
  const Authorization = getAccessToken()
  if (Authorization) {
    const result = await fetchWithAllErrorHandle
      .url(`${serverUrlv3}/user/is_2fa_complete/`)
      .headers({
        'Content-Type': 'application/json',
        'X-PLATFORM': '7',
      })
      .auth(Authorization!)
      .get()
      .json((json) => json)
      .catch((error) => {
        handleEventCapture(`${serverUrlv3}/user/is_2fa_complete/`, error)
        return error
      })
    return result
  }
  return false
}

export const postTermsAcceptedByUser = async () => {
  const Authorization = getAccessToken()
  if (Authorization) {
    const result = await fetchWithAllErrorHandle
      .url(`${serverUrlv3}/streamer/accept_tnc/`)
      .headers({
        'Content-Type': 'application/json',
        'X-PLATFORM': '7',
      })
      .auth(Authorization!)
      .post({})
      .json((json) => json)
      .catch((error) => {
        handleEventCapture(`${serverUrlv3}/streamer/accept_tnc/`, error)
        return error
      })
    return result
  }
  return false
}
