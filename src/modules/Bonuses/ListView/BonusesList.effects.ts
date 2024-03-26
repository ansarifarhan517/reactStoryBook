// STEPS:
// 1. Make an action to call this API
// 2. Then make a watcher fror that action
// 3. Then make the generator function call that should be called as soon as that action is dispatched
// 4. NOTE: Don't forget to attach the common watcher with rootSaga.

import moment from "moment";
import { all, call, put, takeLatest } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import store from "../../../utils/redux/store";
import {
  IBonusesListActions,
  IFetchListViewData,
  ISetIsListViewEmpty,
} from "./BonusesList.actions";


const manipulateStructureColumns = (columns) => {
  const columnKeys = Object.keys(columns);
  columnKeys?.forEach((key: string) => {
    if (key === "startDate" || key === "endDate") {
      const clientProperties = store.getState().clientProperties;
      columns[key].dateFormat =
        clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase();
    }
  });
  return columns;
};


const changeDateFilterText = (
  searchText: string | undefined,
  searchBy: string | undefined
) => {

  const clientProperties = store.getState().clientProperties;
  const dateFormat = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase();
  const searchByArray = searchBy?.split("#@#");
  if (searchByArray?.length) {
    const searchTextArray = searchText?.split("#@#");
    searchByArray?.forEach((searchByField, index) => {
      if (searchTextArray?.length && (searchByField === "startDate" || searchByField === "endDate")) {
          searchTextArray[index] = searchTextArray[index]
            ?.split("$@$")
            ?.map((date: string, i: number) =>
              i
                ? moment(date, dateFormat).endOf("day").format("YYYY-MM-DDTHH:mm:ss")
                : moment(date, dateFormat).startOf("day").format("YYYY-MM-DDTHH:mm:ss")
            )
            .join("$@$");
      }
    });
    searchText = searchTextArray?.join("#@#");
  }
  return searchText;
};

function* fetchListViewStructure() {
  try {
    yield put<IBonusesListActions>({
      type: "@@bonuses/SET_LISTVIEW_LOADING",
      payload: { key: "structure", value: true },
    });

    const response = yield call(axios.get, apiMappings.common.structure, {
      params: {
        modelName: "BONUS_CONFIGURATIONS",
        pageName: "BONUS_CONFIGURATIONS",
        sectionName: "BONUS_MASTER_LIST_VIEW",
      },
    });

    if (response.status === 200) {
      yield put<IBonusesListActions>({
        type: "@@bonuses/SET_LISTVIEW_LOADING",
        payload: { key: "structure", value: false },
      });

      const manipulatedStructure = {
        ...response?.data,
        columns: { ...manipulateStructureColumns(response?.data?.columns) },
      };

      yield put<IBonusesListActions>({
        type: "@@bonuses/SET_LISTVIEW_STRUCTURE",
        payload: manipulatedStructure,
      });
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching Bonus List structure", error);
    yield put<IBonusesListActions>({
      type: "@@bonuses/SET_LISTVIEW_LOADING",
      payload: { key: "structure", value: false },
    });
  }
}

function* watchFetchListViewStructure() {
  yield takeLatest<IBonusesListActions>(
    "@@bonuses/FETCH_LISTVIEW_STRUCTURE",
    fetchListViewStructure
  );
}

function* fetchModalListViewStructure() {
  try {
    const response = yield call(axios.get, apiMappings.common.structure, {
      params: {
        modelName: "BONUS_CONFIGURATIONS",
        pageName: "BONUS_CONFIGURATIONS",
        sectionName: "BONUS_MODAL_LIST_VIEW",
      },
    });

    if (response.status === 200) {
      yield put<IBonusesListActions>({
        type: "@@bonuses/SET_MODAL_LISTVIEW_STRUCTURE",
        payload: response.data,
      });
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching Modal Structure", error);
  }
}

function* watchFetchModalListViewStructure() {
  yield takeLatest<IBonusesListActions>(
    "@@bonuses/FETCH_MODAL_LISTVIEW_STRUCTURE",
    fetchModalListViewStructure
  );
}

function* fetchListViewData(action: IFetchListViewData) {
  yield put<IBonusesListActions>({
    type: "@@bonuses/SET_LISTVIEW_LOADING",
    payload: { key: "data", value: true },
  });

  let isParamsEmpty =
    Object.keys({ ...action.payload })?.length > 1 &&
    !{ ...action.payload }["searchBy"] &&
    !{ ...action.payload }["searchText"] &&
    !{ ...action.payload }["sortBy"] &&
    !{ ...action.payload }["sortOrder"];

  const manipulatedSearchText = changeDateFilterText(
    action.payload?.["searchText"],
    action.payload?.["searchBy"]
  );
  const changedPayload = { ...action.payload, searchText: manipulatedSearchText };

  try {
    const { status, data } = yield call(
      axios.post,
      apiMappings.payments.bonuses.getBonusListData,
      null,
      { params: changedPayload }
    );

    if (status === 200) {
      yield put<IBonusesListActions>({
        type: "@@bonuses/SET_LISTVIEW_DATA",
        payload: {
          results: data?.data?.results,
          totalCount: data?.data?.totalCount,
        },
      });

      if (isParamsEmpty && data?.data?.results?.length < 1) {
        yield put<ISetIsListViewEmpty>({
          type: "@@bonuses/SET_IS_LIST_EMPTY",
          payload: true,
        });
      }

      yield put<IBonusesListActions>({
        type: "@@bonuses/SET_LISTVIEW_LOADING",
        payload: { key: "data", value: false },
      });
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching List View data", error);
  }
}

function* watchFetchListViewData() {
  yield takeLatest<IFetchListViewData>(
    "@@bonuses/FETCH_LISTVIEW_DATA",
    fetchListViewData
  );
}

// Common watcher for all the API's/Saga for Bonus Configuration Module
export function* watchBonusesListRequests() {
  yield all([
    watchFetchListViewData(),
    watchFetchListViewStructure(),
    watchFetchModalListViewStructure(),
  ]);
}
