import { IMiddleMileOrderDetails, IPrintAwbTemplateResponse, tLoadingKeys } from './PrintAwb.models'

export interface IFetchTemplateOptions {
  readonly type: '@@MMO/PrintAwb/FETCH_TEMPLATE_OPTIONS'
}

interface ISetTemplateOptions {
  readonly type: '@@MMO/PrintAwb/SET_TEMPLATE_OPTIONS'
  payload: IPrintAwbTemplateResponse[]
}

export interface IFetchSelectedOrderDetails{
  readonly type: '@@MMO/PrintAwb/FETCH_SELECTED_ORDERS_DETAILS'
  payload: number[]
}

export interface ISetSelectedOrderDetails {
  readonly type: '@@MMO/PrintAwb/SET_SELECTED_ORDERS_DETAILS'
  payload: Partial<IMiddleMileOrderDetails>[]
}

export interface IResetData {
  readonly type: '@@MMO/PrintAwb/RESET_DATA'
}

interface ISetLoading {
  readonly type: '@@MMO/PrintAwb/SET_LOADING'
  payload: {
    key: tLoadingKeys
    value: boolean
  }
}

export type tMMOPrintAwbAction = 
| IFetchTemplateOptions
| ISetTemplateOptions
| IFetchSelectedOrderDetails
| ISetSelectedOrderDetails
| ISetLoading
| IResetData