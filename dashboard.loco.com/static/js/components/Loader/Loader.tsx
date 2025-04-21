import { Box, Spinner } from '@chakra-ui/core'
import styled from '@emotion/styled'
import * as React from 'react'

const Wrapper = styled(Box)`
  place-items: center;
`
interface LoaderProps {
  height?: string
}

const Loader = ({ height }: LoaderProps): JSX.Element => {
  return (
    <Wrapper width="100%" height={height} display="grid">
      <Spinner color="white" size="xl" speed="0.8s" />
    </Wrapper>
  )
}

Loader.defaultProps = {
  height: '100vh',
}

export default Loader
