import React from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis'


export const HIRE_DM_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),
  
     
  
};

