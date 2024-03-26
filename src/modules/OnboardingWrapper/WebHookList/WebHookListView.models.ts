// import { IFetchDataOptions } from 'ui-library'
import { IListViewRequestPayload } from "../../../utils/common.interface";

export interface ITriggerEvents{
    createdOnDt: number
    customFormGroupId: string
    formName: string
    id: string
    isActiveFl: boolean
    isMandatory: boolean
    orderLocation: string
    orderType: string
    sectionName: string
    taskType: string
    triggerName: string
    userGroupId: number
    userGroupName: string
  }
  
  export interface IRowData {
    createdOnDt:number
    updatedOnDt:number
    createdByUserId: number
    updatedByUserId: number
    isDeleteFl: string
    isActiveFl:boolean
    clientPropertyId: number
    clientId: number
    propertyKey: string
    propertyValue:string
    propertyType: string
    type: string
  }
  
  export interface IResults {
    results: IRowData[]
    clientBranchId: number
    otherCount: number
    totalCount: number
  }
  export interface IWebHookListViewDataPayload extends IListViewRequestPayload {
    eventType?: string
    module?:string
    startDateFilter: string
    endDateFilter: string
  }
  
  export interface IModuleTypes {
    clientId: number
    clientRefMasterCd: string
    clientRefMasterDesc: string
    clientRefMasterId: number
    clientRefMasterType: string
    id: number
    isDeleteFl: string
    name: string
  }

  export interface IEventTypes {
    clientId: number
    clientRefMasterCd: string
    clientRefMasterDesc: string
    clientRefMasterId: number
    clientRefMasterType: string
    id: number
    isDeleteFl: string
    name: string
    label?:string
    value?: string
  }

  export interface IEventTypesHashMap {
    [key:string]: IEventTypes[]
  }


  export interface IResponseBody {
      orderNo: string
      latitude: Float32Array,
      longitude:Float32Array,
      pickedUpTime: string,
      status: string,
      notificationType:string,
      orderLeg: string,
      awbNumber: string,
      customerComment: string,
      customerRating: number,
      deliveryMediumName: string,
      phoneNumber: string,
      orderState: string,
      customerName: string,
      recipientName: string,
      branchName: string,
      orderReferenceId: string
     
  }
  export interface IWebHookDetail {
    clientId: number
    createdDate: number
    data: string
    entityId: number
    entityName: string
    geofenceId: number
    module: string
    mongoId: string
    notificationType: string
    responseCode: number
    responseMessage: string
    status: string
    statusHolder: string
    updatedDate: number
    url: string
    shipmentDetailsId?: number
  }

export interface IAttemptData extends IWebHookDetail{
  
  eventDataList: IWebHookDetail[]
}
export interface IFilterSection {
  moduleOptions: IModuleTypes[],
  eventOptions: IEventTypes[],
  moduleValue?: string,
  eventValue?: string,
  eventDate: [Date, Date],
}

export interface IAttempts {
  id: string
  label: string
  value: string
}

export interface IPaginationFl {
  moreResultExists: boolean
  disableNext: boolean
  dataType: string | undefined
}