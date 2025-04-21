import { handleEventCapture } from '@utils/sentryEventCapture'

import { serverUrlv3, yenUrlv1 } from '../../constent'
import { fetchWithAllErrorHandle, getAccessToken } from './helper'

export const fetchHypervergeToken = async () => {
  const url = `${serverUrlv3}/kyc/hyperverge/token/`
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => json)
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })

  if (
    result instanceof Error ||
    !result ||
    typeof result?.statusCode === 'number'
  ) {
    throw result || new Error('Something went wrong')
  }
  return result
}

export const getKycPrompt = async () => {
  const url = `${yenUrlv1}/streamer/kyc/prompt/`
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
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
    .json((json) => json)
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  if (
    result instanceof Error ||
    !result ||
    typeof result?.statusCode === 'number'
  ) {
    throw result || new Error('Something went wrong')
  }
  return result
}

export const getKycDetails = async () => {
  const url = `${serverUrlv3}/kyc/profile/`
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .get()
    .json((json) => json)
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  if (
    result instanceof Error ||
    !result ||
    typeof result?.statusCode === 'number'
  ) {
    throw result || new Error('Something went wrong')
  }
  return result
}

export const UploadBankDocument = async (params: any) => {
  const url = `${serverUrlv3}/kyc/bank_account/add/`
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post(params)
    .json((json) => json)
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  if (
    result instanceof Error ||
    !result ||
    typeof result?.statusCode === 'number'
  ) {
    throw result || new Error('Something went wrong')
  }
  return result
}

export const UploadPanDocument = async (params: any) => {
  const url = `${serverUrlv3}/kyc/document/upload/`
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post(params)
    .json((json) => json)
    .catch((error) => {
      handleEventCapture(
        url,
        error?.message ? error?.message : 'Failed to Fetch Api'
      )
      return error
    })
  if (
    result instanceof Error ||
    !result ||
    typeof result?.statusCode === 'number'
  ) {
    throw result || new Error('Something went wrong')
  }
  return result
}
