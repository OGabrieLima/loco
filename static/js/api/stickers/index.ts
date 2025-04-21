import { fetchWithAllErrorHandle } from '@api/apiRequest'
import { StickerType } from '@modules/Stickers/stickerSlice'
import { getAccessToken } from '@utils/manageTokens'
import { handleEventCapture } from '@utils/sentryEventCapture'

import { yenUrlv1 } from '../../constent'

interface stickersByStatusParams {
  is_active: StickerType
  next?: string
}
export const stickersByStatus = async (params: stickersByStatusParams) => {
  const Authorization: string = await getAccessToken()
  const pointUrl = yenUrlv1
  const url = params.next
    ? `${pointUrl}/streamer/sticker/uploaded/all/?limit=10&is_active=${params.is_active}&offset=${params.next}`
    : `${pointUrl}/streamer/sticker/uploaded/all/?limit=10&is_active=${params.is_active}`
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

  // this is handle if next us having value but array is coming empty. This will solve pagination issue
  if (result?.results.length === 0 && result.next) {
    // Recursive call with updated params using next value
    const nextParams = { ...params, next: result.next }
    const nextResult = await stickersByStatus(nextParams)

    // Concatenate the results
    result.results = nextResult?.results
    result.next = nextResult?.next
  }

  return result
}
interface stickerUploadParams {
  name: string
  amount: number
}
export const stickerUpload = async (params: stickerUploadParams) => {
  const Authorization: string = await getAccessToken()
  const url = `${yenUrlv1}/streamer/sticker/upload/`
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
    })
  return result
}

export const stickerUploadCheck = async (stickerId: string) => {
  const Authorization: string = await getAccessToken()
  const url = `${yenUrlv1}/streamer/sticker/upload/check/`
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post({ stickerId })
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

interface editStickerParams {
  sticker_id: string
  amount?: number
  is_active: StickerType
}
export const editSticker = async (params: editStickerParams) => {
  const Authorization: string = await getAccessToken()
  const url = `${yenUrlv1}/streamer/sticker/update/`
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
    })
  return result
}

interface deleteStickerParams {
  sticker_id: string
}
export const deleteSticker = async (params: deleteStickerParams) => {
  const Authorization: string = await getAccessToken()
  const url = `${yenUrlv1}/streamer/sticker/delete/`
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
    })
  return result
}
