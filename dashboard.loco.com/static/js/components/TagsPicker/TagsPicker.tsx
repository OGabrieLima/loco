import { RootState } from '@app/RootReducer'
import { Box, Button, Flex, Text } from '@chakra-ui/core'
import { CategoryPickerSkeleton } from '@components/CategoryPicker/CategorPickerSkeleton'
import { fetchSpecificTags } from '@modules/Login/loginSlice'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type TagPickerProps = {
  onChange?: (value: any) => void
  values: any
  placeholder?: string
  errorComponent?: React.ReactNode
  tagLimit?: number
}

export const TagsPicker = ({
  onChange,
  values,
  placeholder,
  errorComponent,
  isReadOnly,
  tagLimit = 5,
}: TagPickerProps | any) => {
  const { specificTags, specificTagsLoading } = useSelector(
    (state: RootState) => state.login
  )
  const dispatch = useDispatch()
  const [tagsToShow, setTagsToShow] = useState<any>([])
  const [selectedOptions, setSelecedOptions] = useState<any>([])
  const defaultDataRef = useRef<any[]>([])

  useEffect(() => {
    if (specificTags && specificTags.length === 0) {
      dispatch(fetchSpecificTags())
    }
  }, [dispatch, specificTags])

  useEffect(() => {
    if (specificTags && specificTags.length > 0) {
      const newTags = specificTags?.filter((item) => item.tag_type === 30)
      defaultDataRef.current = newTags
      setTagsToShow(() => newTags)
    }
  }, [specificTags])

  useEffect(() => {
    if (!values['category'] || Object.keys(values['category']).length === 0)
      return
    const newCategory: any = values['category']
    const newTags = specificTags.filter((item) =>
      item.category_id
        ? item.category_id?.some((ctgry: string) => ctgry === newCategory?.uid)
        : false
    )
    setTagsToShow(() => [...defaultDataRef.current, ...newTags])
    setSelecedOptions(() => [])
    if (onChange) onChange([])
  }, [values['category']])

  const handleSelect = (option: any) => {
    const isAlreadyPresent = selectedOptions.some(
      (item: any) => item.tag_uid === option.tag_uid
    )
    const newOptions = isAlreadyPresent
      ? selectedOptions.filter((item: any) => item.tag_uid !== option.tag_uid)
      : [...selectedOptions, option]
    if (onChange) onChange(newOptions)
    setSelecedOptions(() => newOptions)
  }

  const TagsToShow = useCallback(() => {
    if (values['tags'] && values['tags'].length > 0)
      return values['tags'].map((tg: string) => (
        <Button
          key={tg}
          bg={'brand.loco-primary'}
          flexShrink={1}
          outline={'none'}
          // border={'1px solid #3F4C6B'}
          borderRadius={'12px'}
          display={'inline-block'}
          fontSize={'14px'}
          fontWeight={'700'}
          width={'max-content'}
          // height={'1.625rem'}
          textAlign={'center'}
          color={'white'}
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
          {tg}
        </Button>
      ))
    return <></>
  }, [values['tags']])

  return (
    <Box>
      <Text fontSize={'14px'} mb={'0.5rem'} color={'#D8D8D8'}>
        {/* {placeholder} */}
      </Text>
      <Flex flexWrap={'wrap'} gridGap={'1rem'} transition={'all 0.3s'}>
        {specificTagsLoading || tagsToShow.length === 0 ? (
          <CategoryPickerSkeleton
            numberOfSkeleton={3}
            styles={{
              height: '2.5rem',
              width: '6rem',
              borderRadius: '12px',
              backgroundColor: '#1c1c1c',
            }}
          />
        ) : isReadOnly && values['tags'] ? (
          <TagsToShow />
        ) : (
          <>
            {tagsToShow.map((tag: any) => (
              <Button
                key={tag.tag_uid}
                bg={
                  selectedOptions.includes(tag) ||
                  values?.tags?.includes(tag.display_name)
                    ? 'brand.loco-primary'
                    : 'brand.loco-grey-6'
                }
                color={
                  selectedOptions.includes(tag) ||
                  values?.tags?.includes(tag.display_name)
                    ? 'white'
                    : 'white'
                }
                userSelect={'none'}
                outline={'none'}
                // border={'1px solid #3F4C6B'}
                borderRadius={'12px'}
                fontSize={'14px'}
                width={'max-content'}
                // height={'1.625rem'}
                textAlign={'center'}
                display={'inline-block'}
                alignItems={'center'}
                justifyContent={'center'}
                _hover={{
                  background:
                    selectedOptions.some(
                      (item: any) => item.display_name === tag.display_name
                    ) || values?.tags?.includes(tag.display_name)
                      ? 'brand.loco-primary'
                      : 'brand.loco-grey-6',
                  outline: 'none',
                }}
                _focus={{
                  background:
                    selectedOptions.some(
                      (item: any) => item.display_name === tag.display_name
                    ) || values?.tags?.includes(tag.display_name)
                      ? 'brand.loco-primary'
                      : 'brand.loco-grey-6',
                  outline: 'none',
                }}
                _active={{
                  background:
                    selectedOptions.some(
                      (item: any) => item.display_name === tag.display_name
                    ) || values?.tags?.includes(tag.display_name)
                      ? 'brand.loco-primary'
                      : 'brand.loco-grey-6',
                }}
                isDisabled={
                  isReadOnly ||
                  (selectedOptions.length >= tagLimit &&
                    !selectedOptions.some(
                      (item: any) => item.display_name === tag.display_name
                    ))
                }
                _disabled={{
                  opacity: 0.6,
                }}
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: '100%',
                  padding: '0.5rem 1rem',
                  cursor:
                    selectedOptions.length >= tagLimit &&
                    !selectedOptions.some(
                      (item: any) => item.display_name === tag.display_name
                    )
                      ? 'not-allowed'
                      : 'pointer',
                }}
                fontWeight={
                  selectedOptions.includes(tag) ||
                  values?.tags?.includes(tag.display_name)
                    ? '700'
                    : '400'
                }
                onClick={() => {
                  handleSelect(tag)
                }}
              >
                {tag.display_name}
              </Button>
            ))}
          </>
        )}
      </Flex>
      {errorComponent ? errorComponent : null}
    </Box>
  )
}
