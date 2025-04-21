import { parseSelectedLanguage } from '@src/i18n/utils'
import i18next from 'i18next'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../app/RootReducer'

const useVerloopChat = (): null => {
  const { me } = useSelector((state: RootState) => state.login)
  useEffect(() => {
    ;(function(w: typeof window, d: typeof document, s: string, u: string) {
      if (d.getElementById('verloop-script')) return
      w.Verloop = function(c: any) {
        w.Verloop._.push(c)
      }
      w.Verloop._ = []
      w.Verloop.url = u
      const j = (d.createElement(s) as unknown) as HTMLScriptElement
      j.async = true
      j.id = 'verloop-script'
      j.src = 'https://locoapp.verloop.io/livechat/script.min.js'
      d.body.appendChild(j)
    })(window, document, 'script', 'https://locoapp.verloop.io/livechat')
  }, [])
  useEffect(() => {
    if (me?.username) {
      window.Verloop(function(this: any) {
        this.setUserParams({
          name: me?.username,
          email: me?.email,
        })
        this.setCustomField('user_uid', me?.user_uid, { scope: 'user' })
        this.setCustomField('country', me?.country_iso_code, { scope: 'user' })
        this.setCustomField(
          'language',
          parseSelectedLanguage(i18next.resolvedLanguage),
          { scope: 'user' }
        )
        this.setCustomField('source', 'dashboard', { scope: 'user' })
        this.setRecipe('aBRLqDgST7WH5bvSH')
      })
    }
  }, [me?.username])
  return null
}

export default useVerloopChat
