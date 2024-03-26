import { all, call, put, takeLatest, select } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { CheckpointsListViewActions } from "./CheckpointsListView.actions";
import { IListViewRequestPayload } from "../../../utils/common.interface";
import { AdvancedFilterComponentActions } from "../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";

function* fetchCheckpointsListViewStructure() {
  yield put<CheckpointsListViewActions>({
    type: "@@checkpointsListView/SET_COLUMNS_LOADING",
    payload: { columns: true },
  });
  try {
  const { data: payload } = yield call<any>(axios.get, apiMappings.checkpoints.listView.structure);
    yield put({
      type: "@@checkpointsListView/FETCH_STRUCTURE_SUCCESS",
      payload,
    });
    yield put<CheckpointsListViewActions>({
      type: "@@checkpointsListView/SET_COLUMNS_LOADING",
      payload: { columns: false },
    });
  } catch (error) {
    yield put<CheckpointsListViewActions>({
      type: "@@checkpointsListView/SET_COLUMNS_LOADING",
      payload: { columns: false },
    });
  }
}

function* fetchCheckpointsMapViewStructure() {
  yield put<CheckpointsListViewActions>({
    type: "@@checkpointsListView/SET_COLUMNS_LOADING",
    payload: { columns: true,  },
  });
  yield put<CheckpointsListViewActions>({
    type: "@@checkpointsListView/SET_DATA_LOADING",
    payload: { listView: true },
  });
  try {
  const { data: payload } = yield call<any>(axios.get, apiMappings.checkpoints.listView.mapViewStructure);
    yield put({
      type: "@@checkpointsListView/FETCH_STRUCTURE_SUCCESS",
      payload,
    });
    yield put<CheckpointsListViewActions>({
      type: "@@checkpointsListView/SET_COLUMNS_LOADING",
      payload: { columns: false },
    });
    yield put<CheckpointsListViewActions>({
      type: "@@checkpointsListView/SET_DATA_LOADING",
      payload: { listView: false },
    });
  } catch (error) {
    yield put<CheckpointsListViewActions>({
      type: "@@checkpointsListView/SET_COLUMNS_LOADING",
      payload: { columns: false },
    });
  }
}
function* fetchData(action: any) {
  yield put<CheckpointsListViewActions>({
    type: "@@checkpointsListView/SET_DATA_LOADING",
    payload: { listView: true },
  });
  const advFilterLoader = yield select(state => state.advanceFilter.advFilterLoader);
  if (advFilterLoader) {

    const filterListPayload = yield select(state => state.advanceFilter.filterListPayload);
    const data = filterListPayload || undefined

    // adv filter
    let filter: IListViewRequestPayload = { ...action.payload }
  try {
    const { data: { data: payload } } = yield call(axios.post, apiMappings.checkpoints.listView.data, data,
      {
        params: {
          ...filter,
        },
      }
    )
    const clientProperties = yield select(state => state.clientProperties)
    payload.clientProperties = clientProperties

    /********* CHECK WHETHER PAYLOAD AND PARAMS ARE BOTH EMPTY THEN NO DATA *************/
    let isParamsEmpty = (Object.keys(filter).length > 1) && !filter['searchBy'] && !filter['searchText'] && !filter['sortBy'] && !filter['sortOrder']
    if (isParamsEmpty && payload?.results?.length < 1 && !filterListPayload) {
      yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: true });

    } else {
      yield put<CheckpointsListViewActions>({
        type: "@@checkpointsListView/FETCH_DATA_SUCCESS",
        payload,
      });
      yield put<AdvancedFilterComponentActions>({ type: '@@advanceFilter/SET_EMPTY_DATA', payload: false });
    }

   
    yield put<CheckpointsListViewActions>({
      type: "@@checkpointsListView/SET_DATA_LOADING",
      payload: { listView: false },
    });
  } catch (error) {
    yield put<CheckpointsListViewActions>({
      type: "@@checkpointsListView/SET_DATA_LOADING",
      payload: { listView: false },
    });
  }
  }
}

