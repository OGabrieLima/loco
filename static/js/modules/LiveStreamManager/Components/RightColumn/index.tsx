import { Flex } from '@chakra-ui/core'
import { useRtlTranslation } from '@src/i18n/utils'
import React from 'react'

import ChatBox from '../ChatBox'

const RightColumn = (props: any) => {
  const { maxW, handleChatMsgs } = props

  const isRTL = useRtlTranslation()
  return (
    <Flex
      dir={isRTL ? 'rtl' : 'ltr'}
      direction="column"
      h="100%"
      w="100%"
      justifyContent="flex-start"
      boxSizing="border-box"
      maxW={maxW}
    >
      <ChatBox handleChatMsgs={handleChatMsgs} />
    </Flex>
  )
}

export default RightColumn
