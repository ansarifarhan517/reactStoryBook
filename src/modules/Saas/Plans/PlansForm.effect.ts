//import { AppState } from '../../../utils/redux/rootReducer';
import { IMongoFormStructure } from "../../../utils/mongo/interfaces";
import {
  IFetchParentSubscriptionId,
  IPlansFormActions,
} from "./PlansForm.model";
import { takeLatest, call, put, fork, all, select } from "redux-saga/effects";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { prepareFormStructure } from "../../../utils/components/Form/utils";
import { getQueryParams } from "../../../utils/hybridRouting";
//import { getBaseCurrency } from '../../../utils/core';

function* fetchStructure() {
  yield put<IPlansFormActions>({
    type: "@@plansForm/SET_LOADING",
    payload: true,
  });
  const { data: payload } = yield call(
    axios.get,
    apiMappings.saas.plans.structure
  );
  const isEdit: boolean = yield select((state) => state.saas.plans.isEditMode);
  let existingParams = getQueryParams();

  const transformedPayload: IMongoFormStructure = prepareFormStructure(payload);
  if (isEdit && existingParams.planType !== "TRIAL") {
    transformedPayload.organizationDetails.hubspotDealId.editable = false;
    transformedPayload.organizationDetails.legalDocs.editable = false;
    transformedPayload.organizationDetails.parentEntityName.editable = false;
    transformedPayload.organizationDetails.linkToParentEntity.editable = false;
    transformedPayload.organizationDetails.shareSubscription.editable = false;
    // admin email -non editable
    transformedPayload.adminDetails.adminEmailId.editable = false;
    transformedPayload.billingDetails.billingCurrency.editable = false;
    transformedPayload.billingDetails.billingFrequency.editable = false;
    transformedPayload.subscriptionDetails.productActivationDate.editable =
      false;
    transformedPayload.subscriptionDetails.subscriptionActivationDate.editable =
      false;
    transformedPayload.subscriptionDetails.sendActivationLink.editable = false;
    transformedPayload.subscriptionDetails.subscriptionType.editable = false;
    transformedPayload.uatAccountDetails.uatAdminEmail.editable = false;
    transformedPayload.uatAccountDetails.uatAdminEmail.required = false;
    transformedPayload.uatAccountDetails.uatAdminMobileNumber.required = false;
    transformedPayload.uatAccountDetails.uatAdminName.required = false;
  } else if (isEdit && existingParams.planType === "TRIAL") {
    transformedPayload.adminDetails.adminEmailId.editable = false;
    transformedPayload.subscriptionDetails.productActivationDate.editable = false;

    transformedPayload.organizationDetails.parentEntityName.editable = false;
    transformedPayload.organizationDetails.linkToParentEntity.editable = false;
    transformedPayload.organizationDetails.shareSubscription.editable = false;
    
    transformedPayload.subscriptionDetails.sendActivationLink.editable = false;
    transformedPayload.uatAccountDetails.uatAdminEmail.required = false;
    transformedPayload.uatAccountDetails.uatAdminMobileNumber.required = false;
    transformedPayload.uatAccountDetails.uatAdminName.required = false;
    transformedPayload.subscriptionDetails.sendActivationLink.editable = true;
  } else {
    transformedPayload.subscriptionDetails.endOfTerm.permission = false;
    transformedPayload.subscriptionDetails.endOfTerm.editable = false;
  }

  yield put<IPlansFormActions>({
    type: "@@plansForm/SET_STRUCTURE",
    payload: transformedPayload,
  });

  const { data: currency } = yield call(
    axios.get,
    apiMappings.common.lookup.billingCurrency,
    {
      data: {},
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  yield put<IPlansFormActions>({
    type: "@@plansForm/SET_BILLING_CURRENCY",
    payload: currency,
  });

  yield put<IPlansFormActions>({
    type: "@@plansForm/SET_LOADING",
    payload: false,
  });
}

export function* watchFetchStructureRequest() {
  yield takeLatest<IPlansFormActions>(
    "@@plansForm/FETCH_STRUCTURE",
    fetchStructure
  );
}

function* fetchParentSubscriptionId(action: IFetchParentSubscriptionId) {
  const body = {
    type: "CLIENT",
    identifier: action.payload,
    mappingType: "SUBSCRIPTION",
  };

  try {
    const {
      data: { mappingIdentifier },
    } = yield call(
      axios.post,
      apiMappings.saas.plans.getParentSubscriptionId,
      body
    );

    yield put({
      type: "@@plansForm/SET_PARENT_SUBSCRIPTION_ID",
      payload: mappingIdentifier,
    });
  } catch (error) {
    console.log(error);
  }
}

export function* watchFetchParentSubsciptionId() {
  yield takeLatest<IFetchParentSubscriptionId>(
    "@@plansForm/FETCH_PARENT_SUBSCRIPTION_ID",
    fetchParentSubscriptionId
  );
}

export function* plansFormSaga() {
  yield all([
    fork(watchFetchStructureRequest),
    fork(watchFetchParentSubsciptionId),
  ]);
}
