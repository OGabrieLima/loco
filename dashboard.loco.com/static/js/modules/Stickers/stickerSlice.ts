import { stickersByStatus } from '@api/stickers'
import { createSlice } from '@reduxjs/toolkit'
import isEqual from 'lodash/isEqual'
import unionWith from 'lodash/unionWith'

import { AppThunk } from '../../app/Store'

export interface Sticker {
  sticker_id: string
  image_url: string
  currency_type: number
  amount: number
  name: string
  created_at: string
  tab_key: number
  type: string
  collapse_after: number
  is_animated: boolean
  primary_id: string
  sort_order: number
  is_active: number
  streamer_updated_at: string
  update_at: string
}

interface StickerSliceState {
  activeStickers: Sticker[]
  inactiveStickers: Sticker[]
  tab: StickerType
  stickerLoading: boolean
  stickerActiveNext: null | string
  stickerInactiveNext: null | string
  stickerDisabledNext: null | string
  hasMoreActiveStickers: boolean
  hasMoreInactiveStickers: boolean
  error: any | null
}

export enum StickerType {
  ACTIVE = 10,
  INACTIVE = 20,
  DISABLE = 30,
}

const initialState: StickerSliceState = {
  activeStickers: [],
  inactiveStickers: [],
  tab: StickerType.ACTIVE,
  stickerLoading: false,
  stickerActiveNext: null,
  stickerInactiveNext: null,
  stickerDisabledNext: null,
  hasMoreActiveStickers: false,
  hasMoreInactiveStickers: false,
  error: null,
}

const stickerSlice = createSlice({
  name: 'stickers',
  initialState,
  reducers: {
    setStickerStart(state) {
      state.stickerLoading = true
      state.error = null
    },
    setTab(state, action) {
      state.tab = action.payload
    },
    setActiveStickerSuccess(state, action) {
      state.activeStickers = action.payload
      state.stickerLoading = false
    },
    setInactiveStickerSuccess(state, action) {
      state.inactiveStickers = action.payload
      state.stickerLoading = false
    },
    setActiveStickerNext(state, action) {
      state.stickerActiveNext = action.payload
    },
    setInactiveStickerNext(state, action) {
      state.stickerInactiveNext = action.payload
    },
    setDisabledStickerNext(state, action) {
      state.stickerDisabledNext = action.payload
    },
    setHasMoreActiveStickers(state, action) {
      state.hasMoreActiveStickers = action.payload
    },
    setHasMoreInactiveStickers(state, action) {
      state.hasMoreInactiveStickers = action.payload
    },
    setStickerFail(state, action) {
      state.error = action.payload
      state.stickerLoading = false
    },
    updateSticker(state, action) {
      const updatedSticker = action.payload
      const { activeStickers, inactiveStickers } = state

      // Find the index of the sticker to update in active stickers
      const activeIndex = activeStickers.findIndex(
        (sticker) => sticker.sticker_id === updatedSticker.sticker_id
      )

      // Find the index of the sticker to update in inactive stickers
      const inactiveIndex = inactiveStickers.findIndex(
        (sticker) => sticker.sticker_id === updatedSticker.sticker_id
      )

      if (activeIndex !== -1) {
        // Check if the status has changed
        if (
          activeStickers[activeIndex].is_active !== updatedSticker.is_active
        ) {
          // Remove from active and add to inactive or vice versa
          if (updatedSticker.is_active === StickerType.INACTIVE) {
            state.activeStickers.splice(activeIndex, 1)
            state.inactiveStickers.push(updatedSticker)
          } else {
            state.inactiveStickers.splice(inactiveIndex, 1)
            state.activeStickers.push(updatedSticker)
          }
        } else {
          // Update the sticker
          state.activeStickers[activeIndex] = updatedSticker
        }
        state.activeStickers.sort(
          //@ts-ignore
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        )
      } else if (inactiveIndex !== -1) {
        // Check if the status has changed
        if (
          inactiveStickers[inactiveIndex].is_active !== updatedSticker.is_active
        ) {
          // Remove from inactive and add to active or vice versa
          if (updatedSticker.is_active === StickerType.ACTIVE) {
            state.inactiveStickers.splice(inactiveIndex, 1)
            state.activeStickers.push(updatedSticker)
          } else {
            state.activeStickers.splice(activeIndex, 1)
            state.inactiveStickers.push(updatedSticker)
          }
        } else {
          // Update the sticker
          state.inactiveStickers[inactiveIndex] = updatedSticker
        }
        state.inactiveStickers.sort(
          //@ts-ignore
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        )
      }
    },
    activateSticker(state, action) {
      const activatedSticker = action.payload
      state.activeStickers.push(activatedSticker)
      state.inactiveStickers = state.inactiveStickers.filter(
        (sticker) => sticker.sticker_id !== activatedSticker.sticker_id
      )
    },
    deactivateSticker(state, action) {
      const deactivatedSticker = action.payload
      state.inactiveStickers.push(deactivatedSticker)
      state.activeStickers = state.activeStickers.filter(
        (sticker) => sticker.sticker_id !== deactivatedSticker.sticker_id
      )
    },
    deleteSticker(state, action) {
      const deletedStickerId = action.payload
      state.activeStickers = state.activeStickers.filter(
        (sticker) => sticker.sticker_id !== deletedStickerId
      )
      state.inactiveStickers = state.inactiveStickers.filter(
        (sticker) => sticker.sticker_id !== deletedStickerId
      )
    },
  },
})

