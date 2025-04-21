export const ArrayOfOjeToCSV = (items: any) => {
  let csv = ''
  const header = Object.keys(items[0]).join(',')
  const values = items.map((o: any) => Object.values(o).join(',')).join('\n')

  csv += header + '\n' + values
  const element = document.createElement('a')
  element.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
  element.target = '_blank'
  const DateObj = new Date()
  const Day =
    DateObj.getDate().toLocaleString().length === 1
      ? `0${DateObj.getDate()}`
      : DateObj.getDate()
  const Month =
    DateObj.getMonth().toLocaleString().length === 1
      ? `0${DateObj.getMonth() + 1}`
      : DateObj.getMonth()
  const Year = DateObj.getFullYear()
  const Hour =
    DateObj.getHours().toLocaleString().length === 1
      ? `0${DateObj.getHours()}`
      : DateObj.getHours()
  const Minutes =
    DateObj.getMinutes().toLocaleString().length === 1
      ? `0${DateObj.getMinutes()}`
      : DateObj.getMinutes()
  const Seconds =
    DateObj.getSeconds().toLocaleString().length === 1
      ? `0${DateObj.getSeconds()}`
      : DateObj.getSeconds()

  const fileName = `giveway_winners_list_${Day}_${Month}_${Year}_${Hour}_${Minutes}_${Seconds}`
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions

  element.download = `${fileName}.csv`
  element.click()

  return
}
