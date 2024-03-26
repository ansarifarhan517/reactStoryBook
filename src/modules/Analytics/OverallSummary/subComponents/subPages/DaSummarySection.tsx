import React from 'react'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import useClientProperties from '../../../../common/ClientProperties/useClientProperties';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { OrderSummaryTitle, RowFlexContainer } from '../../OverallSummary.styles';
import DAGraphCard from '../IconCards/DAGraphCard';
import DaIconCards from '../IconCards/DaIconCards';
import { distanceUnitFormatter, handleMinutesToHours } from '../utils/utilities';

const DaSummarySection = () => {
    
    const clientProperties = useClientProperties(["DISTANCE"]);
    const delData = useTypedSelector(state => state.overallSummaryListView.delData);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.overallSummary + ',Resources');
    const totalDeliveryMediums = delData?.totalDeliveryMediums;
    const distancePerDeliveryMedium = delData?.distancePerDeliveryMedium;
    const timePerDeliveryMedium = delData?.timePerDeliveryMedium;
    const timePerDelivery = delData?.timePerDelivery;

    let preferredUnit = clientProperties?.DISTANCE?.propertyValue;

    let iconDistancePerDA = distanceUnitFormatter(distancePerDeliveryMedium, preferredUnit)

    return (
        <>
        <OrderSummaryTitle>
        {dynamicLabels.DaTitle}
        </OrderSummaryTitle>
        <DAGraphCard />
        <RowFlexContainer>
        <DaIconCards title={dynamicLabels.totalDeliveryAssociates} data={totalDeliveryMediums} overallIcon={'icon icon-delivery-boy'}/>
        <DaIconCards title={dynamicLabels.timePerDA} data={handleMinutesToHours(Math.trunc(timePerDeliveryMedium))[0]+ ' Hrs ' + handleMinutesToHours(Math.trunc(timePerDeliveryMedium))[1]+ ' Mins'} overallIcon={'icon icon-shape3'}/>
        <DaIconCards title={dynamicLabels.distancePerDA} data={iconDistancePerDA?.toFixed(2)} overallIcon={'icon icon-distance_delivery'} preferredUnit={preferredUnit?.slice(0,2)}/>
        <DaIconCards title={dynamicLabels.timePerDelivery} data={handleMinutesToHours(Math.trunc(timePerDelivery))[0]+ ' Hrs ' + handleMinutesToHours(Math.trunc(timePerDelivery))[1]+ ' Mins'} overallIcon={'icon icon-time_delivery'}/>
        </RowFlexContainer>
        </>

    );

}

export default DaSummarySection;