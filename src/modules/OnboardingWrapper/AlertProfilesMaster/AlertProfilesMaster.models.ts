import { IMongoField } from './../../../utils/mongo/interfaces';
import { IMultiSelectOptions } from 'ui-library';
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces"
import { IBranchLookupResponse, ICountryLookupResponse, IShipperLookupResponse } from "../../../utils/common.interface"
import { EditorState } from 'draft-js';

export type tAlertProfilesMasterProfileType = '' | 'ORGANIZATION' | 'BRANCH' | 'SHIPPER'
export interface ICurrentStep {
  stepName?: string
  stepNameLabel?: string
  questions?: Array<{
    questionIdentifier: string
    questionLabelKey: string
    questionLabel: string
    questionDescLabelKey: string
    questionDescLabel: string
  }>
  [key: string]: any
}

export interface IAlertParamsResponse<paramValueType = string> {
  alertProfileParameterId: number,
  paramKey: string,
  paramValue: paramValueType,
  paramLabel?: string
}

export type tAlertSettingsMessageType = 'SMS' | 'WHATSAPP' | 'IVR' | 'EMAIL'
export interface IAlertSettingsGetResponse {
  generalParamMap: {
    NODRIVEZONEALERTFREQUENCYINMINS?: IAlertParamsResponse<number>
    ISVISIBLETOCUSTOMER?: IAlertParamsResponse<'Y' | 'N'>
    LOWBATTERYPERC?: IAlertParamsResponse<number>
    TIMEWINDOW?: IAlertParamsResponse<number>
    STUCKDURATION?: IAlertParamsResponse<number>
    REVISEETADIFFINMINS?: IAlertParamsResponse<number>
    DELIVERYDELAYEDDURATION?: IAlertParamsResponse<number>
    DELIVERYBEFORETIMEDURATION?: IAlertParamsResponse<number>
    PICKUPDELAYEDDURATION?: IAlertParamsResponse<number>
    PICKUPBEFORETIMEDURATION?: IAlertParamsResponse<number>
    TRACKERLOWBATTERYPERC?: IAlertParamsResponse<number>
    REPEATVEHICLEOVERSPEEDINTERVAL?: IAlertParamsResponse<number>
    VEHICLEMAXSPEED?: IAlertParamsResponse<number>
    VEHCILENODRIVEENDTIMEHRS?: IAlertParamsResponse<string>
    VEHCILENODRIVESTARTTIMEHRS?: IAlertParamsResponse<string>
    VEHCILENODRIVECALCDURATIONINMINS?: IAlertParamsResponse<number>
    TRACKERTEMPPERCENTAGECHECK?: IAlertParamsResponse<string>

    /** Remaining for Haul */
    // LOWBATTERYPERC?: IAlertParamsResponse<number>
    // STUCKDURATION?: IAlertParamsResponse<number>
    // LASTMILEDISTANCE?: IAlertParamsResponse<number>
    // PICKUPGEOFENCE?: IAlertParamsResponse<string>
    // DELIVERYGEOFENCE?: IAlertParamsResponse<string>
    // REPEATSTUCKALERT?: IAlertParamsResponse<'Y' | 'N'>
    // MAXSPEED?: IAlertParamsResponse<number>
    // REPEATOVERSPEEDINTERVAL?: IAlertParamsResponse<number>
    // /** Time Picker */
    // NODRIVESTARTTIMEHRS?: IAlertParamsResponse<string>
    // NODRIVEENDTIMEHRS?: IAlertParamsResponse<string>

    // REPEATNODRIVEINTERVAL?: IAlertParamsResponse<string>
    // MINTEMPERATURE?: IAlertParamsResponse<number>
    // MAXTEMPERATURE?: IAlertParamsResponse<number>
    // TEMPERATUREDEVIATIONPERCENTAGE?: IAlertParamsResponse<number>
    // TEMPERATUREALERTREPEATDURATION?: IAlertParamsResponse<number>
    // TEMPERATUREDEVIATIONINTERVAL?: IAlertParamsResponse<number>
    // ENABLEONORIGIN?: IAlertParamsResponse<'Y' | 'N'>
    // SKIP_STUCKALERT_BASED_ON_SUBSTATUS?: IAlertParamsResponse<'Y' | 'N'>
    // GPSCALCDURATIONINMINS?: IAlertParamsResponse<number>
    // TIMEBUFFERINMINS?: IAlertParamsResponse<number>
    // ALERTNAME_PICKUPTIMEFENCE?: IAlertParamsResponse<number>
    // ALERTNAME_DELIVERYTIMEFENCE?: IAlertParamsResponse<number>
    // TIMEWINDOW?: IAlertParamsResponse<number>

  },
  messageParamMap: {
    IVR?: {
      to: IAlertParamsResponse<'Y' | 'N'>[],
      paramsMap: {
        IVR: IAlertParamsResponse<'Y' | 'N'>
        OTHERIVRMOBILENO: IAlertParamsResponse<string>
      }
    },
    SMS?: {
      to: IAlertParamsResponse<'Y' | 'N'>[],
      paramsMap: {
        OTHERMOBILENO: IAlertParamsResponse<string>,
        MOBILE: IAlertParamsResponse<'Y' | 'N'>
      }
    },
    WHATSAPP?: {
      to: IAlertParamsResponse<'Y' | 'N'>[]
      paramsMap: {
        OTHERWHATSAPP: IAlertParamsResponse<string>,
        OTHERWHATSAPPMOBILENO:  IAlertParamsResponse<string>
        WHATSAPP: IAlertParamsResponse<'Y' | 'N'>
      }
    },
    EMAIL?: {
      to: IAlertParamsResponse<'Y' | 'N'>[],
      paramsMap: {
        OTHEREMAILID: IAlertParamsResponse<string>,
        EMAIL: IAlertParamsResponse<'Y' | 'N'>,
        EMAILTEMPLATEID: IAlertParamsResponse<any>,
      }
    }
  }
}

