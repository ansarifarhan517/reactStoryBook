import { IFilterData, IFilters } from '../../common/AdvancedSearch/interface';
import { IFetchDataOptions } from 'ui-library'
import {AdvancedFilterComponentActions} from './AdvancedFilterComponent.actions'
import { IMongoField } from '../../../utils/mongo/interfaces';


export interface IAdvanceFilterState {
  // adv filter
  emptyData: boolean
  fetchOptions: IFetchDataOptions
  appliedAdvancedFilterData: IFilters[]
  advancedFilterData: IFilterData[]
  filterListPayload: any
  currentFilter: IFilterData | undefined
  advancedFilterDropdown: any
  advancedFilterOperations: any
  openAdvFilter: boolean
  firstLoad: boolean
  advFilterLoader: boolean
  sectionName : string
  columnsSelector : {
    [key: string]: IMongoField
  }
}

const initialState: IAdvanceFilterState = {
  // adv filter
  fetchOptions: {},
  appliedAdvancedFilterData: [],
  advancedFilterData: [],
  filterListPayload: undefined,
  currentFilter: undefined,
  advancedFilterDropdown: undefined,
  advancedFilterOperations: undefined,
  openAdvFilter: false,
  firstLoad: false,
  advFilterLoader: false,
  emptyData: false,
  columnsSelector : {},
  sectionName : ""
}

const AdvancedFilterComponentReducer = (state = initialState, action: AdvancedFilterComponentActions): IAdvanceFilterState => {
  switch (action.type) {
    // adv filter
    case '@@advanceFilter/SET_FETCH_OPTIONS':
      return {
        ...state,
        fetchOptions: action.payload
      }

    case '@@advanceFilter/SET_APPLIED_ADV_FILTER_DATA':
      return {
        ...state,
        appliedAdvancedFilterData: action.payload
      }
    case '@@advanceFilter/SET_ADV_FILTER_DATA':
      return {
        ...state,
        advancedFilterData: action.payload
      }
    case '@@advanceFilter/UPDATE_FIRST_LOAD':
      return {
        ...state,
        firstLoad: action.payload
      }
    case '@@advanceFilter/SET_ADV_FILTER_LOADING':
      return {
        ...state,
        advFilterLoader: action.payload
      }
    case '@@advanceFilter/SET_CURRENT_FILTERS':
      return {
        ...state,
        currentFilter: action.payload
      }
    case '@@advanceFilter/SET_FILTERLIST_PAYLOAD':
      return {
        ...state,
        filterListPayload: action.payload
      }
    case '@@advanceFilter/SET_OPEN_ADV_FILTER':
      return {
        ...state,
        openAdvFilter: action.payload
      }
    case '@@advanceFilter/SET_COLUMNS_SELECTOR':
      if (action.payload && action.payload.deliveryMediumMasterTypeCd && action.payload.deliveryMediumMasterTypeCd.fieldType) {
        action.payload.deliveryMediumMasterTypeCd.fieldType = "skillsetfield";
      }
    return {
        ...state,
        columnsSelector: action.payload
    }
    case '@@advanceFilter/SET_SECTIONNAME':
    return {
        ...state,
        sectionName: action.payload
    }
    case '@@advanceFilter/SET_EMPTY_DATA': {
      return {
        ...state,
        emptyData: action.payload
      }
    }


    default:
      return state
  }
}



export default AdvancedFilterComponentReducer