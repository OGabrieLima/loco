import './customCalendar.css'

import {
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from '@chakra-ui/core'
import React from 'react'

import CustomCalendar from './CustomCalendar'

const InputComponent = (props: any): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { value, onChange, title, placeholder } = props
  return (
    <>
      <InputGroup>
        <Input
          isReadOnly={true}
          className="calendar-input"
          placeholder={placeholder}
          background={'#282828'}
          minH={'48px'}
          _placeholder={{
            color: 'brand.primary-white-v2',
          }}
          fontSize="sm"
          backgroundColor={'brand.primary-grey-70'}
          border="none"
          _focus={{
            borderColor: 'white',
          }}
          borderRadius="10px"
          onClick={onOpen}
          cursor={'pointer'}
          value={value}
          isDisabled={props?.calendarProps?.isReadOnly}
          _disabled={{
            backgroundColor: 'brand.primary-text-field',
            cursor: 'not-allowed',
          }}
        />
        <InputRightElement
          onClick={props?.calendarProps?.isReadOnly ? undefined : onOpen}
          style={{
            cursor: props?.calendarProps?.isReadOnly
              ? 'not-allowed'
              : 'pointer',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <Icon name="calendar_new" color="whtie" />
        </InputRightElement>
      </InputGroup>
      <CustomCalendar
        {...props}
        title={title}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        value={value}
        disableClose={false}
        onChange={onChange}
      />
    </>
  )
}

export default InputComponent
