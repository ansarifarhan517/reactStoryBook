import React from 'react'
import DatePicker from '../Variants/DatePicker'
import { path } from '../..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import { boolean, text, object } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import TextInput from '../../../../components/molecules/TextInput'
import { tDatePickerChildren } from '../interfaces'

export default {
  title: `${path}/DatePicker`,
  component: DatePicker
}

const ArrayofDates = [
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 2
  ),
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 2
  )
]

// const minDate = new Date(
//   new Date().getFullYear(),
//   new Date().getMonth() - 1,
//   new Date().getDate() - 10
// )
// const maxDate = new Date(
//   new Date().getFullYear(),
//   new Date().getMonth() + 1,
//   new Date().getDate() + 10
// )

export const withBasic = () => (
  <ThemeWrapper>
    <DatePicker
      onChange={action('On Change triggered')}
      label={text('Label', 'Date of Time')}
      variant='date'
      dropdown
      className='DOB'
      selected={new Date(2020, 6, 22)}
      excludeDates={ArrayofDates}
      error={boolean('Error ', false)}
      disabled={boolean('Disabled', false)}
      required={boolean('Required', false)}
      errorMessage={text('Error Message', '')}
      dateToString={(date: Date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      }}
      style={object('Styles', {})}
    >
      {({ value, open, setOpen }: tDatePickerChildren) => (
        <div onClick={() => setOpen(!open)}>
          <TextInput
            id='someId'
            name='someName'
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
