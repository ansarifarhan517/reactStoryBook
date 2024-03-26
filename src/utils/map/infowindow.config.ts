import React from "react";
import store from "../redux/store"

const dynamicLabels = store.getState().dynamicLabels;


const infowindowConfig = {
    orderIntransit: {
        permissions: ['orderNo', 'endTimeWindow', 'addressDetails'],
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
        permissions: ['tripNo', 'startTime', 'delayedBy', 'endTime'],
        definitions: {
            tripNo: {
                classList: '',
                dataKey: 'tripNo',
                dataType: 'text',
                id: 'tripNo',
                labelKey: 'Trip Number'
            },
            startTime: {
                classList: '',
                dataKey: 'startTime',
                dataType: 'datetime',
                id: 'startTime',
                labelKey: 'Started at'
            },
            delayedBy: {
                classList: '',
                dataKey: 'delayedBy',
                dataType: 'text',
                id: 'delayedBy',
                labelKey: 'Delayed by'
            },
            endTime: {
                classList: '',
                dataKey: 'endTime',
                dataType: 'text',
                id: 'endTime',
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
    drivers: {
        'permissions': ['vehicleNumber', 'batteryPercentage', 'capacityInUnits', 'speed', '_thisCoordinates', '_thisLocation'],
        'definitions': {
            "capacityInUnits": {
                "classList": '',
                "dataKey": 'capacityInUnits',
                "dataType": 'capacityInUnits',
                'id': 'capacityInUnits',
                "labelKey": 'capacityInUnits'
            }
        }
    },
    deliveryMedium: {
        permissions: ['deliveryMediumMasterName', 'phoneNumber', 'batteryPerc', 'capacityInUnits', '_thisCoordinate', '_thisLocation', '_thisComponent'],
        definitions: {
            deliveryMediumMasterName: {
                classList: '',
                dataKey: 'deliveryMediumMasterName',
                dataType: 'text',
                id: 'deliveryMediumMasterName',
                labelKey: 'DA Name : '
            },
            phoneNumber: {
                classList: '',
                dataKey: 'phoneNumber',
                dataType: '_thisComponent',
                id: 'phoneNumber',
                labelKey: 'Phone number : ',
                html: {}
            },
            batteryPerc: {
                classList: '',
                dataKey: 'batteryPerc',
                dataType: 'text',
                id: 'batteryPerc',
                labelKey: 'Battery : ',
                unit: '%'
            },
            capacityInUnits: {
                classList: '',
                dataKey: 'capacityInUnits',
                dataType: 'text',
                id: 'capacityInUnits',
                labelKey: 'Capacity : ',
                unit: 'Units'
            },
            _thisCoordinate: {
                classList: 'title',
                dataKey: ['lat', 'lng'],
                dataType: '_thisDependent',
                labelKey: 'Coordinates : '
            },
            _thisLocation: {
                classList: 'title',
                dataKey: '_thisLocation',
                dataType: '_thisLocation',
                id: '_thisLocation',
                labelKey: 'Location : '
            },
            _thisComponent: {
                classList: 'title',
                dataKey: 'trackingFormattedDate',
                dataType: '_thisComponent',
                id: '_thisComponent',
                labelKey: '',
                html: {}
            }
        }

    },
    vehicle: {
        permissions: ['vehicleNumber', 'phoneNumber', 'linkedBarcode', 'batteryPercentage', 'speed', '_thisCoordinate', '_thisLocation', '_thisComponent'],
        definitions: {
            vehicleNumber: {
                classList: '',
                dataKey: 'vehicleNumber',
                dataType: 'text',
                id: 'vehicleNumber',
                labelKey: 'Vehicle No. : '
            },
            phoneNumber: {
                classList: '',
                dataKey: 'driverPhoneNumber',
                dataType: '_thisComponent',
                id: 'driverPhoneNumber',
                labelKey: 'Contact Number : ',
                html: {}
            },
            linkedBarcode: {
                classList: '',
                dataKey: 'linkedBarcode',
                dataType: 'text',
                id: 'linkedBarcode',
                labelKey: 'Tracker Barcode : ',
                html: {}
            },
            batteryPercentage: {
                classList: '',
                dataKey: 'batteryPercentage',
                dataType: 'text',
                id: 'batteryPercentage',
                labelKey: 'Battery : ',
                unit: '%'
            },
            speed: {
                classList: '',
                dataKey: 'speed',
                dataType: 'text',
                id: 'speed',
                labelKey: 'Speed : ',
                unit: '(Mph)'
            },
            _thisCoordinate: {
                classList: 'title',
                dataKey: ['lat', 'lng'],
                dataType: '_thisDependent',
                labelKey: 'Coordinates : '
            },
            _thisLocation: {
                classList: 'title',
                dataKey: '_thisLocation',
                dataType: '_thisLocation',
                id: '_thisLocation',
                labelKey: 'Location : '
            },
            _thisComponent: {
                classList: 'title',
                dataKey: 'trackingFormattedDate',
                dataType: '_thisComponent',
                id: '_thisComponent',
                labelKey: '',
                html: {}
            }
        }

    },

    territoryList: {
        permissions: [
            'geofenceName',
            'geofenceCategory',
            'deliveryMediumData',
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
            deliveryMediumData: {
                classList: 'title',
                dataKey: 'deliveryMediumData',
                dataType: 'text',
                id: 'deliveryMediumData',
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
    territory: {
        permissions: [
            '_deleteComponent',
            'tooltipButton'
        ],
        definitions: {
            _deleteComponent: {
                classList: 'title',
                dataKey: '_deleteComponent',
                dataType: '_thisComponent',
                id: '_deleteComponent',
                html: {}
            },
            tooltipButton: {
                dataKey: 'tooltipButton',
                dataType: 'component'
            }
        }
    },

    order: {
        permissions: ['orderNo', 'startTimeWindow', 'endTimeWindow', 'customerName', 'addressDetails'],
        definitions: {

            //             Shipment Number : ORD00000878
            // Start Time : 28, Dec 2020 06:28 PM (IST)
            // End Time : 29, Dec 2020 06:29 PM (IST)
            // Customer Name : A-1989388586
            // Coordinates : 19.111511, 72.909041
            // Address : Supreme Business park,Near Hiranandani Gardens,Powai,powai,Mumbai,Maharashtra,INDIA,400076



            orderNo: {
                classList: '',
                dataKey: 'orderNo',
                dataType: 'text',
                id: 'orderNo',
                labelKey: 'Order Number: '
            },
            startTimeWindow: {
                classList: '',
                dataKey: 'startTimeWindow',
                dataType: 'datetime',
                id: 'endTimeWindow',
                labelKey: 'startTimeWindow'
            },
            endTimeWindow: {
                classList: '',
                dataKey: 'endTimeWindow',
                dataType: 'datetime',
                id: 'endTimeWindow',
                labelKey: 'Deliver Order By'
            },
            customerName: {
                classList: '',
                dataKey: 'customerName',
                dataType: 'text',
                id: 'customerName',
                labelKey: 'Customer Name: '
            },
            addressDetails: {
                classList: '',
                dataKey: 'addressDetails',
                dataType: 'text',
                id: 'addressDetails',
                labelKey: 'Address Details: '
            }
        }
    },
    branch: {
        'permissions': ['name', 'superClientParentBranch', '_thisLocation', '_thisCoordinate', 'adminContactName'],
        'definitions': {
            name: {
                classList: '',
                dataKey: 'name',
                dataType: 'text',
                id: 'name',
                labelKey: 'Branch Name : '
            },
            superClientParentBranch: {
                classList: '',
                dataKey: 'superClientParentBranch',
                dataType: 'text',
                id: 'superClientParentBranch',
                labelKey: 'Parent Branch : '
            },
            _thisLocation: {
                classList: 'title',
                dataKey: '_thisLocation',
                dataType: '_thisLocation',
                id: '_thisLocation',
                labelKey: 'Location : '
            },
            _thisCoordinate: {
                classList: 'title',
                dataKey: ['lat', 'lng'],
                dataType: '_thisDependent',
                labelKey: 'Coordinates : '
            },
            adminContactName: {
                classList: '',
                dataKey: 'adminContactName',
                dataType: 'text',
                id: 'adminContactName',
                labelKey: 'Admin Name : '
            },
            _thisComponent: {
                classList: 'title',
                dataKey: 'name',
                dataType: '_thisComponent',
                id: '_thisComponent',
                labelKey: '',
                html: {}
            }
        }
    },
    organizationProfile: {
        'permissions':[],
        'definitions' : {}
    },
    tripMile: {
        permissions: ['orderNo', 'startTimeWindow', 'endTimeWindow', 'destClientNodeName', '_thisCoordinate', 'address'],
        definitions: {
            orderNo: {
                classList: '',
                dataKey: 'orderNo',
                dataType: 'text',
                id: 'orderNo',
                labelKey: dynamicLabels?.orderNo ? dynamicLabels.orderNo : 'Order Number'
            },
            startTimeWindow: {
                classList: '',
                dataKey: 'startTimeWindow',
                dataType: 'text',
                id: 'startTimeWindow',
                labelKey: dynamicLabels?.startTimeWindow ? dynamicLabels?.startTimeWindow : 'Start time'
            },
            endTimeWindow: {
                classList: '',
                dataKey: 'endTimeWindow',
                dataType: 'text',
                id: 'endTimeWindow',
                labelKey: dynamicLabels?.endTimeWindow ? dynamicLabels?.endTimeWindow : 'End Time'
            },
            destClientNodeName: {
                classList: '',
                dataKey: 'destClientNodeName',
                dataType: 'text',
                id: 'destClientNodeName',
                labelKey: dynamicLabels?.destClientNodeName ? dynamicLabels?.destClientNodeName : 'Customer Name'
            },
            _thisCoordinate: {
                classList: 'title',
                dataKey: ['lat', 'lng'],
                dataType: '_thisDependent',
                labelKey: dynamicLabels?._thisDependent ? dynamicLabels?._thisDependent : 'Coordinates : '
            },
            address: {
                classList: '',
                dataKey: 'address',
                dataType: 'text',
                id: 'address',
                labelKey: dynamicLabels?.address ? dynamicLabels?.address : 'Address Details: '
            }


        }
    },
    polygonZone: {
        permissions: [
          'zoneName',
          'zoneDescription',
          'tooltipButton'
        ],
        definitions: {
            zoneName: {
            classList: 'title',
            dataKey: 'zoneName',
            dataType: 'text',
            id: 'zoneName',
            labelKey: 'Zone Name : '
          },
          zoneDescription: {
            classList: 'title',
            dataKey: 'zoneDescription',
            dataType: 'text',
            id: 'zoneDescription',
            labelKey: 'Zone Description : '
          },
          tooltipButton: {
            dataKey: 'tooltipButton',
            dataType: 'component'
          }
        }
      },
      trackers: {
            permissions: ['vehicleNumber','phoneNumber', 'trackeeId', 'batteryPerc','speed', '_thisCoordinate', '_thisLocation','_thisComponent'],
            definitions: {
                vehicleNumber: {
                    classList: '',
                    dataKey: 'vehicleNumber',
                    dataType: 'text',
                    id: 'vehicleNumber',
                    labelKey: dynamicLabels?.['Vehicle Number'] ? dynamicLabels['Vehicle Number'] : 'Vehicle Number : '
                },
                phoneNumber: {
                    classList: '',
                    dataKey: 'driverPhoneNumber',
                    dataType: '_thisComponent',
                    id: 'phoneNumber',
                    labelKey:  dynamicLabels?.['Phone Number'] ? dynamicLabels['Phone Number'] : 'Phone Number : ',
                    html: {}
                },
                trackeeId: {
                    classList: '',
                    dataKey: 'trackeeId',
                    dataType: 'text',
                    id: 'trackeeId',
                    labelKey: dynamicLabels?.['trackerId'] ? dynamicLabels['trackerId'] : 'Tracker Id : '
                },
                batteryPerc: {
                    classList: '',
                    dataKey: 'batteryPerc',
                    dataType: 'text',
                    id: 'batteryPerc',
                    labelKey: dynamicLabels?.['battery'] ? dynamicLabels['battery'] : 'Battery : ',
                    unit: '%'
                },
                speed: {
                    classList: '',
                    dataKey: 'speed',
                    dataType: 'text',
                    id: 'speed',
                    labelKey: dynamicLabels?.['speed'] ? dynamicLabels['speed'] : 'Speed : ',
                    unit: '(Mph)'
                },
                _thisCoordinate: {
                    classList: 'title',
                    dataKey: ['latitude', 'longitude'],
                    dataType: '_thisDependent',
                    labelKey: dynamicLabels?.['Coordinates'] ? dynamicLabels['Coordinates'] : 'Coordinates : '
                },
                _thisLocation: {
                    classList: 'title',
                    dataKey: '_thisLocation',
                    dataType: '_thisLocation',
                    id: '_thisLocation',
                    labelKey: dynamicLabels?.['location'] ? dynamicLabels['location'] : 'Location : '
                },
                _thisComponent: {
                    classList: 'title',
                    dataKey: 'trackingFormattedDate',
                    dataType: '_thisComponent',
                    id: '_thisComponent',
                    labelKey: '',
                    html: {}
                }
            }
    },
    checkpointsPolygon: {
        permissions: ['checkpointName', 'checkpointCategory', 'checkpointCode', 'checkpointStatus', 'radiusInKms', 'tooltipButton'],
        definitions: {
            checkpointName: {
                classList: '',
                dataKey: 'checkpointName',
                dataType: 'text',
                id: 'checkpointName',
                labelKey: 'Checkpoint Name : '
            },
            checkpointCategory: {
                classList: '',
                dataKey: 'checkpointCategory',
                dataType: 'text',
                id: 'checkpointCategory',
                labelKey:'Checkpoint Category : '
            },
            checkpointCode: {
                classList: '',
                dataKey: 'checkpointCode',
                dataType: 'text',
                id: 'checkpointCode',
                labelKey: 'Checkpoint Code : '
            },
            checkpointStatus: {
                classList: '',
                dataKey: 'checkpointStatus',
                dataType: 'text',
                id: 'checkpointStatus',
                labelKey: 'Active : '
            },
            radiusInKms: {
                classList: '',
                dataKey: 'radiusInKms',
                dataType: 'text',
                id: 'radiusInKms',
                labelKey: 'Area : ',
                unit: "Sq.Km"
            },
            tooltipButton: {
                dataKey: 'tooltipButton',
                dataType: 'component'
            }
        }
    },
    checkpointsCircle: {
        permissions: ['checkpointName', 'checkpointCategory', 'checkpointCode', 'checkpointStatus', 'radiusInKms', 'tooltipButton'],
        definitions: {
            checkpointName: {
                classList: '',
                dataKey: 'checkpointName',
                dataType: 'text',
                id: 'checkpointName',
                labelKey: 'Checkpoint Name : '
            },
            checkpointCategory: {
                classList: '',
                dataKey: 'checkpointCategory',
                dataType: 'text',
                id: 'checkpointCategory',
                labelKey:'Checkpoint Category : '
            },
            checkpointCode: {
                classList: '',
                dataKey: 'checkpointCode',
                dataType: 'text',
                id: 'checkpointCode',
                labelKey: 'Checkpoint Code : '
            },
            checkpointStatus: {
                classList: '',
                dataKey: 'checkpointStatus',
                dataType: 'text',
                id: 'checkpointStatus',
                labelKey: 'Active : '
            },
            radiusInKms: {
                classList: '',
                dataKey: 'radiusInKms',
                dataType: 'text',
                id: 'radiusInKms',
                labelKey: 'Radius : ',
                unit: "Kms"
            },
            tooltipButton: {
                dataKey: 'tooltipButton',
                dataType: 'component'
            }
        }
    },
    checkpointsDeletePrompt: {
        permissions: [
            '_deleteComponent',
            'tooltipButton'
        ],
        definitions: {
            _deleteComponent: {
                classList: 'title',
                dataKey: '_deleteComponent',
                dataType: '_thisComponent',
                id: '_deleteComponent',
                html: () => React.createElement("div", {}, "Are you sure, you want to delete this checkpoint ?")
            },
            tooltipButton: {
                dataKey: 'tooltipButton',
                dataType: 'component'
            }
        }
    },
    checkpointsAdd: {
        permissions: [
            '_deleteComponent',
            'tooltipButton'
        ],
        definitions: {
            _deleteComponent: {
                classList: 'title',
                dataKey: '_deleteComponent',
                dataType: '_thisComponent',
                id: '_deleteComponent',
                html: {}
            },
            tooltipButton: {
                dataKey: 'tooltipButton',
                dataType: 'component'
            }
        }
    },
    all_addresses: {
        permissions: [],
        definitions: {},
    },

}

export default infowindowConfig
