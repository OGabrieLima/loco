import { Flex, Text } from '@chakra-ui/core'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../../app/RootReducer'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../../../../utils/Amplitude'
import {
  slow_chat_mode,
  streamer_chat_access_toggle,
} from '../../../../utils/Amplitude/constants'
import { updateChatPreference } from '../../LiveStreamManagerSlice'
import SectionHeader from '../SectionHeader'
import ChatBody from './ChatBody'
import ChatPreference from './ChatPreference'

const ChatBox = (props: any) => {
  const { currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const [filters, setFilters] = useState({ text_only: false })
  const { me } = useSelector((state: RootState) => state.login)
  const dispatch = useDispatch()
  const chatPreference = currentLiveStreamDetails?.chat_config
  const handleEventChatPreference = (option: {
    chat_mode?: number
    slow_mode_time?: number
    sticker_chat_enable?: number
  }) => {
    const commonEventProperties = {
      video_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      streamer_name: me?.username || '',
      streamer_id: me?.user_uid || '',
    }
    if (option?.chat_mode) {
      const optionType = (type: 10 | 20 | number | undefined) => {
        return type === 10
          ? 'anyone_can_chat'
          : type === 20
          ? 'follower_only_chat'
          : ''
      }
      const eventProperties: eventPropsTypes.streamer_chat_access_toggle_props = {
        ...commonEventProperties,
        switched_from: optionType(
          currentLiveStreamDetails?.chat_config.chat_mode
        ),
        switched_to: optionType(option.chat_mode),
      }
      eventActions.sendAmplitudeData(
        streamer_chat_access_toggle,
        eventProperties
      )
    } else if (option?.slow_mode_time) {
      const eventProperties: eventPropsTypes.slow_chat_mode_props = {
        ...commonEventProperties,
      }
      const eventSuffix = option.slow_mode_time === 5 ? '_disabled' : '_enabled'
      eventActions.sendAmplitudeData(
        `${slow_chat_mode}${eventSuffix}`,
        eventProperties
      )
    }
  }
  const handleEventStreamerChatSend = (chat_msg: string) => {
    const eventProperties: eventPropsTypes.streamer_chat_send_props = {
      stream_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      chat_msg: chat_msg || '',
    }
    eventActions.sendAmplitudeData(
      eventConstants.streamer_chat_send,
      eventProperties
    )
  }

  const handleChatPreference = (
    option:
      | { chat_mode: number }
      | { slow_mode_time: number }
      | { sticker_chat_enable: number }
  ) => {
    dispatch(
      updateChatPreference({
        stream_key: currentLiveStreamDetails?.uid as string,
        ...option,
      })
    )
    handleEventChatPreference(option)
  }
  const updateFilters = (data: any) => {
    const newFilters = { ...filters, ...data }
    setFilters(newFilters)
    sessionStorage.setItem('chat_filters', JSON.stringify(newFilters))
  }

  useEffect(() => {
    const chatFilters = sessionStorage.getItem('chat_filters') || '{}'
    const getFilters = JSON.parse(chatFilters)
    setFilters(getFilters)
  }, [])

  const { t } = useTranslation()

  return (
    <Flex
      bg={['transparent', 'brand.loco-black']}
      direction="column"
      lineHeight={'130%'}
      w="full"
      h="full"
      mt={2}
      flex={2}
      boxSizing="border-box"
      maxH="full"
      overflow="hidden"
    >
      <SectionHeader h="45px" px={['8px', '10px']}>
        <Text fontSize={'16px'} fontWeight={'700'} minWidth={'fit-content'}>
          {t('manageLiveStream.chat.title')}
        </Text>
        <ChatPreference
          // Web
          chatPreference={chatPreference}
          updateChatPreference={handleChatPreference}
          filters={filters}
          updateFilters={updateFilters}
        />
      </SectionHeader>
      <Flex display={['flex', 'none', 'none']} pt="8px" pb="8x" px="16px">
        <ChatPreference
          // mWeb
          chatPreference={chatPreference}
          updateChatPreference={handleChatPreference}
          filters={filters}
          updateFilters={updateFilters}
        />
      </Flex>
      <ChatBody
        handleEventStreamerChatSend={handleEventStreamerChatSend}
        filters={filters}
        handleChatMsgs={props.handleChatMsgs}
      />
    </Flex>
  )
}

export default ChatBox
