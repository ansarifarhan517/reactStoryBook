import apiMappings from "../../../../../../utils/apiMapping";
import axios from "../../../../../../utils/axios";

const fetchListViewData = async (params, payload) => {
  try {
    const { status, data } = await axios.post(
      apiMappings.all_addresses.map.fetchAssignedOrders,
      payload,
      { params: params }
    );

    if (status === 200) {
      return data?.[0]?.shipmentList;
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching List View data", error);
  }
};

export { fetchListViewData };
