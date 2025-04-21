import { RootState } from '@app/RootReducer'
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/core'
import { isWebViewBuild } from '@src/constent'
import { fetchGames, fetchLanguages } from '@src/modules/Login/loginSlice'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import EditStreamModal from '../EditCurrentStreamModal'
import SectionHeader from '../SectionHeader'
import SocialSharing from '../SocialSharing'
import FooterButton from './FooterButton'
import StreamInfoFields from './StreamInfoFields'

const StreamInfo = (props: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch()
  const { isLive } = useSelector((state: RootState) => state.liveStreamManager)
  const { languages, games } = useSelector((state: RootState) => state.login)
  const { t } = useTranslation()
  const streamInfoText = t('manageLiveStream.streamInfo.title')
  const editText = t('manageLiveStream.streamInfo.edit')

  useEffect(() => {
    if (languages.length > 0) return
    dispatch(fetchLanguages())
  }, [languages])

  useEffect(() => {
    if (games.length > 0) return
    dispatch(fetchGames())
  }, [games])

  return (
    <>
      <Flex
        bg={['brand.loco-black']}
        direction="column"
        w="full"
        flex={1}
        overflow="hidden"
        // maxH="full"
        h="fit-content"
        {...props}
      >
        <SectionHeader display={['flex']}>
          <>
            <Text
              fontSize={['14px', '16px']}
              lineHeight="130%"
              fontWeight={'700'}
            >
              {streamInfoText}
            </Text>
            <Button
              variant="ghost"
              h="full"
              isDisabled={!isLive}
              color="brand.loco-primary"
              fontSize={['14px', '16px']}
              lineHeight="130%"
              fontWeight={'700'}
              _disabled={{
                color: 'brand.loco-grey-40',
                opacity: 1,
              }}
              _focus={{
                background: 'transparent',
                outline: 'none',
              }}
              _active={{
                background: 'transparent',
                outline: 'none',
              }}
              _hover={{
                background: 'none',
                outline: 'none',
              }}
              onClick={onOpen}
            >
              {editText}
            </Button>
          </>
        </SectionHeader>
        <Flex
          pt={[2, 6]}
          pb={4}
          px={['16px', '12px']}
          mb={[8, 4]}
          direction="inherit"
          flex={1}
          maxH={['35%', '50%']}
          overflowY={'auto'}
        >
          <StreamInfoFields />
        </Flex>
        {isWebViewBuild ? null : <SocialSharing />}
        <FooterButton />
      </Flex>
      {isOpen && <EditStreamModal isOpen={isOpen} onClose={onClose} />}
    </>
  )
}

export default StreamInfo
