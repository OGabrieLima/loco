import { isWebViewBuild } from '../../constent'
//First time setup events
export const visit_streamer_platform = 'visit_streamer_platform'
export const visit_set_default_info = 'visit_set_default_info'
export const set_default_info = 'set_default_info'
export const stream_key_details_popup = 'stream_key_details_popup'
//Regular streaming flow events
export const confirm_go_live = 'confirm_go_live'
//stream details config events
export const visit_live_stream_defaults = 'visit_live_stream_defaults'
export const visit_stream_key_preference = 'visit_stream_key_preference'
export const show_stream_key = 'show_stream_key'
export const reset_stream_key_success = 'reset_stream_key_success'
export const reset_stream_key_dismissed = 'reset_stream_key_dismissed'
//live stream manager events
export const visit_live_stream_manager = 'visit_live_stream_manager'
export const end_stream = 'end_stream'
export const visit_edit_stream_info = 'visit_edit_stream_info'
export const streamer_edit_stream_info = 'streamer_edit_stream_info'
export const streamer_share_stream = 'streamer_share_stream'
export const edit_stream = 'edit_stream'
export const streamer_chat_send = 'streamer_chat_send'
export const streamer_block = 'streamer_block'
export const streamer_thankyou_msg = 'streamer_thankyou_msg'
//page visiting events
export const visit_analytics = 'visit_analytics'
export const visit_videos = 'visit_videos'
export const visit_upload_video = 'visit_upload_video'
export const visit_profile = 'visit_profile'
export const visit_beans_wallet = 'visit_beans_wallet'
export const visit_streamer_wallet = 'dashboard_visit_streamer_wallet'
export const visit_kyc = 'dashboard_visit_kyc'
// kyc events
export const close_kyc_popup = 'dashboard_kyc_popup_dismissed'
export const pan_verification = 'dashboard_kyc_pan_verify'
export const liveness_verification = 'dashboard_kyc_liveliness_verify'
export const kyc_completed = 'dashboard_kyc_namematch'

// V3 BR
export const dashboard_kyc_bank_acc_verify = 'dashboard_kyc_bank_acc_verify'
export const visit_beans_wallet_manage_acct = 'visit_beans_wallet_manage_acct'
export const kyc_started = 'kyc_started'
export const kyc_tax_residency_selected = 'kyc_tax_residency_selected'
export const kyc_details_filled = 'kyc_details_filled'
export const kyc_document_upload_begin = 'kyc_document_upload_begin'
export const kyc_tips_proceed = 'kyc_tips_proceed'
export const kyc_document_upload_complete = 'kyc_document_upload_complete'
export const kyc_bank_details = 'kyc_bank_details'
export const kyc_toast_modal_viewed = 'kyc_toast_modal_viewed'

//upload vod event
export const upload_video = 'upload_video'
export const dashboard_streamer_registration_frontend =
  'streamer_registration_frontend'
//logout event
export const dashboard_logout = 'dashboard_logout'
// chat preference event
export const streamer_chat_access_toggle = 'streamer_chat_access_toggle'
export const slow_chat_mode = 'slow_chat_mode'
//streamer leaderboard
export const visit_streamer_leaderboard = 'visit_streamer_leaderboard'
//streamer Profile
export const visit_streamer_profile_dashboard =
  'visit_streamer_profile_dashboard'
export const visit_streamer_profile_edit_dashboard =
  'visit_streamer_profile_edit_dashboard'
export const streamer_profile_edit_dashboard = 'streamer_profile_edit_dashboard'
//
export const visit_how_to_stream_dashboard = 'visit_how_to_stream_dashboard'
export const visit_faq_dashboard = 'visit_faq_dashboard'
export const visit_help_and_support_dashboard =
  'visit_help_and_support_dashboard'

export const visit_streamer_guideline_dashboard =
  'visit_streamer_guideline_dashboard'
export const visit_streamer_mela = 'visit_streamer_mela'

export const visit_streamer_academy = 'visit_streamer_academy'

export const platform = isWebViewBuild
  ? 'in_app'
  : /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  ? 'mobile_browser'
  : 'desktop_browser'

export const visit_question_form = 'visit_question_form'
export const visit_question_live = 'visit_question_live'
export const visit_question_closed = 'visit_question_closed'
export const publish_question = 'publish_question'
export const publish_question_on_hold = 'publish_question_on_hold'
export const end_question = 'end_question'
//lookback 2020

