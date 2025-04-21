import {
  Box,
  BoxProps,
  ButtonProps,
  Flex,
  Stack,
  StackProps,
} from '@chakra-ui/core'
import { FormikProps } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'

import PrimaryButton from '../../components/buttons/PrimaryButton'
import FormInput from '../../components/formInput/FormInput'
import { FormLayout } from '../../components/layout/FormLayout'
import { AadharCardFormValues } from '../../modules/Kyc/components/AadharCardForm'
import { DrivingLicenceFormValues } from '../../modules/Kyc/components/DrivingLicenceForm'
import { PanCardFormValues } from '../../modules/Kyc/components/PanCardForm'
import { VoterIdFormValues } from '../../modules/Kyc/components/VoterIdForm'
import { BankTransferFormValues } from '../../modules/ManageAccounts/components/BankTransferAccount/BankTransferForm'
import { OnboardingFormValues } from '../../modules/Onboarding/OnboardingForm'
import { SetupStreamFormValues } from '../../modules/SetupStream/SetupStreamForm'
import { ProfileDetailsFromValues } from '../../modules/StreamerProfile/Components/ProfileDetails/ProfileDetailsFrom'
import { UploadFormValues } from '../../modules/Upload/UploadVideoForm'
export interface inputField {
  name: string
  placeholder?: string
  label?: string | React.ReactNode
  wordCount?: boolean
  wordCountLimit?: number
  renderComponent?: React.ReactNode
  component?: React.ReactNode
  errorComponent?: React.ReactNode
  isWebViewBuild?: boolean
  extraProps?: Record<string, unknown>
  type?: string
  noteText?: React.ReactNode
  inputType?: string
  onChange?: (val: any) => any
  onBlur?: (val: any) => any
  title?: string
  tooltipLabel?: string
  accept?: string
  videoInfo?: boolean
  isUploadClips?: boolean
  tagCount?: boolean
  tagCountLimit?: number
  onFocus?: () => void
  required?: boolean
}
export interface inputFieldsProps {
  inputFields: inputField[]
  buttonProps?: Partial<
    ButtonProps & {
      buttonText?: any
    }
  >
  isReadOnly?: boolean
  formWidth?: any
  formLayoutProps?: BoxProps
  formElementProps?: any
  formStackProps?: StackProps
}
const Form = (
  props: inputFieldsProps &
    (
      | FormikProps<VoterIdFormValues>
      | FormikProps<AadharCardFormValues>
      | FormikProps<DrivingLicenceFormValues>
      | FormikProps<OnboardingFormValues>
      | FormikProps<SetupStreamFormValues>
      | FormikProps<UploadFormValues>
      | FormikProps<ProfileDetailsFromValues>
      | FormikProps<BankTransferFormValues>
      | FormikProps<PanCardFormValues>
      | FormikProps<any>
    )
): JSX.Element => {
  const {
    touched,
    values,
    isValid,
    dirty: isDirty,
    errors,
    isSubmitting,
    handleSubmit,
    handleBlur,
    handleChange,
    inputFields,
    buttonProps,
    formWidth,
    formLayoutProps,
    formElementProps,
    formStackProps,
  } = props
  const isFormDisabled = !isDirty || !isValid || isSubmitting

  const { t } = useTranslation()
  return (
    <FormLayout formLayoutProps={formLayoutProps}>
      <form {...formElementProps} onSubmit={handleSubmit}>
        <Stack spacing={4} {...formStackProps}>
          {inputFields.map((inputField: inputField) => {
            const fieldHeight =
              inputField.type === 'mature_checkbox' ? '100px' : 'auto'
            return (
              <Box
                key={inputField.name}
                minHeight={fieldHeight}
                position="relative"
              >
                {inputField.component ? (
                  inputField.component
                ) : (
                  <FormInput
                    {...inputField}
                    formWidth={formWidth}
                    errors={errors}
                    touched={touched}
                    values={values}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                  />
                )}
              </Box>
            )
          })}
        </Stack>

        {!props.isReadOnly ? (
          <Flex justifyContent="center">
            <PrimaryButton
              mt={4}
              w={['full']}
              color="white"
              bg={'brand.loco-primary'}
              type="submit"
              alignSelf="center"
              fontSize={['16px', '14px']}
              fontWeight="700"
              rounded="10px"
              padding={['12px 24px', '10px 24px']}
              // hotfix: ADD BUTTON DISABLED STYLES
              {...buttonProps}
              style={{
                marginInlineStart: 0,
                ...buttonProps?.style,
              }}
              _focus={{
                outline: 'none',
                ...buttonProps?._focus,
              }}
              isLoading={buttonProps?.isLoading || isSubmitting}
              isDisabled={buttonProps?.isDisabled || isFormDisabled}
            >
              {buttonProps?.buttonText
                ? buttonProps.buttonText
                : t('form.submit')}
            </PrimaryButton>
          </Flex>
        ) : null}
      </form>
    </FormLayout>
  )
}

export default Form
