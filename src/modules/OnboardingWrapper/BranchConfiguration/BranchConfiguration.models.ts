import { IMongoField, IMongoFormStructure } from './../../../utils/mongo/interfaces';
import { tIconRef, tPopupRef } from '../../../utils/components/Map/interface';
import { IClientProperty } from './../../common/ClientProperties/interfaces';
export interface IBranchConfigurationListViewRowData {
    address: string;
    adminContactName: string;
    alreadyOfferedCnt: number;
    apartment: string;
    autoAllocateFl: string;
    canonicalId: string;
    city: string;
    clientBranchId: number;
    clientName: string;
    country: string;
    deliveryMediumAutoAllocateFl: string;
    emailAddress: string;
    isActiveFl: boolean;
    lat: number;
    lng: number;
    locality: string;
    mobileNumber: string;
    modelType: string;
    name: string;
    shortName: string;
    state: string;
    streetName: string;
    superClientParentBranch: string;
    superClientParentBranchId: number;
    zipCode: string;
    subBranches?: Array<IBranchConfigurationListViewRowData>;
    description?: string;
    hasChildBranches?: boolean;
    customFieldsJSONString?: string;
}

export interface IBranchConfigurationListDataPayload {
  clientBranchId?: number;
  otherCount?: number;
  totalCount: number;
  results: Array<IBranchConfigurationListViewRowData>;
  clientProperties?: Record<string, IClientProperty>;
  zones?:Array<IBranchZones>
}

export interface IOperationTimings {
  isActiveFl: boolean;
  daysOfWeek: string;
  operationsStartTime: string;
  operationsEndTime: string;
  operationsTimingId: IMongoFormStructure | number;
}
export interface IOperationTimingsListDataPayload {
  operationTimings: IOperationTimings[];
}

export interface IListViewLoading {
  branchList: boolean;
  operationTimings: boolean;
  branchManagers: boolean;
  daysOfWeek?: any[];
}

export interface IBranchManagerShifts {
  isActiveFl: boolean;
  shiftTimingId: number;
  daysOfWeek: Array<string>;
  shiftStartTime: string;
  shiftEndTime: string;
}
export interface IBranchManagerDetails {
  isActiveFl: boolean;
  branchManagerId: boolean;
  managerContactName: string;
  mobileNumber: string;
  whatsappOptin: boolean;
  emailAddress: string;
  shifts: Array<IBranchManagerShifts>;
}

export interface IBranchManagerListPayload {
  payload: IBranchManagerDetails[] | [];
}
export interface IBranchManagerListDataPayload {
  branchManagers: IBranchManagerListPayload[];
  map: Function;
}

export interface ITreeListRequestPayload {
  pageNumber?: number;
  pageSize?: number;
  clientBranchId: number;
}

export interface IBranchDetails {
    operationTimings: [],
    managerDetails: []
    clientBranchId: number,
}
export interface IBranchConfigurationTreeDataSubBranchPayload {
    payload: Array<IBranchDetails> | [];
}   
export interface IBranchConfigurationMapMarkers {
  id: number;
  position: [number, number];
  title: string;
  type: string;
  popupRef: tPopupRef;
  iconRef: tIconRef;
  lat: number;
  lng: number;
}

export interface IEffectAction {
  [key: string]: any;
}

export interface IShiftTimingsTouchStatus {
  [key: string]: boolean
}
export interface IDynamicMongoField {
  [key: string]: IMongoField;
}

export interface IOperationTimingsStructure {
  [key: string]: IMongoFormStructure | null | any;
  operationsTimingId: IMongoFormStructure | null;
}
export interface IOperationTimingsStructureList {
  payload: Array<IOperationTimingsStructure>
}


export interface IShiftTimingStructure {
  [key: string]: IMongoFormStructure | null | any;
  branchManagerId: string;
}

export interface IShiftTimingStructureList {
  payload: Array<IShiftTimingStructure>
}


export interface ISelectedShiftDays {
  day: string; 
  startTime: string; 
  endTime: string;
}

export interface IBranchManagerStructure {
  [key: string]: IMongoFormStructure | null | any;
  // branchManagerId: string | null;
}

export interface IBranchManagerStructureList {
  payload: Array<IBranchManagerStructure>
}


export interface IMangerDetails {
  branchManagerId: number | string;
  emailAddress: string;
  isActiveFl: boolean;
  isDeleteFl: string;
  managerContactName: string;
  mobileNumber: string
  whatsappOptin: boolean;
  shifts: Array<IShifts>
}

