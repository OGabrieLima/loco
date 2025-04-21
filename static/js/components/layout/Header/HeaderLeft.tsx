import { Flex, Icon, PseudoBox, Text } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'

import { paths } from '../../../routers/constants'

const HeaderLeft = ({
  showHeaderCenter,
  disableHomeAndCenter,
}: {
  showHeaderCenter: boolean
  disableHomeAndCenter: boolean
}) => {
  const history = useHistory()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const handleGoToHome = () => {
    if (pathname === paths.dashboard.home || disableHomeAndCenter) {
      return
    }
    history.push(paths.dashboard.home)
  }

  return (
    <Flex
      align="center"
      w={showHeaderCenter ? ['50%', '18%'] : '90%'}
      minWidth={'234px'}
      boxSizing="border-box"
      whiteSpace={'nowrap'}
    >
      <PseudoBox
        display="flex"
        alignItems="center"
        onClick={handleGoToHome}
        cursor={disableHomeAndCenter ? 'default' : 'pointer'}
      >
        <Icon
          //@ts-ignore
          name="loco"
          color="white"
          height={'22px'}
          width={'150px'}
          ml={6}
          mr={3}
          display={['none', 'flex', 'flex']}
        />
        <Text
          as="span"
          display={['none', 'none', 'flex']}
          fontSize={['xs', 'sm']}
          fontWeight={['black', 'bold']}
          color="white"
        >
          {t('header.title')}
        </Text>
      </PseudoBox>
    </Flex>
  )
}

export default HeaderLeft
