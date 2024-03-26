import React, { ComponentType } from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from './../../../../utils/components/TextOverflowEllipsis'

export interface ICellMapping {    
    [key: string]: ComponentType<Cell>
}

const CUSTOM_FORMS_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),
    
    triggerEventsCount: ({value, column, row }: Cell) => {
        return <div className="cellIdentifier dummy-tooltip-disable-class noOfItems" ><div className="button-col-action" onClick={() => column?.['cellCallback'](value > 0 ? true : false , row.original)}>{value || 0}</div></div>
      },

}

export default CUSTOM_FORMS_CELL_MAPPING