export interface IShifts {
  daysOfWeek: string
  isActiveFl: boolean
  isDeleteFl: string
  shiftEndTime: string
  shiftStartTime: string
  shiftTimingId: number
}

export interface ISetServiceType {
  clientId: number;
  clientRefMasterCd: string;
  clientRefMasterDesc: string;
  clientRefMasterId: number;
  clientRefMasterType: string;
  id: number;
  isDeleteFl: string;
  name: string;
}

export interface IWeekDays {
  clientRefMasterId: number;
  clientRefMasterType: string;
  clientRefMasterCd: string;
  clientRefMasterDesc: string;
  clientId: number;
  isDeleteFl: string;
  id: number;
  name: string;
}

export interface ICreatePayload {
    adminContactName: string;
    autoAllocateFl: string;
    deliveryMediumAutoAllocateFl: string;
    isOwnBranchFl: string;
    isHubFl: string;
    clientBranchAccountDTO: {
      [key: string]: any;
    },
    clientId: number;
    branchName: string;
    isSuperFl: string;
    coloaderId: number | null;
    coloaderName: string | null;
    description: string;
    division: string;
    lat: number;
    lng: number;
    modelType: string;
    name: string;
    radiusInKms: number;
    geoFenceRadius: number;
    shortName: string;
    skillSet: string;
    superClientParentBranchId: number | null;
    subClientParentBranchId: number | null;
    clientParentBranchName: string | null;
    timezoneId: number;
    timezone: number;
    gmtoffset: string; 
    apartment: string;
    streetName: string;
    landmark: string;
    locality: string;
    city: string;
    stateShortCode: string;
    state: string;
    countryShortCode: string;
    zipCode: number;
    country: string;
    branchDescription: string;
    billingContactName: string;
    officeNumber: number;
    mobileNumber: number;
    emailAddress: string;
    longitude: number;
    latitude: number;
    loadingTime: number;
    unloadingTime: number;
    managerDetails: IMangerDetails[],
    operationTimings: IOperationTimings[],
}

export interface IFormInputs {
  [key: string] : any
}

export interface ILocalStorageEntries {
  [key: string] : any
}
export interface IBranchConfigFormProps {
  closeAddBranchForm?: Function
  vendorData?: any
  onCancel?: Function
}

export interface IBranchConfigurationViewType {
  viewType: 'add-form-view' | 'list-view' | 'map-view' | 'tree-view' | string
}

export interface ISkillSet {
  clientId: number;
  clientRefMasterCd: string;
  clientRefMasterDesc: string;
  clientRefMasterId: number;
  clientRefMasterType: string;
  id: number;
  isDeleteFl: string;
  name: string;
}

export interface IBranchDropdownComponentProps {
  id: string
  name?: string
  label?: string
  value: string
  clientNodeId?: string
}

export interface IBranchZoneStructure {
  [key: string]: IMongoFormStructure | null | any;
  // branchManagerId: string | null;
}

export interface IBranchZonesRateProfile{
  serviceType?: undefined,
  rateProfile?:number,
  committedSLA?:number,
  isDeleteFl?: boolean,
}
export interface IBranchZones {
  zoneCreationPreference?:string,
  zoneName?:string,
  zoneDescription?:string,
  coords?:any[],
  zoneType?:string,
  lstZoneGeofence?:any[],
  zoneRateProfile?:any[],
  polygonCoordinates?:any[],
  [key: string]: any;
}

interface IHoliday {
  holidayDate: number
  holidayId: number
  holidayName: string
}

export interface IHolidayCalendar {
  calendarDesc: string
  calendarId: number
  calendarName: string
  clientId: number
  holidays?: IHoliday[]
  isActiveFl: string
  isDefaultCalendar: string
  isDeleteFl: string
  isEditable: string
  shipperGroupId: number
  shipperId?: number[]
  year: number
}

export interface IHolidayCalendarList {
  defaultCalendar: IHolidayCalendar[]
}

export interface IHolidayCalendarDataPayload {
  favouriteCalendarName: string
  templateList: IHolidayCalendarList[]
}

