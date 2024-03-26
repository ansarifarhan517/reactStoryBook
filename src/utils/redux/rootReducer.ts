// import { IDriverListViewState } from './../../modules/Driver/DriverListView/DriverListView.reducer';
import { combineReducers } from 'redux';
import { useSelector, TypedUseSelectorHook } from 'react-redux';

import DriverListViewReducer from '../../modules/Driver/DriverListView/DriverListView.reducer';
import OrderListViewReducer from '../../modules/Order/OrderListView/OrderListView.reducer';
import CarrierListViewReducer from '../../modules/Carrier/CarrierListView/CarrierListView.reducer';
import VehicleListViewReducer from '../../modules/Vehicle/VehicleListView/VehicleListView.reducer';
import DynamicLabelsReducer from '../../modules/common/DynamicLabels/dynamicLabels.reducer';
import PageLabelsReducer from '../../modules/common/PageLabelStructure/pageLabels.reducer';
import { DriverFormReducer } from '../../modules/Driver/DriverForm/DriverForm.reducer';
import { VehicleFormReducer } from '../../modules/Vehicle/VehicleForm/VehicleForm.reducer';
import { BonusesListReducer } from '../../modules/Bonuses/ListView/BonusesList.reducer';
import { BonusesFormReducer } from '../../modules/Bonuses/Form/BonusesForm.reducer';

import ClientPropertiesReducer from '../../modules/common/ClientProperties/clientProperties.reducer';
import DeliveryAssociateReducer from '../../modules/DeliveryAssociate/DeliveryAssociateListView/DeliveryAssociate.reducer';
import GlobalToastReducer from '../../modules/common/GlobalToasts/globalToast.reducer';
import DriverComplianceAnalyticsReducer from '../../modules/Analytics/DriverAnalytics/DriverComplianceAnalytics/DriverComplianceAnalytics.reducer';
import { GlobalPopupReducer } from '../../modules/common/GlobalPopup/GlobalPopup.reducer';
import CashTransactionListReducer from '../../modules/CashTransaction/CashTransactionList/CashTransactionList.reducer';
import TripsListMileReducer from '../../modules/Trips/Mile/TripsListView/TripsListView.reducer';
import InscanListReducer from '../../modules/Inscan/InscanListView/InscanListReducer';
import AdvacnedSearchReducer from '../../modules/common/AdvancedSearch/AdvancedSearch.reducer';
import ManifestListReducer from '../../modules/Manifest/ManifestListView/ManifestList.reducer';
import CustomFormsReducer from '../../modules/OnboardingWrapper/CustomForms/CustomForms.reducer';
import GlobalsReducer from '../../modules/common/Globals/globals.reducer';
import WebHookListViewReducer from '../../modules/OnboardingWrapper/WebHookList/WebHookListView.reducer';
import CustomFieldsReducer from '../../modules/OnboardingWrapper/CustomFields/CustomFields.reducer';
import ShipperListViewReducer from '../../modules/Shipper/ShipperListView/ShipperListView.reducer';
import { ShipperFormReducer } from '../../modules/Shipper/ShipperForm/ShipperForm.reducer';
import { ShipperOnboardingReducer } from '../../modules/Shipper/ShipperCommon/ShipperCommon.reducer';
import { ShipperPropertiesFormReducer } from '../../modules/Shipper/ShipperSettings/ShipperProperties/ShipperProperties.reducer';
import { ShipperPreferenceFormReducer } from '../../modules/Shipper/ShipperSettings/ShipperPreference/ShipperPreference.reducer';
import { ShipperAlertProfileReducer } from '../../modules/Shipper/ShipperSettings/ShipperAlertProfile/ShipperAlertProfile.reducer';
import { ShipperETAProfileReducer } from '../../modules/Shipper/ShipperSettings/ShipperETAProfile/ShipperETAProfile.reducer';
import AlertsHistoryReducer from '../../modules/AlertsHistory/AlertsHistory.reducer';
import { AddOrderFormReducer } from '../../modules/Order/AddOrderForm/AddOrderForm.reducer';
import AlertProfilesMasterReducer from '../../modules/OnboardingWrapper/AlertProfilesMaster/AlertProfilesMaster.reducer';
import OrderRequestListViewReducer from '../../modules/OrderRequest/OrderRequestListView/OrderRequestListView.reducer';
import FleetReducer from '../../modules/FleetType/FleetTypeListView.reducer'
import ConversionMetricReducer from '../../modules/common/ConversionMetric/conversionMetricReducer.reducer';
import AlertMessageReducer from "../../modules/OnboardingWrapper/AlertMessages/AlertMessage.reducer";
import BrandProfileListReducer from '../../modules/OnboardingWrapper/BrandProfile/BrandProfileList/BrandProfileList.reducer';
import { PlansReducer } from '../../modules/Saas/Plans/PlansForm.reducer';
import { OnboardingClientReducer } from '../../modules/Saas/ClientOnboarding/OnboardingSteps.reducer';
import { OnboardingTourReducer } from '../../modules/Saas/Tour/Store/Tour.reducer';
import { HubSetupFormReducer  } from '../../modules/Saas/ClientOnboarding/SubComponent/HubSetup/HubSetup.reducer';
import BranchConfigurationReducer from "../../modules/OnboardingWrapper/BranchConfiguration/BranchConfiguration.reducer";
import CustomerListViewReducer from '../../modules/Customer/CustomerListView/CustomerListView.reducer';
import { MMOPrintAwbReducer } from '../../modules/OrderMiddleMile/PrintAwb/PrintAwb.reducer'
import FeaturePanelReducer from '../../modules/FeaturePanel/FeaturePanel.reducer'
import WebhookProfileReducer from '../../modules/ClientAdmin/DeveloperSpace/WebhookProfile/OrganizationWebhookProfile/WebhookProfile.reducer';
import BrnachWebhookProfileReducer from '../../modules/ClientAdmin/DeveloperSpace/WebhookProfile/BranchWebhookProfile/BranchWebhookProfile.reducer';
import TerritoryListReducer from '../../modules/Terriotory/TerritoryListView/TerritoryList.reducer';
import ContractListView from '../../modules/Contract/ContractListView/ContractListView.reducer';
import { UatFormReducer } from '../../modules/Saas/UatForm/UatForm.reducer'
import OrganizationRoleReducer from '../../modules/OnboardingWrapper/UserAccessManagement/OrganizationRole/Listview/OrganizationRole.reducer'
import AccessProfileListViewReducer from '../../modules/OnboardingWrapper/UserAccessManagement/AccessProfile/Listview/AccessProfileListView.reducer'
import AwbLabelConfigurationReducer from '../../modules/OnboardingWrapper/AWBLabelConfiguration/AWBLabelConfiguration.reducer';
import ManifestLabelConfigurationReducer from '../../modules/OnboardingWrapper/ManifestLabelConfiguration/ManifestLabelConfiguration.reducer';

