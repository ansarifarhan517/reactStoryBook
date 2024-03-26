import { IListViewRequestPayload } from "../../../utils/common.interface";

export interface IMobileTemplateListViewRowData {
  accessProfileId: number;
  accessProfileRefId: string;
  accessprofileName: string;
  accessprofileDesc: string;
  clientId: number;
  defaultProfileFl: boolean;
  locked: boolean;
  activeFl: boolean;
  attachedUserGroups: number;
}
export interface IMobileTemplateListDataPayload {
  clientBranchId?: number;
  otherCount?: number;
  totalCount: number;
  results: Array<IMobileTemplateListViewRowData>;
}

export interface IFormInputs {
  [key: string]: any
}

export interface IMobileRoleListViewRowData {
  orgRoleId: number
  orgRoleRefId: string
  activeFl: boolean
  orgRoleName: string
  orgRoleDescription: string
  orgRoleLandingPage: string
  attachedAccessProfileName: string
  attachedUserCount: number
  attachedAccessProfileCount: number
  locked: boolean
  validationStatusCode: number
  defaultAccess: boolean
}
export interface IEffectAction {
  [key: string]: any;
}

export interface IMobileRoleListDataPayload {
  clientBranchId?: number;
  otherCount?: number;
  totalCount: number;
  results: Array<IMobileRoleListViewRowData>;
}

export interface IMobileRoleByAccessProfileIdRequestPayload extends IListViewRequestPayload {
  accessProfileId?: number
}

export interface IMobileTemplateAccesses {
  accessName: string;
  sectionNameLabelKey: string;
  accessNameLabelValue: string;
  accessNameDescLabelValue: string;
  accessRefId: string;
  childAccessMode: boolean;
  accessId: number;
  accessMode: string;
  accesses?: Array<IMobileTemplateAccesses>
}

export interface IMobileTemplateAccessSections {
  sectionName: string;
  sectionNameLabelKey: string;
  sectionNameDescLabelKey: string;
  sectionNameLabelValue: string;
  sectionNameDescLabelValue: string;
  childAccessMode: boolean;
  accesses?: Array<IMobileTemplateAccesses>
  accessSections?: Array<IMobileTemplateAccessSections>
  accessId: number;
  accessRefId: string;
  sectionNameInfoTipLabelKey: string;
  accessMode: string;
}
export interface IMobileTemplateAccessModules {
  moduleName: string;
  accessSections?: Array<IMobileTemplateAccessSections>
}
export interface IMobileTemplateAccordianStructure {
  accessModules: Array<IMobileTemplateAccessModules>
}

export interface ICreatePayload {
  accessProfileId?: number;
  accessprofileName: string;
  accessprofileDesc: string;
  accessProfileType: string;
  accessReferenceIds: Array<string | undefined>;
}

export interface IMobileTemplate {
  accessProfileId: number;
  accessProfileRefId: string;
  accessprofileName: string;
  accessprofileDesc: string;
  accessReferenceIds: Array<string | undefined>;
  clientId: number;
  defaultProfileFl: boolean;
  locked: boolean;
  activeFl: boolean;
  additionalDetails: ITripStartTimePayload,
}

export interface ITripStartTimePayload {
  active: boolean,
  timeUnit: string,
  timeWindow: number,
  daNegativeAmount: number,
  allowDaNegativeAmount: boolean,
}

export const mobileTemplate = {
  accessProfileId: 0,
  accessProfileRefId: '',
  accessprofileName: '',
  accessprofileDesc: '',
  accessReferenceIds: [],
  clientId: 0,
  defaultProfileFl: false,
  locked: false,
  activeFl: false,
  additionalDetails: {
    active: false,
    timeUnit: "Minutes",
    timeWindow: 0,
    daNegativeAmount: 0,
    allowDaNegativeAmount: false,
  }
}

export interface IDynamicCardTileList {
  id: string;
  pageName: string;
  sectionName: string;
  clientId: number;
  structure: {
    columns: {
      [key: string]: {
        label: string;
        fieldName: string;
        fieldType: string;
        permission: boolean;
        fieldSequence: number;
        id: string;
        required: boolean;
        childNodes: { [key: string]: any };
        validation: { [key: string]: any };
        labelKey: string;
        customFieldModule: string;
        showLabel: boolean;
        bold: string;
        color: string;
        fontSize: number;
        backgroundColor: string;
        verticalAlignment: string;
        horizontalAlignment: string;
        rowSpan: number;
        colSpan: number;
        editable: boolean;
        searchable: boolean;
        sortable: boolean;
        customField: boolean;
      }
    }
  }
}

export const tileListStructure = {
  id: '',
  pageName: '',
  sectionName: '',
  clientId: 0,
  structure: {
    columns: {
    }
  }
}

export const masterStructure = {
  id: '',
  pageName: '',
  sectionName: '',
  clientId: 0,
  structure: {
    columns: {}
  },
  properties: {},
  addressStructure: {
    columns: {}
  }
}

