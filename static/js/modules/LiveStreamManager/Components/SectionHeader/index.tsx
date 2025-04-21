import { Flex, FlexProps } from '@chakra-ui/core'
import React from 'react'

const SectionHeader = (props: FlexProps) => {
  return (
    <Flex w="full" minH="40px" display={['none', 'flex', 'flex']} {...props}>
      <Flex
        bg={['transparent', 'brand.loco-grey-7']}
        w="full"
        h={'100%'}
        align="center"
        rounded={'8px'}
        p={['16px', '12px']}
        fontSize="14px"
        fontWeight="700"
        justify="space-between"
      >
        {props.children}
      </Flex>
    </Flex>
  )
}

export default SectionHeader
