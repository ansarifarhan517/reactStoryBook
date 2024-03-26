import { IClientProperty } from '../../common/ClientProperties/interfaces';


export interface IBillingAddress {
  isActiveFl: boolean
  geocodeLevel: string
}

export interface IRowData {
  customerId: number
  accountCode?: string
  accountName?: string
  address?: string
  billingAddress?: IBillingAddress
  geocodeLevel?: string
  isActiveFl?: boolean
  clientCode?: string
  emailAddress?: string
  isActive?: string
  mobileNumber?: string
  nodeCount?: number
  referenceId?: string
}

export interface ICustomerListViewDataPayload {
  clientBranchId?: number
  otherCount?: number
  totalCount: number
  results: Array<IRowData>
  clientProperties?: Record<string, IClientProperty>
}

export interface ICustomField {
  type: string
  field: string
  value: any
}

export interface INotifyDynamicTagsStructureOptions {
  text: string
  value: string
  id: string
  url: string
}
export interface INotifyDynamicTagsStructure {
  id: string
  notificationKeys: INotifyDynamicTagsStructureOptions[]
  notificationType: string
}
export interface INotifyDropdown {
  clientId: number
  emailBody: string
  emailSubject: string
  id: string
  isActiveFl: boolean
  isDeleteFl: boolean
  isEmailActiveFl: boolean
  isIvrActiveFl: boolean
  isSmsActiveFl: boolean
  name: string
  notificationType: string
  smsMessage: string
}

export interface INotifyRichTextEditorProp {
  mentions: any[]
  showHTMLOutput?: boolean
  insertMentionsProgrammatically: boolean
  inputHTML: string
  handleChange?: (value: string) => void
  label: string
  active: boolean
  dynamicNote: JSX.Element
  skipHTMLTags: boolean
  showCharCount?: boolean
  toolbar: boolean
  tags: any
  setHTMLOutput?: React.Dispatch<any>
  placeholder?: string
}

export type tGetNotifyTagsArray = {
  labelValue: string;
  value: string;
  key: string;
  url?: string;
  isCustomField?: boolean;
}; 