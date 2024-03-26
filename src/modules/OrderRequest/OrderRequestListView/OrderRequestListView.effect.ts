import { put, takeLatest, call, select, all } from 'redux-saga/effects'
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { IListViewRequestPayload } from '../../../utils/common.interface';
import { AdvancedFilterComponentActions } from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions';
import { tOrderRequestListViewAcions, IFetchDataAction } from './OrderRequestListView.actions';


function* fetchOrderRequestListViewStructure() {
  try {
    const breadcrumbFilter = yield select(state => state.orderRequest.listView.breadcrumbFilter)
    const { data: payload } = yield call(axios.get, apiMappings.common.structure, {
      params: {
        modelName: 'BOOKING',
        pageName: 'BOOKING',
        sectionName: `${breadcrumbFilter}_BOOKING_LIST_VIEW`

      }
    })
    yield put({ type: '@@orderRequestListView/FETCH_STRUCTURE_SUCCESS', payload })
  } catch (error) {
    console.log('Failed to fetch data for OrderRequest List View: ', error)
    yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchOrderRequestStructureRequest() {
  yield takeLatest<tOrderRequestListViewAcions>('@@orderRequestListView/FETCH_STRUCTURE', fetchOrderRequestListViewStructure);
}

export const breadcrumbState = {
  ALL: {
    searchBy: '',
    searchText: ''
  },
  PENDING: {
    searchBy: "bookingStatus",
    searchText: "PENDING"
  },
  CONFIRMED: {
    searchBy: "bookingStatus",
    searchText: "CONFIRMED"
  },
  REJECTED: {
    searchBy: "bookingStatus",
    searchText: "REJECTED"
  },
  CANCELLED: {
    searchBy: "bookingStatus",
    searchText: "CANCELLED"
  }
}

function* fetchData(action: IFetchDataAction) {
  yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/SET_LOADING', payload: { listView: !!action?.payload?.isLoading } })

  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (!!advFilterLoader) {
    const breadCrumbValue = yield select(state => state.orderRequest.listView.breadcrumbFilter);
    const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
    const minDate = yield select(state => state.orderRequest.listView.minDate);
    const maxDate = yield select(state => state.orderRequest.listView.maxDate);


    let filter: IListViewRequestPayload = { ...action.payload }

    if (breadCrumbValue && breadCrumbValue !== 'ALL') {
      if (action?.payload?.searchBy && action?.payload?.searchText) {
        filter = {
          ...filter,
          searchBy: breadcrumbState[breadCrumbValue]?.searchBy + '#@#' + action.payload?.searchBy,
          searchText: breadcrumbState[breadCrumbValue].searchText + '#@#' + action.payload?.searchText,
        }
      } else {
        filter = {
          ...filter,
          searchBy: breadcrumbState[breadCrumbValue]?.searchBy,
          searchText: breadcrumbState[breadCrumbValue]?.searchText,
        }
      }
    }
    const data = filterListPayload || undefined
    try {
      delete filter?.isLoading

      const { data: { data: payload } } = yield call(axios.post, apiMappings.orderRequest.listView.data, data,
        {
          params: {
            ...filter,
            endDateFilter: maxDate,
            startDateFilter: minDate,
            // endDateFilter:'2021-01-12 23:59:59',
            // startDateFilter:'2020-01-12 23:59:59',
            status: breadCrumbValue
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
        if (payload?.results?.length < 1) {
          yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/SET_EMPTY_DATA', payload: true });
        } else {
          yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/SET_EMPTY_DATA', payload: false });
        }
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });
      }
      yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/FETCH_DATA_SUCCESS', payload: payload });
      yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/SET_LOADING', payload: { listView: false } })

    } catch (error) {
      console.log('Failed to fetch data for OrderRequest List View: ', error)
      yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/SET_LOADING', payload: { listView: false } })
    }
  }
}

export function* watchFetchOrderRequestDataRequest() {
  yield takeLatest<IFetchDataAction>('@@orderRequestListView/FETCH_DATA', fetchData);
}
function* fetchInitialData() {
  try {
    const { data: { data: weeks } } = yield call(axios.get, apiMappings.common.priority);
    yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/FETCH_PRIORITY_LIST', payload: weeks });

    const { data: branchList } = yield call<any>(axios.get, apiMappings.common.lookup.getDistributionCenterBranch, {
      data: {},
      params: {},
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });
    yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/UPDATE_BRANCH_LIST', payload: { branchList } });

    const { data: rejectionReasonList } = yield call(axios.get, apiMappings.common.getShipmentRequestRejectList)
    yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/FETCH_REJECT_REASON_LIST', payload: rejectionReasonList })

    const { data: paymentType } = yield call(axios.get, apiMappings.common.getPaymentType)
    yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/FETCH_PAYMENT_TYPE_LIST', payload: paymentType })

    const { data: orderStatus } = yield call(axios.get, apiMappings.common.getOrderStatus)
    yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/FETCH_ORDER_STATUS_LIST', payload: orderStatus })

    const { data: serviceType } = yield call(axios.get, apiMappings.common.getServiceType)
    yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/GET_SERVICE_TYPE', payload: serviceType })

    const { data: status } = yield call<any>(axios.get, apiMappings.common.getStatus);
    yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/GET_DELIVERY_STATUS', payload: status });

    const { data: skillSet } = yield call<any>(axios.get, apiMappings.common.delMedType);
    yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/GET_DELIVERY_TYPE', payload: skillSet });

  } catch (error) {
    console.log('Failed to fetch data for OrderRequest List View: ', error)
    yield put<tOrderRequestListViewAcions>({ type: '@@orderRequestListView/SET_LOADING', payload: { listView: false } })
  }

}
export function* watchInitialLoad() {
  yield takeLatest<tOrderRequestListViewAcions>('@@orderRequestListView/INITIAL_LOAD', fetchInitialData);
}

export function* watchOrderRequestTypeListView() {
  yield all([
    watchFetchOrderRequestDataRequest(),
    watchFetchOrderRequestStructureRequest(),
    watchInitialLoad()
  ])
}