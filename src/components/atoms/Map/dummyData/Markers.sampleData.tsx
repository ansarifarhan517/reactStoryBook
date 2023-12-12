import markers from './Presentation.Markers.sampleData'
import markerMetaData from '../dummyData/Markers.metadata'

const markerLayerObj = {
  permission: true,
  entities: ['orders', 'dbs'],
  entitiesMap: {
    orders: {
      permission: true,
      label: 'Order',
      id: 'order',
      legends: [
        'notDispatched',
        'delivered',
        'notDispatched1',
        'notDispatched2'
      ],
      legendsMap: {
        delivered: {
          value: 'Delivered ',
          checked: true,
          permission: true,
          id: 'delivered',
          iconRef: 'orderIntransit',
          color: 'red',
          popupRef: 'orderIntransit',
          allow: (metaData: any) => {
            return metaData?.['status'] === 'delivered'
          },
          extraInfo: 'Delivered Now'
        },
        notDispatched: {
          value: 'Not Dispatched',
          checked: true,
          permission: true,
          id: 'notDispatched',
          color: 'blue',
          iconRef: 'orderNotdispatched',
          popupRef: 'orderIntransit',
          allow: (metaData: any) => {
            return metaData?.['status'] === 'notDispatched'
          },
          extraInfo: '0'
        },
        notDispatched1: {
          value: 'Not Dispatched 1',
          checked: true,
          permission: true,
          id: 'notDispatched1',
          color: 'blue',
          iconRef: 'orderNotdispatched',
          popupRef: 'orderIntransit',
          allow: (metaData: any) => {
            return metaData?.['status'] === 'notDispatched1'
          },
          extraInfo: '0'
        },
        notDispatched2: {
          value: 'Not Dispatched 2',
          checked: true,
          permission: true,
          id: 'notDispatched2',
          color: 'blue',
          iconRef: 'orderNotdispatched',
          popupRef: 'orderIntransit',
          allow: (metaData: any) => {
            return metaData?.['status'] === 'notDispatched2'
          },
          extraInfo: '0'
        }
      },
      markers: {
        list: markers,
        metaData: markerMetaData
      }
    },
    dbs: {
      permission: false,
      label: 'Dbs',
      id: 'dbs',
      legends: ['busy', 'available'],
      legendsMap: {
        busy: {
          value: 'Busy',
          permission: true,
          id: 'busy',
          iconRef: 'orderIntransit',
          popupRef: 'orderIntransit',
          allow: (metaData: any) => {
            return metaData?.['status'] === 'delivered'
          }
        },
        available: {
          value: 'Available',
          permission: true,
          id: 'available',
          iconRef: 'orderIntransit',
          popupRef: 'orderIntransit',
          allow: (metaData: any) => {
            return metaData?.['status'] === 'notDispatched'
          },
          checked: true
        }
      },
      markers: {
        list: markers,
        metaData: markerMetaData
      }
    }
  }
}

export default markerLayerObj
