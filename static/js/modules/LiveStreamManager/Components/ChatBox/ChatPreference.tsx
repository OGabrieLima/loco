import {
  Divider,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
} from '@chakra-ui/core'
import { setShowModeratorLogs } from '@modules/LiveStreamManager/LiveStreamManagerSlice'
import Block from '@src/components/Container/Block'
import { isWebViewBuild, LOCO_WEB_URL } from '@src/constent'
import { useRedirectUtilParams, useRtlTranslation } from '@src/i18n/utils'
import theme from '@src/theme'
import { sendAmplitudeData } from '@utils/Amplitude/amplitude'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Switch from 'react-switch'

import { RootState } from '../../../../app/RootReducer'
import NewModal from '../../../../components/NewModal'
import { paths } from '../../../../routers/constants'
import ChatModerators from './ChatModerators'
import ConfirmPreferences from './ConfirmPreference'

enum chatPreferenceValue {
  ANYONE_CAN_CHAT = 10,
  FOLLOWERS_ONLY_CHAT = 20,
}

function ChatPreferenceTrigger({ onOpen }: { onOpen: () => any }) {
  const { t } = useTranslation()

  return (
    <Flex
      align="center"
      bg={['brand.loco-grey-8', 'transparent']}
      px={['12px', 0]}
      py={['6px', 0]}
      boxSizing="border-box"
      rounded={'4px'}
      onClick={onOpen}
    >
      <Text fontWeight="700" fontSize={['14px', '16px']}>
        {t('manageLiveStream.chat.chatSettings.title')}
      </Text>
      {/* <Divider
        orientation="vertical"
        border="brand.primary-white-v2"
        h={4}
        display={['block', 'none', 'none']}
      /> */}
      <Icon
        //@ts-ignore
        name="downArrow"
        // ml={[0, 2]}
        mt={'1px'}
        size="24px"
        style={{
          marginInlineStart: '4px',
        }}
      />
    </Flex>
  )
}

