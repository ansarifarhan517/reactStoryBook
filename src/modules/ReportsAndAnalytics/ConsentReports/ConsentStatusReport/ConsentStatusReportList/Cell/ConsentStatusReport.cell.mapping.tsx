import React from 'react';
import {Cell} from 'react-table'
import TextOverflowEllipsis from '../../../../../../utils/components/TextOverflowEllipsis';
import FormattedDateDefault from '../../../../../../utils/components/CellMapping/FormattedDateDefault';

export const CONSENT_STATUS_REPORT ={
    default: React.memo(
        ({value}:Cell<any>) =>{
            return<TextOverflowEllipsis title= {value}>{value}</TextOverflowEllipsis>
        },
        (p,n)=>p.value === n.value
    ),
    consentExpiryDateForDA :FormattedDateDefault,
    publishedOnDt :FormattedDateDefault,
    activationDate : FormattedDateDefault,
    responseDt :FormattedDateDefault,

}