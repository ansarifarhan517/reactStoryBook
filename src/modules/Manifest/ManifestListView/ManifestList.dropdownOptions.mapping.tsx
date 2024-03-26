import { userAccessInfo } from "../../../utils/constants"
const MANIFEST_DROPDOWN_FILTER_OPTIONS_MAPPING = {
  manifestStatus: (dynamicLabels: Record<string, string>) => {
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
  tripStatus: (dynamicLabels: Record<string, string>) => {
    if (dynamicLabels.STARTED) {
      return [
        { value: 'STARTED', label: dynamicLabels.STARTED },
        { value: 'NOTSTARTED', label: dynamicLabels.NOTSTARTED },
        { value: 'ENDED', label: dynamicLabels.ENDED }
      ]
    } else {
      return []
    }
  },
  manifestType: (dynamicLabels: Record<string, string>) => {
    if (dynamicLabels.order_s) {
      if (userAccessInfo.superType == "MIDDLEMILE") {
        return [
          { value: 'ORDER', label: userAccessInfo.superType == "MIDDLEMILE" ? dynamicLabels.mm_order_s : dynamicLabels.order_s },
          { value: 'BRANCH', label: dynamicLabels.branch },
          { value: 'COURIER', label: dynamicLabels.courier },
          { value: 'TRIP', label: dynamicLabels.trip }
        ]
      } else {
        return [
          { value: 'ORDER', label: userAccessInfo.superType == "MIDDLEMILE" ? dynamicLabels.mm_order_s : dynamicLabels.order_s },
          { value: 'COURIER', label: dynamicLabels.courier },
          { value: 'TRIP', label: dynamicLabels.trip }
        ]
      }
    } else {
      return []
    }
  }


}

export default MANIFEST_DROPDOWN_FILTER_OPTIONS_MAPPING