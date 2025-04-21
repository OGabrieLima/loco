/* eslint-disable no-undef */
export const GOOGLE_CLIENT_ID =
  '1079034827923-1it0pd4ae4njhv6vojgr6gte4tencvma.apps.googleusercontent.com'

export const TARGET_ENV = (process.env.REACT_APP_ENVIRONMENT || '') as
  | 'preprod-tx'
  | 'preprod'
  | 'staging'
  | 'stage1'
  | 'stage2'
  | 'dev'
  | ''
  | undefined

export const isPRODUCTION =
  process.env.REACT_APP_ENV === 'production' ? true : false

export const ivoryUrlv1 = isPRODUCTION
  ? 'https://ivory.loco.gg/v1'
  : 'https://dev-ivory.loco.gg/v1'
export const ivoryUrlv2 = isPRODUCTION
  ? 'https://ivory.loco.gg/v2'
  : 'https://dev-ivory.loco.gg/v2'
export const serverUrlv1 = isPRODUCTION
  ? 'https://api.getloconow.com/v1'
  : 'https://dev.getloconow.com/v1'
export const serverUrlv3 = isPRODUCTION
  ? 'https://api.getloconow.com/v3'
  : 'https://dev.getloconow.com/v3'

export const serverUrlv4 = isPRODUCTION
  ? 'https://api.getloconow.com/v4'
  : 'https://dev.getloconow.com/v4'

export const ivoryBaseUrl = isPRODUCTION
  ? 'https://ivory.loco.gg'
  : 'https://dev-ivory.loco.gg'

export const yenUrlv1 = isPRODUCTION
  ? 'https://yen.getloconow.com/v1'
  : 'https://dev-yen.getloconow.com/v1'
export const yenUrlv2 = isPRODUCTION
  ? 'https://yen.getloconow.com/v2'
  : 'https://dev-yen.getloconow.com/v2'
export const paymentsUrlv3 = isPRODUCTION
  ? 'https://payments.getloconow.com/api/v3'
  : 'https://dev-payments.getloconow.com/api/v3'
export const yenClientID = isPRODUCTION
  ? 'PHRFPyfdoyzn5gflkukGsOTPyWBWpBFi'
  : 'SQUKQEakx1e4cmMLDqqlMk2Zm8BB0cxb'
export const yenCleintSecret = isPRODUCTION
  ? 'mfrAv2fc7uEoiM2Xlr06vhaHLWB0pnsL'
  : 'PSd9zd1eC7tYdJzQ8IvX6s54UteClQ3N'
export const clientID = isPRODUCTION
  ? 'Lo3r2P6oFQPXAeuddoRSB4HbXDZI1WRS8pnMzRtX'
  : 'ZVpPXpShMbFK3v4ASzLRgbQwh3eqDACmu1PIv0Y7'
export const clientSecret = isPRODUCTION
  ? 'ue8mcpwC9ofEYDPjovO5lzr1N2E16ejH0zwzYsqABxAEIZgGtqx9NLNfQEjkZcz7Dor0NfXhIDyiXJ6kdQtNhHr9V0P9zX0xeKfzZasRSdRkRZxqUdnU5wnmqc9qIELA'
  : 'yAL7wxNpUyTS5mqFFdlJPqlmrtYpqwkmCZhUcLpW3ARt6OQXVnENmAU31h1GENC2fZASb7y280dAh7iZ3qqbAZSBJu9qXBAdg3QDqTBnR5aCMh0lfMJmxbv6Xzauvlgo'
export const sentryDsn =
  process.env.REACT_APP_BUILD === 'webview'
    ? 'https://a05516603d094d65a62acb976bdb8b8c@o1100646.ingest.sentry.io/6508896'
    : 'https://7f374ba249554cc38c49d13ba95fc05b@o1100646.ingest.sentry.io/6508890'
export const environment = isPRODUCTION
  ? 'production'
  : process.env.REACT_APP_DEPLOYMENT_ENVIRONMENT
export const mqttUsername = isPRODUCTION
  ? 'N7AcYWuBXdSsADEm8aF6JrFpnOm5Pnv6'
  : 'cRqlmWsryumZvmO3bs0Nc2DMiyv0t9L1'
export const mqttPassword = isPRODUCTION
  ? 'xWinLUb8TWry2kvxc79RkD1fiiJsolrM'
  : 'tbSSYbQP8LkaCcANOf628f3Vlkdvdym5'
export const mqttPort = isPRODUCTION ? 443 : 443
export const mqttUrl = isPRODUCTION
  ? 'wss://cf-mqtt-ws.getloconow.com'
  : 'wss://dev-cf-mqtt-ws.getloconow.com'
export const isWebViewBuild = process.env.REACT_APP_BUILD === 'webview'
export const amplitude_API_KEY = isPRODUCTION
  ? 'a4d5600e65147238fa65443a42bf485a'
  : '7319b6f48b337c5ee24b6e19b829adac'
export const EXPERIMENT_DEPLOYMENT_KEY = isPRODUCTION
  ? 'client-xSY6yBEcXV1c1jsROyyQr7wNL0Wcacjs'
  : 'client-VN9PdC9f1kTfdqHarOXmtKYAevkXjxWe'

export const CLEVERTAP_ACCOUNT_ID = isPRODUCTION
  ? 'R95-899-9R5Z'
  : 'TEST-86Z-KW7-5K5Z'
