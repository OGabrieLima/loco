import { Button, RadioButtonGroup } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

const CustomRadioButton = React.forwardRef((props: any, ref: any) => {
  const { isChecked, isDisabled, ...rest } = props
  return (
    <Button
      ref={ref}
      bg={isChecked ? 'brand.loco-primary' : 'brand.loco-grey-70'}
      aria-checked={isChecked}
      role="radio"
      color={isChecked ? 'white' : 'white'}
      isDisabled={isDisabled}
      fontSize={['10px', '14px']}
      size="sm"
      w="24%"
      rounded="10px"
      px={'16px'}
      py="12px"
      fontWeight={isChecked ? 700 : 400}
      _active={{
        outline: 'none',
        bg: isChecked ? 'brand.loco-primary' : 'brand.loco-grey-70',
      }}
      _focus={{
        outline: 'none',
        bg: isChecked ? 'brand.loco-primary' : 'brand.loco-grey-70',
      }}
      _hover={{
        outline: 'none',
        bg: 'brand.loco-primary',
      }}
      outline={'none'}
      {...rest}
    >
      {props.children}
    </Button>
  )
})
CustomRadioButton.displayName = 'CustomRadioButton'

// Step 2: Add `CustomRadio` as children of `RadioButtonGroup`
function FormCustomRadio({
  onChange,
  name,
  value,
  ...props
}: {
  onChange: (val: any) => any
  name: string
  value: string
}): JSX.Element {
  const { t } = useTranslation()

  const radioOptions = [
    {
      label: t('manageLiveStream.activityFeed.questions.min', {
        count: 5,
      }),
      key: '5',
      value: 5 * 60 * 1000,
    },
    {
      label: t('manageLiveStream.activityFeed.questions.min', {
        count: 8,
      }),
      key: '8',
      value: 8 * 60 * 1000,
    },
    {
      label: t('manageLiveStream.activityFeed.questions.min', {
        count: 15,
      }),
      key: '15',
      value: 15 * 60 * 1000,
    },
    {
      label: t('manageLiveStream.activityFeed.questions.unlimited'),
      key: 'unlimited',
      value: 'unlimited',
    },
  ]
  return (
    <RadioButtonGroup
      name={name}
      value={value}
      //   defaultValue="5"
      onChange={onChange}
      display="flex"
      justifyContent="space-between"
      {...props}
    >
      {radioOptions.map((option) => (
        <CustomRadioButton key={option.key} value={option.value}>
          {option.label}
        </CustomRadioButton>
      ))}
    </RadioButtonGroup>
  )
}
export default FormCustomRadio
