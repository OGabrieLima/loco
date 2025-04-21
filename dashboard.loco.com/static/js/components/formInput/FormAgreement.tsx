import { Checkbox, Flex, Link, Text } from '@chakra-ui/core'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { paths } from '../../routers/constants'

interface FormAgreementProps {
  name: string
  values: any
  handleChange: (val: any) => void
  isReadOnly?: boolean
}

const FormAgreement = (props: FormAgreementProps) => {
  const history = useHistory()
  const { t } = useTranslation()

  const { name, values, handleChange, isReadOnly } = props
  return !isReadOnly ? (
    <Flex alignItems="flex-start" fontSize="sm">
      <Checkbox
        name={name}
        variantColor="green"
        py="1"
        isChecked={values[name]}
        onChange={handleChange}
        size="sm"
        style={{
          marginInlineEnd: '0.5rem',
        }}
      />
      <Text as="span" color="#B2B2B2">
        <Trans
          i18nKey="home.todayStream.terms.part"
          components={{
            Wrap: (
              <Link
                as="span"
                color="white"
                fontWeight="extrabold"
                onClick={() => {
                  history.push(paths.terms)
                }}
              />
            ),
          }}
        />
      </Text>
    </Flex>
  ) : (
    <></>
  )
}

export default FormAgreement
