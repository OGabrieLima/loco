import { Flex } from '@chakra-ui/core'
import { find } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { RootState } from '../../../../app/RootReducer'
import StreamInfoField from './StreamInfoField'

const StreamInfoFields = () => {
  const {
    liveStreamManager: { currentLiveStreamDetails },
    streamDetails: { defaultStreamDetails },
    login: { games, languages },
  } = useSelector((state: RootState) => state)
  const { t } = useTranslation()
  const streamInfoStreamTitleLabel = t(
    'manageLiveStream.streamInfo.streamTitle'
  )
  const streamInfoStreamDescriptionLabel = t(
    'manageLiveStream.streamInfo.streamDescription'
  )

  const streamInfoGameLabel = t('home.todayStream.categories')
  const streamInfoTagsLabel = t('manageLiveStream.streamInfo.tags')
  const streamInfoPrimaryLanguageLabel = t(
    'manageLiveStream.streamInfo.primaryLanguage'
  )
  const streamInfoSecondaryLanguageLabel = t(
    'manageLiveStream.streamInfo.secondaryLanguage'
  )
  const defaultGameName = find(games, { uid: defaultStreamDetails?.game })

  const getSelectedLanguages = (
    key: 'primary_language' | 'secondary_language'
  ) => {
    const currentStreamLanguages =
      currentLiveStreamDetails?.[key] || defaultStreamDetails?.[key]

    if (!currentStreamLanguages) return []

    return languages.filter((lang) => {
      return key === 'primary_language'
        ? lang.locale === currentStreamLanguages
        : currentStreamLanguages?.indexOf(lang.locale) !== -1
    })
  }

  const fields = [
    {
      label: streamInfoStreamTitleLabel,
      value:
        currentLiveStreamDetails?.title ||
        defaultStreamDetails?.title ||
        'Game Stream Title',
    },
    {
      label: streamInfoStreamDescriptionLabel,
      value:
        currentLiveStreamDetails?.description ||
        defaultStreamDetails?.description ||
        'Game Stream Description',
    },
    {
      label: streamInfoGameLabel,
      value:
        currentLiveStreamDetails?.game_name ||
        defaultGameName?.name ||
        'Game Name',
    },
    {
      label: streamInfoTagsLabel,
      value: currentLiveStreamDetails?.tags ||
        defaultStreamDetails?.tags || ['Tag1', 'Tag2'],
    },
    {
      label: streamInfoPrimaryLanguageLabel,
      value: getSelectedLanguages('primary_language').map((lang) => lang.label),
    },
  ]

  getSelectedLanguages('secondary_language').length > 0 &&
    fields.push({
      label: streamInfoSecondaryLanguageLabel,
      value: getSelectedLanguages('secondary_language').map(
        (lang) => lang.label
      ),
    })

  return (
    <>
      <Flex direction="column" justify="space-between">
        {fields.map((field) => (
          <StreamInfoField key={field.label} field={field} />
        ))}
      </Flex>
    </>
  )
}

export default StreamInfoFields
