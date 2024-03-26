import React from "react"
import TextOverflowEllipsis from "../../../../utils/components/TextOverflowEllipsis"
import { Cell } from 'react-table'
import { IDeliveryMediumData } from "../TerritoryList.models"
import {Position, Toggle } from 'ui-library'

export const TERRITORY_CELL_MAPPING = {
    default: React.memo(({ value }: Cell) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    deliveryMediumMasterId: React.memo(({ value }: Cell) => {
        const deliveryData = value && value.length ? value.map((obj: IDeliveryMediumData) => obj.deliveryMediumName) : []
        const deliveryMediumData = deliveryData ? deliveryData.join(',') : ''
        return <TextOverflowEllipsis title={deliveryMediumData}>{deliveryMediumData}</TextOverflowEllipsis>
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
}