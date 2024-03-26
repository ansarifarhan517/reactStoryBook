export default {
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
          label: 'Markers'
        },
        {
          name: 'HeatMap',
          selected: false,
          image:
            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Heatmap.png',
          permission: true,
          id: 'heatmap',
          label: 'HeatMap'
        }
      ],
      permission: true
    },
    Legends: {
      permission: true,
      title: '',
      type: 'checkbox',
      option: []
    },
    'Map Type': {
      title: 'Map Type',
      type: 'dependent',
      label: 'Map Type',
      option: [
        {
          name: 'Google',
          selected: true,
          title: 'Map Source',
          label: 'Google',
          id: 'google',
          enablingToasterMessage: 'Enabling Google Maps',
          image:
            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Google.png',
          subOptions: [
            {
              name: 'Roadmap',
              selected: true,
              image:
                'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Roadmap.png',
              id: 'google_roadmap',
              enablingToasterMessage: 'Enabling standard roadmap',
              label: 'Roadmap'
            },
            {
              name: 'Terrain',
              selected: false,
              image:
                'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Terrain.png',
              id: 'google_terrain',
              enablingToasterMessage: 'Enabling terrain',
              label: 'Terrain'
            },
            {
              name: 'Satellite',
              selected: false,
              image:
                'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Satellite.png',
              id: 'google_satellite',
              enablingToasterMessage: 'Enabling satellite imagery',
              label: ''
            },
            {
              name: 'Hybrid',
              selected: false,
              image:
                'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Hybrid.png',
              id: 'google_hybrid',
              enablingToasterMessage: 'Enabling hybrid Google map',
              label: ''
            }
          ]
        },
        {
          name: 'Open Street Maps',
          selected: false,
          title: 'Map Source',
          id: 'osm',
          enablingToasterMessage: 'Enabling OpenStreet Maps',
          image:
            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/OSM.png',
          subOptions: [
            {
              name: 'Standard',
              selected: true,
              label: 'Standard',
              id: 'osm_standard',
              enablingToasterMessage: 'Enabling OpenStreet Maps',
              image:
                'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Roadmap.png'
            },
            {
              name: 'Humanitarian',
              selected: false,
              id: 'osm_humanitarian',
              enablingToasterMessage: 'Enabling humanitarian OpenStreet Maps',
              image:
                'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Humanitarian.png'
            },
            {
              name: 'Cycle (demo)',
              selected: false,
              enablingToasterMessage: 'Enabling OpenStreet Maps for cycles',
              image:
                'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Cycle.png',
              id: 'osm_cycle',
              label: 'Cycle (demo)'
            },
            {
              name: 'Transport (demo)',
              selected: false,
              label: 'Transport (demo)',
              enablingToasterMessage:
                'Enabling OpenStreet Maps for transportation',
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
          label: 'Show all geofences',
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
          label: 'Day',
          selected: true,
          id: 'light',
          enablingToasterMessage: 'Enabling day view',
          image:
            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Day.png'
        }
      ]
    },
    Miscellaneous: {
      title: 'Miscellaneous',
      type: 'toggle',
      label: 'Miscellaneous',
      option: [
        {
          name: 'Point of interest',
          label: 'Point of interest',
          enablingToasterMessage:
            'Enabling Pointes of Interest (poi) on map : Better search experience and detailed map.',
          disablingToasterMessage: 'Disabling Pointes of Interest (poi) from map',
          selected: false,
          image:
            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/POI.png'
        },
        {
          name: 'Traffic',
          label: 'Traffic',
          disablingToasterMessage: 'Disabling traffic from map.',
          enablingToasterMessage: 'Enable traffic from map.',
          selected: false,
          image:
            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Traffic.png'
        },
        {
          name: 'Ruler Control',
          enablingToasterMessage: 'Enabling Ruler control on map.',
          disablingToasterMessage: 'Disabling Ruler control from map.',
          selected: false,
          label: 'Ruler Control',
          image:
            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Ruler.png'
        },
        {
          name: 'Location Search',
          selected: true,
          label: 'Location Search',
          enablingToasterMessage: 'Enabling location search widget on map.',
          disablingToasterMessage: 'Disabling location search widget from map',
          image:
            'https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/Search_gray.png'
        }
      ]
    }
  }
  