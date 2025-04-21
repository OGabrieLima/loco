import { RootState } from '@app/RootReducer'
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/core'
import { useRtlTranslation } from '@src/i18n/utils'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const ChatTextInput = ({ sendMessage }: { sendMessage: any }) => {
  const [inputValue, setInputValue] = useState('')
  const { t } = useTranslation()
  const [errorState, setErrorState] = useState(false)
  const isRTL = useRtlTranslation()

  const { currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )

  const sendMessageWrapper = useCallback((message) => {
    message = typeof message === 'string' ? message.trim() : ''
    if (message.length > 0 && message.length < 1024) {
      sendMessage(message)
      setInputValue('')
      setErrorState(false)
    } else {
      setErrorState(true)
    }
  }, [])

  return (
    <Flex
      position={['fixed', 'initial']}
      w={['100%', 'auto']}
      bottom={0}
      px={[4, 4]}
      mx={['0px', '10px']}
      py={['4', '4']}
      bg={['#181818', 'black']}
      marginBottom={[0, 0, 0]}
      roundedBottom={'8px'}
      height={['80px', '80px']}
      border={['none', '1px solid #3A3A3A']}
    >
      <InputGroup
        bg="#282828"
        border="none"
        fontSize="sm"
        w="full"
        alignItems="center"
        alignContent="center"
        rounded="10px"
      >
        <Input
          bg="#282828"
          placeholder={
            currentLiveStreamDetails
              ? t('manageLiveStream.chat.chatInputPlaceholder')
              : t('home.notLiveBanner.title')
          }
          // @ts-ignore
          height={['48px', '48px']}
          isDisabled={currentLiveStreamDetails ? false : true}
          border="none"
          rounded="10px"
          fontWeight={'700'}
          p={!isRTL ? '16px 34px 16px 16px' : '16px 16px 16px 34px'}
          isInvalid={!!errorState}
          errorBorderColor="brand.loco-error"
          // bg="red.400"
          _placeholder={{
            fontWeight: '400',
            color: '#808080',
          }}
          value={inputValue}
          focusBorderColor={'none'}
          onChange={(e: any) => {
            setErrorState(false)
            if (e?.target?.value?.length < 1024) {
              setInputValue(e.target.value)
            }
          }}
          onKeyPress={(e: any) => {
            if (e.which === 13) {
              sendMessageWrapper(inputValue)
            }
          }}
        />
        {isRTL ? (
          <InputLeftElement h="full">
            <IconButton
              //@ts-ignore
              icon="sendIcon"
              bg="transparent"
              h={'18px'}
              w={'18px'}
              _hover={{
                bg: ['transparent', 'brand.primary-light-black-v5'],
              }}
              _focus={{
                outline: 'none',
              }}
              _active={{
                bg: ['transparent', 'brand.primary-light-black-v4'],
              }}
              onClick={() => {
                sendMessageWrapper(inputValue)
              }}
            />
          </InputLeftElement>
        ) : (
          <InputRightElement h="full">
            <IconButton
              //@ts-ignore
              icon="sendIcon"
              bg="transparent"
              h={'18px'}
              w={'18px'}
              _hover={{
                bg: ['transparent', 'transparent'],
              }}
              _focus={{
                outline: 'none',
              }}
              _active={{
                bg: ['transparent', 'transparent'],
              }}
              onClick={() => {
                sendMessageWrapper(inputValue)
              }}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </Flex>
  )
}

export default ChatTextInput
