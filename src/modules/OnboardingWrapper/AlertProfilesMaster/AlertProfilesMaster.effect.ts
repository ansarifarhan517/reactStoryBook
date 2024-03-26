import { tGlobalToastActions } from './../../common/GlobalToasts/globalToast.reducer';
import { AppState } from './../../../utils/redux/rootReducer';
import { tAlertProfilesMasterActions, IFetchAlertSettings, IAlertSettingsSave, IAlertSettingsMessageFetchStructure, IAlertSettingsFetchMessageData, IAlertSettingsFetchTags, IFetchAlertEmailTemplateLookup } from './AlertProfilesMaster.actions';
import { call, takeLatest, put, fork, select } from 'redux-saga/effects';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { ILogiAPIResponse } from '../../../utils/api.interfaces';
import { IBranchLookupResponse, ICountryLookupResponse, IShipperLookupResponse } from '../../../utils/common.interface';
import { IAlertSettingsGetResponse, IAlertSettingsMessageStructureResponse, IAlertSettingsMessagesDataResponse, IAlertSettingsTagsAPIResponse, IAlertEmailTemplateLookupResponse, IAlertCategoryLookupResponse } from './AlertProfilesMaster.models';
import { AxiosResponse } from 'axios';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {  stripNextLine, stripParagraphTags, stripTags } from './utils/constants';

const structureRenameMap = {
  // email: 'isEmailActive',
  // mobile: 'isSmsActive',
  // ivrMessage: 'isIvrActive',
  // isActive: 'isAlertActive'
}

function* fetchListStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.settings.alertProfiles.getAlertListStructure)

  const transformedColumnsPayload = {}
  Object.keys(payload.columns).forEach((fieldName) => {
    transformedColumnsPayload[structureRenameMap[fieldName] || fieldName] = payload.columns[fieldName]
  })

  payload.columns = transformedColumnsPayload

  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/FETCH_STRUCTURE_SUCCESS', payload })
}

function* watchFetchStrucutreRequest() {
  yield takeLatest<tAlertProfilesMasterActions>('@@ALERT_PROFILES_MASTER/FETCH_STRUCTURE', fetchListStructure);
}

function* fetchAttachShipperLookup() {
  const config = {
    params: {},
    data: {},
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data: payload }: ILogiAPIResponse<IShipperLookupResponse[]> = yield call(axios.get, apiMappings.settings.alertProfiles.lookups.shipper, config)
  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_SHIPPER_LOOKUP', payload })
}

function* watchFetchAttachShipperLookup() {
  yield takeLatest<tAlertProfilesMasterActions>('@@ALERT_PROFILES_MASTER/FETCH_ATTACH_SHIPPER_LOOKUP', fetchAttachShipperLookup)
}

function* fetchAlertCatagory() {
  const config = {
    params: {},
    data: {},
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data: payload }: ILogiAPIResponse<IAlertCategoryLookupResponse[]> = yield call(axios.get, apiMappings.settings.alertProfiles.lookups.alertCategories, config)
  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_ALERTCAT_LOOKUP', payload })
}


function* watchfetchAttachAlertCatLookup() {
  yield takeLatest<tAlertProfilesMasterActions>('@@ALERT_PROFILES_MASTER/FETCH_ATTACH_ALERTCAT_LOOKUP', fetchAlertCatagory)
}


function* fetchAlertEmailTemplateLookup(action: IFetchAlertEmailTemplateLookup) {
  try {
    const config = {
      params: action.payload,
      data: {},
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const { data: payload }: AxiosResponse<ILogiAPIResponse<IAlertEmailTemplateLookupResponse[]>> = yield call(axios.get, apiMappings.settings.alertProfiles.lookups.alertEmailTemplate, config)
    yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_ALERT_EMAIL_TEMPLATE_LOOKUP', payload: payload.data })
  } catch (error) {
    console.log(error)
  }
}

function* watchFetchAlertEmailTemplateLookup() {
  yield takeLatest<IFetchAlertEmailTemplateLookup>('@@ALERT_PROFILES_MASTER/FETCH_ALERT_EMAIL_TEMPLATE_LOOKUP', fetchAlertEmailTemplateLookup)
}

function* fetchAttachBranchLookup() {
  const config = {
    params: {},
    data: {},
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const { data: payload }: AxiosResponse<IBranchLookupResponse[]> = yield call(axios.get, apiMappings.settings.alertProfiles.lookups.branch, config)
  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_BRANCH_LOOKUP', payload })
}

function* watchFetchAttachBranchLookup() {
  yield takeLatest<tAlertProfilesMasterActions>('@@ALERT_PROFILES_MASTER/FETCH_ATTACH_BRANCH_LOOKUP', fetchAttachBranchLookup)
}

function* fetchCountryLookup() {
  const config = {
    params: {},
    data: {},
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const { data: payload }: AxiosResponse<ICountryLookupResponse[]> = yield call(axios.get, apiMappings.common.lookup.getCountries, config)
  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_COUNTRY_LOOKUP', payload })
}

function* watchFetchCountryLookup() {
  yield takeLatest<tAlertProfilesMasterActions>('@@ALERT_PROFILES_MASTER/FETCH_COUNTRY_LOOKUP', fetchCountryLookup)
}

function* fetchAlertSettings(action: IFetchAlertSettings) {

  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'alertParamsData', value: true } })
  const config = {
    params: {
      ...action.payload
    }
  }
  const { data: payload }: AxiosResponse<ILogiAPIResponse<IAlertSettingsGetResponse>> = yield call<any>(axios.get, apiMappings.settings.alertProfiles.getAlertSettings, config)

  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_ALERT_SETTINGS_RESPONSE', payload: payload.data })
  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'alertParamsData', value: false } })
}
function* watchFetchAlertSettings() {
  yield takeLatest<IFetchAlertSettings>('@@ALERT_PROFILES_MASTER/FETCH_ALERT_SETTINGS', fetchAlertSettings)
}

