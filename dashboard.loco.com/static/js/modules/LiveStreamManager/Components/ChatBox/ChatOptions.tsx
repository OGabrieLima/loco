import { blockUser, deleteUserMessage } from '@api/apiRequest'
import { RootState } from '@app/RootReducer'
import { Box, Flex, Grid, Icon, Spinner, Text } from '@chakra-ui/core'
import { useCustomToast } from '@components/customToast'
import NewModal from '@components/NewModal'
import styled from '@emotion/styled'
import Modal from '@modules/Community/Modal'
import {
  addModerator,
  removeModerator,
} from '@modules/Community/Moderator/moderatorSlice'
import { useRtlTranslation } from '@src/i18n/utils'
import theme from '@src/theme'
import { sendAmplitudeData } from '@utils/Amplitude/amplitude'
import isMobile from 'is-mobile'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Switch from 'react-switch'

const TIMEOUT_OPTIONS = [5, 10, 15, 30, 60, 120]

type IProps = Omit<IChatOptions, 'handleBlockUser'> & {
  timeoutUser: number
  setOpenModeratorModal: (val: boolean) => void
  setTimeoutUser: (val: boolean) => void
  openModeratorModal: boolean
  deleteMsg: boolean
  setDeleteMsg: (val: boolean) => void
  chatId: string
}

