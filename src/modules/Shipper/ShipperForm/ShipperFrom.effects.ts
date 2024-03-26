import { AppState } from './../../../utils/redux/rootReducer';
import { IMongoFormStructure } from './../../../utils/mongo/interfaces';
import { IShipperFormActions, IShipperRejectReasonsData } from './ShipperForm.model'
import { tShipperListViewAcions } from '../ShipperListView/ShipperListView.actions';
import { takeLatest, call, put, fork, all ,select} from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { prepareFormStructure } from '../../../utils/components/Form/utils';

function* fetchStructure() {
  const rejectReasonList:IShipperRejectReasonsData = yield select((state: AppState) => state.shipper.listView.rejectReasonList)
  if (rejectReasonList.length === 0) {
    const { data: rejectionReasonList } = yield call(axios.get, apiMappings.shipper.listView.getRejectReasonList)
    yield put<tShipperListViewAcions>({ type: '@@shipperListView/FETCH_REJECT_REASON_LIST', payload: rejectionReasonList })
  }

  yield put<IShipperFormActions>({ type: '@@shipperForm/SET_LOADING', payload: true })
  const { data: payload } = yield call(axios.get, apiMappings.shipper.form.structure)

  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
  yield put<IShipperFormActions>({ type: '@@shipperForm/SET_STRUCTURE', payload: transformedPayload })
  yield put<IShipperFormActions>({ type: '@@shipperForm/SET_LOADING', payload: false })
}

export function* watchFetchStructureRequest() {
  yield takeLatest<IShipperFormActions>('@@shipperForm/FETCH_STRUCTURE', fetchStructure)
}

export function* watchFetchShipperFormStructure() {
  yield fork(watchFetchStructureRequest)
}

export function* watchFetchShipperFormRequests() {
  yield all([
    watchFetchShipperFormStructure(),
  ])
}