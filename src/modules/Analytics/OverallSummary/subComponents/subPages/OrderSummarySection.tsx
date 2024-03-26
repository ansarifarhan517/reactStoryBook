import React from 'react'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { OrderSummaryTitle, RowFlexContainer } from '../../OverallSummary.styles';
import PieComponent from '../Charts/PieComponent';
import { colors, percentCalculator } from '../utils/utilities';

const OrderSummarySection = () => {

  const orderData = useTypedSelector(state => state.overallSummaryListView.orderData);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.overallSummary + ',Resources');
 
  const notDispatchedPercent = percentCalculator(orderData?.notDispatchedOrders, orderData?.totalOrders)
  const cashNotCollectedPercent = percentCalculator(orderData?.uncollectedValue, orderData?.totalOrderValue)
  const orderOnTimePercent = percentCalculator(orderData?.ordersCompletedOnTime, orderData?.completedOrders)
  const missedOrderPercent = percentCalculator(orderData?.missedOrders, orderData?.totalOrders)
    const TotalOrderData: any = [
        {
          "name": dynamicLabels.completed,
          "value": orderData?.completedOrders,
          "color": colors[2],
          "active": true
        },
        {
          "name": dynamicLabels.cancelled,
          "value": orderData?.cancelledOrders,
          "color": colors[3],
          "active": true
        },
        {
          "name": dynamicLabels.attempted,
          "value": orderData?.notCompletedOrders,
          "color": colors[0],
          "active": true
        },
        {
          "name": dynamicLabels.missed,
          "value": orderData?.missedOrders,
          "color": colors[1],
          "active": true
        }
      ]

      const TotalOrderValue: any = [
        {
          "name": dynamicLabels.prepaid,
          "value": orderData?.prepaidOrdersValue,
          "color": colors[2],
          "active": true
        },
        {
          "name": dynamicLabels.notCollected,
          "value": orderData?.uncollectedValue,
          "color": colors[1],
          "active": true
        },
        {
          "name": dynamicLabels.collected,
          "value": orderData?.collectedValue,
          "color": colors[0],
          "active": true
        }
      ]

      const OrderOnTime: any = [
        {
          "name": dynamicLabels.orderCompletedOnTime,
          "value": orderData?.ordersCompletedOnTime,
          "color": colors[1],
          "active": true
        },
        {
          "name": dynamicLabels.delayedDeliveries,
          "value": orderData?.completedOrders - orderData?.ordersCompletedOnTime,
          "color": colors[2],
          "active": true
        }
      ]

      const missedOrdersData: any = [
        {
          "name": dynamicLabels.deliveredOrders,
          "value": orderData?.ordersCompletedOnTime,
          "color": colors[0],
          "active": true
        },
        {
          "name": dynamicLabels.missedOrders,
          "value": orderData?.missedOrders,
          "color": colors[1],
          "active": true
        }
      ]



    return (

        <>
        <OrderSummaryTitle>
       {dynamicLabels.orderSummaryTitle}
        </OrderSummaryTitle>

        <RowFlexContainer>
            <PieComponent data={TotalOrderData} headerLabel={dynamicLabels.totalOrders} labelData={orderData?.totalOrders} completedPercent={notDispatchedPercent} progressBarLabel={dynamicLabels.ordersNotDeliveredPro}/>
            <PieComponent data={TotalOrderValue} headerLabel={dynamicLabels.totalOrderValue} labelData={orderData?.totalOrderValue?.toFixed(2)} completedPercent={cashNotCollectedPercent?.toFixed(2)} progressBarLabel={dynamicLabels.cashNotCollectedPro}/>
            <PieComponent data={OrderOnTime} headerLabel={dynamicLabels.orderCompletedOnTime} labelData={orderData?.ordersCompletedOnTime} completedPercent={orderOnTimePercent} progressBarLabel={dynamicLabels.ordersCompletedOnTimePro}/>
            <PieComponent data={missedOrdersData} headerLabel={dynamicLabels.missedOrders} labelData={orderData?.missedOrders} completedPercent={missedOrderPercent} progressBarLabel={dynamicLabels.ordersMissedPro}/>
        </RowFlexContainer>
        </>
    );
}

export default OrderSummarySection;