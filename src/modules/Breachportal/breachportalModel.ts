import { IFetchDataOptions } from "ui-library"
export interface IBreachFetchDataOptions extends IFetchDataOptions {
    dataFetchMode?: string
    endDateFilter?: string
    startDateFilter?: string
    status?: string,
    mode?: string
  }

  export interface IListViewColumn {
    [key: string]: any
  }
