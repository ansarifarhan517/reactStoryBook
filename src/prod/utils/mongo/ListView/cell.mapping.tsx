import React, { ComponentType } from "react";
import { Cell } from "react-table";
import { Checkbox, Button, Toggle, Position, IconButton } from "ui-library";
import { useTypedSelector } from "../../redux/rootReducer";
import TextOverflowEllipsis from "../../components/TextOverflowEllipsis";
import {
  BONUSES_LIST_CELL_MAPPING,
  DA_MAPPED_MODAL_LIST_VIEW_CELL_MAPPING,
} from "../../../modules/Bonuses/ListView/CellMappings/index";
import { SHIPPER_LIST_VIEW_CELL_MAPPING } from "../../../modules/Shipper/ShipperListView/Cell";
import DA_CELL_MAPPING from "../../../modules/DeliveryAssociate/DeliveryAssociateListView/Mongo/daListView.cell.mapping";
// import { isFloat } from "../../helper";
// import BooleanValue from "../../components/BooleanValue";
// import DynamicLabel from "../../components/DynamicLabel";
import CASH_TRANSACTION_CELL_MAPPING from "../../../modules/CashTransaction/CashTransactionList/CashTransactionListCell.mapping";
import CUSTOM_FORMS_CELL_MAPPING from "../../../modules/OnboardingWrapper/CustomForms/Cell/CustomFormsCell.mapping";
import { VEHICLE_CELL_MAPPING } from "../../../modules/Vehicle/VehicleListView/Cell/index";
import { INSCAN_CELL_MAPPING } from "../../../modules/Inscan/InscanListView/Cell";
import { MANIFEST_CELL_MAPPING } from "../../../modules/Manifest/ManifestListView/Cell";
import AlertsListViewCellMapping from "./cellMapping/alretsListView.cell.mapping";
import { WEBHOOK_CELL_MAPPING } from "../../../modules/OnboardingWrapper/WebHookList/Cell/index";
import { ORDERREQUEST_LIST_VIEW_CELL_MAPPING } from "../../../modules/OrderRequest/OrderRequestListView/Cell";
import { FLEETTYPE_LIST_VIEW_CELL_MAPPING } from "../../../modules/FleetType/Cell";
import { AlertMessage_CELL_MAPPING } from "../../../modules/OnboardingWrapper/AlertMessages/Cell";
import { BrandProfile_CELL_MAPPING } from "../../../modules/OnboardingWrapper/BrandProfile/BrandProfileList/Cell";
import ORDER_LIST_VIEW_CELL_MAPPING from "../../../modules/Order/SubComponent/OrderListViewCellMapping";
import { PAYOUT_LIST_VIEW_CELL_MAPPING } from "../../../modules/Payment/DeliveryAssociatePayout/PayoutListView/Mappings/cellMappings";
//import DaListViewCellMapping from './CellMapping/daListView.cell.mapping'
import { ALERT_PROFILES_MASTER_CELL_MAPPING } from "../../../modules/OnboardingWrapper/AlertProfilesMaster/AlertLists.cell.mapping";
import DriverAnalyticsCellMapping from "./cellMapping/analyticsDACompliance.cell.mapping";
import CUSTOMER_LIST_VIEW_CELL_MAPPING from "../../../modules/Customer/CustomerListView/SubComponent/Cell";
import CUSTOM_FIELD_CELL_MAPPING from "../../../modules/OnboardingWrapper/CustomFields/Cell/index";
import { BRANCH_CONFIGURATION_CELL_MAPPING } from "../../../modules/OnboardingWrapper/BranchConfiguration/Cell";

import {
  ORGALISATION_WEBHOOK_LIST_CELL_MAPPING,
  BRANCH_WEBHOOK_LIST_CELL_MAPPING,
} from "../../../modules/ClientAdmin/DeveloperSpace/WebhookProfile/Cell";
import { TERRITORY_CELL_MAPPING } from "../../../modules/Terriotory/TerritoryListView/Cell";

