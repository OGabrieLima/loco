import { createSlice } from '@reduxjs/toolkit'
import { getUserCategoryFromUserType } from '@src/constants/userType'
import i18n from '@src/i18n/i18n'
import { removeDuplicates } from '@utils/utilityFunction'
import { batch } from 'react-redux'

import {
  allGames,
  allTags,
  checkIs2faCompleted,
  checkIsTermsAcceptedByUser,
  fetchAllMeProfileResponse,
  getCountries,
  getNormalTags,
  getProfileTags,
  getSpecificGames,
  languages,
  postTermsAcceptedByUser,
  streamerPermissions,
  viewerLeaderboardPermissions,
  vipLeaderboardPermissions,
} from '../../api/apiRequest'
import {
  emailNotificationInfoStatus,
  getNotificationInfo,
  updateNotificationInfo,
  updateNotificationInfoParams,
  whatsppNotificationInfoStatus,
} from '../../api/notification'
import { fetchRefreshToken, setRequestCountryCode } from '../../app/appSlice'
import store, { AppThunk } from '../../app/Store'
import { isWebViewBuild } from '../../constent'
import {
  streamerDetailsInterface,
  StreamerPermissionsInterface,
  viewerLeaderboardPermissionsInterface,
  vipLeaderboardPermissionsInterface,
} from '../../context/ApiConnector/types'
import { eventActions } from '../../utils/Amplitude'
import { fetchDefaultStreamDetails } from '../DefaultStream/streamDetailsSlice'
import { fetchCurrentLiveStream } from '../LiveStreamManager/LiveStreamManagerSlice'

const stringJavascriptCompare = (a: string, b: string) => {
  a = a || ''
  b = b || ''
  if (typeof a.localeCompare === 'function') {
    return a.localeCompare(b, 'en', { sensitivity: 'base' })
  }
  return a > b ? 1 : b > a ? -1 : 0
}

interface loginSliceStateInterface {
  me: streamerDetailsInterface | null
  is2faCompleted: boolean
  isTermsAccepted?: boolean
  isOnboardingCompleted: boolean
  whatsappNotifStatus: whatsppNotificationInfoStatus | null
  emailNotificationStatus: emailNotificationInfoStatus | null
  notifPhoneNumber: string | null
  notifEmail: string | null
  meProfileLoading: boolean // Added new loader only for Login Page
  // Issue:loading is common loader which is getting false from other apis, not from profile/me
  loading: boolean
  isFetchBasicDataBeforeUserLoginInProgress: boolean
  isFetchUserLoginInProgress: boolean
  error: null | any
  tags: any[]
  specificTags: any[]
  specificTagsLoading: boolean
  games: any[]
  specificGames: any[]
  specificGamesLoading: boolean
  tagsNext: string | null
  tagsLoading: boolean
  tagsError: any | null
  gamesLoading: boolean
  gamesError: any | null
  isNew: boolean
  modalStatus: string | null
  permissions: StreamerPermissionsInterface | null
  viewerLeaderboardPermissions: viewerLeaderboardPermissionsInterface | null
  languages: { label: string; locale: string }[]
  languagesLoading: boolean
  languagesError: any | null
  countries: any[]
  defaultCountry: string | null
  countriesLoading: boolean
  countriesError: any | null
  vipLeaderboardPermissions: vipLeaderboardPermissionsInterface | null
}