export interface IDynamicOrderFieldStructure {
  label: string;
  fieldName: string;
  fieldType: string;
  permission: boolean;
  id: string;
  required: boolean;
  labelKey: string;
  showLabel: boolean;
  rowSpan: number;
  colSpan: number;
  allowedProperties: string[],
  editable: boolean;
  searchable: boolean;
  sortable: boolean;
  customField: boolean;
  fieldSequence: number;
}
export interface IDynamicOrderMasterStructure {
  id: string;
  pageName: string;
  sectionName: string;
  clientId: number;
  structure: {
    columns: {
      [key: string]: IDynamicOrderFieldStructure
    }
  },
  properties: {
     [key: string]: any
  },
  addressStructure: {
    columns: {
      [key: string]: IDynamicOrderFieldStructure
    }
  }
}

export interface IMobileTemplateRouteParams {
  accessProfileId?: string;
}

export const fontWeightMapping = {
  regular: 'normal',
  bold: 'bold'
}

export const fontColorMapping = {
  green: '#7CD21C',
  orange: '#FF8D36',
  pink: '#B8325C',
  purple: '#8360B0',
  blue: '#0089AF',
  black: '#000000',
  grey: '#616161',
  white: '#FFFFFF'
}

export const backgroundColorMapping = {
  None: 'transparent',
  black: '#000000',
  grey: '#616161',
  blue: '#0089AF',
  pink: '#B8325C',
  purple: '#8360B0',
  orange: '#FF8D36',
  green: '#7CD21C'
}

export const mobileScreenMapping = {
  NEW_ORDER: 'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-images/NewOrderMobile.png',
  inCompleteOrder: 'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-images/IncompleteOrderMobile.png',
  CURRENT_ORDER: 'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-images/CurrentOrderMobile.png',
  COMPLETED: 'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-images/CompletedOrderMobile.png'
}

export const orderTypeLabelMapping = {
  NEW_ORDER: 'NEW_ORDER_CONFIGURE',
  CURRENT_ORDER: 'CURRENT_ORDER_CONFIGURE',
  COMPLETED: 'COMPLETE_INCOMPLETE_ORDERS_CONFIGURE'
}

export const orderSectionMapping = {
  NEW_ORDER: 'MOBILE_NEW_ORDER_LIST',
  CURRENT_ORDER: 'MOBILE_CURRENT_ORDER_LIST',
  COMPLETED: 'MOBILE_COMPLETE_ORDER_LIST'
}

export const configureOrderList = [
  {
    clientNodeName: 'John Doe',
    clientName: 'John Doe',
    priority: 'High',
    orderNo: 'Order 12873323',
    awbNumber:'AWB 12873323',
    addressLine1: '228 Park Ave S, New York, NY',
    addressLine2: '10003-1502, US.',
    endTimeWindow: '10:45 AM',
    orderType:'Pickup',
    empty: '',
    deliveryType: "Fragile",
    noOfItems: 2,
    packageWeight: 50,
    shipmentNotes: "Hand over to the security",
    branchName: 'New York Main Hub',
    packageValue: '$1000',
    estimatedDeliveryFee: "$100",
    paymentType: 'Prepaid',
    orderState: 'forward',
    packageVolume: 50,
    deliveryLocationType: "Office",
    isPartialDeliveryAllowedFl: 'No',
    estimatedCost: '$1100',
    deliverEndTimeWindow: '10:45 AM',
    pickupEndTimeWindow: '10:45 PM',
    serviceTypeDesc: 'Standard',
    timeWindowConfirmedBy: "Not Confirmed",
    noOfAttempts: 5,
    isPartialDeliveredFl: 'No',
    cashAmount: '$1100',
    startTimeWindow: '10:45 AM',
    calculatedEndDt: '10:45 PM',
    endDt: '10:45 AM',
    etaWithoutServiceTime: '10:45 AM'
  },
  {
    clientNodeName: 'Gary Jason',
    clientName: "Gary Jason",
    priority: 'Medium',
    orderNo: 'Order 12873324',
    awbNumber:'AWB 12873323',
    addressLine1: '3645, Geneva Street, New York City,',
    endTimeWindow: '10:45 AM',
    addressLine2: 'New York',
    orderType:'Deliver',
    empty: '',
    deliveryType: "Hazmat",
    noOfItems: 3,
    packageWeight: 60,
    shipmentNotes: "Do not ring the bell",
    branchName: 'New York Main Hub',
    packageValue: '$1000',
    estimatedDeliveryFee: "$100",
    paymentType: 'Cash',
    orderState: 'reverse',
    packageVolume: 60,
    deliveryLocationType: "Home",
    isPartialDeliveryAllowedFl: 'No',
    estimatedCost: '$1100',
    deliverEndTimeWindow: '10:45 AM',
    pickupEndTimeWindow: '10:45 PM',
    serviceTypeDesc: 'Express',
    timeWindowConfirmedBy: "Confirmed by Dispatcher",
    noOfAttempts: 6,
    isPartialDeliveredFl: 'No',
    cashAmount: '$1100',
    startTimeWindow: '10:45 AM',
    calculatedEndDt: '10:45 PM',
    endDt: '10:45 AM',
    etaWithoutServiceTime: '10:45 AM'
  }
]

export const emptyField = {
  "label": "Empty",
  "fieldName": "input",
  "fieldType": "text",
  "permission": false,
  "id": "empty",
  "required": true,
  "validation": {},
  "labelKey": "empty",
  "showLabel": false,
  "rowSpan": 0,
  "colSpan": 0,
  "allowedProperties": [
    "fontSize",
    "color",
    "fontWeight",
    "backgroundColor"
  ],
  "editable": false,
  "searchable": true,
  "sortable": true,
  "customField": false
}
