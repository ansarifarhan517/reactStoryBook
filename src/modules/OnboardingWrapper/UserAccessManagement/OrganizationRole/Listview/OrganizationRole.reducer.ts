
import { IMongoListViewStructure, IEditDetails } from '../../../../../utils/mongo/interfaces';
import { IOrganizationRoleDataPayload, IPersonaList, ILandingPageList, INoOfAccessProfileRequest, INoOfUsersRequest, IAccessProfileDataPayload, IUserCountDataPayload } from './OrganizationRole.models';
import { OrganizationRoleActions } from './OrganizationRole.actions';
import { deepCopy } from '../../../../../utils/helper';

export const dummyColumns: any = {
  orgRoleName: { label: "Organization Role Name", permission: true },
  orgRoleDescription: { label: "Organization Role Description", permission: true },
  orgRoleLandingPage: { label: "Organization Role Landing Page", permission: true },
  attachedAccessProfileCount: { label: "Access Profile", permission: true },
  attachedUserCount: { label: "Number of Users", permission: true },
  persona: { label: "Persona", permission: true },
  activeFl: { label: "Active / Inactive", permission: true },
  isFavourite: { label: "Default", permission: true }
}
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ clientCoLoaderId: i + 1 }))


export interface IOrganizationRoleState {
  structure: IMongoListViewStructure
  data: IOrganizationRoleDataPayload,
  accessProfileModalData: IAccessProfileDataPayload,
  userCountModalData: IUserCountDataPayload
  viewMode: 'listview';
  emptyData: boolean,
  editDetails: IEditDetails,
  lastUpdatedCell: string,
  personaList?: IPersonaList[],
  landingPageList?: ILandingPageList[],
  accessProfileCount: INoOfAccessProfileRequest,
  userCount: INoOfUsersRequest
  loading: boolean,
  listLoading: {
    rows: boolean,
    columns: boolean
  }
  accessProfileCountListLoading:{
    rows: boolean,
    columns: boolean
  },
  userCountListLoading:{
    rows: boolean,
    columns: boolean
  }  
}

const initialState: IOrganizationRoleState = {
  structure: {
    columns: dummyColumns,
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  accessProfileModalData: {
    totalCount: 0,
    results: dummyResult
  },
  userCountModalData:{
    totalCount: 0,
    results: dummyResult
  },
  editDetails: {},
  viewMode: 'listview',
  emptyData: false,
  lastUpdatedCell: '',
  accessProfileCount: { activeRequest: false, customOrgRoleId: undefined },
  userCount: { activeRequest: false, customOrgRoleId: undefined },
  loading: true,
  listLoading: {
    rows: true,
    columns: true
  },
  accessProfileCountListLoading:{
    rows: true,
    columns: true
  },
  userCountListLoading:{
    rows: true,
    columns: true
  }
}

const OrganizationRoleReducer = (state = initialState, action: OrganizationRoleActions): IOrganizationRoleState => {
  switch (action.type) {
    case '@@organizationRole/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case '@@organizationRole/FETCH_STRUCTURE_SUCCESS':
      return {
        ...state,
        structure: action.payload,
        listLoading: {
          ...state.listLoading,
          columns: false
        }
      };

    case '@@organizationRole/FETCH_DATA_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        listLoading: {
          columns: false,
          rows: false
        }
      };
    case '@@organizationRole/SET_PERSONA': {
      let personlist = deepCopy(action.payload)
      personlist.forEach((personaData: { [x: string]: any; }) => {
        personaData['value'] = personaData['clientRefMasterCd']
        personaData['label'] = personaData['clientRefMasterDesc']
        personaData['id'] && delete personaData['id']
        personaData['name'] && delete personaData['name']
      })
      return {
        ...state,
        personaList: personlist
      }
    }

    case '@@organizationRole/SET_LANDINGPAGE': {
      let OrgLandingPageList = deepCopy(action.payload)
      OrgLandingPageList.forEach((landingPageData: { [x: string]: any; }) => {
        landingPageData['value'] = landingPageData['clientRefMasterCd']
        landingPageData['label'] = landingPageData['name']
        landingPageData['id'] && delete landingPageData['id']
        landingPageData['name'] && delete landingPageData['clientRefMasterDesc']
      })
      return {
        ...state,
        landingPageList: OrgLandingPageList
      }
    }

    case '@@organizationRole/SET_NO_OF_ACCESSPROFILE_MODAL':
      return {
        ...state,
        accessProfileCount: action.payload
      }

    case '@@organizationRole/SET_NO_OF_USERS_MODAL':
      return {
        ...state,
        userCount: action.payload
      }

    case '@@organizationRole/UPDATE_DATA': {
      const { orgRoleId: updateOrgRoleId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => (row.orgRoleId === updateOrgRoleId ? { ...row, ...rest } : row))
        }
      };
    }

    case '@@organizationRole/SET_DATA':
      return {
        ...state,
        [action?.payload?.key]: action?.payload?.value
      }    

    case '@@accessProfile/FETCH_DATA_SUCCESS':
      return {
        ...state,
        accessProfileModalData: action.payload,
        loading: false,
        accessProfileCountListLoading: {
          columns: false,
          rows: false
        }
      };

    case '@@accessProfile/SET_DATA':
      return {
        ...state,
        [action?.payload?.key]: action?.payload?.value
      };

      case '@@userCount/FETCH_DATA_SUCCESS':
        return {
          ...state,
          userCountModalData: action.payload,
          loading: false,
          userCountListLoading: {
            columns: false,
            rows: false
          }
        };
  
      case '@@userCount/SET_DATA':
        return {
          ...state,
          [action?.payload?.key]: action?.payload?.value
        };

    default:
      return state
  }
}

export default OrganizationRoleReducer