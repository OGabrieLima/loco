import { Box, Flex, Text } from '@chakra-ui/core'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../../app/RootReducer'
import { ArrayOfOjeToCSV } from '../../../../utils/arrayOfObjectIntoCSV'
import { getGivewayDetails } from '../../LiveStreamManagerSlice'
import { ConfirmGivewayWinner } from './ConfirmGiveWinner'
import { SelectRandomGivewayWinner } from './SelectRandomWinner'
import { WinnerRow } from './WinnerRow'

function GiveWay() {
  const {
    liveStreamManager: { winners, isLive, currentLiveStreamDetails, error },
  } = useSelector((state: RootState) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    let interval: any
    if (isLive && !error) {
      interval = setInterval(() => {
        if (
          currentLiveStreamDetails?.tags.filter(
            (tag) => tag.toLocaleLowerCase() === 'giveaway'
          ).length === 1
        ) {
          dispatch(getGivewayDetails(currentLiveStreamDetails?.uid))
        }
      }, 5000)
    } else if (!isLive) {
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isLive, currentLiveStreamDetails?.uid, currentLiveStreamDetails?.tags])

  return (
    <Box h="full" mt={4}>
      <Text
        border="1px solid rgba(255, 202, 0, 0.4);"
        bg="rgba(255, 202, 0, 0.05) "
        fontSize="xs"
        p={2}
        mt={2}
      >
        Ask your viewers to add their Free Fire ID to their Loco Profile before
        sending stickers
      </Text>
      <SelectRandomGivewayWinner />
      <ConfirmGivewayWinner />
      {winners.length ? (
        <Flex flexDirection="column" fontSize="xs" mt={2}>
          <Flex justifyContent="flex-end" width="full" bg="#242424">
            <Flex w="60%" justifyContent="space-between" px={2} py={1}>
              <Text textTransform="uppercase">Winners List</Text>
              <Text
                as="button"
                textTransform="uppercase"
                onClick={() => {
                  if (winners.length) {
                    ArrayOfOjeToCSV(
                      winners.map((winner) => {
                        return {
                          username: winner.username,
                          freefire_id: winner.gameIds[20097],
                        }
                      })
                    )
                  }
                }}
              >
                download
              </Text>
            </Flex>
          </Flex>
          <Flex
            bg="#181818"
            p={2}
            height="auto"
            flexDirection="column"
            overflow="auto"
          >
            {winners
              ?.map((winner) => {
                return <WinnerRow key={winner.userUid} winner={winner} />
              })
              .reverse()}
          </Flex>
        </Flex>
      ) : (
        false
      )}
    </Box>
  )
}

export default GiveWay
