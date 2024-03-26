import { tAlertProfilesMasterProfileType, ICurrentStep, IAlertProfileDetails, IAlertListData, IAlertSettingsGetResponse, tAlertSettingsMessageType, IAlertParamsResponse, IAlertSettingsMessageStructureResponse, IAlertSettingsMessagesDataResponse, IAlertSettingsTagsAPIResponse, IAlertEmailTemplateLookupResponse, tAlertProfilesMasterLoadingKeys, IAlertCategoryLookupResponse, IWhatsappStructureResponse } from "./AlertProfilesMaster.models";
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IBranchLookupResponse, ICountryLookupResponse, IShipperLookupResponse } from "../../../utils/common.interface";
import { EditorState } from "draft-js";
import { IWhatsappState } from "./components/AlertSettings";

interface ISetProfileType {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_PROFILE_TYPE'
  payload: tAlertProfilesMasterProfileType
}

interface ISetCurrentStep {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_CURRENT_STEP'
  payload: ICurrentStep
}

interface ISetReadOnly {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_READONLY_MODE'
  payload: boolean
}

interface IFetchListStructure {
  readonly type: '@@ALERT_PROFILES_MASTER/FETCH_STRUCTURE'
}

interface IFetchListStructureSuccess {
  readonly type: '@@ALERT_PROFILES_MASTER/FETCH_STRUCTURE_SUCCESS'
  payload: IMongoListViewStructure
}

interface ISetAlertProfileList {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_PROFILE_LIST'
  payload: IAlertProfileDetails[]
}

interface IMarkAlertProfileFavourite {
  readonly type: '@@ALERT_PROFILES_MASTER/MARK_PROFILE_FAVOURITE'
  payload: {
    profileId: number
  }
}

interface IDeleteAlertProfile {
  readonly type: '@@ALERT_PROFILES_MASTER/DELETE_ALERT_PROFILE'
  payload: {
    profileId: number
  }
}

interface ISetAlertLists {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_ALERTS_LIST'
  payload: IAlertListData | {}
}

interface ISetAlertListModifiedData {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_ALERTS_LIST_MODIFIED_DATA'
  payload: {
    category: string,
    rowIndex: number,
    columnId: string,
    value: boolean
  }
}

interface IResetAlertListModifiedData {
  readonly type: '@@ALERT_PROFILES_MASTER/RESET_ALERT_LIST_MODIFIED_DATA'
}

interface IFetchAttachBranchLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/FETCH_ATTACH_BRANCH_LOOKUP'
}

interface IFetchAttachShipperLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/FETCH_ATTACH_SHIPPER_LOOKUP'
}

interface ISetShipperLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_SHIPPER_LOOKUP'
  payload: IShipperLookupResponse[]
}


interface IFETChAlertCategoryLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/FETCH_ATTACH_ALERTCAT_LOOKUP'
}

interface ISetAlertCategoryLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_ALERTCAT_LOOKUP'
  payload: IAlertCategoryLookupResponse[]
}


interface ISetBranchLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_BRANCH_LOOKUP'
  payload: IBranchLookupResponse[]
}

export interface IFetchAlertEmailTemplateLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/FETCH_ALERT_EMAIL_TEMPLATE_LOOKUP'
  payload: {
    profileId: number
    alertMasterId: number
  }
}
interface ISetAlertEmailTemplateLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_ALERT_EMAIL_TEMPLATE_LOOKUP'
  payload: IAlertEmailTemplateLookupResponse[]
}
export interface IFetchCountryLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/FETCH_COUNTRY_LOOKUP'
}
interface ISetCountryLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_COUNTRY_LOOKUP'
  payload: ICountryLookupResponse[]
}

interface IClearAlertEmailTemplateLookup {
  readonly type: '@@ALERT_PROFILES_MASTER/CLEAR_ALERT_EMAIL_TEMPLATE_LOOKUP'
}
interface ISetTerritoryEnterRadius {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_TERRITORY_ENTER_RADIUS'
  payload: number
}

interface ISetCustomizeAlertPreferences {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_CUSTOMIZE_ALERT_PREFERENCES'
  payload: boolean
}

export interface IFetchAlertSettings {
  readonly type: '@@ALERT_PROFILES_MASTER/FETCH_ALERT_SETTINGS'
  payload: {
    profileId: number
    alertMasterId: number
  }
}