const initialState: loginSliceStateInterface = {
  whatsappNotifStatus: null,
  emailNotificationStatus: null,
  isFetchBasicDataBeforeUserLoginInProgress: false,
  isFetchUserLoginInProgress: false,
  notifPhoneNumber: null,
  notifEmail: null,
  meProfileLoading: isWebViewBuild ? true : false,
  loading: isWebViewBuild ? true : false,
  error: null,
  me: null,
  is2faCompleted: false,
  isTermsAccepted: undefined, // checking based on boolean & undefined, if we fetch this or not
  isOnboardingCompleted: false,
  tags: [],
  specificTags: [],
  specificGames: [],
  specificGamesLoading: false,
  specificTagsLoading: false,
  tagsNext: null,
  tagsLoading: false,
  games: [],
  gamesLoading: false,
  gamesError: null,
  tagsError: null,
  isNew: false,
  modalStatus: null,
  permissions: null,
  viewerLeaderboardPermissions: null,
  languages: [],
  languagesLoading: false,
  languagesError: null,
  countries: [],
  defaultCountry: null,
  countriesLoading: false,
  countriesError: null,
  vipLeaderboardPermissions: null,
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setIsFetchUserLoginInProgress(state, action) {
      state.isFetchUserLoginInProgress = !!action.payload
    },
    setIsFetchBasicDataBeforeUserLoginInProgress(state, action) {
      state.isFetchBasicDataBeforeUserLoginInProgress = !!action.payload
    },
    setIs2faCompleted(state, action) {
      state.is2faCompleted = action.payload
    },
    setIsTermsAccepted(state, action) {
      state.isTermsAccepted = action.payload
    },
    setMeStart(state) {
      state.loading = true
      state.error = null
    },
    setMeFail(state, action) {
      state.error = action.payload
      state.loading = false
    },
    setMeSuccess(state, action) {
      const me = action.payload
      state.me = me
      const showOnboardingForm =
        !me?.avatar_url ||
        !me?.full_name ||
        !me?.gender ||
        !me?.primary_game ||
        !me?.bio ||
        !me?.username ||
        !me?.country_iso_code
      state.isOnboardingCompleted = !showOnboardingForm
      state.loading = false
      state.error = null
    },
    setMeLoader(state, action) {
      state.meProfileLoading = action.payload
    },
    setLoader(state, action) {
      state.loading = action.payload
    },
    setTagsStart(state) {
      state.tagsLoading = true
      state.tagsError = null
    },
    setSpecifcTagsStart(state) {
      state.specificTagsLoading = true
    },
    setTagsNext(state, action) {
      state.tagsNext = action.payload
    },
    setTagsSuccess(state, action) {
      state.tags = action.payload
      state.tagsLoading = false
    },
    setSpecificTagsSuccess(state, action) {
      state.specificTags = action.payload
      state.specificTagsLoading = false
    },
    setTagsFail(state, action) {
      state.tagsLoading = false
      state.tagsError = action.payload
      state.tagsNext = null
    },
    setGamesStart(state) {
      state.gamesLoading = true
    },
    setGamesSuccess(state, action) {
      state.games = action.payload
      state.gamesLoading = false
    },
    setSpecificGamesSuccess(state, action) {
      state.specificGames = action.payload
      state.specificGamesLoading = false
    },
    setSpecifcGamesStart(state) {
      state.specificGamesLoading = true
    },
    setGamesFail(state, action) {
      state.error = action.payload
      state.gamesLoading = false
    },
    updateMe(state, action) {
      const otherMeData = action.payload
      state.me = state.me ? { ...state.me, ...otherMeData } : state.me
    },
    setProfileUrl(state, action) {
      const me = action.payload
      state.me = me
      const showOnboardingForm =
        !me?.avatar_url ||
        !me?.full_name ||
        !me?.gender ||
        !me?.primary_game ||
        !me?.bio ||
        !me?.username ||
        !me?.country_iso_code
      state.isOnboardingCompleted = !showOnboardingForm
    },
    setWhatsappNotifStatus(state, action) {
      state.whatsappNotifStatus = action.payload
    },
    setEmailNotificationStatus(state, action) {
      state.emailNotificationStatus = action.payload
    },
    setNotifPhoneNumber(state, action) {
      state.notifPhoneNumber = action.payload
    },
    setNotifEmail(state, action) {
      state.notifEmail = action.payload
    },
    setIsNew(state, action) {
      state.isNew = action.payload
    },
    setModalStatus(state, action) {
      state.modalStatus = action.payload
    },
    setStreamerPermissions(state, action) {
      state.permissions = action.payload
      state.loading = false
      state.error = null
    },
    setViewerLeaderboardPermissions(state, action) {
      state.viewerLeaderboardPermissions = action.payload
      state.loading = false
      state.error = null
    },
    setLanguageStart(state) {
      state.languagesLoading = true
    },
    setLanguageSuccess(state, action) {
      state.languages = action.payload
      state.languagesLoading = false
    },
    setLanguageFail(state, action) {
      state.languagesError = action.payload
      state.languagesLoading = false
    },
    setCountriesStart(state) {
      state.countriesLoading = true
    },
    setCountriesSuccess(state, action) {
      state.countries = action.payload.countries
      state.defaultCountry = action.payload.default_country
      state.countriesLoading = false
    },
    setCountriesError(state, action) {
      state.countries = action.payload
      state.countriesLoading = false
    },
    setVipLeaderboardPermissions(state, action) {
      state.vipLeaderboardPermissions = action.payload
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setIsFetchUserLoginInProgress,
  setIsFetchBasicDataBeforeUserLoginInProgress,
  setIs2faCompleted,
  setIsTermsAccepted,
  setMeStart,
  setMeFail,
  setMeLoader,
  setMeSuccess,
  setLoader,
  setTagsStart,
  setTagsSuccess,
  updateMe,
  setSpecifcGamesStart,
  setSpecifcTagsStart,
  setSpecificGamesSuccess,
  setSpecificTagsSuccess,
  setTagsNext,
  setTagsFail,
  setGamesStart,
  setGamesFail,
  setGamesSuccess,
  setProfileUrl,
  setWhatsappNotifStatus,
  setEmailNotificationStatus,
  setNotifPhoneNumber,
  setNotifEmail,
  setIsNew,
  setModalStatus,
  setStreamerPermissions,
  setViewerLeaderboardPermissions,
  setCountriesStart,
  setCountriesSuccess,
  setCountriesError,
  setLanguageStart,
  setLanguageSuccess,
  setLanguageFail,
  setVipLeaderboardPermissions,
} = loginSlice.actions

export default loginSlice.reducer

const updateAmplitudeUser = (data: any) => {
  const userProperties: any = {}
  userProperties['username'] = data.username
  userProperties['userId'] = data.user_uid
  userProperties['email'] = data.email
  if (data?.country_iso_code) {
    userProperties['country_code'] = data.country_iso_code
  }
  userProperties['user_bio'] = data.bio
  userProperties['name'] = data.full_name
  userProperties['is_streamer'] = data.can_stream ? true : false
  if (data.user_type) {
    userProperties['streamer_type'] = data.user_type
    userProperties['streamer_category'] = getUserCategoryFromUserType(
      data.user_type
    )
  }
  userProperties['user_tags'] = data.profile_tags?.map(
    (el: any) => el.display_name
  )
  userProperties['gender'] =
    data.gender === 1 ? 'male' : data.gender === 2 ? 'female' : 'other'

  eventActions.setAmplitudeUserId(data.user_uid)
  eventActions.setAmplitudeUserProperties(userProperties)
  userProperties['Identity'] = data.user_uid

  // @ts-ignore
  clevertap.profile.push({
    ...userProperties,
  })
}

export const fetchMeStreamer = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setMeStart())
    // Here, we make all 3 API Call
    const res = await fetchAllMeProfileResponse()

    let data: any = {}
    if (res?.username) {
      data = { ...res }
    }
    if (res?.data) {
      data = { ...res.data }
    }

    if (data.username) {
      batch(() => {
        dispatch(setMeSuccess(data))
        dispatch(fetchDefaultStreamDetails())
        dispatch(fetchCurrentLiveStream(data.user_uid))
        updateAmplitudeUser(data)
      })
    } else if (data?.statusCode) {
      batch(() => {
        dispatch(setMeFail(data))
        dispatch(fetchRefreshToken())
      })
    }
  } catch (err) {
    dispatch(setMeFail(err))
  } finally {
    dispatch(setLoader(false))
    dispatch(setMeLoader(false))
  }
}

