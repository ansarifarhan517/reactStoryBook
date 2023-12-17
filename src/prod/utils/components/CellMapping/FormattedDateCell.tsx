import React from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../TextOverflowEllipsis'
import { getFormattedDate } from '../../helper'
import { Button, } from 'ui-library'
//import { theme } from '../../theme'
import useClientProperties from '../../../modules/common/ClientProperties/useClientProperties'
import { getDefaultTheme } from 'ui-library';


export default React.memo(({ value, column, row }: Cell<any>) => {
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const theme = getDefaultTheme()
    if (!value) {
        return <div></div>
    }
    return <TextOverflowEllipsis title={getFormattedDate(value,clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}>
        <Button variant='link' style={{color: theme?.colors?.primary?.main || '#5698d3'}} primary onClick={() => column?.['cellCallback'](row.original)}>
            {getFormattedDate(value,clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}
        </Button>
    </TextOverflowEllipsis>
}, (p, n) => p.value === n.value)
