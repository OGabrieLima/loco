import { Flex, PseudoBox } from '@chakra-ui/core'
import styled from '@emotion/styled-base'
import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { RootState } from '../../../app/RootReducer'
import { isWebViewBuild } from '../../../constent'
import { paths } from '../../../routers/constants'
import HeaderLeft from './HeaderLeft'
import HeaderMobile from './HeaderMobile'
import HeaderRight from './HeaderRight'
import HeaderWebview from './HeaderWebview'
import LiveStreamManagerHeader from './LiveStreamManagerHeader'

const Box = styled(PseudoBox)<{ $hideHeaderForMobile: boolean }>`
  @media only screen and (max-width: 47.95rem) {
    ${({ $hideHeaderForMobile }) => $hideHeaderForMobile && `display:none`}
  }
`

const Header = () => {
  const location = useLocation()
  const {
    streamDetails: { isStreamSetupCompleted },
    login: { isOnboardingCompleted },
  } = useSelector((state: RootState) => state)

  let showHeaderCenter = true

  const disableHomeAndCenter = !isStreamSetupCompleted || !isOnboardingCompleted
  if (location.pathname === paths.dashboard.stream) {
    showHeaderCenter = false
  }
  const hideHeaderForMobile = isWebViewBuild
    ? /dashboard\/moderators/.test(location.pathname)
    : false

  return (
    <Box display="flex" $hideHeaderForMobile={hideHeaderForMobile}>
      <Flex
        h={['56px']}
        display={['none', 'flex', 'flex']}
        // bg="brand.primary-light-black-v2"
        bg="black"
        align="center"
        justify="space-between"
        overflow="hidden"
        boxSizing="border-box"
        w="full"
        color="white"
        borderBottom={'1px solid #3A3A3A'}
        px={[3, 0]}
      >
        <HeaderLeft
          showHeaderCenter={showHeaderCenter}
          disableHomeAndCenter={disableHomeAndCenter}
        />
        {!showHeaderCenter ? <LiveStreamManagerHeader /> : null}
        <HeaderRight
          showHeaderCenter={showHeaderCenter}
          disableHomeAndCenter={disableHomeAndCenter}
        />
      </Flex>
      <Flex
        h={['56px']}
        display={['flex', 'none', 'none']}
        // bg={
        //   isWebViewBuild
        //     ? 'brand.primary-dark-black-v2'
        //     : 'brand.primary-light-black-v2'
        // }
        bg="black"
        borderBottom="1px solid #3A3A3A"
        align="center"
        justify="space-between"
        overflow="hidden"
        boxSizing="border-box"
        w="full"
        color="white"
        px={[3, 0]}
      >
        {isWebViewBuild && <HeaderWebview />}
        {!isWebViewBuild && <HeaderMobile disableMenu={disableHomeAndCenter} />}
      </Flex>
    </Box>
  )
}

export default Header
