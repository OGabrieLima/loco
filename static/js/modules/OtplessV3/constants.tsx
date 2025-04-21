import { isPRODUCTION } from '@src/constent'

export const OTPLESS_SCRIPT_ID = 'otpless-sdk'
export const OTPLESS_SCRIPT_URL = 'https://otpless.com/v3/headless.js'

export const OTPLESS_APP_ID = isPRODUCTION
  ? 'D57209V1ED7RTO8FBR3N'
  : 'azvhushyjn3rrhnndqm8'
// 'azvhushyjn3rrhnndqm8' < First App ID, < dev AppId
// 'D57209V1ED7RTO8FBR3N' < loco web new < prod appId
export const OTP_LENGTH = 4

export const OTP_ENPIRY_TIME = isPRODUCTION ? 60 : 10

export const MAX_OTP_RETRIES = 9999 // this handled by OTPLESS Team
