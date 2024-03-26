import React from 'react'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { AverageBadgeSeparator, ColumnFlexContainer, OverallPieCard } from '../../OverallSummary.styles'

const TripIconCard = ({data, title} : any) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.overallSummary + ',Resources');
    const tripApiSuccess = useTypedSelector(
        (state) => state.overallSummaryListView.tripApiSuccess.apiSuccess
      );
return (
<>
<OverallPieCard>
<ColumnFlexContainer>
<div style={{position: 'relative', top: '36px'}}>
          <div className="makingFontBig" style={{textAlign: 'center', position: 'relative', bottom: '24px'}}>
            <i><img src="images/ic-trips ended.svg" /></i>
          </div>
          <AverageBadgeSeparator>{title}</AverageBadgeSeparator>
          {tripApiSuccess ? (
            <span style={{ fontSize: "17px", color: "#444", textAlign: 'center', position: 'relative', left: '50%'}}>{data}</span>
          ) : (
            `${dynamicLabels.apiCallFailed}`
          )}
          </div>
        </ColumnFlexContainer>
</OverallPieCard>
</>
)
}

export default TripIconCard