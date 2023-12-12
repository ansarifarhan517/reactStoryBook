import React, { useState, useEffect } from 'react'
import PieChartCard, {
  IOrderDetails
} from '../../../molecules/ChartCards/PieChartCard'
import Grid from '../../../atoms/Grid'
import { IDetails } from '../../../atoms/Charts/interface'

export interface IPieChartCard {
  orderDetails: Array<IOrderDetails>
  height: number
  isClickable?: boolean
  onClick?: (selectedCardDetails: IOrderDetails) => void
  onLegendClick?: (legend: IDetails) => void
  onPieClick?: (legend: any) => void
}

const PieChartCardList = ({
  orderDetails,
  height = 150,
  isClickable = true,
  onClick,
  onLegendClick,
  onPieClick
}: IPieChartCard) => {
  const [_odrerDetails, setOrderDetails] = useState(orderDetails)
  const [selectedCard, setSelectedCard] = useState<IOrderDetails | undefined>(
    undefined
  )
  useEffect(() => {
    setOrderDetails(orderDetails)
  }, [orderDetails])
  /* eslint-disable */
  const handleCardClick = React.useCallback(
    (option: IOrderDetails) => {
      if (selectedCard?.title !== option.title) {
        const details: any = Array.from(Object.create(_odrerDetails))
        details.forEach((orderOption: IOrderDetails) => {
          if (orderOption.title === option.title) {
            orderOption.selected = true
            setSelectedCard(orderOption)
            // selected card information can be sent out with below click event
            onClick && onClick(orderOption)
          } else {
            orderOption.selected = false
          }
        })
        setOrderDetails(details)
        
      }
    },
    [selectedCard?.title]
  )

  return (
    <Grid lg={4} md={2} xl={4} xs={12} container>
      {_odrerDetails.map((option: IOrderDetails) => {
        return (
          <PieChartCard
            key={`${option?.title}-${option?.total}`}
            orderDetails={option}
            height={height}
            isSelected={option.selected}
            onClick={() => (isClickable ? handleCardClick(option) : null)}
            onLegendClick={onLegendClick ? onLegendClick : null}
            onPieClick= {onPieClick?onPieClick:null}
          />
        )
      })}
    </Grid>
  )
}

export default PieChartCardList
