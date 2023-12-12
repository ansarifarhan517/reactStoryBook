import React, { Fragment, useEffect, useState } from 'react'
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import CustomLegend from '../CustomLegend'
import { IDetails, ILineChart } from '../interface'
import LineChartTooltip from './LineChartTooltip'
import { StyledLineChart } from './StyledLineChart'

const LineChartComponent = ({
  details,
  labelAngle = 90,
  xAxisLabel,
  yAxisLabel,
  legendData,
  showYaxis,
  height = 500,
  _ticks,
  onChange,
  onClick,
  tooltipWidth = 231,
  showTinyChart = true,
  startWithXaxis = false,
  tickInPercentage = true,
  lineChartTooltip,
  xAxisTickCharLimit = 15,
  legendFullwidth = false,
  magnifierStartIndex = 15,
  convertoPercent = true,
  domain,
  yAxisLabelData = {}
}: ILineChart) => {
  const ticks = [0, 20, 40, 60, 80, 100]
  const [_details, setDetails] = useState(details)
  const [activeData, setActiveData] = useState<any>(undefined)
  const [legend, setLegend] = useState(legendData)
  const [_magnifierStartIndex, setMagnifierStartIndex] = useState<number>(
    magnifierStartIndex
  )

  // if legends changes,reload
  useEffect(() => {
    setLegend(legendData)
    setDetails(details)
    setMagnifierStartIndex(magnifierStartIndex)
  }, [legendData, details, magnifierStartIndex])

  const onMouseEnter = (_data: any, _index: number) => {
    setActiveData(_data)
  }
  // for y axis tick values provided we be in below format
  const convertDecimalToPercent = (decimal: number, fixed = 0) => {
    if (tickInPercentage) {
      return `${decimal.toFixed(fixed)}%`
    }
    return `${decimal}`
  }

  const setToFixed = (decimal: number) => {
    if(Number.isInteger(decimal)) {
      return `${decimal.toFixed(0)}`
    }else {
      return `${decimal.toFixed(1)}`
    }
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
    setLegend(newDetails)
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

  return (
    <StyledLineChart>
      <ResponsiveContainer width='100%' height={height}>
        <LineChart
          data={_details}
          stackOffset='expand'
          style={{ cursor: 'pointer' }}
        >
          <CartesianGrid strokeDasharray='2 2' />

          <XAxis
            dataKey='name'
            padding={{ left: startWithXaxis ? 0 : 120, right: 15 }}
            angle={labelAngle}
            interval={0}
            width={30}
            textAnchor={labelAngle === 0 ? 'middle' : 'end'}
            height={labelAngle < 180 ? 100 : 190}
            tickFormatter={customizedAxisTick}
            dx={10}
            label={{
              value: xAxisLabel,
              angle: 0,
              className: 'axis-title',
              position: 'inside'
            }}
          />
          <YAxis
            hide={!showYaxis}
            tickFormatter={
              convertoPercent ? convertDecimalToPercent : setToFixed
            }
            domain={domain}
            ticks={convertoPercent ? _ticks || ticks : _ticks || undefined}
            label={{
              value: yAxisLabel,
              angle: 270,
              className: 'axis-title',
              position: 'outside',
              ...yAxisLabelData
            }}
            width={100}
          />

          {legend.map((option: IDetails) => {
            return (
              <Line
                type='linear'
                dataKey={option.name || ''}
                stroke={option.color}
                key={option.name}
                dot={{
                  fill: option.color,
                  strokeWidth: 4
                }}
                fill={option.color}
                activeDot={false}
                onMouseEnter={onMouseEnter}
                onMouseOut={() => setActiveData(undefined)}
                hide={!option.active}
                isAnimationActive
                // isUpdateAnimationActive
                // animationBegin={3}
                // animationDuration={3}
                // animationEasing='linear'
                onClick={(data) => {
                  onClick && onClick(option, data)
                }}
              />
            )
          })}
          <Legend
            content={
              <CustomLegend
                details={legendData}
                isRow
                onChange={(option: IDetails) => handleClick(option)}
                isFullWidth={legendFullwidth}
              />
            }
            verticalAlign='top'
            wrapperStyle={{ position: 'unset' }}
          />
          <Tooltip
            active
            cursor={{ fill: '#f00' }}
            wrapperStyle={{
              height: 'auto',
              width: tooltipWidth,
              visibility: 'visible'
            }}
            content={({
              active,
              label
            }: {
              active: boolean
              label: string
            }) => {
              return active && label ? (
                <LineChartTooltip
                  label={label}
                  legendData={legendData}
                  selectedColor={activeData?.stroke}
                  details={_details}
                  lineChartTooltip={lineChartTooltip}
                />
              ) : (
                <Fragment />
              )
            }}
          />
          {/* tiny chart start from here with zooming brush */}

          {showTinyChart ? (
            <Brush
              height={70}
              fill='rgba(0, 0, 0, 0)'
              stroke='rgba(0, 0, 0, 0.24)'
              dataKey='name'
              data={_details}
              startIndex={
                // if magnifierStartIndex is less than total width then show magnifierStartIndex or else show 0
                _magnifierStartIndex && _details.length > _magnifierStartIndex
                  ? _magnifierStartIndex
                  : 0
              }
              endIndex={_details.length - 1}
            >
              <LineChart data={_details} stackOffset='expand'>
                <XAxis
                  dataKey='name'
                  tick={false}
                  padding={{ left: startWithXaxis ? 0 : 120, right: 15 }}
                  angle={labelAngle}
                  interval={0}
                  width={50}
                  height={10}
                  textAnchor='end'
                  dx={10}
                />
                {legend.map((option: IDetails) => {
                  return (
                    <Line
                      type='linear'
                      dataKey={option.name || ''}
                      stroke={option.color}
                      key={option.name}
                      dot={false}
                      fill={option.color}
                      cursor='pointer'
                    />
                  )
                })}
              </LineChart>
            </Brush>
          ) : (
            <Fragment />
          )}
        </LineChart>
      </ResponsiveContainer>
    </StyledLineChart>
  )
}

export default LineChartComponent
