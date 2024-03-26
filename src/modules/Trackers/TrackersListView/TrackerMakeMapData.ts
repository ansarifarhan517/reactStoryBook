import moment from 'moment';
import { ISettingConfigData, IMarkerData } from '../../../utils/components/Map/interface';
import { IMarkers, IRowData } from './TrackersListView.models';

const getFormattedDateTime = (dateVal: number, format: string) => {
    const newDate = new Date(dateVal)
    return moment(newDate).format(`${format} hh:mm A`);
}

const makeMapData = (results: IRowData[],
    format: string,
    settingConfigData: ISettingConfigData,
    dynamicLabels: Record<string, string>
) => {
    let markers: IMarkers[] = [];
    let metaData: IRowData | {} = {}
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
        Online: 'Online',
        'Idle': 'Idle',
        Offline: 'Offline'
    }


    // fill in the marker and metadata info in the DTO
    results.forEach((val: IRowData) => {
        if (val.latitude && val.longitude && val.deviceId) {
            val.gpsStatus === 'Offline' && offlineDas++;
            (val.gpsStatus === 'Online' || val.gpsStatus === 'Online Strong') && onlineDas++;
            (val.gpsStatus === 'Idle') && idleDas++
            val.lat = val.latitude
            val.lng = val.longitude

            markers.push({
                id: val?.deviceId,
                position: [val?.latitude, val?.longitude],
                title: val.trackeeId,
                type: 'trackers',
                popupRef: 'trackers',
                iconRef: iconRef[val?.gpsStatus],
                lat: val?.latitude,
                lng: val?.longitude,
                networkStatus: networkStatusReverseMapping?.[val?.gpsStatus]
            })

            metaData[val?.deviceId] = val;
            if (val.lastTrackedDt && metaData[val?.deviceId]) {
                metaData[val.deviceId].trackingFormattedDate = getFormattedDateTime(val?.lastTrackedDt, format)
            }
            metaData[val?.deviceId].title = val.trackeeId
        } else if (!val.latitude && !val.longitude  && val.deviceId) {
             noLocationDas++
        }
    });
    let markerData: IMarkerData = {
        permission: true,
        entities: ['trackers'],
        entitiesMap: {
            trackers: {
                permission: true,
                label: 'Trackers',
                id: 'trackeeId',
                legends: ['online', 'idle', 'offline', 'noLocation'],
                legendsMap: {
                    online: {
                        value: dynamicLabels?.online,
                        checked: settingConfigData['ONLINE'],
                        permission: true,
                        id: 'online',
                        color: '#5696d3',
                        iconRef: 'simpleBlue',
                        popupRef: 'trackers',
                        allow: (data: IRowData) => {
                            return (data?.['gpsStatus'] === 'Online')
                        },
                        extraInfo: onlineDas.toString(),
                    },
                    idle: {
                        value: dynamicLabels?.idle,
                        checked: settingConfigData['IDLE'],
                        permission: true,
                        id: 'idle',
                        color: '#f5a837',
                        iconRef: 'simpleYellow',
                        popupRef: 'trackers',
                        allow: (data: IRowData) => {
                            return (data?.['gpsStatus'] === 'Idle' || data?.['gpsStatus'] === 'Online Weak')
                        },
                        extraInfo: idleDas.toString(),
                    },
                    offline: {
                        value: dynamicLabels?.offline,
                        checked: settingConfigData['OFFLINE'],
                        permission: true,
                        id: 'offline',
                        iconRef: 'simpleRed',
                        color: '#ee5448',
                        popupRef: 'trackers',
                        allow: (data: IRowData) => {
                            return data?.['gpsStatus'] === 'Offline'
                        },
                        extraInfo: offlineDas.toString(),
                    },
                    noLocation: {
                        value: 'No Location',
                        checked: true,
                        permission: true,
                        id: 'noLocation',
                        disabled: true,
                        iconRef: 'simpleRed',
                        color: '#a5a5a5',
                        popupRef: 'trackers',
                        allow: (data: IRowData) => {
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