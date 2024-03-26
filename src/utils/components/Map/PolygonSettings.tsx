import { dynamicLabelMapping } from './MapHelper';

export const settings = (dynamicLabels: Record<string, string>) => ({
    'Map Mode': {
        title: 'Map Mode',
        type: 'radio',
        option: [
            {
                name: 'Markers',
                selected: true,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Markers.png',
                permission: true,
                id: 'markers',
                label: dynamicLabelMapping(dynamicLabels)?.markers,
            },
            {
                name: 'HeatMap',
                selected: false,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Heatmap.png',
                permission: true,
                id: 'heatmap',
                label: dynamicLabelMapping(dynamicLabels)?.heatMap,
            }
        ],
        permission: false
    },
    'Map Type': {
        title: 'Map Type',
        type: 'dependent',
        label: dynamicLabelMapping(dynamicLabels)?.mapType,
        option: [
            {
                name: 'Google',
                selected: true,
                title: 'Map Source',
                label: dynamicLabelMapping(dynamicLabels)?.google,
                id: 'google',
                enablingToasterMessage: dynamicLabelMapping(dynamicLabels)?.enablingGoogleMaps,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Google.png',
                subOptions: [
                    {
                        name: 'Roadmap',
                        selected: true,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Roadmap.png',
                        id: 'google_roadmap',
                        enablingToasterMessage: dynamicLabelMapping(dynamicLabels)?.enablingStandardRoadMap,
                        label: dynamicLabelMapping(dynamicLabels)?.roadMap,
                    },
                    {
                        name: 'Terrain',
                        selected: false,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Terrain.png',
                        id: 'google_terrain',
                        enablingToasterMessage: dynamicLabelMapping(dynamicLabels)?.enablingTerrain,
                        label: dynamicLabelMapping(dynamicLabels)?.terrain,

                    },
                    {
                        name: 'Satellite',
                        selected: false,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Satellite.png',
                        id: 'google_satellite',
                        enablingToasterMessage: dynamicLabelMapping(dynamicLabels)?.enablingSatellite,
                        label:  dynamicLabelMapping(dynamicLabels)?.satellite,
                    },
                    {
                        name: 'Hybrid',
                        selected: false,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Hybrid.png',
                        id: 'google_hybrid',
                        enablingToasterMessage:  dynamicLabelMapping(dynamicLabels)?.enablingHybridGoogleMap,
                        label:  dynamicLabelMapping(dynamicLabels)?.hybrid,
                    }
                ]
            },
            {
                name: 'Open Street Maps',
                selected: false,
                title: 'Map Source',
                label: dynamicLabelMapping(dynamicLabels)?.openSteetMap,
                id: 'osm',
                enablingToasterMessage:  dynamicLabelMapping(dynamicLabels)?.enablingOpenStreetMap,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/OSM.png',
                subOptions: [
                    {
                        name: 'Standard',
                        selected: true,
                        label:  dynamicLabelMapping(dynamicLabels)?.standard,
                        id: 'osm_standard',
                        enablingToasterMessage:  dynamicLabelMapping(dynamicLabels)?.enablingOpenStreetMap,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Roadmap.png'
                    },
                    {
                        name: 'Humanitarian',
                        selected: false,
                        id: 'osm_humanitarian',
                        label:dynamicLabelMapping(dynamicLabels)?.humanitarian,
                        enablingToasterMessage: dynamicLabelMapping(dynamicLabels)?.enablingHumanitarian,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Humanitarian.png'
                    },
                    {
                        name: 'Cycle (demo)',
                        selected: false,
                        enablingToasterMessage: dynamicLabelMapping(dynamicLabels)?.enablingCyclingOsm,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Cycle.png',
                        id: 'osm_cycle',
                        label: dynamicLabelMapping(dynamicLabels)?.cycle,
                    },
                    {
                        name: 'Transport (demo)',
                        selected: false,
                        label: dynamicLabelMapping(dynamicLabels)?.transport,
                        enablingToasterMessage:
                        dynamicLabelMapping(dynamicLabels)?.transport,
                        id: 'osm_transport',
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Transit.png'
                    }
                ]
            }
        ]
    },
    Geofences: {
        title: 'Geofences',
        type: 'toggle',
        option: [
            {
                name: 'Show all geofences',
                selected: false,
                label:  dynamicLabelMapping(dynamicLabels)?.showAllGeoFences,
                id: 'geofence',
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/All_geofences.png'
            }
        ],
        permission: false
    },
    'Map Theme': {
        title: 'Map Theme',
        type: 'radio',
        option: [
            {
                name: 'Day',
                label: dynamicLabelMapping(dynamicLabels)?.day,
                selected: true,
                id: 'light',
                enablingToasterMessage: dynamicLabelMapping(dynamicLabels)?.enablingDay,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Day.png'
            },
            {
                name: 'Night',
                selected: false,
                label: dynamicLabelMapping(dynamicLabels)?.night,
                id: 'dark',
                enablingToasterMessage: dynamicLabelMapping(dynamicLabels)?.enablingNight,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Night.png'
            }
        ]
    },
    Miscellaneous: {
        title: 'Miscellaneous',
        type: 'toggle',
        label:  dynamicLabelMapping(dynamicLabels)?.miscellaneous,
        option: [
            {
                name: 'Point of interest',
                label:  dynamicLabelMapping(dynamicLabels)?.poi,
                enablingToasterMessage:
                dynamicLabelMapping(dynamicLabels)?.enablingPoi,
                disablingToasterMessage: dynamicLabelMapping(dynamicLabels)?.disablingPoi,
                selected: false,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/POI.png'
            },
            {
                name: 'Traffic',
                label: dynamicLabelMapping(dynamicLabels)?.traffic,
                disablingToasterMessage:  dynamicLabelMapping(dynamicLabels)?.disablingTraffic,
                enablingToasterMessage:  dynamicLabelMapping(dynamicLabels)?.enablingTraffic,
                selected: false,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Traffic.png'
            },
            {
                name: 'Ruler Control',
                enablingToasterMessage:  dynamicLabelMapping(dynamicLabels)?.enablingRuler,
                disablingToasterMessage:  dynamicLabelMapping(dynamicLabels)?.disablingRuler,
                selected: false,
                label:  dynamicLabelMapping(dynamicLabels)?.rulerControl,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Ruler.png'
            }
        ]
    }
})
