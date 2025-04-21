import { FlexProps, ModalSizes } from '@chakra-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../app/RootReducer'
import { handleStreamKeyGenerate } from '../../modules/DefaultStream/streamDetailsSlice'
import {
  eventActions,
  eventConstants,
  eventPropsTypes,
} from '../../utils/Amplitude'
import NewModal from '../NewModal'
import ModalBody from './ModalBody'

interface EditStreamModalProps {
  isOpen: boolean
  onClose: () => any
  formWidth?: string
  title?: string
  EmptyComponent?: React.ReactNode
  modalHeaderStyle?: FlexProps
  modalBodyStyle?: FlexProps
  modalSize?: ModalSizes
  scrollBehaviour?: 'outside' | 'inside'
  isCentered?: boolean
  formProps?: any
}

const StreamKeyResetModal = (props: EditStreamModalProps) => {
  const { isOpen, onClose } = props
  const { previousVisit: previousVisitStore } = useSelector(
    (state: RootState) => state.app
  )
  const dispatch = useDispatch()
  const onSubmit = () => {
    dispatch(handleStreamKeyGenerate())
    handleSuccessAmplitude()
  }
  const handleSuccessAmplitude = () => {
    const eventProperties: eventPropsTypes.reset_stream_key_success_props = {
      platform: eventConstants.platform,
      source_name: previousVisitStore,
    }
    eventActions.sendAmplitudeData(
      eventConstants.reset_stream_key_success,
      eventProperties
    )
  }
  return (
    <NewModal
      isOpen={isOpen}
      onClose={onClose}
      modalSize="md"
      isCentered={true}
      scrollBehaviour="outside"
      modalHeaderStyle={{
        px: 0,
        pb: 0,
      }}
      modalBodyStyle={{
        p: 4,
      }}
      modalBodyComponent={<ModalBody onClose={onClose} onSubmit={onSubmit} />}
    />
  )
}

export default StreamKeyResetModal
