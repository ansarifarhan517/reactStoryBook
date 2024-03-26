import { IEditDetails } from './../../../utils/mongo/interfaces';
import { WebHookListViewActions } from './WebHookListView.actions';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IRowData, IModuleTypes, IEventTypesHashMap, IPaginationFl } from './WebHookListView.models';
import { PrepareEventArray, PrepareHashObject } from './Utils/index'

export interface IWebHookListViewState {
  structure: IMongoListViewStructure
  data: {
    totalCount : number,
    results: IRowData[]
  }
  editDetails: IEditDetails
  loading: {
    listView: boolean
  }
  modulesTypes: IModuleTypes[]
  eventTypes: IEventTypesHashMap
  currentModule: string
  status: []
  responseCode: []
  HashMapEventType: {}
  paginationFl: IPaginationFl
  HashMapStatus: {}
}

export const dummyColumns: any = {
  id: {label: "Form Name",permission: true},
  eventType: {label: "User Group", permission: true},
  eventDate: {label: "Trigger Events", permission: true},
  responseCode: {label: "Form Name",permission: true},
  responseData: {label: "User Group", permission: true},
  status: {label: "Trigger Events", permission: true},
  }
  
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({customFormGroupId: i + 1 }))

const initialState: IWebHookListViewState = {
  structure: {
    columns: dummyColumns,
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  editDetails: {},
  loading: {
    listView: false
  },
  modulesTypes: [],
  eventTypes: {},
  currentModule: 'ALL',
  status: [],
  responseCode: [],
  HashMapEventType: {},
  paginationFl: {moreResultExists: false, disableNext: false, dataType: undefined},
  HashMapStatus: {},

}

const WebHookListViewReducer = (state = initialState, action: WebHookListViewActions): IWebHookListViewState => {

  switch (action.type) {
    case '@@webhooklistview/FETCH_STRUCTURE_SUCCESS':
      return {
        ...state,
        structure: action.payload
      }

    case '@@webhooklistview/FETCH_DATA_SUCCESS':
      return {
        ...state,
        data: {
          results: action.payload.results,
          totalCount: action.payload.totalCount
        }
      }

    case '@@webhooklistview/UPDATE_DATA':
      const { customFormGroupId: updateCustomFormGroupId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row: any) => row.customFormGroupId === updateCustomFormGroupId ? { ...row['triggerEventsData'], ...rest } : row['triggerEventsData'])
        }
      }

    case '@@webhooklistview/SET_EDIT_DETAILS':
      const { rowId, columnId, value, hasError } = action.payload
      return {
        ...state,
        editDetails: {
          ...state.editDetails,
          [rowId]: {
            ...state.editDetails?.[rowId],
            [columnId]: {
              value,
              hasError
            }
          }
        }
      }

    case '@@webhooklistview/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@webhooklistview/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@webhooklistview/SET_MORE_RESULT_EXISTS':
        return{
          ...state,
          paginationFl: {moreResultExists: action.payload.moreResultExists, 
            disableNext: action.payload.disableNext,
          dataType: action.payload.dataType}
      }

    case '@@webhooklistview/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }

    case '@@webhooklistview/SET_MODULE_TYPES':
      let moduleTypeArray = action.payload?.map((m) => { return {
        label: m?.name,
        value: m?.clientRefMasterCd?.toLowerCase(),
        ...m
      }})
      
      return {
        ...state,
        modulesTypes: moduleTypeArray
      }

    case '@@webhooklistview/SET_EVENT_TYPES':
    
      let eventTypeArray = action.payload?.map((m) => { return {
        label: m.clientRefMasterDesc,
        value: `${m.clientRefMasterCd}_${m.clientRefMasterType}`,
        ...m
      }})
      const finalArray = PrepareEventArray(state.modulesTypes, eventTypeArray)
      const eventTypeshash = PrepareHashObject(eventTypeArray)
      return {
        ...state,
        eventTypes: finalArray,
        HashMapEventType: eventTypeshash
      }

     case '@@webhooklistview/SET_CURRENT_MODULE':
      return {
        ...state,
        currentModule: action.payload
      }

    case '@@webhooklistview/SET_RESPONSE_CODE':
      const responseData = action.payload?.map((obj) => {
        return {
          label: obj?.clientRefMasterDesc,
          value: obj?.clientRefMasterCd,
          title: obj?.clientRefMasterDesc,
          ...obj
        }
        
      })

      

      return {
        ...state,
        responseCode: responseData as any
      }

    case '@@webhooklistview/SET_STATUS':
      const statusData = action.payload?.map((obj) => {
        return {
          label: obj?.clientRefMasterDesc,
          value: obj?.clientRefMasterCd,
          title: obj?.clientRefMasterDesc,
          ...obj
        }
        
      })

      const statusArray:any = PrepareHashObject(statusData)

      return {
        ...state,
        status: statusData as any,
        HashMapStatus: statusArray as any
      }

    default:
      return state
  }
}

export default WebHookListViewReducer