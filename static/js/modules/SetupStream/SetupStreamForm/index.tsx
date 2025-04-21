import { Flex, Icon, Text } from '@chakra-ui/core'
import Loader from '@src/components/Loader/Loader'
import { sendAmplitudeData } from '@src/utils/Amplitude/amplitude'
import { FormikProps, withFormik } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import * as yup from 'yup'

import { setUserSettingsParams } from '../../../api/apiRequest'
import { RootState } from '../../../app/RootReducer'
import {
  ApiContext,
  streamDetailsInterface,
} from '../../../context/ApiConnector/types'
import Form, { inputField } from '../../../hoc/Form'

export interface SetupStreamFormProps {
  loading?: boolean
  isReadOnly?: boolean
  defaultStreamDetails?:
    | ApiContext['defaultStreamDetails']
    | streamDetailsInterface
    | null
  onSubmit?: (params: setUserSettingsParams) => any
  agreement?: boolean
}

export interface SetupStreamFormValues {
  isUpdate: boolean
  streamTitle: string
  streamDescription: string
  game: string
  tags: any[]
  thumbnail: any
  agreement: boolean
  primary_language: string
  has_mature_content: boolean
  secondary_language: string[]
}
const SetupStreamForm = (
  props: SetupStreamFormProps & FormikProps<SetupStreamFormValues>
): JSX.Element => {
  const { setFieldValue, setFieldTouched, defaultStreamDetails } = props
  const { userSettingCreatingLoader: loading } = useSelector(
    (state: RootState) => state.streamDetails
  )

  const [tagsError, setTagsError] = useState(false)
  const [secondaryLanguageError, setSecondaryLanguageError] = useState(false)
  const { t } = useTranslation()
  const { games, languagesLoading } = useSelector(
    (state: RootState) => state.login
  )

  const inputFields: inputField[] = [
    {
      name: 'streamTitle',
      label: t('home.todayStream.streamTitle'),
      placeholder: t('home.todayStream.streamTitlePlaceholder'),
      wordCount: true,
      wordCountLimit: 140,
      tooltipLabel: t('home.todayStream.streamTitleTooltip'),
      extraProps: {
        isReadOnly: props.isReadOnly,
      },
    },
    {
      name: 'streamDescription',
      label: t('home.todayStream.streamDescription'),
      placeholder: t('home.todayStream.streamDescriptionPlaceHolder'),
      inputType: 'textarea',
      wordCount: true,
      wordCountLimit: 140,
      extraProps: {
        isReadOnly: props.isReadOnly,
      },
    },
    {
      name: 'game',
      placeholder: t('home.todayStream.categoryPlacehoder'),
      label: t('home.todayStream.categories') + ' *',
      onChange: (val: any) => {
        setFieldValue('game', val.value)
        const selectedGame = games.find((game: any) => game.uid === val.value)
        if (selectedGame?.has_mature_content) {
          setFieldValue('has_mature_content', true)
        }
      },
      onBlur: () => {
        setFieldTouched('game', true)
      },
      inputType: 'gamesPicker',
      extraProps: {
        isReadOnly: props.isReadOnly,
      },
    },
    {
      name: 'tags',
      placeholder: t('home.todayStream.tagsPlaceholder'),
      label: t('home.todayStream.tags'),
      onChange: (val: any) => {
        if (!val) setFieldValue('tags', [])
        else if (val?.length <= 2) {
          setFieldValue(
            'tags',
            val.map((v: any) => v.value)
          )
        } else if (val?.length > 2) {
          setTagsError(true)
        }
      },
      onBlur: () => {
        setFieldTouched('tags', true)
        setTagsError(false)
      },
      inputType: 'tagsPicker',
      errorComponent: tagsError ? (
        <Flex align="center" mt={1}>
          {/* <Icon name="warning" color="brand.primary-red" size="3" mr={2} /> */}
          <Text fontSize="xs" color="brand.primary-red">
            {t('formValidationMessage.tags.max')}
          </Text>
        </Flex>
      ) : null,
      extraProps: {
        isReadOnly: props.isReadOnly,
      },
    },
    {
      name: 'primary_language',
      placeholder: t('home.todayStream.languagePlaceholder'),
      label: t('home.todayStream.language'),
      onChange: (val: any) => setFieldValue('primary_language', val.value),
      onBlur: () => setFieldTouched('primary_language', true),
      inputType: 'languagePicker',
      extraProps: {
        isReadOnly: props.isReadOnly,
      },
      tooltipLabel: t('formValidationMessage.language.tooltip'),
    },
    {
      name: 'secondary_language',
      placeholder: t('home.todayStream.secondaryLanguagePlaceholder'),
      label: t('home.todayStream.secondaryLanguage'),
      onChange: (val: string[]) => {
        if (!val || !val.length) {
          setFieldValue('secondary_language', [])
          return
        }

        if (val?.length <= 2) {
          setFieldValue(
            'secondary_language',
            val.map((v: any) => v.value)
          )
          return
        }
        setSecondaryLanguageError(true)
      },
      onBlur: () => {
        setFieldTouched('secondary_language', true)
        setSecondaryLanguageError(false)
      },
      errorComponent: secondaryLanguageError ? (
        <Flex align="center" mt={1}>
          {/* <Icon name="warning" color="brand.primary-red" size="3" mr={2} /> */}
          <Text fontSize="xs" color="brand.primary-red">
            {t('formValidationMessage.secondaryLanguage.max')}
          </Text>
        </Flex>
      ) : null,
      inputType: 'secondaryLanguagePicker',
      extraProps: {
        isReadOnly: props.isReadOnly,
      },
      tooltipLabel: t('formValidationMessage.secondaryLanguage.tooltip'),
    },
    {
      name: 'thumbnail',
      label: t('home.todayStream.thumbnail'),
      inputType: 'uploadThumbnail',
      title: t('home.todayStream.thumbnailPlaceholder'),
      extraProps: {
        defaultStreamDetails,
        titleStyleProp: {
          fontSize: '16px',
          fontWeight: '700',
        },
        isReadOnly: props.isReadOnly,
      },
      tooltipLabel: t('home.todayStream.thumbnailTooltip'),
      onChange: (file) => {
        setFieldValue('isUpdate', true)
        setFieldValue('thumbnail', file, true)
      },
    },
    {
      name: 'has_mature_content',
      inputType: 'mature_checkbox',
      extraProps: {
        isReadOnly: games.find((game: any) => game.uid === props.values.game)
          ?.has_mature_content
          ? true
          : props.isReadOnly,
      },
      title: t('home.todayStream.matureContent'),
    },
    {
      name: 'agreement',
      inputType: 'agreement',
      extraProps: {
        //@ts-ignore
        isReadOnly: props.isReadOnly,
      },
    },
  ]
  if (props['agreement'] && !props.agreement) {
    inputFields.splice(-1)
  }
  if (languagesLoading) {
    return (
      <div>
        <Loader height="20vh" />
      </div>
    )
  }
  return (
    <Form
      {...props}
      formLayoutProps={{ px: [0, 10, 10] }}
      inputFields={inputFields}
      buttonProps={{
        buttonText: t('home.todayStream.buttonText'),
        isLoading: loading,
      }}
    />
  )
}

