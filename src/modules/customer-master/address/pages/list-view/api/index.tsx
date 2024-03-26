import apiMappings from "../../../../../../utils/apiMapping";
import axios from "../../../../../../utils/axios";

const fetchListViewStructure = async () => {
  try {
    const response = await axios.get(apiMappings.common.structure, {
      params: {
        modelName: "ADDRESS",
        pageName: "ADDRESS",
        sectionName: "ADDRESS_LIST_VIEW",
      },
    });

    // Loop over columns to modify fieldType for weeklyOffString
    for (const key in response?.data?.columns) {
      if (
        response?.data?.columns.hasOwnProperty(key) &&
        key === "weeklyOffString"
      ) {
        response.data.columns[key].fieldType = "text";
      }
    }

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
        sectionName: "ADDRESS_LIST_VIEW",
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

const fetchContactDetails = async (payload) => {
  try {
    const { status, data } = await axios.get(
      apiMappings.all_addresses.list.getContactDetails,
      { params: payload }
    );

    if (status === 200) {
      return data?.data;
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching List View data", error);
  }
};

const fetchModalStructure = async () => {
  try {
    const response = await axios.get(apiMappings.common.structure, {
      params: {
        modelName: "CUSTOMER",
        pageName: "CUSTOMER",
        sectionName: "ALTERNATE_CONTACT_LIST",
      },
    });

    if (response.status === 200) {
      return response?.data;
    }
  } catch (error: any) {
    console.log("Error Occured in Fetching Modal Structure", error);
  }
};

const putActiveInactiveStatus = async (payload) => {
  try {
    const response = await axios.put(
      apiMappings.all_addresses.list.putStatus,
      null,
      { params: payload }
    );

    return { response: response?.data?.message, isError: false };
  } catch (error: any) {
    return { response: error?.response?.data?.message, isError: true };
  }
};

const putInlineAddressUpdates = async (payload) => {
  try {
    const {
      data: { message, status },
    } = await axios.put(
      apiMappings.all_addresses.list.updateAddressInline,
      payload
    );

    if (status === 200) {
      return { message: message, hasError: false };
    }
    throw message;
  } catch (error: any) {
    const message = error?.response?.data?.message;
    return { message: message, hasError: true };
  }
};

export {
  fetchListViewStructure,
  fetchModalStructure,
  fetchListViewData,
  putListViewStructure,
  putActiveInactiveStatus,
  fetchContactDetails,
  putInlineAddressUpdates,
};
