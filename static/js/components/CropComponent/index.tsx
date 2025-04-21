import {
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  Image as ChakraImage,
  ImageProps,
  useDisclosure,
} from '@chakra-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Crop } from 'react-image-crop'

import {
  ApiContext,
  streamDetailsInterface,
} from '../../context/ApiConnector/types'
import { dataURItoBlob } from '../../utils/dataURIoBlob'
import ModalCropComponent from './ModalCropComponent'

export interface CropComponentProps {
  title: string
  isStickerComp?: boolean
  accept: string | undefined
  buttonStyle?: React.CSSProperties | undefined
  name: string
  onChange: (e: any) => any
  values: any
  defaultStreamDetails?:
    | ApiContext['defaultStreamDetails']
    | streamDetailsInterface
    | null
  errors: any
  touched: any
  isReadOnly?: boolean
  hidePreview?: boolean
  aspectRatio?: number
  titleStyleProp?: FlexProps
  buttonProps?: ButtonProps
  cropObj?: Crop
  convertImgType?: 'image/png' | 'image/jpeg'
  imageStyleProps?: ImageProps
  onFocus?: any
  canvasConfig?: {
    width: number
    height: number
  }
}

function CropComponent(props: CropComponentProps) {
  const {
    title,
    accept,
    isStickerComp,
    buttonStyle,
    name,
    onChange,
    values,
    defaultStreamDetails,
    titleStyleProp,
    errors,
    touched,
    isReadOnly,
    hidePreview,
    aspectRatio,
    buttonProps,
    cropObj,
    convertImgType,
    canvasConfig,
    imageStyleProps,
  } = props
  const { t } = useTranslation()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const inputRef = useRef()
  const [upImg, setUpImg] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [croppedImage, setCroppedImage] = useState()
  const [fileType, setFileType] = useState()

  const onSelectFile = (e: any) => {
    setFileType(e.target.files[0].type)

    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.onload = () => {
        const image: HTMLImageElement = new Image()
        //@ts-ignore
        image.src = reader.result
        setUpImg(reader.result)
      }
      reader.readAsDataURL(e.target.files[0])
      //@ts-ignore
      inputRef.current.value = null
    }
  }
  useEffect(() => {
    if (upImg) {
      onOpen()
      setLoading(true)
    }
  }, [upImg])
  const closeModal = () => {
    setUpImg(null)
    onClose()
  }
  const handleCroppedImage = (croppedImage: any) => {
    if (croppedImage) {
      setCroppedImage(croppedImage)
      const blob = dataURItoBlob(croppedImage)
      onChange(blob)
    } else {
      setCroppedImage(undefined)
      onChange(null)
    }
  }

  return (
    <>
      <input
        //@ts-ignore
        ref={inputRef}
        hidden
        type="file"
        accept={accept}
        onChange={onSelectFile}
      />
      {((!(values && values[name]) &&
        //@ts-ignore
        (defaultStreamDetails?.thumbnail ||
          //@ts-ignore
          defaultStreamDetails?.thumbnail_url_small)) ||
        croppedImage) &&
      !hidePreview ? (
        <Flex
          display="flex"
          flexWrap="wrap"
          w="full"
          borderRadius={'4px'}
          justifyContent="space-between"
          direction="row"
          align="center"
          flex={2}
          py={2}
          style={buttonStyle}
          className={
            isStickerComp
              ? errors && touched && errors[name] && touched[name]
                ? 'dottedButtonClsxLocoError'
                : undefined
              : undefined
          }
        >
          <ChakraImage
            flex={1}
            src={
              croppedImage ||
              //@ts-ignorẻ
              defaultStreamDetails?.thumbnail ||
              //@ts-ignorẻ
              defaultStreamDetails?.thumbnail_url_small
            }
            objectFit="contain"
            w="50%"
            rounded={'8px'}
            overflow="hidden"
            {...imageStyleProps}
          />

          <Flex flex={1} justify="center">
            {!isReadOnly && (
              <Flex
                color="brand.loco-primary"
                fontSize="14px"
                fontWeight="extrabold"
                cursor="pointer"
                justifyContent="center"
                align="center"
                marginLeft={4}
                //@ts-ignore
                onClick={() => inputRef.current.click()}
                {...titleStyleProp}
              >
                {!isStickerComp ? null : (
                  <svg
                    style={{
                      marginRight: '12px',
                    }}
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 16.25C12.4142 16.25 12.75 15.9142 12.75 15.5V4.52744L14.4306 6.48809C14.7001 6.80259 15.1736 6.83901 15.4881 6.56944C15.8026 6.29988 15.839 5.8264 15.5694 5.51191L12.5694 2.01191C12.427 1.84567 12.2189 1.75 12 1.75C11.7811 1.75 11.573 1.84567 11.4306 2.01191L8.43056 5.51191C8.16099 5.8264 8.19741 6.29988 8.51191 6.56944C8.8264 6.83901 9.29988 6.80259 9.56944 6.48809L11.25 4.52744L11.25 15.5C11.25 15.9142 11.5858 16.25 12 16.25Z"
                      fill="#FF5A12"
                    />
                    <path
                      d="M16 9.5C15.2978 9.5 14.9467 9.5 14.6945 9.66851C14.5853 9.74148 14.4915 9.83525 14.4186 9.94446C14.25 10.1967 14.25 10.5478 14.25 11.25L14.25 15.5C14.25 16.7426 13.2427 17.75 12 17.75C10.7574 17.75 9.75004 16.7426 9.75004 15.5L9.75004 11.25C9.75004 10.5478 9.75004 10.1966 9.58149 9.9444C9.50854 9.83523 9.41481 9.7415 9.30564 9.66855C9.05341 9.5 8.70227 9.5 8 9.5C5.17157 9.5 3.75736 9.5 2.87868 10.3787C2 11.2574 2 12.6714 2 15.4998V16.4998C2 19.3282 2 20.7424 2.87868 21.6211C3.75736 22.4998 5.17157 22.4998 8 22.4998H16C18.8284 22.4998 20.2426 22.4998 21.1213 21.6211C22 20.7424 22 19.3282 22 16.4998V15.4998C22 12.6714 22 11.2574 21.1213 10.3787C20.2426 9.5 18.8284 9.5 16 9.5Z"
                      fill="#FF5A12"
                    />
                  </svg>
                )}
                {title || t('profile.changeThumbnailText')}{' '}
                {isStickerComp ? null : (
                  <svg
                    style={{
                      marginLeft: '12px',
                    }}
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 16.25C12.4142 16.25 12.75 15.9142 12.75 15.5V4.52744L14.4306 6.48809C14.7001 6.80259 15.1736 6.83901 15.4881 6.56944C15.8026 6.29988 15.839 5.8264 15.5694 5.51191L12.5694 2.01191C12.427 1.84567 12.2189 1.75 12 1.75C11.7811 1.75 11.573 1.84567 11.4306 2.01191L8.43056 5.51191C8.16099 5.8264 8.19741 6.29988 8.51191 6.56944C8.8264 6.83901 9.29988 6.80259 9.56944 6.48809L11.25 4.52744L11.25 15.5C11.25 15.9142 11.5858 16.25 12 16.25Z"
                      fill="#FF5A12"
                    />
                    <path
                      d="M16 9.5C15.2978 9.5 14.9467 9.5 14.6945 9.66851C14.5853 9.74148 14.4915 9.83525 14.4186 9.94446C14.25 10.1967 14.25 10.5478 14.25 11.25L14.25 15.5C14.25 16.7426 13.2427 17.75 12 17.75C10.7574 17.75 9.75004 16.7426 9.75004 15.5L9.75004 11.25C9.75004 10.5478 9.75004 10.1966 9.58149 9.9444C9.50854 9.83523 9.41481 9.7415 9.30564 9.66855C9.05341 9.5 8.70227 9.5 8 9.5C5.17157 9.5 3.75736 9.5 2.87868 10.3787C2 11.2574 2 12.6714 2 15.4998V16.4998C2 19.3282 2 20.7424 2.87868 21.6211C3.75736 22.4998 5.17157 22.4998 8 22.4998H16C18.8284 22.4998 20.2426 22.4998 21.1213 21.6211C22 20.7424 22 19.3282 22 16.4998V15.4998C22 12.6714 22 11.2574 21.1213 10.3787C20.2426 9.5 18.8284 9.5 16 9.5Z"
                      fill="#FF5A12"
                    />
                  </svg>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      ) : (
        <Button
          w="full"
          variant="outline"
          _focus={{
            borderColor: 'none',
          }}
          className={
            isStickerComp
              ? errors && touched && errors[name] && touched[name]
                ? 'dottedButtonClsxLocoError'
                : 'dottedButtonClsxLocoGreyTExt'
              : undefined
          }
          bg={isStickerComp ? 'transparent' : '#282828'}
          border={
            isStickerComp
              ? errors && touched && errors[name] && touched[name]
                ? '1px'
                : 'none'
              : errors && touched && errors[name] && touched[name]
              ? '1px'
              : 'none'
          }
          borderColor={
            errors && touched && errors[name] && touched[name]
              ? 'brand.loco-error'
              : 'none'
          }
          borderRadius={'10px'}
          variantColor="brand.primary-gray"
          loadingText={t('profile.updateProfile.uploading')}
          minH={'48px'}
          onClick={() => {
            if (typeof props?.onFocus === 'function') {
              props?.onFocus()
            }
            //@ts-ignore
            inputRef.current.click()
          }}
          {...buttonProps}
          style={buttonStyle}
        >
          <Flex
            color="brand.loco-primary"
            fontSize="16px"
            fontWeight="700"
            w="full"
            alignItems={'center'}
            justifyContent="center"
            {...titleStyleProp}
          >
            {isStickerComp ? (
              <svg
                style={{
                  marginRight: '12px',
                }}
                width="20"
                height="20"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 16.25C12.4142 16.25 12.75 15.9142 12.75 15.5V4.52744L14.4306 6.48809C14.7001 6.80259 15.1736 6.83901 15.4881 6.56944C15.8026 6.29988 15.839 5.8264 15.5694 5.51191L12.5694 2.01191C12.427 1.84567 12.2189 1.75 12 1.75C11.7811 1.75 11.573 1.84567 11.4306 2.01191L8.43056 5.51191C8.16099 5.8264 8.19741 6.29988 8.51191 6.56944C8.8264 6.83901 9.29988 6.80259 9.56944 6.48809L11.25 4.52744L11.25 15.5C11.25 15.9142 11.5858 16.25 12 16.25Z"
                  fill="#FF5A12"
                />
                <path
                  d="M16 9.5C15.2978 9.5 14.9467 9.5 14.6945 9.66851C14.5853 9.74148 14.4915 9.83525 14.4186 9.94446C14.25 10.1967 14.25 10.5478 14.25 11.25L14.25 15.5C14.25 16.7426 13.2427 17.75 12 17.75C10.7574 17.75 9.75004 16.7426 9.75004 15.5L9.75004 11.25C9.75004 10.5478 9.75004 10.1966 9.58149 9.9444C9.50854 9.83523 9.41481 9.7415 9.30564 9.66855C9.05341 9.5 8.70227 9.5 8 9.5C5.17157 9.5 3.75736 9.5 2.87868 10.3787C2 11.2574 2 12.6714 2 15.4998V16.4998C2 19.3282 2 20.7424 2.87868 21.6211C3.75736 22.4998 5.17157 22.4998 8 22.4998H16C18.8284 22.4998 20.2426 22.4998 21.1213 21.6211C22 20.7424 22 19.3282 22 16.4998V15.4998C22 12.6714 22 11.2574 21.1213 10.3787C20.2426 9.5 18.8284 9.5 16 9.5Z"
                  fill="#FF5A12"
                />
              </svg>
            ) : null}
            {title}
            {isStickerComp ? null : (
              <svg
                style={{
                  marginLeft: '12px',
                }}
                width="20"
                height="20"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 16.25C12.4142 16.25 12.75 15.9142 12.75 15.5V4.52744L14.4306 6.48809C14.7001 6.80259 15.1736 6.83901 15.4881 6.56944C15.8026 6.29988 15.839 5.8264 15.5694 5.51191L12.5694 2.01191C12.427 1.84567 12.2189 1.75 12 1.75C11.7811 1.75 11.573 1.84567 11.4306 2.01191L8.43056 5.51191C8.16099 5.8264 8.19741 6.29988 8.51191 6.56944C8.8264 6.83901 9.29988 6.80259 9.56944 6.48809L11.25 4.52744L11.25 15.5C11.25 15.9142 11.5858 16.25 12 16.25Z"
                  fill="#FF5A12"
                />
                <path
                  d="M16 9.5C15.2978 9.5 14.9467 9.5 14.6945 9.66851C14.5853 9.74148 14.4915 9.83525 14.4186 9.94446C14.25 10.1967 14.25 10.5478 14.25 11.25L14.25 15.5C14.25 16.7426 13.2427 17.75 12 17.75C10.7574 17.75 9.75004 16.7426 9.75004 15.5L9.75004 11.25C9.75004 10.5478 9.75004 10.1966 9.58149 9.9444C9.50854 9.83523 9.41481 9.7415 9.30564 9.66855C9.05341 9.5 8.70227 9.5 8 9.5C5.17157 9.5 3.75736 9.5 2.87868 10.3787C2 11.2574 2 12.6714 2 15.4998V16.4998C2 19.3282 2 20.7424 2.87868 21.6211C3.75736 22.4998 5.17157 22.4998 8 22.4998H16C18.8284 22.4998 20.2426 22.4998 21.1213 21.6211C22 20.7424 22 19.3282 22 16.4998V15.4998C22 12.6714 22 11.2574 21.1213 10.3787C20.2426 9.5 18.8284 9.5 16 9.5Z"
                  fill="#FF5A12"
                />
              </svg>
            )}
          </Flex>
        </Button>
      )}
      <ModalCropComponent
        isOpen={isOpen}
        onClose={closeModal}
        upImg={upImg}
        loading={loading}
        setLoading={setLoading}
        handleCroppedImage={handleCroppedImage}
        aspectRatio={aspectRatio}
        cropObj={cropObj}
        fileType={fileType}
        convertImgType={convertImgType}
        canvasConfig={canvasConfig}
      />
    </>
  )
}

export default CropComponent
//
