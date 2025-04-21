import { getDeepShortUrl } from '@api/apiRequest'
import { RootState } from '@app/RootReducer'
import { Box, Icon, IconButton, Text, useClipboard } from '@chakra-ui/core'
import styled from '@emotion/styled'
import { useCustomToast } from '@src/components/customToast'
import { eventActions, eventConstants, eventPropsTypes } from '@utils/Amplitude'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'

// const url = 'https://loco.onelink.me/65Kg/WebShare'

export enum UrlType {
  TYPE_PROFILE = 10,
  TYPE_VIDEO = 20,
  TYPE_ARENA_ROOM = 30,
  TYPE_REFERRAL = 40,
  TYPE_TRIVIA_WINNERS = 50,
  TYPE_GENERIC = 60, // This is to be used when prefix is not needed
  TYPE_GENERIC_2 = 70, // Added for backward compatibility as frontend used these already
}
const SocialSharing = () => {
  const [shareUrl, setShareUrl] = useState('')
  const toast = useCustomToast()
  const { t } = useTranslation()

  const {
    liveStreamManager: { currentLiveStreamDetails, isLive },
    login: { me },
  } = useSelector((state: RootState) => state)
  const streamUID = currentLiveStreamDetails?.uid
  const user_uid = currentLiveStreamDetails?.user_uid || me?.user_uid
  const username = me?.username

  const title = t('manageLiveStream.streamPreview.share_username_suffix', {
    username,
  })

  const { onCopy, hasCopied } = useClipboard(`${title} ${shareUrl}`)

  useEffect(() => {
    ;(async () => {
      const newQuery = {
        stream_uid: streamUID,
        sr_sc: 'sr_da',
        sr_id: user_uid,
        sr_pl: 'pl_wb',
        streamer_uid: user_uid,
      }
      const deepUrl = await getDeepShortUrl(newQuery)
      if (deepUrl && typeof deepUrl === 'string') {
        setShareUrl(deepUrl)
      }
    })()
  }, [isLive])

  useEffect(() => {
    if (hasCopied) {
      toast({
        position: 'top',
        note: t('manageLiveStream.streamPreview.copy'),
        duration: 2000,
        isClosable: false,
      })
    }
  }, [hasCopied])

  const handleEventStreamerShareStream = (medium: string) => {
    const eventProperties: eventPropsTypes.streamer_share_stream_props = {
      video_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_type: me?.user_type,
      is_live: isLive,
      medium,
    }
    eventActions.sendAmplitudeData(
      eventConstants.streamer_share_stream,
      eventProperties
    )
  }
  return (
    <Box pl={[0, 0, 0, 4]} mt={[0, 0, 2, 0]} mb={4} px={['16px', '12px']}>
      <Text
        fontWeight={400}
        fontSize="10px"
        lineHeight="130%"
        color={'brand.loco-grey-20'}
        mb={['12px']}
      >
        {t('manageLiveStream.streamPreview.share')}
      </Text>
      <Wrapper display={'flex'} gridGap="16px" width={'100%'} margin="0 auto">
        <WhatsappShareButton
          url={shareUrl}
          title={title}
          onClick={() => handleEventStreamerShareStream('whatsapp')}
          style={{
            outline: 'none',
            width: '24px',
            height: '24px',
          }}
        >
          <Icon name="whatsapp" size="24px" />
        </WhatsappShareButton>

        <FacebookShareButton
          url={shareUrl}
          quote={title}
          onClick={() => handleEventStreamerShareStream('facebook')}
          style={{
            width: '24px',
            height: '24px',
            outline: 'none',
          }}
        >
          <Icon name="facebook" size="24px" />
        </FacebookShareButton>

        <TelegramShareButton
          url={shareUrl}
          title={title}
          onClick={() => handleEventStreamerShareStream('telegram')}
          style={{
            outline: 'none',
            width: '24px',
            height: '24px',
          }}
        >
          <Icon name="telegram" size={'24px'} />
        </TelegramShareButton>
        <TwitterShareButton
          url={shareUrl}
          title={title}
          onClick={() => handleEventStreamerShareStream('twitter')}
          style={{
            outline: 'none',
            width: '24px',
            height: '24px',
          }}
        >
          <Icon name="twitter" size={'24px'} />
        </TwitterShareButton>

        <IconButton
          minWidth="24px"
          width="24px"
          // @ts-ignore
          icon={hasCopied ? 'check_new' : 'copy_new'}
          variant="ghost"
          fontSize={'24px'}
          // @ts-ignore
          size="24px"
          p={0}
          aria-label="copy link"
          h="24px"
          color={'white'}
          onClick={() => {
            onCopy!()
            handleEventStreamerShareStream('copy')
          }}
          _hover={{
            background: 'transparent',
            outline: 'none',
          }}
          _focus={{
            background: 'transparent',
            outline: 'none',
          }}
          _active={{
            background: 'transparent',
            color: 'brand.primary-white-v2',
            outline: 'none',
          }}
        />
      </Wrapper>
    </Box>
  )
}

export default SocialSharing

const Wrapper = styled(Box)`
  place-items: center;
`
