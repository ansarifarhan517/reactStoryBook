import { IEditDetails } from './../../../utils/mongo/interfaces';
import { CustomFormsActions } from './CustomForms.actions';
import { IMongoListViewStructure, IMongoFormStructure } from '../../../utils/mongo/interfaces';
import { accountNames, dropDownOptions, IAccountNames, ICustomFormData, ICustomFormsDataPayload, IDropDownOptions, ITriggerEventsStructure } from './CustomForms.models';
import { deepCopy } from '../../../utils/helper';


export interface ICustomFormsState {
  structure: IMongoListViewStructure
  data: ICustomFormsDataPayload
  editDetails: IEditDetails
  loading: {
    listView: boolean
  },
  viewType: string,
  form: {
    structure: IMongoFormStructure,
    triggerEventsList: ITriggerEventsStructure[],
    loading: boolean,
    customFormData: ICustomFormData,
    isFormEditable: boolean,
    isDisableSaveButton:boolean
  },
  lookup: {
    orderTypes: IDropDownOptions[],
    orderStates: IDropDownOptions[]
    orderLocations: IDropDownOptions[],
    triggerElements: IDropDownOptions[],
    serviceTypes: IDropDownOptions[],
    deliveryTypes: IDropDownOptions[],
    subClients: IAccountNames[]
  }
}

export const dummyColumns: any = {
  formName: { label: "Form Name", permission: true },
  userGroupName: { label: "User Group", permission: true },
  triggerEvents: { label: "Trigger Events", permission: true },
}
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ customFormGroupId: i + 1 }))
const initialState: ICustomFormsState = {
  structure: {
    columns: dummyColumns,
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  editDetails: {},
  loading: {
    listView: false
  },
  viewType: 'list-view',
  form: {
    structure: {
      columns: {},
      buttons: {}
    },
    triggerEventsList: [],
    customFormData: {
      customFormGroupId: 0,
      formName: '',
      formDescription: '',
      userGroupId: 0,
      userGroupName: '',
      triggerEventsData: [],
      structure: {
        columns: {},
        buttons: {}
      }
    },
    loading: false,
    isFormEditable: false,
    isDisableSaveButton:false
  },
  lookup: {
    orderTypes: dropDownOptions,
    orderStates: dropDownOptions,
    orderLocations: dropDownOptions,
    triggerElements: dropDownOptions,
    serviceTypes: dropDownOptions,
    deliveryTypes: dropDownOptions,
    subClients: accountNames
  }
}

const CustomFormsReducer = (state = initialState, action: CustomFormsActions): ICustomFormsState => {
  switch (action.type) {
    case '@@customForms/FETCH_STRUCTURE_SUCCESS':
      return {
        ...state,
        structure: action.payload
      }

    case '@@customForms/FETCH_DATA_SUCCESS':
      const results = action.payload.results.map((row) => {
        if (row['triggerEvents']) {
          row['triggerEventsData'] = row['triggerEvents']
          row['triggerEvents'] = row['triggerEvents'].length
        }
        const rowObj = row
        rowObj.editIconButtonProps = {
          "style": {
            'backgroundImage': "url('images/eye_blue.svg')",
            'backgroundSize': 'contain',
            'height': '17px',
            'width': '17px',
            'margin': '0px 5px 8px'
          },
          "title": "Preview"
        }
        return rowObj
      })

      return {
        ...state,
        data: {
          ...action.payload,
          results
        }
      }

    case '@@customForms/UPDATE_DATA':
      const { customFormGroupId: updateCustomFormGroupId, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.customFormGroupId === updateCustomFormGroupId ? { ...row['triggerEventsData'], ...rest } : row['triggerEventsData'])
        }
      }

    case '@@customForms/SET_EDIT_DETAILS':
      const { rowId, columnId, value, hasError } = action.payload
      return {
        ...state,
        editDetails: {
          ...state.editDetails,
          [rowId]: {
            ...state.editDetails?.[rowId],
            [columnId]: {
              value,
              hasError
            }
          }
        }
      }

    case '@@customForms/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@customForms/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@customForms/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }
    case '@@customForms/SET_VIEW_TYPE':
      return {
        ...state,
        viewType: action.payload
      }
    case '@@customForms/FETCH_FORM_STRUCTURE_SUCCESS':
      let triggerStructure = deepCopy(action.payload['triggerEvents']);
        const { triggerEvents } = triggerStructure;
        let childNodes = {};
        childNodes = Object.keys(triggerEvents?.['childNodes']).reduce((obj, field) => {
          if (field === 'isMandatory') {
            obj[field] = { ...triggerEvents['childNodes'][field], value: 'Y' }

          } else {
            obj[field] = { ...triggerEvents['childNodes'][field] }
          }
          return obj;
        }, {});

        let triggerEventStructure = Object.keys(action.payload['triggerEvents']['triggerEvents']).reduce((obj, field) => {
          if (field === 'childNodes') {
            obj[field] = { ...childNodes }
          } else {
            obj[field] = action.payload['triggerEvents']['triggerEvents'][field]
          }
          return obj;
        }, {});

        triggerEventStructure = { triggerEvents: triggerEventStructure }
        const updatedStructure = { ...action.payload, triggerEvents: triggerEventStructure }
      return {
        ...state,
        form: { ...state.form, structure: updatedStructure }
      }

    case '@@customForms/SET_TRIGGER_EVENTS_LIST':
      return {
        ...state,
        form: { ...state.form, triggerEventsList: action.payload }
      }
    case '@@customForms/SET_FORM_LOADING':
      return { ...state, form: { ...state.form, loading: action.payload } }

      case '@@customForms/DISABLE_SAVE_BUTTON':
        return { ...state, form: { ...state.form, isDisableSaveButton: action.payload } }

    case '@@customForms/FETCH_TRIGGER_EVENTS_BY_ID_SUCCESS':
      return { ...state, form: { ...state.form, loading: true, customFormData: { ...state.form.customFormData, ...action.payload } } }

    case '@@customForms/SET_TRIGGER_EVENTS_DATA':
      return { ...state, form: { ...state.form, loading: true, customFormData: { ...state.form.customFormData, triggerEventsData: action.payload } } }

    case "@@customForms/SET_FORM_EDITABLE":
      return { ...state, form: { ...state.form, isFormEditable: action.payload } }

    case '@@customForms/FETCH_ORDER_TYPES_SUCCESS':
      return { ...state, lookup: { ...state.lookup, orderTypes: action.payload } }

    case '@@customForms/FETCH_ORDER_STATES_SUCCESS':
      return { ...state, lookup: { ...state.lookup, orderStates: action.payload } }

    case '@@customForms/FETCH_ORDER_LOCATIONS_SUCCESS':
      return { ...state, lookup: { ...state.lookup, orderLocations: action.payload } }

    case '@@customForms/FETCH_TRIGGER_ELEMENTS_SUCCESS':
      return { ...state, lookup: { ...state.lookup, triggerElements: action.payload } }

    case '@@customForms/FETCH_SERVICE_TYPES_SUCCESS':
      return { ...state, lookup: { ...state.lookup, serviceTypes: action.payload } }

    case '@@customForms/FETCH_DELIVERY_TYPES_SUCCESS':
      return { ...state, lookup: { ...state.lookup, deliveryTypes: action.payload } }

    case '@@customForms/FETCH_ACCOUNT_NAMES_SUCCESS':
      return { ...state, lookup: { ...state.lookup, subClients: action.payload } }

    default:
      return state
  }
}

export default CustomFormsReducer