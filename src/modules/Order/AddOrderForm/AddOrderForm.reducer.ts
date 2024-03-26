import { deepCopy } from "../../../utils/helper"
import { IMongoFormStructure } from "../../../utils/mongo/interfaces"
import { IAddOrderFormActions } from "./AddOrderForm.actions"
import { ICrateData, IDropdownOptionProps, IOrderData, ISubClients, ITimezoneOptions } from "./AddOrderForm.models"
import { IClientMetricSystem } from '../../../utils/common.interface';

export interface IPropertyValueData {
    propertyKey: string;
    propertyValue: string
}

export interface IAddOrderFormReducerState {
    structure: IMongoFormStructure
    localeData?: IDropdownOptionProps[]
    loading: boolean
    apiLoading: boolean
    isOptimizeFl: boolean
    crateOrCrateItem: IPropertyValueData
    activateCustomerProfilingPickup: boolean
    activateCustomerProfilingDeliver: boolean
    isEditMode: boolean,
    orderData?: IOrderData,
    resetData: IOrderData,
    googleApiKey: string
    orderNumber: string
    crateData?: Array<ICrateData>
    dynamicLabels: Record<string, string>
    crateType: string,
    AddDeleteCount: number
    crateExpanded: string
    itemExpanded: string
    clientMetric?: IClientMetricSystem[]
    subClients?: ISubClients[]
    timeZoneList?: ITimezoneOptions[]
    isOrderCloned: boolean
    isMapLoadingFirstTime: boolean
    selectedCustomerId? : string
}

export const initialState = {
    structure: {},
    loading: false,
    apiLoading: false,
    isOptimizeFl: false,
    crateOrCrateItem: {
        propertyKey: '',
        propertyValue: ''
    },
    activateCustomerProfilingPickup: false,
    activateCustomerProfilingDeliver: false,
    isEditMode: false,
    googleApiKey: '',
    orderNumber: '',
    resetData: {},
    dynamicLabels: {},
    crateType: '',
    AddDeleteCount: 0,
    crateExpanded: '',
    itemExpanded: '',
    isOrderCloned: false,
    isMapLoadingFirstTime: false
}

  // const formFields = {shipmentsType: shipmentsType, returnShipment: returnShipment}
