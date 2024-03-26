
export interface IRowData {
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

export interface INoOfAccessProfileRequest {
  activeRequest: boolean
  customOrgRoleId: number | undefined
}

export interface INoOfUsersRequest {
  activeRequest: boolean
  customOrgRoleId: number | undefined
}

export interface IOrganizationRoleDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IRowData>,
  //clientProperties?: Record<string, IClientProperty>
}
export interface IListViewDataRequestParams {
  orgRoleId?: number
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

export interface IPersonaList {

  clientRefMasterId: number,
  clientRefMasterType?: string,
  clientRefMasterCd?: string,
  clientRefMasterDesc?: string,
  clientId?: number,
  isDeleteFl?: string,
  id?: number,
  name?: string,
  label?: string,
  value?: string
}

export interface ILandingPageList {
  clientId: number,
  clientRefMasterCd?: string,
  clientRefMasterDesc?: string,
  clientRefMasterId?: number,
  clientRefMasterType?: string,
  id?: number
  isDeleteFl?: string,
  name?: string
  label?: string,
  value?: string
}

export interface IAccessProfileDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IAccessProfileRowData>,
}


export interface IAccessProfileRowData {
  accessProfileId: number
  accessProfileRefId?: string
  accessprofileName?: string
  accessprofileDesc?: string
  attachedUserGroups?: number
  defaultProfileFl?: boolean
  activeFl?: boolean
  locked?: boolean
  // customFieldsJSONString?: string
}

export interface IUserCountDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IUserCountRowData>,
}

export interface IUserCountRowData {
  clientBranchName?: string
  clientId?: number
  clientName?: string
  createdOnDt?: number
  distributionCenter?: number
  emailAddress?: string
  isActiveFl?: boolean
  mobileNumber?: string
  name?: string
  timezoneChanged?: boolean
  userGroupId?: number
  userGroupName?: string
  userId: number
  userName?: string
}