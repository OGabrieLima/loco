import { Button, Flex, Text } from '@chakra-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'

import { paths } from '../../../routers/constants'

const LogoutConfirmationModal = ({ onClose }: { onClose: () => any }) => {
  const history = useHistory()
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      px={8}
      pb={8}
      pt={4}
    >
      <Text
        fontSize="md"
        fontWeight="black"
        textAlign="center"
        letterSpacing="1px"
      >
        Are you sure you want to LOGOUT?
      </Text>
      <Flex mt={8}>
        <Button
          borderColor="brand.primary-blue-v2"
          borderWidth="2px"
          bg={'transparent'}
          mt={4}
          px={2}
          py={2}
          mr={4}
          w="120px"
          rounded="8px"
          _hover={{
            opacity: 0.75,
          }}
          _focus={{
            outline: 'none',
          }}
          _active={{
            bg: 'transparent',
          }}
          onClick={() => {
            history.push(paths.logout)
            onClose()
          }}
          verticalAlign="middle"
          color="white"
        >
          LOGOUT
        </Button>
        <Button
          bg={'brand.primary-blue-v2'}
          mt={4}
          px={2}
          py={2}
          ml={4}
          w="120px"
          rounded="8px"
          _focus={{
            outline: 'none',
          }}
          _active={{
            bg: 'brand.primary-blue',
          }}
          _hover={{
            opacity: 0.75,
          }}
          onClick={onClose}
          verticalAlign="middle"
          color="white"
        >
          STAY
        </Button>
      </Flex>
    </Flex>
  )
}

export default LogoutConfirmationModal
