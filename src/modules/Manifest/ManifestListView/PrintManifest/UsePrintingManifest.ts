import moment from "moment"
import { useCallback } from "react"
import { IMongoDynamicHTMLTemplate } from "../../../../utils/common.interface"
import { useTypedSelector } from "../../../../utils/redux/rootReducer"
import store from "../../../../utils/redux/store"
import useMetricsConversion from "../../../common/ClientProperties/useMetricsConversion"
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping"
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels"
import { baseTemplate, extractFieldsFromHTML, replaceFieldWithData } from "../../../OrderMiddleMile/PrintAwb/PrintAwb.constants"
import { IOrderPrintManifestTemplateData } from "./PrintManifest.models"

const usePrintingManifest = () => {
  const selectedOrderDetails = useTypedSelector(state => state.manifest.printManifest.orderDetails)
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0]);
  const NALabel = dynamicLabels?.notAvailable ? dynamicLabels?.notAvailable: "Not Available";
  const {convertMetricsForDisplay} = useMetricsConversion();
  const clientProperties = store.getState().clientProperties
  const timezoneMode = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezoneMode']) : '';
  

  const handlePrinting = useCallback((template: IMongoDynamicHTMLTemplate<IOrderPrintManifestTemplateData>) => {
    if (!template) {
      return
    }

    let mywindow = window.open('', '_blank');

    let combinedOrderPrintContent = ''
    const { orderHTML:mainHTML, ordersHTML, manifestsHTML } = template.htmlData
    /** Extract Dynamic Fields from orderHTML template */
    const orderTemplateFields = extractFieldsFromHTML(mainHTML)
    const ordersTemplateFields = extractFieldsFromHTML(ordersHTML)
    const manifestsTemplateFields = extractFieldsFromHTML(manifestsHTML)
    selectedOrderDetails?.forEach((orderObj) => {
      
      const orderDetail = { 
        ...orderObj, 
        totalManifestWeight: convertMetricsForDisplay(orderObj.totalWeight ? parseFloat(orderObj.totalWeight) : 0, 'weight') || 'Not Available',
        totalManifestVolume: convertMetricsForDisplay(orderObj.totalVolume ? parseFloat(orderObj.totalVolume) : 0, 'volume') || 'Not Available',
      }

      /** Insert Page Break after template for every orderId */
      let printContent = `${mainHTML}`
      /** Replace Order Fields with relevant data */
      orderTemplateFields.forEach((field) => {
        printContent = replaceFieldWithData(printContent, field, orderDetail[field] || NALabel)
      })

      /** Find if <Orders /> exist & replace it with Orders Templates (x) times - x: Number of Orders for the manifest */

       if (printContent.includes('<Orders />') && orderDetail.shipmentsLst?.length) {
        let ordersContent = ''

        orderDetail.shipmentsLst && orderDetail.shipmentsLst.forEach((manifestOrderObj: any) => {
          ordersContent += ordersHTML
          const customFields: Record<string, string> = {}
          manifestOrderObj.customFields?.forEach(({field, value, type}) => {
            if (type === 'datetime') {
              customFields[field] = (timezoneMode == "MYTIMEZONE") ? moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z") || '';
            } else if (type === 'time') {
              customFields[field] = (timezoneMode == "MYTIMEZONE") ? moment(value).format("h:mm A") : moment(value).format("h:mm A z") || '';
            } else if (type === 'date') {
              customFields[field] = (timezoneMode == "MYTIMEZONE") ? moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()) : moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()) || '';
            } else {
              customFields[field] = value || ''
            }
          })
          const ordersDetail = { 
            ...orderDetail,
            ...manifestOrderObj,
            ...customFields,
            OrderNo: manifestOrderObj.orderNo,
            awbNumber: manifestOrderObj.awbNo,
            deliverAddress: manifestOrderObj.destinationAddress,
            deliverName: manifestOrderObj.receiverName,
            subClientName: manifestOrderObj.shipperName,
            pickupAddress: manifestOrderObj.originAddress,
            deliverClientNodePhone: manifestOrderObj.deliverContact,
            skillSet: manifestOrderObj.deliveryType,
            pickupClientNodePhone: manifestOrderObj.pickupContact,
            orderStatus: manifestOrderObj.packageStatusCd,
            packageWeight: convertMetricsForDisplay(manifestOrderObj.packageWeight ? parseFloat(manifestOrderObj.packageWeight) : 0, 'weight') || 'Not Available',
            packageVolume: convertMetricsForDisplay(manifestOrderObj.packageVolume ? parseFloat(manifestOrderObj.packageVolume) : 0, 'volume') || 'Not Available',
          }

          ordersTemplateFields.forEach((field : any) => {
            let data = NALabel;
            const isCustomField = field.startsWith('cf_');
            if(isCustomField){ 
              let dataKeyName = field.split('#$@$')[0];
              data = ordersDetail?.[dataKeyName] ? ordersDetail?.[dataKeyName] : NALabel 
            }
            ordersContent = replaceFieldWithData(ordersContent, field, ordersDetail[field] || data)
          })
        })

        printContent = printContent.replace(/<Orders \/>/g, ordersContent)
      } 
       if (printContent.includes('<Manifests />') && orderDetail.childManifests?.length) {
        let manifestsContent = ''

        orderDetail.childManifests && orderDetail.childManifests.forEach((childManifestObj: any) => {
          manifestsContent += manifestsHTML
          const manifestsDetail = { 
            ...orderDetail,
            ...childManifestObj,
            manifestType: childManifestObj.manifestType,
            manifestId: childManifestObj.manifestName,
            originBranchCode: childManifestObj.originBranch,
            nextBranchCode: childManifestObj.destBranch,
            manifestBranch: childManifestObj.branchName,
            totalManifestOrders: childManifestObj.orderCount,
            totalManifestCrates: childManifestObj.totalCrates,
            manifestServiceType: childManifestObj.serviceTypeCd,
            manifestOutscanDate: (timezoneMode == "MYTIMEZONE") ? moment(childManifestObj.createdOnDt).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(childManifestObj.createdOnDt).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z"),
            totalManifestWeight: convertMetricsForDisplay(childManifestObj.totalWeight ? parseFloat(childManifestObj.totalWeight) : 0, 'weight') || 'Not Available',
            totalManifestVolume: convertMetricsForDisplay(childManifestObj.totalVolume ? parseFloat(childManifestObj.totalVolume) : 0, 'volume') || 'Not Available',
          }

          manifestsTemplateFields.forEach((field) => {
            manifestsContent = replaceFieldWithData(manifestsContent, field, manifestsDetail[field] || NALabel)
          })
        })

        printContent = printContent.replace(/<Manifests \/>/g, manifestsContent)
      }

      combinedOrderPrintContent += printContent
    })

    let finalPrintContent: string = baseTemplate.replace(':dynamic-content', combinedOrderPrintContent)
    console.log(finalPrintContent, "Final HTML")

    mywindow?.document.write(finalPrintContent)

    
    setTimeout(() => {
      mywindow?.document.close(); // necessary for IE >= 10
      mywindow?.focus(); // necessary for IE >= 10*/
      mywindow?.print();
      mywindow?.close();
    }, 500)

    return true;


  },[selectedOrderDetails])

  return { handlePrinting }
}

export default usePrintingManifest