
import {
    IRowData,
    
} from "../OrderListView/OrderListView.models";
import { hybridRouteTo } from "../../../utils/hybridRouting";

import {ISelectedRows} from "ui-library";
import { getUrlVars } from "../OrderListOptionData/utils";

export const handleOrderNumberClick = (row: IRowData) => {
    hybridRouteTo(`order/mileorderhistoryDetailsNew/details?shipment=${row.shipmentId}&lat=${row.lat}&lng=${row.lng}&ordno=${row.orderNo}&clientid=${row.branchId}&bc_key=allOrders`);
};
export const handleTripNumberClick = (row: IRowData) => {
    hybridRouteTo(`tripHst/tripDetails?tripId=${row.tripId}&tripName=${row.tripNo}`);
};
export const handleTrackNow = (row: IRowData) => {
    hybridRouteTo(`order/locationhistory?tripId=${row.tripId}&tripName=${row.tripNo}&page=orders&shipmentId= ${row.shipmentId}&endDt=${row.endDt}&startDt= ${row.startDt}&lat: ${row.lat}&long= ${row.lng}&hublat=${row.destLatitude}&hublng=${row.destLongitude}&bc_key=allorders`);
}

export const getDropdownValues = (buttonKey: string,actionBarButtons:any) => {
    let dropdown: any = [];
    // const actionBarButtons = useTypedSelector(
    //     (state) => state.order.listView.structure.buttons
    //   );
    if (actionBarButtons) {
      if (actionBarButtons[buttonKey].dropdownValues) {
        dropdown = Object.keys(actionBarButtons[buttonKey].dropdownValues).map(function (key: string) {
          return { value: key, label: actionBarButtons[buttonKey].dropdownValues[key] }
        })
      }
    }

    return dropdown;
    // })
    // return dropdown
  }



  export const handleCloneOrder = (selectedRows:ISelectedRows,ngStateRouter:any) => {
    setTimeout(() => {
      ngStateRouter.go('cloneOrderForm', {
        mode: 'cloneOrder',
        shipmentId: Object.keys(selectedRows)
      })
    }, 2000)
  }


  export const _generateTwoLegs = (orderDTO: any, assignTo: string, oldTripId: string, newTripId: string) => {
    let orderArray: any = [];

    var pickupOrderLeg = convertNormalOrderToDRSOrder(orderDTO);
    pickupOrderLeg['orderType'] = 'PICKUPLOCATION';
    if (assignTo == "assignToDb") {
      pickupOrderLeg["deliveryMediumMasterId"] = newTripId;
      pickupOrderLeg['newOrder'] = true;
    } else {
      pickupOrderLeg['newOrder'] = true;
      oldTripId ? pickupOrderLeg['oldTripId'] = oldTripId : null;
      (newTripId || newTripId == 'unassign') ? pickupOrderLeg['tripId'] = ((newTripId == "unassign") ? null : newTripId) : null
    }

    var deliveryOrderLeg = convertNormalOrderToDRSOrder(orderDTO);
    deliveryOrderLeg['orderType'] = 'DELIVERYLOCATION';
    if (assignTo == "assignToDb") {
      deliveryOrderLeg["deliveryMediumMasterId"] = newTripId;
      deliveryOrderLeg['newOrder'] = true;
    } else {
      deliveryOrderLeg['newOrder'] = true;
      oldTripId ? deliveryOrderLeg['oldTripId'] = oldTripId : null;
      (newTripId || newTripId == 'unassign') ? deliveryOrderLeg['tripId'] = ((newTripId == "unassign") ? null : newTripId) : null
    }

    orderArray = [pickupOrderLeg, deliveryOrderLeg];

    return orderArray;
  }

  const convertNormalOrderToDRSOrder = (normalOrder: any) => {


    let latLngs = {
      'origLat': "",
      'origLng': "",
      'destLat': "",
      'destLng': "",
    };

    // if pickup order, 
    if (!normalOrder.orderType || (normalOrder.orderType && normalOrder.orderType == "DELIVER")) {
      latLngs = {
        'origLat': normalOrder.originLatitude, //HUB
        'origLng': normalOrder.originLongitude,
        'destLat': normalOrder.latitude ? normalOrder.latitude : normalOrder.lat, //DESTINATION
        'destLng': normalOrder.longitude ? normalOrder.longitude : normalOrder.lng
      }
    } else if (normalOrder.orderType && normalOrder.orderType == "PICKUP") {
      latLngs = {
        'origLat': normalOrder.latitude ? normalOrder.latitude : normalOrder.lat, //ORIGIN 
        'origLng': normalOrder.longitude ? normalOrder.longitude : normalOrder.lng,
        'destLat': normalOrder.destLatitude, //HUB
        'destLng': normalOrder.destLongitude
      }
    }

    var drsDTO = {
      "shipmentId": normalOrder['shipmentId'],
      "orderNo": normalOrder['orderNo'],
      "packageStatusCd": normalOrder["orderStatus"],
      "orderType": normalOrder['orderType'], //this is new
      "destClientNodeId": normalOrder["destClientNodeId"],
      "destClientNodeName": normalOrder["destClientNodeId"],
      "address": normalOrder["addressDetails"],
      "partialDelivery": (normalOrder["isPartialDeliveredFl"]) ? "Y" : "N",
      "startTimeWindow": normalOrder["startTimeWindow"],
      "endTimeWindow": normalOrder["endTimeWindow"],
      "isPartialDeliveredFl": (normalOrder["isPartialDeliveredFl"]) ? "Y" : "N",
      "eta": normalOrder['eta'],
      "estimatedDistance": normalOrder['estimatedDistance'],
      "origLat": latLngs['origLat'] ? latLngs['origLat'] : 19.130883,
      "origLng": latLngs['origLng'] ? latLngs['origLng'] : 72.933139,
      "destLat": latLngs['destLat'] ? latLngs['destLat'] : 19.1314701,
      "destLng": latLngs['destLng'] ? latLngs['destLng'] : 72.868158,
      "itemCount": normalOrder["noOfItems"],
      "deliveryOrder": 1,
      "calculatedStartDt": normalOrder["calculatedStartDt"],
      "calculatedEndDt": normalOrder["calculatedEndDt"],
      "shipmentLocationId": normalOrder["shipmentLocationId"],
      "deliveryLocationType": normalOrder["deliveryLocationType"],
      "paymentType": normalOrder["paymentType"],
      "shipmentOrderTypeCd": normalOrder["orderType"] ? normalOrder["orderType"] : normalOrder["shipmentOrderTypeCd"],
      "cashAmount": normalOrder["amount"],
      "noOfAttempts": normalOrder["noOfAttempts"],
      "clientBranchId": normalOrder['branchId'],
      "packageValue": normalOrder["packageValue"],
      "serviceTimeInMins": normalOrder["serviceTimeInMins"],
      "tripId": normalOrder["mode"] != "unassign" ? normalOrder["tripId"] : null,
      "isGeocoded": normalOrder["isGeocoded"]
    }

    return drsDTO
  }

  export const getNotifyCustomerDropdown = (notificationData:any) => {
    let dropdown: any = []
    // const notificationData = useTypedSelector(
    //     (state) => state.order.listView.notificationData
    //   );
    dropdown = Object.keys(notificationData).map((key) => {
      return { value: key, label: notificationData[key].name, index: key }
    })
    return dropdown;
  }

  export const getPageSelected = ()=>{
      const hash = window.location.hash;
      const splitedUrl = hash.includes("?") && hash.split("?")[1];
      const params = (splitedUrl ? getUrlVars(splitedUrl) : undefined) as any;
      return params && params?.page ? params?.page : undefined;
  }