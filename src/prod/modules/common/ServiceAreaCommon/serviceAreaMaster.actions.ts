export interface ISetPageParam {
    readonly type: '@@SAM_ZONE/PAGE_PARAM_SET';
    payload : { pageNumber : number, pageSize : number}
  }

  export interface ISetZoneListData {
    readonly type: '@@SAM_ZONE/LIST_DATA_SET';
    payload : []
  }
  export interface IGetZoneListData {
   readonly type: '@@SAM_ZONE/PAGE_PARAM_GET';
  }

  export interface IUpdateZoneObj {
    readonly type: '@@SAM_ZONE/UPDATE_DATA_OBJ';
    payload : any
  }

  export interface IResetPageParam {
    readonly type:'@@SAM_ZONE/PAGE_PARAM_RESET'
  }

  export interface IAddZoneObj {
    readonly type: '@@SAM_ZONE/ADD_DATA_OBJ';
    payload : []
  }

  export interface IDeleteZone {
    readonly type: '@@SAM_ZONE/DELETE_DATA_OBJ';
    payload : string
  }

  export interface IDeletedZones {
    readonly type: '@@SAM_ZONE/DELETED_ZONES';
    payload : []
  }

  export type InSAMActions =
  | ISetPageParam
  | ISetZoneListData
  | IGetZoneListData
  | IResetPageParam
  | IUpdateZoneObj
  | IAddZoneObj
  | IDeleteZone
  | IDeletedZones