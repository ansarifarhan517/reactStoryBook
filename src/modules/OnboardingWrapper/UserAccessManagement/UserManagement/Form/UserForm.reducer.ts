import { IUserFormReducerState, IUserFormActions } from './UserForm.model';
export const initialState = {
  structure: {},
  loading: false,
  isEditMode: false,
  isDirty: false,
  resetData: {

    clientId: '',
    distributionCenter: '',
    userTimeZone: '',
    userGroupId: '',
    country: '',
    name: '',
    parentUserId: ''

  },
  isSubmitted: false
}

export const UserFormReducer = (
  state: IUserFormReducerState = initialState,
  action: IUserFormActions): IUserFormReducerState => {

  switch (action.type) {
    case '@@userForm/SET_STRUCTURE':
      return {
        ...state,
        structure: action.payload
      }

    case '@@userForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@userForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }

    case '@@userForm/SET_USER_DATA':
      return {
        ...state,
        userData: action.payload
      }

    case '@@userForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }

    case '@@userForm/SET_FORM_DIRTY_FLAG':
      return {
        ...state,
        isDirty: action.payload
      }

    case '@@userForm/SET_IS_SUBMIT':
      return {
        ...state,
        isSubmitted : action.payload
      }

    case '@@userForm/RESET_INITIAL_STATE':
      return initialState

    default:
      return state
  }
}