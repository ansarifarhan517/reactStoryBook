import React from 'react'
import { path } from '..'
import DateTimeSlotPicker from '.'
import { object, withKnobs, boolean } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Data from './Data'
import TextInput from '../TextInput'
import { IDateTimeSlotPickerChildren } from './interfaces'
import { action } from '@storybook/addon-actions'

export default {
  title: `${path}/DateTimeSlotPicker`,
  decorators: [withKnobs],
  component: DateTimeSlotPicker
}

const DropdownOption = [
  {
    id: 'units',
    label: 'Units',
    value: 'unit',
    availableSlotObjectKey: 'availableNumberOfItems',
    totalSlotObjectKey: 'totalNumberOfItems'
  },
  {
    id: 'weight',
    label: 'Weight',
    value: 'weight',
    availableSlotObjectKey: 'availableWeight',
    totalSlotObjectKey: 'totalWeight'
  },
  {
    id: 'volume',
    label: 'Volume',
    value: 'volume',
    availableSlotObjectKey: 'availableVolume',
    totalSlotObjectKey: 'totalVolume'
  },
  {
    id: 'stops',
    label: 'Stops',
    value: 'stop',
    availableSlotObjectKey: 'availableStops',
    totalSlotObjectKey: 'totalStops'
  }
]

const status = {
  available: {
    id: 'available',
    value: 'AVAILABLE',
    label: 'Suggested'
  },
  notAvailable: {
    id: 'notAvailable',
    value: 'FULL',
    label: 'Not Suggested'
  }
}

export const SlotPicker = () => {
  const todaysDate = new Date()
  return (
    <ThemeWrapper>
      <DateTimeSlotPicker
        title='Available Time Windows:'
        preferenceDropdownLabel='Prefrence By '
        isOpen={boolean('isOpen', false)}
        date={todaysDate}
        timeWindowPrefrenceDropdown={object(
          'timeWindowPrefrenceDropdown',
          DropdownOption
        )}
        status={object('status', status)}
        DateTimeSlots={object('DateTimeSlots', Data)}
        style={{
          position: 'absolute',
          top: 'auto',
          left: '0px'
        }}
        onChange={action('On Change')}
      >
        {({ value, open, setOpen }: IDateTimeSlotPickerChildren) => (
          <div
            onClick={() => {
              console.log(open)
              setOpen(!open)
            }}
          >
            <TextInput
              id='someId'
              name='someName'
              className='someClassname'
              placeholder='Please Click Here'
              variant='withIcon'
              iconVariant='calendar'
              iconSize='md'
              value={`${value ? value?.startTimeWindow : ''} - ${
                value ? value?.endTimeWindow : ''
              }`}
              readOnly
              iconStyle={{ padding: '9px 9px 9px 9px' }}
            />
          </div>
        )}
      </DateTimeSlotPicker>
    </ThemeWrapper>
  )
}
