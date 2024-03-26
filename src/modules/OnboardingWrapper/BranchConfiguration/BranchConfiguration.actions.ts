import { IMongoListViewStructure, IMongoFormStructure } from "../../../utils/mongo/interfaces";
import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IBranchConfigurationListDataPayload, IOperationTimingsListDataPayload, IBranchManagerListDataPayload, ITreeListRequestPayload, IBranchConfigurationTreeDataSubBranchPayload, IOperationTimingsStructure, IBranchManagerStructure, IShiftTimingStructure, ISkillSet, IBranchDropdownComponentProps, IBranchZoneStructure, IBranchZones, IBranchZonesRateProfile, IHolidayCalendar} from "./BranchConfiguration.models";
import { IFetchDataOptions } from 'ui-library'

export interface IFetchListViewStructureAction {
    readonly type: '@@branchConfiguration/FETCH_LISTVIEW_STRUCTURE';
}

export interface IFetchListViewStructureActionSuccess {
    readonly type: '@@branchConfiguration/FETCH_LISTVIEW_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchBranchConfigurationListAction {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_LIST';
    payload?: IListViewRequestPayload
}

export interface IFetchBranchConfigurationListActionSuccess {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_LIST_SUCCESS';
    payload: IBranchConfigurationListDataPayload
}

export interface IFetchOperationTimingsListViewStructureAction {
    readonly type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LISTVIEW_STRUCTURE';
}
export interface IFetchLoadMultiplierListViewStructureAction {
    readonly type: '@@branchConfiguration/FETCH_LOAD_MULTIPLIER_LISTVIEW_STRUCTURE';
}
export interface IFetchOperationTimingsListViewStructureActionSuccess {
    readonly type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LISTVIEW_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}

export interface IFetchOperationTimingsByBranchIdAction {
    readonly type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LIST';
    payload: number
}

export interface IFetchOperationTimingsByBranchIdActionSuccess {
    readonly type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LIST_SUCCESS';
    payload: IOperationTimingsListDataPayload[]
}

export interface ISetOperationTimingsClone {
    readonly type: '@@branchConfiguration/SET_OPERATION_TIMINGS_CLONE';
    payload: IOperationTimingsListDataPayload[]
}

export interface IFetchBranchManagerListByBranchIdAction {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_MANAGER_LIST';
    payload: number;
}
export interface IFetchBranchManagerListByBranchIdActionSuccess {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_MANAGER_LIST_SUCCESS';
    payload: IBranchManagerListDataPayload[]
}

export interface IFetchBranchManagerListViewStructureAction {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_MANAGER_LISTVIEW_STRUCTURE';
}

export interface IFetchBranchManagerListViewStructureActionSuccess {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_MANAGER_LISTVIEW_STRUCTURE_SUCCESS';
    payload: IMongoListViewStructure;
}



export interface IFetchBranchFormStructureAction {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE';
}
export interface IFetchBranchFormStructureSuccess {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE_SUCCESS';
    payload: IMongoFormStructure;
}

export interface IFetchBranchFormStructureOriginalSuccess {
    readonly type: '@@branchConfiguration/SET_BRANCH_FORM_RESET_STRUCTURE';
    payload: IMongoFormStructure;
}

export interface IFetchOperationTimingsStructureAction {
    readonly type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_STRUCTURE';
}

export interface IFetchOperationTimingsStructureSuccess {
    readonly type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_STRUCTURE_SUCCESS';
    payload: IMongoFormStructure;
}

export interface ISetOperationTimingStructure {
    readonly type: '@@branchConfiguration/SET_OPERATION_TIMINGS_STRUCTURE';
    payload: IOperationTimingsStructure[];
}

export interface IFetchShiftTimingsStructureAction {
    readonly type: '@@branchConfiguration/FETCH_SHIFT_TIMINGS_STRUCTURE';
}

export interface IFetchShiftTimingsStructureSuccess {
    readonly type: '@@branchConfiguration/FETCH_SHIFT_TIMINGS_STRUCTURE_SUCCESS';
    payload: IMongoFormStructure;
}
export interface IFetchClientListAction {
    readonly type: '@@branchConfiguration/FETCH_CLIENT_LIST';
}

export interface IFetchClientListSuccess {
    readonly type: '@@branchConfiguration/FETCH_CLIENT_LIST_SUCCESS';
    payload: [];
}

export interface ISetShiftTimingStructure {
    readonly type: '@@branchConfiguration/SET_SHIFT_TIMINGS_STRUCTURE';
    payload: IShiftTimingStructure[];
}

export interface ISetBranchManagerStructure {
    readonly type: '@@branchConfiguration/SET_BRANCH_MANAGER_STRUCTURE';
    payload: IBranchManagerStructure[];
}

export interface ISetFormLoading {
    readonly type: '@@branchConfiguration/SET_BRANCH_FORM_LOADING';
    payload: boolean;
}

