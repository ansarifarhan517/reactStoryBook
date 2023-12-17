import { all ,spawn} from 'redux-saga/effects'
import { watchFetchStrucutreRequest, watchFetchDataRequest } from '../../modules/Driver/DriverListView/DriverListView.effect'
import { watchDeliveryAssociateList } from '../../modules/DeliveryAssociate/DeliveryAssociateListView/DeliveryAssociate.effect'
import { watchDAComplianceRequest } from '../../modules/Analytics/DriverAnalytics/DriverComplianceAnalytics/DriverComplianceAnalytics.effect'
import { watchDynamicLabelsFetchDataRequest } from '../../modules/common/DynamicLabels/dynamicLabels.effect'
import { watchPageLabelsFetchDataRequest } from '../../modules/common/PageLabelStructure/pageLabels.effect'
import { watchFetchOrderListViewStrucutreRequest, watchFetchOrderListViewDataRequest, watchFetchOrderListViewCountRequest, watchOrderListView } from '../../modules/Order/OrderListView/OrderListView.effect'
import { watchFetchCarrierStrucutreRequest, watchFetchCarrierDataRequest, watchFetchBranchListViewStructureRequest, watchFetchBranchDataRequest } from '../../modules/Carrier/CarrierListView/CarrierListView.effect'
import { driverFormSaga } from '../../modules/Driver/DriverForm/DriverForm.effect'
import { userFormSaga } from '../../modules/OnboardingWrapper/UserAccessManagement/UserManagement/Form/UserForm.effect'
import { organizationProfileFormSaga } from "../../modules/OnboardingWrapper/OrganizationConfiguration/OrganizationProfile/OrganizationProfile.effects";
import { watchUserManagementRequest } from '../../modules/OnboardingWrapper/UserAccessManagement/UserManagement/ListView/UserManagement.effects'
import { watchCashTransactionsList } from '../../modules/CashTransaction/CashTransactionList/CashTransactionList.effect'
import { watchInscanList } from '../../modules/Inscan/InscanListView/InscanList.effects'
import { watchManifestList } from '../../modules/Manifest/ManifestListView/ManifestList.effects'
import { watchAdvancedSearchRequest } from '../../modules/common/AdvancedSearch/AdvancedSearch.effect'
import { watchCustomFormRequest } from '../../modules/OnboardingWrapper/CustomForms/CustomForms.effect'
import { watchFetchCustomFieldsStrucutreRequest, watchFetchCustomFieldsDataRequest, watchFetchCustomFieldsModulesRequest, watchFetchCustomFieldsTypesRequest } from '../../modules/OnboardingWrapper/CustomFields/CustomFields.effect'
import { watchVehicleListView } from '../../modules/Vehicle/VehicleListView/VehicleListView.effect'
import { vehicleFormSaga } from '../../modules/Vehicle/VehicleForm/VehicleForm.effect'
import { watchBonusesListRequests } from "../../modules/Bonuses/ListView/BonusesList.effects";
import { watchBonusesFormRequests } from '../../modules/Bonuses/Form/BonusesForm.effects'
import { watchFetchWebHookListViewDataRequest, watchFetchWebHookListViewStrucutreRequest } from '../../modules/OnboardingWrapper/WebHookList/WebHookListView.effect'
import { watchFetchShipperRequests } from '../../modules/Shipper/ShipperListView/ShipperListView.effect'
import { watchFetchShipperFormRequests } from '../../modules/Shipper/ShipperForm/ShipperFrom.effects'
import { watchFetchShipperPreferenceFormRequests } from '../../modules/Shipper/ShipperSettings/ShipperPreference/ShipperPreference.effects'
import { watchFetchShipperOnboardingStructure } from '../../modules/Shipper/ShipperCommon/ShipperCommon.effects'
import { watchFetchShipperPropertiesFormRequests } from '../../modules/Shipper/ShipperSettings/ShipperProperties/ShipperProperties.effects'
import { watchFetchShipperAlertProfileFormRequests } from '../../modules/Shipper/ShipperSettings/ShipperAlertProfile/ShipperAlertProfile.effects'
import { watchAlretsHistoryRequest } from '../../modules/AlertsHistory/AlertsHistory.effect'
import { watchAlertProfilesSaga } from '../../modules/OnboardingWrapper/AlertProfilesMaster/AlertProfilesMaster.effect'
import { watchOrderRequestTypeListView } from '../../modules/OrderRequest/OrderRequestListView/OrderRequestListView.effect'
import { addOrderFormSaga } from '../../modules/Order/AddOrderForm/AddOrderForm.effects'
import { watchFleetTypeListView } from '../../modules/FleetType/FleetTypeListView.effect'
import { watchAlertMessageRequest } from "../../modules/OnboardingWrapper/AlertMessages/AlertMessage.effects"
import { watchBrandProfileList } from '../../modules/OnboardingWrapper/BrandProfile/BrandProfileList/BrandProfileList.effects'
import { plansFormSaga } from '../../modules/Saas/Plans/PlansForm.effect'
import { onboardingClientSaga } from '../../modules/Saas/ClientOnboarding/OnboardingSteps.effect'
import { onboardingTourSaga  } from '../../modules/Saas/Tour/Store/Tour.effect'
import { hubSetupFormSaga } from '../../modules/Saas/ClientOnboarding/SubComponent/HubSetup/HubSetup.effects'
import { watchCustomerListView } from '../../modules/Customer/CustomerListView/CustomerListView.effects'
import { MMOPrintAwbSaga } from '../../modules/OrderMiddleMile/PrintAwb/PrintAwb.effects'
import { featurePanelSaga } from '../../modules/FeaturePanel/FeaturePanel.effects'
import { watchWebhookProfileRequest } from '../../modules/ClientAdmin/DeveloperSpace/WebhookProfile/OrganizationWebhookProfile/WebhookProfile.effect'
import { watchBranchWebhookProfileRequest } from '../../modules/ClientAdmin/DeveloperSpace/WebhookProfile/BranchWebhookProfile/BranchWebhookProfile.effect'
import { watchTerritoryList } from '../../modules/Terriotory/TerritoryListView/TerritoryList.effects'
import { watchContractTypeListView } from '../../modules/Contract/ContractListView/ContractListView.effect'
import { watchBranchConfigurationRequest } from "../../modules/OnboardingWrapper/BranchConfiguration/BranchConfiguration.effects"
import {uatFormSaga} from "../../modules/Saas/UatForm/UatForm.effects"
import { watchTripList } from '../../modules/Trips/Mile/TripsListView/TripListView.effect'
import { watchOrganizationRoleRequest } from "../../modules/OnboardingWrapper/UserAccessManagement/OrganizationRole/Listview/OrganizationRole.effects"
import { organizationRoleFormSaga } from '../../modules/OnboardingWrapper/UserAccessManagement/OrganizationRole/Form/OrganizationRoleForm.effect'
import { watchFetchAccessProfileRequest } from '../../modules/OnboardingWrapper/UserAccessManagement/AccessProfile/Listview/AccessProfile.effect'
import { watchAwbLabelConfiguration } from '../../modules/OnboardingWrapper/AWBLabelConfiguration/AWBLabelConfiguration.effects'
import { watchMobileRolesRequest } from "../../modules/OnboardingWrapper/MobileRoles/MobileRoles.effects";
import { watchMobileTemplateRequest } from "../../modules/OnboardingWrapper/MobileTemplates/MobileTemplate.effects";
import {watchFetchStructureRequest} from '../../modules/OnboardingWrapper/UserAccessManagement/AccessProfile/Form/AccessProfileForm.effect'
import { watchRateProfileListView } from '../../modules/RateProfile/RateProfileListView/RateProfileListView.effects';
import { rateProfileFormSaga } from '../../modules/RateProfile/RateProfileForm/RateProfileForm.effects'
import { watchFetchClientActivityDataRequest, watchFetchClientActivityStrucutreRequest, watchFetchClientDetailsDataRequest, watchFetchClientDetailsPodsRequest, watchFetchClientDetailsStrucutreRequest, watchFetchPendingActivationDataRequest, watchFetchPendingActivationRequest, watchFetchTabData, watchFetchRegionsList } from '../../modules/AdminDashboard/AdminDashboard.effects'
import {watchFetchClientDetailsAccountsStrucutreRequest,watchFetchClientDetailsAccountsDataRequest, watchFetchOffboardOptionsDataRequest} from '../../modules/AdminDashboard/AdminDashboard.effects'
import { watchShipperWebhookProfileRequest } from '../../modules/Shipper/ShipperSettings/ShipperWebhook/ShipperWebhookProfile/ShipperWebhookProfile.effect'
import {watchFetchTripPlanningSchedulerFormRequests} from '../../modules/ScheduledTripPlanning/PlanningForm/PlanningForm.effects'
import { watchplanningListView } from '../../modules/ScheduledTripPlanning/PlanningListView/PlanningListView.effects'
import { watchFetchStrucutureRequest, watchFetchTicketData } from '../../modules/TicketingTool/TicketingToolListView/TicketingToolListView.effects'
import { watchExceptionHandlingRequest } from '../../modules/OnboardingWrapper/ExceptionHandling/ExceptionHandling.effects'
import { watchManifestLabelConfiguration } from '../../modules/OnboardingWrapper/ManifestLabelConfiguration/ManifestLabelConfiguration.effects'
import { watchItemConfigurationRequest } from '../../modules/OnboardingWrapper/ModuleConfiguration/ItemConfiguration/ItemConfiguration.effect'
import { itemFormSaga } from '../../modules/OnboardingWrapper/ModuleConfiguration/ItemConfiguration/Form/ItemConfiguration.effects'
import { watchManifestConfigurationRequest } from '../../modules/OnboardingWrapper/ModuleConfiguration/ManifestConfiguration/ManifestConfiguration.effect'
import { MMOBulkUpdateSaga } from '../../modules/OrderMiddleMile/BulkUpdate/BulkUpdate.effects'
import { watchOutscanOrderManifestRequest } from '../../modules/Outscan/OutscanOrderManifest.effects'
import { watchInscanOrderManifestRequest } from '../../modules/InscanUpdated/InscanOrderManifest.effects'
import { watchPdpaHandling } from '../../modules/OnboardingWrapper/PdpaConfig/Components/PdpaHandling.effect'
import { watchServiceTypeConfigurationRequest } from '../../modules/OnboardingWrapper/ModuleConfiguration/ServiceTypeConfiguration/ServiceTypeConfiguration.effects'
import { watchCXDashboard } from '../../modules/ReportsAndAnalytics/CXDashboard/CXDashboard.effects'
import { watchChangeModelTypeFetchStructureRequest } from '../../modules/AdminDashboard/SubComponent/ChangeModelType/ChangeModelType.effects'
import { fleetTypeFormSaga } from '../../modules/FleetType/Form/FleetTypeForm.effect'
import { watchPayoutProfilesSaga } from '../../modules/Payment/DeliveryAssociatePayout/PayoutListView/Store/PayoutProfile.effect'
import { watchPayoutFormRequests } from '../../modules/Payment/DeliveryAssociatePayout/PayoutProfileForm/Store/PayoutProfileForm.effect'
import { watchCompartmentConfigurationRequest } from '../../modules/OnboardingWrapper/ModuleConfiguration/CompartmentConfiguration/CompartmentConfiguration.effects'
import { watchImportSettingsRequest } from '../../modules/OnboardingWrapper/OrganizationConfiguration/ImportSettings/ImportSettings.effects'
import {watchHiredDeliveryMediumListView} from '../../modules/HiredDeliveryMedium/HiredDeliveryMediumListView/HiredDeliveryMediumListView.effect'
import { watchSubscriptionandBilling } from '../../modules/OnboardingWrapper/SubscriptionAndBilling/Services/Subscriptionandbilling.effect'
import { watchOauth } from '../../modules/ClientAdmin/DeveloperSpace/Oauth2/Oauth.effect'
import { watchDrsTemplateConfiguration } from '../../modules/OnboardingWrapper/ModuleConfiguration/DRSTemplateConfiguration/DRSTemplateConfiguration.effects'
import { watchManifestTemplateConfiguration } from '../../modules/OnboardingWrapper/ManifestTemplateConfiguration/ManifestTemplateConfiguration.effects'
import { watchTrackerConfigurationRequest } from '../../modules/OnboardingWrapper/ModuleConfiguration/TrackerConfiguration/TrackerConfiguration.effects'
import { watchTrackerManagementRequest } from '../../modules/OnboardingWrapper/ModuleConfiguration/TrackerManagement/TrackerManagement.effects'
import { watchTrackersListRequest } from '../../modules/Trackers/TrackersListView/TrackersListView.effects'
import {watchTrackersRequest} from '../../modules/Trackers/TrackerForm/TrackerForm.effects'
import { usageAnalyticsSaga } from "../../modules/OnboardingWrapper/UsageAnalytics/Services/UsageAnalytics.effects";
import { watchOverallSummaryList } from '../../modules/Analytics/OverallSummary/OverallSummary.effect'
import { watchConsentManagementRequest } from '../../modules/OnboardingWrapper/PdpaConfig/Components/PdpaManagement/ConsentManagement.effects'
import { watchBreachPortalData } from '../../modules/Breachportal/breachportaleffect'
import { watchConsentStatusReportForm } from '../../modules/ReportsAndAnalytics/ConsentReports/ConsentStatusReport/ConsentStatusReportForm/ConsentStatusReportForm.effects'
import { watchConsentStatusReportList } from '../../modules/ReportsAndAnalytics/ConsentReports/ConsentStatusReport/ConsentStatusReportList/ConsentStatusReportList.effects'
import { watchCheckpointsListViewRequests } from '../../modules/Checkpoints/CheckpointsListView/CheckpointsListView.effects'
import { watchCheckpointsFormRequests } from '../../modules/Checkpoints/CheckpointsForm/CheckpointsForm.effects'
import { watchDeviationReportsRequest } from '../../modules/ReportsAndAnalytics/DeviationReports/DeviationReports.effects'


