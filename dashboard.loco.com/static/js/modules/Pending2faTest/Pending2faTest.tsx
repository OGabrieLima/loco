import { RootState } from '@app/RootReducer'
import { Box, Text } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const Pending2faTest = () => {
  const { t } = useTranslation()
  const { is2faCompleted } = useSelector((state: RootState) => state.login)
  if (is2faCompleted) {
    return <></>
  }
  return (
    <Box
      borderRadius={'4px'}
      my="auto"
      py={'4px'}
      px={'10px'}
      bg="brand.loco-grey-6"
    >
      <Text
        fontSize={['10px', '12px']}
        lineHeight={'130%'}
        fontWeight={'400'}
        color={'brand.loco-grey-20'}
        whiteSpace={'nowrap'}
      >
        {t('profile.2faPending')}
      </Text>
    </Box>
  )
}

export default Pending2faTest
