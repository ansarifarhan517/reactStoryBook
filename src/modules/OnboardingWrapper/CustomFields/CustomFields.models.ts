  export interface IRowData {
    attachedWithModules?: any
    customFieldId: string
    customFieldName: string
    customFieldType: string
    id: string
    isActiveFl: boolean
    version: number
  }
  
  export interface ICustomFieldsDataPayload {
    clientBranchId?: number,
    otherCount?: number,
    totalCount: number,
    results: Array<IRowData>
  }
  export interface IModuleList{
    clientId?: number
    clientRefMasterCd?: string
    clientRefMasterDesc?: string
    clientRefMasterId?: number
    clientRefMasterType?: string
    id?: number
    isDeleteFl?: string
    name?: string
  }
  export interface IDuplicateData {
    name?: string
    key?: string
  }
  
  