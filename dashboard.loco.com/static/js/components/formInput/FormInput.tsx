import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/core'
import { CategoryPicker } from '@components/CategoryPicker/CategoryPicker'
import CountrySelector from '@components/CountrySelector'
import { LanguagePicker } from '@components/LanguagePicker/LanguagePicker'
import { TagsPicker } from '@components/TagsPicker/TagsPicker'
import { paths } from '@src/routers/constants'
import theme from '@src/theme'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Switch from 'react-switch'

import { RootState } from '../../app/RootReducer'
import {
  fetchCountries,
  fetchGames,
  // fetchGames,
  fetchLanguages,
  fetchSpecificGames,
  fetchSpecificTags,
  fetchTags,
  // fetchTags,
} from '../../modules/Login/loginSlice'
import Block from '../Container/Block'
import CropComponent from '../CropComponent'
import CustomCalendar from '../datepicker/CustomCalendar'
import { Input } from '../input/Input'
import PickerWithSearch from '../PickerWithSearch/PickerWithSearch'
// import { Upload } from '../upload/Upload';
import Selector from '../selector'
import TooltipModal from '../tooltipModal'
import { UploadClipComponent } from '../UploadClipComponent'
import { UploadComponent } from '../UploadComponent'
import FormAgreement from './FormAgreement'
import FormRadio from './FormRadio'
import Textarea from './FormTextarea'