export const AddOrderFormReducer = (state = initialState, action: IAddOrderFormActions) : IAddOrderFormReducerState => {
    switch (action.type) {
        case '@@addOrderForm/SET_STRUCTURE':
            return {
                ...state,
                structure: action.payload
            }

        case '@@addOrderForm/SET_LOCALE':
            return {
                ...state,
                localeData: action.payload
            }

        case '@@addOrderForm/SET_OPTIMIZE_FLAG':
            return {
                ...state,
                isOptimizeFl: action.payload[0].propertyValue === 'true' ? true : false
            }

        case '@@addOrderForm/SET_CRATE_TYPE' :
            return {
                ...state,
                crateOrCrateItem : action.payload
            }

        case '@@addOrderForm/SET_CUSTOMER_PROFILING_PICKUP':
            return {
                ...state,
                activateCustomerProfilingPickup: action.payload.propertyValue === 'Y' ? true : false
            }

        case '@@addOrderForm/SET_CUSTOMER_PROFILING_DELIVER':
            return {
                ...state,
                activateCustomerProfilingDeliver: action.payload.propertyValue === 'Y' ? true : false
            }

        case '@@addOrderForm/SET_STRUCTURE_DATA' : 
            return {
                ...state,
                structure : action.payload
            }

        case '@@addOrderForm/SET_FORM_TYPE':
            const newStr = deepCopy(state.structure); 
            const newLabels = deepCopy(state.dynamicLabels); 
            if (action.payload.includes("Point to Point")) {
                newStr['general details']['returnShipment'] ? newStr['general details']['returnShipment'].permission = false : ''
                newStr['general details']['distributionCenter'].permission = true
                newStr['general details']['hubName'].permission = false
                newStr['order details']['ServiceTime'].permission = false
                newStr['pick up details']['pickupBranch'].permission = false
                newStr['delivery details']['deliverBranch'].permission = false
                newStr['general details']['shipmentsType'] ? newStr['general details']['shipmentsType'].options = ['{"label":'+'"'+ `${newLabels.pickUpLeg}`+'"'+',"value":true,"disabled":true}','{"label":'+'"'+ `${newLabels.deliveryLeg}` +'"'+ ',"value":true,"disabled":true}','{"label":"Point to Point","value":true,"disabled":false}'] : '';
            } else {
                if (action.payload === `${newLabels.pickUpLeg}` && newStr['general details'].distributionCenter) {
                    newStr['general details']['returnShipment'] ? newStr['general details']['returnShipment'].permission = false : ''
                    newStr['general details'].distributionCenter ? newStr['general details'].distributionCenter.permission = true : '';
                    newStr['general details'].hubName  ? newStr['general details'].hubName.permission = false : '';
                    newStr['pick up details'].pickupNotes ? newStr['pick up details'].pickupNotes.permission = true : '';
                    (newStr['pick up details'].deliverNotes) ? newStr['pick up details'].deliverNotes.permission = false : '';
                    if (newStr['pick up details'].pickupBranch) {
                        newStr['pick up details'].pickupBranch.permission = false;
                    }
                    if (newStr['pick up details'].pickupServiceTime) {
                        newStr['pick up details'].pickupServiceTime.permission = false;
                    }
                } else if (action.payload === `${newLabels.deliveryLeg}` && newStr['general details'].distributionCenter) {
                    newStr['general details']['returnShipment'] ? newStr['general details']['returnShipment'].permission = false : '';
                    (newStr['general details'].distributionCenter) ? newStr['general details'].distributionCenter.permission = true : '';
                    (newStr['general details'].hubName) ? newStr['general details'].hubName.permission = true : '';
                    (newStr['delivery details'].pickupNotes) ? newStr['delivery details'].pickupNotes.permission = false : '';
                    (newStr['delivery details'].deliverNotes) ? newStr['delivery details'].deliverNotes.permission = true : '';
                    if (newStr['delivery details'].deliverBranch) {
                        newStr['delivery details'].deliverBranch.permission = false;
                    }
                    if (newStr['delivery details'].deliverServiceTime) {
                        newStr['delivery details'].deliverServiceTime.permission = false;
                    }
              
                } else if (action.payload.includes(`${newLabels.pickUpLeg}`) && action.payload.includes(`${newLabels.deliveryLeg}`) && newStr['general details'].distributionCenter) {
                    newStr['general details']['returnShipment'] ? newStr['general details']['returnShipment'].permission = true : '';
                    newStr['general details']['shipmentsType'] ? newStr['general details']['shipmentsType'].options = ['{"label":'+'"'+ `${newLabels.pickUpLeg}`+'"'+',"value":true,"disabled":false}','{"label":'+'"'+ `${newLabels.deliveryLeg}` +'"'+ ',"value":true,"disabled":false}','{"label":"Point to Point","value":true,"disabled":false}'] : '';
                    (newStr['general details'].distributionCenter ) ? newStr['general details'].distributionCenter.permission = false : '';
                    (newStr['general details'].hubName ) ? newStr['general details'].hubName.permission = false : '';
                    (newStr['customer details'].pickupNotes ) ? newStr['customer details'].pickupNotes.permission = true : '';
                    (newStr['customer details'].deliverNotes ) ? newStr['customer details'].deliverNotes.permission = true : '';
                    if (newStr['pick up details'].pickupBranch) {
                        newStr['pick up details'].pickupBranch.permission = true;
                    }
                    if (newStr['delivery details'].deliverBranch) {
                        newStr['delivery details'].deliverBranch.permission = true;
                    }
                }
            }
            return {
                ...state,
                structure: newStr
            }

        case '@@addOrderForm/SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }

        case '@@addOrderForm/GOOGLE_API_KEY_SUCCESS':
            return {
                ...state,
                googleApiKey: action.payload
            }

        case '@@addOrderForm/FETCH_ORDER_NUMBER_SUCCESS':
            return {
                ...state,
                orderNumber: action.payload
            }

        case '@@addOrderForm/SET_FORM_RESET_DATA':
            return {
                ...state,
                resetData: action.payload
            }
        case '@@addOrderForm/SET_API_LOADING':
            return {
                ...state,
                apiLoading: action.payload
            }

        case '@@addOrderForm/SET_CRATE_DATA':
            return {
                ...state,
                crateData: action.payload
            }

        case '@@addOrderForm/SET_DYNAMIC_LABELS':
            return {
                ...state,
                dynamicLabels: action.payload
            }

        case '@@addOrderForm/SET_CRATE_PATTERN':
            return {
                ...state,
                crateType: action.payload
            }

        case '@@addOrderForm/SET_EXPANDED':
            if (action.payload.key === 'crate') {
                return {
                    ...state,
                    crateExpanded: action.payload.value
                }
            } else {
                return {
                    ...state,
                    itemExpanded: action.payload.value
                }
            }

        case '@@addOrderForm/SET_COUNT':
            return {
                ...state,
                AddDeleteCount: action.payload
            }

        case '@@addOrderForm/RESET_FORM':
            return {
                ...state,
                resetData: {}
            }
        case '@@addOrderForm/SET_CLIENT_METRIC_SYSTEM': 
            return {
                ...state,
                clientMetric: action.payload
            }
        case '@@addOrderForm/SET_SUBCLIENTS':
            return {
                ...state,
                subClients: action.payload
            }
        case '@@addOrderForm/SET_TIMEZONELIST':
            return {
                ...state,
                timeZoneList: action.payload
            }
        case '@@addOrderForm/SET_ORDER_CLONED':
            return { ...state, isOrderCloned: action.payload }

        case '@@addOrderForm/SET_IS_MAP_LOADING_FIRST_TIME': 
            return {...state, isMapLoadingFirstTime: action.payload}
            
        case '@@addOrderForm/SET_SELECTED_CUSTOMER_ID':
            return {
                ...state,
                selectedCustomerId: action.payload
            }
        default:
            return state
    }
}