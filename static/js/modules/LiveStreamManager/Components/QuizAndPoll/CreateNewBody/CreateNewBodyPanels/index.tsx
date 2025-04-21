import { Flex, FlexProps, TabPanel, TabPanels } from '@chakra-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../../../../../app/RootReducer'
import PollQuestionCard from '../../PollQuestionCard'
import QuizQuestionCard from '../../QuizQuestionCard'
import WarningBox from '../../WarningBox'

function CreateNewBodyPanels({
  containerProps,
  onCreateQuestion,
}: {
  containerProps?: FlexProps
  onCreateQuestion: (params: any) => any
}) {
  const { sentQuestions } = useSelector((state: RootState) => state.quizAndPoll)
  return (
    <Flex
      direction="column"
      //   bg="brand.primary-light-black-v5"
      h="full"
      w="full"
      boxSizing="border-box"
      {...containerProps}
    >
      {sentQuestions?.length === 5 ? <WarningBox /> : null}
      <TabPanels py={2} w="full">
        <TabPanel w="full">
          <PollQuestionCard onCreateQuestion={onCreateQuestion} />
        </TabPanel>
        <TabPanel>
          <QuizQuestionCard onCreateQuestion={onCreateQuestion} />
        </TabPanel>
      </TabPanels>
    </Flex>
  )
}

export default CreateNewBodyPanels
