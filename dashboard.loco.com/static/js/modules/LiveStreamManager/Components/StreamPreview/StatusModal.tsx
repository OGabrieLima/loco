import {
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

type StatusModalProps = {
  title: string
  subTitle?: string
  icon?: React.ReactNode
  isOpen?: boolean
  onClose: () => void
  shouldHideSubTitle?: boolean
  cta?: {
    title: string
    action: () => void
  }
}

export const StatusModal = ({
  title,
  subTitle,
  icon,
  isOpen,
  onClose,
  shouldHideSubTitle,
  cta,
}: StatusModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal
      size={['328px', '570px']}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg={'transparent'}>
        <Flex justifyContent={'flex-end'} padding={2}>
          <Icon
            //@ts-ignore
            name="close"
            cursor="pointer"
            role="presentation"
            onClick={() => {
              onClose()
            }}
            size="6"
          />
        </Flex>

        <ModalBody
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          bg={'#282828'}
          p={['16px', '24px']}
          borderRadius={'12px'}
        >
          {icon}
          <Text
            mt={icon ? ['16px', '24px'] : 0}
            fontSize={['14px', '20px']}
            fontWeight={700}
            color={'white'}
            textAlign={'center'}
            lineHeight={'25.94px'}
            letterSpacing={0}
          >
            {t(`${title}`)}
          </Text>
          {!shouldHideSubTitle && subTitle && (
            <Text
              mt={3}
              fontSize={['12px', '14px']}
              fontWeight={400}
              color={'#B2B2B2'}
              textAlign={'center'}
              lineHeight={'18.16px'}
              letterSpacing={0}
            >
              {t(`${subTitle}`)}
            </Text>
          )}
          {cta && (
            <Button
              mt={['16px', '40px']}
              color="white"
              fontSize={['12px', '14px']}
              fontWeight="extrabold"
              backgroundColor={'#FF5A12'}
              borderRadius={'10px'}
              lineHeight={'100%'}
              border={'none'}
              py={['10px', '13px']}
              width="100%"
              _hover={{
                bg: '#FF5A12',
                border: 'none',
              }}
              _active={{
                bg: '#FF5A12',
                border: 'none',
              }}
              _focus={{
                bg: '#FF5A12',
                border: 'none',
              }}
              onClick={() => cta.action()}
            >
              {t(`${cta.title}`)}
            </Button>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
