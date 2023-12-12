import { action } from '@storybook/addon-actions'
import {
  array,
  boolean,
  number,
  object,
  text,
  withKnobs
} from '@storybook/addon-knobs'
import React from 'react'
import BarChart from '.'
import { path } from '..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import Box from '../../Box'
import { tTooltipVariant } from '../interface'
import { StyledToolTip } from '../ToolTip/StyledToolTip'

export default {
  title: `${path}/BarChart`,
  decorators: [withKnobs],
  component: BarChart
}
const data = [
  {
    name: 'Rober Brown',
    'Total Complaince': 90,
    'Planned Route': 30,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Dany Wards',
    'Total Complaince': 80,
    'Planned Route': 40,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'John Brown',
    'Total Complaince': 85,
    'Planned Route': 60,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Samuel D',
    'Total Complaince': 60,
    'Planned Route': 40,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'James Turner',
    'Total Complaince': 40,
    'Planned Route': 30,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Diego Hendandes',
    'Total Complaince': 50,
    'Planned Route': 45,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Harrier Wax',
    'Total Complaince': 67,
    'Planned Route': 30,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Rober Brown1',
    'Total Complaince': 90,
    'Planned Route': 30,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Dany Wards1',
    'Total Complaince': 80,
    'Planned Route': 40,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'John Brown1',
    'Total Complaince': 85,
    'Planned Route': 60,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Samuel D1',
    'Total Complaince': 60,
    'Planned Route': 40,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'James Turner1',
    'Total Complaince': 40,
    'Planned Route': 30,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Diego Hendandes1',
    'Total Complaince': 50,
    'Planned Route': 45,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Harrier Wax1',
    'Total Complaince': 67,
    'Planned Route': 30,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Rober Brown2',
    'Total Complaince': 90,
    'Planned Route': 30,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Dany Wards2',
    'Total Complaince': 80,
    'Planned Route': 40,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'John Brown2',
    'Total Complaince': 85,
    'Planned Route': 60,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Samuel D2',
    'Total Complaince': 60,
    'Planned Route': 40,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'James Turner2',
    'Total Complaince': 40,
    'Planned Route': 30,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Diego Hendandes2',
    'Total Complaince': 50,
    'Planned Route': 45,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  },
  {
    name: 'Harrier Wax2',
    'Total Complaince': 67,
    'Planned Route': 30,
    'Avg Planned Route': 45,
    'Avg Total Complaince': 60
  }
]
const tinyChartData = [
  { name: 'Rober Brown', 'Total Complaince': 90 },
  { name: 'Dany Wards', 'Total Complaince': 80 },
  { name: 'John Brown', 'Total Complaince': 85 },
  { name: 'Samuel D', 'Total Complaince': 60 },
  { name: 'James Turner', 'Total Complaince': 40 },
  {
    name: 'Diego Hendandes',
    'Total Complaince': 50
  },
  { name: 'Harrier Wax', 'Total Complaince': 67 },
  { name: 'Rober Brown1', 'Total Complaince': 90, 'Planned Route': 30 },
  { name: 'Dany Wards1', 'Total Complaince': 80, 'Planned Route': 40 },
  { name: 'John Brown1', 'Total Complaince': 85, 'Planned Route': 60 },
  { name: 'Samuel D1', 'Total Complaince': 60, 'Planned Route': 40 },
  { name: 'James Turner1', 'Total Complaince': 40, 'Planned Route': 30 },
  {
    name: 'Diego Hendandes1',
    'Total Complaince': 50,
    'Planned Route': 45
  },
  { name: 'Harrier Wax1', 'Total Complaince': 67, 'Planned Route': 30 },
  { name: 'Rober Brown2', 'Total Complaince': 90, 'Planned Route': 30 },
  { name: 'Dany Wards2', 'Total Complaince': 80, 'Planned Route': 40 },
  { name: 'John Brown2', 'Total Complaince': 85, 'Planned Route': 60 },
  { name: 'Samuel D2', 'Total Complaince': 60, 'Planned Route': 40 },
  { name: 'James Turner2', 'Total Complaince': 40, 'Planned Route': 30 },
  {
    name: 'Diego Hendandes2',
    'Total Complaince': 50,
    'Planned Route': 45
  },
  { name: 'Harrier Wax2', 'Total Complaince': 67, 'Planned Route': 30 }
]

