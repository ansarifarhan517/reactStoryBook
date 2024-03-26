import { AxiosResponse } from 'axios';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ILogiAPIResponse } from '../../../utils/api.interfaces';
import apiMappings from '../../../utils/apiMapping';
import axios, { userAccessInfo } from '../../../utils/axios';
import { IMongoDynamicHTMLTemplate } from '../../../utils/common.interface';
import store from '../../../utils/redux/store';
import { OrderListViewActions } from '../OrderListView/OrderListView.actions';
import { IFetchPrintAWBOrderDetails } from './PrintAWB.actions';
import { IOrderPrintAWBTemplateData, IPrintAWBOrderDetails } from './PrintAWB.models';
import moment from 'moment-timezone'
import { extractDynamicLabelsFromHTML, replaceDynamicLabelWithLabel } from '../../OrderMiddleMile/PrintAwb/PrintAwb.constants';
import { IDynamicLabelsAction } from '../../common/DynamicLabels/dynamicLabels.actions';

const returnFieldMappings = {
  address: 'returnAddress',
  apartment: 'returnApartment',
  city: 'returnCity',
  clientNodeCd: 'returnClientNodeCd',
  clientNodeId: 'returnClientNodeId',
  clientNodePhone: 'returnClientNodePhone',
  country: 'returnCountry',
  emailAddress: 'returnEmailAddress',
  isActiveFl: 'returnIsActiveFl',
  landmark: 'returnLandmark',
  lat: 'returnLat',
  lng: 'returnLng',
  locality: 'returnLocality',
  name: 'returnName',
  pincode: 'returnPincode',
  state: 'returnState',
  streetName: 'returnStreetName'
}

const pickupFieldMappings = {
  address: 'pickupAddress',
  apartment: 'pickupApartment',
  city: 'pickupCity',
  clientNodeCd: 'pickupClientNodeCd',
  clientNodeId: 'pickupClientNodeId',
  clientNodePhone: 'pickupClientNodePhone',
  country: 'pickupCountry',
  emailAddress: 'pickupEmailAddress',
  isActiveFl: 'pickupIsActiveFl',
  landmark: 'pickupLandmark',
  lat: 'pickupLat',
  lng: 'pickupLng',
  locality: 'pickupLocality',
  name: 'pickupName',
  pincode: 'pickupPincode',
  state: 'pickupState',
  streetName: 'pickupStreetName'
}

const deliverFieldMappings = {
  address: 'deliverAddress',
  apartment: 'deliverApartment',
  city: 'deliverCity',
  clientNodeCd: 'deliverClientNodeCd',
  clientNodeId: 'deliverClientNodeId',
  clientNodePhone: 'deliverClientNodePhone',
  country: 'deliverCountry',
  emailAddress: 'deliverEmailAddress',
  isActiveFl: 'deliverIsActiveFl',
  landmark: 'deliverLandmark',
  lat: 'deliverLat',
  lng: 'deliverLng',
  locality: 'deliverLocality',
  name: 'deliverName',
  pincode: 'deliverPincode',
  state: 'deliverState',
  streetName: 'deliverStreetName'
}

