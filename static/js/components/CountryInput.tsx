import React from 'react'
import { components } from 'react-select'

const CountryInput = (props: any) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // If input is empty and user presses backspace
    if (event.key === 'Backspace' && !props.value) {
      props.deleteVal()
    }
    // Call any existing onKeyDown provided by react-select
    if (props.onKeyDown) {
      props.onKeyDown(event)
    }
  }

  return <components.Input {...props} onKeyDown={handleKeyDown} />
}
export default CountryInput
