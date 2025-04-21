import { Flex, Stack, Text } from '@chakra-ui/core'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../../../app/RootReducer'
import PrimaryButton from '../../../../../components/buttons/PrimaryButton'
import QuestionsResultCard from '../QuestionsResultCard'
import {
  fetchPollAndQuestionStatus,
  fetchSentQuestions,
  sentQuestionsInterface,
} from '../QuizAndPollSlice'
const SentQuestionsBody = ({
  handleOnTabChange,
}: {
  handleOnTabChange: (x: number) => any
}) => {
  const dispatch = useDispatch()
  const { sentQuestions } = useSelector((state: RootState) => state.quizAndPoll)
  const { t } = useTranslation()

  const { isLive } = useSelector((state: RootState) => state.liveStreamManager)
  useEffect(() => {
    let interval: any
    if (isLive) {
      interval = setInterval(() => {
        dispatch(fetchSentQuestions())
        dispatch(fetchPollAndQuestionStatus())
      }, 5000)
    } else if (!isLive) {
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isLive])
  return (
    <Stack
      spacing={4}
      px={['10px', '0px']}
      pt={['10px', '0px']}
      pb={8}
      h="full"
      overflow="auto"
    >
      {sentQuestions.length ? (
        sentQuestions?.map((question: sentQuestionsInterface) => (
          <QuestionsResultCard
            key={question?.uid}
            sentQuestionResult={question}
            status={10}
          />
        ))
      ) : (
        <Flex
          h="full"
          w="full"
          align="center"
          justify=" center"
          direction="column"
        >
          <Stack spacing={4} textAlign="center" alignItems="center">
            <Text fontSize={['14px', '16px']} fontWeight="700">
              {t('manageLiveStream.activityFeed.questions.empty')}
            </Text>
            <Text
              fontSize={['10px', '12px']}
              fontWeight="400"
              color={'#B2B2B2'}
            >
              {t('manageLiveStream.activityFeed.questions.liveQues.p1')}
              <br />
              {t('manageLiveStream.activityFeed.questions.liveQues.p2')}
            </Text>
            <PrimaryButton
              minW="fit-content"
              w="auto"
              fontSize={['12px', '12px']}
              p={'8px 12px'}
              fontWeight="700"
              onClick={() => handleOnTabChange(0)}
            >
              {t('manageLiveStream.activityFeed.questions.askQ')}
            </PrimaryButton>
          </Stack>
        </Flex>
      )}
    </Stack>
  )
}

export default SentQuestionsBody
