import React, { useEffect, useState } from "react";
// import { useDispatch } from 'react-redux';
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import MapDefault from "../../../../../utils/components/Map/MapDefault";
import { useToast } from "ui-library";
// import { useDispatch } from 'react-redux'
// import { tTripsListMileActions } from '../TripsListView.actions'
// import { getGoogleAPIKey } from '../../../../../utils/components/Map/MapHelper'
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { ISetMapDataResponse } from "../TripsListView.model";
import { HERE_MAP_API_KEY } from "../../../../../utils/map/map.constants";
import { colorPalette } from "../../../../../utils/constants";
import { tModelType } from "../../../../../utils/common.interface";
import { ITripData } from "../../../../../utils/components/Map/interface";
import { convertDateTimeZone } from "../../../../../utils/helper";

const MapView = ({considerBackToHub}) => {
  // const dispatch = useDispatch<Dispatch<tTripsListMileActions>>();
  const googleApiKey = useTypedSelector(
    (state) => state.trips.listView.mile.googleAPIKey
  );
  const selectedRows = useTypedSelector(
    (state) => state.trips.listView.mile.selectedRows
  );
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  const dateFormat =
    (useTypedSelector(
      (state) => state?.clientProperties?.DATEFORMAT?.propertyValue
    )?.toUpperCase() || "dd mm yyyy") + "hh:mm A (z)";
  const userAccessInfo = JSON.parse(
    localStorage.getItem("userAccessInfo") || "{}"
  );
  const operationType: tModelType = userAccessInfo.modelType;
  const intitialState: ITripData = {
    permission: true,
    config: {
      mode: "google",
      animation: "antpath",
      color: "rgba(0, 0, 200,0.2)",
      weight: 5,
      opacity: 0.8,
      dashArray: ["10", "20"],
      pulseColor: "rgba(0, 0, 200,1)",
      delay: 400,
      smoothFactor: 5,
      backToStart: false,
      popupRef: "tripMile",
    },
    data: [],
    metaData: {},
    noSelectedRows: {
      permission: true,
      title: dynamicLabels.selectTripsToviewOnMap
        ? dynamicLabels.selectTripsToviewOnMap
        : "Select Trip(s) to view on map",
      showArrow: true,
      showCloseIcon: true,
    },
  };
  const toast = useToast();
  const [tripMapData, setTripMapData] = useState(intitialState);
  const [modeOfTravel,setModeOfTravel] = useState('')
  const [heremapsObject, setHereMapsObject] = useState({});
  // const dispatch = useDispatch();
  const handleRowSelection = async () => {
    setTripMapData({
      ...tripMapData,
      noSelectedRows: {
        ...tripMapData.noSelectedRows,
        permission: false,
      },
    });
    const tripIds = Object.keys(selectedRows);
    const { data } = await axios.get(
      apiMappings.trips.mile.listview.multipleTripRoute,
      {
        params: {
          tripId: tripIds + "",
        },
      }
    );

    if (data.data.results) {
      //check if api has the key transitMode if yes set the value otherwise set mode as Driving 
      const transitMode = data?.data?.results[0]?.transitMode ?? 'Driving';
      setModeOfTravel(transitMode)
      let shipmentCounter = 0;
      data.data.results.forEach(
        (trip: { deliveryRunSheet: string | any[] }) => {
          if (trip.deliveryRunSheet?.length > 0) {
            shipmentCounter += trip.deliveryRunSheet?.length;
          }
        }
      );
      if (shipmentCounter > 1000) {
        throw shipmentCounter;
      }
    }
    return data;
  };

  const daAddressData = (waypoints, trip, shipment, daColorObj) => {
    const daHomeObj = {
      position: [trip?.homeLatitude, trip?.homeLongitude],
      title: dynamicLabels?.daHome || 'Delivery Associate Home',
      entity: 'DA Home',
      icon: {
          iconLocation: 'images/maps/assist/da-home.svg',
          iconAnchor: [17, 46],
          divIcon: true,
          html: `<div id="da-home" class="leafletStandardHtmlMarker hub"><svg width="26" height="54" viewBox="0 0 26 54" fill="${daColorObj}" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="12.5" stroke="black"/><mask id="path-2-inside-1_152_50" fill="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 25H11V48.2496C9.2341 48.7126 8 49.7698 8 51C8 52.6569 10.2386 54 13 54C15.7614 54 18 52.6569 18 51C18 49.7698 16.7659 48.7126 15 48.2496V25Z"/></mask><path fill-rule="evenodd" clip-rule="evenodd" d="M15 25H11V48.2496C9.2341 48.7126 8 49.7698 8 51C8 52.6569 10.2386 54 13 54C15.7614 54 18 52.6569 18 51C18 49.7698 16.7659 48.7126 15 48.2496V25Z" fill="#C8C8C8"/><path d="M11 25V24H10V25H11ZM15 25H16V24H15V25ZM11 48.2496L11.2536 49.2169L12 49.0213V48.2496H11ZM15 48.2496H14V49.0213L14.7464 49.2169L15 48.2496ZM11 26H15V24H11V26ZM12 48.2496V25H10V48.2496H12ZM9 51C9 50.7435 9.12503 50.4237 9.50645 50.0807C9.8906 49.7352 10.4861 49.4181 11.2536 49.2169L10.7464 47.2823C9.74799 47.5441 8.8435 47.9871 8.16912 48.5935C7.49202 49.2024 7 50.0263 7 51H9ZM13 53C11.7694 53 10.7037 52.6986 9.97896 52.2638C9.23436 51.8171 9 51.3392 9 51H7C7 52.3177 7.88493 53.3398 8.94997 53.9788C10.0349 54.6298 11.4692 55 13 55V53ZM17 51C17 51.3392 16.7656 51.8171 16.021 52.2638C15.2963 52.6986 14.2306 53 13 53V55C14.5308 55 15.9651 54.6298 17.05 53.9788C18.1151 53.3398 19 52.3177 19 51H17ZM14.7464 49.2169C15.5139 49.4181 16.1094 49.7352 16.4935 50.0807C16.875 50.4237 17 50.7435 17 51H19C19 50.0263 18.508 49.2024 17.8309 48.5935C17.1565 47.9871 16.252 47.5441 15.2536 47.2823L14.7464 49.2169ZM14 25V48.2496H16V25H14Z" fill="black" mask="url(#path-2-inside-1_152_50)"/><g clip-path="url(#clip0_152_50)"><path d="M18.3334 18.3333C18.3334 18.5101 18.2631 18.6797 18.1381 18.8047C18.0131 18.9298 17.8435 19 17.6667 19H8.33335C8.15654 19 7.98697 18.9298 7.86195 18.8047C7.73692 18.6797 7.66669 18.5101 7.66669 18.3333V12.3333H5.66669L12.5514 6.07467C12.6741 5.96299 12.8341 5.9011 13 5.9011C13.166 5.9011 13.3259 5.96299 13.4487 6.07467L20.3334 12.3333H18.3334V18.3333ZM11.6667 13.6667V19H14.3334V13.6667H11.6667Z" fill="white"/></g><defs><clipPath id="clip0_152_50"><rect width="16" height="16" fill="white" transform="translate(5 5)"/></clipPath></defs></svg></div>`
      }
    }
    waypoints.push(daHomeObj);
  }

  const makeMarkerData = (data: ISetMapDataResponse) => {
    const tripList = data.data.results;
    let sequenceCount = 1;
    const tripMarkerData: any[] = [];
    const markerMetaData = {};
    const orderHubColorObj = {};
    tripList.forEach((trip, index) => {
      const waypoints: any[] = [];
      let consideredOrderHubs = {};
      if (!trip.resourceOrderHubSame) {
        let resourceHubObj = {
          id: "resoursehub_" + sequenceCount,
          position: [trip.originLatitude, trip.originLongitude],
          title: "Resource hub",
          icon: {
            iconLocation: "images/maps/warehouse.svg",
            iconAnchor: [15, 82],
            divIcon: true,
            html: '<div id="resource-hub"><svg width="26" height="62" viewBox="0 0 26 62" fill="#FBAF3E" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="12.5" stroke="black"/><mask id="path-2-inside-1_186_47" fill="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 25H11V56.2496C9.2341 56.7126 8 57.7698 8 59C8 60.6569 10.2386 62 13 62C15.7614 62 18 60.6569 18 59C18 57.7698 16.7659 56.7126 15 56.2496V25Z"/></mask><path fill-rule="evenodd" clip-rule="evenodd" d="M15 25H11V56.2496C9.2341 56.7126 8 57.7698 8 59C8 60.6569 10.2386 62 13 62C15.7614 62 18 60.6569 18 59C18 57.7698 16.7659 56.7126 15 56.2496V25Z" fill="#C8C8C8"/><path d="M11 25V24H10V25H11ZM15 25H16V24H15V25ZM11 56.2496L11.2536 57.2169L12 57.0213V56.2496H11ZM15 56.2496H14V57.0213L14.7464 57.2169L15 56.2496ZM11 26H15V24H11V26ZM12 56.2496V25H10V56.2496H12ZM9 59C9 58.7435 9.12503 58.4237 9.50645 58.0807C9.8906 57.7352 10.4861 57.4181 11.2536 57.2169L10.7464 55.2823C9.74799 55.5441 8.8435 55.9871 8.16912 56.5935C7.49202 57.2024 7 58.0263 7 59H9ZM13 61C11.7694 61 10.7037 60.6986 9.97896 60.2638C9.23436 59.8171 9 59.3392 9 59H7C7 60.3177 7.88493 61.3398 8.94997 61.9788C10.0349 62.6298 11.4692 63 13 63V61ZM17 59C17 59.3392 16.7656 59.8171 16.021 60.2638C15.2963 60.6986 14.2306 61 13 61V63C14.5308 63 15.9651 62.6298 17.05 61.9788C18.1151 61.3398 19 60.3177 19 59H17ZM14.7464 57.2169C15.5139 57.4181 16.1094 57.7352 16.4935 58.0807C16.875 58.4237 17 58.7435 17 59H19C19 58.0263 18.508 57.2024 17.8309 56.5935C17.1565 55.9871 16.252 55.5441 15.2536 55.2823L14.7464 57.2169ZM14 25V56.2496H16V25H14Z" fill="black" mask="url(#path-2-inside-1_186_47)"/><g clip-path="url(#clip0_186_47)"><path d="M18.3334 18.3333C18.3334 18.5101 18.2631 18.6797 18.1381 18.8047C18.0131 18.9298 17.8435 19 17.6667 19H8.33335C8.15654 19 7.98697 18.9298 7.86195 18.8047C7.73693 18.6797 7.66669 18.5101 7.66669 18.3333V12.3333H5.66669L12.5514 6.07467C12.6741 5.96299 12.8341 5.9011 13 5.9011C13.166 5.9011 13.3259 5.96299 13.4487 6.07467L20.3334 12.3333H18.3334V18.3333ZM10.3334 15V16.3333H15.6667V15H10.3334Z" fill="black"/><path d="M10.3334 14.3333V13H15.6667V14.3333H10.3334Z"/><path d="M10.3334 12.3333V11H15.6667V12.3333H10.3334Z"/></g><defs><clipPath id="clip0_186_47"><rect width="16" height="16" fill="white" transform="translate(5 5)"/></clipPath></defs></svg></div>'
          },
          // 'infowindow': false,
          // 'infowindowDirective': 'order-mappopup',
          // 'parentHubId': 'givemeID'
          type: "trips",
          entity: "hub",
          // iconRef: 'hub',

          sequence: sequenceCount++,
        };
        waypoints.push(resourceHubObj);
      }

      if (trip.deliveryRunSheet.length > 0) {
        trip.deliveryRunSheet.forEach((shipment, waypointIndex) => {
          const thisShipmentClientId = shipment.clientBranchId.toString();
          const daColorObj = orderHubColorObj[thisShipmentClientId] ? orderHubColorObj[thisShipmentClientId] : colorPalette[index];
          if(trip?.homeLatitude && trip?.homeLongitude && !waypoints?.find(point => point?.entity === 'DA Home')) {
            daAddressData(waypoints, trip, shipment, daColorObj);
          }
          if (shipment.orderType == "DELIVERYLOCATION") {
            if (
              shipment.origLat > -180 &&
              shipment.origLng < 180 &&
              shipment.origLat > -180 &&
              shipment.origLng < 180
            ) {
              if (
                typeof shipment != "undefined" &&
                !consideredOrderHubs[thisShipmentClientId] &&
                (shipment.shipmentOrderTypeCd == "PICKUP" ||
                  operationType == "LM")
              ) {
                if (!consideredOrderHubs[thisShipmentClientId]) {
                  //consider this hub as UINIQUE
                  consideredOrderHubs[thisShipmentClientId] = true;
                  orderHubColorObj[thisShipmentClientId] = colorPalette[index];
                }

                const hubObject = {
                  id: "hub_" + waypointIndex,
                  position: [
                    shipment.shipmentOrderTypeCd == "PICKUP"
                      ? shipment.destLat
                      : shipment.origLat,
                    shipment.shipmentOrderTypeCd == "PICKUP"
                      ? shipment.destLng
                      : shipment.origLng,
                  ], //if DELIVERY HUB, it's origin latlongs matter, if pickup hub, destination latlngs matter
                  title: dynamicLabels?.["branch"]
                    ? dynamicLabels["branch"]
                    : "Hub",
                  icon: {
                    iconLocation: "images/maps/red.svg",
                    iconAnchor: [13, 52],
                    divIcon: true,
                    html: `<div id="hub" class="leafletStandardHtmlMarker hub"><svg width="26" height="54" viewBox="0 0 26 54" fill="${orderHubColorObj[thisShipmentClientId]}" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="12.5" stroke="black"/><mask id="path-2-inside-1_152_56" fill="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 25H11V48.2496C9.2341 48.7126 8 49.7698 8 51C8 52.6569 10.2386 54 13 54C15.7614 54 18 52.6569 18 51C18 49.7698 16.7659 48.7126 15 48.2496V25Z"/></mask><path fill-rule="evenodd" clip-rule="evenodd" d="M15 25H11V48.2496C9.2341 48.7126 8 49.7698 8 51C8 52.6569 10.2386 54 13 54C15.7614 54 18 52.6569 18 51C18 49.7698 16.7659 48.7126 15 48.2496V25Z" fill="#C8C8C8"/><path d="M11 25V24H10V25H11ZM15 25H16V24H15V25ZM11 48.2496L11.2536 49.2169L12 49.0213V48.2496H11ZM15 48.2496H14V49.0213L14.7464 49.2169L15 48.2496ZM11 26H15V24H11V26ZM12 48.2496V25H10V48.2496H12ZM9 51C9 50.7435 9.12503 50.4237 9.50645 50.0807C9.8906 49.7352 10.4861 49.4181 11.2536 49.2169L10.7464 47.2823C9.74799 47.5441 8.8435 47.9871 8.16912 48.5935C7.49202 49.2024 7 50.0263 7 51H9ZM13 53C11.7694 53 10.7037 52.6986 9.97896 52.2638C9.23436 51.8171 9 51.3392 9 51H7C7 52.3177 7.88493 53.3398 8.94997 53.9788C10.0349 54.6298 11.4692 55 13 55V53ZM17 51C17 51.3392 16.7656 51.8171 16.021 52.2638C15.2963 52.6986 14.2306 53 13 53V55C14.5308 55 15.9651 54.6298 17.05 53.9788C18.1151 53.3398 19 52.3177 19 51H17ZM14.7464 49.2169C15.5139 49.4181 16.1094 49.7352 16.4935 50.0807C16.875 50.4237 17 50.7435 17 51H19C19 50.0263 18.508 49.2024 17.8309 48.5935C17.1565 47.9871 16.252 47.5441 15.2536 47.2823L14.7464 49.2169ZM14 25V48.2496H16V25H14Z" fill="black" mask="url(#path-2-inside-1_152_56)"/><g clip-path="url(#clip0_152_56)"><path d="M18.3334 18.3333C18.3334 18.5101 18.2631 18.6797 18.1381 18.8047C18.0131 18.9298 17.8435 19 17.6667 19H8.33335C8.15654 19 7.98697 18.9298 7.86195 18.8047C7.73693 18.6797 7.66669 18.5101 7.66669 18.3333V12.3333H5.66669L12.5514 6.07467C12.6741 5.96299 12.8341 5.9011 13 5.9011C13.166 5.9011 13.3259 5.96299 13.4487 6.07467L20.3334 12.3333H18.3334V18.3333ZM10.3334 15V16.3333H15.6667V15H10.3334Z" fill="white"/><path d="M10.3334 14.3333V13H15.6667V14.3333H10.3334Z"/><path d="M10.3334 12.3333V11H15.6667V12.3333H10.3334Z"/></g><defs><clipPath id="clip0_152_56"><rect width="16" height="16" fill="white" transform="translate(5 5)"/></clipPath></defs></svg></div>`
                  },
                  type: "trips",
                  // iconRef: 'hub',
                  entity: "hub",
                  sequence: sequenceCount++,
                };
                waypoints.push(hubObject);
              }
            }

            if (shipment.destLat && shipment.destLng) {
              const shipmentObj = {
                id: waypointIndex,
                position: [shipment.destLat, shipment.destLng],
                title: shipment.orderNo,
                entity: "Order",
                icon: {
                  iconLocation: "images/maps/yellow.svg",
                  iconAnchor: [15, 15],
                  divIcon: true,
                  html: `<div class="leafletStandardHtmlMarker shipment delivery" style="
                                    background:${colorPalette[index]};
                                    height: 30px;
                                    width: 30px;
                                    line-height: 11px;
                                    padding-top: 5px;
                                    color: #fff;
                                    font-weight: normal !important;
                                    border-radius: 50%;
                                    font-size: 10px;
                                    box-shadow: inset 0px 0px 0px 1px #fff, 0px 1px 3px 1px rgb(0 0 0 / 41%);
                                    text-align: center;
                                    text-shadow: 0px 1px 1px #000;">${shipment.deliveryOrder}<div>D</div></div>`,
                },
                type: "trips",
                // iconRef: 'deliverLocation',
                popupRef: "tripMile",
                sequence: shipment.deliveryOrder,
              };
              waypoints.push(shipmentObj);
              markerMetaData[waypointIndex] = {
                orderNo: shipment.orderNo,
                destClientNodeName: shipment.destClientNodeName,
                address: shipment.address,
                shipmentId: shipment.shipmentId,
                lat: shipment.destLat,
                lng: shipment.destLng,
                endTimeWindow:
                  shipment.endTimeWindow && shipment.endTimeWindowTZ
                    ? convertDateTimeZone(
                        new Date(shipment.endTimeWindow),
                        shipment.endTimeWindowTZ,
                        dateFormat
                      )
                    : "Not Available",
                startTimeWindow:
                  shipment.startTimeWindow && shipment.startTimeWindowTZ
                    ? convertDateTimeZone(
                        new Date(shipment.startTimeWindow),
                        shipment.startTimeWindowTZ,
                        dateFormat
                      )
                    : "Not Available",
              };
            }
          } else if (shipment.orderType == "PICKUPLOCATION") {
            if (
              typeof shipment != "undefined" &&
              !consideredOrderHubs[thisShipmentClientId] &&
              shipment.shipmentOrderTypeCd == "DELIVER"
            ) {
              if (!consideredOrderHubs[thisShipmentClientId]) {
                //consider this hub as UINIQUE
                consideredOrderHubs[thisShipmentClientId] = true;
                orderHubColorObj[thisShipmentClientId] = colorPalette[index];
              }

              var hubObj = {
                id: "hub_" + waypointIndex,
                position: [shipment.origLat, shipment.origLng], //if PICKUP HUB, it's destination latlongs matter
                title: dynamicLabels?.["branch"]
                  ? dynamicLabels["branch"]
                  : "Hub",
                type: "trips",
                // iconRef: 'hub',
                entity: "hub",
                sequence: sequenceCount++,
                icon: {
                  iconLocation: "images/maps/red.svg",
                  iconAnchor: [13, 52],
                  divIcon: true,
                  html: `<div id="hub" class="leafletStandardHtmlMarker hub"><svg width="26" height="54" viewBox="0 0 26 54" fill="${orderHubColorObj[thisShipmentClientId]}" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="12.5" stroke="black"/><mask id="path-2-inside-1_152_56" fill="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 25H11V48.2496C9.2341 48.7126 8 49.7698 8 51C8 52.6569 10.2386 54 13 54C15.7614 54 18 52.6569 18 51C18 49.7698 16.7659 48.7126 15 48.2496V25Z"/></mask><path fill-rule="evenodd" clip-rule="evenodd" d="M15 25H11V48.2496C9.2341 48.7126 8 49.7698 8 51C8 52.6569 10.2386 54 13 54C15.7614 54 18 52.6569 18 51C18 49.7698 16.7659 48.7126 15 48.2496V25Z" fill="#C8C8C8"/><path d="M11 25V24H10V25H11ZM15 25H16V24H15V25ZM11 48.2496L11.2536 49.2169L12 49.0213V48.2496H11ZM15 48.2496H14V49.0213L14.7464 49.2169L15 48.2496ZM11 26H15V24H11V26ZM12 48.2496V25H10V48.2496H12ZM9 51C9 50.7435 9.12503 50.4237 9.50645 50.0807C9.8906 49.7352 10.4861 49.4181 11.2536 49.2169L10.7464 47.2823C9.74799 47.5441 8.8435 47.9871 8.16912 48.5935C7.49202 49.2024 7 50.0263 7 51H9ZM13 53C11.7694 53 10.7037 52.6986 9.97896 52.2638C9.23436 51.8171 9 51.3392 9 51H7C7 52.3177 7.88493 53.3398 8.94997 53.9788C10.0349 54.6298 11.4692 55 13 55V53ZM17 51C17 51.3392 16.7656 51.8171 16.021 52.2638C15.2963 52.6986 14.2306 53 13 53V55C14.5308 55 15.9651 54.6298 17.05 53.9788C18.1151 53.3398 19 52.3177 19 51H17ZM14.7464 49.2169C15.5139 49.4181 16.1094 49.7352 16.4935 50.0807C16.875 50.4237 17 50.7435 17 51H19C19 50.0263 18.508 49.2024 17.8309 48.5935C17.1565 47.9871 16.252 47.5441 15.2536 47.2823L14.7464 49.2169ZM14 25V48.2496H16V25H14Z" fill="black" mask="url(#path-2-inside-1_152_56)"/><g clip-path="url(#clip0_152_56)"><path d="M18.3334 18.3333C18.3334 18.5101 18.2631 18.6797 18.1381 18.8047C18.0131 18.9298 17.8435 19 17.6667 19H8.33335C8.15654 19 7.98697 18.9298 7.86195 18.8047C7.73693 18.6797 7.66669 18.5101 7.66669 18.3333V12.3333H5.66669L12.5514 6.07467C12.6741 5.96299 12.8341 5.9011 13 5.9011C13.166 5.9011 13.3259 5.96299 13.4487 6.07467L20.3334 12.3333H18.3334V18.3333ZM10.3334 15V16.3333H15.6667V15H10.3334Z" fill="white"/><path d="M10.3334 14.3333V13H15.6667V14.3333H10.3334Z"/><path d="M10.3334 12.3333V11H15.6667V12.3333H10.3334Z"/></g><defs><clipPath id="clip0_152_56"><rect width="16" height="16" fill="white" transform="translate(5 5)"/></clipPath></defs></svg></div>`
                },
              };

              waypoints.push(hubObj);
            }

            if (shipment.origLat && shipment.origLng) {
              var shipmentObj = {
                id: waypointIndex,
                position: [shipment.origLat, shipment.origLng], //if PICKUP order, it's origin latlongs matter
                title: shipment.orderNo,
                entity: "Order",
                icon: {
                  iconLocation: "images/maps/yellow.svg",
                  iconAnchor: [15, 15],
                  divIcon: true,
                  html: `<div class="leafletStandardHtmlMarker shipment pickup" style="
                                    background:${colorPalette[index]};
                                    height: 30px;
                                    width: 30px;
                                    line-height: 11px;
                                    padding-top: 5px;
                                    color: #fff;
                                    font-weight: normal !important;
                                    border-radius: 50%;
                                    font-size: 10px;
                                    box-shadow: inset 0px 0px 0px 1px #fff, 0px 1px 3px 1px rgb(0 0 0 / 41%);
                                    text-align: center;
                                    text-shadow: 0px 1px 1px #000;">${shipment.deliveryOrder}<div>P</div></div>`,
                },
                type: "trips",
                // iconRef: 'pickupLocation',
                popupRef: "tripMile",
                sequence: shipment.deliveryOrder,
              };
              waypoints.push(shipmentObj);
              markerMetaData[waypointIndex] = {
                lat: shipment.origLat,
                lng: shipment.origLng,
                endTimeWindow:
                  shipment.endTimeWindow && shipment.endTimeWindowTZ
                    ? convertDateTimeZone(
                        new Date(shipment.endTimeWindow),
                        shipment.endTimeWindowTZ,
                        dateFormat
                      )
                    : "Not Available",
                startTimeWindow:
                  shipment.startTimeWindow && shipment.startTimeWindowTZ
                    ? convertDateTimeZone(
                        new Date(shipment.startTimeWindow),
                        shipment.startTimeWindowTZ,
                        dateFormat
                      )
                    : "Not Available",
                title: shipment.orderNo,
                orderNo: shipment.orderNo,
                destClientNodeName: shipment.destClientNodeName,
                address: shipment.address,
                shipmentId: shipment.shipmentId,
              };
            }
          }
        });
        tripMarkerData.push({
          title: trip.tripName,
          id: trip.tripId,
          tripNo: trip.tripName,
          color: colorPalette[index],
          waypoints: waypoints,
        });
      } 
      if (considerBackToHub) {
        const hubColorObj = colorPalette[index]
        var resourceHubObj = {
          position: [trip?.originLatitude, trip?.originLongitude],
          title: 'Return to hub',
          entity: 'Return to Hub',
          icon: {
              iconLocation: 'images/maps/red.svg',
              iconAnchor: [15, 82],
              divIcon: true,
              html: `<div id="return-to-hub" class="leafletStandardHtmlMarker hub"><svg width="26" height="54" viewBox="0 0 26 54" fill="${hubColorObj}" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="12.5" stroke="black"/><mask id="path-2-inside-1_152_56" fill="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 25H11V48.2496C9.2341 48.7126 8 49.7698 8 51C8 52.6569 10.2386 54 13 54C15.7614 54 18 52.6569 18 51C18 49.7698 16.7659 48.7126 15 48.2496V25Z"/></mask><path fill-rule="evenodd" clip-rule="evenodd" d="M15 25H11V48.2496C9.2341 48.7126 8 49.7698 8 51C8 52.6569 10.2386 54 13 54C15.7614 54 18 52.6569 18 51C18 49.7698 16.7659 48.7126 15 48.2496V25Z" fill="#C8C8C8"/><path d="M11 25V24H10V25H11ZM15 25H16V24H15V25ZM11 48.2496L11.2536 49.2169L12 49.0213V48.2496H11ZM15 48.2496H14V49.0213L14.7464 49.2169L15 48.2496ZM11 26H15V24H11V26ZM12 48.2496V25H10V48.2496H12ZM9 51C9 50.7435 9.12503 50.4237 9.50645 50.0807C9.8906 49.7352 10.4861 49.4181 11.2536 49.2169L10.7464 47.2823C9.74799 47.5441 8.8435 47.9871 8.16912 48.5935C7.49202 49.2024 7 50.0263 7 51H9ZM13 53C11.7694 53 10.7037 52.6986 9.97896 52.2638C9.23436 51.8171 9 51.3392 9 51H7C7 52.3177 7.88493 53.3398 8.94997 53.9788C10.0349 54.6298 11.4692 55 13 55V53ZM17 51C17 51.3392 16.7656 51.8171 16.021 52.2638C15.2963 52.6986 14.2306 53 13 53V55C14.5308 55 15.9651 54.6298 17.05 53.9788C18.1151 53.3398 19 52.3177 19 51H17ZM14.7464 49.2169C15.5139 49.4181 16.1094 49.7352 16.4935 50.0807C16.875 50.4237 17 50.7435 17 51H19C19 50.0263 18.508 49.2024 17.8309 48.5935C17.1565 47.9871 16.252 47.5441 15.2536 47.2823L14.7464 49.2169ZM14 25V48.2496H16V25H14Z" fill="black" mask="url(#path-2-inside-1_152_56)"/><g clip-path="url(#clip0_152_56)"><path d="M18.3334 18.3333C18.3334 18.5101 18.2631 18.6797 18.1381 18.8047C18.0131 18.9298 17.8435 19 17.6667 19H8.33335C8.15654 19 7.98697 18.9298 7.86195 18.8047C7.73693 18.6797 7.66669 18.5101 7.66669 18.3333V12.3333H5.66669L12.5514 6.07467C12.6741 5.96299 12.8341 5.9011 13 5.9011C13.166 5.9011 13.3259 5.96299 13.4487 6.07467L20.3334 12.3333H18.3334V18.3333ZM10.3334 15V16.3333H15.6667V15H10.3334Z" fill="white"/><path d="M10.3334 14.3333V13H15.6667V14.3333H10.3334Z"/><path d="M10.3334 12.3333V11H15.6667V12.3333H10.3334Z"/></g><defs><clipPath id="clip0_152_56"><rect width="16" height="16" fill="white" transform="translate(5 5)"/></clipPath></defs></svg></div>`
          }
        }
        waypoints.push(resourceHubObj)
      }
      else if (!considerBackToHub && trip?.deliveryRunSheet?.length == 0) {
        toast.add(dynamicLabels.noRouteAvailable, "warning", false);
      }
    });

    setTripMapData({
      ...tripMapData,
      permission: true,
      data: [...tripMarkerData],
      metaData: {
        ...markerMetaData,
      },
      noSelectedRows: {
        ...tripMapData.noSelectedRows,
        permission: false,
      },
    });
  };
  const checkIfSameMilkRun = (selectedRows: any, defaultMilkRun: string) => {
    return (
      Object.values(selectedRows).filter(
        (row: any) => row.routeName !== defaultMilkRun
      )?.length == 0
    );
  };

  useEffect(() => {
    //set the Here maps object fetched from script tags 
        setHereMapsObject(H);
    },[H])

  useEffect(() => {
    if (Object.keys(selectedRows).length > 0) {
      const defaultMilkRun = Object.values(selectedRows)[0].routeName;
      const isMilkRunSame = checkIfSameMilkRun(selectedRows, defaultMilkRun);
      if (isMilkRunSame) {
        handleRowSelection()
          .then((data) => {
            makeMarkerData(data);
          })
          .catch(() => {
            toast.add(
              dynamicLabels.pleaseSelectTripWithFewerShipments,
              "warning",
              false
            );
          });
      } else {
        toast.add(
          dynamicLabels.pleaseSelectTripOfSameMilkrun,
          "warning",
          false
        );
      }
    } else {
      setTripMapData({
        ...tripMapData,
        noSelectedRows: {
          permission: true,
          title: dynamicLabels.selectTripsToviewOnMap
            ? dynamicLabels.selectTripsToviewOnMap
            : "Select Trip(s) to view on map",
          showArrow: true,
          showCloseIcon: true,
        },
        data: [],
      });
    }

    return () => {
      setTripMapData(intitialState);
    };
  }, [selectedRows]);

  //get the map data
  //get the icons
  //get map settings
  //get Labels

  // function initilizeMap() {
  //     const googleKey = getGoogleAPIKey();
  //     dispatch({ type: '@@tripsListViewMile/SET_GOOGLE_API', payload: googleKey });
  // }

  // useEffect(() => {
  //     initilizeMap();
  // }, [])

  // return googleApiKey ? <RouteMap googleApiKey={googleApiKey} tripData={tripData}></RouteMap> : null

  return (
    <MapDefault
      type="tripMile"
      settingAPIParam="tripMile"
      trips={tripMapData}
      legendConfig={{ rulerControl: false }}
      // getPositions={setPosition}
      //  position={position}
      // searchTextData={searchText}
      googleApiKey={googleApiKey}
      heremapsObject={heremapsObject}
      heremapsApiKey = {HERE_MAP_API_KEY}
      modeOfTravel ={modeOfTravel}
      isEditMode={6}
    />
  );
};

export default React.memo(MapView);
