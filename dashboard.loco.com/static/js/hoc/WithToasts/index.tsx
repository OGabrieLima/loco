import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { RootState } from '../../app/RootReducer'
import { useCustomToast } from '../../components/customToast'
import {
  regex400Code,
  regex500Code,
  statusCode,
} from '../../constants/errorCodes'
import { paths } from '../../routers/constants'
import { setToasts } from './withToastsSlice'

export default function withToasts(Component: React.ComponentType) {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const history = useHistory()
    const toast = useCustomToast()
    const dispatch = useDispatch()
    const { toastOptions } = useSelector((state: RootState) => state.withToasts)
    const {
      app: { error: appError },
      login: { error: loginError },
      signup: { error: signupError },
      streamDetails: { error: streamDetailsError },
      analytics: { error: analyticsError },
      videos: { error: videosError, deleteError },
      wallet: { error: walletError, transcationLogError },
      liveStreamManager: { error: liveStreamManagerError },
    } = useSelector((state: RootState) => state)

    let error = appError?.statusCode
      ? appError
      : loginError?.statusCode
      ? loginError
      : streamDetailsError?.statusCode
      ? streamDetailsError
      : null
    if (Component.name === 'DefaultLiveStreamContainers') {
      error = streamDetailsError?.statusCode ? streamDetailsError : null
    }
    if (Component.name === 'LoginComponent') {
      error = appError?.statusCode ? appError : null
    }
    if (Component.name === 'SignUpComponent') {
      error = signupError?.statusCode ? signupError : null
    }
    if (Component.name === 'Dashboard') {
      error = analyticsError?.statusCode ? analyticsError : null
    }
    if (Component.name === 'VideoContainer' && videosError?.statusCode) {
      error = videosError?.statusCode ? videosError : null
    }
    if (Component.name === 'VideoContainer' && deleteError?.statusCode) {
      error = deleteError?.statusCode ? deleteError : null
    }
    if (Component.name === 'Wallet' && walletError?.statusCode) {
      error = walletError?.statusCode ? walletError : null
    }
    if (Component.name === 'Wallet' && transcationLogError?.statusCode) {
      error = transcationLogError?.statusCode ? transcationLogError : null
    }
    if (Component?.name === 'Transcations' && transcationLogError?.statusCode) {
      error = transcationLogError?.statusCode ? transcationLogError : null
    }
    if (Component?.name === 'LiveStreamManager') {
      error = liveStreamManagerError?.statusCode ? liveStreamManagerError : null
    }

    useEffect(() => {
      if (error) {
        handleStatusCode()
      }
    }, [error?.statusCode, error])

    useEffect(() => {
      if (toastOptions.title) {
        toast({ ...toastOptions })
        dispatch(
          setToasts({
            position: 'top',
            title: '',
            description: '',
            status: 'success',
            duration: 2000,
            isClosable: false,
          })
        )
      }
    }, [toastOptions, toastOptions.status])
    const handleStatusCode = () => {
      const result = { ...error }
      if (result.statusCode === 400 && Component.name === 'LoginComponent') {
        return
      }
      if (result.statusCode === 101) {
        history.push(paths.storageError, {
          title: result.title,
          message: result.message,
        })
      }
      if (regex500Code.test(result.statusCode)) {
        history.push(paths[500])
      }
      if (regex400Code.test(result.statusCode)) {
        const title = statusCode[result.statusCode]
        toast({
          position: 'top',
          title: title ? title : result?.message,
          description: title ? result?.message : undefined,
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }
    }
    return <Component {...props} />
  }
}
