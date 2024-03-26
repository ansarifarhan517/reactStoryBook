import { BranchConfigurationActions } from './BranchConfiguration.actions';
import { takeLatest,call,put,all,select} from 'redux-saga/effects';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { getGoogleAPIKey } from '../../../utils/components/Map/MapHelper';
import { IMongoFormStructure } from '../../../utils/mongo/interfaces';
import { prepareFormStructure } from '../../../utils/components/Form/utils';
import { convertBranchManagerStructure, convertOperationTimingStructure, convertShiftTimingStructure } from "./utils";
import { IEffectAction } from './BranchConfiguration.models';

function* fetchBranchConfigurationListviewStructure() {
    try {
        const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.listView.structure)
        yield put({ type: '@@branchConfiguration/FETCH_LISTVIEW_STRUCTURE_SUCCESS', payload })

        const daysOfWeekArray = yield select(state => state.branchConfiguration.listview.daysOfWeek)
    
        // if(!(daysOfWeekArray?.length > 0)) {
            console.log(!(daysOfWeekArray?.length > 0))

            const { data: daysOfWeek } = yield call(axios.get, apiMappings.common.lookup.daysOfWeek)
            // console.log(daysOfWeek)
            yield put({ type: '@@branchConfiguration/FETCH_DAYSOFWEEK_OPTIONS', payload: daysOfWeek})
        // }
        
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchStrucuterRequest() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_LISTVIEW_STRUCTURE', fetchBranchConfigurationListviewStructure);
}

function* fetchBranchConfigurationList(action: IEffectAction) {
    try {
        const { data: payload } = yield call(axios.post, apiMappings.branchConfiguration.listView.data,{}, { params: action.payload })
        const clientProperties = yield select(state => state.clientProperties)
        payload.clientProperties = clientProperties
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_LIST_SUCCESS', payload })

    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchBranchConfigurationList() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_LIST', fetchBranchConfigurationList);
}

function* fetchOperationTimingsListViewStructure() {
    try  {
        const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.listView.operationTimingsStructure);
        yield put({ type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LISTVIEW_STRUCTURE_SUCCESS', payload })

    } catch (error) {
        console.log(error);
    }
}

function* fetchLoadMultiplierListViewStructure() {
    try  {
        const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.listView.loadMultiplierListViewStructure)
        // const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.listView.operationTimingsStructure);
        yield put({ type:  '@@branchConfiguration/GET_LOADMULTIPLIER_STRUCTURE', payload })

    } catch (error) {
        console.log(error);
    }
}


export function* watchFetchOperationTimingsListViewStructure() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_OPERATION_TIMINGS_LISTVIEW_STRUCTURE', fetchOperationTimingsListViewStructure);
}
export function* watchLoadMultiplierListViewStructure() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_LOAD_MULTIPLIER_LISTVIEW_STRUCTURE', fetchLoadMultiplierListViewStructure);
}

function* fetchOperationTimingsById(action: IEffectAction) {
    try  {
        const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.listView.operationTimingsListById+`?clientBranchId=${action.payload}`);
        yield put({ type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_LIST_SUCCESS', payload })
        yield put({ type: '@@branchConfiguration/SET_OPERATION_TIMINGS_CLONE', payload })

    } catch (error) {
        console.log(error);
    }
}

export function* watchFetchOperationTimingsByIdRequest() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_OPERATION_TIMINGS_LIST', fetchOperationTimingsById);
}

function* fetchBranchMangerListByBranchId(action: IEffectAction) {
    try  {
        const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.listView.managerListById+`?clientBranchId=${action.payload}`);
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_MANAGER_LIST_SUCCESS', payload })

    } catch (error) {
        console.log(error);
    }
}

export function* watchFetchBranchMangerListByBranchId() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_BRANCH_MANAGER_LIST', fetchBranchMangerListByBranchId);
}


function* fetchBranchManagerListViewStructure() {
    try  {
        const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.listView.managerListStructure);
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_MANAGER_LISTVIEW_STRUCTURE_SUCCESS', payload })

    } catch (error) {
        console.log(error);
        
    }
}

export function* watchFetchBranchManagerListViewStructure() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_BRANCH_MANAGER_LISTVIEW_STRUCTURE', fetchBranchManagerListViewStructure);
}