export const skillList = [
  {
    clientId: 445,
    clientRefMasterCd: 'PUC',
    clientRefMasterDesc: 'PUC',
    clientRefMasterId: 6077,
    clientRefMasterType: 'DELIVERYTYPE',
    id: 6077,
    isDeleteFl: 'N',
    name: 'PUC',
  },
  {
    clientId: 445,
    clientRefMasterCd: 'HAZMAT',
    clientRefMasterDesc: 'HAZMAT',
    clientRefMasterId: 6078,
    clientRefMasterType: 'DELIVERYTYPE',
    id: 6078,
    isDeleteFl: 'N',
    name: 'HAZMAT',
  },
  {
    clientId: 445,
    clientRefMasterCd: 'Parcel',
    clientRefMasterDesc: 'Parcel',
    clientRefMasterId: 1499,
    clientRefMasterType: 'DELIVERYTYPE',
    id: 1499,
    isDeleteFl: 'N',
    name: 'Parcel',
  },
  {
    clientId: 445,
    clientRefMasterCd: 'TRK',
    clientRefMasterDesc: 'TRK',
    clientRefMasterId: 1500,
    clientRefMasterType: 'DELIVERYTYPE',
    id: 1500,
    isDeleteFl: 'N',
    name: 'TRK',
  },
  {
    clientId: 445,
    clientRefMasterCd: 'DLBOY',
    clientRefMasterDesc: 'DLBOY',
    clientRefMasterId: 1501,
    clientRefMasterType: 'DELIVERYTYPE',
    id: 1501,
    isDeleteFl: 'N',
    name: 'DLBOY',
  },
  {
    clientId: 445,
    clientRefMasterCd: '48_LG',
    clientRefMasterDesc: '48_LG',
    clientRefMasterId: 6259,
    clientRefMasterType: 'DELIVERYTYPE',
    id: 6259,
    isDeleteFl: 'N',
    name: '48_LG',
  },
  {
    clientId: 445,
    clientRefMasterCd: '53_LG',
    clientRefMasterDesc: '53_LG',
    clientRefMasterId: 6260,
    clientRefMasterType: 'DELIVERYTYPE',
    id: 6260,
    isDeleteFl: 'N',
    name: '53_LG',
  },
  {
    clientId: 445,
    clientRefMasterCd: '50_LG',
    clientRefMasterDesc: '50_LG',
    clientRefMasterId: 6261,
    clientRefMasterType: 'DELIVERYTYPE',
    id: 6261,
    isDeleteFl: 'N',
    name: '50_LG',
  },
  {
    clientId: 445,
    clientRefMasterCd: 'check',
    clientRefMasterDesc: 'check',
    clientRefMasterId: 6287,
    clientRefMasterType: 'DELIVERYTYPE',
    id: 6287,
    isDeleteFl: 'N',
    name: 'check',
  },
];

export const WEEKDAYS = [
  {
    clientRefMasterId: 352,
    clientRefMasterType: 'WEEKDAYS',
    clientRefMasterCd: 'Monday',
    clientRefMasterDesc: 'Monday',
    clientId: 0,
    isDeleteFl: 'N',
    id: 352,
    name: 'Monday',
  },
  {
    clientRefMasterId: 353,
    clientRefMasterType: 'WEEKDAYS',
    clientRefMasterCd: 'Tuesday',
    clientRefMasterDesc: 'Tuesday',
    clientId: 0,
    isDeleteFl: 'N',
    id: 353,
    name: 'Tuesday',
  },
  {
    clientRefMasterId: 354,
    clientRefMasterType: 'WEEKDAYS',
    clientRefMasterCd: 'Wednesday',
    clientRefMasterDesc: 'Wednesday',
    clientId: 0,
    isDeleteFl: 'N',
    id: 354,
    name: 'Wednesday',
  },
  {
    clientRefMasterId: 355,
    clientRefMasterType: 'WEEKDAYS',
    clientRefMasterCd: 'Thursday',
    clientRefMasterDesc: 'Thursday',
    clientId: 0,
    isDeleteFl: 'N',
    id: 355,
    name: 'Thursday',
  },
  {
    clientRefMasterId: 356,
    clientRefMasterType: 'WEEKDAYS',
    clientRefMasterCd: 'Friday',
    clientRefMasterDesc: 'Friday',
    clientId: 0,
    isDeleteFl: 'N',
    id: 356,
    name: 'Friday',
  },
  {
    clientRefMasterId: 357,
    clientRefMasterType: 'WEEKDAYS',
    clientRefMasterCd: 'Saturday',
    clientRefMasterDesc: 'Saturday',
    clientId: 0,
    isDeleteFl: 'N',
    id: 357,
    name: 'Saturday',
  },
  {
    clientRefMasterId: 358,
    clientRefMasterType: 'WEEKDAYS',
    clientRefMasterCd: 'Sunday',
    clientRefMasterDesc: 'Sunday',
    clientId: 0,
    isDeleteFl: 'N',
    id: 358,
    name: 'Sunday',
  },
];
