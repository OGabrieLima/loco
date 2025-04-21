import { useToast, useToastOptions } from '@chakra-ui/core'
import React from 'react'

import CustomToastBox from './CustomToastBox'

export const useCustomToast = () => {
  const toast = useToast()

  return (data: useToastOptions & { note?: string }): any => {
    const {
      position,
      title,
      description,
      status,
      duration,
      isClosable,
      render,
      note,
      ...rest
    } = data
    const customToastBox = (close: any) => {
      const customToastBoxProps = {
        status,
        onClose: close.onClose,
        title,
        description,
        isClosable,
        note,
        ...rest,
      }
      return <CustomToastBox {...customToastBoxProps} />
    }
    return toast({
      position,
      duration,
      isClosable,
      title,
      description,
      status,
      render: render || customToastBox,
      ...rest,
    })
  }
}