export interface IAlertSettingsMessageStructureResponse {
  emailBody?: IMongoField
  emailSubject?: IMongoField
  ivrMessage?: IMongoField
  smsMessage?: IMongoField
}

export interface IAlertSettingsMessagesDataResponse {
  profileId: number,
  alertMasterId: number,
  alertMessageMap: {
    sms?: {
      message: {
        key?: string,
        value?: string,
        draftJsJson?: string
      }
    },
    ivr?: {
      message: {
        key?: string,
        value?: string,
        draftJsJson?: string
      }
    },
    email?: {
      subject: {
        key?: string,
        value?: string,
        draftJsJson?: string
      },
      body: {
        key?: string,
        value?: string,
        draftJsJson?: string
      }
    },
    whatsapp?: {
      dynamicTag?: {
        dynamicTags?: string | Record<string, string>;
      };
      message: {
        key? : string,
        value?: string
      },
      template: {
        key? : string,
        value?: string
      },
      templateId: {
        key?: string,
        value? : string,
      },
      templateLang: {
        key? : string,
        value?: string
      }
  }
}

export interface IAlertSettingsTagGroup {
  key: string
  value: number
  label: string
}

export interface IAlertSettingsTag {
  alertTagKey: string
  alertTagLabelKey: string
  alertTagLabelValue: string
  tagValueSize: number
  tagGroupId: number
  isCustomField?: boolean
}

export interface IAlertSettingsTagsAPIResponse {
  id: string
  tagGroupMappingList: IAlertSettingsTagGroup[]
  alertKeys: IAlertSettingsTag[]
}
export interface IMentionSuggestions {
  text: string | JSX.Element
  value: string
  url: string,
  isCustomField?: boolean
}

export interface IAlertEmailTemplateLookupResponse {
  isActiveFl: true,
  emailTemplateId: number,
  emailTemplateName: string,
  emailTemplateDesc: string,
  structureReferenceId?: string,
  isDefault?: boolean,
  isSelected: boolean,
  isSendgridTemplate: boolean
}

export type tAlertProfilesMasterLoadingKeys = 'messagesStructure' | 'messageData' | 'tags' | 'alertParamsData' | 'saveAlertSettings'
export interface IAlertProfilesMasterReduxState {
  loading: Record<tAlertProfilesMasterLoadingKeys, boolean | undefined>,
  profileType: tAlertProfilesMasterProfileType
  currentStep: ICurrentStep
  readonlyMode: boolean
  listStructure: IMongoListViewStructure
  alertProfilesList: IAlertProfileDetails[]
  alertListData: {} | IAlertListData
  alertListDataFromAPI: {} | IAlertListData
  alertListModifiedData: Record<string, Record<string, Record<string, boolean>>>
  alertListSavePayload: IAlertDetailsSummary[],
  shipperLookup: Array<{
    value: number
    label: string
  }>
  shipperLookupMap: {
    [key: number]: IShipperLookupResponse
  },

