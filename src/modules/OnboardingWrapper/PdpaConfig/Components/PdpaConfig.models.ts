import { IMongoFormStructure, IMongoListViewStructure } from "../../../../utils/mongo/interfaces";
import { ICustomFormData } from "../../CustomForms/CustomForms.models";

export interface IRowData {
  isActiveFl?: boolean
  exceptionMode?: string
  exceptionCode?: string
  exceptionName?: string
  exceptionType?: string
  exceptionStage?: string[]
  exceptionAppliesTo?: string[]
  exceptionMessage?: string
  exceptionGroupId?: string
  exceptionStatus?: string
  ignoreSelectAll?: boolean
}



export interface IconsentActDataPayload {
  hasError? : boolean,
  message?: any,
  moreResultsExists?: false
  totalCount?: number,
  results: Array<any>
}

export interface IConsentFormData {
  customFormId: number
  id: string
  isActiveFl: string
  userGroupId: number
  createdOnDt: string
  consentType: string
  customFormStructure: IMongoFormStructure
  isPublished:boolean
  name:string
  noOfModifications:any
  version: any
  editIconButtonProps?: any
}

export interface IPdpaState {

  listview: {
    consentAct: {
      structure: IMongoListViewStructure,
      data: any,
      loading: boolean
      viewType: String

    }
  },
  Form: {
    consetActForm: {
      structure: any,
      loading:boolean
    },
    consetActFormUpdate:{
      customFormData : IConsentFormData
  }
    isUpdate:String
  },
  pageType: String
}