export const moonUrlv2 = isPRODUCTION
  ? 'https://moon.getloconow.com/v2'
  : 'https://devmoon.getloconow.com/v2'

export const storeUrlv1 = isPRODUCTION
  ? 'https://loco-store.loco.gg/v1'
  : 'https://dev-store.loco.gg/v1'

export const storeUrlv2 = isPRODUCTION
  ? 'https://loco-store.loco.gg/v2'
  : 'https://dev-store.loco.gg/v2'

export const strapiUrl = isPRODUCTION
  ? 'https://strapicms.getloconow.com/api'
  : 'https://dev-strapicms.getloconow.com/api'

export const StreamerDetailsApiForGiveWay =
  'https://api.steinhq.com/v1/storages/5f11eaa95d3cdc44fcd7d1a7/sheet1'

export const UserDetailsForGiveWay =
  'https://api.steinhq.com/v1/storages/5f11eaa95d3cdc44fcd7d1a7/sheet2'

export const chatUrlv2 = isPRODUCTION
  ? 'https://chat.getloconow.com/v2'
  : 'https://dev-chat-api.getloconow.com/v2'

export const drmUrlv1 = isPRODUCTION
  ? 'https://drm.loco.gg/v1'
  : 'https://dev-ivory.loco.gg/v1'

export const taskServerUrl = isPRODUCTION
  ? 'https://task.getloconow.com'
  : 'https://dev-task.getloconow.com'

export const ANNOUNCEMENTS_LOCO_URL = 'https://announcements.loco.gg'
export const DASHBOARD_WEB_URL = isPRODUCTION
  ? TARGET_ENV === 'preprod-tx'
    ? 'https://dashboard-preprod-tx.loco.gg'
    : TARGET_ENV === 'preprod'
    ? 'https://dashboard-preprod.loco.com'
    : TARGET_ENV === 'staging' ||
      TARGET_ENV === 'stage1' ||
      TARGET_ENV === 'stage2'
    ? 'https://dashboard-staging.loco.gg'
    : TARGET_ENV === 'dev'
    ? 'https://dashboard-dev.loco.gg'
    : 'https://dashboard.loco.com' // prod
  : 'https://dashboard-dev.loco.gg'

export const DASHBOARD_WEBVIEW_URL = isPRODUCTION
  ? TARGET_ENV === 'preprod-tx'
    ? 'https://webview-dashboard-preprod-tx.loco.gg'
    : TARGET_ENV === 'preprod'
    ? 'https://webview-dashboard-preprod.loco.com'
    : TARGET_ENV === 'staging' ||
      TARGET_ENV === 'stage1' ||
      TARGET_ENV === 'stage2'
    ? 'https://webview-dashboard-staging.loco.gg'
    : TARGET_ENV === 'dev'
    ? 'https://webview-dashboard-dev.loco.gg'
    : 'https://webview-dashboard.loco.com' // prod
  : 'https://webview-dashboard-dev.loco.gg'

export const LOCO_WEB_URL = isPRODUCTION
  ? TARGET_ENV === 'preprod-tx'
    ? 'https://preprod-tx.loco.gg'
    : TARGET_ENV === 'preprod'
    ? 'https://preprod.loco.com'
    : TARGET_ENV === 'staging' ||
      TARGET_ENV === 'stage1' ||
      TARGET_ENV === 'stage2'
    ? 'https://stage1.loco.gg'
    : TARGET_ENV === 'dev'
    ? 'https://dev.loco.gg'
    : 'https://loco.com' // prod
  : 'https://dev.loco.gg'

export const LOCO_WEBVIEW_URL = isPRODUCTION
  ? TARGET_ENV === 'preprod-tx'
    ? 'https://webview-preprod-tx.loco.gg'
    : TARGET_ENV === 'preprod'
    ? 'https://webview-preprod.loco.com'
    : TARGET_ENV === 'staging' ||
      TARGET_ENV === 'stage1' ||
      TARGET_ENV === 'stage2'
    ? 'https://webview-staging.loco.gg'
    : TARGET_ENV === 'dev'
    ? 'https://webview-dev.loco.gg'
    : 'https://webview.loco.com' // prod
  : 'https://webview-dev.loco.gg'

export const LOCO_API_URL = LOCO_WEB_URL + '/api'

// Testing means, we can enable some features only on these env
export const IS_TESTING_TARGET_ENABLED =
  // preprod is for regression, So we can not have test features there
  TARGET_ENV == 'preprod-tx' ||
  TARGET_ENV === 'stage1' ||
  TARGET_ENV === 'stage2' ||
  TARGET_ENV === 'staging' ||
  TARGET_ENV === 'dev'

export const isLanguageSelectionEnabled = () => {
  // enabled for all
  return true || TARGET_ENV === 'preprod-tx'
}

export const ID_WALL_URL = 'https://api-v3.idwall.co'

export const ID_WALL_API_AUTHORISATION = '3d658dd8-d434-42b7-93c9-393ba41c1b33'

export const IDW_SDK_SCRIPT_URL = 'https://sdkweb-lib.idwall.co/index.js'

export const IDW_ACCESS_TOKEN =
  'U2FsdGVkX1/xCftbN0RVyuhuBSRTxiW8VXxstO2lJDwh7C6qig=='
