import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { IConsentStatusReportFormActions } from "./ConsentStatusReportForm.action";
import store from "../../../../../utils/redux/store";


function* fetchConsentStatusReportFormStructure() {
  const pageName = store.getState().consentStatusReport.form.pageName 
  const { data: payload } = yield call(
    axios.get,
    pageName == 'consentDetailedReport' ?apiMappings.consentDetailedReport.form.structure :apiMappings.consentStatusReport.form.structure 
  );
  yield put<IConsentStatusReportFormActions>({
    type: "@@consentStatusReportForm/SET_STRUCTURE",
    payload,
  });
}

export function* watchFetchConsentStatusReportFormStructureRequest() {
  yield takeLatest<IConsentStatusReportFormActions>(
    "@@consentStatusReportForm/FETCH_STRUCTURE",
    fetchConsentStatusReportFormStructure
  );
}

export function* watchConsentStatusReportForm() {
  yield all([watchFetchConsentStatusReportFormStructureRequest()]);
}
