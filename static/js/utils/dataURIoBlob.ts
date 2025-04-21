export const dataURItoBlob = (
  dataURI: string
  // callback?: any
) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1])

  // separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // write the ArrayBuffer to a blob, and you're done
  const bb = new Blob([ab], {
    type: mimeString,
  })
  return bb
}

// Step 1: Convert Blob to data URL
export function blobToDataURL(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function createLottieJSON(base64Image: string) {
  return {
    v: '5.5.7',
    meta: { g: 'LottieFiles AE 0.1.20', a: '', k: '', d: '', tc: '' },
    fr: 29.9700012207031,
    ip: 0,
    op: 899.000036617021,
    w: 250,
    h: 250,
    nm: '8 bit',
    ddd: 0,
    assets: [{ id: 'image_0', w: 250, h: 250, u: '', p: base64Image, e: 1 }],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 2,
        nm: '8 bit.png',
        cl: 'png',
        refId: 'image_0',
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [125, 125, 0], ix: 2 },
          a: { a: 0, k: [125, 125, 0], ix: 1 },
          s: { a: 0, k: [100, 100, 100], ix: 6 },
        },
        ao: 0,
        ip: 0,
        op: 899.000036617021,
        st: 0,
        bm: 0,
      },
    ],
    markers: [],
  }
}
