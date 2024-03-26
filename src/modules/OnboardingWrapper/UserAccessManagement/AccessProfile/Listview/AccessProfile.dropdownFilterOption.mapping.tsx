const ACCESSPROFILE_DROPDOWNFILTEROPTIONS_MAPPING = {
  activeFl: async (dynamicLabels: Record<string, string>) => {
          return [
            { value: 'Y', label: dynamicLabels.active },
            { value: 'N', label: dynamicLabels.inactive }
          ]
        }
}

export default ACCESSPROFILE_DROPDOWNFILTEROPTIONS_MAPPING