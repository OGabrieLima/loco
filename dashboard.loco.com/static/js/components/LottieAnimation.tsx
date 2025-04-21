import { Image } from '@chakra-ui/core'
import { Spinner } from '@chakra-ui/core'
import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie'

const GLOBAL_DATA_JSON: {
  [key: string]: any
} = {}
export const LottiAnimation = ({
  message,
  height,
  width,
}: {
  message: string
  height?: number
  width?: number
}) => {
  const [defaultOptions, setDefaultOptions] = useState<any>(
    GLOBAL_DATA_JSON[message] || null
  )
  useEffect(() => {
    if (GLOBAL_DATA_JSON[message]) {
      setDefaultOptions(GLOBAL_DATA_JSON[message])
      return
    }

    if (message?.includes('.json')) {
      ;(async () => {
        const json = await (
          await fetch(message, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          })
        ).json()
        const options = {
          loop: true,
          autoplay: true,
          animationData: json,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }
        GLOBAL_DATA_JSON[message] = options
        setDefaultOptions(options)
      })()
    }
  }, [message])

  return (
    <>
      {defaultOptions ? (
        <Lottie
          options={defaultOptions}
          height={height ? height : 100}
          width={width ? width : 100}
        />
      ) : message?.includes('.png') ? (
        <Image src={message} alt="transaction-icon" h={'40px'} />
      ) : (
        <Spinner />
      )}
    </>
  )
}
