import { Stack, StackProps } from '@chakra-ui/core'
import React from 'react'
import { Helmet } from 'react-helmet'

interface MainContainerProps {
  children?: React.ReactNode
  title?: string
  titleComponent?: React.ReactNode
  subtitle?: string
  containerStyle?: StackProps
  titleTextAlign?: any
  dir?: string
}

const Container = ({
  children,
  title,
  containerStyle,
  dir,
}: MainContainerProps): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Stack
        dir={dir || 'ltr'}
        color="white"
        maxH="93vh"
        overflow="auto"
        {...containerStyle}
      >
        {children}
      </Stack>
    </>
  )
}

export default Container
