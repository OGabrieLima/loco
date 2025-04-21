import { Input, Radio, RadioGroup } from '@chakra-ui/core'
import React from 'react'

interface radioOption {
  label: string
  value: number | string
}
interface FormRadioProps {
  extraProps: { options: radioOption[]; isReadOnly?: boolean }
  value: string | number
  onChange: (val: string | number | any) => any
  name: string
}
const FormRadio = ({ extraProps, value, onChange, name }: FormRadioProps) => {
  const obj = extraProps.options.find((el) => el.value === value)
  return extraProps.isReadOnly ? (
    <Input
      value={obj?.label}
      bg={['brand.primary-text-field']}
      border={'none'}
      borderRadius={'4px'}
      focusBorderColor={'none'}
      _placeholder={{
        color: 'brand.primary-white-v2',
      }}
      fontSize="sm"
      _readOnly={{
        cursor: 'not-allowed',
      }}
      isReadOnly={true}
      color={'white'}
    />
  ) : (
    <RadioGroup
      key={name}
      name={name}
      display="flex"
      variantColor="white"
      justifyContent="space-between"
      isInline
      value={`${value}`}
      onChange={onChange}
    >
      {extraProps.options.map((option) => {
        return (
          <Radio
            key={option.label}
            value={option.value}
            className="profile-radio-fix"
            fontWeight={700}
            // isDisabled={extraProps?.isReadOnly || false}
          >
            {option.label}
          </Radio>
        )
      })}
    </RadioGroup>
  )
}

export default FormRadio
