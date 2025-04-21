import {
  Divider,
  Flex,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { paths } from '../../../routers/constants'

const LiveStreamManagerHeader = () => {
  const { t } = useTranslation()

  const liveStreamManagerText = t('header.liveStreamManager')
  const goTo = t('header.goto')
  const home = t('header.home')
  const analytics = t('header.analytics')

  return (
    <Flex align="center" justify="center" whiteSpace={'nowrap'}>
      <Text fontSize="sm" fontWeight="black" letterSpacing={'1px'}>
        {liveStreamManagerText}
      </Text>
      <Popover usePortal>
        <PopoverTrigger>
          <Flex p={1}>
            <Icon
              //@ts-ignore
              name="downArrow"
              ml={2}
              mt={'1px'}
              size="14px"
              m={2}
              cursor={'pointer'}
            />
          </Flex>
        </PopoverTrigger>
        <PopoverContent
          zIndex={4}
          w="fit-content"
          py={3}
          bg="brand.primary-light-black-v5"
          border="none"
          color="white"
          boxShadow=" 0px 0px 7px 0px rgba(0, 0, 0, 0.75)"
          _focus={{
            borderColor: 'none',
            outline: 'none',
          }}
        >
          <PopoverArrow bg="brand.primary-light-black-v5" h="5px" />
          <PopoverBody>
            <Text fontSize="xs" opacity={0.5} px={3}>
              {goTo}
            </Text>
            <Divider border={1} opacity={0.2} />
            <Link
              //@ts-ignore
              as={RouterLink}
              to={paths.dashboard.home}
              _hover={{
                textDecoration: 'none',
              }}
              _focus={{
                textDecoration: 'none',
              }}
            >
              <Flex
                fontSize="xs"
                fontWeight="black"
                letterSpacing="1px"
                cursor="pointer"
                mt={2}
                px={3}
              >
                {home}
              </Flex>
            </Link>
            <Link
              //@ts-ignore
              as={RouterLink}
              to={paths.dashboard.analytics}
              _hover={{
                textDecoration: 'none',
              }}
            >
              <Flex
                fontSize="xs"
                fontWeight="black"
                letterSpacing="1px"
                cursor="pointer"
                mt={2}
                px={3}
              >
                {analytics}
              </Flex>
            </Link>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}

export default LiveStreamManagerHeader
