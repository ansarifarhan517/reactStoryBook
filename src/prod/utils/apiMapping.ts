// export interface IApiMappings {
//   common: Record<string, string>
//   [key: string]: Record<string, string | Record<string, string>>
// }

const apiMappings = {
  wordpress: {
    autoLogin: "/ClientApp/client/portal/autologin",
    authenticate: "/wp-json/jwt-auth/v1/token",
    getPosts: "/wp-json/wp/v2/posts",
    getTags: "/wp-json/wp/v2/tags",
  },
  common: {
    /** Query Params: modelName=DRIVER&pageName=DRIVER&sectionName=DRIVER_LIST_VIEW */
    structure: "/LoginApp/framework/structure",

    /** Query Params: labels=add,update,delete... */
    dynamicLabels: "/LoginApp/framework/label",
    downloadExcel: "/LoginApp/framework/download/formWorkbook",
    pageLabelStructure:
      "/LoginApp/framework/structure?pageName=PAGE_LABEL_STRUCTURE&modelName=PAGE_LABEL_STRUCTURE&sectionName=PAGE_LABEL_STRUCTURE",
    clientProperty: "/ClientApp/client/property/list",
    clientSystemProperty: "/ClientApp/client/clientpropety",
    lookup: {
      vehicle:"/LookupApp/lookup/all/vehicles?searchText",
      checkpointCategory:'/ClientApp/client/getByTypeAndId?type=CHECKPOINT_CATEGORY',
      getDa:'/LookupApp/lookup/getDANamesList',
      getConsentName :'/LookupApp/lookup/getConsentNames',
      getConsentType:'/LookupApp/lookup/getConsentTypes',
      getConsentVersion:'/LookupApp/lookup/getConsentVersions',
      BONUSTYPE: "/ClientApp/client/getByTypeAndId?type=BONUSTYPE",
      BONUSMETRIC: "/ClientApp/client/getByTypeAndId?type=BONUSMETRIC",
      WEEKDAYS_LABEL: "/ClientApp/client/getByTypeAndId?type=WEEKDAYS_LABEL",
      BONUSCATEGORY: "/ClientApp/client/getByTypeAndId?type=BONUSCATEGORY",
      getDaProfiles:
        "/ClientApp/rateprofile/getrateprofiles?profileType=OWNFLEET",
      getDaPayoutProfiles: "/ClientApp/client/payoutProfile/list",
      getSuperClients: "/ClientApp/superClient/details",
      getSignUpType: "/ClientApp/client/getByTypeAndId?type=signUpType",
      getActiveClients: "/ClientApp/client/getactiveclients",
      getDistributionCenter: "/LookupApp/lookup/branches",
      getStates: "/LookupApp/lookup/locale",
      getCountries: "/LookupApp/lookup/locale?id=0&type=COUNTRY",
      languageLookup: "/LookupApp/lookup/language",
      getUnassignVehicles: "/VehicleApp/vehicle/fmlm/unassigned",
      getPincode: "/LookupApp/lookup/pincode",
      getPincodeOrigin: "/LookupApp/lookup/pincode",
      getPincodeDestination: "/LookupApp/lookup/pincode",
      getLicense: "/LookupApp/lookup/licence/type",
      getBranches: "/LookupApp/lookup/branches/hierarchy",
      getTimezoneList: "/CommonApp/timezone/list",
      paymentMode: "/ClientApp/client/getByTypeAndId?type=PAYMENTTYPE",
      priority: "/ClientApp/client/ref?type=PRIORITY",
      getAddressType: "/ClientApp/client/getByTypeAndId?type=ADDRESSTYPE",
      getLocale: "/LookupApp/lookup/locale?id=0&type=COUNTRY",
      getAutoAllocateProfileName:
        "/ClientApp/clientpropertiesprofile/get?profileType=AUTOASSIGNMENT",
      getcustomer: "/ClientApp/customer/getCustomersLike",
      returnAddressId: "/ClientApp/client/node/list?isCreateOrderRequest=true",
      pickupAddressId: "/ClientApp/client/node/list?isCreateOrderRequest=true",
      deliveryType: "/ClientApp/client/getByTypeAndId?type=DELIVERYTYPE",
      crateNameList: "/ShipmentApp/cratemaster/getCratesNames",
      getDistributionCenterBranch: "/LookupApp/lookup/branches/hierarchy",
      billingCurrency:
        "LookupApp/lookup/properties?lookupType=SaasOfflineAccountCurrency",
      billingCycle:
        "/LookupApp/lookup/properties?lookupType=SAASBillingFrequency",
      getBusinessDeliveryManager:
        "/UserAccessApp/user/lookup/internalUserPersona?persona=LOGINEXT_BUSINESS_DEVELOPMENT_MANAGER",
      getAccountManager:
        "/UserAccessApp/user/lookup/internalUserPersona?persona=LOGINEXT_ACCOUNT_MANAGER",
      getOperationManager:
        "/UserAccessApp/user/lookup/internalUserPersona?persona=LOGINEXT_OPERATION_MANAGER",
      getClient: "/LookupApp/lookup/client/all",
      getSuperClientParentBranch: "/LookupApp/lookup/superclient/branch/list",
      getSubClientParentBranch: "/LookupApp/lookup/subclient/branch/list",
      daysOfWeek: "/ClientApp/client/getByTypeAndId?type=WEEKDAYS",
      getVendorList: "/ClientApp/coloader/list",
      getSubClients: "/LookupApp/lookup/subclients",
      temperatureCategory:
        "/ClientApp/client/getByTypeAndId?type=TEMPERATURECATEGORY",
      getVehicleType: "/ClientApp/client/getByTypeAndId?type=VEHICLETYPEOPTION",
      getOwnership: "/ClientApp/client/getByTypeAndId?type=OWNERSHIPOPTION",
      getVehiclePermits: "/LookupApp/lookup/statesbyclientid",
      fleetType: "/ClientApp/fleettype/get",
      delMedType: "/ClientApp/client/getByTypeAndId?type=DELIVERYTYPE",
      weeklyOff: "/ClientApp/client/getByTypeAndId?type=WEEKDAYS",
      getDistributionCenterSubBranch: "/LookupApp/lookup/branches",
      getMovementType: "/ClientApp/client/getByTypeAndId?type=MOVEMENTTYPE",
      getTypeOfBody:
        "/ClientApp/client/getByTypeAndId?type=VEHICLEBODYTYPEOPTIONS",
      getUnattachedTrackers: "/DeviceApp/device/unattached",
      accessProfileIds: "/UserAccessApp/access/profile/list/name",
      getClientBranch: "/LookupApp/lookup/getClientBranchDetails",
      rateTypeLookupDistance:
        "ClientApp/client/getByTypeAndId?type=DISTANCEBASEDRATETYPE",
      rateTypeLookupWeight:
        "ClientApp/client/getByTypeAndId?type=WEIGHTBASEDRATETYPE",
      rateTypeLookupVolume:
        "ClientApp/client/getByTypeAndId?type=VOLUMEBASEDRATETYPE",
      rateTypeLookupPiece:
        "ClientApp/client/getByTypeAndId?type=PIECEBASEDRATETYPE",
      getSkillType:
        "/ClientApp/client/getByTypeAndId/bySuperClientId?type=DELIVERYTYPE",
      getFeesType: "/ClientApp/client/getByTypeAndId?type=FEESTYPE",
      getChargeType: "/ClientApp/client/getByTypeAndId?type=CHARGETYPE",
      getFuelServiceType: "/ClientApp/client/getByTypeAndId?type=SERVICETYPE",
      surgeTimingsDaysOfWeek: "/ClientApp/client/getByTypeAndId?type=WEEKDAYS",
      exceptionStage: "/ClientApp/client/getByTypeAndId?type=EXCEPTION_STAGE",
      exceptionType: "/ClientApp/client/getByTypeAndId?type=EXCEPTION_TYPE",
      exceptionAppliesTo:
        "/ClientApp/client/getByTypeAndId?type=EXCEPTION_APPLIES_TO",
      getUserGroup: "/LookupApp/lookup/usergroups?ismobilegroup=false",
      orgRoleLandingPage: "/ClientApp/client/getByTypeAndId?",
      persona: "/ClientApp/client/getByTypeAndId?type=PERSONA",
      getReportingManagerList: "/UserAccessApp/user/list",
      getServiceType: "ClientApp/client/getByTypeAndId?type=SERVICETYPE",
      getServiceAreaProfileNames:
        "/ServiceAreaApp/serviceprofile/getActiveServiceProfiles",
      getRateChartNames:
        "/ShipmentApp/ratechart/getRateChartsByServiceAreaProfile",
      BOOKINGTOORDER: "/ShipmentApp/BOOKINGTOORDER/",
      consentTypeId:"/ClientApp/consenttype/list/dropdown",
      getProfileList: "/AlertApp/alertprofile/list",
      getETAWindowOptions: "/ClientApp/client/getByTypeAndId?type=ETAWINDOW",
      getTimeZone: "/CommonApp/country/timezone",
      // getTimeZones: "/CommonApp/country/timezone?countrynames=",
      getDateFormats: "/LookupApp/lookup/properties?lookupType=DATEFORMAT",
      getBaseLanguage: "/ClientApp/client/getByTypeAndId?type=BASELANGUAGE",
      getSaasUnits: "/LookupApp/lookup/properties?lookupType=SAASUNITS",
      getTriggerElements: "/ClientApp/client/getByTypeAndId?type=TRIGGERTYPE",
      getOrderTypes: "/ClientApp/client/getByTypeAndId",
      getOrderLocations: "/ClientApp/client/getByTypeAndId",
      getOrderStates: "/ClientApp/client/getByTypeAndId?type=ORDER_STATE",
      serviceType: "/ClientApp/client/getByTypeAndId?type=SERVICETYPE",
      getUserGroups: "/LookupApp/lookup/usergroups?ismobilegroup=true",
      getStatusUpdateReasons:
        "/ClientApp/client/getByTypeAndId?type=DM_STATUS_UPDATE_REASON",
      getRateProfile: "/ClientApp/rateprofile/get",
      getTerritoryProfileListing: "/GeofenceApp/geofenceprofile/get",
      getLocationRestriction:
        "/ClientApp/client/getByTypeAndId?type=LOCATIONRESTRICTION",
      getUsersList: "/LookupApp/lookup/reporttemplate/users",
      getPlanningProfiles:
        "/ClientApp/clientpropertiesprofile/get?profileType=PLANNING",
      getManifestTypeList: "/ClientApp/client/ref?type=MILEMANIFESTTYPE",
      getOutscanBy: "/ClientApp/client/getByTypeAndId?type=OUTSCANBY",
      getDeliveryBoys: "/TripApp/trip/lmfm/manifest/data",
      getOrdersByCourier: "/ClientApp/coloader/list",
      getOrdersByTrips: "/TripApp/trip/lmfm/manifest/data",
      getCurrency: "/LookupApp/lookup/currency",
      getServiceTypeDetails: "/ClientApp/serviceTypeMaster/get/branch",
      getInscanBy: "/ClientApp/client/getByTypeAndId?type=INSCANBY",
      getHolidayCalendar: "/ClientApp/calendar/get",
      getModelTypes: "/ClientApp/modeltype/conversion/allowedmodeltypes",
      getDistributionCenterUserForm: "/LookupApp/lookup/branches",
      crateNameMasterList: "/ShipmentApp/cratemaster/all/list",
      getCompartmentList: "/VehicleApp/compartment/all/list",
      getIndustryTypes: "/ClientApp/client/getIndustryTypes?isDefault=true",
      ownershipList: "/ClientApp/client/getByTypeAndId?type=OWNERSHIP",
      supplierMasterList: "/ClientApp/client/getByTypeAndId?type=TRACKER_SUPPLIER",
      trackerTypeMasterList: "/ClientApp/client/getByTypeAndId?type=TRACKER_TYPE",
      getTrackerModels:'/DeviceApp/tracker/config/all/list',
      getUnlinkedTrackers: '/LookupApp/lookup/unlinked/trackers',
      accessProfileIds_web: "/UserAccessApp/access/profile/list/name",
      detailedOrderStatusCd: "/ClientApp/client/getByTypeAndId?type=DETAILED_ORDERSTATUS",
      getRoutes: "/DeliveryMediumApp/deliverymedium/fmlm/deliverymedium/list",//"/LookupApp/lookup/routes"
      getDeliveryAssociatesList: "/DeliveryMediumApp/deliverymedium/fmlm/deliverymedium/list",
      getVehiclesList: "/VehicleApp/vehicle/fmlm/list/v2",
      getDAList: "/DeliveryMediumApp/deliverymedium/fmlm/list",
      getDriversList: "/DriverApp/driver/fmlm/list",
      getBranchVehiclesList: "/VehicleApp/vehicle/fmlm/getByBranches",
      getBranchDAList: "/DeliveryMediumApp/deliverymedium/fmlm/getByBranches",
      getBranchDriversList: "/DriverApp/driver/fmlm/getByBranches",
      getEndedTrips: "/TripApp/trip/getTripsCompletedBetweenDates",
      getDateSource: "/ClientApp/client/getByTypeAndId?type=TRACKINGDATASOURCE",
      getTripsBetweenDates: "/TripApp/trip/getTripsBetweenDates",
      getAttachedTrackerIds: "/VehicleApp/device/mapping/getByTripId"
    },
    uploadFileData: '/LoginApp/framework/uploadFileData',
    uploadLogo: '/ClientApp/client/logo/upload',
    getFileURI: '/LoginApp/framework/getFileURI',
    getSettings: '/ClientApp/client/getClientPreference?configType=MapSettings_',
    saveSettings: 'ClientApp/client/saveClientPreference?configType=MapSettings_',
    clientMetric: '/LoginApp/framework/metric/property',
    priority: '/ClientApp/client/ref?type=PRIORITY',
    delMedType: 'ClientApp/client/getByTypeAndId?type=DELIVERYTYPE',
    getStatus: '/ClientApp/client/getByTypeAndId?type=DELIVERY_MEDIUM_STATUS',
    getRejectReasonList: '/ClientApp/client/getByTypeAndId?type=SHIPPER_REJECT_REASON',
    getShipmentRequestRejectList: '/ClientApp/client/getByTypeAndId?type=SHIPMENTREQUESTREJECTREASON',
    weeklyOff: '/ClientApp/client/getByTypeAndId?type=WEEKDAYS',
    getOrderStatus: "/ClientApp/client/getByTypeAndId?type=ONDEMAND_ORDERSTATUS",
    getPaymentType: '/ClientApp/client/getByTypeAndId?type=paymentType',
    getServiceType: 'ClientApp/client/getByTypeAndId?type=SERVICETYPE',
  },
  uploadExcel: {
    carrier: "ClientApp/coloader/upload/resource",
    contract: "/ClientApp/contract/import",
    customer: "/ClientApp/customer/import",
    deliveryMedium: "/DeliveryMediumApp/deliverymedium/upload/resource",
    driver: "/DriverApp/driver/upload/resource",
    fleetType: "/ClientApp/fleettype/upload",
    order: "/ShipmentApp/order/import",
    orderRequest: "/BookingApp/booking/upload/import",
    shipper: "/ClientApp/shipper/upload",
    vehicle: "/VehicleApp/vehicle/upload/resource",
    branch: "/ClientApp/clientbranch/upload/resource",
    itemConfiguration: "ClientApp/client/itemmaster/resource",
    serviceType: "/ClientApp/serviceTypeMaster/upload",
    tracker: "/DeviceApp/deviceMaster/upload",
    checkpoints: "/GeofenceApp/checkpoint/upload",
  },
  downloadFormat: {
    contract: "ClientApp/contract/format/download",
    fleetType: "/ClientApp/fleettype/upload/format/download",
    orderRequest: "/BookingApp/booking/upload/format/download",
    shipper: "/ClientApp/shipper/format/download",
    serviceType: "/ClientApp/serviceTypeMaster/format/download",
    tracker:
      "/LoginApp/framework/download/formWorkbook?pageName=TRACKER&sectionName=ADD_TRACKER_FORM&fallbackIfNotFound=true&modelName=TRACKER",
    checkpoints: "/GeofenceApp/checkpoint/format/download",
  },
  driver: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=DRIVER&pageName=DRIVER&sectionName=DRIVER_LIST_VIEW",
      data: "/DriverApp/driver/fmlm/list",
      inlineUpdate: "/DriverApp/driver/fmlm/update/list",
      uploadDriver: "/DriverApp/driver/upload/resource",
      attendance: "/DriverApp/driver/fmlm/attendance",
      activationRequest: "/DriverApp/driver/fmlm/state",
      deleteRequest: "/DriverApp/driver/fmlm/delete",
      unassignedVehicles: "/VehicleApp/vehicle/fmlm/unassigned",
      driverExcelDownload: "/DriverApp/driver/fmlm/listview/download",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?modelName=DRIVER&pageName=DRIVER&sectionName=ADD_DRIVER_FORM",
      create: "/DriverApp/driver/fmlm/create",
      getDriver: "/DriverApp/driver/fmlm/get",
      update: "/DriverApp/driver/fmlm/update",
    },
  },
  payments: {
    bonuses: {
      getBonusListData: "/ClientApp/client/bonus/list",
      getTaggedDAListData: "ClientApp/client/bonus/deliveryMediums",
      setBonusInactive: "ClientApp/client/bonus/inactive",
      create: "/ClientApp/client/bonus/create",
      update: "ClientApp/client/bonus/update",
      getDataByBonusID: "ClientApp/client/bonus/getbyid",
    },
    deliveryAssociatePayout: {
      getById: "/ClientApp/client/payoutProfile/get",
      getList: "/ClientApp/client/payoutProfile/payoutlist",
      update: "/ClientApp/client/payoutProfile/update",
      create: "/ClientApp/client/payoutProfile/create",
      linkBranch: "/ClientApp/client/payoutProfile/link",
      updateFavourite: "/ClientApp/client/payoutProfile/favourite",
    },
  },
  reports: {
    cxDashboard: {
      getStats: "/ReportingApp/cxDashboard/stats",
      getHistogramData: "/ReportingApp/cxDashboard/histogram",
      getPromotionListView: "/ReportingApp/cxDashboard/promotion/listview",
      getFeedbackListView: "/ReportingApp/cxDashboard/feedback/listview",
      feedbackStructure:
        "/LoginApp/framework/structure?modelName=FEEDBACK_LIST_VIEW&pageName=CXDASHBOARD&sectionName=CUSTOMER_FEEDBACK_DETAILS",
      promotionStructure:
        "/LoginApp/framework/structure?modelName=PROMOTION_LIST_VIEW&pageName=CXDASHBOARD&sectionName=PROMOTION_DETAILS",
      tagCloud: "/ReportingApp/cxDashboard/feedack/comments",
      alertList: "/AlertApp/alert/getAlertList",
      feedbackListDownload: "/ReportingApp/cxDashboard/download/feedbacklist",
      promotionsListDownload:
        "/ReportingApp/cxDashboard/download/promotionlist",
    },
  },
  analytics: {
    driverCompliance: {
      getKpiList:
        "/ClientApp/client/getByTypeAndId?type=DELIVERY_ASSOCIATE_KPI",
      cardDetails:
        "/ReportingApp/analytics/deliveryassociate/compliance/carddetails?metaData=true",
      getBranchList: "/ClientApp/client/getClientBranches",
      deliveryType: "/ClientApp/client/getByTypeAndId?type=DELIVERYTYPE",
      getPlannedRouteKpiConfiguration:
        "/ClientApp/client/getClientPreference?configType=PLANNED_ROUTE_CONFIGURE_KPI&fallback=true",
      savePlannedRouteKpiConfiguration:
        "/ClientApp/client/saveClientPreference?configType=PLANNED_ROUTE_CONFIGURE_KPI&level=client",
      avgTotalCompliance: {
        overAllComplianceSummary:
          "/ReportingApp/analytics/deliveryassociate/compliance/overallsummary",
        deliveryAssociateComplianceSummary:
          "/ReportingApp/analytics/deliveryassociate/compliance/deliveryassociatesummary",
        deliveryassociatescompliancetrend:
          "/ReportingApp/analytics/deliveryassociate/compliance/deliveryassociatescompliancetrend",
        deliveryAssociateList:
          "ReportingApp/analytics/deliveryassociate/compliance/list",
        deliiveryAssociateLoginHistory:
          "/ReportingApp/analytics/deliveryassociate/compliance/deliveryassociatesloginhistory",
        deliveryAssociateDevices:
          "/ReportingApp/analytics/deliveryassociate/compliance/deliveryassociatesdevices",
        getDeviceCompatibilityColumnStructure:
          "/LoginApp/framework/structure?modelName=REPORTS&pageName=REPORTS&sectionName=DEVICE_COMPATIBILITY_LIST_VIEW",
        getDeliveryAssociateDeviceCompatibility:
          "/ReportingApp/analytics/deliveryassociate/compliance/deviceCompatibility",
        downloadComplianceReport:
          "/ReportingApp/analytics/deliveryassociate/compliance/overallsummary/download",
        downloadDeliveryAssociateCompliance:
          "/ReportingApp/analytics/deliveryassociate/compliance/deliveryAssociateComplianceSummary/download",
        downloadComplianceTrendReport:
          "/ReportingApp/analytics/deliveryassociate/compliance/deliveryassociatescompliancetrend/download",
        downloadDeviceCompatibilityReport:
          "/ReportingApp/analytics/deliveryassociate/compliance/deviceCompatibility/download",
        downloadTrackingComplianceReport:
          "/ReportingApp/analytics/deliveryassociate/compliance/trackingCompliance/download",
        getLoginHistoryColumnStructure:
          "/LoginApp/framework/structure?modelName=REPORTS&pageName=REPORTS&sectionName=LOGIN_HISTORY_LIST_VIEW",
        getDeviceListColumnStructure:
          "/LoginApp/framework/structure?modelName=REPORTS&pageName=REPORTS&sectionName=DEVICES_LIST_VIEW",
      },
      totalBranchCompliance: {
        getBranchComplianceSummary:
          "/ReportingApp/analytics/deliveryassociate/compliance/branchcompliancesummary",
        getBranchDeliveryAssociateCompliance:
          "/ReportingApp/analytics/deliveryassociate/compliance/totalbranch/deliveryassociatesummary",
        downloadBranchCompliance:
          "/ReportingApp/analytics/deliveryassociate/compliance/branchcompliancesummary/download",
      },
      totalOrderCompliance: {
        getTotalOrderReportDetails:
          "/ReportingApp/analytics/deliveryassociate/compliance/totalorders/reportdetails",
        getTotalOrdersComplianceReport:
          "/ReportingApp/analytics/deliveryassociate/compliance/totalorders/orderscompliancesummary",
        getTotalOrdersColumnStructure:
          "/LoginApp/framework/structure?modelName=REPORTS&pageName=REPORTS&sectionName=ORDER_COMPLIANCE_SUMMARY_LIST_VIEW",
        downloadOrderCompliance:
          "/ReportingApp/analytics/deliveryassociate/compliance/totalorders/orderscompliancesummary/download",
      },
    },
  },
  carrier: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=CONTRACT&pageName=CONTRACT",
      data: "ClientApp/coloader/get",
      advancedFilterData: "ClientApp/coloader/get",
      uploadCarrier: "ClientApp/coloader/upload/resource",
      activationRequest: "ClientApp/coloader/active",
      branchStructure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCH&pageName=CLIENTBRANCH&sectionName=CLIENTBRANCH_LIST_VIEW",
      branchData: "ClientApp/client/branch/list",
      carrierExcelDownload: "ClientApp/coloader/download",
      inlineUpdate: "/ClientApp/coloader/update",
    },
  },
  customForms: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=ORDER_STATISTICS&pageName=DYNAMICFORMS&sectionName=DYNAMIC_FORM_LIST_VIEW",
      data: "LoginApp/custom/form/structure",
      mandatoryRequest: "LoginApp/custom/form/mandatory",
      activeRequest: "LoginApp/custom/form/active",
      deleteRecord: "LoginApp/custom/form/remove",
      getPreviewData: "LoginApp/custom/form/get",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?pageName=DYNAMICFORMS&sectionName=ADD_DYNAMIC_FORM&modelName=DYNAMICFORM",
      create: "/LoginApp/custom/form/create/list",
      getTriggerEventById: "/LoginApp/custom/form/triggerEvents",
    },
  },
  cashTransaction: {
    listView: {
      structure: {
        transactions:
          "/LoginApp/framework/structure?modelName=DELIVERYMEDIUM&pageName=DELIVERYMEDIUM&sectionName=CASH_TRANSACTIONS_LIST_VIEW",
        distributionCentre:
          "/LoginApp/framework/structure?modelName=DELIVERYMEDIUM&pageName=DELIVERYMEDIUM&sectionName=CASH_TRANSACTION_DC_LIST_VIEW",
        deliveryAssociate:
          "/LoginApp/framework/structure?modelName=DELIVERYMEDIUM&pageName=DELIVERYMEDIUM&sectionName=CASH_TRANSACTION_DA_LIST_VIEW",
      },
      data: {
        transactions: "/ShipmentApp/payment/transaction/get/transaction/list",
        distributionCentre:
          "/ShipmentApp/payment/transaction/get/distributionCenter/list",
        deliveryAssociate:
          "/ShipmentApp/payment/transaction/get/deliveryAssociate/list",
      },
      getTransactionsByDriverId:
        "/ShipmentApp/payment/transaction/get/transaction/list/driverid",
      getTransactionsByBranchId:
        "/ShipmentApp/payment/transaction/get/transaction/list/branchid",
      getTransactionProofs:
        "/ShipmentApp/payment/transaction/cashTransaction/list?parentGuid=",
      // downloadExcelUrl: '/ShipmentApp/payment/transaction/listView/download',
      downloadTransactionListReport:
        "/ReportingApp/payment/transaction/download/transaction",
      downloadDAListReport: "/ReportingApp/payment/transaction/download/da",
      downloadDCListReport: "/ReportingApp/payment/transaction/download/dc",
      downloadTransactionProof:
        "/ShipmentApp/payment/transaction/cashTransaction/downloadMedia?fileName=",
      cardStructure: {
        transaction:
          "/LoginApp/framework/structure?modelName=DELIVERYMEDIUM&pageName=DELIVERYMEDIUM&sectionName=TRANSACTION_VIEW_CARD_DETAILS",
        distributionCenter:
          "/LoginApp/framework/structure?modelName=DELIVERYMEDIUM&pageName=DELIVERYMEDIUM&sectionName=DISTRIBUTION_CENTER_CARD_DETAILS",
        deliveryAssociate:
          "/LoginApp/framework/structure?modelName=DELIVERYMEDIUM&pageName=DELIVERYMEDIUM&sectionName=DELIVERY_ASSOCIATE_CARD_DETAILS",
      },
      cardData: {
        transaction:
          "/ShipmentApp/payment/transaction/get/transaction/cardDetails",
        distributionCenter:
          "/ShipmentApp/payment/transaction/get/distributionCenter/cardDetails",
        deliveryAssociate:
          "/ShipmentApp/payment/transaction/get/deliveryAssociate/cardDetails",
        transactionByDriverId:
          "/ShipmentApp/payment/transaction/get/transaction/carddetails/driverid",
        transactionByBranchId:
          "/ShipmentApp/payment/transaction/get/transaction/carddetails/branchid",
      },
    },
    addTransaction: {
      getDeliveryAssociateList:
        "/ShipmentApp/payment/transaction/get/deliveryAssociates/list",
      getLessDepositReasons: "/ClientApp/client/ref?type=CASHDEPOSIT",
      addTransaction: "/ShipmentApp/payment/transaction/create",
    },
  },
  trips: {
    mile: {
      trackers: {
        structure: "/LoginApp/framework/structure?modelName=TRIPS&pageName=TRIPS&sectionName=TRIP_TRACKER_LIST_VIEW",
        reportDownload: "/ReportingApp/trip/tracker/download",
        data: "TripApp/trip/lmfm/tracker/list"
      },
      listview: {
        structure: {
          allTrips:
            "/LoginApp/framework/structure?modelName=TRIPS&pageName=TRIPS&sectionName=ALL_TRIPS_LIST_VIEW",
          started:
            "/LoginApp/framework/structure?modelName=TRIPS&pageName=TRIPS&sectionName=STARTED_LIST_VIEW",
          ended:
            "/LoginApp/framework/structure?modelName=TRIPS&pageName=TRIPS&sectionName=ENDED_LIST_VIEW",
          notStarted:
            "/LoginApp/framework/structure?modelName=TRIPS&pageName=TRIPS&sectionName=NOT_STARTED_LIST_VIEW",
        },
        data: "/TripApp/trip/lmfm/triplist",
        deleteRow: "/TripApp/trip/lmfm/deleteTrips",
        get_location_history: "/TripApp/trip/getInTransitHubsByTripId",
        startTrip: "/TripApp/trip/lmfm/start",
        stopTrip: "/TripApp/trip/lmfm/stop",
        updateTripLookups: "/LookupApp/lookup/fmlm/trip",
        updateTrip: "/TripApp/trip/lmfm/update",
        restoreTrip: "",
        delete: "/DeliveryMediumApp/deliverymedium/delete",
        reviseETA: "/ShipmentApp/shipment/fmlm/recalculateEta",
        showShipmentforRoute: "/TripApp/trip/lmfm/getShipmentsForRoute",
        getDeliveryRunSheetForTrip:
          "/ShipmentApp/shipment/fmlm/deliveryrunsheet",
        // 'getUndeliveredShipmentsForTrips': '/TripApp/trip/lmfm/getUndeliveredShipmentsForTrips',
        getUndeliveredShipmentsForTrips:
          "/ShipmentApp/shipment/fmlm/undelivered",
        getOrderTripColumns: "/LoginApp/framework/structure",
        getOrderTripData: "/TripApp/trip/lmfm/get",
        getLocationHistory: "/TrackingApp/track/trip",
        getTripProgressDetail: "/TripApp/trip/lmfm/getTripProgressDetails",
        getAlertDetailsByTripId: "/AlertApp/alert/getAlertDetailsByTripId",
        getManifestType:
          "/ClientApp/client/getByTypeAndId?type=MANIF-ESTTYPEOPTION",
        getModeOfTransport:
          "/ClientApp/client/getByTypeAndId?type=TRANSPORTOPTION",
        tripExcelDownload: "/TripApp/trip/listview/download",
        tripReportDownload: "/TripApp/trip/lmfm/triplist/download",
        barcodeRecentStatus: "/TrackingApp/track/device/recent",
        get_trip_polygon: "/TrackingApp/track/trip/polygon",
        getRoutes: "/LookupApp/lookup/routes",
        getTripNumber: "/TripApp/trip/generate/tripno",
        getGoodsTypes: "/LookupApp/lookup/goods",
        lrCopy: "/TripApp/trip/lr/details",
        verifyContact: "/DriverApp/driver/fmlm/contact/validate",
        updateContact: "/DriverApp/driver/fmlm/contact",
        saveSuggestTripsSetting:
          "/ClientApp/client/saveClientPreference?configType=TRIP_SUGGESTION_SETTINGS",
        getSuggestTripsSetting:
          "/ClientApp/client/getClientPreference?configType=TRIP_SUGGESTION_SETTINGS",
        getAirports: "/LookupApp/lookup/airports",
        multipleTripRoute:
          "/ShipmentApp/shipment/fmlm/deliveryrunsheetMap?fetchType=ALL",
        getUndeliveredShipmentsStructure:
          "/LoginApp/framework/structure?modelName=TRIPS&pageName=TRIPS&sectionName=UNDELIVERED_SHIPMENT_LIST_VIEW",
      },
      mapview: {
        structure: {
          allTrips:
            "/LoginApp/framework/structure?modelName=TRIPS&pageName=TRIPS&sectionName=ALL_TRIPS_MAP_VIEW",
          started:
            "/LoginApp/framework/structure?modelName=TRIPS&pageName=TRIPS&sectionName=STARTED_MAP_VIEW",
          ended:
            "/LoginApp/framework/structure?modelName=TRIPS&pageName=TRIPS&sectionName=ENDED_MAP_VIEW",
          notStarted:
            "/LoginApp/framework/structure?modelName=TRIPS&pageName=TRIPS&sectionName=NOT_STARTED_MAP_VIEW",
        },
        data: "/TripApp/trip/lmfm/triplist",
      },
    },
  },
  vehicle: {
    listView: {
      structure: {
        All: "/LoginApp/framework/structure?modelName=VEHICLE&pageName=VEHICLE&sectionName=VEHICLE_LIST_VIEW",
        Available:
          "/LoginApp/framework/structure?modelName=VEHICLE&pageName=VEHICLE&sectionName=AVAILABLE_VEHICLE_LIST_VIEW",
        Intransit:
          "/LoginApp/framework/structure?modelName=VEHICLE&pageName=VEHICLE&sectionName=INTRANSIT_VEHICLE_LIST_VIEW",
        Inactive:
          "/LoginApp/framework/structure?modelName=VEHICLE&pageName=VEHICLE&sectionName=INACTIVE_VEHICLE_LIST_VIEW",
        trackerListStructure:
          "/LoginApp/framework/structure?modelName=TRACKER&pageName=TRACKER&sectionName=VEHICLE_TRACKER_LIST_VIEW",
      },
      data: "/VehicleApp/vehicle/fmlm/list/v2",
      inlineUpdate: "/VehicleApp/vehicle/fmlm/update/list",
      uploadVehicle: "/VehicleApp/vehicle/upload/resource",
      attendance: "/VehicleApp/vehicle/fmlm/attendance",
      activationRequest: "/VehicleApp/vehicle/fmlm/update/active",
      deleteRequest: "/VehicleApp/vehicle/fmlm/delete",
      unassignedVehicles: "/VehicleApp/vehicle/fmlm/unassigned",
      vehicleExcelDownload: "/VehicleApp/vehicle/fmlm/list/download",
      branchNames: "/LookupApp/lookup/branches",
      advancedFilterData: "/VehicleApp/vehicle/list/data",
      trackerListData: "/DeviceApp/device/master/get",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?pageName=VEHICLE&sectionName=ADD_VEHICLE_FORM&modelName=VEHICLE",
      create: "/VehicleApp/vehicle/fmlm/create",
      getVehicle: "/VehicleApp/vehicle/fmlm",
      update: "/VehicleApp/vehicle/fmlm",
    },
  },
  customFields: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=CUSTOM_FIELDS_MASTER&pageName=CUSTOM_FIELDS_MASTER&sectionName=CUSTOM_FIELDS_MASTER_LIST_VIEW",
      data: "LoginApp/framework/customfield/all",
      markRequest: "LoginApp/framework/customfield/mark",
      moduleList: "ClientApp/client/getByTypeAndId?type=CUSTOMFIELDSECTIONID",
      customFieldTypes: "ClientApp/client/getByTypeAndId?type=CUSTOMFIELDTYPES",
      duplicateRequest: "LoginApp/framework/customfield/clone",
      saveCustomFields: "/LoginApp/framework/customfield",
      getCustomField: "LoginApp/framework/customfield/get",
    },
  },
  hiredDeliveryMedium: {
    listView: {
      structure: {
        All: "/LoginApp/framework/structure?modelName=HIRED_DELIVERY_MEDIUM&pageName=HIRED_DELIVERY_MEDIUM&sectionName=HIRED_DELIVERY_MEDIUM_LIST_VIEW",
      },
      data: "/DeliveryMediumApp/deliverymedium/request/list",
      reportDownload: "/ReportingApp/deliveryMediumRequest/download",
      clientBranchName: "/LookupApp/lookup/branches",
    },
  },
  overallSummary: {
    tripSummaryApi: "/TripApp/trip/get/tripsummary",
    orderSummaryApi: "/TripApp/trip/get/ordersummary",
    deliveryMediumSummaryApi: "/TripApp/trip/get/deliverymediumsummary",
    downloadTripExcelFMLM: "/TripApp/trip/lmfm/tripsummarydownload",
    downloadTripExcel: "/TripApp/trip/get/tripsummarydownload",
    downloadTripEPOD: "/TripApp/trip/lmfm/trip/customform/epod",
    advancedFilterStructure:
      "/LoginApp/framework/structure?modelName=OVERALL_SUMMARY_FILTERS&pageName=OVERALL_SUMMARY&sectionName=OVERALL_SUMMARY_ADVANCED_FILTER_COLUMNS",
    listview: {
      structure:
        "/LoginApp/framework/structure?modelName=OVERALL_SUMMARY_LIST&pageName=OVERALL_SUMMARY_LIST&sectionName=OVERALL_SUMMARY_LIST_LIST_VIEW",
      data: "/TripApp/trip/get/tripsummarylist",
    },
  },
  deliveryMedium: {
    listView: {
      data: "/DeliveryMediumApp/deliverymedium/fmlm/list",
      activationRequest: "/DeliveryMediumApp/deliverymedium/fmlm/active",
      attendance: "/DeliveryMediumApp/deliverymedium/fmlm/mark",
      getStatus: "/ClientApp/client/getByTypeAndId?type=DELIVERY_MEDIUM_STATUS",
      inlineUpdate: "/DeliveryMediumApp/deliverymedium/fmlm/update",
      getDistributionCenterBranch: "/LookupApp/lookup/branches/hierarchy",
      deleteRequest: "/DeliveryMediumApp/deliverymedium/fmlm/delete",
      downloadDBListView: "/DeliveryMediumApp/deliverymedium/fmlm/download",
      downloadOdometerReadingProofs_new:
        "/DeliveryMediumApp/deliverymedium/fmlm/odometer/proofs/bydeliverymediums",
      passwordChange: "/LoginApp/login/password/change",
      notifyDM: "DeliveryMediumApp/deliverymedium/fmlm/gcm/send/notification",
      uploadDm: "/DeliveryMediumApp/deliverymedium/upload/resource",
      weeklyOff: "/ClientApp/client/getByTypeAndId?type=WEEKDAYS",
      bulkUpdate:
        "DeliveryMediumApp/deliverymedium/fmlm/update?mode=bulkUpdate",
      sendActivationLink:
        "/DeliveryMediumApp/deliverymedium/fmlm/sendActivationLinkToDM",
      structure: "LoginApp/framework/structure",
      filterUrl:
        "/DeliveryMediumApp/deliverymedium/fmlm/list?pageNumber=1&pageSize=50",
      operations: "/LoginApp/framework/filter/operations",
      delMedType: "ClientApp/client/getByTypeAndId?type=DELIVERYTYPE",
      filterData:
        "/LoginApp/framework/filter/list?pageName=DELIVERYMEDIUM&sectionName=DELIVERY_MEDIUM_LIST_VIEW",
      deleteFilter: "/LoginApp/framework/filter/delete",
      updateFilter: "/LoginApp/framework/filter/update",
      saveFilter: "/LoginApp/framework/filter/save",
      downloadExcel: "/LoginApp/framework/download/formWorkbook",
      pageLabelStructure:
        "/LoginApp/framework/structure?pageName=PAGE_LABEL_STRUCTURE&modelName=PAGE_LABEL_STRUCTURE&sectionName=PAGE_LABEL_STRUCTURE",
      clientProperty: "/ClientApp/client/property/list",
      payoutReportDownload: "ReportingApp/report/payout/payoutAndBonusSummary/download",
      performanceReportDownload:
        "/ReportingApp/deliverymedium/mile/deliveryMediumPerformanceDownload",
      unassignedVehicles: "/VehicleApp/vehicle/fmlm/getToAssign",
    },
  },
  alertsHistory: {
    getColumnsList:
      "/LoginApp/framework/structure?modelName=ALERTS_HISTORY&pageName=ALERTS_HISTORY&sectionName=ALERTS_HISTORY_LIST_VIEW",
    getVehicleModel: "/ClientApp/client/getByTypeAndId?type=TRUCKTYPEOPTIONS",
    getVehicleTypes:
      "/ClientApp/client/getByTypeAndId?type=VEHICLEBODYTYPEOPTIONS",
    getVehicleTypeOfBody:
      "/ClientApp/client/getByTypeAndId?type=VEHICLEBODYTYPEOPTIONS",
    getOwnership: "/ClientApp/client/getByTypeAndId?type=OWNERSHIPOPTION",
    getVehicle: "/ClientApp/client/getByTypeAndId?type=VEHICLETYPEOPTION",
    downloadReport: "/AlertApp/alert/download",
    getAlertsData: "/AlertApp/alert/list/get",
    updateToggle: "/AlertApp/alert/markIsResolved",
    updateRemark: "/AlertApp/alert/savenotes",
    dropdownAlerts: "/AlertApp/alert/getAlertList",
    getOrderStatus:
      "/ClientApp/client/getByTypeAndId?type=ONDEMAND_ORDERSTATUS",
    getTripStatus: "/ClientApp/client/getByTypeAndId?type=TRIPSTATUS",
  },
  inscan: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=SCANNEDORDERS&pageName=SCANNEDORDERS&sectionName=",
      data: "/ShipmentApp/shipment/scan/list/v2?dataFetchMode=DATA",
      dataCount: "/ShipmentApp/shipment/scan/list/v2?dataFetchMode=COUNT",
      excelReportDownload:
        "/ReportingApp/scanshipment/inscan/download?dataFetchMode=DATA",
    },
  },
  inscanUpdate: {
    form: {
      structure:
        "/LoginApp/framework/structure?pageName=ORDERINSCAN&sectionName=ORDER_INSCAN_FORM&modelName=ORDERINSCAN",
      getOrders: "/ShipmentApp/shipment/scan/inscan",
      inscan: "/ShipmentApp/shipment/scan/inscan",
      getManifestOrders: "/ShipmentApp/shipment/scan/databymanifest",
      manifestOrderCount: "/ShipmentApp/shipment/scan/order/count",
      update: "/ShipmentApp/shipment/scan/update",
      create: "/ShipmentApp/shipment/scan/inscan/v2",
      getData: "/ShipmentApp/shipment/scan/getbymanifestid",
      getOrdersData: "/ShipmentApp/shipment/scan/inscan",
      saveForm: "/ShipmentApp/shipment/scan/inscan/order/save",
    },
    listview: {
      orders: {
        structure:
          "/LoginApp/framework/structure?modelName=SCANNEDORDERS&pageName=SCANNEDMANIFESTLIST&sectionName=OUTSCAN_MANIFEST_LIST_VIEW",
        data: "/ShipmentApp/shipment/scan/inscan?scanIdentifier=DATA",
      },
      manifestOfManifests: {
        structure:
          "/LoginApp/framework/structure?modelName=SCANNEDORDERS&pageName=SCANNEDMANIFESTLIST&sectionName=SCANNED_MANIFEST_LIST_VIEW",
        data: "/ShipmentApp/shipment/scan/inscan?scanIdentifier=DATA",
      },
      exceptions: {
        structure:
          "/LoginApp/framework/structure?modelName=SCANNEDMANIFESTLIST&pageName=SCANNEDMANIFESTLIST&sectionName=ORDER_MANIFEST_EXCEPTION_LISTVIEW",
      },
    },
    getColumnsList: "/LoginApp/framework/structure",
    getData: "/ShipmentApp/shipment/scan/manifests",
    addManifestFormJSON:
      "/LoginApp/framework/structure?pageName=MANIFEST&sectionName=ADD_MANIFEST_FORM&modelName=MANIFEST",
    generateManifestId: "/ShipmentApp/shipment/scan/generatemanifestid",
    getOutscanBy: "/ClientApp/client/getByTypeAndId?type=OUTSCANBY",
    getDistributionCenter: "/LookupApp/lookup/branches/hierarchy",
    getServiceType: "/ClientApp/client/getByTypeAndId?type=SERVICETYPE",
    getCouriers: "/ClientApp/coloader/list",
    getTrips: "/TripApp/trip/lmfm/manifest/data",
    getOrders: "/ShipmentApp/shipment/scan/shipmentsbyid?id=",
    createManifest: "/ShipmentApp/shipment/scan/inscan/order/save",
    updateManifest: "/ShipmentApp/shipment/scan/update",
    inscanOrder: "/ShipmentApp/shipment/scan/orderno/inscan",
    manifestOrderCount: "/ShipmentApp/shipment/scan/order/count",
    inscan: "/ShipmentApp/shipment/scan/inscan",
    getManifestTypeList: "/ClientApp/client/ref?type=MILEMANIFESTTYPE",
    getInscanById: "/ClientApp/client/getByTypeAndId?type=INSCANBY",
  },
  manifest: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=MANIFEST&pageName=MANIFEST&sectionName=MANIFEST_LIST_VIEW",
      data: "/ShipmentApp/shipment/scan/manifests",
      excelReportDownload:
        "/ReportingApp/scanshipment/outscan/download?dataFetchMode=DATA",
      markAsHandover: "/ShipmentApp/shipment/scan/markashandover",
      printManifestStructure:
        "/LoginApp/framework/structure?modelName=SCANNEDMANIFESTLIST&pageName=SCANNEDMANIFESTLIST&sectionName=OUTSCAN_MANIFEST_LIST_VIEW",
      printManifestTemplate:
        "/ShipmentApp/shipment/scan/dynamicHtmlTemplates?type=MANIFESTTEMPLATE",
      printManifestLabelTemplate:
        "/ShipmentApp/shipment/scan/dynamicHtmlTemplates?type=MANIFESTLABEL",
      getHTMLTemplates:
        "/ShipmentApp/shipment/scan/dynamicHtmlTemplates?type=MANIFESTLABEL&isFavourite=false",
      getManifestHTMLTemplates:
        "/ShipmentApp/shipment/scan/dynamicHtmlTemplates?type=MANIFEST_TEMPLATE&isFavourite=false",
      getAWBOrderDetails: "/ShipmentApp/shipment/fmlm/awb/details",
      getManifestOrderDetails: "/ShipmentApp/shipment/scan/manifests",
    },
  },
  outscan: {
    form: {
      structure:
        "/LoginApp/framework/structure?pageName=MANIFEST&sectionName=ADD_MANIFEST_FORM&modelName=MANIFEST",
      getOrders: "/ShipmentApp/shipment/scan/shipmentsbyid",
      outscan: "/ShipmentApp/shipment/scan/outscan",
      getManifestOrders: "/ShipmentApp/shipment/scan/databymanifest",
      manifestOrderCount: "/ShipmentApp/shipment/scan/order/count",
      update: "/ShipmentApp/shipment/scan/update",
      create: "/ShipmentApp/shipment/scan/create?mode=web",
      getData: "/ShipmentApp/shipment/scan/getbymanifestid",
    },
    listview: {
      orders: {
        structure:
          "/LoginApp/framework/structure?modelName=SCANNEDMANIFESTLIST&pageName=SCANNEDMANIFESTLIST&sectionName=OUTSCAN_MANIFEST_LIST_VIEW",
        data: "/LoginApp/framework/filter/list?pageName=SCANNEDMANIFESTLIST&sectionName=OUTSCAN_MANIFEST_LIST_VIEW",
      },
      manifestOfManifests: {
        structure:
          "/LoginApp/framework/structure?modelName=SCANNEDMANIFESTLIST&pageName=SCANNEDMANIFESTLIST&sectionName=SCANNED_MANIFEST_LIST_VIEW",
        data: "/LoginApp/framework/filter/list?pageName=SCANNEDMANIFESTLIST&sectionName=SCANNED_MANIFEST_LIST_VIEW",
      },
      exceptions: {
        structure:
          "/LoginApp/framework/structure?modelName=SCANNEDMANIFESTLIST&pageName=SCANNEDMANIFESTLIST&sectionName=ORDER_MANIFEST_EXCEPTION_LISTVIEW",
      },
    },
    getColumnsList: "/LoginApp/framework/structure",
    getData: "/ShipmentApp/shipment/scan/manifests",
    addManifestFormJSON:
      "/LoginApp/framework/structure?pageName=MANIFEST&sectionName=ADD_MANIFEST_FORM&modelName=MANIFEST",
    generateManifestId: "/ShipmentApp/shipment/scan/generatemanifestid",
    getOutscanBy: "/ClientApp/client/getByTypeAndId?type=OUTSCANBY",
    getDistributionCenter: "/LookupApp/lookup/branches/hierarchy",
    getServiceType: "/ClientApp/client/getByTypeAndId?type=SERVICETYPE",
    // 'getTripsDropdown': "/TripApp/trip/tripnamelist",
    getCouriers: "/ClientApp/coloader/list",
    getTrips: "/TripApp/trip/lmfm/manifest/data",
    getOrders: "/ShipmentApp/shipment/scan/shipmentsbyid?id=",
    createManifest: "/ShipmentApp/shipment/scan/create",
    updateManifest: "/ShipmentApp/shipment/scan/update",
    outscaneOrder: "/ShipmentApp/shipment/scan/orderno/outscan",
    manifestOrderCount: "/ShipmentApp/shipment/scan/order/count", //?manifestId=manifest_Number',
    outscan: "/ShipmentApp/shipment/scan/outscan", // POST:
    /** Outscan */
    // "scanIdentifier": "Test28122020_2_31",
    // "type": "TRIP" | 'COLOADER' | 'BRANCH' ,
    // "tripId": 1234,
    // "cancelledOrderAllowedFl": false
    getManifestTypeList: "/ClientApp/client/ref?type=MILEMANIFESTTYPE",
  },
  advancedSearch: {
    getOperations: "/LoginApp/framework/filter/operations",
    saveFilter: "/LoginApp/framework/filter/save",
    getFilters: "/LoginApp/framework/filter/list",
    deleteFilters: "/LoginApp/framework/filter/delete",
    updateFilter: "/LoginApp/framework/filter/update",
  },
  order: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=ORDERS&pageName=ORDERS&sectionName=${status}_ORDER_LIST_VIEW",
      data: "/ShipmentApp/shipment/fmlm?dataFetchMode=DATA",
      count: "/ShipmentApp/shipment/fmlm?dataFetchMode=COUNT",
      templates: "/LoginApp/framework/notification/templates",
      hierarchy: "/LookupApp/lookup/branches/hierarchy",
      operations: "/LoginApp/framework/filter/operations",
      list: "/LoginApp/framework/filter/list?pageName=ORDERS&sectionName=ALL_ORDER_LIST_VIEW",
      orderStatus: "/ClientApp/client/getByTypeAndId?type=ONDEMAND_ORDERSTATUS",
      hubScanStatus: "/ClientApp/client/getByTypeAndId?type=hubScanStatus",
      paymentType: "/ClientApp/client/getByTypeAndId?type=paymentType",
      ref: "/ClientApp/client/ref?type=PRIORITY",
      deliveryType: "/ClientApp/client/getByTypeAndId?type=DELIVERYTYPE",
      uploadOrder: "/ShipmentApp/order/import",
      importExcelDownload:
        "/LoginApp/framework/download/formWorkbook?fallbackIfNotFound=true&modelName=ORDERS&pageName=ORDERS&sectionName=ADD_ORDER_FORM",
      orderExcelDownload:
        "/ShipmentApp/shipment/fmlm/download?areCratesRequired=false",
      deleteRequest: "/ShipmentApp/shipment/fmlm?shipment_ids=",
      inlineUpdate: "/ShipmentApp/shipment/fmlm/update?isInlineUpdate=true",
      templateKey: "/LoginApp/framework/notification/key/structure",
      customerNotificationSend: "/ShipmentApp/order/notify",
      download:
        "/ShipmentApp/shipment/fmlm/download?areCratesRequired=${areCratesRequired}&endDateFilter=${endDateFilter}&hitStamp=${hitStamp}&startDateFilter=${startDateFilter}&status=${status}",
      barcode:
        "/ShipmentApp/shipment/fmlm/crate/barCodes?endTimeFilter=${endTimeFilter}&startTimeFilter=${startTimeFilter}",
      epod: "/ShipmentApp/shipment/fmlm/epod/list/byshipments",
      assignOrderData:
        "/TripApp/trip/lmfm/getToAssignOrders?status=NOTSTARTED,STARTED",
      tripStructure:
        "/LoginApp/framework/structure?modelName=${modelName}&pageName=${pageName}&sectionName=${status}_LIST_VIEW",
      changeStatus: "ShipmentApp/shipment/fmlm/status",
      overrideStatus: "ShipmentApp/shipment/fmlm/override/status",
      getReasons: "ClientApp/client/getByTypeAndId",
      manualAssign: "/TripApp/trip/lmfm/assign?assignMode=quick",
      deliveryProofStructure:
        "LoginApp/framework/structure?modelName=ORDERS&pageName=ORDERS&sectionName=DELIVERY_PROOF_LIST_VIEW",
      bulkUpdate: "/ShipmentApp/shipment/fmlm/update",
      filterData:
        "/LoginApp/framework/filter/list?pageName=ORDERS&sectionName=ALL_ORDER_LIST_VIEW",
      estimateCost:
        "LoginApp/framework/structure?pageName=ORDERS&modelName=FMLM&sectionName=ESTIMATED_SHIPPING_COST_VIEW",
      customerNotificationTemplates:
        "/LoginApp/framework/notification/templates",
      deleteCustomerNotificationTemplates:
        "/LoginApp/framework/notification/templates/delete",
      availableTimeSlots:
        "/ServiceAreaApp/timewindow/get/widget/availabletimewindows",
      getCrateStructure:
        "/LoginApp/framework/structure?pageName=ORDERS&modelName=ORDERS&sectionName=CRATE_LIST",
      getCrateItemsStructure:
        "/LoginApp/framework/structure?pageName=ORDERS&modelName=ORDERS&sectionName=CRATE_ITEM_LIST&restrictColumns=false",
      getPutCrateLineData: "/ShipmentApp/shipment/fmlm/crate",
      getTempratureArray:
        "/ClientApp/client/getByTypeAndId?type=TEMPERATURECATEGORY",
      getZonalCapacaity:
        "/ClientApp/client/property/list?propertyKey=CONSIDERZONECAPACITY",
      bulkOptimize: "/ShipmentApp/shipment/fmlm/crate/bulk/optimize",
      startTrip: "/TripApp/trip/lmfm/start",
      getHTMLTemplates:
        "/ShipmentApp/shipment/scan/dynamicHtmlTemplates?type=ORDERAWBTEMPLATES&isFavourite=false",
      getAWBOrderDetails: "/ShipmentApp/shipment/fmlm/awb/details",
      bulkUpdateStructure:
        "/LoginApp/framework/structure?modelName=ORDERS&pageName=ORDERS&sectionName=ALL_ORDER_BULK_UPDATE",
      bulkUpdateFmlm: "/ShipmentApp/shipment/fmlm/update/v2?isBulkUpdate=true",
      inlineUpdateFmlm:
        "/ShipmentApp/shipment/fmlm/update/v2?isInlineUpdate=true",
      addressUpdatefieldsStructure:
        "/LoginApp/framework/structure?pageName=GEOCODING&sectionName=UPDATE_ADDRESS_FORM&modelName=GEOCODING",
      allOrdersAddressUpdateListStructure:
        "/LoginApp/framework/structure?modelName=ORDERS&pageName=ORDERS&sectionName=ALL_ORDER_ADDRESS_UPDATE_LIST",
      getCustomerOrderAddress: "/ShipmentApp/shipment/customer/address/list",
      updateShipmentAddress: "/ShipmentApp/shipment/customer/address/update",
      allCustomerAddresses:
        "/ClientApp/clientnode/customer/address?customerAccountCd=",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?modelName=ORDERS&pageName=ORDERS&sectionName=ADD_ORDER_FORM",
      getOptimizeFl:
        "/ClientApp/client/property/list?propertyKey=OPTIMIZEPACKING",
      getCrateType: "/ClientApp/client/property?propertyKey=CRATESTRUCTURE",
      getOrderNumber: "/ShipmentApp/shipment/fmlm/autogenerate/orderNo",
      getOrdeById: "/ShipmentApp/shipment/fmlm/getById",
      getCustomerProfilingPickup:
        "/ClientApp/client/property?propertyKey=CUSTOMERPROFILINGPICKUP",
      getCustomerProfilingDeliver:
        "/ClientApp/client/property?propertyKey=CUSTOMERPROFILINGDELIVER",
      createOrder: "/ShipmentApp/shipment/fmlm/create",
      getLocale: "/LookupApp/lookup/locale?id=0&type=COUNTRY",
      getCustomer: "/ClientApp/client/node",
      getAddressJson:
        "/LoginApp/framework/address/structure?modelName=ORDERS&pageName=ORDERS&sectionName=ADD_ORDER_FORM",
      orderCrate: "/ShipmentApp/shipment/fmlm/crate",
      getCrateList:
        "/LoginApp/framework/structure?pageName=ORDERS&modelName=ORDERS&sectionName=CRATE_LIST",
      getOptimizeCrateItemList:
        "/LoginApp/framework/structure?pageName=ORDERS&modelName=OPTIMIZE_CRATE_ITEM&sectionName=OPTIMIZE_CRATE_ITEM_LIST",
      getCrateItemList:
        "/LoginApp/framework/structure?pageName=ORDERS&modelName=ORDERS&sectionName=CRATE_ITEM_LIST",
      getCrateNameData: "/ShipmentApp/cratemaster/getCrateByName?crateName=",
      getContactList:
        "/LoginApp/framework/structure?pageName=CUSTOMER&modelName=CUSTOMER&sectionName=ALTERNATE_CONTACT_LIST",
      getBookingCrateItemList:
        "/LoginApp/framework/structure?pageName=BOOKING&modelName=BOOKING&sectionName=BOOKING_CRATE_ITEM_LIST",
      updateTrip: "/TripApp/trip/lmfm/update",
      getAddressIds: "/ClientApp/client/node/list?isCreateOrderRequest=true",
    },
  },
  brandProfile: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=BRAND_PROFILE&pageName=BRAND_PROFILE&sectionName=BRAND_PROFILE_LIST_VIEW",
      data: "/ClientApp/brandProfiles/list",
      activationRequest: "/ClientApp/brandProfiles/active",
      getBrandProfileDetails: "/ClientApp/brandProfiles/getById",
      saveBrandProfile: "/ClientApp/brandProfiles/create",
      updateBrandProfile: "/ClientApp/brandProfiles/update",
      getDefaultTemplate: "/ClientApp/brandProfiles/getDefaultBrandProfile",
      uploadPromotionImage: "/ClientApp/brandProfiles/uploadPromotionImage",
    },
  },
  shipper: {
    listView: {
      structure: "LoginApp/framework/structure",
      data: "/ClientApp/shipper/list",
      getShipperStatus: "/ClientApp/client/getByTypeAndId?type=SHIPPER_STATUS",
      inlineUpdate: "/ClientApp/shipper/update",
      activationRequest: "/ClientApp/shipper/activate",
      validate: "/ClientApp/shipper/validate?token=",
      approve: "/ClientApp/shipper/approve?token=",
      getRejectReasonList:
        "/ClientApp/client/getByTypeAndId?type=SHIPPER_REJECT_REASON",
      getDeactivationReasonList:
        "/ClientApp/client/getByTypeAndId?type=SHIPPER_DEACTIVE_REASON",
      getClientUserList: "/UserAccessApp/user/list",
      getClientUserStructure:
        "/LoginApp/framework/structure?modelName=USER&pageName=USER&sectionName=SHIPPER_USER_LIST_VIEW",
      reject: "/ClientApp/shipper/reject",
      uploadDm: "/ClientApp/shipper/upload",
      downloadTemplate: "/ClientApp/shipper/format/download",
      download: "/ClientApp/shipper/listview/download",
      priority: "/ClientApp/client/ref?type=PRIORITY",
      requestconversion: "/ClientApp/client/ref?type=ORDERREQUESTCONVERSION",
      count: "/ClientApp/shipper/list",
    },
    getContactList:
      "/LoginApp/framework/structure?pageName=SHIPPER&modelName=SHIPPER&sectionName=ALTERNATE_CONTACT_LIST",
    form: {
      structure:
        "/LoginApp/framework/structure?modelName=ADD_SHIPPER&pageName=SHIPPER&sectionName=ADD_SHIPPER_FORM",
      onBoarding: "/ClientApp/client/onboarding/shipperOnboardingStructure",
      approve: "/ClientApp/shipper/approve?token=",
      update: "/ClientApp/shipper/updateShipper",
      uploadLogo: "/ClientApp/client/logo/upload",
      getShipperDetails: "/ClientApp/shipper/getbysubclientid?subclientId=",
    },
    properties: {
      priority: "/ClientApp/client/ref?type=PRIORITY",
      getShipperProperties: "/ClientApp/shipper/getShipperSetting",
      update: "/ClientApp/shipper/setting/update",
      save: "/ClientApp/shipper/setting/save",
      structure:
        "/LoginApp/framework/structure?modelName=SHIPPER_PROPERTIES_FORM&pageName=SHIPPER&sectionName=SHIPPER_PROPERTIES_FORM",
    },
    preference: {
      getClientPreferences: "/ClientApp/client/properties?subClientId=",
      getUnitSystemMetrices:
        "/LookupApp/lookup/getSystemPropertyMetrices?unitSystemMetrices=",
      save: "/ClientApp/client/properties?subClientId=",
      structure:
        "/LoginApp/framework/structure?modelName=ADD_SHIPPER&pageName=SHIPPER&sectionName=SHIPPER_PREFERENCE_FORM",
    },
    alertProfile: {
      getProfileList: "/AlertApp/alertprofile/list?type=SHIPPER",
      update: "/AlertApp/alertprofile/link",
      structure:
        "/LoginApp/framework/structure?modelName=ADD_SHIPPER&pageName=SHIPPER&sectionName=SHIPPER_ALERTPROFILE_FORM",
    },
    etaProfile: {
      saveOrUpdate: "/ClientApp/client/properties",
    },
    getShipperSystemProps:
      "/ClientApp/clientproperty/system/properties/byclientid",
  },
  fleet: {
    listView: {
      data: "/ClientApp/fleettype/list",
      download: "/ClientApp/fleettype/download",
      activationRequest: "/ClientApp/fleettype/active",
      inlineUpdate: "/ClientApp/fleettype/update",
      uploadDm: "/ClientApp/fleettype/upload",
      formatDownload: "/ClientApp/fleettype/upload/format/download",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?pageName=DELIVERYMEDIUM&sectionName=ADD_FLEET_TYPE_FORM&modelName=DELIVERYMEDIUM",
      update: "/ClientApp/fleettype/update",
      create: "/ClientApp/fleettype/create",
      getData: "/ClientApp/fleettype/getbyid",
    },
  },
  webhookProfile: {
    testUrl: "/ClientApp/webhookprofile/validateWebhookUrl?webhookUrl=",
    getEventsList: "/ClientApp/client/getNotificationEventsList",
    createWebhookProfile: "/ClientApp/webhookprofile/create",
    getWebhookDetails: "/ClientApp/webhookprofile/getById?webhookProfileId=",
    updateWebhook: "/ClientApp/webhookprofile/update?webhookProfileId=",
    generateSignature:
      "/ClientApp/webhookprofile/generateClientWebhookSignature",
    getWebhookSignatue: "/ClientApp/webhookprofile/getWebhookSignature",
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=WEBHOOKPROFILES&pageName=WEBHOOKPROFILES&sectionName=ORG_WEBHOOK_LIST_VIEW",
      fetchData: "/ClientApp/webhookprofile/list?dataFetchMode=BOTH",
      activeWebhook: "/ClientApp/webhookprofile/active?",
      deleteWebhook: "/ClientApp/webhookprofile/delete",
    },
  },
  OauthProfile :{
    listView: {
      structure:
      "/LoginApp/framework/structure?sectionName=OAUTH2_TOKEN_LISTVIEW&pageName=OAUTH2_TOKEN_CONFIG&modelName=WEBHOOK_TOKEN_CONFIG",
      data:"ClientApp/webhookTokenConfig/list",
      fetchData: "/ClientApp/webhookprofile/list?dataFetchMode=BOTH",
      deleteRequest :"/ClientApp/webhookTokenConfig/delete"
    },
    form:{
      structure:
      "/LoginApp/framework/structure?sectionName=OAUTH2_TOKEN_FORM&pageName=OAUTH2_TOKEN_CONFIG_FORM&modelName=WEBHOOK_TOKEN_CONFIG_FORM",
      create:'/ClientApp/webhookTokenConfig/create',
      updateOauth:'/ClientApp/webhookTokenConfig/update',
      get:'ClientApp/webhookTokenConfig/getById'
    }
  },


  branchWebhookProfile: {
    getBranches: "/LookupApp/lookup/branches/hierarchy",
    testUrl: "/ClientApp/webhookprofile/validateWebhookUrl?webhookUrl=",
    createWebhookProfile: "/ClientApp/branch/webhookprofile/create",
    getWebhookDetails:
      "/ClientApp/branch/webhookprofile/getById?branchWebhookProfileId=",
    updateWebhook:
      "/ClientApp/branch/webhookprofile/update?branchWebhookProfileId=",
    generateSignature:
      "/ClientApp/branch/webhookprofile/generateBranchWebhookSignature",
    getWebhookSignatue:
      "/ClientApp/branch/webhookprofile/getBranchWebhookSignature?branchId=",
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=WEBHOOKPROFILES&pageName=WEBHOOKPROFILES&sectionName=BRANCH_WEBHOOK_LIST_VIEW",
      fetchData: "/ClientApp/branch/webhookprofile/list?dataFetchMode=BOTH",
      activeWebhook:
        "/ClientApp/branch/webhookprofile/active?branchWebhookProfileId=",
      deleteWebhook: "/ClientApp/branch/webhookprofile/delete",
    },
  },
  shipperWebhookProfile: {
    testUrl: "/ClientApp/webhookprofile/validateWebhookUrl?webhookUrl=",
    getEventsList:
      "/ClientApp/client/getShipperNotificationEventsList?subClientId=",
    createWebhookProfile: "/ClientApp/webhookprofile/create",
    getWebhookDetails: "/ClientApp/webhookprofile/getById",
    updateWebhook: "/ClientApp/webhookprofile/update?webhookProfileId=",
    generateSignature:
      "/ClientApp/webhookprofile/generateClientWebhookSignature",
    getWebhookSignatue: "/ClientApp/webhookprofile/getWebhookSignature",
    getOnBoardingStructure:
      "/ClientApp/client/onboarding/shipperOnboardingStructure",
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=WEBHOOKPROFILES&pageName=WEBHOOKPROFILES&sectionName=SHIPPER_WEBHOOK_LIST_VIEW",
      fetchData: "/ClientApp/webhookprofile/list?dataFetchMode=BOTH",
      activeWebhook: "/ClientApp/webhookprofile/active?",
      deleteWebhook: "/ClientApp/webhookprofile/delete",
    },
  },
  webHookListView: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=WEBHOOK_ACTIVITY&pageName=WEBHOOK_ACTIVITY&sectionName=WEBHOOK_ACTIVITY_LIST_VIEW",
      data: "/ClientApp/webhook/get",
      modules: "/ClientApp/client/getByTypeAndId?type=MODULEOPTIONS",
      eventType: "/ClientApp/client/getByTypeAndId",
      webHookDetail: "/ClientApp/webhook/data",
      status: "/ClientApp/client/getByTypeAndId?type=WEBHOOKSTATUS",
      responseCode: "ClientApp/client/getByTypeAndId?type=responseCode",
      attemptsDetails: "/ClientApp/webhook/events/data",
      retry: "/ClientApp/webhook/retry",
    },
  },
  alertMessage: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=CUSTOMIZE_EMAIL_TEMPLATES&pageName=CUSTOMIZE_EMAIL_TEMPLATES&sectionName=CUSTOMIZE_EMAIL_TEMPLATES_LIST_VIEW",
      data: "/ClientApp/customizeEmailTemplate/list",
      activationRequest: "/ClientApp/customizeEmailTemplate/active",
      getTemplateById: "/ClientApp/customizeEmailTemplate/getById",
      updateTemplate: "/ClientApp/customizeEmailTemplate/update",
      getDefaultTemplate:
        "/ClientApp/customizeEmailTemplate/getDefaultEmailTemplates",
      createTemplate: "/ClientApp/customizeEmailTemplate/create",
      testEmail: "/ClientApp/customizeEmailTemplate/testEmail",
    },
  },
  settings: {
    alertProfiles: {
      getProfileList: "/AlertApp/alertprofile/list",
      saveAlertListData: "/AlertApp/alertprofile/active/parameters",
      getAlertListData: "/AlertApp/alertprofile/getbyprofileid",
      getAlertListStructure:
        "/LoginApp/framework/structure?modelName=DEFAULT_ALERT&pageName=DEFAULT_ALERT&sectionName=DEFAULT_ALERT_LIST_VIEW",
      markFavourite: "/AlertApp/alertprofile/favourite",
      deleteProfile: "/AlertApp/alertprofile/delete",
      saveProfileParameters: "/AlertApp/alertprofile/active/parameters",
      createProfile: "/AlertApp/alertprofile/create",
      getAlertSettings: "/AlertApp/alertprofile/alert/setting/data", //?profileId=1&alertMasterId=23
      saveAlertSettings: "/AlertApp/alertprofile/update/parameters",
      getAlertSettingsMessageStructure:
        "/LoginApp/framework/structure?pageName=DEFAULT_ALERT&sectionName=ALERT_MESSAGE_FORM&modelName=DEFAULT_ALERT",
      // getAlertSettingsMessageData: '/AlertApp/alert/messages/data',
      // saveAlertSettingsMessageData: '/AlertApp/alert/message',
      getAlertSettingsMessageData: "/AlertApp/alertprofile/message/data",
      saveAlertSettingsMessageData: "/AlertApp/alertprofile/message",
      getAlertSettingsTagsData: "/LoginApp/framework/alert/key/structure", //?alertMasterId=23
      linkAlertProfile: "/AlertApp/alertprofile/link",
      previewMobile: "/AlertApp/alert/preview", //?alertMasterId=23&type=SMS&phoneNumber=7875043336
      lookups: {
        shipper: "/LookupApp/lookup/shippers",
        branch: "/LookupApp/lookup/branches/hierarchy",
        alertProfiles: "/AlertApp/alertprofile/lookup",
        alertEmailTemplate: "/ClientApp/customizeEmailTemplate/active/list", //?profileId=1&alertMasterId=23
        alertCategories: "/ClientApp/client/getByTypeAndId?type=ALERTCATEGORY",
      },
      getHTMLBody: "/AlertApp/alert/preview",
      sendTestEmail: "/AlertApp/alert/preview/email/send",
    },
    organizationProfile: {
      getDetails: "/ClientApp/client/list/update",
      updateDetails: "/ClientApp/client/profile",
    },
  },

  orderRequest: {
    listView: {
      data: "/BookingApp/booking/list",
      download: "/ReportingApp/bookingreport/download",
      inlineUpdate: "",
      uploadDm: "/BookingApp/booking/upload/import",
      formatDownload: "/BookingApp/booking/upload/format/download",
      approve: "/BookingApp/booking/update/shipmentrequest?event=accept",
      reject: "/BookingApp/booking/update/shipmentrequest?event=reject",
    },
  },
  saas: {
    clientOnboarding: {
      structure:
        "LoginApp/framework/structure?modelName=CLIENT_ONBOARDING&pageName=CLIENT_ONBOARDING&sectionName=ONBOARDING_ADD_CLIENT_FORM",
      mainStructure: "ClientApp/client/onboarding/structure?guid=",
      hubStructure:
        "LoginApp/framework/structure?modelName=ONBOARDING_CLIENTBRANCH&pageName=ONBOARDING_CLIENTBRANCH&sectionName=ONBOARDING_CLIENTBRANCH_ADD_FORM",
      draftData: "ClientApp/client/onboarding/draft?guid=",
      draftSetData: "ClientApp/client/onboarding/structure",
      launch: "ClientApp/client/onboarding/launch",
      defaultIndustry: "ClientApp/client/onboarding/getIndustryType?guid=",
      setPassword: "ClientApp/saas/client/updatepassword",
      getProfile: "ClientApp/client/onboarding/user/profile",
      verifyEmail:"ClientApp/saas/client/verify/email"
    },
    tour: {
      structure: "ClientApp/product/tour/structure/get?",
      updateStructure: "ClientApp/product/tour/structure/update",
    },
    plans: {
      structure:
        "/LoginApp/framework/structure?pageName=SETUP&sectionName=SAASACCOUNTCREATION_INR&modelName=SAASACCOUNTCREATION",
      getPlan: "/ClientApp/saas/client/saasAccount/get?zohoSubscriptionId=",
      addonPlans: "/ClientApp/saas/client/addons?plan=",
      productPlan: "/ClientApp/plan/list?currencyCode=",
      getHubSpotDetails: "/ClientApp/saas/client/hubspotDetails",
      update: "/ClientApp/saas/client/saasAccount/update?zohoSubscriptionId=",
      create: "/ClientApp/saas/client/saasAccount/offline/create",
      addressFields:
        "/LoginApp/framework/address/structure?modelName=CLIENT&pageName=CLIENT&sectionName=ADD_CLIENT_FORM&country=",
      getParentSubscriptionId: "/ClientApp/mapping/data/get",
    },
    uat: {
      structure:
        "/LoginApp/framework/structure?pageName=SETUP&sectionName=SAASUATACCOUNTCREATION&modelName=SAASACCOUNTCREATION",
      getUatDetails: "/ClientApp/saas/client/getAdminAccountDetails",
      create: "/ClientApp/saas/client/createAccountForParentId",
      update: "/ClientApp/client/updateClientAccount",
      getUatAccountCount: "/ClientApp/saas/client/getAccountCountByParentId",
    },
  },
  branchConfiguration: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCH&pageName=CLIENTBRANCH&sectionName=CLIENTBRANCH_LIST_VIEW",
      data: "/ClientApp/client/branch/list",
      activateBranch: "/ClientApp/client/branch/active?active=true",
      operationTimingsStructure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCH&pageName=CLIENTBRANCH&sectionName=CLIENTBRANCH_OPERATION_TIME_DETAILS",
      loadMultiplierListViewStructure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCH&pageName=CLIENTBRANCH&sectionName=CLIENTBRANCH_LOAD_MULTIPLIER_DETAILS",
      operationTimingsListById:
        "/ClientApp/client/branch/operationsTimingForBranch",
      managerListStructure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCH&pageName=CLIENTBRANCH&sectionName=CLIENTBRANCH_MANAGERS_DETAILS",
      managerListById: "/ClientApp/client/branch/branchManagersDetails",
      branchUpload: "/ClientApp/clientbranch/upload/resource",
      branchListDownload: "/ReportingApp/clientBranch/download",
      getLoadMultipliers: "/ClientApp/client/branch/loadMultiplierForBranch",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCH&pageName=CLIENTBRANCH_ADD_FORM&sectionName=CLIENTBRANCH_ADD_FORM",
      operationTimingsStructure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCH&pageName=CLIENTBRANCH&sectionName=ADD_OPERATIONSTIMING_FORM",
      shiftTimingsStructure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCH&pageName=CLIENTBRANCH&sectionName=ADD_SHIFTTIMING_FORM",
      branchDetails: "ClientApp/client/branch",
      validateWallet: "/ClientApp/client/wallet/valid",
      create: "/ClientApp/client/branch/create",
      update: "/ClientApp/client/branch",
      serviceZoneStructure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCHSERVICEZONE&pageName=SERVICE_AREA_MASTER_PROFILE&sectionName=CARRIER_SERVICE_AREA_ZONE",
      serviceZoneProfileStructure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCHSERVICEZONERATEPROFILE&pageName=SERVICE_AREA_MASTER_PROFILE&sectionName=CARRIER_SERVICE_AREA_ZONE_RATE_PROFILE",
      zoneListView:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCHSERVICEZONERATEPROFILE&pageName=CARRIER_BRANCH_SERVICE_AREA_ZONE&sectionName=CARRIER_BRANCH_SERVICE_AREA_ZONE_LIST_VIEW",
      getRateProfile: "/ClientApp/rateprofile/getrateprofiles",
      loadMultiplierStructure:
        "/LoginApp/framework/structure?modelName=CLIENTBRANCH&pageName=CLIENTBRANCH&sectionName=ADD_LOADMULTIPLIER_FORM",
    },
  },
  customer: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=CUSTOMER&pageName=CUSTOMER&sectionName=CUSTOMER_LIST_VIEW",
      data: "/ClientApp/customer/list",
      advancedFilterData: "/ClientApp/customer/list/data?dataFetchMode=DATA",
      advancedFilterCount: "/ClientApp/customer/list/data?dataFetchMode=COUNT",
      inlineUpdate: "/ClientApp/customer/list",
      uploadDriver: "/ClientApp/customer/upload/resource",
      activationRequest: "/ClientApp/customer/active",
      customerExcelDownload: "/ReportingApp/customer/report/download",
      uploadCustomer: "/ClientApp/customer/import",
      notificationType:
        "/LoginApp/framework/notification/templates?notificationType=CUSTOMER",
      notifyDynamicTags:
        "/LoginApp/framework/notification/key/structure?notificationType=CUSTOMER",
      notifyCustomer: "/ClientApp/customer/notify",
    },
  },
  middleMileOrder: {
    listView: {
      printAwb: {
        getAwbTemplates: "/ShipmentApp/middlemile/shipment/order/awb/templates",
        getOrderDetails: "/ShipmentApp/middlemile/shipment/order/awb/details", // ?orderIds
      },
      bulkUpdate: {
        bulkUpdateStructure: "/LoginApp/framework/getBulkUpdateStructure",
        getServiceTypeBYSkillSet:
          "/ClientApp/serviceTypeMaster/getServiceTypeRefByDeliveryTypes",
        findRoute: "/ClientApp/client/route/middlemile/find",
        updateOrder: "/ShipmentApp/middlemile/shipment/order/bulkUpdate",
        getOrderDetails: "/ShipmentApp/middlemile/shipment/order/getById",
      },
    },
  },
  featurePanel: {
    getReadUnreadData: "/CommonApp/featurePannel/getVisitData", //articleCategory=announcement | explore
    updateReadUnreadData: "/CommonApp/featurePannel/visit", // ?articleCategory=announcement | explore
    getUserPostFeedback: "/CommonApp/featurePannel/getFeedback",
    updateUserPostFeedback: "/CommonApp/featurePannel/updateFeedback",
  },
  geofenceMaster: {
    listView: {
      structure: "/LoginApp/framework/structure",
      data: "/GeofenceApp/geofence/mapping/list",
      getTerritoryProfileListing: "/GeofenceApp/geofenceprofile/get",
      getDeliveryAssociatesList:
        "/DeliveryMediumApp/deliverymedium/fmlm/deliverymedium/list",
      getCategoryList: "/ClientApp/client/getByTypeAndId?type=GEOFENCECATEGORY",
      deleteGeofence: "/GeofenceApp/geofence/geofenceDMMapping/delete",
      updateGeofence: "/GeofenceApp/geofence/update/mapping/list",
      updateStatus: "/GeofenceApp/geofence/geofenceDMMapping/active",
      updateTerritoryProfile: "/GeofenceApp/geofenceprofile/update",
      getTerritoryProfileById: "/GeofenceApp/geofenceprofile/getbyid",
      excelReportDownload: "/ReportingApp/geofence/mapping/list/download",
      updateGeofenceFormJSON:
        "/LoginApp/framework/structure?pageName=UPDATEGEOFENCEMASTER&sectionName=UPDATEGEOFENCEMASTER&modelName=UPDATEGEOFENCEMASTER",
    },
  },
  contract: {
    listView: {
      structure: "/LoginApp/framework/structure",
      data: "/ClientApp/contract/list",
      inlineUpdate: "/ClientApp/contract/update",
      advancedFilterData: "/ClientApp/contract/list/data",
      uploadContract: "/ClientApp/contract/import",
      activationRequest: "/ClientApp/contract/active",
      contractExcelDownload: "/ClientApp/contract/listview/download",
      formatDownload: "ClientApp/contract/format/download",
      status: "/ClientApp/contract/list",
      branchCount: "/ClientApp/contract/getbyid",
      // active: "/ClientApp/contract/active?isActive=false",
      // inActive: "/ClientApp/contract/active?isActive=true"
    },
  },

  importSettings: {
    structure:
      "/LoginApp/framework/structure?modelName=IMPORT_SETTINGS&pageName=IMPORT_SETTINGS&sectionName=IMPORT_SETTINGS",
    dropdowns: {
      IMPORT_FROM: "/ClientApp/client/data/lookup",
      IMPORT_TO: "/ClientApp/client/data/lookup/to",
      PLANNING_PROFILE:
        "/ClientApp/clientpropertiesprofile/lookup?profileType=PLANNING",
      AUTO_ASSIGNMENT_PROFILE:
        "/ClientApp/clientpropertiesprofile/lookup?profileType=AUTOASSIGNMENT",
      ORGANIZATION_ALERT_PROFILE:
        "/AlertApp/alertprofile/client/lookup?type=CLIENT",
      SHIPPER_ALERT_PROFILE:
        "/AlertApp/alertprofile/client/lookup?type=SHIPPER",
      BRANCH_ALERT_PROFILE: "/AlertApp/alertprofile/client/lookup?type=BRANCH",
      CUSTOMER_NOTIFICATIONS:
        "/ClientApp/notification/templates/lookup?notificationType=CUSTOMER",
      ORDER_NOTIFICATIONS:
        "/ClientApp/notification/templates/lookup?notificationType=ORDER",
      EMAIL_TEMPLATES: "/ClientApp/brandProfiles/lookup?type=EMAILTEMPLATE",
      BRANDING_PROFILES: "/ClientApp/brandProfiles/lookup?type=BRANDPROFILE",
    },
    migrations: {
      CUSTOMER_MANAGEMENT: "/ClientApp/customer/experience/migrate",
      TRIP_PLANNING: "/ClientApp/clientpropertiesprofile/migrate",
    },
  },

  systemPreferences : {
    form :{
      getDefaultProperties: "/ClientApp/client/properties/default/system",
      get_client_settings_form: "/ClientApp/client/clientpropety",
      structure:
        "/LoginApp/framework/structure?modelName=SYSTEM_PREFERENCES&pageName=SYSTEM_PREFERENCES&sectionName=SYSTEM_PREFERENCES",
      saveOrUpdate: "/ClientApp/client/properties",
      getDetails: "/ClientApp/client/list/update",
    }
  },

  organizationRole: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=ORGANIZATIONROLE&pageName=ORGANIZATIONROLE&sectionName=ORGANIZATIONROLE_LIST_VIEW",
      createRole: "/UserAccessApp/org/role/create",
      getRoleData: "/UserAccessApp/org/role/get",
      accessProfileIds: "/UserAccessApp/access/profile/list",
      data: "/UserAccessApp/org/role/list",
      cloneRole: "/UserAccessApp/org/role/clone",
      deleteRole: "/UserAccessApp/org/role/delete?orgRoleId=",
      toggleRoleStatus: "/UserAccessApp/org/role/status",
      toggleFavouriteStatus: "/UserAccessApp/org/role/favorite?userGroupId=",
      orgRoleLandingPage: "/ClientApp/client/getByTypeAndId?type=LANDINGPAGE_",
      persona: "/ClientApp/client/getByTypeAndId?type=PERSONA",
      accessProfileStructure:
        "/LoginApp/framework/structure?modelName=ACCESSPROFILE&pageName=ACCESSPROFILE&sectionName=ACCESSPROFILE_LIST_VIEW",
      getUserCountData: "/UserAccessApp/user/v2/list",
      userCountStructure:
        "/LoginApp/framework/structure?modelName=USER&pageName=USERMANAGEMENT&sectionName=USERMANAGEMENT_LIST_VIEW_POPUP",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?pageName=ORGANIZATIONROLE&sectionName=ADD_ORGANIZATIONROLE_FORM&modelName=ORGANIZATIONROLE",
      create: "/UserAccessApp/org/role/create",
      getRoleData: "/UserAccessApp/org/role/get",
      update: "/UserAccessApp/org/role/update",
      accessProfileIds: "/UserAccessApp/access/profile/list",
    },
  },
  userManagement: {
    listView: {
      getTimezoneList: "/CommonApp/timezone/list",
      getListData: "/UserAccessApp/user/v2/list",
      changePassword: "/LoginApp/login/password/change",
      accessProfileIds: "/UserAccessApp/access/profile/list/name",
      persona: "/ClientApp/client/getByTypeAndId?type=PERSONA",
      toggleProfileActive: "/UserAccessApp/user/v2/state",
      deleteUser: "/UserAccessApp/user/delete",
      structure:
        "/LoginApp/framework/structure?modelName=USER&pageName=USERMANAGEMENT&sectionName=USERMANAGEMENT_LIST_VIEW",
      handOver: "/ClientApp/saas/user/handover",
      downloadUserReport: "/ReportingApp/user/list/download",
      downloadLoginLogoutReport: "/ReportingApp/user/audit/download",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?pageName=USERMANAGEMENT&sectionName=ADD_USERMANAGEMENT_FORM&modelName=USER",
      create: "/UserAccessApp/user/create",
      getUser: "/UserAccessApp/user/get",
      update: "/UserAccessApp/user/update",
      users: "/UserAccessApp/user/list?userGroupId=",
    },
  },
  itemConfiguration: {
    listView: {
      getListData: "/ClientApp/client/item/list",
      itemListExcelDownload: "/ClientApp/client/item/download",
      delete: "/ClientApp/client/item/delete",
      structure:
        "/LoginApp/framework/structure?modelName=ITEM_MASTER&pageName=ITEM_MASTER&sectionName=ITEM_MASTER_LISTVIEW",
      update: "ClientApp/client/item/update",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?pageName=ITEM_MASTER&sectionName=ADD_ITEM_MASTER_FORM&modelName=ITEM_MASTER",
      create: "/ClientApp/client/item/create",
      getItem: "/ClientApp/client/item/detail",
      update: "/ClientApp/client/item/update",
    },
  },

  settingScreen: {
    mobileRoles: {
      listview: {
        structure:
          "/LoginApp/framework/structure?modelName=MOBILEROLE&pageName=MOBILEROLE&sectionName=MOBILEROLE_LIST_VIEW",
        data: "/UserAccessApp/org/role/list?roleType=MOBILE",
        delete: "/UserAccessApp/org/role/delete",
        clone: "/UserAccessApp/org/role/clone?roleType=MOBILE",
        status: "/UserAccessApp/org/role/status",
        getMobileRoleById: "/UserAccessApp/org/role/get?roleType=MOBILE",
        mobileUsersListView: {
          data: "/UserAccessApp/user/v2/list?roleType=MOBILE",
          structure:
            "/LoginApp/framework/structure?modelName=MOBILEUSERMANAGEMENT&pageName=MOBILEUSERMANAGEMENT&sectionName=MOBILEUSERMANAGEMENT_LIST_VIEW",
        },
      },
      form: {
        structure:
          "/LoginApp/framework/structure?modelName=MOBILEROLE&pageName=MOBILEROLE&sectionName=ADD_MOBILEROLE_FORM",
        create: "/UserAccessApp/org/role/create?roleType=MOBILE",
        update: "/UserAccessApp/org/role/update?roleType=MOBILE",
        accessProfiles:
          "/UserAccessApp/access/profile/list/name?accessProfileType=MOBILE",
      },
    },
    mobileTemplates: {
      listview: {
        structure:
          "/LoginApp/framework/structure?modelName=MOBILE_ACCESSPROFILELEROLE&pageName=MOBILE_ACCESSPROFILE&sectionName=MOBILE_ACCESSPROFILE_LIST_VIEW",
        data: "/UserAccessApp/access/profile/list?accessProfileType=MOBILE",
        status: "/UserAccessApp/access/profile/status",
        delete: "/UserAccessApp/access/profile/delete",
        clone: "/UserAccessApp/access/profile/clone",
        getMobileTemplateById: "/UserAccessApp/access/profile/get",
        mobileRolesListView: {
          data: "/UserAccessApp/org/role/list?roleType=MOBILE",
          structure:
            "/LoginApp/framework/structure?modelName=MOBILEROLE&pageName=MOBILEROLE&sectionName=MOBILEROLE_LIST_VIEW",
        },
      },
      form: {
        structure:
          "LoginApp/framework/structure?modelName=MOBILE_ACCESSPROFILELEROLE&pageName=MOBILE_ACCESSPROFILE&sectionName=ADD_MOBILE_ACCESSPROFILE_FORM",
        accordian:
          "/UserAccessApp/access/profile/mobile/accessprofile/structure",
        create: "/UserAccessApp/access/profile/create",
        update: "/UserAccessApp/access/profile/update",
      },
      dynamicOrder: {
        masterStructure: {
          NEW_ORDER:
            "/LoginApp/framework/getDynamicCardStructure?pageName=MOBILE_ORDERS_TEMPLATE&sectionName=MOBILE_NEW_ORDER_MASTER&structureType=MASTER",
          CURRENT_ORDER:
            "/LoginApp/framework/getDynamicCardStructure?pageName=MOBILE_ORDERS_TEMPLATE&sectionName=MOBILE_CURRENT_ORDER_MASTER&structureType=MASTER",
          COMPLETED:
            "/LoginApp/framework/getDynamicCardStructure?pageName=MOBILE_ORDERS_TEMPLATE&sectionName=MOBILE_COMPLETE_ORDER_MASTER&structureType=MASTER",
          address:
            "/LoginApp/framework/address/structure?modelName=ORDERS&pageName=ORDERS&sectionName=ADD_ORDER_FORM",
        },
        dynamicStructure: {
          NEW_ORDER:
            "/LoginApp/framework/getDynamicCardStructure?pageName=MOBILE_ORDERS_TEMPLATE&sectionName=MOBILE_NEW_ORDER_LIST",
          CURRENT_ORDER:
            "/LoginApp/framework/getDynamicCardStructure?pageName=MOBILE_ORDERS_TEMPLATE&sectionName=MOBILE_CURRENT_ORDER_LIST",
          COMPLETED:
            "/LoginApp/framework/getDynamicCardStructure?pageName=MOBILE_ORDERS_TEMPLATE&sectionName=MOBILE_COMPLETE_ORDER_LIST",
        },
      },
    },
    form: {
      structure:
        "/LoginApp/framework/structure?pageName=ORGANIZATIONROLE&sectionName=ADD_ORGANIZATIONROLE_FORM&modelName=ORGANIZATIONROLE",
      create: "/UserAccessApp/org/role/create",
      getRoleData: "/UserAccessApp/org/role/get",
      update: "/UserAccessApp/org/role/update",
      accessProfileIds: "/UserAccessApp/access/profile/list",
    },
    organizationProfileForm: {
      structure:
        "/LoginApp/framework/structure?modelName=CLIENT&pageName=CLIENT&sectionName=ADD_CLIENT_FORM_V2",
    },
  },
  rateProfile: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=RATEPROFILE&pageName=RATEPROFILE&sectionName=RATEPROFILE_LIST_VIEW",
      carrierStructure:
        "/LoginApp/framework/structure?modelName=RATEPROFILE&pageName=RATEPROFILE&sectionName=CARRIER_RATEPROFILE_LIST_VIEW",
      data: "/ClientApp/rateprofile/list",
      update: "/ClientApp/rateprofile/active",
    },
    form: {
      create: "/ClientApp/rateprofile/create",
      update: "/ClientApp/rateprofile/update",
      structure:
        "/LoginApp/framework/structure?modelName=RATEPROFILE&pageName=RATEPROFILE&sectionName=ADD_RATEPROFILE_FORM",
      basicRateProfileComponentStructures:
        "/LoginApp/framework/structure?modelName=RATEPROFILEELEMENTS&pageName=RATEPROFILEELEMENTS&sectionName=ADD_RATEPROFILEELEMENTS_FORM",
      getRateProfile: "/ClientApp/rateprofile/getbyid",
      systemMetric:
        "/ClientApp/client/clientpropety?modelType=FMLM&propertyType=system+property",
    },
  },
  accessProfile: {
    listView: {
      structure:
        "LoginApp/framework/structure?modelName=ACCESSPROFILE&pageName=ACCESSPROFILE&sectionName=ACCESSPROFILE_LIST_VIEW",
      data: "/UserAccessApp/access/profile/list",
      delete: "/UserAccessApp/access/profile/delete",
      clone: "/UserAccessApp/access/profile/clone",
      organizationDetails: "/UserAccessApp/org/role/list",
      orgRoleStructure:
        "/LoginApp/framework/structure?modelName=ORGANIZATIONROLE&pageName=ORGANIZATIONROLE&sectionName=ORGANIZATIONROLE_LIST_VIEW_POPUP",
      active: "/UserAccessApp/access/profile/status",
    },
    form: {
      structure: "/LoginApp/framework/accessprofile/structure/get",
      create: "/UserAccessApp/access/profile/create",
      getAccessProfileData:
        "/UserAccessApp/access/profile/get?accessProfileId=",
      update: "/UserAccessApp/access/profile/update",
      checkAdminProfile:
        "/UserAccessApp/access/profile/checkAdminProfile?accessProfileId=",
    },
  },
  adminDashboard: {
    tabData: "/ReportingApp/internalUser/analytics/clientMetaData",
    getClientDetailsForPendo: "/ClientApp/client/getClientMetadata",
    regionsList: "/ReportingApp/internalUser/analytics/region",
    regionsCount: "/ReportingApp/internalUser/analytics/totalClientCount",
    clientDetails: {
      structure:
        "/LoginApp/framework/structure?modelName=CLIENTMETRICS&pageName=CLIENTMETRICS&sectionName=CLIENT_DETAIL_LIST_VIEW",
      data: "/ClientApp/client/monitoring/details?moduleKey=",
      cardSummaryDetails:
        "/ReportingApp/internalUser/analytics/cardSummaryDetails",
      offboard: "/ClientApp/saas/client/offBoard",
    },
    clintActivity: {
      structure:
        "/LoginApp/framework/structure?modelName=CLIENTMETRICS&pageName=CLIENTMETRICS&sectionName=CLIENT_ACTIVITY_LIST_VIEW",
      data: "/ClientApp/client/monitoring/activity",
    },
    pendingAction: {
      structure:
        "/LoginApp/framework/structure?modelName=SAASMETRICS&pageName=SAAS&sectionName=PENDING_ACTIVATION_LIST_VIEW",
      data: "/ClientApp/saas/client/list",
      sendActivationLink: "/ClientApp/saas/client/resend/activation/link",
      update: "/ClientApp/saas/user/signup/update",
    },
    changeModelType: {
      structure:
        "/LoginApp/framework/structure?modelName=CLIENTMETRICS&pageName=CLIENTMETRICS&sectionName=CHANGEMODELTYPE",
      update: "/ClientApp/modeltype/conversion/convert",
    },
  },
  awbLabelConfiguration: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=AWB_LABEL_CONFIGURATION&pageName=AWB_LABEL_CONFIGURATION&sectionName=AWB_LABEL_CONFIGURATION_LIST_VIEW",
      data: "/ClientApp/awbLabelConfiguration/list",
      activationRequest: "/ClientApp/awbLabelConfiguration/active",
      setFavourite:
        "/ClientApp/awbLabelConfiguration/markAsFavourite?awbTemplateId=",
      getAwbTemplateDetails: "/ClientApp/awbLabelConfiguration/getById",
      saveAwbTemplate: "/ClientApp/awbLabelConfiguration/create",
      updateAwbTemplate: "/ClientApp/awbLabelConfiguration/update",
      dynamicTags:
        "/LoginApp/framework/dynamicTags/structure?configType=AWB_LABEL_CONFIGURATION",
      getDefaultConfiguration:
        "/ClientApp/awbLabelConfiguration/defaultConfigurations",
      getPropertyType: "/ClientApp/client/property?propertyKey=CRATESTRUCTURE",
    },
  },
  manifestLabelConfiguration: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=MANIFEST_LABEL_CONFIGURATION&pageName=MANIFEST_LABEL_CONFIGURATION&sectionName=MANIFEST_LABEL_CONFIGURATION_LIST_VIEW",
      data: "/ClientApp/client/dynamicHtmlTemplate/list?type=MANIFESTLABEL",
      activationRequest: "ClientApp/client/dynamicHtmlTemplate/active",
      setFavourite: "ClientApp/client/dynamicHtmlTemplate/markAsFavourite",
      getAwbTemplateDetails: "/ClientApp/client/dynamicHtmlTemplate/getById",
      saveAwbTemplate: "/ClientApp/client/dynamicHtmlTemplate/create",
      updateAwbTemplate: "/ClientApp/client/dynamicHtmlTemplate/update",
      dynamicTags:
        "/LoginApp/framework/dynamicTags/structure?configType=MANIFEST_LABEL_CONFIGURATION",
      getDefaultConfiguration:
        "/ClientApp/client/dynamicHtmlTemplate/defaultConfigurations?type=MANIFESTLABEL",
      getPropertyType: "/ClientApp/client/property?propertyKey=CRATESTRUCTURE",
    },
  },
  manifestTemplateConfiguration: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=MANIFEST_LABEL_CONFIGURATION&pageName=MANIFEST_LABEL_CONFIGURATION&sectionName=MANIFEST_LABEL_CONFIGURATION_LIST_VIEW",
      data: "/ClientApp/client/dynamicHtmlTemplate/list?type=MANIFEST_TEMPLATE",
      activationRequest: "ClientApp/client/dynamicHtmlTemplate/active",
      setFavourite: "ClientApp/client/dynamicHtmlTemplate/markAsFavourite",
      getAwbTemplateDetails: "/ClientApp/client/dynamicHtmlTemplate/getById",
      saveAwbTemplate: "/ClientApp/client/dynamicHtmlTemplate/create",
      updateAwbTemplate: "/ClientApp/client/dynamicHtmlTemplate/update",
      dynamicTags:
        "/LoginApp/framework/dynamicTags/structure?configType=MANIFEST_CONFIGURATION",
      getDefaultConfiguration:
        "/ClientApp/client/dynamicHtmlTemplate/defaultConfigurations?type=MANIFEST_TEMPLATE",
      getPropertyType: "/ClientApp/client/property?propertyKey=CRATESTRUCTURE",
    },
  },
  ticktingTool: {
    listview: {
      structure: "/LoginApp/framework/structure",
      getData: "/ThirdPartyPlugins/ticketing/issue/getList",
      getPeers: "/ThirdPartyPlugins/ticketing/user/peers",
      getStatus: "/ThirdPartyPlugins/ticketing/issue/statuses",
      downloadReport: "/ReportingApp/ticketing/issue/report",
    },
    detailView: {
      getdata: "/ThirdPartyPlugins/ticketing/issue/getIssue?issueId=",
    },
  },
  exceptionHandling: {
    form: {
      structure:
        "/LoginApp/framework/structure?modelName=EXCEPTION&pageName=EXCEPTION&sectionName=ADD_EXCEPTION_FORM",
      events: "/ClientApp/exception/events/list",
      create: "/ClientApp/exception/create",
      update: "/ClientApp/exception/update",
      getById: "/ClientApp/exception/getById",
      authenticateApi:
        "/ThirdPartyPlugins/ticketing/user/authenticate?userName=",
    },
    listview: {
      allExceptions: {
        structure:
          "/LoginApp/framework/structure?modelName=EXCEPTION&pageName=EXCEPTION&sectionName=ALL_EXCEPTION_LIST_VIEW",
        data: "/ClientApp/exception/list",
        delete: "/ClientApp/exception/delete",
        active: "/ClientApp/exception/active",
        download: "/ReportingApp/exception/allexception/download",
      },
      raisedExceptions: {
        orders: {
          structure:
            "/LoginApp/framework/structure?modelName=RAISED_EXCEPTIONS&pageName=RAISED_EXCEPTIONS&sectionName=ALL_ORDERS_RAISED_EXCEPTIONS_LIST_VIEW",
          data: "/ShipmentApp/exception/raised/list",
          ordersExceptionList: "/ClientApp/exception/manual/list?module=Orders",
        },
        manifests: {
          structure:
            "/LoginApp/framework/structure?modelName=RAISED_EXCEPTIONS&pageName=RAISED_EXCEPTIONS&sectionName=ALL_MANIFESTS_RAISED_EXCEPTIONS_LIST_VIEW",
          data: "/ShipmentApp/exception/raised/list",
          manifestExceptionList:
            "/ClientApp/exception/manual/list?module=Manifests",
        },
        resolveReject: "/ShipmentApp/exception/raised/status/update",
        download: "/ReportingApp/exception/raised/download",
        saveRaiseException: "/ShipmentApp/exception/raise",
      },
    },
    lookup: {
      exceptionStatus: "/ClientApp/client/getByTypeAndId?type=EXCEPTION_STATUS",
    },
  },
  tripPlanningScheduler: {
    form: {
      general:
        "/LoginApp/framework/structure?pageName=TRIP_PLANNING_SCHEDULER&sectionName=SCHEDULED_TRIP_PLANNNIG_ADD_GENERAL_DETAILS&modelName=SCHEDULED_TRIP_PLANNNIG_ADD_GENERAL_DETAILS",
      orders:
        "/LoginApp/framework/structure?pageName=TRIP_PLANNING_SCHEDULER&sectionName=SCHEDULED_TRIP_PLANNNIG_ADD_ORDER_DETAILS&modelName=SCHEDULED_TRIP_PLANNNIG_ADD_ORDER_DETAILS",
      getOutsourcedFleetsStructure:
        "/LoginApp/framework/structure?modelName=OUTSOURCED_FLEET&pageName=OUTSOURCED_FLEET&sectionName=OUTSOURCED_FLEET_LIST_VIEW",
      getOutsourcedFleetsData: "/ClientApp/contract/fleet/all",
      getOwnedFleetsStructure:
        "/LoginApp/framework/structure?modelName=PLANNING&pageName=PLANNING&sectionName=DM_PLANNING_MAP_VIEW",
      getOwnedFleetsData: "/DeliveryMediumApp/deliverymedium/fmlm/algo",
      isValidSchedulerName: "/TripApp/planning/duplicate/schedulername?name=",
      getOrderListStructure:
        "/LoginApp/framework/structure?modelName=PLANNING&pageName=PLANNING&sectionName=PLANNING_LIST_VIEW",
      schedule: "/TripApp/planning/schedule",
      getSchedulerDetails:
        "/TripApp/planning/scheduler/get?schedulerDetailsId=",
    },
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=SCHEDULED_TRIP_PLANNNIG_ADD_GENERAL_DETAILS&pageName=TRIP_PLANNING_SCHEDULER&sectionName=TRIP_PLANNING_SCHEDULER_LIST_VIEW",
      data: "/TripApp/planning/scheduler/list",
      deleteScheduler: "/TripApp/planning/scheduler/delete",
      deactivateScheduler: "/TripApp/planning/scheduler/deactivate?deactivate=",
    },
  },
  manifestConfiguration: {
    getManifestTypes: "/ClientApp/client/ref?type=MILEMANIFESTTYPE",
    saveManifestTypes: "/ClientApp/client/ref/save?type=MILEMANIFESTTYPE",
    getManifestFormula: "/ShipmentApp/shipment/scan/manifest/formula/get",
    saveManifestFormula: "/ShipmentApp/shipment/scan/manifest/formula/save",
  },
  serviceTypeConfiguration: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=SERVICE_TYPE_MASTER&pageName=SERVICE_TYPE_MASTER&sectionName=SERVICE_TYPE_MASTER_LIST_VIEW",
      getAllServiceTypes: "/ClientApp/serviceTypeMaster/list",
      activateDeactivateServiceType:
        "/ClientApp/serviceTypeMaster/update/status?serviceTypeDetailsId=",
      deleteServiceType: "/ClientApp/serviceTypeMaster/delete?",
      downloadReport: "/ReportingApp/serviceTypeMaster/list/download",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?modelName=SERVICE_TYPE_MASTER&pageName=SERVICE_TYPE_MASTER&sectionName=ADD_SERVICE_TYPE_MASTER_FORM",
      addServiceType: "/ClientApp/serviceTypeMaster/create",
      getServiceTypeById: "/ClientApp/serviceTypeMaster/getById",
      updateServiceType: "/ClientApp/serviceTypeMaster/update",
    },
  },
  orderLifeCycleManagement: {
    getAndSave: "ClientApp/client/properties",
  },
  compartmentConfiguration: {
    listView: {
      structure:
        "/LoginApp/framework/structure?pageName=COMPARTMENT_CONFIGURATIONS&modelName=COMPARTMENT_CONFIGURATIONS&sectionName=COMPARTMENT_CONFIGURATIONS_LIST_VIEW",
      getAllCompartments: "/VehicleApp/compartment/list",
      deleteCompartment: "/VehicleApp/compartment/delete",
    },
    form: {
      structure:
        "/LoginApp/framework/structure?pageName=COMPARTMENT_CONFIGURATIONS&modelName=COMPARTMENT_CONFIGURATIONS&sectionName=COMPARTMENT_CONFIGURATIONS_ADD_FORM",
      addCompartment: "/VehicleApp/compartment/create",
      getCompartmentById: "/VehicleApp/compartment/getById",
      updateCompartment: "/VehicleApp/compartment/update",
    },
    listPopup: {
      structure:
        "/LoginApp/framework/structure?pageName=COMPARTMENT_FLEET_MAPPING_CONFIGURATION&modelName=COMPARTMENT_FLEET_MAPPING_CONFIGURATION&sectionName=COMPARTMENT_FLEET_MAPPING_LIST_VIEW",
      getCompartmentListData: "/VehicleApp/compartment/fleet/mapping/list?",
    },
  },
  Saas: {
    invoiceList: "/ClientApp/saas/client/invoices",
    uiConfig: "/LoginApp/framework/ui/config",
    currentPlan: "/ClientApp/saas/client/subscription/data",
    addonList: "/ClientApp/zoho/getAddons",
    billingcycleDA: "ClientApp/zoho/defaultPlans",
    billingcycle: "ClientApp/zoho/defaultPlans",
    invoiceDownload: "/ClientApp/zoho/download/invoice",
    paymentLink: "ClientApp/zoho/paymentLink/invoice",
    putSubscription: "/ClientApp/saas/client/subscription",
    trialToPaid: "/ClientApp/zoho/create/hosted/payment/page",
    clientUsage: "ClientApp/zoho/clientusage/data",
  },
  drsTemplateConfiguration: {
    listView: {
      structure:
        "/LoginApp/framework/structure?modelName=DRS_TEMPLATE_CONFIGURATION&pageName=DRS_TEMPLATE_CONFIGURATION&sectionName=DRS_TEMPLATE_CONFIGURATION_LIST_VIEW",
      activationRequest: "ClientApp/client/dynamicHtmlTemplate/active",
      setFavourite: "ClientApp/client/dynamicHtmlTemplate/markAsFavourite",
      saveDrsTemplate: "/ClientApp/client/dynamicHtmlTemplate/create",
      updateAwbTemplate: "/ClientApp/client/dynamicHtmlTemplate/update",
      data: "/ClientApp/client/dynamicHtmlTemplate/list?type=DRS_TEMPLATE",
      getDrsTemplateDetails: "/ClientApp/client/dynamicHtmlTemplate/getById",
      getDrsHTMLTemplates:
        "/ShipmentApp/shipment/scan/dynamicHtmlTemplates?type=DRS_TEMPLATE&isFavourite=false",
      dynamicTags:
        "/LoginApp/framework/dynamicTags/structure?configType=DRS_TEMPLATE_CONFIGURATION",
      getDefaultConfiguration:
        "/ClientApp/client/dynamicHtmlTemplate/defaultConfigurations?type=DRS_TEMPLATE",
    },
  },
  consent :{
    form: {
      structure: "/LoginApp/framework/structure?pageName=CONSENT_CONFIGURATION&sectionName=CONSENT_CONFIGURATION_ADD_FORM&modelName=CONSENT_CONFIGURATION",
      submitConsent : "/ClientApp/consent/configuration/create",
      publishConsent :"/ClientApp/consent/configuration/saveandpublish",
      updateform:"ClientApp/consent/configuration/update"
    },
    list:{
      structure: "/LoginApp/framework/structure?pageName=CONSENT_CONFIGURATION&sectionName=CONSENT_CONFIGURATION_LIST_VIEW&modelName=CONSENT_CONFIGURATION",
      list:"/ClientApp/consent/configuration/list",
      delete:"/ClientApp/consent/configuration/delete ",
      update:"ClientApp/consent/configuration/getById",
      
    },
    management :{
      mainlist: "/ClientApp/consenttype/list?mode=DETAILS",
      deleteConsent: "/ClientApp/consenttype/delete?id=",
      getTriggedFields: "/ClientApp/consenttype/triggerfields?module=",
      createConsent: "/ClientApp/consenttype/create",
      updateConsent:"/ClientApp/consenttype/update",
      nameCheck: "/ClientApp/consenttype/nameexistcheck?name=",
    }
  },

  tracker: {
    trackerConfiguration: {
      listView: {
        structure:
          "/LoginApp/framework/structure?pageName=TRACKER_CONFIGURATIONS&modelName=TRACKER_CONFIGURATIONS&sectionName=TRACKER_CONFIGURATIONS_LIST_VIEW",
        getAllTrackers: "/DeviceApp/tracker/config/list",
        deleteTracker: "/DeviceApp/tracker/config/delete",
        activateDeactivate: "/DeviceApp/tracker/config/active?trackerConfigId=",
      },
      form: {
        structure:
          "/LoginApp/framework/structure?pageName=TRACKER_CONFIGURATIONS&modelName=TRACKER_CONFIGURATIONS&sectionName=TRACKER_CONFIGURATIONS_ADD_FORM",
        addTracker: "/DeviceApp/tracker/config/create",
        getTrackerById: "/DeviceApp/tracker/config/getById",
        updateTracker: "/DeviceApp/tracker/config/update",
      },
    },
    trackers: {
      listView: {
        structure:
          "/LoginApp/framework/structure?pageName=TRACKER&modelName=TRACKER&sectionName=",
        getAllTrackers: "/DeviceApp/device/master/get?deviceId=",
        deleteTracker: "/DeviceApp/device/master/delete",
        activateDeactivate: "/DeviceApp/device/master/active?",
        trackersDownloadExcel: "/ReportingApp/device/list/download",
      },
      form: {
        structure:
          "/LoginApp/framework/structure?pageName=TRACKER&modelName=TRACKER&sectionName=ADD_TRACKER_FORM",
        addTracker: "/DeviceApp/device/master/create",
        getDeviceById: "/DeviceApp/device/master/getById",
        updateDevice: "/DeviceApp/device/master/update",
      },
    },
    trackerManagement: {
      form: {
        trackerTypeListStructure:
          "/LoginApp/framework/structure?modelName=TRACKER_MANAGEMENT%20&pageName=TRACKER_MANAGEMENT&sectionName=TRACKER_TYPE_LIST_VIEW",
        supplierListStructure:
          "LoginApp/framework/structure?modelName=TRACKER_MANAGEMENT%20&pageName=TRACKER_MANAGEMENT&sectionName=SUPPLIER_LIST_VIEW",
        saveTrackerType: "/ClientApp/client/ref/save?type=TRACKER_TYPE",
        saveSupplier: "/ClientApp/client/ref/save?type=TRACKER_SUPPLIER",
      },
    },
  },
  usageAnalytics: {
    getThreshold: "/ClientApp/usage/data/getThreshold",
    updateThreshold: "/ClientApp/usage/data/updateThreshold",
    subscriptionOptions: "/ClientApp/superClient/subscriptionClientMapping",
    clientOptions: "/ClientApp/superClient/hierarchy",
    cardData: "/ClientApp/usage/data/currentUsageByTypes",
    getActivityData: "/ShipmentApp/usage/get", // Graph API
  },

  checkpoints: {
    listView: {
      structure: "/LoginApp/framework/structure?modelName=CHECKPOINTS&pageName=CHECKPOINTS&sectionName=CHECKPOINTS_LIST_VIEW",
      mapViewStructure: "/LoginApp/framework/structure?modelName=CHECKPOINTS&pageName=CHECKPOINTS&sectionName=CHECKPOINTS_MAP_VIEW",
      data: "/GeofenceApp/checkpoint/list",
      getRoutesData :'/ClientApp/middleMile/getRoutes',
      activationRequest: '/GeofenceApp/checkpoint/active',
      deleteRequest: '/GeofenceApp/checkpoint/delete',
      associatedRoute : "/ClientApp/route/checkpoint/getRoutesMappedWithCheckpoint?checkpointId=",
      downloadReport : "/ReportingApp/checkpoint/list/download"
    },
    form:{
      structure: "/LoginApp/framework/structure?modelName=CHECKPOINT&pageName=CHECKPOINT&sectionName=ADD_CHECKPOINT_FORM",
      createCheckpoint: "/GeofenceApp/checkpoint/create",
      getCheckpointData :'/GeofenceApp/checkpoint/getById?checkpointId=',
      updateCheckpoint :'/GeofenceApp/checkpoint/update'
    },
    routeMiddleMile: {
      addRouteForwardFormJSON: "/LoginApp/framework/structure?modelName=ROUTE_MIDDLE_MILE&pageName=ROUTE_MIDDLE_MILE&sectionName=ROUTE_FORM_FORWARD",
      addRouteReturnFormJSON: "/LoginApp/framework/structure?modelName=ROUTE_MIDDLE_MILE&pageName=ROUTE_MIDDLE_MILE&sectionName=ROUTE_FORM_RETURN",
      addRouteFormChildJSON: "/LoginApp/framework/structure?modelName=ROUTE_MIDDLE_MILE&pageName=ROUTE_MIDDLE_MILE&sectionName=ROUTE_FORM_CHILD",
      getDetail: "/ClientApp/middleMile/route/details"
    },
    alertForm:{
      structure: "/LoginApp/framework/structure?modelName=CHECKPOINT_ALERT_MODAL&pageName=CHECKPOINT_ALERT_MODAL&sectionName=CHECKPOINT_ALERT_MODAL_FORM",

    },
    checkpointsMappedToRoutes: {
      structure: "/LoginApp/framework/structure?modelName=ALL_ROUTES&pageName=ALL_ROUTES&sectionName=CHECKPOINTS_LIST_VIEW",
      data:"/GeofenceApp/checkpoint/list",
      checkpointCodes: "/GeofenceApp/checkpoint/get/all",
      getMappedCheckpoint: "/ClientApp/route/checkpoint/getCheckpointsMappedtoRoute",
      delinkCheckpoint: "/ClientApp/route/checkpoint/deleteByMappingId?routeCheckpointMappingId=",
      addCheckpoint: "/ClientApp/route/checkpoint/mapping/create"
    }
  },
  Breachportal: {
    listview: {
      structure: '/LoginApp/framework/structure',
      downloadReport: '/ReportingApp/breachportal/download/report',
      getData : '/ThirdPartyPlugins/ticketing/tool/getList',
    },
  },
  consentStatusReport :{
    form:{
        structure: "/LoginApp/framework/structure?pageName=CONSENT_STATUS_REPORT&modelName=CONSENT_STATUS_REPORT&sectionName=CONSENT_STATUS_REPORT_FORM",
  
    },
    list:{
      structure: "/LoginApp/framework/structure?pageName=CONSENT_STATUS_REPORT&modelName=CONSENT_STATUS_REPORT&sectionName=CONSENT_STATUS_REPORT_LIST_VIEW",

    },
    downloadReport:"/ReportingApp/consent/consentStatus/report/download",
    viewReport:"/ReportingApp/consent/consentStatus/report/view",
    sendEmail :"/ReportingApp/consent/consentStatus/report/sendAsEmail"
  },

  consentDetailedReport :{
    form:{
      structure: "/LoginApp/framework/structure?pageName=CONSENT_DETAILED_REPORT&modelName=CONSENT_DETAILED_REPORT&sectionName=CONSENT_DETAILED_REPORT_FORM",
    },
    list:{
      structure: "/LoginApp/framework/structure?pageName=CONSENT_DETAILED_REPORT&modelName=CONSENT_DETAILED_REPORT&sectionName=CONSENT_DETAILED_REPORT_LIST_VIEW",
      combionedStructure :"/ReportingApp/consentDetailed/getCustomForm/structure",
      updateStructure :"/ReportingApp/consentDetailed/updateCustomForm/structure"
    },
    downloadReport :'/ReportingApp/consentDetailed/report/download',
    sendEmail :'/ReportingApp/consentDetailed/report/sendAsEmail',
    viewReport :'/ReportingApp/consentDetailed/report/view'
  },
  deviationReports: {
    filters: "/LoginApp/framework/structure?pageName=DEVIATION_REPORTS&modelName=MIDDLEMILE&sectionName=DEVIATION_REPORTS_FILTERS",
    list: {
      structure: "/LoginApp/framework/structure?pageName=${pageName}&modelName=${pageName}&sectionName=${sectionName}",
      data: "/ReportingApp/${reportType}/view"
    },
    sendEmail: "/ReportingApp/${reportType}/sendAsEmail",
    downloadReport: "/ReportingApp/${reportType}/download"
  },
  vehicleReports: {
    filters: "/LoginApp/framework/structure?pageName=VEHICLE_REPORTS&modelName=VEHICLE_REPORTS&sectionName=VEHICLE_REPORT_FILTERS",
  }
};
 
// export type tApiMappings = ReturnType<typeof apiMappings>
export default apiMappings;
