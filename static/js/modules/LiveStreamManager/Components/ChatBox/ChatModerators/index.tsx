import { RootState } from '@app/RootReducer'
import { Button, Text } from '@chakra-ui/core'
import { sendAmplitudeData } from '@utils/Amplitude/amplitude'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import ModeratorsList from './List'

export default function ChatModerators() {
  const { currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { me } = useSelector((state: RootState) => state.login)
  const { data: totalModerators, loading } = useSelector(
    (state: RootState) => state.community.moderators
  )
  const liveModerators = useSelector(
    (state: RootState) => state.community.liveModerators
  )
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => {
    setIsOpen(false)
  }
  const onClickModButton = () => {
    sendAmplitudeData('Live_mods_list_open', {
      video_id: currentLiveStreamDetails?.uid,
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_type: me?.user_type,
      category_name: currentLiveStreamDetails?.game_name ?? '',
      live_mods: liveModerators.length,
    })
    setIsOpen(true)
  }
  return (
    <>
      <Button
        display="flex"
        alignItems="center"
        cursor={'pointer'}
        background="transparent"
        padding="0"
        height="fit-content"
        _hover={{
          background: 'transparent',
        }}
        _focus={{
          outline: 'none',
        }}
        onClick={onClickModButton}
      >
        <img
          src="/static/images/chat/mod_icon.svg"
          alt="moderator icon"
          width="16px"
          height="16px"
        />
        <Text
          fontSize="14px"
          fontWeight="700"
          style={{
            marginInlineStart: '6px',
          }}
        >
          {liveModerators.length}
        </Text>
      </Button>
      <ModeratorsList
        isOpen={isOpen}
        onClose={handleClose}
        list={totalModerators}
        fetchingList={loading}
      />
    </>
  )
}