function* fetchAWBHTMLTemplates() {
  try {
    yield put<OrderListViewActions>({ type: '@@orderListView/FETCH_AWB_HTML_TEMPLATES_SUCCESS', payload: [] })
    let { data: { data } }: AxiosResponse<ILogiAPIResponse<IMongoDynamicHTMLTemplate<IOrderPrintAWBTemplateData>[]>>
      = yield call(axios.get, apiMappings.order.listView.getHTMLTemplates)

    /** Replace Dynamic Labels with actual data */
    const dynamicLabels = store.getState().dynamicLabels
    let dynamicLabelsToBeFetched: string[] = []
    data.forEach((template) => {
      const { orderHTML, crateHTML, itemHTML } = template.htmlData

      if (orderHTML) {
        const labelSet = extractDynamicLabelsFromHTML(orderHTML)
        if (labelSet.size > 0) {
          dynamicLabelsToBeFetched = [...dynamicLabelsToBeFetched, ...Array.from(labelSet).filter(label => !dynamicLabels[label])]
        }
      }
      if (crateHTML) {
        const labelSet = extractDynamicLabelsFromHTML(crateHTML)
        if (labelSet.size > 0) {
          dynamicLabelsToBeFetched = [...dynamicLabelsToBeFetched, ...Array.from(labelSet).filter(label => !dynamicLabels[label])]
        }
      }
      if (itemHTML) {
        const labelSet = extractDynamicLabelsFromHTML(itemHTML)
        if (labelSet.size > 0) {
          dynamicLabelsToBeFetched = [...dynamicLabelsToBeFetched, ...Array.from(labelSet).filter(label => !dynamicLabels[label])]
        }
      }
    })

    let templateDynamicLabels = { ...dynamicLabels }
    let dataSet = {}

    if (dynamicLabelsToBeFetched.length > 0) {
      const { data }: AxiosResponse<Record<string, string>> = yield call(axios.get, apiMappings.common.dynamicLabels, { params: { labels: dynamicLabelsToBeFetched.join(',') } })
      dataSet = data
      templateDynamicLabels = { ...templateDynamicLabels, ...dataSet }
    }

    data = data.map((template) => {
      const returnTemplate = { ...template }
      const { orderHTML, crateHTML, itemHTML } = template.htmlData

      if (orderHTML) {
        const labelSet = extractDynamicLabelsFromHTML(orderHTML)
        if (labelSet.size > 0) {
          Array.from(labelSet).forEach((label) => {
            returnTemplate.htmlData.orderHTML = replaceDynamicLabelWithLabel(returnTemplate.htmlData.orderHTML, label, templateDynamicLabels[label] || '')
          })
        }
      }
      if (crateHTML) {
        const labelSet = extractDynamicLabelsFromHTML(crateHTML)
        if (labelSet.size > 0) {
          Array.from(labelSet).forEach((label) => {
            returnTemplate.htmlData.crateHTML = replaceDynamicLabelWithLabel(returnTemplate.htmlData.crateHTML, label, templateDynamicLabels[label] || '')
          })
        }
      }
      if (itemHTML) {
        const labelSet = extractDynamicLabelsFromHTML(itemHTML)
        if (labelSet.size > 0) {
          Array.from(labelSet).forEach((label) => {
            returnTemplate.htmlData.itemHTML = replaceDynamicLabelWithLabel(returnTemplate.htmlData.itemHTML, label, templateDynamicLabels[label] || '')
          })
        }
      }

      return returnTemplate
    })

    yield put<OrderListViewActions>({ type: '@@orderListView/FETCH_AWB_HTML_TEMPLATES_SUCCESS', payload: data })
    yield put<IDynamicLabelsAction>({ type: '@@dynamicLabels/FETCH_DATA_SUCCESS', payload: dataSet })
  } catch (error) {
    console.log('Failed to fetch Print AWB HTML Templates: ', error, error?.response)
  }
}

export function* watchFetchAWBHTMLTemplates() {
  yield takeLatest('@@orderListView/FETCH_AWB_HTML_TEMPLATES', fetchAWBHTMLTemplates)
}

