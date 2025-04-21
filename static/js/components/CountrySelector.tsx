import { Flex, Text } from '@chakra-ui/core'
import { find, set } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import Select, { components, OptionTypeBase, ValueType } from 'react-select'

import { countryFlagMapping } from './country-flag-mapping'
import CountryInput from './CountryInput'

interface MultiSelectProps {
  onChange?: (selectedOption: ValueType<OptionTypeBase, boolean>) => void
  value?: ValueType<OptionTypeBase, boolean> | any
  size?: string | string[]
  isMulti?: boolean
  isLoading?: boolean
  options: any[]
  errors: any
  name: string
  isDisable: boolean
  touched: any
  placeholder: string
  extraProps?: any
  defaultValue?: any
}

const CountrySelector = (props: MultiSelectProps) => {
  const selectRef = React.useRef<any>(null)
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
          // padding: '12px 16px',
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
          border: errors[name] && touched[name] ? '1px solid #CA3838' : 'none',
          borderRadius: '10px',
          background: '#282828',
          boxShadow: 'none',

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
          // borderRadius: '50%',
        }
      },
      //@ts-ignore
      valueContainer: (base) => ({
        ...base,
        background: 'transparent',
        color: '#ffffff',
        fontSize: '14px',
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
        maxWidth: '120px',
        borderRadius: '12px',
        fontSize: '12px',
      }),
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
        // opacity: 0.5,
        display: state.isDisabled ? 'none' : 'block',
      }),
      //@ts-ignore
      singleValue: (base) => {
        return {
          ...base,
          color: 'white',
          paddingLeft: '5px',
        }
      },
      //@ts-ignore
      input: (base) => {
        return {
          ...base,
          color: '#ffffff',
          fontSize: '14px',
        }
      },
    }),
    [errors[name], touched[name]]
  )

  const formatOptionLabel = ({ label }: any): JSX.Element => {
    return (
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{label}</Text>
      </Flex>
    )
  }

  const inputValue = ''

  const handleChange = (selectedOption: any) => {
    onChange?.(selectedOption)
  }

  const selectedValue = useMemo(() => {
    if (!options.length || !value) return null
    const newValue = find(options, { value })
    return newValue
  }, [options, value])

  return (
    <Flex
      bg={[extraProps?.isReadOnly ? 'transparent' : '#282828', '#282828']}
      rounded="12px"
    >
      <Select
        {...props}
        ref={selectRef}
        name={name}
        isDisabled={extraProps?.isReadOnly}
        isMulti={isMulti}
        placeholder={placeholder || ''}
        isLoading={isLoading}
        styles={customStyles}
        isClearable={true}
        isSearchable={true}
        value={selectedValue}
        onChange={handleChange}
        formatOptionLabel={formatOptionLabel}
        options={options}
        components={{
          Input: (props) => (
            <CountryInput
              {...props}
              deleteVal={() => {
                if (selectRef.current && selectRef.current.select.clearValue) {
                  selectRef.current.select.clearValue()
                  setTimeout(
                    () => document.getElementById('country-input')?.focus(),
                    0
                  )
                }
              }}
            />
          ),
          Option: IconOption,
          SingleValue: (props: any) => {
            if (inputValue.trim().length > 0) return null
            return (
              <div {...props} className="input-select">
                <div
                  className="input-select__single-value"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <AddIcon {...props} />
                  <span>{props.data.label}</span>
                </div>
              </div>
            )
          },
        }}
        inputId="country-input"
      />
    </Flex>
  )
}

const AddIcon = (props: any) => {
  const value = props.data.value
  const [country, setCountry] = React.useState<any>(null)

  useEffect(() => {
    const country = countryFlagMapping[value as keyof typeof countryFlagMapping]
    setCountry(country)
  }, [value])
  if (!country) return null

  return (
    <div
      style={{
        marginRight: '4px',
        width: '35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={`/static/images/flags/${country.flag}.svg`}
        alt={country.alt}
        height={'35px'}
        width={'35px'}
      />
    </div>
  )
}

const IconOption = (props: any) => (
  <components.Option {...props}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <AddIcon {...props} />
      {props.data.label}
    </div>
  </components.Option>
)

export default CountrySelector
