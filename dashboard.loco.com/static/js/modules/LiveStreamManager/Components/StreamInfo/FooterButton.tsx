import { Button, Stack, useDisclosure } from '@chakra-ui/core'
import { LOCO_WEB_URL } from '@src/constent'
import { useRedirectUtilParams } from '@src/i18n/utils'
import { isEmpty } from 'lodash'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { RootState } from '../../../../app/RootReducer'
import { Alert } from '../../../../components/alert/Alert'
import useSubscription from '../../../../context/MqttConnetor/useSubscription'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../../../../utils/Amplitude'
import {
  setIsStreamEndedFromDashboard,
  updateStreamEnd,
} from '../../LiveStreamManagerSlice'

const FooterButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { modifyUrl } = useRedirectUtilParams()
  const history = useHistory()
  const btnRef = useRef()
  const cancelRef = useRef()
  const { currentLiveStreamDetails, loading } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { lastMessageOnTopic } = useSubscription(
    `stream_stats/${currentLiveStreamDetails?.uid}/live_views`
  )
  const buttons = [
    {
      name: 'watchOnLoco',
      label: t('manageLiveStream.streamInfo.watchOnLocoGG'),
      onClick: () => {
        window.open(
          modifyUrl(
            `${LOCO_WEB_URL}/streamers/${currentLiveStreamDetails?.streamer.username}`
          ),
          '_blank'
        )
      },
    },
    {
      name: 'endStream',
      label: t('manageLiveStream.streamInfo.endTitle'),
      onClick: () => dispatch(setIsStreamEndedFromDashboard(true)),
    },
  ]
  const handleStreamEnd = () => {
    dispatch(updateStreamEnd(history))

    handleEventEndStream()
    onClose()
  }
  const handleEventEndStream = () => {
    const eventProperties: eventPropsTypes.end_stream_props = {
      stream_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      //@ts-ignore
      viewers_at_end: lastMessageOnTopic?.message?.live_views || '0',
    }
    eventActions.sendAmplitudeData(eventConstants.end_stream, eventProperties)
  }
  return !isEmpty(currentLiveStreamDetails) ? (
    <>
      <Stack isInline spacing={'12px'} px={['16px', '12px']}>
        {buttons.map((button) => (
          <Button
            key={button.name}
            // w="50%"
            width={'100%'}
            minH={['32px', '48px']}
            bg={'brand.loco-primary'}
            lineHeight={'130%'}
            fontSize={['12px', '16px']}
            h="fit-content"
            rounded={'10px'}
            py={['8px', '12px']}
            px={['12px', '24px']}
            color={'white'}
            fontWeight="700"
            _focus={{
              background: 'brand.loco-primary',
              outline: 'none',
            }}
            _active={{
              background: 'brand.loco-primary',
              outline: 'none',
            }}
            _hover={{
              background: 'brand.loco-primary',
              outline: 'none',
            }}
            onClick={button.onClick}
            overflowWrap="break-word"
            whiteSpace="normal"
          >
            {button.label}
          </Button>
        ))}
      </Stack>
      <Alert
        title={t('manageLiveStream.streamInfo.endTitle')}
        description={t('manageLiveStream.streamInfo.endSubtitle')}
        isOpen={isOpen}
        handleStreamEnd={handleStreamEnd}
        onClose={onClose}
        cancelBtnText={t('manageLiveStream.streamInfo.cancel')}
        submitBtnText={t('manageLiveStream.streamInfo.endTitle')}
        btnRef={btnRef}
        loading={loading}
        cancelRef={cancelRef}
      />
    </>
  ) : (
    <></>
  )
}

export default FooterButton