import CONTRACT_LIST_VIEW_CELL_MAPPING from "../../../modules/Contract/ContractListView/SubComponent/Cell";
import { TRIP_LIST_VIEW_CELL_MAPPING, TRIP_TRACKER_LIST_VIEW_CELL_MAPPING } from "../../../modules/Trips/Mile/TripsListView/subComponents/cell.mapping";
import TRIP_UNDELIVERED_ORDER_LIST_VIEW_CELL_MAPPING from "../../../modules/Trips/Mile/TripsListView/subComponents/undeliveredOrdersCellMapping";
import { AWBLableConfiguration_CELL_MAPPING } from "../../../modules/OnboardingWrapper/AWBLabelConfiguration/Cell/Index";
import { USER_LIST_CELLL_MAPPING } from "../../../modules/OnboardingWrapper/UserAccessManagement/UserManagement/ListView/UserManagement.cell.mapping";
import { ORGANIZATION_ROLE_CELL_MAPPING } from "../../../modules/OnboardingWrapper/UserAccessManagement/OrganizationRole/Listview/OrganizationRole.cell.mapping";
// import {USER_LIST_CELLL_MAPPING} from '../../../modules/OnboardingWrapper/UserAccessManagement/UserManagement/ListView/UserManagement.cell.mapping'
import { ACCESS_PROFILE_COUNT_CELL_MAPPING } from "../../../modules/OnboardingWrapper/UserAccessManagement/OrganizationRole/Listview/SubComponent/AccessProfileCount.cell.mapping";
import { USER_COUNT_CELL_MAPPING } from "../../../modules/OnboardingWrapper/UserAccessManagement/OrganizationRole/Listview/SubComponent/UserCount.cell.mapping";
import ACCESS_PROFILE_CELL_MAPPING from "../../../modules/OnboardingWrapper/UserAccessManagement/AccessProfile/Listview/AccessProfile.cell.mapping";
import ORGANIZAtIONROLE_POPUP_CELL_MAPPING from "../../../modules/OnboardingWrapper/UserAccessManagement/AccessProfile/Listview/OrganizationRolePopup.cell.mapping";
import { MOBILE_ROLES_CELL_MAPPING } from "../../../modules/OnboardingWrapper/MobileRoles/Cell";
import {
  MOBILE_TEMPLATES_CELL_MAPPING,
  MOBILE_TEMPLATE_ROLES_CELL_MAPPING,
} from "../../../modules/OnboardingWrapper/MobileTemplates/Cell";
import RATE_PROFILE_LIST_VIEW_CELL_MAPPING from "../../../modules/RateProfile/RateProfileListView/SubComponent/Cell";
import { getFormattedDate } from "../../LogiHelper";
import { ItemButton } from "../../../modules/Order/OrderListView/StyledOrderListView";
import { WhiteBoxForTable } from "../../../modules/AdminDashboard/AdminDashboard.styled.component";
import {
  ALL_EXCEPTIONS_LISTVIEW_CELL_MAPPING,
  MANIFEST_EXCEPTION_CELL_MAPPING,
  ORDER_EXCEPTIONS_LISTVIEW_CELL_MAPPING,
} from "../../../modules/OnboardingWrapper/ExceptionHandling/Cell";

import { TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING } from "../../../modules/ScheduledTripPlanning/PlanningForm/subComponents/Cell/index";
import TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING_MAIN from "../../../modules/ScheduledTripPlanning/PlanningListView/Cell/index";
import FEEDBACK_CELL_MAPPING from "../../../modules/ReportsAndAnalytics/CXDashboard/Components/TrackingLinkView/Feedback/Feedback.cell.mapping";
import PROMOTIONS_CELL_MAPPING from "../../../modules/ReportsAndAnalytics/CXDashboard/Components/TrackingLinkView/Promotion/Promotions.cell.mapping";
import {
  EXCEPTION_LISTVIEW_CELL_MAPPING,
  MANIFEST_OF_MANIFEST_LISTVIEW_CELL_MAPPING,
  ORDER_OUTSCAN_CELL_MAPPING,
} from "../../../modules/Outscan/Cell";
import { ManifestLableConfiguration_CELL_MAPPING } from "../../../modules/OnboardingWrapper/ManifestLabelConfiguration/Cell/Index";
import { ALL_SERVICETYPE_LISTVIEW_CELL_MAPPING } from "../../../modules/OnboardingWrapper/ModuleConfiguration/ServiceTypeConfiguration/Cell/index";
import { ORDER_INSCAN_CELL_MAPPING } from "../../../modules/InscanUpdated/Cell/index";
import { ALL_COMPARTMENT_LISTVIEW_CELL_MAPPING } from "../../../modules/OnboardingWrapper/ModuleConfiguration/CompartmentConfiguration/Cell/index";

