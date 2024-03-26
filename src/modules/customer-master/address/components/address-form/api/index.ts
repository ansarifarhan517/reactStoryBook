import apiMappings from "../../../../../../utils/apiMapping";
import axios from "../../../../../../utils/axios";

const fetchFormStructure = async () => {
  try {
    const response = await axios.get(apiMappings.common.structure, {
      params: {
        pageName: "GEOCODING",
        sectionName: "UPDATE_ADDRESS_FORM",
        modelName: "GEOCODING",
      },
    });

    const childNodes = response.data?.['address details']?.['addressFields']?.['childNodes'];
    if (childNodes && Object.keys(childNodes)?.length > 0) {
      const countryFieldName = childNodes['country']?.id || "";
      ['state', 'pincode'].forEach((key) => {
        if (childNodes[key]) {
          childNodes[key]['countryFieldName'] = countryFieldName;
        }
      });
    }

    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching Address List structure", error);
  }
};

const fetchOrderCount = async (clientNodeId) => {
  try {
    const { status, data } = await axios.get(
      apiMappings.all_addresses.form.getOrderCount,
      {
        params: {
          nodeIds: clientNodeId,
        },
      }
    );

    if (status === 200) {
      if (data?.length) {
        return {
          hasError: false,
          intransitOrderCount: data[0].inTransitOrderCount,
          assignedOrderCount: data[0].assinedOrderCount,
        };
      }else{
        return {
          hasError: false
        };
      }
    }
    throw data?.message;
  } catch (error: any) {
    console.log("Error Occured in Fetching Intransit Order count", error);
    const message = error?.response?.data?.message;
    return { hasError: true, message: message };
  }
};

const putUpdatedAddress = async (payload) => {
  try {
    const response = await axios.put(
      apiMappings.all_addresses.form.manuallyGeocode,
      [{ ...payload }]
    );

    if (response?.status === 200) {
      return { hasError: false, message: response?.data?.message };
    }
    throw response?.data?.message;
  } catch (error: any) {
    const message = error?.response?.data?.message;
    return { hasError: true, message: message };
  }
};

const fetchLocale = async () => {
  try {
    const { status, data: payload } = await axios.get(
      apiMappings.common.lookup.getLocale,
      { data: {}, headers: { "Content-Type": "application/json" } }
    );

    if (status === 200) {
      return payload;
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching Countries", error);
  }
};

const fetchAssingedOrderStructure = async () => {
  try {
    const response = await axios.get(apiMappings.common.structure, {
      params: {
        modelName: "UNFULFILLED_ORDERS",
        pageName: "UNFULFILLED_ORDERS",
        sectionName: "UNFULFILLED_ORDERS_LIST_VIEW",
      },
    });

    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching Address List structure", error);
  }
};


export {
  fetchFormStructure,
  fetchOrderCount,
  putUpdatedAddress,
  fetchLocale,
  fetchAssingedOrderStructure
};
