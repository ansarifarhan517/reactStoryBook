
const ALERT_MESSAGE_DROPDOWN_FILTER_OPTIONS_MAPPING = {
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.active && dynamicLabels.inactive) {
            return [
                { value: 'Y', label: dynamicLabels.active, title: dynamicLabels.active },
                { value: 'N', label: dynamicLabels.inactive, title: dynamicLabels.inactive }
            ]
        } else {
            return []
        }
    },
}

export default ALERT_MESSAGE_DROPDOWN_FILTER_OPTIONS_MAPPING;