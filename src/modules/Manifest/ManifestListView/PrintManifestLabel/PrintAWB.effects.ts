import { AxiosResponse } from 'axios';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ILogiAPIResponse } from '../../../../utils/api.interfaces';
import apiMappings from '../../../../utils/apiMapping';
import axios, { userAccessInfo } from '../../../../utils/axios';
import store from '../../../../utils/redux/store';
import { ManifestListActions } from '../ManifestList.actions';
import { IFetchPrintAWBOrderDetails } from './PrintAWB.actions';

import { extractDynamicLabelsFromHTML, 
  replaceDynamicLabelWithLabel 
} from '../../../OrderMiddleMile/PrintAwb/PrintAwb.constants';
import { IDynamicLabelsAction } from '../../../common/DynamicLabels/dynamicLabels.actions';
import moment from 'moment';


function* fetchAWBHTMLTemplates() {
  try {
    yield put<ManifestListActions>({ type: '@@manifestList/FETCH_AWB_HTML_TEMPLATES_SUCCESS', payload: [] })
    let { data: { data } }
      = yield call(axios.get, apiMappings.manifest.listView.getHTMLTemplates)
   

    data = data?.map((template: any) => {
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
    
    yield put<ManifestListActions>({ type: '@@manifestList/FETCH_AWB_HTML_TEMPLATES_SUCCESS', payload: data })


    /** Replace Dynamic Labels with actual data */
    const dynamicLabels = store.getState().dynamicLabels
    let dynamicLabelsToBeFetched: unknown[] = []
    data.forEach((template: { htmlData: { orderHTML: any; crateHTML: any; itemHTML: any; }; }) => {
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
   
   
    yield put<IDynamicLabelsAction>({ type: '@@dynamicLabels/FETCH_DATA_SUCCESS', payload: dataSet })
  } catch (error) {
    console.log('Failed to fetch Print AWB HTML Templates: ', error, error?.response)
  }
}



function* fetchAWBOrderDetails(action: IFetchPrintAWBOrderDetails) {
  try {

    const manifestDetails = yield select(state => state.manifest.currentSelectedIds)


    const { data: { data } }: AxiosResponse<ILogiAPIResponse<any>> =
      yield call(axios.post, apiMappings.manifest.listView.getManifestOrderDetails,{manifestId : manifestDetails})

    let finalData = data?.results?.map((manifest:any) => {
        return {
          ...manifest,
          manifestId: manifest.manifestId || 'Not Available',
          dateAndTimeOfPrintingManifest: moment(new Date()).format('MM/DD/YYYY h:mm:ss a'),
          originBranchCode: manifest.originBranchCd || 'Not Available',
          nextBranchCode: manifest.destBranchCd || 'Not Available',
          date: manifest.manifestCreationDate || 'Not Available',
          weight: manifest.totalWeight || 'Not Available',
          volume: manifest.totalVolume || 'Not Available',
          crates: manifest.totalCrates || 'Not Available',
          orders: manifest.totalOrders || 'Not Available',
          serviceType: manifest.serviceTypeCd || 'Not Available',
          manifestType: manifest.manifestCategory || 'Not Available',
          clientLogo: userAccessInfo.clientLogo
 
         
        }
    })

    yield put<ManifestListActions>({ type: '@@manifestList/FETCH_AWB_ORDER_DETAILS_SUCCESS', payload: finalData })
  } catch (error) {
    console.log('Failed to fetch Print AWB Order Deails: ', error, error?.response)
  }
}

export function* watchFetchAWBOrderDetailsAndAWBHTMLTemplates() {
  yield takeEvery('@@manifestList/FETCH_AWB_ORDER_DETAILS', fetchAWBOrderDetails)
  yield takeLatest('@@manifestList/FETCH_AWB_HTML_TEMPLATES', fetchAWBHTMLTemplates)
}