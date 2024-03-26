import { all, call, put, select, takeLatest } from "redux-saga/effects"
import apiMappings from "../../../utils/apiMapping"
import axios from "../../../utils/axios"
import { prepareFormStructure } from "../../../utils/components/Form/utils"
import { IMongoFormStructure } from "../../../utils/mongo/interfaces"
import { IAddOrderFormActions } from "./AddOrderForm.actions"
import { getGoogleAPIKey } from '../../../utils/components/Map/MapHelper';


function* fetchStructure() {
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_LOADING', payload: true })
    const userAccessInfo = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");
    const { data: payload } = yield call(axios.get, apiMappings.order.form.structure)

    const { data: profilePickupPayload } = yield call(axios.get, apiMappings.order.form.getCustomerProfilingPickup)

    const dynamicLables = yield select(state => state.orderForm.dynamicLabels)

    const shipmentsType =  {
        label: dynamicLables.order_s + ' ' + 'Type',
        fieldName: "Shipments Type",
        fieldType: "multicheckbox",
        permission: true,
        value: "",
        id: "shipmentsType",
        required: true,
        options:['{"label":"'+ dynamicLables.pickUpLeg +'","value":true,"disabled":false}','{"label":"'+ dynamicLables.deliveryLeg +'","value":true,"disabled":false}','{"label":"Point to Point","value":true,"disabled":false}'],
        childLength: 0,
        rowSpan: 0,
        colSpan: 0,
        labelKey: "Shipments Type",
        excelDropDownHidden: false,
        searchable: false,
        editable: true,
        sortable: false,
        infoFlag: false,
        customField: false,
        allowed: false
      }
    
    const returnShipment = {
        label: dynamicLables.returnOrder,
        fieldName: "Return Shipment",
        fieldType: "radio",
        permission: true,
        value: "",
        id: "returnShipment",
        required: false,
        options: ["Yes", "No"],
        childLength: 0,
        rowSpan: 0,
        colSpan: 0,
        labelKey: "Return Shipment",
        excelDropDownHidden: false,
        searchable: false,
        editable: true,
        sortable: false,
        infoFlag: false,
        customField: false,
        allowed: false
    }
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_CUSTOMER_PROFILING_PICKUP', payload: profilePickupPayload })

    const { data: profileDeliverPayload } = yield call(axios.get, apiMappings.order.form.getCustomerProfilingDeliver) 
   yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_CUSTOMER_PROFILING_DELIVER', payload: profileDeliverPayload })
  
    const transformedPayload: IMongoFormStructure = prepareFormStructure(payload)
    if(transformedPayload['order details']){
        if(transformedPayload['order details'].shippingCost)
            transformedPayload['order details'].shippingCost.decimalPlaces = 2
        if(transformedPayload['order details'].packageValue)
            transformedPayload['order details'].packageValue.decimalPlaces = 2
    }
    if (transformedPayload['pick up details'] && transformedPayload['pick up details']['pickupAddressNotes']) {
        transformedPayload['pick up details']['pickupAddressNotes'].permission = false;
    }
    if (transformedPayload['return address details'] && transformedPayload['return address details']['returnAddressNotes']) {
        transformedPayload['return address details']['returnAddressNotes'].permission = false;
    }
    if (transformedPayload['delivery details'] && transformedPayload['delivery details']['deliverAddressNotes']) {
        transformedPayload['delivery details']['deliverAddressNotes'].permission = false;
    }
    if (transformedPayload['general details']) {
        if (userAccessInfo['modelType'] === 'FM') {
            // 57619 hubname = return to branch name is being controlled from backend
            // transformedPayload['general details']['hubName'] ? transformedPayload['general details']['hubName'].permission = false: '';
            transformedPayload['customer details'].pickupNotes ? transformedPayload['customer details'].pickupNotes.permission = false : '';
            transformedPayload['customer details'].deliverNotes ? transformedPayload['customer details'].deliverNotes.permission = false : '';
            if (transformedPayload['pick up details'].pickupBranch) {
                transformedPayload['pick up details'].pickupBranch.permission = false;
            }
            if (transformedPayload['pick up details'].pickupServiceTime) {
                transformedPayload['pick up details'].pickupServiceTime.permission = false;
            }
        } else if (userAccessInfo['modelType'] === 'VM' || userAccessInfo['modelType'] === 'FMLM') {
            // transformedPayload['general details']['hubName'] ? transformedPayload['general details']['hubName'].permission = false: '';
            transformedPayload['general details']['distributionCenter'].permission = false;
            transformedPayload['customer details'].pickupNotes ? transformedPayload['customer details'].pickupNotes.permission = true : '';
            transformedPayload['customer details'].deliverNotes ? transformedPayload['customer details'].deliverNotes.permission = true : '';
            if (transformedPayload['pick up details'].pickupBranch) {
                transformedPayload['pick up details'].pickupBranch.permission = true;
            }
            if (transformedPayload['delivery details'].deliverBranch) {
                transformedPayload['delivery details'].deliverBranch.permission = true;
            }
            transformedPayload['general details'] = {shipmentsType, returnShipment, ...transformedPayload['general details']}
        } else if (userAccessInfo['modelType'] === 'SM') {
            // transformedPayload['general details']['hubName'] ? transformedPayload['general details']['hubName'].permission = false : '';
        } else if (userAccessInfo['modelType'] === 'LM') {
            transformedPayload['delivery details'].pickupNotes ? transformedPayload['delivery details'].pickupNotes.permission = false : '';
            transformedPayload['delivery details'].deliverNotes ? transformedPayload['delivery details'].deliverNotes.permission = true : '';
            if (transformedPayload['delivery details'].deliverBranch) {
                transformedPayload['delivery details'].deliverBranch.permission = false;
            }
            if (transformedPayload['delivery details'].deliverServiceTime) {
                transformedPayload['delivery details'].deliverServiceTime.permission = false;
            }
        }
    }
    if (profilePickupPayload.propertyValue === 'Y') {
        transformedPayload["pick up details"]['pickupAccountCode'] ? transformedPayload["pick up details"]['pickupAccountCode'].fieldType = 'autocomplete' : '';
        transformedPayload["pick up details"]['pickupAddressId'] ? transformedPayload["pick up details"]['pickupAddressId'].fieldType = 'autocomplete' : '';
        transformedPayload["return address details"]['returnAccountCode'] ? transformedPayload["return address details"]['returnAccountCode'].fieldType = 'autocomplete' : '';
        transformedPayload["return address details"]['returnAddressId'] ? transformedPayload["return address details"]['returnAddressId'].fieldType = 'autocomplete' : '';
    }

    if (profileDeliverPayload.propertyValue === 'Y') {
        transformedPayload["delivery details"]['deliverAccountCode'] ? transformedPayload["delivery details"]['deliverAccountCode'].fieldType = 'autocomplete' : '';
        transformedPayload["delivery details"]['deliverAddressId'] ? transformedPayload["delivery details"]['deliverAddressId'].fieldType = 'autocomplete' : '';
        transformedPayload["customer details"]['AccountCode'] ? transformedPayload["customer details"]['AccountCode'].fieldType = 'autocomplete' : '';
        transformedPayload["customer details"]['AddressId'] ? transformedPayload["customer details"]['AddressId'].fieldType = 'autocomplete' : '';
        transformedPayload["return address details"]['returnAccountCode'] ? transformedPayload["return address details"]['returnAccountCode'].fieldType = 'autocomplete' : '';
        transformedPayload["return address details"]['returnAddressId'] ? transformedPayload["return address details"]['returnAddressId'].fieldType = 'autocomplete' : '';
    }

    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_STRUCTURE', payload: transformedPayload })
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_LOADING', payload: false })
}

