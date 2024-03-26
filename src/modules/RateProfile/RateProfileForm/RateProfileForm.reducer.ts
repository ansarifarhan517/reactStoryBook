import {  IMongoFormStructure } from '../../../utils/mongo/interfaces';
import { ISystemClientMetric } from '../../Vehicle/VehicleForm/VehicleForm.model';
import { IRateProfileFormActions } from './RateProfileForm.actions';

export interface IRateProfileFormState {
  structure: IMongoFormStructure
  loading: boolean
  isEditMode: boolean
  rateProfileData?: any //IVehicleData
  resetData?: any //IVehicleFormData
  skillSet: any[]
  systemMetric: ISystemClientMetric[]
  clientMetric: any
  distance?:any[]
  weight?:any[]
  volume?:any[]
  piece?:any[]
  rateNormal?: any[]
  basicElementsStructure: any
  [key:string]:any
}


export const initialState = {
  structure: {},
  loading: false,
  isEditMode: false,
  rateProfileData: undefined,
  skillSet: [],
  clientMetric: {},
  systemMetric: [],
  distance:undefined,
  weight:undefined,
  volume:undefined,
  piece:undefined,
  rateNormal: undefined,
  basicElementsStructure: undefined,
  resetData: {
    /** This key corresponds to the key defined in getAPIModuleData() */
    moduleKey: 'rateProfile',
    licenseType: ''
  }
}

export const RateProfileFormReducer = (
  state: IRateProfileFormState = initialState,
  action: IRateProfileFormActions): IRateProfileFormState => {

  switch (action.type) {
    case '@@rateProfileForm/SET_STRUCTURE':
      const struct = {...action.payload}
      if(struct?.['Rate Profile Details']?.['Cancellation Fees']?.childNodes?.minimumCost?.permission) {
        struct['Rate Profile Details']['Cancellation Fees'].childNodes.minimumCost.permission = false
      }
      if(struct?.['General Details']?.name) {

        struct['General Details'].name.required = true;
        struct['General Details'].name.validation = {
          'required': {
            'message': "Rate Profile Name is mandatory.",
          }
        } as any
      }
      if (struct?.['Rate Profile Details']?.['Cancellation Fee']?.childNodes?.cancellationFees) {
        struct['Rate Profile Details']['Cancellation Fee'].childNodes.cancellationFees.validation = {
          "min": {
            "args": "0",
            "message": "Cancellation Fees should not be less than 0."
          }

        } as any
      }

    
      return {
        ...state,
        structure: struct
      }

      case '@@rateProfileForm/SET_BASIC_ELEMENTS_STRUCTURE':
        return {
          ...state,
          basicElementsStructure: action.payload
        }

    case '@@rateProfileForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@rateProfileForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@rateProfileForm/SET_RATEPROFILE_DATA':
      return {
        ...state,
        rateProfileData: action.payload 
      }
      
    case '@@rateProfileForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }

   
    case '@@rateProfileForm/SET_SKILLSET':
      return {
        ...state,
        skillSet: action.payload
      }
      
      case '@@rateProfileForm/SET_SYSTEM_METRIC_SYSTEM': {
      
        return {
          ...state,
          systemMetric: action.payload
        }
      }

      case '@@rateProfileForm/SET_CLIENT_METRIC_SYSTEM': {
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


      case '@@rateProfileForm/SET_DISTANCE_OPTIONS': {

        const arr = action.payload?.map((obj:any) => {
          return {
            ...obj,
            label:obj?.clientRefMasterCd,
            value:obj?.clientRefMasterCd,
            id: obj?.clientRefMasterCd,
            name: obj?.clientRefMasterCd,
          }
        })
        return {
          ...state,
          distance: arr
        }
      }

      case '@@rateProfileForm/SET_WEIGHT_OPTIONS': {

        const arr = action.payload?.map((obj:any) => {
          return {
            ...obj,
            label:obj?.clientRefMasterCd,
            value:obj?.clientRefMasterCd,
            id: obj?.clientRefMasterCd,
            name: obj?.clientRefMasterCd,
          }
        })
        return {
          ...state,
          weight: arr
        }
      }

      case '@@rateProfileForm/SET_VOLUME_OPTIONS': {

        const arr = action.payload?.map((obj:any) => {
          return {
            ...obj,
            label:obj?.clientRefMasterCd,
            value:obj?.clientRefMasterCd,
            id: obj?.clientRefMasterCd,
            name: obj?.clientRefMasterCd,
          }
        })
        return {
          ...state,
          volume: arr
        }
      }

      case '@@rateProfileForm/SET_PIECE_OPTIONS': {

        const arr = action.payload?.map((obj:any) => {
          return {
            ...obj,
            label:obj?.clientRefMasterCd,
            value:obj?.clientRefMasterCd,
            id: obj?.clientRefMasterCd,
            name: obj?.clientRefMasterCd,
          }
        })
        return {
          ...state,
          piece: arr
        }
      }

      case '@@rateProfileForm/SET_RATENORMAL_OPTIONS': {

        const arr = action.payload?.map((obj:any) => {
          return {
            ...obj,
            label:obj?.clientRefMasterCd,
            value:obj?.clientRefMasterCd,
            id: obj?.clientRefMasterCd,
            name: obj?.clientRefMasterCd,
          }
        })
        return {
          ...state,
          rateNormal: arr
        }
      }

    case '@@rateProfileForm/RESET_INITIAL_STATE':
      return initialState

      
    default:
      return state
  }
}


export default RateProfileFormReducer