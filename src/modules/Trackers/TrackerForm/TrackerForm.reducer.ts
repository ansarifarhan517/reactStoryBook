import { ITrackerFormActions } from "./TrackerForm.actions";
import { ITrackerFormReducerState } from "./TrackerForm.models";


 const intialState: ITrackerFormReducerState = {
    structure: {},
    loading: false,
    isFormEditable: false,
    isDirty: false,
    trackerId: '',
    trackerConfigList: [],
    trackerData:{
        trackerDescription: '',
        barcode:'' ,
        clientBranchId:{},
        imei:'',
        isActiveFl: 'Y',
        supplierRefId:{},
        trackeeId:'',
        trackerConfigId:{},
        trackerTypeRefId:{},
        clientBranchName:''
        
    },
    supplierList:[],
    trackersList :[]
}

export const TrackerFormReducer = (state = intialState,
    action: ITrackerFormActions
) => {
    switch(action.type){
        case'@@trackerForm/FETCH_FORM_STRUCTURE':
        case '@@trackerForm/FETCH_DEVICE_BY_ID':
            return{
                ...state,
                loading: true
            }
        case  '@@trackerForm/FETCH_FORM_STRUCTURE_SUCCESS':
        return {
            ...state,
            structure: action.payload,
            loading: false
        }
        case '@@trackerForm/SET_FORM_EDITABLE':
        return{
            ...state,
            isFormEditable : action.payload
        }
        
        case '@@trackerForm/RESET_TRACKER_DATA':
        return{
            ...state,
            trackerData:{
                trackerDescription: '',
                barcode:'' ,
                clientBranchId:{},
                imei:'',
                isActiveFl: 'Y',
                supplierRefId:{},
                trackeeId:'',
                trackerConfigId:{},
                trackerTypeRefId:{},
                clientBranchName:''
        }
        }
        case '@@trackerForm/FETCH_DEVICE_BY_ID_SUCCESS':
            return{
                ...state,
                isFormEditable: true,
                trackerData:action.payload,
                loading: false
            }
        case '@@trackerForm/SET_SUPPLIER_LIST':
                return {
                    ...state,
                    supplierList: action.payload
                }
        case '@@trackerForm/SET_TRACKERS_LIST':
            return{
                ...state,
                trackersList: action.payload
            }
        default:
            return state
    

}
}
export default TrackerFormReducer;