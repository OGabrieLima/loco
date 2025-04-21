import { Box, Button, Icon, Stack, Text } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const NotPremiumStreamerOnLocoModal = ({
  onClose,
}: {
  onClose: () => void
}) => {
  const { t } = useTranslation()
  return (
    <Stack spacing={8} align={'center'} w="full">
      <Icon name="warning" width="60px" height="50px" color="#ffe351" />
      <Text fontWeight="bold" fontSize={['16px', '18px']}>
        {t('notAStreamerModal.title')}
      </Text>
      <Box fontSize={['16px', '18px']} textAlign="center">
        <Box opacity={0.6}>{t('notAStreamerModal.description')}</Box>
      </Box>
      <Button
        width="150px"
        height="44px"
        fontSize={['12px', '14px']}
        borderRadius="8px"
        box-shadow="0 2px 9px 0 rgba(81, 31, 255, 0.08)"
        variantColor="progress"
        _focus={{ outline: 'none' }}
        onClick={() => {
          onClose()
        }}
      >
        {t('notAStreamerModal.continue')}
      </Button>
    </Stack>
  )
}
