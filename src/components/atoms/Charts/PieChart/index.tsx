import React, { useEffect, useState } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip
} from 'recharts'
import CustomLegend from '../CustomLegend'
import { IDetails, IPieChart } from '../interface'
import PieChartTooltip from './DefaultTooltip'
import { StyledPieChart } from './StyledPieChart'

// IDetails is the data fomat provided to pie chart

const renderActiveShape = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill
}: {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
}) => {
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

const getTotal = (data: Array<IDetails>) =>
  data.reduce((sum, option) => {
    if (option.active) {
      const value = option.value || 0
      return sum + value
    }
    return sum
  }, 0)
const getActiveData = (data: Array<IDetails>) =>
  data
    .filter((option: any) => option.active)
    .sort((d1, d2) => -(d1?.value || 0) + (d2?.value || 0))

const PieChartComponent = ({
  details,
  height = 150,
  onLegendClick,
  onPieClick
}: IPieChart) => {
  const [data, setData] = useState(details)
  const [activeData, setActiveData] = useState(getActiveData(details))
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const [total, setTotal] = useState(getTotal(data))

  useEffect(() => {
    setData(getActiveData(details))
    setActiveData(getActiveData(details))
    setTotal(getTotal(details))
  }, [details])

  const onPieEnter = (_data: any, index: number) => {
    setActiveIndex(index)
  }
  const pieOnClick = (_data: any) => {
    onPieClick && onPieClick(_data)
    // onLegendClick && onLegendClick(_data.payload)
  }

  const handleClick = (option: IDetails) => {
    const newDetails: any = Array.from(Object.create(data))
    // here we are changing active to false for unticked legends
    newDetails.forEach((dataItem: IDetails) => {
      if (dataItem.name === option.name) {
        if (activeData.length > 1) {
          dataItem.active = !option.active
        } else {
          dataItem.active = true
        }
      }
    })
    setData(newDetails)
    // here on pie chart we are filtering out those legends which are active
    const activeDetails = getActiveData(newDetails)
    setActiveData(activeDetails)
    // total of sectors based on new active legends
    setTotal(getTotal(activeDetails))
    // send changed status of all legend out
    onLegendClick && onLegendClick(newDetails)
  }

  return (
    <StyledPieChart>
      <ResponsiveContainer width='100%' height={height}>
        <PieChart>
          <Legend
            content={
              <CustomLegend
                details={data}
                isRow={false}
                onChange={(option: IDetails) => handleClick(option)}
                isFullWidth
              />
            }
            wrapperStyle={{ position: 'unset', top: '9px' }}
          />

          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={activeData}
            onClick={pieOnClick}
            innerRadius='60%'
            outerRadius='70%'
            dataKey='value'
            blendStroke
            onMouseEnter={onPieEnter}
            isAnimationActive
            onMouseOut={() => setActiveIndex(undefined)}
            animationBegin={2}
            animationEasing='linear'
            cx='85%'
            cy='45%'
            animationDuration={1}
            className='pie'
          >
            {activeData.map((entry: any) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            active
            content={(props: any) => {
              return props.payload.length !== 0 ? (
                <PieChartTooltip payload={props.payload} total={total} />
              ) : (
                <div />
              )
            }}
            //   wrapperStyle={{ height: '31px', width: '100%' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </StyledPieChart>
  )
}

export default PieChartComponent
