import {
  IMongoFormStructure,
  // ICustomFieldsEntity,
  //  IMultiselectEntity,
  // IFileEntity,
  //  IAddressEntity
} from './../../../utils/mongo/interfaces';

export interface IRateProfileData {
  [key: string]: any
}

export interface IRateFormFormReducerState {
  structure: IMongoFormStructure
  loading: boolean
  isEditMode: boolean
  rateProfileData?: IRateProfileData
  resetData?: IVehicleFormData
}


export interface IVehicleFormData {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}

