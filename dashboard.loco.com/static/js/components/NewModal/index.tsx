import {
  BoxProps,
  Flex,
  FlexProps,
  Icon,
  IModal,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalSizes,
  SlideIn,
} from '@chakra-ui/core'
import { useRtlTranslation } from '@src/i18n/utils'
import React from 'react'

interface NewModalProps {
  title?: string
  modalHeaderStyle?: FlexProps
  modalContentStyle?: FlexProps
  modalHeaderComponent?: React.ReactNode
  disableClose?: boolean
  hideClose?: boolean
  modalBodyStyle?: FlexProps
  modalBodyComponent: React.ReactNode
  modalSize?: ModalSizes | BoxProps['maxWidth']
  scrollBehaviour?: 'outside' | 'inside'
  isCentered?: boolean
  modalOverlayStyle?: FlexProps
  closeButtonStyle?: FlexProps
  className?: string
}

const NewModal = (
  props: NewModalProps & Omit<IModal, 'children'>
): JSX.Element => {
  const {
    isOpen,
    onClose,
    title,
    disableClose,
    hideClose,
    modalSize,
    isCentered,
    scrollBehaviour,
    modalHeaderStyle,
    modalContentStyle,
    modalHeaderComponent,
    modalBodyStyle,
    modalBodyComponent,
    modalOverlayStyle,
    closeButtonStyle,
    className,
    ...rest
  } = props
  const isRTL = useRtlTranslation()

  const customRTLCloseButtonStyle = isRTL
    ? {
        left: 0,
      }
    : { right: 0 }
  return (
    //@ts-ignore
    <SlideIn in={isOpen}>
      {(styles: any): any => (
        <Modal
          //@ts-ignore

          isOpen={isOpen}
          onClose={
            disableClose
              ? () => {
                  // do nothing
                }
              : onClose
          }
          isCentered={isCentered}
          size={modalSize || 'sm'}
          scrollBehavior={scrollBehaviour || 'outside'}
          {...rest}
        >
          <ModalOverlay
            opacity={modalOverlayStyle?.opacity || 0.7}
            bg="brand.loco-black"
            {...modalOverlayStyle}
          />
          <ModalContent
            {...styles}
            bg={['#282828', '#1B1B1B']}
            w={['full']}
            dir={isRTL ? 'rtl' : 'ltr'}
            borderRadius={['16px', '12px']}
            borderBottomLeftRadius={[0, '12px']}
            borderBottomRightRadius={[0, '12px']}
            position={['fixed', 'relative']}
            top={null}
            bottom={[0, null]}
            mb={[0, null]}
            overflow="hidden"
            color="white"
            className={className}
            {...modalContentStyle}
          >
            <ModalHeader {...modalHeaderStyle}>
              {modalHeaderComponent ? modalHeaderComponent : title}
            </ModalHeader>
            {!disableClose && !hideClose ? (
              <Flex
                justifyContent="flex-end"
                p={'12px'}
                position="absolute"
                top={0}
                {...customRTLCloseButtonStyle}
                {...closeButtonStyle}
                zIndex={3000}
              >
                <Icon
                  //@ts-ignore
                  name={'crossGray'}
                  cursor="pointer"
                  onClick={onClose}
                  size="24px"
                />
              </Flex>
            ) : null}

            <ModalBody {...modalBodyStyle}>{modalBodyComponent}</ModalBody>
          </ModalContent>
        </Modal>
      )}
    </SlideIn>
  )
}

export default NewModal
