import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { IConsentStatusReportListActions } from "./ConsentStatusReportList.actions";
import store from "../../../../../utils/redux/store";
import { createRequestPayload } from "../ConsentStatusReportForm/FormUtils";

function* fetchConsentDetailedListStructure() {
  try {
    const { data } = yield call( axios.get, apiMappings.consentDetailedReport.list.structure);

    yield put<IConsentStatusReportListActions>({
      type: "@@consentStatusReportList/SET_STRUCTURE",
        payload :data,
    });
  } catch (error) {
    console.log(error)
  }
 
}

function* fetchConsentStatusReportListStructure() {
    const pageName =  store.getState().consentStatusReport.form?.pageName
    const formData = store.getState().consentStatusReport.form?.formData
    const clientId = JSON.parse(localStorage.getItem("userAccessInfo") || "{}")?.clientId;

    try {
      const { data } = yield call(
        pageName=='consentDetailedReport' ? axios. post : axios.get,
        pageName=='consentDetailedReport' ? apiMappings.consentDetailedReport.list.combionedStructure:  apiMappings.consentStatusReport.list.structure,
        {
          "clientId":clientId,
          "consentType": formData?.consentType?.consentType,
          "name":formData?.consentName?.name,
          "version": formData?.consentVersion?.version 
      }
      );
  
      yield put<IConsentStatusReportListActions>({
        type: "@@consentStatusReportList/SET_STRUCTURE",
        payload : pageName=='consentDetailedReport' ?  data?.customFormStructure : data,
      });
    } catch (error) {
        console.log(error)
    }

}

function* fetchData(action: any) {
  yield put<IConsentStatusReportListActions>({
    type: "@@consentStatusReportList/SET_LOADING",
    payload: { listView: true },
  });
  const listPayload = createRequestPayload(
    store.getState().consentStatusReport.form.formData
  );
  try {
    const { data } = yield call(
      axios.post,
      store.getState().consentStatusReport.form?.pageName ==
        "consentDetailedReport"
        ? apiMappings.consentDetailedReport.viewReport
        : apiMappings.consentStatusReport.viewReport,
      listPayload,
      { params: action.payload }
    );
    yield put<IConsentStatusReportListActions>({
      type: "@@consentStatusReportList/FETCH_DATA_SUCCESS",
      payload: data,
    });
    yield put<IConsentStatusReportListActions>({
      type: "@@consentStatusReportList/SET_LOADING",
      payload: { listView: false },
    });
  } catch (error) {
    console.log(error);
  }
}

export function* watchFetchDataRequest() {
  yield takeLatest<IConsentStatusReportListActions>(
    "@@consentStatusReportList/FETCH_DATA",
    fetchData
  );
}

export function* watchFetchConsentStatusReportlistStructureRequest() {
  yield takeLatest<IConsentStatusReportListActions>(
    "@@consentStatusReportList/FETCH_STRUCTURE",
    fetchConsentStatusReportListStructure
  );
}

export function* watchFetchConsentDetaileReportlistStructureRequest() {
  yield takeLatest<IConsentStatusReportListActions>(
    '@@consentDetailedReportList/FETCH_STRUCTURE',fetchConsentDetailedListStructure
  );
}

export function* watchConsentStatusReportList() {
  yield all([
    watchFetchConsentStatusReportlistStructureRequest(),
    watchFetchDataRequest(),
    watchFetchConsentDetaileReportlistStructureRequest()
  ]);
}
