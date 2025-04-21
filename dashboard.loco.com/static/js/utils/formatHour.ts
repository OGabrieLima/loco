import i18n from 'i18next'

import { formatNumber } from './formatNumber'

export const formatHour = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  let minutes: any = Math.floor(totalSeconds / 60)
  if (minutes.toString().length < 2) {
    minutes = `0${minutes}`
  }
  return parseFloat(`${hours}.${minutes}`)
}

export const formatFractionalHours = (totalSeconds: number) => {
  const hours = totalSeconds / 3600
  return parseFloat(hours.toFixed(2))
}

export const minsToHHMMSS = (min: number) => {
  if (min <= 0) return '00:00:00'
  let hours: string | number = Math.floor(min / 60)
  let minutes: string | number = Math.floor(min - (hours * 3600) / 60)
  let seconds: string | number = Math.floor(
    min * 60 - hours * 3600 - minutes * 60
  )

  // Appends 0 when unit is less than 10
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ':' + minutes + ':' + seconds
}

// values like 2.16
export const formatHourReadable = (formatedHour: string) => {
  const isHavingMinutes = formatedHour.indexOf('.') !== -1
  if (isHavingMinutes) {
    const formatedHourArr = formatedHour.split('.')
    return `${formatNumber(formatedHourArr[0] as any)} ${i18n.t(
      'analytics.hours'
    )}, ${formatNumber(formatedHourArr[1] as any)} ${i18n.t(
      'analytics.minutes'
    )}`
  } else {
    return `${formatNumber(formatedHour as any)}`
  }
}

export const formatSecondsIntoHMS = (totalSeconds: number) => {
  return new Date((totalSeconds ?? 1) * 1000).toISOString().substr(11, 8)
}