const schema = yup.object().shape({
  isUpdate: yup.bool(),
  streamTitle: yup
    .string()
    .trim('formValidationMessage.streamTitle.empty')
    .strict(true)
    .required('formValidationMessage.streamTitle.required')
    .min(6, 'formValidationMessage.streamTitle.min')
    .max(140, 'formValidationMessage.streamTitle.max'),
  streamDescription: yup
    .string()
    .trim('formValidationMessage.streamDescription.empty')
    .strict(true)
    .required('formValidationMessage.streamDescription.required')
    .min(10, 'formValidationMessage.streamDescription.min')
    .max(140, 'formValidationMessage.streamDescription.max'),
  game: yup.string().required('formValidationMessage.game.required'),
  tags: yup.array().required('formValidationMessage.tags.required'),
  primary_language: yup
    .string()
    .required('formValidationMessage.language.required'),
  secondary_language: yup
    .array()
    .max(2, 'formValidationMessage.secondaryLanguage.max'),
  thumbnail: yup.mixed().when('isUpdate', {
    is: true,
    then: yup
      .mixed()
      .required('formValidationMessage.thumbnail.required')
      .test('fileSize', 'formValidationMessage.thumbnail.fileSize', (value) => {
        return value && value?.size <= 1000000
      }),
    otherwise: yup.mixed(),
  }),
  agreement: yup
    .boolean()
    .required('formValidationMessage.agreement.required')
    .oneOf([true], 'formValidationMessage.agreement.oneOf'),
})

const EnhancedComponent = withFormik<
  SetupStreamFormProps,
  SetupStreamFormValues
>({
  enableReinitialize: true,
  //@ts-ignore
  mapPropsToValues: (value) => {
    const { defaultStreamDetails } = value
    return {
      isUpdate:
        //@ts-ignorẻ
        defaultStreamDetails?.thumbnail ||
        //@ts-ignorẻ
        defaultStreamDetails?.thumbnail_url_small
          ? false
          : true,

      streamTitle: defaultStreamDetails?.title || '',
      streamDescription: defaultStreamDetails?.description || '',
      game: defaultStreamDetails?.game || '',
      tags: defaultStreamDetails?.tags || [],
      thumbnail: undefined,
      agreement: true,
      has_mature_content: defaultStreamDetails?.has_mature_content || false,
      //@ts-ignore
      primary_language: defaultStreamDetails?.primary_language,
      secondary_language: defaultStreamDetails?.secondary_language,
    }
  },
  validationSchema: (valid: any) => {
    if (valid['agreement'] && !valid?.agreement) {
      //@ts-ignore
      delete schema?.fields?.agreement
    }
    return schema
  },
  handleSubmit: (values, { props }) => {
    const streamDetails = {
      title: values.streamTitle,
      description: values.streamDescription,
      game_uid: values.game,
      file: values.thumbnail,
      tags: JSON.stringify(values.tags),
      primary_language: values.primary_language,
      secondary_language: JSON.stringify(values.secondary_language),
      has_mature_content: values.has_mature_content,
    }
    //@ts-ignore
    props.onSubmit(streamDetails)
  },
})(SetupStreamForm)

export default EnhancedComponent
