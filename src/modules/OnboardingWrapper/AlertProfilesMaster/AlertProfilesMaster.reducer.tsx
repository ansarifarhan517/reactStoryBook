import React from 'react';
import { EditorState } from 'draft-js';
import { IMultiSelectOptions } from 'ui-library';
import { tAlertProfilesMasterActions } from './AlertProfilesMaster.actions';
import { IAlertProfilesMasterReduxState, alertProfilesMasterInitialState, IAlertParamsResponse, IMentionSuggestions, IAlertDetailsSummary } from "./AlertProfilesMaster.models";
import { settingsActivationKeyMap, settingsOtherDataKeyMap } from './utils/constants';
import CustomFieldsRichTextEditor  from './utils/CustomFieldsRichTextEditor';
import { moveOrderCreatedAlertOnTopOfArray } from '../../../utils/helper';
import { tOptionList } from '../NotificationConfiguration/SubComponent/Notification.model';

const AlertProfilesMasterReducer = (state: IAlertProfilesMasterReduxState = alertProfilesMasterInitialState, action: tAlertProfilesMasterActions): IAlertProfilesMasterReduxState => {
  switch (action.type) {
    case '@@ALERT_PROFILES_MASTER/SET_PROFILE_TYPE':
      return { ...state, profileType: action.payload }

    case '@@ALERT_PROFILES_MASTER/SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload }

    case '@@ALERT_PROFILES_MASTER/SET_READONLY_MODE':
      return { ...state, readonlyMode: action.payload }

    case '@@ALERT_PROFILES_MASTER/FETCH_STRUCTURE_SUCCESS':
      return { ...state, listStructure: action.payload }

    case '@@ALERT_PROFILES_MASTER/SET_PROFILE_LIST':
      return { ...state, alertProfilesList: action.payload }

    case '@@ALERT_PROFILES_MASTER/SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.payload.key]: action.payload.value } }

    case '@@ALERT_PROFILES_MASTER/MARK_PROFILE_FAVOURITE':
      {
        const currentFavIndex = state.alertProfilesList.findIndex(profile => profile.isFavouriteFl)
        const newFavIndex = state.alertProfilesList.findIndex(profile => profile.profileId === action.payload.profileId)

        const newAlertProfiles = [...state.alertProfilesList]
        if (currentFavIndex >= 0) {
          newAlertProfiles[currentFavIndex].isFavouriteFl = false
        }
        
        if (newFavIndex >= 0) {
          newAlertProfiles[newFavIndex].isFavouriteFl = true
        }

        return { ...state, alertProfilesList: newAlertProfiles }
      }

    case '@@ALERT_PROFILES_MASTER/DELETE_ALERT_PROFILE':
      return { ...state, alertProfilesList: state.alertProfilesList.filter(profile => profile.profileId !== action.payload.profileId) }

    case '@@ALERT_PROFILES_MASTER/SET_ALERTS_LIST':
      // if(action?.payload['ORDER']) {
      //   const newAlertArray = moveOrderCreatedAlertOnTopOfArray(action?.payload['ORDER'])
      //   action.payload['ORDER'] = newAlertArray ? [...newAlertArray] : [...action.payload['ORDER']]
      // }
      return { ...state, alertListData: action.payload, alertListDataFromAPI: action.payload }

    case '@@ALERT_PROFILES_MASTER/ALERT_LISTS_FILTER_HANDLING':
      if (!action.payload.searchBy) {
        return { ...state, alertListData: { ...state.alertListDataFromAPI } }
      }

      const searchByFields = action.payload.searchBy.split('#@#')
      const searchTextValues = action.payload.searchText.split('#@#')

      return {
        ...state,
        alertListData: {
          ...state.alertListData,
          [action.payload.listCategory]: state.alertListDataFromAPI[action.payload.listCategory].filter((row: IAlertDetailsSummary) => {
            if (!searchByFields) {
              return true
            }
            const isSearchCriteriaMet: boolean = searchByFields.every((searchField, searchIndex) => {
              let isMet = true
              switch (searchField) {
                case 'isEmailActive':
                case 'isAlertActive':
                case 'isSmsActive':
                case 'isIvrActive':
                case  'isWhatsAppActive':
                  if (row[searchField] !== (searchTextValues?.[searchIndex] === 'Y')) {
                    isMet = false
                  }
                  break

                default:
                  if (!row?.[searchField] || !(row?.[searchField] as string).toLowerCase().includes(searchTextValues?.[searchIndex].toLowerCase())) {
                    isMet = false
                  }
              }

              return isMet
            })
            return isSearchCriteriaMet
          })
        }
      }

    case '@@ALERT_PROFILES_MASTER/SET_ALERTS_LIST_MODIFIED_DATA':
      const existingIndex = state.alertListSavePayload.findIndex(obj => obj.alertMasterId === state.alertListDataFromAPI[action.payload.category][action.payload.rowIndex].alertMasterId)
      const newAlertListSavePayload = [...state.alertListSavePayload]
      if (existingIndex === -1) {
        newAlertListSavePayload.push({
          ...state.alertListDataFromAPI[action.payload.category][action.payload.rowIndex],
          [action.payload.columnId]: action.payload.value
        })
      } else {
        newAlertListSavePayload[existingIndex][action.payload.columnId] = action.payload.value
      }

      return {
        ...state,
        alertListModifiedData: {
          ...state.alertListModifiedData,
          [action.payload.category]: {
            ...state.alertListModifiedData?.[action.payload.category] || {},
            [action.payload.rowIndex]: {
              ...state.alertListModifiedData?.[action.payload.category]?.[action.payload.rowIndex] || {},
              [action.payload.columnId]: action.payload.value
            }
          }
        },
        alertListSavePayload: newAlertListSavePayload
      }

    case '@@ALERT_PROFILES_MASTER/RESET_ALERT_LIST_MODIFIED_DATA':
      return { ...state, alertListModifiedData: {}, alertListSavePayload: [] }

    case '@@ALERT_PROFILES_MASTER/SET_SHIPPER_LOOKUP':
      const shipperLookupMap = {}
      const shipperLookup = action.payload.map((shipperObj) => {
        shipperLookupMap[shipperObj.id] = shipperObj
        return ({ label: shipperObj.name, value: shipperObj.id })
      })
      return {
        ...state, shipperLookup, shipperLookupMap
      }

      case '@@ALERT_PROFILES_MASTER/SET_ALERTCAT_LOOKUP':
        const AlertCategoryLookupMap = {}
        const AlertCategoryLookup = action.payload.map((alertObj) => {
          AlertCategoryLookupMap[alertObj.id] = alertObj
          return ({ label: alertObj.clientRefMasterCd, value: alertObj.clientRefMasterCd })
        })
        return {
          ...state,AlertCategoryLookup , AlertCategoryLookupMap
        }





    case '@@ALERT_PROFILES_MASTER/SET_BRANCH_LOOKUP':
      const branchLookupMap = {}
      const branchLookup = action.payload.map((branchObj) => {
        branchLookupMap[branchObj.id] = branchObj
        return ({ label: branchObj.name || '', value: branchObj.id })
      })
      return { ...state, branchLookup, branchLookupMap }

    case '@@ALERT_PROFILES_MASTER/SET_ALERT_EMAIL_TEMPLATE_LOOKUP':
      const alertTemplateLookupMap = {}

      const alertTemplateLookup = action.payload.map((emailTemplateObj) => {
        alertTemplateLookupMap[emailTemplateObj.emailTemplateId] = emailTemplateObj
        return ({ label: emailTemplateObj.emailTemplateName, value: emailTemplateObj.emailTemplateId })
      })

      return { ...state, alertTemplateLookup, alertTemplateLookupMap }

    case '@@ALERT_PROFILES_MASTER/CLEAR_ALERT_EMAIL_TEMPLATE_LOOKUP':
      return {
        ...state, alertTemplateLookupMap: {}, alertTemplateLookup: []
      }


    case '@@ALERT_PROFILES_MASTER/SET_COUNTRY_LOOKUP':
      const countryLookupMap = {}
      const countryLookup = action.payload.map((country) => {
        countryLookupMap[country.googleCountryCode] = country
        return ({ label: country.displayName, value: country.googleCountryCode })
      })
      return { ...state, countryLookup, countryLookupMap }

    case '@@ALERT_PROFILES_MASTER/SET_TERRITORY_ENTER_RADIUS':
      return {
        ...state,
        settings: {
          ...state.settings,
          formState: {
            ...state.settings.formState,
            territoryEnterRadius: action.payload
          }
        }
      }

    case '@@ALERT_PROFILES_MASTER/SET_CUSTOMIZE_ALERT_PREFERENCES':
      return {
        ...state,
        settings: {
          ...state.settings,
          formState: {
            ...state.settings.formState,
            customizeAlertPreferences: action.payload
          }
        }
      }

    case '@@ALERT_PROFILES_MASTER/SET_ALERT_SETTINGS_RESPONSE':
      const newState = { ...state }
      newState.settings.apiResponse = action.payload

      if (action.payload.generalParamMap.ISVISIBLETOCUSTOMER) {
        newState.settings.formState.customizeAlertPreferences = action.payload.generalParamMap.ISVISIBLETOCUSTOMER.paramValue === 'Y'
      }

      if (action.payload.messageParamMap.SMS) {
        const to: IMultiSelectOptions[] = []
        const toSelected: IMultiSelectOptions[] = []
        const toMap: Record<string, IAlertParamsResponse<'Y' | 'N'>> = {}
        let otherKey: number = 0
        let isOtherVisible = false
        action.payload.messageParamMap.SMS.to.forEach((toObj) => {
          to.push({ value: toObj.alertProfileParameterId + '', label: toObj.paramLabel || '' })
          toMap[toObj.alertProfileParameterId] = toObj
          if (toObj.paramValue === 'Y') {
            toSelected.push({ value: toObj.alertProfileParameterId + '', label: toObj.paramLabel || '' })
          }

          if (toObj.paramKey === 'OTHERMOBILE') {
            otherKey = toObj.alertProfileParameterId
            isOtherVisible = toObj.paramValue === 'Y'
          }
        })

        newState.settings.formState.SMS = {
          to, toMap, toSelected, isOtherVisible, otherKey,
          isActive: action.payload.messageParamMap.SMS?.paramsMap?.MOBILE?.paramValue === 'Y',
          other: action.payload.messageParamMap.SMS?.paramsMap?.OTHERMOBILENO?.paramValue
        }
      }

      if (action.payload.messageParamMap.IVR) {
        const to: IMultiSelectOptions[] = []
        const toSelected: IMultiSelectOptions[] = []
        const toMap: Record<string, IAlertParamsResponse<'Y' | 'N'>> = {}
        let otherKey: number = 0
        let isOtherVisible = false
        action.payload.messageParamMap.IVR.to?.forEach((toObj) => {
          to.push({ value: toObj.alertProfileParameterId + '', label: toObj.paramLabel || '' })
          toMap[toObj.alertProfileParameterId] = toObj
          if (toObj.paramValue === 'Y') {
            toSelected.push({ value: toObj.alertProfileParameterId + '', label: toObj.paramLabel || '' })
          }

          if (toObj.paramKey === 'OTHERIVR') {
            otherKey = toObj.alertProfileParameterId
            isOtherVisible = toObj.paramValue === 'Y'
          }
        })

        newState.settings.formState.IVR = {
          to, toMap, toSelected, otherKey, isOtherVisible,
          isActive: action.payload.messageParamMap.IVR?.paramsMap?.IVR?.paramValue === 'Y',
          other: action.payload.messageParamMap.IVR?.paramsMap?.OTHERIVRMOBILENO?.paramValue
        }
      }

      if (action.payload.messageParamMap.EMAIL) {
        const to: IMultiSelectOptions[] = []
        const toSelected: IMultiSelectOptions[] = []
        const toMap: Record<string, IAlertParamsResponse<'Y' | 'N'>> = {}
        let otherKey: number = 0
        let isOtherVisible = false
        action.payload.messageParamMap.EMAIL.to.forEach((toObj) => {
          to.push({ value: toObj.alertProfileParameterId + '', label: toObj.paramLabel || '' })
          toMap[toObj.alertProfileParameterId] = toObj
          if (toObj.paramValue === 'Y') {
            toSelected.push({ value: toObj.alertProfileParameterId + '', label: toObj.paramLabel || '' })
          }

          if (toObj.paramKey === 'OTHEREMAIL') {
            otherKey = toObj.alertProfileParameterId
            isOtherVisible = toObj.paramValue === 'Y'
          }
        })

        newState.settings.formState.EMAIL = {
          to, toMap, toSelected, isOtherVisible, otherKey,
          isActive: action.payload.messageParamMap.EMAIL?.paramsMap?.EMAIL?.paramValue === 'Y',
          other: action.payload.messageParamMap.EMAIL?.paramsMap?.OTHEREMAILID?.paramValue
        }
      }
      if (action.payload.messageParamMap.WHATSAPP){
        const to: IMultiSelectOptions[] = []
        const toSelected: IMultiSelectOptions[] = []
        const toMap: Record<string, IAlertParamsResponse<'Y' | 'N'>> = {}
        let otherKey: number = 0
        let isOtherVisible = false

        
        action.payload.messageParamMap.WHATSAPP?.to?.forEach((whatsappUserObj) => {
          to.push({ value: whatsappUserObj.alertProfileParameterId + '', label: whatsappUserObj.paramLabel || '' })
          toMap[whatsappUserObj.alertProfileParameterId] = whatsappUserObj
          if (whatsappUserObj.paramValue === 'Y') {
            toSelected.push({ value: whatsappUserObj.alertProfileParameterId + '', label: whatsappUserObj.paramLabel || '' })
          }

          if (whatsappUserObj.paramKey === 'OTHERWHATSAPP') {
            otherKey = whatsappUserObj.alertProfileParameterId
            isOtherVisible = whatsappUserObj.paramValue === 'Y'
          }
        })

        newState.settings.formState.WHATSAPP = {
          to, toMap, toSelected, isOtherVisible, otherKey,
          isActive: action.payload.messageParamMap.WHATSAPP?.paramsMap?.WHATSAPP?.paramValue === 'Y',
          other: action.payload.messageParamMap.WHATSAPP?.paramsMap?.OTHERWHATSAPPMOBILENO?.paramValue || ""
        }
      }
      return newState


    case '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS_TO_SELECTION_CHANGE':
      {
        const newState = { ...state }
        const paramId = action.payload.value
        const paramKey = newState.settings.formState[action.payload.key].toMap[paramId].paramKey

        if (action.payload.isSelected) {
          newState.settings.formState[action.payload.key] = {
            ...(newState.settings.formState[action.payload.key] || {}),
            toSelected: [...(newState.settings.formState[action.payload.key].toSelected || {}),
            {
              value: action.payload.value + '',
              label: newState.settings.formState[action.payload.key].toMap[action.payload.value].paramLabel
            }],
          }

        } else {
          newState.settings.formState[action.payload.key].toSelected =
            newState.settings.formState[action.payload.key].toSelected
              .filter((toObj: IMultiSelectOptions) => Number(toObj.value) !== action.payload.value)
        }

        newState.settings.saveRequestPayload = {
          ...state.settings.saveRequestPayload,
          [paramKey]: {
            alertProfileParameterId: paramId,
            paramKey,
            paramValue: action.payload.isSelected ? 'Y' : 'N'
          }
        }
        if (state.settings.formState[action.payload.key].otherKey === action.payload.value) {
          newState.settings.formState[action.payload.key].isOtherVisible = action.payload.isSelected
        }
        return newState
      }

    case '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS_ACTIVATION_CHANGE': {
      const paramKey = settingsActivationKeyMap[action.payload.key]
      const paramId = state.settings.apiResponse.messageParamMap[action.payload.key]?.paramsMap?.[paramKey]?.alertProfileParameterId

      return {
        ...state,
        settings: {
          ...state.settings,
          saveRequestPayload: {
            ...state.settings.saveRequestPayload,
            [paramKey]: {
              alertProfileParameterId: paramId,
              paramKey,
              paramValue: action.payload.value ? 'Y' : 'N',
            }
          },
          formState: {
            ...state.settings.formState,
            [action.payload.key]: {
              ...state.settings.formState[action.payload.key],
              isActive: action.payload.value
            }
          }
        }
      }
    }
    case '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_OTHER_FIELD': {
      const paramKey = settingsOtherDataKeyMap[action.payload.key]
      const paramId = state.settings.apiResponse.messageParamMap[action.payload.key]?.paramsMap?.[paramKey].alertProfileParameterId

      return {
        ...state,
        settings: {
          ...state.settings,
          saveRequestPayload: {
            ...state.settings.saveRequestPayload,
            [paramKey]: {
              alertProfileParameterId: paramId,
              paramKey,
              paramValue: action.payload.value,
            }
          },
          formState: {
            ...state.settings.formState,
            [action.payload.key]: {
              ...state.settings.formState[action.payload.key],
              otherData: action.payload.value
            }
          }
        }
      }
    }

    case '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/APPEND_SAVE_REQUEST_PAYLOAD':
      return {
        ...state,
        settings: {
          ...state.settings,
          saveRequestPayload: {
            ...state.settings.saveRequestPayload,
            ...action.payload
          }
        }
      }

    case '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGE_STRUCTURE_SUCCESS': {
      return {
        ...state,
        settings: {
          ...state.settings,
          messageStructure: action.payload
        }
      }
    }

    case '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_TAGS_SUCCESS':
      const tags = action.payload
      const suggestionsfromAPI = tags.alertKeys.map(({ alertTagLabelValue, alertTagKey , isCustomField , tagGroupId}) => ({
        text: alertTagLabelValue,
        value: alertTagKey.substring(1, alertTagKey.length - 1),
        isCustomField: isCustomField,
        tagGroupId : tagGroupId,
        url: '#'
      }))
      const optionList = tags?.alertKeys?.map(
        (tag) => {
        return {value: tag?.alertTagKey, label: tag?.alertTagLabelValue, title: tag?.alertTagLabelValue}
        }
      );
     
      const suggestionsValueMap: Record<string, string> = {}
      const suggesstionsProp: IMentionSuggestions[] = suggestionsfromAPI.map((m) => {
        suggestionsValueMap[m.text] = m.value
        tags.tagGroupMappingList.map((group) => {
            if(m['tagGroupId'] == group.value){
                m['groupName'] = group.label
            }
        })
        return { text: m.isCustomField ?  <CustomFieldsRichTextEditor mentionObj={m}/> : m.text, value: m.text, url: m.url }
        
      })

      const getTagsArray = tags?.alertKeys?.map(
        (tag) => {
        return {key: tag?.alertTagKey, labelValue: tag?.alertTagLabelValue}
        }
      );

      const mentionProp = {
        ...state.settings.mentions.mentionProp,
        suggestions: [...suggesstionsProp]
      }

      return {
        ...state,
        settings: {
          ...state.settings,
          tags,
          mentions: {
            suggestionsfromAPI, suggestionsValueMap, suggesstionsProp, mentionProp, optionList,getTagsArray
          }
        }
      }

    case '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE':
      const isUpdated = {}

      if (action.payload.setUpdated) {
        isUpdated[`${action.payload.key}Updated`] = true
      }

      return {
        ...state,
        settings: {
          ...state.settings,
          rteState: {
            ...state.settings.rteState,
            [action.payload.key]: action.payload.state,
            ...isUpdated
          }
        }
      }

    case '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/RESET_STATE':
      return {
        ...state,
        settings: {
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
              otherKey: 0
            }
          }
        }
      }

    case '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGES_DATA_SUCCESS':
      return {
        ...state,
        settings: {
          ...state.settings,
          messagesDataResponse: action.payload
        }
      }

    default:
      return state
  }
}

export default AlertProfilesMasterReducer