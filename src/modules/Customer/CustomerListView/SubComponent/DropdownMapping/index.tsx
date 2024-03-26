const DropdownMapping = {
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
          return [
            { value: 'Y', label: dynamicLabels.yes },
            { value: 'N', label: dynamicLabels.no }
          ]
      }
}
export default DropdownMapping