import styled from '@emotion/styled'
import { paths } from '@routers/constants'
import React from 'react'
import { Trans } from 'react-i18next'
import { useHistory } from 'react-router-dom'

const Support = styled.div`
  font-size: 10px;
  background: linear-gradient(135deg, #cd70ff 0%, #614ddd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
`
const HeaderSupport = () => {
  const history = useHistory()
  return (
    <Support
      onClick={() => {
        history.push(paths.dashboard.help)
      }}
    >
      <Trans i18nKey="helpSection.title" />
    </Support>
  )
}

export default HeaderSupport