function* handleSave(action: IAlertSettingsSave) {
  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'saveAlertSettings', value: true } })
  const saveRequestPayload = yield select((state: AppState) => state.settings.alertProfilesMaster.settings.saveRequestPayload)

  const apiPayload = {
    alertProfileId: action.payload.alertProfileId,
    alertMasterId: action.payload.alertMasterId,
    alertProfileParameters: Object.values(saveRequestPayload)
  }

  try {
    if (Object.values(saveRequestPayload).length) {
      const { data: paramsSaveResponse }: AxiosResponse<ILogiAPIResponse<any>> =
        yield call(axios.put, apiMappings.settings.alertProfiles.saveAlertSettings, apiPayload)

      if (paramsSaveResponse.hasError) {
        throw paramsSaveResponse
      }

      // yield put<tGlobalToastActions>({
      //   type: '@@globalToast/add', payload: {
      //     message: paramsSaveResponse.message,
      //     icon: paramsSaveResponse.hasError ? 'warning' : 'check-round'
      //   }
      // })
    }

    const getRTEState = (state: AppState) => state.settings.alertProfilesMaster.settings.rteState
    const generateJSON = (editorState: EditorState) => JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    const generateHTML = (editorState: EditorState) => draftToHtml(
      convertToRaw(editorState.getCurrentContent()), undefined, false,
      (entity, _text) =>
      suggestionsValueMap[entity?.data?.value] ?  `<${suggestionsValueMap[entity?.data?.value]}>` :  entity?.data?.value
    ) || ''
    const rteState: ReturnType<typeof getRTEState> = yield select(getRTEState)
    const messagesDataResponse: IAlertSettingsMessagesDataResponse = yield select((state: AppState) => state.settings.alertProfilesMaster.settings.messagesDataResponse)
    const suggestionsValueMap = yield select((state: AppState) => state.settings.alertProfilesMaster.settings.mentions.suggestionsValueMap)
    const { whatsappDetails: { templateDynamicTags, templateId, templateLanguage, templateName, whatsappMessage } } = action.payload;

    const messagesSaveRequestPayload: IAlertSettingsMessagesDataResponse = {
      profileId: action.payload.alertProfileId,
      alertMasterId: action.payload.alertMasterId,
      alertMessageMap: {
        email: {
          body: {
            ...(rteState.emailBodyUpdated ? {
              key: messagesDataResponse?.alertMessageMap?.email?.body.key || '',
              value: generateHTML(rteState.emailBody) || '',
              draftJsJson: generateJSON(rteState.emailBody) || ''
            } : {
                ...messagesDataResponse?.alertMessageMap?.email?.body
              }),
          },
          subject: {
            
            ...(rteState.emailSubjectUpdated ? {
              key: messagesDataResponse?.alertMessageMap?.email?.subject?.key || '',
              value: stripNextLine(stripTags(stripParagraphTags(generateHTML(rteState.emailSubject)))),
              draftJsJson: generateJSON(rteState.emailSubject)
            } : {
                ...messagesDataResponse?.alertMessageMap?.email?.subject
              })
          }
        },
        sms: {
          message: {
            ...(rteState.smsMessageUpdated ? {
              key: messagesDataResponse?.alertMessageMap?.sms?.message?.key || '',
              value: stripTags(stripParagraphTags(generateHTML(rteState.smsMessage))),
              draftJsJson: generateJSON(rteState.smsMessage)
            } : {
                ...messagesDataResponse?.alertMessageMap?.sms?.message
              }),
          },
        },
        ivr: {
          message: {
            ...(rteState.ivrMessageUpdated ? {
              key: messagesDataResponse?.alertMessageMap?.ivr?.message?.key || '',
              value: stripTags(stripParagraphTags(generateHTML(rteState.ivrMessage))),
              draftJsJson: generateJSON(rteState.ivrMessage)
            } : {
                ...messagesDataResponse?.alertMessageMap?.ivr?.message
              }),
          }
        },
        whatsapp:{
          template:{
            key:'TEMPLATENAME',
            value: templateName
          },
          templateLang:{
            key:'TEMPLATELANGUAGE',
            value: templateLanguage
          },
          templateId:{
            key:'TEMPLATEID',
            value: templateId
          },
          message:{
            key:'WHATSAPPMESSAGE',
            value: whatsappMessage
          },
          dynamicTag: {
            dynamicTags:templateDynamicTags
          },
        }
      }
      
    }
    
    
    const { data: messagesSaveResponse }: AxiosResponse<ILogiAPIResponse<any>> =
      yield call(axios.put, apiMappings.settings.alertProfiles.saveAlertSettingsMessageData, messagesSaveRequestPayload)

    yield put<tGlobalToastActions>({
      type: '@@globalToast/add', payload: {
        message: messagesSaveResponse.message,
        icon: messagesSaveResponse.hasError ? 'warning' : 'check-round'
      }
    })

    if (messagesSaveResponse.hasError) {
      throw messagesSaveResponse
    }

    yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'saveAlertSettings', value: false } })
  } catch (exception) {
    console.log(exception)
    yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'saveAlertSettings', value: undefined } })
    console.log(exception)
    const dynamicLabels = yield select((state: AppState) => state.dynamicLabels)
    yield put<tGlobalToastActions>({
      type: '@@globalToast/add', payload: {
        message: exception?.message || exception?.response?.message || dynamicLabels.somethingWendWrong,
        icon: 'warning'
      }
    })
  }
}

