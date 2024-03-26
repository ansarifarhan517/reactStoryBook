import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
import {IAccessProfileDataPayload , IOrganizationRoleDataPayload} from './AccessProfile.models';
import {AccessProfileActions} from './AccessProfile.actions';
import { ILandingPageList, IPersonaList } from "../../OrganizationRole/Listview/OrganizationRole.models";
import { deepCopy } from '../../../../../utils/helper';

export const dummyColumns: any = {
    accessprofileName : {label : "Access profile Name", permission : true},
    accessprofileDesc : {label : "accessprofileDesc", permission : true},
    attachedUserGroups : {label : "Number of Organization Roles", permission: true},
    activeFl : {label : "Active / Inactive", permission: true}
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ accessProfileId: i + 1 }))

export interface IAccessProfileState {
    structure: IMongoListViewStructure
    data : IAccessProfileDataPayload
    orgRoleData :IOrganizationRoleDataPayload
    loading : boolean
    listLoading: {
        rows: boolean,
        columns: boolean
      }
      orgRoleCountListLoading:{
        rows: boolean,
        columns: boolean
      }
      personaList?: IPersonaList[],
      landingPageList?: ILandingPageList[],
}

const initialState: IAccessProfileState ={
    structure : {
        columns:dummyColumns,
        buttons:{}
    }, 
    data:{
        results :dummyResult,
        totalCount :0,
        clientBranchId:0,
        otherCount:0
    },
    loading: true,
    listLoading: {
        rows: true,
        columns: true
      },
      orgRoleData: {
        totalCount: 0,
        results: dummyResult
      },
      orgRoleCountListLoading:{
        rows: true,
        columns: true
      }
}

const AccessProfileListViewReducer =(
    state = initialState,
    action : AccessProfileActions
):IAccessProfileState => {
    switch (action.type) {
        case "@@accessProfile/SET_LOADING":
      return {
        ...state,
        loading: action.payload
      };

      case "@@accessProfile/FETCH_STRUCTURE_SUCCESS":
      return {
        ...state,
        structure: action.payload,
        listLoading: {
          ...state.listLoading,
          columns: false
        }
      };

      case "@@accessProfile/FETCH_DATA_SUCCESS":
      return {
        ...state,
        data: action.payload,
        loading: false,
        listLoading: {
          columns: false,
          rows: false
        }
      };

      case '@@accessProfile/SET_DATA':
      return {
        ...state,
        [action?.payload?.key]: action?.payload?.value
      };

      case '@@organizationRole/FETCH_DATA_SUCCESS':
      return {
        ...state,
        orgRoleData: action.payload,
        loading: false,
        listLoading: {
          columns: false,
          rows: false
        }
      };

      case '@@organizationRole/SET_DATA':
      return {
        ...state,
        [action?.payload?.key]: action?.payload?.value
      };

      case '@@organizationRole/SET_PERSONA': {
        let personlist = deepCopy(action.payload)
        personlist.forEach((personaData: { [x: string]: any; }) => {
          personaData['value'] = personaData['clientRefMasterDesc']
          personaData['label'] = personaData['clientRefMasterDesc']
          personaData['id'] && delete personaData['id']
          personaData['name'] && delete personaData['name']
        })
        return {
          ...state,
          personaList: personlist
        }
      };

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
      };

      default:
      return state;
    };
};

export default AccessProfileListViewReducer