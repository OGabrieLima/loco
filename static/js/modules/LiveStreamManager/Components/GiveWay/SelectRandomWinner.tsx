import { Flex, Text } from '@chakra-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../../app/RootReducer'
import PrimaryButton from '../../../../components/buttons/PrimaryButton'
import { selectRandomGivewayWinner } from '../../LiveStreamManagerSlice'

export const SelectRandomGivewayWinner = () => {
  const dispatch = useDispatch()
  const {
    liveStreamManager: {
      currentLiveStreamDetails,
      totalValidParticipants,
      selectedRandomWinner,
      randomWinnerLoading,
    },
  } = useSelector((state: RootState) => state)
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      bg="#242424"
      fontSize="xs"
      mt={2}
      p={2}
    >
      <Text textAlign="center">Eligible Participants*</Text>
      <Text textAlign="center" fontWeight="bold" fontSize="xl">
        {totalValidParticipants}
      </Text>
      <PrimaryButton
        fontSize="sm"
        fontWeight="black"
        isDisabled={
          selectedRandomWinner?.user_uid && totalValidParticipants
            ? true
            : false
        }
        isLoading={randomWinnerLoading}
        onClick={() => {
          if (currentLiveStreamDetails?.uid) {
            dispatch(selectRandomGivewayWinner(currentLiveStreamDetails?.uid))
          }
        }}
      >
        Select a winner{' '}
      </PrimaryButton>
      <Text mt={4}>
        *Eligible participants are those viewers who have updated their FreeFire
        ID on their Loco profile.
      </Text>
    </Flex>
  )
}
