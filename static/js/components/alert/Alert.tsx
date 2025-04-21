import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Icon,
} from '@chakra-ui/core'
import React from 'react'

interface props {
  title: string
  description: string
  cancelBtnText?: string
  submitBtnText?: string
  btnRef: React.MutableRefObject<undefined>
  cancelRef: React.MutableRefObject<undefined>
  isOpen: boolean
  handleStreamEnd: () => void
  onClose: () => void
  loading: boolean
}
export const Alert = ({
  btnRef,
  cancelRef,
  description,
  isOpen,
  onClose,
  handleStreamEnd,
  title,
  cancelBtnText,
  submitBtnText,
  loading,
}: props) => {
  return (
    <AlertDialog
      //@ts-ignore
      leastDestructiveRef={cancelRef}
      //@ts-ignore
      finalFocusRef={btnRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      position
    >
      <AlertDialogOverlay opacity={0.75} bg="brand.loco-black" />
      <AlertDialogContent
        bg="brand.loco-grey-9"
        color="white"
        rounded="12px"
        padding={'24px'}
        borderRadius="12px"
        borderBottomLeftRadius={[0, '12px']}
        borderBottomRightRadius={[0, '12px']}
        position={['fixed', 'relative']}
        top={null}
        bottom={[0, null]}
        mb={[0, null]}
      >
        <Box
          display={['none', 'block']}
          position="absolute"
          top="0"
          right="0"
          p="12px"
        >
          <Icon name="crossGray" size="24px" onClick={onClose} />
        </Box>
        <AlertDialogHeader
          p="0px"
          fontSize={['14px', '16px']}
          fontWeight="700"
          lineHeight={'130%'}
          textAlign={'center'}
          w="full"
        >
          {title}
        </AlertDialogHeader>

        <AlertDialogBody
          px="0"
          py={['6px', '24px']}
          fontSize={['12px', '16px']}
          color={'brand.loco-grey-20'}
          fontWeight="400"
          lineHeight={'130%'}
          textAlign={'center'}
          w="full"
        >
          {description}
        </AlertDialogBody>

        <AlertDialogFooter px="0" pb="0" pt={['18px', '0px']}>
          <Flex
            direction={['column', 'row']}
            w="full"
            gridGap={['12px', '16px']}
          >
            <Button
              flex={1}
              display={['none', 'flex']}
              ref={cancelRef}
              onClick={onClose}
              bg="transparent"
              border={'2px'}
              borderColor={'brand.loco-primary'}
              color={'brand.loco-primary'}
              minH={['32px', '48px']}
              rounded={'10px'}
              py={['8px', '12px']}
              px={['12px', '24px']}
              fontSize={['12px', '14px']}
              lineHeight={'130%'}
              fontWeight="700"
              _hover={{
                background: 'transparent',
                outline: 'none',
              }}
              _focus={{
                background: 'transparent',
                outline: 'none',
              }}
              _active={{
                background: 'transparent',
                outline: 'none',
              }}
            >
              {cancelBtnText ? cancelBtnText : 'Cancel'}
            </Button>
            <Button
              flex={1}
              bg="brand.loco-primary"
              onClick={handleStreamEnd}
              minH={['32px', '48px']}
              rounded={'10px'}
              color={'white'}
              py={['8px', '12px']}
              px={['12px', '24px']}
              fontSize={['12px', '14px']}
              lineHeight={'130%'}
              fontWeight="700"
              _hover={{
                background: 'brand.loco-primary',
              }}
              _active={{
                background: 'brand.loco-primary',
              }}
              isLoading={loading}
            >
              {submitBtnText ? submitBtnText : 'Submit'}
            </Button>

            <Button
              flex={1}
              display={['flex', 'none']}
              ref={cancelRef}
              onClick={onClose}
              bg="transparent"
              border={'2px'}
              borderColor={'brand.loco-primary'}
              color={'brand.loco-primary'}
              minH={['32px', '48px']}
              rounded={'10px'}
              py={['8px', '12px']}
              px={['12px', '24px']}
              fontSize={['12px', '14px']}
              lineHeight={'130%'}
              fontWeight="700"
              _hover={{
                background: 'transparent',
                outline: 'none',
              }}
              _focus={{
                background: 'transparent',
                outline: 'none',
              }}
              _active={{
                background: 'transparent',
                outline: 'none',
              }}
            >
              {cancelBtnText ? cancelBtnText : 'Cancel'}
            </Button>
          </Flex>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
