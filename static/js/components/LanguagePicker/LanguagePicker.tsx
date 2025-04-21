import { Box, Button, Flex, Grid, Icon, Text } from '@chakra-ui/core'
import isMobile from 'is-mobile'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../app/RootReducer'
import { isWebViewBuild } from '../../constent'
import { fetchLanguages } from '../../modules/Login/loginSlice'
import { CategoryPickerSkeleton } from '../CategoryPicker/CategorPickerSkeleton'

interface LanguagePickerProps {
  onChange: (args: any) => void
  isReadOnly?: boolean
}

export const LanguagePicker = (
  props: LanguagePickerProps | any
): JSX.Element => {
  const { onChange, value, isReadOnly } = props
  const dispatch = useDispatch()
  const { languages, languagesLoading } = useSelector(
    (state: RootState) => state.login
  )
  const updatedLanguages = useMemo(
    () =>
      languages.map((item: any) => ({
        ...item,
        value: item.locale,
      })),
    [languages]
  )
  const [noOfRows, setNoOfRows] = useState(1)
  const [languagesToShow, setLanguagesToShow] = useState<any>([])
  const [selectedOption, setSelecedOption] = useState<any>({})
  const [fakeLoading, setFakeLoading] = useState(false)
  const timerId = useRef<any>(null)
  const numberOfColumns = useRef<number>(isMobile() || isWebViewBuild ? 3 : 4)

  const { t } = useTranslation()

  const isLanguageFullyLoaded = useMemo(
    () =>
      updatedLanguages.length !== 0 &&
      languagesToShow.length !== 0 &&
      noOfRows ===
        Math.round(updatedLanguages.length / numberOfColumns.current),
    [updatedLanguages, languagesToShow, noOfRows]
  )

  useEffect(() => {
    if (updatedLanguages.length === 0) {
      dispatch(fetchLanguages())
    }
  }, [dispatch, updatedLanguages, updatedLanguages.length])

  useEffect(() => {
    if (updatedLanguages.length > 0) {
      setLanguagesToShow(() =>
        updatedLanguages.map((item: any) => ({ ...item, value: item.locale }))
      )
    }
  }, [updatedLanguages, updatedLanguages.length])

  const handleChange = (item: any) => {
    onChange(item)
    setSelecedOption(() => item)
  }

  const handleSetTimeout = () => {
    clearTimeout(timerId.current)
    setFakeLoading(() => true)
    timerId.current = setTimeout(() => {
      setFakeLoading(() => false)
      setNoOfRows((prev) => (isLanguageFullyLoaded ? 1 : prev + 1))
    }, 500)
  }

  const handleLoadMore = () => {
    if (isLanguageFullyLoaded) {
      setNoOfRows(() => 1)
      if (selectedOption?.value) {
        setLanguagesToShow(() => [
          selectedOption,
          ...updatedLanguages
            .slice(0, numberOfColumns.current * noOfRows)
            .filter((item) => item.value !== selectedOption.value),
        ])
      }
    } else {
      handleSetTimeout()
    }
  }

  const LanguageToShow = useCallback(() => {
    if (updatedLanguages.length > 0) {
      const selectedLanguage = updatedLanguages.find(
        (lang) => lang.locale === value
      )
      return (
        <Button
          key={selectedLanguage?.locale}
          backgroundColor={'brand.loco-primary'}
          flexShrink={1}
          outline={'none'}
          // border={'1px solid #3F4C6B'}
          borderRadius={'12px'}
          display={'inline-block'}
          fontSize={'12px'}
          // fontWeight={'light'}
          width={'max-content'}
          // height={'1.625rem'}
          color={'white'}
          fontWeight={700}
          textAlign={'center'}
          _hover={{
            background: 'brand.loco-primary',
          }}
          _active={{
            background: 'brand.loco-primary',
            outline: 'none',
          }}
          _focus={{
            background: 'brand.loco-primary',
            outline: 'none',
          }}
          opacity={0.6}
          isDisabled={true}
          cursor={'not-allowed'}
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            maxWidth: '100%',
            padding: '0.5rem 1rem',
          }}
          userSelect={'none'}
        >
          {selectedLanguage?.label}
        </Button>
      )
    }
    return <></>
  }, [value, updatedLanguages])

  return (
    <Box {...props} transition={'all 0.3s'}>
      <Flex
        width={'100%'}
        flexWrap={'wrap'}
        gridGap={'1rem'}
        transition={'all 0.3s'}
      >
        {languagesLoading || languagesToShow.length === 0 ? (
          <CategoryPickerSkeleton
            numberOfSkeleton={numberOfColumns.current}
            styles={{
              height: '2.5rem',
              width: '6rem',
              borderRadius: '12px',
              backgroundColor: '#1c1c1c',
            }}
          />
        ) : isReadOnly ? (
          <LanguageToShow />
        ) : (
          <>
            {languagesToShow?.map((item: any) => (
              <Button
                key={item.value}
                backgroundColor={
                  selectedOption?.value === item.value
                    ? 'brand.loco-primary'
                    : 'brand.loco-grey-6'
                }
                color={selectedOption?.value === item.value ? 'white' : 'white'}
                userSelect={'none'}
                margin={'0.25rem 0'}
                outline={'none'}
                // border={'1px solid #3F4C6B'}
                borderRadius={'12px'}
                display={'inline-block'}
                fontSize={'14px'}
                // fontWeight={'light'}
                width={'7rem'}
                // height={'1.625rem'}
                textAlign={'center'}
                _hover={{
                  background:
                    selectedOption?.value === item.value
                      ? 'brand.loco-primary'
                      : 'brand.loco-grey-6',
                }}
                _active={{
                  background:
                    selectedOption?.value === item.value
                      ? 'brand.loco-primary'
                      : 'brand.loco-grey-6',
                  outline: 'none',
                }}
                _focus={{
                  background:
                    selectedOption?.value === item.value
                      ? 'brand.loco-primary'
                      : 'brand.loco-grey-6',
                  outline: 'none',
                }}
                opacity={
                  selectedOption?.label && selectedOption?.value !== item.value
                    ? 0.6
                    : 1
                }
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: '100%',
                  padding: '0.5rem 1rem',
                }}
                fontWeight={selectedOption?.value === item.value ? 700 : 400}
                onClick={() => {
                  handleChange(item)
                }}
              >
                {item.label}
              </Button>
            ))}
          </>
        )}
      </Flex>
      {fakeLoading && (
        <Grid
          templateColumns={`repeat(${numberOfColumns.current}, 1fr)`}
          templateRows={'1fr'}
          gridGap={'1rem'}
          marginTop={'0.25rem'}
        >
          <CategoryPickerSkeleton
            numberOfSkeleton={numberOfColumns.current}
            styles={{
              height: '1.625rem',
              width: '7rem',
              borderRadius: '99px',
              backgroundColor: '#1c1c1c',
              zIndex: '50',
            }}
          />
        </Grid>
      )}
    </Box>
  )
}