function* fetchBranchFormStructure() {
    try  {
        yield put({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: true })
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_LOADING', payload: true })
        const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.form.structure, {params: {restrictColumns: false}});
        const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE_SUCCESS', payload: transformedPayload })
        yield put({ type: '@@branchConfiguration/SET_BRANCH_FORM_RESET_STRUCTURE', payload: transformedPayload })
        yield put({ type: '@@branchConfiguration/SET_BRANCH_MANAGER_STRUCTURE', payload: convertBranchManagerStructure([payload?.branchManagerDetails]) })
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_LOADING', payload: false })
        yield put({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false })

    } catch (error) {
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_LOADING', payload: true })
    }
} 

export function* watchFetchBranchFormStructure() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE', fetchBranchFormStructure)
}

function* fetchOperationTimingsStructure() {
    try  {

        yield put({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: true })
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_LOADING', payload: true })
        const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.form.operationTimingsStructure, {params: {restrictColumns: false}});
        yield put({ type: '@@branchConfiguration/FETCH_OPERATION_TIMINGS_STRUCTURE_SUCCESS', payload })
        yield put({ type: '@@branchConfiguration/SET_OPERATION_TIMINGS_STRUCTURE', payload: convertOperationTimingStructure([payload?.operationsTiming]) })
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_LOADING', payload: false })
        yield put({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false })


    } catch (error) {
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_LOADING', payload: true })
    }
}

export function* watchFetchOperationTimingsStructure() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_OPERATION_TIMINGS_STRUCTURE', fetchOperationTimingsStructure)
}


function* fetchShiftTimingsStructure() {
    try  {

        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_LOADING', payload: true })
        yield put ({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: true});
        const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.form.shiftTimingsStructure, {params: {restrictColumns: false}});
        yield put({ type: '@@branchConfiguration/FETCH_SHIFT_TIMINGS_STRUCTURE_SUCCESS', payload })
        yield put({ type: '@@branchConfiguration/SET_SHIFT_TIMINGS_STRUCTURE', payload: convertShiftTimingStructure([payload?.columns])})

        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_LOADING', payload: false })
        yield put ({ type: '@@branchConfiguration/SET_STRUCTURE_LOADING', payload: false});

    } catch (error) {
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_FORM_LOADING', payload: true })
    }
}

export function* watchFetchShiftTimingsStructure() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_SHIFT_TIMINGS_STRUCTURE', fetchShiftTimingsStructure)
}

function* fetchGoogleApiKey() {
    const googleApiKey = getGoogleAPIKey();
    yield put({ type: '@@branchConfiguration/GOOGLE_API_KEY_SUCCESS', payload: googleApiKey });
}

export function* watchFetchInitialDataRequest() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/GOOGLE_API_KEY', fetchGoogleApiKey)
}
function* fetchClientList() {
    try {
        const { data: payload } = yield call(axios.get, apiMappings.common.lookup.getClient, {
            data: {},
            params: {},
            headers: {
            'Content-Type': 'application/json'
          }})
        yield put({ type: '@@branchConfiguration/FETCH_CLIENT_LIST_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchfetchClientList() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_CLIENT_LIST', fetchClientList);
}

function* fetchBranchConfigurationTreeList() {
    try {
        const { data: payload } = yield call(axios.post, apiMappings.branchConfiguration.listView.data+`?fetchType=TREEVIEW`)
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST_SUCCESS', payload })
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchBranchConfigurationTreeViewList() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST', fetchBranchConfigurationTreeList);
}

function* fetchBranchConfigurationTreeListBranchId(action: IEffectAction) {
    try {
        const { data: payload } = yield call(axios.post, apiMappings.branchConfiguration.listView.data+`?fetchType=TREEVIEW&clientBranchId=${action.payload.clientBranchId}&pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`)
        yield put({ type: '@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST_BRANCHID_SUCCESS', payload})
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchBranchConfigurationTreeViewListBranchId() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_BRANCH_CONFIGURATION_TREE_LIST_BRANCHID', fetchBranchConfigurationTreeListBranchId);
}

function* fetchClientBranchDetails(action: IEffectAction) {
    
    try {
        yield put({ type: '@@branchConfiguration/SET_BRANCH_DATA_LOADED', payload: false});
        const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.form.branchDetails+`/${action.payload.clientBranchId}?path_param_url=1729`)        
        yield put({ type: '@@branchConfiguration/SET_BRANCH_DATA_LOADED', payload: true });
        yield put({ type: '@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA_SUCCESS', payload: payload?.data})
        yield put({ type: '@@branchConfiguration/SET_RETRIEVED_ZONES', payload: payload?.data?.zones})
        yield put({ type: '@@branchConfiguration/SET_BRANCH_TIMEZONE', payload: payload?.data.timezone})
    } catch ( error ) {
        console.log(error);
    }
}

export function* watchFetchClientBranchDetailsDataRequest() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_CLIENTBRANCH_DETAILS_DATA', fetchClientBranchDetails);
}

function* fetchDeliveryType() {
    try {   
        const {data: payload} = yield call(axios.get, apiMappings.common.lookup.deliveryType);
        yield put({type: '@@branchConfiguration/SET_DELIVERY_TYPE', payload: payload })
    } catch(error) {
        console.log(error);
    }
}

export function* watchFetchDeliveryType() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_DELIVERY_TYPE', fetchDeliveryType)
}

function* fetchLocale() {
    const { data: payload } = yield call(axios.get, apiMappings.common.lookup.getLocale, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<BranchConfigurationActions>({ type: '@@branchConfiguration/SET_LOCALE', payload: payload })
}

export function* watchFetchLocaleRequest() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_LOCALE', fetchLocale)
}

function* fetchServiceZone() {
    const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.form.serviceZoneStructure, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<BranchConfigurationActions>({ type: '@@branchConfiguration/SET_ZONE_STRUCTURE', payload: payload })
}

export function* watchFetchServiceZone() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_ZONE_STRUCTURE', fetchServiceZone)
}

