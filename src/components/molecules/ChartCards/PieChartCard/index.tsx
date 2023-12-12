import React, { Fragment, useEffect, useState } from 'react'
import Box from '../../../atoms/Box'
import Card from '../../../atoms/Card'
import { IDetails } from '../../../atoms/Charts/interface'
import PieChart from '../../../atoms/Charts/PieChart'
import PieCardSubTitle from './PieCardSubTitle'
import PieChartTitle from './PieChartTitle'
import { Divider, PieChartWrapper, SyledGrid } from './StyledPieChartCard'

export interface IPieChartCard {
  orderDetails: IOrderDetails
  height?: number
  isSelected?: boolean
  onClick?: () => void
  customTitleComponent?: React.ReactNode
  onLegendClick?: null | ((legend: IDetails) => void)
  onPieClick?: any
}
export interface IOrderDetails {
  title: string
  total: number
  fulfilment?: string
  payload: Array<IDetails>
  subTitle?: string
  subTotal?: number
  selected?: boolean
  clientIds?: any
}

const PieChartCard = ({
  orderDetails,
  height = 150,
  isSelected = true,
  onClick,
  customTitleComponent,
  onLegendClick,
  onPieClick
}: IPieChartCard) => {
  const [_orderDetails, setOrderDetails] = useState(orderDetails)
  useEffect(() => {
    setOrderDetails(orderDetails)
  }, [orderDetails])
  const handleClick = () => {
    onClick && onClick()
  }
  return (
    <SyledGrid item xs={12} sm={12} xl={4} md={2} lg={4}>
      <Card
        style={{
          padding: '0px',
          margin: '15px 15px 16px 15px',
          backgroundColor: '#ffffff'
        }}
        onClick={handleClick}
      >
        <Box
          bgColor={isSelected ? 'primary.main' : 'white'}
          style={{ cursor: 'pointer' }}
        >
          {customTitleComponent || (
            <Fragment>
              <PieChartTitle
                orderDetails={_orderDetails}
                isSelected={isSelected}
              />
              {_orderDetails?.subTitle && (
                <PieCardSubTitle
                  orderDetails={_orderDetails}
                  isSelected={isSelected}
                />
              )}
            </Fragment>
          )}
          <Divider subTitle={!!_orderDetails?.subTitle} />
        </Box>
        <PieChartWrapper>
          <PieChart
            details={_orderDetails?.payload}
            height={height}
            onLegendClick={onLegendClick}
            onPieClick={onPieClick}
          />
        </PieChartWrapper>
      </Card>
    </SyledGrid>
  )
}

export default PieChartCard
