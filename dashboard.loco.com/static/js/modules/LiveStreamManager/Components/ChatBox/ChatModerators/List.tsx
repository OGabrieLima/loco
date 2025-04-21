import { RootState } from '@app/RootReducer'
import { Box, Icon, Spinner, Text } from '@chakra-ui/core'
import NewModal from '@components/NewModal'
import styled from '@emotion/styled'
import { removeModerator } from '@modules/Community/Moderator/moderatorSlice'
import Notification from '@modules/Community/Notification'
import { ModeratorType } from '@modules/Community/types'
import { useCustomToast } from '@src/components/customToast'
import { useRtlTranslation } from '@src/i18n/utils'
import theme from '@src/theme'
import { sendAmplitudeData } from '@utils/Amplitude/amplitude'
import isMobile from 'is-mobile'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import AddModerator from './AddModerator'

export default function ModeratorsList(props: IProps) {
  const toast = useCustomToast()
  const { t } = useTranslation()
  const isRTL = useRtlTranslation()

  const liveModerators = useSelector(
    (state: RootState) => state.community.liveModerators
  )
  const me = useSelector((state: RootState) => state.login.me)
  const { currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const { isOpen, onClose, list, fetchingList } = props
  const deleteUserRef = useRef<Pick<
    ModeratorType,
    'moderator_user_id' | 'moderator_user_name'
  > | null>(null)
  const deleteModeratorClick = (user: ModeratorType) => {
    deleteUserRef.current = {
      moderator_user_id: user.moderator_user_id,
      moderator_user_name: user.moderator_user_name,
    }
    onClose()
    setOpenConfirmModal(true)
  }
  const onConfirmDelete = async () => {
    if (deleteUserRef.current) {
      setLoading(true)
      await dispatch(
        removeModerator({ user_uid: deleteUserRef.current.moderator_user_id })
      )
      sendAmplitudeData('Streamer_add_moderator', {
        streamer_id: me?.user_uid,
        streamer_username: me?.username,
        mod_username: deleteUserRef.current.moderator_user_name,
        video_id: currentLiveStreamDetails?.uid,
        streamer_type: me?.user_type,
        category_name: currentLiveStreamDetails?.game_name,
        Source: 'live_mod_list',
      })
      setOpenConfirmModal(false)
      toast({
        position: isMobile() ? 'bottom' : 'top',
        duration: 2000,
        note: `${deleteUserRef.current?.moderator_user_name} ${t(
          'manageLiveStream.chat.moderator.toastModeratorRemove'
        )}`,
        isClosable: false,
        onClose: () => {
          deleteUserRef.current = null
        },
      })
      setLoading(false)
    }
  }
  const checkIsLive = useCallback(
    (modUserId: string) => {
      const isLive = liveModerators.find(
        (liveMod) => liveMod.user_uid === modUserId
      )
      return isLive ? (
        <Box
          // This is green dot only
          width="10px"
          height="10px"
          background="#22B964"
          borderRadius="50%"
          marginLeft="8px"
        />
      ) : null
    },
    [liveModerators]
  )
  const renderMods = () => {
    const moderatorsLive = list.filter((all) =>
      liveModerators.some((live) => live.user_uid === all.moderator_user_id)
    )

    const moderatorsNotLive = list.filter(
      (all) =>
        !liveModerators.some((live) => live.user_uid === all.moderator_user_id)
    )

    const showModerators = [...moderatorsLive, ...moderatorsNotLive]

    return (
      <Box position="relative">
        <Text as="h3" fontSize="16px" fontWeight="700" mb={[0, '12px']}>
          {t('community.moderators.title')} ({list.length})
        </Text>
        {list.length > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns="1fr"
            gridRowGap="16px"
            height={list.length > 6 ? '230px' : ''}
            overflowY={'auto'}
          >
            {showModerators.map((_list) => (
              <Box
                key={_list.moderator_user_id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={_list.avatar_url}
                    width="20px"
                    height="20px"
                    alt={`${_list.moderator_user_name} avatar`}
                  />
                  <Text
                    fontSize="14px"
                    fontWeight="700"
                    color="#F8FF00"
                    marginRight={['2px', '4px']}
                    ml={['4px', '8px']}
                  >
                    {_list.moderator_user_name}
                  </Text>
                  <img
                    src="/static/images/chat/mod_icon.svg"
                    alt="mod icon"
                    width="16px"
                    height="16px"
                  />
                  {checkIsLive(_list.moderator_user_id)}
                </Box>
                <button onClick={() => deleteModeratorClick(_list)}>
                  <img
                    src="/static/images/close.svg"
                    alt="mod icon"
                    width="24px"
                    height="24px"
                  />
                </button>
              </Box>
            ))}
          </Box>
        ) : fetchingList ? null : (
          <>
            <Text
              fontSize="16px"
              lineHeight="22px"
              opacity={0.7}
              color="#fff"
              mb={[0, 2]}
            >
              {t('community.moderators.noModP1')}
            </Text>
            <Text fontSize="16px" lineHeight="22px" opacity={0.7} color="#fff">
              {t('community.moderators.noModP2')}
            </Text>
          </>
        )}
        {fetchingList ? (
          <Box display="flex" justifyContent="center">
            <Spinner size={list.length > 0 ? 'md' : 'lg'} mt={[0, '8px']} />
          </Box>
        ) : null}
        {list.length < 20 ? <AddModerator modCount={list.length} /> : null}
      </Box>
    )
  }
  const renderDeleteModerator = () => (
    <>
      <Text fontSize="16px" lineHeight="130%" textAlign="center" color="#fff">
        {t('manageLiveStream.chat.moderator.removeModalTitle1')}{' '}
        {t('manageLiveStream.chat.moderator.remove')}{' '}
        <strong>{deleteUserRef.current?.moderator_user_name}</strong> <br />
        {t('manageLiveStream.chat.moderator.as')}{' '}
        {t('manageLiveStream.chat.moderator.removeModalTitle2')}
      </Text>
      <Text
        fontSize="16px"
        lineHeight="130%"
        textAlign="center"
        marginTop={[0, 4]}
        color="brand.loco-grey-20"
      >
        {t('manageLiveStream.chat.moderator.removeModalSubTitle1')}
        <br /> {t('manageLiveStream.chat.moderator.removeModalSubTitle2')}
      </Text>
      <Box
        display="flex"
        alignItems={'center'}
        justifyContent={'space-evenly'}
        gridColumnGap="32px"
        marginTop="42px"
      >
        <ConfirmButton className="yes" onClick={onConfirmDelete}>
          {loading ? (
            <Spinner width="20px" height="20px" color="#fff" />
          ) : (
            t('manageLiveStream.chat.moderator.yes')
          )}
        </ConfirmButton>
        <ConfirmButton
          className="no"
          onClick={() => setOpenConfirmModal(false)}
        >
          {t('manageLiveStream.chat.moderator.no')}
        </ConfirmButton>
      </Box>
    </>
  )
  return (
    <NewModal
      isOpen={isOpen || openConfirmModal}
      onClose={onClose}
      isCentered={true}
      modalSize="494px"
      disableClose={true}
      modalHeaderStyle={{
        p: 0,
      }}
      modalBodyStyle={{
        bg: 'brand.primary-light-black-v4',
        px: openConfirmModal ? '30px' : 6,
        py: openConfirmModal ? 10 : 6,
      }}
      modalHeaderComponent={
        openConfirmModal ? null : (
          <Close $isRTL={isRTL} onClick={onClose}>
            <Icon
              //@ts-ignore
              name="crossGray"
              cursor="pointer"
              size="24px"
            />
          </Close>
        )
      }
      modalBodyComponent={
        openConfirmModal ? renderDeleteModerator() : renderMods()
      }
    />
  )
}

interface IProps {
  isOpen: boolean
  onClose: () => void
  list: ModeratorType[]
  fetchingList: boolean
}

type Close = {
  $isRTL?: boolean
}
const Close = styled.button<Close>`
  position: absolute;
  right: ${({ $isRTL }) => ($isRTL ? '' : '12px')};
  left: ${({ $isRTL }) => ($isRTL ? '12px' : '')};
  top: 12px;
`

const ConfirmButton = styled.button`
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  flex: 1;
  line-height: 130%;
  padding: 12px 24px;
  &.yes {
    border: 3px solid ${theme.colors.brand['loco-primary']};
    color: ${theme.colors.brand['loco-primary']};
  }
  &.no {
    color: white;
    background: ${theme.colors.brand['loco-primary']};
  }
`

const Avatar = styled.img`
  border-radius: 5px;
`
