import { ImportSettingsActions } from './ImportSettings.actions';
import { IClientsLookUpData, IMongoImportSettingsStructure, IClients } from './ImportSettings.models';

export interface IImportSettingsState {
  structure: IMongoImportSettingsStructure
  loading: boolean,
  importFromLookUpData: Array<IClientsLookUpData>,
  importToLookUpData: Array<IClientsLookUpData>,
  clients: IClients
}

const initialState: IImportSettingsState = {
  structure: {},
  loading: false,
  // clientsLookUpData: [],
  importFromLookUpData: [],
  importToLookUpData: [],
  clients: {
    importFrom: "",
    importTo: "",
    // modelType: "",
  }
}

const ImportSettingsReducer = (state = initialState, action: ImportSettingsActions): IImportSettingsState => {
  switch (action.type) {
    
    case '@@importSettings/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case '@@importSettings/FETCH_STRUCTURE_SUCCESS':
      return {
        ...state,
        structure: action.payload,
      };

    case '@@importSettings/FETCH_IMPORT_FROM_DATA_SUCCESS': {
      return {
        ...state,
        importFromLookUpData: action.payload,
      }
    }

    case '@@importSettings/FETCH_IMPORT_TO_DATA_SUCCESS': {
      return {
        ...state,
        importToLookUpData: action.payload,
      }
    }

    // case '@@importSettings/FETCH_CLIENT_LOOKUP_DATA_SUCCESS': {
    //   return {
    //     ...state,
    //     clientsLookUpData: action.payload,
    //   }
    // }

    case '@@importSettings/SET_CLIENT': {
      return {
        ...state,
        clients: {
          ...state.clients,
          [action.payload.key]: action.payload.value,
          // modelType: action.payload.modelType,
        }
      }
    }

    default:
      return state;
  }
}

export default ImportSettingsReducer;