import AdvancedFilterComponentReducer from '../../modules/common/AdvancedFilterComponent/AdvancedFilterComponent.reducer'
import MobileRolesReducer from "../../modules/OnboardingWrapper/MobileRoles/MobileRoles.reducer";
import MobileTemplateReducer from "../../modules/OnboardingWrapper/MobileTemplates/MobileTemplate.reducer"; 
import RateProfileListView from '../../modules/RateProfile/RateProfileListView/RateProfileListView.reducer';
import RateProfileForm from '../../modules/RateProfile/RateProfileForm/RateProfileForm.reducer';
import AdminDashboardReducer from '../../modules/AdminDashboard/AdminDashboard.reducer';
import ShipperWebhookProfileReducer from '../../modules/Shipper/ShipperSettings/ShipperWebhook/ShipperWebhookProfile/ShipperWebhookProfile.reducer';
import {UserFormReducer} from '../../modules/OnboardingWrapper/UserAccessManagement/UserManagement/Form/UserForm.reducer';
import UserManagementReducer from '../../modules/OnboardingWrapper/UserAccessManagement/UserManagement/ListView/UserManagement.reducer';
import { OrganizationRoleFormReducer } from '../../modules/OnboardingWrapper/UserAccessManagement/OrganizationRole/Form/OrganizationRoleForm.reducer';
import { AccessProfileFormReducer } from '../../modules/OnboardingWrapper/UserAccessManagement/AccessProfile/Form/AccessProfileForm.reducer'
import { OrganizationProfileFormReducer } from '../../modules/OnboardingWrapper/OrganizationConfiguration/OrganizationProfile/OrganizationProfile.reducer';
import TicketingToolListViewReducer from '../../modules/TicketingTool/TicketingToolListView/TicketingToolListView.reducer';
import IInlineEditReducer from '../../modules/common/InlineEdit/InlineEdit.reducer';
import ExceptionHandlingReducer from '../../modules/OnboardingWrapper/ExceptionHandling/ExceptionHandling.reducer';
import {TripPlanningSchedulerFormReducer} from '../../modules/ScheduledTripPlanning/PlanningForm/PlanningForm.reducer'
import TripPlanningListViewReducer from '../../modules/ScheduledTripPlanning/PlanningListView/PlanningListView.reducer'
import ItemConfigurationReducer from '../../modules/OnboardingWrapper/ModuleConfiguration/ItemConfiguration/ItemConfiguration.reducer';
import { ItemFormReducer } from '../../modules/OnboardingWrapper/ModuleConfiguration/ItemConfiguration/Form/ItemConfiguration.reducer';
import  ManifestConfigurationReducer  from '../../modules/OnboardingWrapper/ModuleConfiguration/ManifestConfiguration/ManifestConfiguration.reducer';
import {fleetTypeFormReducer} from '../../modules/FleetType/Form/FleetTypeForm.reducer'
import  ServiceTypeConfigurationReducer  from '../../modules/OnboardingWrapper/ModuleConfiguration/ServiceTypeConfiguration/ServiceTypeConfiguration.reducer';
import { MMOBulkUpdateReducer } from '../../modules/OrderMiddleMile/BulkUpdate/BulkUpdate.reducer';
import OutscanOrderManifestReducer from '../../modules/Outscan/OutscanOrderManifest.reducer';
import InscanOrderManifestReducer from '../../modules/InscanUpdated/InscanOrderManifest.reducer';
import CXDashboardReducer from '../../modules/ReportsAndAnalytics/CXDashboard/CXDashboard.reducer';