export default function* rootSaga() {
  yield all([
    spawn(featurePanelSaga),
    spawn(watchDynamicLabelsFetchDataRequest),
    spawn(watchPageLabelsFetchDataRequest),
    spawn(watchFetchStrucutreRequest),
    spawn(watchFetchDataRequest),
    spawn(watchOrderListView),
    spawn(watchPayoutProfilesSaga),
    spawn(watchPayoutFormRequests),
    spawn(watchFetchOrderListViewStrucutreRequest),
    spawn(watchFetchOrderListViewDataRequest),
    spawn(watchFetchOrderListViewCountRequest),
    spawn(driverFormSaga),
    spawn(userFormSaga),
    spawn(organizationProfileFormSaga),
    spawn(watchImportSettingsRequest),
    spawn(watchUserManagementRequest),
    spawn(watchDAComplianceRequest),
    spawn(watchInscanList),
    spawn(watchManifestList),
    spawn(watchAdvancedSearchRequest),
    spawn(watchFetchCarrierStrucutreRequest),
    spawn(watchFetchCarrierDataRequest),
    spawn(watchFetchBranchListViewStructureRequest),
    spawn(watchFetchBranchDataRequest),
    spawn(watchCashTransactionsList),
    spawn(watchDeliveryAssociateList),
    spawn(watchVehicleListView),
    spawn(watchFetchWebHookListViewDataRequest),
    spawn(watchFetchWebHookListViewStrucutreRequest),
    spawn(watchFetchCustomFieldsStrucutreRequest),
    spawn(watchFetchCustomFieldsModulesRequest),
    spawn(watchFetchCustomFieldsDataRequest),
    spawn(watchAlretsHistoryRequest),
    spawn(watchFetchCustomFieldsTypesRequest),
    spawn(watchFleetTypeListView),
    spawn(watchFetchShipperRequests),
    spawn(addOrderFormSaga),
    spawn(watchFetchShipperFormRequests),
    spawn(watchFetchShipperPreferenceFormRequests),
    spawn(watchFetchShipperPropertiesFormRequests),
    spawn(watchFetchShipperAlertProfileFormRequests),
    spawn(watchFetchShipperOnboardingStructure),
    spawn(watchAlertProfilesSaga),
    spawn(watchOrderRequestTypeListView),
    spawn(watchAlertMessageRequest),
    spawn(watchBrandProfileList),
    spawn(plansFormSaga),
    spawn(onboardingClientSaga),
    spawn(onboardingTourSaga),
    spawn(hubSetupFormSaga),
    spawn(watchBranchConfigurationRequest),
    spawn(watchCustomerListView),
    spawn(MMOPrintAwbSaga),
    spawn(watchBranchWebhookProfileRequest),
    spawn(watchWebhookProfileRequest),
    spawn(watchContractTypeListView),
    spawn(watchTerritoryList),
    spawn(vehicleFormSaga),
    spawn(uatFormSaga),
    spawn(watchTripList),
    spawn(watchOrganizationRoleRequest),
    spawn(organizationRoleFormSaga),
    spawn(watchFetchAccessProfileRequest),
    spawn(watchFetchStructureRequest),
    spawn(watchMobileRolesRequest),
    spawn(watchBranchWebhookProfileRequest),
    spawn(watchWebhookProfileRequest),
    spawn(watchMobileTemplateRequest),
    spawn(watchRateProfileListView),
    spawn(rateProfileFormSaga),
    spawn(watchFetchTabData),
    spawn(watchFetchRegionsList),
    spawn(watchFetchClientDetailsStrucutreRequest),
    spawn(watchFetchClientDetailsDataRequest),
    spawn(watchFetchClientDetailsAccountsStrucutreRequest),
    spawn(watchFetchClientDetailsAccountsDataRequest),
    spawn(watchFetchClientActivityStrucutreRequest),
    spawn(watchFetchClientActivityDataRequest),
    spawn(watchFetchClientDetailsPodsRequest),
    spawn(watchFetchPendingActivationRequest),
    spawn(watchFetchPendingActivationDataRequest),
    spawn(watchFetchOffboardOptionsDataRequest),
    spawn(watchShipperWebhookProfileRequest),
    spawn(watchAwbLabelConfiguration),
    spawn(watchFetchTripPlanningSchedulerFormRequests),
    spawn(watchplanningListView),
    spawn(watchCustomFormRequest),
    spawn(watchFetchStrucutureRequest),
    spawn(watchFetchTicketData),
    spawn(watchExceptionHandlingRequest),
    spawn(watchPdpaHandling),
    spawn(watchManifestLabelConfiguration),
    spawn(watchItemConfigurationRequest),
    spawn(itemFormSaga),
    spawn(watchManifestConfigurationRequest),
    spawn(watchOutscanOrderManifestRequest),
    spawn(watchInscanOrderManifestRequest),
    spawn(watchServiceTypeConfigurationRequest),
    spawn(watchCXDashboard),
    spawn(watchOauth),
    spawn(MMOBulkUpdateSaga),
    spawn(watchChangeModelTypeFetchStructureRequest),
    spawn(fleetTypeFormSaga),
    spawn(watchBonusesListRequests),
    spawn(watchBonusesFormRequests),
    spawn(watchCompartmentConfigurationRequest),
    spawn(watchHiredDeliveryMediumListView),
    spawn(watchSubscriptionandBilling),
    spawn(watchDrsTemplateConfiguration),
    spawn(watchManifestTemplateConfiguration),
    spawn(watchTrackerConfigurationRequest),
    spawn(watchTrackerManagementRequest),
    spawn(watchTrackersListRequest),
    spawn(watchTrackersRequest),
    spawn(usageAnalyticsSaga),
    spawn(watchOverallSummaryList),
    spawn(watchConsentManagementRequest),
    spawn(watchBreachPortalData),
    spawn(watchConsentStatusReportForm),
    spawn(watchConsentStatusReportList),
    spawn(watchConsentManagementRequest),
    spawn(watchCheckpointsListViewRequests),
    spawn(watchCheckpointsFormRequests),
    spawn(watchDeviationReportsRequest)
  ])
}
