import { all, call, put, select, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { IListViewRequestPayload } from "../../../utils/common.interface";
import { AdvancedFilterComponentActions } from "../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";
import { IFetchDataAction, InscanListActions } from "./InscanList.acions";


function* fetchInscanListStructure(action: any) {
    yield put<InscanListActions>({ type: '@@inscanList/SET_COLUMNS_LOADING', payload: { columns: true } });
    try {
      const { data: payload } = yield call<any>(axios.get, apiMappings.inscan.listView.structure + `${action.payload.selectedOption}_ORDERS_LIST_VIEW`)
      yield put({ type: '@@inscanList/FETCH_STRUCTURE_SUCCESS', payload })
      yield put<InscanListActions>({ type: '@@inscanList/SET_COLUMNS_LOADING', payload: { columns: false } });
    } catch ( error ) {
      yield put<InscanListActions>({ type: '@@inscanList/SET_COLUMNS_LOADING', payload: { columns: false } });
    }
}
  
export function* watchFetchStrucutreRequest() {
    yield takeLatest<InscanListActions>('@@inscanList/FETCH_STRUCTURE', fetchInscanListStructure);
}

function* fetchDataCount(action: any) {
   
    yield put<InscanListActions>({ type: '@@inscanList/SET_LOADING', payload: { listView: true } })
    try {
      const  data = yield call(axios.post, apiMappings.inscan.listView.dataCount, action.payload.data, { params: action.payload.params })  
      const clientProperties = yield select(state => state.clientProperties)
      let payload = {
        totalCount : data.data.data.totalCount,
        moreResultsExists: data.data.moreResultsExists,
        clientProperties: clientProperties
      }
      yield put<InscanListActions>({ type: '@@inscanList/FETCH_DATA_COUNT_SUCCESS', payload })
      // yield put<InscanListActions>({ type: '@@inscanList/SET_LOADING', payload: { listView: false } })
    } catch (error) {
      // yield put<InscanListActions>({ type: '@@inscanList/SET_LOADING', payload: { listView: false } })
    }
}
  
export function* watchFetchDataCountRequest() {
    yield takeLatest<IFetchDataAction>('@@inscanList/FETCH_DATA_COUNT', fetchDataCount);
}


function* fetchData(action: any) {
  yield put<InscanListActions>({ type: '@@inscanList/SET_LOADING', payload: { listView: true } });

  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (!!advFilterLoader) {

    const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
    const data = filterListPayload || undefined

    
    // adv filter
    let filter: IListViewRequestPayload = { ...action.payload }

    try {
      delete filter?.isLoading
      //const postData = {...data , ...filter}
      const { data: payload } = yield call(axios.post, apiMappings.inscan.listView.data, data, { params: action.payload.params })

    
      let currentPageLength = payload?.data?.results?.length;
      let currentPageSize = action.payload?.params?.pageSize;

      currentPageLength < currentPageSize ? yield put<InscanListActions>({type: '@@inscanList/SET_DISABLE_NEXT', payload: true})
       : yield put<InscanListActions>({type: '@@inscanList/SET_DISABLE_NEXT', payload: false})
      

      const clientProperties = yield select(state => state.clientProperties)
      payload.clientProperties = clientProperties

      /********* CHECK WHETHER PAYLOAD AND PARAMS ARE BOTH EMPTY THEN NO DATA *************/
      let isParamsEmpty = (Object.keys(filter).length > 1) && !filter['searchBy'] && !filter['searchText'] && !filter['sortBy'] && !filter['sortOrder']
      if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });

      } else {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });
      }
      yield put<InscanListActions>({ type: '@@inscanList/FETCH_DATA_SUCCESS', payload: payload.data });
      yield put<InscanListActions>({ type: '@@inscanList/SET_LOADING', payload: { listView: false } })

  } catch (error) {
    console.log('Failed to fetch data for Inscan List View: ', error)
    yield put<InscanListActions>({ type: '@@inscanList/SET_LOADING', payload: { listView: false } })
  }
}
}


  
export function* watchFetchDataRequest() {
    yield takeLatest<IFetchDataAction>('@@inscanList/FETCH_DATA', fetchData);
}

export function* watchInscanList () {
    yield all ([
        watchFetchStrucutreRequest(),
        watchFetchDataCountRequest(),
        watchFetchDataRequest()
    ])
}