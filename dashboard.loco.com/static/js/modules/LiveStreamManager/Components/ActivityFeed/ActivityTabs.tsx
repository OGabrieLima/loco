import { useRtlTranslation } from '@src/i18n/utils'
import { findIndex } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { setPreviousVisit } from '../../../../app/appSlice'
import { RootState } from '../../../../app/RootReducer'
import SelectTabs from '../../../../components/selectTabs'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../../../../utils/Amplitude'
import { setActivityTab } from '../../LiveStreamManagerSlice'

const ActivityTabs = () => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const { me } = useSelector((state: RootState) => state.login)
  // const { defaultStreamDetails } = useSelector(
  //   (state: RootState) => state.streamDetails
  // );
  const { currentLiveStreamDetails, activityTab } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  useEffect(() => {
    if (window.innerWidth > 650) {
      handleOnTabChange(0)
    }
  }, [])

  const tabs = ([
    window.innerWidth > 650
      ? {
          key: 'questions',
          name: t('manageLiveStream.activityFeed.questions.title'),
          value: 30,
        }
      : null,
    {
      key: 'diamond',
      name: t('manageLiveStream.activityFeed.diamond.title'),
      value: 20,
    },
    {
      key: 'gold',
      name: t('manageLiveStream.activityFeed.gold.title'),
      value: 10,
    },
    currentLiveStreamDetails?.game_uid === '20097' &&
    currentLiveStreamDetails?.tags.filter(
      (tag) => tag.toLocaleLowerCase() === 'giveaway'
    ).length === 1
      ? {
          key: 'giveaway',
          name: 'GIVEAWAY',
          value: 40,
        }
      : null,
  ].filter((x) => !!x) as unknown) as {
    key: string
    name: string
    value: number
  }[]

  const currentIndex = findIndex(tabs, { value: activityTab })
  const handleOnTabChange = (index: number) => {
    dispatch(setActivityTab(tabs[index].value))
    if (tabs[index].value === 30) {
      handleEventVisitQuestionForm()
    }
  }
  const handleEventVisitQuestionForm = () => {
    const eventProperties: eventPropsTypes.visit_question_form_props = {
      video_id: currentLiveStreamDetails?.uid || '',
      category_id: currentLiveStreamDetails?.game_uid || '',
      category_name: currentLiveStreamDetails?.game_name || '',
      streamer_id: me?.user_uid,
      streamer_name: me?.username,
      streamer_type: me?.user_type,
      video_tags: currentLiveStreamDetails?.tags,
    }
    const previousVisit = eventConstants.visit_question_form.split('visit_')[1]
    dispatch(setPreviousVisit(previousVisit))
    eventActions.sendAmplitudeData(eventConstants.visit_question_form, {
      ...eventProperties,
    })
  }

  return (
    <SelectTabs
      //@ts-ignore
      tabs={tabs}
      handleOnTabChange={handleOnTabChange}
      currentIndex={currentIndex}
      tabProps={{
        minH: '38px',
      }}
      hasNewDesign={false}
      tabsProps={{
        width: '100%',
        p: 0,
        m: 0,
      }}
      // tabsProps={
      //   {
      //     // bg: ['brand.primary-light-black-v4', 'transparent'],
      //     // py: [1, 0],
      //     // px: 1,
      //     // rounded: ['4px', 0],
      //     // overflow: 'hidden',
      //   }
      // }
      // tabProps={
      //   {
      //     // mr: [0, 6],
      //     // px: [2, 0],
      //     // py: 1,
      //     // rounded: ['4px', 0],
      //     // minW: ['75px', 'fit-content'],
      //     // align: 'center',
      //   }
      // }
      // selectedProps={
      //   {
      //     // borderBottom: ['none', '2px solid'],
      //     // bgImage: ['linear-gradient(102deg, #3f4c6b -3%, #606c88 118%)', 'none'],
      //     // borderColor: ['none', 'brand.primary-blue'],
      //   }
      // }
    />
  )
}

export default ActivityTabs