export const streamer_lookback_preview = 'streamer_lookback_preview'
export const streamer_lookback_download = 'streamer_lookback_download'

export const confirm_giveway_winner = 'confirm_giveway_winner'

export const reject_giveaway_winner = 'reject_giveaway_winner'

// notification

export const visit_notification_settings = 'visit_notification_settings'
export const whatsapp_opt_in_prompt = 'whatsapp_opt_in_prompt'
export const email_opt_in_prompt = 'email_opt_in_prompt'
export const whatsapp_notification_toggle = 'wa_toggle'
export const email_notification_toggle = 'email_toggle'
export const link_phone_number = 'link_phone_number'

// new feature pop up
export const new_feature_pop_up_dismissed = 'New_feature_pop_up_dismissed'

//apply leaderboard
export const apply_leaderboard = 'apply_leaderboard'

//visit viewer leaderboard
export const visit_viewer_leaderboard = 'visit_viewer_leaderboard'

//stream health
export const stream_health_prompt_open = 'Stream_health_prompt_open'

export const visit_streamer_performance = 'visit_streamer_performance'
//visit whats new dashboard
export const visit_whatsnew_dashboard = 'visit_whatsnew_dashboard'

//visit lookback message dashboard
export const visit_Lookback_message_board = 'visit_Lookback_message_board'

//visit lookback update gratitude message
export const lookback_update_gratitude_message =
  'lookback_update_gratitude_message'

//change language toggle button
export const change_language_dashboard = 'change_language_dashboard'

//clips events
export const visit_clips_dashboard = 'visit_clips_upload_dashboard'
export const click_upload_button = 'click_clips_upload_button_dashboard'
export const clips_upload_complete = 'clips_upload_complete_dashboard'
export const retry_clips_upload = 'retry_clips_upload_dashboard'
export const delete_clips = 'delete_clips_dashboard'

export const dashboard_login_event = 'login'
export const dashboard_get_otp_event = 'get_otp' // user tries to get OTP
export const dashboard_linking_event = 'link_2fa'

// Signin/google/otpless/otp events

// export const dashboard_login_whatsapp = 'dashboard_login_whatsapp' Migrated

// export const dashboard_login_enter_phone = 'dashboard_login_enter_phone' // Removed
// export const dashboard_login_otp = 'dashboard_login_otp' // migrated

// export const dashboard_login_google = 'dashboard_login_google' // Migrated

// export const dashboard_link_google = 'dashboard_link_google' // Migrated
// export const dashboard_link_phone_number = 'dashboard_link_phone_number' // Migrated // link by otp/whatsapp

// upload vod events
export const visit_upload_videos_dashboard = 'visit_upload_videos_dashboard'
export const click_upload_videos_button_dashboard =
  'click_upload_videos_button_dashboard'
export const upload_video_complete_dashboard = 'upload_video_complete_dashboard'
export const edit_vod_dashboard = 'edit_vod_dashboard'
export const delete_vod_dashboard = 'delete_vod_dashboard'

export const share_vod_dashboard = 'share_vod_dashboard'

//visit dashboard banner event
export const visit_dashboard_banner = 'visit_dashboard_banner'

//vip leaderboard events
export const dashboard_visit_vip_leaderboard = 'dashboard_visit_vip_leaderboard'
export const dashboard_vip_leaderboard_change_date =
  'dashboard_vip_leaderboard_change_date'

export const visit_tab_my_sticker = 'visit_tab_my_sticker'

export const streamer_sticker_upload = 'streamer_sticker_upload'
export const streamer_sticker_edit = 'streamer_sticker_edit'
export const language_selector_clicked = 'language_selector_clicked'
export const language_change_client = 'language_change_client'
export const streamer_profile_setup_visit = 'streamer_profile_setup_visit'
export const streamer_profile_setup_complete = 'streamer_profile_setup_complete'

// Creator Monetisation
export const visit_monetization_dashboard = 'visit_monetization_dashboard'
export const monetization_tnc_accepted = 'monetization_tnc_accepted'
export const visit_monetization_communication_centre =
  'visit_monetization_communication_centre'
export const visit_monetization_overview = 'visit_monetization_overview'
export const monetization_opt_in_clicked = 'monetization_opt_in_clicked'
export const kyc_error_toast = 'kyc_error_toast'
