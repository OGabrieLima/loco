import { Box, BoxProps } from '@chakra-ui/core'
import styled from '@emotion/styled'
import * as React from 'react'

interface BlockProps {
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

type ContainerProps = {
  $padding: any
} & BoxProps

const Container = styled(Box)<ContainerProps>`
  max-width: ${({ maxWidth }) => maxWidth};
  margin: 0px auto;
  padding: ${({ $padding }) => $padding};
  @media screen and (min-width: 40em) and (max-width: 50em) {
    padding: 16px;
    width: 100%;
  }
  @media only screen and (max-width: 47.95rem) {
    width: 100%;
    max-width: 100%;
    padding: 0 1rem;
  }
`

function Block({
  children,
  className,
  style,
  maxWidth = '1072px',
  padding = '30px 36px',
  ...rest
}: BlockProps & BoxProps): JSX.Element {
  return (
    <Container
      color="white"
      className={className}
      style={style}
      maxWidth={maxWidth}
      $padding={padding}
      {...rest}
    >
      {children}
    </Container>
  )
}

export default Block