export interface ISetGoogleAPIKey {
    readonly type: '@@branchConfiguration/GOOGLE_API_KEY'
}
export interface ISetGoogleAPIKeySuccess {
    readonly type: '@@branchConfiguration/GOOGLE_API_KEY_SUCCESS',
    payload: string
}
export interface IFetchBranchConfigurationTreeListAction {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST';
    payload?: IListViewRequestPayload
}

export interface IFetchBranchConfigurationTreeListActionSuccess {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST_SUCCESS';
    payload: IBranchConfigurationListDataPayload
}
export interface IFetchBranchConfigurationTreeListBranchIdAction {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST_BRANCHID';
    payload?: ITreeListRequestPayload
}

export interface IFetchBranchConfigurationTreeListBranchIdActionSuccess {
    readonly type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST_BRANCHID_SUCCESS';
    payload: IBranchConfigurationListDataPayload
}
export interface ISetSelectedEditRowData {
    type: '@@branchConfiguration/SET_SELECTED_EDIT_ROW_DATA';
    payload: {
        key: string,
        value: any
    }
}
export interface IFetchClientBranchDetails {
    readonly type: '@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA';
    payload?: ITreeListRequestPayload
}
export interface IFetchClientBranchDetailsSuccess {
    readonly type: '@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA_SUCCESS';
    payload: IBranchConfigurationTreeDataSubBranchPayload;
}

export interface ISetAPILoading {
    readonly type: '@@branchConfiguration/SET_API_LOADING',
    payload: boolean;
}
export interface ISetFetchOptions {
    readonly type: '@@branchConfiguration/SET_FETCH_OPTIONS',
    payload: IFetchDataOptions
  }
  export interface ISetTreeData {
    readonly type: '@@branchConfiguration/SET_TREE_DATA',
    payload? : any
  }
  export interface ISetBranchId {
    readonly type: '@@branchConfiguration/SET_SELECTED_BRANCH_ID',
    payload? : any
  }

  export interface ISetChildBranchesToggle {
      readonly type: '@@branchConfiguration/SET_CHILD_BRANCHES_TOGGLE',
      payload: boolean | undefined
  }

  export interface IResetBranchData {
    readonly type: '@@branchConfiguration/RESET_BRANCH_DATA'
  }

  export interface ISetStructureLoading {
    readonly type: '@@branchConfiguration/SET_STRUCTURE_LOADING',
    payload: boolean;
  }

  export interface ISetBranchTimezone {
      readonly type: '@@branchConfiguration/SET_BRANCH_TIMEZONE';
      payload: string
  }

  export interface IFetchDeliveryTypes {
      readonly type: '@@branchConfiguration/FETCH_DELIVERY_TYPE';
  }

  export interface ISetDeliveryTypes {
    readonly type: '@@branchConfiguration/SET_DELIVERY_TYPE';
    payload: Array<ISkillSet>
  }

  export interface IFetchLocale{
    readonly type: '@@branchConfiguration/FETCH_LOCALE'
}

export interface ISetLocale {
    readonly type: '@@branchConfiguration/SET_LOCALE'
    payload: IBranchDropdownComponentProps[]
}
export interface IFetchBranchZone {
    readonly type: '@@branchConfiguration/FETCH_ZONE_STRUCTURE'
}
export interface IFetchBranchZoneProfile {
    readonly type: '@@branchConfiguration/FETCH_ZONE_PROFILE_STRUCTURE'
}
export interface ISetBranchZone {
    readonly type: '@@branchConfiguration/SET_ZONE_STRUCTURE'
    payload: IBranchZoneStructure
}
export interface ISetBranchZoneProfile {
    readonly type: '@@branchConfiguration/SET_ZONE_PROFILE_STRUCTURE'
    payload: IBranchZoneStructure
}

export interface ISetBranchZones {
    readonly type: '@@branchConfiguration/SET_CREATED_ZONES'
    payload: IBranchZones
}
export interface ISetRetrievedBranchZones {
    readonly type: '@@branchConfiguration/SET_RETRIEVED_ZONES'
    payload: any
}
export interface ISetBranchZonesRateProfiles {
    readonly type: '@@branchConfiguration/SET_BRANCH_ZONE_RATE_PROFILES'
    payload: IBranchZonesRateProfile[] | []
}
export interface ISetBranchZonesEditRow {
    readonly type: '@@branchConfiguration/SET_SELECTED_ZONE'
    payload: IBranchZones
}
export interface ISetPreviousViewType {
    readonly type: '@@branchConfiguration/SET_PREVIOUS_VIEW_TYPE'
    payload: string;
}
export interface ISetBranchDataLoaded {
    readonly type: '@@branchConfiguration/SET_BRANCH_DATA_LOADED';
    payload: boolean;
}
export interface IFetchServiceTypeAndRateProfile {
    readonly type: '@@branchConfiguration/FETCH_RATE_PROFILE_DROPDOWNS'
}
export interface ISetServiceTypes {
    readonly type: '@@branchConfiguration/SET_SERVICE_TYPE'
    payload:  any
}

