import { RootState } from '@app/RootReducer'
import { Avatar, Box, Button, Flex, Icon, Text } from '@chakra-ui/core'
import Pending2faTest from '@modules/Pending2faTest'
import { paths } from '@routers/constants'
import { RoutesProps } from '@routers/dashboardRoutes'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { isWebViewBuild } from '../../../../constent'

const MenuItem = ({
  // this is webview
  route,
  onOpen,
  isSubMenu,
}: {
  route: RoutesProps
  onOpen?: () => any
  isSubMenu?: boolean
}): JSX.Element => {
  const { me } = useSelector((state: RootState) => state.login)
  const { i18n } = useTranslation()
  const history = useHistory()
  const onClickHandler = () => {
    if (paths.dashboard.streamConfig === route.key && onOpen) {
      onOpen()
    }
    if (route.path) history.push(route.path)
  }
  return (
    <Flex
      onClick={onClickHandler}
      justify="space-between"
      rounded={'12px'}
      py="12px"
      h="48px"
      px="1rem"
      style={{
        gap: '12px',
        alignItems: 'center',
      }}
    >
      <Flex
        justify="space-between"
        style={{
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <Flex
          style={{
            gap: '12px',
            alignItems: 'center',
          }}
        >
          {paths.dashboard.profile === route.key ? (
            <>
              <Avatar
                src={me?.avatar_url}
                h="24px"
                w="24px"
                objectFit="contain"
                showBorder={true}
                border="1px solid white"
                rounded={'8px'}
                boxSizing="border-box"
              />
              <Text
                color="white"
                lineHeight={'15.56px'}
                fontSize="12px"
                fontWeight={'700'}
              >
                <Trans i18nKey="sidenav.myStreamerProfile" />
              </Text>
              <Pending2faTest />
            </>
          ) : (
            <>
              {route.icon ? (
                <Icon
                  //@ts-ignore
                  name={route.icon}
                  ml={isSubMenu ? '16px' : 0}
                  size="24px"
                  color="white"
                />
              ) : null}
              <Text
                color="white"
                lineHeight={'15.56px'}
                fontSize="12px"
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
            </>
          )}
        </Flex>
        {route.isNew && (
          <Icon
            //@ts-ignore
            name="newTag"
            size="15px"
            mt={'1px'}
            ml={2}
            width={'revert'}
          />
        )}
      </Flex>
      {paths.dashboard.streamConfig === route.key && (
        <SpecialButton title={<Trans i18nKey="sidenav.view" />} />
      )}
      {paths.dashboard.home === route.key && (
        <SpecialButton title={<Trans i18nKey="sidenav.edit" />} />
      )}
    </Flex>
  )
}

export default MenuItem

const SpecialButton = ({ title }: { title: React.ReactNode }) => {
  return (
    <>
      <Button
        h="auto"
        minH={'32px'}
        py={'4px'}
        px={'12px'}
        bg="transparent"
        _focus={{
          background: 'transparent',
          outline: 'none',
        }}
        _active={{
          background: 'transparent',
          outline: 'none',
        }}
        _hover={{
          background: 'transparent',
          outline: 'none',
        }}
        fontSize="12px"
        fontWeight="700"
        lineHeight={'15.56px'}
        color="brand.loco-primary"
      >
        {title}
      </Button>
    </>
  )
}
