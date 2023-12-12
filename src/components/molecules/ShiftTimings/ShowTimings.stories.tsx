import React from 'react'
import { path } from '..'

import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import ShiftTimings from '../ShiftTimings'
import { tTimeFormat } from '../DatePicker/interfaces'
import { radios, number, text, object, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

export default {
  title: `${path}/ShiftTimings`,
  component: ShiftTimings
}
const radioOptions = {
  timeFormat: { '12 Hour': 12, '24 Hour': 24 }
}
export const withPlayground = () => (
  <ThemeWrapper>
    <ShiftTimings
      fromLabel={text('fromlabel', 'From')}
      toLabel={text('toLabel', 'To')}
      fromError={boolean('fromError', false)}
      toError={boolean('toError', false)}
      fromErrorMessage={text('From Error Message', 'This is required')}
      toErrorMessage={text('To Error Message', 'This is required')}
      timeFormat={
        radios('Time Format', radioOptions.timeFormat, 24) as tTimeFormat
      }
      label='Shift Timings'
      timeInterval={number('timeInterval', 15)}
      style={object('style', { width: '800px' })}
      onFromChange={action('On From Change')}
      onToChange={action('On TO Change')}
      onChange={action('Change')}
      onRemove={action('On Remove Change')}
      onAdd={action('On Add Change')}
      selected={object('defaultSelected', [
        {
          id: '45890',
          fromValue: new Date(2020, 9, 23, 7, 45),
          toValue: new Date(2020, 9, 23, 8, 45)
        },
        {
          id: '8236jhg',
          fromValue: new Date(2020, 9, 23, 9, 45),
          toValue: new Date(2020, 9, 23, 10, 45)
        },
        {
          id: '238gjk',
          fromValue: new Date(2020, 9, 23, 11, 45),
          toValue: new Date(2020, 9, 23, 12, 45)
        }
      ])}
    />
  </ThemeWrapper>
)
