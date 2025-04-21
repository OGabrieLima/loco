import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/core'
import { t } from 'i18next'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const UploadComponent = ({
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
  const { t } = useTranslation()
  //@ts-ignore
  let input = null
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
    <Flex align="end" w="full" flexDir="column">
      {!filename && (
        <Button
          style={style}
          w="full"
          _focus={{
            borderColor: 'none',
          }}
          _hover={{
            backgroundColor: 'brand.primary-text-field',
          }}
          _active={{
            backgroundColor: 'brand.primary-text-field',
          }}
          bg="brand.primary-text-field"
          // backgroundImage={`repeating-linear-gradient(-12deg, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // }, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // } 9px, transparent 9px, transparent 20px, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // } 20px), repeating-linear-gradient(78deg, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // }, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // } 9px, transparent 9px, transparent 20px, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // } 20px), repeating-linear-gradient(168deg, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // }, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // } 9px, transparent 9px, transparent 20px, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // } 20px), repeating-linear-gradient(258deg, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // }, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // } 9px, transparent 9px, transparent 20px, ${
          //   errors && touched && errors[name] && touched[name]
          //     ? '#e02020'
          //     : '#B4B4B4'
          // } 20px)`}
          // backgroundSize={'1px 100%, 100% 1px, 1px 100% , 100% 1px'}
          // backgroundPosition={'0 0, 0 0, 100% 0, 0 100%'}
          // backgroundRepeat={'no-repeat'}
          border={
            errors[name] && touched && errors[name] && touched[name]
              ? '1px solid red'
              : '1px dashed #3A3A3A'
          }
          padding={['2.5rem', '2.8rem']}
          borderRadius={'4px'}
          loadingText={t('profile.updateProfile.uploading')}
          //@ts-ignore
          onClick={() => input.click()}
        >
          <Flex
            color="white"
            fontWeight="bold"
            w="full"
            justifyContent="center"
            alignItems="center"
            // flexDirection={'column'}
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
              <Text mr="0.5rem" color={'brand.loco-primary'}>
                {title}
              </Text>
              <Icon size="24px" name="attachment" />
            </Box>
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
        <Flex direction="column" justifyContent="center" w={'full'} mt={2}>
          <>
            <Box
              px="12px"
              py="10px"
              fontWeight="700"
              // border={'1px solid rgba(0, 0, 0, 1)'}
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
                minWidth={['100px']}
                height={['126px']}
                borderRadius={'8px'}
                border="1px solid #757575"
                alignItems={'center'}
                justifyContent="center"
              >
                <Icon name="video_upload_preview_icon" size="32px" />
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
                  color="brand.loco-primary"
                  fontWeight="bold"
                  backgroundColor={'none'}
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
                    size="24px"
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
