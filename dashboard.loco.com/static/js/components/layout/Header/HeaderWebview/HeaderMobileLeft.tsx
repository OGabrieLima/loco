import { Flex, Icon, Image, Text } from '@chakra-ui/core'
import vipCrown from '@images/vipLeaderboard/crownTitle.svg'
import { YellowGradient } from '@modules/VipLeaderboard/components/RankRows'
import React from 'react'
import { useHistory } from 'react-router-dom'

import HeaderSupport from '../HeaderSupport'

const HeaderMobileLeft = ({
  label,
  showLive,
  isWhatsNew,
  isVIP,
  handleBackProps,
}: {
  label: string
  showLive: boolean
  isWhatsNew: boolean
  isVIP?: boolean
  handleBackProps?: () => any
  headerRight?: boolean
}) => {
  const history = useHistory()
  const handleBack = () => {
    if (handleBackProps) {
      handleBackProps()
      return
    }
    history.goBack()
  }
  return (
    <Flex align="center" boxSizing="border-box" w="full" background={'black'}>
      <Icon name="arrow-back" mr={2} size="24px" onClick={handleBack} />
      {!isVIP ? (
        <Text
          as="div"
          fontSize={['14px']}
          fontWeight={['700', '700']}
          color="white"
          mr={2}
          w="full"
          textAlign={'left'}
        >
          {label}
        </Text>
      ) : (
        <Flex alignItems={'center'}>
          <YellowGradient $font="16px" $italic={false}>
            VIP Leaderboard
          </YellowGradient>
          <Image
            src={vipCrown}
            alt="crown"
            height={'20px'}
            width={'20px'}
            ml={2}
          />
        </Flex>
      )}
      {showLive && (
        <Icon
          //@ts-ignore
          name="liveTrue"
          width="revert"
        />
      )}
      {isWhatsNew && <HeaderSupport />}
    </Flex>
  )
}

export default HeaderMobileLeft
