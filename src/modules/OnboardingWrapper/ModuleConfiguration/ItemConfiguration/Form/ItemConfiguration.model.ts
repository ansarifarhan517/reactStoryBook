export interface IUserData {
  [key:string]:any
}
export interface IItemFormParams {
  itemId?: string
}

export interface IItemFormData {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}

export interface IRowData {
  userId: number
  accessProfileRefId: String
  accessprofileName: String
  activeFl: boolean
  attachedUserGroups: number
  defaultProfileFl: boolean
  locked: boolean
}

export interface IItemFormDataPayload {
  clientBranchId: number
  otherCount: 0
  results: Array<IRowData>
  totalCount: number
}