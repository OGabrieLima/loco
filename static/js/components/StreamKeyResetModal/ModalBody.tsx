import { Button, Flex, Text } from '@chakra-ui/core'
import { useRtlTranslation } from '@src/i18n/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ModalBody = ({
  onClose,
  onSubmit,
}: {
  onClose: () => any
  onSubmit: () => any
}) => {
  const { t } = useTranslation()
  const isRTL = useRtlTranslation()

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      px={[4, 8]}
      pb={8}
      pt={4}
    >
      <Text fontSize={['14px', '16px']} fontWeight="700" textAlign="center">
        {t('home.streamSetup.resetModaltitle')}
      </Text>
      <Text
        color="brand.loco-gray-20"
        fontSize={['12px', '14px']}
        textAlign="center"
        mt={['8px', '24px']}
        mb={'24px'}
      >
        {t('home.streamSetup.resetModalSubtitle')}
      </Text>
      <Flex gridGap={'16px'}>
        <Button
          borderColor="brand.loco-primary"
          borderWidth="2px"
          bg={'transparent'}
          rounded={'10px'}
          py={['8px', '12px']}
          px={['12px', '24px']}
          fontSize={['12px', '14px']}
          fontWeight={'700'}
          mr={isRTL ? 0 : 4}
          ml={isRTL ? 4 : 0}
          w="120px"
          _hover={{
            opacity: 0.75,
          }}
          _focus={{
            outline: 'none',
          }}
          onClick={() => {
            onSubmit()
            onClose()
          }}
          textTransform={'capitalize'}
          verticalAlign="middle"
          color="brand.loco-primary"
        >
          {t('home.streamSetup.yes')}
        </Button>
        <Button
          bg={'brand.loco-primary'}
          rounded={'10px'}
          py={['8px', '12px']}
          px={['12px', '24px']}
          fontSize={['12px', '14px']}
          fontWeight={'700'}
          mr={isRTL ? 4 : 0}
          ml={isRTL ? 0 : 4}
          w="120px"
          _focus={{
            outline: 'none',
          }}
          _hover={{
            opacity: 0.75,
          }}
          textTransform={'capitalize'}
          onClick={onClose}
          verticalAlign="middle"
          color="white"
        >
          {t('home.streamSetup.no')}
        </Button>
      </Flex>
    </Flex>
  )
}

export default ModalBody
