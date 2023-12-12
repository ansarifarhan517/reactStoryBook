import React from 'react'

import DatePicker from '../Variants/DatePicker'
import { tTimeFormat, tDatePickerChildren } from '../interfaces'
import { path } from '../..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import { radios, number, text, object } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import TextInput from '../../../molecules/TextInput'

export default {
  title: `${path}/DatePicker`,
  component: DatePicker
}

const TimeFormatOptions = {
  TwelveHour: 12,
  TwentyFourHour: 24
}

export const withBasicandTime = () => (
  <ThemeWrapper>
    <DatePicker
      onChange={action('On Date picker triggered')}
      label={text('Label', 'Date of Time')}
      variant='datetime'
      timeInterval={number('Time Interval', 15)}
      timeFormat={radios('Time Format', TimeFormatOptions, 12) as tTimeFormat}
      style={object('Styles', {
        position: 'absolute',
        top: 'auto',
        right: 'auto'
      })}
      dateToString={(d: Date) => {
        // return moment(d).format('YYYY-MM-DD HH:mm')
        return `${d.getHours()}:${d.getMinutes()} ${d.getDate()}/${
          d.getMonth() + 1
        }/${d.getFullYear()}`
      }}
    >
      {({ value, open, setOpen }: tDatePickerChildren) => (
        <div onClick={() => setOpen(!open)}>
          {/* {console.log(value)} */}
          <TextInput
            id='someId'
            name="Datepicker"
            className='someClassname'
            placeholder='Please Click Here'
            variant='withIcon'
            iconVariant='calendar'
            iconSize='md'
            value={value?.toString()}
            onChange={action('On text input clicked')}
            iconStyle={{ padding: '9px 9px 9px 9px' }}
          />
        </div>
      )}
    </DatePicker>
  </ThemeWrapper>
)
