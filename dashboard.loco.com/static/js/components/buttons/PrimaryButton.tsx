import { Button, ButtonProps } from '@chakra-ui/core'
import React from 'react'

const PrimaryButton = (props: ButtonProps) => {
  const bg = props.bg ?? 'brand.loco-primary'
  return (
    <Button
      bg={bg}
      w={['full', 'fit-content']}
      minW="300px"
      rounded="10px"
      color={'white'}
      {...props}
      _active={{
        bg: bg,
        ...props?._active,
      }}
      _hover={{
        bg: bg,
        ...props?._hover,
      }}
      _disabled={{
        bg: '#282828',
        color: '#757575',
        cursor: 'not-allowed',
        ...props?._disabled,
      }}
      _focus={{
        outline: 'none',
        ...props?._focus,
      }}
    >
      {props.children}
    </Button>
  )
}

export default PrimaryButton
