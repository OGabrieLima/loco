import {
  Box,
  FlexProps,
  Icon,
  Tab,
  TabList,
  Tabs,
  Tooltip,
} from '@chakra-ui/core'
import { StickerType } from '@modules/Stickers/stickerSlice'
import theme from '@src/theme'
import React from 'react'

export interface selectTabProps {
  key: string | StickerType
  name: string
  locked?: boolean
  tooltipText?: string
  disabled?: boolean
}
const SelectTabs = ({
  tabs,
  handleOnTabChange,
  currentIndex,
  tabProps,
  tabsProps,
  selectedProps,
  tabPanels,
  tabListProps,
  tabComponents,
  hasNewDesign = true,
}: {
  tabs?: selectTabProps[]
  currentIndex?: number
  handleOnTabChange: (index: number) => void
  tabProps?: FlexProps
  tabListProps?: FlexProps
  tabsProps?: any
  selectedProps?: any
  tabPanels?: React.ReactNode
  tabComponents?: React.ReactNode
  hasNewDesign?: boolean
}): JSX.Element => {
  const handleOnChange = (index: number) => {
    handleOnTabChange(index)
  }

  const ToltipWrapper = (props: {
    title?: string
    children: React.ReactNode
  }) => {
    if (!props.title) {
      return <>{props.children}</>
    }
    return (
      <>
        <Tooltip
          label={props.title}
          aria-label={props.title}
          placement="bottom"
          hasArrow
          padding={'16px'}
          w="350px"
          display={['none', 'flex', 'flex']}
          rounded={'12px'}
          bg="#3A3A3A"
          zIndex={9999}
          color="white"
          fontSize="14px"
          fontWeight={'600'}
        >
          {props.children}
        </Tooltip>
      </>
    )
  }
  return (
    <Tabs
      variant="unstyled"
      onChange={handleOnChange}
      index={currentIndex}
      px={[4, 0]}
      {...tabsProps}
    >
      <TabList
        display={['flex']}
        flexDir={'row'}
        alignItems={'flex-end'}
        {...tabListProps}
      >
        {tabs?.length
          ? tabs.map((tab) => {
              const isLockedTab = tab.locked === true
              return (
                <Tab
                  disabled={tab?.disabled}
                  flex={'1'}
                  key={tab.key}
                  _focus={{
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                  opacity={1}
                  width={['50%', 'auto']}
                  transition="none"
                  padding={['12px 8px', '12px 16px']}
                  whiteSpace={'nowrap'}
                  fontSize={['11px', '14px']}
                  fontWeight="400"
                  lineHeight="130%"
                  color="brand.loco-grey-20"
                  letterSpacing="1.04px"
                  background={
                    'linear-gradient(89.79deg, #3A3A3A -23.82%, #3A3A3A 116.93%) left bottom no-repeat'
                  }
                  backgroundSize={'100% 1px'}
                  _selected={{
                    background: `${theme.colors.gradient['tab-bottom-border']} left bottom no-repeat`,
                    backgroundSize: '100% 2px',
                    opacity: 1,
                    fontWeight: '700',
                    color: '#fff',
                    ...selectedProps,
                  }}
                  {...tabProps}
                >
                  {isLockedTab ? (
                    <>
                      <ToltipWrapper title={tab.tooltipText} key={tab.key}>
                        <Box>
                          <Icon mr="0.25rem" name="lockedIcon" size="16px" />
                          {tab.name}
                        </Box>
                      </ToltipWrapper>
                    </>
                  ) : (
                    <>{tab.name}</>
                  )}
                </Tab>
              )
            })
          : null}
        {tabComponents}
        {hasNewDesign && (
          <Tab
            key={'dummy-key'}
            _disabled={{
              opacity: 1,
              cursor: 'auto',
            }}
            _focus={{
              boxShadow: 'none',
            }}
            cursor={'auto'}
            opacity={1}
            transition="none"
            padding={['12px 8px', '12px 16px']}
            whiteSpace={'nowrap'}
            fontSize={['11px', '14px']}
            fontWeight="400"
            lineHeight="130%"
            letterSpacing="1.04px"
            {...tabProps}
            w="full"
            width={'100%'}
            display={['none', 'flex']}
            color={'transparent'}
            background={
              'linear-gradient(89.79deg, #3A3A3A -23.82%, #3A3A3A 116.93%) left bottom no-repeat'
            }
            backgroundSize={'100% 1px'}
            height="0"
            h="0"
            disabled
          >
            {/* This is just to show  whole line in web */}
            DUMMY
          </Tab>
        )}
      </TabList>
      {tabPanels}
    </Tabs>
  )
}

export default SelectTabs
