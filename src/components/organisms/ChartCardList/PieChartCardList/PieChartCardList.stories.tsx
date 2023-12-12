import React, { useState } from 'react'
import { path } from '..'

import { object, number, boolean } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import PieChartCardList from '.'
import orderDetails from './data'
import { action } from '@storybook/addon-actions'
import data1 from './data1'

export default {
  title: `${path}/PieChartCardList`,
  component: PieChartCardList
}
/* orderDetails format
const orderDetails = [
  {
    title: 'Total Orders',
    total: 1250,
    subTitle: 'No. of Delieveries',
    subTotal: 1200,
    selected: false,
    payload: [
      { name: 'Delivered', value: 5000, color: '#82b8e5', active: true },
      {
        name: 'Attempted PickedUp',
        value: 2710,
        color: '#f0ad48',
        active: true
      },
      {
        name: 'Attempted Delivered',
        value: 410,
        color: '#f05548',
        active: true
      },
      { name: 'Missed', value: 7, color: '#006279', active: true },
      { name: 'Cancelled', value: 3, color: '#9b4848', active: true }
    ]
  }
] */

export const PieChartCardListComponent = () => (
  <ThemeWrapper>
    <PieChartCardList
      orderDetails={object('orderDetails', orderDetails)}
      height={number('height', 150)}
      isClickable={boolean('isClickable', true)}
      onLegendClick={action('legend changed')}
      onClick={action('card selected')}
      onPieClick={action('pie clicked')}
    />
  </ThemeWrapper>
)

export const PieChartCardListComponent1 = () => (
  <ThemeWrapper>
    <PieChartCardList
      orderDetails={object('orderDetails', data1)}
      height={number('height', 150)}
      isClickable={boolean('isClickable', true)}
      onLegendClick={action('legend changed')}
      onClick={action('card selected')}
      onPieClick={action('pie clicked')}
    />
  </ThemeWrapper>
)

export const PieChartCardListButtonSwitch = () => {
  const [view, setView] = useState('a')
  const selectedView = () => {
    if (view === 'a') {
      return (
        <PieChartCardList
          orderDetails={orderDetails}
          height={150}
          isClickable
          onLegendClick={action('legend changed')}
          onClick={action('card selected')}
          onPieClick={action('pie clicked')}
        />
      )
    } else {
      return (
        <PieChartCardList
          orderDetails={data1}
          height={150}
          isClickable
          onLegendClick={action('legend changed')}
          onClick={action('card selected')}
          onPieClick={action('pie clicked')}
        />
      )
    }
  }

  return (
    <ThemeWrapper>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setView('a')}>Button1</button>
        <button onClick={() => setView('b')}>Button2</button>
      </div>
      {selectedView()}
    </ThemeWrapper>
  )
}
