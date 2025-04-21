import { Box, Flex, Spinner, Stack, Text } from '@chakra-ui/core'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../../../app/RootReducer'
import PrimaryButton from '../../../../../components/buttons/PrimaryButton'
import QuestionsResultCard from '../QuestionsResultCard'
import {
  fetchClosedQuestions,
  sentQuestionsInterface,
  setNextClosedQuestions,
} from '../QuizAndPollSlice'
function ClosedQuestionsBody({
  handleOnTabChange,
}: {
  handleOnTabChange: (index: number) => any
}) {
  const dispatch = useDispatch()
  const { questionTab, closedQuestions, nextClosedQuestions } = useSelector(
    (state: RootState) => state.quizAndPoll
  )
  const { t } = useTranslation()

  useEffect(() => {
    if (questionTab === 30) {
      dispatch(setNextClosedQuestions(null))
      dispatch(fetchClosedQuestions(null))
    }
  }, [questionTab])
  return (
    <Stack
      spacing={4}
      id="scrollableStack"
      // bg="brand.primary-light-black-v2"
      pb={8}
      h="full"
      overflow="auto"
      {...(closedQuestions?.length
        ? {}
        : {
            justifyContent: 'center',
            alignItems: 'center',
          })}
    >
      <InfiniteScroll
        dataLength={closedQuestions.length}
        next={() => {
          dispatch(fetchClosedQuestions(nextClosedQuestions))
        }}
        hasMore={nextClosedQuestions ? true : false}
        // scrollThreshold={0.8}
        style={{
          overflow: 'hidden',
        }}
        scrollableTarget="scrollableStack"
        loader={
          <Flex justifyContent="center" key="spinner">
            <Spinner />
          </Flex>
        }
        endMessage={
          <Box
            textAlign="center"
            p="4"
            fontSize={['14px', '16px']}
            fontWeight="700"
          >
            <Text>
              {t('manageLiveStream.activityFeed.questions.closeQText')}
            </Text>
          </Box>
        }
      >
        {closedQuestions?.length ? (
          closedQuestions?.map((question: sentQuestionsInterface) => (
            <QuestionsResultCard
              key={question?.uid}
              sentQuestionResult={question}
              isClosedQuestion={true}
              status={30}
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
      </InfiniteScroll>
    </Stack>
  )
}

export default ClosedQuestionsBody
