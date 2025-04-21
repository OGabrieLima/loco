import { Box } from '@chakra-ui/core'
import { RootState } from '@src/app/RootReducer'
import React, { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'

import FallbackOtplessLoader from './Helper/FallbackOtplessLoader'

const OtplessV3 = lazy(() => import('./Component/OtplessV3'))
const LazyComponentOtpless = () => {
  const modal_type = useSelector((state: RootState) => state.otpless.modal_type)
  if (!modal_type) return <></>
  return (
    <Box
      position={'absolute'}
      height={'100%'}
      width={'100%'}
      style={{ zIndex: 1000, inset: 0, background: 'rgba(0,0,0,0.5)' }}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Suspense fallback={<FallbackOtplessLoader />}>
        <OtplessV3 />
      </Suspense>
    </Box>
  )
}

export default LazyComponentOtpless
