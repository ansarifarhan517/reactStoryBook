import { IListViewRequestPayload } from "../../../utils/common.interface";
import { IClientProperty } from "../../common/ClientProperties/interfaces";
import { IFetchDataOptions, ISelectedRows  } from 'ui-library'

export type tBreadcrumbState = 'allTerritories' | 'activeTerritories' | 'inactiveTerritories'

export interface IBreadcrumbOptionsProps {
    id: string
    label: string
}

export interface ICoordinatesData {
    latitude: number
    longitude: number
}

export interface IDeliveryMediumData {
    deliveryMediumMasterId: number
    deliveryMediumName: string
    geofenceDMMappingId: number
    geofenceId: number
}

export interface IRowData {
    createdByUserId: number
    createdOnDt: number
    deliveryMediumMasterId: Array<IDeliveryMediumData>
    geofenceCategory: string
    geofenceId: number
    geofenceName: string
    geofenceProfileId: number
    geofenceProfileName: string
    isActiveFl: boolean
    isDefaultProfile: boolean
    isHighAlert: boolean
    radiusInKms: number
    shapeTypeCode: string
    polygonCoordinates: Array<ICoordinatesData>
    deliveryMediumData?: string
    customFieldsJSONString?: string;
}

export interface ITerritoryListDataPayload {
    clientBranchId?: number,
    otherCount?: number,
    totalCount: number,
    results: Array<IRowData>,
    clientProperties?: Record<string, IClientProperty>
}

export interface IGeofenceDataPayload {
    isActiveFl: boolean
    isDefault: boolean
    profileId: number
    profileName: string
    id: number
    label: string
    value: number
}

export interface ITerritoryLIstViewPaylod {
    params: IListViewRequestPayload
}

export interface IDAOptionsData {
    deliveryMediumMasterId: number
    deliveryMediumName: string
    employeeId: string
    mobileNumber: string
}

export interface ICategoryData {
    clientId: number
    clientRefMasterCd: string
    clientRefMasterDesc: string
    clientRefMasterId: number
    clientRefMasterType: string
    id: number
    isDeleteFl: string
    name: string
}
export interface IDropdown {
    label: string
    value: string
    [key: string]: any
}
export interface IDeleteModal {
    showDeletionConfirmation: boolean
    setShowDeletionConfirmation: (value: boolean) => void
    selectedRows: ISelectedRows
    setSelectedRows?: Function
    handleFetchData: Function
    fetchOptions: IFetchDataOptions
}

export interface IUpdateConfirmation {
    territoryUpdateRequest : IterritoryRequest | undefined
    setTerritoryUpdateRequest: Function
    title: string
    handleOkAction: () => void
    content: string
}
export interface IActiveDeactiveConfirmation {
    territoryActivationRequest : IterritoryRequest | undefined
    setTerritoryActivationRequest: Function
    setSelectedRows: Function
    handleFetchData: Function
    fetchOptions: IFetchDataOptions
    setEditMode: Function
}
export interface IterritoryRequest{ 
    activeRequest: boolean; 
    geofenceIds: Record<number, boolean>; 
    failureCallback?: React.Dispatch<React.SetStateAction<boolean>>
    message? : string
}

export interface IGeofenceProfileData {
    isActiveFl: boolean
    isDefault: boolean
    profileId: number
    profileName: string
    geofenceMasterDTOs: Array<IRowData>
}
export interface ISortCriteria {
    customField?: boolean
    fieldId: string
    fieldLabelKey: string
    operationLabelKey: string
    operationSymbol: string
  }
export interface IFilterInfo {
    advanceFilterTagReferenceIds: any[]
    filterName: string
    filters: any[]
    customField: boolean
    fieldId: string
    fieldLabelKey: string
    filterData: string
    operationLabelKey: string
    operationSymbol: string
    id: string
    isFavourite: boolean
    favouriteSections: string[]
    sortCriteria?: ISortCriteria[]
    operationLogic: string
    ownerUserId: any
    pageName: string
    sectionName: string
    userGroupIds: number[]
    userIds: number[]
  }