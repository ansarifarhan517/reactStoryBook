import { IMongoDynamicHTMLTemplate } from '../../../utils/common.interface';
import { IOrderPrintAWBTemplateData, IPrintAWBOrderDetails } from './PrintAWB.models';

export interface IFetchAWBHTMLTemplates {
  type: '@@orderListView/FETCH_AWB_HTML_TEMPLATES'
}

export interface IFetchAWBHTMLTemplatesSuccess {
  type: '@@orderListView/FETCH_AWB_HTML_TEMPLATES_SUCCESS'
  payload: IMongoDynamicHTMLTemplate<IOrderPrintAWBTemplateData>[]
}

export interface ISetPrintAWBModalOpen {
  type: '@@orderListView/SET_AWB_MODAL_OPEN',
  payload: boolean
}

export interface IFetchPrintAWBOrderDetails {
  type: '@@orderListView/FETCH_AWB_ORDER_DETAILS',
  payload: string[] | number[]
}

export interface IFetchPrintAWBOrderDetailsSuccess {
  type: '@@orderListView/FETCH_AWB_ORDER_DETAILS_SUCCESS'
  payload: IPrintAWBOrderDetails[]
}