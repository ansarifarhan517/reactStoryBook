const AWB_LABEL_DROPDOWN_FILTER_OPTIONS_MAPPING = {
    isActiveFl: (dynamicLabels: Record<string, string>) => {
        return [
            {value: 'Y', label: dynamicLabels.active},
            {value: 'N', label: dynamicLabels.inactive}
        ]
    }
}

export default AWB_LABEL_DROPDOWN_FILTER_OPTIONS_MAPPING