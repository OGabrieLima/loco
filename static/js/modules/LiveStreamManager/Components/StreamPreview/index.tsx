import { RootState } from '@app/RootReducer'
import { Flex, Icon, Text } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import SectionHeader from '../SectionHeader'
import StreamPlayer from './StreamPlayer'
import Tabs from './Tabs'

const StreamPreview = (props: any) => {
  const { t } = useTranslation()

  const { isLive } = useSelector((state: RootState) => state.liveStreamManager)
  const streamPreview = t('manageLiveStream.streamPreview.title')
  return (
    <Flex
      bg={['transparent', 'brand.loco-black']}
      direction="column"
      w="full"
      mt={[0, 2]}
      align="center"
      lineHeight={'130%'}
      {...props}
    >
      <SectionHeader>
        <Flex whiteSpace="nowrap" align="center">
          <Text fontSize={'16px'} fontWeight={'700'}>
            {streamPreview}
          </Text>
          {isLive && (
            <Text
              p="4px"
              ml="8px"
              height="28px"
              fontSize="20px"
              fontWeight="bold"
              borderRadius="10px"
              background="#FF5A12"
              textTransform="uppercase"
            >
              {t('common.live_tag_text')}
            </Text>
          )}
        </Flex>
      </SectionHeader>
      <Flex py={'10px'} direction="inherit" h="full" align="center" w="100%">
        <StreamPlayer />
        <Tabs />
      </Flex>
    </Flex>
  )
}

export default StreamPreview
