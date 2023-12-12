import React from 'react'

import DatePicker from '../Variants/DatePicker'
import { tDatePickerChildren, tTimeFormat } from '../interfaces'
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

export const withTimeOnly = () => (
  <ThemeWrapper>
    <DatePicker
      onChange={action('On Change Triggered')}
      label={text('Label', 'Time')}
      variant='time'
      timeInterval={number('Time Interval', 15)}
      timeFormat={radios('Time Format', TimeFormatOptions, 12) as tTimeFormat}
      style={object('Styles', {
        position: 'absolute',
        top: 'auto',
        right: 'auto'
      })}
    >
      {({ value, open, setOpen }: tDatePickerChildren) => (
        <div onClick={() => setOpen(!open)}>
          <TextInput
            id='someId'
            name={name}
            className='someClassname'
            placeholder='Please Click Here'
            variant='withIcon'
            iconVariant='calendar'
            iconSize='md'
            value={value?.toString()}
            onChange={action('On change clicked')}
            iconStyle={{ padding: '9px 9px 9px 9px' }}
          />
        </div>
      )}
    </DatePicker>
  </ThemeWrapper>
)
