import store from "../../../../../../../utils/redux/store";
import axios from "../../../../../../../utils/axios";
import apiMappings from "../../../../../../../utils/apiMapping";

const ALL_ADDRESSES_MAP_DROPDOWN_FILTER_OPTIONS_MAPPING = {
  geocodeStatus: (dynamicLabels: Record<string, string>) => {
    const systemGeocodedLabel =
      dynamicLabels["systemGeocoded"] || "System Geocoded";
    const manualGeocodedLabel =
      dynamicLabels["manuallyGeocoded"] || "Manually Geocoded";
    const notGeocodedLabel = dynamicLabels["notGeocoded"] || "Not Geocoded";
    const systemGeocodedApproxLabel =
      dynamicLabels["systemGeocodedApprox"] || "Approximately Geocoded";

    return [
      {
        id: "SYSTEMGEOCODED",
        label: systemGeocodedLabel,
        name: systemGeocodedLabel,
        value: "SYSTEMGEOCODED",
      },
      {
        id: "MANUALLYGEOCODED",
        label: manualGeocodedLabel,
        name: manualGeocodedLabel,
        value: "MANUALLYGEOCODED",
      },
      {
        id: "NOTGEOCODED",
        label: notGeocodedLabel,
        name: notGeocodedLabel,
        value: "NOTGEOCODED",
      },
      {
        id: "SYSTEMGEOCODEDAPPROX",
        label: systemGeocodedApproxLabel,
        name: systemGeocodedApproxLabel,
        value: "SYSTEMGEOCODEDAPPROX",
      },
    ];
  },
  clientNodeType: async () => {
    const addressTypeArray =
      store.getState().all_addresses.listView.addressType;
    if (addressTypeArray && addressTypeArray?.length) {
      return addressTypeArray;
    } else {
      let tempAddressType = null;
      const { data: response } = await axios.get(
        apiMappings.common.lookup.getAddressType
      );
      tempAddressType = response?.map((entry: any) => {
        return {
          label: entry?.clientRefMasterDesc,
          value: entry?.clientRefMasterCd,
          id: entry?.clientRefMasterCd,
          title: entry?.clientRefMasterCd,
        };
      });
      store.dispatch({
        type: "@@ALL_ADDRESSES/SET_ADDRESS_TYPE",
        payload: tempAddressType,
      });
      return tempAddressType;
    }
  },
};

export default ALL_ADDRESSES_MAP_DROPDOWN_FILTER_OPTIONS_MAPPING;
