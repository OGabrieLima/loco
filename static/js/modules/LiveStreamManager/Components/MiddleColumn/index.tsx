import { Flex } from '@chakra-ui/core'
import { useRtlTranslation } from '@src/i18n/utils'
import React from 'react'

import ActivityFeed from '../ActivityFeed'
import StreamSetup from '../StreamSetup'
const MiddleColumn = (props: any) => {
  const { maxW, activityMsgs } = props
  const isRTL = useRtlTranslation()
  return (
    <Flex
      dir={isRTL ? 'rtl' : 'ltr'}
      direction="column"
      h="full"
      w="full"
      justifyContent="flex-start"
      boxSizing="border-box"
      maxW={maxW}
      px={['0px', '10px']}
      borderRight={'1px solid #3A3A3A'}
      borderLeft={'1px solid #3A3A3A'}
    >
      <StreamSetup />
      <ActivityFeed activityMsgs={activityMsgs} />
    </Flex>
  )
}

export default MiddleColumn
