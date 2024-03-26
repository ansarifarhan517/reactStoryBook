import moment from 'moment';
import { ISettingConfigData, IMarkerData } from '../../../utils/components/Map/interface';
import { IMarkers, IRowData } from './DeliveryAssociate.models';




const getFormattedDateTime = (dateVal: number, format: string) => {
    const newDate = new Date(dateVal)
    return moment(newDate).format(`${format} hh:mm A`);
}

const makeMapData = (results: IRowData[],
    format: string,
    settingConfigData: ISettingConfigData,
    dynamicLabels: Record<string, string>
) => {
    //dynamic labels needs to be ask to ajay-> hooks
    let markers: IMarkers[] = [];
    let metaData: IRowData | {} = {}
    // here on the basis of status push marker
    const iconRef = {
        Offline: 'simpleRed',
        Online: 'simpleBlue',
        Idle: 'simpleYellow'
    }
    let offlineDas = 0
    let onlineDas = 0
    let idleDas = 0
    let noLocationDas = 0

    // set same status which we are using in legends on map

    const networkStatusReverseMapping ={
        Online: 'onlineStrong',
        'Online Strong': 'onlineStrong',
        'Idle': 'onlineWeak',
        'Online Weak': 'onlineWeak',
        Offline: 'Offline'
    }


    // fill in the marker and metadata info in the DTO
    results.forEach((val: IRowData) => {
        if (val.lat && val.lng && val.deliveryMediumMasterId) {
            val.networkStatus === 'Offline' && offlineDas++;
            (val.networkStatus === 'Online' || val.networkStatus === 'Online Strong') && onlineDas++;
            (val.networkStatus === 'Idle' || val.networkStatus === 'Online Weak') && idleDas++
           

            markers.push({
                id: val?.deliveryMediumMasterId,
                position: [val?.lat, val?.lng],
                title: val.deliveryMediumMasterName,
                type: 'deliveryMedium',
                popupRef: 'deliveryMedium',
                iconRef: iconRef[val?.networkStatus],
                lat: val.lat,
                lng: val.lng,
                networkStatus: networkStatusReverseMapping?.[val?.networkStatus]
            })

            metaData[val?.deliveryMediumMasterId] = val;
            if (val.trackingDate && metaData[val?.deliveryMediumMasterId]) {
                metaData[val.deliveryMediumMasterId].trackingFormattedDate = getFormattedDateTime(val?.trackingDate, format)
            }
            metaData[val?.deliveryMediumMasterId].title = val.deliveryMediumMasterName
        } else if (!val.lat && !val.lng  && val.deliveryMediumMasterId) {
             noLocationDas++
        }
    });

    let markerData: IMarkerData = {
        permission: true,
        entities: ['deliveryMedium'],
        entitiesMap: {
            deliveryMedium: {
                permission: true,
                label: 'Delivery Medium',
                id: 'deliveryMedium',
                legends: ['offline', 'onlineWeak', 'onlineStrong', 'noLocation'],
                legendsMap: {
                    offline: {
                        value: dynamicLabels?.offline,
                        checked: settingConfigData['OFFLINE'],
                        permission: true,
                        id: 'offline',
                        iconRef: 'simpleRed',
                        color: '#ee5448',
                        popupRef: 'deliveryMedium',
                        allow: (data: IRowData) => {
                            return data?.['networkStatus'] === 'Offline'
                        },
                        extraInfo: offlineDas.toString(),
                    },
                    onlineWeak: {
                        value: dynamicLabels?.onlineWeak,
                        checked: settingConfigData['ONLINEWEAK'],
                        permission: true,
                        id: 'onlineWeak',
                        color: '#f5a837',
                        iconRef: 'simpleYellow',
                        popupRef: 'deliveryMedium',
                        allow: (data: IRowData) => {
                            return (data?.['networkStatus'] === 'Idle' || data?.['networkStatus'] === 'Online Weak')
                        },
                        extraInfo: idleDas.toString(),
                    },
                    onlineStrong: {
                        value: dynamicLabels?.onlineStrong,
                        checked: settingConfigData['ONLINESTRONG'],
                        permission: true,
                        id: 'onlineStrong',
                        iconRef: 'simpleBlue',
                        color: '#5696d3',
                        popupRef: 'deliveryMedium',
                        allow: (data: IRowData) => {
                            return (data?.['networkStatus'] === 'Online' || data?.['networkStatus'] === 'Online Strong')
                        },
                        extraInfo: onlineDas.toString(),
                    },
                    noLocation: {
                        value: 'No Location',
                        checked: true,
                        permission: true,
                        id: 'noLocation',
                        disabled: true,
                        iconRef: 'simpleRed',
                        color: '#a5a5a5',
                        popupRef: 'deliveryMedium',
                        allow: (data: IRowData) => {
                            return !data?.['networkStatus']
                        },
                        extraInfo: noLocationDas.toString()
                    },

                },
                markers: {
                    list: markers,
                    metaData: metaData,
                }
            }
        }
    }
    return markerData;
}


export default makeMapData;