import { Flex, FlexProps, ModalSizes } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  ApiContext,
  streamDetailsInterface,
} from '../../context/ApiConnector/types'
import SetupStreamForm from '../../modules/SetupStream/SetupStreamForm'
import HeaderMobileLeft from '../layout/Header/HeaderWebview/HeaderMobileLeft'
import NewModal from '../NewModal'

interface EditStreamModalProps {
  isOpen: boolean
  onClose: () => any
  defaultStreamDetails?:
    | ApiContext['defaultStreamDetails']
    | streamDetailsInterface
    | null
  onSubmit?: (params: any) => any
  formWidth?: string
  title?: string
  modalBodyComponent?: React.ReactNode
  modalHeaderStyle?: FlexProps
  modalBodyStyle?: FlexProps
  modalSize?: ModalSizes
  scrollBehaviour?: 'outside' | 'inside'
  isCentered?: boolean
  formProps?: any
  modalContentStyle?: FlexProps
  closeOnEsc?: boolean
  closeOnOverlayClick?: boolean
}

const EditStreamModal = (props: EditStreamModalProps) => {
  const {
    isOpen,
    onClose,
    onSubmit,
    title,
    defaultStreamDetails,
    modalBodyComponent,
    modalHeaderStyle,
    modalBodyStyle,
    modalSize,
    scrollBehaviour,
    isCentered,
    formProps,
    modalContentStyle,
    closeOnEsc,
    closeOnOverlayClick,
  } = props
  const { t } = useTranslation()
  return (
    <NewModal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={isCentered}
      closeOnEsc={closeOnEsc}
      scrollBehaviour={scrollBehaviour || 'inside'}
      closeOnOverlayClick={closeOnOverlayClick}
      title={title}
      modalSize={modalSize || 'lg'}
      closeButtonStyle={{
        display: ['none', 'flex'],
      }}
      modalHeaderStyle={{
        // bg: ['brand.primary-dark-black-v2', 'brand.primary-light-black-v4'],
        bg: ['brand.loco-grey-70'],
        h: ['56px', 'auto'],
        fontSize: ['14px', '20px'],
        display: ['none', 'flex', 'flex'],
        ...modalHeaderStyle,
      }}
      modalBodyStyle={{
        px: [4, 2],
        pb: [4, 2],
        pt: [0, 2],
        bg: ['black', '#181818'],
        ...modalBodyStyle,
      }}
      modalContentStyle={{
        borderRadius: [0, '12px'],
        bg: ['brand.primary-dark-black-v2', 'brand.primary-light-black-v2'],
        ...modalContentStyle,
      }}
      modalBodyComponent={
        modalBodyComponent ? (
          modalBodyComponent
        ) : (
          <>
            <Flex
              h="56px"
              align="center"
              bg="brand.primary-dark-black-v2"
              pl={3}
              left={0}
              display={['flex', 'none', 'none']}
              position="absolute"
              zIndex={10}
              w="full"
            >
              <HeaderMobileLeft
                label={t('home.todayStream.editModalTitle')}
                showLive={false}
                isWhatsNew={false}
                handleBackProps={onClose}
              />
            </Flex>
            <Flex h="56px" display={['flex', 'none', 'none']} />
            <SetupStreamForm
              //@ts-ignore
              formWidth="100%"
              {...formProps}
              isReadOnly={false}
              defaultStreamDetails={defaultStreamDetails}
              onSubmit={onSubmit}
            />
          </>
        )
      }
    />
  )
}

export default EditStreamModal
