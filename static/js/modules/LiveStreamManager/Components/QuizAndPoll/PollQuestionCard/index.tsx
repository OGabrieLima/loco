import { Flex } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { RootState } from '../../../../../app/RootReducer'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../../../../../utils/Amplitude'
// import CreateabelSelector from '../../../../../components/CreateableSelector';
import PollForm from './PollForm'

function PollQuestionCard({
  onCreateQuestion,
}: {
  onCreateQuestion: (params: any) => any
}): JSX.Element {
  const {
    sentQuestions,
    total_closed_questions,
    total_live_questions,
  } = useSelector((state: RootState) => state.quizAndPoll)
  const { currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { me } = useSelector((state: RootState) => state.login)
  const { t } = useTranslation()

  const onSubmit = (params: any) => {
    onCreateQuestion(params)
    if (sentQuestions.length < 5) {
      handleEventsPublishQuestion(params)
    }
  }
  const handleEventsPublishQuestion = (params: any) => {
    const eventProperties: eventPropsTypes.publish_question_props = {
      video_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_type: me?.user_type,
      video_tags: currentLiveStreamDetails?.tags,
      num_of_live_question: sentQuestions.length + 1,
      number_of_options: Object.keys(params?.options).length,
      question_title: params?.question,
      question_type: 'poll',
      vote_duration_mins: params?.duration ? params?.duration / 1000 / 60 : 0,
      vote_duration_type: params?.duration ? 'finite' : 'infinite',
      question_number: total_closed_questions + total_live_questions + 1,
      total_published_questions:
        total_closed_questions + total_live_questions + 1,
    }

    eventActions.sendAmplitudeData(eventConstants.publish_question, {
      ...eventProperties,
    })
  }
  return (
    <Flex
      w="full"
      bg="#181818"
      direction="column"
      rounded={'8px'}
      overflow={'hidden'}
    >
      <Flex
        bg="#212121"
        justify="center"
        align="center"
        fontSize="14px"
        py="10px"
        fontWeight="700"
      >
        {t('manageLiveStream.activityFeed.questions.poll')}
      </Flex>
      <Flex direction="column">
        <PollForm onSubmit={onSubmit} />
      </Flex>
    </Flex>
  )
}

export default PollQuestionCard
