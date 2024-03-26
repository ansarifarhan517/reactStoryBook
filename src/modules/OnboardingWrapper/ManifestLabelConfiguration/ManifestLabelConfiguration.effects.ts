import { AxiosResponse } from "axios";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import store from "../../../utils/redux/store";
import { extractDynamicLabelsFromHTML, replaceDynamicLabelWithLabel } from "../../OrderMiddleMile/PrintAwb/PrintAwb.constants";
import { AWBLabelConfigActions } from "./ManifestLabelConfiguration.actions";
import { IDefaultTemplate } from "./ManifestLabelConfiguration.models";

function* fetchAwbLableConfigListStructure() {
    yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_COLUMNS_LOADING', payload: { columns: true } });
    try {
        const { data: payload } = yield call<any>(axios.get, apiMappings.manifestLabelConfiguration.listView.structure)
        yield put({ type: '@@manifestLabelConfig/FETCH_STRUCTURE_SUCCESS', payload })
        yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_COLUMNS_LOADING', payload: { columns: false } });
    } catch ( error ) {
      yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_COLUMNS_LOADING', payload: { columns: false } });
    }
}

export function* watchFetchStrucutreRequest() {
    yield takeLatest<AWBLabelConfigActions>('@@manifestLabelConfig/FETCH_STRUCTURE', fetchAwbLableConfigListStructure);
}

function* fetchData(action: any) {
    yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_LOADING', payload: { listView: true } })
    try {
      const { data: { data: payload } } = yield call(axios.get, apiMappings.manifestLabelConfiguration.listView.data, { params: action.payload })
      const clientProperties = yield select(state => state.clientProperties)
      payload.clientProperties = clientProperties
      yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/FETCH_DATA_SUCCESS', payload })
      yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_LOADING', payload: { listView: false } })
    } catch (error) {
      yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_LOADING', payload: { listView: false } })
    }
}
  
export function* watchFetchDataRequest() {
    yield takeLatest<AWBLabelConfigActions>('@@manifestLabelConfig/FETCH_DATA', fetchData);
}

function* fetchManifestLabelTemplateDetailsData(action: any) {
  yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_FORM_LOADING', payload: true  })
  try {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.manifestLabelConfiguration.listView.getAwbTemplateDetails, { params: action.payload })
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_AWB_TEMPLATE_DETAILS_DATA', payload })
    yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_FORM_LOADING', payload: false })
  } catch (error) {
    yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_FORM_LOADING', payload: false })
  }
}

export function* watchFetchManifestLabelTemplateDetailsDataRequest() {
  yield takeLatest<AWBLabelConfigActions>('@@manifestLabelConfig/GET_AWB_TEMPLATE_DETAILS_DATA', fetchManifestLabelTemplateDetailsData);
}

function* fetchManifestLabelConfigTags() {
    // yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_LOADING', payload: { key: 'tags', value: true } })
    try {
      const { data } = yield call(axios.get, apiMappings.manifestLabelConfiguration.listView.dynamicTags)
      yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/FETCH_TAGS_SUCCESS', payload: data })
  
    } catch (error) {
      console.log(error, error?.response)
    } finally {
      // yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_LOADING', payload: { key: 'tags', value: false } })
    }
  }
  
function* watchFetchManifestLabelConfigTags() {
  yield takeLatest<AWBLabelConfigActions>('@@manifestLabelConfig/FETCH_TAGS', fetchManifestLabelConfigTags)
}

function* fetchDefaultTemplates() {
  yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_LOADING', payload: { listView: true } });
  try {
    let { data: { data: payload } } = yield call(axios.get, apiMappings.manifestLabelConfiguration.listView.getDefaultConfiguration)
    const dynamicLabels = store.getState().dynamicLabels
    let dynamicLabelsToBeFetched: string[] = []
    payload.forEach((template: IDefaultTemplate) => {
      const { orderHTML, crateHTML, itemHTML } = template.htmlData

      if (orderHTML) {
        const labelSet = extractDynamicLabelsFromHTML(orderHTML)
        if (labelSet.size > 0) {
          dynamicLabelsToBeFetched = [...dynamicLabelsToBeFetched, ...Array.from(labelSet).filter(label => !dynamicLabels[label])]
        }
      }
      if (crateHTML) {
        const labelSet = extractDynamicLabelsFromHTML(crateHTML)
        if (labelSet.size > 0) {
          dynamicLabelsToBeFetched = [...dynamicLabelsToBeFetched, ...Array.from(labelSet).filter(label => !dynamicLabels[label])]
        }
      }
      if (itemHTML) {
        const labelSet = extractDynamicLabelsFromHTML(itemHTML)
        if (labelSet.size > 0) {
          dynamicLabelsToBeFetched = [...dynamicLabelsToBeFetched, ...Array.from(labelSet).filter(label => !dynamicLabels[label])]
        }
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
      const { orderHTML, crateHTML, itemHTML } = template.htmlData

      if (orderHTML) {
        const labelSet = extractDynamicLabelsFromHTML(orderHTML)
        if (labelSet.size > 0) {
          Array.from(labelSet).forEach((label) => {
            returnTemplate.htmlData.orderHTML = replaceDynamicLabelWithLabel(returnTemplate.htmlData.orderHTML, label, templateDynamicLabels[label] || '')
          })
        }
      }
      if (crateHTML) {
        const labelSet = extractDynamicLabelsFromHTML(crateHTML)
        if (labelSet.size > 0) {
          Array.from(labelSet).forEach((label) => {
            returnTemplate.htmlData.crateHTML = replaceDynamicLabelWithLabel(returnTemplate.htmlData.crateHTML, label, templateDynamicLabels[label] || '')
          })
        }
      }
      if (itemHTML) {
        const labelSet = extractDynamicLabelsFromHTML(itemHTML)
        if (labelSet.size > 0) {
          Array.from(labelSet).forEach((label) => {
            returnTemplate.htmlData.itemHTML = replaceDynamicLabelWithLabel(returnTemplate.htmlData.itemHTML, label, templateDynamicLabels[label] || '')
          })
        }
      }

      return returnTemplate
    })
    yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS', payload: payload })
    yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchDefaultTemplates() {
  yield takeLatest<AWBLabelConfigActions>('@@manifestLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST', fetchDefaultTemplates);
}

function* fetchPropertyType() {
  try {
    const { data } = yield call(axios.get, apiMappings.manifestLabelConfiguration.listView.getPropertyType)
    yield put<AWBLabelConfigActions>({ type: '@@manifestLabelConfig/FETCH_PROPERTY_TYPE_SUCCESS', payload: data })
  } catch (error) {
    console.log(error, error?.response)
  }
}


export function* watchFetchPropertyType() {
  yield takeLatest<AWBLabelConfigActions>('@@manifestLabelConfig/FETCH_PROPERTY_TYPE', fetchPropertyType);

}

export function* watchManifestLabelConfiguration () {
    yield all ([
        watchFetchStrucutreRequest(),
        watchFetchDataRequest(),
        watchFetchManifestLabelTemplateDetailsDataRequest(),
        watchFetchManifestLabelConfigTags(),
        watchFetchDefaultTemplates(),
        watchFetchPropertyType()
    ])
}