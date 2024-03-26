import React, { useEffect, Dispatch } from 'react'
import { useDispatch } from 'react-redux'
import { OverallSummaryListViewActions } from '../../OverallSummary.actions'; 
import PieComponent from '../Charts/PieComponent';
import { BottomCardPosition, ColumnFlexContainer, RowFlexContainer, TripCardPosition } from '../../OverallSummary.styles';
import OrderSummaryCards from '../IconCards/OrderSummaryCards';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { colors, distanceUnitFormatter, handleMinutesToHours, percentCalculator } from '../utils/utilities';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useClientProperties from '../../../../common/ClientProperties/useClientProperties';
import TripIconCard from '../IconCards/TripIconCard';



const TripSummarySection = ( selectedDate: any ) =>{

const tripData = useTypedSelector(state => state.overallSummaryListView.tripData);
const clientProperties = useClientProperties(["DISTANCE"]);
const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.overallSummary + ',Resources');
const endedTrips = tripData?.tripCount?.endedTrips;
const delayedTrips = tripData?.delayedTrips?.delayedTrips
const plannedDistance = tripData?.timeDistance?.plannedDistance;
const actualDistance = tripData?.timeDistance?.actualDistance;
const plannedTime = tripData?.timeDistance?.plannedTime;
const actualTime = tripData?.timeDistance?.actualTime;
const lateTrips = tripData?.delayedTrips?.lateTrips
const totalTrips = tripData?.tripCount?.startedTrips + endedTrips + tripData?.tripCount?.notStartedTrips;
const endedTripPercent = percentCalculator(endedTrips, totalTrips);
const delayedTripsPercent = percentCalculator(lateTrips, delayedTrips);

let preferredUnit = clientProperties?.DISTANCE?.propertyValue;
preferredUnit = preferredUnit?.slice(0,2);

let graphPlannedDistance = distanceUnitFormatter(plannedDistance, preferredUnit)
let graphActualDistance = distanceUnitFormatter(actualDistance, preferredUnit)

   const EndedTripData: any = [
    {
      "name": dynamicLabels.startedTrips,
      "value": tripData?.tripCount?.startedTrips,
      "color": colors[2],
      "active": true
    },
    {
      "name": dynamicLabels.notStartedTrips,
      "value": tripData?.tripCount?.notStartedTrips,
      "color": colors[1],
      "active": true
    },
    {
      "name": dynamicLabels.endedTrips,
      "value": tripData?.tripCount?.endedTrips,
      "color": colors[0],
      "active": true
    },
  ]

  const DelayedTripData: any = [
    {
      "name": dynamicLabels.startedBeforeTime,
      "value": tripData?.delayedTrips?.tripsBeforeTime,
      "color": colors[0],
      "active": true
    },
    {
      "name": dynamicLabels.startedLate,
      "value": tripData?.delayedTrips?.lateTrips,
      "color": colors[2],
      "active": true
    },
    {
      "name": dynamicLabels.startedOnTime,
      "value": tripData?.delayedTrips?.tripsOnTime,
      "color": colors[1],
      "active": true
    },
  ]
    return (
    <>
  
  <RowFlexContainer>
  <TripIconCard data={endedTrips} title={dynamicLabels.endedTrips} />
  <PieComponent data={DelayedTripData} headerLabel={dynamicLabels.delayedTrips} labelData={delayedTrips} completedPercent={delayedTripsPercent} progressBarLabel={dynamicLabels.tripsStartedPro}/>
  <OrderSummaryCards data={graphPlannedDistance?.toFixed(2) + '  ' + preferredUnit} details={dynamicLabels.plannedDistanceMI} overallIcon={'icon icon-planned-distance'}/>
  <OrderSummaryCards data={handleMinutesToHours(plannedTime)[0] + ' Hrs ' + handleMinutesToHours(plannedTime)[1] + ' Mins'} details={dynamicLabels.plannedTime} overallIcon={'icon icon-time'}/>
  </RowFlexContainer>

  <TripCardPosition><OrderSummaryCards data={graphActualDistance?.toFixed(2)+ '  ' + preferredUnit} details={dynamicLabels.actualDistance} overallIcon={'icon icon-planned-distance'}/></TripCardPosition>
  <BottomCardPosition><OrderSummaryCards data={handleMinutesToHours(actualTime)[0] + ' Hrs ' + handleMinutesToHours(actualTime)[1] + ' Mins'} details={dynamicLabels.actualTime} overallIcon={'icon icon-time'}/></BottomCardPosition>
    
    </>
    );
}

export default TripSummarySection