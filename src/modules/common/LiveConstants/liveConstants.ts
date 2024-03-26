const LiveConstant = {
    "cardTemplates": {
        "ORDERS": {
            "UNASSIGNED": {
                "L1": ["startTimeWindow__endTimeWindow"],
                "L2": ["orderType", "customerName", "orderState", "originAddress", "destinationAddress", "branchName", "noOfItems", "packageUnits", "capacityInVolume", "capacityInWeight"],
                "L3": ["deliverServiceTimeInMins", "packageValue", "paymentType", "lastTrackingDt"],
                //  "actions": ["assignNow", "geocode", "more__delivered", "more__notDelivered", "more__cancelled", "delete"],
                "actions": ["assignNow__manual", "assignNow__auto", "assignNow__autoAllocate", "geocode", "more__delivered", "more__notDelivered", "more__pickedUp", "more__notPickedUp", "more__cancelled", "delete", "overrideStatus__delivered", "overrideStatus__notDelivered", "overrideStatus__cancelled"],
                "icon": {
                    "type": "image",
                    "url": "images/maps/red.svg",
                    "color": "#ee5448"
                }
            },
            "ASSIGNED": {
                "L1": ["startTimeWindow__endTimeWindow", "tripNo__deliveryMediumName", "eta"],
                "L2": ["deliveryOrder", "orderType", "customerName", "orderState", "originAddress", "destinationAddress", "branchName", "noOfItems", "packageUnits", "capacityInVolume", "capacityInWeight"],
                "L3": ["deliverServiceTimeInMins", "packageValue", "paymentType", "lastTrackingDt"],
                //  "actions": ["dispatch", "changeTrip", "unassign","dispatch", "geocode", "unassign", "more__delivered", "more__notDelivered", "more__cancelled", "notify", "delete"],
                "actions": ["showTrip", "changeTrip", "unassign", "notify", "geocode", "more__delivered", "more__notDelivered", "more__pickedUp", "more__notPickedUp", "more__cancelled", "delete", "overrideStatus__delivered", "overrideStatus__notDelivered", "overrideStatus__cancelled"],
                "icon": {
                    "type": "image",
                    "url": "images/maps/red.svg",
                    "color": "#ee5448"
                }
            },
            "INTRANSIT": {
                "L1": ["startTimeWindow__endTimeWindow", "tripNo__deliveryMediumName", "eta"],
                "L2": ["deliveryOrder", "orderType", "customerName", "orderState", "originAddress", "destinationAddress", "branchName", "noOfItems", "packageUnits", "capacityInVolume", "capacityInWeight"],
                "L3": ["deliverServiceTimeInMins", "packageValue", "paymentType", "lastTrackingDt"],
                //  "actions": ["trackNow", "relay","more__delivered", "more__notDelivered", "more__cancelled", "notify", "delete"],
                "actions": ["trackNow", "showTrip", "relay", "more__delivered", "more__notDelivered", "more__pickedUp", "more__notPickedUp", "more__cancelled", "delete", "notify", "overrideStatus__notDispatched", "overrideStatus__delivered", "overrideStatus__notDelivered", "overrideStatus__cancelled"],
                "icon": {
                    "type": "image",
                    "url": "images/maps/yellow.svg",
                    "classes": "infiniteFade",
                    "color": "#f5a837"
                }
            },
            "DELIVERED": {
                "L1": ["actualArrivalTime", "tripNo__deliveryMediumName"],
                "L2": ["deliveryOrder", "orderState", "originAddress", "destinationAddress", "branchName", "noOfItems", "packageUnits", "capacityInVolume", "capacityInWeight"],
                "L3": ["deliverServiceTimeInMins", "packageValue", "paymentType", "lastTrackingDt"],
                //  "actions": ["history", "notify", "delete"],
                "actions": ["history", "delete", "overrideStatus__notDispatched", "overrideStatus__notDelivered", "overrideStatus__cancelled"],
                "icon": {
                    "type": "image",
                    "url": "images/maps/blue.svg",
                    "color": "#5698d3"
                }
            },
            "PICKEDUP": {
                "L1": ["actualArrivalTime", "tripNo__deliveryMediumName"],
                "L2": ["deliveryOrder", "orderState", "originAddress", "destinationAddress", "branchName", "noOfItems", "packageUnits", "capacityInVolume", "capacityInWeight"],
                "L3": ["deliverServiceTimeInMins", "packageValue", "paymentType", "lastTrackingDt"],
                //  "actions": ["history", "more__delivered", "more__notDelivered", "more__cancelled", "notify", "delete"],
                "actions": ["history", "relay", "more__delivered", "more__notDelivered", "more__notPickedUp", "more__cancelled", "notify", "delete", "overrideStatus__notDispatched", "overrideStatus__delivered", "overrideStatus__notDelivered", "overrideStatus__cancelled"],
                "icon": {
                    "type": "image",
                    "url": "images/maps/green.svg",
                    "color": "#6FC44B"
                }
            },
            "NOTDELIVERED": {
                "L1": ["actualArrivalTime", "reason", "tripNo__deliveryMediumName"],
                "L2": ["deliveryOrder", "orderState", "originAddress", "destinationAddress", "branchName"],
                "L3": ["deliverServiceTimeInMins", "packageValue", "paymentType", "lastTrackingDt"],
                //  "actions": ["history", "more__delivered", "more__cancelled", "notify", "delete"],
                "actions": ["history", "more__delivered", "more__cancelled", "more__pickedUp", "more__notPickedUp", "delete", "overrideStatus__notDispatched", "notify", "overrideStatus__delivered", "overrideStatus__cancelled"],
                "icon": {
                    "type": "image",
                    "url": "images/maps/gray.svg",
                    "color": "#818896"
                }
            },
            "NOTPICKEDUP": {
                "L1": ["actualArrivalTime", "reason", "tripNo__deliveryMediumName"],
                "L2": ["deliveryOrder", "orderState", "originAddress", "destinationAddress", "branchName"],
                "L3": ["deliverServiceTimeInMins", "packageValue", "paymentType", "lastTrackingDt"],
                //  "actions": ["history", "more__delivered", "more__cancelled", "notify", "delete"],
                "actions": ["history", "more__delivered", "more__cancelled", "more__pickedUp", "delete", "overrideStatus__notDispatched", "notify", "overrideStatus__delivered", "overrideStatus__notDelivered", "overrideStatus__cancelled"],
                "icon": {
                    "type": "image",
                    "url": "images/maps/gray.svg",
                    "color": "#818896"
                }
            },
            "CANCELLED": {
                "L1": ["startTimeWindow__endTimeWindow", "reason"],
                "L2": ["orderState", "originAddress", "destinationAddress", "branchName"],
                "L3": ["deliverServiceTimeInMins", "packageValue", "paymentType", "lastTrackingDt"],
                //  "actions": ["history", "delete"],
                "actions": ["history", "delete", "overrideStatus__notDispatched", "overrideStatus__delivered", "overrideStatus__notDelivered"],
                "icon": {
                    "type": "image",
                    "url": "images/maps/lightGray.svg",
                    "color": "#a5a5a5"
                }
            },
        },
        "DBS": {
            "INTRANSIT": {
                "L1": ["tripName", "isAttandanceFl", "isOnBreakFl"],
                "L2": ["phoneNumber", "branchName", "capacityInUnits", "capacityInVolume", "capacityInWeight", "deliveryMediumMasterTypeCd", "statusCd"],
                "L3": ["userName", "weeklyOff"],
                //  "actions": ["assignNow", "geocode", "more__delivered", "more__notDelivered", "more__cancelled", "delete"],
                "actions": ["trackNow", "dmDetails", "notify"],
                "icon": {
                    "type": "image",
                    "url": "images/live/running.svg"
                }
            },
            "AVAILABLE": {
                "L1": ["statusCd", "isOnBreakFl"],
                "L2": ["phoneNumber", "branchName", "capacityInUnits", "capacityInVolume", "capacityInWeight", "deliveryMediumMasterTypeCd", "statusCd"],
                "L3": ["userName", "weeklyOff"],
                //  "actions": ["assignNow", "geocode", "more__delivered", "more__notDelivered", "more__cancelled", "delete"],
                "actions": ["update", "dmDetails", "changePwd", "delete", "notify", "more__inactive", "more__absent"],
                "icon": {
                    "type": "image",
                    "url": "images/live/available.svg"
                }
            },
            "INACTIVE": {
                "L1": [],
                "L2": ["phoneNumber", "branchName", "capacityInUnits", "capacityInVolume", "capacityInWeight", "deliveryMediumMasterTypeCd", "statusCd", "isAttandanceFl"],
                "L3": ["userName", "weeklyOff"],
                //  "actions": ["assignNow", "geocode", "more__delivered", "more__notDelivered", "more__cancelled", "delete"],
                "actions": ["more__active", "dmDetails", "changePwd", "update", "delete"],
                "icon": {
                    "type": "image",
                    "url": "images/live/inactive.svg"
                }
            },
            "ABSENT": {
                "L1": [],
                "L2": ["phoneNumber", "branchName", "capacityInUnits", "capacityInVolume", "capacityInWeight", "deliveryMediumMasterTypeCd", "statusCd", "isAttandanceFl"],
                "L3": ["userName", "weeklyOff"],
                //  "actions": ["assignNow", "geocode", "more__delivered", "more__notDelivered", "more__cancelled", "delete"],
                "actions": ["more__present", "dmDetails", "changePwd", "update", "delete", "notify", "more__inactive"],
                "icon": {
                    "type": "image",
                    "url": "images/live/absent.svg"
                }
            }
        },
        "TRIPS": {
            "NOTSTARTED": {
                "L1": ["deliveryMediumName", "tripStatus", "orderCount"],
                "L2": ["estimatedStartDate", "unitsCapacity", "weightCapacity", "volumeCapacity", "routeName", "vehicleNo"],
                "L3": ["estimatedStartDate", "estimatedEndDate", "estimatedDistance"],
                "actions": ["startTrip", "showDRS", "printDRS", "tripDetails", "delete"],
                "icon": {
                    "type": "image",
                    "url": "images/live/notstarted.svg"
                }
            },
            "STARTED": {
                "L1": ["deliveryMediumName", "tripStatus", "tripStartDt", "orderCount"],
                "L2": ["unitsCapacity", "weightCapacity", "volumeCapacity", "routeName", "vehicleNo"],
                "L3": ["estimatedStartDate", "estimatedEndDate", "estimatedDistance"],
                "actions": ["trackNow", "showDRS", "printDRS", "tripDetails", "stopTrip"],
                "icon": {
                    "type": "image",
                    "url": "images/live/started.svg",
                    "classes": "infiniteFade"
                }
            },
            "ENDED": {
                "L1": ["deliveryMediumName", "tripStatus", "tripStartDt", "tripEndDt", "orderCount"],
                "L2": ["actualDistance", "routeName", "vehicleNo", "tripCashCollected", "tripCashToBeCollected"],
                "L3": ["unitsCapacity", "weightCapacity", "volumeCapacity"],
                "actions": ["history", "showDRS", "printDRS", "tripDetails", "delete", "recordCash"],
                "icon": {
                    "type": "image",
                    "url": "images/live/ended.svg"
                }
            }
        },
        "DRS_ORDERS": {
            "NOTDISPATCHED": {
                "L1": ["packageStatusCd", "startTimeWindow__endTimeWindow", "calculatedStartDt__calculatedEndDt", "isGeocoded"],
                "L2": ["origClientNodeName__destClientNodeName", "address", "estimatedDistance", "itemCount"],
                "L3": [],
                "actions": ['remove'],
                "icon": {
                    "type": "html",
                    "url": "templateUrl"
                }
            },
            "INTRANSIT": {
                "L1": ["packageStatusCd", "startTimeWindow__endTimeWindow", "calculatedStartDt__calculatedEndDt", "isGeocoded"],
                "L2": ["origClientNodeName__destClientNodeName", "address", "estimatedDistance", "itemCount"],
                "L3": [],
                "actions": ['remove'],
                "icon": {
                    "type": "html",
                    "url": "templateUrl"
                }
            },
            "DELIVERED": {
                "L1": ["packageStatusCd", "startTimeWindow__endTimeWindow", "actualArrivalTime"],
                "L2": ["origClientNodeName__destClientNodeName", "address", "actualDistance", "itemCount"],
                "L3": [],
                "actions": [],
                "icon": {
                    "type": "html",
                    "url": "templateUrl"
                }
            },
            "NOTDELIVERED": {
                "L1": ["packageStatusCd", "startTimeWindow__endTimeWindow", "actualArrivalTime"],
                "L2": ["origClientNodeName__destClientNodeName", "address", "actualDistance", "itemCount"],
                "L3": [],
                "actions": [],
                "icon": {
                    "type": "html",
                    "url": "templateUrl"
                }
            },
            "PICKEDUP": {
                "L1": ["packageStatusCd", "startTimeWindow__endTimeWindow", "actualArrivalTime"],
                "L2": ["origClientNodeName__destClientNodeName", "address", "actualDistance", "itemCount"],
                "L3": [],
                "actions": [],
                "icon": {
                    "type": "html",
                    "url": "templateUrl"
                }
            },
            "NOTPICKEDUP": {
                "L1": ["packageStatusCd", "startTimeWindow__endTimeWindow", "actualArrivalTime"],
                "L2": ["origClientNodeName__destClientNodeName", "address", "actualDistance", "itemCount"],
                "L3": [],
                "actions": [],
                "icon": {
                    "type": "html",
                    "url": "templateUrl"
                }
            },
            "CANCELLED": {
                "L1": ["packageStatusCd", "startTimeWindow__endTimeWindow", "actualArrivalTime"],
                "L2": ["origClientNodeName__destClientNodeName", "address", "actualDistance", "itemCount"],
                "L3": [],
                "actions": [],
                "icon": {
                    "type": "html",
                    "url": "templateUrl"
                }
            }
        }
    },
    "headerDropdownTemplates": {
        "ORDERS": ["ALL", "unassigned_s", "assigned", "INTRANSIT", "PICKEDUP", "DELIVERED", "NOTPICKEDUP", "NOTDELIVERED", "CANCELLED"],
        "TRIPS": ["ALL", "STARTED", "NOTSTARTED", "ENDED"],
        "DBS": ["ALL", "DM_Intransit", "Available", "Absent", "Inactive"],
        "CARRIERS": ["ALL", "Active", "Inactive"]
    },
    "headerIconTemplates": {
        "orders": {
            "ALL": "images/maps/assist/Markers.svg",
            "unassigned_s": "images/maps/v2_red.svg",
            "assigned": "images/maps/v2_red.svg",
            "INTRANSIT": "images/maps/v2_yellow.svg",
            "PICKEDUP": "images/maps/v2_green.svg",
            "DELIVERED": "images/maps/v2_blue.svg",
            "NOTPICKEDUP": "images/maps/v2_gray.svg",
            "NOTDELIVERED": "images/maps/v2_gray.svg",
            "CANCELLED": "images/maps/v2_lightGray.svg"
        },
        "trips": {
            "ALL": "images/live/allTrips.svg",
            "NOTSTARTED": "images/live/notstarted.svg",
            "STARTED": "images/live/started.svg",
            "ENDED": "images/live/ended.svg",
        },
        "dbs": {
            "ALL": "images/live/truckStatic_blue.svg",
            "INTRANSIT": "images/live/deliverytruck_moving.svg",
            "DM_Intransit": "images/live/deliverytruck_moving.svg",
            "Available": "images/live/truckStatic_blue.svg",
            "Absent": "images/live/truckStatic_yellow.svg",
            "all": "images/live/truckStatic_blue.svg",
            "Inactive": "images/live/truck_unavailable.svg"
        },
        'carrier': {
            "ALL": "images/live/carrierTruck_blue.svg",
            'Available': "images/live/carrierTruck_blue.svg",
            'inactive': 'images/live/carrierTruck_grey.svg',
            'Inactive': 'images/live/carrierTruck_grey.svg',
            'all': "images/live/carrierTruck_blue.svg",
            'Active': "images/live/carrierTruck_blue.svg"
        }
    },



    "actionIconTemplates": {
        "default": {
            "type": "icon",
            "url": "icon icon-ry-star-border"
        },
        "delete": {
            "type": "icon",
            "url": "icon icon-delete-button"
        },
        "assignNow": {
            "type": "icon",
            "url": "icon icon-ry-add"
        },
        "geocode": {
            "type": "icon",
            "url": "icon-Product-Icons-30"
        },
        "more__delivered": {
            "type": "icon",
            "url": "icon icon-assign-now"
        },
        "more__notDelivered": {
            "type": "icon",
            "url": "icon icon-assign-now"
        },
        "more__pickedUp": {
            "type": "icon",
            "url": "icon icon-assign-now"
        },
        "more__notPickedUp": {
            "type": "icon",
            "url": "icon icon-assign-now"
        },
        "more__cancelled": {
            "type": "icon",
            "url": "icon icon-assign-now"
        },
        "more__intransit": {
            "type": "icon",
            "url": "icon icon-assign-now"
        },
        "overrideStatus__delivered": {
            "type": "icon",
            "url": "icon icon-latesr-activity"
        },
        "overrideStatus__notDelivered": {
            "type": "icon",
            "url": "icon icon-latesr-activity"
        },
        "overrideStatus__cancelled": {
            "type": "icon",
            "url": "icon icon-latesr-activity"
        },
        "showTrip": {
            "type": "icon",
            "url": "icon icon-ry-line"
        },
        "changeTrip": {
            "type": "icon",
            "url": "icon icon-update-button"
        },
        "unassign": {
            "type": "icon",
            "url": "icon icon-delink"
        },
        "notify": {
            "type": "icon",
            "url": "icon icon-sms-1"
        },
        "trackNow": {
            "type": "icon",
            "url": "icon icon-view-1"
        },
        "relay": {
            "type": "icon",
            "url": "icon icon-reroute"
        },
        "overrideStatus__notDispatched": {
            "type": "icon",
            "url": "icon icon-latesr-activity"
        },
        "history": {
            "type": "icon",
            "url": "icon icon-time_clock_1"
        },
        "dmDetails": {
            "type": "icon",
            "url": "icon icon-user"
        },
        "update": {
            "type": "icon",
            "url": "icon icon-edit-2"
        },
        "more__inactive": {
            "type": "icon",
            "url": "icon icon-check_box_3"
        },
        "more__absent": {
            "type": "icon",
            "url": "icon icon-check_box_3"
        },
        "more__active": {
            "type": "icon",
            "url": "icon icon-check_box_3"
        },
        "more__present": {
            "type": "icon",
            "url": "icon icon-check_box_3"
        },
        "startTrip": {
            "type": "icon",
            "url": "icon icon-play"
        },
        "showDRS": {
            "type": "icon",
            "url": "icon icon-ry-list"
        },
        "printDRS": {
            "type": "icon",
            "url": "icon icon-ry-print"
        },
        "stopTrip": {
            "type": "icon",
            "url": "icon icon-pause"
        },
        "recordCash": {
            "type": "icon",
            "url": "icon icon-ry-percentage"
        }
    },



    "suggestTripsParams": {
        "tripStatuses": [
            { "key": "STARTED" },
            { "key": "NOTSTARTED" }
        ]
    },

    "liveDynamicTemplateJson": {
        "general": {
            "showTripsFirst": false
        },
        "paneAccesses": {
            "ORDERS": {
                "permission": true,
                "widthPerc": "24"
            },
            "TRIPS": {
                "permission": true,
                "widthPerc": "24"
            },
            "DBS": {
                "permission": true,
                "widthPerc": "24"
            },
            "MAP": {
                "permission": true,
                "widthPerc": "52"
            }
        },
        "cardTemplates": {
            "ORDERS": {
                "ASSIGNED": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "tripNo__deliveryMediumName",
                        "dataKey": "tripNo__deliveryMediumName",
                        "dataType": "special",
                        "labelKey": "assignedTo",
                        "classList": "tertiaryLink"
                    },
                    {
                        "id": "eta",
                        "dataKey": "eta",
                        "dataType": "datetime",
                        "labelKey": "eta"
                    },
                    {
                        "id": "autoAssignment",
                        "dataKey": "autoAssignment",
                        "dataType": "special",
                        "labelKey": "live_findingTrips"
                    }
                    ],
                    "L2": [{
                        "id": "deliveryOrder",
                        "dataKey": "deliveryOrder",
                        "dataType": "text",
                        "labelKey": "deliveryOrder"
                    },
                    {
                        "id": "orderType",
                        "dataKey": "orderType",
                        "dataType": "text",
                        "labelKey": "orderType"
                    },
                    {
                        "id": "customerName",
                        "dataKey": "customerName",
                        "dataType": "text",
                        "labelKey": "customerName"
                    },
                    {
                        "id": "orderState",
                        "dataKey": "orderState",
                        "dataType": "text",
                        "labelKey": "orderState"
                    },
                    {
                        "id": "originAddress",
                        "dataKey": "origin",
                        "dataType": "text",
                        "labelKey": "origin"
                    },
                    {
                        "id": "destinationAddress",
                        "dataKey": "destinationAddress",
                        "dataType": "text",
                        "labelKey": "destinationAddress"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "noOfItems",
                        "dataKey": "noOfItems",
                        "dataType": "text",
                        "labelKey": "totalItems"
                    },
                    {
                        "id": "packageUnits",
                        "dataKey": "packageUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    }
                    ],
                    "L3": [{
                        "id": "deliverServiceTimeInMins",
                        "dataKey": "deliverServiceTimeInMins",
                        "dataType": "text",
                        "labelKey": "deliverServiceTime"
                    },
                    {
                        "id": "packageValue",
                        "dataKey": "packageValue",
                        "dataType": "text",
                        "labelKey": "packageValue"
                    },
                    {
                        "id": "paymentType",
                        "dataKey": "paymentType",
                        "dataType": "text",
                        "labelKey": "paymentType"
                    },
                    {
                        "id": "lastTrackingDt",
                        "dataKey": "lastTrackingDt",
                        "dataType": "datetime",
                        "labelKey": "lastTrackingDate"
                    }
                    ],
                    "actions": [
                        "showTrip",
                        "changeTrip",
                        "unassign",
                        "notify",
                        "geocode",
                        "more__delivered",
                        "more__notDelivered",
                        "more__pickedUp",
                        "more__notPickedUp",
                        "more__cancelled",
                        "delete",
                        "overrideStatus__delivered",
                        "overrideStatus__notDelivered",
                        "overrideStatus__cancelled"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/maps/red.svg",
                        "color": "#ee5448"
                    }
                },
                "UNASSIGNED": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "autoAssignment",
                        "dataKey": "autoAssignment",
                        "dataType": "special",
                        "labelKey": "live_findingTrips"
                    }
                    ],
                    "L2": [{
                        "id": "orderType",
                        "dataKey": "orderType",
                        "dataType": "text",
                        "labelKey": "orderType"
                    },
                    {
                        "id": "customerName",
                        "dataKey": "customerName",
                        "dataType": "text",
                        "labelKey": "customerName"
                    },
                    {
                        "id": "orderState",
                        "dataKey": "orderState",
                        "dataType": "text",
                        "labelKey": "orderState"
                    },
                    {
                        "id": "originAddress",
                        "dataKey": "origin",
                        "dataType": "text",
                        "labelKey": "origin"
                    },
                    {
                        "id": "destinationAddress",
                        "dataKey": "destinationAddress",
                        "dataType": "text",
                        "labelKey": "destinationAddress"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "noOfItems",
                        "dataKey": "noOfItems",
                        "dataType": "text",
                        "labelKey": "totalItems"
                    },
                    {
                        "id": "packageUnits",
                        "dataKey": "packageUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    }
                    ],
                    "L3": [{
                        "id": "deliverServiceTimeInMins",
                        "dataKey": "deliverServiceTimeInMins",
                        "dataType": "text",
                        "labelKey": "deliverServiceTime"
                    },
                    {
                        "id": "packageValue",
                        "dataKey": "packageValue",
                        "dataType": "text",
                        "labelKey": "packageValue"
                    },
                    {
                        "id": "paymentType",
                        "dataKey": "paymentType",
                        "dataType": "text",
                        "labelKey": "paymentType"
                    },
                    {
                        "id": "lastTrackingDt",
                        "dataKey": "lastTrackingDt",
                        "dataType": "datetime",
                        "labelKey": "lastTrackingDate"
                    }
                    ],
                    "actions": [
                        "assignNow__manual",
                        "assignNow__auto",
                        "assignNow__autoAllocate",
                        "geocode",
                        "more__delivered",
                        "more__notDelivered",
                        "more__pickedUp",
                        "more__notPickedUp",
                        "more__cancelled",
                        "delete",
                        "overrideStatus__delivered",
                        "overrideStatus__notDelivered",
                        "overrideStatus__cancelled"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/maps/red.svg",
                        "color": "#ee5448"
                    }
                },
                "INTRANSIT": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "tripNo__deliveryMediumName",
                        "dataKey": "tripNo__deliveryMediumName",
                        "dataType": "special",
                        "labelKey": "assignedTo",
                        "classList": "tertiaryLink"
                    },
                    {
                        "id": "eta",
                        "dataKey": "eta",
                        "dataType": "datetime",
                        "labelKey": "eta"
                    }
                    ],
                    "L2": [{
                        "id": "deliveryOrder",
                        "dataKey": "deliveryOrder",
                        "dataType": "text",
                        "labelKey": "deliveryOrder"
                    },
                    {
                        "id": "orderType",
                        "dataKey": "orderType",
                        "dataType": "text",
                        "labelKey": "orderType"
                    },
                    {
                        "id": "customerName",
                        "dataKey": "customerName",
                        "dataType": "text",
                        "labelKey": "customerName"
                    },
                    {
                        "id": "orderState",
                        "dataKey": "orderState",
                        "dataType": "text",
                        "labelKey": "orderState"
                    },
                    {
                        "id": "originAddress",
                        "dataKey": "origin",
                        "dataType": "text",
                        "labelKey": "origin"
                    },
                    {
                        "id": "destinationAddress",
                        "dataKey": "destinationAddress",
                        "dataType": "text",
                        "labelKey": "destinationAddress"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "noOfItems",
                        "dataKey": "noOfItems",
                        "dataType": "text",
                        "labelKey": "totalItems"
                    },
                    {
                        "id": "packageUnits",
                        "dataKey": "packageUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    }
                    ],
                    "L3": [{
                        "id": "deliverServiceTimeInMins",
                        "dataKey": "deliverServiceTimeInMins",
                        "dataType": "text",
                        "labelKey": "deliverServiceTime"
                    },
                    {
                        "id": "packageValue",
                        "dataKey": "packageValue",
                        "dataType": "text",
                        "labelKey": "packageValue"
                    },
                    {
                        "id": "paymentType",
                        "dataKey": "paymentType",
                        "dataType": "text",
                        "labelKey": "paymentType"
                    },
                    {
                        "id": "lastTrackingDt",
                        "dataKey": "lastTrackingDt",
                        "dataType": "datetime",
                        "labelKey": "lastTrackingDate"
                    }
                    ],
                    "actions": [
                        "trackNow",
                        "showTrip",
                        "relay",
                        "more__delivered",
                        "more__notDelivered",
                        "more__pickedUp",
                        "more__notPickedUp",
                        "more__cancelled",
                        "delete",
                        "notify",
                        "overrideStatus__notDispatched",
                        "overrideStatus__delivered",
                        "overrideStatus__notDelivered",
                        "overrideStatus__cancelled"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/maps/yellow.svg",
                        "color": "#f5a837",
                        "classes": "infiniteFade"
                    }
                },
                "DELIVERED": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "actualArrivalTime",
                        "dataKey": "actualArrivalTime",
                        "dataType": "datetime",
                        "labelKey": "actualTime"
                    },
                    {
                        "id": "tripNo__deliveryMediumName",
                        "dataKey": "tripNo__deliveryMediumName",
                        "dataType": "special",
                        "labelKey": "assignedTo",
                        "classList": "tertiaryLink"
                    }
                    ],
                    "L2": [{
                        "id": "deliveryOrder",
                        "dataKey": "deliveryOrder",
                        "dataType": "text",
                        "labelKey": "deliveryOrder"
                    },
                    {
                        "id": "orderType",
                        "dataKey": "orderType",
                        "dataType": "text",
                        "labelKey": "orderType"
                    },
                    {
                        "id": "orderState",
                        "dataKey": "orderState",
                        "dataType": "text",
                        "labelKey": "orderState"
                    },
                    {
                        "id": "originAddress",
                        "dataKey": "origin",
                        "dataType": "text",
                        "labelKey": "origin"
                    },
                    {
                        "id": "destinationAddress",
                        "dataKey": "destinationAddress",
                        "dataType": "text",
                        "labelKey": "destinationAddress"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "noOfItems",
                        "dataKey": "noOfItems",
                        "dataType": "text",
                        "labelKey": "totalItems"
                    },
                    {
                        "id": "packageUnits",
                        "dataKey": "packageUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    }
                    ],
                    "L3": [{
                        "id": "deliverServiceTimeInMins",
                        "dataKey": "deliverServiceTimeInMins",
                        "dataType": "text",
                        "labelKey": "deliverServiceTime"
                    },
                    {
                        "id": "packageValue",
                        "dataKey": "packageValue",
                        "dataType": "text",
                        "labelKey": "packageValue"
                    },
                    {
                        "id": "paymentType",
                        "dataKey": "paymentType",
                        "dataType": "text",
                        "labelKey": "paymentType"
                    },
                    {
                        "id": "lastTrackingDt",
                        "dataKey": "lastTrackingDt",
                        "dataType": "datetime",
                        "labelKey": "lastTrackingDate"
                    }
                    ],
                    "actions": [
                        "history",
                        "delete",
                        "overrideStatus__notDispatched",
                        "overrideStatus__notDelivered",
                        "overrideStatus__cancelled"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/maps/blue.svg",
                        "color": "#5698d3"
                    }
                },
                "PICKEDUP": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "actualArrivalTime",
                        "dataKey": "actualArrivalTime",
                        "dataType": "datetime",
                        "labelKey": "actualTime"
                    },
                    {
                        "id": "tripNo__deliveryMediumName",
                        "dataKey": "tripNo__deliveryMediumName",
                        "dataType": "special",
                        "labelKey": "assignedTo",
                        "classList": "tertiaryLink"
                    }
                    ],
                    "L2": [{
                        "id": "deliveryOrder",
                        "dataKey": "deliveryOrder",
                        "dataType": "text",
                        "labelKey": "deliveryOrder"
                    },
                    {
                        "id": "orderType",
                        "dataKey": "orderType",
                        "dataType": "text",
                        "labelKey": "orderType"
                    },
                    {
                        "id": "orderState",
                        "dataKey": "orderState",
                        "dataType": "text",
                        "labelKey": "orderState"
                    },
                    {
                        "id": "originAddress",
                        "dataKey": "origin",
                        "dataType": "text",
                        "labelKey": "origin"
                    },
                    {
                        "id": "destinationAddress",
                        "dataKey": "destinationAddress",
                        "dataType": "text",
                        "labelKey": "destinationAddress"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "noOfItems",
                        "dataKey": "noOfItems",
                        "dataType": "text",
                        "labelKey": "totalItems"
                    },
                    {
                        "id": "packageUnits",
                        "dataKey": "packageUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    }
                    ],
                    "L3": [{
                        "id": "deliverServiceTimeInMins",
                        "dataKey": "deliverServiceTimeInMins",
                        "dataType": "text",
                        "labelKey": "deliverServiceTime"
                    },
                    {
                        "id": "packageValue",
                        "dataKey": "packageValue",
                        "dataType": "text",
                        "labelKey": "packageValue"
                    },
                    {
                        "id": "paymentType",
                        "dataKey": "paymentType",
                        "dataType": "text",
                        "labelKey": "paymentType"
                    },
                    {
                        "id": "lastTrackingDt",
                        "dataKey": "lastTrackingDt",
                        "dataType": "datetime",
                        "labelKey": "lastTrackingDate"
                    }
                    ],
                    "actions": [
                        "history",
                        "more__delivered",
                        "more__notDelivered",
                        "more__notPickedUp",
                        "more__cancelled",
                        "notify",
                        "delete",
                        "overrideStatus__notDispatched",
                        "overrideStatus__delivered",
                        "overrideStatus__notDelivered",
                        "overrideStatus__cancelled"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/maps/green.svg",
                        "color": "#6FC44B"
                    }
                },
                "NOTDELIVERED": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "actualArrivalTime",
                        "dataKey": "actualArrivalTime",
                        "dataType": "datetime",
                        "labelKey": "actualTime"
                    },
                    {
                        "id": "reason",
                        "dataKey": "reason",
                        "dataType": "text",
                        "labelKey": "reason"
                    },
                    {
                        "id": "tripNo__deliveryMediumName",
                        "dataKey": "tripNo__deliveryMediumName",
                        "dataType": "special",
                        "labelKey": "assignedTo",
                        "classList": "tertiaryLink"
                    }
                    ],
                    "L2": [{
                        "id": "deliveryOrder",
                        "dataKey": "deliveryOrder",
                        "dataType": "text",
                        "labelKey": "deliveryOrder"
                    },
                    {
                        "id": "orderType",
                        "dataKey": "orderType",
                        "dataType": "text",
                        "labelKey": "orderType"
                    },
                    {
                        "id": "orderState",
                        "dataKey": "orderState",
                        "dataType": "text",
                        "labelKey": "orderState"
                    },
                    {
                        "id": "originAddress",
                        "dataKey": "origin",
                        "dataType": "text",
                        "labelKey": "origin"
                    },
                    {
                        "id": "destinationAddress",
                        "dataKey": "destinationAddress",
                        "dataType": "text",
                        "labelKey": "destinationAddress"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "noOfItems",
                        "dataKey": "noOfItems",
                        "dataType": "text",
                        "labelKey": "totalItems"
                    },
                    {
                        "id": "packageUnits",
                        "dataKey": "packageUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    }
                    ],
                    "L3": [{
                        "id": "deliverServiceTimeInMins",
                        "dataKey": "deliverServiceTimeInMins",
                        "dataType": "text",
                        "labelKey": "deliverServiceTime"
                    },
                    {
                        "id": "packageValue",
                        "dataKey": "packageValue",
                        "dataType": "text",
                        "labelKey": "packageValue"
                    },
                    {
                        "id": "paymentType",
                        "dataKey": "paymentType",
                        "dataType": "text",
                        "labelKey": "paymentType"
                    },
                    {
                        "id": "lastTrackingDt",
                        "dataKey": "lastTrackingDt",
                        "dataType": "datetime",
                        "labelKey": "lastTrackingDate"
                    }
                    ],
                    "actions": [
                        "history",
                        "more__delivered",
                        "more__cancelled",
                        "more__pickedUp",
                        "more__notPickedUp",
                        "delete",
                        "overrideStatus__notDispatched",
                        "notify",
                        "overrideStatus__delivered",
                        "overrideStatus__cancelled"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/maps/gray.svg",
                        "color": "#818896"
                    }
                },
                "NOTPICKEDUP": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "actualArrivalTime",
                        "dataKey": "actualArrivalTime",
                        "dataType": "datetime",
                        "labelKey": "actualTime"
                    },
                    {
                        "id": "reason",
                        "dataKey": "reason",
                        "dataType": "text",
                        "labelKey": "reason"
                    },
                    {
                        "id": "tripNo__deliveryMediumName",
                        "dataKey": "tripNo__deliveryMediumName",
                        "dataType": "special",
                        "labelKey": "assignedTo",
                        "classList": "tertiaryLink"
                    }
                    ],
                    "L2": [{
                        "id": "deliveryOrder",
                        "dataKey": "deliveryOrder",
                        "dataType": "text",
                        "labelKey": "deliveryOrder"
                    },
                    {
                        "id": "orderType",
                        "dataKey": "orderType",
                        "dataType": "text",
                        "labelKey": "orderType"
                    },
                    {
                        "id": "orderState",
                        "dataKey": "orderState",
                        "dataType": "text",
                        "labelKey": "orderState"
                    },
                    {
                        "id": "originAddress",
                        "dataKey": "origin",
                        "dataType": "text",
                        "labelKey": "origin"
                    },
                    {
                        "id": "destinationAddress",
                        "dataKey": "destinationAddress",
                        "dataType": "text",
                        "labelKey": "destinationAddress"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "noOfItems",
                        "dataKey": "noOfItems",
                        "dataType": "text",
                        "labelKey": "totalItems"
                    },
                    {
                        "id": "packageUnits",
                        "dataKey": "packageUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    }
                    ],
                    "L3": [{
                        "id": "deliverServiceTimeInMins",
                        "dataKey": "deliverServiceTimeInMins",
                        "dataType": "text",
                        "labelKey": "deliverServiceTime"
                    },
                    {
                        "id": "packageValue",
                        "dataKey": "packageValue",
                        "dataType": "text",
                        "labelKey": "packageValue"
                    },
                    {
                        "id": "paymentType",
                        "dataKey": "paymentType",
                        "dataType": "text",
                        "labelKey": "paymentType"
                    },
                    {
                        "id": "lastTrackingDt",
                        "dataKey": "lastTrackingDt",
                        "dataType": "datetime",
                        "labelKey": "lastTrackingDate"
                    }
                    ],
                    "actions": [
                        "history",
                        "more__delivered",
                        "more__cancelled",
                        "more__pickedUp",
                        "delete",
                        "overrideStatus__notDispatched",
                        "notify",
                        "overrideStatus__delivered",
                        "overrideStatus__notDelivered",
                        "overrideStatus__cancelled"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/maps/gray.svg",
                        "color": "#818896"
                    }
                },
                "CANCELLED": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "reason",
                        "dataKey": "reason",
                        "dataType": "text",
                        "labelKey": "reason"
                    }
                    ],
                    "L2": [{
                        "id": "orderState",
                        "dataKey": "orderState",
                        "dataType": "text",
                        "labelKey": "orderState"
                    },
                    {
                        "id": "originAddress",
                        "dataKey": "origin",
                        "dataType": "text",
                        "labelKey": "origin"
                    },
                    {
                        "id": "destinationAddress",
                        "dataKey": "destinationAddress",
                        "dataType": "text",
                        "labelKey": "destinationAddress"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    }
                    ],
                    "L3": [{
                        "id": "deliverServiceTimeInMins",
                        "dataKey": "deliverServiceTimeInMins",
                        "dataType": "text",
                        "labelKey": "deliverServiceTime"
                    },
                    {
                        "id": "packageValue",
                        "dataKey": "packageValue",
                        "dataType": "text",
                        "labelKey": "packageValue"
                    },
                    {
                        "id": "paymentType",
                        "dataKey": "paymentType",
                        "dataType": "text",
                        "labelKey": "paymentType"
                    },
                    {
                        "id": "lastTrackingDt",
                        "dataKey": "lastTrackingDt",
                        "dataType": "datetime",
                        "labelKey": "lastTrackingDate"
                    }
                    ],
                    "actions": [
                        "history",
                        "delete",
                        "overrideStatus__notDispatched",
                        "overrideStatus__delivered",
                        "overrideStatus__notDelivered"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/maps/lightGray.svg",
                        "color": "#a5a5a5"
                    }
                }
            },
            "DBS": {
                "INTRANSIT": {
                    "title": {
                        "id": "deliveryMediumMasterName",
                        "dataKey": "deliveryMediumMasterName",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "tripName",
                        "dataKey": "tripName",
                        "labelKey": "tripName",
                        "dataType": "special",
                        "classList": "tertiaryLink"
                    },
                    {
                        "id": "isAttandanceFl",
                        "dataKey": "isAttandanceFl",
                        "dataType": "boolean",
                        "labelKey": "present",
                        "classList": ""
                    },
                    {
                        "id": "isOnBreakFl",
                        "dataKey": "isOnBreakFl",
                        "dataType": "boolean",
                        "labelKey": "On Break",
                        "classList": ""
                    }
                    ],
                    "L2": [{
                        "id": "phoneNumber",
                        "dataKey": "phoneNumber",
                        "dataType": "text",
                        "labelKey": "phoneNumber"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "capacityInUnits",
                        "dataKey": "capacityInUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    },
                    {
                        "id": "deliveryType",
                        "dataKey": "deliveryMediumMasterTypeCd",
                        "dataType": "text",
                        "labelKey": "deliveryType"
                    }
                    ],
                    "L3": [{
                        "id": "userName",
                        "dataKey": "userName",
                        "dataType": "text",
                        "labelKey": "userName"
                    },
                    {
                        "id": "weeklyOff",
                        "dataKey": "weeklyOff",
                        "dataType": "text",
                        "labelKey": "weeklyOff"
                    }
                    ],
                    "actions": [
                        "trackNow",
                        "dmDetails",
                        "notify"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/live/running.gif"
                    }
                },
                "AVAILABLE": {
                    "title": {
                        "id": "deliveryMediumMasterName",
                        "dataKey": "deliveryMediumMasterName",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "isOnBreakFl",
                        "dataKey": "isOnBreakFl",
                        "dataType": "boolean",
                        "labelKey": "On Break",
                        "classList": ""
                    }
                    ],
                    "L2": [{
                        "id": "phoneNumber",
                        "dataKey": "phoneNumber",
                        "dataType": "text",
                        "labelKey": "phoneNumber"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "capacityInUnits",
                        "dataKey": "capacityInUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    },
                    {
                        "id": "deliveryType",
                        "dataKey": "deliveryMediumMasterTypeCd",
                        "dataType": "text",
                        "labelKey": "deliveryType"
                    }
                    ],
                    "L3": [{
                        "id": "userName",
                        "dataKey": "userName",
                        "dataType": "text",
                        "labelKey": "userName"
                    },
                    {
                        "id": "weeklyOff",
                        "dataKey": "weeklyOff",
                        "dataType": "text",
                        "labelKey": "weeklyOff"
                    }
                    ],
                    "actions": [
                        "update",
                        "dmDetails",
                        "changePwd",
                        "delete",
                        "notify",
                        "more__inactive",
                        "more__absent"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/live/available.svg"
                    }
                },
                "INACTIVE": {
                    "title": {
                        "id": "deliveryMediumMasterName",
                        "dataKey": "deliveryMediumMasterName",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    }],
                    "L2": [{
                        "id": "phoneNumber",
                        "dataKey": "phoneNumber",
                        "dataType": "text",
                        "labelKey": "phoneNumber"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "capacityInUnits",
                        "dataKey": "capacityInUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    },
                    {
                        "id": "deliveryType",
                        "dataKey": "deliveryMediumMasterTypeCd",
                        "dataType": "text",
                        "labelKey": "deliveryType"
                    }
                    ],
                    "L3": [{
                        "id": "userName",
                        "dataKey": "userName",
                        "dataType": "text",
                        "labelKey": "userName"
                    },
                    {
                        "id": "weeklyOff",
                        "dataKey": "weeklyOff",
                        "dataType": "text",
                        "labelKey": "weeklyOff"
                    }
                    ],
                    "actions": [
                        "more__active",
                        "dmDetails",
                        "changePwd",
                        "update",
                        "delete"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/live/inactive.svg"
                    }
                },
                "ABSENT": {
                    "title": {
                        "id": "deliveryMediumMasterName",
                        "dataKey": "deliveryMediumMasterName",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    }],
                    "L2": [{
                        "id": "phoneNumber",
                        "dataKey": "phoneNumber",
                        "dataType": "text",
                        "labelKey": "phoneNumber"
                    },
                    {
                        "id": "branchName",
                        "dataKey": "branchName",
                        "dataType": "text",
                        "labelKey": "branchName"
                    },
                    {
                        "id": "capacityInUnits",
                        "dataKey": "capacityInUnits",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "capacityInVolume",
                        "dataKey": "capacityInVolume",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "capacityInWeight",
                        "dataKey": "capacityInWeight",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    },
                    {
                        "id": "deliveryType",
                        "dataKey": "deliveryMediumMasterTypeCd",
                        "dataType": "text",
                        "labelKey": "deliveryType"
                    }
                    ],
                    "L3": [{
                        "id": "userName",
                        "dataKey": "userName",
                        "dataType": "text",
                        "labelKey": "userName"
                    },
                    {
                        "id": "weeklyOff",
                        "dataKey": "weeklyOff",
                        "dataType": "text",
                        "labelKey": "weeklyOff"
                    }
                    ],
                    "actions": [
                        "more__present",
                        "dmDetails",
                        "changePwd",
                        "update",
                        "delete",
                        "notify",
                        "more__inactive"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/live/absent.svg"
                    }
                }
            },
            "TRIPS": {
                "NOTSTARTED": {
                    "title": {
                        "id": "tripName",
                        "dataKey": "tripName",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "deliveryMediumName",
                        "dataKey": "deliveryMediumName",
                        "labelKey": "deliveryMediumName",
                        "dataType": "special",
                        "classList": "tertiaryLink"
                    },
                    {
                        "id": "orderCount",
                        "dataKey": "orderCount",
                        "dataType": "special",
                        "labelKey": "orderCount",
                        "classList": ""
                    }
                    ],
                    "L2": [{
                        "id": "unitsCapacity",
                        "dataKey": "unitsCapacity",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "weightCapacity",
                        "dataKey": "weightCapacity",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    },
                    {
                        "id": "volumeCapacity",
                        "dataKey": "volumeCapacity",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "routeName",
                        "dataKey": "routeName",
                        "dataType": "text",
                        "labelKey": "routeName"
                    },
                    {
                        "id": "vehicleNo",
                        "dataKey": "vehicleNo",
                        "dataType": "text",
                        "labelKey": "vehicleNo"
                    }
                    ],
                    "L3": [{
                        "id": "estimatedStartDate",
                        "dataKey": "estimatedStartDate",
                        "dataType": "datetime",
                        "labelKey": "estimatedStartDate"
                    },
                    {
                        "id": "estimatedEndDate",
                        "dataKey": "estimatedEndDate",
                        "dataType": "datetime",
                        "labelKey": "estimatedEndDate"
                    },
                    {
                        "id": "estimatedDistance",
                        "dataKey": "estimatedDistance",
                        "dataType": "distance",
                        "labelKey": "estimatedDistance"
                    }
                    ],
                    "actions": [
                        "startTrip",
                        "showDRS",
                        "printDRS",
                        "tripDetails",
                        "delete"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/live/notstarted.svg"
                    }
                },
                "STARTED": {
                    "title": {
                        "id": "tripName",
                        "dataKey": "tripName",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "deliveryMediumName",
                        "dataKey": "deliveryMediumName",
                        "labelKey": "deliveryMediumName",
                        "dataType": "special",
                        "classList": "tertiaryLink"
                    },
                    {
                        "id": "tripStartDt",
                        "dataKey": "tripStartDt",
                        "dataType": "datetime",
                        "labelKey": "startDate"
                    },
                    {
                        "id": "tripEndDt",
                        "dataKey": "tripEndDt",
                        "dataType": "datetime",
                        "labelKey": "endDate"
                    },
                    {
                        "id": "orderCount",
                        "dataKey": "orderCount",
                        "dataType": "special",
                        "labelKey": "orderCount",
                        "classList": ""
                    }
                    ],
                    "L2": [{
                        "id": "unitsCapacity",
                        "dataKey": "unitsCapacity",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "weightCapacity",
                        "dataKey": "weightCapacity",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    },
                    {
                        "id": "volumeCapacity",
                        "dataKey": "volumeCapacity",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "routeName",
                        "dataKey": "routeName",
                        "dataType": "text",
                        "labelKey": "routeName"
                    },
                    {
                        "id": "vehicleNo",
                        "dataKey": "vehicleNo",
                        "dataType": "text",
                        "labelKey": "vehicleNo"
                    },
                    {
                        "id": "tripCashCollected",
                        "dataKey": "tripCashCollected",
                        "dataType": "text",
                        "labelKey": "amountCollected"
                    },
                    {
                        "id": "tripCashToBeCollected",
                        "dataKey": "tripCashToBeCollected",
                        "dataType": "text",
                        "labelKey": "tripCashToBeCollected"
                    }
                    ],
                    "L3": [{
                        "id": "estimatedStartDate",
                        "dataKey": "estimatedStartDate",
                        "dataType": "datetime",
                        "labelKey": "estimatedStartDate"
                    },
                    {
                        "id": "estimatedEndDate",
                        "dataKey": "estimatedEndDate",
                        "dataType": "datetime",
                        "labelKey": "estimatedEndDate"
                    },
                    {
                        "id": "estimatedDistance",
                        "dataKey": "estimatedDistance",
                        "dataType": "distance",
                        "labelKey": "estimatedDistance"
                    }
                    ],
                    "actions": [
                        "history",
                        "showDRS",
                        "printDRS",
                        "tripDetails",
                        "delete",
                        "recordCash"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/live/started.svg",
                        "classes": "infiniteFade"
                    }
                },
                "ENDED": {
                    "title": {
                        "id": "tripName",
                        "dataKey": "tripName",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "status",
                        "dataKey": "status",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "deliveryMediumName",
                        "dataKey": "deliveryMediumName",
                        "labelKey": "deliveryMediumName",
                        "dataType": "special",
                        "classList": "tertiaryLink"
                    },
                    {
                        "id": "tripStartDt",
                        "dataKey": "tripStartDt",
                        "dataType": "datetime",
                        "labelKey": "startDate"
                    },
                    {
                        "id": "tripEndDt",
                        "dataKey": "tripEndDt",
                        "dataType": "datetime",
                        "labelKey": "endDate"
                    },
                    {
                        "id": "orderCount",
                        "dataKey": "orderCount",
                        "dataType": "special",
                        "labelKey": "orderCount",
                        "classList": ""
                    }
                    ],
                    "L2": [{
                        "id": "unitsCapacity",
                        "dataKey": "unitsCapacity",
                        "dataType": "text",
                        "labelKey": "Capacity (in Units)"
                    },
                    {
                        "id": "weightCapacity",
                        "dataKey": "weightCapacity",
                        "dataType": "weight",
                        "labelKey": "capacityKgs"
                    },
                    {
                        "id": "volumeCapacity",
                        "dataKey": "volumeCapacity",
                        "dataType": "volume",
                        "labelKey": "capacityCc"
                    },
                    {
                        "id": "routeName",
                        "dataKey": "routeName",
                        "dataType": "text",
                        "labelKey": "routeName"
                    },
                    {
                        "id": "vehicleNo",
                        "dataKey": "vehicleNo",
                        "dataType": "text",
                        "labelKey": "vehicleNo"
                    },
                    {
                        "id": "tripCashCollected",
                        "dataKey": "tripCashCollected",
                        "dataType": "text",
                        "labelKey": "amountCollected"
                    },
                    {
                        "id": "tripCashToBeCollected",
                        "dataKey": "tripCashToBeCollected",
                        "dataType": "text",
                        "labelKey": "tripCashToBeCollected"
                    }
                    ],
                    "L3": [{
                        "id": "estimatedStartDate",
                        "dataKey": "estimatedStartDate",
                        "dataType": "datetime",
                        "labelKey": "estimatedStartDate"
                    },
                    {
                        "id": "estimatedEndDate",
                        "dataKey": "estimatedEndDate",
                        "dataType": "datetime",
                        "labelKey": "estimatedEndDate"
                    },
                    {
                        "id": "estimatedDistance",
                        "dataKey": "estimatedDistance",
                        "dataType": "distance",
                        "labelKey": "estimatedDistance"
                    }
                    ],
                    "actions": [
                        "history",
                        "showDRS",
                        "printDRS",
                        "tripDetails",
                        "delete",
                        "recordCash"
                    ],
                    "icon": {
                        "type": "image",
                        "url": "images/live/ended.svg"
                    }
                }
            },
            "DRS_ORDERS": {
                "NOTDISPATCHED": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "packageStatusCd",
                        "dataKey": "packageStatusCd",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "calculatedStartDt__calculatedEndDt",
                        "dataKey": "calculatedStartDt__calculatedEndDt",
                        "dataType": "special",
                        "labelKey": "assignedTo"
                    },
                    {
                        "id": "isGeocoded",
                        "dataKey": "isGeocoded",
                        "dataType": "boolean",
                        "labelKey": "isGeocoded"
                    }
                    ],
                    "L2": [{
                        "id": "origClientNodeName",
                        "dataKey": "origClientNodeName",
                        "dataType": "text",
                        "labelKey": "from"
                    },
                    {
                        "id": "destClientNodeName",
                        "dataKey": "destClientNodeName",
                        "dataType": "text",
                        "labelKey": "to"
                    },
                    {
                        "id": "address",
                        "dataKey": "address",
                        "dataType": "text",
                        "labelKey": "address"
                    },
                    {
                        "id": "customerName",
                        "dataKey": "customerName",
                        "dataType": "text",
                        "labelKey": "customerName"
                    },
                    {
                        "id": "estimatedDistance",
                        "dataKey": "estimatedDistance",
                        "dataType": "text",
                        "labelKey": "estimatedDistance"
                    },
                    {
                        "id": "itemCount",
                        "dataKey": "itemCount",
                        "dataType": "text",
                        "labelKey": "itemCount"
                    }
                    ],
                    "L3": [],
                    "actions": [
                        "remove"
                    ],
                    "icon": {
                        "type": "html",
                        "url": "templateUrl"
                    }
                },
                "INTRANSIT": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "packageStatusCd",
                        "dataKey": "packageStatusCd",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "calculatedStartDt__calculatedEndDt",
                        "dataKey": "calculatedStartDt__calculatedEndDt",
                        "dataType": "special",
                        "labelKey": "assignedTo"
                    },
                    {
                        "id": "isGeocoded",
                        "dataKey": "isGeocoded",
                        "dataType": "boolean",
                        "labelKey": "isGeocoded"
                    }
                    ],
                    "L2": [{
                        "id": "origClientNodeName",
                        "dataKey": "origClientNodeName",
                        "dataType": "text",
                        "labelKey": "from"
                    },
                    {
                        "id": "destClientNodeName",
                        "dataKey": "destClientNodeName",
                        "dataType": "text",
                        "labelKey": "to"
                    },
                    {
                        "id": "address",
                        "dataKey": "address",
                        "dataType": "text",
                        "labelKey": "address"
                    },
                    {
                        "id": "customerName",
                        "dataKey": "customerName",
                        "dataType": "text",
                        "labelKey": "customerName"
                    },
                    {
                        "id": "estimatedDistance",
                        "dataKey": "estimatedDistance",
                        "dataType": "text",
                        "labelKey": "estimatedDistance"
                    },
                    {
                        "id": "itemCount",
                        "dataKey": "itemCount",
                        "dataType": "text",
                        "labelKey": "itemCount"
                    }
                    ],
                    "L3": [],
                    "actions": [
                        "remove"
                    ],
                    "icon": {
                        "type": "html",
                        "url": "templateUrl"
                    }
                },
                "DELIVERED": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "packageStatusCd",
                        "dataKey": "packageStatusCd",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "actualArrivalTime",
                        "dataKey": "actualArrivalTime",
                        "dataType": "datetime",
                        "labelKey": "actualTime"
                    }
                    ],
                    "L2": [{
                        "id": "origClientNodeName",
                        "dataKey": "origClientNodeName",
                        "dataType": "text",
                        "labelKey": "from"
                    },
                    {
                        "id": "destClientNodeName",
                        "dataKey": "destClientNodeName",
                        "dataType": "text",
                        "labelKey": "to"
                    },
                    {
                        "id": "address",
                        "dataKey": "address",
                        "dataType": "text",
                        "labelKey": "address"
                    },
                    {
                        "id": "customerName",
                        "dataKey": "customerName",
                        "dataType": "text",
                        "labelKey": "customerName"
                    },
                    {
                        "id": "estimatedDistance",
                        "dataKey": "estimatedDistance",
                        "dataType": "text",
                        "labelKey": "estimatedDistance"
                    },
                    {
                        "id": "itemCount",
                        "dataKey": "itemCount",
                        "dataType": "text",
                        "labelKey": "itemCount"
                    }
                    ],
                    "L3": [],
                    "actions": [
                        "remove"
                    ],
                    "icon": {
                        "type": "html",
                        "url": "templateUrl"
                    }
                },
                "PICKEDUP": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "packageStatusCd",
                        "dataKey": "packageStatusCd",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "actualArrivalTime",
                        "dataKey": "actualArrivalTime",
                        "dataType": "datetime",
                        "labelKey": "actualTime"
                    }
                    ],
                    "L2": [{
                        "id": "origClientNodeName",
                        "dataKey": "origClientNodeName",
                        "dataType": "text",
                        "labelKey": "from"
                    },
                    {
                        "id": "destClientNodeName",
                        "dataKey": "destClientNodeName",
                        "dataType": "text",
                        "labelKey": "to"
                    },
                    {
                        "id": "address",
                        "dataKey": "address",
                        "dataType": "text",
                        "labelKey": "address"
                    },
                    {
                        "id": "customerName",
                        "dataKey": "customerName",
                        "dataType": "text",
                        "labelKey": "customerName"
                    },
                    {
                        "id": "estimatedDistance",
                        "dataKey": "estimatedDistance",
                        "dataType": "text",
                        "labelKey": "estimatedDistance"
                    },
                    {
                        "id": "itemCount",
                        "dataKey": "itemCount",
                        "dataType": "text",
                        "labelKey": "itemCount"
                    }
                    ],
                    "L3": [],
                    "actions": [
                        "remove"
                    ],
                    "icon": {
                        "type": "html",
                        "url": "templateUrl"
                    }
                },
                "NOTDELIVERED": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "packageStatusCd",
                        "dataKey": "packageStatusCd",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "actualArrivalTime",
                        "dataKey": "actualArrivalTime",
                        "dataType": "datetime",
                        "labelKey": "actualTime"
                    }
                    ],
                    "L2": [{
                        "id": "origClientNodeName",
                        "dataKey": "origClientNodeName",
                        "dataType": "text",
                        "labelKey": "from"
                    },
                    {
                        "id": "destClientNodeName",
                        "dataKey": "destClientNodeName",
                        "dataType": "text",
                        "labelKey": "to"
                    },
                    {
                        "id": "address",
                        "dataKey": "address",
                        "dataType": "text",
                        "labelKey": "address"
                    },
                    {
                        "id": "customerName",
                        "dataKey": "customerName",
                        "dataType": "text",
                        "labelKey": "customerName"
                    },
                    {
                        "id": "estimatedDistance",
                        "dataKey": "estimatedDistance",
                        "dataType": "text",
                        "labelKey": "estimatedDistance"
                    },
                    {
                        "id": "itemCount",
                        "dataKey": "itemCount",
                        "dataType": "text",
                        "labelKey": "itemCount"
                    }
                    ],
                    "L3": [],
                    "actions": [
                        "remove"
                    ],
                    "icon": {
                        "type": "html",
                        "url": "templateUrl"
                    }
                },
                "NOTPICKEDUP": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "packageStatusCd",
                        "dataKey": "packageStatusCd",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "actualArrivalTime",
                        "dataKey": "actualArrivalTime",
                        "dataType": "datetime",
                        "labelKey": "actualTime"
                    }
                    ],
                    "L2": [{
                        "id": "origClientNodeName",
                        "dataKey": "origClientNodeName",
                        "dataType": "text",
                        "labelKey": "from"
                    },
                    {
                        "id": "destClientNodeName",
                        "dataKey": "destClientNodeName",
                        "dataType": "text",
                        "labelKey": "to"
                    },
                    {
                        "id": "address",
                        "dataKey": "address",
                        "dataType": "text",
                        "labelKey": "address"
                    },
                    {
                        "id": "customerName",
                        "dataKey": "customerName",
                        "dataType": "text",
                        "labelKey": "customerName"
                    },
                    {
                        "id": "estimatedDistance",
                        "dataKey": "estimatedDistance",
                        "dataType": "text",
                        "labelKey": "estimatedDistance"
                    },
                    {
                        "id": "itemCount",
                        "dataKey": "itemCount",
                        "dataType": "text",
                        "labelKey": "itemCount"
                    }
                    ],
                    "L3": [],
                    "actions": [
                        "remove"
                    ],
                    "icon": {
                        "type": "html",
                        "url": "templateUrl"
                    }
                },
                "CANCELLED": {
                    "title": {
                        "id": "orderNo",
                        "dataKey": "orderNo",
                        "dataType": "text",
                        "labelKey": "",
                        "label": "",
                        "value": "",
                        "classList": ""
                    },
                    "L1": [{
                        "id": "startTimeWindow__endTimeWindow",
                        "dataKey": "startTimeWindow__endTimeWindow",
                        "labelKey": "event_timeWindow",
                        "dataType": "special"
                    },
                    {
                        "id": "packageStatusCd",
                        "dataKey": "packageStatusCd",
                        "dataType": "text",
                        "labelKey": "status",
                        "classList": ""
                    },
                    {
                        "id": "actualArrivalTime",
                        "dataKey": "actualArrivalTime",
                        "dataType": "datetime",
                        "labelKey": "actualTime"
                    }
                    ],
                    "L2": [{
                        "id": "origClientNodeName",
                        "dataKey": "origClientNodeName",
                        "dataType": "text",
                        "labelKey": "from"
                    },
                    {
                        "id": "destClientNodeName",
                        "dataKey": "destClientNodeName",
                        "dataType": "text",
                        "labelKey": "to"
                    },
                    {
                        "id": "address",
                        "dataKey": "address",
                        "dataType": "text",
                        "labelKey": "address"
                    },
                    {
                        "id": "customerName",
                        "dataKey": "customerName",
                        "dataType": "text",
                        "labelKey": "customerName"
                    },
                    {
                        "id": "estimatedDistance",
                        "dataKey": "estimatedDistance",
                        "dataType": "text",
                        "labelKey": "estimatedDistance"
                    },
                    {
                        "id": "itemCount",
                        "dataKey": "itemCount",
                        "dataType": "text",
                        "labelKey": "itemCount"
                    }
                    ],
                    "L3": [],
                    "actions": [
                        "remove"
                    ],
                    "icon": {
                        "type": "html",
                        "url": "templateUrl"
                    }
                }
            }
        }
    }
}

export default LiveConstant;