export function ChatPreferenceBody({
  chatPreference,
  updateChatPreference,
  onClose,
  filters,
  updateFilters,
  setConfirmPreference,
}: {
  chatPreference:
    | {
        slow_mode_time: number
        chat_mode: number
        sticker_only_chat_ends_at: number
      }
    | undefined
  updateChatPreference: (
    option:
      | { chat_mode: number }
      | { slow_mode_time: number }
      | { sticker_chat_enable: number }
  ) => void
  onClose: () => any | undefined
  filters: any
  updateFilters: (value: any) => void
  setConfirmPreference: any
}) {
  const { me } = useSelector((state: RootState) => state.login)
  const { showModeratorLogs } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const [isChatPopoutTooltipOpen, setIsChatPopoutTooltipOpen] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { modifyUrl } = useRedirectUtilParams()

  const {
    isLive,
    currentLiveStreamDetails,
    sticker_default_time,
  } = useSelector((state: RootState) => state.liveStreamManager)
  const stickerOnlyChatEnabled =
    // @ts-ignore
    currentLiveStreamDetails?.chat_config
      ? new Date(
          currentLiveStreamDetails?.chat_config?.sticker_only_chat_ends_at
        ).getTime() > new Date().getTime()
      : false
  const history = useHistory()

  const goToProfilePage = () => {
    history.push({
      pathname: paths.dashboard.profile,
      state: { data: 'blockedUser' },
    })
  }
  const goToProfilePageForDesktop = () => {
    window.open(paths.dashboard.profile, '')
  }
  const goToChatPopout = () => {
    window.open(
      modifyUrl(
        `${LOCO_WEB_URL}/chat/streamers/${currentLiveStreamDetails?.streamer?.username}`
      ),
      '_blank'
    )
  }

  const handleStickerChat = (e: boolean) => {
    if (filters.text_only) {
      setConfirmPreference(() => () => {
        updateChatPreference({ sticker_chat_enable: e ? 10 : 20 })
        updateFilters({ text_only: false })
      })
    } else {
      updateChatPreference({ sticker_chat_enable: e ? 10 : 20 })
    }
    onClose()
    const eventData: any = {
      state_changed_to: e ? 'on' : 'off',
      video_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_type: me?.user_type,
      Sticker_only_default_duration: sticker_default_time,
    }
    if (!e && sticker_default_time && currentLiveStreamDetails?.chat_config) {
      const endsAt = new Date(
        currentLiveStreamDetails?.chat_config?.sticker_only_chat_ends_at
      )
      endsAt.setMinutes(endsAt.getMinutes() - sticker_default_time)
      const diffInMin =
        Math.round(
          Math.abs(endsAt.getTime() - new Date().getTime()) / (1000 * 60)
        ) % 60
      const diffInSec = Math.round(
        (Math.abs(endsAt.getTime() - new Date().getTime()) / 1000) % 60
      )
      const diffMin = `${diffInMin}`.length === 1 ? `0${diffInMin}` : diffInMin
      const diffSec = `${diffInSec}`.length === 1 ? `0${diffInSec}` : diffInSec
      eventData.Sticker_only_duration = `${diffMin}:${diffSec}`
    }
    sendAmplitudeData('Sticker_only_chat_toggle', eventData)
  }

  const handleModeratorToggle = () => {
    sendAmplitudeData('mod_logs_toggle', {
      Streamer_id: me?.user_uid,
      Streamer_username: me?.username,
      Streamer_type: me?.user_type,
      video_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      Actor_type: 'STREAMER',
      mod_id: me?.user_uid,
      mod_username: me?.username,
      platform: 'dashboard',
      toggle_state_change_to: showModeratorLogs ? 'on' : 'off',
    })
    dispatch(setShowModeratorLogs(!showModeratorLogs))
  }

  const chatPreferenceOptions = [
    {
      key: 'anyoneCanChat',
      label: t('manageLiveStream.chat.chatSettings.anyone'),
      value: chatPreferenceValue.ANYONE_CAN_CHAT,
    },
    {
      key: 'followersOnlyChat',
      label: t('manageLiveStream.chat.chatSettings.followers'),
      value: chatPreferenceValue.FOLLOWERS_ONLY_CHAT,
    },
  ]

  return isLive ? (
    <>
      <Text
        fontSize={['16px', '20px']}
        fontWeight="700"
        cursor="pointer"
        style={{
          paddingInlineStart: '0.5rem',
        }}
      >
        {t('manageLiveStream.chat.chatSettings.title')}
      </Text>
      <Text
        fontSize={['12px', '14px']}
        opacity={0.5}
        my={2}
        style={{
          paddingInlineStart: '0.5rem',
        }}
      >
        {t('manageLiveStream.chat.chatSettings.preference')}
      </Text>
      <RadioGroup
        value={chatPreference?.chat_mode}
        onChange={(e) => {
          onClose()
          updateChatPreference({ chat_mode: +e.target.value })
        }}
      >
        {chatPreferenceOptions.map((option) => {
          return (
            <Radio
              p={0}
              key={option.key}
              value={option.value}
              display="flex"
              className="radio_button_group"
              variantColor="black"
              borderColor={
                chatPreference?.chat_mode === option.value
                  ? 'brand.loco-primary'
                  : 'white'
              }
              flexDirection="row-reverse"
              justifyContent="space-between"
            >
              <Text fontSize={['14px', '16px']}>{option.label}</Text>
            </Radio>
          )
        })}
      </RadioGroup>
      <Divider
        borderColor="brand.primary-white-v2"
        borderWidth={1}
        opacity={0.5}
        mt={4}
      />
      <Flex
        align="center"
        justify="space-between"
        style={{
          paddingInlineStart: '0.5rem',
        }}
      >
        <Text fontSize={['14px', '16px']}>
          {t('manageLiveStream.chat.chatSettings.slow')}
        </Text>
        <Switch
          checked={(chatPreference?.slow_mode_time ?? 0) > 5 ? true : false}
          onChange={(e) => {
            updateChatPreference({ slow_mode_time: e ? 30 : 0 })
          }}
          onColor="#FFD0BC"
          onHandleColor={theme.colors.brand['loco-primary']}
          handleDiameter={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 3px 0px #00000033"
          activeBoxShadow="0px 1px 1px 0px #00000024"
          height={15}
          width={34}
        />
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        mt="18px"
        mb="13px"
        style={{
          paddingInlineStart: '0.5rem',
        }}
      >
        <Flex alignItems="center">
          <Text fontSize={['14px', '16px']}>
            {t('manageLiveStream.chat.chatSettings.text')}
          </Text>
        </Flex>
        <Switch
          checked={filters.text_only ? true : false}
          onChange={(e) => {
            if (stickerOnlyChatEnabled) {
              setConfirmPreference(() => () => {
                updateFilters({ text_only: e ? true : false })
                updateChatPreference({ sticker_chat_enable: 20 })
              })
            } else {
              updateFilters({ text_only: e ? true : false })
            }
            onClose()
          }}
          onColor="#FFD0BC"
          onHandleColor={theme.colors.brand['loco-primary']}
          handleDiameter={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 3px 0px #00000033"
          activeBoxShadow="0px 1px 1px 0px #00000024"
          height={15}
          width={34}
        />
      </Flex>
      {currentLiveStreamDetails?.permissions?.sticker_option_enable === 10 ? (
        <Flex
          align="center"
          justify="space-between"
          // pl={[2, 3]}

          mt="18px"
          mb="13px"
          style={{
            marginInlineStart: '0.5rem',
          }}
        >
          <Flex>
            <Text fontSize={['14px', '16px']}>
              {t('manageLiveStream.chat.chatSettings.stickerChat')}
            </Text>
          </Flex>
          <Switch
            checked={stickerOnlyChatEnabled ? true : false}
            onChange={(e) => {
              handleStickerChat(e)
            }}
            onColor="#FFD0BC"
            onHandleColor={theme.colors.brand['loco-primary']}
            handleDiameter={20}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 3px 0px #00000033"
            activeBoxShadow="0px 1px 1px 0px #00000024"
            height={15}
            width={34}
          />
        </Flex>
      ) : null}
      <Divider
        borderColor="brand.primary-white-v2"
        borderWidth={1}
        opacity={0.5}
      />
      <Flex
        align="center"
        justify="space-between"
        style={{
          paddingInlineStart: '0.5rem',
        }}
      >
        <Text fontSize={['14px', '16px']}>
          {t('manageLiveStream.chat.chatSettings.logs')}
        </Text>
        <Switch
          checked={showModeratorLogs}
          onChange={handleModeratorToggle}
          onColor="#FFD0BC"
          onHandleColor={theme.colors.brand['loco-primary']}
          handleDiameter={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 3px 0px #00000033"
          activeBoxShadow="0px 1px 1px 0px #00000024"
          height={15}
          width={34}
        />
      </Flex>
      <Divider
        borderColor="brand.primary-white-v2"
        borderWidth={1}
        opacity={0.5}
      />
      <Flex
        align="center"
        justify="space-between"
        style={{
          paddingInlineStart: '0.5rem',
        }}
      >
        <Text fontSize={['14px', '16px']}>
          {t('manageLiveStream.chat.chatSettings.mute')}
        </Text>
        <Text
          fontSize="1rem"
          fontWeight="700"
          cursor="pointer"
          color="brand.loco-primary"
          display={['block', 'none', 'none']}
          onClick={goToProfilePage}
        >
          {t('manageLiveStream.chat.chatSettings.view')}
        </Text>
        <Text
          fontSize="1rem"
          fontWeight="700"
          cursor="pointer"
          color={'brand.loco-primary'}
          display={['none', 'block', 'block']}
          onClick={goToProfilePageForDesktop}
        >
          {t('manageLiveStream.chat.chatSettings.view')}
        </Text>
      </Flex>
      {!isWebViewBuild ? (
        <Divider
          borderColor="brand.primary-white-v2"
          borderWidth={1}
          opacity={0.5}
        />
      ) : null}
      {!isWebViewBuild ? (
        <Flex padding={0} p={0} height={'28px'} position={'relative'}>
          {isChatPopoutTooltipOpen ? (
            <Block
              position={'absolute'}
              bottom={0}
              left={0}
              padding={'16px'}
              w="250px"
              rounded={'12px'}
              bg="#3A3A3A"
              zIndex={9999}
              color="white"
              fontSize="14px"
              fontWeight={'600'}
              style={{
                transform: 'translateX(-110%) translateY(40%)',
              }}
            >
              {/* create a div that adds an arrow to the right */}
              <Flex
                position="absolute"
                left="100%"
                top="50%"
                transform="translateY(-50%)"
                w="0"
                h="0"
                borderStyle="solid"
                borderWidth="10px"
                borderColor="transparent transparent transparent #3A3A3A"
              />
              {t('manageLiveStream.chat.chatSettings.popoutChatTooltip')}
            </Block>
          ) : null}
          <Flex
            align="center"
            width={'100%'}
            height={'100%'}
            justify="space-between"
            style={{
              paddingInlineStart: '0.5rem',
            }}
            cursor={'pointer'}
            onMouseOverCapture={() => {
              setIsChatPopoutTooltipOpen(true)
            }}
            onMouseOutCapture={() => {
              setIsChatPopoutTooltipOpen(false)
            }}
            onClick={() => {
              const eventData: any = {
                setting_name: 'popout_chat',
                streamer_name: me?.username,
                stream_category: currentLiveStreamDetails?.game_name,
              }
              sendAmplitudeData('chat_settings_changed_streamer', eventData)
              goToChatPopout()
            }}
          >
            <Text fontSize={['14px', '16px']}>
              {t('manageLiveStream.chat.chatSettings.popoutChat')}
            </Text>
            <Icon name="popout_chat_icon" size="24px" cursor={'pointer'} />
          </Flex>
        </Flex>
      ) : null}
    </>
  ) : (
    <Flex align="center" justify="center" direction="column">
      <Icon name="warning" size="72px" fill={'#F8FF00'} mb={4} />
      <Text fontSize="14px" fontWeight="600" color="white">
        {t('manageLiveStream.chat.notLive')}
      </Text>
    </Flex>
  )
}

function ChatPreference({
  chatPreference,
  updateChatPreference,
  filters,
  updateFilters,
}: {
  chatPreference:
    | {
        slow_mode_time: number
        chat_mode: number
        sticker_only_chat_ends_at: number
      }
    | undefined
  updateChatPreference: (
    option:
      | { chat_mode: number }
      | { slow_mode_time: number }
      | { sticker_chat_enable: number }
  ) => void
  filters: any
  updateFilters: (value: any) => void
}) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [confirmPreference, setConfirmPreference] = useState<
    () => () => void | null
  >()
  const { currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const closeModal = () => {
    setConfirmPreference(undefined)
  }
  const onSuccessModal = () => {
    confirmPreference?.()
    closeModal()
  }
  const stickerOnlyChatEnabled =
    // @ts-ignore
    currentLiveStreamDetails?.chat_config
      ? new Date(
          currentLiveStreamDetails?.chat_config?.sticker_only_chat_ends_at
        ).getTime() > new Date().getTime()
      : false

  const { t } = useTranslation()
  const isRTL = useRtlTranslation()
  return (
    <>
      <Flex
        w="full"
        // Web Only
        display={['none', 'flex', 'flex']}
        alignItems="center"
        justify="flex-end"
      >
        <ChatModerators />
        <Divider
          orientation="vertical"
          borderColor="#3A3A3A"
          h={'25px'}
          width="1px"
          display={['block']}
          opacity={1}
        />
        <Popover usePortal>
          {({ onClose }: { onClose: any }) => (
            <>
              <Flex p={1} align="center">
                <PopoverTrigger>
                  <Flex
                    align="center"
                    bg={['brand.primary-light-black-v4', 'transparent']}
                    px={[3, 0]}
                    py={2}
                    boxSizing="border-box"
                    rounded={'4px'}
                    cursor="pointer"
                    alignItems="center"
                  >
                    <Text fontWeight="700" fontSize={['14px', '16px']}>
                      {t('manageLiveStream.chat.chatSettings.title')}
                    </Text>
                    <Icon
                      //@ts-ignore
                      name="downArrow"
                      style={{
                        marginInlineStart: '4px',
                      }}
                      size="24px"
                    />
                  </Flex>
                </PopoverTrigger>
              </Flex>
              <PopoverContent
                rounded={'12px'}
                zIndex={4}
                transform="translate(-20px)"
                bg="brand.loco-grey-70"
                border="none"
                color="white"
                mr={[0, '16px']}
                boxShadow=" 0px 0px 7px 0px rgba(0, 0, 0, 0.75)"
                _focus={{
                  borderColor: 'none',
                  outline: 'none',
                }}
              >
                <PopoverArrow
                  bg="brand.loco-grey-70"
                  h="5px"
                  display={['none', 'block', 'block']}
                />
                <PopoverBody p={3} rounded={'12px'} bg="brand.loco-grey-70">
                  <ChatPreferenceBody
                    chatPreference={chatPreference}
                    updateChatPreference={updateChatPreference}
                    onClose={onClose}
                    filters={filters}
                    updateFilters={updateFilters}
                    setConfirmPreference={setConfirmPreference}
                  />
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>
      </Flex>
      <Flex
        w="full"
        // mWeb Only
        display={['flex', 'none', 'none']}
        justifyContent="flex-end"
      >
        <ChatPreferenceTrigger onOpen={onOpen} />
      </Flex>
      <NewModal
        isOpen={isOpen}
        onClose={onClose}
        modalSize={['full', 'md']}
        isCentered={true}
        scrollBehaviour="outside"
        modalOverlayStyle={{
          zIndex: 1400,
        }}
        modalContentStyle={{
          bg: ['brand.primary-light-black-v4'],
          width: '700px',
          rounded: 'none',
          position: 'absolute',
        }}
        modalHeaderStyle={{
          px: 0,
          pb: 0,
        }}
        modalBodyStyle={{
          py: [6, 8],
          px: [4, 8],
          zIndex: 2001,
        }}
        modalBodyComponent={
          <ChatPreferenceBody
            chatPreference={chatPreference}
            updateChatPreference={updateChatPreference}
            onClose={onClose}
            filters={filters}
            updateFilters={updateFilters}
            setConfirmPreference={setConfirmPreference}
          />
        }
      />
      {!!confirmPreference && (
        <ConfirmPreferences
          isOpen={!!confirmPreference}
          onClose={closeModal}
          onSuccess={onSuccessModal}
          message={
            isRTL
              ? `سيتم إيقاف تشغيل ${
                  stickerOnlyChatEnabled
                    ? t('manageLiveStream.chat.chatSettings.stickerChat')
                    : t('manageLiveStream.chat.chatSettings.text')
                } إذا كنت تريد تنشيط ${
                  stickerOnlyChatEnabled
                    ? t('manageLiveStream.chat.chatSettings.text')
                    : t('manageLiveStream.chat.chatSettings.stickerChat')
                } `
              : `${
                  stickerOnlyChatEnabled
                    ? 'Sticker only mode'
                    : 'The Text only filter'
                } will be turned off if you wish to turn on the ${
                  stickerOnlyChatEnabled ? 'text' : 'Sticker'
                } only filter`
          }
        />
      )}
    </>
  )
}

export default ChatPreference
