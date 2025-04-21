import { RootState } from '@app/RootReducer'
import { Box, Button, Flex } from '@chakra-ui/core'
import { paths } from '@src/routers/constants'
import { eventActions, eventConstants, eventPropsTypes } from '@utils/Amplitude'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { onAcceptTermsModal } from './loginSlice'

const TermsModalLogin = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { me } = useSelector((state: RootState) => state.login)
  const { previousVisit: previousVisitStore } = useSelector(
    (state: RootState) => state.app
  )
  return (
    <Flex
      flex={1}
      height="100%"
      width="100%"
      direction="column"
      justifyContent="center"
      alignItems="center"
      px={[4, 0]}
    >
      <Flex
        bg={['#282828']}
        maxW={['100%', '75%']}
        justifyContent="center"
        direction="column"
        borderRadius={['12px']}
        overflow="hidden"
        px={['24px']}
        py={['24px']}
        alignItems="center"
      >
        <Box
          mb={2}
          display={['block', 'block']}
          color="white"
          fontWeight="700"
          fontSize={'24px'}
        >
          {t('login.terms_page.title')}
        </Box>

        <Box mb={8} color="#CCCCCC" fontSize={'16px'}>
          {t('login.terms_page.description')}
          <Box as="span" color={'brand.loco-primary'}>
            <a
              href={paths.terms}
              target="_blank"
              style={{ textDecoration: 'underline' }}
              rel="noreferrer"
            >
              {t('login.terms_page.description_link')}
            </a>
          </Box>
          {t('login.terms_page.description2')}
        </Box>
        <Button
          minW="50%"
          fontSize={'14px'}
          fontWeight={'700'}
          p="10px 24px"
          color={'white'}
          _hover={{
            background: 'brand.loco-primary',
            transform: 'scale(1.02)',
          }}
          _active={{
            background: 'brand.loco-primary',
          }}
          _focus={{ background: 'brand.loco-primary', outline: 'none' }}
          rounded={'10px'}
          bg="brand.loco-primary"
          onClick={() => {
            dispatch(onAcceptTermsModal())

            const eventProperties: eventPropsTypes.dashboard_streamer_registration_frontend = {
              platform: eventConstants.platform,
              source_name: previousVisitStore,
              user_id: me?.user_uid as string,
              user_type: me?.user_type as number,
            }
            eventActions.sendAmplitudeData(
              eventConstants.dashboard_streamer_registration_frontend,
              eventProperties
            )
          }}
        >
          {t('login.terms_page.button_text')}
        </Button>
      </Flex>
    </Flex>
  )
}

export default TermsModalLogin
