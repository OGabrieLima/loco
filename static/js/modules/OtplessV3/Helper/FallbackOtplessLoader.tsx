import { Box } from '@chakra-ui/core'
import Loader from '@src/components/Loader/Loader'
import React from 'react'

const FallbackOtplessLoader = () => (
  <Box>
    <Loader height="20px" />
  </Box>
)

export default FallbackOtplessLoader
