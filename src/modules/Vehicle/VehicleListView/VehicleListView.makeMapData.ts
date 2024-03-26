import moment from 'moment';
import { IMarkerData, ISettingConfigData } from '../../../utils/components/Map/interface';
import { IRowData } from './VehicleListView.models';



export const getFormattedDate = (dateVal: number, format: string) => {
    const newDate = new Date(dateVal)
    return moment(newDate).format(`${format} hh:mm A`);
}

const makeMapData = (results: Record<string, any>,
    format: string,
    settingConfigData: ISettingConfigData,
    dynamicLabels: Record<string, string>) => {
    let markers: Record<string, any>[] = [];
    let metaData: IRowData | {} = {}
    let heatMapData: any[] = []

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
    const setNetWorkStatus = (status: string) => {
        let gpsStatus =status
            switch (status) {
            case 'Online':
            case 'Online Strong':
                gpsStatus= 'onlineStrong'
                break;
            case 'Idle':
            case 'Online Weak':
                gpsStatus= 'onlineWeak'
                break;
            case 'Offline':
                gpsStatus= 'Offline'
                break;
        }
        return gpsStatus
    }

    // fill in the marker and metadata info in the DTO
    results?.forEach((val: IRowData) => {
        if (val.lat && val.lng && val.isActiveFl && val.vehicleId) {
            if (val.gpsStatus === 'Offline') {
                offlineDas = offlineDas + 1
            } else if (val.gpsStatus === 'Online') {
                onlineDas = onlineDas + 1
            } else if (val.gpsStatus === 'Idle') {
                idleDas = idleDas + 1
            } else {
                noLocationDas = noLocationDas + 1
            }
            heatMapData.push([val?.lat, val?.lng])
            markers.push({
                id: val.vehicleId,
                position: [val.lat, val.lng],
                title: val.vehicleNumber,
                type: 'vehicle',
                popupRef: 'vehicle',
                iconRef: iconRef[val.gpsStatus],
                lat: val.lat,
                lng: val.lng,
                gpsStatus: setNetWorkStatus(val.gpsStatus)
            })

            metaData[val.vehicleId] = val;
            if (val.lastTrackingDate && metaData[val.vehicleId]) {
                metaData[val.vehicleId].trackingFormattedDate = getFormattedDate(val?.lastTrackingDate, format)
            }
            metaData[val.vehicleId].title = val.vehicleNumber
        } else if (!val.lat && !val.lng && val.isActiveFl && val.vehicleId) {
            noLocationDas = noLocationDas + 1
        }
    });

    let markerData: IMarkerData = {
        permission: true,
        entities: ['vehicle'],
        entitiesMap: {
            vehicle: {
                permission: true,
                label: 'vehicle',
                id: 'vehicle',
                legends: ['offline', 'onlineWeak', 'onlineStrong', 'noLocation'],
                legendsMap: {
                    offline: {
                        value: dynamicLabels?.offline,
                        checked: settingConfigData['OFFLINE'],
                        permission: true,
                        id: 'offline',
                        iconRef: 'simpleRed',
                        color: '#ee5448',
                        popupRef: 'vehicle',
                        allow: (data: Record<string, any>) => {
                            return data?.['gpsStatus'] === 'Offline'
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
                        popupRef: 'vehicle',
                        allow: (data: Record<string, any>) => {
                            return (data?.['gpsStatus'] === 'Idle' || data?.['gpsStatus'] === 'Online Weak')
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
                        popupRef: 'vehicle',
                        allow: (data: Record<string, any>) => {
                            return (data?.['gpsStatus'] === 'Online' || data?.['gpsStatus'] === 'Online Strong')
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
                        popupRef: 'vehicle',
                        allow: (data: Record<string, any>) => {
                            return !data?.['gpsStatus']
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