export default {
    'Map Mode': {
        title: 'Map Mode',
        type: 'radio',
        option: [
            {
                name: 'Markers', // for image make provision
                selected: true,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Markers.png',
                permission: true
            },
            {
                name: 'HeatMap',
                selected: false,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Heatmap.png',
                permission: true
            }
        ],
        permission: true
    },
    Legends: {
        title: '',
        type: 'checkbox',
        option: []
    },
    // Format for dynamic legends
    // Legends: {
    //   title: 'Legends',
    //   type: 'checkbox',
    //   option: [
    //     {
    //       name: 'Offline',
    //       selected: true,
    //       color:'blue'
    //     },
    //     {
    //       name: 'OnLine Weak signal',
    //       selected: false,
    //       color:'red'
    //     },
    //     {
    //       name: 'OnLine Strong signal',
    //       selected: false,
    //       color:'yellow'
    //     },
    //     {
    //       name: 'No Location',
    //       selected: false,
    //       disabled: true,
    //       color:'green'
    //     }
    //   ]
    // },
    'Map Type': {
        title: 'Map Type',
        type: 'dependent',
        option: [
            {
                id: 'google',
                name: 'Google',
                selected: true,
                title: 'Map Source',
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Google.png',
                subOptions: [
                    {
                        name: 'Roadmap',
                        selected: true,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Roadmap.png',
                        id: 'google_roadmap'
                    },
                    {
                        name: 'Terrain',
                        selected: false,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Terrain.png',
                        id: 'google_terrain'
                    },
                    {
                        name: 'Satellite',
                        selected: false,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Satellite.png',
                        id: 'google_satellite'
                    },
                    {
                        name: 'Hybrid',
                        selected: false,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Hybrid.png',
                        id: 'google_hybrid'
                    }
                ]
            },
            {
                id: 'osm',
                name: 'Open Street Maps',
                selected: false,
                title: 'Map Source',
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/OSM.png',
                subOptions: [
                    {
                        name: 'Standard',
                        selected: true,
                        id: 'osm_standard',
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Roadmap.png'
                    },
                    {
                        name: 'Humanitarian',
                        selected: false,
                        id: 'osm_humanitarian',
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Humanitarian.png'
                    },
                    {
                        name: 'Cycle (demo)',
                        selected: false,
                        image:
                            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Cycle.png',
                        id: 'osm_cycle'
                    },
                    {
                        name: 'Transport (demo)',
                        selected: false,
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
                selected: true,
                id: 'light',
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Day.png'
            },
            {
                name: 'Night',
                selected: false,
                id: 'dark',
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Night.png'
            }
        ]
    },
    Miscellaneous: {
        title: 'Miscellaneous',
        type: 'toggle',
        option: [
            {
                name: 'Point of interest',

                selected: false,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/POI.png'
            },
            {
                name: 'Traffic',

                selected: false,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Traffic.png'
            },
            {
                name: 'Ruler Control',

                selected: false,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Ruler.png'
            },
            {
                name: 'Location Search',
                selected: false,
                image:
                    'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Search_gray.png'
            }
        ]
    }
}
