import {IUatFormActions, IUatFormReducerState} from './UatForm.model'
export const initialState = {
    structure: {},
    loading: false,
    isEditMode: false,
    resetData: {
      moduleKey: 'uat',
      licenseType: ''
    }
}

export const UatFormReducer = (
    state: IUatFormReducerState = initialState,
    action: IUatFormActions): IUatFormReducerState => {
  
    switch (action.type) {
      case '@@uatForm/SET_STRUCTURE':
        return {
          ...state,
          structure: action.payload
        }

        case '@@uatForm/SET_LOADING':
          return {
            ...state,
            loading: action.payload
          }
    
        case '@@uatForm/SET_EDIT_MODE':
          return {
            ...state,
            isEditMode: action.payload
          }
    
        case '@@uatForm/SET_UAT_DATA':
          return {
            ...state,
            uatData: action.payload
          }
    
        case '@@uatForm/SET_FORM_RESET_DATA':
          return {
            ...state,
            resetData: action.payload
          }
    
        case '@@uatForm/RESET_INITIAL_STATE':
          return initialState
    
        default:
          return state
    }
  }

  export default UatFormReducer
