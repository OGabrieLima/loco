import { Flex } from '@chakra-ui/core'
import findIndex from 'lodash/findIndex'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { setPreviousVisit } from '../../../../app/appSlice'
import { RootState } from '../../../../app/RootReducer'
import SelectTabs from '../../../../components/selectTabs'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../../../../utils/Amplitude'
import QuizAndPollPanels from './QuizAndPollPanels'
import { setQuestionTab } from './QuizAndPollSlice'

function QuizAndPoll() {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const tabs = [
    {
      key: 'createNew',
      name: t('manageLiveStream.activityFeed.questions.newQ'),
      value: 10,
    },
    {
      key: 'liveQuestions',
      name: t('manageLiveStream.activityFeed.questions.liveQ'),
      value: 20,
    },
    {
      key: 'closedQuestions',
      name: t('manageLiveStream.activityFeed.questions.closeQ'),
      value: 30,
    },
  ]

  // const [currentIndex, setCurrentIndex] = useState(1);
  const { questionTab } = useSelector((state: RootState) => state.quizAndPoll)
  const { currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { me } = useSelector((state: RootState) => state.login)
  const currentIndex = findIndex(tabs, { value: questionTab })
  const handleOnTabChange = (index: number) => {
    dispatch(setQuestionTab(tabs[index].value))
    if (tabs[index].value === 20) handleEventVisitQuestionLive()
    if (tabs[index].value === 30) handleEventVisitQuestionClosed()
  }
  const handleEventVisitQuestionLive = () => {
    const eventProperties: eventPropsTypes.visit_question_live_props = {
      video_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_type: me?.user_type,
      video_tags: currentLiveStreamDetails?.tags,
    }
    const previousVisit = eventConstants.visit_question_live.split('visit_')[1]
    dispatch(setPreviousVisit(previousVisit))
    eventActions.sendAmplitudeData(eventConstants.visit_question_live, {
      ...eventProperties,
    })
  }
  const handleEventVisitQuestionClosed = () => {
    const eventProperties: eventPropsTypes.visit_question_closed_props = {
      video_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_type: me?.user_type,
      video_tags: currentLiveStreamDetails?.tags,
    }
    const previousVisit = eventConstants.visit_question_closed.split(
      'visit_'
    )[1]
    dispatch(setPreviousVisit(previousVisit))
    eventActions.sendAmplitudeData(eventConstants.visit_question_closed, {
      ...eventProperties,
    })
  }
  return (
    <Flex h="full" w="full">
      <SelectTabs
        tabs={tabs}
        handleOnTabChange={handleOnTabChange}
        currentIndex={currentIndex}
        tabsProps={{
          overflow: 'auto',
          w: 'full',
          pb: 2,
          px: 0,
        }}
        hasNewDesign={false}
        tabProps={{
          fontSize: '11px',
          padding: ['14px 8px', '14px 16px'],
          flex: 1,
          mb: 1,
          mt: 2,
        }}
        tabPanels={
          <QuizAndPollPanels
            handleOnTabChange={handleOnTabChange}
            containerProps={{
              px: [0],
            }}
          />
        }
      />
    </Flex>
  )
}

export default QuizAndPoll
