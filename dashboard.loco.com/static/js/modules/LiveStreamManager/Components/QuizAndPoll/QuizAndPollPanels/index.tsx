import { Flex, FlexProps, TabPanel, TabPanels } from '@chakra-ui/core'
import React from 'react'

import ClosedQuestionsBody from '../ClosedQuestionsBody'
import CreateNewBody from '../CreateNewBody'
import SentQuestionsBody from '../SentQuestionsBody'

const QuizAndPollPanels = ({
  containerProps,
  handleOnTabChange,
}: {
  containerProps?: FlexProps
  handleOnTabChange: (x: number) => any
}) => {
  return (
    <Flex direction="column" h="full" w="full" p={0} {...containerProps}>
      <TabPanels h="full">
        <TabPanel>
          <CreateNewBody />
        </TabPanel>
        <TabPanel h="full">
          <SentQuestionsBody handleOnTabChange={handleOnTabChange} />
        </TabPanel>
        <TabPanel h="full">
          <ClosedQuestionsBody handleOnTabChange={handleOnTabChange} />
        </TabPanel>
      </TabPanels>
    </Flex>
  )
}

export default QuizAndPollPanels
