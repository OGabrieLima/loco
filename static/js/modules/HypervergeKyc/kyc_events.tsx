import store from '@app/Store'
import { streamerDetailsInterface } from '@context/ApiConnector/types'
import { eventActions, eventConstants, eventPropsTypes } from '@utils/Amplitude'

import { IKycStatus } from './KycSlice'

interface IProps {
  user: streamerDetailsInterface | null
  source: string
  isButtonClicked?: boolean
  kyc_status?: IKycStatus
  current_beans?: any
  isKycEligible?: boolean
  bank_name?: string
  verfication_status?: string
  reason?: string
}

export const kycPopupDismiss = ({
  isButtonClicked,
}: {
  isButtonClicked?: boolean
}) => {
  const source = store.getState().app.previousVisit
  const user = store.getState().login.me

  const eventProperties: eventPropsTypes.close_kyc_popup = {
    platform: eventConstants.platform,
    source_name: source,
    streamer_id: user?.user_uid,
    streamer_name: user?.username,
    streamer_type: user?.user_type,
    ctr_clicked: isButtonClicked,
  }
  eventActions.sendAmplitudeData(
    eventConstants.close_kyc_popup,
    eventProperties
  )
}

export const visitStreamerWallet = ({
  user,
  source,
  kyc_status,
  current_beans,
  isKycEligible,
}: IProps) => {
  // TODO: FIXME
  const eventProperties: eventPropsTypes.visit_streamer_wallet = {
    platform: eventConstants.platform,
    source_name: source,
    streamer_id: user?.user_uid,
    streamer_name: user?.username,
    streamer_full_name: user?.full_name,
    streamer_type: user?.user_type,
    current_beans: current_beans,
    kyc_status: isKycEligible
      ? kyc_status === 'KYC_COMPLETED'
        ? 'COMPLETED'
        : kyc_status === 'KYC_PENDING'
        ? 'PENDING'
        : 'NOT_INITIATED'
      : 'NOT_ELIGIBLE',
  }
  eventActions.sendAmplitudeData(
    eventConstants.visit_streamer_wallet,
    eventProperties
  )
}

export const visitKycPage = ({
  user,
  source,
  kyc_status,
  current_beans,
  isKycEligible,
}: IProps) => {
  // TODO: FIXME
  const eventProperties: eventPropsTypes.visit_kyc = {
    platform: eventConstants.platform,
    source_name: source,
    streamer_id: user?.user_uid,
    streamer_name: user?.username,
    streamer_type: user?.user_type,
    current_beans: current_beans,
    kyc_status: isKycEligible
      ? kyc_status === 'KYC_COMPLETED'
        ? 'COMPLETED'
        : kyc_status === 'KYC_PENDING'
        ? 'PENDING'
        : 'NOT_INITIATED'
      : 'NOT_ELIGIBLE',
  }
  eventActions.sendAmplitudeData(eventConstants.visit_kyc, eventProperties)
}

export const bankAccountEvent = ({
  kyc_status,
  isKycEligible,
  bank_name,
  verfication_status,
  reason,
}: {
  kyc_status?: string
  isKycEligible?: boolean
  bank_name?: string
  verfication_status?: string
  reason?: string
}) => {
  const source = store.getState().app.previousVisit
  const user = store.getState().login.me
  const current_beans = store.getState().analytics.beans
  kyc_status = kyc_status || store.getState().hypervergeKyc.kyc_status
  isKycEligible =
    typeof isKycEligible === 'boolean'
      ? isKycEligible
      : !!store.getState().hypervergeKyc.panDetail ||
        store.getState().hypervergeKyc.showKycPrompt

  const eventProperties: eventPropsTypes.bank_acc_verification = {
    platform: eventConstants.platform,
    source_name: source,
    streamer_id: user?.user_uid,
    streamer_name: user?.username,
    streamer_full_name: user?.full_name,
    streamer_type: user?.user_type,
    current_beans: current_beans,
    bank_name: bank_name,
    verfication_status: verfication_status,
    reason: reason,
    kyc_status: isKycEligible
      ? kyc_status === 'KYC_COMPLETED'
        ? 'COMPLETED'
        : kyc_status === 'KYC_PENDING'
        ? 'PENDING'
        : 'NOT_INITIATED'
      : 'NOT_ELIGIBLE',
  }

  eventActions.sendAmplitudeData(
    eventConstants.dashboard_kyc_bank_acc_verify,
    eventProperties
  )
}

