import { RootState } from '@app/RootReducer'
import { Box, Button, Icon, Input, Spinner, Text } from '@chakra-ui/core'
import { useCustomToast } from '@components/customToast'
import { yupResolver } from '@hookform/resolvers/yup'
import useSkipFirstRender from '@hooks/useSkipFirstRender'
import {
  addModerator,
  resetModeratorAddError,
  validateUsername,
} from '@modules/Community/Moderator/moderatorSlice'
import { AddModeratorFormValues } from '@modules/Community/Moderator/types'
import Notification from '@modules/Community/Notification'
import { useRtlTranslation } from '@src/i18n/utils'
import { sendAmplitudeData } from '@utils/Amplitude/amplitude'
import i18next from 'i18next'
import isMobile from 'is-mobile'
import debounce from 'lodash/debounce'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'

export default function AddModerator(props: Props) {
  const { t } = useTranslation()
  const isRTL = useRtlTranslation()

  const { modCount } = props
  const toast = useCustomToast()
  const [loading, setLoading] = useState(false)
  const [valid, setValid] = React.useState(false)
  const [error, setError] = React.useState('')
  const dispatch = useDispatch()
  const me = useSelector((state: RootState) => state.login.me)
  const { currentLiveStreamDetails } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { addModeratorError } = useSelector(
    (state: RootState) => state.community.moderators
  )
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(4, '')
      .test(
        'username',
        `${t('community.errors.only_one_word_is_allowed')}`,
        (value) => {
          if (value && /[\s]/.test(value)) return false
          return true
        }
      ),
  })

  const { handleSubmit, formState, register, watch, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  })
  const { isValid, isDirty, errors } = formState
  const isUsernameValid = async (value: string) => {
    if (value) {
      try {
        const res = await validateUsername(value)
        if (res.status === 200) {
          setError('')
          setValid(true)
        }
      } catch (error) {
        setError(`${t('community.errors.moderator_not_found')}`)
        setValid(false)
      }
    } else {
      setValid(false)
      setError('')
    }
  }
  const debouncedIsValidUsername = React.useMemo(
    () => debounce(isUsernameValid, 150),
    []
  )
  const handleOnChange = (value: string) => {
    if (addModeratorError) {
      dispatch(resetModeratorAddError())
    }
    debouncedIsValidUsername(value)
  }
  const onSubmit = async (data: AddModeratorFormValues) => {
    setLoading(true)
    const { username } = data
    const res = await dispatch(addModerator({ username }))
    // @ts-ignore
    if (!res.error) {
      sendAmplitudeData('Streamer_add_moderator', {
        streamer_id: me?.user_uid,
        streamer_username: me?.username,
        mod_username: username,
        video_id: currentLiveStreamDetails?.uid,
        streamer_type: me?.user_type,
        category_name: currentLiveStreamDetails?.game_name,
        Source: 'live_mod_list',
      })
      toast({
        position: isMobile() ? 'bottom' : 'top',
        duration: 2000,
        isClosable: false,
        note: t('community.moderators.userAddedToModerator', {
          username: username,
        }),
      })
      reset()
    } else {
      // @ts-ignore
      setError(res.error.message)
    }
    setLoading(false)
  }
  // @ts-ignore
  const watchValue = watch('username')
  useSkipFirstRender(() => {
    handleOnChange(watchValue)
  }, [watchValue])
  // @ts-ignore
  const errorMessage = error || errors['username']?.message
  return (
    <Box mt={[0, '24px']}>
      <Text color="#fff" fontSize="16px" fontWeight="700">
        {t('community.moderators.addMod')} ({modCount}/20)
      </Text>
      <Text fontSize="12px" mt={[0, 4]}>
        {t('community.moderators.suggestion')}
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" alignItems="baseline" mt={[0, 4]}>
          <Box flexGrow={1} display="flex">
            <Box position="relative" flexGrow={1}>
              <Input
                minH={'48px'}
                type="text"
                placeholder={t('community.moderators.addInputPlaceholder')}
                autoComplete="off"
                fontSize="14px"
                p="12px 16px"
                borderRadius="10px"
                border="none"
                backgroundColor="brand.loco-grey-70"
                _placeholder={{
                  fontWeight: 400,
                  fontSize: '14px',
                }}
                _hover={{
                  outline: 'none',
                }}
                _focus={{
                  outline: 'none',
                }}
                _active={{
                  outline: 'none',
                }}
                focusBorderColor="none"
                // @ts-ignore
                {...register('username')}
              />
              {valid && !error ? (
                <Icon
                  name="check"
                  color="brand.primary-green"
                  position="absolute"
                  width="20px"
                  height="20px"
                  transform="translateY(-50%)"
                  right={isRTL ? '' : '10px'}
                  left={isRTL ? '10px' : ''}
                  top="50%"
                  zIndex={10}
                />
              ) : null}
            </Box>
            <Button
              type="submit"
              backgroundColor="brand.loco-primary"
              color="white"
              minH="48px"
              p="10px 24px"
              borderRadius="10px"
              fontSize="14px"
              lineHeight="130%"
              fontWeight="700"
              style={{
                marginInlineStart: '12px',
              }}
              _hover={{
                backgroundColor: 'brand.loco-primary',
              }}
              _focus={{
                backgroundColor: 'brand.loco-primary',
              }}
              _active={{
                backgroundColor: 'brand.loco-primary',
              }}
              opacity={1}
              _disabled={{
                opacity: 1,
                backgroundColor: 'brand.loco-grey-70',
                color: 'brand.loco-grey-40',
                cursor: 'not-allowed',
              }}
              isDisabled={!isDirty || !isValid || !valid || loading}
            >
              {loading ? (
                <Spinner width="20px" height="20px" color="#fff" />
              ) : (
                t('community.moderators.addButtonText')
              )}
            </Button>
          </Box>
        </Box>
      </form>
      {errorMessage ? (
        <Box display="flex" mt={[0, 2]} alignItems="center" height="18px">
          <>
            <Text
              fontSize="12px"
              lineHeight="130%"
              fontWeight="400"
              as="p"
              color="#CA3838"
            >
              {errorMessage}
            </Text>
          </>
        </Box>
      ) : null}
    </Box>
  )
}

interface Props {
  modCount: number
}
