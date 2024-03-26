import { IMongoDynamicHTMLTemplate } from "../../../../utils/common.interface";
import { IOrderPrintManifestTemplateData } from "./PrintManifest.models";

export interface IFetchManifestHTMLTemplates {
  type: '@@manifestList/FETCH_MANIFEST_HTML_TEMPLATES'
}

export interface IFetchManifestHTMLTemplatesSuccess {
  type: '@@manifestList/FETCH_MANIFEST_HTML_TEMPLATES_SUCCESS'
  payload: IMongoDynamicHTMLTemplate<IOrderPrintManifestTemplateData>[]
}

export interface ISetPrintManifestModalOpen {
  type: '@@manifestList/SET_PRINT_MANIFEST_MODAL_OPEN',
  payload: boolean
}

export interface IFetchPrintManifestOrderDetails {
  type: '@@manifestList/FETCH_MANIFEST_ORDER_DETAILS',
  payload: string[] | number[]
}

export interface IFetchPrintManifestOrderDetailsSuccess {
  type: '@@manifestList/FETCH_MANIFEST_ORDER_DETAILS_SUCCESS'
  payload: any[]
}