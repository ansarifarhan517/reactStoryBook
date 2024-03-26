import {IMongoListViewStructure} from "../../../utils/mongo/interfaces";
import { IClientMetricSystem, IListViewRequestPayload } from "../../../utils/common.interface";
import {IListViewDataPayload, IRowData} from "./PlanningListView.model"

export interface ISetStructureAction {
    readonly type: '@@planningListView/FETCH_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
  }
  export interface IFetchStructureAction {
    readonly type: '@@planningListView/FETCH_STRUCTURE';
  }

export interface IFetchDataAction {
  readonly type: '@@planningListView/FETCH_DATA'
  payload?: IListViewRequestPayload
}

export interface IFetchDataSuccessAction {
    readonly type: '@@planningListView/FETCH_DATA_SUCCESS'
    payload: {
      data: IListViewDataPayload,
      moreResultsExists?: boolean
    }
  }
export interface IUpdateListViewDataAction {
    readonly type: '@@planningListView/UPDATE_DATA'
    payload: {
      data: IRowData,
    }
  }
export interface IActiveInactiveRowDetailsAction {
    readonly type: '@@planningListView/SET_UPDATE_ACTIVE_INACTIVE_DETAILS'
    payload: {
     schedulerId:Number,
     activeStatusFl:boolean,
     failureCallback:React.Dispatch<React.SetStateAction<boolean>>
    }
}

export interface IShowActiveConfirmationModal {
  readonly type: '@@planningListView/SHOW_ACTIVE_CONFIRMATION_MODAL'
  payload: boolean
}

export interface ISetLoading {
  readonly type: '@@planningListView/SET_LOADING',
  payload: boolean
}

export interface IResetState {
  readonly type: '@@planningListView/RESET_INITIAL_STATE'
}


export type TripPlanningScheduler =
  | ISetStructureAction
  | IFetchStructureAction
  | IFetchDataAction
  | ISetLoading
  | IResetState
  | IFetchDataSuccessAction
  | IUpdateListViewDataAction
  | IShowActiveConfirmationModal
  | IActiveInactiveRowDetailsAction
