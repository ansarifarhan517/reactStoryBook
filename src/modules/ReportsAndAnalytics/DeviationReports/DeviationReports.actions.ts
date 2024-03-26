import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IMongoListViewStructure, IMongoFormStructure } from "../../../utils/mongo/interfaces";
import { IListViewResponsePayload, ISelectedDateRange, ISetFilters } from "./DeviationReports.models";

export interface IFetchFilterStructure {
    readonly type: '@@deviationReports/FETCH_FILTER_STRUCTURE';
}

export interface IFetchFilterStructureSuccess {
    readonly type: '@@deviationReports/FETCH_FILTER_STRUCTURE_SUCCESS';
    payload: IMongoFormStructure;
}

export interface IFetchVehicleReportFilterStructure {
    readonly type: '@@vehicleReports/FETCH_FILTER_STRUCTURE';
}

export interface IFetchVehicleReportFilterStructureSuccess {
    readonly type: '@@vehicleReports/FETCH_FILTER_STRUCTURE_SUCCESS';
    payload: IMongoFormStructure;
}

export interface IFetchListViewStructure {
    readonly type: '@@deviationReports/FETCH_LISTVIEW_STRUCTURE';
}

export interface IFetchListViewStructureSuccess {
    readonly type: '@@deviationReports/FETCH_LISTVIEW_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchListViewData {
    readonly type: "@@deviationReports/FETCH_LISTVIEW_DATA";
    payload: IListViewRequestPayload;
}

export interface IFetchListViewDataSuccess {
    readonly type: "@@deviationReports/FETCH_LISTVIEW_DATA_SUCCESS";
    payload: IListViewResponsePayload;
}

export interface ISaveFilters {
    readonly type: "@@deviationReports/SAVE_FILTERS";
    payload: ISetFilters;
}

export interface ISaveDateRange {
    readonly type: "@@deviationReports/SAVE_DATE_RANGE";
    payload: ISelectedDateRange;
}

export interface IResetListViewState {
    readonly type: '@@deviationReports/RESET_LISTVIEW_STATE';
}

export interface IResetState {
    readonly type: '@@deviationReports/RESET_INITIAL_STATE';
}

export type DeviationReportsActions = 
    | IFetchFilterStructure
    | IFetchFilterStructureSuccess
    | IFetchVehicleReportFilterStructure
    | IFetchVehicleReportFilterStructureSuccess
    | IFetchListViewStructure
    | IFetchListViewStructureSuccess
    | IFetchListViewData
    | IFetchListViewDataSuccess
    | ISaveFilters
    | ISaveDateRange
    | IResetListViewState
    | IResetState

