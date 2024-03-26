import apiMappings from "../../../../../../utils/apiMapping";
import axios from "../../../../../../utils/axios";

const fetchListViewStructure = async () => {
  try {
    const response = await axios.get(apiMappings.common.structure, {
      params: {
        modelName: "ADDRESS",
        pageName: "ADDRESS",
        sectionName: "ADDRESS_MAP_VIEW",
      },
    });

    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching Address List structure", error);
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

const putListViewStructure = async (payload) => {
  try {
    const {
      data: { message },
    } = await axios.put(apiMappings.common.structure, payload, {
      params: {
        modelName: "ADDRESS",
        pageName: "ADDRESS",
        sectionName: "ADDRESS_MAP_VIEW",
      },
    });
    return message;
  } catch (error: any) {
    console.log(error, error?.response);
  }
};

const fetchListViewData = async (payload) => {
  try {
    const { status, data } = await axios.get(
      apiMappings.all_addresses.list.getData,
      { params: payload }
    );

    if (status === 200) {
      return data?.data;
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching List View data", error);
  }
};

const fetchOrderCount = async (clientNodeId) => {
  try {
    const { status, data } = await axios.get(
      apiMappings.all_addresses.map.getOrderCount,
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
      apiMappings.all_addresses.map.manuallyGeocode,
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

export {
  fetchListViewStructure,
  fetchListViewData,
  putListViewStructure,
  fetchOrderCount,
  putUpdatedAddress,
  fetchAssingedOrderStructure,
};
