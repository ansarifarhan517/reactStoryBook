import LiveConstant from "../LiveConstants/liveConstants";

// /import react from 'react';

export const self: any = {};
self.entities = {
    "orders": {
        "label": "Orders",
        "icons": {
            "all": {
                "default": LiveConstant.headerIconTemplates.orders.ALL,
            },
            "unassigned": {
                "default": LiveConstant.headerIconTemplates.orders.unassigned_s,
                // "custom": "customIcons_<clientId>_<entity>_<statusKey>",
            },
            "assigned": {
                "default": LiveConstant.headerIconTemplates.orders.assigned,
                // "custom": "customIcons_<clientId>_<entity>_<statusKey>",
            },
            "intransit": {
                "default": LiveConstant.headerIconTemplates.orders.INTRANSIT,
                // "custom": "customIcons_<clientId>_<entity>_<statusKey>",
            },
            "pickedup": {
                "default": LiveConstant.headerIconTemplates.orders.PICKEDUP,
                // "custom": "customIcons_<clientId>_<entity>_<statusKey>",
            },
            "attemptedPickedup": {
                "default": LiveConstant.headerIconTemplates.orders.NOTPICKEDUP,
                // "custom": "customIcons_<clientId>_<entity>_<statusKey>",
            },
            "delivered": {
                "default": LiveConstant.headerIconTemplates.orders.DELIVERED,
                // "custom": "customIcons_<clientId>_<entity>_<statusKey>",
            },
            "attemptedDelivered": {
                "default": LiveConstant.headerIconTemplates.orders.NOTDELIVERED,
                // "custom": "customIcons_<clientId>_<entity>_<statusKey>",
            },
            "cancelled": {
                "default": LiveConstant.headerIconTemplates.orders.CANCELLED,
                // "custom": "customIcons_<clientId>_<entity>_<statusKey>",
            }
        },
        "keysMapping": {
            "all": "all",
            "ALL": "all",
            "unassigned": "unassigned",
            "UNASSIGNED": "unassigned",
            "assigned": "assigned",
            "ASSIGNED": "assigned",
            "intransit": "intransit",
            "pickedup": "pickedup",
            "PICKEDUP": "pickedup",
            "attemptedPickedup": "attemptedPickedup",
            "delivered": "delivered",
            "attemptedDelivered": "attemptedDelivered",
            "cancelled": "cancelled",
            "unassigned_s": "unassigned",
            "INTRANSIT": "intransit",
            "DELIVERED": "delivered",
            "NOTPICKEDUP": "attemptedPickedup",
            "NOTDELIVERED": "attemptedDelivered",
            "CANCELLED": "cancelled",
        }
    },
    "dbs": {
        "label": "Delivery Associates",
        "icons": {
            "all": {
                "default": LiveConstant.headerIconTemplates.dbs.ALL,
            },
            "intransit": {
                "default": LiveConstant.headerIconTemplates.dbs.INTRANSIT,
            },
            "available": {
                "default": LiveConstant.headerIconTemplates.dbs.Available,
            },
            "absent": {
                "default": LiveConstant.headerIconTemplates.dbs.Absent,
            },
            "inactive": {
                "default": LiveConstant.headerIconTemplates.dbs.Inactive,
            }
        },
        "keysMapping": {
            "ALL": "all",
            "INTRANSIT": "intransit",
            "Available": "available",
            "Absent": "absent",
            "Inactive": "inactive",
            "AVAILABLE": "available",
            "INACTIVE": "inactive",
            "ABSENT": "absent"

        }
    },
    "trips": {
        "label": "Trips",
        "icons": {
            "all": {
                "default": LiveConstant.headerIconTemplates.trips.ALL,
            },
            "notStarted": {
                "default": LiveConstant.headerIconTemplates.trips.NOTSTARTED,
            },
            "started": {
                "default": LiveConstant.headerIconTemplates.trips.STARTED,
            },
            "ended": {
                "default": LiveConstant.headerIconTemplates.trips.ENDED,
            }

        },
        "keysMapping": {
            "ALL": "all",
            "NOTSTARTED": "notStarted",
            "STARTED": "started",
            "ENDED": "ended"
        }
    },
    "carrier": {
        "label": "Delivery Associates*sl",
        "icons": {
            "all": {
                "default": LiveConstant.headerIconTemplates.carrier.ALL,
            },
            "AVAILABLE": {
                "default": LiveConstant.headerIconTemplates.carrier.Available,
            },
            "Inactive": {
                "default": LiveConstant.headerIconTemplates.carrier.Inactive,
            },
            "available": {
                "default": LiveConstant.headerIconTemplates.carrier.Available,

            }
        },
        "keysMapping": {
            "ALL": "all",
            "Available": "available",
            "inactive": "Inactive",
            "INACTIVE": "inactive",
            "Inactive": "Inactive"
        }
    }
}
export const generateDynamicImage = function (entity: string, key: string, defaultImg: string, carrierPersona: string) {
    var imgPathToReturn = "";
    if (entity == 'dbs' && carrierPersona) {
        entity = 'carrier';
    }
    if (entity && key) {
        if (self.entities[entity] && self.entities[entity]["icons"]) {
            if (self.entities[entity]["icons"][key]) {
                //if the key is straightforward present in my main mapping
                imgPathToReturn = self.entities[entity]["icons"][key]['custom'] ? self.entities[entity]["icons"][key]['custom'] : self.entities[entity]["icons"][key]['default'];
                return imgPathToReturn;
            } else if (self.entities[entity]["keysMapping"][key]) {
                //if the key is present in keys mapping, use this key
                var replacedKey = self.entities[entity]["keysMapping"][key];
                imgPathToReturn = self.entities[entity]["icons"][replacedKey]['custom'] ? self.entities[entity]["icons"][replacedKey]['custom'] : self.entities[entity]["icons"][replacedKey]['default'];
                return imgPathToReturn;
            } else if (defaultImg) {
                // console.log("Add my mapping : ", key);
                imgPathToReturn = defaultImg;
                return imgPathToReturn;
            } else {
                // console.log("Add my mapping : ", key);
                imgPathToReturn = "images/Warning-icon.png"
                return imgPathToReturn;
            }
        }
    }

    if (!imgPathToReturn) {
        if (defaultImg) {
            imgPathToReturn = defaultImg;
            return imgPathToReturn;
        } else {
            imgPathToReturn = "images/Warning-icon.png"
        }
    }

    return imgPathToReturn;
}