export const checkPremiumUser = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setMeStart())
    dispatch(setIsFetchUserLoginInProgress(true))
    // Here, we make all 3 API Call
    const res = await fetchAllMeProfileResponse()
    let data: any = {}
    if (res?.username) {
      data = { ...res }
    }
    if (res?.data) {
      data = { ...res.data }
    }
    if (data.request_country_code) {
      dispatch(setRequestCountryCode(data.request_country_code))
    }
    if (data?.username) {
      batch(() => {
        dispatch(setMeSuccess(data))
        dispatch(fetchDefaultStreamDetails())
        dispatch(fetchCurrentLiveStream(data.user_uid))
        updateAmplitudeUser(data)
      })
    } else if (data?.statusCode) {
      batch(() => {
        dispatch(setMeFail(data))
        dispatch(fetchRefreshToken())
      })
    }
  } catch (err) {
    dispatch(setMeFail(err))
  } finally {
    dispatch(setIsFetchUserLoginInProgress(false))
    dispatch(setLoader(false))
    dispatch(setMeLoader(false))
  }
}

export const fetchStreamerPermissions = (): AppThunk => async (
  dispatch,
  state
) => {
  const { me } = state().login
  try {
    if (!me) return
    dispatch(setMeStart())
    const res = await streamerPermissions(me?.user_uid ?? '')
    const permissionsResponse = res?.permissions

    if (res?.permissions) {
      batch(() => {
        dispatch(setStreamerPermissions(permissionsResponse))
      })
    } else if (res?.statusCode) {
      batch(() => {
        dispatch(setMeFail(res))
        dispatch(fetchRefreshToken())
      })
    }
  } catch (err) {
    dispatch(setMeFail(err))
  } finally {
    dispatch(setLoader(false))
  }
}

