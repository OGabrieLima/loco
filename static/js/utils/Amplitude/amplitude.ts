import * as amplitude from '@amplitude/analytics-browser'
import { LogLevel } from '@amplitude/analytics-types'
import { userAgentEnrichmentPlugin } from '@amplitude/plugin-user-agent-enrichment-browser'
import { getUserCategoryFromUserType } from '@src/constants/userType'
import isMobile from 'is-mobile'

import { amplitude_API_KEY, isWebViewBuild } from '../../constent'
import { platform } from './constants'

const DEFAULT_PARAMS = {
  logLevel:
    process.env.NEXT_PUBLIC_APP_STAGE === 'production'
      ? LogLevel.None
      : LogLevel.Warn,
  cookieOptions: { expiration: 365 }, // Expires in 1 year (would fallback to 10 years by default, which isn't GDPR compliant),
  attribution: { disabled: true },
  defaultTracking: {
    formInteractions: false,
    pageViews: false,
    sessions: false,
  },
}

export const initAmplitude = (): void => {
  const uaPlugin = userAgentEnrichmentPlugin({
    osName: true,
    osVersion: true,
    deviceManufacturer: true,
    deviceModel: true,
  })
  amplitude.add(uaPlugin)
  amplitude.init(amplitude_API_KEY, undefined, DEFAULT_PARAMS)
}

export const resetAmplitudeSession = (): Promise<void> => {
  // Waiting for some time So that all the events will linked with previous user fired
  return new Promise((res) => {
    return setTimeout(() => {
      amplitude.reset()
      // Assign new session ID, so that all events bind to this session only
      amplitude.setSessionId(Date.now())
      res()
    }, 100)
  })
}

export const setAmplitudeUserId = (userId?: string | null): void => {
  amplitude.setUserId(userId || undefined)
}

export const setAmplitudeUserProperties = (properties: {
  [key: string]: any
}): void => {
  if (!properties) {
    return
  }
  const identify = new amplitude.Identify()
  const Properties = Object.entries(properties)
  for (const data of Properties) {
    const [key, value] = data
    identify.set(key, value)
  }
  // @ts-ignore
  amplitude?.identify(identify)
}

export const AddAmplitudeUserProperties = (properties: {
  [key: string]: any
}): void => {
  if (!properties) {
    return
  }
  const identify = new amplitude.Identify()
  const Properties = Object.entries(properties)
  for (const data of Properties) {
    const [key, value] = data
    if (value === false || value === '') {
      identify.unset(key)
    } else {
      identify.set(key, value)
    }
  }
  // @ts-ignore
  amplitude?.identify(identify)
}

export const sendAmplitudeData = (
  eventType: string,
  eventProperties: any
): void => {
  const updatedEventProperties = {
    platform: platform,
    ...eventProperties,
    user_platform: isWebViewBuild ? 'webview_dashboard' : 'web_dashboard', // added user_platform for consistency
    web_device_type: isMobile()
      ? isWebViewBuild
        ? 'webview'
        : 'mobile_browser'
      : 'desktop',
  }
  if ('streamer_type' in updatedEventProperties) {
    updatedEventProperties['streamer_category'] = getUserCategoryFromUserType(
      updatedEventProperties.streamer_type
    )
  }
  amplitude.track(eventType, updatedEventProperties)
}
