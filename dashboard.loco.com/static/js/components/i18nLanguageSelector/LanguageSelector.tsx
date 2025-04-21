import { Box, Flex, Icon, Text } from '@chakra-ui/core'
import {
  setLangToBeChanged,
  setlanguageSelctionOriginModal,
} from '@src/app/appSlice'
import { RootState } from '@src/app/RootReducer'
import { LANGUAGE_PRESET, SUPPORTED_LANGUAGE } from '@src/i18n/constants'
import { parseSelectedLanguage } from '@src/i18n/utils'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '@src/utils/Amplitude'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { SelectedTitle } from './SelectedTitle'

const LanguageSelector = () => {
  const elemRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const { i18n, t } = useTranslation()
  const resolvedLanguage = i18n.resolvedLanguage

  const {
    languageSelctionOriginModal,
    previousVisit: previousVisitStore,
  } = useSelector((state: RootState) => state.app)
  const isLanguageSelectionModalOpen = !!languageSelctionOriginModal
  const origin = languageSelctionOriginModal || ''
  const { me } = useSelector((state: RootState) => state.login)
  const isUserPresent = !!me?.user_uid
  const openConfirmModal = (lang: string) => {
    dispatch(setLangToBeChanged(lang))
  }

  const languageChangeEventHandler = (lang: string) => {
    const eventProperties: eventPropsTypes.language_change_client = {
      source_name: previousVisitStore,
      platform: eventConstants.platform,
      username: me?.username,
      userid: me?.user_uid,
      user_type: me?.user_type,
      language_client: lang,
      source: origin === 'profile_section' ? 'settings' : 'onboarding',
      trigger: 'user_choice',
    }
    eventActions.sendAmplitudeData(eventConstants.language_change_client, {
      ...eventProperties,
    })
  }

  const changeLanguageNonLoginUser = (lang: LANGUAGE_PRESET) => {
    i18n.changeLanguage(lang)
    languageChangeEventHandler(lang)
    dispatch(setlanguageSelctionOriginModal(null))
  }

  const onLanguageChange = (lang: LANGUAGE_PRESET) => {
    lang = parseSelectedLanguage(lang)
    if (isUserPresent) {
      dispatch(setlanguageSelctionOriginModal(null))
      // Opens Confirmation Modal
      openConfirmModal(lang)
    } else {
      changeLanguageNonLoginUser(lang)
    }
  }

  const onClose = () => {
    dispatch(setlanguageSelctionOriginModal(null))
  }
  const onChangelanguage = (lang: LANGUAGE_PRESET) => {
    onLanguageChange(lang)
  }
  useEffect(() => {
    const parentElem: HTMLDivElement = (document.getElementById(
      'lang_selc_id_428'
    ) as unknown) as HTMLDivElement
    const thisElem = elemRef.current
    if (!parentElem || !thisElem || !isLanguageSelectionModalOpen) {
      return
    }
    const onResize = () => {
      const inMobile = window.innerWidth < 640
      if (inMobile) {
        thisElem.style.top = `auto`
        thisElem.style.left = `0px`
        thisElem.style.visibility = 'visible'
      } else {
        const thisElemWidth = thisElem.offsetWidth / 2
        const rect = parentElem.getBoundingClientRect()
        const parentWidth = parentElem.offsetWidth / 2
        const parentHeight =
          parentElem.offsetHeight + (origin === 'login_modal' ? 5 : -5) // 10px margin
        const x = rect.left + window.scrollX + parentWidth - thisElemWidth
        const y = rect.top + window.scrollY + parentHeight
        // Ensure thisElem is within the viewport
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const elemRightEdge = x + thisElem.offsetWidth
        const elemBottomEdge = y + thisElem.offsetHeight
        if (elemRightEdge > viewportWidth) {
          thisElem.style.left = `${viewportWidth - thisElem.offsetWidth}px`
        } else {
          thisElem.style.left = `${x}px`
        }
        if (elemBottomEdge > viewportHeight) {
          thisElem.style.top = `${viewportHeight - thisElem.offsetHeight}px`
        } else {
          thisElem.style.top = `${y}px`
        }
        thisElem.style.visibility = 'visible'
      }
    }

    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [isLanguageSelectionModalOpen])
  if (!isLanguageSelectionModalOpen) {
    return <></>
  }
  return (
    <>
      <Box
        onClick={onClose}
        display={['block', 'none']}
        visibility={['visible', 'hidden']}
        opacity={[1, 0]}
        position="fixed"
        height="100dvh"
        width="100vw"
        zIndex={1000}
        bg="rgba(0,0,0,0.75)"
        top="0px"
        bottom="0px"
        left="0px"
        right="0px"
      />
      <Box
        ref={elemRef}
        id="pop-over-lang-429"
        className="popover-content"
        role="dialog"
        aria-modal="true"
        visibility={'hidden'}
        position={['fixed', 'absolute']}
        top={['auto', '0']}
        bottom={['0px', 'auto']}
        left={['0px', '0']}
        width={['100%', 'auto']}
        transform={['none', 'none']}
        marginTop={['0px', '10px']}
        backgroundColor={'brand.loco-grey-70'}
        boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)"
        borderRadius={['16px 16px 0px 0px', '16px']}
        p={['16px 24px 24px 24px', '20px']}
        color="#FFFFFF"
        fontSize={['14px', '14px']}
        fontWeight="400"
        zIndex={2001}
        lineHeight={'130%'}
        whiteSpace={['nowrap', 'nowrap']}
      >
        <Box
          display="flex"
          flexDirection="column"
          gridGap={2}
          minWidth={['auto', '250px']}
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            py={[0.75, 0.75]}
            mb={['1rem', '0.25rem']}
          >
            <Text fontSize={['16px', '16px']} fontWeight="700">
              {t('change_language.select_language')}
            </Text>
            <Text display={['block', 'none']}>
              <Icon
                name="crossGray"
                cursor="pointer"
                color="white"
                onClick={onClose}
                size="24px"
              />
            </Text>
          </Flex>
          {Object.keys(SUPPORTED_LANGUAGE).map((lang, index) => (
            <>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                py={[0.75, 0.75]}
                cursor="pointer"
                onClick={() => onChangelanguage(lang as LANGUAGE_PRESET)}
              >
                <Text>
                  {SUPPORTED_LANGUAGE[lang as LANGUAGE_PRESET].nativeName}
                </Text>
                {resolvedLanguage === lang ? (
                  <Box>
                    <SelectedTitle />
                  </Box>
                ) : null}
              </Flex>
              {index !== Object.keys(SUPPORTED_LANGUAGE).length - 1 && (
                <Box py={[0.75, 0.75]} h="1px" borderTop="1px solid #5B5A5A" />
              )}
            </>
          ))}
        </Box>
      </Box>
    </>
  )
}

export default LanguageSelector
