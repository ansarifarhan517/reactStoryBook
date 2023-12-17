import { tGlobalsAction, IGlobalsState } from './globals.actions';

const initialState: IGlobalsState = {
  clientBranches: [],
  maintenanceMsg: '',
  metrics: {}
}

const GlobalsReducer = (state: IGlobalsState = initialState, action: tGlobalsAction): IGlobalsState => {
  switch (action.type) {
    case '@@globals/SET_DATA':
      return { ...state, ...action.payload }

    case '@@globals/SET_CLIENT_BRANCH_DATA':
       return {...state, ...action.payload}
 

    default: return state
  }
}

export default GlobalsReducer