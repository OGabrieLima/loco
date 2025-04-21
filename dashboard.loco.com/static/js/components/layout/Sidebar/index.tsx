import { setIsDrawerOpen, setlanguageSelctionOriginModal } from '@app/appSlice'
import { RootState } from '@app/RootReducer'
import { Box, useDisclosure } from '@chakra-ui/core'
import { paths } from '@routers/constants'
import { RoutesProps } from '@routers/dashboardRoutes'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import NewModal from '../../NewModal'
import LogoutConfirmationModal from './LogoutConfirmationModal'
import Menu from './Menu'

const SideBar = ({
  routes,
  menuListDisabled,
}: {
  routes: RoutesProps[]
  menuListDisabled: boolean
}) => {
  const { isDrawerOpen } = useSelector((state: RootState) => state.app)
  const dispatch = useDispatch()
  const history = useHistory()
  const { isOpen, onClose } = useDisclosure()
  const onCallback = (route: RoutesProps) => {
    if (route.path === paths.logout) {
      // onOpen()
      if (isDrawerOpen) {
        dispatch(setIsDrawerOpen(false))
      }
      if (route.path) history.push(route?.path)
      // Not opening modal, ONly redirect to logout page
      return
    } else if (route.key === 'changeUserLanguage') {
      // OPen language Selector modal now
      dispatch(setlanguageSelctionOriginModal('profile_section'))
      if (isDrawerOpen) {
        dispatch(setIsDrawerOpen(false))
      }
    } else {
      // Do Nothing
    }
  }
  return (
    <>
      <Box bg={'brand.loco-black'} w="100%" h="100%" overflow="auto">
        <Menu
          routes={routes}
          menuListDisabled={menuListDisabled}
          onOpen={onCallback}
        />
      </Box>
      <NewModal
        isOpen={isOpen}
        onClose={onClose}
        modalSize="md"
        isCentered={true}
        scrollBehaviour="outside"
        modalOverlayStyle={{
          zIndex: 1400,
        }}
        modalContentStyle={{
          bg: 'brand.primary-light-black-v4',
        }}
        modalHeaderStyle={{
          px: 0,
          pb: 0,
        }}
        modalBodyStyle={{
          p: 4,
        }}
        modalBodyComponent={<LogoutConfirmationModal onClose={onClose} />}
      />
    </>
  )
}

export default SideBar
