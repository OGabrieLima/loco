import * as Sentry from '@sentry/react'

import { isWebViewBuild } from '../constent'

export const handleEventCapture = (
  url: string,
  error:
    | string
    | Error
    | {
        statusCode?: number
        message?: string
      },
  errorCode?: number
) => {
  const errorMessage =
    (error instanceof Error
      ? error?.message
      : typeof error === 'string'
      ? error
      : error.message) || 'Something Went Wrong'

  errorCode =
    errorCode ||
    (error instanceof Error
      ? // @ts-ignore
        error?.code
      : typeof error === 'string'
      ? errorCode
      : error.statusCode) ||
    errorCode

  Sentry.withScope(function(scope) {
    scope.setTag('apiurl', url)
    scope.setTag('errorType', 'Api Error')
    scope.setFingerprint([
      isWebViewBuild ? 'anyone-can-stream-dashboard' : 'oraganic-dashboard',
      url,
      errorMessage,
      errorCode ? errorCode.toString() : '000',
    ])
    if (errorCode) {
      Sentry.captureException({
        api: url,
        errorCode: errorCode,
        errorMessage: errorMessage,
      })
    } else {
      Sentry.captureException({ api: url, errorMessage: errorMessage })
    }
  })
}
