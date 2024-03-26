import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { CheckpointsFormActions } from "./CheckpointsForm.actions";

export interface IEffectAction {
  [key: string]: any;
}

function* fetchCheckpointsFormStructure() {
  yield put<CheckpointsFormActions>({
    type: "@@checkpointsForm/SET_FORM_LOADING",
    payload: true,
  });
  try {
    const { data: payload } = yield call(
      axios.get,
      apiMappings.checkpoints.form.structure
    );
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_FORM_STRUCTURE",
      payload,
    });
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_FORM_STRUCTURE_FLAG",
      payload: true,
    });
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_FORM_LOADING",
      payload: false,
    });
  } catch (error) {
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_FORM_LOADING",
      payload: false,
    });
    console.log("Error is", error);
  }
}

function* fetchCheckpointsAlertFormStructure() {
  yield put<CheckpointsFormActions>({
    type: "@@checkpointsForm/SET_FORM_LOADING",
    payload: true,
  });
  try {
    const { data: payload } = yield call(
      axios.get,
      apiMappings.checkpoints.alertForm.structure
    );
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_ALERT_FORM_STRUCTURE",
      payload,
    });
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_FORM_LOADING",
      payload: false,
    });
  } catch (error) {
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_FORM_LOADING",
      payload: false,
    });
    console.log("Error is", error);
  }
}

function* fetchDeviceById(action: IEffectAction) {
  const {
    data: { data: payload },
  } = yield call(
    axios.get,
    apiMappings.checkpoints.form.getCheckpointData + action.payload
  );
  yield put<CheckpointsFormActions>({
    type: "@@checkpointsForm/FETCH_CHECKPOINT_BY_ID_SUCCESS",
    payload,
  });
}

function* fetchDropdownData() {
  yield put<CheckpointsFormActions>({
    type: "@@checkpointsForm/SET_FORM_LOADING",
    payload: true,
  });
  try {
    const { data: categoryData } = yield call<any>(
      axios.get,
      apiMappings.common.lookup.checkpointCategory
    );

    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_CATEGORY_LIST",
      payload: categoryData,
    });

    const { data: vehicleTypeData } = yield call<any>(
      axios.get,
      apiMappings.common.lookup.getVehicleType
    );
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_VEHICLE_TYPE_LIST",
      payload: vehicleTypeData,
    });

    const {
      data: { data: fleetTypeData },
    } = yield call<any>(axios.get, apiMappings.common.lookup.fleetType);

    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_FLEET_TYPE_LIST",
      payload: fleetTypeData,
    });

    const { data } = yield call<any>(
      axios.get,
      apiMappings.common.lookup.getDistributionCenter,
      {
        data: {},
        params: {},
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_HUB_TYPE_LIST",
      payload: data,
    });
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_FORM_LOADING",
      payload: false,
    });
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/FETCH_DROPDOWNOPTIONS_SUCCESS_FLAG",
      payload: true,
    });
  } catch (error: any) {
    console.log("Failed to fetch data for Dropdown List Data: ", error);
    yield put<CheckpointsFormActions>({
      type: "@@checkpointsForm/SET_FORM_LOADING",
      payload: false,
    });
  }
}

export function* watchFetchCheckpointsFormStructure() {
  yield takeLatest<CheckpointsFormActions>(
    "@@checkpointsForm/FETCH_FORM_STRUCTURE",
    fetchCheckpointsFormStructure
  );
}

export function* watchFetchCheckpointsAlertFormStructure() {
  yield takeLatest<CheckpointsFormActions>(
    "@@checkpointsForm/FETCH_ALERT_FORM_STRUCTURE",
    fetchCheckpointsAlertFormStructure
  );
}

export function* watchFetchCheckpointByIdRequest() {
  yield takeLatest<CheckpointsFormActions>(
    "@@checkpointsForm/FETCH_CHECKPOINT_BY_ID",
    fetchDeviceById
  );
}

export function* watchFetchDropdownOptions() {
  yield takeLatest<CheckpointsFormActions>(
    "@@checkpointsForm/FETCH_DROPDOWN_OPTIONS",
    fetchDropdownData
  );
}

export function* watchCheckpointsFormRequests() {
  yield all([
    watchFetchCheckpointsFormStructure(),
    watchFetchCheckpointsAlertFormStructure(),
    watchFetchCheckpointByIdRequest(),
    watchFetchDropdownOptions(),
  ]);
}
