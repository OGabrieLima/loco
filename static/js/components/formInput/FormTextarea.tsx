import { Textarea } from '@chakra-ui/core'
import React from 'react'
import ResizeTextarea from 'react-textarea-autosize'

const FormTextarea = (props: any) => {
  return (
    <Textarea
      as={ResizeTextarea}
      resize={'none'}
      // bg={['transparent', 'brand.primary-text-field']}
      bg="#282828"
      rounded="10px"
      border="none"
      py={'10px'}
      minH={'60px'}
      _focus={{ border: 'none' }}
      _placeholder={{
        color: 'brand.primary-white-v2',
      }}
      _readOnly={{
        cursor: 'no-drop',
      }}
      data-gramm="false"
      {...props}
    />
  )
}

export default FormTextarea
