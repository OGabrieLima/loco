import { RootState } from '@app/RootReducer'
import {
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/core'
import {
  getLiveStreamHealthStatus,
  setStreamHealthDetails,
} from '@modules/LiveStreamManager/LiveStreamManagerSlice'
import { useRtlTranslation } from '@src/i18n/utils'
import { eventActions, eventConstants, eventPropsTypes } from '@utils/Amplitude'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import StreamHealthContent from './StreamHealthContent'

const hexToRgbaMapper: { [id: string]: string } = {
  '#FF2400': '255,36,0', //RED
  '#FFBF00': '255,191,0', //ORANGE
  '#FEDE00': '255,222,0', //YELLOW
  '#7CFC00': '124,252,0', //GREEN
  '#808080': '128,128,128', //Grey
}

const hexToStreamStatusMapper: { [id: string]: string } = {
  '#FF2400': 'NO DATA', //RED
  '#FFBF00': 'OK', //ORANGE
  '#FEDE00': 'POOR', //YELLOW
  '#7CFC00': 'EXCELLENT', //GREEN
  '#808080': 'CALCULATING', //GREY
  '#00': 'NOT LIVE', //OFFLINE
}

const StreamHealth = () => {
  const dispatch = useDispatch()
  const [isRealTime, setIsRealTime] = useState(true)
  const { t } = useTranslation()
  const isRTL = useRtlTranslation()

  const customStyle = isRTL
    ? {
        ml: '14px',
      }
    : {
        mr: '14px',
      }

  const { streamHealthDetails, isLive, currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { me } = useSelector((state: RootState) => state.login)

  useEffect(() => {
    dispatch(getLiveStreamHealthStatus())
    const interval = setInterval(() => {
      dispatch(getLiveStreamHealthStatus())
    }, 5000)
    return () => {
      clearInterval(interval)
      dispatch(setStreamHealthDetails(null))
    }
  }, [])

  const createEventPayload = () => {
    return {
      Streamer_id: me?.user_uid ?? '',
      Streamer_name: me?.username ?? '',
      Streamer_type: me?.user_type ?? '',
      Stream_health_status:
        hexToStreamStatusMapper[streamHealthDetails?.color ?? '#00'],
      en_video_bitrate:
        streamHealthDetails?.encoder_settings?.video_bitrate ?? 0,
      en_fps: streamHealthDetails?.encoder_settings?.framerate ?? 0,
      en_audio_bitrate:
        streamHealthDetails?.encoder_settings?.audio_bitrate ?? 0,
      en_resolution: streamHealthDetails?.encoder_settings?.resolution ?? '',
      rt_video_bitrate: streamHealthDetails?.realtime?.bitrate ?? 0,
      rt_fps: streamHealthDetails?.realtime?.fps ?? 0,
      rt_audio_bitrate:
        streamHealthDetails?.encoder_settings?.audio_bitrate ?? 0,
      rt_resolution: streamHealthDetails?.encoder_settings?.resolution ?? '',
      video_id: currentLiveStreamDetails?.uid ?? '',
      Category_name: currentLiveStreamDetails?.game_name ?? '',
      Category_id: currentLiveStreamDetails?.game_uid ?? '',
      Clicked_at_epoch: Math.round(Date.now() / 1000) + '',
      Stream_started_epoch: currentLiveStreamDetails?.created_at ?? '',
    }
  }

  const handleStreamHealthClicked = () => {
    const eventProperties: eventPropsTypes.Stream_health_prompt_open = createEventPayload()
    eventActions.sendAmplitudeData(
      eventConstants.stream_health_prompt_open,
      eventProperties
    )
  }

  return (
    <Flex w="full" align="center" justify="center" cursor="pointer" mx={'28px'}>
      <Popover usePortal>
        <PopoverTrigger>
          <Flex
            align="center"
            fontSize="12px"
            lineHeight="18px"
            fontWeight="700"
            px="12px"
            py="6px"
            height="40px"
            bg="brand.loco-grey-7"
            borderRadius="10px"
            textTransform="uppercase"
            onClick={handleStreamHealthClicked}
          >
            <Flex
              height="8px"
              width="8px"
              borderRadius="100%"
              backgroundColor={
                isLive ? streamHealthDetails?.color ?? '#FF2400' : '#FF2400'
              }
              // mr="14px"
              boxShadow={`0px 0px 0px 3px rgba(${
                isLive && streamHealthDetails?.color
                  ? hexToRgbaMapper[streamHealthDetails?.color]
                  : '255,36,0'
              },0.6)
              ,0px 0px 0px 6px rgba(${
                isLive && streamHealthDetails?.color
                  ? hexToRgbaMapper[streamHealthDetails?.color]
                  : '255,36,0'
              },0.4)`}
              {...customStyle}
            ></Flex>
            {t('streamhealth.title')}
          </Flex>
        </PopoverTrigger>
        <PopoverContent
          w="inherit"
          bg="#1F1F1F"
          border="1px solid rgba(96,108,136,.5)"
          color="white"
          borderRadius="8px"
          boxShadow="0px 0px 0.664039px rgba(0, 0, 0, 0.211221), 0px 1.32808px 0.664039px rgba(0, 0, 0, 0.12);"
          _focus={{
            borderColor: 'none',
            outline: 'none',
          }}
          zIndex={100}
        >
          <PopoverBody>
            <StreamHealthContent
              isRealTime={isRealTime}
              setIsRealTime={setIsRealTime}
              streamHealthDetails={streamHealthDetails}
              isLive={isLive}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}

export default StreamHealth
