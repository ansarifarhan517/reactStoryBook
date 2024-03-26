export interface IRowData {
  accessProfileId: number
  accessProfileRefId: String
  accessprofileName: String
  accessprofileDesc: String
  activeFl: boolean
  attachedUserGroups: number
  defaultProfileFl: boolean
  locked: boolean
}

export interface IAccessProfileDataPayload {
  clientBranchId: number
  otherCount: 0
  results: Array<IRowData>
  totalCount: number
}

export interface IListViewDataRequestParams {
  pageNumber?: number
  pageSize?: number
  searchBy?: string
  searchText?: string
  sortBy?: string
  sortOrder?: string
}

export interface IListViewDataRequestPayload {
  params: IListViewDataRequestParams
}

export interface IOrgRoleListViewDataRequestParams {
  accessProfileId: number
  pageNumber?: number
  pageSize?: number
  searchBy?: string
  searchText?: string
  sortBy?: string
  sortOrder?: string
}

export interface IOrgRoleListViewDataRequestPayload {
  params: IOrgRoleListViewDataRequestParams
}

export interface IOrgRoleRowData {
  orgRoleId: number
  activeFl?: boolean
  attachedAccessProfileCount?: number
  attachedUserCount?: number
  defaultAccess: boolean
  locked?: boolean
  orgRoleDescription?: string
  orgRoleLandingPage?: string
  orgRoleName?: string
  orgRoleRefId?: string
  persona?: string
  validationStatusCode?: number
}

export interface IOrganizationRoleDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IOrgRoleRowData>,
  //clientProperties?: Record<string, IClientProperty>
}