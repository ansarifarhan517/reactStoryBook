import React, { useEffect, useState } from 'react'
import {
  IDateTimeSlotPicker,
  IDateTimeSlots,
  ISlotPickerDateObject,
  ISlotPickerValue
} from './interfaces'
import DatePickerPlugin from 'react-datepicker'
import IconDropdown from '../IconDropdown'
import Box from '../../atoms/Box'
import IconButton from '../../atoms/IconButton'
import { CustomHeaderStyled } from '../DatePicker/Styles/DatePicker.styles'
import {
  StyledDatePickWrapper,
  StyledSlotBlockWrapper,
  StyledDateTimeSlotPicker,
  StyledSlotLabel,
  StyledPreferenceDropdownWrapper,
  StyledFooterButtonWrapper,
  StyledTime,
  StyledPreferenceWrapper,
  StyledSlotCard,
  StyledStatusLabel,
  SlotPickerStyled
} from './styled'
import {
  defaultStatus,
  months as monthsArray,
  year as YearsArray,
  highlightWithRanges
} from './defaults'
import { highlightDateConditionally, prepareSlotPickerData } from './utils'

const DateTimeSlotPicker = ({
  isOpen = false,
  children,
  date,
  timeWindowPrefrenceDropdown,
  DateTimeSlots,
  status = defaultStatus,
  months = monthsArray,
  years = YearsArray,
  title = 'Available Time Windows:',
  preferenceDropdownLabel = 'Prefrence By:',
  style,
  onChange,
  ApplyLabel = 'Apply',
  CancelLabel = 'Cancel'
}: IDateTimeSlotPicker) => {
  const [slotArray, setSlotArray] = useState(DateTimeSlots)
  const [open, setOpen] = useState(isOpen)
  const [selectedDate, setSelectedDate] = useState(date)
  const [selectedDateSlots, setSelectedDateSlots] = useState<
    undefined | IDateTimeSlots
  >(undefined)
  const [preference, setPreference] = useState(
    timeWindowPrefrenceDropdown[0].label
  )
  const [availablePreference, setAvailablePreference] = useState(
    timeWindowPrefrenceDropdown[0]?.availableSlotObjectKey
  )
  const [totalPreference, setTotalPreference] = useState(
    timeWindowPrefrenceDropdown[0]?.availableSlotObjectKey
  )
  const [showHomeDate, setShowHomeDate] = useState(false)
  const [highlightDates, setHighlightDates] = useState<any[] | undefined>()
  // slotPicker time that is always selected
  const [slotPicker, setSlotPicker] = useState<
    ISlotPickerDateObject | undefined
  >()

  const [slotPickerValue, setSlotPickerValue] = useState<
    ISlotPickerValue | undefined
  >()

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    setSelectedDate(date)
  }, [date])

  useEffect(() => {
    const slotData = DateTimeSlots && prepareSlotPickerData(DateTimeSlots)
    DateTimeSlots && setSlotArray(slotData)
    const dates =
      DateTimeSlots && highlightDateConditionally(slotData, defaultStatus)
    dates && setHighlightDates([...dates])
  }, [DateTimeSlots])

  const handleSelect = () => {
    slotPicker &&
      setSlotPickerValue({
        startTimeWindow: new Date(slotPicker?.startTimeWindow),
        endTimeWindow: new Date(slotPicker?.endTimeWindow)
      })
    setOpen(false)
    slotPicker &&
      onChange({
        startTimeWindow: new Date(slotPicker?.startTimeWindow),
        endTimeWindow: new Date(slotPicker?.endTimeWindow)
      })
  }

  // handle clicking of Dates
  const handleDateClicked = (date: Date) => {
    setSelectedDate(date)
    const temp = date
    temp.setHours(5)
    temp.setMinutes(30)
    temp.setSeconds(0)
    const selectedDate = temp.getTime()
    const SlotObject = slotArray?.find((m: any) => {
      const d1 = new Date(m?.date)
      d1.setSeconds(0)
      d1.setMilliseconds(0)
      console.log(d1.getTime(), selectedDate, d1.getTime() === selectedDate)
      const d2 = d1.getTime()
      return d2 === selectedDate
    })

    SlotObject
      ? setSelectedDateSlots(SlotObject)
      : setSelectedDateSlots(SlotObject)

    console.log(SlotObject && SlotObject.slots[0], 'first slot')
    SlotObject &&
      setSlotPicker({
        startTimeWindow: SlotObject.slots[0].startTimeWindow as any,
        endTimeWindow: SlotObject.slots[0].endTimeWindow as any
      })
  }

  // handle Preference Dropdown Change
  const handlePreferenceChange = (value: any) => {
    const slotObject =
      typeof value === 'string'
        ? timeWindowPrefrenceDropdown?.find((m) => m.value === value)
        : value
    setTotalPreference(slotObject?.totalSlotObjectKey)
    setAvailablePreference(slotObject?.availableSlotObjectKey)
    setPreference(value)
  }

  // custom render Day component
  const renderDayContents = (day: any, date: any) => {
    date.setHours(5)
    date.setMinutes(30)
    date.getTime()
    const dayObject =
      highlightDates &&
      highlightDates?.find((m: any) => m?.date === date.getTime())

    return (
      <span className={dayObject ? dayObject.className : 'none'}>{day}</span>
    )
  }

  const handleSlotCick = (startTime: any, endTime: any) => {
    setSlotPicker({
      startTimeWindow: startTime,
      endTimeWindow: endTime
    })
  }

  return (
    <div>
      {children({ value: slotPickerValue, open, setOpen })}
      {open && (
        <StyledDatePickWrapper style={style}>
          <StyledDateTimeSlotPicker>
            <DatePickerPlugin
              minDate={new Date()}
              maxDate={
                new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 4,
                  new Date().getDate()
                )
              }
              showDisabledMonthNavigation
              renderCustomHeader={(
                // custom Header
                {
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled
                }
              ) => (
                <CustomHeaderStyled>
                  <IconButton
                    onClick={decreaseMonth}
                    onlyIcon
                    iconVariant='angle-left'
                    iconSize='xs'
                    color='black'
                    disabled={prevMonthButtonDisabled}
                  />
                  <IconButton
                    onClick={() => {
                      changeMonth(new Date().getMonth())
                      changeYear(new Date().getFullYear())
                      setShowHomeDate(true)
                    }}
                    onlyIcon
                    iconVariant='picker-home'
                    iconSize='sm'
                    color='grey.A800'
                    style={{ marginTop: '-2px' }}
                  />
                  <div style={{ marginTop: '1px', display: 'flex' }}>
                    <Box mr='15px'>
                      <IconDropdown
                        variant='date-picker'
                        optionList={months}
                        onChange={(value: string | undefined) => {
                          return (
                            value &&
                            changeMonth(
                              months.map(({ label }) => label).indexOf(value)
                            )
                          )
                        }}
                        value={months[date?.getMonth()]?.value}
                        width='80px'
                        showDownArrow
                      />
                    </Box>
                    <IconDropdown
                      variant='date-picker'
                      optionList={years}
                      onChange={(value: string | undefined) =>
                        value && changeYear((value as unknown) as number)
                      }
                      value={date?.getFullYear().toString()}
                      width='46px'
                      showDownArrow
                    />
                  </div>
                  <IconButton
                    onClick={increaseMonth}
                    onlyIcon
                    iconVariant='angle-right'
                    iconSize='xs'
                    color='black'
                    disabled={nextMonthButtonDisabled}
                  />
                </CustomHeaderStyled>
              )}
              renderDayContents={renderDayContents}
              selected={selectedDate}
              onChange={handleDateClicked}
              highlightDates={showHomeDate ? highlightWithRanges : undefined}
              inline
            />
          </StyledDateTimeSlotPicker>
          <StyledSlotBlockWrapper>
            <Box p='15px'>
              <StyledSlotLabel>{title}</StyledSlotLabel>
              <StyledPreferenceDropdownWrapper>
                <span>{preferenceDropdownLabel}</span>
                <IconDropdown
                  variant='date-picker'
                  optionList={timeWindowPrefrenceDropdown}
                  onChange={handlePreferenceChange}
                  value={timeWindowPrefrenceDropdown[0].value}
                  width='80px'
                  showDownArrow
                />
              </StyledPreferenceDropdownWrapper>
            </Box>

            <div>
              <SlotPickerStyled>
                {selectedDateSlots ? (
                  selectedDateSlots?.slots?.map((m: any, index: number) => {
                    const startTime = new Date(m?.startTimeWindow)
                    const endTime = new Date(m?.endTimeWindow)

                    return (
                      <StyledSlotCard
                        selected={
                          slotPicker?.startTimeWindow === m?.startTimeWindow &&
                          slotPicker?.endTimeWindow === m?.endTimeWindow
                        }
                        key={index}
                        onClick={() =>
                          handleSlotCick(m?.startTimeWindow, m?.endTimeWindow)
                        }
                      >
                        <div>
                          <StyledTime>
                            {console.log(startTime, endTime)}
                            {(startTime.getHours() >= 10
                              ? startTime.getHours()
                              : `0${startTime.getHours()}`) +
                              ':' +
                              (startTime.getMinutes() >= 10
                                ? startTime.getMinutes()
                                : `0${startTime.getMinutes()}`) +
                              ' - ' +
                              (endTime.getHours() >= 10
                                ? endTime.getHours()
                                : `0${endTime.getHours()}`) +
                              ':' +
                              (endTime.getMinutes() >= 10
                                ? endTime.getMinutes()
                                : `0${endTime.getMinutes()}`)}
                          </StyledTime>
                          <StyledPreferenceWrapper>
                            {m[availablePreference] && m[totalPreference]
                              ? `${preference}: ${m[availablePreference]} / ${
                                  m[totalPreference]
                                } (${
                                  (parseInt(m[availablePreference]) /
                                    parseInt(m[totalPreference])) *
                                  100
                                }%)`
                              : 'NA'}
                          </StyledPreferenceWrapper>
                        </div>
                        <StyledStatusLabel
                          color={
                            m?.status === status?.available?.value
                              ? 'green'
                              : 'red'
                          }
                          selected={
                            slotPicker?.startTimeWindow ===
                              m?.startTimeWindow &&
                            slotPicker?.endTimeWindow === m?.endTimeWindow
                          }
                        >
                          {m?.status === status?.available?.value
                            ? status.available?.label
                            : status.notAvailable?.label}
                        </StyledStatusLabel>
                      </StyledSlotCard>
                    )
                  })
                ) : (
                  <div>{'   '}</div>
                )}
              </SlotPickerStyled>

              <StyledFooterButtonWrapper>
                <IconButton
                  onClick={handleSelect}
                  iconVariant='icomoon-tick-circled'
                  children={ApplyLabel}
                />
                <IconButton
                  onClick={() => setOpen(false)}
                  iconVariant='icomoon-close'
                  children={CancelLabel}
                />
              </StyledFooterButtonWrapper>
            </div>
          </StyledSlotBlockWrapper>
        </StyledDatePickWrapper>
      )}
    </div>
  )
}

export default DateTimeSlotPicker
