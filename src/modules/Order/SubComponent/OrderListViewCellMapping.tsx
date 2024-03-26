import React, { ComponentType } from 'react'
import { Cell } from 'react-table'
import {  Button,  IconButton} from 'ui-library'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import TextOverflowEllipsis from '../../../utils/components/TextOverflowEllipsis'
import {ItemButton} from '../OrderListView/StyledOrderListView'
import { toCapitalized, getFormattedDate } from '../../../modules/Order/OrderListOptionData/utils'
// import { orderStatusMappings } from '../../../modules/Order/OrderListOptionData/data'
import useClientProperties from '../../../modules/common/ClientProperties/useClientProperties'
import moment from 'moment-timezone'
import AnchorTextCell from '../../../utils/components/CellMapping/AnchorTextCell'
import { timeWindowConfirmedByMap } from '../../../utils/constants'
// import { useDispatch } from "react-redux"
// import { Dispatch } from "react"
// import { tGlobalPopupAction } from "../../../modules/common/GlobalPopup/GlobalPopup.reducer"
// import CrateLinePopUp from '../../../utils/components/CrateLinePopUp'
// import apiMappings from '../../../utils/apiMapping'
// import axios  from '../../../utils/axios'

export interface ICellMapping {
  [key: string]: {
    [key: string]: ComponentType<Cell>
  }
}

export interface INumberProps {
  value?: number
}