export const {
  setStickerFail,
  setStickerStart,
  setHasMoreActiveStickers,
  setHasMoreInactiveStickers,
  setActiveStickerNext,
  setInactiveStickerNext,
  setDisabledStickerNext,
  setActiveStickerSuccess,
  setInactiveStickerSuccess,
  setTab,
  deleteSticker,
  deactivateSticker,
  activateSticker,
  updateSticker,
} = stickerSlice.actions

export default stickerSlice.reducer

export const fetchStickers = (
  stickerType: StickerType,
  next?: string
): AppThunk => async (dispatch, getState) => {
  const {
    stickers: { activeStickers, inactiveStickers, stickerDisabledNext },
  } = getState()

  // Check if next is null
  const shouldClearData = next === null || next === undefined

  try {
    dispatch(setStickerStart())

    // Fetch stickers based on the provided parameters
    let response
    let disabledStickerNext
    if (stickerType === StickerType.ACTIVE) {
      response = await stickersByStatus({
        is_active: stickerType,
        next,
      })
    } else {
      const [
        inactiveStickerResponse,
        disabledStickerResponse,
      ] = await Promise.all([
        stickersByStatus({
          is_active: stickerType,
          next,
        }),
        stickersByStatus({
          is_active: StickerType.DISABLE,
          next: stickerDisabledNext ? stickerDisabledNext : undefined,
        }),
      ])
      const mergedResults = [
        ...inactiveStickerResponse?.results,
        ...disabledStickerResponse?.results,
      ]

      dispatch(setDisabledStickerNext(disabledStickerResponse?.next ?? null))
      response = {
        results: mergedResults,
        next: inactiveStickerResponse?.next, // Assuming you want to paginate through inactive first
        disabledNext: disabledStickerResponse?.next, // This is the new value you want to store
      }
    }

    let allStickers: Sticker[] = response?.results
    const upcomingNext = response?.next
    allStickers = allStickers?.sort(
      //@ts-ignore
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    )

    if (allStickers && allStickers.length) {
      const sortedStickers = unionWith(
        shouldClearData
          ? []
          : stickerType === StickerType.ACTIVE
          ? activeStickers
          : inactiveStickers,
        allStickers,
        isEqual
      )

      if (stickerType === StickerType.ACTIVE) {
        dispatch(setActiveStickerSuccess(sortedStickers))
        dispatch(setActiveStickerNext(upcomingNext ?? null))
        dispatch(setHasMoreActiveStickers(upcomingNext ? true : false))
      } else {
        dispatch(setInactiveStickerSuccess(sortedStickers))
        dispatch(setInactiveStickerNext(upcomingNext ?? null))
        dispatch(setHasMoreInactiveStickers(upcomingNext ? true : false))
      }
    } else if (upcomingNext) {
      if (stickerType === StickerType.ACTIVE) {
        dispatch(setActiveStickerSuccess(activeStickers))
        dispatch(setActiveStickerNext(upcomingNext ?? null))
        dispatch(setHasMoreActiveStickers(upcomingNext ? true : false))
      } else {
        dispatch(setInactiveStickerSuccess(inactiveStickers))
        dispatch(setInactiveStickerNext(upcomingNext ?? null))
        dispatch(setHasMoreInactiveStickers(upcomingNext ? true : false))
      }
    } else if (next === null || next === undefined) {
      // Handle when allStickers is empty and next is null
      if (stickerType === StickerType.ACTIVE) {
        dispatch(setActiveStickerSuccess([])) // Clear active stickers
        dispatch(setActiveStickerNext(null))
        dispatch(setHasMoreActiveStickers(false))
      } else {
        dispatch(setInactiveStickerSuccess([])) // Clear inactive stickers
        dispatch(setInactiveStickerNext(null))
        dispatch(setHasMoreInactiveStickers(false))
      }
    } else if (response?.statusCode) {
      dispatch(setStickerFail(response))
    } else {
      dispatch(setStickerFail(response))
    }
  } catch (error) {
    dispatch(setStickerFail(error))
  }
}
