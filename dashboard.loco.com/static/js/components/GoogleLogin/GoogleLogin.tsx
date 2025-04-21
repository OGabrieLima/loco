import { getTokenFromCode } from '@api/apiRequest'
import * as Google_Login from '@react-oauth/google'
import React from 'react'

import { GOOGLE_CLIENT_ID } from '../../constent'

export default Google_Login

interface GoogleOAuthProviderProps {
  children: React.ReactNode | undefined
}
export const GoogleOAuthProvider = (props: GoogleOAuthProviderProps) => {
  return (
    <Google_Login.GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {props.children}
    </Google_Login.GoogleOAuthProvider>
  )
}

interface UseGoogleLoginProps {
  render: ({ onClick }: { onClick: () => void }) => React.ReactElement
  onSuccess: (value?: any) => void
  onFailure: (value?: any) => void
}

export const UseGoogleLogin = (props: UseGoogleLoginProps) => {
  const { onSuccess, onFailure, render } = props || {}

  const login = Google_Login.useGoogleLogin({
    onError: onFailure,
    onSuccess: async (codeResponse) => {
      try {
        const result = await getTokenFromCode(codeResponse?.code)
        if (result instanceof Error) {
          const err = new Error() as any
          try {
            const errorMessage = (JSON.parse(result?.message) || {}).error
            err.code = errorMessage?.code
            err.message = errorMessage?.message
            err.stack = errorMessage?.stack
          } catch (err) {
            //
          }
          throw err
        }
        if (result?.error) {
          throw result?.error
        }
        const tokenId = result.tokens.id_token
        const profileObj = result.profileObj
        onSuccess({ tokenId, profileObj })
      } catch (_err) {
        const err = _err as any
        // Throwing error in <onError> Format
        onFailure({
          error: err?.code || 518,
          error_description: err?.message || 'Something Went Wrong',
          error_uri: err?.stack || 'something_went_wrong',
        })
      }
    },
    flow: 'auth-code', // For server-side authentication
  })

  return render({ onClick: login })
}
