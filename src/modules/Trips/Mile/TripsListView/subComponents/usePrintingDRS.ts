import moment from "moment"
import { useCallback} from "react"
import { IMongoDynamicHTMLTemplate } from "../../../../../utils/common.interface"
import { useTypedSelector } from "../../../../../utils/redux/rootReducer"
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping"
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels"
import { baseTemplate, extractFieldsFromHTML, replaceFieldWithData } from "../../../../OrderMiddleMile/PrintAwb/PrintAwb.constants"
import { ITripPrintDRSTemplateData, ICustomFieldsEntity } from "../TripsListView.model"
import { userAccessInfo } from "../../../../../utils/axios";
import { handlingCustomField } from '../../../../../modules/OnboardingWrapper/ModuleConfiguration/DRSTemplateConfiguration/DRSTemplateConfiguration.utils'

const usePrintingDRS = () => {
  const selectedTripsDetails = useTypedSelector(state => state.trips.listView.mile.selectedRows)
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0]);
  const NALabel = dynamicLabels?.notAvailable ? dynamicLabels?.notAvailable : "Not Available";
  const timezoneMode = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezoneMode']) : '';
  const superType = JSON.parse(String(localStorage.getItem('userAccessInfo')))['superType'] 

  const handlePrinting = useCallback((template: IMongoDynamicHTMLTemplate<ITripPrintDRSTemplateData>, drsTableData, crateInfo, countInfo,clientProperties,convertMetricsForDisplay,headersLabels) => {
    
    if (!template) {
      return
    }

    const middleMileLabels ={
      'ORDER': headersLabels?.mm_order_s,
      'MILESTONE' : headersLabels?.order_s,
      'milestones' : headersLabels?.order_p,
      'orders' : headersLabels?.order_p,
    }
  
    const fmlmLabels ={
        'ORDER': headersLabels?.order_s,
        'orders': headersLabels?.order_p,
    }
     
    let dynamicLabelsEntityMapping = {
      'BRANCH': headersLabels?.branch_s,
      'branches': headersLabels?.branch_p,
      'SHIPPER': headersLabels?.shipper_s,
      'shippers': headersLabels?.shipper_p,
      'CRATE': headersLabels?.crate_s,
      'crates': headersLabels?.crate_p,
      'ITEM': headersLabels?.item_s,
      'items': headersLabels?.item_p,
      'CUSTOMER': headersLabels?.customer_s,
      'customers': headersLabels?.customer_p,
      'DELIVERY ASSOCIATE': headersLabels?.deliveryboy_s,
      'delivery associates' : headersLabels?.deliveryboy_p,
      'ROUTE' : headersLabels?.route_s,
      'routes' : headersLabels?.route_p,
      'TRIP': headersLabels?.trip_s ,
      'trips': headersLabels?.trip_p,
      'VEHICLE' : headersLabels?.vehicle_s,
      'vehicles' : headersLabels?.vehicle_p,
      'DELIVERY RUN SHEET' : headersLabels?.drs_s,
      'INTRANSIT': headersLabels?.intransit_status_s,
      'APARTMENT' : headersLabels?.addr_apartment_s,
      'STREET' : headersLabels?.addr_streetname_s,
      'STATE' : headersLabels?.addr_state_s,
      'CITY' : headersLabels?.addr_city_s,
      'LANDMARK' : headersLabels?.addr_landmark_s,
      'PINCODE' :  headersLabels?.addr_pincode_s,
      'COUNTRY' : headersLabels?.addr_country_s,
      'LOCALITY' : headersLabels?.addr_locality_s
    }

    let allDynamicLabelsEntityMapping ={}

    allDynamicLabelsEntityMapping =  (superType == 'MIDDLEMILE') ?  { ...dynamicLabelsEntityMapping,...middleMileLabels} : {...dynamicLabelsEntityMapping,...fmlmLabels}

    let mywindow = window.open('', '_blank');

    let combinedOrderPrintContent = ''
    let { orderHTML, crateHTML, itemHTML, tripHTML, customerHTML } = template.htmlData

    /** Extract Dynamic Fields from orderHTML template */

    const orderTemplateFields = orderHTML ? extractFieldsFromHTML(orderHTML) : []
    const crateTemplateFields = crateHTML ? extractFieldsFromHTML(crateHTML) : []
    const itemTemplateFields = itemHTML ? extractFieldsFromHTML(itemHTML) : []
    const tripTemplateFields:any = tripHTML ? extractFieldsFromHTML(tripHTML) : []
    const customerTemplateFields = customerHTML ? extractFieldsFromHTML(customerHTML) : []

    Object.keys(allDynamicLabelsEntityMapping).forEach((entity)=>{
      const rgex = new RegExp(`\\b${entity}\\b`, 'gi');
      orderHTML = orderHTML.replaceAll(rgex ,entity)
      crateHTML = crateHTML.replaceAll(rgex ,entity)
      itemHTML = itemHTML.replaceAll(rgex ,entity)
      customerHTML = customerHTML.replaceAll(rgex ,entity)
    })  
  
    for(const property in allDynamicLabelsEntityMapping){
      orderHTML = orderHTML.replaceAll( property ,allDynamicLabelsEntityMapping[property]) 
      crateHTML = crateHTML.replaceAll( property ,allDynamicLabelsEntityMapping[property]) 
      itemHTML = itemHTML.replaceAll( property ,allDynamicLabelsEntityMapping[property]) 
      customerHTML = customerHTML.replaceAll( property ,allDynamicLabelsEntityMapping[property]) 
    }


    const orderData = {
      clientLogo: userAccessInfo?.clientLogo,
      dateAndTimeOfPrintingDrs: (timezoneMode == "MYTIMEZONE") ? moment(new Date()).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(new Date()).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z"),
    }


    Object.values(drsTableData)?.forEach((orderObj: any, key) => {

      let printContent = `${orderHTML}`
      const hashMappedData = new Map();
      orderData['tripCreationDate'] = (timezoneMode == "MYTIMEZONE") ? moment(orderObj?.createdOnDate).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(orderObj?.createdOnDate).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z") || '';
      orderData['deliveryAssociate'] = orderObj?.deliveryMediumName ? orderObj?.deliveryMediumName : NALabel
      orderData['tripDABranch'] = orderObj?.originAddr
      orderObj.deliveryRunSheet.forEach(element => {
       
        if (hashMappedData.has((element.addressId + element.orderType))) {
          const tempHashMappedObj = hashMappedData.get(element.addressId + element.orderType);

          hashMappedData.set(element.addressId + element.orderType, {
            ...tempHashMappedObj,
            itemCount: tempHashMappedObj.itemCount + element.itemCount,
            orderCount: tempHashMappedObj.orderCount + 1,
            packageValue: tempHashMappedObj.packageValue + (element.packageValue ? element.packageValue : 0),
            totalServiceTime: tempHashMappedObj.totalServiceTime + (element.totalServiceTime ? element.totalServiceTime : 0),
            packageWeight: tempHashMappedObj.packageWeight + (element.packageWeight ? element.packageWeight : 0),
            noOfLineItems: tempHashMappedObj.noOfLineItems + element.noOfLineItems,
            cashAmount: tempHashMappedObj.cashAmount + (element.cashAmount ? element.cashAmount : 0),
          });
        } else {
          hashMappedData.set(element.addressId + element.orderType, { ...element, orderCount: 1 })
        }
      });

      const customerDetails = Array.from(hashMappedData.values());

      let countDetail: any = [];
      if (countInfo && countInfo?.length) {
        Object.values(countInfo)?.forEach((countObj: any) => {
          const data: any = Object.values(Object.values(countObj))
          data.forEach((countResponse) => {
            countDetail.push({
              ...countResponse,
              noOfCustomers: countResponse?.uniqueCustomerCount,
              totalNoOfOrders: countResponse?.orderCount,
              totalNoOfCrates: countResponse?.crateCount,
              totalNoOfItems: countResponse?.itemCount,
              totalEstimatedDistance: convertMetricsForDisplay(countResponse?.plannedDistance ? parseFloat(countResponse?.plannedDistance) : 0, 'distance'),
              totalPackageWeight: convertMetricsForDisplay(countResponse?.packageWeight ? parseFloat(countResponse?.packageWeight) : 0, 'weight'),
              totalTime: Math.floor(countResponse?.plannedTripTimeInMins / 60) + " Hrs : " + (countResponse?.plannedTripTimeInMins % 60) + " Mins",
              totalAmount: countResponse?.packageValue ? countResponse?.packageValue : '0.00'
            })
          })
        })
      }
      let singleValue = {}
      countDetail.forEach((singleDetail) => {
        if (singleDetail?.tripId === orderObj?.tripId) {
          singleValue = singleDetail
        }
      })
      // Trip Level Data 
      const orderDetail = { ...orderObj, ...singleValue, ...orderData }


      if (orderDetail.countDetail) {
        orderTemplateFields.forEach((field) => {
          countDetail.forEach((singleCount) => {
            if (singleCount?.tripId === orderObj?.tripId) {
              printContent = replaceFieldWithData(printContent, field, orderDetail[field] || NALabel)
            }
          })
        })
      }

      if (printContent.includes('<OrderDetails />') && orderDetail.deliveryRunSheet?.length) {
        let tripContent = '';
        if (tripTemplateFields.has("shipmentNumber") && !tripTemplateFields.has("orderNo")) {
          let tripDetailArray:any = [];
          Object.values(orderObj.deliveryRunSheet)?.forEach((tripObj: any,index) => {
            let tripData ={}
            //Order Level Data for a trip (in MIDDLEMILE)
            const customFieldListEntity: ICustomFieldsEntity[] = tripObj?.customFieldsJSONString ? JSON.parse(tripObj?.customFieldsJSONString) : []
            handlingCustomField(tripData, customFieldListEntity, clientProperties, timezoneMode);
            const tripDetail = {
              ...tripData,
              ...tripObj,
              orderStatus: tripObj.packageStatusCd,
              estimatedDistance: tripObj.estimatedDistance ? parseFloat(tripObj.estimatedDistance) : '0.00',
              totalServiceTime: ((tripObj.totalServiceTime) / 60000).toFixed(2),
              intransitTime: ((tripObj.intransitTime) / 60000).toFixed(2),
              totalLoadingTime: ((tripObj.totalLoadingTime) / 60000).toFixed(2),
              totalUnLoadingTime: ((tripObj.totalUnLoadingTime) / 60000).toFixed(2),
              calculatedStartDt: (timezoneMode == "MYTIMEZONE") ? moment(tripObj.calculatedStartDt).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(tripObj.calculatedStartDt).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z"),
              calculatedEndDt: (timezoneMode == "MYTIMEZONE") ? moment(tripObj.calculatedEndDt).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(tripObj.calculatedEndDt).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z"),
              subClientName: tripObj.shipperName,
              vehicleNumber: tripObj.vehicleNo,
              parentShipmentNumber: tripObj.parentOrderNo,
              noOfCrates: tripObj.itemCount,
              noOfOrders: tripObj.orderCount,
              noOfItems: tripObj.noOfLineItems,
              amount: tripObj?.cashAmount ? tripObj?.cashAmount : '0.00',
              packageValue: tripObj?.packageValue ? tripObj?.packageValue : '0.00',
              shipmentNumber: tripObj?.shipmentOrderNo ? tripObj?.shipmentOrderNo : NALabel,
              pickupId : (superType == "MIDDLEMILE") ? tripObj?.origClientNodeCd : tripObj?.orderType === "PICKUPLOCATION" ? tripObj.destClientNodeId : NALabel,
              pickupName : (superType == "MIDDLEMILE") ? tripObj?.origCustName : tripObj?.orderType === "PICKUPLOCATION" ? tripObj.destClientNodeName : NALabel,
              pickupStreet: (superType == "MIDDLEMILE") ? tripObj?.origStreetName :  tripObj?.orderType === "PICKUPLOCATION" ? tripObj.streetName : NALabel,
              pickupApartment : (superType == "MIDDLEMILE") ? tripObj?.origApartment :  tripObj?.orderType === "PICKUPLOCATION" ? tripObj.apartment : NALabel,
              pickupCity: (superType == "MIDDLEMILE") ? tripObj?.origCity :tripObj?.orderType === "PICKUPLOCATION" ? tripObj.city : NALabel ,
              pickupState : (superType == "MIDDLEMILE") ?tripObj?.origState : tripObj?.orderType === "PICKUPLOCATION" ? tripObj.state : NALabel  ,
              pickupClientNodePhone : (superType == "MIDDLEMILE") ? tripObj?.origCustPhone : tripObj?.orderType === "PICKUPLOCATION" ? tripObj.destClientNodePhone : NALabel ,
              devileryClientNodeId:  (superType == "MIDDLEMILE") ? tripObj?.delivClientNodeCd: tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.destClientNodeId : NALabel ,
              deliveryClientNodeName: (superType == "MIDDLEMILE") ?  tripObj?.deliverName : tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.destClientNodeName : NALabel,
              deliveryClientNodePhone:  (superType == "MIDDLEMILE") ?tripObj?.deliverPhone : tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.destClientNodePhone : NALabel ,
              deliverStreet: (superType == "MIDDLEMILE") ? tripObj.streetName : tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.streetName : NALabel,
              deliverState: (superType == "MIDDLEMILE") ? tripObj.state :  tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.state : NALabel,
              deliverCity: (superType == "MIDDLEMILE") ? tripObj.city :  tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.city : NALabel,
              deliverApartment: (superType == "MIDDLEMILE") ? tripObj.apartment : tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.apartment : NALabel,
              packageWeight: convertMetricsForDisplay(tripObj.packageWeight ? parseFloat(tripObj.packageWeight) : 0, 'weight'),
            }
            tripDetailArray.push(tripDetail)
          });

          let filtered = tripDetailArray.reduce((filtered, item) => {
            if( !filtered.some(filteredItem => JSON.stringify(filteredItem.shipmentOrderNo) == JSON.stringify(item.shipmentOrderNo)) )
              filtered.push(item)
            return filtered
          }, [])

          Object.values(filtered)?.forEach((filteredObj:any, index) => {
            tripContent += tripHTML
            filteredObj = {
              ...filteredObj,
              serialNo: index + 1 ,
            }
            tripTemplateFields.forEach((field) => {
              let data = NALabel;
              const isCustomField = field.startsWith('cf_');
              if (isCustomField) {
                let dataKeyName = field.split('#$@$')[0];
                data = filteredObj?.[dataKeyName] ? filteredObj?.[dataKeyName] : NALabel
              }
              tripContent = replaceFieldWithData(tripContent, field, filteredObj[field] || data);
            })
          });
        } else {

          let tripData ={}
          Object.values(orderObj.deliveryRunSheet)?.forEach((tripObj: any,index) => {
            const customFieldListEntity: ICustomFieldsEntity[] = tripObj?.customFieldsJSONString ? JSON.parse(tripObj?.customFieldsJSONString) : []
            handlingCustomField(tripData, customFieldListEntity, clientProperties, timezoneMode);
            tripContent += tripHTML
            //Order Level Data for a trip
            const tripDetail = {
              ...tripData,
              ...tripObj,
              serialNo: index +1 ,
              orderStatus: tripObj.packageStatusCd,
              estimatedDistance: tripObj.estimatedDistance ? parseFloat(tripObj.estimatedDistance) : '0.00',
              totalServiceTime: ((tripObj.totalServiceTime) / 60000).toFixed(2),
              intransitTime: ((tripObj.intransitTime) / 60000).toFixed(2),
              totalLoadingTime: ((tripObj.totalLoadingTime) / 60000).toFixed(2),
              totalUnLoadingTime: ((tripObj.totalUnLoadingTime) / 60000).toFixed(2),
              calculatedStartDt: (timezoneMode == "MYTIMEZONE") ? moment(tripObj.calculatedStartDt).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(tripObj.calculatedStartDt).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z"),
              calculatedEndDt: (timezoneMode == "MYTIMEZONE") ? moment(tripObj.calculatedEndDt).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(tripObj.calculatedEndDt).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z"),
              subClientName: tripObj.shipperName,
              vehicleNumber: tripObj.vehicleNo,
              parentShipmentNumber: tripObj.parentOrderNo,
              noOfCrates: tripObj.itemCount,
              noOfOrders: tripObj.orderCount,
              noOfItems: tripObj.noOfLineItems,
              amount: tripObj?.cashAmount ? tripObj?.cashAmount : '0.00',
              packageValue: tripObj?.packageValue ? tripObj?.packageValue : '0.00',
              shipmentNumber: tripObj?.shipmentOrderNo ? tripObj?.shipmentOrderNo : NALabel,
              pickupId : (superType == "MIDDLEMILE") ? tripObj?.origClientNodeCd : tripObj?.orderType === "PICKUPLOCATION" ? tripObj.destClientNodeId : NALabel,
              pickupName : (superType == "MIDDLEMILE") ? tripObj?.origCustName : tripObj?.orderType === "PICKUPLOCATION" ? tripObj.destClientNodeName : NALabel,
              pickupStreet: (superType == "MIDDLEMILE") ? tripObj?.origStreetName :  tripObj?.orderType === "PICKUPLOCATION" ? tripObj.streetName : NALabel,
              pickupApartment : (superType == "MIDDLEMILE") ? tripObj?.origApartment :  tripObj?.orderType === "PICKUPLOCATION" ? tripObj.apartment : NALabel,
              pickupCity: (superType == "MIDDLEMILE") ? tripObj?.origCity :tripObj?.orderType === "PICKUPLOCATION" ? tripObj.city : NALabel ,
              pickupState : (superType == "MIDDLEMILE") ?tripObj?.origState : tripObj?.orderType === "PICKUPLOCATION" ? tripObj.state : NALabel  ,
              pickupClientNodePhone : (superType == "MIDDLEMILE") ? tripObj?.origCustPhone : tripObj?.orderType === "PICKUPLOCATION" ? tripObj.destClientNodePhone : NALabel ,
              devileryClientNodeId:  (superType == "MIDDLEMILE") ? tripObj?.delivClientNodeCd: tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.destClientNodeId : NALabel ,
              deliveryClientNodeName: (superType == "MIDDLEMILE") ?  tripObj?.deliverName : tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.destClientNodeName : NALabel,
              deliveryClientNodePhone:  (superType == "MIDDLEMILE") ?tripObj?.deliverPhone : tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.destClientNodePhone : NALabel ,
              deliverStreet: (superType == "MIDDLEMILE") ? tripObj.streetName : tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.streetName : NALabel,
              deliverState: (superType == "MIDDLEMILE") ? tripObj.state :  tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.state : NALabel,
              deliverCity: (superType == "MIDDLEMILE") ? tripObj.city :  tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.city : NALabel,
              deliverApartment: (superType == "MIDDLEMILE") ? tripObj.apartment : tripObj?.orderType === "DELIVERYLOCATION" ? tripObj.apartment : NALabel,
              packageWeight: convertMetricsForDisplay(tripObj.packageWeight ? parseFloat(tripObj.packageWeight) : 0, 'weight'),
            }
            tripTemplateFields.forEach((field) => {
              let data = NALabel;
              const isCustomField = field.startsWith('cf_');
              if (isCustomField) {
                let dataKeyName = field.split('#$@$')[0];
                data = tripDetail?.[dataKeyName] ? tripDetail?.[dataKeyName] : NALabel
              }
              tripContent = replaceFieldWithData(tripContent, field, tripDetail[field] || data);
            })
          });
        }
        printContent = printContent.replace(/<OrderDetails \/>/g, tripContent)

      }

      if (printContent.includes('<CrateDetails />') && crateInfo?.length) {
        let crateContent = '';
        Object.values(crateInfo)?.forEach((crateInfoObj: any, index) => {
          if (key == index) {
            crateInfoObj.forEach(crateObj => {
              crateContent += crateHTML;
              const crateDetail = {
                ...crateObj,
                shipmentNumber: crateObj?.orderNo,
                crateQuantity: crateObj?.noOfUnits,
                crateCode: crateObj?.crateCd,
                crateStatus: crateObj?.statusCd,
              }
              crateTemplateFields.forEach((field) => {
                crateContent = replaceFieldWithData(crateContent, field, crateDetail[field] || NALabel);
              });

              if (crateContent.includes('<ItemDetails />') && crateDetail.shipmentlineitems?.length) {
                let itemContent = '';
                Object.values(crateObj.shipmentlineitems)?.forEach((itemObj: any) => {
                  itemContent += itemHTML;
                  const itemDetail = {
                    ...itemObj,
                    itemWeight: convertMetricsForDisplay(itemObj.itemWeight ? parseFloat(itemObj.itemWeight) : 0, 'weight'),
                    itemStatus: itemObj.statusCd ? itemObj.statusCd : NALabel,
                    itemBarcode : itemObj?.itemCd ? itemObj?.itemCd : NALabel
                  };
                  itemTemplateFields.forEach((field) => {
                    itemContent = replaceFieldWithData(itemContent, field, itemDetail[field] || NALabel);

                  });
                });
                crateContent = crateContent.replace(/<ItemDetails \/>/g, itemContent)
              } else {
                crateContent = crateContent.replace(/<ItemDetails \/>/g, '')
              }
            })
          }
        });
        printContent = printContent.replace(/<CrateDetails \/>/g, crateContent)

      }
      if (printContent.includes('<CustomerDetails />') && customerDetails?.length) {
        let customerContent = '';
        Object.values(customerDetails)?.forEach((customerObj: any,index) => {
          customerContent += customerHTML
          const customerDetail = {
            ...customerObj,
            serialNo: index +1,
            noOfCrates: customerObj.itemCount,
            noOfOrders: customerObj.orderCount,
            noOfItems: customerObj.noOfLineItems,
            address: customerObj.address,
            eta: (timezoneMode == "MYTIMEZONE") ? moment(customerObj.eta).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A") : moment(customerObj.eta).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + " h:mm A z"),
            totalServiceTime: (customerObj.totalServiceTime / 60000).toFixed(2),
            packageValue: customerObj.packageValue,
            packageWeight: convertMetricsForDisplay(customerObj.packageWeight ? parseFloat(customerObj.packageWeight) : 0, 'weight'),
            destClientNodePhone: (superType == "MIDDLEMILE") ? customerObj.deliverPhone : customerObj.destClientNodePhone,
            deliverName: (superType == "MIDDLEMILE") ? customerObj.deliverName : customerObj.destClientNodeName,
            amount : customerObj?.cashAmount ? customerObj?.cashAmount : '0.00'
          }

          customerTemplateFields.forEach((field) => {
            customerContent = replaceFieldWithData(customerContent, field, customerDetail[field] || NALabel);
          })

        });
        printContent = printContent.replace(/<CustomerDetails \/>/g, customerContent)

      }
      else {
        printContent = printContent.replace(/<CrateDetails \/>/g, '')
      }

      orderTemplateFields.forEach((field) => {
        printContent = replaceFieldWithData(printContent, field, orderDetail[field] || NALabel)
      })
      combinedOrderPrintContent += printContent
    });

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


  }, [selectedTripsDetails])

  return { handlePrinting }
}


export default usePrintingDRS