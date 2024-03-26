import { IMongoListViewStructure, IMongoFormStructure, ICustomFieldsEntity } from '../../../utils/mongo/interfaces';
import { BranchConfigurationActions } from './BranchConfiguration.actions';
import { IBranchConfigurationListDataPayload, IListViewLoading, IOperationTimingsListDataPayload, IBranchManagerListDataPayload, IOperationTimingsStructure, IBranchManagerStructure, IShiftTimingStructure, ISkillSet, IBranchDropdownComponentProps, IBranchZones, IHolidayCalendar } from './BranchConfiguration.models';
import { IFetchDataOptions } from 'ui-library'
import { renderCustomFields } from '../../../utils/mongo/ListView';



export interface IBranchConfigurationState {
    structure: IMongoListViewStructure;
    operationTimingsStructure: IMongoListViewStructure;
    data: IBranchConfigurationListDataPayload;
    treedata: IBranchConfigurationListDataPayload;
    treedataBranchId: IBranchConfigurationListDataPayload;
    treeDataSubBranches: [];
    isEditClientBranch: IBranchConfigurationListDataPayload | undefined,
    operationTimings: IOperationTimingsListDataPayload[] | [];
    operationTimingsClone: IOperationTimingsListDataPayload[] | [];
    listview: IListViewLoading;
    branchManagerStructure: IMongoListViewStructure;
    branchManagers: IBranchManagerListDataPayload[] | [];
    googleApiKey: string;
    clientBranchDetails: any;
    branches : [];
    fetchOptions: IFetchDataOptions;
    selectedBranchId: number;
    hasChildBranches: boolean | undefined;
    clientList: [];
    form: {
        loading: boolean;
        structure: IMongoFormStructure;
        operationTimingsFormStructure: IMongoFormStructure;
        operationTimingsStructureList: IOperationTimingsStructure[];
        shiftTimingsStructure: IMongoFormStructure;
        shiftTimingsStructureList: IShiftTimingStructure[];
        branchManagerList: IBranchManagerStructure[];
        serviceZones:IMongoFormStructure,
        serviceZonesRateProfile:IMongoFormStructure,
        serviceType: any,
        rateProfileList:any,
        serviceZonesRateProfileListStructure:IMongoListViewStructure,
        branchZones:IBranchZones[], 
        branchZoneRateProfiles:any[],
        selectedZone:IBranchZones[],
        editSelectedZone:boolean  
    },
    resetForm: {
        loading: boolean;
        structure: IMongoFormStructure;
        operationTimingsFormStructure: IMongoFormStructure;
        operationTimingsStructureList: IOperationTimingsStructure[];
        shiftTimingsStructure: IMongoFormStructure;
        shiftTimingsStructureList: IShiftTimingStructure[];
        branchManagerList: IBranchManagerStructure[];
        serviceZones:IMongoFormStructure;
        serviceZonesRateProfile:IMongoFormStructure,
        serviceType: any,
        rateProfileList:any,
        serviceZonesRateProfileListStructure:IMongoListViewStructure,
        branchZones:IBranchZones[], 
        branchZoneRateProfiles:any[],
        selectedZone:IBranchZones[],
        editSelectedZone:boolean      
    },
    loading: boolean;
    isStructureLoading: boolean;
    branchTimezone: string;
    skillSetList: Array<ISkillSet>;
    localeData?: IBranchDropdownComponentProps[];
    previousViewType: string;
    isBranchLoaded: boolean;
    loadMultiplierData: any;
    loadMultiplierStructure: IMongoListViewStructure;
    lookup: {
        holidayCalendar: IHolidayCalendar[]
    }
}

