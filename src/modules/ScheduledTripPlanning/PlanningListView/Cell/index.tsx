import React from 'react'
import {  Position, Toggle } from 'ui-library'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis'
import { Tooltip } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import useClientProperties from '../../../common/ClientProperties/useClientProperties'
import moment from 'moment-timezone'
// import { useDispatch } from 'react-redux';
// import {TripPlanningScheduler} from '../PlanningListView.actions'
// import axios from '../../../../utils/axios'
// import apiMappings from '../../../../utils/apiMapping'

const TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING_MAIN = {

  default: React.memo(({ value }: Cell<any>) => {
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),
  frequency:React.memo(({ value,column, row }: Cell<any>) => {
    if(row.original.isCustomFl){
      let day=moment().day(moment(row?.original?.startDateTime).day()).format('dddd')
      let date=moment(row?.original?.startDateTime).format('Do')
      let freq= (row.original?.frequency ==3 ? ('months on '+ date): row.original?.frequency == 2 ? ('week on '+ day) :'Days')
      let rowData= 'Every '+ (row.original?.frequency ==3 ? row.original?.monthlySetting: row.original?.frequency ==2 ? row.original?.weeklySetting : row.original?.dailySetting)+ ' ' +freq
      return <div title={rowData}>{rowData}</div>
    }
    else{
      if(row.original?.frequency){
        let day=moment().day(moment(row?.original?.startDateTime).day()).format('dddd')
        let date=moment(row?.original?.startDateTime).format('Do')
        let rowData= (row.original?.frequency ==3 ? ('Monthly'+' on '+ date): row.original?.frequency == 2 ? ('Weekly'+' on '+ day) :'Daily')
        return <div title={rowData}>{rowData}</div>
      }
    }
    return <div title={value}>{value}</div>
  }),
  startDateTime: React.memo(({ value }: Cell<any>) => {
    const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
    const dateValue = moment.tz(
        value,
        clientProperties?.TIMEZONE
            ?.propertyValue
    ).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)+' '
    + moment.tz(clientProperties?.TIMEZONE
      ?.propertyValue).zoneAbbr();
    return <div title={dateValue}>{dateValue}</div>
}),
endDateTime: React.memo(({ value }: Cell<any>) => {
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
  const dateValue = value ? moment.tz(
      value,
      clientProperties?.TIMEZONE
          ?.propertyValue
  ).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)+' '
  + moment.tz(clientProperties?.TIMEZONE
    ?.propertyValue).zoneAbbr()
  : 'Never'  
  return <div title={dateValue}>{dateValue}</div>
}),
users:React.memo(({ value, column, row }: Cell<any>) => {
  const users = row?.original?.userMapDto.map((user:any)=>{
    return user.userName
  })
  
  return <div title={users.toString()}> {users.toString() }</div>
}),
status: React.memo(({ value, column, row }: Cell) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const disabled= useTypedSelector(state=>state.tripPlanningScheduler.listView.structure?.buttons?.InlineEdit?.permission)
    const [active, setActive] = React.useState<boolean>(value)
    
    return  <Position type='absolute' top='0em' left='1em'>
      <Tooltip hover={true} message={active ? dynamicLabels?.markStatusAsInactive : dynamicLabels?.markStatusAsActive}>
      <Toggle
        disabled={!disabled}
        checked={value}
        onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
          setActive(checked);
           column?.['cellCallback'](checked, row.original, setActive)
        }
        }
      />
       </Tooltip>
    </Position>
   
  },(p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),
lastUpdatedTime: React.memo(({ value, row }: Cell) => {
    let rowData= {...row?.original}
    const clientProperties = useClientProperties(['DATEFORMAT','TIMEZONE'])
    const d2 = moment(rowData?.updatedOnDt).tz(clientProperties?.TIMEZONE?.propertyValue)
    const format1 = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()+' hh:mm A'

  return <TextOverflowEllipsis title={d2.format(format1)+' '+moment.tz(clientProperties?.TIMEZONE?.propertyValue).zoneAbbr()}>{d2.format(format1)+' '+moment.tz(clientProperties?.TIMEZONE?.propertyValue).zoneAbbr()}</TextOverflowEllipsis>
      
}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),


}

export default TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING_MAIN

