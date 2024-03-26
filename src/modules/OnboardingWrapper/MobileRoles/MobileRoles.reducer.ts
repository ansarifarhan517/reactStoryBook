import { IMongoFormStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IMobileRolesActions } from "./MobileRoles.actions";
import { IAccessProfileList, IMobileOrgRole, IMobileRoleListDataPayload, mobileRoleData } from "./MobileRoles.models";
export interface IMobileRolesState {
    listview: {
        isColumnLoading: boolean;
        isListViewLoading: boolean;
        structure: IMongoListViewStructure;
        data: IMobileRoleListDataPayload;
        mobileRolesListView: {
            isColumnLoading: boolean;
            isListViewLoading: boolean;
            structure: IMongoListViewStructure;
            data: IMobileRoleListDataPayload;
        }
    },
    form: {
        loading: boolean;
        structure: IMongoFormStructure;
        isEditMode: boolean;
    },
    viewType: string;
    mobileRole: IMobileOrgRole;
    accessProfiles: IAccessProfileList[];
    orgRoleId: number;
}

const initialState: IMobileRolesState = {
    listview: {
        isColumnLoading: false,
        isListViewLoading: false,
        structure: {
            columns: {},
            buttons: {},
        },
        data: {
            totalCount: 0,
            results: []
        },
        mobileRolesListView: {
            isColumnLoading: false,
            isListViewLoading: false,
            structure: {
                columns: {},
                buttons: {},
            },
            data: {
                totalCount: 0,
                results: []
            }
        }
    },
    form: {
        loading: false,
        structure: {
            columns: {},
            buttons: {},
        },
        isEditMode: false
    },
    viewType: 'list-view',
    mobileRole: {
        orgRoleId: 0,
        orgRoleRefId: '',
        activeFl: false,
        orgRoleName: '',
        orgRoleDescription: '',
        orgRoleLandingPage: '',
        clientId: 0,
        isSSOMandatoryFl: false,
        orgRoleAccessProfile: [{
            mappingId: 0,
            userGroupId: 0,
            accessProfileId: 0,
            accessProfileReferenceId: ''
        }],
        locked: false,
        validationStatusCode: 0,
        defaultAccess: false,
    },
    accessProfiles: [],
    orgRoleId: 0
}

const MobileRolesReducer = (
    state = initialState,
    action: IMobileRolesActions
): IMobileRolesState => {

    switch (action.type) {
        case '@@mobileRoles/SET_EDIT_MODE':
            return { ...state, form: { ...state.form, isEditMode: action.payload } }
        case '@@mobileRoles/FETCH_LISTVIEW_STRUCTURE':
            return { ...state, listview: { ...state.listview, isColumnLoading: true } }

        case '@@mobileRoles/FETCH_MOBILE_ROLE_LIST':
            return { ...state, listview: { ...state.listview, isListViewLoading: true } }
        case '@@mobileRoles/FETCH_MOBILE_ROLE_FORM_STRUCTURE':
            return { ...state, form: { ...state.form, loading: true } }

        case '@@mobileRoles/FETCH_LISTVIEW_STRUCTURE_SUCCESS':
            return { ...state, listview: { ...state.listview, structure: action.payload, isColumnLoading: false } }

        case '@@mobileRoles/FETCH_MOBILE_ROLE_LIST_SUCCESS':
            return { ...state, listview: { ...state.listview, data: action.payload, isListViewLoading: false } }

        case '@@mobileRoles/FETCH_MOBILE_ROLE_FORM_STRUCTURE_SUCCESS':
            return { ...state, form: { ...state.form, structure: action.payload, loading: false } }

        case '@@mobileRoles/SET_VIEW_TYPE':
            return { ...state, viewType: action.payload }

        case '@@mobileRoles/GET_MOBILE_ROLE_BY_ID_SUCCESS':
            return { ...state, mobileRole: action.payload }

        case '@@mobileRoles/RESET_MOBILE_ROLE_DATA':
            return { ...state, mobileRole: mobileRoleData }

        case '@@mobileRoles/FETCH_ACCESS_PROFILES_SUCCESS': 
            return {...state, accessProfiles: action.payload }        
        
        case '@@mobileRoles/SET_ORG_ROLE_ID':
            return {...state, orgRoleId: action.payload }            

        case '@@mobileRoles/FETCH_MOBILE_USERS_LISTVIEW_STRUCTURE':
            return { ...state, listview: { ...state.listview, mobileRolesListView: { ...state.listview.mobileRolesListView, isColumnLoading: true } } }
        case '@@mobileRoles/FETCH_MOBILE_USERS_LISTVIEW_STRUCTURE_SUCCESS':
            return { ...state, listview: { ...state.listview, mobileRolesListView: { ...state.listview.mobileRolesListView, structure: action.payload, isColumnLoading: false } } }
        case '@@mobileRoles/FETCH_MOBILE_ROLES_BY_ORG_ROLE_ID':
            return { ...state, listview: { ...state.listview, mobileRolesListView: { ...state.listview.mobileRolesListView, isListViewLoading: true } } }
        case '@@mobileRoles/FETCH_MOBILE_ROLES_BY_ORG_ROLE_ID_SUCCESS':
            return { ...state, listview: { ...state.listview, mobileRolesListView: { ...state.listview.mobileRolesListView, data: action.payload, isListViewLoading: false } } }
        default:
            return state;
    }
}

export default MobileRolesReducer;