import { Box, Flex, Icon, Image, Input, Text } from '@chakra-ui/core'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const PickerWithSearch = (props: any) => {
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false)
  const { value, placeholder } = props
  const isShowPlaceholder = !value
  const options: any[] = Array.isArray(props?.extraProps?.options)
    ? props?.extraProps?.options
    : []

  const item: any = options.filter(
    (item) => item?.value && value && item.value === value
  )[0]
  return (
    <Box position={'relative'}>
      {/* <input
        name={props.name}
        style={{
          position: 'absolute',
          zIndex: -1,

          //   display: 'none',
          height: '0px',
          width: '0px',
          opacity: 0,
        }}
        onFocus={(e) => {
          e.preventDefault()
          e.currentTarget.blur()
          setIsOptionsOpen(true)
        }}
      /> */}
      <Box
        position={'relative'}
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
        color={isShowPlaceholder ? '#808080' : 'white'}
        pl={[4, 4]}
        h={12}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        cursor={'pointer'}
        onClick={() => {
          setIsOptionsOpen((x) => !x)
          if (isOptionsOpen && typeof props?.onBlur === 'function') {
            props.onBlur()
          }
        }}
      >
        {isShowPlaceholder ? (
          <Text>{placeholder}</Text>
        ) : item ? (
          <Flex alignItems="center" justifyContent="space-between">
            <Flex gridGap={'10px'} alignItems={'center'}>
              {item.image ? (
                <Image
                  src={item.image}
                  alt="country-image"
                  height="24px"
                  width="24px"
                  marginRight="5px"
                />
              ) : // item.leftComp ? (
              //   <Box>{item.leftComp}</Box>
              // )
              //  :
              null}
              {item.full_name || item.label}
            </Flex>
            {/* {item.rightComp ? <Box>{item.rightComp}</Box> : null} */}
          </Flex>
        ) : (
          placeholder
        )}
        <Flex position={'absolute'} right={0} mr="12px" my="auto">
          <Icon name="downArrowGrey30" size="24px" />
        </Flex>
      </Box>
      {isOptionsOpen ? (
        <ShowOptions
          {...props}
          onClose={() => {
            if (typeof props?.onBlur === 'function') {
              props.onBlur()
            }
            setIsOptionsOpen(false)
          }}
          onSuccess={(item: any) => {
            if (typeof props?.onChange === 'function') {
              props.onChange(item)
            }
            setIsOptionsOpen(false)
          }}
        />
      ) : null}
    </Box>
  )
}

