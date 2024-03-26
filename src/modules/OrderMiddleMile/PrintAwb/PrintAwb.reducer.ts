import { tMMOPrintAwbAction } from './PrintAwb.actions';
import { IMMOPrintAwbReduxState, MMOPrintAwbReduxInitialState } from './PrintAwb.models';

export const MMOPrintAwbReducer = (state: IMMOPrintAwbReduxState = MMOPrintAwbReduxInitialState, action: tMMOPrintAwbAction): IMMOPrintAwbReduxState => {
  switch (action.type) {
    case '@@MMO/PrintAwb/SET_TEMPLATE_OPTIONS':
      const templateOptionsMap = {}
      const templateOptionsData = action.payload.map((templateObject) => {
        return {...templateObject, orderHTML: templateObject.htmlData.orderHTML, itemHTML: templateObject.htmlData.itemHTML, crateHTML: templateObject.htmlData.crateHTML}
      })
      templateOptionsData.forEach((templateObj) => {
        templateOptionsMap[templateObj.id] = templateObj
      })

      return {
        ...state,
        templateOptionsMap,
        templateOptions: action.payload.map(({ id, name }) => ({ value: id, label: name }))
      }

    case '@@MMO/PrintAwb/SET_SELECTED_ORDERS_DETAILS':
      return { ...state, selectedOrderDetails: [...action.payload.reverse(), ...state.selectedOrderDetails] }

    case '@@MMO/PrintAwb/SET_LOADING':
      const newLoading = new Set(state.loading)
      if (action.payload.value) {
        newLoading.add(action.payload.key)
      } else {
        newLoading.delete(action.payload.key)
      }
      return { ...state, loading: newLoading }

    case '@@MMO/PrintAwb/RESET_DATA':
      return {
        ...state,
        selectedOrderDetails: []
      }
      
    default:
      return state
  }
}