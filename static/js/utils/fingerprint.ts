import fp from 'fingerprintjs2'

//  using fingerprint to get unique fingerprint
export const getFingerprint = (): Promise<string> =>
  // eslint-disable-next-line no-undef
  new Promise((resolve) => {
    const fingerprint = window?.localStorage?.getItem('fingerprint')
    const populateFIngerprint = (fingerprint: string) => {
      return fingerprint.replaceAll('live', '') // remove live from dashboard
      // if (fingerprint.endsWith('live')) {
      //   return fingerprint.
      // } else {
      //   return fingerprint // + 'live' "live" on locogg only
      // }
    }
    if (fingerprint) {
      window?.localStorage?.setItem('fingerprint', fingerprint)
      resolve(populateFIngerprint(fingerprint))
    } else {
      fp.get((components) => {
        const values = components.map(function(component) {
          return component.value
        })
        const murmur = populateFIngerprint(fp.x64hash128(values.join(''), 31))
        window?.localStorage?.setItem('fingerprint', murmur)
        resolve(murmur)
      })
    }
  })
