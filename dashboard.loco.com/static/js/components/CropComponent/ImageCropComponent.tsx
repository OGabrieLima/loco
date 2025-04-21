import 'react-image-crop/dist/ReactCrop.css'

import { Button, Flex, Text } from '@chakra-ui/core'
import { throttle } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactCrop, { Crop } from 'react-image-crop'

import { FullSpinnerPage } from '../FullSpinnerPage'

export interface ImageCropComponentProps {
  upImg: any
  handleCroppedImage: (croppedImage: any) => any
  loading?: boolean
  setLoading: (e: boolean) => any
  aspectRatio?: number
  cropObj: Crop
  fileType: string | undefined
  convertImgType?: 'image/png' | 'image/jpeg'
  canvasConfig?: {
    width: number
    height: number
  }
}

function getResizedCanvas(
  canvas: HTMLCanvasElement,
  newWidth: number | undefined,
  newHeight: number | undefined
) {
  const tmpCanvas = document.createElement('canvas')
  tmpCanvas.width = newWidth!
  tmpCanvas.height = newHeight!
  const ctx = tmpCanvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      newWidth!,
      newHeight!
    )
  }

  return tmpCanvas
}
function generateCroppedImage(
  previewCanvas: HTMLCanvasElement | null | undefined,
  crop: Crop | null,
  image: any,
  convertImgType?: 'image/png' | 'image/jpeg',
  canvasConfig?: {
    width: number
    height: number
  }
) {
  if (!crop || !previewCanvas) {
    return
  }

  const width = canvasConfig
    ? canvasConfig.width
    : (crop.width! / 100) * image.naturalWidth
  const height = canvasConfig
    ? canvasConfig.height
    : (crop.height! / 100) * image.naturalHeight
  const canvas = getResizedCanvas(previewCanvas, width, height)

  return canvas.toDataURL(convertImgType || 'image/jpeg', 0.8)
}
function ImageCropComponent({
  upImg,
  handleCroppedImage,
  loading,
  setLoading,
  aspectRatio,
  cropObj,
  fileType,
  convertImgType,
  canvasConfig,
}: ImageCropComponentProps): JSX.Element {
  const defaultCrop = {
    unit: '%',
    width: 100,
    aspect: aspectRatio === 0 ? 0 : aspectRatio || 16 / 9,
  }
  //@ts-ignore
  const [crop, setCrop] = useState<Crop>(cropObj || defaultCrop)
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const { t } = useTranslation()

  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const onLoad = useCallback((img: any) => {
    imgRef.current = img
    if (setLoading) {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return
    }

    const image: any = imgRef.current
    const canvas = previewCanvasRef.current as HTMLCanvasElement
    const crop: Crop = completedCrop
    canvas.width = canvasConfig
      ? canvasConfig.width
      : (crop.width! / 100) * image.naturalWidth
    canvas.height = canvasConfig
      ? canvasConfig.height
      : (crop.height! / 100) * image.naturalHeight

    const ctx = canvas.getContext('2d')

    ctx!.setTransform(1, 0, 0, 1, 0, 0)
    const startClipingX = (crop.x! / 100) * image.naturalWidth
    const startClipingY = (crop.y! / 100) * image.naturalHeight
    const clippedX = (crop.width! / 100) * image.naturalWidth
    const clippedY = (crop.height! / 100) * image.naturalHeight
    const finalWidth = canvasConfig
      ? canvasConfig.width
      : (crop.width! / 100) * image.naturalWidth
    const finalHeight = canvasConfig
      ? canvasConfig.height
      : (crop.height! / 100) * image.naturalHeight

    ctx!.drawImage(
      image,
      startClipingX,
      startClipingY,
      clippedX,
      clippedY,
      0,
      0,
      finalWidth,
      finalHeight
    )
  }, [completedCrop])

  const getCroppedImage = () => {
    const croppedImage = generateCroppedImage(
      previewCanvasRef.current,
      completedCrop,
      imgRef.current,
      convertImgType,
      canvasConfig
    )
    handleCroppedImage(croppedImage)
  }
  const debouncedSetCrop = useCallback(throttle(setCrop, 100), [])
  if (fileType) {
    setLoading(false)
  }

  return (
    <Flex direction="column">
      <Flex
        mb={8}
        w={'100%'}
        h={'15rem'}
        align="center"
        justify="center"
        overflow="hidden"
        bg="brand.loco-grey-7"
      >
        <ReactCrop
          src={upImg}
          ruleOfThirds={true}
          onImageLoaded={onLoad}
          imageStyle={{
            maxHeight: '15rem',
            objectFit: 'contain',
            margin: 'auto',
          }}
          crop={crop}
          onChange={(c, p) => {
            debouncedSetCrop({ ...p })
          }}
          onComplete={(c, p) => {
            setCompletedCrop({ ...p })
          }}
        />
        {loading ? <FullSpinnerPage bg="brand.primary-light-black-v4" /> : null}
      </Flex>
      {!(fileType === 'image/jpeg' || fileType === 'image/png') ? (
        <Text fontSize="12px" color="brand.primary-red" mb={8}>
          {t('onBoarding.profileSetup.imageError')}
        </Text>
      ) : (
        <>
          <Text fontSize="xs" fontWeight="black" opacity={0.8} mb={2}>
            {t('onBoarding.profileSetup.preview')}
          </Text>
          <Flex
            h="45px"
            maxW={aspectRatio === 1 ? '45px' : '80px'}
            rounded={aspectRatio === 1 ? 'none' : 'xs'}
            overflow="hidden"
            mb={4}
          >
            <canvas ref={previewCanvasRef} style={{ height: '100%' }} />
          </Flex>
        </>
      )}
      <Button
        isDisabled={!completedCrop?.width || !completedCrop?.height}
        onClick={getCroppedImage}
        rounded="10px"
        bg="brand.loco-primary"
        _hover={{
          bg: 'brand.loco-primary',
          color: 'black',
        }}
        _active={{
          bg: 'brand.loco-primary',
          color: 'black',
        }}
        _disabled={{
          bg: 'brand.primary-light-black-v3',
          color: 'black',
        }}
        color="white"
      >
        {t('onBoarding.profileSetup.done')}
      </Button>
    </Flex>
  )
}

export default ImageCropComponent
