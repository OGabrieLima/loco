import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/core'
import { FormikProps, withFormik } from 'formik'
import find from 'lodash/find'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import * as yup from 'yup'

import { RootState } from '../../../../../../app/RootReducer'
import PrimaryButton from '../../../../../../components/buttons/PrimaryButton'
import FormCustomRadio from '../../../../../../components/formInput/FormCustomRadio'
import { Input } from '../../../../../../components/input/Input'
import { GenerateRandomKey } from '../../../../../../utils/utilityFunction'
const FormErrorMessage = (props: any) => {
  return (
    <Box
      fontSize={['12px']}
      mt={['6px', '8px']}
      lineHeight={'130%'}
      color="brand.loco-error"
      {...props}
      {...props}
    >
      {props.children}
    </Box>
  )
}

export interface QuizFormProps {
  onSubmit: (params: any) => any
}
export interface QuizFormValues {
  isUpdate: boolean
  question: string
  A: string
  B: string
  C: string
  D: string
  correctAnswer: string
  quizDuration: string
}

export const questionOptions = [
  { label: 'Where should I land in this game?', value: 1 },
  { label: 'Where should I land in this game?', value: 2 },
  { label: 'Where should I land in this game?', value: 3 },
  { label: 'Where should I land in this game?', value: 4 },
  { label: 'Where should I land in this game?', value: 5 },
  { label: 'Where should I land in this game?', value: 6 },
]
const options = [
  {
    key: 'a',
    label: 'A',
    value: GenerateRandomKey(),
    placeholder: 'manageLiveStream.activityFeed.questions.ansPlaceholder',
  },
  {
    key: 'b',
    label: 'B',
    value: GenerateRandomKey(),
    placeholder: 'manageLiveStream.activityFeed.questions.ansPlaceholder',
  },
  {
    key: 'c',
    label: 'C',
    value: GenerateRandomKey(),
    placeholder: 'manageLiveStream.activityFeed.questions.optionalPlaceholder',
  },
  {
    key: 'd',
    label: 'D',
    value: GenerateRandomKey(),
    placeholder: 'manageLiveStream.activityFeed.questions.optionalPlaceholder',
  },
]
function QuizForm(props: QuizFormProps & FormikProps<QuizFormValues>) {
  const {
    errors,
    touched,
    values,
    handleSubmit,
    handleReset,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
  } = props
  const allInputRefs = useRef<{ [key: string]: any }>({
    ['question']: React.createRef(),
    ...options.reduce((acc, item) => {
      acc[item.label] = React.createRef()
      return acc
    }, {} as { [key: string]: any }),
  })
  const { loading } = useSelector((state: RootState) => state.quizAndPoll)

  const { t } = useTranslation()

  return (
    //@ts-ignore
    <form onSubmit={handleSubmit} autoComplete={'off'}>
      <Stack spacing={[3, 4]} p={4}>
        <FormControl
          isInvalid={
            //@ts-ignore
            errors['question'] && touched['question'] ? true : false
          }
        >
          <FormLabel htmlFor="question" p={0}>
            <Flex justify="space-between" w="full" align="center">
              <Flex
                justify="flex-start"
                align="center"
                fontSize={['12px', '14px']}
                fontWeight={'700'}
                w="full"
                mb="6px"
                color="white"
              >
                {t('manageLiveStream.activityFeed.questions.title')}

                <Text
                  color={
                    values['question']?.length
                      ? (errors['question'] && touched['question']) ||
                        values['question']?.length > 140
                        ? 'brand.loco-error'
                        : 'brand.loco-grey-30'
                      : 'brand.loco-grey-30'
                  }
                  fontSize={['12px', '14px']}
                  fontWeight="400"
                  mx="8px"
                >
                  ({values['question']?.length}/140)
                </Text>
              </Flex>
            </Flex>
          </FormLabel>
          <Input
            ref={allInputRefs.current['question']}
            name={'question'}
            placeholder={t(
              'manageLiveStream.activityFeed.questions.quesPlaceholder'
            )}
            _placeholder={{
              color: 'brand.loco-grey-30',
              fontWeight: 400,
            }}
            color="white"
            fontSize={['12px', '14px']}
            fontWeight={['normal']}
            p={['8px 12px', '13px 12px']}
            h="auto"
            bg={['brand.loco-grey-70']}
            lineHeight={'115%'}
            inputGroup={{
              w: 'full',
            }}
            //@ts-ignore
            value={values['question']}
            onBlur={handleBlur}
            onChange={(event: any) => {
              setTimeout(() => {
                if (allInputRefs.current['question']?.current) {
                  allInputRefs.current['question']?.current.focus()
                }
              }, 0)
              handleChange(event)
            }}
            // type={type}
            //@ts-ignore
            error={touched['question'] && errors['question']}
          />
          {errors['question'] ? (
            <FormErrorMessage color="brand.loco-error">
              {t(errors['question'] || '')}
            </FormErrorMessage>
          ) : null}
        </FormControl>
        <Flex w="full" direction={'column'}>
          <Flex
            justify="space-between"
            align="center"
            fontSize={['12px', '14px']}
            fontWeight={'700'}
            w="full"
            color="white"
          >
            <Text> {t('manageLiveStream.activityFeed.questions.options')}</Text>
            <Text> {t('manageLiveStream.activityFeed.questions.correct')}</Text>
          </Flex>
          {errors['correctAnswer'] ? (
            <FormControl
              m={0}
              p={0}
              isInvalid={
                //@ts-ignore
                errors['correctAnswer'] && touched['correctAnswer']
                  ? true
                  : false
              }
              display="flex"
              justifyContent="flex-end"
            >
              <FormErrorMessage color="brand.loco-error">
                {//@ts-ignore
                t(errors['correctAnswer'] || '')}
              </FormErrorMessage>
            </FormControl>
          ) : null}
        </Flex>

        <Flex w="full">
          <Stack spacing={['10px', '16px']} w="full" mr={'12px'}>
            {options.map((option) => {
              const name = option.label
              // @ts-ignore
              const error = errors[name]

              return (
                <FormControl
                  key={option.key}
                  display="flex"
                  flexDirection="row"
                  w="full"
                  isInvalid={
                    //@ts-ignore
                    error && touched[name] ? true : false
                  }
                >
                  <FormLabel htmlFor={name} p={0} m={0}>
                    <Flex
                      fontSize={['10px', '14px']}
                      fontWeight={'700'}
                      w="full"
                      h="full"
                      color="white"
                      pt="13px"
                      px={'12px'}
                    >
                      {name}
                    </Flex>
                  </FormLabel>
                  <Flex direction="column" w="full">
                    <Input
                      // id={option.label}
                      name={name}
                      ref={allInputRefs.current[name]}
                      placeholder={t(option.placeholder)}
                      _placeholder={{
                        color: 'brand.loco-grey-30',
                        fontWeight: 400,
                      }}
                      color="white"
                      fontSize={['12px', '14px']}
                      fontWeight={['normal']}
                      p={['13px 12px', '13px 12px']}
                      h="auto"
                      bg={['brand.loco-grey-70']}
                      lineHeight={'115%'}
                      inputGroup={{
                        w: 'full',
                      }}
                      //@ts-ignore
                      value={values[name]}
                      onBlur={handleBlur}
                      onChange={(event: any) => {
                        setTimeout(() => {
                          if (allInputRefs.current[name]?.current) {
                            allInputRefs.current[name]?.current.focus()
                          }
                        }, 0)
                        handleChange(event)
                      }}
                      // type={type}
                      //@ts-ignore
                      error={touched[name] && error}
                    />
                    {error ? (
                      <FormErrorMessage color="brand.loco-error">
                        {t(error || '')}
                      </FormErrorMessage>
                    ) : null}
                  </Flex>
                </FormControl>
              )
            })}
          </Stack>

          <FormControl
            p={0}
            m={0}
            isInvalid={
              //@ts-ignore
              errors['correctAnswer'] && touched['correctAnswer'] ? true : false
            }
          >
            {/* this is right panel to choose the right answer */}
            <RadioGroup
              onChange={(e: any) => {
                //@ts-ignore
                const option = find(options, { value: e.target.value })
                //@ts-ignore
                if (values[option?.label]) {
                  setFieldValue('correctAnswer', e.target.value)
                }
              }}
              value={values['correctAnswer']}
              h="full"
              display="flex"
              p={0}
              m={0}
              flexDirection="column"
              justifyContent="space-around"
            >
              {options.map((option) => (
                <Radio
                  p={0}
                  m={0}
                  name={option.label}
                  key={option.key}
                  value={option.value}
                  flex={1}
                  className="radio_button_group"
                  borderColor={
                    values['correctAnswer'] === option.value
                      ? 'brand.loco-primary'
                      : 'white'
                  }
                  variantColor="black"
                  //@ts-ignore
                  cursor={values[option.label] ? 'pointer' : 'not-allowed'}
                  //@ts-ignore
                  opacity={values[option.label] ? 1 : 0.2}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Flex>
        <FormControl
          isInvalid={
            //@ts-ignore
            errors['quizDuration'] && touched['quizDuration'] ? true : false
          }
        >
          <FormLabel htmlFor={'quizDurationLabel'}>
            <Flex
              justify="center"
              align="center"
              fontSize={['12px', '14px']}
              fontWeight={'700'}
              w="full"
              h="full"
              color="white"
              mb="16px"
            >
              {t('manageLiveStream.activityFeed.questions.quizDuration')}
            </Flex>
          </FormLabel>
          <FormCustomRadio
            onChange={(val: any) => setFieldValue('quizDuration', val)}
            name="quizDurationLabel"
            value={values['quizDuration']}
          />
          {errors['quizDuration'] ? (
            <FormErrorMessage color="brand.loco-error">
              {//@ts-ignore
              t(errors['quizDuration'] || '')}
            </FormErrorMessage>
          ) : null}
        </FormControl>
        <Flex justify="space-between">
          <PrimaryButton
            minW="fit-content"
            w="48%"
            color={'brand.loco-primary'}
            fontSize={['12px', '16px']}
            fontWeight="700"
            bg="transparent"
            type="reset"
            onClick={() => {
              handleReset()
              resetForm()
            }}
            _active={{
              bg: 'transparent',
              outline: 'none',
            }}
            _hover={{
              bg: 'transparent',
            }}
            _disabled={{
              bg: 'transparent',
            }}
            _focus={{
              outline: 'none',
            }}
          >
            {t('manageLiveStream.activityFeed.questions.cancel')}
          </PrimaryButton>
          <PrimaryButton
            minW="fit-content"
            w="48%"
            fontSize={['12px', '16px']}
            fontWeight="700"
            type="submit"
            isLoading={loading}
            isDisabled={!values.question || !values.A || !values.B}
            _focus={{
              outline: 'none',
            }}
            _active={{
              outline: 'none',
            }}
            loadingText={t(
              'manageLiveStream.activityFeed.questions.publishing'
            )}
          >
            {t('manageLiveStream.activityFeed.questions.publish')}
          </PrimaryButton>
        </Flex>
      </Stack>
    </form>
  )
}

const schema = yup.object().shape({
  isUpdate: yup.bool(),
  question: yup
    .string()
    .trim('manageLiveStream.activityFeed.questions.QueValMess.empty')
    .strict(true)
    .required(
      'manageLiveStream.activityFeed.questions.QueValMess.ques.required'
    )
    .min(10, 'manageLiveStream.activityFeed.questions.QueValMess.ques.min')
    .max(140, 'manageLiveStream.activityFeed.questions.QueValMess.ques.max'),
  A: yup
    .string()
    .trim('manageLiveStream.activityFeed.questions.QueValMess.empty')
    .strict(true)
    .required('manageLiveStream.activityFeed.questions.QueValMess.option1Reqd')
    .max(30, 'manageLiveStream.activityFeed.questions.QueValMess.max')
    .min(1, 'manageLiveStream.activityFeed.questions.QueValMess.min'),
  B: yup
    .string()
    .trim('manageLiveStream.activityFeed.questions.QueValMess.empty')
    .strict(true)
    .required('manageLiveStream.activityFeed.questions.QueValMess.option2Reqd')
    .max(30, 'manageLiveStream.activityFeed.questions.QueValMess.max')
    .min(1, 'manageLiveStream.activityFeed.questions.QueValMess.min'),
  C: yup
    .string()
    .trim('manageLiveStream.activityFeed.questions.QueValMess.empty')
    .strict(true)
    .min(1, 'manageLiveStream.activityFeed.questions.QueValMess.min')
    .max(
      30,

      'manageLiveStream.activityFeed.questions.QueValMess.max'
    ),
  D: yup
    .string()
    .trim('manageLiveStream.activityFeed.questions.QueValMess.empty')
    .strict(true)
    .min(1, 'manageLiveStream.activityFeed.questions.QueValMess.min')
    .max(30, 'manageLiveStream.activityFeed.questions.QueValMess.max'),
  quizDuration: yup
    .string()
    .required(
      'manageLiveStream.activityFeed.questions.durationValidationMessage'
    ),
  correctAnswer: yup
    .string()
    .required(
      'manageLiveStream.activityFeed.questions.selectionOneAnswerMessage'
    ),
})
const EnhancedComponent = withFormik<QuizFormProps, QuizFormValues>({
  enableReinitialize: true,
  mapPropsToValues: () => {
    return {
      isUpdate: true,
      question: '',
      A: '',
      B: '',
      C: '',
      D: '',
      quizDuration: '',
      correctAnswer: '',
    }
  },
  validationSchema: schema,
  handleSubmit: (value, { props, resetForm }) => {
    const { onSubmit } = props
    const paramsObj = {
      question: value.question,
      options: {
        [options[0].value]: value.A,
        [options[1].value]: value.B,
        ...(value.C && { [options[2].value]: value.C }),
        ...(value.D && { [options[3].value]: value.D }),
      },
      correctAnswer: value.correctAnswer,
      questionType: 10,
      ...(value.quizDuration !== 'unlimited' && {
        duration: value.quizDuration,
      }),
    }
    onSubmit(paramsObj)
    resetForm()
  },
})(QuizForm)
export default EnhancedComponent
