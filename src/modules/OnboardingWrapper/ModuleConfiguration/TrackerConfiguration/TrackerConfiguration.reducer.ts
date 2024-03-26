import { IMongoListViewStructure, IMongoFormStructure } from "../../../../utils/mongo/interfaces"
import { TrackerConfigurationActions } from "./TrackerConfiguration.actions"
import { ITrackerConfigDataPayload ,IRowData } from "./TrackerConfiguration.models"

export interface ITrackerConfigurationState {
    viewType: string,
    form: {
        structure: IMongoFormStructure
        loading: boolean,
        isEditable: boolean,
        trackerData : IRowData
    },
    listview: {
        structure: IMongoListViewStructure,
        loading: {
            listView: boolean
            columns:boolean
        },
        emptyData: boolean,
        data: ITrackerConfigDataPayload,
    },
    trackerTypeList: any[],
    supplierList: any[],
    ownershipList: any[]
}

const initialState: ITrackerConfigurationState = {
    viewType: 'allTrackers',
    form: {
        structure: {},
        loading: false,
        isEditable: false,
        trackerData:{
            trackerModel: '' ,
            trackerTypeRefId:undefined ,
            supplierRefId:undefined,
            ownership :''
        }
    },
    listview: {
        structure: {
            columns: {},
            buttons: {},
        },
        data: {
            totalCount: 0,
            results: []
        },
        loading: {
            listView: false,
            columns:false
        },
        emptyData: false
    },
    trackerTypeList: [],
    supplierList: [],
    ownershipList: []
}

const TrackerConfigurationReducer = (state = initialState, action: TrackerConfigurationActions): ITrackerConfigurationState => {
    switch (action.type) {
        case '@@trackerConfiguration/SET_VIEW_TYPE':
            return {
                ...state,
                viewType: action.payload
            }
        case '@@trackerConfiguration/FETCH_TRACKER_CONFIG_LISTVIEW_STRUCTURE' :
            case '@@trackerConfiguration/FETCH_TRACKERS_CONFIG_LIST':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    loading: {
                        ...state.listview.loading,
                        columns: true
                    }
                }
            }
        case '@@trackerConfiguration/FETCH_TRACKER_CONFIG_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                listview: {...state.listview, structure: { columns: action?.payload?.columns, buttons: action?.payload?.buttons }, loading: {...state.listview.loading, columns: true}}
            }
        case '@@trackerConfiguration/FETCH_TRACKERS_CONFIG_LIST_SUCCESS':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    data: {...action.payload,results: action.payload.results},
                    loading: {
                        ...state.listview.loading,
                        columns: false
                    }
                }
            }
        case '@@trackerConfiguration/SET_TRACKER_TYPE':
            return {
                ...state,
                trackerTypeList: action.payload
            }
        case '@@trackerConfiguration/SET_SUPPLIER_LIST':
            return {
                ...state,
                supplierList: action.payload
            }
        case '@@trackerConfiguration/SET_OWNERSHIP_LIST':
            return {
                ...state,
                ownershipList: action.payload
            }
        case '@@trackerConfiguration/FETCH_FORM_STRUCTURE':
        case '@@trackerConfiguration/FETCH_TRACKER_BY_ID':
            return{
                ...state,
                form :{
                    ...state.form,
                    loading:true
                }
            }
        case '@@trackerConfiguration/FETCH_FORM_STRUCTURE_SUCCESS':
            return{
                ...state,
                form:{
                    ...state.form,
                    structure: action.payload,
                    loading: false
                }
            }
        case "@@trackerConfiguration/SET_FORM_EDITABLE":
                return {
                    ...state,
                    form: {
                        ...state.form,
                        isEditable: action.payload
                    }
                }

        case '@@trackerConfiguration/RESET_TRACKER_DATA' :
            return{
                ...state,
                form:{
                    ...state.form,
                    trackerData:{
                        trackerModel: '' ,
                        trackerTypeRefId:undefined  ,
                        supplierRefId:undefined ,
                        ownership :''
                    }
                }
            }
        case '@@trackerConfiguration/RESET_TRACKER_DROPDOWN_DATA' :
            return{
                ...state,
                trackerTypeList: [],
                supplierList: [],
                ownershipList: []
            }
        case '@@trackerConfiguration/FETCH_TRACKER_BY_ID_SUCCESS':
                return {
                    ...state,
                    form: {
                        ...state.form,
                        isEditable: true,
                        trackerData :action.payload
                    }
                }

        case '@@trackerConfiguration/RESET_STATE':
                    return {
                        ...initialState
                    }

        default:
            return state
    }
}
export default TrackerConfigurationReducer;