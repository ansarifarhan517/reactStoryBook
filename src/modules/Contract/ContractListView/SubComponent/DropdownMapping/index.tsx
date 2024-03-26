const CONTRACT_LIST_VIEW_DROPDOWN_MAPPING = {
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
       
          return [
            { value: 'Y', label: dynamicLabels.active },
            { value: 'N', label: dynamicLabels.inactive }
          ]
        // } else {
        //   return []
        // }
      }
}
export default CONTRACT_LIST_VIEW_DROPDOWN_MAPPING