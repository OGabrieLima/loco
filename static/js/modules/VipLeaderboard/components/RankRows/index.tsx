import { Box, Flex, Image, Text } from '@chakra-ui/core'
import Loader from '@components/Loader/Loader'
import styled from '@emotion/styled'
import bgMobile from '@images/vipLeaderboard/bannerBgMobile.png'
import bgWeb from '@images/vipLeaderboard/bannerBgWeb.png'
import crownBanner from '@images/vipLeaderboard/crownBanner.svg'
import bronzeMedal from '@images/vipLeaderboard/vipBronzeMedal.svg'
import vipCrown from '@images/vipLeaderboard/vipCrown.svg'
import goldMedal from '@images/vipLeaderboard/vipGoldMedal.svg'
import silverMedal from '@images/vipLeaderboard/vipSilverMedal.svg'
import { loadMoreLeaderboardData } from '@modules/VipLeaderboard/vipLeaderboardSlice'
import isMobile from 'is-mobile'
import React from 'react'
import useInfiniteScrollHook from 'react-infinite-scroll-hook'
import { useDispatch } from 'react-redux'

import EmptyRows from '../EmptyRow'

type font = {
  $font: string
  $italic?: boolean
}

export const YellowGradient = styled.span<font>`
  background: var(
    --vip-gold,
    linear-gradient(180deg, #e7c946 0%, #cf8330 100%)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: ${({ $italic }) => ($italic == false ? '' : 'italic')};
  font-weight: 700;
  font-size: ${({ $font }) => $font};
`

const rankingMedals: { [id: number]: string } = {
  1: goldMedal,
  2: silverMedal,
  3: bronzeMedal,
}

const rankingBackground: { [id: number]: string } = {
  1: 'linear-gradient(271deg, #6D3D03 0%, #040402 83.88%)',
  2: 'linear-gradient(271deg, #424D5A 0%, #040402 83.88%)',
  3: 'linear-gradient(271deg, #692370 0%, #040402 83.88%)',
}

export type LeaderboardRankingType = {
  user_uid: string
  value: number
  rank: number
  user_name: string
  avatar_url: string
}[]

const ViewerLeaderboardRankRows = ({
  rankRowsLoading,
  rowsData,
  loadMore,
  dataType,
}: {
  rankRowsLoading: boolean
  rowsData: LeaderboardRankingType
  loadMore: boolean
  dataType: string
}) => {
  const dispatch = useDispatch()

  const handleLoadMore = () => {
    dispatch(loadMoreLeaderboardData(dataType))
  }
  const [moreRef] = useInfiniteScrollHook({
    loading: rankRowsLoading,
    hasNextPage: loadMore,
    onLoadMore: handleLoadMore,
    rootMargin: '0px 0px 0px 0px',
  })

  return (
    <Flex direction={'column'}>
      <Flex
        bgImage={[`url(${bgMobile})`, `url(${bgWeb})`]}
        paddingY={[4]}
        flexDirection={'row'}
        backgroundRepeat={'no-repeat'}
        backgroundSize="cover"
      >
        <Flex pl={[4, 6]} pr={4} flexShrink={0}>
          <Image src={crownBanner} alt="crown" h={'60px'} w={'60px'} />
        </Flex>
        <Flex direction={'column'} pr={['16px', '78px']}>
          <YellowGradient $font={isMobile() ? '14px' : '18px'}>
            Ask your Fanbase to become a VIP member, to win giveaways!
          </YellowGradient>
          <Text fontSize={['12px', '14px']} mt={2}>
            To become a VIP Member, your fans can redeem their membership from
            the reward store or buy an eligible pack in the store.
          </Text>
        </Flex>
      </Flex>
      {rowsData.length === 0 ? (
        <EmptyRows />
      ) : (
        <Box>
          {rowsData?.map((item, index) => (
            <Flex
              key={item.user_uid}
              height={[item.rank < 4 ? '52px' : '', '52px']}
              bgImage={item.rank < 4 ? rankingBackground[item.rank] : ''}
              borderBottom={[
                '',
                item.rank < 4 || index === rowsData.length - 1
                  ? ''
                  : '1px solid #2D2D2D',
              ]}
              pl="16px"
              pr="24px"
              mt={[item.rank < 4 ? 4 : 2, 4]}
              align="center"
              justify="center"
              style={{
                marginInlineEnd: '12px',
              }}
              overflowY={'auto'}
            >
              <Flex
                width="100%"
                height="100%"
                align="center"
                justify="space-between"
              >
                <Flex
                  align="center"
                  overflowX="hidden"
                  style={{
                    marginInlineEnd: '20px',
                  }}
                  height="100%"
                >
                  <Flex
                    h="32px"
                    w="32px"
                    minW="32px"
                    align="center"
                    justify="center"
                    style={{
                      marginInlineEnd: '16px',
                    }}
                  >
                    {item.rank > 3 ? (
                      <Flex
                        h="24px"
                        w="24px"
                        minW="24px"
                        bgImage="linear-gradient(90deg, #393B3E 0%, #232326 100%)"
                        rounded="999px"
                        fontSize="16px"
                        color="#C0C0C0"
                        fontWeight="700"
                        align="center"
                        justify="center"
                      >
                        {item.rank}
                      </Flex>
                    ) : (
                      <Image
                        src={rankingMedals[item.rank]}
                        h="32px"
                        w="32px"
                        style={{
                          marginInlineEnd: '8px',
                        }}
                        alt="rank"
                      />
                    )}
                  </Flex>
                  <Flex
                    h="32px"
                    w="32px"
                    align="center"
                    justify="center"
                    style={{
                      marginInlineEnd: '16px',
                    }}
                  >
                    {item.rank < 4 && (
                      <Image
                        src={vipCrown}
                        alt="crown"
                        zIndex={10}
                        mt="-38px"
                        mr="-20px"
                      />
                    )}
                    <Image
                      h={item.rank < 4 ? '32px' : '24px'}
                      w={item.rank < 4 ? '32px' : '24px'}
                      minW={item.rank < 4 ? '32px' : '24px'}
                      src={item?.avatar_url}
                      rounded="999px"
                      display="inline-block"
                      overflowX="hidden"
                      alt="avatar"
                      zIndex={0}
                    />
                  </Flex>
                  <Text maxW="75%" isTruncated fontSize="14px" fontWeight="700">
                    {item.user_name}
                  </Text>
                </Flex>
                <Text maxW="100px" fontSize="12px">
                  {item.value}
                </Text>
              </Flex>
            </Flex>
          ))}
          {loadMore && (
            <Box ref={moreRef}>
              <Loader height="100px" />
            </Box>
          )}
        </Box>
      )}
    </Flex>
  )
}

export default ViewerLeaderboardRankRows
