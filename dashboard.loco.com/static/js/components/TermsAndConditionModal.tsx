import { RootState } from '@app/RootReducer'
import { Button, Flex, Text } from '@chakra-ui/core'
import NewModal from '@components/NewModal'
import { paths } from '@src/routers/constants'
import theme from '@src/theme'
import { eventActions } from '@utils/Amplitude'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const TermsAndConditionModal = () => {
  const [isOpen, setOpen] = useState(false)
  const { me } = useSelector((state: RootState) => state.login)
  const { t } = useTranslation()
  const useruid = me?.user_uid

  const bgColor = theme.colors.brand['loco-primary']
  useEffect(() => {
    if (!useruid) return
    const status = window.localStorage.getItem('terms_condition_modal_2023')
    if (status === 'ACCEPTED' || status === 'REJECTED') {
      return
    }
    eventActions.sendAmplitudeData('visit_dashboard_terms', {
      user_id: useruid,
      user_type: me.user_type,
      username: me.username,
    })
    setOpen(true)
  }, [useruid])

  if (!useruid) {
    return null
  }

  const eventProperty = {
    user_id: useruid,
    user_type: me.user_type,
    username: me.username,
  }
  return (
    <NewModal
      isOpen={isOpen}
      onClose={() => {
        eventActions.sendAmplitudeData('dashboard_terms_accepted', {
          ...eventProperty,
          ctr_clicked: 'dismissed',
        })
        window.localStorage.setItem('terms_condition_modal_2023', 'REJECTED')
        setOpen(false)
      }}
      isCentered={true}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      modalContentStyle={{
        width: ['80%', '700px'],
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
        position: 'relative',
        top: null,
        bottom: null,
        mb: null,
      }}
      modalHeaderStyle={{
        px: 0,
        pb: 0,
      }}
      modalBodyStyle={{
        py: [8, 8],
        px: [0, 0],
      }}
      modalBodyComponent={
        <Flex w={'full'} direction="column" flex={1} px={[4, 8]} py={[2, 4]}>
          <Text fontSize={'md'} fontWeight={900} letterSpacing={'1px'}>
            {t('login.annual_terms_page.title')}
          </Text>
          <br />
          <Text fontSize={'xs'} textAlign="justify" letterSpacing={'1px'}>
            {t('login.annual_terms_page.description')}{' '}
            <a
              href={paths.terms}
              target="_blank"
              style={{
                textDecoration: 'underline',
                display: 'inline',
                color: theme.colors.brand['loco-primary'],
              }}
              rel="noreferrer"
            >
              {t('login.annual_terms_page.description_link')}
            </a>{' '}
            {t('login.annual_terms_page.description2')}
          </Text>
          <Button
            mt={'20px'}
            rounded={10}
            letterSpacing="1px"
            px={'4.5rem'}
            py={1}
            fontWeight={700}
            color={'white'}
            background={bgColor}
            _hover={{ background: bgColor }}
            _active={{ background: bgColor, transform: 'scale(1.02)' }}
            _focus={{ background: bgColor, outline: 'none' }}
            onClick={() => {
              eventActions.sendAmplitudeData('dashboard_terms_accepted', {
                ...eventProperty,
                ctr_clicked: 'accepted',
              })
              window.localStorage.setItem(
                'terms_condition_modal_2023',
                'ACCEPTED'
              )

              setOpen(false)
            }}
          >
            {t('login.annual_terms_page.button_text')}
          </Button>
        </Flex>
      }
    />
  )
}

export default TermsAndConditionModal