function* fetchAWBOrderDetails(action: IFetchPrintAWBOrderDetails) {
  try {
    const clientProperties = store.getState().clientProperties

    const dateFormat = clientProperties?.DATEFORMAT?.propertyValue.toUpperCase() || 'YYYY-MM-DD'
    const dateTimeFormat = `${dateFormat} hh:mm A`
    const timezone = clientProperties?.TIMEZONE?.propertyValue || 'GMT'

    const getDateTimeFromUtc = (d: number) => moment.utc(d).tz(timezone).format(dateTimeFormat)
    const getDateFromUtc = (d: number) => moment.utc(d).tz(timezone).format(dateFormat)
    const orderDetails = yield select(state => state.order.listView.data.results)
    const orderDetailsMap = orderDetails.reduce((acc: any, curr: any) => ({ ...acc, [curr.shipmentId]: curr }), {})

    const { data: { data } }: AxiosResponse<ILogiAPIResponse<IPrintAWBOrderDetails[]>> =
      yield call(axios.get, apiMappings.order.listView.getAWBOrderDetails, { params: { shipmentIds: action.payload.join(',') } })

    /** Data Transformations */
    data.forEach((order) => {


      /** Extract clinetNodeDTOs to fields in order as per the mapping declared. */
      order.clientNodeDTOs.forEach((nodeDetails) => {
        const fieldMapping = nodeDetails.clientNodeType === 'return' ? returnFieldMappings : nodeDetails.clientNodeType === 'from' ? pickupFieldMappings : deliverFieldMappings

        Object.keys(nodeDetails).forEach((nodeFieldKey) => {
          // delete nodeDetails[nodeFieldKey]?.address;
          // delete nodeDetails[nodeFieldKey]?.streetName;
          if (nodeDetails[nodeFieldKey] && typeof nodeDetails[nodeFieldKey] == "string" && nodeDetails[nodeFieldKey].includes("'")) {
            nodeDetails[nodeFieldKey] = nodeDetails[nodeFieldKey].replaceAll(/[\/\(\)\']/g, "′");
          }
          if (fieldMapping[nodeFieldKey]) {
            order[fieldMapping[nodeFieldKey]] = nodeDetails[nodeFieldKey]
          }
        })
      })

      if (order.customFieldList?.length) {
        order.customFieldListString = JSON.stringify(order.customFieldList).replaceAll(/[\/\(\)\']/g, "′");
      } else {
        order.customFieldListString = '[]'
      }
      if (order?.crates) {
        order.crates.map((crate) => {
          if (!crate?.crateType) {
            crate['crateType'] = ''
          }
        })
      } else {
        order['crates'] = []
      }
      order.cratesJSONString = JSON.stringify(order.crates || '[]')

      /** Convert DateTime to Client specific format */
      order.startTimeWindow = order.startTimeWindow && getDateFromUtc(order.startTimeWindow as number)
      order.deliverStartTimeWindow = order.deliverStartTimeWindow && getDateTimeFromUtc(order.deliverStartTimeWindow as number)

      order.customerName = orderDetailsMap[order.shipmentId]?.customerName || ''
      order.tripNo = orderDetailsMap[order.shipmentId]?.tripNo || ''
      order.deliveryOrder = orderDetailsMap[order.shipmentId]?.deliveryOrder || ''

      if (order.crates) {
        order.crates = order.crates?.map((crate) => ({
          ...crate,
          createdOnDt: crate.createdOnDt && getDateTimeFromUtc(crate.createdOnDt as number),
          shipmentlineitems: crate.shipmentlineitems.map((item) => ({
            ...item,
            createdOnDt: item.createdOnDt && getDateTimeFromUtc(item.createdOnDt as number),
            updatedOnDt: item.updatedOnDt && getDateTimeFromUtc(item.updatedOnDt as number),
          }))
        }))
      }

     if(order.customFieldList){ 
      order.customFieldList = order.customFieldList?.map((customFieldsLists) => ({
        ...customFieldsLists,
        value : customFieldsLists.type === 'datetime' ? getDateTimeFromUtc(customFieldsLists?.value as number) : customFieldsLists.value 
        }))
      }
      /** Add Client Logo */
      order.clientLogo = userAccessInfo.clientLogo
    })

    yield put<OrderListViewActions>({ type: '@@orderListView/FETCH_AWB_ORDER_DETAILS_SUCCESS', payload: data })
  } catch (error) {
    console.log('Failed to fetch Print AWB Order Deails: ', error, error?.response)
  }
}

export function* watchFetchAWBOrderDetails() {
  yield takeEvery('@@orderListView/FETCH_AWB_ORDER_DETAILS', fetchAWBOrderDetails)
}