export const PanAccountEvent = ({
  kyc_status,
  isKycEligible,
  verfication_status,
  hv_error,
  mode,
  reason,
}: {
  kyc_status?: string
  isKycEligible?: boolean
  verfication_status?: string
  hv_error?: any
  mode?: string
  reason?: string
}) => {
  const source = store.getState().app.previousVisit
  const user = store.getState().login.me
  const current_beans = store.getState().analytics.beans
  kyc_status = kyc_status || store.getState().hypervergeKyc.kyc_status
  isKycEligible =
    typeof isKycEligible === 'boolean'
      ? isKycEligible
      : !!store.getState().hypervergeKyc.panDetail ||
        store.getState().hypervergeKyc.showKycPrompt

  const eventProperties: eventPropsTypes.pan_verification = {
    platform: eventConstants.platform,
    source_name: source,
    streamer_id: user?.user_uid,
    streamer_name: user?.username,
    streamer_type: user?.user_type,
    current_beans: current_beans,
    verfication_status: verfication_status,
    mode: mode,
    hv_error: hv_error ? JSON.stringify(hv_error) : undefined,
    reason: reason,
    kyc_status: isKycEligible
      ? kyc_status === 'KYC_COMPLETED'
        ? 'COMPLETED'
        : kyc_status === 'KYC_PENDING'
        ? 'PENDING'
        : 'NOT_INITIATED'
      : 'NOT_ELIGIBLE',
  }

  eventActions.sendAmplitudeData(
    eventConstants.pan_verification,
    eventProperties
  )
}

export const PanLivenessEvent = ({
  kyc_status,
  isKycEligible,
  verfication_status,
  liveness_score,
  hv_error,
  reason,
}: {
  kyc_status?: string
  isKycEligible?: boolean
  verfication_status?: string
  liveness_score?: string
  hv_error?: any
  reason?: string
}) => {
  const source = store.getState().app.previousVisit
  const user = store.getState().login.me
  const current_beans = store.getState().analytics.beans
  kyc_status = kyc_status || store.getState().hypervergeKyc.kyc_status
  isKycEligible =
    typeof isKycEligible === 'boolean'
      ? isKycEligible
      : !!store.getState().hypervergeKyc.panDetail ||
        store.getState().hypervergeKyc.showKycPrompt

  const eventProperties: eventPropsTypes.liveness_verification = {
    platform: eventConstants.platform,
    source_name: source,
    streamer_id: user?.user_uid,
    streamer_name: user?.username,
    streamer_type: user?.user_type,
    current_beans: current_beans,
    liveness_score: liveness_score,
    hv_error: hv_error ? JSON.stringify(hv_error) : undefined,
    verfication_status: verfication_status,
    reason: reason,
    kyc_status: isKycEligible
      ? kyc_status === 'KYC_COMPLETED'
        ? 'COMPLETED'
        : kyc_status === 'KYC_PENDING'
        ? 'PENDING'
        : 'NOT_INITIATED'
      : 'NOT_ELIGIBLE',
  }

  eventActions.sendAmplitudeData(
    eventConstants.liveness_verification,
    eventProperties
  )
}

export const PanNameMatchEvent = ({
  kyc_status,
  isKycEligible,
  verfication_status,
  reason,
}: {
  kyc_status?: string
  isKycEligible?: boolean
  verfication_status?: string
  reason?: string
}) => {
  const source = store.getState().app.previousVisit
  const user = store.getState().login.me
  const current_beans = store.getState().analytics.beans
  kyc_status = kyc_status || store.getState().hypervergeKyc.kyc_status
  isKycEligible =
    typeof isKycEligible === 'boolean'
      ? isKycEligible
      : !!store.getState().hypervergeKyc.panDetail ||
        store.getState().hypervergeKyc.showKycPrompt

  const eventProperties: eventPropsTypes.kyc_completed = {
    platform: eventConstants.platform,
    source_name: source,
    streamer_id: user?.user_uid,
    streamer_name: user?.username,
    streamer_type: user?.user_type,
    current_beans: current_beans,
    verfication_status: verfication_status,
    reason: reason,
    kyc_status: isKycEligible
      ? kyc_status === 'KYC_COMPLETED'
        ? 'COMPLETED'
        : kyc_status === 'KYC_PENDING'
        ? 'PENDING'
        : 'NOT_INITIATED'
      : 'NOT_ELIGIBLE',
  }

  eventActions.sendAmplitudeData(eventConstants.kyc_completed, eventProperties)
}
