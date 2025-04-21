import {
  Box,
  Flex,
  List,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/core'
import styled from '@emotion/styled'
import InformationIcon from '@images/stream/streamHealth/information.svg'
import { StreamHealthDetailsInterface } from '@modules/LiveStreamManager/LiveStreamManagerSlice'
import theme from '@src/theme'
import i18n from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'

const hexToRgbaMapper: { [id: string]: string } = {
  '#FF2400': '255,36,0', //RED
  '#FFBF00': '255,191,0', //ORANGE
  '#FEDE00': '255,222,0', //YELLOW
  '#7CFC00': '124,252,0', //GREEN
  '#808080': '128,128,128', //Grey
}

const hexToStreamStatusMapper: { [id: string]: string } = {
  '#FF2400': i18n.t('streamhealth.nodata'), //RED
  '#FFBF00': i18n.t('streamhealth.ok'), //ORANGE
  '#FEDE00': i18n.t('streamhealth.poor'), //YELLOW
  '#7CFC00': i18n.t('streamhealth.excellent'), //GREEN
}

const CustomImage = styled.img`
  max-width: 13px;
  max-height: 13px;
`

const InformationPopover = () => {
  const { t } = useTranslation()

  const informationTooltipLabel = t('streamhealth.information')
  return (
    <Popover placement="top-end" trigger="hover">
      <PopoverTrigger>
        <CustomImage src={InformationIcon} alt="information" />
      </PopoverTrigger>
      <PopoverContent
        bg="#3A3A3A"
        color="#B2B2B2"
        w="300px"
        fontSize="13px"
        boxShadow=" 0px 0px 0.664039px rgba(0, 0, 0, 0.211221), 0px 1.32808px 0.664039px rgba(0, 0, 0, 0.12)"
        borderRadius="8px"
        // border="1px solid rgba(96,108,136,.5)"
        p="2px 16px"
        _focus={{
          borderColor: 'none',
          outline: 'none',
        }}
      >
        <PopoverBody>{informationTooltipLabel}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

function StreamHealthContent({
  isRealTime,
  setIsRealTime,
  streamHealthDetails,
  isLive,
}: {
  isRealTime: boolean
  setIsRealTime: (value: boolean) => void
  streamHealthDetails: StreamHealthDetailsInterface | null
  isLive: boolean
}) {
  const { t } = useTranslation()
  return (
    <Flex flexDirection="column" width="300px">
      <Flex
        h="40px"
        color="#000000"
        fontSize="14px"
        lineHeight="20px"
        borderRadius="6px"
        cursor="pointer"
        mt="16px"
        mx="5px"
      >
        <Flex
          align="center"
          justifyContent="center"
          bg="transparent"
          onClick={() => (isRealTime ? setIsRealTime(false) : null)}
          width="50%"
          color={isRealTime ? '#B2B2B2' : 'white'}
          fontWeight={isRealTime ? '400' : '600'}
          position={'relative'}
        >
          <Box
            position={'absolute'}
            w="full"
            h="1px"
            bottom={0}
            left={0}
            background={
              isRealTime
                ? '#3a3a3a'
                : theme.colors.gradient['tab-bottom-border']
            }
          />
          {t('streamhealth.encoder')}
        </Flex>
        <Flex
          align="center"
          justifyContent="center"
          bg={'transparent'}
          onClick={() => (isRealTime ? null : setIsRealTime(true))}
          width="50%"
          color={isRealTime ? 'white' : 'white'}
          fontWeight={isRealTime ? '600' : '400'}
          position="relative"
        >
          <Box
            position={'absolute'}
            w="full"
            h="1px"
            bottom={0}
            left={0}
            background={
              !isRealTime
                ? '#3a3a3a'
                : theme.colors.gradient['tab-bottom-border']
            }
          />
          {t('streamhealth.realtime')}
        </Flex>
      </Flex>
      <Flex
        bg="#323232"
        borderRadius="6px"
        p="12px"
        flexDirection="column"
        my="18px"
        mx="5px"
      >
        <Flex mb="24px" w="100%">
          <Flex w="50%" borderRight="1px dashed #4D4D4D" flexDirection="column">
            <Text mb="6px" fontSize="16px" lineHeight="22px" fontWeight="700">
              {isLive
                ? isRealTime
                  ? streamHealthDetails?.realtime?.bitrate ?? 0
                  : streamHealthDetails?.encoder_settings?.video_bitrate ?? 0
                : 0}{' '}
              Kbps
            </Text>
            <Text fontSize="14px" lineHeight="19px" color="#CCCCCC">
              {t('streamhealth.videobitrate')}
            </Text>
          </Flex>
          <Flex w="50%" flexDirection="column" pl="32px">
            <Text mb="6px" fontSize="16px" lineHeight="22px" fontWeight="700">
              {isLive
                ? isRealTime
                  ? streamHealthDetails?.realtime?.fps ?? 0
                  : streamHealthDetails?.encoder_settings?.framerate ?? 0
                : 0}{' '}
              fps
            </Text>
            <Text fontSize="14px" lineHeight="19px" color="#CCCCCC">
              {t('streamhealth.framerate')}
            </Text>
          </Flex>
        </Flex>
        <Flex w="100%">
          <Flex w="50%" borderRight="1px dashed #4D4D4D" flexDirection="column">
            <Text mb="6px" fontSize="16px" lineHeight="22px" fontWeight="700">
              {isLive
                ? streamHealthDetails?.encoder_settings?.audio_bitrate ?? 0
                : 0}{' '}
              Kbps
            </Text>
            <Text fontSize="14px" lineHeight="19px" color="#CCCCCC">
              {t('streamhealth.audioBitrate')}
            </Text>
          </Flex>
          <Flex
            w="50%"
            flexDirection="column"
            style={{
              paddingInlineStart: '32px',
            }}
          >
            <Text mb="6px" fontSize="16px" lineHeight="22px" fontWeight="700">
              {isLive
                ? streamHealthDetails?.encoder_settings?.resolution ?? 0
                : 0}
            </Text>
            <Text fontSize="14px" lineHeight="19px" color="#CCCCCC">
              {t('streamhealth.resolution')}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Box border="1px solid #4D4D4D" mb="18px"></Box>
      <Box mb="16px" fontSize="14px" lineHeight="19px" mx="5px">
        <Flex align="center" justifyContent="space-between">
          <Flex fontWeight="600">
            {t('streamhealth.streamStatus')}

            <Text
              style={{
                marginInlineStart: '8px',
              }}
              color={
                isLive ? streamHealthDetails?.color ?? '#E02020' : '#D6000D'
              }
            >
              {isLive && streamHealthDetails?.color
                ? hexToStreamStatusMapper[streamHealthDetails?.color]
                : t('streamhealth.nodata')}
            </Text>
          </Flex>
          <Flex cursor="pointer">
            <InformationPopover />
          </Flex>
        </Flex>
        <Flex
          mt="20px"
          style={{
            marginInlineStart: '6px',
          }}
          align="center"
        >
          <Flex width="10%">
            <Flex
              height="8px"
              width="8px"
              borderRadius="100%"
              backgroundColor={
                isLive ? streamHealthDetails?.color ?? '#FF2400' : '#FF2400'
              }
              style={{
                marginInlineEnd: '14px',
              }}
              boxShadow={`0px 0px 0px 3px rgba(${
                isLive && streamHealthDetails?.color
                  ? hexToRgbaMapper[streamHealthDetails?.color]
                  : '255,36,0'
              },0.6)
            ,0px 0px 0px 6px rgba(${
              isLive && streamHealthDetails?.color
                ? hexToRgbaMapper[streamHealthDetails?.color]
                : '255,36,0'
            },0.4)`}
            ></Flex>
          </Flex>
          <Flex width="90%">
            <Flex>
              {isLive && streamHealthDetails ? (
                streamHealthDetails?.color === '#7CFC00' ? (
                  <Text color="#CCCCCC" fontSize="14px" fontWeight={600}>
                    {t('streamhealth.goodBitrate')}
                  </Text>
                ) : streamHealthDetails?.alerts?.length ? (
                  streamHealthDetails?.alerts?.length === 1 ? (
                    <Text color="#CCCCCC" fontSize="14px" fontWeight={600}>
                      {streamHealthDetails?.alerts[0]}
                    </Text>
                  ) : (
                    <List
                      styleType="disc"
                      listStylePosition="outside"
                      style={{
                        marginInlineStart: '20px',
                      }}
                    >
                      {streamHealthDetails?.alerts.map((alertMsg, index) => (
                        <ListItem
                          color="#CCCCCC"
                          fontSize="14px"
                          fontWeight={600}
                          key={index}
                        >
                          {alertMsg}
                        </ListItem>
                      ))}
                    </List>
                  )
                ) : (
                  ''
                )
              ) : (
                <Text color="#CCCCCC" fontSize="14px" fontWeight={600}>
                  {t('streamhealth.disconnected')}
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}

export default StreamHealthContent
