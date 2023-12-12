import { action } from '@storybook/addon-actions'
import { number, object } from '@storybook/addon-knobs'
import React from 'react'
import PieChartCard from '.'
import { path } from '..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/PieChartCard`,
  component: PieChartCard
}

const orderDetails = {
  title: 'Total Orders',
  total: 1250,
  fulfilment: '+13',
  subTitle: 'No. of deliveries',
  subTotal: 1200,
  payload: [
    { name: 'Delivered', value: 5000, color: '#82b8e5', active: true },
    {
      name: 'Attempted PickedUp',
      value: 2710,
      color: '#f0ad48',
      active: true
    },
    {
      name: 'Pickup Orders Service Time Non Compliant',
      value: 410,
      color: '#f05548',
      active: true
    },
    { name: 'Missed', value: 7, color: '#006279', active: true },
    { name: 'Cancelled', value: 3, color: '#9b4848', active: true }
  ]
}

export const PieChartCardComponent = () => (
  <ThemeWrapper>
    <PieChartCard
      orderDetails={object('orderDetails', orderDetails)}
      height={number('height', 150)}
      onClick={action('Value changed')}
    />
  </ThemeWrapper>
)
