import { IMongoDynamicHTMLTemplate } from '../../../utils/common.interface';
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IManifestListDataPayload, IManifestListViewPaylod } from "./ManifestList.models";
import { IFetchManifestHTMLTemplates, IFetchManifestHTMLTemplatesSuccess, IFetchPrintManifestOrderDetails, IFetchPrintManifestOrderDetailsSuccess, ISetPrintManifestModalOpen } from './PrintManifest/PrintManifest.actions';
import { IFetchPrintAWBOrderDetails, IFetchPrintAWBOrderDetailsSuccess, ISetPrintAWBModalOpen, IFetchAWBHTMLTemplates, IFetchAWBHTMLTemplatesSuccess } from './PrintManifestLabel/PrintAWB.actions'

export interface ISetStructureAction {
    readonly type: '@@manifestList/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchStructureAction {
    readonly type: '@@manifestList/FETCH_STRUCTURE';
}

export interface IFetchDataAction {
    readonly type: '@@manifestList/FETCH_DATA'
    payload?: IManifestListViewPaylod
}
  
export interface IFetchDataSuccessAction {
    readonly type: '@@manifestList/FETCH_DATA_SUCCESS'
    payload: IManifestListDataPayload
}

export interface ISetColumnsLoading {
    readonly type : '@@manifestList/SET_COLUMNS_LOADING';
    payload: {
      columns: boolean;
    };
}
export interface ISetLoading {
    readonly type: '@@manifestList/SET_LOADING',
    payload: {
      listView: boolean
    }
}

interface ISetPrintManifestTemplate {
    readonly type: '@@manifestList/SET_PRINT_MANIFEST_TEMPLATE'
    payload: IMongoDynamicHTMLTemplate<{manifestHTML: string, shipmentHTML: string}>
}

interface ISetPrintManifestLabelTemplate {
    readonly type: '@@manifestList/SET_PRINT_MANIFEST_LABEL_TEMPLATE'
    payload: IMongoDynamicHTMLTemplate<{manifestHTML: string}>
}

export interface IFetchPrintManifestTemplate {
    readonly type: '@@manifestList/FETCH_PRINT_MANIFEST_TEMPLATE'
}
export interface IFetchPrintManifestLabelTemplate {
    readonly type: '@@manifestList/FETCH_PRINT_MANIFEST_LABEL_TEMPLATE'
}

interface ISetCurrentSelectedIDs {
    readonly type: '@@manifestList/SET_CURRENT_SELECTED_IDS'
    payload: number[]
}


export type ManifestListActions = 
  | ISetStructureAction
  | IFetchStructureAction
  | IFetchDataAction
  | IFetchDataSuccessAction
  | ISetColumnsLoading
  | ISetLoading
  | ISetPrintManifestTemplate
  | ISetPrintManifestLabelTemplate
  | IFetchPrintManifestTemplate
  | IFetchPrintManifestLabelTemplate
  | ISetPrintAWBModalOpen
  | IFetchPrintAWBOrderDetails
  | IFetchPrintAWBOrderDetailsSuccess
  | IFetchAWBHTMLTemplatesSuccess
  | IFetchAWBHTMLTemplates
  | ISetCurrentSelectedIDs
  | IFetchManifestHTMLTemplates
  | IFetchManifestHTMLTemplatesSuccess
  | ISetPrintManifestModalOpen
  | IFetchPrintManifestOrderDetails
  | IFetchPrintManifestOrderDetailsSuccess
//   | IFetchAdmanifestFormStructureAction