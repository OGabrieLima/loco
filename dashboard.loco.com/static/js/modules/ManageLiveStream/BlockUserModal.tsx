import { Box, Button, Flex, Text } from '@chakra-ui/core'
import NewModal from '@components/NewModal'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { spamUser } from '../LiveStreamManager/types'

export const BlockUserModal = ({
  isOpen,
  onClose,
  handleConfirmation,
  spamUserDetails,
}: {
  isOpen: boolean
  onClose: () => void
  handleConfirmation: () => void
  spamUserDetails: spamUser
}) => {
  const { t } = useTranslation()

  return (
    <NewModal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
      closeOnOverlayClick={false}
      modalContentStyle={{
        bg: '#282828',
        minWidth: ['100%', '564px'],
        width: ['100%', '564px'],
        padding: ['24px', '24px'],
        marginTop: '0',
      }}
      modalHeaderStyle={{
        padding: 0,
      }}
      modalBodyStyle={{
        padding: 0,
      }}
      modalBodyComponent={
        <>
          <Flex
            w="full"
            justifyContent="center"
            alignItems={'center'}
            direction={'column'}
            gridGap="12px"
          >
            <Text
              w="full"
              textAlign={'center'}
              fontSize={['16px', '20px']}
              lineHeight={'130%'}
              fontWeight="700"
              as="h4"
            >
              {t('manageLiveStream.chat.mute.mute_button')} @
              {spamUserDetails?.username}
            </Text>
            <Text
              fontSize={['14px', '16px']}
              lineHeight="130%"
              color="#B2B2B2"
              textAlign={'center'}
            >
              {t('manageLiveStream.chat.mute.subtitle1')}
            </Text>
            <Text
              fontSize={['14px', '16px']}
              lineHeight="130%"
              color="#B2B2B2"
              textAlign={'center'}
            >
              {t('manageLiveStream.chat.mute.subtitle2')}
              <br />
              {t('manageLiveStream.chat.mute.subtitle3')}
              <br />
            </Text>

            <Text
              fontSize={['14px', '16px']}
              lineHeight="130%"
              color="#B2B2B2"
              textAlign={'center'}
            >
              {t('manageLiveStream.chat.mute.subtitle4')}
            </Text>
            <Box
              marginTop={['24px']}
              display="flex"
              justifyContent="center"
              alignItems={'center'}
              w="full"
              gridGap={'8px'}
              flexDirection={'column'}
            >
              <Button
                minH={'40px'}
                w="full"
                textAlign={'center'}
                padding="0"
                rounded={'12px'}
                fontWeight="700"
                fontSize={'14px'}
                bg="brand.loco-primary"
                color="white"
                _hover={{ background: 'brand.loco-primary' }}
                _focus={{ outline: 'none' }}
                onClick={handleConfirmation}
              >
                {t('manageLiveStream.chat.mute.mute_button')}
              </Button>
              <Button
                minH={'40px'}
                w="full"
                textAlign={'center'}
                rounded={'12px'}
                fontWeight="700"
                fontSize={'14px'}
                background="none"
                color="brand.loco-primary"
                padding="0"
                margin={'0px 24px'}
                _focus={{ outline: 'none' }}
                _hover={{
                  bg: 'none',
                }}
                onClick={onClose}
              >
                {t('manageLiveStream.chat.mute.cancel')}
              </Button>
            </Box>
          </Flex>
        </>
      }
    />
  )
}
