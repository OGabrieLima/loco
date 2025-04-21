import {
  convertToMinSec,
  timeDifferenceInSeconds,
} from '@utils/utilityFunction'
import React, { useEffect, useState } from 'react'
import * as workerTimers from 'worker-timers'

interface TimerProps {
  endsAt: number
  text: string
  callback: () => void
}

const Timer = ({ endsAt, text, callback }: TimerProps) => {
  const [timer, setTimer] = useState(() => timeDifferenceInSeconds(endsAt))

  useEffect(() => {
    const timerInterval = workerTimers.setInterval(() => {
      if (timer === 0) {
        callback()
        return
      }
      setTimer((t) => t - 1)
    }, 1000)
    return () => {
      workerTimers.clearInterval(timerInterval)
    }
  }, [])
  return <>{`${text} ${convertToMinSec(timer)}`}</>
}

export default Timer
