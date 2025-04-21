import { Flex, FlexProps, Spinner } from '@chakra-ui/core'
import React from 'react'

export const FullSpinnerPage = (props: FlexProps): JSX.Element => {
  return (
    <Flex
      position="fixed"
      bg="brand.primary-dark-black-v2"
      opacity={1}
      alignItems="center"
      justifyContent="center"
      w="full"
      className="h-screen"
      textAlign="center"
      {...props}
    >
      <Spinner color="white" size="xl" />
    </Flex>
  )
}
