// import moment from 'moment';
import { ISettingConfigData, IMarkerData } from '../../../../utils/components/Map/interface';
import { IBranchConfigurationMapMarkers, IBranchConfigurationListViewRowData } from '../BranchConfiguration.models';

const makeMapData = (results: IBranchConfigurationListViewRowData[],
    settingConfigData: ISettingConfigData,
    dynamicLabels: Record<string, string>
    
) => {
    let markers: IBranchConfigurationMapMarkers[] = [];
    let metaData: IBranchConfigurationListViewRowData | {} = {}
    let offlineDas = 0
    let onlineDas = 0
    let idleDas = 0
    let noLocationDas = 0

    // fill in the marker and metadata info in the DTO
    results.forEach((val: IBranchConfigurationListViewRowData) => {
        if (val.lat && val.lng && val.clientBranchId) {
            markers.push({
                id: val?.clientBranchId,
                position: [val?.lat, val?.lng],
                title: val.name,
                type: 'branch',
                popupRef: 'branch',
                iconRef: 'simpleBlue',
                lat: val.lat,
                lng: val.lng
            })
            metaData[val?.clientBranchId] = val;
            if (val.name && metaData[val?.name]) {
                metaData[val.clientBranchId].name = val.name;
            }
            metaData[val?.clientBranchId].title = val.name
        }
    });

    let markerData: IMarkerData = {
        permission: true,
        entities: ['branch'],
        entitiesMap: {
            branch: {
                permission: true,
                label: 'Client Branch',
                id: 'branch',
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
                        allow: (data: IBranchConfigurationListViewRowData) => {
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
                        allow: (data: IBranchConfigurationListViewRowData) => {
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
                        allow: (data: IBranchConfigurationListViewRowData) => {
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
                        allow: (data: IBranchConfigurationListViewRowData) => {
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