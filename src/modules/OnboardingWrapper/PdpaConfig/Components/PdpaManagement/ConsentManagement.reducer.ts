
import { ConsentManagementActions } from "./ConsentManagement.action";
import {
  IConsentManagementListData,
  IConsentManagementListDataPayload,
  IConsentManagementState,
} from "./ConsentManagement.models";

const initialState: IConsentManagementState = {
  listview: {
    data: {} as IConsentManagementListDataPayload,
    uniquePersonas: [] as string[],
    loading: false,
    activeConsentData: {} as IConsentManagementListData,
    isAddConsentEnabled: true,
  },
};

const ConsentManagementReducer = (
  state = initialState,
  action: ConsentManagementActions
): IConsentManagementState => {
  switch (action.type) {
    case "@@consentManagement/FETCH_CONSENT_TYPE_DETAILS_LISTVIEW":
      return {
        ...state,
        listview: {
          ...state.listview,
          loading: true,
        },
      };
    case "@@consentManagement/FETCH_CONSENT_TYPE_DETAILS_LISTVIEW_SUCCESS":
      return {
        ...state,
        listview: {
          ...state.listview,
          loading: false,
          data: action.payload,
        },
      };
    case "@@consentManagement/RESET_CONSENT_MANAGEMENT_DATA":
      return {
        ...state,
        listview: {
          data: {} as IConsentManagementListDataPayload,
          uniquePersonas: [] as string[],
          loading: false,
          activeConsentData: {} as IConsentManagementListData,
          isAddConsentEnabled: true,
        },
      };
    case "@@consentManagement/SAVE_CONSENT_ACTIVE_FIELD_DATA":
      return {
        ...state,
        listview: {
          ...state.listview,
          activeConsentData: action.payload,
        },
      };
    case "@@consentManagement/RESET_ACTIVE_FIELD_DATA":
      return {
        ...state,
        listview: {
          ...state.listview,
          activeConsentData: {} as IConsentManagementListData,
        },
      };
    case "@@consentManagement/TOGGLE_CONSENT_ACTION":
      return {
        ...state,
        listview: {
          ...state.listview,
          isAddConsentEnabled: action.payload,
        },
      };

    default:
      return state;
  }
};

export default ConsentManagementReducer


