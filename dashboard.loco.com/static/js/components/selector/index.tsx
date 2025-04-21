import { Box, Flex, Icon, Tooltip } from '@chakra-ui/core'
import { find } from 'lodash'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Select, {
  components,
  OptionProps,
  OptionTypeBase,
  ValueType,
} from 'react-select'
import makeAnimated from 'react-select/animated'
import { borderRadius } from 'react-select/src/theme'

import { isWebViewBuild } from '../../constent'

interface MultiSelectProps {
  onChange?: (selectedOption: ValueType<OptionTypeBase, boolean>) => void
  value?: ValueType<OptionTypeBase, boolean> | any
  size?: string | string[]
  isMulti?: boolean
  isLoading?: boolean
  options: any[]
  errors: any
  name: string
  touched: any
  placeholder: string
  extraProps?: any
  disabledOptionMessage?: string
  isUploadClips?: boolean
  onFocus?: () => void
}

const animatedComponents = makeAnimated()

const OptionWithTooltip = ({
  optionProps,
  disabledOptionMessage,
}: {
  optionProps: React.PropsWithChildren<OptionProps<OptionTypeBase, boolean>>
  disabledOptionMessage?: string
}) => {
  const { isDisabled, label, rightComp } = optionProps.data
  const { t } = useTranslation()
  const optionDiv = (
    <components.Option {...optionProps}>
      <Flex justifyContent={'space-between'} alignItems="center" pr="4px">
        <div>
          {t(label, {
            defaultValue: label,
          }) || label}
        </div>
        {rightComp ? <div>{rightComp}</div> : null}
      </Flex>
    </components.Option>
  )
  return isDisabled &&
    disabledOptionMessage?.length &&
    disabledOptionMessage?.length > 0 ? (
    <Tooltip
      label={disabledOptionMessage}
      rounded={'12px'}
      p="16px"
      bg="#3A3A3A"
      color="white"
      fontSize="14px"
      fontWeight={'600'}
      display={['none', 'flex', 'flex']}
      hasArrow
      shouldWrapChildren
      w="175px"
      placement="right"
      zIndex={10000}
      aria-label={disabledOptionMessage}
    >
      {optionDiv}
    </Tooltip>
  ) : (
    optionDiv
  )
}

