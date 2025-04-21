import { updateUserLanguage } from '@api/apiRequest'
import { setLangToBeChanged } from '@app/appSlice'
import { RootState } from '@app/RootReducer'
import { Box, Button, Flex, Icon, Text } from '@chakra-ui/core'
import { updateMe } from '@modules/Login/loginSlice'
import { LANGUAGE_PRESET, SUPPORTED_LANGUAGE } from '@src/i18n/constants'
import { parseSelectedLanguage } from '@src/i18n/utils'
import { eventActions, eventConstants, eventPropsTypes } from '@utils/Amplitude'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const ConfirmLanguageModal = () => {
  const dispatch = useDispatch()
  const { i18n, t } = useTranslation()

  const { me } = useSelector((state: RootState) => state.login)
  const { previousVisit: previousVisitStore, langToBeChanged } = useSelector(
    (state: RootState) => state.app
  )
  const onClose = () => {
    dispatch(setLangToBeChanged(null))
  }
  const languageChangeEventHandler = (lang: LANGUAGE_PRESET) => {
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

  const changeLanguageLoginUser = (lang: LANGUAGE_PRESET) => {
    lang = parseSelectedLanguage(lang)
    i18n.changeLanguage(lang)
    languageChangeEventHandler(lang)
    updateUserLanguage({ language: lang }).then(() => {
      dispatch(updateMe({ language: lang }))
    })
    onClose()
  }

  if (!langToBeChanged) return <></>
  const languageTitle =
    SUPPORTED_LANGUAGE[langToBeChanged as LANGUAGE_PRESET]?.nativeName ||
    `${t('change_language.language_text')} - ${langToBeChanged}`

  return (
    <>
      <Box
        position="fixed"
        onClick={onClose}
        className="h-screen"
        width="100vw"
        bg="rgba(0,0,0,0.75)"
        zIndex={1000}
        top="0px"
        bottom="0px"
        left="0px"
        right="0px"
      />
      <Box
        id="popover-content"
        className="popover-content"
        role="dialog"
        aria-modal="true"
        position={['fixed', 'fixed']}
        top={['auto', '50%']}
        bottom={['0px', 'auto']}
        left={['0px', '50%']}
        width={['100%', '400px']}
        transform={['none', 'translate(-50%,-50%)']}
        marginTop={['0px', '10px']}
        backgroundColor={'brand.loco-grey-70'}
        boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)"
        borderRadius={['16px 16px 0px 0px', '16px']}
        color="#FFFFFF"
        fontSize={['14px', '14px']}
        fontWeight="400"
        zIndex={1001}
        lineHeight={'130%'}
        whiteSpace={['initial', 'initial']}
      >
        <Box
          display="flex"
          p="24px"
          flexDirection="column"
          gridGap={2}
          minWidth={['auto', '250px']}
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            cursor="pointer"
          >
            <Text></Text>
            <Text
              display={['block']}
              position={['absolute', 'absolute']}
              top={['12px']}
              right={['12px']}
            >
              <Icon
                name={'crossGray'}
                cursor="pointer"
                color="white"
                onClick={onClose}
                size="24px"
              />
            </Text>
          </Flex>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Text fontSize={'16px'} fontWeight={600} textAlign={'center'}>
              {t('change_language.change_language_to', {
                language_full_name: languageTitle,
              })}
            </Text>
            <Text
              fontSize={'14px'}
              mt={['8px', '16px']}
              textAlign={'center'}
              color="brand.loco-grey-20"
            >
              {t('change_language.change_language_description')}
            </Text>

            <Flex mt="24px" gridGap={'16px'}>
              <Button
                borderRadius="10px"
                width="150px"
                height="48px"
                fontWeight="bold"
                fontSize="14px"
                lineHeight={'130%'}
                backgroundColor={'transparent'}
                _focus={{
                  backgroundColor: 'transparent',
                }}
                _active={{
                  backgroundColor: 'transparent',
                }}
                _hover={{
                  backgroundColor: 'transparent',
                }}
                border="2px solid"
                borderColor={'brand.loco-primary'}
                color="brand.loco-primary"
                textTransform={'capitalize'}
                onClick={() => {
                  onClose()
                }}
              >
                {t('change_language.cancel')}
              </Button>
              <Button
                borderRadius="10px"
                width="150px"
                height="48px"
                fontWeight="bold"
                fontSize="14px"
                lineHeight={'130%'}
                backgroundColor={'brand.loco-primary'}
                _focus={{
                  backgroundColor: 'brand.loco-primary',
                }}
                _active={{
                  backgroundColor: 'brand.loco-primary',
                }}
                _hover={{
                  backgroundColor: 'brand.loco-primary',
                }}
                color="white"
                textTransform={'capitalize'}
                onClick={() => changeLanguageLoginUser(langToBeChanged)}
              >
                {t('change_language.confirm')}
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ConfirmLanguageModal
