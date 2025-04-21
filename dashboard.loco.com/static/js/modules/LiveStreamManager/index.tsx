import { Icon, useDisclosure, usePrevious } from '@chakra-ui/core'
import useSubscription from '@context/MqttConnetor/useSubscription'
import {
  fetchLiveModerators,
  fetchModerators,
  resetLiveModerators,
} from '@modules/Community/Moderator/moderatorSlice'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { batch, useDispatch, useSelector } from 'react-redux'

import { setPreviousVisit } from '../../app/appSlice'
import { RootState } from '../../app/RootReducer'
import MqttConnector from '../../context/MqttConnetor/Connector'
import WithToasts from '../../hoc/WithToasts'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../../utils/Amplitude'
import Container from './Components/Container'
import LeftColumn from './Components/LeftColumn'
import MiddleColumn from './Components/MiddleColumn'
import Mobile from './Components/Mobile'
import RightColumn from './Components/RightColumn'
import { StatusModal } from './Components/StreamPreview/StatusModal'
import {
  fetchCurrentLiveStream,
  setIsStreamEndedFromDashboard,
} from './LiveStreamManagerSlice'

const LiveStreamManagerContainer = React.memo(() => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { me } = useSelector((state: RootState) => state.login)
  const { currentLiveStreamDetails, isLive } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { isStreamSetupCompleted } = useSelector(
    (state: RootState) => state.streamDetails
  )
  useSubscription(`stream/${currentLiveStreamDetails?.uid}/notification`)
  const { visit_live_stream_manager } = eventConstants

  const [activityMsgs, setActivityMsgs] = useState([])

  const handleChatMsgs = (msgs: any) => {
    setActivityMsgs(msgs)
  }
  useEffect(() => {
    if (me?.user_uid && isStreamSetupCompleted) {
      batch(() => {
        dispatch(fetchCurrentLiveStream(me?.user_uid))
        dispatch(fetchModerators())
      })
    }
  }, [])

  useEffect(() => {
    handleVisitLiveStreamManager()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timer
    if (isLive) {
      timer = setInterval(() => {
        if (currentLiveStreamDetails?.uid) {
          dispatch(fetchLiveModerators(currentLiveStreamDetails?.uid))
        }
      }, 10000)
    }
    return () => {
      clearInterval(timer)
      dispatch(resetLiveModerators())
    }
  }, [isLive])

  const handleVisitLiveStreamManager = () => {
    const eventProperties: eventPropsTypes.visit_live_stream_manager_props = {
      video_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_type: me?.user_type,
      is_live: isLive,
    }
    const previousVisit = visit_live_stream_manager.split('visit_')[1]
    dispatch(setPreviousVisit(previousVisit))
    eventActions.sendAmplitudeData(visit_live_stream_manager, eventProperties)
  }
  return window.innerWidth > 650 ? (
    <Container
      title={t('manageLiveStream.title')}
      containerStyle={{
        isInline: true,
        justifyContent: 'space-between',
        px: [0, '10px'],
        spacing: 2,
        h: 'full',
        w: 'full',
        display: ['none', 'flex', 'flex'],
      }}
      dir="ltr"
    >
      <LeftColumn maxW={'33%'} />
      <MiddleColumn maxW={'33%'} activityMsgs={activityMsgs} />
      <RightColumn maxW={'33%'} handleChatMsgs={handleChatMsgs} />
    </Container>
  ) : (
    <Container
      title={t('manageLiveStream.title')}
      containerStyle={{
        isInline: false,
        justifyContent: 'flex-start',
        spacing: 0,
        h: 'full',
        w: 'full',
        mt: 0,
        display: ['flex', 'none', 'none'],
      }}
    >
      <Mobile activityMsgs={activityMsgs} handleChatMsgs={handleChatMsgs} />
    </Container>
  )
})
LiveStreamManagerContainer.displayName = 'LiveStreamManagerContainer'

const WithMqttConnector = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    currentLiveStreamDetails,
    isLive,
    isStreamEndedFromDashboard,
    streamInfraType,
  } = useSelector((state: RootState) => state.liveStreamManager)
  const dispatch = useDispatch()
  const prevIsLive = usePrevious(isLive)
  const onModalClose = () => {
    dispatch(setIsStreamEndedFromDashboard(false))
  }

  useEffect(() => {
    if (prevIsLive && !isLive && !currentLiveStreamDetails) {
      onModalClose()
      onOpen()
    }
  }, [isLive, currentLiveStreamDetails])

  useEffect(() => {
    if (currentLiveStreamDetails?.uid) {
      onClose()
    }
  }, [currentLiveStreamDetails?.uid])

  return (
    <>
      <MqttConnector>
        <LiveStreamManagerContainer />
      </MqttConnector>
      <StatusModal
        isOpen={isOpen}
        onClose={onClose}
        icon={
          <Icon
            //@ts-ignore
            name="connection_problem"
            size="auto"
            width={['36px', '72px']}
          />
        }
        title="manageLiveStream.streamEndedFromBackendModal.title"
        subTitle="manageLiveStream.streamEndedFromBackendModal.subtitle"
        shouldHideSubTitle={streamInfraType != 20}
      />
      <StatusModal
        isOpen={isStreamEndedFromDashboard}
        onClose={onModalClose}
        title="manageLiveStream.streamEndedFromDashboardModal.title"
        shouldHideSubTitle={true}
        cta={{
          title: 'manageLiveStream.streamEndedFromDashboardModal.ok',
          action: onModalClose,
        }}
      />
    </>
  )
}

const LiveStreamManager = () => <WithMqttConnector />
export default WithToasts(LiveStreamManager)
