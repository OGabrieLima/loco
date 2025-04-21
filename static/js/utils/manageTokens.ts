//@ts-nocheck

import {
  setAccessTokenToStoreAndLocal,
  setRefreshTokenToStoreAndLocal,
} from '../api/apiRequest'

const wait = (delay, ...args) =>
  new Promise((resolve) => setTimeout(resolve, delay, ...args))

// apirequest
export const getAccessToken = async () => {
  let accessToken = localStorage.getItem('access_token')
  if (accessToken === '' || !accessToken) {
    if (window?.DashboardInterface) {
      accessToken = window?.DashboardInterface?.getAccessToken()
    }
    if (window?.webkit?.messageHandlers?.getAccessToken) {
      window?.webkit?.messageHandlers?.getAccessToken?.postMessage(
        'getAccessToken'
      )
      await wait(400)
        .then(() => {
          accessToken = localStorage.getItem('ios_access_token')
        })
        .catch(() => {
          accessToken = localStorage.getItem('ios_access_token')
        })
    }
  }
  setAccessTokenToStoreAndLocal(accessToken)
  return accessToken || ''
}

export const getRefreshToken = async () => {
  let refreshToken = localStorage.getItem('refresh_token')
  if (refreshToken === '' || !refreshToken) {
    if (window?.DashboardInterface) {
      refreshToken = window?.DashboardInterface?.getRefreshToken()
    }
    if (window?.webkit?.messageHandlers?.getRefreshToken) {
      window?.webkit?.messageHandlers?.getRefreshToken?.postMessage(
        'getRefreshToken'
      )
      await wait(400)
        .then(() => {
          refreshToken = localStorage.getItem('ios_refresh_token')
        })
        .catch(() => {
          refreshToken = localStorage.getItem('ios_refresh_token')
        })
    }
  }
  setRefreshTokenToStoreAndLocal(refreshToken)
  return refreshToken || ''
}

export const removeAccessToken = (): void => {
  localStorage.removeItem('access_token')
  return
}

export const removeRefreshToken = () => {
  localStorage.removeItem('refresh_token')
  return
}

export const getFingerPrintToken = () => {
  const fingerprint = localStorage.getItem('fingerprint')
  return fingerprint
}

export const executeHandlers = () => {
  window.getAccessToken = (dataString) => {
    localStorage.setItem('ios_access_token', dataString)
  }
  window.getRefreshToken = (dataString) => {
    localStorage.setItem('ios_refresh_token', dataString)
  }
}
