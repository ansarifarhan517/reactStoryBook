import { IMongoListViewStructure } from "../../../utils/mongo/interfaces"
import { ManifestLabelConfigActions } from "./ManifestLabelConfiguration.actions"
import { IAWBListDataPayload, IRowData, IManifestTemplateFormData, IDefaultTemplate, IManifestLabelConfigTagsAPIResponse, IPropertyType } from "./ManifestLabelConfiguration.models"

export interface IManifestLabelConfigState {
    structure: IMongoListViewStructure,
    data: IAWBListDataPayload,
    isEditManifestLabel: IRowData | undefined,
    loading: {
      listView: boolean;
      columns:boolean;
    },
    isLoading: boolean
    manifestLabelConfigFormData: IManifestTemplateFormData
    defaultSelectedTemplate: IDefaultTemplate
    defaultTemplates: Array<IDefaultTemplate> 
    tags: IManifestLabelConfigTagsAPIResponse
    propertyType: IPropertyType
}

export const dummyColumns: any = {
    awbTemplateDesc: {label: "Template Description", permission: true},
    awbTemplateName: {label: "Template Name", permission: true},
    isActiveFl: {label: "Active / Inactive",permission: true}
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({awbTemplateId: i + 1 }))

const initialState: IManifestLabelConfigState = {
    structure: {
      columns: dummyColumns,
      buttons: {}
    },
    data: {
      totalCount: 0,
      results: dummyResult
    },
    isEditManifestLabel: undefined,
    loading: {
      listView: false,
      columns: false
    },
    isLoading: false,
    manifestLabelConfigFormData: {
        templateId: 0,
        templateName: '',
        templateDesc: '',
        orderHTML: `<!DOCTYPE html>
        <html lang="en">
            <head>
                <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/JsBarcode.all.min.js"></script>
            </head>
            <body>
                <div style="width:auto; border:1px solid white;">
                    <svg class="manifestBarcode"></svg>
                    <div style="font-family: HelveticaNeue-bold !important;font-size: 14px !important;line-height: 14px;font-weight:bold;font-style:normal;text-align:left;margin-left:7px; ">
                        Order No. : @Order Number</div>
                        <p>@Deliver Customer Name</p>
                </div>
                <script>
                    JsBarcode('.manifestBarcode', '@Order Number', { displayValue: false, height: 70, width: 1 });
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
        templateName: '',
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

const ManifestLabelConfigurationReducer = (state = initialState, action: ManifestLabelConfigActions): IManifestLabelConfigState => {
    switch (action.type) { 
        case '@@manifestLabelConfig/FETCH_STRUCTURE_SUCCESS':
            // action.payload.columns = {...action.payload.columns, isFavourite : {
            //     allowed: true,
            //     childLength: 0,
            //     childNodes: {},
            //     colSpan: 1,
            //     customField: false,
            //     editable: false,
            //     excelDropDownHidden: false,
            //     fieldName: " ",
            //     fieldType: "text",
            //     id: "isFavourite",
            //     options: [],
            //     infoFlag: false,
            //     label: "",
            //     labelKey: "",
            //     permission: true,
            //     required: false,
            //     rowSpan: 1,
            //     searchable: false,
            //     sortable: false
            // }}
            return {
                ...state,
                structure: action.payload
            }

        case '@@manifestLabelConfig/FETCH_DATA_SUCCESS':
            return {
                ...state,
                data: {
                ...action.payload
                }
            }

        case '@@manifestLabelConfig/SET_LOADING':
            return {
                ...state,
                loading: {
                ...state.loading,
                ...action.payload
                }
            }

        case '@@manifestLabelConfig/SET_COLUMNS_LOADING':
            return {
                ...state,
                loading: {
                ...state.loading,
                ...action.payload
                }
            }

        case '@@manifestLabelConfig/SET_FORM_DATA' : 
            return {
                ...state,
                manifestLabelConfigFormData: {
                    ...state.manifestLabelConfigFormData,
                    [action?.payload.key]: action.payload.value
                }
  
            }

        case "@@manifestLabelConfig/SET_DEFAULT_SELECTED_TEMPLATE":
            return {
                ...state,
                defaultSelectedTemplate: {...action.payload}
            }

        case '@@manifestLabelConfig/FETCH_TAGS_SUCCESS':
            return {
                ...state,
                tags: action.payload
            }

        case '@@manifestLabelConfig/SET_DATA':
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }

        case '@@manifestLabelConfig/SET_AWB_TEMPLATE_DETAILS_DATA':
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
                manifestLabelConfigFormData: {
                    ...state.manifestLabelConfigFormData,
                    ...action.payload
                }
            }

        case '@@manifestLabelConfig/SET_FORM_LOADING':
            return {
                ...state,
                isLoading: action.payload
            }

        case '@@manifestLabelConfig/INITIALISE_FORM':
            return {
                ...state,
                manifestLabelConfigFormData: {
                    templateId: 0,
                    templateName: '',
                    templateDesc: '',
                    orderHTML: `<!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/JsBarcode.all.min.js"></script>
                        </head>
                        <body>
                            <div style="width:auto; border:1px solid white;">
                                <svg class="manifestBarcode"></svg>
                                <div style="font-family: HelveticaNeue-bold !important;font-size: 14px !important;line-height: 14px;font-weight:bold;font-style:normal;text-align:left;margin-left:7px; ">
                                    Order No. : @Order Number</div>
                                    <p>@Deliver Customer Name</p>
                            </div>
                            <script>
                                JsBarcode('.manifestBarcode', '@Order Number', { displayValue: false, height: 70, width: 1 });
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
                isEditManifestLabel: undefined
            }

        case "@@manifestLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS":
            return {
                ...state,
                defaultTemplates: action.payload
            }

        case '@@manifestLabelConfig/FETCH_PROPERTY_TYPE_SUCCESS':
            return {
                ...state,
                propertyType: action.payload
            }
    
        default:
            return state
    }
}

export default ManifestLabelConfigurationReducer
