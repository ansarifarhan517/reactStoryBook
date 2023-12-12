import HighchartMore from 'highcharts/highcharts-more'
import React, { useEffect } from 'react'
import ReactHighchart from 'react-highcharts'
import { IBoxPlot } from '../interface'
import { StyledBoxPlot } from './StyledBoxPlot'

// import Highcharts from 'highcharts'
HighchartMore(ReactHighchart.Highcharts)

// keeping below code in case need to make change in tooltip, below line will not let tooltip disappear while inspect
// Highcharts.wrap(Highcharts.Tooltip.prototype, 'hide', function () {
//   console.log('****')
// })

const defaultCallback = () => {}

const BoxPlot = ({
  xAxisTicks,
  xAxisLabel,
  yAxisLabel,
  onClick = defaultCallback,
  disableClick = false,
  yAxisTickInterval = 20,
  boxPlotData,
  scatterPlotData,
  lineData,
  scatterPlotName,
  lineName,
  boxPlotName,
  yAxisTick,
  tooltipData,
  boxPlotPartColor,
  boxPlotToolTip,
  scrattorTooltip,
  selectedCategoryName = ''
}: IBoxPlot) => {
  const [selectedCategory, setSelectedCategory] = React.useState(
    selectedCategoryName
  )
  useEffect(() => {
    setSelectedCategory(selectedCategoryName)
  }, [selectedCategoryName])

  const handleClick = (event: any) => {
    if (disableClick) {
      return
    }

    const point = event.point
    setSelectedCategory(point.category)
    const category = point.category
    const q1 = point.q1 // start of box
    const q3 = point.q3 // end of box
    const whiskerLow = point.low // starting horizontal line(whisker start)
    const median = point.median
    const whiskerHigh = point.high // end horizontal line(whisker end)
    onClick({
      category,
      whiskerLow,
      q1,
      median,
      q3,
      whiskerHigh,
      event
    })
    return true
  }

  return (
    <StyledBoxPlot>
      <ReactHighchart
        config={{
          xAxis: {
            categories: xAxisTicks,
            title: {
              text: xAxisLabel,
              style: {
                color: '#485465',
                fontSize: '15px !important'
              },
              y: 15
            },
            labels: {
              style: {
                color: '#485465',
                fontSize: '10px'
              },
              y: 20
            },
            className: 'axis-title',
            endOnTick: false,
            lineWidth: 0.6,
            lineColor: '#070707'
          },

          credits: {
            enabled: false
          },

          yAxis: {
            title: {
              text: yAxisLabel,
              style: {
                color: '#485465',
                fontSize: '15px !important'
              }
            },
            categories: yAxisTick || [0, 20, 40, 60, 80, 100, 150],
            className: 'axis-title',
            tickInterval: yAxisTickInterval,
            labels: {
              format: '{value} %',
              style: {
                fontSize: '11px',
                color: '#485465'
              },
              x: -10
            },
            lineWidth: 0.6,
            lineColor: '#070707'
          },
          chart: {
            type: 'boxplot',
            events: {
              load: function () {
                var chart = this as any
                // if (xAxisTicks.includes(selectedCategory)) {
                const indexOFSelectedCategory = selectedCategory
                  ? xAxisTicks.indexOf(selectedCategory)
                  : -1

                chart?.series[0].points?.forEach(
                  (_point: any, index: number) => {
                    if (indexOFSelectedCategory === index) {
                      chart?.series[0]?.points[indexOFSelectedCategory].update({
                        fillColor:
                          boxPlotPartColor.highLight || 'rgba(86, 152, 211,1)'
                      })
                    } else {
                      chart?.series[0]?.points[index].update({
                        fillColor:
                          boxPlotPartColor.box || 'rgba(86, 152, 211,0.7)'
                      })
                    }
                  }
                )
                // }
              }
            }
          },
          title: {
            text: ''
          },
          tooltip: {
            style: {
              padding: '9px',
              color: 'white',
              margin: '10px',
              opacity: 0.74,
              height: 'auto',
              cursor: 'pointer',
              whiteSpace: 'normal'
            },
            backgroundColor: 'black',
            shadow: true,
            useHTML: true,
            borderColor: 'transparent',
            borderRadius: 0,
            followPointer: true,

            formatter: function (this: any) {
              const tool = tooltipData[this.key] // x axis name will be key

              if (this?.series?.userOptions?.type === 'scatter') {
                // scatter tooltip dynamic
                const scatterTip =
                  scrattorTooltip &&
                  scrattorTooltip({ key: this.key, value: this.y })

                return scatterTip || `${this.key}: ${this.y}`
              } else {
                const first = tool.first || ''
                const last = tool.last || ''
                const median = tool.median || ''
                const q3 = tool.q3 || ''
                const q1 = tool.q1 || ''
                const tooltip =
                  (boxPlotToolTip &&
                    boxPlotToolTip({
                      first,
                      last,
                      q1,
                      q3,
                      median,
                      category: this.key
                    })) ||
                  ''

                var defaulTooltip = `<table style="border-collapse:separate;border-spacing: 0 1em;overflow-wrap: break-word;">
                ${
                  first
                    ? `<tr>
                      <td style="width:20px;height:15px;margin-right: 5px;">
                      <div class="color-box"  style="background-color:${
                        boxPlotPartColor.first || '#5698d3'
                      };"></div>

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
                     <div class="color-box"  style="background-color:${
                       boxPlotPartColor.first || '#5698d3'
                     }"></div>
                     </td>
                     <td>
                     <div class="text">${last}</div>
                     </td>
                   </tr>`
                    : ''
                }
                   </table>
                   `
                return tooltip || defaulTooltip
              }
            }
          },

          legend: {
            layout: 'horizontal',
            align: 'right',
            verticalAlign: 'top',
            y: -20,
            navigation: {
              animation: true,
              arrowSize: 12,
              style: {
                fontWeight: 'bold',
                fontSize: '12px'
              }
            },
            margin: 30
          },

          plotOptions: {
            boxplot: {
              fillColor: boxPlotPartColor.box || 'rgba(86, 152, 211,0.7)',
              lineWidth: 2,
              medianColor: boxPlotPartColor.median || 'white',
              medianWidth: 3,
              stemColor: boxPlotPartColor.q1 || '#5698d3',
              stemWidth: 3,
              whiskerColor: boxPlotPartColor.first || '#5698d3',
              whiskerLength: '70%',
              whiskerWidth: 3,
              showInLegend: false
            },
            series: {
              events: {
                click: (e: any) => {
                  if (e.point.category) {
                    handleClick({ ...e, point: { ...e.point } })
                  }
                }
              },
              stickyTracking: false
            },
            scatter: {
              marker: {
                symbol: 'circle'
              },
              showInLegend: false
            },
            line: {
              animation: false,
              states: {
                hover: {
                  enabled: false
                }
              },
              enableMouseTracking: false,
              showInLegend: true
            }
          },

          series: [
            {
              name: boxPlotName,
              data: boxPlotData as Array<any>,
              cursor: disableClick ? 'default' : 'pointer'
            },
            {
              name: lineName,
              type: 'line',
              data: lineData,
              color: 'red'
            },
            {
              name: scatterPlotName,
              color: '#5698d3',
              type: 'scatter',
              data: scatterPlotData
            }
          ]
        }}
      />
    </StyledBoxPlot>
  )
}

export default BoxPlot
