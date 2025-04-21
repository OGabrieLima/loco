import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/core'
import { UseGoogleLogin } from '@components/GoogleLogin/GoogleLogin'
import I18nLanguageSelector from '@components/i18nLanguageSelector'
import { isLanguageSelectionEnabled } from '@src/constent'
import { paths } from '@src/routers/constants'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { setError } from '../../app/appSlice'
import { RootState } from '../../app/RootReducer'
import NewModal from '../../components/NewModal'
import { openLoginLinkingModal } from '../OtplessV3'
import { NotPremiumStreamerOnLocoModal } from './NotPremiumStreamerOnLocoModal'

interface GoogleAndMobileOptionLoginScreenProps {
  responseGoogle: (response: any) => void
}
export const GoogleAndMobileOptionLoginScreen = ({
  responseGoogle,
}: GoogleAndMobileOptionLoginScreenProps): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { isOpen, onClose, onOpen } = useDisclosure()
  const { error } = useSelector((state: RootState) => state.app)
  const isLoginWithPhoneEnabled = useSelector(
    (state: RootState) => state.experiment.is_login_with_phone_enabled
  )

  useEffect(() => {
    if (error) {
      onOpen()
    }
  }, [error])

  const handleClose = () => {
    dispatch(setError(null))
    onClose()
  }

  return (
    <Flex
      flex={1}
      bg="brand.loco-black"
      color={'white'}
      minH={['auto', '10vh']}
      height={['auto', '600px']}
      width={['100%', '360px']}
      direction="column"
      justifyContent="flex-end"
      px={[0]}
      position={['sticky', 'static']}
      bottom={['0px']}
      zIndex={[2, 'auto']}
    >
      {window.innerWidth < 640 ? null : isLanguageSelectionEnabled() ? (
        <Flex
          color="white"
          display={['none', 'flex']}
          alignItems="center"
          justifyContent="flex-end"
          mr="16px"
          position="relative"
        >
          {/* THere must be only 1 instance of this */}
          <I18nLanguageSelector origin="login_modal" />
        </Flex>
      ) : null}

      <Flex
        flex={1}
        px={['36px', '38px']}
        h="full"
        w="full"
        direction="column"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Flex
          flex={[0, 1]}
          w="100%"
          direction="column"
          justifyContent="flex-end"
          my="40px"
          maxW="300px"
        >
          <UseGoogleLogin
            render={(renderProps) => {
              return (
                <Button
                  w="full"
                  py={['8px', '12px']}
                  px={['16px', '24px']}
                  rounded="10px"
                  bg="white"
                  color="black"
                  fontWeight="bold"
                  fontSize={['14px', '16px']}
                  lineHeight={['14px', '130%']}
                  minH={['48px', '48px']}
                  outline="none"
                  _focus={{
                    outline: 'none',
                  }}
                  _hover={{
                    outline: 'none',
                  }}
                  _active={{
                    outline: 'none',
                  }}
                  onClick={renderProps.onClick}
                >
                  <Icon
                    name="googleColoredIcon"
                    size="24px"
                    style={{
                      marginInlineEnd: '0.5rem',
                    }}
                  />
                  {t('login.login_with_google')}
                </Button>
              )
            }}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
          />

          {isLoginWithPhoneEnabled && (
            <>
              <Flex my={4} align="center">
                <Box flex="1" height="1px" bg="gray.300" />
                <Text
                  mx={3}
                  fontWeight="black"
                  fontSize="14px"
                  textAlign="center"
                >
                  {t('login.or')}
                </Text>
                <Box flex="1" height="1px" bg="gray.300" />
              </Flex>
              <Button
                mt={['0', '0']}
                w="full"
                py={['0']}
                px={['0']}
                rounded="10px"
                bg="transparent"
                color="white"
                fontWeight="bold"
                fontSize={['14px', '16px']}
                maxH="max-content"
                outline="none"
                _focus={{
                  outline: 'none',
                }}
                _hover={{
                  outline: 'none',
                  background: 'brand.loco-primary',
                }}
                _active={{
                  outline: 'none',
                  background: 'brand.loco-primary',
                }}
                onClick={() => {
                  dispatch(openLoginLinkingModal({ modal_type: 'PHONE_LOGIN' }))
                }}
              >
                {t('login.login_with_phone_number')}
              </Button>
            </>
          )}
        </Flex>
        <Text
          pb={['21px', '36px']}
          textAlign="center"
          fontSize={['12px', '12px']}
          lineHeight="130%"
        >
          {t('login.terms_and_condition_prefix')}{' '}
          <a
            href={paths.terms}
            target="_blank"
            style={{
              display: 'inline',
              cursor: 'pointer',
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
            }}
            rel="noreferrer"
          >
            {t('login.terms_and_condition')}
          </a>
        </Text>
      </Flex>

      <NewModal
        isOpen={isOpen}
        onClose={handleClose}
        modalSize="md"
        isCentered={true}
        closeOnOverlayClick={true}
        scrollBehaviour="outside"
        modalOverlayStyle={{
          zIndex: 1400,
        }}
        modalContentStyle={{
          bg: 'brand.primary-light-black-v4',
        }}
        modalHeaderStyle={{
          px: 0,
          pb: 0,
        }}
        modalBodyStyle={{
          p: 4,
        }}
        modalBodyComponent={
          <NotPremiumStreamerOnLocoModal onClose={handleClose} />
        }
      />
    </Flex>
  )
}
