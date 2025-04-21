import { Box, Flex, Icon, Text } from '@chakra-ui/core'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { LottiAnimation } from '../../../../components/LottieAnimation'
import { activityInterface } from '../../types'

const Activity = ({ activity }: { activity: activityInterface }) => {
  const { t } = useTranslation()
  return (
    <Flex
      w="full"
      bg="#181818"
      p={2}
      mt={2}
      rounded="lg"
      align="center"
      minH="fit-content"
    >
      <Box px="2">
        {activity.type === 4 || activity.type === 5 ? (
          activity.message ? (
            <LottiAnimation message={activity.message} height={40} width={40} />
          ) : activity.sticker?.image_url ? (
            <LottiAnimation
              message={activity.sticker.image_url}
              height={40}
              width={40}
            />
          ) : (
            false
          )
        ) : null}
      </Box>
      <Box flex={1}>
        <Text fontSize="xs" letterSpacing={0.5}>
          {activity.type === 4 || activity.type === 5 ? (
            <Text as="span">
              <Trans
                i18nKey="manageLiveStream.activityFeed.gold.stickerFrom"
                values={{ username: activity.profile.username }}
                components={{
                  Wrp: <span style={{ color: 'white', fontWeight: 'bold' }} />,
                }}
              />
              <Text fontWeight="black">
                {activity.sticker?.amount}
                <Icon
                  //@ts-ignore
                  name={
                    activity?.sticker?.currency_type === 10
                      ? 'gold'
                      : 'diamond_small'
                  }
                  ml={2}
                ></Icon>
              </Text>
            </Text>
          ) : (
            <Text color="white" fontWeight="black">
              @{activity.profile.username}{' '}
              <Text as="span" fontWeight="normal">
                {activity.message}
              </Text>
            </Text>
          )}
        </Text>
      </Box>
    </Flex>
  )
}

export default Activity
