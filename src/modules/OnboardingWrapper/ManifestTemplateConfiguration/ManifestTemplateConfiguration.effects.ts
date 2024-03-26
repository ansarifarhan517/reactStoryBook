import { AxiosResponse } from "axios";
import { all, call, put, takeLatest, select } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import store from "../../../utils/redux/store";
import {
  extractDynamicLabelsFromHTML,
  replaceDynamicLabelWithLabel,
} from "../../OrderMiddleMile/PrintAwb/PrintAwb.constants";
import { ManifestTemplateConfigActions } from "./ManifestTemplateConfiguration.actions";
import { IDefaultTemplate } from "./ManifestTemplateConfiguration.models";

function* fetchManifestTemplateConfigListStructure() {
  yield put<ManifestTemplateConfigActions>({
    type: "@@manifestTemplateConfig/SET_COLUMNS_LOADING",
    payload: { columns: true },
  });
  try {
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/SET_COLUMNS_LOADING",
      payload: { columns: false },
    });
    const { data: payload } = yield call<any>(
      axios.get,
      apiMappings.manifestTemplateConfiguration.listView.structure
    );
    yield put({
      type: "@@manifestTemplateConfig/FETCH_STRUCTURE_SUCCESS",
      payload,
    });
  } catch (error) {
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/SET_COLUMNS_LOADING",
      payload: { columns: false },
    });
  }
}

function* fetchData(action: any) {
  yield put<ManifestTemplateConfigActions>({
    type: "@@manifestTemplateConfig/SET_DATA_LOADING",
    payload: { listView: true },
  });
  try {
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/SET_DATA_LOADING",
      payload: { listView: false },
    });
    const {
      data: { data: payload },
    } = yield call(
      axios.get,
      apiMappings.manifestTemplateConfiguration.listView.data,
      { params: action.payload }
    );
    const clientProperties = yield select((state) => state.clientProperties);
    payload.clientProperties = clientProperties;
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/FETCH_DATA_SUCCESS",
      payload,
    });
  } catch (error) {
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/SET_DATA_LOADING",
      payload: { listView: false },
    });
  }
}

function* fetchDefaultTemplates() {
  yield put<ManifestTemplateConfigActions>({
    type: "@@manifestTemplateConfig/SET_DATA_LOADING",
    payload: { listView: true },
  });
  try {
    let {
      data: { data: payload },
    } = yield call(
      axios.get,
      apiMappings.manifestTemplateConfiguration.listView.getDefaultConfiguration
    );
    const dynamicLabels = store.getState().dynamicLabels;
    let dynamicLabelsToBeFetched: string[] = [];
    payload.forEach((template: IDefaultTemplate) => {
      const { orderHTML, ordersHTML, manifestsHTML } = template.htmlData;

      if (orderHTML) {
        const labelSet = extractDynamicLabelsFromHTML(orderHTML);
        if (labelSet.size > 0) {
          dynamicLabelsToBeFetched = [
            ...dynamicLabelsToBeFetched,
            ...Array.from(labelSet).filter((label) => !dynamicLabels[label]),
          ];
        }
      }
      if (ordersHTML) {
        const labelSet = extractDynamicLabelsFromHTML(ordersHTML);
        if (labelSet.size > 0) {
          dynamicLabelsToBeFetched = [
            ...dynamicLabelsToBeFetched,
            ...Array.from(labelSet).filter((label) => !dynamicLabels[label]),
          ];
        }
      }
      if (manifestsHTML) {
        const labelSet = extractDynamicLabelsFromHTML(manifestsHTML);
        if (labelSet.size > 0) {
          dynamicLabelsToBeFetched = [
            ...dynamicLabelsToBeFetched,
            ...Array.from(labelSet).filter((label) => !dynamicLabels[label]),
          ];
        }
      }
    });

    let templateDynamicLabels = { ...dynamicLabels };
    let dataSet = {};

    if (dynamicLabelsToBeFetched.length > 0) {
      const { data }: AxiosResponse<Record<string, string>> = yield call(
        axios.get,
        apiMappings.common.dynamicLabels,
        { params: { labels: dynamicLabelsToBeFetched.join(",") } }
      );
      dataSet = data;
      templateDynamicLabels = { ...templateDynamicLabels, ...dataSet };
    }

    payload = payload.map((template: IDefaultTemplate) => {
      const returnTemplate = { ...template };
      const { orderHTML, ordersHTML, manifestsHTML } = template.htmlData;

      //Handling the HTML with the customised HTML tags and converting the tags to values.
      if (orderHTML) {
        const labelSet = extractDynamicLabelsFromHTML(orderHTML);
        if (labelSet.size > 0) {
          Array.from(labelSet).forEach((label) => {
            returnTemplate.htmlData.orderHTML = replaceDynamicLabelWithLabel(
              returnTemplate.htmlData.orderHTML,
              label,
              templateDynamicLabels[label] || ""
            );
          });
        }
      }
      if (ordersHTML) {
        const labelSet = extractDynamicLabelsFromHTML(ordersHTML);
        if (labelSet.size > 0) {
          Array.from(labelSet).forEach((label) => {
            returnTemplate.htmlData.ordersHTML = replaceDynamicLabelWithLabel(
              returnTemplate.htmlData.ordersHTML,
              label,
              templateDynamicLabels[label] || ""
            );
          });
        }
      }
      if (manifestsHTML) {
        const labelSet = extractDynamicLabelsFromHTML(manifestsHTML);
        if (labelSet.size > 0) {
          Array.from(labelSet).forEach((label) => {
            returnTemplate.htmlData.manifestsHTML =
              replaceDynamicLabelWithLabel(
                returnTemplate.htmlData.manifestsHTML,
                label,
                templateDynamicLabels[label] || ""
              );
          });
        }
      }

      return returnTemplate;
    });
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/FETCH_DEFAULT_TEMPLATE_LIST_SUCCESS",
      payload: payload,
    });
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/SET_DATA_LOADING",
      payload: { listView: false },
    });
  } catch (error) {
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/SET_DATA_LOADING",
      payload: { listView: false },
    });
  }
}