const initialState: IBranchConfigurationState = {
    listview: {
        branchList: false,
        operationTimings: false,
        branchManagers: false,
        daysOfWeek:[]
    },
    structure: {
        columns: {},
        buttons: {},
      },
    operationTimingsStructure: {
        columns: {},
        buttons: {},    
    },  
    data: {
        totalCount: 0,
        results: [],
    },
    treedata: {
        totalCount: 0,
        results: [],
    },
    treedataBranchId: {
        totalCount: 0,
        results: []
    },
    treeDataSubBranches: [],
    branches: [],
    operationTimings: [],
    operationTimingsClone: [],
    branchManagerStructure: {
        columns: {},
        buttons: {},    
    },
    branchManagers: [],
    form: {
        loading: false,
        structure: {
            columns: {},
            buttons: {}, 
        },
        operationTimingsFormStructure: {
            columns: {},
            buttons: {}, 
        },
        shiftTimingsStructure: {
            columns: {},
            buttons: {}, 
        },
        operationTimingsStructureList: [],
        shiftTimingsStructureList: [],
        branchManagerList: [] ,
        serviceZones:{},
        serviceZonesRateProfile:{},
        serviceType: []  ,
        rateProfileList:[],
        serviceZonesRateProfileListStructure:{
            columns: {},
            buttons: {}, 
        },
        branchZones:[],
        branchZoneRateProfiles:[],
        selectedZone:[],
        editSelectedZone:false   
    },
    resetForm: {
        loading: false,
        structure: {
            columns: {},
            buttons: {},
        },
        operationTimingsFormStructure: {
            columns: {},
            buttons: {},
        },
        shiftTimingsStructure: {
            columns: {},
            buttons: {},
        },
        operationTimingsStructureList: [],
        shiftTimingsStructureList: [],
        branchManagerList: [],
        serviceZones:{},
        serviceZonesRateProfile:{},
        serviceType: [],
        rateProfileList:[],
        serviceZonesRateProfileListStructure:{
            columns: {},
            buttons: {}, 
        },
        branchZones:[],
        branchZoneRateProfiles:[] ,
        selectedZone:[],
        editSelectedZone:false 
    },
    googleApiKey: "",
    isEditClientBranch: undefined,
    clientBranchDetails: [],
    fetchOptions: {},
    selectedBranchId: 0,
    hasChildBranches: false,
    clientList: [],
    loading: false,
    isStructureLoading: false,
    branchTimezone: '',
    skillSetList: [],
    localeData: [],
    previousViewType: 'tree-view',
    isBranchLoaded: false,
    loadMultiplierData: [],
    loadMultiplierStructure:{
        columns: {},
        buttons: {},    
    },
    lookup: {
        holidayCalendar: []
    }
}

