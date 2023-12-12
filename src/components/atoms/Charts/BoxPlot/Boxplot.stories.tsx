import { action } from '@storybook/addon-actions'
import {
  array,
  number,
  object,
  text,
  withKnobs,
  boolean
} from '@storybook/addon-knobs'
import React from 'react'
import BoxPlot from '.'
import { path } from '..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import Box from '../../Box'
import { IScatterTooltip, IBoxPlotTooltip, IBoxPlotColor } from '../interface'

export default {
  title: `${path}/BoxPlot`,
  decorators: [withKnobs],
  component: BoxPlot
}

const xAxisTicks = [
  'Total Compliance',
  'Planned Route',
  'Check In',
  'Check Out',
  'E-POD Capture',
  'E-Sign Capture',
  'Customer Rating Capture',
  'Order marked delivered via Web vs Orders marked delivered via Mobile',
  'Service Time'
]
const boxPlotPartColor: IBoxPlotColor = {
  first: 'purple',
  q3: '#5698d3',
  q1: 'green',
  box: 'rgba(86, 152, 211,0.7)',
  highLight: 'rgba(86, 152, 211,1)',
  median: 'pink'
}
const tooltip = {
  'Total Compliance': {
    q1:
      'First Quartile is 40% i.e.  155 out of 170 Delivery Associates have achievement greater than 40% while 15 out of 170 Delivery Associates have achievement less than 40%.',
    q3:
      'Third Quartile is 74% i.e.  20 out of 170 Delivery Associates have achievement greater than 40% while 150 out of 170 Delivery Associates have achievement less than 40%.',
    median:
      'Median achievement is 60% i.e. 85 out of 170 Delivery Associates have achievement greater than 60% while 85 out of 170 Delivery Associates have achievement less than 60%.'
  },

  'Planned Route': {
    q1:
      'First Quartile is 40% i.e.  155 out of 170 Delivery Associates have achievement greater than 40% while 15 out of 170 Delivery Associates have achievement less than 40%.',
    q3:
      'Third Quartile is 74% i.e.  20 out of 170 Delivery Associates have achievement greater than 40% while 150 out of 170 Delivery Associates have achievement less than 40%.',
    median:
      'Median achievement is 60% i.e. 85 out of 170 Delivery Associates have achievement greater than 60% while 85 out of 170 Delivery Associates have achievement less than 60%.',
    first:
      'First count of Delivery Associates having achievement between 38% and 64% is 60.',
    last:
      'Last count of Delivery Associates having achievement between 38% and 64% is 60.'
  },
  'Check In': {
    q1:
      'First Quartile is 40% i.e.  155 out of 170 Delivery Associates have achievement greater than 40% while 15 out of 170 Delivery Associates have achievement less than 40%.',
    q3:
      'Third Quartile is 74% i.e.  20 out of 170 Delivery Associates have achievement greater than 40% while 150 out of 170 Delivery Associates have achievement less than 40%.',
    median:
      'Median achievement is 60% i.e. 85 out of 170 Delivery Associates have achievement greater than 60% while 85 out of 170 Delivery Associates have achievement less than 60%.',
    first:
      'First count of Delivery Associates having achievement between 38% and 64% is 60.',
    last:
      'Last count of Delivery Associates having achievement between 38% and 64% is 60.'
  },
  'Check Out': {
    q1:
      'First Quartile is 40% i.e.  155 out of 170 Delivery Associates have achievement greater than 40% while 15 out of 170 Delivery Associates have achievement less than 40%.',
    q3:
      'Third Quartile is 74% i.e.  20 out of 170 Delivery Associates have achievement greater than 40% while 150 out of 170 Delivery Associates have achievement less than 40%.',
    median:
      'Median achievement is 60% i.e. 85 out of 170 Delivery Associates have achievement greater than 60% while 85 out of 170 Delivery Associates have achievement less than 60%.',
    first:
      'First count of Delivery Associates having achievement between 38% and 64% is 60.',
    last:
      'Last count of Delivery Associates having achievement between 38% and 64% is 60.'
  },
  'E-POD Capture': {
    q1:
      'First Quartile is 40% i.e.  155 out of 170 Delivery Associates have achievement greater than 40% while 15 out of 170 Delivery Associates have achievement less than 40%.',
    q3:
      'Third Quartile is 74% i.e.  20 out of 170 Delivery Associates have achievement greater than 40% while 150 out of 170 Delivery Associates have achievement less than 40%.',
    median:
      'Median achievement is 60% i.e. 85 out of 170 Delivery Associates have achievement greater than 60% while 85 out of 170 Delivery Associates have achievement less than 60%.',
    first:
      'First count of Delivery Associates having achievement between 38% and 64% is 60.',
    last:
      'Last count of Delivery Associates having achievement between 38% and 64% is 60.'
  },
  'E-Sign Capture': {
    q1:
      'First Quartile is 40% i.e.  155 out of 170 Delivery Associates have achievement greater than 40% while 15 out of 170 Delivery Associates have achievement less than 40%.',
    q3:
      'Third Quartile is 74% i.e.  20 out of 170 Delivery Associates have achievement greater than 40% while 150 out of 170 Delivery Associates have achievement less than 40%.',
    median:
      'Median achievement is 60% i.e. 85 out of 170 Delivery Associates have achievement greater than 60% while 85 out of 170 Delivery Associates have achievement less than 60%.',
    first:
      'First count of Delivery Associates having achievement between 38% and 64% is 60.',
    last:
      'Last count of Delivery Associates having achievement between 38% and 64% is 60.'
  },
  'Customer Rating Capture': {
    q1:
      'First Quartile is 40% i.e.  155 out of 170 Delivery Associates have achievement greater than 40% while 15 out of 170 Delivery Associates have achievement less than 40%.',
    q3:
      'Third Quartile is 74% i.e.  20 out of 170 Delivery Associates have achievement greater than 40% while 150 out of 170 Delivery Associates have achievement less than 40%.',
    median:
      'Median achievement is 60% i.e. 85 out of 170 Delivery Associates have achievement greater than 60% while 85 out of 170 Delivery Associates have achievement less than 60%.',
    first:
      'First count of Delivery Associates having achievement between 38% and 64% is 60.',
    last:
      'Last count of Delivery Associates having achievement between 38% and 64% is 60.'
  },
  'Order marked delivered via Web vs Orders marked delivered via Mobile': {
    q1:
      'First Quartile is 40% i.e.  155 out of 170 Delivery Associates have achievement greater than 40% while 15 out of 170 Delivery Associates have achievement less than 40%.',
    q3:
      'Third Quartile is 74% i.e.  20 out of 170 Delivery Associates have achievement greater than 40% while 150 out of 170 Delivery Associates have achievement less than 40%.',
    median:
      'Median achievement is 60% i.e. 85 out of 170 Delivery Associates have achievement greater than 60% while 85 out of 170 Delivery Associates have achievement less than 60%.',
    first:
      'First count of Delivery Associates having achievement between 38% and 64% is 60.',
    last:
      'Last count of Delivery Associates having achievement between 38% and 64% is 60.'
  },
  'Service Time': {
    first:
      'First count of Delivery Associates having achievement between 38% and 64% is 60.',
    last:
      'Last count of Delivery Associates having achievement between 38% and 64% is 60.'
  }
}

