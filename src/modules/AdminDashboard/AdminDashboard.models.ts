import { IFetchDataOptions } from "ui-library"
export interface IOrderFetchDataOptions extends IFetchDataOptions {
    dataFetchMode?: string
    endDateFilter?: string
    startDateFilter?: string
    status?: string,
    removeFilterForControlTower?:boolean
  }

  export interface IListViewColumn {
    [key: string]: any
  }

  export interface ITabData{
    activeClientCount?: number | string,
    noUsageClientCount?: number | string,
    pendingActivationCount?: number | string,
    clientsids: []
  }
  
  export interface IRegion {
    region?: string
  }