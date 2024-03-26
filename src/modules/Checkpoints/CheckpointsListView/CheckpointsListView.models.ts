import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IClientProperty } from "../../common/ClientProperties/interfaces";
import { TSelectedDrawType } from "../CheckpointsForm/CheckpointsForm.models";

export interface ICoordinatesData {
  latitude: number;
  longitude: number;
}

export interface IRowData {
  createdOnDt: number,
  checkpointId: number,
  checkpointName: string,
  isActiveFl: boolean,
  checkpointCategory: string,
  checkpointLatitude: number,
  checkpointLongitude: number,
  checkpointRadius: number,
  routeCount: number,
  alertCount: number,
  checkpointCode: string,
  checkpointRadiusOrArea : number,
  shapeType: string
}

export interface ICheckpointsListDataPayload {
  clientBranchId?: number;
  otherCount?: number;
  totalCount: number;
  results: Array<IRowData>;
  clientProperties?: Record<string, IClientProperty>;
}

export interface ICheckpointsListViewPayload {
  params: IListViewRequestPayload
}

export interface IRowCheckpointsList {
  checkpointId: number,
  checkpointName: string,
  checkpointCode: string,
  checkpointCategory: string,
}

export interface ICheckpointsMappedRoutesListData {
  otherCount?: number;
  totalCount: number;
  results: Array<IRowCheckpointsList>;
}

export interface ICheckpointCodes {
  isActiveFl: boolean,
  checkpointId: number,
  checkpointCode: string
}

export interface IMappedCheckpointCodes {
  checkpointId: number,
  checkpointCode: string,
  routeCheckpointMappingId: number
}

export interface ISelectedMapTypeProps {
  selectedShape: TSelectedDrawType;
  setSelectedShape: React.Dispatch<React.SetStateAction<TSelectedDrawType>>;
  drawActive: boolean;
  enableDraw: Function;
  deleteShape: Function;
}

export interface ICheckpointsListMap {
  lastSelectedRow: any;
  deleteCheckpoint: Function
}