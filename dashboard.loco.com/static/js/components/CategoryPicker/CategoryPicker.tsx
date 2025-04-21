import { Box, Button, Flex, Icon, Text } from '@chakra-ui/core'
import isMobile from 'is-mobile'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../app/RootReducer'
import { isWebViewBuild } from '../../constent'
import { fetchGames, fetchSpecificGames } from '../../modules/Login/loginSlice'
import { CategoryPickerSkeleton } from './CategorPickerSkeleton'

interface CategoryPickerProps {
  onChange: (args: any) => void
  label?: string
}

export const CategoryPicker = (
  props: CategoryPickerProps | any
): JSX.Element => {
  const dispatch = useDispatch()
  const { onChange, value, isReadOnly } = props
  const { specificGames, specificGamesLoading } = useSelector(
    (state: RootState) => state.login
  )
  const [noOfRows, setNoOfRows] = useState(1)
  const [gamesToShow, setGamesToShow] = useState<any>([])
  const [selectedOption, setSelecedOption] = useState<any>({})
  const [fakeLoading, setFakeLoading] = useState(false)
  const timerId = useRef<any>(null)
  const numberOfColumns = useRef<number>(isMobile() || isWebViewBuild ? 4 : 6)

  const { t } = useTranslation()

  const isCategoryFullyLoaded = useMemo(
    () =>
      specificGames.length !== 0 &&
      gamesToShow.length !== 0 &&
      gamesToShow.length === specificGames.length,
    [specificGames, gamesToShow]
  )

  useEffect(() => {
    if (specificGames.length === 0) {
      dispatch(fetchSpecificGames())
      dispatch(fetchGames())
    }
  }, [dispatch, specificGames, specificGames.length])

  useEffect(() => {
    if (specificGames.length > 0) {
      setGamesToShow(() =>
        gamesToShow.length === specificGames.length
          ? selectedOption?.uid
            ? [
                selectedOption,
                ...specificGames
                  .slice(0, numberOfColumns.current - 1)
                  .filter((it) => it.uid !== selectedOption.uid),
              ]
            : specificGames.slice(0, numberOfColumns.current)
          : selectedOption?.uid && gamesToShow[0]?.uid === selectedOption?.uid
          ? [
              selectedOption,
              ...specificGames
                .slice(0, numberOfColumns.current * noOfRows)
                .filter((it) => it.uid !== selectedOption.uid),
            ]
          : specificGames.slice(0, numberOfColumns.current * noOfRows)
      )
    }
  }, [specificGames, specificGames.length, noOfRows])

  const handleChange = (item: any) => {
    onChange(item)
    setSelecedOption(() => item)
  }

  const handleSetTimeout = () => {
    clearTimeout(timerId.current)
    setFakeLoading(() => true)
    timerId.current = setTimeout(() => {
      setFakeLoading(() => false)
      setNoOfRows((prev) => (isCategoryFullyLoaded ? 1 : prev + 1))
    }, 500)
  }

  const handleLoadMore = () => {
    if (isCategoryFullyLoaded) {
      setNoOfRows(() => 1)
    } else {
      handleSetTimeout()
    }
  }

  const CategoryToShow = useCallback(() => {
    if (specificGames.length > 0) {
      const selectedGame = specificGames.find((game) => game.uid === value)
      return (
        <Button
          key={selectedGame?.uid}
          backgroundColor={'brand.loco-primary'}
          flexShrink={1}
          outline={'none'}
          border={'1px solid #3F4C6B'}
          borderRadius={'12px'}
          display={'inline-block'}
          fontSize={'14px'}
          // fontWeight={'700'}
          width={'max-content'}
          // height={'1.625rem'}
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
          color={'white'}
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
          {selectedGame?.label}
        </Button>
      )
    }
    return <></>
  }, [value, specificGames])

  return (
    <Box {...props} transition={'all 0.3s'}>
      <Flex
        // templateColumns={`repeat(${numberOfColumns.current}, 1fr)`}
        // templateRows={`repeat(${noOfRows}, 1fr)`}
        width={'100%'}
        flexWrap={'wrap'}
        gridGap={'1rem'}
        transition={'all 0.3s'}
      >
        {specificGamesLoading || gamesToShow.length === 0 ? (
          <CategoryPickerSkeleton
            numberOfSkeleton={numberOfColumns.current}
            styles={{
              height: '2.5rem',
              width: '6rem',
              borderRadius: '12px',
              backgroundColor: '#1c1c1c',
            }}
          />
        ) : isReadOnly && value ? (
          <CategoryToShow />
        ) : (
          <>
            {gamesToShow.map((item: any) => (
              <Button
                key={item.uid}
                backgroundColor={
                  selectedOption?.uid === item.uid ||
                  value === item.category_id?.[0]
                    ? 'brand.loco-primary'
                    : 'brand.loco-grey-6'
                }
                fontWeight={
                  selectedOption?.uid === item.uid ||
                  value === item.category_id?.[0]
                    ? '700'
                    : '400'
                }
                color={
                  selectedOption?.uid === item.uid ||
                  value === item.category_id?.[0]
                    ? 'white'
                    : 'white'
                }
                flexShrink={1}
                outline={'none'}
                // border={'1px solid #3F4C6B'}
                borderRadius={'12px'}
                display={'inline-block'}
                fontSize={'14px'}
                width={'max-content'}
                // height={'1.625rem'}
                lineHeight={'18.16px'}
                textAlign={'center'}
                _hover={{
                  background:
                    selectedOption?.uid === item.uid ||
                    value === item.category_id?.[0]
                      ? 'brand.loco-primary'
                      : 'brand.loco-grey-6',
                }}
                _active={{
                  background:
                    selectedOption?.uid === item.uid ||
                    value === item.category_id?.at(0)
                      ? 'brand.loco-primary'
                      : 'brand.loco-grey-6',
                  outline: 'none',
                }}
                _focus={{
                  background:
                    selectedOption?.uid === item.uid ||
                    value === item.category_id?.[0]
                      ? 'brand.loco-primary'
                      : 'brand.loco-grey-6',
                  outline: 'none',
                }}
                opacity={
                  (selectedOption?.uid && selectedOption?.uid !== item.uid) ||
                  value === item.category_id?.[0]
                    ? 0.6
                    : 1
                }
                isDisabled={isReadOnly}
                cursor={isReadOnly ? 'not-allowed' : 'pointer'}
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: '100%',
                  padding: '0.5rem 1rem',
                }}
                userSelect={'none'}
                onClick={() => {
                  handleChange(item)
                }}
              >
                {item.label}
              </Button>
            ))}
          </>
        )}
        {fakeLoading && (
          <CategoryPickerSkeleton
            numberOfSkeleton={numberOfColumns.current}
            styles={{
              height: '1.625rem',
              width: '4.25rem',
              borderRadius: '99px',
              backgroundColor: '#1c1c1c',
            }}
          />
        )}
      </Flex>
      {!isReadOnly && (
        <Text
          background={'none'}
          fontSize={'0.75rem'}
          outline={'none'}
          margin={'0 auto'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          mt={'0.5rem'}
          fontWeight={700}
          cursor={isReadOnly ? 'not-allowed' : 'pointer'}
          opacity={isReadOnly ? 0.6 : 1}
          onClick={() => {
            if (!isReadOnly) handleLoadMore()
          }}
        >
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            width={6}
            height={6}
            backgroundColor={'brand.loco-primary'}
            borderRadius={'4px'}
            mr={'5px'}
          >
            {isCategoryFullyLoaded ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 15L12 9L5 15"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </Box>
          {isCategoryFullyLoaded
            ? t('clips.uploadForm.showLess')
            : t('clips.uploadForm.loadMore')}{' '}
        </Text>
      )}
    </Box>
  )
}
