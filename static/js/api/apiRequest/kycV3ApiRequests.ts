import { IBankFormData } from '@src/modules/KycFlowV3/constants_kycv3'
import { handleEventCapture } from '@utils/sentryEventCapture'

import { ID_WALL_API_AUTHORISATION, ID_WALL_URL } from '../../constent'
import { serverUrlv1, serverUrlv3, serverUrlv4 } from '../../constent'
import {
  fetchWithAllErrorHandle,
  // GET_FE_CAHCE_KEY,
  getAccessToken,
} from './helper'

export const getKycDetails_v4 = async () => {
  const url = `${serverUrlv4}/kyc/profile/`
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

  return result as any
}

export const AddKycTaxIdForm = async (params: any) => {
  const url = `${serverUrlv3}/kyc/profile/`
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

export const EditKycTaxIdForm = async (params: any) => {
  const url = `${serverUrlv3}/kyc/profile/edit/`
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

export const addBankAccountBrazil = async (params: IBankFormData) => {
  const url = `${serverUrlv4}/kyc/bank_account/add/`
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

export const editBankAccountBrazil = async (params: IBankFormData) => {
  const url = `${serverUrlv1}/kyc/bank_account/update/`
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .patch(params)
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

// sdk token is send to BE
// BE calls create profile api of idwall
// that will map user id to sdk token
// from that user id saved image id will be fetched by BE
export const createIDwallProfile = async ({
  sdkToken,
  cpf,
}: {
  sdkToken: string
  cpf: string
}) => {
  const url = `${serverUrlv1}/kyc/idwall/profile/`
  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .post({ sdkToken: sdkToken, cpf: cpf })
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

  return result as {
    image_id: string[]
    status: string
    last_flow_id?: string
  }
}

export const updateIDwallProfile = async ({
  sdkToken,
  cpf,
}: {
  sdkToken: string
  cpf: string
}) => {
  const url = `${serverUrlv1}/kyc/idwall/profile/update/`

  const Authorization = getAccessToken()
  const result = await fetchWithAllErrorHandle
    .url(url)
    .auth(Authorization)
    .put({ sdkToken: sdkToken, cpf: cpf })
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

  return result as {
    image_id: string[]
    status: string
    last_flow_id?: string
  }
}

export const getPresignedUrl = async (imageId: string) => {
  const url = `${serverUrlv4}/kyc/document/upload/TaxID/presignedURL/?image_id=${imageId}`
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

  return result as {
    presigned_url: string
    status: string
  }
}
export const getImageFromIdwall = async (id: string): Promise<File | null> => {
  const url = `${ID_WALL_URL}/files/${id}`
  const Authorization = ID_WALL_API_AUTHORISATION

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization,
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch image from IDWall')
    }

    const blob = await response.blob()
    return new File([blob], 'idwall-image.jpg', { type: 'image/jpeg' })
  } catch (error) {
    handleEventCapture(
      url,
      error instanceof Error ? error.message : 'Failed to fetch image'
    )
    return null
  }
}

export const triggerIdWallKycVerificationFlow = async (
  profileRef: string,
  flowId: string
): Promise<boolean> => {
  const url = `${ID_WALL_URL}/maestro/profile/${profileRef}/flow/${flowId}`
  const Authorization = ID_WALL_API_AUTHORISATION

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization,
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to trigger IDWall KYC verification flow')
    }

    return true
  } catch (error) {
    handleEventCapture(
      url,
      error instanceof Error
        ? error.message
        : 'Failed to trigger IDWall KYC verification flow'
    )
    return false
  }
}

export const getIdWallProfileDetails = async (
  profileRef: string
): Promise<any> => {
  const url = `${ID_WALL_URL}/maestro/profile/${profileRef}/?lastFaceImage=false`
  const Authorization = ID_WALL_API_AUTHORISATION

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization,
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      handleEventCapture(url, 'Failed to fetch IDWall profile details')
      throw new Error('Failed to fetch profile details')
    }

    const data = await response.json()
    return data
  } catch (error) {
    handleEventCapture(
      url,
      error instanceof Error
        ? error.message
        : 'Failed to fetch IDWall profile details'
    )
    return null
  }
}

export const uploadKycImage = async (
  url: string,
  file: File
): Promise<boolean | null> => {
  const Authorization = getAccessToken()
  if (!Authorization) return null

  try {
    const arrayBuffer = await file.arrayBuffer()
    const response = await fetch(url, {
      method: 'PUT',
      body: arrayBuffer,
    })
    return response.ok
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getKycStatus = async () => {
  const url = `${serverUrlv1}/kyc/profile/status/`
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

  return result as { kyc_status: string }
}
