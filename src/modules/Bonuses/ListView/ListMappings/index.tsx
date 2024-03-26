const BONUSES_FILTER_DROPDOWNOPTIONS_MAPPING = {
    isActiveFl: (dynamicLabels: Record<string, string>) => {
        return [
            {value: 'Y', label: dynamicLabels.active || "Active"},
            {value: 'N', label: dynamicLabels.inactive || "Inactive"}
        ]
    },
}

export default BONUSES_FILTER_DROPDOWNOPTIONS_MAPPING;