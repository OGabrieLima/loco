import {
  getChatData,
  getOptimisticChatData,
  getStreamConfig,
  IOptimisticDataResp,
  sendMessageApi,
} from '@api/apiRequest'
import { getHistoryMessages } from '@api/getHistoryMessages'
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/core'
import { useCustomToast } from '@components/customToast'
import useSkipFirstRender from '@hooks/useSkipFirstRender'
import {
  setIsDisconnected,
  setLiveViews,
  setShowModeratorLogs,
  updateChatPreference,
} from '@modules/LiveStreamManager/LiveStreamManagerSlice'
import { spamUser } from '@modules/LiveStreamManager/types'
import { parseSelectedLanguage } from '@src/i18n/utils'
import { sendAmplitudeData } from '@utils/Amplitude/amplitude'
import { getFingerprint } from '@utils/fingerprint'
import { sleep } from '@utils/sleep'
import dayjs from 'dayjs'
import i18next from 'i18next'
import isMobile from 'is-mobile'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AutoChatScroll } from 'ui'
import { v4 as uuid } from 'uuid'
import {
  clearInterval as workerClearInterval,
  setInterval as workerSetInterval,
} from 'worker-timers'

import { RootState } from '../../../../app/RootReducer'
import { UserDetailsForGiveWay } from '../../../../constent'
import { BlockUserModal } from '../../../ManageLiveStream/BlockUserModal'
import ChatMessage from './ChatMessage'
import ChatTextInput from './ChatTextInput'
import Timer from './Timer'

