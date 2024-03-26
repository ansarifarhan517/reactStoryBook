import L, { LatLngBoundsExpression } from 'leaflet'
import { ISetting } from './interface'



export const updateSettingsWithLegends = (settings: ISetting, markers: Record<string, any>, settingKey: string) => {
    if (markers?.permission) {
        const entities = markers?.entities //  entities: ['orders', 'dbs'],
        const entitiesMap = markers?.entitiesMap //  entitiesMap: { orders:{},dbs:{}  }
        entities.forEach((entity: any) => {
            const _entity = entitiesMap[entity] // orders:{ legends: ['notDispatched', 'delivered']}
            if (_entity?.permission) {
                // orders:{ permission:true,legends: ['notDispatched', 'delivered']}
                const optionKeys = _entity.legends
                const legendMap = _entity.legendsMap // legendsMap:{delivered:{},notDispatched:{}}
                // delivered { value:'',color:'',checked:true,....}
                const entityOption = optionKeys
                    .map((option: string) => {
                        const _option = legendMap[option]
                        if (_option.permission) {
                            return {
                                value: _option?.value,
                                checked: _option?.checked,
                                color: _option?.color,
                                disabled: _option?.disabled,
                                permission: _option?.permission,
                                id: option,
                                allow: _option?.allow,
                                iconRef: _option.iconRef,
                                popRef: _option.popRef,
                                extraInfo: _option.extraInfo,
                                label: _option.label,
                                image: _option.image
                            }
                        }
                        return undefined
                    })
                    .filter((item: any) => !!item)

                settings[settingKey] = {
                    title: settingKey || entitiesMap[entity].label,
                    type: entity.type || 'checkbox',
                    option: entityOption
                }
                return entityOption
            }
        })
    }
    return settings;
}
export const getGoogleAPIKey = () => {
    let key = 'AIzaSyBK_OXPvgh2aAnzbgAlfSnKz3X1y_QSu0I'
    if (window.location.origin !== "https://products.loginextsolutions.com"  && window.location.origin !== "https://api.loginextsolutions.com") {
        // dev
        if (window.location.origin === 'http://localhost:9001') {
            key = 'AIzaSyCjiaID1JW2sH7unnqrtsIlopaCU959-GA';
        } else {
            key = 'AIzaSyBRSPezYnzgMCTOLaFpf0Z1LE4lpPCP8-Q';
        }
    }
    return key
}