function* fetchServiceZoneRateProfile() {
    const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.form.serviceZoneProfileStructure, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<BranchConfigurationActions>({ type: '@@branchConfiguration/SET_ZONE_PROFILE_STRUCTURE', payload: payload })
}
export function* watchFetchServiceZoneRateProfile() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_ZONE_PROFILE_STRUCTURE', fetchServiceZoneRateProfile)
}

//fetch service type for zones
function* fetchServiceTypeAndRateProfile() {
    const { data: payload } = yield call(axios.get, apiMappings.common.getServiceType, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<BranchConfigurationActions>({ type: '@@branchConfiguration/SET_SERVICE_TYPE', payload:  payload })
    

     const { data: activeRateProfileList } = yield call(axios.get, apiMappings.branchConfiguration.form.getRateProfile, { data: {}, headers: {'Content-Type': 'application/json'}})
     yield put<BranchConfigurationActions>({ type: '@@branchConfiguration/SET_ACTIVE_RATE_PROFILES', payload: activeRateProfileList?.data })
}
export function* watchFetchServiceType() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_RATE_PROFILE_DROPDOWNS', fetchServiceTypeAndRateProfile)
}

//fetch  list structure for zones
function* fetchZonesListView() {
    const { data: payload } = yield call(axios.get, apiMappings.branchConfiguration.form.zoneListView, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<BranchConfigurationActions>({ type: '@@branchConfiguration/SET_ZONES_LISTVIEW_STRUCTURE', payload: payload })
}
export function* watchFetchServiceZoneprofileListStructure() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_ZONES_LISTVIEW_STRUCTURE', fetchZonesListView)
}

function* fetchHolidayCalendarList() {
    const { data: payload } = yield call(axios.get, apiMappings.common.lookup.getHolidayCalendar)
    const holidayCalendarList = payload?.data?.templateList?.[0]?.defaultCalendar
    yield put<BranchConfigurationActions>({ type: '@@branchConfiguration/FETCH_HOLIDAY_CALENDAR_LIST_SUCCESS', payload: holidayCalendarList })
}
export function* watchFetchHolidayCalendarList() {
    yield takeLatest<BranchConfigurationActions>('@@branchConfiguration/FETCH_HOLIDAY_CALENDAR_LIST', fetchHolidayCalendarList)
}
export function* watchBranchConfigurationRequest() {
    yield all ([
        watchFetchStrucuterRequest(),
        watchFetchBranchConfigurationList(),
        watchFetchOperationTimingsListViewStructure(),
        watchLoadMultiplierListViewStructure(),
        watchFetchOperationTimingsByIdRequest(),
        watchFetchBranchMangerListByBranchId(),
        watchFetchBranchManagerListViewStructure(),
        watchFetchBranchFormStructure(),
        watchFetchOperationTimingsStructure(),
        watchFetchShiftTimingsStructure(),
        watchFetchInitialDataRequest(),
        watchFetchBranchConfigurationTreeViewList(),
        watchFetchBranchConfigurationTreeViewListBranchId(),
        watchFetchClientBranchDetailsDataRequest(),
        watchfetchClientList(),
        watchFetchDeliveryType(),
        watchFetchLocaleRequest(),
        watchFetchServiceZone(),
        watchFetchServiceZoneRateProfile(),
        watchFetchServiceType(),
        watchFetchServiceZoneprofileListStructure(),
        watchFetchHolidayCalendarList()
    ])
}