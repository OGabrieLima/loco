import * as Sentry from '@sentry/react'
import { Route } from 'react-router-dom'

// Create Custom Sentry Route component
const SentryRoute = Sentry.withSentryRouting(Route)

export default SentryRoute
