import React from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../TextOverflowEllipsis'



export default React.memo(({ value }: Cell<any>) => {
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
}, (p, n) => p.value === n.value)

