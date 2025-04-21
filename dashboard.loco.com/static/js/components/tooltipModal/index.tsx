import { Text } from '@chakra-ui/core'
import React from 'react'

import Block from '../Container/Block'
import NewModal from '../NewModal'

interface TooltipModalProps {
  isOpen: boolean
  onClose: () => any
  tooltipLabel: string
  title: string
}

const TooltipModal = (props: TooltipModalProps) => {
  const { isOpen, onClose, tooltipLabel, title } = props

  return (
    <NewModal
      isOpen={isOpen}
      onClose={onClose}
      modalSize="full"
      isCentered={true}
      scrollBehaviour="outside"
      hideClose={true}
      modalOverlayStyle={{
        zIndex: 1400,
      }}
      modalHeaderStyle={{
        display: 'none',
      }}
      modalBodyStyle={{
        pt: [4, 8],
        pb: [6, 8],
      }}
      modalBodyComponent={
        <>
          <Text fontSize="sm" fontWeight="700" lineHeight="130%" mb={4}>
            {title}
          </Text>
          <Text fontSize="12px" lineHeight="130%">
            {tooltipLabel}
          </Text>
        </>
      }
    />
  )
}

export default TooltipModal
