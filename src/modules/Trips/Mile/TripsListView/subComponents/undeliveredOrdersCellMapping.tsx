import React from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis'

// import FormattedDateWithLocal from '../../../../../utils/components/CellMapping/FormattedDateWithLocal'


const TRIP_UNDELIVERED_ORDER_LIST_VIEW_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        //add type wise return here so all the mappings are proper
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

}

export default TRIP_UNDELIVERED_ORDER_LIST_VIEW_CELL_MAPPING