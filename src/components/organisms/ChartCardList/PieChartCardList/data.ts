export default [
  {
    title: 'Total Orders',
    total: 1250,
    subTitle: 'No. of Delieveries',
    subTotal: 1200,
    selected: false,
    payload: [
      {
        name: 'Delivered',
        value: 5000,
        color: '#82b8e5',
        active: true,
        clientIds: 'test'
      },
      {
        name: 'Attempted PickedUp',
        value: 2710,
        color: '#f0ad48',
        active: true,
        clientIds: [1, 2, 3]
      },
      {
        name: 'Attempted Delivered',
        value: 410,
        color: '#f05548',
        active: true
      },
      { name: 'Missed', value: 7, color: '#006279', active: true },
      { name: 'Cancelled', value: 3, color: '#9b4848', active: true }
    ]
  },
  {
    title: 'Check In Compliant Orders',
    total: 1250,
    fulfilment: '-13',
    selected: false,
    payload: [
      { name: 'Delivered', value: 5000, color: '#82b8e5', active: true },
      {
        name: 'Attempted PickedUp',
        value: 2710,
        color: '#f0ad48',
        active: true
      },
      {
        name: 'Attempted Delivered',
        value: 410,
        color: '#f05548',
        active: true
      },
      { name: 'Missed', value: 7, color: '#006279', active: true },
      { name: 'Cancelled', value: 3, color: '#9b4848', active: true }
    ]
  },
  {
    title: 'Check Out Compliant Orders',
    total: 1250,
    fulfilment: '+13',
    selected: false,
    payload: [
      { name: 'Delivered', value: 5000, color: '#82b8e5', active: true },
      {
        name: 'Attempted PickedUp',
        value: 2710,
        color: '#f0ad48',
        active: true
      },
      {
        name: 'Attempted Delivered',
        value: 410,
        color: '#f05548',
        active: true
      },
      { name: 'Missed', value: 7, color: '#006279', active: true },
      { name: 'Cancelled', value: 3, color: '#9b4848', active: true }
    ]
  },

  {
    title: 'Delivery Time Compliant Orders',
    total: 1250,
    fulfilment: '+13',
    selected: false,
    payload: [
      { name: 'Delivered', value: 5000, color: '#82b8e5', active: true },
      {
        name: 'Attempted PickedUp',
        value: 2710,
        color: '#f0ad48',
        active: true
      },
      {
        name: 'Attempted Delivered',
        value: 410,
        color: '#f05548',
        active: true
      },
      { name: 'Missed', value: 7, color: '#006279', active: true },
      { name: 'Cancelled', value: 3, color: '#9b4848', active: true }
    ]
  },
  {
    title: 'Distance Travelled Compliant Orders',
    total: 1250,
    fulfilment: '+13',
    selected: false,
    payload: [
      { name: 'Delivered', value: 5000, color: '#82b8e5', active: true },
      {
        name: 'Attempted PickedUp',
        value: 2710,
        color: '#f0ad48',
        active: true
      },
      {
        name: 'Attempted Delivered',
        value: 410,
        color: '#f05548',
        active: true
      },
      { name: 'Missed', value: 7, color: '#006279', active: true },
      { name: 'Cancelled', value: 3, color: '#9b4848', active: true }
    ]
  },
  {
    title: 'Service Time Compliant Orders',
    total: 1250,
    fulfilment: '-13',
    selected: false,
    payload: [
      { name: 'Delivered', value: 5000, color: '#82b8e5', active: true },
      {
        name: 'Attempted PickedUp',
        value: 2710,
        color: '#f0ad48',
        active: true
      },
      {
        name: 'Attempted Delivered',
        value: 410,
        color: '#f05548',
        active: true
      },
      { name: 'Missed', value: 7, color: '#006279', active: true },
      { name: 'Cancelled', value: 3, color: '#9b4848', active: true }
    ]
  }
]
