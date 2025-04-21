import { blockUser } from '@api/apiRequest'
import { RootState } from '@app/RootReducer'
import { Box } from '@chakra-ui/core'
import { useCustomToast } from '@components/customToast'
import useMqttState from '@context/MqttConnetor/useMqttState'
import { sendAmplitudeData } from '@utils/Amplitude/amplitude'
import isMobile from 'is-mobile'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import ChatTextBody from './ChatTextBody'

const ChatBody = ({
  handleEventStreamerChatSend,
  filters,
  handleChatMsgs,
}: {
  handleEventStreamerChatSend: (chat: string) => void
  filters: any
  handleChatMsgs: (msgs: any) => void
}) => {
  const { t } = useTranslation()
  const [userRecievedGiveaway, setUsersRecievedGiveaway] = useState<string[]>(
    []
  )
  const toast = useCustomToast()
  const {
    liveStreamManager: { currentLiveStreamDetails },
    login: { me: streamerDetails },
  } = useSelector((state: RootState) => state)

  const { mqtt } = useMqttState()

  const handleBlockConfirmation = async (spamUserDetails: any) => {
    if (spamUserDetails) {
      if (mqtt) {
        mqtt.publish(
          `chat/v2/${currentLiveStreamDetails?.uid}/command`,
          JSON.stringify({
            user_uid: spamUserDetails?.uid,
            streamer_uid: currentLiveStreamDetails?.streamer?.user_uid,
            status: 10,
          }),
          { qos: 1 }
        )
      }
      const result = await blockUser({
        user_uid: spamUserDetails?.uid,
        stream_id: currentLiveStreamDetails?.uid,
        block_chats: 10,
      })
      toast({
        position: isMobile() ? 'bottom' : 'top',
        duration: 2000,
        isClosable: true,
        note: !result.statusCode
          ? t('stream_page.toast_popup.user_actions.muted_on_chat', {
              username: spamUserDetails.username,
            })
          : result?.message || 'something went wrong',
      })
      sendAmplitudeData('Mute_user', {
        streamer_id: streamerDetails?.user_uid,
        streamer_username: streamerDetails?.username,
        actor_type: 'streamer',
        video_id: currentLiveStreamDetails?.uid,
        streamer_type: streamerDetails?.user_type,
        mute_user_id: spamUserDetails?.uid,
        mute_username: spamUserDetails?.username,
        category_name: currentLiveStreamDetails?.game_name ?? '',
        delete_message_toggle: 'on',
        source: 'live_stream_manager',
      })
    }
  }

  useEffect(() => {
    const userRecievedGiveawayLocalValue = localStorage.getItem(
      'userRecievedGiveaway'
    )
    let updateUserRecievedGiveawayLocalValue = []
    if (userRecievedGiveawayLocalValue) {
      updateUserRecievedGiveawayLocalValue = JSON.parse(
        userRecievedGiveawayLocalValue
      )
    } else {
      updateUserRecievedGiveawayLocalValue = []
    }

    setUsersRecievedGiveaway(updateUserRecievedGiveawayLocalValue)
  }, [])
  return (
    <>
      <Box
        flexDirection="column"
        position="relative"
        pt={3}
        pb={[0, 4]}
        justifyContent="space-between"
        h="full"
        maxH={['90%', 'full']}
        overflow="hidden"
        display={['grid', 'flex']}
        gridTemplateColumns={['1fr']}
        gridTemplateRows={['1fr 90px']}
      >
        <ChatTextBody
          handleBlockConfirmation={handleBlockConfirmation}
          streamerDetails={streamerDetails}
          usersRecievedGiveaway={userRecievedGiveaway}
          filters={filters}
          handleEventStreamerChatSend={handleEventStreamerChatSend}
          setUsersRecievedGiveaway={setUsersRecievedGiveaway}
          handleChatMsgs={handleChatMsgs}
        />
      </Box>
    </>
  )
}

export default ChatBody
