import { Box, BoxProps } from '@chakra-ui/core'
import React from 'react'

export const FormLayout = ({
  children,
  formLayoutProps,
}: {
  children: React.ReactNode
  formLayoutProps?: BoxProps
}) => {
  return (
    <Box
      w={'full'}
      px={[2, 10, 10]}
      py={[2, 6, 6]}
      h={'auto'}
      borderRadius={'12px'}
      bg={['black', 'brand.loco-grey-7', 'brand.loco-grey-7']}
      {...formLayoutProps}
    >
      {children}
    </Box>
  )
}