const FormInput = (props: any) => {
  const dispatch = useDispatch()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const {
    name,
    label,
    placeholder,
    type,
    inputType,
    wordCount,
    wordCountLimit,
    isWebViewBuild,
    errors,
    matches,
    touched,
    values,
    handleBlur,
    handleChange,
    renderComponent,
    errorComponent,
    extraProps,
    tooltipLabel,
    formWidth,
    videoInfo,
    noteText,
    isUploadClips,
    tagCountLimit,
    tagCount,
    required,
  } = props
  const wordLimit = wordCountLimit || 140
  const tagLimit = tagCountLimit || 5

  const {
    games,
    gamesLoading,
    tags,
    tagsLoading,
    // tagsNext,
    me,
    countries,
    defaultCountry,
    languages,
    languagesLoading,
    specificGames,
    specificTags,
  } = useSelector((state: RootState) => state.login)
  const { t } = useTranslation()
  useEffect(() => {
    if (inputType === 'gamesPicker') {
      if (games.length > 0) return
      if (me?.user_uid) {
        dispatch(fetchGames())
      }
    }
    if (inputType === 'categoryPicker') {
      if (specificGames.length > 0) return
      if (me?.user_uid) dispatch(fetchSpecificGames())
    }
    if (inputType === 'countryPicker') {
      if (countries.length > 0) return
      dispatch(fetchCountries())
    }

    if (inputType === 'tagsPicker') {
      if (tags.length > 0) return
      dispatch(fetchTags())
    }
    if (inputType === 'newtagsPicker') {
      if (specificTags.length > 0) return
      dispatch(fetchSpecificTags())
    }
    if (inputType === 'languagePicker' || inputType === 'pillLanguagePicker') {
      if (languages.length > 0) return
      dispatch(fetchLanguages())
    }
  }, [me?.user_uid])

  const languageOptions = useMemo(
    () =>
      languages.map((language) => {
        return {
          label: language.label,
          value: language.locale,
        }
      }),
    [languages]
  )

  let InputComponent
  switch (inputType) {
    case 'date':
      InputComponent = (
        <CustomCalendar
          name={name}
          id={name}
          title={extraProps.title}
          placeholder={placeholder}
          value={values[name]}
          onChange={props.onChange}
          calendarProps={{ ...extraProps }}
        />
      )
      break
    case 'textarea':
      InputComponent = (
        <Block
          style={{
            padding: 0,
            borderRadius: '10px',
          }}
          bg={[
            // extraProps?.isReadOnly ? 'transparent' : 'brand.primary-text-field',
            // 'brand.primary-text-field',
            '#282828',
          ]}
          position={'relative'}
        >
          <Textarea
            name={name}
            id={name}
            placeholder={placeholder}
            fontSize={'sm'}
            color="white"
            fontWeight={['normal']}
            bg={[
              // extraProps?.isReadOnly ? 'transparent' : 'brand.primary-text-field',
              // 'brand.primary-text-field',
              '#282828',
            ]}
            value={values[name]}
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={wordCountLimit}
            style={{
              paddingInlineStart: '1rem',
            }}
            {...extraProps}
          />
          {/* 
          This is wordCount for Text Area
          {wordCount && !extraProps?.isReadOnly ? (
            <Text
              color={
                values[name].length
                  ? (errors[name] && touched[name]) ||
                    values[name].length > wordLimit
                    ? 'brand.primary-red'
                    : 'brand.loco-grey-30'
                  : 'brand.loco-grey-30'
              }
              position={'absolute'}
              right={4}
              top={4}
              letterSpacing={1}
              fontSize={'sm'}
            >
              {values[name].length}/{wordLimit}
            </Text>
          ) : null} */}
        </Block>
      )
      break
    case 'radio':
      InputComponent = (
        <FormRadio
          {...props}
          value={values[name]}
          id={name}
          onBlur={handleBlur}
          onChange={handleChange}
          {...extraProps}
        />
      )
      break
    case 'gamesPicker':
      InputComponent = (
        <Selector
          isMulti={false}
          id={name}
          isLoading={gamesLoading}
          value={values[name]}
          onBlur={handleBlur}
          {...props}
          {...extraProps}
          classNamePrefix={extraProps?.isReadOnly ? 'react-select' : null}
          options={
            games?.length > 0
              ? games.map((game) => ({ value: game.uid, label: game.name }))
              : null
          }
        />
      )
      break
    case 'picker':
      InputComponent = (
        <Selector
          isMulti={false}
          id={name}
          isLoading={extraProps?.loading}
          value={values[name]}
          onBlur={handleBlur}
          {...props}
          {...extraProps}
          classNamePrefix={extraProps?.isReadOnly ? 'react-select' : null}
          options={extraProps?.options?.length > 0 ? extraProps?.options : []}
        />
      )
      break
    case 'tagsPicker':
      InputComponent = (
        <Selector
          isMulti={true}
          id={name}
          isLoading={tagsLoading}
          value={values[name]}
          onBlur={handleBlur}
          classNamePrefix={extraProps?.isReadOnly ? 'react-select' : null}
          {...props}
          {...extraProps}
          options={tags}
          isUploadClips={isUploadClips}
        />
      )
      break
    case 'pickerWithSearch':
      // Hotfix:TODO... WIP
      InputComponent = (
        <PickerWithSearch
          id={name}
          name={name}
          placeholder={placeholder}
          value={values[name]}
          error={errors[name] && touched[name] && !extraProps?.isReadOnly}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
          {...extraProps}
        />
      )
      break
    case 'uploadThumbnail':
      InputComponent = (
        <CropComponent
          {...props}
          id={name}
          defaultStreamDetails={extraProps?.defaultStreamDetails}
          accept=".png,.jpg,.jpeg"
          {...extraProps}
          title={
            values[name] || extraProps?.defaultStreamDetails?.thumbnail
              ? extraProps?.changeTitle || t('profile.changeThumbnailText')
              : extraProps?.title ?? t('home.todayStream.thumbnailPlaceholder')
          }
        />
      )
      break
    case 'agreement':
      InputComponent = <FormAgreement {...props} {...extraProps} />
      break
    case 'uploadVideo':
      InputComponent = (
        <UploadComponent
          {...props}
          id={name}
          defaultStreamDetails={extraProps?.defaultStreamDetails}
          accept=".mp4,.avi"
          {...extraProps}
        />
      )
      break
    case 'countryPicker':
      InputComponent = (
        <CountrySelector
          isMulti={false}
          id={name}
          // isLoading={gamesLoading}
          value={values[name]}
          onBlur={handleBlur}
          {...props}
          {...extraProps}
          classNamePrefix={extraProps?.isReadOnly ? 'react-select' : null}
          options={countries}
        />
      )
      break
    case 'languagePicker':
      InputComponent = (
        <Selector
          isMulti={false}
          id={name}
          isLoading={languagesLoading}
          value={String(values[name])}
          onBlur={handleBlur}
          {...props}
          {...extraProps}
          classNamePrefix={extraProps?.isReadOnly ? 'react-select' : null}
          disabledOptionMessage={t('formValidationMessage.language.disabled')}
          options={languageOptions.map((language) => {
            const isDisabled = values['secondary_language']?.includes(
              language.value
            )
            return {
              label: language.label,
              value: language.value,
              isDisabled: isDisabled,
            }
          })}
        />
      )
      break
    case 'pillLanguagePicker':
      InputComponent = (
        <LanguagePicker
          id={name}
          value={values['primary_language']}
          {...props}
          {...extraProps}
          // options={}
        />
      )
      break
    case 'secondaryLanguagePicker':
      InputComponent = (
        <Selector
          isMulti={true}
          id={name}
          isLoading={languagesLoading}
          value={values['secondary_language']}
          onBlur={handleBlur}
          {...props}
          {...extraProps}
          classNamePrefix={extraProps?.isReadOnly ? 'react-select' : null}
          disabledOptionMessage={t(
            'formValidationMessage.secondaryLanguage.disabled'
          )}
          options={languageOptions.map((language) => {
            return {
              label: language.label,
              value: language.value,
              isDisabled: values['primary_language'] === language.value,
            }
          })}
        />
      )
      break
    case 'uploadClip':
      InputComponent = (
        <UploadClipComponent
          {...props}
          id={name}
          defaultStreamDetails={extraProps?.defaultStreamDetails}
          accept=".mp4,"
          {...extraProps}
        />
      )
      break

    case 'categoryPicker':
      InputComponent = (
        <CategoryPicker
          {...props}
          id={name}
          value={values['game']}
          {...extraProps}
        />
      )
      break

    case 'newtagsPicker':
      InputComponent = (
        <TagsPicker
          id={name}
          values={values}
          onBlur={handleBlur}
          tagLimit={tagCountLimit}
          {...props}
          {...extraProps}
        />
      )
      break

    case 'mature_checkbox':
      InputComponent = (
        //stop propagation to prevent modal closing on switch handle click
        <Box onClick={(e) => e.stopPropagation()}>
          <Flex alignItems={'center'}>
            <Switch
              marginTop={'4px'}
              id={name}
              itemID={name}
              checked={values[name]}
              cursor="pointer"
              onColor="#FFD0BC"
              onHandleColor={theme.colors.brand['loco-primary']}
              uncheckedIcon={false}
              checkedIcon={false}
              height={15}
              width={34}
              handleDiameter={20}
              offColor="#999999"
              offHandleColor="#CCCCCC"
              disabled={extraProps?.isReadOnly}
              isDisabled={extraProps?.isReadOnly}
              onChange={(checked, e) => {
                handleChange({
                  target: {
                    id: name,
                    name: name,
                    type: 'checkbox',
                    checked: checked,
                    value: checked,
                  },
                })
              }}
              {...props}
              {...extraProps}
            />
            <Text marginLeft={'4px'} fontSize={'14px'} fontWeight={'500'}>
              {t('home.todayStream.matureContent')}
            </Text>
          </Flex>
          {!extraProps?.isReadOnly ? (
            <Text
              fontSize={'14px'}
              marginTop={'4px'}
              textAlign={'left'}
              color={'#BDBDBD'}
            >
              {t('home.todayStream.matureContentTnC')}{' '}
              <a
                href={paths.terms}
                target="_blank"
                style={{
                  textDecoration: 'underline',
                  display: 'inline',
                  color: theme.colors.brand['loco-primary'],
                }}
                rel="noreferrer"
              >
                {t('home.todayStream.matureContentTnC_tncText')}
              </a>
            </Text>
          ) : (
            false
          )}
        </Box>
      )
      break
    default:
      InputComponent = (
        <Input
          id={name}
          name={name}
          placeholder={placeholder}
          fontSize={'sm'}
          fontWeight={['normal']}
          bg={[
            // extraProps?.isReadOnly ? 'transparent' : '#282828',
            '#282828',
            // 'brand.primary-text-field',
          ]}
          style={{
            borderRadius: '10px',
          }}
          pl={[4, 4]}
          h={12}
          value={values[name]}
          onBlur={handleBlur}
          onChange={handleChange}
          type={type}
          error={touched[name] && errors[name] && !extraProps?.isReadOnly}
          matches={matches}
          maxLength={wordCountLimit}
          // rightComponent={
          // This is wordCount for Inline Input Area
          //   wordCount && !extraProps?.isReadOnly ? (
          //     <Text
          //       color={
          //         values[name].length
          //           ? (errors[name] && touched[name]) ||
          //             values[name].length > wordLimit
          //             ? 'brand.primary-red'
          //             : 'brand.loco-grey-30'
          //           : 'brand.loco-grey-30'
          //       }
          //       letterSpacing={1}
          //       fontSize={'sm'}
          //       mr={8}
          //     >
          //       {values[name].length}/{wordLimit}
          //     </Text>
          //   ) : null
          // }
          {...props}
          {...extraProps}
        />
      )
  }
  if (!isWebViewBuild) {
    return (
      <>
        <FormControl
          isInvalid={
            errors[name] && touched[name] && !extraProps?.isReadOnly
              ? true
              : false
          }
          w={formWidth || '100%'}
        >
          {label && (
            <FormLabel htmlFor={name} pb={2} pr={0} fontWeight={600} w="full">
              <Flex justify="space-between" w="full" align="center">
                <Flex
                  justify={'flex-start'}
                  align="center"
                  // earlier readonly was xs to differentiate
                  fontSize={[extraProps?.isReadOnly ? 'sm' : 'sm', 'sm']}
                  // earlier readonly was 300 to differentiate
                  fontWeight={[extraProps?.isReadOnly ? 600 : 600, 600]}
                  w="full"
                  // Earlier it was 0.8 to differentiate for isReadOnly
                  opacity={extraProps?.isReadOnly ? 1 : 1}
                  color="white"
                >
                  {label}
                  {required ? <Text as="span">{'*'}</Text> : null}
                  {/* {wordCount && !extraProps?.isReadOnly ? (
                    <Text
                      color={
                        values[name].length
                          ? (errors[name] && touched[name]) ||
                            values[name].length > wordLimit
                            ? 'brand.primary-red'
                            : 'brand.primary-white-v2'
                          : 'brand.primary-white-v2'
                      }
                      letterSpacing={1}
                      // ml={4}
                      style={{
                        marginInlineStart: '1rem',
                      }}
                    >
                      ({values[name].length}/{wordLimit})
                    </Text>
                  ) : null} */}

                  {videoInfo ? (
                    <Text
                      color={'brand.primary-white-v2'}
                      fontSize={'10px'}
                      fontWeight="400"
                      ml={4}
                    >
                      ( {t('clips.uploadForm.formatLabel')} {':'}{' '}
                      <Text as={'span'} color={'#fff'}>
                        {' '}
                        {t('clips.uploadForm.formatValue')}
                      </Text>{' '}
                      | {t('clips.uploadForm.limitLabel')} {':'}{' '}
                      <Text as={'span'} color={'#fff'}>
                        {' '}
                        {t('clips.uploadForm.limitValue')}
                      </Text>{' '}
                      )
                    </Text>
                  ) : null}
                </Flex>
                {noteText ? (
                  <Text
                    color={'brand.loco-grey-30'}
                    fontSize={['10px', '12px']}
                    fontWeight="400"
                    ml={2}
                  >
                    {noteText}
                  </Text>
                ) : null}
                {tagCount && !extraProps?.isReadOnly ? (
                  <Text
                    color={
                      values[name].length
                        ? (errors[name] && touched[name]) ||
                          values[name].length > wordLimit
                          ? 'brand.primary-red'
                          : 'brand.loco-grey-30'
                        : 'brand.loco-grey-30'
                    }
                    fontSize={'12px'}
                    fontWeight="400"
                    whiteSpace={'nowrap'}
                    style={{
                      marginInlineStart: '1rem',
                    }}
                  >
                    ({values[name].length}/{tagLimit}{' '}
                    {t('home.todayStream.selectedTags')})
                  </Text>
                ) : null}
                {wordCount && !extraProps?.isReadOnly ? (
                  <Text
                    color={
                      values[name].length
                        ? (errors[name] && touched[name]) ||
                          values[name].length > wordLimit
                          ? 'brand.primary-red'
                          : 'brand.loco-grey-30'
                        : 'brand.loco-grey-30'
                    }
                    fontSize={'14px'}
                    mx={2}
                  >
                    {values[name].length}/{wordLimit}
                  </Text>
                ) : null}
                {tooltipLabel && !extraProps?.isReadOnly ? (
                  <>
                    {inputType === 'countryPicker' ? (
                      <Text
                        display={['none', 'flex', 'flex']}
                        fontSize={'12px'}
                        color={'#A4A4A4'}
                        mx={1}
                        whiteSpace={'nowrap'}
                        fontWeight={400}
                      >
                        {t('timezone.countrySelectionRestriction')}
                      </Text>
                    ) : null}
                    <Tooltip
                      label={tooltipLabel}
                      display={['none', 'flex', 'flex']}
                      hasArrow
                      w="250px"
                      rounded={'12px'}
                      p="16px"
                      bg="#3A3A3A"
                      color="white"
                      fontSize="14px"
                      fontWeight={'600'}
                      placement="right"
                      zIndex={10000}
                      aria-label={tooltipLabel}
                    >
                      <Icon
                        //@ts-ignore
                        name="info"
                        size={'15px'}
                        display={['none', 'flex', 'flex']}
                      />
                    </Tooltip>
                    <Icon
                      //@ts-ignore
                      name="info"
                      size={'15px'}
                      display={['flex', 'none', 'none']}
                      onClick={onOpen}
                    />
                  </>
                ) : null}
              </Flex>
            </FormLabel>
          )}
          {renderComponent ? renderComponent : InputComponent}
          {errorComponent ? (
            errorComponent
          ) : touched[name] && errors[name] ? (
            <Box
              fontSize="12px"
              my={'8px'}
              lineHeight={'130%'}
              color="brand.primary-red"
            >
              <Box
                style={{
                  paddingInlineStart: '0.25rem',
                }}
              >
                {t(errors[name]) || errors[name]}
              </Box>
            </Box>
          ) : null}
        </FormControl>
        {isOpen && (
          <TooltipModal
            isOpen={isOpen}
            onClose={onClose}
            title={label}
            tooltipLabel={tooltipLabel}
          />
        )}
      </>
    )
  }
  return null
}

export default FormInput
