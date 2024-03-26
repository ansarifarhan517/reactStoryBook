import CheckboxCell from '../../../../utils/components/CellMapping/CheckboxCell'
import DefaultCell from '../../../../utils/components/CellMapping/DefaultCell'
import AnchorTextCell from '../../../../utils/components/CellMapping/AnchorTextCell'
import ToggleCell from '../../../../utils/components/CellMapping/ToggleCell'
import BoxTypeTextCell from '../../../../utils/components/CellMapping/BoxTypeTextCell'
import NetWorkStatusCell from '../../../../utils/components/CellMapping/NetWorkStatusCell'
import React from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis'
import { loggedInStatusMapping, isOnBreakStatus } from '../DeliveryAssociateData'
import FormattedDateDefault from '../../../../utils/components/CellMapping/FormattedDateDefault'
import store from '../../../../utils/redux/store'
import NumberCountCell from '../../../../utils/components/CellMapping/NumberCountCell'


const DaListViewCellMapping = {
    
    default: DefaultCell,
    deliveryMediumMasterName: AnchorTextCell,
    tripName: AnchorTextCell,
    trackingDate: AnchorTextCell,
    isAttandanceFl: CheckboxCell,
    isActiveFl: ToggleCell,
    deliveryMediumMasterTypeCd: BoxTypeTextCell,
    deviceStatus: NetWorkStatusCell,
    networkStatus: NetWorkStatusCell,
    type: React.memo(({ value}: Cell<any>) => {
        const dynamicLabels =store.getState().pageLabels
        const mappingObj =loggedInStatusMapping(dynamicLabels)
        return <TextOverflowEllipsis title={value}>{mappingObj[value]}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    isOnBreakFl: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{isOnBreakStatus[value]}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    statusCd: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    insuranceExpiryDate: FormattedDateDefault,
    wcbExpiryDate: FormattedDateDefault,
    latestAvailableDate: FormattedDateDefault,
    licenseValidity: FormattedDateDefault,
    compartmentCount: NumberCountCell
}

export default DaListViewCellMapping