export const fetchTags = (next?: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setTagsStart())
    const tagsApiResult = await allTags(next)
    const sortedTagsResult =
      tagsApiResult && tagsApiResult.results
        ? tagsApiResult?.results
            ?.sort((a: any, b: any) => {
              return stringJavascriptCompare(a?.display_name, b?.display_name)
            })
            .map((tag: any) => {
              return {
                value: tag.tag_uid,
                label: tag.display_name,
              }
            })
        : []
    if (sortedTagsResult && sortedTagsResult.length) {
      dispatch(setTagsSuccess(sortedTagsResult))
      dispatch(setTagsNext(tagsApiResult?.next ? tagsApiResult.next : null))
    } else if (tagsApiResult?.statusCode) {
      setTagsFail(tagsApiResult)
    }
  } catch (error) {
    setTagsFail(error)
  }
}

export const fetchSpecificTags = (next?: string): AppThunk => async (
  dispatch
) => {
  try {
    dispatch(setSpecifcTagsStart())
    const tagsApiResult = await getNormalTags(next)
    const profileTagsResult = await getProfileTags(next)

    if (tagsApiResult && tagsApiResult.results) {
      const combinedTags = [
        ...tagsApiResult.results,
        ...profileTagsResult?.results,
      ]
      const uniqueTags = removeDuplicates(combinedTags, 'tag_uid')
      dispatch(setSpecificTagsSuccess(uniqueTags))
      // dispatch(setTagsNext(tagsApiResult?.next ? tagsApiResult.next : null))
    } else if (tagsApiResult?.statusCode) {
      setTagsFail(tagsApiResult)
    }
  } catch (error) {
    setTagsFail(error)
  }
}

