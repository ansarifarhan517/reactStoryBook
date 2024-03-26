import { CustomerListViewActions } from './CustomerListView.actions';
import { put, takeLatest, call, select, all } from 'redux-saga/effects'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping';

function* fetchCustomerListViewStructure() {

  try {
    const { data: data } = yield call<any>(axios.get, apiMappings.customer.listView.notificationType)
    let notificationData:any = []
    data.data.map((value: any)=>{
      if(value.isActiveFl){
        notificationData.push(value)
      }
    })
    yield put({ type: '@@customerListView/SET_NOTIFY_TYPE', payload: notificationData })

    const notificationDynamicTags = yield call<any>(axios.get, apiMappings.customer.listView.notifyDynamicTags)
    yield put({ type: '@@customerListView/SET_NOTIFY_TYPE_DYNAMIC_TAGS', payload: notificationDynamicTags?.data?.notificationKeys })

  } catch (e) {
    console.log('Failed to Fetch Notification Types: ', e, e?.response)
  }

}


export function* watchFetchCustomerListViewStructureRequest() {
  yield takeLatest<CustomerListViewActions>('@@customerListView/FETCH_STRUCTURE', fetchCustomerListViewStructure);
}


export function* watchCustomerListView() {
  yield all([
    watchFetchCustomerListViewStructureRequest()
  ])
}