function* fetchModalListViewStructure() {
  try {
    const response = yield call(axios.get, apiMappings.common.structure, {
      params: {
        modelName: "ROUTE_MIDDLE_MILE",
        pageName: "ROUTE_MIDDLE_MILE",
        sectionName: "ROUTE_LIST_VIEW",
      },
    });

    if (response.status === 200) {
      yield put<CheckpointsListViewActions>({
        type: "@@checkpointsListView/SET_MODAL_LISTVIEW_STRUCTURE",
        payload: response.data,
      });
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching Modal Structure", error);
  }
}

function* fetchDropdownData() {
  try {
    const { data } = yield call<any>(axios.get, apiMappings.common.lookup.checkpointCategory);
    let ownership = data.map((type: any) => ({
      label: type?.clientRefMasterCd,
      value: type?.clientRefMasterDesc,
      id: type?.clientRefMasterId,
      title: type?.clientRefMasterCd,
      clientRefMasterId: type?.clientRefMasterId
    }))
    yield put<CheckpointsListViewActions>({ type: '@@checkpointsListView/SET_CATEGORY_LIST', payload: ownership });
  }
 

  catch (error) {
    console.log("Failed to fetch data for Dropdown List Data: ", error)
  }
}

function* fetchCheckpointsMappedRoutesListStructure() {
  try {
    const response = yield call(axios.get, apiMappings.checkpoints.checkpointsMappedToRoutes.structure);
    if (response.status === 200) {
      yield put<CheckpointsListViewActions>({
        type: "@@checkpointsListView/SET_CHECKPOINTS_MAPPED_ROUTES_LIST_STRUCTURE",
        payload: response.data,
      });
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching Modal Structure", error);
  }
}

function* fetchCheckpointsMappedRoutesListData(action: any) {
  try {
    const {
      data: { data: payload },
    } = yield call(
      axios.post,
      apiMappings.checkpoints.checkpointsMappedToRoutes.data,
      {},
      { params: action.payload }
    );
    yield put<CheckpointsListViewActions>({
      type: "@@checkpointsListView/FETCH_CHECKPOINTS_MAPPED_ROUTES_LIST_DATA_SUCCESS",
      payload: payload
    });
  } catch (error) {
    console.log(error);
  }
}

function* fetchCheckpointCodes(action: any) {
  try {
    const response = yield call(axios.get,
       apiMappings.checkpoints.checkpointsMappedToRoutes.checkpointCodes,
       { params: action.payload });
    yield put<CheckpointsListViewActions>({
      type: "@@checkpointsListView/SET_CHECKPOINT_CODES",
      payload: response.data
    })
  } catch(error) {
    console.log(error);
  }
}

function* watchFetchModalListViewStructure() {
  yield takeLatest<CheckpointsListViewActions>(
    "@@checkpointsListView/FETCH_MODAL_LISTVIEW_STRUCTURE",
    fetchModalListViewStructure
  );
}

function* watchFetchStructure() {
  yield takeLatest<CheckpointsListViewActions>(
    "@@checkpointsListView/FETCH_STRUCTURE",
    fetchCheckpointsListViewStructure
  );
}

function* watchFetchMapStructure() {
  yield takeLatest<CheckpointsListViewActions>(
    "@@checkpointsListView/FETCH_MAP_VIEW_STRUCTURE",
    fetchCheckpointsMapViewStructure
  );
}

function* watchFetchData() {
  yield takeLatest<CheckpointsListViewActions>(
    "@@checkpointsListView/FETCH_DATA",
    fetchData
  );
}

function* watchFetchDropdownOptions() {
  yield takeLatest<CheckpointsListViewActions>("@@checkpointsListView/FETCH_DROPDOWN_OPTIONS", fetchDropdownData)
}

function* watchFetchCheckpointsMappedRoutesListStructure() {
  yield takeLatest<CheckpointsListViewActions>(
    "@@checkpointsListView/FETCH_CHECKPOINTS_MAPPED_ROUTES_LIST_STRUCTURE",
    fetchCheckpointsMappedRoutesListStructure
  );
}

function* watchFetchCheckpointsMappedRoutesListData() {
  yield takeLatest<CheckpointsListViewActions>(
    "@@checkpointsListView/FETCH_CHECKPOINTS_MAPPED_ROUTES_LIST_DATA",
    fetchCheckpointsMappedRoutesListData
  );
}

function* watchFetchCheckpointCodes() {
  yield takeLatest<CheckpointsListViewActions>(
    "@@checkpointsListView/FETCH_CHECKPOINT_CODES",
    fetchCheckpointCodes
  );
}

export function* watchCheckpointsListViewRequests() {
  yield all([
    watchFetchStructure(),
    watchFetchMapStructure(),
    watchFetchData(),
    watchFetchModalListViewStructure(),
    watchFetchDropdownOptions(),
    watchFetchCheckpointsMappedRoutesListStructure(),
    watchFetchCheckpointsMappedRoutesListData(),
    watchFetchCheckpointCodes(),
  ]);
}
