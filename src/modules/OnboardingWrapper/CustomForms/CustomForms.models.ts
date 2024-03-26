import { IMongoFormStructure } from "../../../utils/mongo/interfaces";


export interface IDropDownValue {
  clientId: number
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  clientRefMasterType: string
  id: number
  isDeleteFl: string
  name: string
}
export interface IFormFields {
  [key: string]: any
}
export interface ITriggerEventsStructure {
  [key: string]: IMongoFormStructure | null | any;
}
export interface ITriggerEventsList {
  payload: ITriggerEventsStructure[]
}
export interface ITriggerEvents {
  createdOnDt: number
  customFormGroupId: string
  formName: string
  id: string
  isActiveFl: boolean
  isMandatory: boolean
  orderLocation: string
  orderStates: string[]
  subClientIds: number[]
  serviceTypes: string[]
  taskTypes: string[]
  orderType: string
  sectionName: string
  taskType: string
  triggerName: string
  userGroupId: number
  userGroupName: string
}

export interface IRowData {
  createdOnDt?: number
  customFormGroupId: number
  formName: string
  triggerEvents: any
  userGroupId: number
  userGroupName: string
  editIconButtonProps?: any
}

export interface ICustomFormsDataPayload {
  clientBranchId?: number,
  otherCount?: number,
  totalCount: number,
  results: Array<IRowData>
}

export interface IFieldSettings {
  id: number;
  Name: string;
  Value?: string;
  Type: string;
  Options?: Array<Record<string, string>>;
  Settings: Array<Record<string, any>>;
  className: string;
  Active: boolean;
  Placeholder: string;
  fieldSequence: number;
  // selected?: boolean;
}
export interface ICurrentField {
  id: number;
  Name: string;
  Settings: Array<IFieldSettings>;
  Active: boolean;
  // ChangeFieldSetting: Function;
}

export interface ICustomFormData {
  customFormGroupId: number
  formName: string
  formDescription: string
  userGroupId: number
  userGroupName: string
  triggerEventsData: ITriggerEvents[]
  structure: IMongoFormStructure
}

export interface ICustomFormRouteParams {
  customFormGroupId?: string;
}

export interface IDropDownOptions {
  clientId: number
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  clientRefMasterType: string
  id: number
  isDeleteFl: string
  name: string
}

export const dropDownOptions = [{
  clientId: 0, 
  clientRefMasterCd: "",
  clientRefMasterDesc: "",
  clientRefMasterId: 0,
  clientRefMasterType: "",
  id: 0,
  isDeleteFl: "",
  name: ""
}]
export interface IAccountNames {
  id: number
  isActiveFl: boolean
  name: string
  region: string
}

export const accountNames = [{
  id: 0,
  isActiveFl: false,
  name: "",
  region: ""
}];

export const fieldTypes = [
  {
    iconVariant: "-",
    label: "Text",
    type: 'text'
  },
  {
    iconVariant: "icon-mail-1",
    label: "Email",
    type: 'email'
  },
  {
    iconVariant: "calendar-empty",
    label: "Date",
    type: 'date'
  },
  {
    iconVariant: "clock-outlined",
    label: "Time",
    type: 'time'
  },
  {
    iconVariant: "clock-outlined",
    label: "Date & Time",
    type: 'datetime'
  },
  {
    iconVariant: "clock-outlined",
    label: "Integer Number",
    type: 'number'
  },
  {
    iconVariant: "clock-outlined",
    label: "Decimel Number",
    type: 'decimal_number'
  },
  {
    iconVariant: "clock-outlined",
    label: "Percentage",
    type: 'perc_number'
  },
  {
    iconVariant: "clock-outlined",
    label: "Dropdown",
    type: 'dropdown'
  },
  {
    iconVariant: "clock-outlined",
    label: "Radio",
    type: 'radioGroup'
  },
  {
    iconVariant: "clock-outlined",
    label: "Checkbox",
    type: 'checkbox'
  },
  {
    iconVariant: "clock-outlined",
    label: "Geotagging",
    type: 'geocode'
  },
  {
    iconVariant: "clock-outlined",
    label: "E-Signature",
    type: 'esign'
  },
  {
    iconVariant: "clock-outlined",
    label: "Phone Number",
    type: 'phone_number'
  },
  {
    iconVariant: "clock-outlined",
    label: "Image",
    type: 'epod'
  },
  {
    iconVariant: "clock-outlined",  //xxx
    label: "Scanner",
    type: 'barCode'
  },
  {
    iconVariant: "-",  //xxx
    label: "TextArea",
    type: 'TextArea'
  }
]


