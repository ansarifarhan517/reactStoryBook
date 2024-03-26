// import moment from 'moment';
import { IMarkerData } from '../../../utils/components/Map/interface';
import { IMarkers, IRowData } from './OrderListView.models';




// const getFormattedDateTime = (dateVal: number, format: string) => {
//     const newDate = new Date(dateVal)
//     return moment(newDate).format(`${format} hh:mm A`);
// }

const makeMapData = (results: IRowData[],
    format: string
) => {

    console.log(results, format);
    let metaData: IRowData | {} = {}
    let markers: IMarkers[] = [];
    let CANCELLED = 0
    let DELIVERED = 0
    let INTRANSIT = 0
    let NOTDELIVERED = 0
    let NOTDISPATCHED = 0
    let NOTPICKEDUP = 0
    let PICKEDUP = 0

    results.forEach((val: IRowData) => {
        switch (val.orderStatus) {
            case 'CANCELLED':
                CANCELLED++
                break;
            case 'DELIVERED':
                DELIVERED++
                break;
            case 'INTRANSIT':
                INTRANSIT++
                break;
            case 'NOTDELIVERED':
                NOTDELIVERED++
                break;
            case 'NOTDISPATCHED':
                NOTDISPATCHED++
                break;
            case 'NOTPICKEDUP':
                NOTPICKEDUP++
                break;
            case 'PICKEDUP':
                PICKEDUP++
                break;
        }
        if(val?.latitude && val?.longitude){
        markers.push({
            id: val?.orderNo,
            position: [val?.latitude, val?.longitude],
            title: val.orderNo,
            type: 'order',
            popupRef: 'order',
            iconRef: `${val.orderType}_${val.orderStatus}`,
            lat: val?.latitude,
            lng: val?.longitude,
            networkStatus: '',
            orderStatus: val.orderStatus
        })
    }

        metaData[val?.orderNo] = val;
        metaData[val?.orderNo].title = val.orderNo
    });

    let markerData: IMarkerData = {
        permission: true,
        entities: ['orders'],
        entitiesMap: {
            orders: {
                "permission": true,
                "label": "order",
                "id": "order",
                "legends": [
                    "notDispatched",
                    "delivered",
                    "cancelled",
                    "inTransit",
                    "notDelivered",
                    "notPickedUp",
                    "pickedUp"
                ],
                "legendsMap": {
                    "delivered": {
                        "value": "Delivered ",
                        "checked": true,
                        "permission": true,
                        "id": "delivered    ",
                        "iconRef": "simpleRed",
                        "color": "#5698d3",
                        "popupRef": "order",
                        "extraInfo": DELIVERED.toString(),
                        allow: () => true
                    },
                    "notDispatched": {
                        "value": "Not Dispatched",
                        "checked": true,
                        "permission": true,
                        "id": "notDispatched",
                        "color": "#ef5548",
                        "iconRef": "simpleRed",
                        "popupRef": "order",
                        "extraInfo": NOTDISPATCHED.toString(),
                        allow: () => true
                    },
                    "cancelled": {
                        value: "Cancelled",
                        "checked": true,
                        "permission": true,
                        "id": "cancelled",
                        "color": "grey",
                        "iconRef": "simpleRed",
                        "popupRef": "order",
                        "extraInfo": CANCELLED.toString(),
                        allow: () => true
                    },
                    "inTransit": {
                        value: "Intransit",
                        "checked": true,
                        "permission": true,
                        "id": "intransit",
                        "color": "#f5a837",
                        "iconRef": "simpleRed",
                        "popupRef": "order",
                        "extraInfo": INTRANSIT.toString(),
                        allow: () => true
                    },
                    "notDelivered": {
                        value: "Attempted Delivery",
                        "checked": true,
                        "permission": true,
                        "id": "cancelled",
                        "color": "grey",
                        "iconRef": "simpleRed",
                        "popupRef": "order",
                        "extraInfo": NOTDELIVERED.toString(),
                        allow: () => true
                    },
                    "notPickedUp": {
                        value: "Attempted Pickup",
                        "checked": true,
                        "permission": true,
                        "id": "notPickedUp",
                        "color": "white",
                        "iconRef": "simpleRed",
                        "popupRef": "order",
                        "extraInfo": NOTPICKEDUP.toString(),
                        allow: () => true
                    },
                    "pickedUp": {
                        value: "Picked Up",
                        "checked": true,
                        "permission": true,
                        "id": "pickedUp",
                        "color": "#6fc64f",
                        "iconRef": "simpleRed",
                        "popupRef": "order",
                        "extraInfo": PICKEDUP.toString(),
                        allow: () => true
                    }
                },
                "markers": {
                    "list": markers,
                    metaData: metaData
                }
            }
        }
    }

    return markerData;
}


export default makeMapData;



