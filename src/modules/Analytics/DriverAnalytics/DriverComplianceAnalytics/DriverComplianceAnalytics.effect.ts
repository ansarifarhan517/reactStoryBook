import { DriverComplianceAnalyticsActions, IFetchKPIListAction, IFetchCardDetailsAction, IFetchOverAllComplianceSummaryAction, IFetchDeliveryAssociateComplianceSummaryAction, IFetchBranchListAction, IFetchSkillListAction, IFetchTotalBranchComplianceAction, IFetchBranchDeliveryAssociateComplianceSummaryAction, ISetFilterDataAction, IFetcBranchesCardDetailsAction, IFetcOrdersCardDetailsAction, IFetchOrdersComplianceReportAction, IFetchCheckInOrdersComplianceReportAction, IFetchCheckoutOrdersComplianceReportAction, IFetchOnTimeDeliveryComplianceReportAction, IFetchDistanceComplianceReportAction, IFetchServiceTimeComplianceReportAction, IFetchTotalOrdersComplianceSummaryAction, IFetchTotalOrdersColumnStructureAction, IFetchComplianceTrendAction, IFetchDeliveryAssociateLoginHistoryAction, IFetchDeliveryAssociateDevicesAction, IFetchDeviceCompatibilityColumnStructureAction, IFetchDeliveryAssociateDeviceCompatibilityAction, IFetchPlannedRouteKpiConfigurationAction, IFetchOverallDeliveryAssociateComplianceSummaryAction, IFetchLoginHistoryColumnStructureAction, IFetchDeviceListColumnStructureAction } from './DriverComplianceAnalytics.actions';
import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping';

// driver compliance

function* fetchKpiList() {
  const { data: payload } = yield call(
    axios.get,
    apiMappings.analytics.driverCompliance.getKpiList
  );
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({
    type: "@@driverCompliance/FETCH_KPI_LIST_SUCCESS",
    payload,
  });
}

export function* watchFetchKpiListRequest() {
  yield takeLatest<IFetchKPIListAction>('@@driverCompliance/FETCH_KPI_LIST', fetchKpiList);
}

function* fetchBranchList() {
  const { data: payload } = yield call(axios.get, apiMappings.common.lookup.getClientBranch)
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_BRANCH_LIST_SUCCESS', payload })
}

export function* watchfetchBranchListRequest() {
  yield takeLatest<IFetchBranchListAction>('@@driverCompliance/FETCH_BRANCH_LIST', fetchBranchList);
}

function* fetchSkillList() {
  const { data: payload } = yield call(axios.get, apiMappings.analytics.driverCompliance.deliveryType)
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_SKILL_LIST_SUCCESS', payload })

}

export function* watchfetchSkillListRequest() {
  yield takeLatest<IFetchSkillListAction>('@@driverCompliance/FETCH_SKILL_LIST', fetchSkillList);
}

function* fetchTotalBranchCompliance(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.totalBranchCompliance.getBranchComplianceSummary, action.payload)
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_TOTAL_BRANCH_COMPLIANCE_SUCCESS', payload })
}

export function* watchfetchTotalBranchComplianceRequest() {
  yield takeLatest<IFetchTotalBranchComplianceAction>('@@driverCompliance/FETCH_TOTAL_BRANCH_COMPLIANCE', fetchTotalBranchCompliance);
}

function* fetchCardDetails(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.cardDetails, action.payload)
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_CARD_DETAILS_SUCCESS', payload })
}

export function* watchFetchCardDetailsRequest() {
  yield takeLatest<IFetchCardDetailsAction>('@@driverCompliance/FETCH_CARD_DETAILS', fetchCardDetails);
}

export function* watchFetchOrdersCardDetailsRequest() {
  yield takeLatest<IFetcOrdersCardDetailsAction>('@@driverCompliance/FETCH_ORDERS_CARD_DETAILS', fetchCardDetails);
}

/* Total orders watchers */

function* fetchTotalOrderReports(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.totalOrderCompliance.getTotalOrderReportDetails, action.payload)
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_TOTAL_ORDERS_REPORT_SUCCESS', payload })
}

export function* watchFetchOrdersComplianceReportRequest() {
  yield takeLatest<IFetchOrdersComplianceReportAction>('@@driverCompliance/FETCH_TOTAL_ORDERS_REPORT', fetchTotalOrderReports)
}



function* fetchTotalOrdersComplianceReport(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.totalOrderCompliance.getTotalOrdersComplianceReport, action.payload)
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_TOTAL_ORDERS_COMPLIANCE_SUMMARY_SUCCESS', payload })
}

export function* watchFetchTotalOrdersComplianceReportRequest() {
  yield takeLatest<IFetchTotalOrdersComplianceSummaryAction>('@@driverCompliance/FETCH_TOTAL_ORDERS_COMPLIANCE_SUMMARY', fetchTotalOrdersComplianceReport)
}

