const RATEPROFILE_DROPDOWNOPTION_MAPPING = {
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
          return [
            { value: 'Y', label: dynamicLabels.yes },
            { value: 'N', label: dynamicLabels.no }
          ]
      },
      profileType: async (dynamicLabels: Record<string, string>) => {
        return [
          { value: "OWNFLEET", label: dynamicLabels.OWNFLEET || "Owned Fleet" },
          { value: "CARRIER", label: dynamicLabels.CARRIER || "Carrier" },
        ];
      }
}
export default RATEPROFILE_DROPDOWNOPTION_MAPPING