import SHIPPER_DROPDOWN_MAPPING from "../../../modules/Shipper/ShipperListView/DropdownOptions";
import DA_DROPDOWN_MAPPING from "../../../modules/DeliveryAssociate/DeliveryAssociateListView/Mongo/DaListViewDropdown";
import INSCAN_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/Inscan/InscanListView/InscanList.dropdownOptions.mapping";
import MANIFEST_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/Manifest/ManifestListView/ManifestList.dropdownOptions.mapping";
import { BRANCH_WEBHOOK_DROPDOWN_MAPPING } from "../../../modules/ClientAdmin/DeveloperSpace/WebhookProfile/DropdownOptions";
import VEHICLE_DROPDOWN_MAPPING from "../../../modules/Vehicle/VehicleListView/DropdownOptions";
import WEBHOOK_DROPDOWN_MAPPING from "../../../modules/OnboardingWrapper/WebHookList/Dropdown";
import CUSTOM_FIELDS_DROPDOWN_MAPPING from "../../../modules/OnboardingWrapper/CustomFields/CustomFieldsDropdown.mapping";
import ALERTS_HISTORY_DROPDOWN_FILTER_OPTIONS_MAPPING from "./dropDownOptions/alertsHistoryListView.dropdownOptions.mapping";
import FLEET_DROPDOWN_MAPPING from "../../../modules/FleetType/DropdownOptions";
import ORGANIZATION_ROLE_DROPDOWN_MAPPING from "../../../modules/OnboardingWrapper/UserAccessManagement/OrganizationRole/Listview/DropDownOption";
import TOTAL_ORDERS_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/Analytics/DriverAnalytics/DriverComplianceAnalytics/ListViewDropDownOptions/totalOrdersListView.dropdownOptions.mapping";
import ORDERREQUEST_DROPDOWN_MAPPING from "../../../modules/OrderRequest/OrderRequestListView/DropdownOptions";
import ALERT_MESSAGE_DROPDOWN_FILTER_OPTIONS_MAPPING from "./dropDownOptions/alertMessageListView.dropdownOptions.mapping";
// import { useTypedSelector } from '../../redux/rootReducer';
import BONUSES_FILTER_DROPDOWNOPTIONS_MAPPING from "../../../modules/Bonuses/ListView/ListMappings";
import { BONUSES_FORM_ADVANCED_FILTER_DROPDOWNOPTIONS_MAPPING } from "../../../modules/Bonuses/Form/FormUtils";
import ALERTPROFILESMASTER_ALERTLISTS from "../../../modules/OnboardingWrapper/AlertProfilesMaster/utils/ALERTPROFILESMASTER_ALERTLISTS";
import CUSTOMER_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/Customer/CustomerListView/SubComponent/DropdownMapping";
import TERRITORY_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/Terriotory/TerritoryListView/TerritoryList.dropdownOptions.mapping";
import store from "../../redux/store";
import axios from "../../../utils/axios";
import apiMappings from "../../apiMapping";
import All_CONSENT_FILTER_OPTIONS_MAPPING from '../../../modules/OnboardingWrapper/PdpaConfig/Dropdown/All_CONSENT_FILTER_OPTIONS_MAPPING';
import CONTRACT_LIST_VIEW_DROPDOWN_MAPPING from "../../../modules/Contract/ContractListView/SubComponent/DropdownMapping";
import TRIP_LIST_VIEW_DROPDOWN_MAPPING from "../../../modules/Trips/Mile/TripsListView/subComponents/TripListViewDropdown";
import TRIP_ORDER_UNDELIVERED_LIST_VIEW_DROPDOWN_MAPPING from "../../../modules/Trips/Mile/TripsListView/subComponents/undeliveredOrdersDropdown";
import ACCESSPROFILE_DROPDOWNFILTEROPTIONS_MAPPING from "../../../modules/OnboardingWrapper/UserAccessManagement/AccessProfile/Listview/AccessProfile.dropdownFilterOption.mapping";
import AWB_LABEL_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/OnboardingWrapper/AWBLabelConfiguration/AWBLabelConfiguration.dropdownOptions.mapping";
import { MOBILE_ROLES_EDITABLE_CELL_MAPPING } from "../../../modules/OnboardingWrapper/MobileRoles/Cell";
import { MOBILE_TEMPLATES_EDITABLE_CELL_MAPPING } from "../../../modules/OnboardingWrapper/MobileTemplates/Cell";
import ORGANIZATIONROLE_DROPDOWNOPTION_MAPPING from "../../../modules/OnboardingWrapper/UserAccessManagement/AccessProfile/Listview/OrganizationRolePopup.dropdownOptions.mapping";
import {
  ALL_EXCEPTIONS_EDITABLE_CELL_MAPPING,
  MANIFEST_EXCEPTION_EDITABLE_CELL_MAPPING,
  ORDER_EXCEPTIONS_EDITABLE_CELL_MAPPING,
} from "../../../modules/OnboardingWrapper/ExceptionHandling/Cell";
import TRIP_PLANNING_SCHEDULER from "../../../modules/ScheduledTripPlanning/PlanningForm/subComponents/ConditionsFilterMapping";
import ITEM_CONFIGURATION_FILTER_OPTIONS_MAPPING from "../../../modules/OnboardingWrapper/ModuleConfiguration/ItemConfiguration/SubComponent/dropdownMapping";
import BRANCH_CONFIGURATION_DROPDOWN_OPTIONS_MAPPING from "../../../modules/OnboardingWrapper/BranchConfiguration/dropdown";
import MANIFEST_LABEL_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/OnboardingWrapper/ManifestLabelConfiguration/ManifestLabelConfiguration.dropdownOptions.mapping";
import { timeWindowConfirmedByArray } from "../../constants";
import SERVICETYPE_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/OnboardingWrapper/ModuleConfiguration/ServiceTypeConfiguration/DropdownOptions/serviceTypeList.dropdownOptions.mapping";
import RATEPROFILE_DROPDOWNOPTION_MAPPING from "../../../modules/RateProfile/RateProfileListView/SubComponent/DropdownMapping/index";
import HIRED_DELIVERY_MEDIUM_DROPDOWN_MAPPING from "../../../modules/HiredDeliveryMedium/HiredDeliveryMediumListView/DropdownOptions/index";
import TRACKER_CONFIGURATION_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/OnboardingWrapper/ModuleConfiguration/TrackerConfiguration/DropdownOptions/trackerConfigList.dropdownOptions.mapping";
import TRACKER_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/Trackers/TrackersListView/DropdownOptions/trackersList.dropdownOptions.mapping";
import ORDERUPDATEADDRESS_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../../order/partial/order-middle-mile/order-list-middle-mile/dropdownOptions.mapping";
import DRS_TEMPLATE_DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../modules/OnboardingWrapper/ModuleConfiguration/DRSTemplateConfiguration/DRSTemplateConfiguration.dropdownOptions.mapping";
import MANIFEST_TEMPLATE_CONFIGURATION_DROPDOWN_MAPPING from "../../../modules/OnboardingWrapper/ManifestTemplateConfiguration/DropdownOptions/index";
import CHECKPOINTS_DROPDOWN_MAPPING from "../../../modules/Checkpoints/SubComponents/DropdownOptions/index";


