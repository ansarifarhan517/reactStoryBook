import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { ConsentManagementActions } from "./ConsentManagement.action";
import { IConsentManagementListData } from "./ConsentManagement.models";

function* fetchAllConsentManagementDetailsListviewSuccess() {
  try {
    const response = yield call(
      axios.get,
      apiMappings?.consent?.management?.mainlist
    );
    let uniquePersonas = [
      ...new Set(
        response?.data?.data?.map(
          (consent: IConsentManagementListData) => consent.persona
        )
      ),
    ];
    //according to the requirement if we dont get any persona -> hardcode Delivery associate
    uniquePersonas.length === 0 && uniquePersonas.push("DELIVERYMEDIUM")
    const payload = { ...response.data, uniquePersonas };
    yield put<ConsentManagementActions>({
      type: "@@consentManagement/FETCH_CONSENT_TYPE_DETAILS_LISTVIEW_SUCCESS",
      payload,
    });
  } catch (error) {
    console.log("Failed to fetch the data", error);
  }
}

export function* watchFetchConsentManagementDetailsListviewRequest() {
    yield takeLatest<ConsentManagementActions>('@@consentManagement/FETCH_CONSENT_TYPE_DETAILS_LISTVIEW', fetchAllConsentManagementDetailsListviewSuccess);
}


export function* watchConsentManagementRequest() {
    yield all([
        watchFetchConsentManagementDetailsListviewRequest(),
    ])
}