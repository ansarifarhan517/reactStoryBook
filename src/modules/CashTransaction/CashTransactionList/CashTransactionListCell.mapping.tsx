import React, { ComponentType } from 'react'
import { Cell } from 'react-table'
import { IconButton, Box} from 'ui-library'
import TextOverflowEllipsis from '../../../utils/components/TextOverflowEllipsis'
//import { theme } from '../../../utils/theme'
import moment from "moment";
import useClientProperties from '../../common/ClientProperties/useClientProperties'
// import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { getDefaultTheme } from 'ui-library';
export interface ICellMapping {    
    [key: string]: ComponentType<Cell>
}
const theme = getDefaultTheme()
const CASH_TRANSACTION_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    
    transactionAmount: React.memo(({ value, row }: Cell<any>) => {
        return (
            <span style={{color : row.original.transactionType === 'Credit' ? 'green' : 'red'}}>{value}</span>
        )
    }),

    outstandingAmount: React.memo(({ value}: Cell<any>) => {
        return (
            <span style={{color : value >= 0 ? 'black' : 'red'}}>{value?.toFixed(2)}</span>
        )
    }),

    referenceId:  React.memo(({ column, row }: Cell<any>) => {
        return (
            <Box fullWidth={true} justifyContent= 'center' display= 'flex'>
                <IconButton
                    style={{boxShadow: "none", background: "transparent", color: !row.original.mediaCount ? 'grey' : ''}}
                    onClick={() => column?.['cellCallback'](row.original.referenceId)}
                    iconSize="sm"
                    disabled={!row.original.mediaCount}
                    iconVariant='attach-file'
                />
            </Box>
        )
    }),

    deliveryAssociateName: React.memo(({ column, row, value }: Cell<any>) => {
        if (row.original.isDeliveryAssociate) {
            return (
                <span style={{color: theme?.colors?.primary?.main, cursor: "pointer"}} onClick={() => column?.['cellCallback'](row.original.deliveryAssociateName)}>{value}</span>
            )
        } else {
            return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
        }
    }),

    branch: React.memo(({ column, row, value }: Cell<any>) => {
        if (row.original.isDistributionCenter) {
            return (
                <span style={{color: theme?.colors?.primary?.main, cursor: "pointer"}} onClick={() => column?.['cellCallback'](row.original.branch)}>{value}</span>
            )
        } else {
            return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
        }
    }),

    transactionDate: React.memo(({ value}: Cell<any>) => {
        const clientProperties = useClientProperties(['DATEFORMAT']);
        return (
           value ? moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue.toUpperCase()} HH:mm:ss`) : value
        )
    })
}

export default CASH_TRANSACTION_CELL_MAPPING