  AlertCategoryLookup: Array<{
    value: string
    label: string
  }>
  AlertCategoryLookupMap: {
    [key: number]: IAlertCategoryLookupResponse
  },

  branchLookup: Array<{
    value: number
    label: string
  }>
  branchLookupMap: {
    [key: number]: IBranchLookupResponse
  },
  alertTemplateLookup: Array<{
    value: number
    label: string
  }>,
  countryLookup: Array<{ value: string, label: string }>,
  countryLookupMap: Record<string, ICountryLookupResponse>,
  alertTemplateLookupMap: Record<number, IAlertEmailTemplateLookupResponse>,
  settings: {
    rteState: {
      smsMessage: EditorState
      ivrMessage: EditorState
      emailSubject: EditorState
      emailBody: EditorState
      smsMessageUpdated?: boolean
      ivrMessageUpdated?: boolean
      emailSubjectUpdated?: boolean
      whatsappTemplateUpdated? : boolean
      whatsappTemplateLangUpdated? : boolean
      whatsappTemplateIdUpdated? : boolean
      whatsappMessgeUpdated? :boolean
      whatsappDynamicTagsUpdated? : boolean
      emailBodyUpdated?: boolean
    },
    mentions: {
      suggestionsfromAPI: IMentionSuggestions[],
      suggestionsValueMap: Record<string, string>,
      suggesstionsProp: IMentionSuggestions[],
      mentionProp: {
        separator: ' ',
        trigger: '@',
        suggestions: IMentionSuggestions[]
      }
      optionList?: Record<string, string>[],
      getTagsArray?:Record<string, string>[]

    }
    tags: IAlertSettingsTagsAPIResponse,
    messageStructure: IAlertSettingsMessageStructureResponse,
    messagesDataResponse: IAlertSettingsMessagesDataResponse
    apiResponse: IAlertSettingsGetResponse
    saveRequestPayload: Record<string, IAlertParamsResponse<string | number | 'Y' | 'N'>>
    formState: {
      territoryEnterRadius?: number
      customizeAlertPreferences?: boolean
      SMS?: {
        to: IMultiSelectOptions[],
        toMap: Record<number, IAlertParamsResponse>
        toSelected: IMultiSelectOptions[]
        isActive: boolean
        other: string
        isOtherVisible: boolean
        otherKey: number
      }
      EMAIL?: {
        to: IMultiSelectOptions[],
        toMap: Record<number, IAlertParamsResponse>
        toSelected: IMultiSelectOptions[]
        isActive: boolean
        other: string
        isOtherVisible: boolean
        otherKey: number
      }
      IVR?: {
        to: IMultiSelectOptions[],
        toMap: Record<number, IAlertParamsResponse>
        toSelected: IMultiSelectOptions[]
        isActive: boolean
        other: string
        isOtherVisible: boolean
        otherKey: number
      }
      WHATSAPP?: {
        to: IMultiSelectOptions[],
        toMap: Record<number, IAlertParamsResponse>
        toSelected: IMultiSelectOptions[]
        isActive: boolean
        other: string
        isOtherVisible: boolean
        otherKey: number,
      }
    }
  }
}

export const alertProfilesMasterInitialState: IAlertProfilesMasterReduxState = {
  profileType: '',
  loading: {
    messagesStructure: false,
    messageData: false,
    alertParamsData: false,
    tags: false,
    saveAlertSettings: undefined // undefined: initial, true: is saving, false: save success
  },
  currentStep: {},
  readonlyMode: false,
  listStructure: {
    columns: {},
    buttons: {}
  },
  alertProfilesList: [],
  alertListData: {},
  alertListDataFromAPI: {},
  alertListModifiedData: {},
  alertListSavePayload: [],
  alertTemplateLookup: [],
  alertTemplateLookupMap: {},
  countryLookup: [],
  countryLookupMap: {},
  shipperLookup: [],
  shipperLookupMap: {},
  AlertCategoryLookup: [],
  AlertCategoryLookupMap: {},
  branchLookup: [],
  branchLookupMap: {},
  settings: {
    rteState: {
      smsMessage: EditorState.createEmpty(),
      ivrMessage: EditorState.createEmpty(),
      emailSubject: EditorState.createEmpty(),
      emailBody: EditorState.createEmpty()
    },
    tags: {
      id: '-1',
      tagGroupMappingList: [],
      alertKeys: []
    },
    mentions: {
      suggestionsfromAPI: [],
      suggestionsValueMap: {},
      suggesstionsProp: [],
      mentionProp: {
        separator: ' ',
        trigger: '@',
        suggestions: []
      }
    },
    messageStructure: {},
    messagesDataResponse: {
      profileId: -1,
      alertMasterId: -1,
      alertMessageMap: {}
    },
    saveRequestPayload: {},
    apiResponse: {
      generalParamMap: {},
      messageParamMap: {}
    },
    formState: {
      SMS: {
        to: [],
        toSelected: [],
        toMap: {},
        isActive: false,
        other: '',
        isOtherVisible: false,
        otherKey: 0
      },
      EMAIL: {
        to: [],
        toSelected: [],
        toMap: {},
        isActive: false,
        other: '',
        isOtherVisible: false,
        otherKey: 0
      },
      IVR: {
        to: [],
        toSelected: [],
        toMap: {},
        isActive: false,
        other: '',
        isOtherVisible: false,
        otherKey: 0
      },
      WHATSAPP: {
        to: [],
        toSelected: [],
        toMap: {},
        isActive: false,
        other: '',
        isOtherVisible: false,
        otherKey: 0,
        
      },
    }
  }
}

export type tAlertProfileRequestType = 'CLIENT' | 'SHIPPER' | 'BRANCH'
export interface IAlertProfileDetails {
  profileId: number
  profileName: string,
  description: string,
  isEditable: boolean,
  isFavouriteFl?: boolean,
  ownerBranchId?: number,
  ownerBranchName?: string,
  isActiveFl?: boolean,
  isGroupOrderAlert?: boolean,
  linkedIds?: number[]
}

export interface IAlertDetailsSummary {
  alertMasterId: number
  alertName: string
  shortName: string
  isAlertActive: boolean
  isSmsActive: boolean
  isEmailActive: boolean
  isIvrActive: boolean
  isWhatsAppActive: boolean
  /** Internal Propery */
  category: string
}

// export type IAlertCategories = 'ORDER' | 'DELIVERYMEDIUM' | 'TRIP' | 'MMORDER'
export interface IAlertListData {
  [key: string]: IAlertDetailsSummary[]
}


export const profileTypeToAPIMapping = {
  ORGANIZATION: 'CLIENT',
  BRANCH: 'BRANCH',
  SHIPPER: 'SHIPPER'
}

export interface IAlertProfilesLookupResponse {
  isActiveFl: boolean,
  isEditable: boolean,
  isFavouriteFl: boolean,
  isGroupOrderAlert: boolean,
  profileId: number
  profileName: string
}

export interface IAlertEmailPreviewProps {
  alertMasterId: number
  templateId: number
  subject: string
  message: string
  handleClose: () => void
}
export interface IAlertListsRoutePayload {
  profileName: string
}

export interface IAlertSettingsRoutePayload {
  profileName?: string
  alertName?: string
  isGroupOrderAlert?: boolean
}

export interface IAlertProfileMasterRouteParams {
  profileId?: string
  alertMasterId?: string
}
export interface IPreviewEmailResponse {
  data: {
    body: string
  }

}

export interface IAlertCategoryLookupResponse {
  clientRefMasterId: number
  clientRefMasterType: 'ALERTCATEGORY'
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientId: number
  isDeleteFl: 'Y' | 'N'
  id: number
  name: string
}