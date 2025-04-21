import { Icon, Stack, Text } from '@chakra-ui/core'
import React from 'react'

import { isWebViewBuild } from '../../constent'

interface tag {
  key: string
  icon: string
  label: string
  value: string | number | any
}

const Tags = ({ tags }: { tags: tag[] }) => {
  return (
    <Stack
      isInline
      spacing={[isWebViewBuild ? 2 : 4, 4]}
      pr={[isWebViewBuild ? 4 : 0, 0]}
    >
      {tags.map((tag) => {
        return (
          <Stack
            isInline
            spacing={4}
            key={tag.key}
            bg={['transparent', 'brand.loco-grey-7']}
            p={[0, 2]}
            height={'40px'}
            // minW={['50px', '150px']}
            boxSizing="border-box"
            rounded="8px"
            alignItems={'center'}
            justifyContent={'center'}
            display={
              // isMobile() && !isWebViewBuild && tag.key === 'followers'
              //   ? 'none'
              //   : !isWebViewBuild && tag.key === 'followers'
              //   ? ['none', 'none', 'flex']
              //   :
              'flex'
            }
          >
            <Icon
              //@ts-ignore
              name={tag.icon}
              size="auto"
              height={['16px', '24px']}
              width={['16px', '24px']}
              marginRight={0}
              mr={0}
              m={0}
            />

            <Stack
              isInline
              alignItems={'center'}
              ml={['4px', '16px']}
              justifyContent="center"
            >
              <Text color="white" fontWeight="700" fontSize={['14px']}>
                {tag.value}
              </Text>
              <Text
                ml="6px"
                color="brand.loco-grey-20"
                fontSize="14px"
                whiteSpace={'nowrap'}
                display={['none', 'none', 'flex']}
              >
                {tag.label}
              </Text>
            </Stack>
          </Stack>
        )
      })}
    </Stack>
  )
}

export default Tags
