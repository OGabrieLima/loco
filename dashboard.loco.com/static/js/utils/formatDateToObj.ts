export const dateToObj = (date: any) => {
  if (!date) {
    return
  }
  const splitedDate: any[] = date.split('/')
  return {
    day: parseInt(splitedDate[0]),
    month: parseInt(splitedDate[1]),
    year: parseInt(splitedDate[2]),
  }
}
