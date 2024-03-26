
import React, { ComponentType } from 'react'
import { Cell } from 'react-table'
import {Toggle, Position } from 'ui-library'
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import moment from 'moment';
import useClientProperties from '../../../../modules/common/ClientProperties/useClientProperties';

export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}

const  CUSTOM_FIELD_CELL_MAPPING : ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),
  
      isActiveFl: React.memo(({ value, column, row }: Cell) => {
        const [active, setActive] = React.useState<boolean>(value)
        React.useEffect(() => {
          setActive(value)
        }, [value])
  
        return <Position type='absolute' top='0em' left='1em'>
          <Toggle
            checked={active}
            onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
              setActive(checked)
              column?.['cellCallback'](checked, row.original, setActive)
            }
            }
          />
        </Position>
      }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),
  
      attachedWithModules: React.memo(({ value}: Cell) => {
        const data = useTypedSelector(state => state.customFields.listView.modulesList)
            if (data && data?.length > 0) {
                  let newModules: any = [];
                  if(value && value.length > 0){
                    value.map((row: any) => {
                      data.map((module: any) => {
                        if(row === module.clientRefMasterCd){
                            newModules.push(module.clientRefMasterDesc)
                        }
                      }) 
                    }) 
                    value = newModules.join(', ')
                  }
            }
            return <TextOverflowEllipsis title={value}>{value ? value : undefined}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),
  
      updatedOnDt: React.memo(({ value }: Cell<any>) => {
        const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
        const dateValue = moment.tz(
            value,
            clientProperties?.TIMEZONE
                ?.propertyValue
        ).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm A`);
        return <div title={dateValue}>{dateValue}</div>
    })
    
}

export default CUSTOM_FIELD_CELL_MAPPING
