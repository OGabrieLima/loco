import {
  Divider,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { setIsDrawerOpen } from '../../../app/appSlice'
import { RootState } from '../../../app/RootReducer'
import { RoutesProps } from '../../../routers/dashboardRoutes'
import Sidebar from '../Sidebar'

const MobileDrawer = ({ routes }: { routes: RoutesProps[] }) => {
  const dispatch = useDispatch()
  const { isDrawerOpen } = useSelector((state: RootState) => state.app)
  const onDrawerClose = () => dispatch(setIsDrawerOpen(false))
  const { t } = useTranslation()
  return (
    <>
      <Drawer
        placement={'left'}
        size="xs"
        onClose={onDrawerClose}
        isOpen={isDrawerOpen}
      >
        <DrawerOverlay />
        <DrawerContent
          w="250px"
          className="h-screen h-screen-imp"
          style={{ height: '100dvh' }}
        >
          <DrawerHeader bg="brand.primary-light-black-v2" p={0}>
            <Flex px={4} h="56px" align="center">
              <Icon
                name="close"
                cursor="pointer"
                color="white"
                onClick={onDrawerClose}
                size="24px"
                mr={4}
              />
              <Text color="white" fontSize="sm" fontWeight="black">
                {t('headerWebview.streamingCenter')}
              </Text>
            </Flex>
            <Divider
              borderColor="brand.primary-text"
              borderWidth={1}
              opacity={0.2}
              m={0}
            />
          </DrawerHeader>
          <Sidebar routes={routes} menuListDisabled={false} />
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default MobileDrawer
