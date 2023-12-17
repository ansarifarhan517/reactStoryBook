import React, { Fragment, useEffect, useState } from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../TextOverflowEllipsis'
import { StyledBoxSkill } from './StyledCellMapping'




export default React.memo(({ value }: Cell<any>) => {
    const [valueList, setValueList] = useState<any[]>([])
    useEffect(() => {
        if (value) {
            if(typeof value === 'string'){
                const list = value?.split(',')
                setValueList(list)
            }else{
                setValueList(value)
            }
        }
    }, [])
    const boxJsx = valueList?.map((option: string) => {
        return <StyledBoxSkill key={option}>{option}</StyledBoxSkill>
    })
    return (valueList ? <TextOverflowEllipsis style={{ display: 'flex' }} title={valueList ? valueList.join(',') : ''}>
        {boxJsx}
    </TextOverflowEllipsis> : <Fragment />)
}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original))