export interface ISetActiveRateProfile {
    readonly type: '@@branchConfiguration/SET_ACTIVE_RATE_PROFILES'
    payload:  any
}
export interface IFetchServiceZonesList {
    readonly type: '@@branchConfiguration/FETCH_ZONES_LISTVIEW_STRUCTURE'
}
export interface ISetServiceZonesList {
    readonly type: '@@branchConfiguration/SET_ZONES_LISTVIEW_STRUCTURE'
    payload:  any
}

export interface IDeleteSelectedZone {
    readonly type: '@@branchConfiguration/DELETE_SELECTED_ZONE'
    payload:  any
}
export interface IEditSelectedZone {
    readonly type: '@@branchConfiguration/SET_IS_ZONE_EDITABLE'
    payload:  boolean
}

export interface IResetZoneDetails {
    readonly type: '@@branchConfiguration/RESET_ZONE_DETAILS'
}
export interface IGetLoadMultiplierData {
    readonly type: '@@branchConfiguration/GET_LOADMULTIPLIER_DATA'
    payload:  any
}

export interface IGetLoadMultiplierStructure {
    readonly type: '@@branchConfiguration/GET_LOADMULTIPLIER_STRUCTURE'
    payload:  any
}

export interface IFetchDaysOfWeekOptions {
    readonly type: '@@branchConfiguration/FETCH_DAYSOFWEEK_OPTIONS'
    payload: any
}

export interface IFetchCalendarListAction {
    readonly type: '@@branchConfiguration/FETCH_HOLIDAY_CALENDAR_LIST'
}

export interface IFetchCalendarListActionSuccess {
    readonly type: '@@branchConfiguration/FETCH_HOLIDAY_CALENDAR_LIST_SUCCESS'
    payload: IHolidayCalendar
}

export type BranchConfigurationActions = 
| IFetchListViewStructureAction 
| IFetchListViewStructureActionSuccess
| IFetchBranchConfigurationListAction
| IFetchBranchConfigurationListActionSuccess
| IFetchOperationTimingsListViewStructureAction
| IFetchOperationTimingsListViewStructureActionSuccess
| IFetchOperationTimingsByBranchIdAction
| IFetchOperationTimingsByBranchIdActionSuccess
| ISetOperationTimingsClone
| IFetchBranchManagerListByBranchIdAction
| IFetchBranchManagerListByBranchIdActionSuccess
| IFetchBranchManagerListViewStructureAction
| IFetchBranchManagerListViewStructureActionSuccess
| IFetchBranchFormStructureAction
| IFetchBranchFormStructureSuccess
| IFetchBranchFormStructureOriginalSuccess
| ISetFormLoading
| IFetchOperationTimingsStructureAction
| IFetchOperationTimingsStructureSuccess
| IFetchShiftTimingsStructureAction
| IFetchShiftTimingsStructureSuccess
| ISetGoogleAPIKey
| ISetGoogleAPIKeySuccess
| IFetchBranchConfigurationTreeListAction
| IFetchBranchConfigurationTreeListActionSuccess
| IFetchBranchConfigurationTreeListBranchIdAction
| IFetchBranchConfigurationTreeListBranchIdActionSuccess
| ISetOperationTimingStructure
| ISetShiftTimingStructure
| ISetBranchManagerStructure
| ISetSelectedEditRowData
| IFetchClientBranchDetails
| IFetchClientBranchDetailsSuccess
| ISetAPILoading
| ISetFetchOptions
| ISetTreeData
| ISetBranchId
| IFetchClientListAction
| IFetchClientListSuccess
| IResetBranchData
| ISetStructureLoading
| ISetBranchTimezone
| IFetchDeliveryTypes
| ISetDeliveryTypes
| IFetchLocale
| ISetLocale
| ISetPreviousViewType
| ISetBranchDataLoaded
| ISetChildBranchesToggle
| IFetchBranchZone
| IFetchBranchZoneProfile
| ISetBranchZone
| ISetBranchZoneProfile
| IFetchServiceTypeAndRateProfile
| ISetServiceTypes
| ISetActiveRateProfile
| IFetchServiceZonesList
| ISetServiceZonesList
| ISetBranchZones
| ISetBranchZonesRateProfiles
| ISetBranchZonesEditRow
| IDeleteSelectedZone
| IEditSelectedZone
| ISetRetrievedBranchZones
| IResetZoneDetails
| IFetchLoadMultiplierListViewStructureAction
| IGetLoadMultiplierData
| IGetLoadMultiplierStructure
| IFetchDaysOfWeekOptions
| IFetchCalendarListAction
| IFetchCalendarListActionSuccess