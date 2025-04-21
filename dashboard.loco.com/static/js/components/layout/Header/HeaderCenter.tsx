import { Flex } from '@chakra-ui/core'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../app/RootReducer'
import { fetchGoldAndBeansAndGifts } from '../../../modules/Analytics/analyticsSlice'
import Tags from '../../tags'

const HeaderCenter = () => {
  const dispatch = useDispatch()
  const {
    login: { me },
    analytics: { beans },
  } = useSelector((state: RootState) => state)

  const { t } = useTranslation()

  const beanLabel = t('header.beans')
  const followersLabel = t('header.followers')

  useEffect(() => {
    if (me?.user_uid) {
      dispatch(fetchGoldAndBeansAndGifts())
    }
  }, [me?.user_uid])

  const tags = useMemo(
    () => [
      {
        key: 'followers',
        icon: 'sidebar_community',
        label: followersLabel,
        value: me?.followers_count || 0,
      },
      {
        key: 'beans',
        icon: 'bean',
        label: beanLabel,
        value: beans || 0,
      },
    ],
    [me?.followers_count, beans, beanLabel, followersLabel]
  )

  return (
    <Flex w="full" justify={['flex-end', 'flex-start', 'center']}>
      <Tags tags={tags} />
    </Flex>
  )
}

export default HeaderCenter
