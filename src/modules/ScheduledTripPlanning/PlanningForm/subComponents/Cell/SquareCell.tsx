import React from 'react'
import { Cell } from 'react-table'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { StyledSquare } from '../../../../../utils/components/CellMapping/StyledCellMapping';


export default React.memo(({ value ,row,column}: Cell<any>) => {
    const isEditMode = useTypedSelector(state => state.shipper.listView.isEditMode)
    return <StyledSquare
        disabled={value === 0 || !value || isEditMode}
        onClick={() => {
                column?.['cellCallback']( value ,row.original)
        }}
    >
        {value || 0}
    </StyledSquare>
}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original))




