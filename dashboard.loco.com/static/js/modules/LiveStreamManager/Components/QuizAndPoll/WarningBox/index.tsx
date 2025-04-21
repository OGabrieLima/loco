import { Flex, Icon, Text } from '@chakra-ui/core'
import React from 'react'

function WarningBox() {
  return (
    <Flex
      bg="rgba(255, 227, 81, 0.1)"
      border="1px solid"
      borderColor="rgba(255, 227, 81, 0.5)"
      mt={2}
      mb={1}
      p={3}
      fontSize="xs"
    >
      <Icon
        name="warning"
        size="4"
        color="brand.primary-yellow"
        mr={4}
        mt={1}
      />
      <Text>
        You already have 5 questions live. To add a new question, please end one
        of your live questions from the Live Questions section.
      </Text>
    </Flex>
  )
}

export default WarningBox
