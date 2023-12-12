import React from 'react'
import {
  StyledLegendWrapper,
  StyledCircle,
  StyledName,
  SingleLegend
} from './StyledLegends'
import { ILegends, IDetails } from '../interface'

// for line and barchart legend name char limit is 15
export const trimLegend = (value: any, charLimit: number) => {
  // if the name is greater than limit provided then append ... and trim or else show actual value
  const trimmedValue =
    value?.length > charLimit ? `${value?.substring(0, charLimit)}...` : value
  return trimmedValue
}

const CustomLegend = ({
  details,
  isRow,
  font,
  size,
  isFullWidth,
  onChange
}: ILegends) => {
  return (
    <StyledLegendWrapper isRow={isRow} font={font} size={size}>
      {details.map((option: IDetails) => {
        // const name = isRow
        //   ? trimLegend(option?.name, 15)
        //   : `${option.value} - ${option.name}`
        const validatingValues = option.value ? option.value : 0
        const modifiedValues = validatingValues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const name = isRow ? option?.name : `${modifiedValues} - ${option.name}`
        const title = isRow ? option?.name : `${modifiedValues} - ${option.name}`
        return (
          <SingleLegend key={option.color} isFullWidth={isFullWidth || false}>
            <StyledCircle
              color={option.color}
              isActive={option.active}
              onClick={() => onChange(option)}
              size={size}
              isFullWidth={isFullWidth || false}
            />
            <StyledName title={title} isFullWidth={isFullWidth || false}>
              {name}
            </StyledName>
          </SingleLegend>
        )
      })}
    </StyledLegendWrapper>
  )
}

export default CustomLegend
