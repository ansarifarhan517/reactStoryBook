import React from 'react';
import TextOverflowEllipsis from '../../../../../../utils/components/TextOverflowEllipsis'
import { Cell } from 'react-table'

export const ACCESS_PROFILE_COUNT_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    activeFl: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value?"Active":"Inactive"}>{value?"Active":"Inactive"}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    
}