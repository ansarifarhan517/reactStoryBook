import ALL_ADDRESSES_MAP_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../../components/address-map/config/dropdown-filter-mappings";

const ALL_ADDRESSES_DROPDOWN_FILTER_OPTIONS_MAPPING = {
  isActiveFl: (dynamicLabels: Record<string, string>) => {
    return [
      { value: "Y", label: dynamicLabels.active || "Active" },
      { value: "N", label: dynamicLabels.inactive || "Inactive" },
    ];
  },

  isPrimaryAddress: (dynamicLabels: Record<string, string>) => {
    const yesLabel = dynamicLabels["Yes"] || "Yes";
    const noLabel = dynamicLabels["No"] || "No";

    return [
      { id: "yes", name: yesLabel, label: yesLabel, value: "Y" },
      { id: "no", name: noLabel, label: noLabel, value: "N" },
    ];
  },

  ...ALL_ADDRESSES_MAP_DROPDOWN_FILTER_OPTIONS_MAPPING
};

export default ALL_ADDRESSES_DROPDOWN_FILTER_OPTIONS_MAPPING;
