
import { AxiosResponse } from "axios";
import { all, takeLatest, put, call, select } from "redux-saga/effects";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { DRSTemplateConfigActions } from "./DRSTemplateConfiguration.actions";
import store from "../../../../utils/redux/store";
import { IDefaultTemplate } from "./DRSTemplateConfiguration.models";
import {handleDynamicLabels,replacingDynamicLabelWithLabel} from './DRSTemplateConfiguration.utils'

function* fetchDRSTemplateListStructre() {
  yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_COLUMNS_LOADING', payload: { columns: true } });

  try {
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_COLUMNS_LOADING', payload: { columns: false } });

    const { data: payload } = yield call<any>(axios.get, apiMappings.drsTemplateConfiguration.listView.structure)
    yield put({ type: '@@drsTemplateConfig/SET_STRUCTURE', payload })

  } catch (error) {
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_COLUMNS_LOADING', payload: { columns: false } });
  }
}

function* fetchData(action: any) {
  yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_LOADING', payload: { listView: true } })
  try {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.drsTemplateConfiguration.listView.data, { params: action.payload })
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/FETCH_DATA_SUCCESS', payload })
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_LOADING', payload: { listView: false } })

  } catch (error) {
    console.log(error)
  }
}

export function* watchFetchDataRequest() {
  yield takeLatest<DRSTemplateConfigActions>('@@drsTemplateConfig/FETCH_DATA', fetchData);
}

export function* watchFetchStructureRequest() {
  yield takeLatest<DRSTemplateConfigActions>("@@drsTemplateConfig/GET_STRUCTURE", fetchDRSTemplateListStructre)
}

function* fetchDefaultTemplates() {
  yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_LOADING', payload: { listView: true } });
  try {
    let { data: { data: payload } } = yield call(axios.get, apiMappings.drsTemplateConfiguration.listView.getDefaultConfiguration)
    const dynamicLabels = store.getState().dynamicLabels
    let dynamicLabelsToBeFetched: string[] = []
    payload.forEach((template: IDefaultTemplate) => {
      const { orderHTML, crateHTML, itemHTML, tripHTML, customerHTML } = template.htmlData

      if(orderHTML){
        handleDynamicLabels(orderHTML,dynamicLabelsToBeFetched,dynamicLabels)
      }
      if (crateHTML) {
       handleDynamicLabels(crateHTML,dynamicLabelsToBeFetched,dynamicLabels)
      }
      if (itemHTML) {
      handleDynamicLabels(itemHTML,dynamicLabelsToBeFetched,dynamicLabels)
      }
      if (tripHTML) {
        handleDynamicLabels(tripHTML,dynamicLabelsToBeFetched,dynamicLabels)
      }
      if (customerHTML) {
       handleDynamicLabels(customerHTML,dynamicLabelsToBeFetched,dynamicLabels)
      }
    })

    let templateDynamicLabels = { ...dynamicLabels }
    let dataSet = {}

    if (dynamicLabelsToBeFetched.length > 0) {
      const { data }: AxiosResponse<Record<string, string>> = yield call(axios.get, apiMappings.common.dynamicLabels, { params: { labels: dynamicLabelsToBeFetched.join(',') } })
      dataSet = data
      templateDynamicLabels = { ...templateDynamicLabels, ...dataSet }
    }

    payload = payload.map((template: IDefaultTemplate) => {
      const returnTemplate = { ...template }
      const { orderHTML, crateHTML, itemHTML, tripHTML, customerHTML } = template.htmlData

      if(orderHTML){
        replacingDynamicLabelWithLabel(orderHTML,returnTemplate,templateDynamicLabels)
      }
      if (crateHTML) {
      replacingDynamicLabelWithLabel(crateHTML,returnTemplate,templateDynamicLabels)
      }
      if (itemHTML) {
      replacingDynamicLabelWithLabel(itemHTML,returnTemplate,templateDynamicLabels)
      }
      if (tripHTML) {
      replacingDynamicLabelWithLabel(tripHTML,returnTemplate,templateDynamicLabels)
      }
      if (customerHTML) {
      replacingDynamicLabelWithLabel(customerHTML,returnTemplate,templateDynamicLabels)
      }

      return returnTemplate
    })
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_DEFAULT_TEMPLATE_LIST', payload: payload })
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchDefaultTemplates() {
  yield takeLatest<DRSTemplateConfigActions>('@@drsTemplateConfig/GET_DEFAULT_TEMPLATE_LIST', fetchDefaultTemplates);
}


function* fetchdrsTemplateConfigTags() {

  try {
    const { data } = yield call(axios.get, apiMappings.drsTemplateConfiguration.listView.dynamicTags)
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_TAGS', payload: data })

  } catch (error: any) {
    console.log(error, error?.response)
  }
}

function* watchFetchDrsTemplateConfigTags() {
  yield takeLatest<DRSTemplateConfigActions>('@@drsTemplateConfig/GET_TAGS', fetchdrsTemplateConfigTags)
}


function* fetchDrsTemplateConfigDetailsData(action: any) {
  yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_FORM_LOADING', payload: true })
  try {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.drsTemplateConfiguration.listView.getDrsTemplateDetails, { params: action.payload })
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_DRS_TEMPLATE_DETAILS_DATA', payload })
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_FORM_LOADING', payload: false })
  } catch (error) {
    yield put<DRSTemplateConfigActions>({ type: '@@drsTemplateConfig/SET_FORM_LOADING', payload: false })

  }
}

export function* watchFetchDrsTemplateConfigDetailsDataRequest() {
  yield takeLatest<DRSTemplateConfigActions>('@@drsTemplateConfig/GET_DRS_TEMPLATE_DETAILS_DATA', fetchDrsTemplateConfigDetailsData)
}
export function* watchDrsTemplateConfiguration() {
  yield all([
    watchFetchStructureRequest(),
    watchFetchDataRequest(),
    watchFetchDefaultTemplates(),
    watchFetchDrsTemplateConfigTags(),
    watchFetchDrsTemplateConfigDetailsDataRequest()
  ])
}