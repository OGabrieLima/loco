//@ts-nocheck
import differenceInSeconds from 'date-fns/differenceInSeconds'
export const GenerateRandomKey = () => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 10; i += 1) {
    const char = characters.charAt(Math.floor(Math.random() * charactersLength))
    result += char
  }
  return result
}
export const formattedTime = (endTime) => {
  const deltaMs = endTime - new Date().valueOf()

  const totalSeconds = parseInt(Math.floor(deltaMs / 1000), 10)
  const totalMinutes = parseInt(Math.floor(totalSeconds / 60), 10)
  // const totalHours = parseInt(Math.floor(totalMinutes / 60), 10);
  // const days = parseInt(Math.floor(totalHours / 24), 10);
  const seconds =
    parseInt(totalSeconds % 60, 10) >= 0 ? parseInt(totalSeconds % 60, 10) : 0
  const minutes =
    parseInt(totalMinutes % 60, 10) >= 0 ? parseInt(totalMinutes % 60, 10) : 0
  // const hours =
  //   parseInt(totalHours % 60, 10) >= 0 ? parseInt(totalHours % 60, 10) : 0;

  const formattedMinutes =
    `${minutes}`.length === 1 ? `0${minutes}` : `${minutes}`
  const formattedSeconds =
    `${seconds}`.length === 1 ? `0${seconds}` : `${seconds}`
  return `${formattedMinutes} : ${formattedSeconds}`
}

export const timeDifferenceInSeconds = (
  endTime,
  startTime?: null | number = null
) => {
  const result = differenceInSeconds(
    new Date(endTime),
    new Date(startTime ? startTime : new Date())
  )
  return result >= 0 ? result : 0
}

export const convertToMinSec = (val: number) => {
  const minutes = parseInt(val / 60, 10) >= 0 ? parseInt(val / 60, 10) : 0
  const seconds = parseInt(val % 60, 10) >= 0 ? parseInt(val % 60, 10) : 0

  const formattedMinutes =
    `${minutes}`.length === 1 ? `0${minutes}` : `${minutes}`
  const formattedSeconds =
    `${seconds}`.length === 1 ? `0${seconds}` : `${seconds}`
  return `${formattedMinutes} : ${formattedSeconds}`
}

export const removeDuplicates = (array: any[], key: string) => {
  const seen = new Set()
  return array.filter((item) => {
    const value = item[key]
    if (!seen.has(value)) {
      seen.add(value)
      return true
    }
    return false
  })
}
