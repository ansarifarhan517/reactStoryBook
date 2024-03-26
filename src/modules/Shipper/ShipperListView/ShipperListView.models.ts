import { IClientProperty } from '../../common/ClientProperties/interfaces';

export interface IShipperListViewRowData {
  addedOn: number
  address: string
  adminName: string
  billingAddress: string
  clientBranch: string
  emailAddress: string
  isActiveFl: boolean
  noOfUsers: number
  phoneNumber: number
  shipperDetailsId: number
  shipperName: string
  shippingAddress: string
  status: string
  subClientId: number
  superClientId: number
  customerSupportNumber?: string
  customerSupportEmail?: string
  priority?: string
  rateChartName?: string
  customFieldsJSONString?: string
  token: string
}

export interface IShipperListViewDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IShipperListViewRowData>,
  clientProperties?: Record<string, IClientProperty>
}

export interface ICustomField {
  type: string,
  field: string,
  value: any
}


export interface IDropdown {
  label: string
  value: number | string
  [key: string]: any
}
export type tShipperStatus =
  | "ALL"
  | "EMAIL_VERIFICATION_PENDING"
  | "APPROVAL_PENDING"
  | "APPROVED"
  | "REJECTED"
export type tShipperModes = 'mapview' | 'listview'


export interface IIconDropdownChildren {
  selectedOption?: IDropdown
  menuIsOpen: boolean
  setMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IStatusList {
  clientId?: number
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId?: number
  clientRefMasterType?: string
  id?: any
  isDeleteFl?: string
  name: string
  label?: string
  value?: any
}

export interface IPriorityList {
  clientRefMasterType: string
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  sequence: number
}

export interface IRequestConversionList {
  clientRefMasterType: string
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
}
export interface IServiceAreaProfileNameList {
  activeFl: boolean
  defaultFl: boolean
  isActiveFl: boolean
  isDefaultFl: boolean
  serviceAreaProfileId: number
  serviceAreaProfileName: string
  updateFl: boolean
}