const boxPlotData = [
  [2, 18, 38, 62, 84],
  [2, 18, 38, 62, 84],
  [2, 18, 38, 62, 84],
  [2, 18, 38, 62, 84],
  [2, 18, 38, 62, 84],
  [2, 18, 38, 62, 84],
  [2, 18, 38, 62, 84],
  [2, 18, 38, 62, 84],
  [2, 18, 38, 62, 84]
]
const scatterPlotData = [
  [0, 85],
  [0, 88],
  [4, 10],
  [4, 70],
  [5, 88]
]
const lineData = [42, 25, 55, 30, 60, 40, 20, 50, 40]
const yAxisTick = [0, 20, 40, 60, 80, 100, 150]

export const BoxPlotComponent = () => (
  <ThemeWrapper>
    <Box p='6em' bgColor='white'>
      <BoxPlot
        disableClick={boolean('disableClick', false)}
        xAxisLabel={text('xAxisLabel', 'Compliance KPI')}
        yAxisLabel={text('yAxisLabel', 'Achievement(%)')}
        height={number('height', 500)}
        xAxisTicks={array('xAxisTicks', xAxisTicks)}
        yAxisTickInterval={number('yAxisTickInterval', 20)}
        boxPlotData={object('boxPlotData', boxPlotData)}
        scatterPlotData={object('scatterPlotData', scatterPlotData)}
        lineData={object('lineData', lineData)}
        scatterPlotName={text('scatterPlotName', 'Scatter')}
        boxPlotName={text('boxPlotName', 'Compliance KPI')}
        lineName={text('lineName', 'Avg Total Complaince')}
        yAxisTick={object('yAxisTick', yAxisTick)}
        onClick={action('stick clicked')}
        tooltipData={object('tooltip', tooltip)}
        boxPlotPartColor={object('boxPlotPartColor', boxPlotPartColor)}
        scrattorTooltip={({ key, value }: IScatterTooltip) => {
          return `${key}: ${value}`
        }}
        boxPlotToolTip={({
          first,
          last,
          q1,
          q3,
          median,
          category
        }: IBoxPlotTooltip) => {
          console.log(category, 'category')
          const tooltipText = `<table style="border-collapse:separate;border-spacing: 0 1em;overflow-wrap: break-word;">
                ${
                  first
                    ? `<tr>
                      <td style="width:20px;height:15px;margin-right: 5px;">
                      <div class="color-box"  style="background-color: #5698d3;"></div>
                       
                      </td>
                      <td>
                        <div style="display:inline;">${first}</div>
                      </td>
                    </tr>`
                    : ''
                }
                   ${
                     q3
                       ? `<tr>
                       <td style="width:20px;height:15px;margin-right: 5px;">
                     <div class="color-box"  style="background-color:#5698d3;"></div>
                     </td>
                     <td>
                     <div class="text">${q3}</div>
                     </td>
                   </tr>`
                       : ''
                   }
   
                   ${
                     median
                       ? `<tr>
                       <td style="width:20px;height:15px;margin-right: 5px;">
                         <div class="color-box"  style="background-color:white;"></div>
                          
                         </td>
                         <td>
                           <div class="text">${median}</div>
                         </td>
                       </tr>`
                       : ''
                   }
   
                   ${
                     q1
                       ? `<tr>
                       <td style="width:20px;height:15px;margin-right: 5px;">
                     <div class="color-box"  style="background-color: #5698d3;"></div>
                     </td>
                     <td>
                     <div class="text">${q1}</div>
                     </td>
                   </tr>`
                       : ''
                   }
                ${
                  last
                    ? `<tr>
                    <td style="width:15px;height:15px;margin-right: 5px;">
                     <div class="color-box"  style="background-color: #5698d3"></div>
                     </td>
                     <td>
                     <div class="text">${last}</div>
                     </td>
                   </tr>`
                    : ''
                }
                   
                   </table>
                 
                   `
          return tooltipText
        }}
        selectedCategoryName={text('selectedCategoryName', 'Check In')}
      />
    </Box>
  </ThemeWrapper>
)
