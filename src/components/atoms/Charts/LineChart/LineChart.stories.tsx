import React from 'react'
import { path } from '..'
import LineChart from '.'

import {
  withKnobs,
  object,
  number,
  boolean,
  text
} from '@storybook/addon-knobs'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import { Box } from '../../../..'
import { action } from '@storybook/addon-actions'
import LineChartTooltip from './LineChartTooltip'

export default {
  title: `${path}/LineChart`,
  decorators: [withKnobs],
  component: LineChart
}
const legendData = [
  {
    name: 'Diego Henandes',

    color: '#5698d3',
    active: true
  },
  {
    name: 'Kazem Almosawi',
    color: '#006279',
    active: true
  },
  {
    name: 'Fister Khalifa',

    color: '#9b4848',
    active: true
  },
  { name: 'Paul Kennedy', color: '#f05548', active: true },
  { name: 'John Brown', color: '#f0ad48', active: true }
]

const data = [
  {
    name: 'Week 21 (19-05-2019)',
    'Diego Henandes': 90,
    'Kazem Almosawi': 30,
    'Fister Khalifa': 90,
    'Paul Kennedy': 30,
    'John Brown': 65
  },
  {
    name: 'Week 22 (26-05-2019)',
    'Diego Henandes': 80,
    'Kazem Almosawi': 40,
    'Fister Khalifa': 90,
    'Paul Kennedy': 30,
    'John Brown': 65
  },
  {
    name: 'Week 23 (02-06-2019)',
    'Diego Henandes': 85,
    'Kazem Almosawi': 60,
    'Fister Khalifa': 90,
    'Paul Kennedy': 30,
    'John Brown': 65
  },
  {
    name: 'Week 24 (09-06-2019)',
    'Diego Henandes': 60,
    'Kazem Almosawi': 40,
    'Fister Khalifa': 90,
    'Paul Kennedy': 30,
    'John Brown': 65
  },
  {
    name: 'Week 25 (16-06-2019)',
    'Diego Henandes': 40,
    'Kazem Almosawi': 30,
    'Fister Khalifa': 90,
    'Paul Kennedy': 30,
    'John Brown': 65
  },
  {
    name: 'Week 26 (19-07-2019)',
    'Diego Henandes': 90,
    'Kazem Almosawi': 30,
    'Fister Khalifa': 90,
    'Paul Kennedy': 30,
    'John Brown': 65
  },
  {
    name: 'Week 28 (26-08-2019)',
    'Diego Henandes': 80,
    'Kazem Almosawi': 40,
    'Fister Khalifa': 90,
    'Paul Kennedy': 30,
    'John Brown': 65
  },
  {
    name: 'Week 29 (02-09-2019)',
    'Diego Henandes': 85,
    'Kazem Almosawi': 60,
    'Fister Khalifa': 90,
    'Paul Kennedy': 30,
    'John Brown': 65
  },
  {
    name: 'Week 30 (09-10-2019)',
    'Diego Henandes': 60,
    'Kazem Almosawi': 40,
    'Fister Khalifa': 90,
    'Paul Kennedy': 30,
    'John Brown': 65
  },
  {
    name: 'Week 31 (16-11-2019)',
    'Diego Henandes': 40,
    'Kazem Almosawi': 30,
    'Fister Khalifa': 90,
    'Paul Kennedy': 30,
    'John Brown': 65
  }
]
const ticks = [0, 25, 50, 75, 100]
export const LineChartComponent = () => (
  <ThemeWrapper>
    <Box p='8em' bgColor='white'>
      <LineChart
        details={object('details', data)}
        labelAngle={number('labelAngle', -30)}
        showXaxis={boolean('showXaxis', true)}
        xAxisLabel={text('xAxisLabel', 'Date')}
        yAxisLabel={text('yAxisLabel', 'Achievement(%)')}
        legendData={object('legendData', legendData)}
        showYaxis={boolean('showYaxis', true)}
        height={number('height', 1000)}
        _ticks={object('_ticks', ticks)}
        onChange={action('Legend data changed')}
        showTinyChart={boolean('showTinyChart', true)}
        startWithXaxis={boolean('startWithXaxis', true)}
        onClick={action('Line Clicked')}
        tickInPercentage={boolean('tickInPercentage', false)}
        lineChartTooltip={({ label, selectedColor, legendData, details }) => {
          return (
            <LineChartTooltip
              label={label || ''}
              legendData={legendData || []}
              selectedColor={selectedColor || 'blue'}
              details={details || []}
            />
          )
        }}
        magnifierStartIndex={5}
      />
    </Box>
  </ThemeWrapper>
)
