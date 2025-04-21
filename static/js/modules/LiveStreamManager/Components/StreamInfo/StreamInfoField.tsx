import { Flex, Text } from '@chakra-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface streamInfoFieldProps {
  label: string | undefined
  value: string | undefined | any
}
const StreamInfoField = ({
  field: { label, value },
}: {
  field: streamInfoFieldProps
}) => {
  const { t } = useTranslation()
  return (
    <Flex direction="column" mb={3}>
      <Text
        fontSize="12px"
        lineHeight="130%"
        fontWeight={'600'}
        mb={'6px'}
        color="brand.loco-grey-20"
      >
        {label}
      </Text>
      {label !== t('home.todayStream.tags') &&
      label !== t('home.todayStream.secondaryLanguage') ? (
        <Text fontSize="14px" lineHeight="130%" fontWeight={'700'}>
          {value}
        </Text>
      ) : (
        <Flex>
          {value?.map((val: string) => (
            <Flex
              key={val}
              bg="brand.loco-grey-8"
              color="white"
              py={'8px'}
              px={'16px'}
              rounded="12px"
              mr={'6px'}
              fontSize="12px"
              lineHeight="130%"
              fontWeight={'400'}
            >
              {val}
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  )
}

export default StreamInfoField
