import React from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis'
import useClientProperties from '../../../common/ClientProperties/useClientProperties'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import moment from 'moment-timezone'


export const WEBHOOK_CELL_MAPPING = {
    
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    status: ({ value }: Cell<any>) => {
        const data = useTypedSelector(state => state.settings_webhookHistory.listView.HashMapStatus)
        let statusObject:any = data[value]
        return <TextOverflowEllipsis title={statusObject?.clientRefMasterDesc || value}>{statusObject?.clientRefMasterDesc || value}</TextOverflowEllipsis>
    },

    notificationType: React.memo(({ value, row }: Cell<any>) => {
        const eventType = useTypedSelector(state => state.settings_webhookHistory.listView.eventTypes?.ALL)
        const eventTypeName = React.useMemo(() => eventType?.find((c:any) => {
            let module = c.clientRefMasterType?.replace('EVENT_TYPE_','')
           return c.clientRefMasterCd === value && module === row?.original?.module?.toUpperCase()
           
        }),[value,row?.original?.module])
        
        return <TextOverflowEllipsis title={eventTypeName?.clientRefMasterDesc || value }>{eventTypeName?.clientRefMasterDesc || value}</TextOverflowEllipsis>

    }, (p, n) =>  p.value === n.value ),

    updatedDate: React.memo(({ value }: Cell) => {
        const clientProperties = useClientProperties(['DATEFORMAT','TIMEZONE'])
        const d2 = moment.utc(value).tz(clientProperties?.TIMEZONE?.propertyValue)
        const format1 = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()+' hh:mm A'

      return <TextOverflowEllipsis title={d2.format(format1)}>{d2.format(format1)}</TextOverflowEllipsis>
          
    }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),

};

