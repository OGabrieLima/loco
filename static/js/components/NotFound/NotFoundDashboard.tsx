import { Box, Flex, Icon, Text } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

const NotFoundDashboard = () => {
  const { t } = useTranslation()
  const history = useHistory()
  return (
    <Flex
      as="section"
      height="full"
      width="full"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      px={6}
    >
      <Box
        maxW={['100vw', '60vw', '30vw']}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        lineHeight={'130%'}
        display={'flex'}
      >
        <Icon
          name="notFound"
          size="auto"
          mx="auto"
          height={['62px', '72px']}
          width={['62px', '72px']}
          mb={4}
        />
        <Text
          textAlign={'center'}
          fontSize={['14px', '16px']}
          color="#fff"
          fontWeight="bold"
          mb={2}
        >
          {t('common.not_found_text')}
        </Text>
        <Text
          textAlign={'center'}
          fontSize={['12px', '14px']}
          color="brand.loco-grey-20"
          fontWeight="400"
          mb={2}
        >
          {t('common.please_check_other_page')}
        </Text>
        <Box
          as="button"
          bg="brand.loco-primary"
          color="white"
          minH={['40px', '48px']}
          fontSize={['14px', '16px']}
          fontWeight={700}
          marginTop="32px"
          onClick={() => history.push('/dashboard/home/')}
          padding={['8px 16px', '10px 20px']}
          borderRadius="10px"
        >
          {t('common.back_to_home')}
        </Box>
      </Box>
    </Flex>
  )
}

export default NotFoundDashboard
