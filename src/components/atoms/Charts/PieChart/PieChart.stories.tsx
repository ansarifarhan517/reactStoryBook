import { number, object, withKnobs } from '@storybook/addon-knobs'
import React from 'react'
import PieChart from '.'
import { path } from '..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import {
  PieChartWrapper,
  SyledGrid
} from '../../../molecules/ChartCards/PieChartCard/StyledPieChartCard'
import CardComponent from '../../Card'

export default {
  title: `${path}/PieChart`,
  decorators: [withKnobs],
  component: PieChart
}

const data = [
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
export const PieChartWithLegend = () => (
  <ThemeWrapper>
    <SyledGrid item xs={12} sm={12} xl={4} md={2} lg={4}>
      <CardComponent>
        <PieChartWrapper>
          <PieChart
            details={object('details', data)}
            height={number('height', 150)}
          />
        </PieChartWrapper>
      </CardComponent>
    </SyledGrid>
  </ThemeWrapper>
)
