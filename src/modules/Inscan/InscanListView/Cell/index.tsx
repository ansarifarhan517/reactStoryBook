import React from "react"
import TextOverflowEllipsis from "../../../../utils/components/TextOverflowEllipsis"
import { Cell } from 'react-table'
import moment from "moment"
import { useTypedSelector } from "../../../../utils/redux/rootReducer"

export const INSCAN_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),


    hubScanStatus: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
        return (
            <TextOverflowEllipsis title={dynamicLabels[value] || value}>
                {dynamicLabels[value] || value}
           </TextOverflowEllipsis>
        )
    }, (p, n) => p.value === n.value),

    scanDt: React.memo(({ value}: Cell<any>) => {
        const clientProperties = useTypedSelector(state => state.clientProperties);
        return (    
           value ? moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue.toUpperCase()} hh:mm A`) : value
        )
    }),

    orderStatus : React.memo(({ value}: Cell<any>) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
        return (
           value ? dynamicLabels[value] : value
        )
    })

   
}