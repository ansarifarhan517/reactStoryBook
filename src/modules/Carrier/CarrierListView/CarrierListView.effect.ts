import { CarrierListViewActions, IFetchDataAction , IFetchBranchDataAction , IFetchStructureAction} from './CarrierListView.actions';
import { put, takeLatest, call , select} from 'redux-saga/effects'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping';
import { IListViewRequestPayload } from '../../../utils/common.interface';
import {AdvancedFilterComponentActions} from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'

function* fetchCarrierListViewStructure(action: IFetchStructureAction) {
  const { data: payload } = yield call<any>(axios.get, apiMappings.carrier.listView.structure , {params: action.payload})
  yield put({ type: '@@carrierListView/FETCH_STRUCTURE_SUCCESS', payload })
  yield put<CarrierListViewActions>({ type: '@@carrierListView/SET_LOADING', payload: { listView: false } })
}

export function* watchFetchCarrierStrucutreRequest() {
  yield takeLatest<IFetchStructureAction>('@@carrierListView/FETCH_STRUCTURE', fetchCarrierListViewStructure);
}

function* fetchBranchListViewStructure() {
  const { data: payload } = yield call<any>(axios.get, apiMappings.carrier.listView.branchStructure)
  yield put({ type: '@@carrierListView/FETCH_BRANCH_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchBranchListViewStructureRequest() {
  yield takeLatest<CarrierListViewActions>('@@carrierListView/FETCH_BRANCH_STRUCTURE', fetchBranchListViewStructure);
}

function* fetchData(action: IFetchDataAction) {
  const isLoading = action?.payload?.isLoading
  yield put<CarrierListViewActions>({ type: '@@carrierListView/SET_LOADING', payload: { listView: !!isLoading } });

  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (!!advFilterLoader) {

    const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
    const data = filterListPayload || undefined

    // adv filter
    let filter: IListViewRequestPayload = { ...action.payload }

    try {
      delete filter?.isLoading
      const { data: payload } = yield call(axios.post, apiMappings.carrier.listView.advancedFilterData, data,
        {
          params: {
            ...filter,
          },
        }
      )

      const clientProperties = yield select(state => state.clientProperties)
      payload.clientProperties = clientProperties

      /********* CHECK WHETHER PAYLOAD AND PARAMS ARE BOTH EMPTY THEN NO DATA *************/
      let isParamsEmpty = (Object.keys(filter).length > 1) && !filter['searchBy'] && !filter['searchText'] && !filter['sortBy'] && !filter['sortOrder']
      if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });

      } else {
        yield put<CarrierListViewActions>({ type: '@@carrierListView/FETCH_DATA_SUCCESS', payload: payload.data });
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });

      }

      yield put<CarrierListViewActions>({ type: '@@carrierListView/SET_LOADING', payload: { listView: false } })

  } catch (error) {
    console.log('Failed to fetch data for Carrier List View: ', error)
    yield put<CarrierListViewActions>({ type: '@@carrierListView/SET_LOADING', payload: { listView: false } })
  }
}
}

export function* watchFetchCarrierDataRequest() {
  yield takeLatest<IFetchDataAction>('@@carrierListView/FETCH_DATA', fetchData);
}

function* fetchBranchData(action: IFetchBranchDataAction) {
  try {
    const { data: payload }  = yield call(axios.post, apiMappings.carrier.listView.branchData, {} , { params: action.payload })
    yield put<CarrierListViewActions>({ type: '@@carrierListView/FETCH_BRANCH_DATA_SUCCESS', payload })
  } catch (error) {
    console.log('Failed to fetch data for Carrier List View: ', error)
  }
}

export function* watchFetchBranchDataRequest() {
  yield takeLatest<IFetchBranchDataAction>('@@carrierListView/FETCH_BRANCH_DATA', fetchBranchData);
}