import { Flex } from '@chakra-ui/core'
import { useRtlTranslation } from '@src/i18n/utils'
import React from 'react'

import StreamInfo from '../StreamInfo'
import StreamPreview from '../StreamPreview'

const LeftColumn = (props: any) => {
  const isRTL = useRtlTranslation()
  return (
    <Flex
      dir={isRTL ? 'rtl' : 'ltr'}
      direction="column"
      h="100%"
      w="100%"
      justifyContent="space-between"
      boxSizing="border-box"
      {...props}
    >
      <StreamPreview />
      {/* {isWebViewBuild || isMobile() ? null : <NotificationAndShare />} */}
      <StreamInfo />
    </Flex>
  )
}

export default LeftColumn
