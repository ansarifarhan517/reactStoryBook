import {  ManifestConfigurationActions} from './ManifestConfiguration.actions'
import { ManifestTypeList, GenerateManifestPayload } from './ManifestConfiguration.model';
// import { IHandOverDropDownOptions } from './../ListView/SubComponent/SubComponent.models';
export interface IUserListViewState {
  generateManifestPayload: GenerateManifestPayload,
  maifestTypeList: ManifestTypeList[]
}

const initialState: IUserListViewState = {
  generateManifestPayload: {
    formula: '',
    generatedSample: '',
    clientId: 0,
    fieldData: []
  },
  maifestTypeList: []
}

const ManifestConfigurationReducer = (state = initialState, action: ManifestConfigurationActions): IUserListViewState => {
  switch (action.type) {
    
    case '@@manifestonfiguration/SET__MANIFEST_TYPE':
      return {
        ...state,
        maifestTypeList: action.payload
      }
    case '@@manifestonfiguration/SET__GENERATE_MANIFEST':
      return {
        ...state,
        generateManifestPayload: { ...state.generateManifestPayload, ...action.payload }
      };

    default:
      return state
  }
}

export default ManifestConfigurationReducer