import { HIRE_DM_CELL_MAPPING } from "../../../modules/HiredDeliveryMedium/HiredDeliveryMediumListView/Cell";
import { ORDER_UPDATEADDRESS_LISTVIEW_CELL_MAPPING } from "../../../../order/partial/order-middle-mile/order-list-middle-mile/index";
import { DRS_Template_Configuration_CELL_MAPPING } from "../../../modules/OnboardingWrapper/ModuleConfiguration/DRSTemplateConfiguration/Cell";
import { ManifestTemplateConfiguration_CELL_MAPPING } from "../../../modules/OnboardingWrapper/ManifestTemplateConfiguration/Cell/index"
import {TRACKER_CONFIG_LISTVIEW_CELL_MAPPING} from "../../../modules/OnboardingWrapper/ModuleConfiguration/TrackerConfiguration/Cell/index";
import {TRACKER_LISTVIEW_CELL_MAPPING} from "../../../modules/Trackers/TrackersListView/Cell/index";
import { ALL_PDPA_LISTVIEW_CELL_MAPPING } from "../../../modules/OnboardingWrapper/PdpaConfig/cell";
import { OVERALL_SUMMARY_CELL_MAPPING } from "../../../modules/Analytics/OverallSummary/subComponents/ListView/Cell";
import { CHECK_POINTS_CELL_MAPPING } from "../../../modules/Checkpoints/SubComponents/Cell/index";
import { BREACH_PORTAL } from "../../../modules/Breachportal/BreachPortal.cell.mapping";
import { OAUTH_PROFILE_LIST_CELL_MAPPING } from "../../../modules/ClientAdmin/DeveloperSpace/Oauth2/cell";
import { CONSENT_STATUS_REPORT } from "../../../modules/ReportsAndAnalytics/ConsentReports/ConsentStatusReport/ConsentStatusReportList/Cell/ConsentStatusReport.cell.mapping";
import { DEVIATION_SUMMARY_REPORT_CELL_MAPPING,GPS_GRID_OFF_CELL_MAPPING, OVER_SPEED_DEVIATION_CELL_MAPPING, TEMPERATURE_DEVIATION_CELL_MAPPING , RESTRICTED_DRIVING_TIME_DEVAIATION_CELL_MAPPING, FLEET_MOVEMENT_STUCK_REPORT} from "../../../modules/ReportsAndAnalytics/DeviationReports/cell";
export interface ICellMapping {
  [key: string]: {
    [key: string]: ComponentType<Cell>;
  };
}

