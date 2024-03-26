import { CashTransactionListActions, IFetchDataAction, IFetchDeliveryAssociateListAction } from './CashTransactionList.actions';
import { put, takeLatest, call, select, all } from 'redux-saga/effects'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping';

/* Cash Transaction Table Structure */
function* fetchCashTransactionListStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.cashTransaction.listView.structure.transactions)
  yield put({ type: '@@cashTransactionList/FETCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchTransactionTableStructureRequest() {
  yield takeLatest<CashTransactionListActions>('@@cashTransactionList/FETCH_STRUCTURE', fetchCashTransactionListStructure);
}

/* Delivery Associate Table Structure */
function* fetchDAListStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.cashTransaction.listView.structure.deliveryAssociate)
  yield put({ type: '@@cashTransactionList/FETCH_DA_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchDATableStructureRequest() {
  yield takeLatest<CashTransactionListActions>('@@cashTransactionList/FETCH_DA_STRUCTURE', fetchDAListStructure);
}

/* Distribution center Table Structure */
function* fetchDCListStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.cashTransaction.listView.structure.distributionCentre)
  yield put({ type: '@@cashTransactionList/FETCH_DC_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchDCTableStructureRequest() {
  yield takeLatest<CashTransactionListActions>('@@cashTransactionList/FETCH_DC_STRUCTURE', fetchDCListStructure);
}

/* Cash Transaction Table Data */
function* fetchTransactionTableData(action: IFetchDataAction) {
 let  params = {
    startDateFilter: action.payload?.startDateFilter || '',
    endDateFilter: action.payload?.endDateFilter || '',
    pageNumber: action.payload?.pageNumber || '',
    pageSize: action.payload?.pageSize || '',
    searchBy: action.payload?.searchBy || '',
    searchText: action.payload?.searchText || '',
    sortBy: action.payload?.sortBy || '',
    sortOrder: action.payload?.sortOrder || '',
  }
  yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: true } })
  try {
    const { data: { data: payload } } = yield call(axios.post, apiMappings.cashTransaction.listView.data.transactions, null, { params })
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/FETCH_TR_DATA_SUCCESS', payload })
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    console.log('Failed to fetch data for dc List View: ', error)
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchTransactionTableDataRequest() {
  yield takeLatest<IFetchDataAction>('@@cashTransactionList/FETCH_TR_DATA', fetchTransactionTableData);
}

/* Delivery Associate Table Data */
function* fetchDATableData(action: IFetchDataAction) {
 let params = {
  startDateFilter: action.payload?.startDateFilter || '',
  endDateFilter: action.payload?.endDateFilter || '',
  pageNumber: action.payload?.pageNumber || '',
  pageSize: action.payload?.pageSize || '',
  searchBy: action.payload?.searchBy || '',
  searchText: action.payload?.searchText || '',
  sortBy: action.payload?.sortBy || '',
  sortOrder: action.payload?.sortOrder || '',
  }
  yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: true } })
  try {
    const { data: { data: payload } } = yield call(axios.post, apiMappings.cashTransaction.listView.data.deliveryAssociate, null, { params })
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/FETCH_DA_DATA_SUCCESS', payload })
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    console.log('Failed to fetch data for dc List View: ', error)
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchDATableDataRequest() {
  yield takeLatest<IFetchDataAction>('@@cashTransactionList/FETCH_DA_DATA', fetchDATableData);
}

/* Distribution center Table Data */
function* fetchDCTableData(action: IFetchDataAction) {
  let params = {
    startDateFilter: action.payload?.startDateFilter || '',
    endDateFilter: action.payload?.endDateFilter || '',
    pageNumber: action.payload?.pageNumber || '',
    pageSize: action.payload?.pageSize || '',
    searchBy: action.payload?.searchBy || '',
    searchText: action.payload?.searchText || '',
    sortBy: action.payload?.sortBy || '',
    sortOrder: action.payload?.sortOrder || '',
  }
  yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: true } })
  try {
    const { data: { data: payload } } = yield call(axios.post, apiMappings.cashTransaction.listView.data.distributionCentre, null, { params })
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/FETCH_DC_DATA_SUCCESS', payload })
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    console.log('Failed to fetch data for dc List View: ', error)
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchDCTableDataRequest() {
  yield takeLatest<IFetchDataAction>('@@cashTransactionList/FETCH_DC_DATA', fetchDCTableData);
}

function* fetchTransactionProof(action: any) {
  yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: true } })
  try {
    const { data: {data :payload} } = yield call(axios.get, apiMappings.cashTransaction.listView.getTransactionProofs + action.payload?.referenceId )
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/FETCH_TRANSACTIONPROOF_DATA_SUCCESS', payload })
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    console.log('Failed to fetch data for dc List View: ', error)
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchTransactionProofRequest() {
  yield takeLatest<IFetchDataAction>('@@cashTransactionList/FETCH_TRANSACTIONPROOF_DATA', fetchTransactionProof);
}

// Transaction Table Card Requests
function* fetchTRCardStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.cashTransaction.listView.cardStructure.transaction)
  yield put({ type: '@@cashTransactionList/FETCH_TRCARD_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchTRCardStructureRequest() {
  yield takeLatest<CashTransactionListActions>('@@cashTransactionList/FETCH_TRCARD_STRUCTURE', fetchTRCardStructure);
}

function* fetchTRCardData(action: any) {
  yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: true } })
  try {
    const { data: { data: payload } } = yield call(axios.post, apiMappings.cashTransaction.listView.cardData.transaction + `?startDateFilter=${action.payload?.startDateFilter}&endDateFilter=${action.payload?.endDateFilter}&searchBy=${action.payload?.searchBy}&searchText=${action.payload?.searchText}`)
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/FETCH_TRCARD_DATA_SUCCESS', payload })
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    console.log('Failed to fetch data for dc List View: ', error)
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchTRCardDataRequest() {
  yield takeLatest<IFetchDataAction>('@@cashTransactionList/FETCH_TRCARD_DATA', fetchTRCardData);
}

// Delivery Associate Table Card Requests
function* fetchDACardStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.cashTransaction.listView.cardStructure.deliveryAssociate)
  yield put({ type: '@@cashTransactionList/FETCH_DACARD_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchDACardStructureRequest() {
  yield takeLatest<CashTransactionListActions>('@@cashTransactionList/FETCH_DACARD_STRUCTURE', fetchDACardStructure);
}

function* fetchDACardData() {
  yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: true } })
  try {
    const { data: { data: payload } } = yield call(axios.post, apiMappings.cashTransaction.listView.cardData.deliveryAssociate)
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/FETCH_DACARD_DATA_SUCCESS', payload })
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    console.log('Failed to fetch data for dc List View: ', error)
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchDACardDataRequest() {
  yield takeLatest<IFetchDataAction>('@@cashTransactionList/FETCH_DACARD_DATA', fetchDACardData);
}

// Distribution Center Table Card Requests
function* fetchDCCardStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.cashTransaction.listView.cardStructure.distributionCenter)
  yield put({ type: '@@cashTransactionList/FETCH_DCCARD_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchDCCardStructureRequest() {
  yield takeLatest<CashTransactionListActions>('@@cashTransactionList/FETCH_DCCARD_STRUCTURE', fetchDCCardStructure);
}

function* fetchDCCardData() {
  yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: true } })
  try {
    const { data: { data: payload } } = yield call(axios.post, apiMappings.cashTransaction.listView.cardData.distributionCenter)
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/FETCH_DCCARD_DATA_SUCCESS', payload })
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  } catch (error) {
    console.log('Failed to fetch data for dc List View: ', error)
    yield put<CashTransactionListActions>({ type: '@@cashTransactionList/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchDCCardDataRequest() {
  yield takeLatest<IFetchDataAction>('@@cashTransactionList/FETCH_DCCARD_DATA', fetchDCCardData);
}

/* add transaction effects */

function* fetchDeliveryAssociateList(action: IFetchDeliveryAssociateListAction) {
  const { data: { data: payload } } = yield call(axios.get, apiMappings.cashTransaction.addTransaction.getDeliveryAssociateList + `?searchParam=${action.payload?.searchValue}`)
  yield put<CashTransactionListActions>({ type: '@@cashTransactionList/FETCH_DELIVERY_ASSOCIATE_LIST_SUCCESS', payload })
}

export function* watchFetchDeliveryAssociateList() {
  yield takeLatest<IFetchDeliveryAssociateListAction>('@@cashTransactionList/FETCH_DELIVERY_ASSOCIATE_LIST', fetchDeliveryAssociateList)
}

function* fetchLessDepositReasons() {
  const { data: { data: payload } } = yield call(axios.get, apiMappings.cashTransaction.addTransaction.getLessDepositReasons)
  yield put<CashTransactionListActions>({ type: '@@cashTransactionList/FETCH_LESS_DEPOSIT_REASONS_SUCCESS', payload })
}

export function* watchFetchLessDepositReasons() {
  yield takeLatest<CashTransactionListActions>('@@cashTransactionList/FETCH_LESS_DEPOSIT_REASONS', fetchLessDepositReasons)
}

export function *watchCashTransactionsList () {
  yield all ([
      watchFetchTransactionTableStructureRequest(),
      watchFetchDATableStructureRequest(),
      watchFetchDCTableStructureRequest(),
      watchFetchTransactionTableDataRequest(),
      watchFetchDATableDataRequest(),
      watchFetchDCTableDataRequest(),
      watchFetchTransactionProofRequest(),
      watchFetchTRCardStructureRequest(),
      watchFetchDACardStructureRequest(),
      watchFetchDCCardStructureRequest(),
      watchFetchTRCardDataRequest(),
      watchFetchDACardDataRequest(),
      watchFetchDCCardDataRequest(),
      watchFetchDeliveryAssociateList(),
      watchFetchLessDepositReasons()
  ])
}
  