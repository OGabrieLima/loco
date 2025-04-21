import { Flex, Icon, Text } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { SUPPORTED_LANGUAGE } from '../../i18n/constants'

const LanguageDisplay = ({
  isVisible,
  origin,
}: {
  isVisible: boolean

  origin: 'login_modal' | 'profile_section'
}) => {
  const { i18n, t } = useTranslation()
  const resolvedLanguage = i18n.resolvedLanguage as keyof typeof SUPPORTED_LANGUAGE
  const languageTitle =
    SUPPORTED_LANGUAGE[resolvedLanguage]?.nativeName ||
    `${t('change_language.language_text')} - ${resolvedLanguage}`

  const isLoginPage = origin === 'login_modal'
  return (
    <Flex
      padding="0px"
      gridGap={'4px'}
      fontSize={isLoginPage ? '12px' : '12px'}
      fontWeight="normal"
      justifyContent="center"
      alignItems="center"
      color="#FFFFFF"
    >
      <Icon name="globe_white_icon" size={isLoginPage ? '16px' : '24px'} />
      <Text mx="4px">{languageTitle}</Text>
      <Icon
        ml={isLoginPage ? '4px' : '12px'}
        name="downArrow"
        size={isLoginPage ? '20px' : '16px'}
        cursor={'pointer'}
        transform={isVisible ? 'rotate(180deg)' : 'rotate(0deg)'}
      />
    </Flex>
  )
}

export default LanguageDisplay