export const dynamicLabelMapping = (dynamicLabels: Record<string, string>) => {
    return {
        mapMode: dynamicLabels?.mapMode || 'Map Mode',
        markers: dynamicLabels?.markers || 'Markers',
        heatMap: dynamicLabels?.heatMap || 'HeatMap',
        legends: dynamicLabels?.legends || 'Legends',
        mapType: dynamicLabels?.maptype || 'Map Type',
        google: dynamicLabels?.google || 'Google',
        mapSource: dynamicLabels?.mapSource || 'Map Source',
        enablingGoogleMaps: dynamicLabels?.enablingGoogleMaps || 'Enabling google maps.',
        roadMap: dynamicLabels?.roadMap || 'Roadmap',
        enablingStandardRoadMap: dynamicLabels?.enablingStandardRoadMap || 'Enabling standard roadmap.',
        terrain: dynamicLabels?.terrain || 'terrain',
        enablingTerrain: dynamicLabels?.enablingTerrain || 'Enabling terrain.',
        enablingSatellite: dynamicLabels?.enablingSatellite || 'Enabling satellite imagery.',
        hybrid: dynamicLabels?.hybrid || 'Hybrid',
        satellite: dynamicLabels?.satellite || 'Satellite',
        enablingHybridGoogleMap: dynamicLabels?.enablingHybridGoogleMap || 'Enabling hybrid google map.',
        openSteetMap: dynamicLabels?.openSteetMap || 'Open street Maps',
        enablingOpenStreetMap: dynamicLabels?.enablingOpenStreetMap || 'Enabling openStreet maps.',
        standard: dynamicLabels?.standard || 'Standard',
        enablingHumanitarian: dynamicLabels?.enablingHumanitarian || 'Enabling humanitarian openStreet maps.',
        humanitarian: dynamicLabels?.humanitarian || 'Humanitarian',
        cycle: dynamicLabels?.cycle || 'Cycle (demo)',
        transport: dynamicLabels?.transport || 'Transport (demo)',
        enablingCyclingOsm: dynamicLabels?.enablingCyclingOsm || 'Enabling openStreet maps for cycles.',
        enablingTransport: dynamicLabels?.enablingTransport || 'Enabling openStreet maps for transportation.',
        geofences: dynamicLabels?.geofences || 'Geofences',
        showAllGeoFences: dynamicLabels?.showAllGeoFences || 'Show all geofences',
        mapTheme: dynamicLabels?.mapTheme || 'Map Theme',
        day: dynamicLabels?.day || 'Day',
        enablingDay: dynamicLabels?.enablingDay || 'Enabling day view.',
        night: dynamicLabels?.night || 'Night',
        enablingNight: dynamicLabels?.enablingNight || 'Enabling night view.',
        miscellaneous: dynamicLabels?.miscellaneous || 'Miscellaneous',
        poi: dynamicLabels?.poi || 'Point of interest',
        enablingPoi: dynamicLabels?.enablingPoi || 'Enabling pointes of interest (poi) on map : better search experience and detailed map.',
        disablingPoi: dynamicLabels?.disablingPoi || 'Disabling pointes of interest (poi) from map.',
        traffic: dynamicLabels?.traffic || 'Traffic',
        disablingTraffic: dynamicLabels?.disablingTraffic || 'Disabling traffic from map.',
        enablingTraffic: dynamicLabels?.enablingTraffic || 'Enable traffic from map.',
        rulerControl: dynamicLabels?.rulerControl || 'Ruler Control',
        enablingRuler: dynamicLabels?.enablingRuler || 'Enabling ruler control on map.',
        disablingRuler: dynamicLabels?.disablingRuler || 'Disabling ruler control from map.',
        enablingLocationSearch: dynamicLabels?.enablingLocationSearch || 'Enabling location search widget on map.',
        disablingLocationSearch: dynamicLabels?.disablingLocationSearch || 'Disabling location search widget from map.',
        locationSearch: dynamicLabels?.locationSearch || 'Location Search'

    }
}

//Calculate bounds explicitly for Circle data
export const getCircleLatRadius = (cRadius: number) => {
    return (cRadius / 40075017) * 360;
};

export const getCircleLngRadius = (cRadius: number, cLat: number) => {
    return getCircleLatRadius(cRadius) / Math.cos(((Math.PI / 180)) * cLat);
}

export const getCircleBounds = (cRadius: number, cLat: number, cLng: number) => {
    let lngRadius = getCircleLngRadius(cRadius, cLat);
    let latRadius = getCircleLatRadius(cRadius);
    let sw = new L.LatLng(cLat - latRadius, cLng - lngRadius);
    let ne = new L.LatLng(cLat + latRadius, cLng + lngRadius);
    return [[sw.lat, sw.lng], [ne.lat, ne.lng]] as LatLngBoundsExpression;
}

export const handleExtractCircleCoords = (point: string) => {
    const match = point?.match(/\(([-.\d]+)\s+([-.\d]+)\)/);
    if (match) {
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[2]);
        return { latitude, longitude };
    }
    return null;
};

export const handleExtractPolygonCoords = (point: string) => {
    const matches = point?.matchAll(/([-.\d.]+)\s+([-.\d]+)/g);
    // const matches = point?.matchAll(/([\d.]+)\s+([\d.]+)/g);
    const coordinates: { latitude: number; longitude: number }[] = [];
    for (const match of matches) {
        const [_, latitude, longitude] = match;
        coordinates.push({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        });
    }
    return coordinates;
};

const validLatCharsRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/
const validLongCharsRegex = /^[-+]?((1[0-7]|[1-9])?\d(\.\d+)?|180(\.0+)?)$/
export const isValidLatitude = (lat: any) => {
    return validLatCharsRegex.test(lat)
}
export const isValidLongitude = (lng: any) => {
    return validLongCharsRegex.test(lng)
}