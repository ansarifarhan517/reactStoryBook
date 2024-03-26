import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { IFetchSelectedOrderDetails, tMMOPrintAwbAction } from './PrintAwb.actions';
import { IMiddleMileOrderDetails, IPrintAwbTemplateResponse } from './PrintAwb.models';
import moment from 'moment-timezone'
import store from '../../../utils/redux/store';
import { AxiosResponse } from 'axios';
import { ILogiAPIResponse } from '../../../utils/api.interfaces';
import apiMappings from '../../../utils/apiMapping';
import axios, { userAccessInfo } from '../../../utils/axios';

const middlemileOrdeFieldMapping = {
  shipmentOrderTypeCd : 'orderTypeCd',
  noOfCrates: 'numberOfItems',
  pickupName: 'pickupClientNodeName',
  deliverName : 'deliverClientNodeName',
  pickupLat: 'pickupLatitude',
  deliverLat: 'deliverLatitude',
  pickupAddress: 'pickupAddr',
  deliverAddress: 'deliverAddr',
  returnName: 'returnClientNodeName',
  returnLat: 'returnLatitude'
}

function* watchFetchSelectedOrderDetails() {
  function transformPayload(orders: Partial<IMiddleMileOrderDetails>[]): Partial<IMiddleMileOrderDetails>[] {
    const clientProperties = store.getState().clientProperties

    const dateFormat = clientProperties?.DATEFORMAT?.propertyValue.toUpperCase() || 'YYYY-MM-DD'
    const dateTimeFormat = `${dateFormat} hh:mm A`
    const timezone = clientProperties?.TIMEZONE?.propertyValue || 'GMT'

    const getDateTimeFromUtc = (d: number) => moment.utc(d).tz(timezone).format(dateTimeFormat)
    const getDateFromUtc = (d: number) => moment.utc(d).tz(timezone).format(dateFormat)
    return orders.map((order) => {
      return {
        ...order,
        eta: order.eta && getDateTimeFromUtc(order.eta as number),
        lastTrackingDate: order.lastTrackingDate && getDateTimeFromUtc(order.lastTrackingDate as number),
        orderDispatchDate: order.orderDispatchDate && getDateTimeFromUtc(order.orderDispatchDate as number),
        startTimeWindow: order.startTimeWindow && getDateFromUtc(order.startTimeWindow as number),
        endTimeWindow: order.endTimeWindow && getDateTimeFromUtc(order.endTimeWindow as number),
        customFieldsList: order.customFieldsList && order.customFieldsList?.map((customFieldsLists) => ({
          ...customFieldsLists,
          value : customFieldsLists.type === 'datetime' ? getDateTimeFromUtc(customFieldsLists?.value as number) : customFieldsLists.value 
          })),
        crates: order.crates && order.crates?.map((crate) => ({
          ...crate,
          createdOnDt: crate.createdOnDt && getDateTimeFromUtc(crate.createdOnDt as number),
          shipmentlineitems: crate.shipmentlineitems.map((item) => ({
            ...item,
            createdOnDt: item.createdOnDt && getDateTimeFromUtc(item.createdOnDt as number),
            updatedOnDt: item.updatedOnDt && getDateTimeFromUtc(item.updatedOnDt as number),
          }))
        })),
        shipmentOrderTypeCd: order.shipmentOrderTypeCd ? order.shipmentOrderTypeCd : order[middlemileOrdeFieldMapping.shipmentOrderTypeCd],
        noOfCrates: order.noOfCrates ? order.noOfCrates : order[middlemileOrdeFieldMapping.noOfCrates],
        pickupName: order.pickupName ? order.pickupName : order[middlemileOrdeFieldMapping.pickupName],
        deliverName: order.deliverName ? order.deliverName : order[middlemileOrdeFieldMapping.deliverName],
        pickupLat: order.pickupLat ? order.pickupLat : order[middlemileOrdeFieldMapping.pickupLat],
        deliverLat: order.deliverLat ? order.deliverLat : order[middlemileOrdeFieldMapping.deliverLat],
        pickupAddress: order.pickupAddress ? order.pickupAddress : order[middlemileOrdeFieldMapping.pickupAddress],
        deliverAddress: order.deliverAddress ? order.deliverAddress : order[middlemileOrdeFieldMapping.deliverAddress],
        returnName: order.returnName ? order.returnName : order[middlemileOrdeFieldMapping.returnName],
        returnLat: order.returnLat ? order.returnLat : order[middlemileOrdeFieldMapping.returnLat],
        customFieldListString: order.customFieldsList?.length ? JSON.stringify(order.customFieldsList).replaceAll(/[\/\(\)\']/g, "′") : '[]',
        clientLogo: userAccessInfo.clientLogo,
        cratesJSONString: JSON.stringify(order.crates || '[]')
      }
    })
  }

  function* fetchSelectedOrderDetails(action: IFetchSelectedOrderDetails) {
    yield put<tMMOPrintAwbAction>({ type: '@@MMO/PrintAwb/SET_LOADING', payload: { key: 'orderDetails', value: true } })

    // const payload: Partial<IMiddleMileOrderDetails>[] = []
    // action.payload.forEach((orderId) => {
    //   payload.push({ ...mock_orderDetails, orderId })
    // })

    try {
      const { data: { data: payload } }: AxiosResponse<ILogiAPIResponse<IMiddleMileOrderDetails[]>>
        = yield call(axios.get, apiMappings.middleMileOrder.listView.printAwb.getOrderDetails, { params: { orderIds: action.payload.join(',') } })

      const transformedPayload = transformPayload(payload)
      yield put<tMMOPrintAwbAction>({ type: '@@MMO/PrintAwb/SET_SELECTED_ORDERS_DETAILS', payload: transformedPayload })

    } catch (errorResponse) {
      console.log('Failed to fetch AWB Order Details: ', errorResponse, errorResponse?.response)
    } finally {
      yield put<tMMOPrintAwbAction>({ type: '@@MMO/PrintAwb/SET_LOADING', payload: { key: 'orderDetails', value: false } })
    }

  }

  yield takeEvery<IFetchSelectedOrderDetails>('@@MMO/PrintAwb/FETCH_SELECTED_ORDERS_DETAILS', fetchSelectedOrderDetails)
}

function* watchFetchTemplateOptions() {
  function* fetchTemplateOptions() {

    try {
      const { data: { data: payload } }: AxiosResponse<ILogiAPIResponse<IPrintAwbTemplateResponse[]>> = yield call<any>(axios.get, apiMappings.order.listView.getHTMLTemplates)
      yield put<tMMOPrintAwbAction>({ type: '@@MMO/PrintAwb/SET_TEMPLATE_OPTIONS', payload })
    } catch (errorResponse) {
      console.log('Failed to fetch AWB Templates: ', errorResponse, errorResponse?.response)
    }

  }

  yield takeLatest('@@MMO/PrintAwb/FETCH_TEMPLATE_OPTIONS', fetchTemplateOptions)
}

export function* MMOPrintAwbSaga() {
  yield all([watchFetchTemplateOptions(), watchFetchSelectedOrderDetails()])
}