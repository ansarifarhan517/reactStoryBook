export interface IAddFormData {
  accessProfileId: number
  accessProfileName: string
  accessProfileDesc: string
  accessReferenceIds: string[]
}

export interface IAccessModules {
  moduleName: string
  moduleLabelKey: string
  moduleLabelValue: string
  accessModes?: IAccessModuleModes[]
  accessSections?: IAccessSections[]
}

export interface IAccessModuleModes {
  accessModeName: string
  accessModeLabelKey: string
  accessModeLabelValue: string
  accessModeDescLabelKey: string
  accessModeDescLabelValue: string
  accessModeKey: string
  defaultAccess: boolean
}

export interface IAccessSections {
  sectionName: string
  sectionNameLabelKey: string
  sectionNameLabelValue: string
  sectionNameDescLabelKey: string
  sectionNameDescLabelValue: string
  accessRefId: string
  childAccessMode: boolean
  linkedAccessRefIdList: string[]
  accesses: IAccess[]
  accessSections: IAccessSections[]
  linkedAccessMode: string[]
  childAccessList: string[]
  accessId: number
  sectionNameInfoTipLabelKey: string
  sectionNameInfoTipLabelValue: string
  accessMode: string
}

export interface IAccess {
  accessName: string
  accessNameLabelKey: string
  accessNameLabelValue: string
  accessNameDescLabelKey: string
  accessNameDescLabelValue: string
  accessRefId: string
  linkedAccessMode: string[]
  childAccessMode: boolean
  accesses: IAccess[]
  linkedAccessRefIdList: string[]
  childAccessList: string[]
  accessId: number
  accessNameInfoTipLabelKey: string
  accessNameInfoTipLabelValue: string
  accessMode: string
}

export interface IAccessProfileFormReducerState {
  structure: any
  loading: boolean
  isEditMode: boolean
  flatObject: any
  DISPATCHER_READONLYACC: any
  DISPATCHER_ALLACCESSACC: any
  CARRIER_READONLYACC: any
  CARRIER_ALLACCESSACC: any
  SHIPPER_READONLYACC: any
  SHIPPER_ALLACCESSACC: any
  accessRefIds: any
}

export interface IAccessProfileFormParams {
  accessProfileId?: string
}

export interface IFlatMap {
  [key :string] : string
}