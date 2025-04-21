import './index.css'
import 'ui/dist/index.css'
import './i18n/i18n'

import * as Sentry from '@sentry/react'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './app/Store'
import { isWebViewBuild, sentryDsn, TARGET_ENV } from './constent'
import history from './history'
import * as serviceWorker from './serviceWorker'
import { eventActions } from './utils/Amplitude'
import { executeHandlers } from './utils/manageTokens'

const isFeatureTestingEnvironment =
  TARGET_ENV === 'preprod' ||
  TARGET_ENV === 'preprod-tx' ||
  TARGET_ENV === 'staging' ||
  TARGET_ENV === 'stage1' ||
  TARGET_ENV === 'stage2' ||
  TARGET_ENV === 'dev'

if (process.env.NODE_ENV !== 'development' && !isFeatureTestingEnvironment) {
  Sentry.init({
    sampleRate: 0.15, // this is sent 15% of error
    tracesSampleRate: 0.01, // this will sent 1% of transcation
    replaysSessionSampleRate: 0.001, // Adjust upto 01% session replay sampling rate
    replaysOnErrorSampleRate: 0.005, // Keep error session replays at 0.5% for critical debugging
    environment: process.env.NODE_ENV,
    integrations: [
      Sentry.reactRouterV5BrowserTracingIntegration({ history }),
      Sentry.replayIntegration(),
      Sentry.browserTracingIntegration(),
    ],
    dsn: sentryDsn,
    initialScope: {
      tags: {
        // Only for Sentry, Not Amplitude
        user_platform: isWebViewBuild ? 'webview_dashboard' : 'web_dashboard',
      },
    },
    denyUrls: [
      /extensions\//i, // Ignore browser extension errors
      /^chrome:\/\//i, // Ignore Chrome internal errors
    ],
    attachStacktrace: true, // Attach stack traces for better debugging
    debug: false, // Turn off Sentry debug mode for production
  })
}
eventActions.initAmplitude()

// ReactDOM.render(<App />, document.getElementById('root'));
const render = () => {
  executeHandlers()

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const App = require('./app/App').default

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

render()

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/App', render)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