import  CompartmentConfigurationReducer  from '../../modules/OnboardingWrapper/ModuleConfiguration/CompartmentConfiguration/CompartmentConfiguration.reducer';
import {ChangeModelTypeFormReducer} from '../../modules/AdminDashboard/SubComponent/ChangeModelType/ChangeModelType.reducer'
import ImportSettingsReducer from '../../modules/OnboardingWrapper/OrganizationConfiguration/ImportSettings/ImportSettings.reducer';
import HiredDeliveryMediumListViewReducer from '../../modules/HiredDeliveryMedium/HiredDeliveryMediumListView/HiredDeliveryMediumListView.reducer';
import {GlobalRouteFlagReducer} from '../../modules/common/GlobalRouteFlags/HiredDeliveryMediumRouteFlag.reducer';
import SubscriptionBillingSummaryReducer from '../../modules/OnboardingWrapper/SubscriptionAndBilling/Services/SubscriptionBilling.reducer';
import DRSTemplateConfigurationReducer from '../../modules/OnboardingWrapper/ModuleConfiguration/DRSTemplateConfiguration/DRSTemplateConfiguration.reducer';
import PayoutProfilesReducer from '../../modules/Payment/DeliveryAssociatePayout/PayoutListView/Store/PayoutProfile.reducer';
import { PayoutFormReducer } from '../../modules/Payment/DeliveryAssociatePayout/PayoutProfileForm/Store/PayoutProfileForm.reducer';
import { AllAddressListReducer } from '../../modules/customer-master/address/pages/list-view/redux/reducer';

