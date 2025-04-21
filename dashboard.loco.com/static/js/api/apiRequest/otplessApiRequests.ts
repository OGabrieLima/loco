import { OTPLESS_APP_ID } from '@src/modules/OtplessV3/constants'
import { getFingerprint } from '@utils/fingerprint'
import { handleEventCapture } from '@utils/sentryEventCapture'

import { clientID, clientSecret, serverUrlv3 } from '../../constent'
import {
  fetchWithAllErrorHandle,
  getAccessToken,
  removeAccessTokenFromStoreAndLocal,
  removeRefreshTokenToStoreAndLocal,
  setAccessTokenToStoreAndLocal,
  setRefreshTokenToStoreAndLocal,
} from './helper'

export const otplessSignIn = async (WaId: string) => {
  const params = { wa_id: WaId, app_id: OTPLESS_APP_ID }
  const fingerprint = await getFingerprint()
  const url = `${serverUrlv3}/user/otpless/signin/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'DEVICE-ID': fingerprint,
      'X-PLATFORM': '7',
      'X-CLIENT-ID': clientID,
      'X-CLIENT-SECRET': clientSecret,
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

export const otplessLinkPhone = async (WaId: string) => {
  const params = { wa_id: WaId, app_id: OTPLESS_APP_ID }
  const fingerprint = await getFingerprint()
  const url = `${serverUrlv3}/user/otpless/link_phone/`
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(url)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'DEVICE-ID': fingerprint,
      'X-PLATFORM': '7',
      'X-CLIENT-ID': clientID,
      'X-CLIENT-SECRET': clientSecret,
      Authorization,
    })
    .post(params)
    .json((json) => json)
    .catch((error) => {
      handleEventCapture(url, error)
      return error
    })
  return result
}