const ORDER_LIST_VIEW_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    orderNo: AnchorTextCell,
    lastTrackingDt: React.memo(({ value, column, row }: Cell<any>) => {
      const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);

      if (!value) {
        return <div></div>
      }

      return (
        <Button variant='link' primary onClick={() => column?.['cellCallback'](row.original)} style={{ color: '#5698d3', margin:'0 auto' }}>
          <TextOverflowEllipsis title={moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)}>{moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)}</TextOverflowEllipsis>
        </Button>)
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),

    tripNo: AnchorTextCell,

    trackNow: React.memo(({row}: Cell<any>) => {
      let hrefdata =`#/order/locationhistory?tripId=${row.original.tripId}&tripName=${row.original.tripNo}&page=orders&shipmentId= ${row.original.shipmentId}&endDt=${row.original.endDt}&startDt= ${row.original.startDt}&lat: ${row.original.lat}&long= ${row.original.lng}&hublat=${row.original.destLatitude}&hublng=${row.original.destLongitude}&bc_key=allorders`;

      return (<div style={{ textAlign: 'center', width: 'inherit' }}>
          <a  rel="noopener noreferrer" href={hrefdata} style={{color: '#5698d3'}}>
            <IconButton iconVariant="origin" iconSize={16} onlyIcon style={{ color: "#5698d3", margin: '0 auto'}}/>
          </a>
        </div>)
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),

    orderType: React.memo(({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={toCapitalized(value)}>{toCapitalized(value)}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    orderState: React.memo(({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={toCapitalized(value)}>{toCapitalized(value)}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    orderStatus: React.memo(({ value }: Cell<any>) => {
      const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
      return <TextOverflowEllipsis title={dynamicLabels[value]}>{dynamicLabels[value]}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    orderValue: React.memo(({ row }: Cell<any>) => {
      return <TextOverflowEllipsis title={row.original.amount}>{row?.original?.amount}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    deliveryProcess: React.memo(({ value, column, row }: Cell<any>) => {

      return <div data-value={value} style={{ textAlign: 'center', width: 'inherit' }} onClick={() => column?.['cellCallback'](row.original)}><IconButton iconVariant="icon icon-icomoon-location-approve" iconSize={16} onlyIcon style={{ color: "#5698d3", margin: '0 auto' }} /></div>
    }, (p, n) => p.value === n.value),
    orderDate: React.memo(({ value,row }: Cell) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['orderDateTZ'])}>{getFormattedDate(value,row.original['orderDateTZ'])}</TextOverflowEllipsis>
    }, (p, n) => {return p.value === n.value}),

    startTimeWindow: React.memo(({ value,row }: Cell<any>) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['startTimeWindowTZ'])}>{getFormattedDate(value,row.original['startTimeWindowTZ'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    endTimeWindow: React.memo(({ value,row }: Cell<any>) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['endTimeWindowTZ'])}>{getFormattedDate(value,row.original['endTimeWindowTZ'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),


    pickupEndTimeWindow: React.memo(({ value,row }: Cell<any>) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['pickupEndTimeWindowTZ'])}>{getFormattedDate(value,row.original['pickupEndTimeWindowTZ'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    deliverStartTimeWindow: React.memo(({ value,row }: Cell<any>) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['deliverStartTimeWindowTZ'])}>{getFormattedDate(value,row.original['deliverStartTimeWindowTZ'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    deliverEndTimeWindow: React.memo(({ value,row }: Cell<any>) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['deliverEndTimeWindowTZ'])}>{getFormattedDate(value,row.original['deliverEndTimeWindowTZ'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    pickupStartTimeWindow: React.memo(({ value ,row}: Cell<any>) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['pickupStartTimeWindowTZ'])}>{getFormattedDate(value,row.original['pickupStartTimeWindowTZ'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),


    startDt: React.memo(({ value ,row}: Cell<any>) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['startDtTZ'])}>{getFormattedDate(value,row.original['startDtTZ'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    actualArrivalTime: React.memo(({ value,row }: Cell<any>) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['startDtTZ'])}>{getFormattedDate(value,row.original['startDtTZ'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    createdOnDt: React.memo(({ value,row }: Cell<any>) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['startDtTZ'])}>{getFormattedDate(value,row.original['startDtTZ'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),



    eta: React.memo(({ value,row }: Cell<any>) => {
      if (!value) {
        return <div></div>
      }
      return <TextOverflowEllipsis title={getFormattedDate(value,row.original['startDtTZ'])}>{getFormattedDate(value,row.original['startDtTZ'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    timeWindowConfirmedBy: React.memo(({ value }: Cell<any>) => {
      const displayTxt = timeWindowConfirmedByMap[value]?.label || value
      return <TextOverflowEllipsis title={displayTxt}>{displayTxt}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    actualCost: React.memo(({ value,column,row }: Cell<any>) => {
      const clientProperties = useTypedSelector(state => state.clientProperties);
      const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
      return (
        <Button variant='link' primary onClick={() => column?.['cellCallback'](row.original)} style={{ color: '#5698d3', margin:'0 auto' }}>
          <TextOverflowEllipsis title={value}>{dynamicLabels[`cur_symbol_${clientProperties?.BASECURRENCY?.propertyValue}`]} {value || 0.00}</TextOverflowEllipsis>
        </Button>)
    }, (p, n) => p.value === n.value),
    // Need to add currency
    shipmentActualCost: React.memo(({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    estimatedCost: React.memo(({ value, column, row }: Cell<any>) => {
      // const dispatch = useDispatch<Dispatch<IDynamicLabelsAction>>()
      const clientProperties = useTypedSelector(state => state.clientProperties);
      const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
      return (
        <Button variant='link' primary onClick={() => column?.['cellCallback'](row.original)} style={{ color: '#5698d3', margin:'0 auto' }}>
          <TextOverflowEllipsis title={value}>{dynamicLabels[`cur_symbol_${clientProperties?.BASECURRENCY?.propertyValue}`]} {value || 0.00}</TextOverflowEllipsis>
        </Button>)
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),

    isGeocoded:React.memo(({ value, column, row }: Cell<any>) => {

      return <div data-value={value} style={{ textAlign: 'center', width: 'inherit' }} onClick={() => column?.['cellCallback'](row.original)}><IconButton iconVariant="locater" iconSize={16} onlyIcon style={{ color: value?"#5698d3":"#e32022", margin: '0 auto' }} /></div>
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),



    
  isPartialDeliveredFl: React.memo(({ value }: Cell<any>) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    return <TextOverflowEllipsis title={value ? dynamicLabels.YES : dynamicLabels.NO}>{value ? dynamicLabels.YES : dynamicLabels.NO}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),
   



    noOfItems: React.memo(({ value, row, column }: Cell<any>) => {
      return <><ItemButton className="noOfItem"><span
        onClick={() => column?.['cellCallback'](row.original)}
        >{value || '0'}</span></ItemButton>
    </>
   

    }, (p, n) => p.value === n.value),

    hubScanStatus: React.memo(({ value }: Cell<any>) => {
      const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
      return (
          <TextOverflowEllipsis title={dynamicLabels[value] || value}>
              {dynamicLabels[value] || value}
         </TextOverflowEllipsis>
      )
  }, (p, n) => p.value === n.value),

  paymentType: React.memo(({ value }: Cell<any>) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    return <TextOverflowEllipsis title={dynamicLabels[value ? value.toUpperCase() : value]}>{dynamicLabels[value ? value.toUpperCase() : value] ? dynamicLabels[value ? value.toUpperCase() : value] : value }</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value)

}



export default ORDER_LIST_VIEW_CELL_MAPPING