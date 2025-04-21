import { setAccessToken, setRefreshToken } from '@app/appSlice'
import store from '@app/Store'
import { parseSelectedLanguage } from '@src/i18n/utils'
import { getFingerprint } from '@utils/fingerprint'
import { removeAccessToken, removeRefreshToken } from '@utils/manageTokens'
import { handleEventCapture } from '@utils/sentryEventCapture'
import i18next from 'i18next'
import wretch from 'wretch'

import { clientID, clientSecret, serverUrlv3 } from '../../constent'

const urlsToNotCallRefreshTokenApi = [
  '/user/google/signin/',
  '/user/signin-web',
  '/user/signin/',
  'api/v3/sidenav',
  '/api/v3/sidenav/',
  '/report/actions',
  '/reward/chat/profile/v1/',
  '/quests/reward/profile/me/v1/',
  '/reward/chat/config/v1/',
  '/replaychat/',
  '/signout',
]

const urlsToReplayRequest = [
  '/wallet/all/',
  '/profile/me/',
  '/profile/me/permissions/',
  '/user/me-profile',
  '/user/profile_info/',
  '/streams/playback/',
]

export const setAccessTokenToStoreAndLocal = (access_token: string) => {
  store.dispatch(setAccessToken(access_token))
  if (access_token) {
    window.localStorage.setItem('access_token', access_token)
  } else {
    window.localStorage.removeItem('access_token')
  }
}
export const setRefreshTokenToStoreAndLocal = (refresh_token: string) => {
  store.dispatch(setRefreshToken(refresh_token))
  if (refresh_token) {
    window.localStorage.setItem('refresh_token', refresh_token)
  } else {
    window.localStorage.removeItem('refresh_token')
  }
}

export const removeAccessTokenFromStoreAndLocal = () => {
  store.dispatch(setAccessToken(''))
  removeAccessToken()
}

export const removeRefreshTokenToStoreAndLocal = () => {
  store.dispatch(setRefreshToken(''))
  removeRefreshToken()
}

export const getAccessToken = () => store.getState().app.accessToken
export const getRefreshToken = () => store.getState().app.refreshToken

const delayMiddleware = (delay: number) => (next: any) => (
  url: any,
  opts: any
) => {
  return new Promise((res) => setTimeout(() => res(next(url, opts)), delay))
}

