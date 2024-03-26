import { IConsentStatusReportFormActions } from "./ConsentStatusReportForm.action";
import { IConsentStatusReportReducerState } from "./ConsentStatusReportForm.models";

const intialState: IConsentStatusReportReducerState = {
  structure: {},
  loading: false,
  formData: {},
  pageName :"",
};

export const ConsentStatusReportFormReducer = (
  state = intialState,
  action: IConsentStatusReportFormActions
) => {
  switch (action.type) {
    case "@@consentStatusReportForm/FETCH_STRUCTURE":
      return {
        ...state,
        loading: true,
      };
    case "@@consentStatusReportForm/SET_STRUCTURE":
      return {
        ...state,
        loading: false,
        structure: action.payload,
      };
    case "@@consentStatusReportForm/SET_FORM_DATA":
      return {
        ...state,
        loading: false,
        formData: action.payload,
      };

    case "@@consentStatusReportForm/SET_PAGE_NAME" :
      return{
        ...state,
        pageName : action.payload
      }
   
    default:
      return {
        ...state,
      };
  }
};
