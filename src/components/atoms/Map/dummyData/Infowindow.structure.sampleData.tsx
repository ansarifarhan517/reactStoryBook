import React from 'react'
import { StyledText } from '../StyledMap'

const infowindowStructure = {
  orderIntransit: {
    permissions: [
      'orderNo',
      'endTimeWindow',
      'addressDetails',
      '_thisLocation',
      '_thisComponent'
    ],
    definitions: {
      orderNo: {
        classList: '',
        dataKey: 'orderNo',
        dataType: 'text',
        id: 'orderNo',
        labelKey: 'Order Number'
      },
      endTimeWindow: {
        classList: '',
        dataKey: 'endTimeWindow',
        dataType: 'datetime',
        id: 'endTimeWindow',
        labelKey: 'Deliver Order By'
      },
      addressDetails: {
        classList: '',
        dataKey: 'addressDetails',
        dataType: 'text',
        id: 'addressDetails',
        labelKey: 'Deliver To'
      },
      _thisLocation: {
        classList: 'title',
        dataKey: '_thisLocation',
        dataType: '_thisLocation',
        id: '_thisLocation',
        labelKey: 'Location: '
      },
      _thisComponent: {
        classList: 'title',
        dataKey: 'addressDetails',
        dataType: '_thisComponent',
        id: 'addressDetails',
        labelKey: 'New Component:',
        html: ({ value }: { value: any }) => (
          <StyledText>{`${value}`}</StyledText>
        )
      }
    }
  },
  dbIntransit: {
    permissions: ['name', 'number', 'battery'],
    definitions: {
      name: {
        classList: '',
        dataKey: 'name',
        dataType: 'text',
        id: 'name',
        labelKey: 'Name'
      },
      number: {
        classList: '',
        dataKey: 'number',
        dataType: 'text',
        id: 'number',
        labelKey: 'Phone Number'
      },
      battery: {
        classList: '',
        dataKey: 'battery',
        dataType: 'text',
        id: 'battery',
        labelKey: 'Battery Percentage'
      }
    }
  },
  tripIntransit: {
    permissions: ['orderNo', 'startTimeWindow', 'address', 'endTimeWindow'],
    definitions: {
      orderNo: {
        classList: '',
        dataKey: 'orderNo',
        dataType: 'text',
        id: 'orderNo',
        labelKey: 'Order Number'
      },
      startTimeWindow: {
        classList: '',
        dataKey: 'startTimeWindow',
        dataType: 'datetime',
        id: 'startTimeWindow',
        labelKey: 'Started at'
      },
      address: {
        classList: '',
        dataKey: 'address',
        dataType: 'text',
        id: 'address',
        labelKey: 'Address'
      },
      endTimeWindow: {
        classList: '',
        dataKey: 'endTimeWindow',
        dataType: 'text',
        id: 'endTimeWindow',
        labelKey: 'Revised End Time'
      }
    }
  },
  orderTracking: {
    permissions: ['batteryPercentage', 'speed'],
    definitions: {
      batteryPercentage: {
        classList: '',
        dataKey: 'batteryPercentage',
        dataType: 'text',
        id: 'batteryPercentage',
        labelKey: 'Battery Percentage'
      },
      speed: {
        classList: '',
        dataKey: 'speed',
        dataType: 'speed',
        id: 'speed',
        labelKey: 'Speed'
      }
    }
  },
  polyIntransit: {
    permissions: [
      'geofenceName',
      'geofenceCategory',
      'deliveryMediumMasterId',
      'radiusInKms',
      'tooltipButton'
    ],
    definitions: {
      geofenceName: {
        classList: 'title',
        dataKey: 'geofenceName',
        dataType: 'text',
        id: 'geofenceName',
        labelKey: 'Territory Name : '
      },
      geofenceCategory: {
        classList: 'title',
        dataKey: 'geofenceCategory',
        dataType: 'text',
        id: 'geofenceCategory',
        labelKey: 'Territory Category : '
      },
      deliveryMediumMasterId: {
        classList: 'title',
        dataKey: 'geofenceName',
        dataType: 'text',
        id: 'geofenceName',
        labelKey: 'DAs : '
      },
      radiusInKms: {
        classList: 'title',
        dataKey: 'radiusInKms',
        dataType: 'text',
        id: 'radiusInKms',
        labelKey: 'Area : ',
        unit: 'Sq.Ml'
      },
      tooltipButton: {
        dataKey: 'tooltipButton',
        dataType: 'component'
      }
    }
  },
  circleIntransit: {
    permissions: [
      'geofenceName',
      'radiusInKms',
      '_thisCoordinate',
      'isHighAlert',
      '_thisLocation',
      '_thisComponent'
    ],

    definitions: {
      geofenceName: {
        classList: 'title',
        dataKey: 'geofenceName',
        dataType: 'text',
        id: 'geofenceName',
        labelKey: 'Geofence Name: '
      },
      radiusInKms: {
        classList: 'title',
        dataKey: 'radiusInKms',
        dataType: '_thisComponent',
        id: 'radiusInKms',
        labelKey: 'Radius: ',
        unit: 'Kms',
        html: ({ value }: { value: any }) => (
          <StyledText>{`${value}`}</StyledText>
        )
      },
      isHighAlert: {
        classList: 'title',
        dataKey: 'isHighAlert',
        dataType: 'boolean',
        id: 'isHighAlert',
        labelKey: 'Alert Type: ',
        trueValue: 'High Alert',
        falseValue: 'Low Alert'
      },
      _thisCoordinate: {
        classList: 'title',
        dataKey: ['latitude', 'longitude'],
        dataType: '_thisDependent',
        labelKey: 'Coordinates: '
      },
      _thisLocation: {
        classList: 'title',
        dataKey: '_thisLocation',
        dataType: '_thisLocation',
        id: '_thisLocation',
        labelKey: 'Location: '
      },
      _thisComponent: {
        classList: 'title',
        dataKey: 'centerCords',
        dataType: '_thisComponent',
        id: 'centerCords',
        labelKey: '',
        html: ({ value }: { value: any }) => (
          <StyledText>{`${value}`}</StyledText>
        )
      }
    }
  },
  pickupLocation:{
    permissions: [
      'orderNo',
      'startTimeWindow',
      'endTimeWindow',
      'customerName',
      'addressDetails',
      '_thisLocation'
    ],
    definitions: {
      orderNo: {
        classList: '',
        dataKey: 'orderNo',
        dataType: 'text',
        id: 'orderNo',
        labelKey: 'Order Number'
      },
      startTimeWindow: {
        classList: '',
        dataKey: 'startTimeWindow',
        dataType: 'datetime',
        id: 'startTimeWindow',
        labelKey: 'Start Time'
      },
      endTimeWindow: {
        classList: '',
        dataKey: 'endTimeWindow',
        dataType: 'datetime',
        id: 'endTimeWindow',
        labelKey: 'End Time'
      },
      customerName: {
        classList: '',
        dataKey: 'destClientNodeName',
        dataType: 'text',
        id: 'destClientNodeName',
        labelKey: 'Customer Name'
      },
      addressDetails: {
        classList: '',
        dataKey: 'addressDetails',
        dataType: 'text',
        id: 'addressDetails',
        labelKey: 'Deliver To'
      },
      _thisLocation: {
        classList: 'title',
        dataKey: '_thisLocation',
        dataType: '_thisLocation',
        id: '_thisLocation',
        labelKey: 'Location: '
      }
    }
  },
  deliverLocation:{
    permissions: [
      'orderNo',
      'startTimeWindow',
      'endTimeWindow',
      'customerName',
      'addressDetails',
      '_thisLocation'
    ],
    definitions: {
      orderNo: {
        classList: '',
        dataKey: 'orderNo',
        dataType: 'text',
        id: 'orderNo',
        labelKey: 'Order Number'
      },
      startTimeWindow: {
        classList: '',
        dataKey: 'startTimeWindow',
        dataType: 'datetime',
        id: 'startTimeWindow',
        labelKey: 'Start Time'
      },
      endTimeWindow: {
        classList: '',
        dataKey: 'endTimeWindow',
        dataType: 'datetime',
        id: 'endTimeWindow',
        labelKey: 'End Time'
      },
      customerName: {
        classList: '',
        dataKey: 'destClientNodeName',
        dataType: 'text',
        id: 'destClientNodeName',
        labelKey: 'Customer Name'
      },
      addressDetails: {
        classList: '',
        dataKey: 'addressDetails',
        dataType: 'text',
        id: 'addressDetails',
        labelKey: 'Deliver To'
      },
      _thisLocation: {
        classList: 'title',
        dataKey: '_thisLocation',
        dataType: '_thisLocation',
        id: '_thisLocation',
        labelKey: 'Location: '
      }
    }
  },
  haulTripPopup:{
    permissions:['tripNo', 'batteryPercentage', 'trackerId', 'speed', '_thisCoordinates', '_thisLocation']
  }
}

export default infowindowStructure
