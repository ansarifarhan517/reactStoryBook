import { AxiosResponse } from 'axios';
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { ILogiAPIResponse } from '../../../utils/api.interfaces';
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { IMongoDynamicHTMLTemplate } from '../../../utils/common.interface';
import store from '../../../utils/redux/store';
import { AdvancedFilterComponentActions } from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions';
import { IDynamicLabelsAction } from '../../common/DynamicLabels/dynamicLabels.actions';
import { extractDynamicLabelsFromHTML, replaceDynamicLabelWithLabel } from '../../OrderMiddleMile/PrintAwb/PrintAwb.constants';
import { IFetchPrintManifestLabelTemplate, IFetchPrintManifestTemplate, ManifestListActions } from "./ManifestList.actions";
import { watchFetchMAnifestOrderDetailsAndManifestHTMLTemplates } from './PrintManifest/PrintManifest.effects';
import {  watchFetchAWBOrderDetailsAndAWBHTMLTemplates} from './PrintManifestLabel/PrintAWB.effects';

function* fetchManifestListStructure() {
  yield put<ManifestListActions>({ type: '@@manifestList/SET_COLUMNS_LOADING', payload: { columns: true } });
  try {
    const { data: payload } = yield call<any>(axios.get, apiMappings.manifest.listView.structure)
    yield put({ type: '@@manifestList/FETCH_STRUCTURE_SUCCESS', payload })
    yield put<ManifestListActions>({ type: '@@manifestList/SET_COLUMNS_LOADING', payload: { columns: false } });
  } catch (error) {
    yield put<ManifestListActions>({ type: '@@manifestList/SET_COLUMNS_LOADING', payload: { columns: false } });
  }
}

export function* watchFetchStrucutreRequest() {
  yield takeLatest<ManifestListActions>('@@manifestList/FETCH_STRUCTURE', fetchManifestListStructure);
}

function* fetchData(action: any) {
  yield put<ManifestListActions>({ type: '@@manifestList/SET_LOADING', payload: { listView: true } })
  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (!!advFilterLoader) {

      const filterListPayload = yield select(state => state.advanceFilter.filterListPayload); 
      let postData = {};
      postData["printManifest"] = false;
      if(filterListPayload){
        postData =  {
          advanceFilter: filterListPayload.filters,
          operationLogic: filterListPayload.operationLogic,
          sortCriteria: filterListPayload.sortCriteria
        }
      }
      
      try {
        const { data: payload }  = yield call(axios.post, apiMappings.manifest.listView.data, postData, { params: action.payload?.params })
        const clientProperties = yield select(state => state.clientProperties)
        payload.clientProperties = clientProperties
        
      
        let isParamsEmpty = (Object.keys(action.payload?.params).length > 1) && !action.payload?.params['searchBy'] && !action.payload?.params['searchText'] && !action.payload?.params['sortBy'] && !action.payload?.params['sortOrder']
      if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });
      } else {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });
      }
      yield put<ManifestListActions>({ type: '@@manifestList/FETCH_DATA_SUCCESS', payload : payload.data })
      yield put<ManifestListActions>({ type: '@@manifestList/SET_LOADING', payload: { listView: false } })

      } catch (error) {
        yield put<ManifestListActions>({ type: '@@manifestList/SET_LOADING', payload: { listView: false } })
      }
  }
}



export function* watchFetchDataRequest() {
  yield takeLatest<ManifestListActions>('@@manifestList/FETCH_DATA', fetchData);
}