const tinyChartTitleList = ['Total Complaince', 'Planned Route']
const tinyChartTitleListOneBar = ['Total Complaince']
const legendData = [
  {
    name: 'Avg Planned Route',
    value: 45,
    color: '#006279',
    active: true
  },
  { name: 'Total Complaince', color: '#5698d3', active: true, value: 0 },
  {
    name: 'Avg Total Complaince',
    value: 25,
    color: '#f0ad48',
    active: true
  },
  {
    name: 'Planned Route',
    color: '#f05548',
    value: 0,
    active: true
  }
]
const lineData = [{ avgPlanned: 50 }, { planned: 24 }]
// format => const ticks = [0, 10, 20, 30, 40, 50, 60, 90, 100]

export const MultipleBar = () => (
  <ThemeWrapper>
    <Box p='6em' bgColor='white'>
      <BarChart
        details={object('details', data)}
        barGap={number('barGap', 0)}
        labelAngle={number('labelAngle', 330)}
        showXaxis={boolean('showXaxis', true)}
        xAxisLabel={text('xAxisLabel', 'Delivery Associates')}
        yAxisLabel={text('yAxisLabel', 'Achievement(%)')}
        legendData={object('legendData', legendData)}
        lineData={object('lineData', lineData)}
        showYaxis={boolean('showYaxis', true)}
        height={number('height', 800)}
        toolTipVariant={text('toolTipVariant', 'withKpi') as tTooltipVariant}
        tinyChartData={object('tinyChartData', data)}
        tinyChartTitleList={object('tinyChartTitleList', tinyChartTitleList)}
        onChange={action('Active legend Data changed')}
        tinyChartLabelAngle={number('tinyChartLabelAngle', 330)}
        showTinyChart={boolean('showTinyChart', true)}
        onClick={action('Bar Clicked')}
        onLineClick={action('Line Clicked')}
        tooltipTitleList={array('tooltipTitleList', [
          'KPI:',
          'Delivery Associate: ',
          'Achievement: '
        ])}
        magnifierEndIndex={4}
        barChartTooltip={({ value, name, color, legend }) => {
          return (
            <StyledToolTip style={{ padding: '8px 16px 3px 16px' }}>
              <div>value:{value}</div>
              <div>name:{name}</div>
              <div>color:{color}</div>
              <div>legend:{legend}</div>
            </StyledToolTip>
          )
        }}
        selectedBarIndex={number('selectedBarIndex', 2)}
        selectedBarName={text('selectedBarName', data?.[2].name)}
        legendFullwidth={boolean('legendFullwidth', true)}
      />
    </Box>
  </ThemeWrapper>
)

export const oneBar = () => (
  <ThemeWrapper>
    <Box p='6em' bgColor='white'>
      <BarChart
        disableClick={boolean('disableClick', false)}
        barGap={number('barGap', 0)}
        labelAngle={number('labelAngle', 330)}
        showXaxis={boolean('showXaxis', true)}
        xAxisLabel={text('xAxisLabel', 'Delivery Associates')}
        yAxisLabel={text('yAxisLabel', 'Achievement(%)')}
        height={number('height', 800)}
        toolTipVariant={text('toolTipVariant', 'withoutKpi') as tTooltipVariant}
        tooltipWidth={number('tooltipWidth', 211)}
        details={object('details', data)}
        legendData={object('legendData', legendData)}
        lineData={object('lineData', lineData)}
        tinyChartData={object('tinyChartData', tinyChartData)}
        tinyChartTitleList={object(
          'tinyChartTitleList',
          tinyChartTitleListOneBar
        )}
        onChange={action('Active legend Data changed')}
        tinyChartLabelAngle={number('tinyChartLabelAngle', 330)}
        onClick={action('Bar Clicked')}
        legendFullwidth={boolean('legendFullwidth', true)}
      />
    </Box>
  </ThemeWrapper>
)
