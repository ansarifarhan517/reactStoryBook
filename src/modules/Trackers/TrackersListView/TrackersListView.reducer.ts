import { IMongoListViewStructure } from "../../../utils/mongo/interfaces"
import { TrackersListViewActions } from "./TrackersListView.actions"
import { ITrackerDataPayload } from "./TrackersListView.models"
import { IClientMetricSystem, IDropdown } from "../../../utils/common.interface";
import { metricsConversion } from "../../../utils/helper";

export interface ITrackersListViewState {
    structure: IMongoListViewStructure,
    loading: {
        listView: boolean
        columns:boolean
    },
    emptyData: boolean,
    data: ITrackerDataPayload,
    trackerTypeList: IDropdown[],
    supplierList: IDropdown[],
    ownershipList: IDropdown[],
    trackersList: IDropdown[],
    branchList: IDropdown[],
    uploadModal : boolean,
    viewMode: string,
    googleApiKey: string,
    clientMetric: IClientMetricSystem[],
}

const initialState: ITrackersListViewState = {
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
    emptyData: false,
    trackerTypeList: [],
    supplierList: [],
    ownershipList: [],
    trackersList: [],
    branchList: [],
    uploadModal : false,
    viewMode: 'listview',
    googleApiKey: '',
    clientMetric: []
}

const TrackersListViewReducer = (state = initialState, action: TrackersListViewActions): ITrackersListViewState => {
    switch (action.type) {
        case '@@trackersListView/FETCH_TRACKER_LISTVIEW_STRUCTURE' :
            case '@@trackersListView/FETCH_TRACKERS_LIST':
            return {
                    ...state,
                    loading: {
                        ...state.loading,
                        columns: true
                    }
                }
        case '@@trackersListView/FETCH_TRACKER_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                 structure: { columns: action?.payload?.columns, buttons: action?.payload?.buttons }, loading: {...state.loading, columns: false}
            }
        case '@@trackersListView/FETCH_TRACKERS_LIST_SUCCESS':
            const results = action.payload.results.map((tracker) => {
                // convert to Client METRIC SYSTEM
                let trackerObj = {}
                if (tracker.speed) {
                  const clientObj = state?.clientMetric && state?.clientMetric?.find(c => c.name === 'speed')
                  const val = metricsConversion(tracker.speed, 'GET', clientObj?.conversionFactor)
                  trackerObj['speed'] = val.toFixed(2)
                }
                return {
                  ...tracker,
                  ...trackerObj,
                }
              })
            return {
                ...state,
                    data: {...action.payload,results: results},
                    loading: {
                        ...state.loading,
                        columns: false
                    }
            }
        case '@@trackersListView/SET_TRACKER_TYPE':
            return {
                ...state,
                trackerTypeList: action.payload
            }
        case '@@trackersListView/SET_TRACKERS_CONFIG_LIST':
            return{
                ...state,
                trackersList : action.payload
            }
        case '@@trackersListView/SET_BRANCH_LIST':
            return{
                ...state,
                branchList : action.payload
            }
        case '@@trackerListView/SET_UPLOAD_MODAL':
            return{
                ...state,
                uploadModal: action.payload
            }
        case '@@trackersListView/RESET_TRACKER_DROPDOWN_DATA' :
            return{
                ...state,
                trackerTypeList: [],
                trackersList: [],
                branchList: []
            }
        case '@@trackersListView/SET_VIEW_MODE':
            return {
                ...state,
                viewMode: action.payload
            }
        case '@@trackersListView/GOOGLE_API_KEY':
            return {
                ...state,
                googleApiKey: action.payload
            };
        case '@@trackersListView/SET_CLIENT_METRIC_SYSTEM': {
            return {
                ...state,
                clientMetric: action.payload
                }
            }
        default:
            return state
    }
}
export default TrackersListViewReducer;