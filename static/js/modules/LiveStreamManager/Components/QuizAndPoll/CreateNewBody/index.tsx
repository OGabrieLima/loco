import { Flex, Icon, Tab, Text } from '@chakra-ui/core'
import { useRtlTranslation } from '@src/i18n/utils'
import findIndex from 'lodash/findIndex'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../../../app/RootReducer'
import SelectTabs from '../../../../../components/selectTabs'
import {
  createPollAndQuizQuestion,
  setCreateFormTab,
  setQuestionTab,
} from '../QuizAndPollSlice'
import CreateNewBodyPanels from './CreateNewBodyPanels'

function CreateNewBody() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const tabs = [
    {
      key: 'poll',
      name: t('manageLiveStream.activityFeed.questions.poll'),
      icon: 'poll',
      desc: t('manageLiveStream.activityFeed.questions.pollSubtitle'),
      value: 20,
    },
    {
      key: 'quiz',
      name: t('manageLiveStream.activityFeed.questions.quiz'),
      icon: 'quiz',
      desc: t('manageLiveStream.activityFeed.questions.quizSubtitle'),
      value: 10,
    },
  ]
  const dispatch = useDispatch()
  const { createFormTab } = useSelector((state: RootState) => state.quizAndPoll)
  const currentIndex = findIndex(tabs, { value: createFormTab })
  const handleOnTabChange = (index: number) => {
    dispatch(setCreateFormTab(tabs[index].value))
  }
  const onCreateQuestion = async (params: any) => {
    const createPollAndQuizQuestionRes = await dispatch(
      createPollAndQuizQuestion(params)
    )
    //@ts-ignore
    if (createPollAndQuizQuestionRes?.uid) {
      dispatch(setQuestionTab(20))
    }
  }
  const isRTL = useRtlTranslation()

  const customMarginForTabsRTL = isRTL
    ? {
        ml: [0, 6],
      }
    : {
        mr: [0, 6],
      }

  const customMarginForSelectedTabRTL = isRTL
    ? {
        ml: [2, 2],
      }
    : {
        mr: [2, 2],
      }

  return (
    <Flex>
      <SelectTabs
        handleOnTabChange={handleOnTabChange}
        currentIndex={currentIndex}
        tabsProps={{
          bg: ['transparent'],
          w: 'full',
        }}
        tabProps={{
          ...customMarginForTabsRTL,
        }}
        tabListProps={{
          alignItems: 'stretch',
        }}
        hasNewDesign={false}
        tabComponents={tabs.map((tab, index) => (
          <Tab
            flex={1}
            key={tab.key + lang}
            color="white"
            borderBottom="none"
            my={4}
            p={0}
            _selected={{
              color: 'white',
              bgImage: ['none'],
            }}
            _focus={{
              outline: 'none',
            }}
            {...{
              ...customMarginForSelectedTabRTL,
              display: 'flex',
              rounded: ['8px', '8px'],
              alignItems: 'center',
              height: 'auto',
            }}
            w="45%"
            overflow="hidden"
          >
            <Flex
              bg={'#181818'}
              w="full"
              h="full"
              borderColor={
                currentIndex === index ? 'brand.loco-primary' : 'transparent'
              }
              borderWidth={1}
              rounded="9px"
              boxSizing="border-box"
            >
              <Flex
                bg="brand.loco-primary"
                // p={'10px'}
                justify={'center'}
                minW={'44px'}
                align="center"
              >
                <Icon name={tab.icon} size="24px" />
              </Flex>
              <Flex
                direction="column"
                align="center"
                justify={'center'}
                textAlign="start"
                py={'6px'}
                pl="16px"
              >
                <Text
                  fontSize="12px"
                  textAlign="start"
                  w="full"
                  lineHeight={'14px'}
                  fontWeight="700"
                >
                  {tab.name}
                </Text>
                <Text
                  w="full"
                  fontSize="10px"
                  pr="0.15rem"
                  textAlign="start"
                  color={'#808080'}
                >
                  {tab.desc}
                </Text>
              </Flex>
            </Flex>
          </Tab>
        ))}
        tabPanels={<CreateNewBodyPanels onCreateQuestion={onCreateQuestion} />}
      />
    </Flex>
  )
}

export default CreateNewBody
