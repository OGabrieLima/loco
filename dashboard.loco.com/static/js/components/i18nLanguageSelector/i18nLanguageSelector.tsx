import { setlanguageSelctionOriginModal } from '@app/appSlice'
import { RootState } from '@app/RootReducer'
import { Box, Button } from '@chakra-ui/core'
import { eventActions, eventConstants, eventPropsTypes } from '@utils/Amplitude'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import LanguageDisplay from './LanguageDisplay'

const I18nLanguageSelector = ({
  origin,
  isSpecialCase,
}: {
  isSpecialCase?: boolean
  origin: 'login_modal' | 'profile_section'
}) => {
  const isProfileSection = origin === 'profile_section'
  const { languageSelctionOriginModal } = useSelector(
    (state: RootState) => state.app
  )
  const isLanguageSelectionModalOpen = !!languageSelctionOriginModal
  const triggerRef = useRef<HTMLButtonElement>(null) // Reference to the button element that triggers the popover
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const setIsVisible = (value: boolean) => {
    dispatch(setlanguageSelctionOriginModal(value ? origin : null))
  }
  const { me } = useSelector((state: RootState) => state.login)
  const { previousVisit: previousVisitStore } = useSelector(
    (state: RootState) => state.app
  )

  const onCloseLanguagePicker = () => {
    setIsVisible(false)
  }

  const languageSelectorEventHandler = () => {
    const eventProperties: eventPropsTypes.language_selector_clicked = {
      source_name: previousVisitStore,
      platform: eventConstants.platform,
      username: me?.username,
      userid: me?.user_uid,
      user_type: me?.user_type,
      language_client: i18n.resolvedLanguage || 'en',
      source: origin === 'profile_section' ? 'settings' : 'onboarding',
    }
    eventActions.sendAmplitudeData(eventConstants.language_selector_clicked, {
      ...eventProperties,
    })
  }

  const toggleVisibility = () => {
    if (!isLanguageSelectionModalOpen) {
      // fire event on open only
      languageSelectorEventHandler()
    }
    setIsVisible(!isLanguageSelectionModalOpen)
  }

  useEffect(() => {
    if (!isLanguageSelectionModalOpen) return
    const handleClickOutside = (event: any) => {
      const newPopOverElem1 = document.getElementById('pop-over-lang-429')
      if (
        newPopOverElem1 &&
        !newPopOverElem1?.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onCloseLanguagePicker()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLanguageSelectionModalOpen])

  return (
    <Box
      position="relative"
      display="flex"
      zIndex={1}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Button
        ref={triggerRef}
        id={'lang_selc_id_428'}
        onClick={toggleVisibility}
        className="popover-trigger"
        h="auto"
        p={isProfileSection ? '0px' : '8px'}
        backgroundColor={isProfileSection ? 'transparent' : '#282828'}
        color="white"
        display={isSpecialCase ? 'none' : 'block'}
        border="none"
        cursor="pointer"
        borderRadius="8px"
        m={0}
        aria-haspopup="true"
        aria-expanded={isLanguageSelectionModalOpen}
        aria-controls="popover-content"
        _hover={{
          backgroundColor: isProfileSection ? 'transparent' : '#282828',
          outline: 'none',
        }}
        _active={{
          outline: 'none',
        }}
        _focus={{
          outline: 'none',
        }}
      >
        <LanguageDisplay
          origin={origin}
          isVisible={isLanguageSelectionModalOpen}
        />
      </Button>
    </Box>
  )
}

export default I18nLanguageSelector