function* fetchTotalOrdersColumnStructure() {
  const { data: payload } = yield call(axios.get, apiMappings.analytics.driverCompliance.totalOrderCompliance.getTotalOrdersColumnStructure)
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_TOTAL_ORDERS_COLUMN_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchTotalOrdersColumnStructure() {
  yield takeLatest<IFetchTotalOrdersColumnStructureAction>('@@driverCompliance/FETCH_TOTAL_ORDERS_COLUMN_STRUCTURE', fetchTotalOrdersColumnStructure)
}

export function* watchFetchCheckInOrdersComplianceReportRequest() {
  yield takeLatest<IFetchCheckInOrdersComplianceReportAction>('@@driverCompliance/FETCH_CHECKIN_ORDERS_REPORT', fetchTotalOrderReports)
}

export function* watchFetchCheckoutOrdersComplianceReportRequest() {
  yield takeLatest<IFetchCheckoutOrdersComplianceReportAction>('@@driverCompliance/FETCH_CHECKOUT_ORDERS_REPORT', fetchTotalOrderReports)
}

export function* watchFetchOnTimeDeliveryComplianceReportRequest() {
  yield takeLatest<IFetchOnTimeDeliveryComplianceReportAction>('@@driverCompliance/FETCH_ONTIME_DELIVERY_REPORT', fetchTotalOrderReports)
}

export function* watchFetchDistanceComplianceReportRequest() {
  yield takeLatest<IFetchDistanceComplianceReportAction>('@@driverCompliance/FETCH_DISTANCE_COMPLIANCE_REPORT', fetchTotalOrderReports)
}

export function* watchFetchServiceTimeComplianceReportRequest() {
  yield takeLatest<IFetchServiceTimeComplianceReportAction>('@@driverCompliance/FETCH_SERVICE_TIME_COMPLIANCE_REPORT', fetchTotalOrderReports)
}

/* Total orders watchers */
export function* watchFetchBranchesCardDetailsRequest() {
  yield takeLatest<IFetcBranchesCardDetailsAction>('@@driverCompliance/FETCH_BRANCHES_CARD_DETAILS', fetchCardDetails);
}



function* fetchOverAllComplianceSummary(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.avgTotalCompliance.overAllComplianceSummary, action.payload)
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_OVER_ALL_COMPLIANCE_SUMMARY_SUCCESS', payload })
}

export function* watchFetchOverAllComplianceSummaryRequest() {
  yield takeLatest<IFetchOverAllComplianceSummaryAction>('@@driverCompliance/FETCH_OVER_ALL_COMPLIANCE_SUMMARY', fetchOverAllComplianceSummary);
}

function* fetchDeliveryAssociateComplianceSummary(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.avgTotalCompliance.deliveryAssociateComplianceSummary, action.payload)
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY_SUCCESS', payload })
}

export function* watchFetchDeliveryAssociateComplianceSummaryRequest() {
  yield takeLatest<IFetchDeliveryAssociateComplianceSummaryAction>('@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY', fetchDeliveryAssociateComplianceSummary);
}

function* fetchOverallDeliveryAssociateComplianceSummary(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.avgTotalCompliance.deliveryAssociateComplianceSummary, action.payload)
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_OVERALL_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY_SUCCESS', payload })
}

export function* watchFetchOverallDeliveryAssociateComplianceSummaryRequest() {
  yield takeLatest<IFetchOverallDeliveryAssociateComplianceSummaryAction>('@@driverCompliance/FETCH_OVERALL_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY', fetchOverallDeliveryAssociateComplianceSummary);
}
function* fetchComplianceTrendAction(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.avgTotalCompliance.deliveryassociatescompliancetrend, action.payload)
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_COMPLIANCE_TREND_SUCCESS', payload })
}

export function* watchIFetchComplianceTrendActionRequest() {
  yield takeLatest<IFetchComplianceTrendAction>('@@driverCompliance/FETCH_COMPLIANCE_TREND', fetchComplianceTrendAction);
}

function* fetchBranchDeliveryAssociateComplainceSummary(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.totalBranchCompliance.getBranchDeliveryAssociateCompliance, action.payload)
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_BRANCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY_SUCCESS', payload })
}

export function* watchFetchBranchDeliveryAssociateComplianceSummaryRequest() {
  yield takeLatest<IFetchBranchDeliveryAssociateComplianceSummaryAction>('@@driverCompliance/FETCH_BRANCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY', fetchBranchDeliveryAssociateComplainceSummary);
}

export function* setFilterData(action: any) {
  const { payload } = action;
  yield put<ISetFilterDataAction>({ type: '@@driverCompliance/SET_FILTER_DATA', payload })
}

function* fetchDeliveryAssociateLoginHistory(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.avgTotalCompliance.deliiveryAssociateLoginHistory, action.payload)
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_LOGIN_HISTORY_SUCCESS', payload })
}

export function* watchFetchDeliveryAssociateLoginHistory() {
  yield takeLatest<IFetchDeliveryAssociateLoginHistoryAction>('@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_LOGIN_HISTORY', fetchDeliveryAssociateLoginHistory);
}


function* fetchDeliveryAssociateDevices(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.avgTotalCompliance.deliveryAssociateDevices, action.payload)
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICES_SUCCESS', payload })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/SET_DELIVERY_ASSOCIATE_DEVICES', payload })
}

