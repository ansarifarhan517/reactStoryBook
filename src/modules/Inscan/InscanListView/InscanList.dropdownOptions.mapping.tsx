const INSCAN_DROPDOWN_FILTER_OPTIONS_MAPPING = {
    hubScanStatus : (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.INSCANNED) {
          return [
            { value: 'INSCANNED', label: dynamicLabels.INSCANNED },
            { value: 'HANDEDOVER', label: dynamicLabels.HANDEDOVER },
            { value: 'NOTSCANNED', label: dynamicLabels.NOTSCANNED },
            { value: 'OUTSCANNED', label: dynamicLabels.OUTSCANNED },
            { value: 'INSCANNED_ORIGIN_BRANCH', label: dynamicLabels.INSCANNED_ORIGIN_BRANCH },
            { value: 'INSCANNED_DESTINATION_BRANCH', label: dynamicLabels.INSCANNED_DESTINATION_BRANCH },
            { value: 'OUTSCANNED_ORIGIN_BRANCH', label: dynamicLabels.OUTSCANNED_ORIGIN_BRANCH },
            { value: 'OUTSCANNED_DESTINATION_BRANCH', label: dynamicLabels.OUTSCANNED_DESTINATION_BRANCH },
            { value: 'HANDEDOVER_ORIGIN_BRANCH', label: dynamicLabels.HANDEDOVER_ORIGIN_BRANCH },
            { value: 'HANDEDOVER_DESTINATION_BRANCH', label: dynamicLabels.HANDEDOVER_DESTINATION_BRANCH },
          ]
        } else {
          return []
        }
    },
    orderStatus : (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.DELIVERED) {
          return [
            { value: 'DELIVERED', label: dynamicLabels.DELIVERED },
            { value: 'INTRANSIT', label: dynamicLabels.INTRANSIT },
            { value: 'NOTDISPATCHED', label: dynamicLabels.NOTDISPATCHED },
            { value: 'PICKEDUP', label: dynamicLabels.PICKEDUP },
            { value: 'NOTPICKEDUP', label: dynamicLabels.NOTPICKEDUP },
            { value: 'NOTDELIVERED', label: dynamicLabels.NOTDELIVERED },
            { value: 'CANCELLED', label: dynamicLabels.CANCELLED },
            { value: 'ARRIVED', label: dynamicLabels.ARRIVED }
          ]
        } else {
          return []
        }
    }
}

export default INSCAN_DROPDOWN_FILTER_OPTIONS_MAPPING