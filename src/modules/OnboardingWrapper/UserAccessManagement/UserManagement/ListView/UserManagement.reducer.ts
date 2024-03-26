import { IEditDetails } from '../../../../../utils/mongo/interfaces';
import { UserManagementActions } from './UserManagement.actions';
import { IMongoListViewStructure } from '../../../../../utils/mongo/interfaces';
import { IuserManagementDataPayload } from './UserManagement.models';
import { IHandOverDropDownOptions } from './../ListView/SubComponent/SubComponent.models';


export const dummyColumns: any = {
  name: { label: "Full Name", permission: true },
  userName: { label: "Username", permission: true },
  userGroupName: { label: "User Role", permission: true },
  clientBranchName: { label: "Branch", permission: true },
  clientName: { label: "Client Name", permission: true },
  mobileNumber: { label: "Contact Number", permission: true },
  emailAddress: { label: "Email ID", permission: true },
  lastLoginTime: { label: "Last Login Time", permission: true },
  isActiveFl: { label: "Active / Inactive", permission: true },
  createdOnDt: { label: "Created On", permission: true },
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ clientCoLoaderId: i + 1 }))

export interface IUserListViewState {
  structure: IMongoListViewStructure
  data: IuserManagementDataPayload
  viewMode: 'listview'
  editDetails: IEditDetails
  lastUpdatedCell: string
  loading: boolean,
  listLoading: {
    rows: boolean,
    columns: boolean
  }  
  selectedRows: any
  emptyData : boolean,
  handOverOptions: IHandOverDropDownOptions[]
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
  handOverOptions: []
}

const UserManagementReducer = (state = initialState, action: UserManagementActions): IUserListViewState => {
  switch (action.type) {
    
    case '@@userManagement/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case '@@userManagement/SET_DATA':
      return {
        ...state,
        [action?.payload?.key]: action?.payload?.value
      }
    
    case '@@userManagement/FETCH_DATA_SUCCESS':
      return {
        ...state,
        data:action.payload,        
        loading: false,
        listLoading: {
          columns: false,
          rows: false
        }
      };
    
    case '@@userManagement/FETCH_STRUCTURE_SUCCESS':
      return {
        ...state,
        structure: action.payload,
        listLoading: {
          ...state.listLoading,
          columns: false
        }
      };

      case '@@userManagement/UPDATE_DATA':
      const { userId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row) => row.userId === userId ? { ...row, status, ...custom } : row)
        }
      };
    
      case '@@userManagement/FETCH_USER_OPTIONS_SUCCESS':
      return {
        ...state, handOverOptions : action.payload
      };

    default:
      return state
  }
}

export default UserManagementReducer