import { Button, Flex, Stack, useClipboard } from '@chakra-ui/core'
import Block from '@src/components/Container/Block'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { RootState } from '../../../../app/RootReducer'
import { Input } from '../../../../components/input/Input'

const StreamConfig = ({ onOpen }: { onOpen: () => any }): JSX.Element => {
  const {
    streamDetails: { streamConfig, streamConfigLoader },
    liveStreamManager: { isLive },
  } = useSelector((state: RootState) => state)

  const { onCopy: onLinkCopy, hasCopied: hasLinkCopied } = useClipboard(
    streamConfig?.ingest_url
  )
  const { onCopy: onKeyCopy, hasCopied: hasKeyCopied } = useClipboard(
    streamConfig?.stream_key
  )
  const { t } = useTranslation()

  const hostUrlText = t('home.streamSetup.hosturl')
  const streamkeyText = t('home.streamSetup.streamkey')

  const copyText = t('home.streamSetup.copy')
  const copiedText = t('home.streamSetup.copied')
  const resetText = t('home.streamSetup.reset')
  const inputFields = useMemo(
    () => [
      {
        name: 'hostUrl',
        value: streamConfig?.ingest_url,
        label: hostUrlText,
        type: 'text',
        onClick: onLinkCopy,
        isCopied: hasLinkCopied,
        tooltipLabel: hostUrlText,
      },
      {
        name: 'streamKey',
        value: streamConfig?.stream_key,
        label: streamkeyText,
        type: 'password',
        onClick: onKeyCopy,
        isCopied: hasKeyCopied,
        tooltipLabel: streamkeyText,
      },
    ],
    [
      streamConfig?.ingest_url,
      streamConfig?.stream_key,
      hasKeyCopied,
      hasLinkCopied,
      hostUrlText,
      streamkeyText,
    ]
  )
  return (
    <Stack direction="column" w="full" p={'12px'} mx="auto">
      {inputFields.map((inputField) => {
        return (
          <>
            <Flex
              justify="space-between"
              align="center"
              fontSize="14px"
              fontWeight="600"
            >
              {inputField.label}
            </Flex>
            {/* <Flex key={inputField.name} alignItems={'center'} mt={2} mb="20px"> */}
            <Block
              display={'grid'}
              gridTemplateColumns={'4fr 1fr'}
              alignItems={'center'}
              padding={0}
              style={{
                margin: '0 0 20px 0',
              }}
            >
              <Input
                mt="8px"
                value={inputField.value}
                placeholder=""
                flex={'4'}
                isReadOnly={true}
                type={inputField.type}
                minH="48px"
                bg="#282828"
                p={'16px 12px'}
                rounded={'10px'}
                _disabled={{
                  opacity: 1,
                }}
                isDisabled={true}
                // rightComponent={inputField?.rightComponent}
              />
              <Button
                variant="ghost"
                h="fit-content"
                ml={2}
                flex={'1'}
                py={1}
                _focus={{
                  background: 'transparent',
                  outline: 'none',
                }}
                _active={{
                  background: 'transparent',
                  outline: 'none',
                }}
                _hover={{
                  background: 'none',
                  outline: 'none',
                }}
                color="brand.loco-primary"
                fontSize="14px"
                fontWeight="700"
                onClick={inputField.onClick}
              >
                {inputField.isCopied ? copiedText : copyText}
              </Button>
              {/* </Flex> */}
            </Block>
          </>
        )
      })}
      <Button
        variant="ghost"
        h="fit-content"
        py={1}
        px={'16px'}
        _focus={{
          background: 'transparent',
          outline: 'none',
        }}
        _active={{
          background: 'transparent',
          outline: 'none',
        }}
        _hover={{
          background: 'none',
          outline: 'none',
        }}
        isDisabled={isLive}
        alignSelf="flex-end"
        isLoading={streamConfigLoader}
        onClick={onOpen}
        color="brand.loco-primary"
        fontSize="14px"
        fontWeight="700"
        textTransform={'uppercase'}
      >
        {resetText}
      </Button>
    </Stack>
  )
}

export default StreamConfig
