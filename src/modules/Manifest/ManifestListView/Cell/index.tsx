import React from "react"
import TextOverflowEllipsis from "../../../../utils/components/TextOverflowEllipsis"
import { Cell } from 'react-table'
import useClientProperties from "../../../common/ClientProperties/useClientProperties"
import moment from "moment"
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { userAccessInfo } from "../../../../utils/constants"

export const MANIFEST_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    manifestUpdatedDate: React.memo(({ value }: Cell<any>) => {
        const clientProperties = useTypedSelector(state => state.clientProperties)
        return (
            value ? moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue.toUpperCase()} hh:mm A`) : value
        )
    }),

    manifestType: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
        return (
            value ? value == "ORDER" ? userAccessInfo.superType == "MIDDLEMILE" ? dynamicLabels["mm_order_s"] ? dynamicLabels["mm_order_s"] : '' : dynamicLabels["order_s"] ? dynamicLabels["order_s"] : '' :dynamicLabels[value.toString().toLowerCase()] : value
        )
    }),

    manifestStatus: React.memo(({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
        return (<TextOverflowEllipsis title={dynamicLabels[value] || value}>
            {dynamicLabels[value] || value}
        </TextOverflowEllipsis>)
    }, (p, n) => p.value === n.value),

    manifestCreationDate: React.memo(({ value }: Cell<any>) => {
        const clientProperties = useTypedSelector(state => state.clientProperties)
        return (
            value ? moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue.toUpperCase()} hh:mm A`) : value
        )
    })
}