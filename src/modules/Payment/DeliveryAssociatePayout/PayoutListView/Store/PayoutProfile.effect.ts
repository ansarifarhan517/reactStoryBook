import { AxiosResponse } from "axios";
import { call, fork, put, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { IBranchLookupResponse } from "../../../../../utils/common.interface";
import { makeBranchToProfileMap } from "../Utils";
import {
  IFetchListViewData,
  ISetIsListViewEmpty,
  tPayoutProfilesActions,
} from "./PayoutProfile.actions";

// ************** LIST STRUCTURE
function* fetchListViewStructure() {
  yield put<tPayoutProfilesActions>({
    type: "@@PAYOUTS/SET_COLUMNS_LOADING",
    payload: { columns: true },
  });
  try {
    const response = yield call(axios.get, apiMappings.common.structure, {
      params: {
        modelName: "PAYOUT_CONFIGURATION",
        pageName: "PAYOUT_CONFIGURATION",
        sectionName: "PAYOUT_PROFILES_LIST_VIEW",
      },
    });

    if (response.status === 200) {
      yield put<tPayoutProfilesActions>({
        type: "@@PAYOUTS/SET_LISTVIEW_STRUCTURE",
        payload: response.data,
      });

      yield put({type: "@@PAYOUTS/FETCH_LOOKUPTYPE", key: "day"});
    }
    yield put<tPayoutProfilesActions>({
      type: "@@PAYOUTS/SET_COLUMNS_LOADING",
      payload: { columns: false },
    });
  } catch (error: any) {
    console.log("Error Occured in Fetching Bonus List structure", error);
    yield put<tPayoutProfilesActions>({
      type: "@@PAYOUTS/SET_COLUMNS_LOADING",
      payload: { columns: false },
    });
  }
}

function* watchFetchListViewStructure() {
  yield takeLatest<tPayoutProfilesActions>(
    "@@PAYOUTS/FETCH_LISTVIEW_STRUCTURE",
    fetchListViewStructure
  );
}

// ************ BRANCH LOOKUP

function* fetchAttachBranchLookup() {
  const config = {
    params: {},
    data: {},
    headers: {
      "Content-Type": "application/json",
    },
  };
  const { data: payload }: AxiosResponse<IBranchLookupResponse[]> = yield call(
    axios.get,
    apiMappings.settings.alertProfiles.lookups.branch,
    config
  );
  yield put<tPayoutProfilesActions>({
    type: "@@PAYOUTS/SET_BRANCH_ATTACHED",
    payload,
  });
}

function* watchFetchAttachBranchLookup() {
  yield takeLatest<tPayoutProfilesActions>(
    "@@PAYOUTS/FETCH_ATTACHED_BRANCH",
    fetchAttachBranchLookup
  );
}

// ************* LIST VIEW DATA

function* fetchListViewData(action: IFetchListViewData) {
  yield put<tPayoutProfilesActions>({
    type: "@@PAYOUTS/SET_LOADING",
    payload: { listView: true },
  });

  let isParamsEmpty =
    Object.keys({ ...action.payload }).length > 1 &&
    !{ ...action.payload }["searchBy"] &&
    !{ ...action.payload }["searchText"] &&
    !{ ...action.payload }["sortBy"] &&
    !{ ...action.payload }["sortOrder"];

  try {
    const { status, data } = yield call(
      axios.post,
      apiMappings.payments.deliveryAssociatePayout.getList,
      null,
      { params: action.payload }
    );

    if (status === 200) {
      yield put<tPayoutProfilesActions>({
        type: "@@PAYOUTS/SET_LISTVIEW_DATA",
        payload: {
          results: data.data.results,
          totalCount: data.data.totalCount,
        },
      });

      if (isParamsEmpty && data.data.results?.length < 1) {
        yield put<ISetIsListViewEmpty>({
          type: "@@PAYOUTS/SET_IS_LIST_EMPTY",
          payload: true,
        });
      }

      yield put<tPayoutProfilesActions>({
        type: "@@PAYOUTS/SET_BRANCHPROIFLE_MAPPING",
        payload: makeBranchToProfileMap(data.data.results),
      });
    }
    yield put<tPayoutProfilesActions>({
      type: "@@PAYOUTS/SET_LOADING",
      payload: { listView: false },
    });
  } catch (error: any) {
    console.log("Error Occured in Fetching List View data", error);
    yield put<tPayoutProfilesActions>({
      type: "@@PAYOUTS/SET_LOADING",
      payload: { listView: false },
    });
  }
}

function* watchFetchListViewData() {
  yield takeLatest<IFetchListViewData>(
    "@@PAYOUTS/FETCH_LISTVIEW_DATA",
    fetchListViewData
  );
}

export function* watchPayoutProfilesSaga() {
  yield fork(watchFetchListViewStructure);
  yield fork(watchFetchAttachBranchLookup);
  yield fork(watchFetchListViewData);
}
