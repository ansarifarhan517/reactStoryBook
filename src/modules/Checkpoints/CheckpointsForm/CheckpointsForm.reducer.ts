import { IMongoFormStructure } from "../../../utils/mongo/interfaces";
import { IDropdown } from "../../FleetType/FleetTypeListView.models";
import { IRowData } from "../CheckpointsListView/CheckpointsListView.models";
import { CheckpointsFormActions } from "./CheckpointsForm.actions";

export interface ICheckpointsFormState {
  structure: IMongoFormStructure;
  loading: boolean;
  data: IRowData;
  isAlertSettings: boolean;
  alertFormStructure: IMongoFormStructure;
  toggleState: any;
  alertsData: any;
  checkpointData: any;
  categoryList?: IDropdown[] ;
  fleetTypeList?: IDropdown[];
  vehicleTypeList?: IDropdown[];
  hubList?: IDropdown[];
  shiftTimings: {};
  saveAlertModalFlag? : boolean;
  fetchFormStructureSuccessFlag? :boolean;
  updatedToggleState : any;
  fetchDropdownSuccessFlag : boolean
}

const intialState: ICheckpointsFormState = {
  structure: {},
  loading: false,
  data: {
    createdOnDt: 0,
    checkpointId: 0,
    checkpointName: "",
    isActiveFl: true,
    checkpointCategory: "",
    checkpointLatitude: 0,
    checkpointLongitude: 0,
    checkpointRadius: 0,
    routeCount: 0,
    alertCount: 0,
    checkpointCode: "",
    checkpointRadiusOrArea: 0,
    shapeType: "POLYGON",
  },
  isAlertSettings: false,
  alertFormStructure: {},
  toggleState: {
    checkpointEntry: false,
    checkpointExit: false,
    maximumHaltTime: false,
    fleetMovementStopped: false,
    fleetMovementResumed: false,
    restrictedTime: false,
  },
  alertsData: [],
  checkpointData: {},
  categoryList: [] ,
  fleetTypeList: [] ,
  vehicleTypeList: [] ,
  hubList: [] ,
  shiftTimings: {pref0: [{ id: new Date().toString() }]}, //  
  saveAlertModalFlag : false ,
  fetchFormStructureSuccessFlag : false,
  updatedToggleState :{
    checkpointEntry: false,
    checkpointExit: false,
    maximumHaltTime: false,
    fleetMovementStopped: false,
    fleetMovementResumed: false,
    restrictedTime: false,
  },
  fetchDropdownSuccessFlag : false
};

const CheckpointsFormReducer = (
  state: ICheckpointsFormState = intialState,
  action: CheckpointsFormActions
): ICheckpointsFormState => {
  switch (action.type) {
    case "@@checkpointsForm/SET_FORM_STRUCTURE":
      return {
        ...state,
        structure: action.payload,
      };

    case "@@checkpointsForm/SET_FORM_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "@@checkpointsForm/SET_DATA":
      return {
        ...state,
        data: action.payload,
      };

    case "@@checkpointsForm/SET_OPEN_ALERT_SETTINGS":
      return {
        ...state,
        isAlertSettings: action.payload,
      };

    case "@@checkpointsForm/SET_ALERT_FORM_STRUCTURE":
      return {
        ...state,
        alertFormStructure: action.payload,
      };

    case "@@checkpointsForm/SET_TOOGLE_STATE":
      return {
        ...state,
        toggleState: {
          ...state.toggleState,
          [action.payload.key]: action.payload.value,
        },
      };

    case "@@checkpointsForm/SET_ALERTS_DATA":
      return {
        ...state,
        alertsData: action.payload,
      };

    case "@@checkpointsForm/FETCH_CHECKPOINT_BY_ID_SUCCESS":
      return {
        ...state,
        checkpointData: action.payload,
      };
    case "@@checkpointsForm/SET_CATEGORY_LIST": {
      return {
        ...state,
        categoryList: action.payload,
      };
    }
    case "@@checkpointsForm/SET_FLEET_TYPE_LIST": {
      return {
        ...state,
        fleetTypeList: action.payload,
      };
    }
    case "@@checkpointsForm/SET_VEHICLE_TYPE_LIST": {
      return {
        ...state,
        vehicleTypeList: action.payload,
      };
    }
    case "@@checkpointsForm/SET_HUB_TYPE_LIST": {
      return {
        ...state,
        hubList: action.payload,
      };
    }

    case "@@checkpointsForm/SET_SHIFT_TIMINGS": {
      return {
        ...state,
        shiftTimings: {
          ...state.shiftTimings,
          [action.key]: action.payload,
        },
      };
    }

    case "@@checkpointsForm/RESET_SHIFT_TIMINGS": {
      return {
        ...state,
        shiftTimings: {...intialState.shiftTimings}
      }
    }

    case "@@checkpointsForm/REMOVE_SHIFT_TIMINGS": {
      const deleteIndex = action.key;
      const stateCopy = {...state};
      const totalPreferences = Object.keys(stateCopy['shiftTimings'])?.length;
      for(let i = deleteIndex; i<totalPreferences-1; i++){
        stateCopy['shiftTimings'][`pref${i}`] = stateCopy['shiftTimings'][`pref${i+1}`]
      }
      delete stateCopy['shiftTimings'][`pref${totalPreferences-1}`]
      return stateCopy;
    }

    case'@@checkpointsForm/SET_SAVE_ALERT_MODAL_FLAG':{
        return{
            ...state,
            saveAlertModalFlag : action.payload
        }
    }

    case "@@checkpointsForm/RESET_STATE": 
      return intialState

    case '@@checkpointsForm/SET_FORM_STRUCTURE_FLAG':
      return{
        ...state,
        fetchFormStructureSuccessFlag : action.payload
      }

    case '@@checkpointsForm/UPDATE_TOOGLE_STATE':
      return{
        ...state,
        updatedToggleState : action.payload
      }

    case '@@checkpointsForm/FETCH_DROPDOWNOPTIONS_SUCCESS_FLAG':
      return{
        ...state,
        fetchDropdownSuccessFlag: action.payload
      }

    default:
      return state;
  }
};

export default CheckpointsFormReducer;
