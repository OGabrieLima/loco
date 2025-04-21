export const formatNumber = (value: number) => {
  const numberFormatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  })
  //@ts-ignore
  return isNaN(value) ? '-' : numberFormatter.format(value)
}
