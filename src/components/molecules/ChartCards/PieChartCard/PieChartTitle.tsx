import React from 'react'
import { IPieChartCard } from '.'
import { CardTitle, Fulfilment, Label, Value } from './StyledPieChartCard'

const PieChartTitle = ({ orderDetails, isSelected }: IPieChartCard) => {
  const isPositive =
    orderDetails?.fulfilment && parseInt(orderDetails?.fulfilment) > 0
  return (
    <CardTitle isSelected={isSelected}>
      <Label>{orderDetails?.title}</Label>
      <div>
        <Value>
          {parseFloat(orderDetails?.total.toString()).toLocaleString()}{' '}
        </Value>
        {orderDetails?.fulfilment && (
          <Fulfilment
            isSelected={isSelected}
            isPositive={!!isPositive}
          >{`(${orderDetails?.fulfilment}%)`}</Fulfilment>
        )}
      </div>
    </CardTitle>
  )
}

export default PieChartTitle
