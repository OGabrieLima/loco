import { RootState } from '@src/app/RootReducer'
import { isWebViewBuild } from '@src/constent'
import {
  fetchExperimentAmplitude,
  fetchExperimentLocalHost,
} from '@src/modules/experiment/experimentSlice'
import { getFingerprint } from '@src/utils/fingerprint'
import { useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as workerTimers from 'worker-timers'

export const useInitializeExperiment = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.login.me)
  const requestCountryCode = useSelector(
    (state: RootState) => state.app.requestCountryCode
  )
  const user_uid = user?.user_uid

  const getTimeOutDuration = () => {
    // wait for some time, if user_uid is not available
    const accessToken = localStorage?.getItem('access_token')

    if (!accessToken || accessToken === 'null') {
      return 0
    }

    return user_uid ? 150 : 5000
  }

  useEffect(() => {
    const initiateExperiment = async () => {
      const deviceId = await getFingerprint()
      const userParams = {
        user_id: user_uid || '',
        device_id: deviceId,
        user_properties: {
          user_id: user_uid || '',
          device_id: deviceId,
          app_country_name: requestCountryCode,
          app_platform: isWebViewBuild ? 'webview_dashboard' : 'web_dashboard',
        },
      }
      dispatch(fetchExperimentAmplitude(userParams))
    }
    const timer = workerTimers.setTimeout(() => {
      initiateExperiment()
    }, getTimeOutDuration())
    return () => {
      workerTimers.clearTimeout(timer)
    }
  }, [user_uid, requestCountryCode])

  useLayoutEffect(() => {
    dispatch(fetchExperimentLocalHost())
  }, [])
  return null
}
