import { all, call, put, select, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { DeviationReportsActions, IFetchListViewData, IFetchListViewStructure } from "./DeviationReports.actions";
import { DEVIATION_REPORTS_MAPPING, IListViewResponsePayload, REPORT_TYPES, ReportType } from "./DeviationReports.models";

function* fetchDeviationReportsFilterStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.deviationReports.filters);
    yield put<DeviationReportsActions>({ type: '@@deviationReports/FETCH_FILTER_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchDeviationReportsFilterStructureRequest() {
    yield takeLatest<DeviationReportsActions>('@@deviationReports/FETCH_FILTER_STRUCTURE', fetchDeviationReportsFilterStructure);
}

function* fetchVehicleReportsFilterStructure() {
    const { data: payload } = yield call(axios.get, apiMappings.vehicleReports.filters);
    yield put<DeviationReportsActions>({ type: '@@vehicleReports/FETCH_FILTER_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchVehicleReportsFilterStructureRequest() {
    yield takeLatest<DeviationReportsActions>('@@vehicleReports/FETCH_FILTER_STRUCTURE', fetchVehicleReportsFilterStructure);
}

function* fetchListViewStructure() {
    const { reportType } = yield select(state => state.deviationReports.form);
    let structureAPI = apiMappings.deviationReports.list.structure;
    structureAPI = structureAPI.replaceAll("${pageName}",  DEVIATION_REPORTS_MAPPING[reportType as ReportType].pageName)
                               .replace("${sectionName}", DEVIATION_REPORTS_MAPPING[reportType as ReportType].sectionName)
    const { data: payload } = yield call(axios.get, structureAPI)
    yield put<DeviationReportsActions>({ type: '@@deviationReports/FETCH_LISTVIEW_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchListStructureRequest() {
    yield takeLatest<IFetchListViewStructure>('@@deviationReports/FETCH_LISTVIEW_STRUCTURE', fetchListViewStructure);
}

function* fetchListViewData(action: IFetchListViewData) {
    try {
        const { reportType, filters } = yield select(state => state.deviationReports.form);
        let listViewDataAPI = apiMappings.deviationReports.list.data;
        listViewDataAPI = listViewDataAPI.replace("${reportType}", DEVIATION_REPORTS_MAPPING[reportType as ReportType].reportURLKey);
        const response = yield call(axios.post, listViewDataAPI, filters, {
            params: {
                ...action.payload,
            },
        });
        const data: IListViewResponsePayload = reportType === REPORT_TYPES.DEVIATION_SUMMARY ? response.data : response.data.data
        yield put<DeviationReportsActions>({ type: "@@deviationReports/FETCH_LISTVIEW_DATA_SUCCESS", payload: data});
    } catch (error) {
        console.log(error);
    }
}

export function* watchFetchListViewDataRequest() {
    yield takeLatest<IFetchListViewData>("@@deviationReports/FETCH_LISTVIEW_DATA", fetchListViewData);
}

export function* watchDeviationReportsRequest() {
    yield all([
        watchFetchDeviationReportsFilterStructureRequest(),
        watchFetchVehicleReportsFilterStructureRequest(),
        watchFetchListStructureRequest(),
        watchFetchListViewDataRequest()
    ])
}