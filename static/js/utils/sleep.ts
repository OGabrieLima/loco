export const sleep = async (timeoutInterval: number) => {
  await new Promise((resolve) => {
    const index = setTimeout(() => {
      resolve(index)
    }, timeoutInterval)
  })
}
