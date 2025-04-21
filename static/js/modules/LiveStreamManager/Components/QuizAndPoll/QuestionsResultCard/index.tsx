import { Button, Flex, Icon, Stack, Text } from '@chakra-ui/core'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../../../app/RootReducer'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../../../../../utils/Amplitude'
import { timeDifferenceInSeconds } from '../../../../../utils/utilityFunction'
import {
  sentQuestionsInterface,
  updatePollAndQuizQuestion,
} from '../QuizAndPollSlice'
import Timer from '../Timer'

function QuestionsResultCard({
  sentQuestionResult,
  isClosedQuestion = false,
  status = 10,
}: {
  sentQuestionResult: sentQuestionsInterface
  isClosedQuestion?: boolean
  status?: 10 | 20 | 30 | 40
}): JSX.Element {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const statusObj = {
    10: t('manageLiveStream.activityFeed.questions.active'),
    20: 'ON HOLD',
    30: t('manageLiveStream.activityFeed.questions.closed'),
    40: 'IN ACTIVE',
  }
  // const { sentQuestions } = useSelector(
  //   (state: RootState) => state.quizAndPoll
  // );
  const { currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { me } = useSelector((state: RootState) => state.login)

  const questionType =
    sentQuestionResult?.questionType === 10
      ? t('manageLiveStream.activityFeed.questions.quiz')
      : sentQuestionResult?.questionType === 20
      ? t('manageLiveStream.activityFeed.questions.poll')
      : ''
  const [resultStat, setResultStat] = useState<
    {
      answer: string
      value: number
      key: string
    }[]
  >([])
  useEffect(() => {
    const resultStats: any = []
    if (sentQuestionResult?.options) {
      // for (let key in sentQuestionResult?.options) {
      //   let obj = {
      //     key: key,
      //     answer: sentQuestionResult?.options[key],
      //     value: sentQuestionResult?.statsPercentage[key],
      //   };
      //   resultStats.push(obj);
      // }
      for (const el of sentQuestionResult?.options) {
        const obj = {
          key: el?.optionUid,
          answer: el.text,
          value: sentQuestionResult?.statsPercentage[el?.optionUid],
        }
        resultStats.push(obj)
      }
    }

    setResultStat(resultStats)
  }, [sentQuestionResult])
  const updatePollAndQuizQuestionHandler = () => {
    dispatch(updatePollAndQuizQuestion({ duration: 0 }, sentQuestionResult.uid))
    handleEventsPublishQuestion('streamer_ended')
  }
  const timeValue = sentQuestionResult?.endsAt ? sentQuestionResult?.endsAt : 0

  const handleEventsPublishQuestion = (
    ended_by: 'streamer_ended' | 'timer_ran_out'
  ) => {
    const eventProperties: eventPropsTypes.end_question_props = {
      video_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_type: me?.user_type,
      vote_duration_type: timeValue ? 'finite' : 'infinite',
      video_tags: currentLiveStreamDetails?.tags,
      question_type:
        sentQuestionResult?.questionType === 10
          ? 'quiz'
          : sentQuestionResult?.questionType === 20
          ? 'poll'
          : 'quiz',
      ...(timeValue && {
        vote_duration_mins:
          timeDifferenceInSeconds(timeValue, sentQuestionResult?.startsAt) / 60,
      }),
      ...(ended_by !== 'timer_ran_out' && {
        ended_after_percent: Math.floor(
          (timeDifferenceInSeconds(timeValue) /
            timeDifferenceInSeconds(timeValue, sentQuestionResult?.startsAt)) *
            100
        ),
      }),
      ...(ended_by !== 'timer_ran_out' && {
        ended_after_seconds:
          timeDifferenceInSeconds(timeValue, sentQuestionResult?.startsAt) -
          timeDifferenceInSeconds(timeValue),
      }),
      ended_by: ended_by,
      most_votes_on_an_option: Math.max(
        ...resultStat.map((result) => result.value)
      ),
      total_votes: sentQuestionResult?.totalVotes || 0,
    }

    eventActions.sendAmplitudeData(eventConstants.end_question, {
      ...eventProperties,
    })
  }

  const stats = [
    {
      label: t('manageLiveStream.activityFeed.questions.totalVotes'),
      value: sentQuestionResult?.totalVotes,
      key: 'totalVotes',
    },
    {
      label: t('manageLiveStream.activityFeed.questions.status'),
      value: statusObj[status],
      key: 'status',
    },
    // {
    //   label: 'Ends In',
    //   value: sentQuestionResult?.endsAt
    //     ? formattedTime(sentQuestionResult?.endsAt)
    //     : '-',
    //   key: 'endsIn',
    // },
  ]

  return (
    <Flex
      w="full"
      bg="brand.primary-light-black-v5"
      borderRadius={'8px'}
      direction="column"
      mb={2}
    >
      <Flex
        bg="brand.loco-grey-8"
        // justify="center"
        px={2}
        align="center"
        fontSize={['12px', '14px']}
        py={1}
        borderTopLeftRadius={'8px'}
        borderTopRightRadius={'8px'}
        fontWeight="bold"
        position="relative"
      >
        <Text>{questionType}</Text>
        {isClosedQuestion ? null : (
          <Button
            position="absolute"
            right={1}
            py={1}
            px={2}
            fontSize={['12px', '14px']}
            color="brand.loco-primary"
            fontWeight="700"
            h={'fit-content'}
            size="xs"
            outline={'none'}
            _hover={{
              bg: 'transparent',
            }}
            _focus={{
              bg: 'transparent',
            }}
            _active={{
              bg: 'transparent',
            }}
            bg="transparent"
            onClick={updatePollAndQuizQuestionHandler}
          >
            {t('manageLiveStream.activityFeed.questions.end')}
          </Button>
        )}
      </Flex>
      <Flex justifyContent="space-between" px={4} bg="brand.loco-grey-70">
        {stats.map((stat) => (
          <Flex direction="column" flex={1} key={stat?.key}>
            <Text fontSize={['12px', '14px']} color="brand.primary-text">
              {stat?.label}
            </Text>
            <Text fontSize={['12px', '14px']} fontWeight="bold">
              {stat?.value}
            </Text>
          </Flex>
        ))}
        {!isClosedQuestion ? (
          <Flex direction="column" flex={1}>
            <Text fontSize={['12px', '14px']} color="brand.primary-text">
              {t('manageLiveStream.activityFeed.questions.endsIn')}
            </Text>
            <Timer
              endsAt={timeValue}
              handleEventsPublishQuestion={handleEventsPublishQuestion}
            />
          </Flex>
        ) : null}
      </Flex>
      <Stack spacing={4} px={4} my={4}>
        <Text fontWeight="bold" fontSize={['12px', '14px']}>
          {sentQuestionResult?.question}
        </Text>
        {resultStat?.map((result) => (
          <Flex align="center" key={result.key}>
            <Flex
              bg="brand.primary-light-black-v4"
              direction="column"
              rounded="8px"
              overflow="hidden"
              w="full"
              mr={4}
            >
              <Flex align="center" justify="space-between" px={2} py={1}>
                <Text ml={4} fontSize={['12px', '14px']}>
                  {result?.answer}
                </Text>
                {sentQuestionResult?.correctAnswer &&
                sentQuestionResult?.correctAnswer === result?.key ? (
                  <Icon name="check" size="3" color="brand.primary-green" />
                ) : null}
              </Flex>
              <Flex
                bg="#474747"
                h={1}
                w={`${result?.value ? result?.value : '0'}%`}
              />
            </Flex>
            <Text
              fontSize={['12px', '14px']}
              color="brand.primary-text"
              w="40px"
            >
              {result?.value ? result?.value : '0'}%
            </Text>
          </Flex>
        ))}
      </Stack>
    </Flex>
  )
}

export default QuestionsResultCard