const BranchConfigurationReducer = (
    state = initialState,
    action: BranchConfigurationActions
  ): IBranchConfigurationState => {

    switch (action.type) {
        case '@@branchConfiguration/SET_API_LOADING':
            return {...state, loading: action.payload }
        case '@@branchConfiguration/SET_STRUCTURE_LOADING':
            return {...state, isStructureLoading: action.payload }
        case '@@branchConfiguration/FETCH_LISTVIEW_STRUCTURE':
        case '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_LIST':
            return {...state, listview: {...state.listview, branchList: true} }

        case '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LISTVIEW_STRUCTURE':
        case '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LIST':            
            return {...state, listview: {...state.listview, operationTimings: true} }    

        case '@@branchConfiguration/FETCH_BRANCH_MANAGER_LIST':
        case '@@branchConfiguration/FETCH_BRANCH_MANAGER_LISTVIEW_STRUCTURE':
            return {...state, listview: {...state.listview, branchManagers: true} }

        case '@@branchConfiguration/FETCH_LISTVIEW_STRUCTURE_SUCCESS':
            return {
              ...state,
              structure: action.payload,
              listview: {...state.listview, branchList: false}
            };

        case '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_LIST_SUCCESS':
            const results = action.payload.results.map((row) => {
                const rowObj = row
                if (row.customFieldsJSONString) {
                  const customFieldsEntity: ICustomFieldsEntity[] = JSON.parse(row.customFieldsJSONString)
                  customFieldsEntity.forEach((customField) => {
                    const { field } = customField
                    rowObj[field] = renderCustomFields(customField, state.structure.columns?.[field], action.payload.clientProperties || {})
                  })
                }
        
                return rowObj
              })
            return {
                ...state,
                data: {...action.payload, results},
                listview: {...state.listview, branchList: false}
            };
        
        case '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                operationTimingsStructure: action.payload,
                listview: {...state.listview, operationTimings: false }
            }

        case '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LIST_SUCCESS':
            return {
                ...state,
                operationTimings: action.payload,
                listview: {...state.listview, operationTimings: false }
            }
        case '@@branchConfiguration/SET_OPERATION_TIMINGS_CLONE':
            return {
                ...state,
                operationTimingsClone: action.payload,
                listview: {...state.listview, operationTimings: false }
            }

        case '@@branchConfiguration/FETCH_BRANCH_MANAGER_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                branchManagerStructure: action.payload,
                listview: {...state.listview, branchManagers: false }
            }

        case '@@branchConfiguration/FETCH_BRANCH_MANAGER_LIST_SUCCESS':
            return {
                ...state,
                branchManagers: action.payload,
                listview: {...state.listview, branchManagers: false }
            }

        case '@@branchConfiguration/SET_BRANCH_FORM_LOADING':
            return {
                ...state,
                form: {...state.form, loading: action.payload }
            }
        case '@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE_SUCCESS':

            const struct = {...action.payload}
            if(struct?.['ETA details']?.pickUpTime && struct?.['ETA details']?.preparationTime && !struct['ETA details'].pickUpTime.label.includes('(Min)') &&  !struct['ETA details'].preparationTime.label.includes('(Min)')) {
                struct['ETA details'].pickUpTime.label = struct['ETA details'].pickUpTime.label + '(Min)'
                struct['ETA details'].preparationTime.label = struct['ETA details'].preparationTime.label + '(Min)'
            }
            return {
                ...state,
                form: {...state.form, structure: struct}
            }

        case '@@branchConfiguration/SET_BRANCH_FORM_RESET_STRUCTURE':
            return {
                ...state,
                resetForm: { ...state.form, structure: action.payload }
            }

        case '@@branchConfiguration/FETCH_OPERATION_TIMINGS_STRUCTURE_SUCCESS':
            return {
                ...state,
                form: {...state.form, operationTimingsFormStructure: action.payload}
            }
        case '@@branchConfiguration/SET_OPERATION_TIMINGS_STRUCTURE':
            return {
                ...state,
                form: {...state.form, operationTimingsStructureList: action.payload}
            }

        case '@@branchConfiguration/FETCH_SHIFT_TIMINGS_STRUCTURE_SUCCESS':
            return {
                ...state,
                form: {...state.form, shiftTimingsStructure: action.payload}
            }

        case '@@branchConfiguration/SET_SHIFT_TIMINGS_STRUCTURE':
            return {
                ...state,
                form: {...state.form, shiftTimingsStructureList: action.payload}
            }

        case '@@branchConfiguration/SET_BRANCH_MANAGER_STRUCTURE':
            return {
                ...state,
                form: {...state.form, branchManagerList: action.payload}
            }

        case '@@branchConfiguration/GOOGLE_API_KEY_SUCCESS':
            return {
                ...state,
                googleApiKey: action.payload
            }
        case '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST':
            return {...state, listview: {...state.listview, branchList: true} }

        case '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST_SUCCESS':
            return {
                ...state,
                treedata: action.payload,
                listview: {...state.listview, branchList: false}
            };
        
        case '@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA':
            return {...state, listview: {...state.listview, branchList: true}, treedata:{...state.treedata},treedataBranchId: {...state.treedataBranchId} }

        case '@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA_SUCCESS':
            return {
                ...state,
                listview: {...state.listview, branchList: false},
                treedata:{...state.treedata} ,
                treedataBranchId: {...state.treedataBranchId},
                clientBranchDetails: {...action.payload}
            };
        case '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA':
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }
        case '@@branchConfiguration/SET_FETCH_OPTIONS':
            return {
                ...state,
                fetchOptions: action.payload
            }
        case '@@branchConfiguration/SET_TREE_DATA':
            return {
                ...state,
                treedata: {...state.treedata,results: action.payload }
            }
        case '@@branchConfiguration/SET_SELECTED_BRANCH_ID':
            return {
                ...state,
                selectedBranchId: action.payload
            }
        case '@@branchConfiguration/SET_CHILD_BRANCHES_TOGGLE':
            return {
                ...state,
                hasChildBranches: action.payload
            }
        case '@@branchConfiguration/FETCH_CLIENT_LIST_SUCCESS':
            return {
                ...state,
                clientList: action.payload
            }

        case '@@branchConfiguration/RESET_BRANCH_DATA':
            return {
                ...state,
                listview: {...state.listview, branchList: false},
                treedata:{...state.treedata} ,
                treedataBranchId: {...state.treedataBranchId},
                clientBranchDetails: {}
            };

        case '@@branchConfiguration/SET_BRANCH_TIMEZONE':
            return {
                ...state,
                branchTimezone: action.payload
            }

        case '@@branchConfiguration/SET_DELIVERY_TYPE':
            return {
                ...state,
                skillSetList: action.payload
            }
        case '@@branchConfiguration/SET_LOCALE':
            return {
                ...state,
                localeData: action.payload
            }
        case '@@branchConfiguration/SET_PREVIOUS_VIEW_TYPE':
            return {
                ...state,
                previousViewType: action.payload
            }
    
        case '@@branchConfiguration/SET_BRANCH_DATA_LOADED': 
            return {
                ...state,
                isBranchLoaded: action.payload
            }   
    
        case '@@branchConfiguration/SET_ZONE_STRUCTURE': 
        return {
            ...state,
            form: {...state.form, serviceZones: action.payload} 
        }   

        case '@@branchConfiguration/SET_ZONE_PROFILE_STRUCTURE': 
        return {
            ...state,
            form: {...state.form,  serviceZonesRateProfile: action.payload} 
        }   
 

        case '@@branchConfiguration/SET_SERVICE_TYPE': 
        return {
            ...state,
            form: {...state.form, serviceType: action.payload} 
        } 

        case '@@branchConfiguration/SET_ACTIVE_RATE_PROFILES': 
        return {
            ...state,
            form: {...state.form, rateProfileList: action.payload} 
        } 

        case '@@branchConfiguration/SET_ZONES_LISTVIEW_STRUCTURE':
            return {
                ...state,
                form: {...state.form, serviceZonesRateProfileListStructure: action.payload }
            }
        
        case "@@branchConfiguration/SET_RETRIEVED_ZONES" :
            const refinedBranchZone= action.payload.map((zone:IBranchZones)=>{
                return {...zone, polygonCoordinates: zone?.lstZoneGeofence?.[0]?.polygonCoordinates }
            })
            return {
                ...state,
                form:{...state.form, branchZones:refinedBranchZone}
            }  
        case '@@branchConfiguration/SET_CREATED_ZONES':
            if(state.form.editSelectedZone){
                const findEditedIndex= (zone:IBranchZones)=> zone.zoneName == Object.values(state.form.selectedZone?.[0])?.[0]?.zoneName
                const updateIndex = state.form.branchZones.findIndex(findEditedIndex)
                const updatedZones= state.form.branchZones;
                updatedZones[updateIndex]=action.payload;
                return {
                    ...state,
                    form:{...state.form, branchZones:updatedZones}
                }
            }
            else{
                return {
                    ...state,
                    form:{...state.form, branchZones:[...state.form.branchZones, action.payload]}
                }
            }
            

        case '@@branchConfiguration/SET_BRANCH_ZONE_RATE_PROFILES':
            return {
                ...state,
                form:{...state.form, branchZoneRateProfiles:action.payload}
            }
        case '@@branchConfiguration/SET_SELECTED_ZONE':
                return {
                    ...state,
                    form:{...state.form, selectedZone:[action.payload]}
                }

        case '@@branchConfiguration/SET_IS_ZONE_EDITABLE':
                return {
                    ...state,
                    form:{...state.form, editSelectedZone:action.payload}
                }

        case '@@branchConfiguration/DELETE_SELECTED_ZONE':
                let tobeDeleted= Object.keys(action.payload[0])
                let branchZ= state.form.branchZones
                let filteredZones= branchZ.filter(zone=> !tobeDeleted.includes(zone?.zoneName || ''))

                console.log(action.payload);
                return {
                    ...state,
                    form:{...state.form, branchZones:filteredZones, selectedZone:[]}
                }

        case '@@branchConfiguration/RESET_ZONE_DETAILS':
                return {
                    ...state,
                    form:{...state.form, branchZones:[], rateProfileList:[], branchZoneRateProfiles:[] ,selectedZone:[], editSelectedZone:false }
                }

        case '@@branchConfiguration/GET_LOADMULTIPLIER_DATA':
            return {
                ...state,
                loadMultiplierData: action.payload
            }

        case '@@branchConfiguration/GET_LOADMULTIPLIER_STRUCTURE':
            return {
                ...state,
                loadMultiplierStructure: action.payload
            }

        case '@@branchConfiguration/FETCH_DAYSOFWEEK_OPTIONS':
            const payload = action?.payload?.map((obj:any) => {
                return {
                    id: obj?.clientRefMasterCd,
                    name: obj?.clientRefMasterCd,
                    label: obj?.clientRefMasterCd,
                    value: obj?.clientRefMasterCd
                }
            })
            return {...state, listview: {...state.listview, daysOfWeek: payload} }

        case '@@branchConfiguration/FETCH_HOLIDAY_CALENDAR_LIST_SUCCESS':
            return {
                ...state,
                lookup: {
                    ...state.lookup,
                    holidayCalendar: action.payload
                }
            }


        default:
            return state;
    }

   }

   export default BranchConfigurationReducer;