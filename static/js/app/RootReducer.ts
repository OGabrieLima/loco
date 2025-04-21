import clips from '@modules/Clips/clipsSlice'
import community from '@modules/Community/Moderator/moderatorSlice'
import signup from '@modules/Signup/SignupSlice'
import stickers from '@modules/Stickers/stickerSlice'
import videos from '@modules/Videos/videoSlice'
import viewerLeaderboard from '@modules/ViewerLeaderboard/viewerLeaderboardSlice'
import vipLeaderboard from '@modules/VipLeaderboard/vipLeaderboardSlice'
import { combineReducers } from '@reduxjs/toolkit'

import lookback from '../components/yearLookback/yearLookbackSlice'
import withToasts from '../hoc/WithToasts/withToastsSlice'
import analytics from '../modules/Analytics/analyticsSlice'
import streamDetails from '../modules/DefaultStream/streamDetailsSlice'
import experimentReducer from '../modules/experiment/experimentSlice'
import hypervergeKyc from '../modules/HypervergeKyc/KycSlice'
import kycv3Details from '../modules/KycFlowV3/KycSlice'
import quizAndPoll from '../modules/LiveStreamManager/Components/QuizAndPoll/QuizAndPollSlice'
import liveStreamManager from '../modules/LiveStreamManager/LiveStreamManagerSlice'
import login from '../modules/Login/loginSlice'
import manageAccounts from '../modules/ManageAccounts/ManageAccountsSlice'
import monetisation from '../modules/Monetisation/monetisationSlice'
import kycDetails from '../modules/NewKyc/KycSlice'
import otpless from '../modules/OtplessV3/store/otplessSlice2'
import streamerLeaderboard from '../modules/StreamerLeaderboard/streamerLeaderboardSlice'
import wallet from '../modules/Wallet/walletSlice'
import app from './appSlice'

const rootReducer = combineReducers({
  app,
  login,
  streamDetails,
  analytics,
  wallet,
  videos,
  streamerLeaderboard,
  viewerLeaderboard,
  withToasts,
  liveStreamManager,
  manageAccounts,
  kycDetails,
  hypervergeKyc,
  kycv3Details,
  quizAndPoll,
  lookback,
  community,
  signup,
  clips,
  vipLeaderboard,
  stickers,
  otpless,
  monetisation,
  experiment: experimentReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
