import React from "react"
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis'
import { getFormattedDate } from "../../../../../utils/helper"
import useClientProperties from "../../../../common/ClientProperties/useClientProperties"

export const OAUTH_PROFILE_LIST_CELL_MAPPING = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    createdOn: React.memo(({ row }: Cell<any>) => {
      const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
      const dateFormat = `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`;
        return <TextOverflowEllipsis title={getFormattedDate(row.original['createdOnDt'] , dateFormat)}>{getFormattedDate(row.original['createdOnDt'] , dateFormat) }</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),

      modifiedOn: React.memo(({ value,row }: Cell<any>) => {
        const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
      const dateFormat = `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`;
        return <TextOverflowEllipsis title={getFormattedDate(row.original['updatedOnDt'] , dateFormat)}>{getFormattedDate(row.original['updatedOnDt'] , dateFormat) }</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),

      authenticationType : React.memo(({ value,row }: Cell<any>) => {

        return <TextOverflowEllipsis title={row.original['authenticationType']}>{row.original['authenticationType']}</TextOverflowEllipsis>
      }, (p, n) => p.value === n.value),
}   