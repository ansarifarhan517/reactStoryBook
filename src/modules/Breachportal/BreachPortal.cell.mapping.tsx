import React from "react";
import TextOverflowEllipsis from "../../utils/components/TextOverflowEllipsis";
import { Cell } from 'react-table'
import { getFormattedDate } from '../../utils/LogiHelper'

export const BREACH_PORTAL = {

    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),

      created_on: React.memo(({ value }: Cell) => {
        if (!value) {
          return <div></div>
        }
        return <TextOverflowEllipsis title={getFormattedDate(value)}>{getFormattedDate(value)}</TextOverflowEllipsis>
      }, (p, n) => { return p.value === n.value }),
}