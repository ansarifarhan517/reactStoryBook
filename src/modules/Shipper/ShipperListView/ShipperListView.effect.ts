import { tShipperListViewAcions, IFetchDataAction } from './ShipperListView.actions';
import { put, takeLatest, call, select, all } from 'redux-saga/effects'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping';
import { getQueryParams } from '../../../utils/hybridRouting';
import { IMongoField, IMongoListViewStructure } from '../../../utils/mongo/interfaces';


function* fetchShipperListViewStructure() {
  const breadcrumbFilter = yield select(state => state.shipper.listView.breadcrumbFilter)
  const { data: payload } = yield call<any>(axios.get, apiMappings.shipper.listView.structure, {
    params: {
      modelName: 'SHIPPER',
      pageName: 'SHIPPER',
      sectionName: breadcrumbFilter === 'ALL' ? 'SHIPPER_LIST_VIEW' : `${breadcrumbFilter}_SHIPPER_LIST_VIEW`
    }
  })
  yield put({ type: '@@shipperListView/FETCH_STRUCTURE_SUCCESS', payload })

  yield callAsPerStructureResponseConditions()  

}

export function* watchFetchShipperStrucutreRequest() {
  yield takeLatest<tShipperListViewAcions>('@@shipperListView/FETCH_STRUCTURE', fetchShipperListViewStructure);
}


