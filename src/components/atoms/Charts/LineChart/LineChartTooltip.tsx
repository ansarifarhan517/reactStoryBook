import React, { ReactNode } from 'react'
import {
  StyledToolTip,
  StyledColorBox,
  LegendWrapper,
  Label
} from './StyledLineChart'
import { IDetails, tLineChartTooltip } from '../interface'
// import { trimLegend } from '../CustomLegend'

interface IToolTip {
  label: string
  selectedColor: string
  legendData: Array<IDetails>
  details: Array<any>
  lineChartTooltip?: ({
    label,
    selectedColor,
    legendData,
    details
  }: tLineChartTooltip) => ReactNode
}

const LineChartTooltip = ({
  label,
  selectedColor,
  legendData,
  details,
  lineChartTooltip: tooltip
}: IToolTip) => {
  const newLegendData = React.useMemo(() => {
    const selectedLabelData = details.find((entry: any) => entry.name === label)
    const newData = legendData.map((option: any) => {
      if (option.color === selectedColor) {
        option.selected = true
      }
      option.value = selectedLabelData[option.name]
      return option
    })
    return newData
  }, [details, label, legendData, selectedColor])

  return tooltip ? (
    <div>{tooltip({ label, selectedColor, legendData, details })}</div>
  ) : (
    <StyledToolTip>
      <Label>{label}</Label>
      <div>
        {newLegendData.map((option: IDetails) => {
          return (
            <LegendWrapper key={option.name}>
              <StyledColorBox color={option.color} />
              <div className='space-between'>
                {/* <div>{trimLegend(option?.name, 15)} </div> */}
                <div>{option?.name} </div>
                <div>{option.value}</div>
              </div>
            </LegendWrapper>
          )
        })}
      </div>
    </StyledToolTip>
  )
}

export default React.memo(LineChartTooltip)
