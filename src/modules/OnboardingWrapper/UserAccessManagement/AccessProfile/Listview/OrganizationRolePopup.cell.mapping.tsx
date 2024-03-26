import React, { ComponentType } from 'react'
import { Cell } from 'react-table'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis'
export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}

const OrganizationRolePopupCellMapping = {

    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    persona: React.memo(({ value }: Cell<any>) => {
        if (!value || value === undefined) {
            return <TextOverflowEllipsis></TextOverflowEllipsis>
        }
        const val = value.replace(
            /\w\S*/g,
            function (txt: string) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
        return <TextOverflowEllipsis title={val}>{val}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    orgRoleLandingPage: React.memo(({ row }: Cell<any>) => {
        let orgRoleLandingPage = row.original.orgRoleLandingPage
        switch (row.original.orgRoleLandingPage) {
            case 'trip':
                orgRoleLandingPage = 'Trip List View';
                break;
            case 'live':
                orgRoleLandingPage = 'Live Dashboard';
                break;
            case 'order':
                orgRoleLandingPage = 'Orders List View';
                break;
            case 'home/mile':
                orgRoleLandingPage = 'Control Tower Dashboard';
                break;
            default: break;
        }
        return <TextOverflowEllipsis title={orgRoleLandingPage}>{orgRoleLandingPage}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),


    defaultAccess: React.memo(({ value }: Cell) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
        return (
            <span>
            {value ? dynamicLabels?.Yes : dynamicLabels?.No}
            </span>
        )
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),

    activeFl: React.memo(({ value }: Cell) => {
        const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
        return (
            <span>
                {value ? dynamicLabels?.active : dynamicLabels?.inactive}
            </span>
        )
    }, (p, n) => p.value === n.value),
}

export default OrganizationRolePopupCellMapping