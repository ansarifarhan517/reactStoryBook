import { InSAMActions } from "./serviceAreaMaster.actions"

export interface ISAMState {
    pageParam?: {
        pageNumber?:number,
        pageSize?:number
    },
    listViewData?: any,
    updateDataObj : any,
    addedZoneObj : any[],
    deletedZones : any[]
};

export const initialState: ISAMState = {
    pageParam: {
        pageNumber:1,
        pageSize:50
    },
    listViewData : [],
    updateDataObj : [],
    addedZoneObj : [],
    deletedZones : []
};

const ISAMReducer = (state = initialState, action: InSAMActions): ISAMState => {

    switch (action.type) {
        case '@@SAM_ZONE/PAGE_PARAM_SET': {
            return {
                ...state,
                pageParam:{
                    pageNumber : action.payload.pageNumber,
                    pageSize : action.payload.pageSize
                }
            };
        }

        case '@@SAM_ZONE/PAGE_PARAM_GET': {
            return {
                ...state,
            };
        }

        case '@@SAM_ZONE/LIST_DATA_SET': {
            const results = action.payload.map((m)=>{
                return m
            })
            return {
                ...state,
                listViewData: results
            };
        }

        case '@@SAM_ZONE/UPDATE_DATA_OBJ': {
            state.updateDataObj = state.updateDataObj.filter((currentObj) => {
               return currentObj.zoneId !== action.payload.zoneId
            })
            return {
                ...state,
                updateDataObj: [...state.updateDataObj, action.payload]
            }    
        }

        case '@@SAM_ZONE/ADD_DATA_OBJ' : {
            return {
                ...state,
                addedZoneObj: [...state.addedZoneObj, action.payload]
            }  
        }

        case '@@SAM_ZONE/DELETE_DATA_OBJ' : {
            state.addedZoneObj = state.addedZoneObj.filter((delZone)=>{
                return delZone.zoneName != action.payload
            })
            return {
                ...state,
                addedZoneObj: [...state.addedZoneObj]
            }  
        }

        case '@@SAM_ZONE/DELETED_ZONES' : {
            return {
                ...state, deletedZones : action.payload
            }
        }

        case '@@SAM_ZONE/PAGE_PARAM_RESET':{
            return initialState
        }

        default:
        return state;
    }
}

export default ISAMReducer;