import { IEditDetails } from './../../../utils/mongo/interfaces';
import { CustomFieldsActions } from './CustomFields.actions';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { ICustomFieldsDataPayload} from './CustomFields.models';


export interface ICustomFieldsState {
  structure: IMongoListViewStructure
  data: ICustomFieldsDataPayload
  editDetails: IEditDetails
  loading: {
    listView: boolean
  }
  modulesList: any
  fieldTypeList: any
}
export const dummyColumns: any = {
  customFieldName: {label: "Custom Field Name",permission: true},
  attachedWithModules: {label: "Used In Modules", permission: true},
  customFieldType: {label: "Field Type", permission: true},
  updatedOnDt: {label: "Last Updated On", permission: true},
  isActiveFl: {label: "Active / Inactive", permission: true},
  }
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({id: i + 1 }))
const initialState: ICustomFieldsState = {
  structure: {
    columns: dummyColumns,
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  editDetails: {},
  loading: {
    listView: false
  },
  modulesList: [],
  fieldTypeList: []
}

const CustomFieldsReducer = (state = initialState, action: CustomFieldsActions): ICustomFieldsState => {
  switch (action.type) {
    case '@@customFields/FETCH_STRUCTURE_SUCCESS':
      const columns = action?.payload?.columns;
      
      const keys = Object.keys(columns);
      const newObj: any = {};
      keys.forEach((key: string) => {
        if (key == 'updatedOnDt') {
          newObj[key] = columns[key]
          newObj[key].showTime = true
          newObj[key].dateFormat = 'YYYY-MM-DD HH:mm:ss'
        } else {
          newObj[key] = columns[key];
        }
      });
      const newPayload = { ...action.payload, columns: newObj};
      return {
        ...state,
        structure: newPayload
      }
    case '@@customFields/FETCH_MODULES_SUCCESS':
      let modulesList = action.payload.map((row : any) => {
        row['label'] = row.clientRefMasterDesc; 
        row['key'] = row.clientRefMasterCd;
        row['value'] = row.clientRefMasterCd;
        return row
      })
      
      return {
        ...state,
        modulesList: modulesList
      }

    case '@@customFields/FETCH_FIELDTYPES_SUCCESS':
      let fieldTypeList = action.payload.map((row : any , index : number) => {
        row['label'] = row.clientRefMasterDesc; 
        row['key'] = row.clientRefMasterCd;
        row['value'] = row.clientRefMasterCd;
        row['id'] = index;
        return row
      })
      
      return {
        ...state,
        fieldTypeList: fieldTypeList
      }  

    case '@@customFields/FETCH_DATA_SUCCESS':
      const results = action.payload.results.map((row) => {
        const rowObj = row
        return rowObj
      })
      
      return {
        ...state,
        data: {
          ...action.payload,
          results
        }
      }
      case '@@customFields/UPDATE_DATA':
      const { id: updateCustomId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.id === updateCustomId ? { ...row, ...rest } : row)
        }
      }
    case '@@customFields/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }

    default:
      return state
  }
}

export default CustomFieldsReducer