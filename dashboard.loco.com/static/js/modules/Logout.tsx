import {
  getAccessToken,
  getRefreshToken,
  streamerLogout,
} from '@api/apiRequest'
import { resetAmplitudeSession } from '@utils/Amplitude/amplitude'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
  setAccessToken,
  setLinkedGmail,
  setLinkedPhoneNumber,
  setPreviousVisit,
  setRefreshToken,
} from '../app/appSlice'
import { RootState } from '../app/RootReducer'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../utils/Amplitude'
import { setDefaultStreamDetailsSuccess } from './DefaultStream/streamDetailsSlice'
import {
  setMeSuccess,
  setNotifPhoneNumber,
  setWhatsappNotifStatus,
} from './Login/loginSlice'

export const Logout = () => {
  const dispatch = useDispatch()
  // const history = useHistory();
  const { previousVisit } = useSelector((state: RootState) => state.app)

  React.useEffect(() => {
    const Authorization = getAccessToken()
    const refreshToken = getRefreshToken()
    ;(async () => {
      if (Authorization && refreshToken)
        await streamerLogout({
          refresh_token: refreshToken,
          access_token: Authorization,
        })
    })()

    handleEventDashboardLogout()
    dispatch({ type: 'USER_LOGOUT' })
    dispatch(setPreviousVisit('login'))
    dispatch(setAccessToken(''))
    dispatch(setRefreshToken(''))
    dispatch(setMeSuccess(''))
    dispatch(setNotifPhoneNumber(null))
    dispatch(setWhatsappNotifStatus(null))
    dispatch(setDefaultStreamDetailsSuccess(''))
    dispatch(setLinkedGmail(null))
    dispatch(setLinkedPhoneNumber(null))

    const showNewFeatureFlag = localStorage.getItem('newFeatureFlag')
    const tnc = localStorage.getItem('terms_condition_modal_2023')
    localStorage.clear()
    tnc && localStorage.setItem('terms_condition_modal_2023', tnc)
    !!showNewFeatureFlag && localStorage.setItem('newFeatureFlag', 'true')
    resetAmplitudeSession()
    // history.replace('/');
  }, [])
  const handleEventDashboardLogout = () => {
    const eventProperties: eventPropsTypes.dashboard_logout_props = {
      platform: eventConstants.platform,
      source_name: previousVisit,
    }
    eventActions.sendAmplitudeData(
      eventConstants.dashboard_logout,
      eventProperties
    )
  }
  return <Redirect to="/login" />
}
export default Logout
