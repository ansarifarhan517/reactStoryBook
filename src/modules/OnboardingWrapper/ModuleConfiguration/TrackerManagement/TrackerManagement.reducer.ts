import { IMongoListViewStructure } from "../../../../utils/mongo/interfaces"
import { TrackerManagementActions } from "./TrackerManagement.actions"
import { IDropdown } from "../../../../utils/common.interface";

export interface ITrackerManagementState {
    form: {
        trackerTypeStructure: IMongoListViewStructure
        supplierStructure: IMongoListViewStructure
        trackerTypeData: IDropdown[]
        supplierData: IDropdown[]
        loading: boolean
    }
}

const initialState: ITrackerManagementState = {
    form: {
        trackerTypeStructure: {
            columns: {},
            buttons: {}
        },
        supplierStructure: {
            columns: {},
            buttons: {}
        },
        trackerTypeData: [],
        supplierData: [],
        loading: false
    }
}

const TrackerManagementReducer = (state = initialState, action: TrackerManagementActions): ITrackerManagementState => {
    switch (action.type) {
        case '@@trackerManagement/FETCH_TRACKER_TYPE_LISTVIEW_STRUCTURE' :
            case '@@trackerManagement/FETCH_SUPPLIER_LISTVIEW_STRUCTURE' :
            return {
                ...state,
                form: {
                    ...state.form,
                    loading: true
                }
            }
        case '@@trackerManagement/FETCH_TRACKER_TYPE_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                form: {...state.form, trackerTypeStructure: { columns: action?.payload?.columns, buttons: action?.payload?.buttons }, loading: false}
            }
        case '@@trackerManagement/FETCH_SUPPLIER_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                form: {...state.form, supplierStructure: { columns: action?.payload?.columns, buttons: action?.payload?.buttons }, loading: false}
            }
        case '@@trackerManagement/SET_TRACKER_TYPE':
            return {
                ...state,
                form: { ...state.form, trackerTypeData: action.payload}
            }
        case '@@trackerManagement/SET_SUPPLIER_LIST':
            return {
                ...state,
                form: { ...state.form, supplierData: action.payload}
            }
        default:
            return state
    }
}
export default TrackerManagementReducer;