export const fetchGames = (): AppThunk => async (dispatch) => {
  try {
    if (store.getState().login.gamesLoading) {
      return
    }
    dispatch(setGamesStart())
    let allGamesResponse: any[] = []
    let gameResponse: any = null
    do {
      gameResponse = await allGames({
        next: gameResponse?.next || '',
      })
      const gameResult = gameResponse.results
      if (!Array.isArray(gameResult)) {
        break
      }
      allGamesResponse = allGamesResponse.concat(gameResult)
    } while (gameResponse?.next)

    const sortedGameResult = allGamesResponse.sort((a: any, b: any) => {
      return stringJavascriptCompare(a?.name, b?.name)
    })

    if (sortedGameResult.length) {
      dispatch(setGamesSuccess(sortedGameResult))
    } else {
      dispatch(setGamesFail(gameResponse))
    }
  } catch (error) {
    dispatch(setGamesFail(error))
  }
}

export const fetchSpecificGames = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setSpecifcGamesStart())
    const gameApiResult = await getSpecificGames()

    if (gameApiResult && gameApiResult.results) {
      const uniqueGames = removeDuplicates(gameApiResult.results, 'uid')
      dispatch(setSpecificGamesSuccess(uniqueGames))
    } else if (gameApiResult?.statusCode) {
      dispatch(setGamesFail(gameApiResult))
    }
  } catch (error) {
    dispatch(setGamesFail(error))
  }
}

export const fetchLanguages = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLanguageStart())
    const response = await languages()
    const languageDetails = response.auth_languages

    const appLang = i18n.language

    const hasAppLang = languageDetails.some(
      (lang: any) => lang.locale === appLang
    )

    // Sort languages according to the specified conditions
    languageDetails.sort((a: any, b: any) => {
      // If appLang is found, place it on top
      if (hasAppLang) {
        if (a.locale === appLang) return -1
        if (b.locale === appLang) return 1
      }

      // Make sure English is the second language, unless it's already the first
      if (a.locale === 'en') return -1
      if (b.locale === 'en') return 1

      return 0 // Keep the original order for the rest
    })

    if (languageDetails && languageDetails.length) {
      dispatch(setLanguageSuccess(languageDetails))
    } else if (languageDetails?.statusCode) {
      dispatch(setLanguageFail(languageDetails))
    }
  } catch (error) {
    dispatch(setLanguageFail(error))
  }
}

export const fetchCountries = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setCountriesStart())
    const response = await getCountries()
    const countriesDetails = response.countries.map((country: any) => {
      country.value = country.iso
      return country
    })

    if (countriesDetails && countriesDetails.length) {
      dispatch(
        setCountriesSuccess({
          countries: countriesDetails,
          default_country: response.default_country,
        })
      )
    } else if (countriesDetails?.statusCode) {
      dispatch(setCountriesError(countriesDetails))
    }
  } catch (error) {
    dispatch(setCountriesError(error))
  }
}

const getModalStatus = (
  notificationDetailsResult: Record<string, unknown> | any
) => {
  if (
    notificationDetailsResult.is_new &&
    (notificationDetailsResult.whatsapp_status ===
      whatsppNotificationInfoStatus.DEFAULT ||
      notificationDetailsResult.whatsapp_status ===
        whatsppNotificationInfoStatus.ADDPHONENUMBER ||
      notificationDetailsResult.whatsapp_status ===
        whatsppNotificationInfoStatus.NOTIFOFF) &&
    notificationDetailsResult.email_status ===
      emailNotificationInfoStatus.DEFAULT
  ) {
    return 'COMMON'
  } else if (
    notificationDetailsResult.email_status ===
      emailNotificationInfoStatus.DEFAULT &&
    !!notificationDetailsResult.email
  ) {
    return 'EMAIL'
  } else if (
    notificationDetailsResult.is_new &&
    (notificationDetailsResult.whatsapp_status ===
      whatsppNotificationInfoStatus.DEFAULT ||
      notificationDetailsResult.whatsapp_status ===
        whatsppNotificationInfoStatus.ADDPHONENUMBER ||
      notificationDetailsResult.whatsapp_status ===
        whatsppNotificationInfoStatus.NOTIFOFF)
  ) {
    return 'WHATSAPP'
  } else {
    return 'CLOSE'
  }
}

