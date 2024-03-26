import React from "react"
import { ComponentType } from "react";
import { Cell } from 'react-table'
import { Tooltip } from 'ui-library'
import TextOverflowEllipsis from "../../../../utils/components/TextOverflowEllipsis";
import { getFormattedDate } from "../../ExceptionHandling/utils";


export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}
//Impact need to check

export const ALL_PDPA_LISTVIEW_CELL_MAPPING: ICellMapping = {
    default: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    createdOnDt: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={getFormattedDate(value,JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone'])}>{getFormattedDate(value,JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone'])}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    publishedOnDt: React.memo(({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value ? getFormattedDate(value, JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : ""}>{value ? getFormattedDate(value, JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : ""}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    updatedOnDt: React.memo(({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value ? getFormattedDate(value, JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : ""}>{value ? getFormattedDate(value, JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : ""}</TextOverflowEllipsis>
    }, (p, n) => p.value === n.value),

    isPublishedFl: React.memo(({ row }: Cell<any>) => {
      return (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", fontSize: "10px", fontWeight:400, lineHeight:"12px", color: row.original.isPublished && !row.original.isActiveFl ? "#333333" : "#FFFFFF", border: row.original.isPublished && !row.original.isActiveFl ? "1px solid #CCCCCC" : "", borderRadius: "4px", height: "16px", padding: "2px 8px", backgroundColor: row.original.isPublished ? row.original.isActiveFl ? "#72B330" : "#FFFFFF" : "#E0A326" }}> <TextOverflowEllipsis title={row.original.isPublished}>{row?.original?.isPublished ? "Published" : "Draft"}</TextOverflowEllipsis></div> 
      )
      }, (p, n) => p.value === n.value),

    consentType: React.memo(({ value }: Cell<any>) => {
        return (
            <Tooltip message={value} hover tooltipDirection='bottom' arrowPlacement='center'>
            {
              <div>{value}</div>
            }
           </Tooltip>
          )
      }, (p, n) => p.value === n.value),

}

