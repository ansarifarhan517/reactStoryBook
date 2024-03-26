import { IOrganizationRoleFormReducerState, IOrganizationRoleFormActions } from './OrganizationRoleForm.model';
export const initialState = {
  structure: {},
  loading: false,
  isEditMode: false,
  isDirty: false,

  resetData: {

  }
}

export const OrganizationRoleFormReducer = (
  state: IOrganizationRoleFormReducerState = initialState,
  action: IOrganizationRoleFormActions): IOrganizationRoleFormReducerState => {

  switch (action.type) {
    case '@@organizationRoleForm/SET_STRUCTURE':
      return {
        ...state,
        structure: action.payload
      }

    case '@@organizationRoleForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@organizationRoleForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@organizationRoleForm/SET_ORGANIZATION_ROLE_DATA':
      return {
        ...state,
        organizationRoleData: action.payload
      }

    case '@@organizationRoleForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }

    case '@@organizationRoleForm/SET_ACCESSPROFILE_DATA':
      return {
        ...state,
        accessprofiledata: action.payload

      }

    case '@@organizationRoleForm/SET_FORM_DIRTY_FLAG':
      return {
        ...state,
        isDirty: action.payload
      }


    case '@@organizationRoleForm/RESET_INITIAL_STATE':
      return initialState

    default:
      return state
  }
}