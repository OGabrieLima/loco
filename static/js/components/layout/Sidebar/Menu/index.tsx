import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/core'
import styled from '@emotion/styled'
import MenuItemWebView from '@modules/Menu/components/MenuItem/index'
//types
import { RoutesProps } from '@routers/dashboardRoutes'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { isWebViewBuild } from '../../../../constent'
import MenuItem from './MenuItem'

const Menu = ({
  routes,
  menuListDisabled,
  onOpen,
}: {
  routes: RoutesProps[]
  menuListDisabled: boolean
  onOpen?: (route: RoutesProps) => any
}): JSX.Element => {
  const { i18n } = useTranslation()

  const TopTwoPages = routes.slice(0, 2)
  const OtherPages = routes.slice(2)
  return (
    <Stack spacing={0} borderRight={'1px solid #3A3A3A'}>
      <Stack
        spacing={[1, 2]}
        bg={['brand.loco-grey-7']}
        px={['6px', '3px', '6px']}
        py={['20px', '10px', '20px']}
        boxSizing="border-box"
      >
        {TopTwoPages.map((route: RoutesProps) => {
          const isMweb = route.displayOnlyIn === 'mweb' || !route.displayOnlyIn
          const isWeb = route.displayOnlyIn === 'web' || !route.displayOnlyIn
          return route.showInSidebar ? (
            <Box
              key={route.key}
              display={[isMweb ? 'block' : 'none', isWeb ? 'block' : 'none']}
            >
              <MenuItem
                route={route}
                menuListDisabled={menuListDisabled}
                itemBg={['brand.loco-grey-7']}
              />
            </Box>
          ) : null
        })}
      </Stack>
      <Divider borderColor="brand.loco-grey-6" borderWidth="1px" m={0} />
      <Stack
        spacing={[0, 0]}
        pt={'6px'}
        px={['6px', '3px', '6px']}
        boxSizing="border-box"
        pb={24}
      >
        {OtherPages.map((route: RoutesProps) => {
          const title = route.name && i18n.t(route.name)
          const isMweb = route.displayOnlyIn === 'mweb' || !route.displayOnlyIn
          const isWeb = route.displayOnlyIn === 'web' || !route.displayOnlyIn
          if (!route.path && route.routes) {
            return (
              <MenuList
                // web/mWeb only
                //@ts-ignore
                title={title}
                route={route}
                key={route.key}
              />
            )
          }
          return route.showInSidebar ? (
            <Box
              key={route.key}
              display={[isMweb ? 'block' : 'none', isWeb ? 'block' : 'none']}
            >
              <MenuItem
                route={route}
                menuListDisabled={menuListDisabled}
                onOpen={onOpen}
                itemBg={['brand.loco-black']}
              />
            </Box>
          ) : null
        })}
      </Stack>
      {/* 
      // Remvoe this because getting error on mWeb due to 100vh scale
      // this is hidden when Addressbar is visible on mobile browser
      <Box
        w={['full', '18%']}
        minW={['10px', '234px', '234px']}
        bottom={0}
        position={'absolute'}
        bg="brand.primary-light-black-v5"
        boxSizing="border-box"
      >
        <Divider borderColor="brand.loco-grey-6" borderWidth="1px" m={0} />
        {routes.slice(-1).map((route: RoutesProps) => {
          return route.showInSidebar ? (
            <Box color="white" key={route.key} px={['6px', '3px', '6px']}>
              <MenuItem route={route} onOpen={onOpen} />
            </Box>
          ) : null
        })}
      </Box> */}
    </Stack>
  )
}

interface MenuList {
  title?: string
  route: RoutesProps
}

const SubMenu = styled(Box)`
  @media only screen and (max-width: 47.95rem) {
    padding-left: 0;
  }
`

const StyledAccordionHeader = styled(AccordionHeader)``

export function MenuList({ title, route }: MenuList): JSX.Element {
  return (
    <Accordion allowToggle>
      <AccordionItem border="none">
        <StyledAccordionHeader
          display="flex"
          h="48px"
          justifyContent="space-between"
          padding={isWebViewBuild ? '0.5rem 1rem' : '0.5rem 1rem'}
          _focus={{ boxShadow: 'none' }}
        >
          <Box
            display="flex"
            alignItems="center"
            style={{
              gap: '12px',
              alignItems: 'center',
              justifyItems: 'start',
            }}
          >
            <Icon name={route.icon} color="white" size="24px" />
            <Text
              color="white"
              fontSize="12px"
              lineHeight={'15.56px'}
              fontWeight={'700'}
            >
              {title}
            </Text>
            {route.isNew && (
              <Icon
                //@ts-ignore
                name="newTag"
                size="15px"
                mt={'1px'}
                width={'revert'}
              />
            )}
          </Box>
          <AccordionIcon name="downArrow" color="white" size="24px" />
        </StyledAccordionHeader>
        <AccordionPanel padding="0">
          {route.routes?.map((route) => {
            const isMweb =
              route.displayOnlyIn === 'mweb' || !route.displayOnlyIn
            const isWeb = route.displayOnlyIn === 'web' || !route.displayOnlyIn
            return route.showInSidebar || route.showInWebViewMenu ? (
              <SubMenu
                display={[isMweb ? 'block' : 'none', isWeb ? 'block' : 'none']}
                color="white"
                key={route.key}
                marginRight="0px"
              >
                {isWebViewBuild ? (
                  <MenuItemWebView route={route} isSubMenu={!isWebViewBuild} />
                ) : (
                  <MenuItem
                    route={route}
                    isSubMenu={!isWebViewBuild}
                    itemBg={['brand.loco-black']}
                  />
                )}
              </SubMenu>
            ) : null
          })}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default Menu
