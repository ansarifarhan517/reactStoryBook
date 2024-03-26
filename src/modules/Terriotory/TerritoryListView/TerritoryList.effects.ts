import apiMappings from "../../../utils/apiMapping";
import store from "../../../utils/redux/store";
import axios from '../../../utils/axios';
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { tTerritoryListActions } from "./TerritoryList.actions";
import { getGoogleAPIKey } from "../../../utils/components/Map/MapHelper";
import { IDeliveryMediumData, IRowData } from "./TerritoryList.models";
import { AdvancedFilterComponentActions } from "../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";

function* fetchTerritoryListStructure () {
    yield put<tTerritoryListActions>({ type: '@@territoryList/SET_COLUMNS_LOADING', payload: { columns: true } });
    try {
        const viewMode = store.getState().territory.listView.viewMode;
        const params = {
            modelName: 'GEOFENCEMASTER',
            pageName: 'GEOFENCEMASTER',
            sectionName: viewMode === 'listview' ? 'GEOFENCEMASTER_LIST_VIEW' : 'GEOFENCEMASTER_MAP_VIEW'
        }
        const { data: payload } = yield call<any>(axios.get, apiMappings.geofenceMaster.listView.structure, {
            params
        });
        yield put({ type: '@@territoryList/FETCH_STRUCTURE_SUCCESS', payload });
        yield put<tTerritoryListActions>({ type: '@@territoryList/SET_COLUMNS_LOADING', payload: { columns: false } });
    } catch {
        yield put<tTerritoryListActions>({ type: '@@territoryList/SET_COLUMNS_LOADING', payload: { columns: false } });
    }
}

export function* WatchFetchTerritoryListStructureRequest() {
    yield takeLatest<tTerritoryListActions>('@@territoryList/FETCH_STRUCTURE', fetchTerritoryListStructure);
}

function* fetchGeofenceData() {
    const initiallyLoaded = store.getState().territory.listView.initiallyLoaded
    console.log("initiallyLoaded ",initiallyLoaded)
    const {data: {data: payload}} = yield call<any>(axios.get, apiMappings.geofenceMaster.listView.getTerritoryProfileListing)
    yield put({ type: '@@territoryList/FETCH_BREADCRUMBDATA_SUCCESS', payload});
    if(!initiallyLoaded){
        yield put({ type: '@@territoryList/INITIAL_FAV_BREADCRUMB', payload});
    }
}

export function* WatchFetchGeofenceDataRequest() {
    yield takeLatest<tTerritoryListActions>('@@territoryList/FETCH_BREADCRUMBDATA', fetchGeofenceData)
}

function* fetchData(action: any) {

    yield put<tTerritoryListActions>({ type: '@@territoryList/SET_LOADING', payload: { listView: true } })

    const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (!!advFilterLoader) {
    const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
    const data = filterListPayload || undefined


    try {
      const breadcrumbState = store.getState().territory.listView.breadcrumbState
      //const searchParams = action.payload.params
      const { data: payload } = yield call(axios.post, `${apiMappings.geofenceMaster.listView.data}?geofenceProfileId=${breadcrumbState}`, data, { params: action.payload.params })
      const clientProperties = yield select(state => state.clientProperties)
      payload.clientProperties = clientProperties
      payload?.results.forEach((row: IRowData) => {
          if(row.deliveryMediumMasterId?.length){
            const deliveryData = row.deliveryMediumMasterId && row.deliveryMediumMasterId.length ? row.deliveryMediumMasterId.map((obj: IDeliveryMediumData) => obj.deliveryMediumName) : []
            const deliveryMediumData = deliveryData ? deliveryData.join(',') : ''
            row.deliveryMediumData = deliveryMediumData;
          }
      })
      let isParamsEmpty = (Object.keys(action.payload.params).length > 1) && !action.payload.params['searchBy'] && !action.payload.params['searchText'] && !action.payload.params['sortBy'] && !action.payload.params['sortOrder']
      if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true})
        yield put<tTerritoryListActions>({ type: '@@territoryList/FETCH_DATA_SUCCESS', payload })
      } else {
        yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false})
          yield put<tTerritoryListActions>({ type: '@@territoryList/FETCH_DATA_SUCCESS', payload })
      }
      yield put<tTerritoryListActions>({ type: '@@territoryList/SET_LOADING', payload: { listView: false } })
    } catch (error) {
      yield put<tTerritoryListActions>({ type: '@@territoryList/SET_LOADING', payload: { listView: false } })
    }
    }
}

export function* watchFetchDataRequest() {
    yield takeLatest<tTerritoryListActions>('@@territoryList/FETCH_DATA', fetchData);
}

function* fetchInitialData() {
    const googleApiKey = getGoogleAPIKey()
    yield put<tTerritoryListActions>({ type: '@@territoryList/GOOGLE_API_KEY', payload: googleApiKey });

    const { data, status } = yield call<any>(axios.get, apiMappings.common.clientMetric);
    if (status === 200) {
      yield put({ type: '@@territoryList/SET_CLIENT_METRIC_SYSTEM', payload: data.data });
    }
    
    const { data: {data: daData} } = yield call(axios.get, apiMappings.geofenceMaster.listView.getDeliveryAssociatesList);
    yield put<tTerritoryListActions>({ type: '@@territoryList/FETCH_DA_LIST', payload: daData });

    const { data: catogoryList } = yield call(axios.get, apiMappings.geofenceMaster.listView.getCategoryList);
    yield put<tTerritoryListActions>({ type: '@@territoryList/FETCH_CATEGORY_LIST', payload: catogoryList });
} 

export function* watchInitialLoad() {
    yield takeLatest<tTerritoryListActions>('@@territoryList/INITIAL_LOAD', fetchInitialData);
}

function* setFavouriteGeofence(action: any) {
    try {
        const {data: {data : geofenceData }} = yield call(axios.get, `${apiMappings.geofenceMaster.listView.getTerritoryProfileById}?id=${action.payload}`)

        geofenceData['isDefault'] = true
        const {data: payload} = yield call (axios.put, apiMappings.geofenceMaster.listView.updateTerritoryProfile, geofenceData)

        if (!payload.hasError) {
            yield put<tTerritoryListActions>({ type: '@@territoryList/FETCH_BREADCRUMBDATA'})
        }
    }
    catch (err) {
        console.log(err)
    }
}

export function* watchSetFavouriteGeofenceRequest() {
    yield takeLatest<tTerritoryListActions>('@@territoryList/FETCH_GEOFENCEBYID', setFavouriteGeofence);
}

export function* watchTerritoryList() {
    yield all([
        WatchFetchTerritoryListStructureRequest(),
        WatchFetchGeofenceDataRequest(),
        watchFetchDataRequest(),
        watchInitialLoad(),
        watchSetFavouriteGeofenceRequest()
    ])
}