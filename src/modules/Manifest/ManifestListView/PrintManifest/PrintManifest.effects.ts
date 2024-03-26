import { AxiosResponse } from "axios"
import moment from "moment"
import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects"
import { ILogiAPIResponse } from "../../../../utils/api.interfaces"
import apiMappings from "../../../../utils/apiMapping"
import axios, { userAccessInfo } from "../../../../utils/axios"
import store from "../../../../utils/redux/store"
import { IDynamicLabelsAction } from "../../../common/DynamicLabels/dynamicLabels.actions"
import { extractDynamicLabelsFromHTML, replaceDynamicLabelWithLabel } from "../../../OrderMiddleMile/PrintAwb/PrintAwb.constants"
import { ManifestListActions } from "../ManifestList.actions"
import { IFetchPrintManifestOrderDetails } from "./PrintManifest.actions"

function* fetchManifestHTMLTemplates() {
    try {
      yield put<ManifestListActions>({ type: '@@manifestList/FETCH_MANIFEST_HTML_TEMPLATES_SUCCESS', payload: [] })
      let { data: { data } }
        = yield call(axios.get, apiMappings.manifest.listView.getManifestHTMLTemplates)
        data = data?.map((template: any) => {
        const returnTemplate = { ...template }
        const { orderHTML, ordersHTML, manifestsHTML } = template.htmlData
  
        if (orderHTML) {
          const labelSet = extractDynamicLabelsFromHTML(orderHTML)
          if (labelSet.size > 0) {
            Array.from(labelSet).forEach((label) => {
              returnTemplate.htmlData.orderHTML = replaceDynamicLabelWithLabel(returnTemplate.htmlData.orderHTML, label, templateDynamicLabels[label] || '')
            })
          }
        }
        if (ordersHTML) {
          const labelSet = extractDynamicLabelsFromHTML(ordersHTML)
          if (labelSet.size > 0) {
            Array.from(labelSet).forEach((label) => {
              returnTemplate.htmlData.ordersHTML = replaceDynamicLabelWithLabel(returnTemplate.htmlData.ordersHTML, label, templateDynamicLabels[label] || '')
            })
          }
        }
        if (manifestsHTML) {
          const labelSet = extractDynamicLabelsFromHTML(manifestsHTML)
          if (labelSet.size > 0) {
            Array.from(labelSet).forEach((label) => {
              returnTemplate.htmlData.manifestsHTML = replaceDynamicLabelWithLabel(returnTemplate.htmlData.manifestsHTML, label, templateDynamicLabels[label] || '')
            })
          }
        }
  
        return returnTemplate
      })
      yield put<ManifestListActions>({ type: '@@manifestList/FETCH_MANIFEST_HTML_TEMPLATES_SUCCESS', payload: data })
  
  
      /** Replace Dynamic Labels with actual data */
      const dynamicLabels = store.getState().dynamicLabels
      let dynamicLabelsToBeFetched: unknown[] = []
      data.forEach((template: { htmlData: { orderHTML: any; ordersHTML: any; manifestsHTML: any; }; }) => {
        const { orderHTML, ordersHTML, manifestsHTML } = template.htmlData
  
        if (orderHTML) {
          const labelSet = extractDynamicLabelsFromHTML(orderHTML)
          if (labelSet.size > 0) {
            dynamicLabelsToBeFetched = [...dynamicLabelsToBeFetched, ...Array.from(labelSet).filter(label => !dynamicLabels[label])]
          }
        }
        if (ordersHTML) {
          const labelSet = extractDynamicLabelsFromHTML(ordersHTML)
          if (labelSet.size > 0) {
            dynamicLabelsToBeFetched = [...dynamicLabelsToBeFetched, ...Array.from(labelSet).filter(label => !dynamicLabels[label])]
          }
        }
        if (manifestsHTML) {
          const labelSet = extractDynamicLabelsFromHTML(manifestsHTML)
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
      console.log('Failed to fetch Print Manifest HTML Templates ', error, error?.response)
    }
}

function* fetchManifestOrderDetails(action: IFetchPrintManifestOrderDetails) {
    try {
  
      const manifestDetails = yield select(state => state.manifest.currentSelectedIds) 
      const clientProperties = store.getState().clientProperties
      const timezoneMode = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezoneMode']) : '';
  
      const { data: { data } }: AxiosResponse<ILogiAPIResponse<any>> =
        yield call(axios.post, apiMappings.manifest.listView.getManifestOrderDetails,{manifestId : manifestDetails, printManifest : true})
      let finalData = data?.results?.map((manifest:any) => {
          return {
            ...manifest,
            manifestId: manifest.manifestId,
            dateAndTimeOfPrintingManifest: (timezoneMode == "MYTIMEZONE") ? moment(new Date()).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(new Date()).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z"),
            originBranchCode: manifest.originBranchCd,
            nextBranchCode: manifest.destBranchCd,
            manifestBranch: manifest.branchName,
            manifestOutscanDate: (timezoneMode == "MYTIMEZONE") ? moment(manifest.manifestCreationDate).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(manifest.manifestCreationDate).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z"),
            totalManifestCrates: manifest.totalCrates,
            totalManifestOrders: manifest.totalOrders,
            manifestServiceType: manifest.serviceTypeCd,
            manifestType: manifest.manifestType,
            clientLogo: userAccessInfo.clientLogo
          }
      })
  
      yield put<ManifestListActions>({ type: '@@manifestList/FETCH_MANIFEST_ORDER_DETAILS_SUCCESS', payload: finalData })
    } catch (error) {
      console.log('Failed to fetch Print Manifest Order Deails: ', error, error?.response)
    }
  }
  
export function* watchFetchMAnifestOrderDetailsAndManifestHTMLTemplates() {
    yield takeLatest('@@manifestList/FETCH_MANIFEST_HTML_TEMPLATES', fetchManifestHTMLTemplates)
    yield takeEvery('@@manifestList/FETCH_MANIFEST_ORDER_DETAILS', fetchManifestOrderDetails)
}