export const fieldSettings = [
  {
  "id": 1,
  "fieldSequence": 1,
  "Name": "Text",
  "Type": "text",
  "Placeholder": "Text",
  "className": "text",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Text",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected":  true ,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  },
  {
    "Name": "Min Character Length",
    "Value": 0,
    "Type": "min"
  },
  {
    "Name": "Max Character Length",
    "Value": 255,
    "Type": "max"
  }
  ]
},
{
  "id": 2,
  "fieldSequence": 2,
  "Name": "Email",
  "Type": "email",
  "Placeholder": "Email",
  "className": "mail-1",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Email",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  },
  {
    "Name": "Min Character Length",
    "Value": 0,
    "Type": "min"
  },
  {
    "Name": "Max Character Length",
    "Value": 255,
    "Type": "max"
  }
  ]
},
{
  "id": 3,
  "fieldSequence": 3,
  "Name": "Date",
  "Type": "date",
  "Placeholder": "Date",
  "className": "calendar-empty",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Date",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  },
  ]
},
{
  "id": 4,
  "fieldSequence": 4,
  "Name": "Time",
  "Type": "time",
  "Placeholder": "Time",
  "className": "clock",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Time",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true ,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  },
  ]
},
{
  "id": 5,
  "fieldSequence": 5,
  "Name": "DateTime",
  "Type": "datetime",
  "Placeholder": "DateTime",
  "className": "date-time",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "DateTime",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  },
  ]
},
{
  "id": 6,
  "fieldSequence": 6,
  "Name": "Integer Number",
  "Type": "number",
  "Placeholder": "Integer Number",
  "className": "integer-number",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Integer Number",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  },
  {
    "Name": "Min Value",
    "Value": 0,
    "Type": "minVal"
  },
  {
    "Name": "Max Value",
    "Value": 100,
    "Type": "maxVal"
  }
  ]
},
{
  "id": 7,
  "fieldSequence": 7,
  "Name": "Decimal Number",
  "Type": "decimal_number",
  "Placeholder": "Decimal Number",
  "className": "decimal-number",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Decimal Number",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  },
  {
    "Name": "Min Value",
    "Value": 0,
    "Type": "minVal"
  },
  {
    "Name": "Max Value",
    "Value": 100,
    "Type": "maxVal"
  }
  ]
},
{
  "id": 8,
  "fieldSequence": 8,
  "Name": "Percentage",
  "Type": "perc_number",
  "Placeholder": "Percentage",
  "className": "percent",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Percentage",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  },
  {
    "Name": "Min Value",
    "Value": 0,
    "Type": "min"
  },
  {
    "Name": "Max Value",
    "Value": 100,
    "Type": "max"
  }
  ]
},
{
  "id": 9,
  "fieldSequence": 9,
  "Name": "Dropdown",
  "Type": "dropdown",
  "Placeholder": "Dropdown",
  "className": "dropdown",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Dropdown",
    "Type": "text"
  },
  {
    "Name": "Options",
    "Type": "dropdown_increment",
    "Options": [
      { 'label': "Options" + '1',  'value': "Options" + '1' }
    ]
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  }
  ]
},
{
  "id": 10,
  "fieldSequence": 10,
  "Name": "Radio",
  "Type": "radioGroup",
  "Placeholder": "Radio",
  "className": "dot-circled",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Radio",
    "Type": "text"
  },
  {
    "Name": "Options",
    "Type": "dropdown_increment",
    "Options": [
      { 'label': "Options" + '1',  'value': "Options" + '1' }
    ]
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  }
  ]
},
{
  "id": 11,
  "fieldSequence": 11,
  "Name": "Checkbox",
  "Type": "checkbox",
  "Placeholder": "Checkbox",
  "className": "checkbox",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Checkbox",
    "Type": "text"
  },
  {
    "Name": "Options",
    "Type": "dropdown_increment",
    "Options": [
      { 'label': "Options" + '1',  'value': "Options" + '1' }
    ]
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  }
  ]
},
{
  "id": 12,
  "fieldSequence": 12,
  "Name": "Geotagging",
  "Type": "geocode",
  "Placeholder": "Geotagging",
  "className": "location-outline",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Geotagging",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  }
  ]
},
{
  "id": 13,
  "fieldSequence": 13,
  "Name": "E-signature",
  "Type": "esign",
  "Placeholder": "Tap to sign here",
  "className": "e-signature",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "E-signature",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  }
  ]
},
{
  "id": 14,
  "fieldSequence": 14,
  "Name": "Phone Number", // use this field name from dynamic labels
  "Type": "phone_number",
  "Placeholder": "Phone Number",
  "className": "phone",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Phone Number",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory", // use this field name from dynamic labels
      "Value": true
    },
    {
      "Name": "Not Mandatory", // use this field name from dynamic labels
      "Value": false
    }
    ]
  }
  ]
},
{
  "id": 15,
  "fieldSequence": 15,
  "Name": "Image",
  "Type": "epod",
  "Placeholder": "Image",
  "className": "camera-outline",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Image",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  }
  ]
},
{
  "id": 16,
  "fieldSequence": 16,
  "Name": "Scanner",
  "Type": "barCode",
  "Placeholder": "Enter Barcode or QR code",
  "className": "scan-continue",
  "Active": false,
  "Settings": [{
    "Name": "Field Label",
    "Value": "Scanner",
    "Type": "text"
  },
  {
    "Name": "Validations",
    "Type": "radioZone",
    "selected": true,
    "Options": [{
      "Name": "Mandatory",
      "Value": true
    },
    {
      "Name": "Not Mandatory",
      "Value": false
    }
    ]
  }
  ]
},
{
  "id": 17,
  "fieldSequence": 17,
  "Name": "TextArea",
  "Type": "TextArea",
  "Placeholder": "",
  "className": "icon-notes",
  "Active": false,
  "Settings": [
    {
    "Name": "Field Label",
    "Value": "Enter Label",
    "Type": "text",
    },
    {
    "Name": "Field Value",
    "Value": "Enter Value",
    "Type": "text"
    },
  ]
},
]


export const rowData = {
    customFormGroupId: 0,
    formName: '',
    formDescription: '',
    userGroupId: 0,
    userGroupName: '',
    triggerEventsData: [],
    structure: {
      columns: {},
      buttons: {}
    } 
}


export const sortableGroup = {
  name: 'fieldTypes',
  pull: false,
  put: true
}
const pull: 'clone' = "clone";
export const fieldTypeGroup = {
  name: 'fieldTypes',
  pull: pull,
  put: false
}

export const MobilePreviewImg = "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-images/custom-form-mobile-0-1.png";
