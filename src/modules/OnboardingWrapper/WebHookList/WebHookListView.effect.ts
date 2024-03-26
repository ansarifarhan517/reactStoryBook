import { WebHookListViewActions, IFetchDataAction } from './WebHookListView.actions';
import { put, takeLatest, call } from 'redux-saga/effects'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping';
import { IModuleTypes } from './WebHookListView.models';

function* fetchWebHookListViewStructure() {

  // STRUCTURE
  const { data: payload } = yield call<any>(axios.get, apiMappings.webHookListView.listView.structure)
  yield put({ type: '@@webhooklistview/FETCH_STRUCTURE_SUCCESS', payload })

  // MODULES
  const { data: modulePaylaod } = yield call<any>(axios.get, apiMappings.webHookListView.listView.modules)
  yield put({ type: '@@webhooklistview/SET_MODULE_TYPES', payload: modulePaylaod })

  // create Event type get URL
  let url: string = ''
  modulePaylaod?.forEach((m:IModuleTypes) => {
    url = url + 'EVENT_TYPE_'+m.clientRefMasterCd.toUpperCase()+','

  })
  const URLparams = {
    type: url
  }

  // EVENT
  const { data: eventPayload } = yield call<any>(axios.get, apiMappings.webHookListView.listView.eventType,{ params: URLparams})
  yield put({ type: '@@webhooklistview/SET_EVENT_TYPES', payload: eventPayload })


  // STATUS
  const { data: statusPayload } = yield call<any>(axios.get, apiMappings.webHookListView.listView.status)
  yield put({ type: '@@webhooklistview/SET_STATUS', payload: statusPayload })

  // responseCode
  const { data: responseCode } = yield call<any>(axios.get, apiMappings.webHookListView.listView.responseCode)
  yield put({ type: '@@webhooklistview/SET_RESPONSE_CODE', payload: responseCode }) 
}


export function* watchFetchWebHookListViewStrucutreRequest() {
  yield takeLatest<WebHookListViewActions>('@@webhooklistview/FETCH_STRUCTURE', fetchWebHookListViewStructure);
}

function* fetchData(action: IFetchDataAction) {
  const isLoading = action?.payload?.isLoading
  yield put<WebHookListViewActions>({ type: '@@webhooklistview/SET_LOADING', payload: { listView: !!isLoading  } })
  try {
    let newParams:any = {}
   
    action?.payload && Object.keys(action?.payload)?.forEach((m) => {
      if(action?.payload && action?.payload[m]) {
        newParams = {
          ...newParams,
          [m]:  action?.payload[m],
        }
      }
    })
    // const newParams = action?.payload

    delete newParams?.isLoading
    const { data: data  } = yield call(axios.get, apiMappings.webHookListView.listView.data, { params: newParams })
    let disableNext = data?.data?.results?.length < newParams?.pageSize
    let moreResultExists = data?.moreResultsExists;
    let dataType = data?.data?.type
    yield put<WebHookListViewActions>({type: '@@webhooklistview/SET_MORE_RESULT_EXISTS', payload : {moreResultExists, disableNext, dataType}})
    yield put<WebHookListViewActions>({ type: '@@webhooklistview/FETCH_DATA_SUCCESS', payload : data.data  })
    yield put<WebHookListViewActions>({ type: '@@webhooklistview/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    console.log('Failed to fetch data for Driver List View: ', error)
    yield put<WebHookListViewActions>({ type: '@@webhooklistview/SET_LOADING', payload: { listView: false } })
  }
}
export function* watchFetchWebHookListViewDataRequest() {
    yield takeLatest<IFetchDataAction>('@@webhooklistview/FETCH_DATA', fetchData);
  }