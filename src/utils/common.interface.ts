export interface IListViewRequestPayload {
  pageNumber?: number
  pageSize?: number
  searchBy?: string
  searchText?: string
  sortBy?: string
  sortOrder?: string
  filterDataList?: any
  isLoading?: boolean
  page?: string
  status?: string,
  filter?: string,
  deliveryType?: string
  dataFromControlTower?: { filter?: string, deliveryType?: string }
  subClientId?: number | string
  module?: string
  endDateFilter?: string
  startDateFilter?: string
  exceptionStatus?: string
}

export interface IOrderListViewRequestPayload extends IListViewRequestPayload {
  dataFetchMode?: string
  endDateFilter?: string
  startDateFilter?: string
  status?: string
  filterDataList?: any
  isLoading?: boolean
}

export interface IListViewCountResponsePayload {
  data: {
    clientBranchId: number
    otherCount: number
    results: []
    totalCount: number
  }
  hasError: boolean
  message: string
  moreResultsExists: boolean
  status: number
}

export interface IClientMetricSystem {
  conversionFactor: Float32Array
  name: string
  precision: number
}

export type tConversionType = 'GET' | 'POST'

export interface IDropdown {
  label: string
  value: number | string
  [key: string]: any
}



export interface IBranchLookupResponse {
  branchDescription?: string
  branchId: number
  canonicalId?: string
  clientNodeId?: number
  dst?: string
  gmtoffset?: string
  id: number
  name?: string
  label?: string
}

export interface ICountryLookupResponse {
  code: string
  displayName: string
  googleCountryCode: string
  id: number
  name: string
}

export interface IStatusLookupResponse {
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

export interface IPriorityLookupResponse {
  clientRefMasterType: string
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  sequence: number
}

export interface IUserAccessInfo {
  accessToken: string
  userName: string
  userId: number
  subClients: []
  modelType: string
  clientBranches: string
  CLIENT_SECRET_KEY: string
  isSuperClient: boolean
  isClientExpire: boolean
  clientLogo: string
  countryCode: string
  baseCountry: string
  countryId?: number
  clientLocale: string
  superType: string
  baseCurrency: string
  planType: string
  userImagePath: string
  baseCountryId: number
  timezone: string
  timezoneMode: string
  region: string
  productDomain: string
  firebaseConfigKey?: string
  firebaseConfigProjectId?: string
  firebaseConfigKeySocket?: string
  firebaseConfigProjectIdSocket?: string
  wordpressToken?: string
}
export interface IShipperLookupResponse {
  id: number
  isActiveFl: boolean
  name: string
  region: string
}
export type tIndustryType = 'ECOMMERCE' | 'COURIEREXPRESSANDPARCEL' | 'FMCGSECONDARY' | 'RETAIL' | '3PLLOGISTICSPROVIDER'

export type tModelType = 'FMLM' | 'LH' | 'FM' | 'LM'

export type tSuperType = 'MIDDLEMILE' | undefined

export interface IMongoDynamicHTMLTemplate<T> {
  id: string
  clientId: number
  type: string
  name: string
  isFavouriteFl?: boolean
  htmlData: T
  subType: 'MIDDLEMILE' | 'FMLM' | 'LH' | 'FORCE' | 'FM' | 'LM'
  isDeleteFl: boolean
}

export interface IAdditionalWebhookRecord {
  [key: string]: {
      id: string
      name: string
      class: string
  }
}

export interface IAdditionalHeader {
  key: string
  value: string
  sequence: number
}