import ManifestTemplateConfigurationReducer from '../../modules/OnboardingWrapper/ManifestTemplateConfiguration/ManifestTemplateConfiguration.reducer';
import pdpaHandlingReducer from  '../../modules/OnboardingWrapper/PdpaConfig/Components/PdpaHandling.reducer'
import  TrackerConfigurationReducer  from '../../modules/OnboardingWrapper/ModuleConfiguration/TrackerConfiguration/TrackerConfiguration.reducer';
import TrackersListViewReducer from '../../modules/Trackers/TrackersListView/TrackersListView.reducer';
import  TrackerManagementReducer  from '../../modules/OnboardingWrapper/ModuleConfiguration/TrackerManagement/TrackerManagement.reducer';
import TrackerFormReducer from '../../modules/Trackers/TrackerForm/TrackerForm.reducer';
import { UsageAnalyticsReducer } from '../../modules/OnboardingWrapper/UsageAnalytics/Services/UsageAnalytics.reducer';
import OverallSummaryListViewReducer from '../../modules/Analytics/OverallSummary/OverallSummary.reducer';
import ISAMReducer from '../../modules/common/ServiceAreaCommon/serviceAreaMaster.reducer';
import breachportalreducer from '../../modules/Breachportal/breachportalreducer';
import OAuthReducer from '../../modules/ClientAdmin/DeveloperSpace/Oauth2/Oauth.reducer';
import { ConsentStatusReportFormReducer } from '../../modules/ReportsAndAnalytics/ConsentReports/ConsentStatusReport/ConsentStatusReportForm/ConsentStatusreportForm.reducer';
import { ConsentStatusReportListReducer } from '../../modules/ReportsAndAnalytics/ConsentReports/ConsentStatusReport/ConsentStatusReportList/ConsentStatusReportList.reducer';
import ConsentManagementReducer from '../../modules/OnboardingWrapper/PdpaConfig/Components/PdpaManagement/ConsentManagement.reducer';
import CheckpointsListViewReducer from '../../modules/Checkpoints/CheckpointsListView/CheckpointsListView.reducer';
import CheckpointsFormReducer from '../../modules/Checkpoints/CheckpointsForm/CheckpointsForm.reducer';
import DeviationReportsReducer from '../../modules/ReportsAndAnalytics/DeviationReports/DeviationReports.reducer';




