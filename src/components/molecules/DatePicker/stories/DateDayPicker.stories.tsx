import React from 'react'

import DatePicker from '../Variants/DatePicker'
import { tDatePickerChildren, tTimeFormat } from '../interfaces'
import { path } from '../..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import { radios, number, text, object } from '@storybook/addon-knobs'
// import { action } from '@storybook/addon-actions'
import TextInput from '../../TextInput'

export default {
  title: `${path}/DatePicker`,
  component: DatePicker
}

const TimeFormatOptions = {
  TwelveHour: 12,
  TwentyFourHour: 24
}

export const withTimeAndDay = () => (
  <ThemeWrapper>
    <DatePicker
      showDaysRange
      onChange={(e) => {
        console.log('outsideValue1', e)
      }}
      label={text('Label', 'Time')}
      variant='time'
      timeInterval={number('Time Interval', 15)}
      timeFormat={radios('Time Format', TimeFormatOptions, 12) as tTimeFormat}
      style={object('Styles', {
        position: 'absolute',
        top: 'auto',
        right: 'auto'
      })}
      dateToString={(d: Date) => {
        // return moment(d).format('YYYY-MM-DD HH:mm')
        return `${d.getHours()}:${d.getMinutes()} `
      }}
    >
      {({
        value,
        open,
        setOpen,
        selectedDay,
        nextCounter,
        previousCounter
      }: tDatePickerChildren) => (
        <div onClick={() => setOpen(!open)}>
          <TextInput
            id='someId'
            name='Datepicker'
            className='someClassname'
            placeholder='Please Click Here'
            variant='withIcon'
            iconVariant='calendar'
            iconSize='md'
            value={
              value ||
              new Date(
                'Mon Oct 11 2021 00:30:00 GMT+0530 (India Standard Time)'
              )
            }
            onChange={() => {
              console.log(
                'outsideValue2',
                value,
                selectedDay,
                nextCounter,
                previousCounter
              )
            }}
            iconStyle={{ padding: '9px 9px 9px 9px' }}
            style={{ width: '300px' }}
          />
        </div>
      )}
    </DatePicker>
  </ThemeWrapper>
)
