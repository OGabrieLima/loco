import i18n from '@src/i18n/i18n'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import {
  editStreamOrVODParams,
  getStreamByUID,
} from '../../../../api/apiRequest'
import { setPreviousVisit } from '../../../../app/appSlice'
import { RootState } from '../../../../app/RootReducer'
import NewEditStreamModal from '../../../../components/NewEditStreamModal'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../../../../utils/Amplitude'
import { updateCurrentLiveStreamDetails } from '../../LiveStreamManagerSlice'

const EditCurrentStreamModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => any
}): JSX.Element => {
  const [streamDetails, setStreamDetails] = useState<any>(null)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { games, me } = useSelector((state: RootState) => state.login)

  const { previousVisit: previousVisitStore } = useSelector(
    (state: RootState) => state.app
  )
  const showEmptyBox = _.isEmpty(currentLiveStreamDetails)
  useEffect(() => {
    handleEventVisitEditStreamInfoProps()
  }, [])

  const handleSendLanguageChangeEvents = (params: editStreamOrVODParams) => {
    const isChangePrimaryLanguage =
      params?.primary_language !== currentLiveStreamDetails?.primary_language
    const isChangeSecondaryLanguage =
      JSON.stringify(params?.secondary_language) !==
      JSON.stringify(currentLiveStreamDetails?.secondary_language)

    const baseProperties = {
      is_stream_live: true,
      user_platform: 'web_locogg',
      source: 'live_stream_manager',
      language_client: i18n.language,
      streamer_name: me?.username,
      streamer_id: me?.user_uid,
      category_name: games.find((game) => game.uid === params.game_uid)?.name,
      category_id: params.game_uid,
      video_id: currentLiveStreamDetails?.uid,
    }

    const eventPropertiesForPrimaryLang = {
      ...baseProperties,
      previous_language: currentLiveStreamDetails?.primary_language,
      language_selected: params?.primary_language,
    }

    const eventPropertiesForSecondaryLang = {
      ...baseProperties,
      previous_language: currentLiveStreamDetails?.secondary_language,
      language_selected:
        params.secondary_language &&
        JSON.parse((params.secondary_language as unknown) as string),
      count_languages:
        params.secondary_language &&
        JSON.parse((params.secondary_language as unknown) as string)?.length,
    }

    if (isChangePrimaryLanguage) {
      eventActions.sendAmplitudeData(
        'primary_language_selected',
        eventPropertiesForPrimaryLang
      )
    }
    if (isChangeSecondaryLanguage) {
      eventActions.sendAmplitudeData(
        'secondary_languages_selected',
        eventPropertiesForSecondaryLang
      )
    }
  }

  const handleEventVisitEditStreamInfoProps = () => {
    const eventProperties: eventPropsTypes.visit_edit_stream_info_props = {
      source_name: previousVisitStore,
      platform: eventConstants.platform,
      title: currentLiveStreamDetails?.title || '',
      desc: currentLiveStreamDetails?.description || '',
      game: currentLiveStreamDetails?.game_uid || '',
      tags: currentLiveStreamDetails?.tags || [],
    }
    const previousVisit = eventConstants.visit_edit_stream_info.split(
      'visit_'
    )[1]
    dispatch(setPreviousVisit(previousVisit))
    eventActions.sendAmplitudeData(
      eventConstants.visit_edit_stream_info,
      eventProperties
    )
  }
  const handleEventStreamerEditStreamInfoProps = (
    params: editStreamOrVODParams
  ) => {
    const gameName = _.find(games, { uid: params.game_uid })

    const trigger =
      gameName.has_mature_content && params.has_mature_content
        ? {
            trigger: 'gambling_category',
          }
        : params.has_mature_content
        ? {
            trigger: 'user_initiated',
          }
        : {}
    //@ts-ignore
    const eventProperties: eventPropsTypes.streamer_edit_stream_info_props = {
      platform: eventConstants.platform,
      title: params?.title || '',
      desc: params?.description || '',
      game: params?.game_uid || '',
      tags: params?.tags || [],
      stream_key: currentLiveStreamDetails?.uid,
      is_content_mature: params?.has_mature_content ? 'Yes' : 'No',
      ...trigger,
    }
    eventActions.sendAmplitudeData(
      eventConstants.streamer_edit_stream_info,
      eventProperties
    )
  }
  const handleSubmit = (params: editStreamOrVODParams) => {
    const updatedParams: editStreamOrVODParams = {
      title: params.title,
      description: params.description,
      game_uid: params.game_uid,
      tags: params.tags,
      file: params.file,
      stream_key: currentLiveStreamDetails?.uid,
      primary_language: params.primary_language,
      secondary_language: params.secondary_language,
      has_mature_content: params.has_mature_content,
    }
    if (!updatedParams.file) {
      delete updatedParams.file
    }
    dispatch(updateCurrentLiveStreamDetails(updatedParams))
    handleEventStreamerEditStreamInfoProps(updatedParams)
    handleSendLanguageChangeEvents(updatedParams)
    onClose()
  }

  const defaultStreamDetails = React.useMemo(
    () => ({
      has_mature_content: currentLiveStreamDetails?.has_mature_content || false,
      title: currentLiveStreamDetails?.title || '',
      description: currentLiveStreamDetails?.description || '',
      game: currentLiveStreamDetails?.game_uid || '',
      tags:
        currentLiveStreamDetails?.tags?.map((tag) => tag.toLowerCase()) || [],
      thumbnail: currentLiveStreamDetails?.thumbnail_url_small || '',
      can_battleup: false,
      can_download: false,

      primary_language: streamDetails?.primary_language
        ? streamDetails.primary_language
        : undefined,
      secondary_language: streamDetails?.secondary_language ?? [],
    }),
    [currentLiveStreamDetails, streamDetails]
  )

  useEffect(() => {
    async function fetchStream() {
      if (currentLiveStreamDetails?.uid) {
        const result = await getStreamByUID(currentLiveStreamDetails.uid)

        if (result) {
          setStreamDetails(result)
        } else {
          if (result?.statusCode === 404) {
            // do nothing
          }
          if (result?.statusCode === 408) {
            // do nothing
          }
          if (result.statusCode === 403) {
            // do nothing
          }
        }
      }
    }
    fetchStream()
  }, [currentLiveStreamDetails?.uid])
  return (
    <NewEditStreamModal
      isOpen={isOpen}
      title={t('home.todayStream.editModalTitle')}
      scrollBehaviour={showEmptyBox ? 'outside' : 'inside'}
      isCentered={true}
      onClose={onClose}
      onSubmit={handleSubmit}
      modalSize={showEmptyBox ? 'md' : 'lg'}
      modalHeaderStyle={
        showEmptyBox ? { px: 0, pb: 0, display: 'none' } : undefined
      }
      modalBodyStyle={
        showEmptyBox ? { bg: 'brand.primary-light-black-v4' } : undefined
      }
      //@ts-ignore
      defaultStreamDetails={defaultStreamDetails}
      formProps={{ agreement: false }}
    />
  )
}

export default EditCurrentStreamModal
