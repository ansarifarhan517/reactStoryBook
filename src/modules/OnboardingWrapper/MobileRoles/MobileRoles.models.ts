import { IListViewRequestPayload } from "../../../utils/common.interface";

export interface IEffectAction {
  [key: string]: any;
}
export interface IMobileRoleListViewRowData {
  orgRoleId: number
  orgRoleRefId: string
  activeFl: boolean
  orgRoleName: string
  orgRoleDescription: string
  orgRoleLandingPage: string
  attachedAccessProfileName: string
  attachedUserCount: number
  attachedAccessProfileCount: number
  locked: boolean
  validationStatusCode: number
  defaultAccess: boolean
}

export interface IMobileRoleListDataPayload {
  clientBranchId?: number;
  otherCount?: number;
  totalCount: number;
  results: Array<IMobileRoleListViewRowData>;
}

export interface ICreatePayload {
  orgRoleId?: number;
  orgRoleName: string;
  orgRoleDescription: string;
  orgRoleLandingPage: null;
  persona: string;
  accessProfileIds: Array<number>
}

export interface IFormInputs {
  [key: string]: any
}


export interface IMobileRoleListViewListViewRowProps {
  activeFl: boolean
  attachedAccessProfileCount: number
  attachedAccessProfileName: string
  attachedUserCount: number
  defaultAccess: boolean
  locked: boolean
  orgRoleDescription: string
  orgRoleId: number
  orgRoleName: string
  orgRoleRefId: string
  validationStatusCode: number
}


export interface IMobileOrgRoleAccessProfile {
  mappingId: number
  userGroupId: number
  accessProfileId: number
  accessProfileReferenceId: string
}

export interface IMobileOrgRole {
  orgRoleId: number
  orgRoleRefId: string
  activeFl: boolean
  orgRoleName: string
  orgRoleDescription: string
  orgRoleLandingPage: string
  clientId: number
  isSSOMandatoryFl: boolean
  orgRoleAccessProfile: IMobileOrgRoleAccessProfile[]
  locked: boolean
  validationStatusCode: number
  defaultAccess: boolean
}
export interface IAccessProfileList {
  accessProfileId: number
  accessProfileRefId: string
  accessprofileDesc: string
  accessprofileName: string
  activeFl: boolean
  clientId: number
  defaultProfileFl: boolean
  locked: boolean
}
export const mobileRoleData = {
  orgRoleId: 0,
  orgRoleRefId: '',
  activeFl: false,
  orgRoleName: '',
  orgRoleDescription: '',
  orgRoleLandingPage: '',
  clientId: 0,
  isSSOMandatoryFl: false,
  orgRoleAccessProfile: [{
    mappingId: 0,
    userGroupId: 0,
    accessProfileId: 0,
    accessProfileReferenceId: ''
  }],
  locked: false,
  validationStatusCode: 0,
  defaultAccess: false
}
export interface IMobileRoleByOrgRoleIdRequestPayload extends IListViewRequestPayload {
  orgRoleId?: number
}

export interface ICurrentStep {
  stepName?: string
  stepNameLabel?: string
  questions?: Array<{
    questionIdentifier: string
    questionLabelKey: string
    questionLabel: string
    questionDescLabelKey: string
    questionDescLabel: string
  }>
  [key: string]: any
}

export type tMobileRolesViewType = 'add-form-view' | 'list-view'

export interface IMobileRolesRouteParams {
  orgRoleId?: string;
}