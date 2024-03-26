import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import store from "../../../../../utils/redux/store";

const TRIP_ORDER_UNDELIVERED_LIST_VIEW_DROPDOWN_MAPPING = {
  orderStatus: async (dynamicLabels: Record<string, string>) => {
    let status = {};
    const { data } = await axios.get(apiMappings.order.listView.orderStatus);

    store.dispatch({
      type: "@@orderListView/SET_ORDER_STATUS",
      payload: { orderStatus: data },
    });
    status = data.map((entry: any) => {
      return {
        label: dynamicLabels[entry?.clientRefMasterDesc],
        value: entry?.reasonCd,
        id: entry?.reasonCd,
        title: entry?.clientRefMasterDesc,
      };
    });
    return status;
  },
};

export default TRIP_ORDER_UNDELIVERED_LIST_VIEW_DROPDOWN_MAPPING;
