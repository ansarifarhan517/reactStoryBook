import React, { useState } from 'react';
import styled from 'styled-components'
import { DropDown } from 'ui-library'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
const FieldWrapper = styled.span`
display: flex;
align-items: center;
.numberInput-input{
    min-height: 18px;
    display: inline;
    min-width: 40px;
    width: 80px;
    margin: 0;
    text-align:center
}
`
export default React.memo(({row,column, data}: any) => {
    const origin = useTypedSelector(state => state.tripPlanningScheduler.form.formData.ownedFleet)
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const [originValue, setOriginValue] = useState(data[row?.index].origin || origin?.[row?.original?.deliveryMediumMasterId]?.startLocation)
    const optionList = React.useMemo(() => {
      return [
        {
          id: 'hub',
          label: dynamicLabels.branch || 'Hub',
          value: 'hub',
        },
        {
          id: 'da_location',
          label: dynamicLabels.deliveryAssociate? (dynamicLabels.deliveryAssociate+' '+ dynamicLabels.address) : 'Delivery Associate Address',
          value: 'deliveryAssociateAddress',
        }
    ]
    }, [])
    return <FieldWrapper>
       <DropDown
      value={originValue || optionList[0]}
      onChange={(val: any) => {
        column?.['cellCallback']( val ,row )
        setOriginValue(val)
      }}
      variant='inline-edit'
      optionList={optionList}
      width='80px'

    />
    </FieldWrapper>
}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original))