function* watchSaveSettings() {
  yield takeLatest<IAlertSettingsSave>('@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SAVE', handleSave)
}

function* fetchAlertSettingsMessageStructure() {
  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'messagesStructure', value: true } })
  const { data: response }: AxiosResponse<{ 'alert details': IAlertSettingsMessageStructureResponse }> = yield call(axios.get, apiMappings.settings.alertProfiles.getAlertSettingsMessageStructure)

  console.log(response)
  try {
    // if (!response.hasError && response.status === 200) {
    yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGE_STRUCTURE_SUCCESS', payload: response["alert details"] })
    // }
  } catch (errorResponse) {
    console.log(errorResponse, errorResponse?.response)
  } finally {
    yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'messagesStructure', value: false } })
  }
}

function* watchFetchAlertSettingsMessageStructure() {
  yield takeLatest<IAlertSettingsMessageFetchStructure>('@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGE_STRUCTURE', fetchAlertSettingsMessageStructure)
}

function* fetchAlertSettingsMessagesData(action: IAlertSettingsFetchMessageData) {
  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'messageData', value: true } })
  const config = {
    params: {
      profileId: action.payload.profileId,
      alertMasterId: action.payload.alertMasterId
    }
  }

  try {
    const { data: response }: AxiosResponse<ILogiAPIResponse<IAlertSettingsMessagesDataResponse>> =
      yield call(axios.get, apiMappings.settings.alertProfiles.getAlertSettingsMessageData, config)

    if (response.status === 200 && !response.hasError) {
      yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGES_DATA_SUCCESS', payload: response.data })
    } else {
      console.log({ response })
    }
  } catch (error) {
    console.log(error, error?.response)
  } finally {
    yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'messageData', value: false } })
  }
}

function* watchFetchAlertSettingsMessagesData() {
  yield takeLatest<IAlertSettingsFetchMessageData>('@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGES_DATA', fetchAlertSettingsMessagesData)
}


function* fetchAlertSettingsTags(action: IAlertSettingsFetchTags) {
  yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'tags', value: true } })
  const config = {
    params: {
      alertMasterId: action.payload.alertMasterId
    }
  }

  try {
    const { data }: AxiosResponse<IAlertSettingsTagsAPIResponse>
      = yield call(axios.get, apiMappings.settings.alertProfiles.getAlertSettingsTagsData, config)
    yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_TAGS_SUCCESS', payload: data })

  } catch (error) {
    console.log(error, error?.response)
  } finally {
    yield put<tAlertProfilesMasterActions>({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'tags', value: false } })
  }
}

function* watchFetchAlertSettingsTags() {
  yield takeLatest<IAlertSettingsFetchTags>('@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_TAGS', fetchAlertSettingsTags)
}

export function* watchAlertProfilesSaga() {
  yield fork(watchFetchStrucutreRequest)
  yield fork(watchFetchAttachShipperLookup)
  yield fork(watchFetchAttachBranchLookup)
  yield fork(watchFetchAlertEmailTemplateLookup)
  yield fork(watchFetchCountryLookup)
  yield fork(watchFetchAlertSettings)
  yield fork(watchSaveSettings)
  yield fork(watchFetchAlertSettingsMessageStructure)
  yield fork(watchFetchAlertSettingsMessagesData)
  yield fork(watchFetchAlertSettingsTags)
  yield fork(watchfetchAttachAlertCatLookup)
}
