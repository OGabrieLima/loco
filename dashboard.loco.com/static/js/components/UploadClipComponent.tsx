import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/core'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const UploadClipComponent = ({
  title,
  accept,
  style,
  name,
  onChange,
  errors,
  touched,
}: {
  name: string
  register?: any
  title: string
  accept: string
  style?: React.CSSProperties
  onChange?: (file?: File | null) => void
  errors?: any
  touched?: any
  isReadOnly?: boolean
  defaultStreamDetails?: any
  values?: any
}): JSX.Element => {
  //@ts-ignore
  let input = null
  const { t } = useTranslation()
  const [filename, setFileName] = useState<string | null>(null)
  const handleUploadFile = async (file?: File | null) => {
    if (file) {
      setFileName(file.name)
      if (onChange) {
        onChange(file)
      }
    } else {
      if (onChange) {
        onChange(null)
      }
      setFileName(null)
    }
  }
  return (
    <Flex w="full" flexDir="column">
      {!filename && (
        <Button
          style={style}
          w="full"
          _focus={{
            borderColor: 'none',
          }}
          bg="brand.primary-text-field"
          backgroundImage={`repeating-linear-gradient(-12deg, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          }, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          } 9px, transparent 9px, transparent 20px, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          } 20px), repeating-linear-gradient(78deg, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          }, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          } 9px, transparent 9px, transparent 20px, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          } 20px), repeating-linear-gradient(168deg, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          }, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          } 9px, transparent 9px, transparent 20px, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          } 20px), repeating-linear-gradient(258deg, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          }, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          } 9px, transparent 9px, transparent 20px, ${
            errors && touched && errors[name] && touched[name]
              ? '#e02020'
              : '#B4B4B4'
          } 20px)`}
          backgroundSize={'1px 100%, 100% 1px, 1px 100% , 100% 1px'}
          backgroundPosition={'0 0, 0 0, 100% 0, 0 100%'}
          backgroundRepeat={'no-repeat'}
          // border={'1px dashed'}
          // borderColor={
          //   errors && touched && errors[name] && touched[name]
          //     ? 'brand.primary-red'
          //     : '#B4B4B4'
          // }
          padding={['2.5rem', '2.8rem']}
          borderRadius={'4px'}
          variantColor="brand.primary-gray"
          loadingText="Uploading..."
          //@ts-ignore
          onClick={() => input.click()}
        >
          <Flex
            color="white"
            fontSize="xs"
            fontWeight="extrabold"
            w="full"
            justifyContent="center"
            alignItems="center"
            flexDirection={'column'}
          >
            <Box
              width={'2.5rem'}
              height={'2.5rem'}
              // bg={'brand.primary-blue'}
              // borderRadius={'50%'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Icon
                style={{
                  color: '#fff',
                }}
                name="attachment"
              />
            </Box>
            <Text mt={'0.5rem'}>{title}</Text>
          </Flex>
        </Button>
      )}
      <input
        hidden
        name={name}
        type="file"
        accept={accept}
        ref={(el) => (input = el)}
        onChange={(e) => {
          if (e && e.target && e.target.files && e.target.files[0]) {
            handleUploadFile(e.target.files[0])
          }
        }}
      />
      {filename && (
        <Flex direction="column" mt={2}>
          <>
            <Box
              px="12px"
              py="10px"
              fontSize={'14px'}
              fontWeight="600"
              border={'1px solid rgba(0, 0, 0, 1)'}
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: '100%',
              }}
              title={filename}
            >
              {filename}
            </Box>
            <Flex direction={'row'}>
              <Box
                display={'flex'}
                mt={3}
                width={['220px']}
                height={['126px']}
                borderRadius={'4px'}
                border="1px solid #4D4D4D"
                alignItems={'center'}
                justifyContent="center"
              >
                <Image
                  src="/static/images/thumbnail-placeholder.svg"
                  alt="thumbnail-placeholder"
                />
              </Box>
              <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent="center"
                ml={8}
                //@ts-ignore
                onClick={() => input.click()}
              >
                <Button
                  color="white"
                  fontSize="xs"
                  fontWeight="extrabold"
                  backgroundColor={'none'}
                  textTransform={'uppercase'}
                  _hover={{
                    bg: 'none',
                  }}
                  _active={{
                    bg: 'none',
                    border: 'none',
                  }}
                >
                  {t('clips.uploadForm.changeVideo')}

                  <Icon
                    style={{
                      marginInlineStart: '10px',
                    }}
                    name="attachment"
                  />
                </Button>
              </Box>
              <input
                hidden
                name={name}
                type="file"
                accept={accept}
                ref={(el) => (input = el)}
                onChange={(e) => {
                  if (e && e.target && e.target.files && e.target.files[0]) {
                    handleUploadFile(e.target.files[0])
                  }
                }}
              />
            </Flex>
          </>
        </Flex>
      )}
    </Flex>
  )
}
