import { Action, configureStore } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'

import appReducer, { RootState } from './RootReducer'

//@ts-ignore
// export const apiMiddleware = ({ dispatch, getState }) => next => action => {
// };

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development' ? true : false,
  // middleware: [apiMiddleware],
})

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./RootReducer', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const newRootReducer = require('./RootReducer').default
    store.replaceReducer(newRootReducer)
  })
}
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export type AppDispatch = typeof store.dispatch

export default store
