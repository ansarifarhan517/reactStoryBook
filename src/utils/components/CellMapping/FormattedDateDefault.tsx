import React from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../TextOverflowEllipsis'
import { getFormattedDate } from '../../helper'
import useClientProperties from '../../../modules/common/ClientProperties/useClientProperties'



export default React.memo(({ value}: Cell<any>) => {
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    if (!value) {
        return <div></div>
    }
    return <TextOverflowEllipsis title={getFormattedDate(value,clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}>
            {getFormattedDate(value,clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}
    </TextOverflowEllipsis>
}, (p, n) => p.value === n.value)