function ChatOptions(props: IProps) {
  const {
    liveStreamManager: { currentLiveStreamDetails },
    login: { me },
  } = useSelector((state: RootState) => state)
  const {
    username,
    userUID,
    isModerator,
    handleClose,
    setOpenModeratorModal,
    setTimeoutUser,
    openModeratorModal,
    timeoutUser,
    setDeleteMsg,
    deleteMsg,
    chatId,
  } = props
  const [loading, setLoading] = useState(false)
  const [selectedTimeout, setSelectedTimeout] = useState<number | null>()
  const [deleteChatWithTimeout, setDeleteChatWithTimeout] = useState(false)
  const toast = useCustomToast()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isRTL = useRtlTranslation()

  const addToModeratorList = async () => {
    const response = await dispatch(addModerator({ username }))
    // @ts-ignore
    const errorMessage = response?.error?.message
    const successMessage = isRTL
      ? `تمت إضافة ${username} كمشرف`
      : `${username} is added as your moderator`
    const message = errorMessage || successMessage
    if (!errorMessage) {
      sendAmplitudeData('Streamer_add_moderator', {
        streamer_id: me?.user_uid,
        streamer_username: me?.username,
        mod_username: username,
        video_id: currentLiveStreamDetails?.uid,
        streamer_type: me?.user_type,
        category_name: currentLiveStreamDetails?.game_name,
        Source: 'chat',
      })
    }
    toast({
      note: message,
      position: isMobile() ? 'bottom' : 'top',
      duration: 2000,
      isClosable: false,
      // render: () => (
      //   <Notification
      //     message={message}
      //     status={errorMessage ? 'error' : 'success'}
      //   />
      // ),
    })
  }
  const removeFromModeratorList = async () => {
    const response = await dispatch(removeModerator({ user_uid: userUID }))
    // @ts-ignore
    const errorMessage = response?.error?.message
    const successMessage = isRTL
      ? `تمت إزالة ${username} من دور المشرف`
      : `${username} is removed as your moderator`
    const message = errorMessage || successMessage
    if (!errorMessage) {
      sendAmplitudeData('Streamer_remove_moderator', {
        streamer_id: me?.user_uid,
        streamer_username: me?.username,
        mod_username: username,
        mod_id: userUID,
        video_id: currentLiveStreamDetails?.uid,
        streamer_type: me?.user_type,
        category_name: currentLiveStreamDetails?.game_name,
        Source: 'chat',
      })
    }
    toast({
      note: message,
      position: isMobile() ? 'bottom' : 'top',
      duration: 1000,
      isClosable: false,
      // render: () => <Notification message={message} />,
    })
  }

  const onClose = () => {
    setLoading(false)
    setOpenModeratorModal(false)
    setTimeoutUser(false)
    setDeleteMsg(false)
    setSelectedTimeout(null)
    handleClose()
  }
  const onClickMute = async () => {
    if (!selectedTimeout) return
    setLoading(true)
    const result = await blockUser({
      user_uid: userUID,
      stream_id: currentLiveStreamDetails?.uid,
      timeout: selectedTimeout,
      block_chats: deleteChatWithTimeout ? 10 : undefined,
    })
    onClose()
    sendAmplitudeData('timeout_user', {
      streamer_id: currentLiveStreamDetails?.streamer?.user_uid,
      streamer_username: currentLiveStreamDetails?.streamer?.username,
      username,
      video_id: currentLiveStreamDetails?.uid,
      streamer_type: me?.user_type,
      mute_user_id: userUID,
      mute_username: username,
      timeout_duration: selectedTimeout,
      category_name: currentLiveStreamDetails?.game_name ?? '',
      source: 'Live_stream_manager',
      delete_message_toggle: deleteChatWithTimeout ? 'on' : 'off',
    })
    toast({
      note: !result.statusCode
        ? `${t('manageLiveStream.chat.user_timed_out_message', {
            username: username,
            timeout: selectedTimeout,
          })} ${t('manageLiveStream.chat.user_timed_out_message_extra')}`
        : result.message,
      position: isMobile() ? 'bottom' : 'top',
      duration: 2000,
      isClosable: false,
    })
  }
  const onClickDelete = async () => {
    if (!currentLiveStreamDetails?.uid) return
    setLoading(true)
    const result = await deleteUserMessage({
      stream_uid: currentLiveStreamDetails?.uid,
      chat_id: chatId,
    })
    onClose()
    sendAmplitudeData('delete_chat', {
      streamer_id: currentLiveStreamDetails?.streamer?.user_uid,
      streamer_username: currentLiveStreamDetails?.streamer?.username,
      username,
      video_id: currentLiveStreamDetails?.uid,
      streamer_type: me?.user_type,
      deleted_chat_username: userUID,
      deleted_chat_user_id: username,
      category_name: currentLiveStreamDetails?.game_name ?? '',
      source: 'Live_stream_manager',
    })
    toast({
      note: !result.statusCode
        ? t('manageLiveStream.chat.delete.toast')
        : result.message,
      position: isMobile() ? 'bottom' : 'top',
      duration: 2000,
      isClosable: false,
      // render: () => (
      //   <Notification
      //     message={
      //       !result.statusCode
      //         ? t('manageLiveStream.chat.delete.toast')
      //         : result.message
      //     }
      //     status={!result.statusCode ? 'success' : 'error'}
      //   />
      // ),
    })
  }
  if (timeoutUser) {
    return (
      <NewModal
        isOpen={true}
        onClose={onClose}
        isCentered={true}
        closeOnOverlayClick={false}
        modalContentStyle={{
          bg: '#282828',
          minWidth: ['100%', '564px'],
          width: ['100%', '564px'],
          padding: ['24px', '24px'],
          marginTop: '0',
        }}
        modalHeaderStyle={{
          padding: 0,
        }}
        modalHeaderComponent={
          <Text
            w="full"
            textAlign={'center'}
            fontSize={['16px', '20px']}
            lineHeight={'130%'}
            fontWeight="700"
            as="h4"
            marginBottom={['4px', '8px']}
          >
            {t('manageLiveStream.chat.timeout.removeModalTitle')} {username}
          </Text>
        }
        modalBodyStyle={{
          padding: 0,
        }}
        modalBodyComponent={
          <>
            <Flex
              w="full"
              justifyContent="center"
              alignItems={'center'}
              direction={'column'}
              gridGap="12px"
            >
              <Text
                fontSize={['14px', '16px']}
                lineHeight="130%"
                color="#B2B2B2"
                textAlign={'center'}
                marginBottom={['4px', '8px']}
              >
                {t('manageLiveStream.chat.timeout.subtitle1')}
              </Text>
              <Text
                w="full"
                fontSize={['14px', '16px']}
                lineHeight="130%"
                color="#B2B2B2"
                textAlign={'center'}
              >
                {t('manageLiveStream.chat.timeout.subtitle2')}
                <Box as="br" display={['none', 'block']} />{' '}
                {t('manageLiveStream.chat.timeout.subtitle3')}
                <br /> {t('manageLiveStream.chat.timeout.subtitle4')}
              </Text>
              <Grid
                marginTop="16px"
                gap="16px"
                gridTemplateColumns="repeat(3,1fr)"
                maxWidth="280px"
              >
                {TIMEOUT_OPTIONS.map((time) => (
                  <TimeOutButton
                    key={time}
                    onClick={() => setSelectedTimeout(time)}
                    aria-selected={selectedTimeout === time}
                  >
                    {time} {t('manageLiveStream.chat.timeout.mins')}
                  </TimeOutButton>
                ))}
              </Grid>
              <Flex
                justifyContent={['space-between', 'space-between']}
                alignItems={['center']}
                w="full"
                marginTop="20px"
              >
                <Text marginRight={['0px', '36px']} mb="4px">
                  {t('manageLiveStream.chat.timeout.subtitle5')}
                </Text>

                <Switch
                  checked={deleteChatWithTimeout}
                  onChange={() => {
                    if (deleteChatWithTimeout) {
                      setDeleteChatWithTimeout(false)
                    } else {
                      setDeleteChatWithTimeout(true)
                    }
                  }}
                  onColor="#FFD0BC"
                  onHandleColor={theme.colors.brand['loco-primary']}
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 3px 0px #00000033"
                  activeBoxShadow="0px 1px 1px 0px #00000024"
                  height={15}
                  width={34}
                />
              </Flex>
              <Flex
                justifyContent="center"
                alignItems={'center'}
                direction={'column'}
                w="full"
              >
                <MuteButton
                  onClick={onClickMute}
                  disabled={!selectedTimeout || loading}
                >
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    t('manageLiveStream.chat.timeout.removeModalTitle')
                  )}
                </MuteButton>
              </Flex>
            </Flex>
          </>
        }
      />
    )
  }
  if (deleteMsg) {
    return (
      <NewModal
        isOpen={true}
        onClose={onClose}
        isCentered={true}
        closeOnOverlayClick={false}
        modalContentStyle={{
          bg: '#282828',
          minWidth: ['100%', '564px'],
          width: ['100%', '564px'],
          padding: ['24px', '24px'],
          marginTop: '0',
        }}
        modalHeaderStyle={{
          padding: 0,
        }}
        modalHeaderComponent={
          <Text
            w="full"
            textAlign={'center'}
            fontSize={['16px', '20px']}
            lineHeight={'130%'}
            fontWeight="700"
            as="h4"
            marginBottom={['4px', '8px']}
          >
            {t('manageLiveStream.chat.delete.title')}
          </Text>
        }
        modalBodyStyle={{
          padding: 0,
        }}
        modalBodyComponent={
          <>
            <Flex
              w="full"
              justifyContent="center"
              alignItems={'center'}
              direction={'column'}
              gridGap="12px"
            >
              <Text
                fontSize={['14px', '16px']}
                lineHeight="130%"
                color="#B2B2B2"
                textAlign={'center'}
                marginBottom={['4px', '8px']}
              >
                {t('manageLiveStream.chat.delete.subtitle1')}
              </Text>
              <Text
                fontSize={['14px', '16px']}
                lineHeight="130%"
                color="#B2B2B2"
                textAlign={'center'}
              >
                {t('manageLiveStream.chat.delete.subtitle2')}
                <br />
                {t('manageLiveStream.chat.delete.subtitle3')}
              </Text>
              <Flex
                justifyContent="center"
                alignItems={'center'}
                direction={'column'}
                gridGap="8px"
                pt={['12px', '16px']}
                w="full"
              >
                <DeleteButton onClick={onClickDelete}>
                  {t('manageLiveStream.chat.delete.delete')}
                </DeleteButton>
                <CancelButton onClick={onClose}>
                  {t('manageLiveStream.chat.delete.cancel')}
                </CancelButton>
              </Flex>
            </Flex>
          </>
        }
      />
    )
  }
  return openModeratorModal ? (
    <Modal
      isOpen={true}
      onClose={onClose}
      onSuccess={() => {
        isModerator ? removeFromModeratorList() : addToModeratorList()
        handleClose()
      }}
      subTitle1={
        isModerator ? (
          <>
            {t('manageLiveStream.chat.moderator.removeModalTitle1')}{' '}
            <strong>
              {t('manageLiveStream.chat.moderator.remove')} {username}{' '}
            </strong>
            {t('manageLiveStream.chat.moderator.as')}{' '}
            {t('manageLiveStream.chat.moderator.removeModalTitle2')}
          </>
        ) : (
          <>
            {t('manageLiveStream.chat.moderator.removeModalTitle1')}{' '}
            {t('manageLiveStream.chat.moderator.addremoveModalTitle1')}{' '}
            {t('manageLiveStream.chat.moderator.addremoveModalTitle2')}{' '}
            <strong>{username}</strong>{' '}
            {t('manageLiveStream.chat.moderator.as')}{' '}
            {t('manageLiveStream.chat.moderator.removeModalTitle2')}
          </>
        )
      }
    />
  ) : null
}

