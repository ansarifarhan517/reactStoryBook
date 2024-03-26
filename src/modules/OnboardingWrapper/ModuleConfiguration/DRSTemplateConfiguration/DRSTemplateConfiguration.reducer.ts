import { IMongoListViewStructure } from "../../../../utils/mongo/interfaces";
import { DRSTemplateConfigActions } from "./DRSTemplateConfiguration.actions";
import { IDrsTempConfigTagsAPIResponse, IDefaultTemplate, IDRSListDataPayload, IDrsTemplateFormData, IRowData } from "./DRSTemplateConfiguration.models";
import {replacingHtmlTagwithHtmlData} from './DRSTemplateConfiguration.utils'
export interface IDRSTemplateConfigState {
  structure: IMongoListViewStructure,
  loading: {
    listView: boolean;
    columns: boolean;
  },
  data: IDRSListDataPayload,
  drsTemplateConfigFormData: IDrsTemplateFormData
  isEditDrsTemplate: IRowData | undefined,
  defaultTemplates: Array<IDefaultTemplate>
  defaultSelectedTemplate: IDefaultTemplate
  tags: IDrsTempConfigTagsAPIResponse
}

export const dummyColumns: any = {
  drsTemplateDesc: { label: "DRS Template Description", permission: true },
  drsTemplateName: { label: "DRS Template Name", permission: true },
  isActiveFl: { label: "Active / Inactive", permission: true }
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ drsTemplateId: i + 1 }))

const initialState: IDRSTemplateConfigState = {
  structure: {
    columns: dummyColumns,
    buttons: {}
  },
  loading: {
    listView: false,
    columns: false
  },
  data: {
    totalCount: 0,
    results: dummyResult
  },
  isEditDrsTemplate: undefined,
  defaultTemplates: [],
  defaultSelectedTemplate: {
    isActiveFl: false,
    templateName: '',
    isDefault: false,
    htmlData: {
      tripHTML: '',
      orderHTML: '',
      itemHTML: '',
      crateHTML: '',
      customerHTML: ''
    }
  },
  drsTemplateConfigFormData: {
    templateId: 0,
    templateName: '',
    templateDesc: '',
    orderHTML: `<!DOCTYPE html>
        <html lang="en">
            <head>
                <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/JsBarcode.all.min.js"></script>
            </head>
            <body>
            </body>
        </html>`,
    crateHTML: '',
    itemHTML: '',
    tripHTML: '',
    customerHTML: '',
    htmlData: {
      tripHTML: '',
      orderHTML: '',
      crateHTML: '',
      itemHTML: '',
      customerHTML: ''
    }
  },
  tags: {
    id: '-1',
    tagGroupMappingList: [],
    dynamicTagKeys: []
  },


}

const DRSTemplateConfigurationReducer = (state = initialState, action: DRSTemplateConfigActions) => {
  switch (action.type) {
    case '@@drsTemplateConfig/SET_STRUCTURE':
      return {
        ...state,
        structure: action.payload
      }

    case '@@drsTemplateConfig/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }
    case '@@drsTemplateConfig/SET_COLUMNS_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }

      }

    case '@@drsTemplateConfig/FETCH_DATA_SUCCESS':
      return {
        ...state,
        data: {
          ...action.payload
        }
      }

    case '@@drsTemplateConfig/SET_FORM_DATA':
      return {
        ...state,
        drsTemplateConfigFormData: {
          ...state.drsTemplateConfigFormData,
          [action?.payload.key]: action.payload.value
        }

      }
    case '@@drsTemplateConfig/SET_DATA':
      return {
        ...state,
        [action.payload.key]: action.payload.value
      }
    case '@@drsTemplateConfig/SET_DEFAULT_TEMPLATE_LIST':
      return {
        ...state,
        defaultTemplates: action.payload
      }
    case '@@drsTemplateConfig/SET_DEFAULT_SELECTED_TEMPLATE':
      return {
        ...state,
        defaultSelectedTemplate: { ...action.payload }
      }
    case '@@drsTemplateConfig/INITIALISE_FORM':
      return {
        ...state,
        drsTemplateConfigFormData: {
          templateId: 0,
          templateName: '',
          templateDesc: '',
          orderHTML: '',
          crateHTML: '',
          itemHTML: '',
          tripHTML: '',
          customerHTML: '',
          htmlData: {
            orderHTML: '',
            crateHTML: '',
            itemHTML: '',
            tripHTML: '',
            customerHTML: ''
          }
        },
        isEditDrsTemplate: undefined
      }
    case '@@drsTemplateConfig/SET_TAGS':
      return {
        ...state,
        tags: action.payload
      }
    case '@@drsTemplateConfig/SET_DRS_TEMPLATE_DETAILS_DATA':
      action.payload = { ...action.payload, orderHTML: action.payload?.htmlData?.orderHTML, crateHTML: action.payload?.htmlData?.crateHTML, itemHTML: action.payload?.htmlData?.itemHTML, tripHTML: action.payload?.htmlData?.tripHTML, customerHTML: action.payload?.htmlData?.customerHTML }
      replacingHtmlTagwithHtmlData(action.payload)
      state.tags.dynamicTagKeys.forEach((key) => {
        action.payload.orderHTML = action.payload.orderHTML.replaceAll(key.dynamicTagKey, `@${key.dynamicTagLabelValue}`)
      });
      return {
        ...state,
        drsTemplateConfigFormData: {
          ...state.drsTemplateConfigFormData,
          ...action.payload
        }
      }

    default:
      return state
  }
}

export default DRSTemplateConfigurationReducer