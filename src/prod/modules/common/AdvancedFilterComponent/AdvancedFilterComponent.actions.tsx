import { IFilterData } from '../../common/AdvancedSearch/interface';
import { IFetchDataOptions } from 'ui-library'
import { IMongoField } from '../../../utils/mongo/interfaces';

// adv filter
export interface ISetFetchOptions {
  readonly type: '@@advanceFilter/SET_FETCH_OPTIONS',
  payload: IFetchDataOptions
}


export interface ISetAppliedAdvFilterData {
  readonly type: '@@advanceFilter/SET_APPLIED_ADV_FILTER_DATA',
  payload: any
}
export interface ISetAdvFilterData {
  readonly type: '@@advanceFilter/SET_ADV_FILTER_DATA',
  payload: any
}
export interface IUpdateFirstLoad {
  readonly type: '@@advanceFilter/UPDATE_FIRST_LOAD',
  payload: boolean
}
export interface ISetAdvFilterLoading {
  readonly type: '@@advanceFilter/SET_ADV_FILTER_LOADING'
  payload: boolean
}
export interface ISetCurrentFilter {
  readonly type: '@@advanceFilter/SET_CURRENT_FILTERS'
  payload: IFilterData | undefined
}

export interface ISetOpenAdvFilter {
  readonly type: '@@advanceFilter/SET_OPEN_ADV_FILTER'
  payload: boolean
}

export interface ISetFilterListPayload {
  readonly type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD'
  payload: any
}

export interface ISetEmptyData {
  readonly type: '@@advanceFilter/SET_EMPTY_DATA';
  payload: boolean
}
export interface ISetColumnsSelector {
    readonly type: '@@advanceFilter/SET_COLUMNS_SELECTOR';
    payload: {
        [key: string]: IMongoField
      }
}
export interface ISetSectionName {
    readonly type: '@@advanceFilter/SET_SECTIONNAME';
    payload: string
}

export type AdvancedFilterComponentActions =

  // adv filtert
  | ISetFetchOptions
  | ISetAppliedAdvFilterData
  | ISetAdvFilterData
  | IUpdateFirstLoad
  | ISetAdvFilterLoading
  | ISetCurrentFilter
  | ISetOpenAdvFilter
  | ISetFilterListPayload
  | ISetEmptyData
  | ISetColumnsSelector
  | ISetSectionName
