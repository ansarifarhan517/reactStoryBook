import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../../../../utils/apiMapping";
import axios from "../../../../../../utils/axios";
import { tDropdown } from "../model";
import { IAllAddressListActions } from "./action";

function* fetchAddressType() {
  const { data: response } = yield call(
    axios.get,
    apiMappings.common.lookup.getAddressType
  );

  const addressTypeArray = response.map((entry: any) => {
    return {
      label: entry?.clientRefMasterDesc,
      value: entry?.clientRefMasterCd,
      id: entry?.clientRefMasterCd,
      title: entry?.clientRefMasterCd,
    };
  });

  yield put<IAllAddressListActions>({
    type: "@@ALL_ADDRESSES/SET_ADDRESS_TYPE",
    payload: addressTypeArray,
  });
}

function* watchFetchAddressType() {
  yield takeLatest<IAllAddressListActions>(
    "@@ALL_ADDRESSES/GET_ADDRESS_TYPE",
    fetchAddressType
  );
}

function* fetchWeekdays() {
  const { data: weeks } = yield call<any>(
    axios.get,
    apiMappings.all_addresses.list.weekdays
  );

  const payload = weeks?.map((weekData: tDropdown) => {
    if (weekData?.label) return weekData;
    return {
      label: weekData?.name,
      value: weekData?.name,
      id: weekData?.id,
    };
  });

  yield put<IAllAddressListActions>({
    type: "@@ALL_ADDRESSES/SET_WEEK_DAYS",
    payload: payload,
  });
}

function* watchFetchWeekDays() {
  yield takeLatest<IAllAddressListActions>(
    "@@ALL_ADDRESSES/GET_WEEK_DAYS",
    fetchWeekdays
  );
}

// Common watcher for all the API's/Saga for Bonus Configuration Module
export function* watchAllAddressesListRequests() {
  yield all([watchFetchAddressType(), watchFetchWeekDays()]);
}
