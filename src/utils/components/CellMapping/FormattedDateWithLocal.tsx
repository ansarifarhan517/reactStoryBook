import React from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../TextOverflowEllipsis'
import { getFormattedDateWithLocal } from '../../helper'
import useClientProperties from '../../../modules/common/ClientProperties/useClientProperties'



export default React.memo(({ value }: Cell<any>) => {
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    if (!value) {
        return <div></div>
    }
    const format = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() : 'DD/MM/YYYY'
    return <TextOverflowEllipsis title={getFormattedDateWithLocal(value, format)}>
        {getFormattedDateWithLocal(value, format)}
    </TextOverflowEllipsis>
}, (p, n) => p.value === n.value)
