import { setIsDrawerOpen } from '@app/appSlice'
import { RootState } from '@app/RootReducer'
import { Box, Flex, Icon, Text, Tooltip } from '@chakra-ui/core'
import { paths } from '@routers/constants'
//@types
import { RoutesProps } from '@routers/dashboardRoutes'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

const MenuItem = ({
  // this is web
  route,
  menuListDisabled,
  onOpen,
  itemBg,
  isSubMenu,
}: {
  route: RoutesProps
  menuListDisabled?: boolean
  onOpen?: (route: RoutesProps) => any
  isSubMenu?: boolean
  itemBg: string[]
}) => {
  let isSelected = false
  const { pathname } = useLocation()
  const { isDrawerOpen } = useSelector((state: RootState) => state.app)
  const dispatch = useDispatch()
  const { i18n, t } = useTranslation()

  const history = useHistory()
  if (pathname === route.path || pathname === `${route.path}/`) {
    isSelected = true
  }
  const SubComponent: any = route.subComponent ? route.subComponent : null
  const showTooltip = menuListDisabled ? undefined : false
  const tooltipLabel = t('onBoarding.streamSetup.disabledMsg')
  const Component = ({ children }: { children: React.ReactNode }) =>
    showTooltip === false ? (
      <>{children}</>
    ) : (
      <Tooltip
        label={tooltipLabel}
        aria-label={tooltipLabel}
        hasArrow
        placement={'right'}
        rounded={'12px'}
        p="16px"
        bg="#3A3A3A"
        color="white"
        w="220px"
        fontSize="14px"
        fontWeight={'600'}
        isOpen={showTooltip}
      >
        {children}
      </Tooltip>
    )

  const menuItemClickHandler = () => {
    if (menuListDisabled) {
      return
    }
    if (
      (route.path === paths.logout || route.key === 'changeUserLanguage') &&
      onOpen
    ) {
      onOpen(route)
    } else {
      if (isDrawerOpen) {
        dispatch(setIsDrawerOpen(false))
      }
      if (route.path) history.push(route?.path)
    }
  }
  return (
    <Box
      onClick={menuItemClickHandler}
      textDecoration="none"
      cursor={menuListDisabled ? 'not-allowed' : 'pointer'}
      style={{
        textDecoration: 'none',
      }}
    >
      <Flex boxSizing="border-box">
        <Component>
          <Flex
            h="48px"
            background={
              isSelected
                ? 'linear-gradient(242.02deg, #FF0068 6.94%, #FF5A12 90.68%)'
                : 'none'
            }
            rounded="12px"
            w="full"
            p={'2px'}
          >
            <Flex
              bg={itemBg}
              h="full"
              w="full"
              paddingLeft={'16px'}
              paddingRight={['16px']}
              paddingBottom={route.level === 1 ? 2 : 3}
              paddingTop={route.level === 1 ? 2 : 3}
              rounded="12px"
              boxSizing="border-box"
              style={{
                gap: '12px',
                alignItems: 'center',
                justifyItems: 'start',
              }}
            >
              {route?.icon ? (
                <>
                  <Icon
                    //@ts-ignore
                    name={isSelected ? `${route?.icon}_selected` : route?.icon}
                    color="white"
                    ml={isSubMenu ? '16px' : 0}
                    display={['none', 'flex', 'flex']}
                    height={'24px'}
                    width={'24px'}
                  />
                  <Icon
                    //@ts-ignore
                    name={route?.icon}
                    height={'24px'}
                    ml={isSubMenu ? '16px' : 0}
                    width={'24px'}
                    color="white"
                    display={['flex', 'none', 'none']}
                  />
                </>
              ) : null}
              <Text
                color="white"
                fontSize="12px"
                lineHeight={'15.56px'}
                fontWeight={'700'}
                marginLeft={
                  !route.icon
                    ? isSubMenu
                      ? ['calc(24px + 12px + 16px)', 'calc(24px + 12px)']
                      : 'calc(24px + 12px)'
                    : 0
                }
              >
                {route.name && i18n.t(route.name)}
              </Text>
              {route?.isNew ? (
                <Flex flex={1} justifyContent={'flex-end'}>
                  <Icon
                    //@ts-ignore
                    name="newTag"
                    size="15px"
                    width={'revert'}
                    style={{
                      marginInlineStart: '0.5rem',
                    }}
                  />
                </Flex>
              ) : SubComponent ? (
                <Suspense fallback={<></>}>
                  <SubComponent />
                </Suspense>
              ) : null}
            </Flex>
          </Flex>
        </Component>
      </Flex>
    </Box>
  )
}

export default React.memo(MenuItem)
