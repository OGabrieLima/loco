import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/core'
import I18nLanguageSelector from '@components/i18nLanguageSelector'
import { useRtlTranslation } from '@src/i18n/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { RootState } from '../../../app/RootReducer'
import { isLanguageSelectionEnabled } from '../../../constent'
import HeaderCenter from './HeaderCenter'
import StreamHealth from './StreamHealth'

const HeaderRight = ({
  showHeaderCenter,
  disableHomeAndCenter,
}: {
  showHeaderCenter: boolean
  disableHomeAndCenter: boolean
}) => {
  const { t } = useTranslation()
  const { me } = useSelector((state: RootState) => state.login)
  const { isLive } = useSelector((state: RootState) => state.liveStreamManager)

  const isRTL = useRtlTranslation()

  const customStyle = isRTL
    ? {
        left: 6,
      }
    : {
        right: 6,
      }

  return (
    <Flex
      justifyContent={
        showHeaderCenter ? ['flex-end', 'space-between'] : 'flex-end'
      }
      overflow="hidden"
      align="center"
      w={showHeaderCenter ? ['50%', '82%'] : 'full'}
      boxSizing="border-box"
    >
      {showHeaderCenter && !disableHomeAndCenter ? <HeaderCenter /> : <Flex />}
      <Stack
        isInline
        align="center"
        display={['none', 'flex', 'flex']}
        position={showHeaderCenter ? ['relative', 'relative'] : 'relative'}
        {...customStyle}
      >
        {isLive && showHeaderCenter ? (
          <Text
            p="6px"
            height="18px"
            fontSize="12px"
            fontWeight="bold"
            borderRadius="6px"
            background="#FF5A12"
            textTransform="uppercase"
            width="max-content"
            display="flex"
            alignItems="center"
          >
            {t('common.live_tag_text')}
          </Text>
        ) : null}
        {isLanguageSelectionEnabled() ? (
          <Box
            display={showHeaderCenter ? 'block' : ['none', 'none', 'block']}
            marginLeft={showHeaderCenter ? 'auto' : '50px'}
          >
            <I18nLanguageSelector origin="profile_section" />
          </Box>
        ) : null}
        {!showHeaderCenter ? <StreamHealth /> : null}
        {me?.avatar_url ? (
          <Avatar
            src={me.avatar_url}
            height="32px"
            width="32px"
            borderRadius={'8px'}
            //@ts-ignore
            css={{
              img: {
                borderRadius: '8px', // Rounds the inner img to match the container
              },
            }}
          ></Avatar>
        ) : null}

        {me?.username ? (
          <Flex alignItems="center">
            <Text
              color="white"
              // mx={2}
              fontSize="sm"
              fontWeight="bold"
              whiteSpace={'nowrap'}
            >
              {t('header.hi')}, {me.username}
            </Text>
          </Flex>
        ) : null}
      </Stack>
    </Flex>
  )
}

export default HeaderRight