export function Options(
  props: Omit<IChatOptions, 'username' | 'userUID'> & {
    onClickTimeout: () => void
    onClickDeleteMsg: () => void
  }
) {
  const {
    handleBlockUser,
    setOpenModeratorModal,
    isModerator,
    onClickTimeout,
    onClickDeleteMsg,
  } = props
  const { t } = useTranslation()

  // const ref = React.useRef(null);
  // useOnClickOutside(ref, () => {
  //   handleClose();
  // });
  return (
    <>
      <Wrapper>
        <Button onClick={() => setOpenModeratorModal(true)}>
          <ImgIcon
            src={
              isModerator
                ? '/static/images/chat/remove_mod_icon.svg'
                : '/static/images/chat/mod_icon.svg'
            }
            width="16px"
            height="16px"
          />
          {isModerator
            ? t('manageLiveStream.chat.moderator.removeTitle')
            : t('manageLiveStream.chat.moderator.addTitle')}
        </Button>
        {!isModerator && (
          <>
            <Divider />
            <Button onClick={handleBlockUser}>
              <Icon name="not-allowed" size="16px" marginRight="8px" />{' '}
              {t('manageLiveStream.chat.mute.title')}
            </Button>
            <Divider />
            <Button onClick={onClickTimeout}>
              <ImgIcon
                src="/static/images/timer.svg"
                width="16px"
                height="16px"
              />
              {t('manageLiveStream.chat.timeout.title')}
            </Button>
            <Divider />
            <Button onClick={onClickDeleteMsg}>
              <ImgIcon
                src="/static/images/delete.svg"
                width="16px"
                height="16px"
              />
              {t('manageLiveStream.chat.delete.title')}
            </Button>
          </>
        )}
      </Wrapper>
    </>
  )
}

