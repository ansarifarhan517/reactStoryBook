import React from 'react';
import TextOverflowEllipsis from '../../../../../../utils/components/TextOverflowEllipsis'
import { Cell } from 'react-table'
import { getFormattedDate } from '../../../../../../modules/Order/OrderListOptionData/utils'
import { useTypedSelector } from '../../../../../../utils/redux/rootReducer';

export const USER_COUNT_CELL_MAPPING = {
    isActiveFl: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value ? "Active" : "Inactive"}>{value ? "Active" : "Inactive"}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    createdOnDt: React.memo(({ value}: Cell<any>) => {
        const tz = useTypedSelector(state=>state.clientProperties?.TIMEZONE?.propertyValue);
        if (!value || value === undefined) {
            return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value, tz)}>{getFormattedDate(value, tz)}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    lastLoginTime: React.memo(({ value}: Cell<any>) => {
        const tz = useTypedSelector(state=>state.clientProperties?.TIMEZONE?.propertyValue);
        if (!value || value === undefined) {
            return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value,tz)}>{getFormattedDate(value,tz)}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),



}