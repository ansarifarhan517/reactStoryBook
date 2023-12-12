import React, { Fragment, useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  // Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine
} from 'recharts'
import CustomLegend from '../CustomLegend'
import { IBarChart, IDetails, IReferenceLine } from '../interface'
import TooltipCompoent from '../ToolTip'
import { StyledBarChart } from './StyledBarChart'

// for y axis tick values provided we be in below format
const convertDecimalToPercent = (decimal: number, fixed = 0) => {
  return `${decimal.toFixed(fixed)}%`
}
const setToFixed = (decimal: number) => {
  if(Number.isInteger(decimal)) {
    return `${decimal.toFixed(0)}`
  }else {
    return `${decimal.toFixed(1)}`
  }
}

/* here we are creating a map from legendData where value is 0,i.e. bar chart and as
 typescript doesnt allow to add conditional data in map
 we have to return null and as we dont want null we later filter it out */
const getActiveBarData = (legendData: Array<IDetails>) => {
  return legendData
    .map((option: IDetails) => (option.value === 0 ? option : null))
    .filter((option: any) => option !== null)
}

const BarChartComponent = ({
  details,
  barGap = 0,
  xAxisLabel,
  yAxisLabel,
  legendData,
  showYaxis = true,
  height = 500,
  _ticks,
  toolTipVariant = 'default',
  // tooltipWidth = 231,
  tinyChartData,
  tinyChartTitleList,
  labelAngle = 180,
  onChange,
  onClick,
  disableClick,
  // onLineClick,
  showTinyChart = false,
  tooltipTitleList,
  inactiveBarOpacity = 0.7,
  magnifierEndIndex = 30,
  xAxisTickCharLimit = 15,
  barChartTooltip,
  selectedBarIndex,
  selectedBarName,
  legendFullwidth = false,
  convertoPercent = true,
  domain,
  yAxisLabelData = {}
}: IBarChart) => {
  const ticks = [0, 20, 40, 60, 80, 100]
  const [activeBarData, setActiveBarData] = useState(
    getActiveBarData(legendData)
  )
  const [activeData, setActiveData] = useState<any>(undefined)
  const [activeLegend, setActiveLegend] = useState(legendData)
  const [activeIndex, setActiveIndex] = useState<number | undefined>(
    selectedBarIndex
  )
  const [activeBarName, setActiveBarName] = useState<string | undefined>(
    selectedBarName
  )
  const [_magnifierEndIndex, setMagnifierEndIndex] = useState<number>(
    magnifierEndIndex
  )
  useEffect(() => {
    setActiveIndex(selectedBarIndex)
  }, [selectedBarIndex])

  useEffect(() => {
    setActiveIndex(undefined)
    setActiveBarName(selectedBarName)
  }, [selectedBarName])

  // in case legend data changes, change bar chart accordingly
  useEffect(() => {
    setActiveLegend(legendData)
    setActiveBarData(getActiveBarData(legendData))
    setMagnifierEndIndex(magnifierEndIndex)
  }, [legendData, details, magnifierEndIndex])

  const tinyChartLegendData = legendData
    .map((option: IDetails) =>
      tinyChartTitleList.includes(option.name) ? option : null
    )
    .filter((option: any) => option !== null)

  const onMouseEnter = (_data: any, _index: number) => {
    // for line object is not exensible and for bar it is, to handle both condition below code is written
    let data = Object.assign(_data, {})
    if (_data.type === 'linear') {
      data = Object.create(_data)
    }

    data.toolTipVariant = toolTipVariant // selected bar needs which type of tooltip
    if (toolTipVariant !== 'withoutKpi') {
      // below data we are capturing to show on tooltip
      if (data.type === 'linear') {
        data.toolTipVariant = 'default'
        data.color = data.stroke
        const hoveredLine = legendData.find(
          (option: IDetails) => option.color === data.stroke
        )
        data.value = hoveredLine?.value
        data.name = hoveredLine?.name
      } else {
        const key = Object.keys(data).find((key) => data[key] === data.value)
        data.legend = key // selected bar of which legend(name)
        legendData.forEach((legend: any) => {
          if (legend.name === key) {
            data.color = legend.color // selected bar of which color
          }
        })
      }
    }

    setActiveData(data)
  }

  const handleClick = (option: IDetails) => {
    const newDetails: any = Array.from(Object.create(legendData))
    // list of active legend
    const filteredData = newDetails.filter((option: any) => option.active)
    // here we are changing active to false for unticked legends
    newDetails.forEach((dataItem: IDetails) => {
      if (dataItem.name === option.name) {
        // if only one legend active,dont let it untick
        if (filteredData.length > 1) {
          dataItem.active = !option.active
        } else {
          dataItem.active = true
        }
      }
    })
    setActiveLegend(newDetails)
    // to show active bars
    setActiveBarData(getActiveBarData(newDetails))
    // send active legend data , outside to handle other activity
    onChange(newDetails)
  }
  const customizedAxisTick = (value: any) => {
    // if the name is greater than limit provided then append ... and trim or else show actual value
    const trimmedValue =
      labelAngle !== 0 && value?.length > xAxisTickCharLimit
        ? `${value?.substring(0, xAxisTickCharLimit)}...`
        : value
    return trimmedValue
  }

  const referenceLines: IReferenceLine[] = React.useMemo(() => {
    return activeLegend
      .filter((option) => option.value !== 0 && option.active)
      .map((option) => {
        return {
          value: option.value || 0,
          color: option.color
        }
      })
  }, [activeLegend])

  return (
    <StyledBarChart>
      <ResponsiveContainer width='100%' height={height}>
        <ComposedChart
          data={details}
          barGap={barGap}
          stackOffset='expand'
          // style={{ cursor: 'pointer' }}      //Fix Redmine-55059
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='name'
            padding={{ left: 30, right: 50 }}
            interval={0}
            width={50}
            height={labelAngle < 180 ? 100 : 170}
            angle={labelAngle}
            textAnchor={labelAngle === 0 ? 'middle' : 'end'}
            tickFormatter={customizedAxisTick}
            label={{
              value: xAxisLabel,
              angle: 0,
              className: 'axis-title',
              position: 'insideBottom', 
              offset: 50
            }}
          />
          <YAxis
            hide={!showYaxis}
            tickFormatter={
              convertoPercent ? convertDecimalToPercent : setToFixed
            }
            domain={domain}
            ticks={convertoPercent ? _ticks || ticks : _ticks || []}
            label={{
              value: yAxisLabel,
              angle: 270,
              className: 'axis-title',
              position: 'outside',
              ...yAxisLabelData
            }}
            width={100}
          />
          {activeBarData.length > 1 ? (
            activeBarData.map((option: any) => {
              return (
                <Bar
                  dataKey={option.name || ''}
                  fill={option.color}
                  key={option.name}
                  onMouseEnter={onMouseEnter}
                  onMouseOut={() => setActiveData(undefined)}
                  hide={!option.active}
                  onClick={(data) => {
                    onClick && !disableClick && onClick(data)
                  }}
                  isAnimationActive
                  // isUpdateAnimationActive
                  // animationBegin={3}
                  // animationDuration={3}
                  // animationEasing='linear'
                  cursor='default'
                >
                  {details.map((_value, index) => {
                    return (
                      <Cell
                        cursor={disableClick ? 'default' : 'pointer'}
                        // fillOpacity={
                        //   index === activeIndex ? 1 : inactiveBarOpacity
                        // }
                        fillOpacity={
                          _value.name === activeBarName || index === activeIndex
                            ? 1
                            : inactiveBarOpacity
                        }
                        key={index}
                        onClick={() =>
                          !disableClick && setActiveBarName(_value.name)
                        }
                      />
                    )
                  })}
                </Bar>
              )
            })
          ) : (
            <Bar
              dataKey={activeBarData[0]?.name || ''}
              fill={activeBarData[0]?.color}
              onMouseEnter={onMouseEnter}
              onMouseOut={() => setActiveData(undefined)}
              hide={!activeBarData[0]?.active}
              onClick={(data) => {
                onClick && onClick(data)
              }}
              isAnimationActive
              // isUpdateAnimationActive
              // animationBegin={3}
              // animationDuration={3}
              // animationEasing='linear'
              cursor={disableClick ? 'default' : 'pointer'}
            >
              {details.map((_value, index) => {
                return (
                  <Cell
                    // fillOpacity={index === activeIndex ? 1 : inactiveBarOpacity}
                    fillOpacity={
                      _value.name === activeBarName || index === activeIndex
                        ? 1
                        : inactiveBarOpacity
                    }
                    key={index}
                    onClick={() =>
                      !disableClick && setActiveBarName(_value.name)
                    }
                    cursor={disableClick ? 'default' : 'pointer'}
                  />
                )
              })}
            </Bar>
          )}

          {referenceLines.map((line) => (
            <ReferenceLine
              key={line.value}
              y={line.value}
              stroke={line.color}
              isFront
            />
          ))}

          {/* {activeLegend
            .map((option: IDetails) => {
              if (option.value !== 0) {
                return (
                  <Line
                    strokeWidth={2}
                    dataKey={option.name || ''}
                    fill={option.color}
                    key={option.name}
                    stroke={option.color}
                    dot={false}
                    activeDot={false}
                    onMouseEnter={onMouseEnter}
                    onMouseOut={() => setActiveData(undefined)}
                    hide={!option.active}
                    onClick={(data) => onLineClick && onLineClick(data)}
                    cursor='pointer'
                  />
                )
              }
              return null
            })
            .filter((option) => option !== null)} */}

          <Legend
            content={
              <CustomLegend
                details={legendData}
                isRow
                onChange={(option: IDetails) => handleClick(option)}
                isFullWidth={legendFullwidth}
                size={legendFullwidth ? '8px' : '11px'}
              />
            }
            verticalAlign='top'
            wrapperStyle={{ position: 'unset', top: '9px' }}
          />

          <Tooltip
            active
            cursor={{ fill: '#f00' }}
            content={() => {
              return activeData ? (
                <TooltipCompoent
                  value={activeData?.value}
                  name={activeData?.name}
                  color={activeData?.color}
                  legend={activeData?.legend}
                  toolTipVariant={activeData?.toolTipVariant}
                  tooltipTitleList={tooltipTitleList}
                  barChartTooltip={barChartTooltip}
                />
              ) : (
                <Fragment />
              )
            }}
            wrapperStyle={{
              height: 'auto',
              // width: tooltipWidth,
              visibility: 'visible'
            }}
          />

          {/* tiny chart start from here with zooming brush */}
          {showTinyChart ? (
            <Brush
              height={70}
              fill='rgba(0, 0, 0, 0)'
              stroke='rgba(0, 0, 0, 0.24)'
              dataKey='name'
              data={tinyChartData}
              endIndex={
                details.length > _magnifierEndIndex
                  ? _magnifierEndIndex
                  : details.length - 1
              }
            >
              <BarChart data={details} barGap={0} stackOffset='expand'>
                <XAxis
                  dataKey='name'
                  padding={{ left: 0, right: 0 }}
                  interval={0}
                  width={50}
                  height={10}
                  tick={false}
                  dx={0}
                />
                {tinyChartLegendData.length > 1 ? (
                  tinyChartLegendData.map((option: any) => {
                    return (
                      <Bar
                        dataKey={option.name || ''}
                        fill={option.color}
                        key={option.name}
                        fillOpacity={inactiveBarOpacity}
                      />
                    )
                  })
                ) : (
                  <Bar
                    dataKey={tinyChartLegendData[0]?.name || ''}
                    fill={tinyChartLegendData[0]?.color}
                    fillOpacity={inactiveBarOpacity}
                  />
                )}
              </BarChart>
            </Brush>
          ) : (
            <Fragment />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </StyledBarChart>
  )
}

export default BarChartComponent
