import { Flex, Icon, IconProps, Text, useToastOptions } from '@chakra-ui/core'
import theme from '@src/theme'
import React from 'react'

export interface CustomToastBoxProps {
  status: useToastOptions['status']
  onClose: useToastOptions['onClose']
  title: useToastOptions['title']
  description: useToastOptions['description']
  note?: string
  isClosable: useToastOptions['isClosable']
}

const CustomToastBox: React.SFC<CustomToastBoxProps> = ({
  status,
  onClose,
  title,
  description,
  note,
  isClosable,
}) => {
  let icon: {
    name: IconProps['name']
    color: IconProps['color']
  } = {
    name: undefined,
    color: undefined,
  }
  if (status) {
    //@ts-ignore
    icon =
      status === 'success'
        ? { name: 'successOrange', color: 'brand.loco-primary' }
        : // : status === 'error'
          // ? { name: 'error', color: 'brand.primary-red' }
          // : status === 'info'
          // ? { name: 'info', color: 'brand.secondary-black' }
          // : status === 'warning'
          // ? { name: 'warning', color: 'yellow.400' }
          undefined
  }
  return (
    <Flex
      maxW={['95vw', '45vw']}
      minW="25vw"
      bg={'#282828'}
      direction="row"
      rounded={'12px'}
      color="white"
      lineHeight={'130%'}
      justifyContent={'space-between'}
      alignItems={'center'}
      boxShadow={'none'}
      borderBottom={[`1px solid ${theme.colors.brand['loco-primary']}`, 'none']}
      borderLeft={['none', `1px solid ${theme.colors.brand['loco-primary']}`]}
      p={['12px 16px', '12px 16px']}
      my={4}
    >
      {icon?.name ? (
        <Icon name={icon.name} color={icon.color} size="24px" mr="10px" />
      ) : null}
      <Flex
        direction="column"
        flex={1}
        align="flex-start"
        justifyContent={'center'}
      >
        {title ? (
          <Text fontSize={'14px'} fontWeight={'700'} textAlign="left">
            {title}
          </Text>
        ) : null}
        {description ? (
          <Text
            fontSize={'12px'}
            fontWeight={'400'}
            color={'#B2B2B2'}
            textAlign="left"
          >
            {description}
          </Text>
        ) : null}
        {note ? (
          <Text fontSize={'12px'} fontWeight={'400'} textAlign="left">
            {note}
          </Text>
        ) : null}
      </Flex>
      {isClosable ? (
        <Flex ml="10px">
          <Icon
            //@ts-ignore
            name="crossOrange"
            cursor="pointer"
            onClick={onClose}
            p="8px"
            size="32px"
          />
        </Flex>
      ) : null}
    </Flex>
  )
}

export default CustomToastBox
