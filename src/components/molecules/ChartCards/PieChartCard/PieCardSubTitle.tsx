import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { CardTitle } from './StyledPieChartCard'
import { IPieChartCard } from '.'

const PieCardSubTitle = ({ orderDetails, isSelected }: IPieChartCard) => {
  const theme = useContext(ThemeContext)
  return (
    <CardTitle
      isSelected={isSelected}
      style={{
        color: isSelected ? theme?.colors?.white : theme?.colors?.primary?.main
      }}
    >
      <div>{orderDetails?.subTitle}</div>
      {orderDetails?.subTotal &&
        parseFloat(orderDetails?.subTotal?.toString()).toLocaleString()}{' '}
    </CardTitle>
  )
}

export default PieCardSubTitle