function* fetchPrintManifestTemplate() {
  try {
    const { data: { data } }: AxiosResponse<ILogiAPIResponse<IMongoDynamicHTMLTemplate<{ manifestHTML: string, shipmentHTML: string }>[]>>
      = yield call(axios.get, apiMappings.manifest.listView.printManifestTemplate)

    /** Replace Dynamic Labels in template with Actual Labels - Start */
    let { htmlData: { manifestHTML, shipmentHTML } } = data[0]

    const manifestDynamicLabels = extractDynamicLabelsFromHTML(manifestHTML)
    const shipmentDynamicLabels = extractDynamicLabelsFromHTML(shipmentHTML)
    const dynamicLabels = store.getState().dynamicLabels

    const dynamicLabelsFromAPI = [...Array.from(manifestDynamicLabels), ...Array.from(shipmentDynamicLabels)].filter((field) => !dynamicLabels[field])
    dynamicLabelsFromAPI.push("mm_order_s");
    dynamicLabelsFromAPI.push("courier");
    let templateDynamicLabels = { ...dynamicLabels }
    try {
      let dataSet = {}
      if (dynamicLabelsFromAPI.length) {
        const { data }: AxiosResponse<Record<string, string>> = yield call(axios.get, apiMappings.common.dynamicLabels, { params: { labels: dynamicLabelsFromAPI.join(',') } })
        dataSet = data
        templateDynamicLabels = { ...templateDynamicLabels, ...dataSet }
      }

      if (manifestDynamicLabels.size > 0 && manifestHTML) {
        Array.from(manifestDynamicLabels).forEach((labelKey) => {
          manifestHTML = replaceDynamicLabelWithLabel(manifestHTML || '', labelKey, templateDynamicLabels[labelKey] || labelKey)
        })
        data[0].htmlData.manifestHTML = manifestHTML
      }

      if (shipmentDynamicLabels.size > 0 && shipmentHTML) {
        Array.from(shipmentDynamicLabels).forEach((labelKey) => {
          shipmentHTML = replaceDynamicLabelWithLabel(shipmentHTML || '', labelKey, templateDynamicLabels[labelKey] || labelKey)
        })
        data[0].htmlData.shipmentHTML = shipmentHTML
      }

      yield put<IDynamicLabelsAction>({ type: '@@dynamicLabels/FETCH_DATA_SUCCESS', payload: dataSet })


    } catch (error) {
      console.log('Failed to fetch dynamic labels while Printing...', error, error?.response)
    }

    /** Replace Dynamic Labels in template with Actual Labels - End */

    yield put<ManifestListActions>({ type: '@@manifestList/SET_PRINT_MANIFEST_TEMPLATE', payload: data[0] })

  } catch (error) {
    console.log('Failed to fetch Print Manfiest Template: ', error)
  }
}

export function* watchFetchPrintManifestTemplates() {
  yield takeLatest<IFetchPrintManifestTemplate>('@@manifestList/FETCH_PRINT_MANIFEST_TEMPLATE', fetchPrintManifestTemplate)
}

function* fetchPrintManifestLabelTemplate() {
  try {
    const { data: { data } }: AxiosResponse<ILogiAPIResponse<IMongoDynamicHTMLTemplate<{ manifestHTML: string }>[]>>
      = yield call(axios.get, apiMappings.manifest.listView.printManifestLabelTemplate)

    /** Replace Dynamic Labels in template with Actual Labels - Start */
    let { htmlData: { manifestHTML } } = data[0]

    const manifestDynamicLabels = extractDynamicLabelsFromHTML(manifestHTML)
    const dynamicLabels = store.getState().dynamicLabels

    const dynamicLabelsFromAPI = Array.from(manifestDynamicLabels).filter((field) => !dynamicLabels[field])
    
    let templateDynamicLabels = { ...dynamicLabels }
    try {
      let dataSet = {}
      if (dynamicLabelsFromAPI.length) {
        const { data }: AxiosResponse<Record<string, string>> = yield call(axios.get, apiMappings.common.dynamicLabels, { params: { labels: dynamicLabelsFromAPI.join(',') } })
        dataSet = data
        templateDynamicLabels = { ...templateDynamicLabels, ...data }
      }
      if (manifestDynamicLabels.size > 0 && manifestHTML) {
        Array.from(manifestDynamicLabels).forEach((labelKey) => {
          manifestHTML = replaceDynamicLabelWithLabel(manifestHTML || '', labelKey, templateDynamicLabels[labelKey] || labelKey)
        })
        data[0].htmlData.manifestHTML = manifestHTML
      }

      yield put<IDynamicLabelsAction>({ type: '@@dynamicLabels/FETCH_DATA_SUCCESS', payload: dataSet })


    } catch (error) {
      console.log('Failed to fetch dynamic labels while Printing...', error, error?.response)
    }
    
    yield put<ManifestListActions>({ type: '@@manifestList/SET_PRINT_MANIFEST_LABEL_TEMPLATE', payload: data[0] })
  } catch (error) {
    console.log('Failed to fetch Print Manfiest Label Template: ', error)
  }
}

export function* watchFetchPrintManifestLabelTemplates() {
  yield takeLatest<IFetchPrintManifestLabelTemplate>('@@manifestList/FETCH_PRINT_MANIFEST_LABEL_TEMPLATE', fetchPrintManifestLabelTemplate)
}


export function* watchManifestList() {
  yield all([
    watchFetchStrucutreRequest(),
    watchFetchDataRequest(),
    watchFetchPrintManifestTemplates(),
    watchFetchPrintManifestLabelTemplates(),
    watchFetchAWBOrderDetailsAndAWBHTMLTemplates(),
    watchFetchMAnifestOrderDetailsAndManifestHTMLTemplates(),
  ])
}