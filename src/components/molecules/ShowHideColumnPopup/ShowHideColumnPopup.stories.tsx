import React from 'react'
import { path } from '..'
import ShowHideColumnPopup from '.'
import { withKnobs, object } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import styled from 'styled-components'
export default {
  title: `${path}/ShowHideColumnPopup`,
  decorators: [withKnobs],
  component: ShowHideColumnPopup
}
const CheckBoxGroupArray = [
  {
    id: '01',
    value: 'Alert',
    checked: true
  },
  {
    id: '02',
    value: 'Name',
    checked: true
  },
  {
    id: '3',
    value: 'Transaction',
    checked: true
  },
  {
    id: '4',
    value: 'Creation',
    checked: true
  },
  {
    id: '5',
    value: 'Date',
    checked: true
  },
  {
    id: '6',
    value: 'Notes',
    checked: true
  },
  {
    id: '7',
    value: 'Alert',
    checked: false
  },
  {
    id: '8',
    value: 'Status',
    checked: false
  },
  {
    id: '9',
    value: 'Order',
    checked: false
  },
  {
    id: '10',
    value: 'Origin',
    checked: false
  },
  {
    id: '11',
    value: 'Location',
    checked: false
  },
  {
    id: '12',
    value: 'Destination Location',
    checked: false
  },
  {
    id: '13',
    value: 'Vehicle No',
    checked: false
  },
  {
    id: '14',
    value: 'Type',
    checked: false
  },
  {
    id: '15',
    value: 'Alert',
    checked: false
  },
  {
    id: '16',
    value: 'Active Drivers',
    checked: false
  },
  {
    id: '17',
    value: 'Order Status',
    checked: false
  },
  {
    id: '18',
    value: 'Delivery Estimate',
    checked: false
  },
  {
    id: '19',
    value: 'Order no',
    checked: false
  },
  {
    id: '20',
    value: 'Order Id',
    checked: false
  },
  {
    id: '21',
    value: 'Shipping cost',
    checked: false
  },
  {
    id: '22',
    value: 'Shipping time',
    checked: false
  },
  {
    id: '23',
    value: 'Start time estimate',
    checked: false
  },
  {
    id: '24',
    value: 'End time estimate',
    checked: false
  },
  {
    id: '25',
    value: 'Drivers Estimate',
    checked: false
  },
  {
    id: '26',
    value: 'CUrrent status',
    checked: false
  },
  {
    id: '27',
    value: 'Service type',
    checked: false
  },
  {
    id: '28',
    value: 'Active Drivers',
    checked: false
  },
  {
    id: '29',
    value: 'Cancelled Order',
    checked: false
  },
  {
    id: '30',
    value: 'Order completed',
    checked: false
  }
]

const CustomStylingTrigger = styled.div`
  display: inline-block;
  float: right;
`

export const withBasic = () => (
  <ThemeWrapper>
    <CustomStylingTrigger>
      <ShowHideColumnPopup
        checkBoxGroupArray={object('CheckboxArray', CheckBoxGroupArray)}
        onCheckBoxChange={action('Checkbox Changed')}
        onApply={action('Save Clicked Changed')}
        onClickCancel={action('Close Click')}
      />
    </CustomStylingTrigger>
  </ThemeWrapper>
)