const rootReducer = combineReducers({
    globalPopupProps: GlobalPopupReducer,
    IGlobalRouteFlagProps: GlobalRouteFlagReducer,
    globals: GlobalsReducer,
    pageLabels: PageLabelsReducer,
    dynamicLabels: DynamicLabelsReducer,
    clientProperties: ClientPropertiesReducer,
    conversionMetric: ConversionMetricReducer,
    advancedSearch: AdvacnedSearchReducer,
    advanceFilter: AdvancedFilterComponentReducer,
    globalToast: GlobalToastReducer,
    inlineEdit: IInlineEditReducer,
    driver: combineReducers({
        listView: DriverListViewReducer,
        form: DriverFormReducer
    }),
    shipper: combineReducers({
        listView: ShipperListViewReducer,
        form: ShipperFormReducer,
        properties: ShipperPropertiesFormReducer ,
        preference: ShipperPreferenceFormReducer , 
        onBoardingStructure: ShipperOnboardingReducer,
        alertProfile: ShipperAlertProfileReducer,
        ETAProfile: ShipperETAProfileReducer
    }),
    deliveryMedium: combineReducers({
        listView: DeliveryAssociateReducer
    }),
    order: combineReducers({
        listView: OrderListViewReducer
    }),
    analytics: combineReducers({
        driverComplianceAnalytics: DriverComplianceAnalyticsReducer
    }),
    carrier: combineReducers({
        listView: CarrierListViewReducer,
        branchListView: CarrierListViewReducer
    }),
    cashTransaction: combineReducers({
        listView: CashTransactionListReducer
    }),
    trips: combineReducers({
        listView: combineReducers({
            mile: TripsListMileReducer
        }),
    }),
    inscan: InscanListReducer,
    manifest: ManifestListReducer,
    oAuth : OAuthReducer,
    outscan: OutscanOrderManifestReducer,
    inscanUpdate: InscanOrderManifestReducer,
    customForms: combineReducers({
        listView: CustomFormsReducer
    }),
    alertsHistory: AlertsHistoryReducer,
    vehicle: combineReducers({
        listView: VehicleListViewReducer,
        form: VehicleFormReducer
    }),
    settings_webhookHistory: combineReducers({
        listView: WebHookListViewReducer
    }),
    orderForm: AddOrderFormReducer,
    orderRequest: combineReducers({
        listView: OrderRequestListViewReducer
    }),
    fleet: combineReducers({
        listView: FleetReducer,
        form: fleetTypeFormReducer
    }),    
    settings: combineReducers({
        alertMessageTemplate: AlertMessageReducer,
        alertProfilesMaster: AlertProfilesMasterReducer,
        importSettings: ImportSettingsReducer,
        userManagement: combineReducers({
            listView: UserManagementReducer,
            form: UserFormReducer
        }),
        organizationRole: combineReducers({
            listView: OrganizationRoleReducer,
            form: OrganizationRoleFormReducer
        }),
        organizationProfileForm: OrganizationProfileFormReducer
    }),
    brandProfile: combineReducers({
        listView: BrandProfileListReducer,
    }),
    saas: combineReducers({
        plans: PlansReducer,
        onboarding: OnboardingClientReducer,
        hubSetupForm: HubSetupFormReducer,
        tour: OnboardingTourReducer
    }),
    uat: combineReducers({
        form: UatFormReducer
    }),
    customer: combineReducers({
        listView: CustomerListViewReducer
    }),
    all_addresses: combineReducers({
        listView: AllAddressListReducer
    }),
    middleMileOrder: combineReducers({
        listView: combineReducers({
            printAwb: MMOPrintAwbReducer,
            bulkUpdate: MMOBulkUpdateReducer
        })
    }),
    featurePanel: FeaturePanelReducer,
    customFields: combineReducers({
        listView: CustomFieldsReducer
    }),
    branchConfiguration: BranchConfigurationReducer,
    webhookProfile: WebhookProfileReducer,
    branchWebhookProfile: BrnachWebhookProfileReducer,
    territory: combineReducers({
        listView: TerritoryListReducer
    }),
    contract: combineReducers({
        listView: ContractListView
    }),
    settingScreen: combineReducers({
        mobileRoles: MobileRolesReducer,
        mobileTemplates: MobileTemplateReducer
    }),
    rateProfile: combineReducers({
        listView: RateProfileListView,
        form: RateProfileForm
    }),

    adminDashboard: combineReducers({
        adminDashboard: AdminDashboardReducer,
        changeModeltype : ChangeModelTypeFormReducer
    }),
    shipperSettings: combineReducers({
        shipperWebhook: ShipperWebhookProfileReducer
    }),
    accessProfile:combineReducers({
        listView: AccessProfileListViewReducer,
        form: AccessProfileFormReducer
    }),
    deliveryAssociatePayout: combineReducers({
        listView: PayoutProfilesReducer,
        form: PayoutFormReducer
    }),
    awbLabelConfiguration: AwbLabelConfigurationReducer,
    ticketingTool: TicketingToolListViewReducer,
    exceptionHandling: ExceptionHandlingReducer,
    consentHandling : pdpaHandlingReducer,
    consentManagement : ConsentManagementReducer,
    tripPlanningScheduler:combineReducers({
        form: TripPlanningSchedulerFormReducer,
        listView:TripPlanningListViewReducer
    }),
    itemConfiguration:  combineReducers({
        listView: ItemConfigurationReducer,
        form: ItemFormReducer
    }),
    cxDashboardReducer: CXDashboardReducer,
    manifestConfiguration:ManifestConfigurationReducer,
    manifestLabelConfiguration: ManifestLabelConfigurationReducer,
    serviceTypeConfiguration: ServiceTypeConfigurationReducer,
    compartmentConfiguration: CompartmentConfigurationReducer,
    hiredDeliveryAssociate : combineReducers({
        // form : HiredDeliveryAssociateFormReducer,
        listView : HiredDeliveryMediumListViewReducer,
    }),
    bonuses: combineReducers({
        listView: BonusesListReducer,
        form: BonusesFormReducer
    }),
    subscriptionBilling : SubscriptionBillingSummaryReducer,
    overallSummaryListView : OverallSummaryListViewReducer,
    drsTemplateConfiguration : DRSTemplateConfigurationReducer,
    manifestTemplateConfiguration: ManifestTemplateConfigurationReducer,
    tracker: combineReducers({
        trackerConfiguration: TrackerConfigurationReducer,
        trackerManagement: TrackerManagementReducer,
        trackers: combineReducers({
            listView: TrackersListViewReducer,
            form: TrackerFormReducer
        })
    }),
    usageAnalytics: UsageAnalyticsReducer,
    serviceAreaReducer: ISAMReducer,
    breachportal:  breachportalreducer,
    consentStatusReport :combineReducers({
        form: ConsentStatusReportFormReducer,
        listView : ConsentStatusReportListReducer
    }),
    checkpoints: combineReducers({
        listView: CheckpointsListViewReducer,
        form: CheckpointsFormReducer
    }),
    deviationReports: DeviationReportsReducer
})


export type AppState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;
export default rootReducer;