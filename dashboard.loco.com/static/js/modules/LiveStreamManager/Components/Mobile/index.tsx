import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/core'
import theme from '@src/theme'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../../app/RootReducer'
import { FullSpinnerPage } from '../../../../components/FullSpinnerPage'
import { selectTabProps } from '../../../../components/selectTabs'
import { getGivewayDetails } from '../../LiveStreamManagerSlice'
import GiveWay from '../GiveWay/Index'

const LeftColumn = lazy(() => import('../LeftColumn'))
const RightColumn = lazy(() => import('../RightColumn'))
const MiddleColumn = lazy(() => import('../MiddleColumn'))
const QuizAndPoll = lazy(() => import('../QuizAndPoll'))

const Mobile = (props: any) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { isLive, currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const dispatch = useDispatch()

  const { t } = useTranslation()

  const tabs: selectTabProps[] = [
    { name: t('manageLiveStream.tabs.stream'), key: 'stream' },
    { name: t('manageLiveStream.tabs.activityFeed'), key: 'activityFeed' },
    { name: t('manageLiveStream.tabs.chat'), key: 'chat' },
    { name: t('manageLiveStream.tabs.qa'), key: 'q&a' },
  ]

  useEffect(() => {
    if (
      tabs.length < 5 &&
      tabs.filter((tab) => tab.key === 'giveaway').length === 0 &&
      currentLiveStreamDetails?.game_uid === '20097' &&
      currentLiveStreamDetails.tags.filter(
        (tag) => tag.toLocaleLowerCase() === 'giveaway'
      ).length === 1
    ) {
      tabs.push({ key: 'giveaway', name: 'GIVEAWAY' })
    }
  }, [tabs])

  useEffect(() => {
    if (
      currentLiveStreamDetails?.tags.filter(
        (tag) => tag.toLocaleLowerCase() === 'giveaway'
      ).length === 1
    ) {
      dispatch(getGivewayDetails(currentLiveStreamDetails?.uid))
    }
  }, [tabs, currentIndex])
  return (
    <Flex direction="column" id="mobileChat" h="full" overflow="hidden">
      <Tabs
        onChange={setCurrentIndex}
        index={currentIndex}
        h="full"
        display={'flex'}
        flexDirection="column"
      >
        <TabList borderBottom="none" p={0} m={0} display={['flex', 'block']}>
          {tabs.map((tab) => (
            <Tab
              flex={'1'}
              key={tab.key}
              _focus={{
                boxShadow: 'none',
              }}
              opacity={1}
              width={['50%', 'auto']}
              transition="none"
              padding={['12px 8px', '12px 16px']}
              whiteSpace={'nowrap'}
              fontSize={['11px', '14px']}
              fontWeight="400"
              lineHeight="130%"
              color="brand.loco-grey-20"
              letterSpacing="1.04px"
              background={
                'linear-gradient(89.79deg, #3A3A3A -23.82%, #3A3A3A 116.93%) left bottom no-repeat'
              }
              backgroundSize={'100% 1px'}
              _selected={{
                background: `${theme.colors.gradient['tab-bottom-border']} left bottom no-repeat`,
                backgroundSize: '100% 2px',
                opacity: 1,
                fontWeight: '700',
                color: '#fff',
              }}
            >
              {tab.name}
            </Tab>
          ))}
          <Tab
            disabled
            w="full"
            key={'dummy-key'}
            _disabled={{
              opacity: 1,
              cursor: 'auto',
            }}
            _focus={{
              boxShadow: 'none',
            }}
            cursor={'auto'}
            display={['none', 'block']}
            opacity={1}
            transition="none"
            padding={['12px 8px', '12px 16px']}
            whiteSpace={'nowrap'}
            fontSize={['11px', '14px']}
            fontWeight="400"
            lineHeight="130%"
            color={'transparent'}
            letterSpacing="1.04px"
            background={
              'linear-gradient(89.79deg, #3A3A3A -23.82%, #3A3A3A 116.93%) left bottom no-repeat'
            }
            backgroundSize={'100% 1px'}
          >
            {/* This is just to show  whole line in web */}
            DUMMY
          </Tab>
        </TabList>
        <Flex direction="column" overflow="hidden" h="full">
          <TabPanels h="full" overflow="hidden">
            <TabPanel h="full">
              <Suspense fallback={<FullSpinnerPage position="relative" />}>
                <LeftColumn />
              </Suspense>
            </TabPanel>
            <TabPanel h="full">
              <Suspense fallback={<FullSpinnerPage position="relative" />}>
                <MiddleColumn activityMsgs={props.activityMsgs} />
              </Suspense>
            </TabPanel>
            <TabPanel h="full">
              <Suspense fallback={<FullSpinnerPage position="relative" />}>
                <RightColumn handleChatMsgs={props.handleChatMsgs} />
              </Suspense>
            </TabPanel>
            <TabPanel h="full">
              <Suspense fallback={<FullSpinnerPage position="relative" />}>
                {isLive ? (
                  <QuizAndPoll />
                ) : (
                  <Flex
                    h="full"
                    justify="center"
                    align="center"
                    direction="column"
                    px="4"
                  >
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
                        {t(
                          'manageLiveStream.activityFeed.questions.askQuestion'
                        )}
                      </Text>
                    </>
                  </Flex>
                )}
              </Suspense>
            </TabPanel>
            <TabPanel h="full" px={2}>
              <Suspense fallback={<FullSpinnerPage position="relative" />}>
                {isLive ? (
                  <GiveWay />
                ) : (
                  <Flex
                    h="full"
                    justify="center"
                    align="center"
                    direction="column"
                  >
                    <Text fontSize="sm" fontWeight="black" mb={4}>
                      No GiveWay...
                    </Text>
                    <Text
                      fontSize="xs"
                      fontWeight="light"
                      opacity={0.5}
                      textAlign="center"
                      lineHeight={2}
                    >
                      Go live to do giveway
                      <br />
                      for your viewers.
                    </Text>
                  </Flex>
                )}
              </Suspense>
            </TabPanel>
          </TabPanels>
        </Flex>
      </Tabs>
    </Flex>
  )
}

export default Mobile
