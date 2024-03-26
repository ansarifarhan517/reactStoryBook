import { IMongoListViewStructure, IMongoFormStructure } from "../../../../utils/mongo/interfaces"
import { ServiceTypeConfigurationActions } from "./ServiceTypeConfiguration.actions"
import { IRowData, IDropdown, IAllServiceTypesDataPayload, IAutoAllocateValues, IBranchMovementValues } from "./ServiceTypeConfiguration.models"
export interface IServiceTypeConfigurationState {
    viewType: string,
    form: {
        structure: IMongoFormStructure
        loading: boolean,
        serviceTypeData: IRowData,
        isEditable: boolean
    },
    listview: {
        structure: IMongoListViewStructure,
        data: IAllServiceTypesDataPayload,
        loading: {
            listView: boolean;
            columns:boolean;
        }
    },
    serviceDays: IDropdown[];
    deliveryTypes: IDropdown[];
    branches: IDropdown[];
    autoAllocateLabels: IAutoAllocateValues;
    branchMovementLabels: IBranchMovementValues;
}

const initialState: IServiceTypeConfigurationState = {
    viewType: 'allServiceTypes',
    form: {
        structure: {},
        loading: false,
        isEditable: false,
        serviceTypeData: {
            branchId: [],
            considerHolidays: '',
            cutOffTime: '',
            deliverSLA: undefined,
            description: '',
            name: '',
            serviceDays: '',
            serviceEndTime: '',
            serviceStartTime: '',
            status: '',
            deliverSLAUnit: '',
            deliveryBeforeTime: '',
            deliveryType: [],
            autoAllocate: '',
            branchMovement: ''

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
        }
    },
    serviceDays: [],
    deliveryTypes: [],
    branches: [],
    autoAllocateLabels : {},
    branchMovementLabels : {}
}

const ServiceTypeConfigurationReducer = (state = initialState, action: ServiceTypeConfigurationActions): IServiceTypeConfigurationState => {
    switch (action.type) {
        case '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LISTVIEW_STRUCTURE' :
        case '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LIST':
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
        case '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                listview: {...state.listview, structure: { columns: action.payload?.columns, buttons: action?.payload?.buttons }, loading: {...state.listview.loading, columns: false}}
            }
        case '@@serviceTypeConfiguration/FETCH_ALL_SERVICETYPE_LIST_SUCCESS':
           return {
                ...state,
                listview: {
                    ...state.listview,
                    data: action.payload,
                    loading: {
                        ...state.listview.loading,
                        columns: false
                    }
                 }     
            }
        case '@@serviceTypeConfiguration/GET_SERVICE_DAYS':
            const newServiceDaysArray = action.payload?.map((weekData: IDropdown) => ({
                label: weekData?.name,
                value: weekData?.name,
                id: weekData?.id,
                title: weekData?.name,
            }));
            return {
                ...state,
                serviceDays: newServiceDaysArray,
            };
        case '@@serviceTypeConfiguration/GET_DELIVERY_TYPE':
            const types = action.payload?.map((type: any) => ({
                label: type?.name,
                value: type?.name,
                id: type?.id,
                title: type?.name
            }));
            return {
                ...state,
                deliveryTypes: types,
            };
        case '@@serviceTypeConfiguration/GET_BRANCHES':
            return {
                ...state,
                branches: action.payload
            }
        case '@@serviceTypeConfiguration/FETCH_FORM_STRUCTURE':
        case '@@serviceTypeConfiguration/FETCH_SERVICETYPE_BY_ID':
            return {
                ...state,
                form: {
                    ...state.form,
                    loading: true
                }
            }
        case '@@serviceTypeConfiguration/FETCH_FORM_STRUCTURE_SUCCESS':
            return {
                ...state,
                form: {
                    ...state.form,
                    structure: action.payload,
                    loading: false
                }
            }
        case '@@serviceTypeConfiguration/SET_FORM_LOADING':
            return {
                ...state,
                form: {
                    ...state.form,
                    loading: action.payload
                }
            }
        case '@@serviceTypeConfiguration/SET_VIEW_TYPE':
            return {
                ...state,
                viewType: action.payload
            }
        case '@@serviceTypeConfiguration/FETCH_SERVICETYPE_BY_ID_SUCCESS':
            return {
                ...state,
                form: {
                    ...state.form,
                    isEditable: true,
                    serviceTypeData: action.payload
                }
            }
        case "@@serviceTypeConfiguration/SET_FORM_EDITABLE":
            return {
                ...state,
                form: {
                    ...state.form,
                    isEditable: action.payload
                }
            }
        case "@@serviceTypeConfiguration/RESET_SERVICETYPE_DATA":
            return {
                ...state,
                form: {
                    ...state.form,
                    serviceTypeData: {
                        branchId: [],
                        considerHolidays: '',
                        cutOffTime: '',
                        deliverSLA: undefined,
                        description: '',
                        name: '',
                        serviceDays: '',
                        serviceEndTime: '',
                        serviceStartTime: '',
                        status: '',
                        deliverSLAUnit: '',
                        deliveryBeforeTime: '',
                        deliveryType: []
                    }
                }
            }
         case "@@serviceTypeConfiguration/SET_AUTO_ALLOCATE_VALUES":
             return {
               ...state, 
               autoAllocateLabels : action.payload 
             }

        case "@@serviceTypeConfiguration/SET_BRANCH_MOVEMENT_VALUES":
             return {
               ...state, 
               branchMovementLabels : action.payload 
             }
        default:
            return state
    }
}
export default ServiceTypeConfigurationReducer;