const ChatTextBody = ({
  handleBlockConfirmation,
  usersRecievedGiveaway,
  filters,
  handleEventStreamerChatSend,
  streamerDetails,
  setUsersRecievedGiveaway,
  handleChatMsgs,
}: {
  handleBlockConfirmation: any
  usersRecievedGiveaway: string[]
  handleEventStreamerChatSend: (chat: string) => void
  streamerDetails: any
  filters: any
  setUsersRecievedGiveaway: (value: string[]) => void
  handleChatMsgs: (msgs: any) => void
}): JSX.Element => {
  const dispatch = useDispatch()
  const toast = useCustomToast()
  const { me } = useSelector((state: RootState) => state.login)
  const { t } = useTranslation()

  const timer = useRef<NodeJS.Timeout[]>([])
  const prevMessagesRenderedRef = useRef(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { currentLiveStreamDetails, sticker_default_time } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const [msgs, setMsgs] = useState<IchatMessage[]>([])
  const msgsRef = useRef(msgs)
  const thisTabUUid = useRef((uuid() || Date.now().toFixed(0)).slice(0, 10))
  const getDeviceId = (text: string) => text + '-' + thisTabUUid.current
  const optimisticDataRef = useRef<IOptimisticDataResp | null>(null)

  // const [StreamerDetailsApiArr, setStreamerDetailsApiArr] = useState<any[]>([]);
  const [spamUserDetails, setSpamUserDetails] = useState<spamUser | null | any>(
    null
  )

  useEffect(() => {
    dispatch(setShowModeratorLogs(true))
  }, [])

  useEffect(() => {
    msgsRef.current = msgs
  }, [msgs.length])

  useSkipFirstRender(() => {
    while (timer.current.length) {
      const value = timer.current.shift()
      if (value) {
        clearTimeout(value)
      }
    }
    prevMessagesRenderedRef.current = false
  }, [msgs.length])

  useEffect(() => {
    async function getHistory() {
      if (currentLiveStreamDetails?.uid) {
        const { chats }: { chats: IchatMessage[] } = await getHistoryMessages(
          currentLiveStreamDetails?.uid
        )
        if (chats) {
          addMessages(chats, 'history')
        }
      }
    }
    getHistory()
  }, [currentLiveStreamDetails?.uid])

  const addMessages = async (
    chunk: IchatMessage[],
    // 'mark_delivered' not is use right now
    type?: 'history' | 'replace_chats' | 'mark_delivered' | '',
    isSelf = false
  ) => {
    if (type === 'mark_delivered') return
    if (type === 'history' || type == 'replace_chats') {
      setMsgs([...chunk])
      msgsRef.current = chunk
      return
    }
    const _interval = chunk.length > 2 ? 2000 / chunk.length : 1000
    if (!prevMessagesRenderedRef.current) {
      await sleep(250)
    }
    if (isSelf) {
      setMsgs((msgs: IchatMessage[]) => {
        let _msgs = [...msgs, ...chunk]
        if (_msgs.length >= 70) {
          _msgs = _msgs.slice(_msgs.length / 2)
        }
        msgsRef.current = _msgs
        return _msgs
      })
      return
    }
    chunk?.forEach((_chunk: any, index: number, arr: any) => {
      const timerIndex = setTimeout(() => {
        setMsgs((msgs: any[]) => {
          const _msgs = [...msgs]
          const _prevIds = _msgs.map((item) => item.id)
          if (!_prevIds.includes(_chunk.id)) {
            _msgs.push(_chunk)
            // _chunk.data.message
          }
          if (_msgs.length >= 70) {
            return _msgs.slice(_msgs.length / 2)
          }
          timer.current.push(timerIndex)
          if (index === arr.length - 1) {
            prevMessagesRenderedRef.current = true
          }
          msgsRef.current = _msgs
          return _msgs
        })
      }, index * _interval)
    })
  }

  const setOptimisticData = async () => {
    if (!currentLiveStreamDetails?.uid) {
      return
    }
    const resp = await getOptimisticChatData(currentLiveStreamDetails?.uid)
    optimisticDataRef.current = resp || null
  }

  useEffect(() => {
    const meUid = streamerDetails?.user_uid as string
    if (!currentLiveStreamDetails?.uid) {
      return
    }
    const fetchData = async () => {
      const [fingerprint, res] = await Promise.all([
        getFingerprint(),
        getChatData(currentLiveStreamDetails?.uid as string),
      ])
      const deviceId = getDeviceId(fingerprint)
      const { chats, acu, replace_chats, last_stream_config_change_time } = res
      const lastStreamConfigChangeTime = +(
        localStorage.getItem('last_stream_config_change_time') || -1
      )
      dispatch(setLiveViews(acu))

      if (last_stream_config_change_time > lastStreamConfigChangeTime) {
        const config: any = await getStreamConfig(currentLiveStreamDetails?.uid)
        dispatch(setIsDisconnected(!!config?.is_disconnected))
        localStorage.setItem(
          'last_stream_config_change_time',
          last_stream_config_change_time
        )
      }

      const filterChatMessage = (chats: IchatMessage[]) => {
        return (chats || []).reduce(
          (acc: any, msg: IchatMessage) => {
            // Now, only comparing deviceId, otherwise, assume message send on some other Tab, So no need to mark_read
            if (
              !msg?.data?.deviceId ||
              // !msg?.data?.profile?.uid ||
              msg.data.deviceId !== deviceId
              // || msg.data.profile.uid !== meUid
            ) {
              acc[0].push(msg)
            } else {
              acc[1].push(msg)
            }
            return acc
          },
          [[], []]
        )
      }

      if (Array.isArray(replace_chats) && replace_chats.length > 0) {
        const chatMsgsSlice = msgsRef.current.slice()

        const replaceChatMapping: {
          [key: string]: any
        } = {}

        const replaceChatMsgIdMapping: {
          [key: string]: string
        } = {}

        replace_chats.forEach((replaceMsg: IchatMessage) => {
          replaceChatMapping[replaceMsg.id] = replaceMsg
          replaceChatMsgIdMapping[replaceMsg.data.msgId] = replaceMsg.id
        })
        //
        //
        chatMsgsSlice.forEach((currentMsg, index) => {
          if (replaceChatMapping[currentMsg.id]) {
            // If id directly matched
            chatMsgsSlice[index] = replaceChatMapping[currentMsg.id]
          } else if (replaceChatMsgIdMapping[currentMsg.id]) {
            // If msgId matched, We check if it is current users message or not
            const replaceMsgId = replaceChatMsgIdMapping[currentMsg.id]
            const replaceMsg = replaceChatMapping[replaceMsgId]
            if (replaceMsg?.data?.profile.uid === meUid) {
              chatMsgsSlice[index] = replaceMsg
            }
          }
        })

        const [newMsgs, myMsgs] = filterChatMessage(chats || [])
        const allMsgs = [...chatMsgsSlice, ...newMsgs]
        addMessages(allMsgs, 'replace_chats')
        addMessages(myMsgs, 'mark_delivered')
        msgsRef.current = allMsgs
      } else if (chats) {
        const [newMsgs, myMsgs] = filterChatMessage(chats || [])
        addMessages(newMsgs)
        addMessages(myMsgs, 'mark_delivered')
      }
    }

    const timeout = workerSetInterval(() => {
      fetchData()
    }, 2000)
    fetchData()
    setOptimisticData()

    return () => {
      workerClearInterval(timeout)
    }
  }, [currentLiveStreamDetails?.uid])
  handleChatMsgs(msgs)

  const handleConfirmation = () => {
    if (spamUserDetails) {
      handleBlockConfirmation(spamUserDetails)
      onClose()
    }
  }
  const handleBlockModal = (user: spamUser) => {
    setSpamUserDetails(user)
    onOpen()
  }
  const updateStickerOnlyChatPreference = () => {
    if (currentLiveStreamDetails?.uid && me?.user_uid) {
      const eventData: any = {
        state_changed_to: 'off',
        video_id: currentLiveStreamDetails.uid,
        category_id: currentLiveStreamDetails.game_uid,
        category_name: currentLiveStreamDetails.game_name,
        streamer_id: me.user_uid,
        streamer_name: me.username,
        streamer_type: me.user_type,
        Sticker_only_default_duration: sticker_default_time,
      }
      updateChatPreference({
        sticker_chat_enable: 20,
        stream_key: currentLiveStreamDetails?.uid as string,
      })
      sendAmplitudeData('Sticker_only_chat_toggle', eventData)
    }
  }
  const publishCommonFunction = async (msg: string) => {
    const testLinkReg = new RegExp(
      // eslint-disable-next-line no-useless-escape
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    )
    const isLinkEnabled = testLinkReg.test(msg)
    const now = Date.now()
    const msgId = uuid()
    const deviceId = getDeviceId(await getFingerprint())
    const messageToPublish = {
      streamId: currentLiveStreamDetails?.uid,
      params: {
        message: msg,
        msgId: msgId,
        deviceId: deviceId,
        msg_time: now,
        // moderator_type: isModerator,
        profile: {
          avatar: streamerDetails?.avatar_url,
          color: '#3312ff',
          uid: streamerDetails?.user_uid,
          username: streamerDetails?.username as string,
        },
        type: 1,
        meta_data: {
          is_link_enabled: isLinkEnabled ? true : false,
        },
      },
    }
    const response = await sendMessageApi(messageToPublish)

    // For Success, statusCode is null
    const isSuccessResponse =
      !response?.statusCode || response?.statusCode === 200

    if (isSuccessResponse && response?.code === 'C10') {
      const optimisticData = optimisticDataRef.current || {}
      addMessages(
        [
          {
            id: msgId,
            data: {
              msgId: msgId,
              deviceId: deviceId,
              msg_time: now,
              message: msg,
              chat_text_color:
                optimisticData?.self_chat_attributes?.chat_text_color,
              chat_text_weight:
                optimisticData?.self_chat_attributes?.chat_text_weight,
              reward_metadata: optimisticData?.badge_thumbnails?.length
                ? // 0th index is always Mod Icon.. therefor only adding remaining badges if No-Mod user
                  {
                    badge_thumbnails: optimisticData?.badge_thumbnails.slice(1),
                  }
                : undefined,
              profile: {
                text_color:
                  optimisticData?.self_chat_attributes?.username_text_color,
                text_weight:
                  optimisticData?.self_chat_attributes?.username_text_weight,
                avatar: streamerDetails?.avatar_url,
                color:
                  optimisticData?.self_chat_attributes?.chat_text_color ||
                  '#3312ff',
                uid: streamerDetails?.user_uid,
                username: streamerDetails?.username as string,
              },
              type: 1,
            },
          },
        ],
        '',
        true
      )
    } else {
      // Unable to send Message, Show Error
      // Only showing error message for 400 code.. rest showing common message
      let ErrorMessage =
        (response?.statusCode === 400 ? response.message : null) ||
        t('error.wrongTryAgainAfterSomeTime')
      if (ErrorMessage === 'OFFENSIVE_BY_MODEL') {
        ErrorMessage = t('error_page.inappropriate')
      }
      ErrorMessage = ErrorMessage || t('error.wrongTryAgainAfterSomeTime')
      toast({
        position: isMobile() ? 'bottom' : 'top',
        note: ErrorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const sendMessage = (msg: string) => {
    publishCommonFunction(msg)
    handleEventStreamerChatSend(msg)
  }
  const publishUserConfirmationForGiveaway = (username: string) => {
    const msg = `You have won giveaway @${username}. The giveaway will be credited to your account in 24 hrs.`
    publishCommonFunction(msg)
  }

  const submitUserDetailsForGiveWay = (userid: string, username: string) => {
    ;(async () => {
      await fetch(UserDetailsForGiveWay, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-APP-LANG': parseSelectedLanguage(i18next.resolvedLanguage), // For BE to get Translation
          'X-APP-LOCALE': window.navigator.language ?? 'en', // Not in use, just to tell BE the browser's lang
        },
        body: JSON.stringify([
          {
            Date: dayjs().format('DD-MM-YYYY hh:mm'),
            Streamer_ID: streamerDetails?.user_uid,
            Streamer_Name: streamerDetails?.full_name,
            User_ID: userid,
            User_Username: username,
            Category: currentLiveStreamDetails?.game_name,
            Streamer_Username: streamerDetails?.username,
          },
        ]),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            toast({
              position: 'top',
              title: 'Something went wrong',
              description:
                'Please note username to give giveway while are working fixes',
              status: 'error',
              duration: 5000,
              isClosable: true,
            })
          } else {
            setUsersRecievedGiveaway(
              //@ts-ignore
              [...usersRecievedGiveaway, userid]
            )
            localStorage.setItem(
              'userRecievedGiveaway',
              JSON.stringify([...usersRecievedGiveaway, userid])
            )
            toast({
              position: 'top',
              title: 'User details is successfully submit',
              description: `You have submit details for @${username}`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            })
            publishUserConfirmationForGiveaway(username)
          }
        })
    })()
  }

  const liveMsgs = filters.text_only
    ? msgs.filter((message: any) => message.data.type === 1)
    : msgs
  const stickerOnlyChatEnabled = currentLiveStreamDetails?.chat_config
    ?.sticker_only_chat_ends_at
    ? new Date(
        currentLiveStreamDetails?.chat_config?.sticker_only_chat_ends_at
      ).getTime() > new Date().getTime()
    : false

  return (
    <>
      <Flex
        mx={['0px', '10px']}
        h="full"
        direction="column"
        maxH="full"
        position="relative"
        overflow="hidden"
        id="chatBody"
        roundedTop={'8px'}
        border={['none', '1px solid #3A3A3A']}
        borderBottom={'none'}
      >
        {stickerOnlyChatEnabled || filters.text_only ? (
          <Box
            height="40px"
            width="100%"
            background="linear-gradient(242.02deg, #FF0068 6.94%, #FF5A12 90.68%);"
            borderRadius="8px"
            display="flex"
            alignItems="center"
            padding="6px 12px"
            fontSize="12px"
            lineHeight="130%"
            justifyContent="space-between"
            mb="16px"
            position="sticky"
            top="0"
            left="0"
            zIndex={1}
          >
            <Box display="flex" alignItems="center">
              <Text as="h3" display="inline" color="white" fontWeight={'500'}>
                {t('manageLiveStream.chat.chatSettings.enable')}
              </Text>
              <Text as="span" color="#fff" fontWeight="700">
                &nbsp;
                {filters.text_only
                  ? t('manageLiveStream.chat.chatSettings.text')
                  : t('manageLiveStream.chat.chatSettings.stickerChat')}
              </Text>
            </Box>
            {currentLiveStreamDetails?.uid &&
            stickerOnlyChatEnabled &&
            !filters.text_only ? (
              <Text fontSize="12px">
                <Timer
                  endsAt={
                    currentLiveStreamDetails?.chat_config
                      .sticker_only_chat_ends_at
                  }
                  text="Resets in"
                  callback={() => {
                    updateStickerOnlyChatPreference()
                  }}
                />
              </Text>
            ) : null}
          </Box>
        ) : null}
        {currentLiveStreamDetails?.uid && liveMsgs?.length ? (
          <AutoChatScroll
            uniqueUid={'chat-container-' + currentLiveStreamDetails?.uid}
            isChatVisible={true}
            load_more_text={t('manageLiveStream.chat.new_messages')}
          >
            <></>
            {/* DO NOW ADD ANYTHING AT THIS INDEX PEASE */}
            {liveMsgs?.map((message: any, index) => {
              if (message?.id) {
                return (
                  <ChatMessage
                    usersRecievedGiveaway={usersRecievedGiveaway}
                    // StreamerDetailsApiArr={StreamerDetailsApiArr}
                    message={message?.data}
                    key={message?.id}
                    chatId={message?.id}
                    handleBlockModal={handleBlockModal}
                    submitUserDetailsForGiveWay={submitUserDetailsForGiveWay}
                  />
                )
              } else {
                return <React.Fragment key={index} />
              }
            })}
            {/* DO NOW ADD ANYTHING BEFORE THIS INDEX PEASE */}
            <></>
          </AutoChatScroll>
        ) : (
          <Text
            fontWeight="700"
            fontSize="14px"
            mt={['16px', '10px']}
            px={['16px', '16px']}
          >
            {t('manageLiveStream.chat.welcomeMsg')}
          </Text>
        )}
        {isOpen ? (
          <BlockUserModal
            handleConfirmation={handleConfirmation}
            spamUserDetails={spamUserDetails}
            isOpen={isOpen}
            onClose={onClose}
          />
        ) : null}
      </Flex>
      <Box w="full" h="80px" display={['block', 'none']} />
      <ChatTextInput sendMessage={sendMessage} />
    </>
  )
}

export default ChatTextBody

interface IchatMessage {
  id: string
  data: {
    // This for web only to create unique id for message
    msgId: string
    // This is for web only to know device from where he is sending msg so we don't filter msg of user from different device
    deviceId?: string
    message?: string
    original_msg?: string
    type: any //ChatMessageType
    msg_time: number
    isActive?: boolean
    moderator_type?: number
    isModerator?: number
    client_msg_id?: string
    client_msg_time?: number
    chat_text_color?: string
    chat_text_weight?: number
    profile: {
      avatar: string
      color?: string
      uid: string
      username: string
      text_color?: string
      text_weight?: number
    }
    sticker?: any
    reward_metadata?: {
      badge_thumbnails: string[] | []
    }
    // message_color_style?: {
    //   color: string
    //   fill_type: string
    //   gradient: {
    //     end_color: string
    //     start_color: string
    //   }
    // }
    // bg_color_style?: {
    //   color: string
    //   fill_type: string
    //   gradient: {
    //     end_color: string
    //     start_color: string
    //   }
    // }
    // cta?: {
    //   click_action: { deep_link: string }
    //   data: string
    //   text_color_style: {
    //     color: string
    //     fill_type: string
    //     gradient: {
    //       end_color: string
    //       start_color: string
    //     }
    //   }
    // }
  }
}
