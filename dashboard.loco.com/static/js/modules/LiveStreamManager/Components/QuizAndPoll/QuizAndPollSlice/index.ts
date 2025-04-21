import { createSlice } from '@reduxjs/toolkit'
import i18n from 'i18next'
import { isEqual, unionWith } from 'lodash'
import { batch } from 'react-redux'

import {
  getClosedQuestions,
  getPollAndQuestionStatus,
  getSentQuestions,
  postQuizAndPolltQuestion,
  postQuizAndPolltQuestionParamsInterface,
  updateQuizAndPolltQuestion,
} from '../../../../../api/apiRequest'
import { AppThunk } from '../../../../../app/Store'
import { setToasts } from '../../../../../hoc/WithToasts/withToastsSlice'

export interface initialStateInterface {
  loading: boolean
  error: null | any
  sentQuestions: sentQuestionsInterface | any
  closedQuestions: sentQuestionsInterface | any
  nextClosedQuestions: string | null
  questionTab: 10 | 20 | 30
  createFormTab: 10 | 20
  total_live_questions: number
  total_closed_questions: number
}
export interface sentQuestionsInterface {
  uid: string
  streamUid: string
  userUid: string
  question: string
  options: any
  stats: any
  questionType: 20 | 10
  status: 10
  duration: number
  startsAt: number
  createdAt: number
  updatedAt: number
  statsPercentage: any
  endsAt?: number
  correctAnswer?: string
  totalVotes?: number
}
const initialState: initialStateInterface = {
  loading: false,
  error: null,
  sentQuestions: [],
  closedQuestions: [],
  nextClosedQuestions: null,
  questionTab: 10,
  createFormTab: 20,
  total_live_questions: 0,
  total_closed_questions: 0,
}

const quizAndPollSlice = createSlice({
  name: 'quizAndPoll',
  initialState,
  reducers: {
    setLoader(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    setSentQuestions(state, action) {
      state.sentQuestions = action.payload
    },
    setQuestionTab(state, action) {
      state.questionTab = action.payload
    },
    setCreateFormTab(state, action) {
      state.createFormTab = action.payload
    },
    setClosedQuestions(state, action) {
      let updateClosedQuestions = null
      if (state.nextClosedQuestions) {
        updateClosedQuestions = unionWith(
          state.closedQuestions,
          action.payload,
          isEqual
        )
      } else {
        updateClosedQuestions = action.payload
      }
      state.closedQuestions = updateClosedQuestions
    },
    setNextClosedQuestions(state, action) {
      state.nextClosedQuestions = action.payload
    },
    setTotalLiveQuestions(state, action) {
      state.total_live_questions = action.payload
    },
    setTotalClosedQuestions(state, action) {
      state.total_closed_questions = action.payload
    },
  },
})

export const {
  setLoader,
  setError,
  setSentQuestions,
  setClosedQuestions,
  setNextClosedQuestions,
  setQuestionTab,
  setCreateFormTab,
  setTotalLiveQuestions,
  setTotalClosedQuestions,
} = quizAndPollSlice.actions

export default quizAndPollSlice.reducer

export const fetchSentQuestions = (): AppThunk => async (dispatch, state) => {
  const { currentLiveStreamDetails } = state().liveStreamManager
  try {
    batch(() => {
      // dispatch(setLoader(true));
      dispatch(setError(null))
    })
    if (currentLiveStreamDetails?.uid) {
      //@ts-ignore
      const res = await getSentQuestions(currentLiveStreamDetails?.uid)
      if (res?.results) {
        dispatch(setSentQuestions(res.results))
      }
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    // dispatch(setLoader(false));
  }
}
export const fetchClosedQuestions = (next: string | null): AppThunk => async (
  dispatch,
  state
) => {
  const { currentLiveStreamDetails } = state().liveStreamManager
  try {
    batch(() => {
      // dispatch(setLoader(true));
      dispatch(setError(null))
    })
    if (currentLiveStreamDetails?.uid) {
      //@ts-ignore
      const res = await getClosedQuestions(currentLiveStreamDetails?.uid, next)
      if (res?.results) {
        dispatch(setClosedQuestions(res.results))
        dispatch(setNextClosedQuestions(res.next))
      }
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    // dispatch(setLoader(false));
  }
}

export const createPollAndQuizQuestion = (
  params: postQuizAndPolltQuestionParamsInterface
): AppThunk => async (dispatch, state) => {
  const { currentLiveStreamDetails } = state().liveStreamManager
  try {
    batch(() => {
      dispatch(setLoader(true))
      dispatch(setError(null))
    })
    if (currentLiveStreamDetails?.uid) {
      const res = await postQuizAndPolltQuestion(
        currentLiveStreamDetails?.uid,
        params
      )
      if (res?.uid) {
        dispatch(
          setToasts({
            position: 'top',
            description: `${i18n.t(
              'manageLiveStream.activityFeed.questions.publishSuccess'
            )}`,
            title: `${i18n.t(
              'manageLiveStream.activityFeed.questions.published'
            )}`,
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        )
      } else if (res?.message) {
        dispatch(
          setToasts({
            position: 'top',
            description: `${res?.message}`,
            title: res.statusCode === 422 ? 'Warning' : 'Error',
            status: res.statusCode === 422 ? 'warning' : 'error',
            duration: 2000,
            isClosable: true,
          })
        )
      }
      return res
    }
  } catch (err) {
    dispatch(setError(err))
    return err
  } finally {
    dispatch(setLoader(false))
  }
}
export const updatePollAndQuizQuestion = (
  params: postQuizAndPolltQuestionParamsInterface,
  questionUid: string
): AppThunk => async (dispatch, state) => {
  const { currentLiveStreamDetails } = state().liveStreamManager
  try {
    batch(() => {
      dispatch(setLoader(true))
      dispatch(setError(null))
    })
    if (currentLiveStreamDetails?.uid) {
      const res = await updateQuizAndPolltQuestion(
        //@ts-ignore
        currentLiveStreamDetails?.uid,
        questionUid,
        params
      )
      if (res?.uid) {
        dispatch(
          setToasts({
            position: 'top',
            description: `${i18n.t(
              'manageLiveStream.activityFeed.questions.endSuccess'
            )}`,
            title: `${i18n.t('manageLiveStream.activityFeed.questions.ended')}`,
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        )
      }
    }
  } catch (err) {
    dispatch(setError(err))
  } finally {
    dispatch(setLoader(false))
  }
}

export const fetchPollAndQuestionStatus = (): AppThunk => async (
  dispatch,
  state
) => {
  const { currentLiveStreamDetails } = state().liveStreamManager
  try {
    batch(() => {
      dispatch(setError(null))
    })
    if (currentLiveStreamDetails?.uid) {
      const res = await getPollAndQuestionStatus(currentLiveStreamDetails?.uid)
      if (res?.length) {
        batch(() => {
          dispatch(setTotalLiveQuestions(res.length.live || 0))
          dispatch(setTotalClosedQuestions(res.length.results || 0))
        })
      }
      // if (res?.uid) {
      //   dispatch(
      //     setToasts({
      //       position: 'top',
      //       description: 'Question has been ended successfully.',
      //       title: 'Ended',
      //       status: 'success',
      //       duration: 2000,
      //       isClosable: true,
      //     })
      //   );
      // }
    }
  } catch (err) {
    dispatch(setError(err))
  }
}
