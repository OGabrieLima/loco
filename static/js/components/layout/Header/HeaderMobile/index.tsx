import { Flex, Icon, Text, useDisclosure } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import { setIsDrawerOpen } from '../../../../app/appSlice'
import { RootState } from '../../../../app/RootReducer'
import { paths } from '../../../../routers/constants'
import TooltipModal from '../../../tooltipModal'
import HeaderCenter from '../HeaderCenter'

const HeaderMobile = ({ disableMenu }: { disableMenu: boolean }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { isLive } = useSelector((state: RootState) => state.liveStreamManager)

  const handleDrawer = () => {
    if (disableMenu) {
      onOpen()
      return
    }
    dispatch(setIsDrawerOpen(true))
  }
  const isLSM = location.pathname === paths.dashboard.stream
  // const isWhatsNew = location.pathname === paths.dashboard.WhatsNew
  const history = useHistory()
  const { t } = useTranslation()

  return (
    <>
      <Flex px={1} align="center" w="full" justify="space-between">
        <Flex>
          {!isLSM && (
            <Flex>
              <Icon
                name={isOpen ? 'menuOpen' : 'menuClose'}
                size="6"
                onClick={handleDrawer}
                marginRight={3}
              />
            </Flex>
          )}
          <Flex justify={isLSM ? 'flex-start' : 'center'} align="center">
            <Icon
              //@ts-ignore
              name="loco"
              color="white"
              height={'22px'}
              width={'150px'}
              onClick={() => {
                history.push(paths.dashboard.home)
              }}
            />
            {isLive && isLSM ? (
              <Text
                p="4px"
                height="20px"
                fontSize="12px"
                fontWeight="bolder"
                borderRadius="6px"
                background="#FF5A12"
                textTransform="uppercase"
                width="max-content"
                display="flex"
                alignItems="center"
                ml={4}
              >
                {t('common.live_tag_text')}
              </Text>
            ) : null}
          </Flex>
        </Flex>
        <Flex flex={1} justify="flex-end">
          {/* {isWhatsNew ? <HeaderSupport /> : <HeaderCenter />} */}
          <HeaderCenter />
        </Flex>
      </Flex>
      {isOpen && (
        <TooltipModal
          isOpen={isOpen}
          onClose={onClose}
          title={t('onBoarding.streamSetup.disabled')}
          tooltipLabel={t('onBoarding.streamSetup.disabledMsg')}
        />
      )}
    </>
  )
}

export default HeaderMobile