export function* watchFetchStructureRequest() {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/FETCH_STRUCTURE', fetchStructure)
}

function* fetchLocale() {
    const { data: payload } = yield call(axios.get, apiMappings.common.lookup.getLocale, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_LOCALE', payload: payload })
}

export function* watchFetchLocaleRequest() {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/FETCH_LOCALE', fetchLocale)
}

function* fetchGoogleApiKey() {
    const googleApiKey = getGoogleAPIKey();
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/GOOGLE_API_KEY_SUCCESS', payload: googleApiKey });
}

export function* watchFetchInitialDataRequest() {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/GOOGLE_API_KEY', fetchGoogleApiKey)
}

function* fetchOptimizePackingValue() {
    const { data: {data : payload} } = yield call(axios.get, apiMappings.order.form.getOptimizeFl)  
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_OPTIMIZE_FLAG', payload: payload })
}

export function* watchFetchOptimizePackingValue() {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/FETCH_OPTIMIZE_FLAG', fetchOptimizePackingValue)
}

function* fetchCrateTypeValue() {
    const { data: payload } = yield call(axios.get, apiMappings.order.form.getCrateType)  
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_CRATE_TYPE', payload: payload })
    const crateType = payload?.propertyValue === 'CRATEITEM' ? 'a' : 'b'
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_CRATE_PATTERN', payload: crateType})
}

export function* watchFetchCrateTypeValue() {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/FETCH_CRATE_TYPE', fetchCrateTypeValue)
}

function* fetchCustomerProfilingPickup() {
    const { data: payload } = yield call(axios.get, apiMappings.order.form.getCustomerProfilingPickup)  
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_CUSTOMER_PROFILING_PICKUP', payload: payload })
}

export function* watchFetchCustomerProfilingPickup () {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/FETCH_CUSTOMER_PROFILING_PICKUP', fetchCustomerProfilingPickup)
}

function* fetchCustomerProfilingDeliver() {
    const { data: payload } = yield call(axios.get, apiMappings.order.form.getCustomerProfilingDeliver)  
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_CUSTOMER_PROFILING_DELIVER', payload: payload })
}

export function* watchFetchCustomerProfilingDeliver () {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/FETCH_CUSTOMER_PROFILING_DELIVER', fetchCustomerProfilingDeliver)
}

function* fetchOrderNumber() {
    const { data: {data : payload} } = yield call(axios.get, apiMappings.order.form.getOrderNumber)  
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/FETCH_ORDER_NUMBER_SUCCESS', payload: payload })
}

export function* watchFetchOrderNumber() {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/FETCH_ORDER_NUMBER', fetchOrderNumber)
}
function* fetchClientMetrics() {
    const { data, status} = yield call<any>(axios.get, apiMappings.common.clientMetric);
    if(status === 200) {
      yield put({ type: '@@addOrderForm/SET_CLIENT_METRIC_SYSTEM', payload: data.data});        
    }
}
export function* watchFetchClientMetrics() {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/GET_CLIENT_METRIC_SYSTEM', fetchClientMetrics)
    
}
function* fetchSubClients() {
    const { data: payload } = yield call(axios.get, apiMappings.common.lookup.getSubClients, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_SUBCLIENTS', payload: payload })
}

export function* watchFetchSubClientsRequest() {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/FETCH_SUBCLIENTS', fetchSubClients)
}

function* fetchTimeZoneList() {
    const { data: payload } = yield call(axios.get, apiMappings.common.lookup.getTimezoneList, { data: {}, headers: {'Content-Type': 'application/json'}})
    yield put<IAddOrderFormActions>({ type: '@@addOrderForm/SET_TIMEZONELIST', payload: payload })
}

export function* watchFetchTimeZoneListRequest() {
    yield takeLatest<IAddOrderFormActions>('@@addOrderForm/FETCH_TIMEZONELIST', fetchTimeZoneList)
}

export function* addOrderFormSaga() {
    yield all([
        watchFetchStructureRequest(),
        watchFetchLocaleRequest(),
        watchFetchInitialDataRequest(),
        watchFetchOptimizePackingValue(),
        watchFetchCrateTypeValue(),
        watchFetchCustomerProfilingPickup(),
        watchFetchCustomerProfilingDeliver(),
        watchFetchOrderNumber(),
        watchFetchClientMetrics(),
        watchFetchSubClientsRequest(),
        watchFetchTimeZoneListRequest()
    ])
}