import { Button, Flex, Icon, Stack, Text } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

import exitWebView from '../../utils/exitWebview'

export const WebViewLoginError = () => {
  const { t } = useTranslation()
  return (
    <Flex
      w={['xs', 'sm', 'xl']}
      flexDir="column"
      h={['auto', '350px']}
      bg="#181818"
      alignItems="center"
      justifyContent="center"
      alignContent="center"
      rounded={10}
      color="white"
      px={[4, 4, 16]}
      py={4}
    >
      <Stack spacing={5} w="full" align="center">
        <Icon
          name="warning"
          size="24"
          color="brand.loco-primary"
          display={['none', 'none', 'inline-block']}
        />
        <Icon
          name="warning"
          size="20"
          color="brand.loco-primary"
          display={['inline-block', 'inline-block', 'none']}
        />
        <Text>
          <Text
            fontSize="xl"
            color="brand.loco-primary"
            fontWeight="bold"
            textAlign="center"
          >
            {t('error.somethingWrong')}
          </Text>
          <Text
            textAlign="center"
            wordBreak="break-word"
            fontWeight="medium"
            fontSize="sm"
            my="8px"
            color="brand.loco-grey-20"
          >
            {t('error.webview_error_subtitile_999')}
          </Text>
        </Text>
        <Button
          bg="brand.loco-primary"
          color="white"
          rounded={'10px'}
          fontWeight="bold"
          minH={['32px', '48px']}
          fontSize={['14px', '16px']}
          w="full"
          onClick={() => {
            exitWebView()
          }}
        >
          {t('error.close_text')}
        </Button>
      </Stack>
    </Flex>
  )
}
