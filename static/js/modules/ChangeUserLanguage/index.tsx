import { RootState } from '@app/RootReducer'
import I18nLanguageSelector from '@components/i18nLanguageSelector'
import { isLanguageSelectionEnabled } from '@src/constent'
import React from 'react'
import { useSelector } from 'react-redux'

const ChangeUserLanguage = () => {
  const { languageSelctionOriginModal } = useSelector(
    (state: RootState) => state.app
  )
  if (!languageSelctionOriginModal || !isLanguageSelectionEnabled())
    return <></>
  return (
    <>
      {/* THIS IS M-WEB Route.*/}
      <I18nLanguageSelector origin="profile_section" isSpecialCase />
    </>
  )
}

export default ChangeUserLanguage
