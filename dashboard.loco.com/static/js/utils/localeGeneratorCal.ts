import { TFunction } from 'i18next'

interface Locale {
  months: string[]
  weekStartingIndex: number
  weekDays: {
    name: string
    short: string
    isWeekend?: boolean
  }[]
  getToday: (gregorainTodayObject: any) => any
  toNativeDate: (date: any) => any
  getMonthLength: (date: any) => number
  transformDigit: (digit: any) => any
  nextMonth: string
  previousMonth: string
  openMonthSelector: string
  openYearSelector: string
  closeMonthSelector: string
  closeYearSelector: string
  defaultPlaceholder: string
  from: string
  to: string
  digitSeparator: string
  yearLetterSkip: number
  isRtl: boolean
}
export const createLocale = (t: TFunction): Locale => {
  return {
    months: t('calendar.months', { defaultValue: '' }).split('_'),

    // week days by order
    weekDays: t('calendar.days', { defaultValue: '' })
      .split('_')
      .map((e, i, arr) => ({
        name: e, // used for accessibility
        short: t('calendar.daysShort', { defaultValue: '' }).split('_')[i], // displayed at the top of days' rows
        ...(i === 0 || i === arr.length - 1 ? { isWeekend: true } : {}), // is it a formal weekend or not?
      })),

    weekStartingIndex: 0,

    getToday(gregorainTodayObject: any) {
      return gregorainTodayObject
    },

    toNativeDate(date: any) {
      return new Date(date.year, date.month - 1, date.day)
    },

    // return a number for date's month length
    getMonthLength(date: any) {
      return new Date(date.year, date.month, 0).getDate()
    },

    // return a transformed digit to your locale
    transformDigit(digit: any) {
      return digit
    },

    // texts in the date picker
    nextMonth: t('calendar.nextMonth'),
    previousMonth: t('calendar.previousMonth'),
    openMonthSelector: t('calendar.openMonthSelector'),
    openYearSelector: t('calendar.openYearSelector'),
    closeMonthSelector: t('calendar.closeMonthSelector'),
    closeYearSelector: t('calendar.closeYearSelector'),
    defaultPlaceholder: t('calendar.defaultPlaceholder'),

    // for input range value
    from: t('calendar.from'),
    to: t('calendar.to'),

    // used for input value when multi dates are selected
    digitSeparator: ',',

    // if your provide -2 for example, year will be 2 digited
    yearLetterSkip: 0,

    // is your language rtl or ltr?
    isRtl: false,
  }
}
