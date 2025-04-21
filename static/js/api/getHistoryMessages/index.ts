import { chatUrlv2, clientID, clientSecret } from '../../constent'
import { handleEventCapture } from '../../utils/sentryEventCapture'
import { fetchWithAllErrorHandle } from '../apiRequest'

export const getHistoryMessages = async (stream_uid: string) => {
  const token = localStorage.getItem('access_token')
  const result = await fetchWithAllErrorHandle
    .url(`${chatUrlv2}/streams/${stream_uid}/streamer/history/`)
    .headers({
      'Content-Type': 'application/json;charset=utf-8',
      'X-CLIENT-ID': clientID!,
      'X-CLIENT-SECRET': clientSecret!,
      'X-PLATFORM': '7',
    })
    .auth(token!)
    .get()
    .json((json) => {
      return json
    })
    .catch((error) => {
      handleEventCapture(
        `${chatUrlv2}/streams/${stream_uid}/streamer/history/`,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  return result
}
