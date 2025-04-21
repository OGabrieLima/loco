import { Flex, Icon, Stack, Text } from '@chakra-ui/core'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { RootState } from '../../../../app/RootReducer'
import useSubscription from '../../../../context/MqttConnetor/useSubscription'

const Tabs = () => {
  const { currentLiveStreamDetails, isLive, liveViews } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { mqtt } = useSubscription(
    `stream_stats/${currentLiveStreamDetails?.uid}/live_views`
  )
  const { t } = useTranslation()
  const notLiveText = t('manageLiveStream.streamPreview.notLive')
  const watchingText = t('manageLiveStream.streamPreview.watching')

  const arr = [
    {
      name: 'watching',
      label: watchingText,
      value: liveViews,
      icon: 'dot',
    },
  ]

  useEffect(() => {
    const fingerprint = localStorage.getItem('fingerprint')
    return () => {
      mqtt?.publish(
        `stream_stats/${currentLiveStreamDetails?.uid}/device`,
        JSON.stringify({
          device_id: fingerprint,
          user_uid: fingerprint,
          status: 20,
        }),
        { qos: 0 },
        function() {
          mqtt?.unsubscribe(
            `stream_stats/${currentLiveStreamDetails?.uid}/live_views`
          )
        }
      )
    }
  }, [mqtt, currentLiveStreamDetails?.uid])

  return (
    <Stack isInline spacing={2} w={['100%', '100%']} align="center" mt={[0, 2]}>
      {arr.map((a, i) => {
        return (
          <Flex
            key={a.name}
            bg="brand.loco-grey-7"
            flex={1}
            align="center"
            justify={[!isLive ? 'center' : 'flex-start', 'center']}
            py={'10px'}
            px={'12px'}
            maxW={['100%', '40%']}
            rounded={['4px']}
            minH="33px"
          >
            {/* only showing watch views till we get the apis for diamond and gold */}
            {isLive && i === 0 ? (
              <>
                <Icon
                  //@ts-ignore
                  name={a.icon}
                  display={['none', 'block']}
                  size="12px"
                  style={{ marginInlineEnd: '6px' }}
                />
                <Icon
                  //@ts-ignore
                  name={a.icon}
                  display={['block', 'none']}
                  size="10px"
                  style={{ marginInlineEnd: '6px' }}
                />
                <Text
                  verticalAlign="middle"
                  fontSize={['10px', '14px']}
                  lineHeight="130%"
                  fontWeight="600"
                  color="#ffffff"
                  style={{ marginInlineEnd: '6px' }}
                >
                  {a.value}
                </Text>
                <Text
                  fontSize={['10px', '14px']}
                  lineHeight="130%"
                  fontWeight="600"
                  color="#ffffff"
                >
                  {a.label}
                </Text>
              </>
            ) : (
              <>
                {i === 0 ? (
                  <Text
                    fontSize={['14px']}
                    lineHeight="130%"
                    fontWeight="700"
                    color="#ffffff"
                  >
                    {notLiveText}
                  </Text>
                ) : (
                  ''
                )}
              </>
            )}
          </Flex>
        )
      })}
    </Stack>
  )
}

export default Tabs
