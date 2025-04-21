import { Box, Flex, Heading, Text } from '@chakra-ui/core'
import { RootState } from '@src/app/RootReducer'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Lottie from 'react-lottie'
import { useDispatch, useSelector } from 'react-redux'

import { setIsDisconnectedModalOpen } from '../../LiveStreamManagerSlice'
import animationData from './PianoLoadingAnimation.json'
import { StatusModal } from './StatusModal'

export const ReconnectingScreen = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isDisconnectedModalOpen } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const title = 'manageLiveStream.disconnected.title'
  const subTitle = 'manageLiveStream.disconnected.subtitle'

  return (
    <>
      <Flex
        direction={'column'}
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <LottieLoader width={36} height={36} />
        <Heading
          marginTop={6}
          fontWeight={700}
          fontSize={['14px', '16px']}
          lineHeight={'20.75px'}
          color={'#FFF'}
          letterSpacing={0}
          w="100%"
          textAlign={'center'}
        >
          {t(`${title}`)}
        </Heading>
        <Text
          marginTop={2}
          fontSize={['12px', '14px']}
          fontWeight={400}
          lineHeight={'18.16px'}
          letterSpacing={0}
          w="100%"
          textAlign={'center'}
        >
          {t(`${subTitle}`)}
        </Text>
      </Flex>
      <StatusModal
        isOpen={isDisconnectedModalOpen}
        onClose={() => {
          dispatch(setIsDisconnectedModalOpen(false))
        }}
        icon={
          <Box
            className="custom-lottie-container"
            width={['36px', '72px']}
            height={['36px', '72px']}
          >
            <LottieLoader width={'100%'} height={'100%'} />
          </Box>
        }
        title={title}
        subTitle={subTitle}
      />
    </>
  )
}

const LottieLoader = ({
  width,
  height,
}: {
  width: number | string
  height: number | string
}) => {
  return (
    <Lottie
      options={{
        loop: true,
        autoplay: true,
        animationData: animationData,
      }}
      height={height}
      width={width}
    />
  )
}