export function* watchFetchDeliveryAssociateDevices() {
  yield takeLatest<IFetchDeliveryAssociateDevicesAction>('@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICES', fetchDeliveryAssociateDevices);
}

function* fetchDeviceCompatibilityColumnStructure() {
  const { data: payload } = yield call(axios.get, apiMappings.analytics.driverCompliance.avgTotalCompliance.getDeviceCompatibilityColumnStructure)
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_DEVICE_COMPATIBILITY_COLUMN_STRUCTURE_SUCCESS', payload })
}

export function* watchFetchDeviceCompatibilityColumnStructure() {
  yield takeLatest<IFetchDeviceCompatibilityColumnStructureAction>('@@driverCompliance/FETCH_DEVICE_COMPATIBILITY_COLUMN_STRUCTURE', fetchDeviceCompatibilityColumnStructure)
}

function* fetchLoginHistoryColumnStructure() {
  const { data: payload } = yield call(axios.get, apiMappings.analytics.driverCompliance.avgTotalCompliance.getLoginHistoryColumnStructure)
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_LOGIN_HISTORY_COLUMN_STRUCTURE_SUCCESS', payload })
}

export function* watchLoginHistoryColumnStructure() {
  yield takeLatest<IFetchLoginHistoryColumnStructureAction>('@@driverCompliance/FETCH_LOGIN_HISTORY_COLUMN_STRUCTURE', fetchLoginHistoryColumnStructure)
}

function* fetchDeviceListColumnStructure() {
  const { data: payload } = yield call(axios.get, apiMappings.analytics.driverCompliance.avgTotalCompliance.getDeviceListColumnStructure)
  const loaderCount = yield select(
    (state) => state.analytics.driverComplianceAnalytics.loaderCount
  );
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/SET_LOADER_COUNT", payload: loaderCount ? loaderCount - 1 : 0 })
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_DEVICE_LIST_COLUMN_STRUCTURE_SUCCESS', payload })
}

export function* watchDeviceListColumnStructure() {
  yield takeLatest<IFetchDeviceListColumnStructureAction>('@@driverCompliance/FETCH_DEVICE_LIST_COLUMN_STRUCTURE', fetchDeviceListColumnStructure)
}

function* fetchDeliveryAssociateDeviceCompatibility(action: any) {
  const { data: { data: payload } } = yield call(axios.post, apiMappings.analytics.driverCompliance.avgTotalCompliance.getDeliveryAssociateDeviceCompatibility, action.payload)
  yield put<DriverComplianceAnalyticsActions>({ type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICE_COMPATIBILITY_SUCCESS", payload })
}

export function* watchFetchDeliveryAssociateDeviceCompatibility() {
  yield takeLatest<IFetchDeliveryAssociateDeviceCompatibilityAction>('@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICE_COMPATIBILITY', fetchDeliveryAssociateDeviceCompatibility)
}

function* fetchPlannedRouteKpiConfiguration() {
  const { data: { data: payload } } = yield call(axios.get, apiMappings.analytics.driverCompliance.getPlannedRouteKpiConfiguration)
  yield put<DriverComplianceAnalyticsActions>({ type: '@@driverCompliance/FETCH_PLANNED_ROUTE_KPI_CONFIGURATION_SUCCESS', payload })
}

export function* watchFetchPlannedRouteKpiConfiguration() {
  yield takeLatest<IFetchPlannedRouteKpiConfigurationAction>('@@driverCompliance/FETCH_PLANNED_ROUTE_KPI_CONFIGURATION', fetchPlannedRouteKpiConfiguration)
}

export function* watchDAComplianceRequest() {
  yield all([
    watchFetchKpiListRequest(),
    watchFetchCardDetailsRequest(),
    watchFetchOverAllComplianceSummaryRequest(),
    watchFetchDeliveryAssociateComplianceSummaryRequest(),
    watchfetchBranchListRequest(),
    watchfetchSkillListRequest(),
    watchfetchTotalBranchComplianceRequest(),
    watchFetchBranchDeliveryAssociateComplianceSummaryRequest(),
    watchFetchOrdersCardDetailsRequest(),
    watchFetchBranchesCardDetailsRequest(),
    watchFetchOrdersComplianceReportRequest(),
    watchFetchCheckInOrdersComplianceReportRequest(),
    watchFetchCheckoutOrdersComplianceReportRequest(),
    watchFetchOnTimeDeliveryComplianceReportRequest(),
    watchFetchDistanceComplianceReportRequest(),
    watchFetchServiceTimeComplianceReportRequest(),
    watchFetchTotalOrdersComplianceReportRequest(),
    watchFetchTotalOrdersColumnStructure(),
    watchIFetchComplianceTrendActionRequest(),
    watchFetchDeliveryAssociateLoginHistory(),
    watchFetchDeliveryAssociateDevices(),
    watchFetchDeviceCompatibilityColumnStructure(),
    watchFetchDeliveryAssociateDeviceCompatibility(),
    watchFetchPlannedRouteKpiConfiguration(),
    watchFetchOverallDeliveryAssociateComplianceSummaryRequest(),
    watchLoginHistoryColumnStructure(),
    watchDeviceListColumnStructure()
  ])
}