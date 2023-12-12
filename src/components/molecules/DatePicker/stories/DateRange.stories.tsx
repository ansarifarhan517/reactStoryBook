import React from 'react'
import { DatePicker, DateRangePicker } from '../../DatePicker'
import { tDateRangeChildren } from '../interfaces'
import { path } from '../..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import { boolean, text, object } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { TextInputStyled } from '../Styles/DateRange.styles'
import TextInput from '../../TextInput'

export default {
  title: `${path}/DatePicker`,
  component: DatePicker
}

const getFormattedDate = (date: Date) => {
  const todayTime = date
  const month = todayTime.getMonth() + 1
  const day = todayTime.getDate()
  const year = todayTime.getFullYear()
  const hours = todayTime.getHours()
  const minutes = todayTime.getMinutes()
  const AM = todayTime.getHours() > 12 ? 'PM' : 'AM'

  return month + '/' + day + '/' + year + '-' + hours + ':' + minutes + ' ' + AM
}

export const withDateRange = () => {
  const startDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 8
  )

  const endDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 1
  )

  const isInValidDate = (d: any) => {
    return d instanceof Date && isNaN(d.getTime())
  }
  // const convertStringToDate = (input: string) => {
  //   const finalDate = new Date()
  //   const dateArray = input.trim().split('/')
  //   const month = parseInt(dateArray[0])
  //   if (month <= 12) {
  //     //  valid day
  //     finalDate.setMonth(month - 1)

  //     // set Month
  //     const day = parseInt(dateArray[1])
  //     if (day <= 31) {
  //       finalDate.setDate(day)

  //       // set year
  //       const year = parseInt(dateArray[2])
  //       if (year <= 2050 && year >= 1970) {
  //         finalDate.setFullYear(year)

  //         // return finalDate
  //         return finalDate
  //       }
  //     }
  //   }
  //   return undefined
  // }
  const convertStringToDate = (input: string) => {
    const newDate = new Date(input)
    if (isInValidDate(newDate)) {
      return undefined
    } else {
      console.log('String to Date: ', newDate)
      return newDate
    }
  }
  return (
    <ThemeWrapper>
      <DateRangePicker
        onFromChange={action('From Clicked')}
        onToChange={action('To Clicked')}
        onApply={action('Apply Clicked')}
        onCancel={action('Cancel Clicked')}
        label={text('Label', 'Date Range')}
        variant='daterange'
        timeFormat={12}
        showTime={boolean('Show time', true)}
        style={object('style', {
          position: 'absolute',
          left: '0px'
        })}
        startDate={startDate}
        endDate={endDate}
        fromDateFormatter={getFormattedDate}
        toDateFormatter={getFormattedDate}
        stringToDate={convertStringToDate}
        open={boolean('open', false)}
      >
        {({ value, open, setOpen }: tDateRangeChildren) => (
          <div>
            <TextInputStyled onClick={() => setOpen(!open)}>
              <TextInput
                id='someId'
                name='someId'
                className='someClassname'
                label='Holidays'
                variant='basic'
                labelColor='text.inputLabel.default'
                placeholder='Please Click Here'
                fullWidth
                value={value?.toString()}
                onChange={action('On change clicked')}
              />
            </TextInputStyled>
          </div>
        )}
      </DateRangePicker>
    </ThemeWrapper>
  )
}
