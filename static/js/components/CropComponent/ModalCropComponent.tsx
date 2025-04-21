import React from 'react'
import { Crop } from 'react-image-crop'

import NewModal from '../NewModal'
import ImageCropComponent from './ImageCropComponent'

export interface ModalCropComponentProps {
  isOpen: boolean
  onClose: () => any
  upImg: any
  handleCroppedImage: (croppedImage: any) => any
  loading?: boolean
  setLoading: (v: boolean) => any
  aspectRatio?: number
  cropObj?: Crop
  fileType?: string
  convertImgType?: 'image/png' | 'image/jpeg'
  canvasConfig?: {
    width: number
    height: number
  }
}

function ModalCropComponent({
  isOpen,
  onClose,
  upImg,
  handleCroppedImage,
  loading,
  setLoading,
  aspectRatio,
  cropObj,
  fileType,
  convertImgType,
  canvasConfig,
}: ModalCropComponentProps) {
  const handleCropAndClose = (croppedImage: any) => {
    handleCroppedImage(croppedImage)
    onClose()
  }
  return (
    <NewModal
      isOpen={isOpen}
      onClose={onClose}
      modalSize={['full', 'md']}
      isCentered={true}
      scrollBehaviour="outside"
      modalOverlayStyle={{
        zIndex: 1400,
      }}
      modalContentStyle={{
        bg: ['brand.primary-light-black-v4'],
        width: '700px',
      }}
      modalHeaderStyle={{
        px: 0,
        pb: 0,
      }}
      modalBodyStyle={{
        py: [6, 8],
        px: [4, 8],
      }}
      modalBodyComponent={
        <ImageCropComponent
          upImg={upImg}
          handleCroppedImage={handleCropAndClose}
          loading={loading}
          setLoading={setLoading}
          aspectRatio={aspectRatio}
          cropObj={cropObj!}
          fileType={fileType}
          convertImgType={convertImgType}
          canvasConfig={canvasConfig}
        />
      }
    />
  )
}
export default ModalCropComponent