const CELL_MAPPING: ICellMapping = {
  driver: {
    default: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),

    driverName: React.memo(
      ({ value, column, row }: Cell<any>) => {
        const viewMode = useTypedSelector(
          (state) => state.driver.listView.viewMode
        );

        if (!value) {
          return <div></div>;
        }

        return (
          <TextOverflowEllipsis title={value}>
            {viewMode === "listview" ? (
              value
            ) : (
              <Button
                variant="link"
                primary
                onClick={() => column?.["cellCallback"](row.original)}
              >
                {value}
              </Button>
            )}
          </TextOverflowEllipsis>
        );
      },
      (p, n) =>
        p.value === n.value &&
        p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
        JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
    ),

    isActiveFl: React.memo(
      ({ value, column, row }: Cell) => {
        const [active, setActive] = React.useState<boolean>(value);
        React.useEffect(() => {
          console.log(value);
          setActive(value);
        }, [value]);

        return (
          <Position type="absolute" top="0em" left="1em">
            <Toggle
              checked={active}
              onChange={({
                target: { checked },
              }: React.ChangeEvent<HTMLInputElement>) => {
                setActive(checked);
                column?.["cellCallback"](checked, row.original, setActive);
              }}
            />
          </Position>
        );
      },
      (p, n) =>
        p.value === n.value &&
        p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
        JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
    ),

    isPresent: React.memo(
      ({ value, row, column }: Cell<any>) => {
        const [present, setPresent] = React.useState<boolean>(value);

        React.useEffect(() => {
          setPresent(value);
        }, [value]);

        return (
          <Checkbox
            checked={present}
            disabled={row.original.isActiveFl === false}
            checkboxSize="md"
            disabledVariant="greyed"
            onChange={() => {
              setPresent((p) => {
                column?.["cellCallback"](!p, row.original, setPresent);
                return !p;
              });
            }}
          />
        );
      },
      (p, n) =>
        p.value === n.value &&
        p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
        JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
    ),
  },
  analyticsDACompliance: DriverAnalyticsCellMapping,
  outSourcedFleet: TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING,
  ownedFleet: TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING,
  carrier: {
    default: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),

    linkedBranchCount: ({ value, column, row }: Cell) => {
      return (
        <div className="cellIdentifier dummy-tooltip-disable-class noOfItems">
          <div
            className="button-col-action"
            onClick={() =>
              column?.["cellCallback"](value > 0 ? true : false, row.original)
            }
          >
            {value || 0}
          </div>
        </div>
      );
    },

    isActiveFl: React.memo(
      ({ value, column, row }: Cell) => {
        const [active, setActive] = React.useState<boolean>(value);
        React.useEffect(() => {
          setActive(value);
        }, [value]);

        return (
          <Position type="absolute" top="0em" left="1em">
            <Toggle
              checked={active}
              onChange={({
                target: { checked },
              }: React.ChangeEvent<HTMLInputElement>) => {
                setActive(checked);
                column?.["cellCallback"](checked, row.original, setActive);
              }}
            />
          </Position>
        );
      },
      (p, n) =>
        p.value === n.value &&
        p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
        JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
    ),
  },
  cashTransaction: CASH_TRANSACTION_CELL_MAPPING,
  vehicle: VEHICLE_CELL_MAPPING,
  shipper: SHIPPER_LIST_VIEW_CELL_MAPPING,
  deliveryMedium: DA_CELL_MAPPING,
  inscan: INSCAN_CELL_MAPPING,
  manifest: MANIFEST_CELL_MAPPING,
  customForms: CUSTOM_FORMS_CELL_MAPPING,
  settings_webhookHistory: WEBHOOK_CELL_MAPPING,
  alertsHistory: AlertsListViewCellMapping,
  alertProfilesMaster_AlertsList: ALERT_PROFILES_MASTER_CELL_MAPPING,
  userList: USER_LIST_CELLL_MAPPING,
  orderRequest: ORDERREQUEST_LIST_VIEW_CELL_MAPPING,
  fleet: FLEETTYPE_LIST_VIEW_CELL_MAPPING,
  alertMessage: AlertMessage_CELL_MAPPING,
  brandProfile: BrandProfile_CELL_MAPPING,
  order: ORDER_LIST_VIEW_CELL_MAPPING,
  branchConfiguration: BRANCH_CONFIGURATION_CELL_MAPPING,
  customer: CUSTOMER_LIST_VIEW_CELL_MAPPING,
  customFields: CUSTOM_FIELD_CELL_MAPPING,
  webhookProfile: ORGALISATION_WEBHOOK_LIST_CELL_MAPPING,
  oAuhtProfile: OAUTH_PROFILE_LIST_CELL_MAPPING,
  branchWebhookProfile: BRANCH_WEBHOOK_LIST_CELL_MAPPING,
  contract: CONTRACT_LIST_VIEW_CELL_MAPPING,
  trips: TRIP_LIST_VIEW_CELL_MAPPING,
  trips_undeliveredOrdersList: TRIP_UNDELIVERED_ORDER_LIST_VIEW_CELL_MAPPING,
  organizationRole: ORGANIZATION_ROLE_CELL_MAPPING,
  accessProfileCount: ACCESS_PROFILE_COUNT_CELL_MAPPING,
  userCount: USER_COUNT_CELL_MAPPING,
  mobileRoles: MOBILE_ROLES_CELL_MAPPING,
  mobileTemplates: MOBILE_TEMPLATES_CELL_MAPPING,
  mobileTemplateRoles: MOBILE_TEMPLATE_ROLES_CELL_MAPPING,
  rateProfile: RATE_PROFILE_LIST_VIEW_CELL_MAPPING,
  territory: TERRITORY_CELL_MAPPING,
  allExceptions: ALL_EXCEPTIONS_LISTVIEW_CELL_MAPPING,
  protectionAct: ALL_PDPA_LISTVIEW_CELL_MAPPING,
  orderExceptions: ORDER_EXCEPTIONS_LISTVIEW_CELL_MAPPING,
  manifestExceptions: MANIFEST_EXCEPTION_CELL_MAPPING,
  adminDashboard: {
    default: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    noOfResourcesPurchased: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),

    noOfOrdersPurchased: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    clientExpiryDt: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    activationDate: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    createdOnDt: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    lastLoginDate: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    clientCreatedOnDt: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    noOfUsers: React.memo(
      ({ value, column, row }: Cell<any>) => {
        return (
          <>
            <ItemButton className="noOfItem">
              <span onClick={() => column?.["cellCallback"](row.original)}>
                {value || "0"}
              </span>
            </ItemButton>
          </>
        );
      },
      (p, n) => p.value === n.value
    ),
    clientName: React.memo(
      ({ value }: Cell<any>) => {
        if (!value) {
          return (
            <>
              <WhiteBoxForTable />
            </>
          );
        }
        return (
          <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    userName: React.memo(
      ({ value, column, row }: Cell<any>) => {
        if (!value) {
          return (
            <>
              <WhiteBoxForTable />
            </>
          );
        }
        return (
          <>
            <TextOverflowEllipsis title={value} style={{ display: "flex" }}>
              {row.original.isActiveFl === "Y" && (
                <IconButton
                  iconVariant="preview"
                  style={{ boxShadow: "none" }}
                  onClick={() =>
                    column?.["cellCallback"](row.original.userName)
                  }
                ></IconButton>
              )}
              <div
                style={{
                  display: "flex",
                  marginLeft: row.original.isActiveFl === "Y" ? 0 : "40px",
                }}
              >
                {value}
              </div>
            </TextOverflowEllipsis>
          </>
        );
      },
      (p, n) => p.value === n.value
    ),
    modelType: React.memo(
      ({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
        return (
          <>
            <TextOverflowEllipsis
              title={dynamicLabels[value] || value}
              style={{ display: "flex" }}
            >
              {value == "FM"
                ? "Pickup Only"
                : value == "LM"
                ? "Delivery Only"
                : value == "FMLM"
                ? "Pickup and Delivery"
                : value == "LH"
                ? "Haul"
                : value == "MIDDLEMILE"
                ? "End to End"
                : value}
            </TextOverflowEllipsis>
          </>
        );
      },
      (p, n) => p.value === n.value
    ),
    subscriptionType: React.memo(
      ({ value }: Cell<any>) => {
        const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
        return (
          <>
            <TextOverflowEllipsis
              title={dynamicLabels[value] || value}
              style={{ display: "flex" }}
            >
              {value == "TRANSACTIONBASED"
                ? "Order"
                : value == "RESOURCEBASED"
                ? "Delivery Associate"
                : value}
            </TextOverflowEllipsis>
          </>
        );
      },
      (p, n) => p.value === n.value
    ),
    planType: React.memo(
      ({ value }: Cell<any>) => {
        const planType = useTypedSelector(
          (state) => state.adminDashboard.adminDashboard.planType
        );
        return (
          <>
            <TextOverflowEllipsis
              title={planType[value] || value}
              style={{ display: "flex" }}
            >
              {planType[value] || value}
            </TextOverflowEllipsis>
          </>
        );
      },
      (p, n) => p.value === n.value
    ),
    orderUtilization: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    dmUtilization: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    emailLimit: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    emailUtilization: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    smsLimit: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    smsUtilization: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    ivrLimit: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    ivrUtilization: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
  },
  noOfUsers: {
    default: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    noOfResourcesPurchased: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),

    noOfOrdersPurchased: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis
            title={value}
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {value}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    clientExpiryDate: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    activationDate: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    createdOnDt: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    lastLoginDate: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    clientCreatedOnDt: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    clientName: React.memo(
      ({ value }: Cell<any>) => {
        if (!value) {
          return (
            <>
              <WhiteBoxForTable />
            </>
          );
        }
        return (
          <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    userName: React.memo(
      ({ value }: Cell<any>) => {
        if (!value) {
          return (
            <>
              <WhiteBoxForTable />
            </>
          );
        }
        return (
          <>
            <TextOverflowEllipsis title={value} style={{ display: "flex" }}>
              {value}
            </TextOverflowEllipsis>
          </>
        );
      },
      (p, n) => p.value === n.value
    ),
  },
  ticketingTool: {
    default: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>
        );
      },
      (p, n) => p.value === n.value
    ),
    id: React.memo(
      ({ value, column, row }: Cell<any>) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis>
            <span
              style={{ color: "#5698d3", cursor: "pointer" }}
              onClick={() => column?.["cellCallback"](row.original)}
            >
              {value}
            </span>
          </TextOverflowEllipsis>
        );
      },
      (p, n) =>
        p.value === n.value &&
        p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
        JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
    ),
    createdOn: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    updatedOn: React.memo(
      ({ value }: Cell) => {
        if (!value) {
          return <div></div>;
        }
        return (
          <TextOverflowEllipsis title={getFormattedDate(value)}>
            {getFormattedDate(value)}
          </TextOverflowEllipsis>
        );
      },
      (p, n) => {
        return p.value === n.value;
      }
    ),
    tracker: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <>
            <TextOverflowEllipsis
              title={value == "Bug" ? "Issue" : value}
              style={{ display: "flex" }}
            >
              {value == "Bug" ? "Issue" : value}
            </TextOverflowEllipsis>
          </>
        );
      },
      (p, n) => p.value === n.value
    ),
  },
  cxDashboard_PromotionList: PROMOTIONS_CELL_MAPPING,
  cxDashboard_FeedbackList: FEEDBACK_CELL_MAPPING,
  accessProfile: ACCESS_PROFILE_CELL_MAPPING,
  organizationRolePopup: ORGANIZAtIONROLE_POPUP_CELL_MAPPING,
  awbLabelConfiguration: AWBLableConfiguration_CELL_MAPPING,
  manifestLabelConfiguration: ManifestLableConfiguration_CELL_MAPPING,
  manifestTemplateConfiguration: ManifestTemplateConfiguration_CELL_MAPPING,
  tripPlanningScheduler: TRIP_PLANNING_SCHEDULER_LIST_VIEW_CELL_MAPPING_MAIN,
  drsTemplateConfiguration: DRS_Template_Configuration_CELL_MAPPING,
  itemConfiguration: {
    default: React.memo(
      ({ value }: Cell<any>) => {
        return (
          <>
            <TextOverflowEllipsis title={value} style={{ display: "flex" }}>
              {value}
            </TextOverflowEllipsis>
          </>
        );
      },
      (p, n) => p.value === n.value
    ),
  },
  payouts: PAYOUT_LIST_VIEW_CELL_MAPPING,
  serviceTypeConfiguration: ALL_SERVICETYPE_LISTVIEW_CELL_MAPPING,
  outscanOrders: ORDER_OUTSCAN_CELL_MAPPING,
  exceptionList: EXCEPTION_LISTVIEW_CELL_MAPPING,
  manifestOfManifests: MANIFEST_OF_MANIFEST_LISTVIEW_CELL_MAPPING,
  inscanOrders: ORDER_INSCAN_CELL_MAPPING,
  bonuses: BONUSES_LIST_CELL_MAPPING,
  daMappedWithBonus: DA_MAPPED_MODAL_LIST_VIEW_CELL_MAPPING,
  compartmentConfiguration: ALL_COMPARTMENT_LISTVIEW_CELL_MAPPING,

  hiredDeliveryMedium: HIRE_DM_CELL_MAPPING,
  updateAddress: ORDER_UPDATEADDRESS_LISTVIEW_CELL_MAPPING,
  trackerConfiguration: TRACKER_CONFIG_LISTVIEW_CELL_MAPPING,
  trackers: TRACKER_LISTVIEW_CELL_MAPPING,
  tripSummaryList: OVERALL_SUMMARY_CELL_MAPPING,
  breachportal: BREACH_PORTAL,
  consentStatusReport: CONSENT_STATUS_REPORT,  
  checkpoints: CHECK_POINTS_CELL_MAPPING,
  deviationSummaryReport: DEVIATION_SUMMARY_REPORT_CELL_MAPPING,
  restrictedDrivingTimeDeviation: RESTRICTED_DRIVING_TIME_DEVAIATION_CELL_MAPPING,
  gpsGridOffDeviation: GPS_GRID_OFF_CELL_MAPPING,
  overSpeedDeviation: OVER_SPEED_DEVIATION_CELL_MAPPING,
  temperatureDeviation: TEMPERATURE_DEVIATION_CELL_MAPPING,
  fleetMovementStuckReport: FLEET_MOVEMENT_STUCK_REPORT,
  tripTrackers: TRIP_TRACKER_LIST_VIEW_CELL_MAPPING,
}

export default CELL_MAPPING;
