import { Box, Flex, IconButton, Text } from '@chakra-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../../app/RootReducer'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../../../../utils/Amplitude'
import { metadataInterface } from '../../../../utils/Amplitude/eventPropsTypes'
import {
  confirmGivewayWinner,
  setSelectedRandomWinner,
} from '../../LiveStreamManagerSlice'

export const ConfirmGivewayWinner = () => {
  const dispatch = useDispatch()
  const {
    liveStreamManager: {
      selectedRandomWinner,
      currentLiveStreamDetails,
      confirmGivewayWinnerLoading,
      totalValidParticipants,
      winners,
    },
    login: { me },
  } = useSelector((state: RootState) => state)
  const eventProperties: metadataInterface = {
    category_id: currentLiveStreamDetails?.game_uid,
    category_name: currentLiveStreamDetails?.game_name,
    streamer_id: currentLiveStreamDetails?.streamer.user_uid,
    streamer_name: currentLiveStreamDetails?.streamer.username,
    video_id: currentLiveStreamDetails?.uid,
    video_tags: currentLiveStreamDetails?.tags,
    streamer_type: me?.user_type,
  }
  const confirmGiveawayEventProperties: eventPropsTypes.confirm_giveway_winner_props = {
    winner_number: winners.length + 1,
    number_of_participants: totalValidParticipants,
    winner_username: selectedRandomWinner?.username,
    winner_userid: selectedRandomWinner?.user_uid,
    ...eventProperties,
  }

  const handleConfirmWinner = () => {
    if (currentLiveStreamDetails?.uid) {
      eventActions.sendAmplitudeData(eventConstants.confirm_giveway_winner, {
        ...confirmGiveawayEventProperties,
      })
      dispatch(confirmGivewayWinner(currentLiveStreamDetails?.uid))
    }
  }

  const handleRejectWinner = () => {
    eventActions.sendAmplitudeData(eventConstants.reject_giveaway_winner, {
      ...eventProperties,
    })
    dispatch(setSelectedRandomWinner(null))
  }

  return (
    <React.Fragment>
      {selectedRandomWinner ? (
        <Flex
          justifyContent="space-between"
          bg="#242424"
          fontSize="xs"
          mt={2}
          p={2}
        >
          <Box>
            <Text>
              {' '}
              username - {selectedRandomWinner?.username}
              <Text verticalAlign="middle" wordBreak="break-all" opacity={0.75}>
                {' '}
                FreeFire- **********
              </Text>
            </Text>
          </Box>
          <Flex>
            <IconButton
              mr={2}
              isLoading={confirmGivewayWinnerLoading}
              aria-label="add button"
              size="xs"
              onClick={() => {
                handleConfirmWinner()
              }}
              bg="green.500"
              icon="check"
            ></IconButton>
            <IconButton
              onClick={() => {
                handleRejectWinner()
              }}
              aria-label="add button"
              size="xs"
              bg="red.500"
              icon="close"
            ></IconButton>
          </Flex>
        </Flex>
      ) : (
        false
      )}
    </React.Fragment>
  )
}