export const refreshTokenApi = async () => {
  const Authorization = getAccessToken()
  const refreshToken = getRefreshToken()
  const fingerprint = await getFingerprint()
  const params = {
    //@ts-ignore
    refresh_token: refreshToken!,
  }
  const result: any = await fetchWithAllErrorHandle
    .url(`${serverUrlv3}/user/refresh_token/`)
    .headers({
      Authorization: Authorization!,
      'DEVICE-ID': fingerprint,
      'X-PLATFORM': '7',
      'X-CLIENT-ID': clientID,
      'X-CLIENT-SECRET': clientSecret,
    })
    .post(params)
    .badRequest((error, originalRequest) => {
      handleEventCapture(
        originalRequest._url,
        error?.message
          ? JSON.parse(error.message).message
          : 'Failed to Fetch Api',
        400
      )
      window.location.replace('/logout')
    })
    .unauthorized((error, originalRequest) => {
      removeAccessTokenFromStoreAndLocal()
      removeRefreshTokenToStoreAndLocal()
      handleEventCapture(
        originalRequest._url,
        error?.message
          ? JSON.parse(error.message).message
          : 'Failed to Fetch Api',
        401
      )
    })
    .json((json) => {
      if (json.access_token && json.refresh_token) {
        setAccessTokenToStoreAndLocal(json.access_token)
        setRefreshTokenToStoreAndLocal(json.refresh_token)
      } else {
        removeAccessTokenFromStoreAndLocal()
        removeRefreshTokenToStoreAndLocal()
      }
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${serverUrlv3}/user/refresh_token/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}

export const fetchWithAllErrorHandle = wretch()
  .middlewares([
    (next) => (url, opts) => {
      const headers = {
        'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
        'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
        ...(opts.headers || {}), // Merge existing headers if any
      }
      return next(url, { ...opts, headers })
    },
  ])
  .catcher(400, (err, originalRequest) => {
    const error = err?.message ? JSON.parse(err.message) : {}
    if (originalRequest?._url?.includes('/streamer/profile/')) {
      if (
        err.message &&
        (error.message.toLowerCase() === 'country can be updated only once' ||
          error.message.toLowerCase() === 'timezone can be updated only once')
      ) {
        //@ts-ignore
        const originalBody = JSON.parse(originalRequest?._options.body)
        const updateBody = {
          ...originalBody,
          country: undefined, // so that mismatch can never happen
          timezone: undefined,
        }
        return originalRequest.post(updateBody).json()
      }
    }
    if (originalRequest?._url?.includes('/user/username_hai_kya/?username=')) {
      // do nothing
    } else {
      handleEventCapture(
        originalRequest._url,
        error.message || 'Failed to Fetch Api',
        400
      )
    }

    return {
      statusCode: 400,
      error_code: error.error_code || 400,
      message: error.message || 'Failed to Fetch Api',
    }
  })
  .catcher(401, async (error, originalRequest) => {
    const original_url = originalRequest?._url

    if (
      urlsToNotCallRefreshTokenApi.some((url) => original_url.includes(url)) ||
      (original_url.includes('/v2/streams') &&
        (original_url.includes('/chat') || // this /chat will work for send_sticker, send_message, delete_chat_by_moderater & chat_messages
          original_url.includes('/history')))
    ) {
      // We're not refreshing token here,
      // So if 401, means user direct logout.
      return error
    }

    // Try replaying these request one time wihtout making refresh_token
    if (urlsToReplayRequest.some((url) => original_url.includes(url))) {
      const originalRequestResult = await originalRequest
        .replay()
        .unauthorized(async (original_url_error) => {
          const result = await refreshTokenApi()
          if (result?.access_token) {
            return originalRequest
              .auth(result.access_token)
              .replay()
              .unauthorized((err) => {
                try {
                  throw JSON.parse(err.message)
                } catch (_err) {
                  throw err
                }
              })
              .json()
          }
          return original_url_error
        })
        .json((res) => res)
      return originalRequestResult
    }

    const result = await refreshTokenApi()
    if (result?.access_token) {
      return originalRequest
        .auth(result.access_token)
        .replay()
        .unauthorized((err) => {
          try {
            throw JSON.parse(err.message)
          } catch (_err) {
            throw err
          }
        })
        .json()
    }
    return error
  })
  .catcher(404, (err, originalRequest) => {
    if (originalRequest?._url?.includes('dashboard/get_user_settings/')) {
      // do nothing
    } else {
      handleEventCapture(
        originalRequest._url,
        err?.message ? JSON.parse(err.message).message : 'Failed to Fetch Api',
        404
      )
    }
    return {
      statusCode: 404,
      message: err?.message
        ? JSON.parse(err.message).message
        : 'Failed to Fetch Api',
    }
  })
  .catcher(403, (err, originalRequest) => {
    handleEventCapture(
      originalRequest._url,
      err?.message ? JSON.parse(err.message).message : 'Failed to Fetch Api',
      403
    )
    return {
      statusCode: 403,
      message: err?.message
        ? JSON.parse(err.message).message
        : 'Failed to Fetch Api',
    }
  })
  .catcher(408, (err, originalRequest) => {
    handleEventCapture(
      originalRequest._url,
      err?.message ? JSON.parse(err.message).message : 'Failed to Fetch Api',
      408
    )
    return {
      statusCode: 408,
      message: 'Timeout due to bad internet',
    }
  })
  .catcher(418, (error, originalRequest) => {
    handleEventCapture(
      originalRequest._url,
      error?.message
        ? JSON.parse(error.message).message
        : 'Failed to Fetch Api',
      418
    )
  })
  .catcher(422, (error, originalRequest) => {
    handleEventCapture(
      originalRequest._url,
      error?.message
        ? JSON.parse(error.message).message
        : 'Failed to Fetch Api',
      422
    )
    return {
      statusCode: 422,
      message: error?.message
        ? JSON.parse(error.message).message
        : 'Failed to Fetch Api',
    }
  })
  .catcher(429, (error, originalRequest) => {
    handleEventCapture(
      originalRequest._url,
      error?.message ? JSON.parse(error.message).message : 'Too Many Requests',
      429
    )
    return {
      statusCode: 429,
      message: 'Too many Requests. Please try after some time.',
    }
  })
  .catcher(500, (err, originalRequest) => {
    handleEventCapture(
      originalRequest._url,
      err?.message ? err.message : 'Failed to Fetch Api',
      500
    )
    const error = err?.message ? JSON.parse(err.message) : {}
    return {
      statusCode: 500,
      code: error.error_code || 500,
      message: error.message || 'Failed to Fetch Api',
    }
    // window.location.replace('/500');
  })
  .catcher(502, (err, originalRequest) => {
    handleEventCapture(originalRequest._url, 'Bad Gateway', 502)
    // window.location.replace('/500');
  })
  .catcher(503, (err, originalRequest) => {
    return (
      originalRequest
        //@ts-ignore
        .middlewares([delayMiddleware(1000)])
        //@ts-ignore
        .catcher(503, (err, nextRequest) => {
          try {
            return (
              nextRequest
                //@ts-ignore
                .middlewares([delayMiddleware(3000)])
                .replay()
                .json()
            )
          } catch (err_1) {
            handleEventCapture(
              originalRequest._url,
              err?.message ? err.message : 'Failed to Fetch Api',
              503
            )
            throw err_1
          }
        })
        .replay()
        .json()
    )
  })

const CACHE_KEY_MAP: {
  [key: string]: number
} = {}
export const GET_FE_CAHCE_KEY = (key?: string) => {
  const currentUserUid = store.getState().login.me?.user_uid
  const currentLang = parseSelectedLanguage(i18next.resolvedLanguage)
  key = '' + currentUserUid + currentLang + (key || '')
  let hash = 0,
    i,
    chr

  if (CACHE_KEY_MAP[key]) {
    return CACHE_KEY_MAP[key]
  }
  for (i = 0; i < key.length; i++) {
    chr = key.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  if (hash < 0) {
    hash = -hash
  }
  CACHE_KEY_MAP[key] = hash
  return hash
}