interface ISetAlertSettingsResponse {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_ALERT_SETTINGS_RESPONSE'
  payload: IAlertSettingsGetResponse
}

interface IAlertSettingsToSelectionChange {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS_TO_SELECTION_CHANGE',
  payload: {
    key: 'SMS' | 'WHATSAPP' | 'IVR' | 'EMAIL'
    value: number
    isSelected: boolean
  }
}

interface IAlertSettingsActivationChange {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS_ACTIVATION_CHANGE',
  payload: {
    key: tAlertSettingsMessageType,
    value: boolean
  }
}

interface IAlertSettingsSetOtherField {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_OTHER_FIELD'
  payload: {
    key: tAlertSettingsMessageType
    value: string
  }
}

interface IAlertSettingsAppendSaveRequestPayload {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/APPEND_SAVE_REQUEST_PAYLOAD'
  payload: Record<string, IAlertParamsResponse<string | number | 'Y' | 'N' | Date>>
}

export interface IAlertSettingsSave {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SAVE',
  payload: {
    alertProfileId: number
    alertMasterId: number
    whatsappDetails: IWhatsappState
  }
}

interface IAlertSettingsResetState {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/RESET_STATE'
}

export interface IAlertSettingsMessageFetchStructure {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGE_STRUCTURE'
}

interface IAlertSettingsMessageFetchStructureSuccess {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGE_STRUCTURE_SUCCESS',
  payload: IAlertSettingsMessageStructureResponse
}

export interface IAlertSettingsFetchMessageData {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGES_DATA'
  payload: {
    profileId: number
    alertMasterId: number
  }
}

interface IAlertSettingsFetchMessageDataSuccess {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGES_DATA_SUCCESS'
  payload: IAlertSettingsMessagesDataResponse
}

export interface IAlertSettingsFetchTags {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_TAGS'
  payload: {
    alertMasterId: number
  }
}

interface IAlertSettingsFetchTagsSuccess {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_TAGS_SUCCESS'
  payload: IAlertSettingsTagsAPIResponse
}

interface IAlertSettingsSetRTEState {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE'
  payload: {
    key: 'smsMessage' | 'ivrMessage' | 'emailSubject' | 'emailBody',
    state: EditorState
    setUpdated?: boolean
  }
}


interface ISetLoading {
  readonly type: '@@ALERT_PROFILES_MASTER/SET_LOADING'
  payload: {
    key: tAlertProfilesMasterLoadingKeys
    value: boolean | undefined
  }
}

 
interface IAlertListFilterHandling {
  readonly type: '@@ALERT_PROFILES_MASTER/ALERT_LISTS_FILTER_HANDLING'
  payload: {
    listCategory: string
    searchBy: string
    searchText: string
  }
}
export type tAlertProfilesMasterActions =
  | ISetProfileType
  | ISetCurrentStep
  | ISetReadOnly
  | IFetchListStructure
  | IFetchListStructureSuccess
  | ISetAlertProfileList
  | IMarkAlertProfileFavourite
  | IDeleteAlertProfile
  | ISetAlertLists
  | ISetAlertListModifiedData
  | IResetAlertListModifiedData
  | IFetchAttachBranchLookup
  | IFetchAttachShipperLookup
  | ISetShipperLookup
  | IFETChAlertCategoryLookup
  | ISetAlertCategoryLookup
  | ISetBranchLookup
  | IFetchAlertEmailTemplateLookup
  | ISetAlertEmailTemplateLookup
  | IClearAlertEmailTemplateLookup
  | ISetTerritoryEnterRadius
  | ISetCustomizeAlertPreferences
  | IFetchAlertSettings
  | ISetAlertSettingsResponse
  | IAlertSettingsToSelectionChange
  | IAlertSettingsActivationChange
  | IAlertSettingsSetOtherField
  | IAlertSettingsAppendSaveRequestPayload
  | IAlertSettingsSave
  | IAlertSettingsResetState
  | IAlertSettingsMessageFetchStructure
  | IAlertSettingsMessageFetchStructureSuccess
  | IAlertSettingsFetchMessageData
  | IAlertSettingsFetchMessageDataSuccess
  | IAlertSettingsFetchTags
  | IAlertSettingsFetchTagsSuccess
  | IAlertSettingsSetRTEState
  | IFetchCountryLookup
  | ISetCountryLookup
  | ISetLoading
  | IAlertListFilterHandling