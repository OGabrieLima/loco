import { resetAmplitudeSession } from './Amplitude/amplitude'

const exitWebView = (): void => {
  const tnc = localStorage.getItem('terms_condition_modal_2023')
  localStorage.clear()
  tnc && localStorage.setItem('terms_condition_modal_2023', tnc)
  resetAmplitudeSession()
  //@ts-ignore
  if (window?.NativeUIWebInterface) {
    //@ts-ignore
    window?.NativeUIWebInterface?.exit()
  }
  if (window?.DashboardInterface) {
    //@ts-ignore
    window?.DashboardInterface?.exit()
  }

  //@ts-ignore
  if (window?.webkit?.messageHandlers?.exit) {
    //@ts-ignore
    window?.webkit?.messageHandlers?.exit?.postMessage('exit')
  }
}

export default exitWebView
