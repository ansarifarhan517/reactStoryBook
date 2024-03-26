
export interface IDropdownOptionType {
    value: string
    label: string
    tooltipText?: string
  }
  export interface IFilterMapping {
    [key: string]: {
      [key: string]: () => IDropdownOptionType[]
    }
  }

 export interface IBranchListType {
     id: number;
     value: string;
 } 

 const orderType = {
    DELIVER: "DELIVER",
    PICKUP: "PICKUP"
}

const orderStatus = {
    INTRANSIT: "INTRANSIT",
    NOTDISPATCHED: "NOTDISPATCHED",
    DELIVERED: "DELIVERED",
    NOTDELIVERED: "NOTDELIVERED",
    ARRIVED: "ARRIVED",
    PICKEDUP: "PICKEDUP",
    NOTPICKEDUP: "NOTPICKEDUP",
    CANCELLED: "CANCELLED"
}

const NOTAVAILABLE = "NOTAVAILABLE";

const TOTAL_ORDERS_DROPDOWN_FILTER_OPTIONS_MAPPING = {
    plannedSequenceCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    plannedTimeCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    deliveryTimeCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    ordersMarkedDeliveredViaMobileCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    checkInCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    checkInWithinGeofenceCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    checkOutCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    checkOutWithinGeofenceCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    distanceTravelledCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    cashCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    serviceTimeCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    esignCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    epodCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    customerRatingCompliant: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: dynamicLabels.yes, label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: dynamicLabels.no, label: dynamicLabels.No, tooltipText: dynamicLabels.No },
                { value: NOTAVAILABLE, label: dynamicLabels.notAvailable, tooltipText: dynamicLabels.notAvailable }
            ]
        } else {
            return []
        }

    },
    orderType: async (dynamicLabels: Record<string, string>) => {
        return [
            { value: orderType.DELIVER, label: dynamicLabels.DELIVER, tooltipText: dynamicLabels.DELIVER },
            { value: orderType.PICKUP, label: dynamicLabels.PICKUP, tooltipText: dynamicLabels.PICKUP },
        ];
    },
    orderStatus: async (dynamicLabels: Record<string, string>) => {    
        return [
            { value: orderStatus.INTRANSIT, label: dynamicLabels.INTRANSIT, tooltipText: dynamicLabels.INTRANSIT },
            { value: orderStatus.NOTDISPATCHED, label: dynamicLabels.NOTDISPATCHED, tooltipText: dynamicLabels.NOTDISPATCHED },
            { value: orderStatus.DELIVERED, label: dynamicLabels.DELIVERED, tooltipText: dynamicLabels.DELIVERED },
            { value: orderStatus.NOTDELIVERED, label: dynamicLabels.NOTDELIVERED, tooltipText: dynamicLabels.NOTDELIVERED },
            { value: orderStatus.ARRIVED, label: dynamicLabels.ARRIVED, tooltipText: dynamicLabels.ARRIVED },
            { value: orderStatus.PICKEDUP, label: dynamicLabels.PICKEDUP, tooltipText: dynamicLabels.PICKEDUP },
            { value: orderStatus.NOTPICKEDUP, label: dynamicLabels.NOTPICKEDUP, tooltipText: dynamicLabels.NOTPICKEDUP },
            { value: orderStatus.CANCELLED, label: dynamicLabels.CANCELLED, tooltipText: dynamicLabels.CANCELLED },
        ];
    },
    phoneModelCompliance: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: '1', label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: '0', label: dynamicLabels.No, tooltipText: dynamicLabels.No },
            ]
        } else {
            return []
        }
    },
    osversionCompliance: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: '1', label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: '0', label: dynamicLabels.No, tooltipText: dynamicLabels.No },
            ]
        } else {
            return []
        }
    },
    appVersionCodeCompliance: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.Yes && dynamicLabels.No && dynamicLabels.yes && dynamicLabels.no && dynamicLabels.notAvailable) {
            return [
                { value: '1', label: dynamicLabels.Yes, tooltipText: dynamicLabels.Yes },
                { value: '0', label: dynamicLabels.No, tooltipText: dynamicLabels.No },
            ]
        } else {
            return []
        }
    },
}

export default TOTAL_ORDERS_DROPDOWN_FILTER_OPTIONS_MAPPING;