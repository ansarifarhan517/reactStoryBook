import React from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis'
import store from '../../../../utils/redux/store'


export default React.memo(({ value }: Cell<any>) => {
    const statusMapping= store.getState().shipper.listView.statusMapping
    const labels=store.getState().dynamicLabels
    const newValue= value ? labels?.[statusMapping[value]] : ''
    return <TextOverflowEllipsis title={newValue}>{newValue}</TextOverflowEllipsis>
}, (p, n) => p.value === n.value)

