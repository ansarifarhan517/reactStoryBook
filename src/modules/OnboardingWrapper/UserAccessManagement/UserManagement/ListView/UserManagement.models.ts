// import { IClientProperty } from "../../../../common/ClientProperties/interfaces";


export interface IRowData {
    createdOnDt?: number,
    isActiveFl?: boolean,
    userGroupName?: string,
    clientBranchName?: string,
    clientName?: string,
    name?:string,
    distributionCenter?: number,
    emailAddress?: string,
    mobileNumber?: string,
    userName?: string,
    userGroupId?: number,
    userId: number,
    persona: string,
    handOverEnabled: boolean
}

export interface IuserManagementDataPayload {
    clientBranchId?: number,
    otherCount?: number,
    totalCount: number,
    results: Array<IRowData>,
}

export interface ICustomField {
  type: string,
  field: string,
  value: any
}

export interface IListViewDataRequestParams {
  pageNumber?: number
  pageSize?: number
  searchBy?: string
  searchText?: string
  sortBy?: string
  sortOrder?: string
  access_token?: string
}
  
export interface IListViewDataRequestPayload {
  params: IListViewDataRequestParams
}
