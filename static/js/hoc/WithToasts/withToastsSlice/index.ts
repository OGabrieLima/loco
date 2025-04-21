import { useToastOptions } from '@chakra-ui/core'
import { createSlice } from '@reduxjs/toolkit'

export interface initialStateInterface {
  toastOptions: useToastOptions
}

const initialState: initialStateInterface = {
  toastOptions: {
    position: 'top',
    title: '',
    description: '',
    status: 'success',
    duration: 2000,
    isClosable: false,
  },
}

const withToastsSlice = createSlice({
  name: 'withToasts',
  initialState,
  reducers: {
    setToasts(state, action) {
      state.toastOptions = { ...action.payload }
    },
  },
})

export const { setToasts } = withToastsSlice.actions
export default withToastsSlice.reducer
