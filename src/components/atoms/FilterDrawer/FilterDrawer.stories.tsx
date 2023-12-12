import React from 'react'
import FilterDrawer from '.'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

import ModalHeader from '../../molecules/ModalHeader'
import Box from '../Box'
import IconButton from '../IconButton'
import { IFilterMultiselectOption } from '../../molecules/FilterMultiselect/interfaces'
import FilterMultiselect from '../../molecules/FilterMultiselect'
import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import { DateRangePicker } from '../../molecules/DatePicker'
import { tDateRangeChildren } from '../../molecules/DatePicker/interfaces'
import TextInput from '../../molecules/TextInput'
import Position from '../../molecules/Position'

export default {
  title: `${path}/FilterDrawer`,
  component: FilterDrawer
}

const options: IFilterMultiselectOption[] = [
  { id: '1', label: 'Powai', value: 'powai' },
  { id: '2', label: 'Andheri', value: 'andheri' },
  { id: '3', label: 'Bhandup', value: 'bhandup' }
]

const getFormattedDate = (date: Date) => {
  const todayTime = date
  const month = todayTime.getMonth() + 1
  const day = todayTime.getDate()
  const year = todayTime.getFullYear()
  const hours = todayTime.getHours()
  const minutes = todayTime.getMinutes()
  return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes
}

export const withBasic = () => {
  const [isFilterOpen, setFilterOpen] = React.useState<boolean>(true)

  // state that manages DatePickers value

  return (
    <ThemeWrapper>
      <IconButton
        iconVariant='icomoon-funel'
        onClick={() => setFilterOpen((f) => !f)}
      >
        Filter
      </IconButton>

      <FilterDrawer isOpen={isFilterOpen}>
        <Box display='flex' flexDirection='column' fullWidth fullHeight>
          <ModalHeader
            headerTitle='Analytics Filter'
            handleClose={() => setFilterOpen(false)}
            width='100%'
          />

          {/* element that holds DateRangePickers value */}
          <Position type='relative'>
            <DateRangePicker
              onFromChange={action('From Clicked')}
              onToChange={action('To Clicked')}
              onApply={action('Apply Clicked')}
              onCancel={action('Cancel Clicked')}
              label={text('Label', 'Date Range')}
              variant='daterange'
              timeFormat={24}
              showTime={boolean('Show time', true)}
              startDate={new Date()}
              fromDateFormatter={getFormattedDate}
              toDateFormatter={getFormattedDate}
              style={{
                background: '#ccc',
                right: '0px',
                position: 'fixed'
              }}
            >
              {({ value, open, setOpen }: tDateRangeChildren) => (
                <Box fullWidth>
                  <TextInput
                    id='someId'
                    name={name}
                    className='someClassname'
                    label='Holidays'
                    variant='basic'
                    labelColor='text.inputLabel.default'
                    placeholder='Please Click Here'
                    fullWidth
                    value={value?.toString()}
                    onChange={action('On change clicked')}
                    onClick={() => setOpen(!open)}
                  />
                </Box>
              )}
            </DateRangePicker>
          </Position>

          <Box
            flexGrow={1}
            style={{ overflow: 'auto' }}
            p='15px'
            fullWidth
            mt='50px'
          >
            <FilterMultiselect
              id='branch'
              label='Hub'
              options={options}
              onSelectionChange={action('On Change')}
            />
          </Box>
          <Box
            display='flex'
            justifyContent='flex-end'
            p='15px'
            horizontalSpacing='10px'
            fullWidth
          >
            <IconButton iconVariant='icomoon-tick-circled' primary>
              Apply
            </IconButton>
            <IconButton iconVariant='icomoon-back'>Reset</IconButton>
          </Box>
        </Box>
      </FilterDrawer>
    </ThemeWrapper>
  )
}
