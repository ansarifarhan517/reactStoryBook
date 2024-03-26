import { IEditDetails } from '../../../../utils/mongo/interfaces';
import { ItemConfigurationActions } from './ItemConfiguration.actions';
import { IMongoListViewStructure } from '../../../../utils/mongo/interfaces';
import { IitemConfigurationDataPayload } from './ItemConfiguration.models';
// import { IHandOverDropDownOptions } from './../ListView/SubComponent/SubComponent.models';


export const dummyColumns: any = {
  code: { label: "Item Code", permission: true },
  name: { label: "Item Name", permission: true },
  type: { label: "Item Type", permission: true },
  price: { label: "Item Price", permission: true },
  weight: { label: "Item Weight", permission: true },
  volume: { label: "Item Volume", permission: true },
  length: { label: "Item Length", permission: true },
  breadth: { label: "Item Breadth", permission: true },
  height: { label: "Item Height", permission: true },
  TemperatureCategory: { label: "Temperature Category", permission: true },
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ clientCoLoaderId: i + 1 }))

export interface IUserListViewState {
  structure: IMongoListViewStructure
  data: IitemConfigurationDataPayload
  viewMode: 'listview'
  editDetails: IEditDetails
  lastUpdatedCell: string
  loading: boolean,
  listLoading: {
    rows: boolean,
    columns: boolean
  }  
  temperatureCategory?: any[]
  selectedRows: any
  emptyData : boolean
  systemMetric: any[]
  allowUpdate: boolean
  // handOverOptions: IHandOverDropDownOptions[]
}

const initialState: IUserListViewState = {
  structure: {
    columns: dummyColumns,
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  viewMode: 'listview',
  editDetails: {},
  lastUpdatedCell: '',
  loading: true,
  listLoading: {
    rows: true,
    columns: true
  },
  selectedRows: {},
  emptyData: false,
  temperatureCategory: undefined,
  systemMetric: [],
  allowUpdate: false
  // handOverOptions: []
}

const ItemConfigurationReducer = (state = initialState, action: ItemConfigurationActions): IUserListViewState => {
  switch (action.type) {
    
    case '@@itemConfiguration/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case '@@itemConfiguration/SET_DATA':
      return {
        ...state,
        [action?.payload?.key]: action?.payload?.value
      }
    
    case '@@itemConfiguration/FETCH_DATA_SUCCESS':
      return {
        ...state,
        data:action.payload,        
        loading: false,
        listLoading: {
          columns: false,
          rows: false
        }
      };
    
    case '@@itemConfiguration/FETCH_STRUCTURE_SUCCESS':

      const structurePayload = {...action.payload}
      const updateFlag = action?.payload?.buttons?.update

      if(structurePayload?.buttons?.update) {
        delete structurePayload?.buttons?.update
      }

      let columns = action.payload.columns
      let newStruct = {}
      Object.keys(structurePayload?.columns)?.forEach((key:any) => {
        let obj =  columns[key]
        newStruct = {
          ...newStruct,
          [key]: {
            ...obj,
            editable: !!updateFlag
          
          }
        }
      })
      

      return {
        ...state,
        structure: { buttons: structurePayload?.buttons, columns: newStruct },
        allowUpdate: !!updateFlag,
        listLoading: {
          ...state.listLoading,
          columns: false
        }
      };

      case '@@itemConfiguration/UPDATE_DATA':
      const { itemId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row) => row.itemId === itemId ? { ...row, status, ...custom } : row)
        }
      };
    
      case '@@itemConfiguration/FETCH_TEMPERATURE_OPTIONS':

      const option =  action.payload?.map((obj:any) => {
        return {
          label: obj?.name,
          value: obj?.name,
          id: obj?.id,
          title: obj?.name
      }
      })
      return {
        ...state, temperatureCategory : option
      };


      case '@@itemConfiguration/FETCH_SYSTEM_METRIC':
      return {
        ...state,
        systemMetric: action?.payload
      }
   
    
      

    default:
      return state
  }
}

export default ItemConfigurationReducer