function* fetchData(action: IFetchDataAction) {
  yield put<tShipperListViewAcions>({ type: '@@shipperListView/SET_LOADING', payload: { listView: !!action?.payload?.isLoading } })
  try {
    const filterData: Record<string, string> = getQueryParams();
    let filter: any = { ...action.payload }
    let page = filterData.page
    if(action.payload?.searchText?.includes('status')){
      const serachByQuery =action.payload?.searchBy?.split('%23@%23')
      const indexOfStatus =serachByQuery?.indexOf('status')
      const searchTextQuery =action.payload?.searchText.split('%23@%23')
      page= indexOfStatus ? searchTextQuery[indexOfStatus] :'ALL'
    }

    filter.dataFetchMode = 'DATA'
    delete filter.isLoading
    const { data: { data: count } } = yield call(axios.post, apiMappings.shipper.listView.count, undefined,
      {
        params: {
          searchBy: action.payload?.searchBy,
          searchText: action.payload?.searchText,
          pageNumber: action.payload?.pageNumber,
          pageSize: action.payload?.pageSize,
          sortBy: action.payload?.sortBy,
          sortOrder: action.payload?.sortOrder,
          status: page,
          dataFetchMode: 'COUNT'
        }
      })



    yield put({ type: '@@shipperListView/SET_BREADCRUMB_FILTER', payload: filterData.page || 'ALL' })
    const { data: { data: payload } } = yield call(axios.post, apiMappings.shipper.listView.data, undefined,
      {
        params: {
          searchBy: action.payload?.searchBy,
          searchText: action.payload?.searchText,
          pageNumber: action.payload?.pageNumber,
          pageSize: action.payload?.pageSize,
          sortBy: action.payload?.sortBy,
          sortOrder: action.payload?.sortOrder,
          status: filterData.page,
          dataFetchMode: 'DATA'
        }
      }
    )

    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties

    /********* CHECK WHETHER PAYLOAD AND PARAMS ARE BOTH EMPTY THEN NO DATA *************/
    let isParamsEmpty = (Object.keys(filter).length > 1) && !filter['searchBy'] && !filter['searchText'] && !filter['sortBy'] && !filter['sortOrder']
    if (isParamsEmpty && payload?.results?.length < 1 && (filterData.page === 'ALL' || filterData.page === undefined)) {
      yield put<tShipperListViewAcions>({ type: '@@shipperListView/SET_EMPTY_DATA', payload: true });

    } else {
      const newPayload = { ...payload, totalCount: count.totalCount }
      yield put<tShipperListViewAcions>({ type: '@@shipperListView/FETCH_DATA_SUCCESS', payload: newPayload });

    }

    yield put<tShipperListViewAcions>({ type: '@@shipperListView/SET_LOADING', payload: { listView: false } })

  } catch (error) {
    console.log('Failed to fetch data for Shipper List View: ', error)
    yield put<tShipperListViewAcions>({ type: '@@shipperListView/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchFetchShipperDataRequest() {
  yield takeLatest<IFetchDataAction>('@@shipperListView/FETCH_DATA', fetchData);
}
function* fetchInitialData() {
  try {

    const statusList = yield select(state => state.shipper.listView.statusList)
    if (statusList.length === 0) {
      const { data: shipperStatus } = yield call(axios.get, apiMappings.shipper.listView.getShipperStatus)
      yield put<tShipperListViewAcions>({
        type: '@@shipperListView/FETCH_STATUS_LIST', payload: {
          data: shipperStatus,
        }
      })
    }

    const rejectReasonList = yield select(state => state.shipper.listView.rejectReasonList)
    if (rejectReasonList.length === 0) {
      const { data: rejectionReasonList } = yield call(axios.get, apiMappings.shipper.listView.getRejectReasonList)
      yield put<tShipperListViewAcions>({ type: '@@shipperListView/FETCH_REJECT_REASON_LIST', payload: rejectionReasonList })
    }

    const deactivationReasonList = yield select(state => state.shipper.listView.deactivationReasonList)
    if (deactivationReasonList.length === 0) {
      const { data: deactivationReasonList } = yield call(axios.get, apiMappings.shipper.listView.getDeactivationReasonList)
      yield put<tShipperListViewAcions>({ type: '@@shipperListView/FETCH_DEACTIVATION_REASON_LIST', payload: deactivationReasonList })
    }
    const priorityList = yield select(state => state.shipper.listView.priorityList)
    if (priorityList.length === 0) {
      const { data: { data: priorityList } } = yield call(axios.get, apiMappings.shipper.listView.priority)
      yield put<tShipperListViewAcions>({ type: '@@shipperListView/FETCH_PRIORITY_LIST', payload: priorityList })
    }  

  } catch (error) {
    console.log('Failed to fetch data for Shipper List View: ', error)
    yield put<tShipperListViewAcions>({ type: '@@shipperListView/SET_LOADING', payload: { listView: false } })
  }

}

 // call column config dependent APIs like dropdown, only if the column is activated
function* callAsPerStructureResponseConditions() {
  try {

    const columnProps: IMongoListViewStructure = yield select(state => state.shipper.listView.structure.columns)
    let orderReqConvStructureField: IMongoField = columnProps['bookingToOrder'] || null
    let shouldCallReqConvServiceFlag = ((orderReqConvStructureField?.searchable || orderReqConvStructureField?.editable) && orderReqConvStructureField?.fieldType === 'dropdown')

    let serviceAreaProfField: IMongoField = columnProps['serviceAreaProfileName'] || null
    let serviceAreaProfFieldFlag = ((serviceAreaProfField?.searchable || serviceAreaProfField?.editable) && serviceAreaProfField?.fieldType === 'dropdown')

    if (shouldCallReqConvServiceFlag) {
      const requestConversionList = yield select(state => state.shipper.listView.requestConversionList)
      if (requestConversionList.length === 0) {
        const { data: { data: requestConversionList } } = yield call(axios.get, apiMappings.shipper.listView.requestconversion)
        yield put<tShipperListViewAcions>({ type: '@@shipperListView/FETCH_REQUEST_CONVERSION_LIST', payload: requestConversionList })
      }
    }
    if (serviceAreaProfFieldFlag) {
      const servProfAreaNames = yield select(state => state.shipper.listView.serviceProfileNameList)
      if (servProfAreaNames.length === 0) {
        const { data: { data: servProfAreaNames } } = yield call(axios.get, apiMappings.common.lookup.getServiceAreaProfileNames)
        yield put<tShipperListViewAcions>({ type: '@@shipperListView/FETCH_SERVICE_AREA_NAME_LIST', payload: servProfAreaNames })
      }
    }

  } catch (error) {
    console.log('Failed to fetch data as per Structure in Shipper List View: ', error)
    yield put<tShipperListViewAcions>({ type: '@@shipperListView/SET_LOADING', payload: { listView: false } })
  }
}

export function* watchInitialLoad() {
  yield takeLatest<tShipperListViewAcions>('@@shipperListView/INITIAL_LOAD', fetchInitialData);
}

export function* watchFetchShipperRequests() {
  yield all([
    watchFetchShipperDataRequest(),
    watchFetchShipperStrucutreRequest(),
    watchInitialLoad()
  ])
}