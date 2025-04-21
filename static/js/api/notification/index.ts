import { moonUrlv2 } from '../../constent'
import { handleEventCapture } from '../../utils/sentryEventCapture'
import { fetchWithAllErrorHandle, getAccessToken } from '../apiRequest'

export const getNotificationInfo = async () => {
  const Authorization = getAccessToken()
  const url = `${moonUrlv2}/trigger/profile/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .headers({
      accesstoken: Authorization,
    })
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

export enum whatsppNotificationInfoStatus {
  DEFAULT = 0,
  NOTIFON = 10,
  NOTIFOFF = 20,
  ADDPHONENUMBER = 30,
  INTERNATIONALNUMBER = 40,
}

export enum emailNotificationInfoStatus {
  DEFAULT = 0,
  NOTIFON = 10,
  NOTIFOFF = 20,
}

export interface commonNotificationInfoParams {
  whatsapp_status: boolean
  email_status: boolean
}

export interface updateNotificationInfoParams {
  flag: whatsppNotificationInfoStatus | emailNotificationInfoStatus
  channel: string
  onFailed?: () => void
}
export const updateNotificationInfo = async ({
  channel,
  flag,
}: updateNotificationInfoParams) => {
  const Authorization = getAccessToken()
  const url = `${moonUrlv2}/trigger/toggle/channel/`

  const result = await fetchWithAllErrorHandle
    .url(url)
    .headers({
      accesstoken: Authorization,
    })
    .post({
      channel,
      flag,
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
