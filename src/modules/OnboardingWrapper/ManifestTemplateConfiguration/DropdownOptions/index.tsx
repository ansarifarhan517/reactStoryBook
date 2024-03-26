const MANIFEST_TEMPLATE_CONFIGURATION_DROPDOWN_MAPPING = {
       
        isActiveFl: async (dynamicLabels: Record<string, string>) => {
            if (dynamicLabels) {
              return [
                { value: 'Y', label: dynamicLabels.active },
                { value: 'N', label: dynamicLabels.inactive },
              ]
            } else {
              return []
            }
          },
}

export default MANIFEST_TEMPLATE_CONFIGURATION_DROPDOWN_MAPPING