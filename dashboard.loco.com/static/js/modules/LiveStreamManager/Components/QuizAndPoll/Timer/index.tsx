import { Flex, Text } from '@chakra-ui/core'
import React, { useEffect, useState } from 'react'

import { timeDifferenceInSeconds } from '../../../../../utils/utilityFunction'
const initialTime = '00:00'

function Timer({
  endsAt,
  handleEventsPublishQuestion,
}: {
  endsAt: number
  handleEventsPublishQuestion: (
    ended_by: 'streamer_ended' | 'timer_ran_out'
  ) => any
}): JSX.Element {
  const [outputTime, setOutputTime] = useState(initialTime)
  let timer: any
  useEffect(() => {
    setInterval(() => getTimeUntil(endsAt), 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])
  useEffect(() => {
    if (outputTime === '00:10') {
      handleEventsPublishQuestion('timer_ran_out')
    }
  }, [outputTime])
  const getTimeUntil = (endsAt: any) => {
    const time = timeDifferenceInSeconds(endsAt)
    if (time < 0) {
      setOutputTime(initialTime)
    } else {
      const minute = Math.floor((time % 3600) / 60)
      const second = Math.floor((time % 3600) % 60)
      const newMinute = `${minute}`.length === 1 ? `0${minute}` : `${minute}`
      const newSecond = `${second}`.length === 1 ? `0${second}` : `${second}`
      setOutputTime(`${newMinute}:${newSecond}`)
    }
  }
  return (
    <Flex>
      <Text fontSize="xs" fontWeight="black">
        {outputTime}
      </Text>
    </Flex>
  )
}

export default Timer
