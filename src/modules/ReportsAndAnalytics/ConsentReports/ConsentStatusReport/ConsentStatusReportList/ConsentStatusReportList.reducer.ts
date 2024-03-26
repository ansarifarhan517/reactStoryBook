import {renderCustomFormFields } from "../../../../../utils/mongo/ListView";
import { IConsentStatusReportListActions } from "./ConsentStatusReportList.actions";
import { IConsentStatusReportListState, ICustomField } from "./ConsentStatusReportList.models";



const intialState: IConsentStatusReportListState = {
  structure: {
    columns: {},
    buttons: {},
  },
  loading: {
    listView: false,
    columns: false,
  },
  data: {
    totalCount: 0,
    results: [],
  },
};

export const ConsentStatusReportListReducer = (
  state = intialState,
  action: IConsentStatusReportListActions
) => {
  switch (action.type) {
    case "@@consentStatusReportList/FETCH_STRUCTURE":
      return {
        ...state,
        loading: {
          listView: true,
          columns: true,
        },
      };
    case "@@consentStatusReportList/SET_STRUCTURE":
      const columns = action.payload.columns
      for(let key in columns ){
        if(columns[key].fieldType == "TextArea"){
          console.log(key,'text area')
          delete   columns[key]
        }
      }
      return {
        ...state,
        loading: {
          listView: false,
          columns: false,
        },
        structure: {
          ...state.structure,
          columns : columns
        }
      };

    case "@@consentStatusReportList/SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };
    case "@@consentStatusReportList/SET_COLUMNS_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };
    case "@@consentStatusReportList/FETCH_DATA_SUCCESS":
      let count = action?.payload?.totalCount;
      const results = action?.payload?.results.map((row,index) => {
        const rowObj = {...row , reportId:index}
        if (row?.responseData) {
          const customFields: ICustomField[] = JSON.parse(row?.responseData)
          customFields.forEach((customField) => {
            const { key } = customField
            rowObj[`cf_${key}`] = renderCustomFormFields(customField, state.structure.columns?.[key], action.payload.clientProperties || {})
          })
        }
      
        return rowObj
      })
      return {
        ...state,
        data: {
          ...state.data,
          totalCount: count,
          results : results
        },
      }
    case '@@consentStatusReportList/RESET_STATE' :
      return  intialState
    default:
      return {
        ...state,
      };
  }
};
