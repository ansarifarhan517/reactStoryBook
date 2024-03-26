import { Switch } from 'react-router'
import { IFleetTypeActions } from './FleetTypeForm.actions'
import { IFleetTypeFormReducerState, IFleetTypeData, IDropdown } from './FleetTypeForm.models'

export const intialState = {
    structure: {},
    loading: false,
    isEditMode: false,
    resetData: {},
    clientMetric:{},
    isDirty: false,
    compartmentStructure: [],
    compartmentMasterList : []
}

export const fleetTypeFormReducer = (
    state: IFleetTypeFormReducerState = intialState,
    action: IFleetTypeActions): IFleetTypeFormReducerState => {
    switch (action.type) {
        case '@@fleetTypeForm/SET_STRUCTURE':
            const struct = { ...action.payload }
            return {
                ...state,
                structure: struct
            }

        case '@@fleetTypeForm/SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }

        case '@@fleetTypeForm/SET_EDIT_MODE':
            return {
                ...state,
                isEditMode: action.payload
            }
        case '@@fleetTypeForm/SET_FLEETTYPE_DATA':
            return {
                ...state,
                fleetTypeData: action.payload
            }
        case '@@fleetTypeForm/SET_FORM_RESET_DATA':
            return {
                ...state,
                resetData: action.payload
            }

            case '@@fleetTypeForm/SET_CLIENT_METRIC_SYSTEM': {
                let obj = {}
                action.payload?.forEach((c:any) => {
                  obj = {
                    ...obj,
                    [c.name]: c
                  } 
                })

                return {
                  ...state,
                  clientMetric: obj
                }
              }

        case '@@fleetTypeForm/RESET_INITIAL_STATE':
            return intialState

        case '@@fleetTypeForm/SET_COMPARTMENT_STRUCTURE':
            return {
                ...state,
                compartmentStructure: action.payload
            }
        case '@@fleetTypeForm/SET_COMPARTMENT_MASTER_DATA':
            const newCompartmentArray = action.payload?.map((compartment: IDropdown) => ({
                label: compartment?.compartmentName,
                value: compartment?.compartmentId,
                id: compartment?.compartmentId,
                title: compartment?.compartmentName,
                capacityInVolume: compartment?.capacityInVolume,
                capacityInWeight: compartment?.capacityInWeight,
                capacityInUnits: compartment?.capacityInUnits
            }));
            return {
                ...state,
                compartmentMasterList: newCompartmentArray,
            };
        default:
            return state
    }
}