function* fetchManifestTemplateDetailsData(action: any) {
  yield put<ManifestTemplateConfigActions>({
    type: "@@manifestTemplateConfig/SET_FORM_LOADING",
    payload: true,
  });
  try {
    const {
      data: { data: payload },
    } = yield call(
      axios.get,
      apiMappings.manifestTemplateConfiguration.listView.getAwbTemplateDetails,
      { params: action.payload }
    );
    const clientProperties = yield select((state) => state.clientProperties);
    payload.clientProperties = clientProperties;
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/SET_MANIFEST_TEMPLATE_DETAILS_DATA",
      payload,
    });
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/SET_FORM_LOADING",
      payload: false,
    });
  } catch (error) {
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/SET_FORM_LOADING",
      payload: false,
    });
  }
}

function* fetchManifestTemplateConfigTags() {
  try {
    const { data } = yield call(
      axios.get,
      apiMappings.manifestTemplateConfiguration.listView.dynamicTags
    );
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/FETCH_TAGS_SUCCESS",
      payload: data,
    });
  } catch (error) {
    console.log(error, "Error occured");
  }
}

function* fetchPropertyType() {
  try {
    const { data } = yield call(
      axios.get,
      apiMappings.manifestTemplateConfiguration.listView.getPropertyType
    );
    yield put<ManifestTemplateConfigActions>({
      type: "@@manifestTemplateConfig/FETCH_PROPERTY_TYPE_SUCCESS",
      payload: data,
    });
  } catch (error) {
    console.log(error, "Error occured");
  }
}

export function* watchFetchStructureRequest() {
  yield takeLatest<ManifestTemplateConfigActions>(
    "@@manifestTemplateConfig/FETCH_STRUCTURE",
    fetchManifestTemplateConfigListStructure
  );
}

export function* watchFetchData() {
  yield takeLatest<ManifestTemplateConfigActions>(
    "@@manifestTemplateConfig/FETCH_DATA",
    fetchData
  );
}

export function* watchFetchDefaultTemplates() {
  yield takeLatest<ManifestTemplateConfigActions>(
    "@@manifestTemplateConfig/FETCH_DEFAULT_TEMPLATE_LIST",
    fetchDefaultTemplates
  );
}

export function* watchFetchManifestTemplateDetailsDataRequest() {
  yield takeLatest<ManifestTemplateConfigActions>(
    "@@manifestTemplateConfig/GET_MANIFEST_TEMPLATE_DETAILS_DATA",
    fetchManifestTemplateDetailsData
  );
}

export function* watchFetchManifestTemplateConfigTags() {
  yield takeLatest<ManifestTemplateConfigActions>(
    "@@manifestTemplateConfig/FETCH_TAGS",
    fetchManifestTemplateConfigTags
  );
}

export function* watchFetchPropertyType() {
  yield takeLatest<ManifestTemplateConfigActions>(
    "@@manifestTemplateConfig/FETCH_PROPERTY_TYPE",
    fetchPropertyType
  );
}

export function* watchManifestTemplateConfiguration() {
  yield all([
    watchFetchStructureRequest(),
    watchFetchData(),
    watchFetchDefaultTemplates(),
    watchFetchManifestTemplateDetailsDataRequest(),
    watchFetchManifestTemplateConfigTags(),
    watchFetchPropertyType(),
  ]);
}
