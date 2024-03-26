// import capacityConversion from '../VehicleListView/utils/capacityConversion';
import { IVehicleFormActions } from './VehicleForm.actions';
import { IDropdown, IVehicleFormReducerState } from './VehicleForm.model'

export const initialState = {
  structure: {},
  loading: false,
  isEditMode: false,
  fleetType: [],
  systemMetric: {},
  clientMetric:{},
  // driverData: {},
  resetData: {
    /** This key corresponds to the key defined in getAPIModuleData() */
    moduleKey: 'vehicle',
    licenseType: ''
  },
  compartmentStructure: [],
  compartmentBaseStructure: [],
  compartmentMasterList : [],
  trackerMasterList : []
}

export const VehicleFormReducer = (
  state: IVehicleFormReducerState = initialState,
  action: IVehicleFormActions): IVehicleFormReducerState => {

  switch (action.type) {
    case '@@vehicleForm/SET_STRUCTURE':
      const struct = {...action.payload}

      if(struct['general details']?.clientBranchId.lookupType) {
        // struct['general details'].clientBranchId.lookupType = 'getDistributionCenterSubBranch'
      }
      if( struct?.['owner details']?.ownership?.validation) {
        struct['owner details'].ownership.validation.pattern = {}
      }
      
      return {
        ...state,
        structure: struct
      }

    case '@@vehicleForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@vehicleForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@vehicleForm/SET_VEHICLE_DATA':
      return {
        ...state,
        vehicleData: action.payload 
      }
      
    case '@@vehicleForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }

   
    case '@@vehicleForm/SET_FLEET_TYPE':
      return {
        ...state,
        fleetType: action.payload
      }
      
      case '@@vehicleForm/SET_SYSTEM_METRIC_SYSTEM': {
      
        return {
          ...state,
          systemMetric: action.payload
        }
      }

      case '@@vehicleForm/SET_CLIENT_METRIC_SYSTEM': {
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
      
    case '@@vehicleForm/RESET_INITIAL_STATE':
      return initialState

    case '@@vehicleForm/SET_COMPARTMENT_STRUCTURE':
      return {
          ...state,
          compartmentStructure: action.payload
      }
    case '@@vehicleForm/SET_BASE_COMPARTMENT_STRUCTURE':
      return {
          ...state,
          compartmentBaseStructure: action.payload
      }
    case '@@vehicleForm/SET_COMPARTMENT_MASTER_DATA':
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
    case '@@vehicleForm/SET_TRACKER_MASTER_DATA':
        const trackerArray = action.payload?.map((tracker: IDropdown) => ({
            label: tracker?.trackeeId,
            value: tracker?.deviceId,
            id: tracker?.deviceId,
            title: tracker?.trackeeId,
            name: tracker?.trackeeId,
            deviceId: tracker?.deviceId
        }));
        return {
            ...state,
            trackerMasterList: trackerArray,
        };
    default:
      return state
  }
}