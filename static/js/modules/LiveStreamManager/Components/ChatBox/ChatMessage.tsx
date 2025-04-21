import {
  Box,
  Button,
  Flex,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/core'
import styled from '@emotion/styled'
import theme from '@src/theme'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../../../app/RootReducer'
import { LottiAnimation } from '../../../../components/LottieAnimation'
import { chatMessage, spamUser, StickerI } from '../../types'
import ChatOptions, { Options } from './ChatOptions'

const DEFAULT_CHAT_COLOR = {
  base_chat: '#FFFFFF',
  base_user: '#999999',

  mod_chat: '#FFFFFF',
  mod_user: '#FFC70F',

  streamer_chat: '#55CAF0', // self & streamer is same on dashboard. but different on locogg
  streamer_user: '#ED8031',
}

const ChatMessage = ({
  chatId,
  message,
  handleBlockModal,
}: {
  chatId: string
  message: chatMessage
  handleBlockModal: (value: spamUser) => void
  submitUserDetailsForGiveWay: (value: string, username: string) => void
  usersRecievedGiveaway: string[]
}) => {
  const { me: streamerDetails } = useSelector((state: RootState) => state.login)
  const [timeoutUser, setTimeoutUser] = useState(false)
  const [deleteMsg, setDeleteMsg] = useState(false)
  const [openModeratorModal, setOpenModeratorModal] = useState(false)
  const isStreamer = streamerDetails?.user_uid === message?.profile?.uid
  const currencyIcon =
    message?.sticker?.currency_type === 10
      ? 'gold'
      : message?.sticker?.currency_type === 20
      ? 'diamond_small'
      : null
  const onClickTimeout = () => {
    setTimeoutUser(true)
  }

  const onClickDeleteMsg = () => {
    setDeleteMsg(true)
  }

  const isModerator = message?.moderator_type !== 0 ? true : false
  const isStickerMessage = message?.type === 5 || message?.type === 4
  const isDiamondSticker =
    isStickerMessage && message?.sticker?.currency_type === 20
  const isModeBotMsg = [10, 11, 12].includes(message.type)
  const hideOptions = [10, 11, 12, 20, 21].includes(message.type)
  const { showModeratorLogs } = useSelector(
    (state: RootState) => state.liveStreamManager
  )

  const isBadgesAvailable =
    (message?.reward_metadata?.badge_thumbnails?.length || 0) > 0
  const hideModeratorLogMessage =
    !showModeratorLogs && [10, 11, 12].includes(message.type)

  // Function to generate gradient background or solid color
  function getBackgroundStyle(
    fillType: string,
    startColor: string,
    endColor: string,
    solidColor: string
  ) {
    if (fillType === 'gradient') {
      return `linear-gradient(to top, ${startColor} 0%, ${endColor} 100%)`
    } else {
      return solidColor
    }
  }

  // Function to generate styles for the sticker content
  function getWrapperStyles(sticker: StickerI) {
    if (!sticker?.bg_attributes) {
      return {
        backgroundColor: '#262626',
        padding: '0 0.5rem',
        border: '1px solid ' + theme.colors.brand['loco-primary'],
        boxShadow: '0px 0px 8px 0px #FF0068',
      }
    }
    const { bg_attributes } = sticker
    const fillType = bg_attributes?.content_box.fill_type || 'solid'
    const startColor = bg_attributes?.content_box.gradient?.start_color
    const endColor = bg_attributes?.content_box.gradient?.end_color
    const solidColor = bg_attributes?.content_box.color || 'transparent'

    return {
      background: getBackgroundStyle(
        fillType,
        startColor,
        endColor,
        solidColor
      ),
    }
  }

  // Function to generate styles for the border and shadow
  function getBorderShadowStyles(sticker: StickerI) {
    if (!sticker?.bg_attributes) {
      return {}
    }
    const { bg_attributes } = sticker
    const fillType = bg_attributes?.border.fill_type || 'solid'
    const startColor = bg_attributes?.border.gradient?.start_color
    const endColor = bg_attributes?.border.gradient?.end_color
    const solidColor = bg_attributes?.border.color || 'transparent'

    return {
      background: getBackgroundStyle(
        fillType,
        startColor,
        endColor,
        solidColor
      ),
      border: '1px solid transparent',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
      borderRadius: '7px',
    }
  }

  const WrappeStyle =
    isDiamondSticker && message.sticker
      ? {
          ...getWrapperStyles(message.sticker),
          background: '#181818',
          border: '2px',
          borderColor: 'brand.loco-primary',
          borderRadius: '24px',
          padding: '8px 16px 8px 16px',
          boxShadow: '0px 0px 8px 0px #FF0068',
          height: '70px',
          maxWidth: '332px',
        }
      : {}
  const BorderShadowContainer =
    isDiamondSticker && message.sticker
      ? getBorderShadowStyles(message?.sticker)
      : {}

  if (![1, 3, 4, 5, 6, 10, 11, 12, 20, 21].includes(message.type)) {
    return null
  }
  return (
    <>
      {hideModeratorLogMessage ? (
        false
      ) : isStickerMessage ? (
        <Box
          style={BorderShadowContainer}
          my={isDiamondSticker ? '6px' : '4px'}
        >
          <Flex
            gridGap={'8px'}
            justify={isDiamondSticker ? 'space-between' : 'start'}
            alignItems="center"
            px={isDiamondSticker ? '8px' : '0px'}
            minH={isDiamondSticker ? '80px' : '50px'} // will pick appropriate height
            borderRadius="8px"
            style={WrappeStyle}
          >
            <Flex alignItems="center">
              <ProfileImage
                src={message?.profile?.avatar}
                alt="avatar"
                $bgColor={message?.profile?.color}
                width={isModeBotMsg ? '24' : '20'}
                height={isModeBotMsg ? '24' : '20'}
                style={{
                  width: isModeBotMsg ? '24px' : '20px',
                  height: isModeBotMsg ? '24px' : '20px',
                  aspectRatio: '1/1',
                  borderRadius: '5px',
                }}
              />
              <Flex flexDirection="column" ml={2}>
                <Flex mb="4px" alignItems={'center'}>
                  <Text
                    fontSize="14px"
                    fontWeight={
                      message?.profile?.text_weight ||
                      (isStreamer ? '600' : isModerator ? '700' : '700')
                    }
                    color={
                      message?.profile?.text_color ||
                      (isStreamer
                        ? DEFAULT_CHAT_COLOR.streamer_user
                        : isModerator
                        ? DEFAULT_CHAT_COLOR.mod_user
                        : DEFAULT_CHAT_COLOR.base_user)
                    }
                    isTruncated
                    maxW="200px"
                  >
                    {message?.profile?.username}
                  </Text>
                  {isBadgesAvailable
                    ? message?.reward_metadata?.badge_thumbnails?.map(
                        (src, index) => {
                          return (
                            <ModeratorImage
                              key={index}
                              src={src}
                              alt="badge avatar"
                              width={isModeBotMsg ? '24' : '20'}
                              height={isModeBotMsg ? '24' : '20'}
                              style={{
                                width: isModeBotMsg ? '24px' : '20px',
                                height: isModeBotMsg ? '24px' : '20px',
                                aspectRatio: '1/1',
                                borderRadius: '5px',
                              }}
                            />
                          )
                        }
                      )
                    : null}
                  <Text
                    fontSize="14px"
                    fontWeight={
                      message?.profile?.text_weight ||
                      (isStreamer ? '600' : isModerator ? '700' : '700')
                    }
                    color={
                      message?.profile?.text_color ||
                      (isStreamer
                        ? DEFAULT_CHAT_COLOR.streamer_user
                        : isModerator
                        ? DEFAULT_CHAT_COLOR.mod_user
                        : DEFAULT_CHAT_COLOR.base_user)
                    }
                    isTruncated
                    maxW="200px"
                  >
                    &nbsp;:
                    {/* << this is color */}
                  </Text>
                </Flex>
                {isDiamondSticker && (
                  <Flex alignItems="center">
                    <Icon
                      height="16px"
                      width="16px"
                      //@ts-ignore
                      name={currencyIcon}
                    />
                    <Box fontSize="14px" ml="2px">
                      {message.sticker?.amount}
                    </Box>
                  </Flex>
                )}
              </Flex>
            </Flex>
            {message.message ? (
              <Flex>
                <LottiAnimation
                  message={message.message}
                  height={60}
                  width={60}
                />
              </Flex>
            ) : message.sticker?.image_url ? (
              <Flex>
                <LottiAnimation
                  height={60}
                  width={60}
                  message={message.sticker?.image_url}
                />
              </Flex>
            ) : null}
          </Flex>
        </Box>
      ) : (
        <Flex
          my="6px"
          rounded="md"
          bg="transparent"
          flexDir="column"
          w={'100%'}
          minW={'220px'}
          alignSelf="flex-start"
          py={1}
          color="white"
          position="relative"
          minH="fit-content"
          style={
            message.type === 21
              ? {
                  background:
                    message?.bg_color_style?.fill_type === 'gradient'
                      ? `linear-gradient(90deg, ${message.bg_color_style.gradient.start_color} 33.45%, ${message.bg_color_style.gradient.end_color} 97.66%)`
                      : message?.bg_color_style?.color,
                  padding: '4px 8px',
                  borderRadius: '0px',
                }
              : undefined
          }
        >
          <Flex justify="space-between">
            <Flex align="center">
              <Box mr={2}>
                <ProfileImage
                  src={message?.profile?.avatar}
                  alt="avatar"
                  $bgColor={message?.profile?.color}
                  width={isModeBotMsg ? '24' : '20'}
                  height={isModeBotMsg ? '24' : '20'}
                  style={{
                    width: isModeBotMsg ? '24px' : '20px',
                    height: isModeBotMsg ? '24px' : '20px',
                    aspectRatio: '1/1',
                    borderRadius: '5px',
                  }}
                />
              </Box>
              <Box mr={2}>
                {message.type !== 21 && (
                  <Box
                    display="inline-block"
                    fontSize="14px"
                    fontWeight={
                      message?.profile?.text_weight ||
                      (isStreamer ? '600' : isModerator ? '700' : '700')
                    }
                    color={
                      message?.profile?.text_color ||
                      (isStreamer
                        ? DEFAULT_CHAT_COLOR.streamer_user
                        : isModerator
                        ? DEFAULT_CHAT_COLOR.mod_user
                        : DEFAULT_CHAT_COLOR.base_user)
                    }
                    mr={2}
                  >
                    {message?.profile?.username}
                    {isBadgesAvailable
                      ? message?.reward_metadata?.badge_thumbnails?.map(
                          (src, index) => {
                            return (
                              <ModeratorImage
                                key={index}
                                src={src}
                                alt="badge avatar"
                                width={isModeBotMsg ? '24' : '20'}
                                height={isModeBotMsg ? '24' : '20'}
                                style={{
                                  width: isModeBotMsg ? '24px' : '20px',
                                  height: isModeBotMsg ? '24px' : '20px',
                                  aspectRatio: '1/1',
                                  borderRadius: '5px',
                                }}
                              />
                            )
                          }
                        )
                      : null}
                    &nbsp;:
                    {/* << this is color */}
                  </Box>
                )}
                <Box
                  display="inline"
                  wordBreak="break-all"
                  px={1}
                  fontStyle={hideOptions ? 'italic' : 'normal'}
                  fontSize="14px"
                  fontWeight={message?.chat_text_weight || '900'}
                  color={
                    message?.chat_text_color ||
                    (isStreamer
                      ? DEFAULT_CHAT_COLOR.streamer_chat
                      : isModerator
                      ? DEFAULT_CHAT_COLOR.mod_chat
                      : DEFAULT_CHAT_COLOR.base_chat)
                  }
                >
                  {message.type === 21 ? (
                    <span
                      dangerouslySetInnerHTML={{ __html: message.message! }}
                    ></span>
                  ) : (
                    message.message
                  )}
                </Box>
              </Box>
            </Flex>
            {isStreamer ? (
              false
            ) : !hideOptions ? (
              <Flex position="relative" alignItems="center">
                <Popover usePortal gutter={0}>
                  <PopoverTrigger>
                    <Button
                      backgroundColor="transparent"
                      width="24px"
                      height="24px"
                      maxWidth="24px"
                      minWidth="24px"
                      padding="0px"
                      border="none"
                      _hover={{
                        background: 'transparent',
                      }}
                      _focus={{
                        outline: 'none',
                      }}
                      opacity={0.5}
                      data-options="more options"
                    >
                      <CustomImage
                        src="/static/images/chat/options.svg"
                        alt="more options"
                        width="16px"
                        height="16px"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    width="184px"
                    background="transparent"
                    border="none"
                    color="#fff"
                    outline="none"
                    _focus={{
                      border: 'none',
                    }}
                    left={['-22px !important', '-30px !important']}
                    marginTop="0px !important"
                    zIndex={1000}
                  >
                    <Options
                      setOpenModeratorModal={setOpenModeratorModal}
                      onClickTimeout={onClickTimeout}
                      onClickDeleteMsg={onClickDeleteMsg}
                      isModerator={isModerator}
                      handleBlockUser={() => {
                        handleBlockModal({
                          uid: message.profile.uid,
                          username: message.profile.username,
                        })
                      }}
                      handleClose={() => setOpenModeratorModal(false)}
                    />
                  </PopoverContent>
                </Popover>
              </Flex>
            ) : (
              false
            )}
          </Flex>
        </Flex>
      )}
      {openModeratorModal || timeoutUser || deleteMsg ? (
        <ChatOptions
          username={message.profile.username}
          isModerator={isModerator}
          userUID={message?.profile?.uid}
          handleClose={() => setOpenModeratorModal(false)}
          timeoutUser={Number(timeoutUser)}
          setTimeoutUser={setTimeoutUser}
          deleteMsg={deleteMsg}
          setDeleteMsg={setDeleteMsg}
          chatId={chatId}
          openModeratorModal={openModeratorModal}
          setOpenModeratorModal={setOpenModeratorModal}
        />
      ) : null}
    </>
  )
}

export default ChatMessage

const CustomImage = styled.img`
  max-width: 16px;
  max-height: 16px;
`

const ProfileImage = styled.img<{ $bgColor?: string }>`
  height: 20px;
  width: 20px;
  border-radius: 100%;
  min-height: 20px;
  min-width: 20px;
  background-color: ${({ $bgColor }) => $bgColor};
`

const ModeratorImage = styled.img`
  margin-left: 8px;
  min-height: 16px;
  min-width: 16px;
  max-height: 16px;
  max-width: 16px;
  display: inline-block;
`