export interface IDropdownOptionType {
  value: string;
  label: string;
  [key: string]: string;
}
export interface IFilterMapping {
  [key: string]: {
    [key: string]: () => IDropdownOptionType[];
  };
}

const DROPDOWN_FILTER_OPTIONS_MAPPING = {
  driver: {
    status: async (dynamicLabels: Record<string, string>) => {
      if (dynamicLabels.Available) {
        return [
          { value: "Available", label: dynamicLabels.Available },
          { value: "Intransit", label: dynamicLabels.DM_Intransit },
          { value: "Inactive", label: dynamicLabels.inactive },
        ];
      } else {
        return [];
      }
    },

    isPresent: async (dynamicLabels: Record<string, string>) => {
      if (dynamicLabels.present && dynamicLabels.Absent) {
        return [
          { value: "true", label: dynamicLabels.present },
          { value: "false", label: dynamicLabels.Absent },
        ];
      } else {
        return [];
      }
    },

    isActiveFl: async (dynamicLabels: Record<string, string>) => {
      if (dynamicLabels.active) {
        return [
          { value: "Y", label: dynamicLabels.active },
          { value: "N", label: dynamicLabels.inactive },
        ];
      } else {
        return [];
      }
    },
  },
  inscan: INSCAN_DROPDOWN_FILTER_OPTIONS_MAPPING,
  manifest: MANIFEST_DROPDOWN_FILTER_OPTIONS_MAPPING,
  carrier: {
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
      if (dynamicLabels.Available) {
        return [
          { value: "Y", label: dynamicLabels.active },
          { value: "N", label: dynamicLabels.inactive },
        ];
      } else {
        return [];
      }
    },
  },
  vehicle: VEHICLE_DROPDOWN_MAPPING,
  settings_webhookHistory: WEBHOOK_DROPDOWN_MAPPING,
  customFields: CUSTOM_FIELDS_DROPDOWN_MAPPING,
  shipper: SHIPPER_DROPDOWN_MAPPING,
  deliveryMedium: DA_DROPDOWN_MAPPING,
  alertsHistory: ALERTS_HISTORY_DROPDOWN_FILTER_OPTIONS_MAPPING,
  analyticsDACompliance: TOTAL_ORDERS_DROPDOWN_FILTER_OPTIONS_MAPPING,
  alertMessage: ALERT_MESSAGE_DROPDOWN_FILTER_OPTIONS_MAPPING,
  alertProfilesMaster_AlertsList: ALERTPROFILESMASTER_ALERTLISTS,
  orderRequest: ORDERREQUEST_DROPDOWN_MAPPING,
  fleet: FLEET_DROPDOWN_MAPPING,
  hiredDeliveryMedium: HIRED_DELIVERY_MEDIUM_DROPDOWN_MAPPING,
  manifestTemplateConfiguration:
    MANIFEST_TEMPLATE_CONFIGURATION_DROPDOWN_MAPPING,
  order: {
    orderType: async (dynamicLabels: Record<string, string>) => {
      return [
        { value: "DELIVER", label: dynamicLabels["DELIVER"] },
        { value: "PICKUP", label: dynamicLabels["PICKUP"] },
      ];
    },
    branchName: async () => {
      let branchName = store.getState().order.listView.branches;
      if (Object.keys(branchName).length) {
        const dropdown = Object(branchName).map(function (value: any) {
          return { value: value.name, label: value.name };
        });
        return dropdown;
      }
    },
    orderStatus: async (dynamicLabels: Record<string, string>) => {
      //const status = useTypedSelector(state=>state.order.listView.orderStatus);
      let status = store.getState().order.listView.orderStatus;
      if (Object.keys(status).length) {
        const dropdown = Object(status).map(function (value: any) {
          return {
            value: value.clientRefMasterCd,
            label: dynamicLabels[value.clientRefMasterDesc],
          };
        });
        return dropdown;
      } else {
        const { data } = await axios.get(
          apiMappings.order.listView.orderStatus
        );
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
      }
    },
    orderState: async (dynamicLabels: Record<string, string>) => {
      return [
        { value: "FORWARD", label: dynamicLabels["FORWARD"] },
        { value: "RETURN", label: dynamicLabels["RETURN"] },
        { value: "REVERSE", label: dynamicLabels["REVERSE"] },
      ];
    },
    hubScanStatus: async (dynamicLabels: Record<string, string>) => {
      const superType = JSON.parse(
        localStorage.getItem("userAccessInfo") || "{}"
      )?.superType;
      if (superType && superType === "MIDDLEMILE") {
        return [
          { value: "NOTSCANNED", label: dynamicLabels["NOTSCANNED"] },
          { value: "INSCANNED", label: dynamicLabels["INSCANNED"] },
          { value: "OUTSCANNED", label: dynamicLabels["OUTSCANNED"] },
          { value: "HANDEDOVER", label: dynamicLabels["HANDEDOVER"] },
          { value: "CLOSED", label: dynamicLabels["CLOSED"] },
          {
            value: "INSCANNED_ORIGIN_BRANCH",
            label: dynamicLabels.INSCANNED_ORIGIN_BRANCH,
          },
          {
            value: "INSCANNED_DESTINATION_BRANCH",
            label: dynamicLabels.INSCANNED_DESTINATION_BRANCH,
          },
          {
            value: "OUTSCANNED_ORIGIN_BRANCH",
            label: dynamicLabels.OUTSCANNED_ORIGIN_BRANCH,
          },
          {
            value: "OUTSCANNED_DESTINATION_BRANCH",
            label: dynamicLabels.OUTSCANNED_DESTINATION_BRANCH,
          },
          {
            value: "HANDEDOVER_ORIGIN_BRANCH",
            label: dynamicLabels.HANDEDOVER_ORIGIN_BRANCH,
          },
          {
            value: "HANDEDOVER_DESTINATION_BRANCH",
            label: dynamicLabels.HANDEDOVER_DESTINATION_BRANCH,
          },
        ];
      } else {
        return [
          { value: "NOTSCANNED", label: dynamicLabels["NOTSCANNED"] },
          { value: "INSCANNED", label: dynamicLabels["INSCANNED"] },
          { value: "OUTSCANNED", label: dynamicLabels["OUTSCANNED"] },
          { value: "HANDEDOVER", label: dynamicLabels["HANDEDOVER"] },
          { value: "CLOSED", label: dynamicLabels["CLOSED"] },
        ];
      }
    },
    paymentType: async () => {
      const paymentMode = store.getState().order.listView.paymentMode;
      if (Object.keys(paymentMode).length) {
        const dropdown = Object(
          store.getState().order.listView.paymentMode
        ).map(function (value: any) {
          return {
            value: value.clientRefMasterCd,
            label: value.clientRefMasterDesc,
          };
        });
        return dropdown;
      } else {
        let paymentType = {};
        const { data } = await axios.get(
          "ClientApp/client/getByTypeAndId?type=PAYMENTTYPE"
        );
        paymentType = data.map((entry: any) => {
          return {
            label: entry?.clientRefMasterDesc,
            value: entry?.clientRefMasterCd,
            id: entry?.clientRefMasterCd,
            title: entry?.clientRefMasterCd,
          };
        });
        return paymentType;
      }
    },
    priority: async () => {
      const priotity = store.getState().order.listView.priority;
      if (priotity) {
        const dropdown = Object(priotity).map(function (value: any) {
          return {
            value: value.clientRefMasterCd,
            label: value.clientRefMasterDesc,
          };
        });
        return dropdown;
      } else {
        return false;
      }
    },
    timeWindowConfirmedBy: async () => {
      return timeWindowConfirmedByArray;
    },
    deliveryType: async () => {
      const deliveryType = store.getState().order.listView.deliveryType;
      if (deliveryType.length) {
        const dropdown = Object(deliveryType).map(function (value: any) {
          return {
            value: value.clientRefMasterCd,
            label: value.clientRefMasterCd,
          };
        });
        return dropdown;
      } else {
        let deliveryType = {};
        const { data } = await axios.get(
          "ClientApp/client/getByTypeAndId?type=DELIVERYTYPE"
        );
        deliveryType = data.map((entry: any) => {
          return {
            label: entry?.clientRefMasterCd,
            value: entry?.clientRefMasterCd,
            id: entry?.clientRefMasterCd,
            title: entry?.clientRefMasterCd,
          };
        });
        return deliveryType;
      }
    },
    serviceType: async () => {
      const serviceType = store.getState().order.listView.serviceType;
      if (serviceType.length) {
        const dropdown = Object(serviceType).map(function (value: any) {
          return {
            value: value.clientRefMasterCd,
            label: value.clientRefMasterDesc,
          };
        });
        return dropdown;
      } else {
        let serviceType = {};
        const { data } = await axios.get(
          "ClientApp/client/getByTypeAndId?type=SERVICETYPE"
        );
        store.dispatch({
          type: "@@orderListView/SET_SERVICE_TYPE",
          payload: { serviceType: data },
        });
        serviceType = data.map((entry: any) => {
          return {
            label: entry?.clientRefMasterDesc,
            value: entry?.clientRefMasterCd,
            id: entry?.clientRefMasterCd,
            title: entry?.clientRefMasterDesc,
          };
        });
        return serviceType;
      }
    },
    isPartialDeliveredFl: async (dynamicLabels: Record<string, string>) => {
      return [
        { label: dynamicLabels.yes || "Yes", value: true },
        { label: dynamicLabels.no || "No", value: "false" },
      ];
    },
    serviceTypeCd: async () => {
      const serviceType = store.getState().order.listView.serviceType;
      if (serviceType.length) {
        const dropdown = Object(serviceType).map(function (value: any) {
          return {
            value: value.clientRefMasterCd,
            label: value.clientRefMasterDesc,
          };
        });
        return dropdown;
      }
    },

    geofenceName: async () => {
      //const dispatch = useDispatch<Dispatch<OrderListViewActions>>();

      const geogence = store.getState().order.listView.geofence;
      if (geogence.length) {
        return Object(geogence).map(function (value: any) {
          return { value: value.geofenceName, label: value.geofenceName };
        });
      } else {
        let geofenceName = {};
        const { data } = await axios.get("LookupApp/geofece/list");
        geofenceName = data.data.map((entry: any) => {
          return {
            label: entry?.geofenceName,
            value: entry?.geofenceName,
            id: entry?.geofenceName,
            title: entry?.geofenceName,
          };
        });
        store.dispatch({
          type: "@@orderListView/SET_GEOFENCE",
          payload: data.data,
        });
        return geofenceName;
      }
    },
    optimizedPackingStatusCd: async () => {
      const packingStatus =
        store.getState().order.listView.optimizePackingStatus;
      if (packingStatus && Object.keys(packingStatus)?.length) {
        return (
          packingStatus &&
          Object.values(packingStatus)?.map((entry: any) => {
            return {
              label: entry?.clientRefMasterDesc,
              value: entry?.clientRefMasterCd,
            };
          })
        );
      } else {
        try {
          const { data } = await axios.get(
            "/ClientApp/client/getByTypeAndId?type=OPTIMIZEPACKINGSTATUSCD"
          );
          store.dispatch({
            type: "@@orderListView/FETCH_OPTIMIZE_PACKING_STATUS",
            payload: data,
          });
          return data?.map((entry: any) => {
            return {
              label: entry?.clientRefMasterDesc,
              value: entry?.clientRefMasterCd,
            };
          });
        } catch (error) {
          console.log(error, "Error occured.");
        }
      }
    },
    isGeocoded: async (dynamicLabels: Record<string, string>) => {
      return [
        { label: dynamicLabels.yes || "Yes", value: true },
        { label: dynamicLabels.no || "No", value: "false" },
      ];
    },
  },
  customer: CUSTOMER_DROPDOWN_FILTER_OPTIONS_MAPPING,
  branchWebhookProfile: BRANCH_WEBHOOK_DROPDOWN_MAPPING,
  contract: CONTRACT_LIST_VIEW_DROPDOWN_MAPPING,
  trips: TRIP_LIST_VIEW_DROPDOWN_MAPPING,
  trips_undeliveredOrdersList:
    TRIP_ORDER_UNDELIVERED_LIST_VIEW_DROPDOWN_MAPPING,
  territory: TERRITORY_DROPDOWN_FILTER_OPTIONS_MAPPING,
  mobileRoles: MOBILE_ROLES_EDITABLE_CELL_MAPPING,
  mobileTemplates: MOBILE_TEMPLATES_EDITABLE_CELL_MAPPING,
  allExceptions: ALL_EXCEPTIONS_EDITABLE_CELL_MAPPING,
  orderExceptions: ORDER_EXCEPTIONS_EDITABLE_CELL_MAPPING,
  manifestExceptions: MANIFEST_EXCEPTION_EDITABLE_CELL_MAPPING,
  adminDashboard: {
    status: async () => {
      return [
        { label: "Active", value: "Y" },
        { label: "Inactive", value: "N" },
      ];
    },
    subscriptionType: async () => {
      return [
        { label: "Order", value: "TRANSACTIONBASED" },
        { label: "Delivery Associate", value: "RESOUCEBASED" },
      ];
    },
    planType: async () => {
      const planType = store.getState().adminDashboard.adminDashboard.planType;
      if (Object.keys(planType).length) {
        return Object.keys(planType).map((key: any) => {
          return { label: planType[key] || key, value: key };
        });
      } else {
        const { data } = await axios.get(
          "/ClientApp/client/getByTypeAndId?type=PLANTYPE"
        );
        const planMap = {};
        data.map(
          (entry: any) =>
            (planMap[entry.clientRefMasterCd] = entry.clientRefMasterDesc)
        );
        let planType = Object.keys(planMap).map((key: any) => {
          return { label: planMap[key] || key, value: key };
        });
        store.dispatch({
          type: "@@adminDashboard/PLAN_TYPE",
          payload: planMap,
        });
        return planType;
      }
    },
    modelType: async () => {
      return [
        { label: "Pickup and Delivery", value: "FMLM" },
        { label: "Pickup Only", value: "FM" },
        { label: "Delivery Only", value: "LM" },
        { label: "Haul", value: "LH" },
        { label: "End to End", value: "MIDDLEMILE" },
      ];
    },
    bdmUserName: async () => {
      const bdm = store.getState().adminDashboard.adminDashboard.BDM;

      if (bdm.length) {
        return Object(bdm).map(function (value: any) {
          return { value: value?.id, label: value?.name };
        });
      } else {
        let bdm = {};
        const { data } = await axios.get(
          "/UserAccessApp/user/lookup/internalUserPersona?persona=LOGINEXT_BUSINESS_DEVELOPMENT_MANAGER"
        );

        bdm = data.map((entry: any) => {
          return {
            label: entry.name,
            value: entry.id,
          };
        });
        store.dispatch({
          type: "@@adminDashboard/SET_BDM",
          payload: data,
        });
        return bdm;
      }
    },
    amUserName: async () => {
      const AM = store.getState().adminDashboard.adminDashboard.AM;

      if (AM.length) {
        return Object(AM).map(function (value: any) {
          return { value: value?.id, label: value?.name };
        });
      } else {
        let AM = {};
        const { data } = await axios.get(
          "/UserAccessApp/user/lookup/internalUserPersona?persona=LOGINEXT_ACCOUNT_MANAGER"
        );
        AM = data.map((entry: any) => {
          return {
            label: entry.name,
            value: entry.id,
          };
        });
        store.dispatch({
          type: "@@adminDashboard/SET_AM",
          payload: data,
        });
        return AM;
      }
    },
    omUserName: async () => {
      const OM = store.getState().adminDashboard.adminDashboard.OM;

      if (OM.length) {
        return Object(OM).map(function (value: any) {
          return { value: value?.id, label: value?.name };
        });
      } else {
        let OM = {};
        const { data } = await axios.get(
          "/UserAccessApp/user/lookup/internalUserPersona?persona=LOGINEXT_OPERATION_MANAGER"
        );

        OM = data.map((entry: any) => {
          return {
            label: entry.name,
            value: entry.id,
          };
        });
        store.dispatch({
          type: "@@adminDashboard/SET_OM",
          payload: data,
        });
        return OM;
      }
    },
  },
  ticketingTool: {
    createdBy: async () => {
      const status = store.getState().ticketingTool.peers;

      return status.map((value: any) => {
        return { value: value.id, label: value.firstname };
      });
    },
    status: async () => {
      const status = store.getState().ticketingTool.ticketStatus;

      if (Object.keys(status).length) {
        return Object.values(status).map((value: any) => {
          return value;
        });
      } else {
        const { data } = await axios.get(
          "/LoginApp/framework/ui/config?documentType=REDMINE_STRUCTURE"
        );
        let status = Object.values(data.data?.status).map((value: any) => {
          return value;
        });
        store.dispatch({
          type: "@@ticketingToolListView/TICKET_STATUS",
          payload: data.data?.status,
        });

        return status;
      }
    },
    tracker: async () => {
      const viewMode = store.getState().ticketingTool.viewMode;
      if (viewMode === "SUPPORT") {
        return [
          { value: "1", label: "Issue" },
          { value: "3", label: "Support" },
        ];
      } else {
        return [];
      }
    },
  },

  userList: {
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
      return [
        { value: "Y", label: dynamicLabels.active },
        { value: "N", label: dynamicLabels.inactive },
      ];
    },
  },
  awbLabelConfiguration: AWB_LABEL_DROPDOWN_FILTER_OPTIONS_MAPPING,
  manifestLabelConfiguration: MANIFEST_LABEL_DROPDOWN_FILTER_OPTIONS_MAPPING,
  organizationRole: ORGANIZATION_ROLE_DROPDOWN_MAPPING,
  accessProfileCount: ORGANIZATION_ROLE_DROPDOWN_MAPPING,
  userCount: {
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
      return [
        { value: "Y", label: dynamicLabels.active },
        { value: "N", label: dynamicLabels.inactive },
      ];
    },
  },
  accessProfile: ACCESSPROFILE_DROPDOWNFILTEROPTIONS_MAPPING,
  organizationRolePopup: ORGANIZATIONROLE_DROPDOWNOPTION_MAPPING,
  rateProfile: RATEPROFILE_DROPDOWNOPTION_MAPPING,
  ownedFleet: TRIP_PLANNING_SCHEDULER,
  orderDetails: TRIP_PLANNING_SCHEDULER,
  cxDashboard: {
    shipper: async () => {
      const shipper =
        store.getState().cxDashboardReducer?.dropdownOptions?.shipper;
      if (shipper && shipper.length) {
        return shipper;
      } else {
        const { data } = await axios.get(
          apiMappings.common.lookup.getSubClients,
          { data: {}, headers: { "Content-Type": "application/json" } }
        );

        let shipperList: any = [];
        data.forEach((entry: any) =>
          shipperList.push({
            label: entry.name,
            value: entry.name,
            id: entry.id,
          })
        );
        store.dispatch({
          type: "@@CXDashboard/SET_DROPDOWN_OPTIONS",
          payload: { shipper: shipperList },
        });
        return shipperList;
      }
    },
    branchName: async () => {
      const branch =
        store.getState().cxDashboardReducer?.dropdownOptions?.branch;
      if (branch && branch.length) {
        return branch;
      } else {
        const { data } = await axios.get(
          apiMappings.common.lookup.getClientBranch
        );
        const branchMap = {};
        data.map(
          (entry: any) => (branchMap[entry.clientBranchId] = entry.name)
        );
        let branchList = Object.keys(branchMap).map((key: any) => {
          return { label: branchMap[key] || key, value: key, id: key };
        });
        store.dispatch({
          type: "@@CXDashboard/SET_DROPDOWN_OPTIONS",
          payload: { branch: branchList },
        });
        return branchList;
      }
    },
  },
  tripPlanningScheduler: {
    status: async (dynamicLabels: Record<string, string>) => {
      return [
        { value: "Y", label: dynamicLabels.active || "Active" },
        { value: "N", label: dynamicLabels.inactive || "Inactive" },
      ];
    },
  },
  itemConfiguration: ITEM_CONFIGURATION_FILTER_OPTIONS_MAPPING,
  branchConfiguration: BRANCH_CONFIGURATION_DROPDOWN_OPTIONS_MAPPING,
  bonuses: BONUSES_FILTER_DROPDOWNOPTIONS_MAPPING,
  bonusesAdvancedFilter: BONUSES_FORM_ADVANCED_FILTER_DROPDOWNOPTIONS_MAPPING,
  serviceTypeConfiguration: SERVICETYPE_DROPDOWN_FILTER_OPTIONS_MAPPING,
  updateAddress: ORDERUPDATEADDRESS_DROPDOWN_FILTER_OPTIONS_MAPPING,
  drsTemplateConfiguration: DRS_TEMPLATE_DROPDOWN_FILTER_OPTIONS_MAPPING,
  trackerConfiguration: TRACKER_CONFIGURATION_DROPDOWN_FILTER_OPTIONS_MAPPING,
  trackers: TRACKER_DROPDOWN_FILTER_OPTIONS_MAPPING,
  protectionAct: All_CONSENT_FILTER_OPTIONS_MAPPING,
  tripSummary: {
    branchName: async () => {
      const localStorageBranchList =
        store.getState().tripPlanningScheduler.form.data.branchList;

      if (localStorageBranchList?.length === 0) {
        const { data } = await axios.get(
          apiMappings.deliveryMedium.listView.getDistributionCenterBranch,
          {
            url: apiMappings.deliveryMedium.listView
              .getDistributionCenterBranch,
            data: {},
            params: {},
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: false,
          }
        );

        const returnBranchList = data?.map((branches: any) => ({
          label: branches?.name,
          value: branches?.name,
          id: branches?.branchId,
          title: branches?.name,
        }));

        return returnBranchList;
      } else if (localStorageBranchList?.length > 0) {
        const returnBranchList = localStorageBranchList?.map(
          (branches: any) => ({
            label: branches?.name,
            value: branches?.name,
            id: branches?.branchId,
            title: branches?.name,
          })
        );

        return returnBranchList;
      } else {
        return [];
      }
    },
    clientCode: async () => {
      const shipper =
        store.getState().cxDashboardReducer?.dropdownOptions?.shipper;
      if (shipper && shipper.length) {
        return shipper;
      } else {
        const { data } = await axios.get(
          apiMappings.common.lookup.getSubClients,
          { data: {}, headers: { "Content-Type": "application/json" } }
        );

        let shipperList: any = [];
        data.forEach((entry: any) =>
          shipperList.push({
            label: entry.name,
            value: entry.name,
            id: entry.id,
          })
        );
        store.dispatch({
          type: "@@CXDashboard/SET_DROPDOWN_OPTIONS",
          payload: { shipper: shipperList },
        });
        return shipperList;
      }
    },
  },
  checkpoints: CHECKPOINTS_DROPDOWN_MAPPING,
  breachportal: {
    isReopen: async (dynamicLabels: Record<string, string>) => {
      return [
        { label: dynamicLabels.yes || "Yes", value: true },
        { label: dynamicLabels.no || "No", value: false },
      ];
    },
    tracker: async () => {
      return [
        { value: "1", label: "Bug" },
        { value: "2", label: "Support" },
        { value: "3", label: "Feature" },
      ];
    },
  },
};

export default DROPDOWN_FILTER_OPTIONS_MAPPING;
