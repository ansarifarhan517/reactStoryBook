export const getBreadCrumbOptions = (_dynamicLabel: any) => {
  return [
    {value: "ALL", label: `${_dynamicLabel['all'] || 'All'} ${_dynamicLabel.orders || 'Orders'}`, id: "all"},
    {
      value: "NOTDISPATCHED",
      label: `${_dynamicLabel['NOTDISPATCHED']} ${_dynamicLabel.orders}`,
      id: "notDispatched",
    },
    {
      value: "INTRANSIT",
      label: `${_dynamicLabel['INTRANSIT']} ${_dynamicLabel.orders}`,
      id: "inTransit",
    },
    {
      value: "COMPLETED",
      label: `${_dynamicLabel['COMPLETED']} ${_dynamicLabel.orders}`,
      id: "completed",
    },
    {
      value: "CANCELLED",
      label: `${_dynamicLabel['CANCELLED']} ${_dynamicLabel.orders}`,
      id: "cancelled",
    },
    {
      value: "NOTCOMPLETED",
      label: `${_dynamicLabel['NOTCOMPLETED']} ${_dynamicLabel.orders}`,
      id: "notCompleted",
    },
    {
      value: "DELETED",
      label: `${_dynamicLabel['DELETED']} ${_dynamicLabel.orders}`,
      id: "deleted",
    },
  ]
}

export const notifyCustomerDropdown = () => {
  return [
    {value: "ETA Notification", label: "ETA Notification"},
    {
      value: "Update Address",
      label: "Update Address",
    },
    {
      value: "Provide Feedback",
      label: "Provide Feedback",
    },
  ]
}

export const orderStatusMappings = {
  DELIVERED: "Delivered",
  INTRANSIT: "Intransit",
  NOTDISPATCHED: "Not Dispatched",
  PICKEDUP: "Picked Up",
  NOTPICKEDUP: "Attempted Pickup",
  NOTDELIVERED: "Attempted Delivery",
  CANCELLED: "Cancelled",
  DELIVER: "Delivery",
  FORWARD: "Forward",
  REVERSE: "Reverse",
  RTM: "RTM",
  PICKUP: "Pickup",
  DELIVERYLOCATION: "Delivery Location",
  PICKUPLOCATION: "Pickup Location",
  STARTED: "Started",
  NOTSTARTED: "Not Started",
  ENDED: "Ended",
}
