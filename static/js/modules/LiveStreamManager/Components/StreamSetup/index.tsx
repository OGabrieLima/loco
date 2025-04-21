import {
  Collapse,
  Flex,
  Icon,
  Text,
  useDisclosure,
  usePrevious,
} from '@chakra-ui/core'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { RootState } from '../../../../app/RootReducer'
import StreamKeyResetModal from '../../../../components/StreamKeyResetModal'
import SectionHeader from '../SectionHeader'
import StreamConfig from './StreamConfig'

const StreamSetup = (props: any) => {
  const { isLive, currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { isOpen, onToggle, onClose } = useDisclosure(!isLive)
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure()
  const prevIsLive = usePrevious(isLive)
  useEffect(() => {
    if (!prevIsLive && isLive && currentLiveStreamDetails) {
      onClose()
    }
  }, [isLive, currentLiveStreamDetails])
  const { t } = useTranslation()
  const streamSetupTitle = t('home.streamSetup.title')

  return (
    <>
      <Flex
        bg="brand.loco-black"
        direction="column"
        w="full"
        mt={2}
        align="center"
        display={['none', 'flex', 'flex']}
        {...props}
      >
        <SectionHeader>
          <>
            <Text fontSize={'16px'} fontWeight={'700'}>
              {streamSetupTitle}
            </Text>
            <Icon
              //@ts-ignore
              name={isOpen ? 'upArrow' : 'downArrow'}
              size="24px"
              onClick={onToggle}
              cursor="pointer"
            />
          </>
        </SectionHeader>
        <Flex
          w="full"
          justifyContent={'center'}
          alignItems={'center'}
          bg="brand.loco-grey-7"
          mt="8px"
          rounded={'12px'}
        >
          <Collapse isOpen={isOpen} minW="31vw" w="full">
            <StreamConfig onOpen={onModalOpen} />
          </Collapse>
        </Flex>
      </Flex>
      <StreamKeyResetModal isOpen={isModalOpen} onClose={onModalClose} />
    </>
  )
}

export default StreamSetup
