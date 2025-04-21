import {
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/core'
import DefaultInput, { InputProps } from '@chakra-ui/core/dist/Input'
import { useRtlTranslation } from '@src/i18n/utils'
import React, { useRef } from 'react'

interface DefaultInputProps {
  value?: string
  onBlur?: any
  onChange?: any
  error?: boolean
  matches?: boolean
  rightComponent?: React.ReactNode
  inputGroup?: InputProps
}
export const Input = React.forwardRef(function Input(
  props: DefaultInputProps & InputProps<HTMLTextAreaElement>,
  passRef?: React.ForwardedRef<HTMLInputElement>
) {
  const { onBlur, onChange, value, matches, rightComponent } = props
  const isRTL = useRtlTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <InputGroup {...props.inputGroup}>
      <DefaultInput
        {...props}
        ref={passRef || inputRef}
        value={value}
        onChange={(...rest) => {
          if (inputRef.current) {
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus()
              }
            }, 0)
          }
          onChange(...rest)
        }}
        onBlur={onBlur}
        bg={props.bg ? props.bg : ['brand.primary-text-field']}
        border={'none'}
        borderRadius={'10px'}
        focusBorderColor={'none'}
        _placeholder={
          props._placeholder
            ? props._placeholder
            : {
                color: 'brand.primary-white-v2',
              }
        }
        fontSize="14px"
        _readOnly={{
          cursor: 'no-drop',
        }}
        color={props.color ? props.color : 'white'}
      />

      {// error ? (
      //   isRTL ? (
      //     <InputLeftElement
      //       style={{
      //         position: 'absolute',
      //         top: '50%',
      //         transform: 'translateY(-50%)',
      //       }}
      //     >
      //       <Icon name="warningV2" color="brand.primary-red" />
      //     </InputLeftElement>
      //   ) : (
      //     <InputRightElement
      //       style={{
      //         position: 'absolute',
      //         top: '50%',
      //         transform: 'translateY(-50%)',
      //       }}
      //     >
      //       <Icon name="warningV2" color="brand.primary-red" />
      //     </InputRightElement>
      //   )
      // ) :

      matches ? (
        isRTL ? (
          <InputLeftElement
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <Icon name="check" color="brand.primary-green" />
          </InputLeftElement>
        ) : (
          <InputRightElement
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <Icon name="check" color="brand.primary-green" />
          </InputRightElement>
        )
      ) : rightComponent ? (
        isRTL ? (
          <InputLeftElement
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {rightComponent}
          </InputLeftElement>
        ) : (
          <InputRightElement
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {rightComponent}
          </InputRightElement>
        )
      ) : null}
    </InputGroup>
  )
})
