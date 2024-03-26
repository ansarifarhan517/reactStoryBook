import React from 'react';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import useClientProperties from '../../../../common/ClientProperties/useClientProperties';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { OrderSummaryTitle, RowFlexContainer } from '../../OverallSummary.styles';
import AveragePerformanceCards from '../IconCards/AveragePerformanceCards';
import { distanceUnitFormatter, handleMinutesToHours } from '../utils/utilities';

const AveragePerformanceSection = () => {

  const clientProperties = useClientProperties(["DISTANCE"]);
  const tripData = useTypedSelector(state => state.overallSummaryListView.tripData)
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.overallSummary + ',Resources');
  const timePerTrip = tripData?.avgPerformance?.timePerTrip;
  const timePerOrder = tripData?.avgPerformance?.timePerOrder;
  const distancePerOrder = tripData?.avgPerformance?.distancePerOrder;
  const distancePerTrip = tripData?.avgPerformance?.distancePerTrip;

  let preferredUnit = clientProperties?.DISTANCE?.propertyValue;
  preferredUnit = preferredUnit?.slice(0,2);

  let graphDistancePerTrip = distanceUnitFormatter(distancePerTrip, preferredUnit)
  let graphDistancePerOrder = distanceUnitFormatter(distancePerOrder, preferredUnit)
    return (
        <>

        <OrderSummaryTitle>
          {dynamicLabels.averagePerformanceTitle}
        </OrderSummaryTitle>
        <RowFlexContainer>
      <AveragePerformanceCards title={dynamicLabels.timePerTripMile} data={handleMinutesToHours(timePerTrip)[0] + ' Hrs ' + handleMinutesToHours(timePerTrip)[1]+ ' Mins'} overallIcon={'icon icon-time_trip'}/>
      <AveragePerformanceCards title={dynamicLabels.distancePerTripMile} data={graphDistancePerTrip?.toFixed(2) + '  '+ preferredUnit } overallIcon={'icon icon-distance_trip'}/>
      <AveragePerformanceCards title={dynamicLabels.timePerOrderMile} data={handleMinutesToHours(timePerOrder)[0] + ' Hrs ' + handleMinutesToHours(timePerOrder)[1]+ ' Mins'} overallIcon={'icon icon-timer_order'}/>
      <AveragePerformanceCards title={dynamicLabels.distancePerOrderMile} data={graphDistancePerOrder?.toFixed(2) + '  ' + preferredUnit} overallIcon={'icon icon-distance_order'}/>
      </RowFlexContainer>
        </>
    )
}
export default AveragePerformanceSection