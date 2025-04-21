import * as React from 'react'

const useSkipFirstRender = (
  callback: React.EffectCallback,
  dependencies: React.DependencyList
): void => {
  const ref = React.useRef(false)
  React.useEffect(() => {
    if (!ref.current) {
      ref.current = true
      return
    }
    callback()
  }, dependencies)
}

export default useSkipFirstRender
