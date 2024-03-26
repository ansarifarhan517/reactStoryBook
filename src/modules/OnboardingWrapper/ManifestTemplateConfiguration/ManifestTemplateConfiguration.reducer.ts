import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { ManifestTemplateConfigActions } from "./ManifestTemplateConfiguration.actions";
import {
  IDefaultTemplate,
  IManifestTemplateConfigFormData,
  IManifestTemplateConfigListDataPayload,
  IManifestTemplateConfigTagsAPIResponse,
  IRowData,
  IPropertyType,
} from "./ManifestTemplateConfiguration.models";

export interface IManifestTemplateConfigState {
  structure: IMongoListViewStructure;
  loading: {
    listView: boolean;
    columns: boolean;
  };
  data: IManifestTemplateConfigListDataPayload;
  isEditManifestTemplate: IRowData | undefined;
  tags: IManifestTemplateConfigTagsAPIResponse;
  manifestTemplateConfigFormData: IManifestTemplateConfigFormData;
  defaultTemplates: Array<IDefaultTemplate>;
  defaultSelectedTemplate: IDefaultTemplate;
  isLoading: boolean;
  propertyType: IPropertyType;
}

export const listColumns: any = {
  manifestTemplateDesc: {
    label: "Manifest Template Description",
    permission: true,
  },
  manifestTemplateName: { label: "Manifest Template Name", permission: true },
  isActiveFl: { label: "Active / Inactive", permission: true },
};

export const listResult: any = Array(15)
  .fill(0)
  .map((_, i) => ({ manifestTemplateId: i + 1 }));

const initialState: IManifestTemplateConfigState = {
  structure: {
    columns: listColumns,
    buttons: {},
  },
  loading: {
    listView: false,
    columns: false,
  },
  data: {
    totalCount: 0,
    results: listResult,
  },
  isEditManifestTemplate: undefined,
  tags: {
    id: "-1",
    tagGroupMappingList: [],
    dynamicTagKeys: [],
  },
  manifestTemplateConfigFormData: {
    templateId: 0,
    templateName: "",
    templateDesc: "",
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
    ordersHTML: "",
    manifestsHTML: "",
    htmlData: {
      orderHTML: "",
      ordersHTML: "",
      manifestsHTML: "",
    },
  },
  defaultTemplates: [],
  defaultSelectedTemplate: {
    isActiveFl: false,
    templateName: "",
    isDefault: false,
    htmlData: {
      orderHTML: "",
      ordersHTML: "",
      manifestsHTML: "",
    },
  },
  isLoading: false,
  propertyType: {
    clientId: 0,
    clientPropertyId: 0,
    createdByUserId: 0,
    createdOnDt: 0,
    isActiveFl: false,
    isDeleteFl: "",
    propertyKey: "",
    propertyValue: "",
    updatedByUserId: 0,
    updatedOnDt: 0,
  },
};

const ManifestTemplateConfigurationReducer = (
  state = initialState,
  action: ManifestTemplateConfigActions
): IManifestTemplateConfigState => {
  switch (action.type) {
    case "@@manifestTemplateConfig/FETCH_STRUCTURE_SUCCESS":
      return {
        ...state,
        structure: action.payload,
      };

    case "@@manifestTemplateConfig/SET_COLUMNS_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case "@@manifestTemplateConfig/FETCH_DATA_SUCCESS":
      return {
        ...state,
        data: {
          ...action.payload,
        },
      };

    case "@@manifestTemplateConfig/SET_DATA_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case "@@manifestTemplateConfig/SET_DATA":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case "@@manifestTemplateConfig/SET_FORM_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "@@manifestTemplateConfig/INITIALISE_FORM":
      return {
        ...state,
        manifestTemplateConfigFormData: {
          templateId: 0,
          templateName: "",
          templateDesc: "",
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
          ordersHTML: "",
          manifestsHTML: "",
          htmlData: {
            orderHTML: "",
            ordersHTML: "",
            manifestsHTML: "",
          },
        },
        isEditManifestTemplate: undefined,
      };

    case "@@manifestTemplateConfig/SET_FORM_DATA":
      return {
        ...state,
        manifestTemplateConfigFormData: {
          ...state.manifestTemplateConfigFormData,
          [action?.payload.key]: action.payload.value,
        },
      };

    case "@@manifestTemplateConfig/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS":
      return {
        ...state,
        defaultTemplates: action.payload,
      };

    case "@@manifestTemplateConfig/SET_DEFAULT_SELECTED_TEMPLATE":
      return {
        ...state,
        defaultSelectedTemplate: { ...action.payload },
      };

    case "@@manifestTemplateConfig/FETCH_TAGS_SUCCESS":
      return {
        ...state,
        tags: action.payload,
      };

    case "@@manifestTemplateConfig/SET_MANIFEST_TEMPLATE_DETAILS_DATA":
      action.payload = {
        ...action.payload,
        orderHTML: action.payload?.htmlData?.orderHTML,
        ordersHTML: action.payload?.htmlData?.ordersHTML,
        manifestsHTML: action.payload?.htmlData?.manifestsHTML,
      };
      if (action.payload.orderHTML.includes("<Orders />")) {
        action.payload.orderHTML = action.payload.orderHTML.replace(
          "<Orders />",
          `<Orders>${action.payload.ordersHTML}</Orders>`
        );
      }
      if (action.payload.orderHTML.includes("<Manifests />")) {
        action.payload.orderHTML = action.payload.orderHTML.replace(
          "<Manifests />",
          `<Manifests>${action.payload.manifestsHTML}</Manifests>`
        );
      }
      state.tags.dynamicTagKeys.forEach((key) => {
        action.payload.orderHTML = action.payload.orderHTML.replaceAll(
          key.dynamicTagKey,
          `@${key.dynamicTagLabelValue}`
        );
      });
      return {
        ...state,
        manifestTemplateConfigFormData: {
          ...state.manifestTemplateConfigFormData,
          ...action.payload,
        },
      };

    case "@@manifestTemplateConfig/FETCH_PROPERTY_TYPE_SUCCESS":
      return {
        ...state,
        propertyType: action.payload,
      };

    default:
      return state;
  }
};

export default ManifestTemplateConfigurationReducer;
