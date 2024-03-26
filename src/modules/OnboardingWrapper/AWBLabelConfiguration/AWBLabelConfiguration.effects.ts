import { AxiosResponse } from "axios";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import store from "../../../utils/redux/store";
import { extractDynamicLabelsFromHTML, replaceDynamicLabelWithLabel } from "../../OrderMiddleMile/PrintAwb/PrintAwb.constants";
import { AWBLabelConfigActions } from "./AWBLabelConfiguration.actions";
import { IDefaultTemplate } from "./AWBLabelConfiguration.models";

function* fetchAwbLableConfigListStructure() {
    yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_COLUMNS_LOADING', payload: { columns: true } });
    try {
        const { data: payload } = yield call<any>(axios.get, apiMappings.awbLabelConfiguration.listView.structure)
        yield put({ type: '@@awbLabelConfig/FETCH_STRUCTURE_SUCCESS', payload })
        yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_COLUMNS_LOADING', payload: { columns: false } });
    } catch ( error ) {
      yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_COLUMNS_LOADING', payload: { columns: false } });
    }
}

export function* watchFetchStrucutreRequest() {
    yield takeLatest<AWBLabelConfigActions>('@@awbLabelConfig/FETCH_STRUCTURE', fetchAwbLableConfigListStructure);
}

function* fetchData(action: any) {
    yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_LOADING', payload: { listView: true } })
    try {
      const { data: { data: payload } } = yield call(axios.get, apiMappings.awbLabelConfiguration.listView.data, { params: action.payload })
      const clientProperties = yield select(state => state.clientProperties)
      payload.clientProperties = clientProperties
      yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/FETCH_DATA_SUCCESS', payload })
      yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_LOADING', payload: { listView: false } })
    } catch (error) {
      yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_LOADING', payload: { listView: false } })
    }
}
  
export function* watchFetchDataRequest() {
    yield takeLatest<AWBLabelConfigActions>('@@awbLabelConfig/FETCH_DATA', fetchData);
}

function* fetchAwbLabelTemplateDetailsData(action: any) {
  yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_FORM_LOADING', payload: true  })
  try {
    const { data: { data: payload } } = yield call(axios.get, apiMappings.awbLabelConfiguration.listView.getAwbTemplateDetails, { params: action.payload })
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_AWB_TEMPLATE_DETAILS_DATA', payload })
    yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_FORM_LOADING', payload: false })
  } catch (error) {
    yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_FORM_LOADING', payload: false })
  }
}

export function* watchFetchAwbLabelTemplateDetailsDataRequest() {
  yield takeLatest<AWBLabelConfigActions>('@@awbLabelConfig/GET_AWB_TEMPLATE_DETAILS_DATA', fetchAwbLabelTemplateDetailsData);
}

function* fetchAwbLabelConfigTags() {
    // yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_LOADING', payload: { key: 'tags', value: true } })
    try {
      const { data } = yield call(axios.get, apiMappings.awbLabelConfiguration.listView.dynamicTags)
      yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/FETCH_TAGS_SUCCESS', payload: data })
  
    } catch (error) {
      console.log(error, error?.response)
    } finally {
      // yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_LOADING', payload: { key: 'tags', value: false } })
    }
  }
  
function* watchFetchAwbLabelConfigTags() {
  yield takeLatest<AWBLabelConfigActions>('@@awbLabelConfig/FETCH_TAGS', fetchAwbLabelConfigTags)
}

function* fetchDefaultTemplates() {
  yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_LOADING', payload: { listView: true } });
  try {
    let { data: { data: payload } } = yield call(axios.get, apiMappings.awbLabelConfiguration.listView.getDefaultConfiguration)
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
    yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS', payload: payload })
    yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchDefaultTemplates() {
  yield takeLatest<AWBLabelConfigActions>('@@awbLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST', fetchDefaultTemplates);
}

function* fetchPropertyType() {
  try {
    const { data } = yield call(axios.get, apiMappings.awbLabelConfiguration.listView.getPropertyType)
    yield put<AWBLabelConfigActions>({ type: '@@awbLabelConfig/FETCH_PROPERTY_TYPE_SUCCESS', payload: data })
  } catch (error) {
    console.log(error, error?.response)
  }
}


export function* watchFetchPropertyType() {
  yield takeLatest<AWBLabelConfigActions>('@@awbLabelConfig/FETCH_PROPERTY_TYPE', fetchPropertyType);

}

export function* watchAwbLabelConfiguration () {
    yield all ([
        watchFetchStrucutreRequest(),
        watchFetchDataRequest(),
        watchFetchAwbLabelTemplateDetailsDataRequest(),
        watchFetchAwbLabelConfigTags(),
        watchFetchDefaultTemplates(),
        watchFetchPropertyType()
    ])
}