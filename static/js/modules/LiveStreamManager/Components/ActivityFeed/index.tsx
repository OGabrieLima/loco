import { Box, Flex, Text } from '@chakra-ui/core'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { AutoChatScroll } from 'ui'

import { RootState } from '../../../../app/RootReducer'
import useMqttState from '../../../../context/MqttConnetor/useMqttState'
import useSubscription from '../../../../context/MqttConnetor/useSubscription'
import GiveWay from '../GiveWay/Index'
import QuizAndPoll from '../QuizAndPoll'
import SectionHeader from '../SectionHeader'
import Activity from './Activity'
import ActivityTabs from './ActivityTabs'

const ActivityFeed = ({ activityMsgs }: any) => {
  const { allMessages } = useMqttState()
  const { t } = useTranslation()
  const {
    login: { me: streamerDetails },
    liveStreamManager: { currentLiveStreamDetails, activityTab, isLive },
  } = useSelector((state: RootState) => state)
  useSubscription(`activity/${currentLiveStreamDetails?.uid}/message`)
  const msgs = allMessages.filter((msg) => {
    return (
      msg.topic === `activity/${streamerDetails?.user_uid}/follow` ||
      msg.topic === `activity/${currentLiveStreamDetails?.uid}/message`
    )
  })
  useEffect(() => {
    const messageBody = document.querySelector('#activityBody')
    if (messageBody) {
      messageBody.scrollTop =
        messageBody.scrollHeight - messageBody.clientHeight
    }
    storeActivityInLocal()
  }, [msgs?.length])

  const storeActivityInLocal = () => {
    if (currentLiveStreamDetails?.uid) {
      const key: string = currentLiveStreamDetails?.uid
      const local_activities = localStorage.getItem(key)
      let update_local_activities: any[] = []
      if (local_activities) {
        update_local_activities = [...JSON.parse(local_activities)]
      }
      if (update_local_activities.length > 30) {
        update_local_activities.shift()
      }
      if (msgs.length) {
        update_local_activities.push(msgs[msgs.length - 1])
      }
      if (update_local_activities) {
        localStorage.setItem(key, JSON.stringify(update_local_activities))
      }
    }
  }

  const displayMsgs = activityMsgs.filter((msg: any) => {
    if (
      //@ts-ignore
      msg?.data &&
      //@ts-ignore
      msg?.data?.sticker &&
      //@ts-ignore
      msg.data.sticker.currency_type
    ) {
      if (activityTab === 20) {
        //@ts-ignore
        return msg?.data?.sticker?.currency_type === activityTab
      } else if (activityTab === 10) {
        //@ts-ignore
        return msg?.data?.sticker?.currency_type !== 20
      }
    }
    return false
  })

  const activityFeedText = t('manageLiveStream.activityFeed.title')
  const quietText = t('manageLiveStream.activityFeed.gold.empty.title')
  const goldEmptyp1Text = t('manageLiveStream.activityFeed.gold.empty.p1')
  const diamondEmptyp1Text = t('manageLiveStream.activityFeed.diamond.empty.p1')

  const goldEmptyp2Text = t('manageLiveStream.activityFeed.gold.empty.p2')
  const diamondEmptyp2Text = t('manageLiveStream.activityFeed.diamond.empty.p2')

  return (
    <Flex
      bg={['transparent', 'brand.loco-black']}
      direction="column"
      lineHeight={'130%'}
      w="full"
      flex={1}
      position={'relative'}
      overflow="hidden"
      mt={2}
      pb={[8, 4]}
      align="center"
    >
      <SectionHeader minH={['48px', '48px']}>
        <Text fontSize={'16px'} fontWeight={'700'}>
          {activityFeedText}
        </Text>
        <Box visibility={'hidden'} h="26px" w="5px"></Box>
      </SectionHeader>
      <Flex w="full" px={['0', '2']}>
        <ActivityTabs />
      </Flex>
      <Flex
        id="activityBody"
        h="full"
        w="full"
        maxH="full"
        direction="column"
        // Hiding padding only for quiz and poll
        px={activityTab === 30 && isLive ? 2 : 6}
        // pb={4}
        overflow="auto"
        align="center"
        justify={displayMsgs.length ? 'flex-start' : 'center'}
      >
        {activityTab === 10 || activityTab === 20 ? (
          displayMsgs?.length ? (
            // Pending
            <AutoChatScroll
              uniqueUid={
                'chat-container-' +
                activityTab +
                '-' +
                currentLiveStreamDetails?.uid
              }
              isChatVisible={true}
              is_dashboard_activity={true}
              load_more_text={t('manageLiveStream.chat.new_messages')}
            >
              <></>
              {/* DO NOW ADD ANYTHING AT THIS INDEX PEASE */}
              {displayMsgs.map((activity: any) => {
                return (
                  <Activity
                    key={activity.id}
                    //@ts-ignore
                    activity={activity.data}
                  />
                )
              })}
              {/* DO NOW ADD ANYTHING BEFORE THIS INDEX PEASE */}
              <></>
            </AutoChatScroll>
          ) : (
            <>
              <Text
                fontSize={['14px', '16px']}
                fontWeight={['700', '600']}
                mb={'6px'}
              >
                {quietText}
              </Text>
              <Text
                fontSize={['10px', '12px']}
                fontWeight={['600', '400']}
                color="brand.loco-grey-20"
                textAlign="center"
              >
                {activityTab === 20 ? diamondEmptyp1Text : goldEmptyp1Text}
                <br />
                {activityTab === 20 ? diamondEmptyp2Text : goldEmptyp2Text}
              </Text>
            </>
          )
        ) : null}
        {activityTab === 30 ? (
          isLive ? (
            <QuizAndPoll />
          ) : (
            <>
              <Text
                fontSize={['14px', '16px']}
                fontWeight={['700', '600']}
                mb={'6px'}
              >
                {t('manageLiveStream.activityFeed.questions.empty')}
              </Text>
              <Text
                fontSize={['10px', '12px']}
                fontWeight={['600', '400']}
                color="brand.loco-grey-20"
                textAlign="center"
              >
                {t('manageLiveStream.activityFeed.questions.askQuestion')}
              </Text>
            </>
          )
        ) : null}
        {activityTab === 40 ? <GiveWay /> : null}
      </Flex>
    </Flex>
  )
}

export default ActivityFeed
