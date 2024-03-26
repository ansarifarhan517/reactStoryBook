import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { AlertMessageActions } from './AlertMessage.actions';
import {
  IAlertMessageTemplateListDataPayload,
  IAlertMessageFormData,
  ISelectedTemplate,
  IRowData,
  IDefaultTemplatePayloadData,
  IDefaultTemplate
} from './AlertMessage.models';

export interface IAlertMessageState {
  structure: IMongoListViewStructure;
  data: IAlertMessageTemplateListDataPayload;
  isEditAlertMessage: IRowData | undefined;
  alertMessageFormData: IAlertMessageFormData,
  selectedTemplate: ISelectedTemplate,
  defaultTemplates: IDefaultTemplatePayloadData | [],
  defaultSelectedTemplate: IDefaultTemplate,
  loading: {
    listView: boolean;
    columns: boolean;
  };
  isUpdate: boolean;
  isLoading: boolean;
}

const initialState: IAlertMessageState = {
  structure: {
    columns: {},
    buttons: {},
  },
  data: {
    totalCount: 0,
    results: [],
  },
  isEditAlertMessage: undefined,
  defaultTemplates: [],
  defaultSelectedTemplate: {
    isActiveFl: false,
    structureReferenceId: '',
    isDefault: false,
    htmlData: ""
  },
  alertMessageFormData: {
    emailTemplateId: 0,
    emailTemplateName: '',
    emailTemplateDesc: '',
    htmlData: ''
  },
  loading: {
    listView: false,
    columns: false,
  },
  selectedTemplate: {
    clientId: 0,
    emailTemplateDesc: "",
    emailTemplateId: 0,
    emailTemplateName: "",
    htmlData: "",
    isActiveFl: false,
    isDeleteFl: "",
    structureRefernceId: "",
    isDefault: false
  },
  isUpdate: false,
  isLoading: false
};

const AlertMessageReducer = (
  state = initialState,
  action: AlertMessageActions
): IAlertMessageState => {
  switch (action.type) {
    case '@@alertMessage/FETCH_LISTVIEW_STRUCTURE_SUCCESS':
      return {
        ...state,
        structure: action.payload,
      };

    case '@@alertMessage/FETCH_ALERT_TEMPLATE_LIST_SUCCESS':
      return {
        ...state,
        data: { ...action.payload },
      };
    case '@@alertMessage/SET_ALERT_MESSAGE_FORM_DATA' : 
    return {
      ...state,
      alertMessageFormData: {...state.alertMessageFormData, [action?.payload.key]: action.payload.value }
    };

    case "@@alertMessage/FETCH_TEMPLATE_BY_ID_SUCCESS" :
      return {
        ...state,
        selectedTemplate: { ...state.selectedTemplate, ...action.payload }
      }

    case "@@alertMessage/RESET_SELECTED_TEMPLATE":
      return {
        ...state,
        selectedTemplate: {
          clientId: 0,
          emailTemplateDesc: "",
          emailTemplateId: 0,
          emailTemplateName: "",
          htmlData: "",
          isActiveFl: false,
          isDeleteFl: "",
          structureRefernceId: "",
          isDefault: false
        }
      }
    case "@@alertMessage/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS":
      return {
        ...state,
        defaultTemplates: action.payload
      }

    case "@@alertMessage/SET_DEFAULT_SELECTED_TEMPLATE":
      return {
        ...state,
        defaultSelectedTemplate: {...action.payload}
      }
    case '@@alertMessage/SET_DATA':
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case '@@alertMessage/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

      case '@@alertMessage/SET_UPDATE':
        return {
          ...state,
          isUpdate: action.payload
        };

    case '@@alertMessage/SET_COLUMNS_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case '@@alertMessage/SET_FORM_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case "@@alertMessage/RESET_FORMDATA":
      return {
        ...state,
        alertMessageFormData: {
          emailTemplateId: 0,
          emailTemplateName: '',
          emailTemplateDesc: '',
          htmlData: ''
        },
        selectedTemplate: {
          clientId: 0,
          emailTemplateDesc: "",
          emailTemplateId: 0,
          emailTemplateName: "",
          htmlData: "",
          isActiveFl: false,
          isDeleteFl: "",
          structureRefernceId: "",
          isDefault: false
        },
        isEditAlertMessage:undefined
      }

    default:
      return state;
  }
};

export default AlertMessageReducer;