export const getNotificationDetails = (): AppThunk => async (dispatch) => {
  try {
    const notificationDetailsResult = await getNotificationInfo()
    const modalStatus = getModalStatus(notificationDetailsResult)
    batch(() => {
      dispatch(
        setEmailNotificationStatus(notificationDetailsResult.email_status)
      )
      dispatch(
        setWhatsappNotifStatus(notificationDetailsResult.whatsapp_status)
      )
      dispatch(setIsNew(notificationDetailsResult.is_new))
      dispatch(setNotifPhoneNumber(notificationDetailsResult.phone))
      dispatch(setNotifEmail(notificationDetailsResult.email))
      dispatch(setModalStatus(modalStatus))
    })
  } catch (error) {
    // do nothing
  }
}

export const updateWhatsappNotifStatus = ({
  channel,
  flag,
  onFailed,
}: updateNotificationInfoParams): AppThunk => async (dispatch) => {
  try {
    const updateWhatsappNotifResult = await updateNotificationInfo({
      channel: channel,
      flag: flag,
    })
    if (updateWhatsappNotifResult.status === 'success') {
      dispatch(setIsNew(false))
      dispatch(setWhatsappNotifStatus(flag))
    } else {
      onFailed?.()
    }
  } catch (error) {
    onFailed?.()
    // do nothing
  }
}

export const updateEmailNotificationStatus = ({
  channel,
  flag,
}: updateNotificationInfoParams): AppThunk => async (dispatch) => {
  try {
    const updateEmailNotificationResult = await updateNotificationInfo({
      channel: channel,
      flag: flag,
    })

    if (updateEmailNotificationResult.errorCode) {
      dispatch(setEmailNotificationStatus(!flag))
    }
  } catch (error) {
    // so nothing
  }
}

export const fetchViewerLeaderboardPermissions = (): AppThunk => async (
  dispatch
) => {
  try {
    const res = await viewerLeaderboardPermissions()
    const permissionsResponse = res?.permissions

    if (res?.permissions) {
      batch(() => {
        dispatch(setViewerLeaderboardPermissions(permissionsResponse))
      })
    }
  } catch (err) {
    // dispatch(setMeFail(err));
  } finally {
    dispatch(setLoader(false))
  }
}

export const fetchVipLeaderboardPermissions = (): AppThunk => async (
  dispatch
) => {
  try {
    const res = await vipLeaderboardPermissions()

    if (res) {
      batch(() => {
        dispatch(setVipLeaderboardPermissions(res))
      })
    }
  } catch (err) {
    // do nothing
  } finally {
    dispatch(setLoader(false))
  }
}
export const fetchBasicDataBeforeUserLogin = (): AppThunk => async (
  dispatch
) => {
  try {
    dispatch(setLoader(true))
    dispatch(setIsFetchBasicDataBeforeUserLoginInProgress(true))
    const is2faDisabled = true
    const [is2faCompletedResp, isTermsAcceptedResp] = await Promise.allSettled([
      is2faDisabled ? { is_2fa_complete: true } : checkIs2faCompleted(),
      checkIsTermsAcceptedByUser(),
    ])
    const is2faCompleted = !!(
      is2faCompletedResp.status === 'fulfilled' &&
      is2faCompletedResp.value?.is_2fa_complete === true
    )
    const isTermsAccepted = !(
      isTermsAcceptedResp.status === 'fulfilled' &&
      isTermsAcceptedResp.value?.show_tnc === true
    )
    batch(() => {
      dispatch(setIs2faCompleted(is2faCompleted))
      dispatch(setIsTermsAccepted(isTermsAccepted))
    })
  } catch (err) {
    // do nothing
  } finally {
    dispatch(setIsFetchBasicDataBeforeUserLoginInProgress(false))
    dispatch(setLoader(false))
  }
}

export const onAcceptTermsModal = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoader(true))
    dispatch(setIsTermsAccepted(true))
    await postTermsAcceptedByUser()
  } catch (err) {
    dispatch(setIsTermsAccepted(undefined))
    // do nothing
  } finally {
    dispatch(setLoader(false))
  }
}