const Selector = (props: MultiSelectProps) => {
  const {
    isMulti,
    isLoading,
    onChange,
    options,
    value,
    errors,
    touched,
    name,
    placeholder,
    extraProps,
    isUploadClips,
    disabledOptionMessage,
    onFocus,
  } = props
  const customStyles = useMemo(
    () => ({
      //@ts-ignore
      container: (base) => ({
        ...base,
        ':focus': {
          border: 'none',
          outline: 'none',
          borderRadius: '10px',
        },
        ':active': {
          border: 'none',
          outline: 'none',
          borderRadius: '10px',
        },
        width: '100%',
        borderRadius: '10px',
        cursor: 'pointer',
      }),
      //@ts-ignore
      menu: (provided) => ({
        ...provided,
        ':focus': {
          border: 'none',
          // outline:'none',
        },
        background: '#282828',
        zIndex: 100000,
        borderRadius: '10px',
        overflow: 'hidden',
      }),
      //@ts-ignore
      placeholder: (base) => ({
        ...base,
        color: '#a0a0a0',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '90%',
      }),
      //@ts-ignore
      option: (base, state) => {
        const AllOptions = Array.isArray(state.options) ? state.options : []
        const lastOption = AllOptions[AllOptions.length - 1] || {}
        return {
          ...base,
          cursor: 'pointer',
          ':active': {
            background: '#474747',
          },
          background:
            state.isFocused | state.isSelected ? '#212121' : 'inherit',
          borderBottom:
            lastOption && lastOption?.value && lastOption?.value === state.value
              ? 'none'
              : '1px solid #3A3A3A',

          opacity: state.isDisabled ? 0.5 : 1,
          minHeight: '48px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '16.8px',
          textAlign: 'left',
          color: '#ffffff',
        }
      },
      //@ts-ignore
      control: (base) => {
        return {
          ...base,
          ':hover': {
            // borderRadius: '8px',
            border:
              errors[name] && touched[name] ? '1px solid #CA3838' : 'none',
          },
          borderRadius: '10px',
          background: '#282828',
          boxShadow: 'none',
          border: errors[name] && touched[name] ? '1px solid #CA3838' : 'none',
          outline: 'none',
          cursor: 'pointer',

          gap: '8px',
          margin: '0',
          minHeight: '48px',

          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '16.8px',
          textAlign: 'left',
          color: '#ffffff',
        }
      },
      //@ts-ignore
      menuList: (base) => {
        return {
          ...base,
          // background:
          //   state.isFocused | state.isSelected
          //     ? 'rgba(24, 24, 24, 0.8)'
          //     : 'inherit',
        }
      },
      //@ts-ignore
      multiValueLabel: (base) => ({
        ...base,
        color: '#ffffff',
      }),
      //@ts-ignore
      multiValueRemove: (base) => {
        return {
          ...base,
          ':hover': {
            backgroundColor: 'transparent',
          },
          // backgroundColor: '#585858',
          marginLeft: '5px',
          color: '#ffffff',
          height: '16px',
          width: '16px',
          alignSelf: 'center',
        }
      },
      //@ts-ignore
      valueContainer: (base) => ({
        ...base,
        background: 'transparent',
        color: '#ffffff',
        fontSize: '14px',
        padding: '0 16px',
      }),
      //@ts-ignore
      multiValue: (base) => ({
        ...base,
        color: '#a0a0a0',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '8px',
        paddingBottom: '8px',
        background: '#3A3A3A',
        // marginLeft: '10px',
        // minWidth: '120px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        whiteSpace: 'nowrap',
        borderRadius: '12px',
        fontSize: '12px',
      }),
      //@ts-ignore
      multiValueLabel: (base, props) => {
        return {
          ...base,
          padding: 0,
          color: 'white',
          fontSize: '12px',
          fontWeight: '400',
          whiteSpace: 'nowrap',
        }
      },
      //@ts-ignore
      multiValueRemove(base, props) {
        return {
          ...base,
          ':hover': {},
          height: '16px',
          width: '16px',
          color: 'white',
          padding: 0,
          margin: 0,
        }
      },
      //@ts-ignore
      indicatorSeparator: (base, state) => ({
        ...base,
        backgroundColor: '#a0a0a0',
        opacity: 0,
        display: state.isDisabled ? 'none' : 'block',
      }),
      //@ts-ignore
      dropdownIndicator: (base, state) => ({
        ...base,
        display: state.isDisabled ? 'none' : 'block',
      }),
      //@ts-ignore
      singleValue: (base) => {
        return {
          ...base,
          color: 'white',
          fontWeight: '400',
          width: 'auto',
        }
      },
      //@ts-ignore
      input: (base) => {
        return {
          ...base,
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '400',
        }
      },
    }),
    [errors[name], touched[name]]
  )

  const updatedValue = useMemo(() => {
    if (isMulti && isUploadClips) {
      return value?.map((v: any) => find(options, { label: v }))
    } else if (isMulti) {
      return value?.map((v: any) => find(options, { value: v }))
    } else {
      const val = value?.uid ? value.uid : value
      return find(options, { value: val })
    }
  }, [value, options])

  let inputValue = ''

  return (
    <Flex
      bg={[
        extraProps?.isReadOnly ? 'transparent' : 'brand.loco-grey-70',
        'brand.loco-grey-70',
      ]}
      rounded="8px"
    >
      <Select
        isSearchable={isWebViewBuild ? false : true}
        {...props}
        name={name}
        hideSelectedOptions={false}
        components={{
          ...animatedComponents,
          DropdownIndicator: (props) => {
            return (
              <components.DropdownIndicator {...props}>
                <Icon name="downArrow" size="20px" />
              </components.DropdownIndicator>
            )
          },
          Option: (props) => (
            <OptionWithTooltip
              optionProps={props}
              disabledOptionMessage={disabledOptionMessage}
            />
          ),
          SingleValue: (props?: any) => {
            const { t } = useTranslation()

            if (inputValue.trim().length > 0) return null

            return (
              <components.SingleValue {...props}>
                {t(props?.data?.label, {
                  defaultValue: props?.data?.label,
                }) || props?.data?.label}
              </components.SingleValue>
            )
          },
        }}
        isDisabled={extraProps?.isReadOnly}
        // classNamePrefix="react-select"
        isMulti={isMulti}
        isClearable={false}
        placeholder={placeholder || ''}
        closeMenuOnSelect={!isMulti}
        isLoading={isLoading}
        styles={customStyles}
        value={updatedValue}
        onChange={onChange}
        options={options}
        onFocus={onFocus}
        blurInputOnSelect={false}
        onInputChange={(inputVal) => (inputValue = inputVal)}
      />
    </Flex>
  )
}
export default Selector
