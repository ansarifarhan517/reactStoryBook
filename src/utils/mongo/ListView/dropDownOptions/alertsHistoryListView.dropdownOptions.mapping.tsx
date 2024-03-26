import { IAlertName, IOrderStatusLabels, IVehicleType } from "../../../../modules/AlertsHistory/AlertsHistory.models";
import apiMappings from "../../../apiMapping";
import axios from "../../../axios";
import store from "../../../redux/store";

const ALERTS_HISTORY_DROPDOWN_FILTER_OPTIONS_MAPPING = {
    name: async () => {
        const results = store?.getState().alertsHistory.name || await axios.get(apiMappings.alertsHistory.dropdownAlerts);
        return results?.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name)).map((name: IAlertName) => {
            name["label"] = name.name;
            name["value"] = name.shortName;
            name["title"] = name.name;
            return name;
        })
    },
    isResolved: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels.open && dynamicLabels.closed) {
            return [
                { value: 'true', label: dynamicLabels.closed, title: dynamicLabels.closed },
                { value: 'false', label: dynamicLabels.open, title: dynamicLabels.open }
            ]
        } else {
            return []
        }
    },
    orderStatus: async () => {
        const statusMap = store?.getState().alertsHistory.statusMap;
        const results = store?.getState().alertsHistory.orderStatus || await axios.get(apiMappings.alertsHistory.getOrderStatus);
        return results?.map((name: IOrderStatusLabels) => {
            name["label"] = statusMap[name.name];
            name["value"] = name?.clientRefMasterCd;
            name["title"] = statusMap[name.name];
            return name;
        })
    },
    tripStatus: async () => {
        //const statusMap = store?.getState().alertsHistory.statusMap;
        const {data} = await axios.get(apiMappings.alertsHistory.getTripStatus);
        return data?.map((name: IOrderStatusLabels) => {
            name["label"] = name.name;
            name["value"] = name?.clientRefMasterCd;
            name["title"] = name.name;
            return name;
        })
    },
    vehicleType: async () => {
        const results = store?.getState().alertsHistory.vehicleType || await axios.get(apiMappings.alertsHistory.getVehicleTypes);
        return results?.map((type: IVehicleType) => {
            type["label"] = type?.name;
            type["value"] = type?.clientRefMasterDesc;
            type["title"] = type?.name;
            return type;
        })
    },
    vehicleTypeOfBody: async () => {
        const {data} = await axios.get(apiMappings.alertsHistory.getVehicleTypeOfBody);
        return data?.map((type: IVehicleType) => {
            type["label"] = type?.name;
            type["value"] = type?.clientRefMasterDesc;
            type["title"] = type?.name;
            return type;
        })
    },
    vehicleOwnership: async () => {
        const {data} = await axios.get(apiMappings.alertsHistory.getOwnership);
        return data?.map((type: IVehicleType) => {
            type["label"] = type?.name;
            type["value"] = type?.clientRefMasterDesc;
            type["title"] = type?.name;
            return type;
        })
    }
}

export default ALERTS_HISTORY_DROPDOWN_FILTER_OPTIONS_MAPPING