export default ChatOptions

interface IChatOptions {
  handleClose: () => void
  username: string
  userUID: string
  isModerator: boolean
  handleBlockUser: () => void
  setOpenModeratorModal: React.Dispatch<React.SetStateAction<boolean>>
}

const Wrapper = styled.div`
  border-radius: 8px;
  width: 184px;
  padding: 12px 16px;
  background-color: #1f1f1f;
  display: grid;
  row-gap: 8px;
  background: #282828;
  box-shadow: 0px 0px 24px rgba(88, 60, 167, 0.2);
`

const Button = styled.button`
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  display: flex;
  align-items: center;
`

const CancelButton = styled.button`
  font-size: 14px;
  line-height: 16px;
  min-height: 40px;
  display: flex;
  color: ${theme.colors.brand['loco-primary']};
  align-items: center;
  justify-content: center;
  font-weight: 700;
  width: 100%;
  border-radius: 10px;
`
const DeleteButton = styled.button`
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
  display: flex;
  min-height: 40px;
  width: 100%;
  background: ${theme.colors.brand['loco-primary']};
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 10px;
`

const ImgIcon = styled.img`
  margin-right: 8px;
  filter: grayscale(1);
`

const TimeOutButton = styled.button`
  background: #1b1b1b;
  border-radius: 12px;
  min-width: 90px;
  white-space: nowrap;

  min-height: 40px;
  font-weight: 700;
  padding: 0 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  line-height: 22px;
  color: #b2b2b2;
  transition: background 300ms cubic-bezier(0, 0, 0.09, 1.21);
  &[aria-selected='true'] {
    background: ${theme.colors.brand['loco-primary']};
    color: black;
  }
`

const MuteButton = styled.button`
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
  display: flex;
  min-height: 40px;
  width: 100%;
  background: ${theme.colors.brand['loco-primary']};
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 10px;
  &:hover {
    background: ${theme.colors.brand['loco-primary']};
  }
  &:disabled {
    background: #1b1b1b;
    color: rgba(255, 255, 255, 0.5);
  }
`

const Divider = styled.div`
  height: 0;
  // border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin: 2px 0;
`
