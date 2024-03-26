import { IMongoListViewStructure } from "../../../utils/mongo/interfaces"
import { AWBLabelConfigActions } from "./AWBLabelConfiguration.actions"
import { IAWBListDataPayload, IRowData, IAwbTemplateFormData, IDefaultTemplate, IAwbLabelConfigTagsAPIResponse, IPropertyType } from "./AWBLabelConfiguration.models"

export interface IAwbLabelConfigState {
    structure: IMongoListViewStructure,
    data: IAWBListDataPayload,
    isEditAwbLabel: IRowData | undefined,
    loading: {
      listView: boolean;
      columns:boolean;
    },
    isLoading: boolean
    awbLabelConfigFormData: IAwbTemplateFormData
    defaultSelectedTemplate: IDefaultTemplate
    defaultTemplates: Array<IDefaultTemplate> 
    tags: IAwbLabelConfigTagsAPIResponse
    propertyType: IPropertyType
}

export const dummyColumns: any = {
    awbTemplateDesc: {label: "AWB Template Description", permission: true},
    awbTemplateName: {label: "AWB Template Name", permission: true},
    isActiveFl: {label: "Active / Inactive",permission: true}
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({awbTemplateId: i + 1 }))

const initialState: IAwbLabelConfigState = {
    structure: {
      columns: dummyColumns,
      buttons: {}
    },
    data: {
      totalCount: 0,
      results: dummyResult
    },
    isEditAwbLabel: undefined,
    loading: {
      listView: false,
      columns: false
    },
    isLoading: false,
    awbLabelConfigFormData: {
        awbTemplateId: 0,
        awbTemplateName: '',
        awbTemplateDesc: '',
        orderHTML: `<!DOCTYPE html>
        <html lang="en">
            <head>
                <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/JsBarcode.all.min.js"></script>
            </head>
            <body>
                <div style="width:auto; border:1px solid white;">
                    <svg class="awbBarcode-@Order Number-BarcodePlaceHolder"></svg>
                    <div style="font-family: HelveticaNeue-bold !important;font-size: 14px !important;line-height: 14px;font-weight:bold;font-style:normal;text-align:left;margin-left:7px; ">
                        Order No. : @Order Number</div>
                        <p>@Deliver Customer Name</p>
                </div>
                <script>
                    JsBarcode('.awbBarcode-@Order Number-BarcodePlaceHolder', '@Order Number', { displayValue: false, height: 70, width: 1 });
                </script>
            </body>
        </html>`,
        crateHTML: '',
        itemHTML: '',
        htmlData: {
            orderHTML: '',
            crateHTML: '',
            itemHTML: '',
        }
    },
    defaultSelectedTemplate: {
        isActiveFl: false,
        awbTemplateName: '',
        isDefault: false,
        htmlData: {
            orderHTML: '',
            itemHTML: '',
            crateHTML: ''
        }
    },
    defaultTemplates: [],
    tags: {
        id: '-1',
        tagGroupMappingList: [],
        dynamicTagKeys: []
      },
      propertyType: {
        clientId: 0,
        clientPropertyId: 0,
        createdByUserId: 0,
        createdOnDt: 0,
        isActiveFl: false,
        isDeleteFl: '',
        propertyKey: '',
        propertyValue: '',
        updatedByUserId: 0,
        updatedOnDt: 0
      }
}

const AwbLabelConfigurationReducer = (state = initialState, action: AWBLabelConfigActions): IAwbLabelConfigState => {
    switch (action.type) { 
        case '@@awbLabelConfig/FETCH_STRUCTURE_SUCCESS':
            return {
                ...state,
                structure: action.payload
            }

        case '@@awbLabelConfig/FETCH_DATA_SUCCESS':
            return {
                ...state,
                data: {
                ...action.payload
                }
            }

        case '@@awbLabelConfig/SET_LOADING':
            return {
                ...state,
                loading: {
                ...state.loading,
                ...action.payload
                }
            }

        case '@@awbLabelConfig/SET_COLUMNS_LOADING':
            return {
                ...state,
                loading: {
                ...state.loading,
                ...action.payload
                }
            }

        case '@@awbLabelConfig/SET_FORM_DATA' : 
            return {
                ...state,
                awbLabelConfigFormData: {
                    ...state.awbLabelConfigFormData,
                    [action?.payload.key]: action.payload.value
                }
  
            }

        case "@@awbLabelConfig/SET_DEFAULT_SELECTED_TEMPLATE":
            return {
                ...state,
                defaultSelectedTemplate: {...action.payload}
            }

        case '@@awbLabelConfig/FETCH_TAGS_SUCCESS':
            return {
                ...state,
                tags: action.payload
            }

        case '@@awbLabelConfig/SET_DATA':
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }

        case '@@awbLabelConfig/SET_AWB_TEMPLATE_DETAILS_DATA':
            action.payload = {...action.payload, orderHTML: action.payload?.htmlData?.orderHTML, crateHTML: action.payload?.htmlData?.crateHTML, itemHTML: action.payload?.htmlData?.itemHTML}
            if (action.payload.orderHTML.includes('<Crate />')) {
                if (action.payload.crateHTML.includes('<Item />')) {
                    action.payload.crateHTML = action.payload.crateHTML.replace('<Item />', `<Item>${action.payload.itemHTML}</Item>`)
                }
                action.payload.orderHTML = action.payload.orderHTML.replace('<Crate />', `<Crate>${action.payload.crateHTML}</Crate>`)
            }
            state.tags.dynamicTagKeys.forEach((key) => {
                action.payload.orderHTML = action.payload.orderHTML.replaceAll(key.dynamicTagKey, `@${key.dynamicTagLabelValue}`)
            });
            return {
                ...state,
                awbLabelConfigFormData: {
                    ...state.awbLabelConfigFormData,
                    ...action.payload
                }
            }

        case '@@awbLabelConfig/SET_FORM_LOADING':
            return {
                ...state,
                isLoading: action.payload
            }

        case '@@awbLabelConfig/INITIALISE_FORM':
            return {
                ...state,
                awbLabelConfigFormData: {
                    awbTemplateId: 0,
                    awbTemplateName: '',
                    awbTemplateDesc: '',
                    orderHTML: `<!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/JsBarcode.all.min.js"></script>
                        </head>
                        <body>
                            <div style="width:auto; border:1px solid white;">
                                <svg class="awbBarcode-@Order Number-BarcodePlaceHolder"></svg>
                                <div style="font-family: HelveticaNeue-bold !important;font-size: 14px !important;line-height: 14px;font-weight:bold;font-style:normal;text-align:left;margin-left:7px; ">
                                    Order No. : @Order Number</div>
                                    <p>@Deliver Customer Name</p>
                            </div>
                            <script>
                                JsBarcode('.awbBarcode-@Order Number-BarcodePlaceHolder', '@Order Number', { displayValue: false, height: 70, width: 1 });
                            </script>
                        </body>
                    </html>`,
                    crateHTML: '',
                    itemHTML: '',
                    htmlData: {
                        orderHTML: '',
                        crateHTML: '',
                        itemHTML: '',
                    }
                },
                isEditAwbLabel: undefined
            }

        case "@@awbLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS":
            return {
                ...state,
                defaultTemplates: action.payload
            }

        case '@@awbLabelConfig/FETCH_PROPERTY_TYPE_SUCCESS':
            return {
                ...state,
                propertyType: action.payload
            }
    
        default:
            return state
    }
}

export default AwbLabelConfigurationReducer
