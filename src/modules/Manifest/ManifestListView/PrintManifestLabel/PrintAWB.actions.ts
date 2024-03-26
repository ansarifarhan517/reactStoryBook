// import { IMongoDynamicHTMLTemplate } from '../../../../utils/common.interface';
// import { 
//   // IOrderPrintAWBTemplateData, 
//   IPrintManifestOrderDetails } from './PrintAWB.models';

import { IMongoDynamicHTMLTemplate } from "../../../../utils/common.interface";
import { IOrderPrintAWBTemplateData } from "./PrintAWB.models";

export interface IFetchAWBHTMLTemplates {
  type: '@@manifestList/FETCH_AWB_HTML_TEMPLATES'
}

export interface IFetchAWBHTMLTemplatesSuccess {
  type: '@@manifestList/FETCH_AWB_HTML_TEMPLATES_SUCCESS'
  payload: IMongoDynamicHTMLTemplate<IOrderPrintAWBTemplateData>[]
}

export interface ISetPrintAWBModalOpen {
  type: '@@manifestList/SET_AWB_MODAL_OPEN',
  payload: boolean
}

export interface IFetchPrintAWBOrderDetails {
  type: '@@manifestList/FETCH_AWB_ORDER_DETAILS',
  payload: string[] | number[]
}

export interface IFetchPrintAWBOrderDetailsSuccess {
  type: '@@manifestList/FETCH_AWB_ORDER_DETAILS_SUCCESS'
  payload: any[]
}