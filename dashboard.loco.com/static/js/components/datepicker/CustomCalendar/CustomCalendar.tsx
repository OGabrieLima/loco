import 'react-modern-calendar-datepicker/lib/DatePicker.css'
import './customCalendar.css'

import {
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SlideIn,
} from '@chakra-ui/core'
import theme from '@src/theme'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar } from 'react-modern-calendar-datepicker'

import { dateToObj } from '../../../utils/formatDateToObj'
import { createLocale } from '../../../utils/localeGeneratorCal'

const CustomCalendar = (props: any) => {
  const { t } = useTranslation()
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null,
  })
  const {
    isOpen,
    onClose,
    disableClose,
    onChange,
    title,
    calendarProps,
    value,
  } = props
  const minDate = props?.minDate || calendarProps?.minDate
  const calendarMinimumDate = minDate
    ? minDate
    : { year: 1923, month: 1, day: 1 }

  const formatDate = (date: any) => {
    let day, month, formatedDate

    day = `${date.day}`.length === 1 ? `0${date.day}` : `${date.day}`
    month = `${date.month}`.length === 1 ? `0${date.month}` : `${date.month}`
    formatedDate = `${day}/${month}/${date.year}`

    return formatedDate
  }
  const getValue = () => {
    if (calendarProps.range) {
      if (selectedDayRange?.from && selectedDayRange?.to) {
        const { from, to } = selectedDayRange
        return `${formatDate(from)} - ${formatDate(to)}`
      }
    } else {
      return selectedDay ? formatDate(selectedDay) : ''
    }
  }
  const onChangeHandler = () => {
    if (selectedDay || (selectedDayRange?.from && selectedDayRange?.to)) {
      onChange(getValue())
    }
    onClose()
    calendarProps.range
      ? setSelectedDayRange({ from: null, to: null })
      : setSelectedDay(null)
  }
  const updatedValue = value ? value : null
  const formatedDateValue = updatedValue
    ? dateToObj(updatedValue)
    : calendarProps.maximumDate

  return (
    <SlideIn in={isOpen}>
      {/* @ts-ignore */}
      {(styles: any) => (
        // @ts-ignore
        <Modal isOpen={true} onClose={onClose} isCentered={true} bg="#fff">
          <ModalOverlay opacity={styles.opacity} />
          <ModalContent
            pb={5}
            {...styles}
            bg={'#fff'}
            borderRadius="12px"
            position={['relative']}
            bottom={[0, null]}
            top={[null]}
            mb={[0]}
            w={['100vw']}
            isCentered={true}
            borderBottomLeftRadius={['8px']}
            borderBottomRightRadius={['8px']}
          >
            {/* @ts-ignore */}
            <ModalHeader isCentered={true} pb="0">
              <Flex
                alignItems="center"
                direction="column"
                color="brand.loco-primary"
                fontSize="16px"
              >
                {title}
              </Flex>
            </ModalHeader>
            {!disableClose ? (
              <Flex
                justifyContent="flex-end"
                p={1}
                position="absolute"
                top={2}
                right={2}
              >
                <Icon
                  //@ts-ignore
                  name="closeCalendar"
                  cursor="pointer"
                  onClick={() => {
                    onClose()
                  }}
                  size="20px"
                />
              </Flex>
            ) : (
              false
            )}
            <ModalBody py="0" px={['0.5rem', '1.5rem']}>
              <Calendar
                customDaysClassName={['custom-days']}
                value={
                  calendarProps?.range
                    ? selectedDayRange
                    : selectedDay
                    ? selectedDay
                    : formatedDateValue
                }
                onChange={
                  calendarProps?.range ? setSelectedDayRange : setSelectedDay
                }
                minimumDate={calendarMinimumDate}
                colorPrimary={theme.colors.brand['loco-primary']}
                colorPrimaryLight="rgba(79, 31, 255, 0.5)"
                calendarClassName={'custom-calendar'}
                calendarTodayClassName="custom-today-day"
                renderFooter={() => {
                  return (
                    <Flex justify="flex-end">
                      <Button
                        px={6}
                        borderRadius="10px"
                        bg="brand.primary-blue"
                        color="white"
                        onClick={onChangeHandler}
                      >
                        {t('profile.done')}
                      </Button>
                    </Flex>
                  )
                }}
                locale={createLocale(t)}
                {...calendarProps}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </SlideIn>
  )
}

export default CustomCalendar
