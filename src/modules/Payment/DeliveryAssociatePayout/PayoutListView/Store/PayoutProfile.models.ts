import { IBranchLookupResponse } from "../../../../../utils/common.interface";
import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces";
export interface IPayoutProfileDetails {
  id: number;
  payoutProfileName: string;
  frequency: "Weekly" | "Monthly" | "Daily" | "Custom";
  day?:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thrusday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  every?: number;
  period?: string;
  date?: number | string;
  time?: string;
  clientId: number;
  isFavourite: boolean;
  linkedBranchIds: number[];
  isEditable: boolean;
}

export interface IAlertProfilesLookupResponse {
  isActiveFl: boolean;
  isEditable: boolean;
  isFavourite: boolean;
  isGroupOrderAlert: boolean;
  profileId: number;
  profileName: string;
}

export interface IPayoutProfilesReduxState {
  loading: {
    listView: boolean;
    columns: boolean;
  };
  data: {
    totalCount: number;
    results: Array<IPayoutProfileDetails>;
  };
  structure: IMongoListViewStructure;
  isListViewEmpty: boolean;

  branchAttached: Array<{
    value: number;
    label: string;
  }>;
  branchAttachedMap: {
    [key: number]: IBranchLookupResponse;
  };
  listParams: any,
  branchProfileMapping?: any;
}

export const dummyColumns: any = {
  payoutProfileName: { label: "Profile Name", permission: true },
  frequency: { label: "Frequency", permission: true },
  linkedBranchIds: { label: "Branch", permission: true },
};

export const dummyResult: any = Array(15)
  .fill(0)
  .map((_, i) => ({ clientCoLoaderId: i + 1 }));

export const payoutProfileInitialState = {
  loading: {
    listView: false,
    columns: false,
  },
  structure: {
    buttons: {},
    columns: dummyColumns,
  },
  data: {
    totalCount: 0,
    results: dummyResult,
  },
  isListViewEmpty: false,

  branchAttached: [],
  branchAttachedMap: {},
  listParams: {}
};

export type tLoadingKey = "listView" | "columns";

export interface IAddPayoutProfileProps {
  isOpen: boolean;
  cloneFrom?: number;
  selected?: IPayoutProfileDetails;
  onClose: () => void;
  isEdit: boolean;
  onSave: (profileData?: {
    payoutProfileName: string;
    frequency: string;
    every?: number;
    period?: string;
    day?: string;
    date?: number | string;
    time?: string;
  }) => void;
}

export interface IAddFormData {
  id?: number;
  payoutProfileName: string;
  frequency: string;
  every?: number;
  period?: string;
  day?: string;
  date?: number | string;
  time?: string;
}
