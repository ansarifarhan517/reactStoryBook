import { put, takeLatest, call, 
  // select,
   all, 
   select} from 'redux-saga/effects'
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { IListViewRequestPayload } from '../../../utils/common.interface';
import { AdvancedFilterComponentActions } from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions';
import { ContractListViewActions, IFetchDataAction } from './ContractListView.actions';


function* fetchContractListViewStructure() {
  yield put<ContractListViewActions>({ type: '@@contractListView/SET_LOADING', payload: { listView: true } })
  try {
    const breadcrumbFilter = yield select(state => state.contract.listView.breadcrumbFilter)
    const { data: payload } = yield call(axios.get, apiMappings.common.structure, 
      {
      params: {
        modelName: 'CONTRACT',
        pageName: 'CONTRACT',
        sectionName: breadcrumbFilter === 'ALL' ? 'RATE_CONTRACT_MASTER_LIST_VIEW' : `RATE_CONTRACT_MASTER_LIST_VIEW_${breadcrumbFilter}`
      }
    })
    yield put({ type: '@@contractListView/FETCH_STRUCTURE_SUCCESS', payload })
    // yield put<ContractListViewActions>({ type: '@@contractListView/SET_LOADING', payload: { listView: false, columns: false } })

  } catch (error) {
    console.log('Failed to fetch data for Contract List View: ', error)
  
  }
}


function* fetchData(action: IFetchDataAction) {
  const isLoading = action?.payload?.isLoading
  yield put<ContractListViewActions>({ type: '@@contractListView/SET_LOADING', payload: { listView: !!isLoading } });

  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (!!advFilterLoader) {

    const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
    const data = filterListPayload || undefined

    // adv filter
    let filter: IListViewRequestPayload = { ...action.payload }

    try {
      delete filter?.isLoading
      const { data: payload } = yield call(axios.post, apiMappings.contract.listView.data, data,
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
        yield put<ContractListViewActions>({ type: '@@contractListView/FETCH_DATA_SUCCESS', payload: payload.data });
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });

      }

      yield put<ContractListViewActions>({ type: '@@contractListView/SET_LOADING', payload: { listView: false } })

  } catch (error) {
    console.log('Failed to fetch data for Contract List View: ', error)
    yield put<ContractListViewActions>({ type: '@@contractListView/SET_LOADING', payload: { listView: false } })
  }
}
}




export function* watchFetchContractStructureRequest() {
  yield takeLatest<ContractListViewActions>('@@contractListView/FETCH_STRUCTURE', fetchContractListViewStructure);
}

export function* watchFetchContractDataRequest() {
  yield takeLatest<IFetchDataAction>('@@contractListView/FETCH_DATA', fetchData);
}


export function* watchContractTypeListView() {
  yield all([
    watchFetchContractDataRequest(),
    watchFetchContractStructureRequest(),
    // watchInitialLoad()
  ])
}