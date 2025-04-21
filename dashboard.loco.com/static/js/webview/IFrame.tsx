import { Box, Flex, Icon, Image } from '@chakra-ui/core'
import { DEFAULT_LANGUAGE } from '@src/i18n/constants'
import { parseSelectedLanguage } from '@src/i18n/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { isWebViewBuild, LOCO_WEB_URL } from '../constent'
import locowithicon from '../images/locowithicon.png'
import { paths } from '../routers/constants'

interface WebViewHeaderProps {
  children: React.ReactNode
}

export const WebViewHeader = ({ children }: WebViewHeaderProps) => {
  const history = useHistory()

  return (
    <Flex
      display={['flex', 'flex', 'flex']}
      w="full"
      bg={'brand.primary-dark-black-v2'}
      justifyContent="center"
      alignContent="center"
      position="relative"
      border={'pink.500'}
      py={4}
      px={2}
    >
      <Flex
        position="absolute"
        left={0}
        top={0}
        px={2}
        py={4}
        alignContent="center"
      >
        <Icon
          name="arrow-back"
          size="8"
          color="white"
          alignContent="center"
          onClick={() => {
            if (isWebViewBuild) {
              history.push(paths.dashboard.menu)
            } else {
              history.push(paths.dashboard.home)
            }
          }}
        />
      </Flex>
      <Box>{children}</Box>
    </Flex>
  )
}

interface PolicyDocProps {
  urlPath: string
}

const PolicyDoc: React.FC<PolicyDocProps> = ({ urlPath }) => {
  const { i18n } = useTranslation()
  const currentLang = parseSelectedLanguage(i18n.resolvedLanguage)
  const languageSpecificTerms = `${LOCO_WEB_URL}/legal/${urlPath}${
    currentLang !== DEFAULT_LANGUAGE ? `/?lang=${currentLang}` : ''
  }`

  return (
    <>
      <WebViewHeader>
        <Image src={locowithicon} alt="loco icon" height={5} mt={2} />
      </WebViewHeader>
      <div
        dangerouslySetInnerHTML={{
          __html: `<iframe src="${languageSpecificTerms}" style="overflow:hidden;height:100vh;width:100%" height="100vh" width="100%" ></iframe>`,
        }}
      />
    </>
  )
}

export const PrivacyPolicy = () => <PolicyDoc urlPath="privacy-policy" />
export const TermsConditions = () => <PolicyDoc urlPath="terms-of-use" />
export const StreamerAgreement = () => <PolicyDoc urlPath="agreement" />
