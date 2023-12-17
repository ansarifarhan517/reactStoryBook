import React from 'react'
import { Cell } from 'react-table'
import NumberCount from '../NumberCount';

export default React.memo(({ value, column, row }: Cell<any>) => {
    return <NumberCount onClick={() => value > 0 && column?.['cellCallback'](row.original)} value={value} />
}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original))

