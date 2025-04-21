import { Box, Button, IModal, Text } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

import NewModal from '../../../../components/NewModal'

type IModalProps = {
  message: string
  onSuccess?: () => void
}

const ConfirmPreferences = ({
  isOpen,
  onClose,
  onSuccess,
  message,
}: IModalProps & Omit<IModal, 'children'>): JSX.Element => {
  const { t } = useTranslation()

  return (
    <NewModal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
      modalContentStyle={{
        bg: '#1F1F1F',
        minWidth: '480px',
        width: '480px',
        padding: '34px 16px 24px 16px',
        borderRadius: '12px',
        marginTop: '0',
        height: '226px',
        background: '#1F1F1F',
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)',
      }}
      modalHeaderComponent={
        <>
          <Text
            textAlign="center"
            as="h3"
            fontSize={'16px'}
            fontWeight="400"
            lineHeight="22px"
          >
            {message}
          </Text>
        </>
      }
      modalBodyComponent={
        <Box display="flex" justifyContent="space-between" marginTop="16px">
          <Button
            background="transparent"
            border="2px solid #511FFF"
            padding="13px 24px"
            height="50px"
            fontSize="20px"
            lineHeight="24px"
            fontWeight="bold"
            maxWidth="160px"
            _hover={{
              background: 'inherit',
            }}
            _focusWithin={{
              boxShadow: 'none',
            }}
            onClick={onClose}
          >
            {t('manageLiveStream.chat.chatSettings.later')}
          </Button>
          <Button
            backgroundColor="#511FFF"
            padding="13px 21px"
            height="50px"
            fontSize="20px"
            lineHeight="24px"
            fontWeight="bold"
            maxWidth="200px"
            boxShadow="none"
            _hover={{
              background: '#511FFF',
            }}
            _focusWithin={{
              boxShadow: 'none',
            }}
            onClick={onSuccess}
          >
            {t('manageLiveStream.chat.chatSettings.continue')}
          </Button>
        </Box>
      }
    />
  )
}

export default ConfirmPreferences
