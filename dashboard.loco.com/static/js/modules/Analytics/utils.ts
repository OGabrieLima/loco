import moment from 'moment-timezone'

// To get the local timezone abbreviation (e.g : "IST", "EST")
export const getLocalTimezoneAbbreviation = () => {
  return moment.tz(moment.tz.guess()).format('z')
}

//To get the local timezone offset in ±HH:mm format (e.g : "+05:30")
export const getLocalTimezoneOffsetHHMM = () => {
  return moment().format('Z')
}

//To get the local timezone offset in mins
export const getLocalTimezoneOffset = () => {
  return moment().utcOffset()
}
