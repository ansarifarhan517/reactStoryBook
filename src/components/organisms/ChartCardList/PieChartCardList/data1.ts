export default [
  {
    title: 'Total Parcels',
    total: 520,
    fulfilment: '+5677.78',
    selected: false,
    payload: [
      { name: 'Delivered', value: 518, color: '#82b8e5', active: true },
      { name: 'Attempted Pickup', value: 1, color: '#f05548', active: true },
      { name: 'Attempted Delivery', value: 1, color: '#f0ad48', active: true },
      { name: 'Cancelled', value: 0, color: '#9b4848', active: true }
    ]
  },
  {
    title: 'Check In Compliant Parcels',
    total: 515,
    fulfilment: '+10200',
    selected: false,
    payload: [
      {
        name: 'Parcels Checked In Within Geofence',
        value: 0,
        color: '#82b8e5',
        active: true
      },
      {
        name: 'Parcels Checked In Outside Geofence',
        value: 515,
        color: '#f05548',
        active: true
      }
    ]
  },
  {
    title: 'Check Out Compliant Parcels',
    total: 516,
    fulfilment: '+8500',
    selected: false,
    payload: [
      {
        name: 'Parcels Checked Out Within Geofence',
        value: 0,
        color: '#82b8e5',
        active: true
      },
      {
        name: 'Parcels Checked Out Outside Geofence',
        value: 516,
        color: '#f05548',
        active: true
      }
    ]
  },
  {
    title: 'Delivery Time Compliant Parcels',
    total: 7,
    fulfilment: '+133.33',
    selected: false,
    payload: [
      {
        name: 'Pickup Parcels Delivered On Time',
        value: 6,
        color: '#82b8e5',
        active: true
      },
      {
        name: 'Pickup Parcels Delayed Delivery',
        value: 2,
        color: '#f0ad48',
        active: true
      },
      {
        name: 'Delivery Parcels Delivered On Time',
        value: 1,
        color: '#f05548',
        active: true
      },
      {
        name: 'Delivery Parcels Delayed Delivery',
        value: 1,
        color: '#006279',
        active: true
      }
    ]
  },
  {
    title: 'Distance Travelled Compliant Parcels',
    total: 2,
    fulfilment: '0',
    selected: false,
    payload: [
      {
        name: 'Pickup Parcels Distance Compliant',
        value: 2,
        color: '#82b8e5',
        active: true
      },
      {
        name: 'Delivery Parcels Distance Compliant',
        value: 0,
        color: '#f0ad48',
        active: true
      },
      {
        name: 'Pickup Parcels Distance Non Compliant',
        value: 1,
        color: '#f05548',
        active: true
      },
      {
        name: 'Delivery Parcels Distance Non Compliant',
        value: 0,
        color: '#006279',
        active: true
      }
    ]
  },
  {
    title: 'Service Time Compliant Parcels',
    total: 0,
    fulfilment: '+100',
    selected: false,
    payload: [
      {
        name: 'Pickup Parcels Service Time Compliant',
        value: 0,
        color: '#82b8e5',
        active: true
      },
      {
        name: 'Delivery Parcels Service Time Compliant',
        value: 0,
        color: '#f0ad48',
        active: true
      },
      {
        name: 'Pickup Parcels Service Time Non Compliant',
        value: 0,
        color: '#f05548',
        active: true
      },
      {
        name: 'Delivery Parcels Service Time Non Compliant',
        value: 0,
        color: '#006279',
        active: true
      }
    ]
  }
]
