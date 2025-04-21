import { Box, Flex, Text, useClipboard } from '@chakra-ui/core'
import React, { useState } from 'react'

import { WinnerInterface } from '../../LiveStreamManagerSlice'

export const WinnerRow = ({ winner }: { winner: WinnerInterface }) => {
  const [isShow, setShow] = useState(false)
  const { onCopy, hasCopied } = useClipboard(winner.gameIds[20097])

  return (
    <Flex
      key={winner.user_uid}
      width="full"
      bg="#181818"
      justifyContent="space-between"
      p={2}
    >
      <Box>
        <Text> username - {winner.username} </Text>
        <Text verticalAlign="middle" wordBreak="break-all" opacity={0.75}>
          {' '}
          FreeFire - {isShow ? winner.gameIds[20097] : '**********'}
        </Text>
      </Box>
      <Flex alignItems="flex-end">
        <Text
          as="button"
          onClick={() => {
            setShow(!isShow)
          }}
        >
          {isShow ? 'Hide' : 'Show'}
        </Text>
        <Text as="button" onClick={onCopy} ml={4}>
          {' '}
          {hasCopied ? 'Copied' : 'Copy'}
        </Text>
      </Flex>
    </Flex>
  )
}
