import { ivoryUrlv1, ivoryUrlv2 } from '@src/constent'
import { handleEventCapture } from '@src/utils/sentryEventCapture'

import {
  AffiliateData,
  MonetisationState,
} from '../../modules/Monetisation/types'
import { fetchWithAllErrorHandle, getAccessToken } from './helper'

export const fetchAffiliateData = async (): Promise<{
  data: AffiliateData
}> => {
  const url = `${ivoryUrlv2}/dashboard/monetization/data/`
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

export const fetchHasAcceptedTermsData = async (): Promise<{
  has_user_accepted_monetization_tnc: boolean
  tier: MonetisationState['tier']
}> => {
  const url = `${ivoryUrlv1}/dashboard/monetization/`
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

export const updateUserTermsForMonetisation = async (): Promise<{
  success: boolean
  tier: MonetisationState['tier']
}> => {
  const url = `${ivoryUrlv1}/dashboard/monetization/`
  const Authorization = getAccessToken()

  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post({})
    .json((json) => {
      return { ...json, _status: 'SUCCESS' }
    })
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

  return {
    success: result?._status === 'SUCCESS',
    tier: result?.user_details?.monetization_tier,
  }
}
