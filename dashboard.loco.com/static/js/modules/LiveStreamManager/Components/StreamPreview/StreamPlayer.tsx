import { fetchStreamResponse, getPlayBackUrl } from '@api/apiRequest'
import { RootState } from '@app/RootReducer'
import { AspectRatioBox, Flex, Icon, Text } from '@chakra-ui/core'
import Loader from '@components/Loader/Loader'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as workerTimers from 'worker-timers'

import {
  setIsDisconnected,
  setIsDisconnectedModalOpen,
  setIsStreamEndedFromDashboard,
  setLiveStreamResponse,
} from '../../LiveStreamManagerSlice'
import IVSPlayer from '../ivsPlayer'
import { ReconnectingScreen } from './ReconnectingScreen'

const findDurationInSec = (from: number, to: number) => {
  const secDiff = (to - from) / 1000
  return Math.ceil(secDiff)
}

const StreamPlayer = () => {
  const {
    currentLiveStreamDetails,
    isLive,
    isDisconnected,
    streamInfraType,
    streamCoolDownTime,
  } = useSelector((state: RootState) => state.liveStreamManager)
  const created_at = parseInt(currentLiveStreamDetails?.created_at ?? '0')
  const [url, setUrl] = useState<string | undefined | null>()
  const [rewindUrl, setRewindUrl] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    const StreamId = currentLiveStreamDetails?.uid
    if (!StreamId) {
      setUrl(undefined)
      setRewindUrl('')
      return
    }
    const MakApiCall = async () => {
      if (!StreamId) return
      const { data: result } = ((await getPlayBackUrl(StreamId)) || {}) as any
      if (result?.playback_url && result?.extra_info && result?.rewind_url) {
        const newURL = new URL(result.playback_url)
        setUrl(newURL.href)
        setRewindUrl(result?.rewind_url)
      } else {
        // Using Old Code, If DRM Api Failed
        const _url = currentLiveStreamDetails?.conf?.hls
        const _rewindUrl = url?.replace('manifest', 'rewind') ?? ''
        setUrl(_url)
        setRewindUrl(_rewindUrl)
      }
    }
    const timerDelay = workerTimers.setTimeout(() => {
      MakApiCall()
    }, 100)

    const timerInterVal = workerTimers.setInterval(() => {
      StreamId && getPlayBackUrl(StreamId)
    }, 30 * 60 * 1000) // 30 minutes)
    return () => {
      workerTimers.clearTimeout(timerDelay)
      workerTimers.clearInterval(timerInterVal)
    }
  }, [currentLiveStreamDetails?.uid, isLive])

  useEffect(() => {
    if (currentLiveStreamDetails?.uid) {
      const StreamId = currentLiveStreamDetails?.uid
      const MakApiCall = async () => {
        if (!StreamId) return
        const data = await fetchStreamResponse(StreamId)
        dispatch(setLiveStreamResponse(data))
        dispatch(setIsDisconnected(!!data.is_disconnected))
      }
      MakApiCall()
    }
  }, [currentLiveStreamDetails?.uid])

  useEffect(() => {
    if (isDisconnected && streamInfraType === 20) {
      dispatch(setIsDisconnectedModalOpen(true))
    }
  }, [isDisconnected, streamInfraType])

  const [streamLoadTime, setStreamLoadTime] = useState(1)
  const timerID = useRef<any>()
  const { t } = useTranslation()

  const notLivePlayerPlaceHolder =
    streamCoolDownTime >= Date.now()
      ? 'manageLiveStream.streamPreview.streamEndedPlayerPlaceholder'
      : 'manageLiveStream.streamPreview.notLivePlayerPlaceHolder'

  //Checking the time to delay w.r.t stream length
  useEffect(() => {
    if (url) {
      const currentTime = new Date().getTime()
      const streamLengthInSec = findDurationInSec(created_at, currentTime)

      const isIVS_LLStream = (url || '').indexOf('loco_player_version=2') >= 0
      //for delaying loading of IVS Player by 20sec when live
      // Set timer to 15 sec for IVS Low Latency Stream
      const delayStreamLoad = isIVS_LLStream ? 15 : 30 //seconds
      if (streamLengthInSec < delayStreamLoad) {
        setStreamLoadTime(delayStreamLoad - streamLengthInSec)
        timerID.current = setInterval(() => {
          setStreamLoadTime((prev) => prev - 1)
        }, 1000)
      } else {
        setStreamLoadTime(0)
      }
    }
    return () => {
      clearInterval(timerID.current)
    }
  }, [url, created_at])

  useEffect(() => {
    if (streamLoadTime < 1) {
      clearInterval(timerID.current)
    }
  }, [streamLoadTime])

  useEffect(() => {
    let timerId: any
    const onNetworkOnline = () => {
      setStreamLoadTime(1)
      timerId = setTimeout(() => {
        setStreamLoadTime(0)
      }, 1000)
    }

    window.addEventListener('online', onNetworkOnline)

    return () => {
      window.removeEventListener('online', onNetworkOnline)
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [])

  useEffect(() => {
    if (currentLiveStreamDetails?.uid) {
      dispatch(setIsStreamEndedFromDashboard(false))
    }
  }, [currentLiveStreamDetails?.uid])

  return (
    <AspectRatioBox
      ratio={2.3 / 1.13}
      w={['100%', '100%']}
      lineHeight={'130%'}
      rounded={!url ? ['0px', '8px'] : '0px'}
      bg="brand.loco-grey-70"
      alignItems="center"
    >
      {!url ? (
        <Flex align="center" justify="center" direction="column">
          <Icon
            //@ts-ignore
            name="noVideo"
            size="auto"
            width={['54px', '66px']}
            mb={['5px', '7px']}
          />
          <Text
            textAlign="center"
            maxW={'75%'}
            fontSize={['12px', '14px']}
            fontWeight="400"
            mb={[2, 0]}
          >
            {t(`${notLivePlayerPlaceHolder}`)}
          </Text>
        </Flex>
      ) : streamInfraType === 20 && isDisconnected ? (
        <Flex>
          <ReconnectingScreen />
        </Flex>
      ) : streamLoadTime > 0 ? (
        <Flex background="brand.loco-black" position="relative">
          <Flex
            position="absolute"
            top={0}
            left={0}
            width="100%"
            justifyContent="center"
          >
            <Text fontSize={['12px', '14px']} fontWeight="400">
              {t('manageLiveStream.streamPreview.loadingInSecTimer', {
                count: streamLoadTime,
              })}
            </Text>
          </Flex>
          <Flex width="100%">
            <Loader height="100%" />
          </Flex>
        </Flex>
      ) : (
        <Flex>
          <IVSPlayer
            src={url}
            rewindurl={rewindUrl}
            poster=""
            streamTitle=""
            streamDescription=""
            createdAt={created_at}
            liveStream={true}
          />
        </Flex>
      )}
    </AspectRatioBox>
  )
}

export default StreamPlayer