const ShowOptions = (props: any) => {
  const htmlElem = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState(150)

  const sectionTitle =
    props?.extraProps?.optionTitle === false
      ? ''
      : props?.extraProps?.optionTitle || props?.placeholder
  const isHideSearchPanel = props?.extraProps?.optionSearch === false
  const options: any[] = Array.isArray(props?.extraProps?.options)
    ? props?.extraProps?.options
    : []
  const { t } = useTranslation()

  const DataNodeText = useMemo(
    () =>
      options?.map((item) =>
        (
          (item?.full_name || '') +
          (item?.label || '') +
          (item?.value || '') +
          (typeof item?.rightComp === 'string' ||
          typeof item?.rightComp === 'number'
            ? item?.rightComp
            : '') +
          (typeof item?.leftComp === 'string' ||
          typeof item?.leftComp === 'number'
            ? item?.leftComp
            : '')
        ).toLowerCase()
      ),
    []
  )

  useEffect(() => {
    const onClick = (e: any) => {
      const parentElem = htmlElem.current
      if (parentElem && parentElem.contains(e.target)) {
        // Clicked in box
      } else {
        setTimeout(() => {
          props.onClose()
        }, 50)
        // Clicked outside the box
      }
    }
    window.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('mousedown', onClick)
    }
  }, [])

  // useEffect(() => {
  //   const onWindowResize = () => {
  //     const element = htmlElem.current

  //     if (!element) return
  //     const rect = element.getBoundingClientRect()
  //     const top = rect.top
  //     const maxHeight = Math.min(window.innerHeight - top - 200, 250)
  //     if (maxHeight < 120) {
  //       const bottom = rect.bottom
  //       const maxHeightFromBottom = Math.min(
  //         window.innerHeight - bottom - 250,
  //         250
  //       )
  //       if (maxHeight < 110) {
  //         // Still short, show at bottom with any height available
  //         element.style.bottom = 'initial'
  //         element.style.top = '55px'
  //         setMaxHeight(maxHeight)
  //       } else {
  //         element.style.bottom = '55px'
  //         element.style.top = 'initial'
  //         // Revert the modal to top
  //         setMaxHeight(maxHeightFromBottom)
  //       }
  //     } else {
  //       element.style.bottom = 'initial'
  //       element.style.top = '55px'
  //       setMaxHeight(maxHeight)
  //       // make modal to show in bottom section only
  //     }
  //   }
  //   window.addEventListener('resize', onWindowResize)
  //   onWindowResize()
  //   return () => {
  //     window.removeEventListener('resize', onWindowResize)
  //   }
  // }, [])

  return (
    <Box
      ref={htmlElem}
      position={'absolute'}
      top="55px"
      width={'100%'}
      // minH={'100px'}
      bg={'#282828'}
      zIndex={10000}
      rounded={'8px'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Flex
        flex={'1'}
        flexDirection={'column'}
        w="100%"
        px={'10px'}
        pt={'20px'}
        pb={'4px'}
        gridGap={'12px'}
        fontSize={'16px'}
        fontWeight={'400'}
      >
        {sectionTitle ? <Flex my={'-2px'}>{sectionTitle}</Flex> : null}
        {isHideSearchPanel ? null : (
          <Flex borderBottom={'1px solid #B2B2B2'} mb="10px">
            <Input
              placeholder={t('otpless_v3.searchPlaceholder')}
              fontSize={'14px'}
              bg={'transparent'}
              outline={'none'}
              border={'none'}
              h={'auto'}
              p={'4px 0'}
              onChange={(e) => {
                const value = (e.currentTarget.value || '')
                  .toLowerCase()
                  .replace(/[^a-zA-Z0-9]+/g, '')

                const AllList = document.getElementsByClassName(
                  'country-code-list-123'
                )
                // @ts-ignore
                const itemList = [...AllList]
                itemList.forEach((item: HTMLDivElement, index) => {
                  const DataText = DataNodeText[index]
                  if (!value || DataText.match(new RegExp(value, 'i'))) {
                    item.style.display = 'flex'
                  } else {
                    item.style.display = 'none'
                  }
                })
              }}
              _focus={{
                bg: 'transparent',
                outline: 'none',
                border: 'none',
              }}
              _hover={{
                bg: 'transparent',
                outline: 'none',
                border: 'none',
              }}
              _disabled={{
                bg: 'transparent',
                outline: 'none',
                border: 'none',
              }}
              _active={{
                bg: 'transparent',
                outline: 'none',
                border: 'none',
              }}
            />
          </Flex>
        )}
        <Flex
          maxH={maxHeight + 'px'} //['25vh', '150px']}
          overflow={'auto'}
          flexDirection={'column'}
          w="100%"
        >
          {options.length === 0 ? (
            <>
              <Text
                w="100%"
                gridGap={'10px'}
                pr={'10px'}
                fontSize={'12px'}
                fontWeight={'400'}
                opacity={0.75}
              >
                No Options
              </Text>
            </>
          ) : (
            <></>
          )}
          {options.map((item, index) => {
            return (
              <Flex
                className="country-code-list-123"
                cursor={'pointer'}
                alignItems="center"
                justifyContent="space-between"
                w="100%"
                mb={'20px'}
                gridGap={'10px'}
                key={index}
                pr={'10px'}
                fontSize={'12px'}
                fontWeight={'400'}
                onClick={() => {
                  props.onSuccess(item)
                }}
              >
                <Flex gridGap={'10px'} alignItems={'center'}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt="country-image"
                      height="24px"
                      width="24px"
                      marginRight="5px"
                    />
                  ) : item.leftComp ? (
                    <Box>{item.leftComp}</Box>
                  ) : null}
                  {item.full_name || item.label}
                </Flex>
                {item.rightComp ? <Box>{item.rightComp}</Box> : null}
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    </Box>
  )
}

export default PickerWithSearch
