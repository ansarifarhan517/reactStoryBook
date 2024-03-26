import React, { useEffect, Dispatch, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  Box,
  getDefaultTheme,
  withPopup,
  withToastProvider,
  BreadCrumb,
  useToast,
  Modal,
  ModalHeader
} from "ui-library";
import moment from "moment";
import FileSaver from 'file-saver';
import { DriverComplianceAnalyticsActions } from "./DriverComplianceAnalytics.actions";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import withRedux from "../../../../utils/redux/withRedux";
import axios from "../../../../utils/axios";
import apiMappings from "../../../../utils/apiMapping";
import { withThemeProvider } from "../../../../utils/theme";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { hybridRouteTo } from "../../../../utils/hybridRouting";
import styled from "styled-components";
import AverageTotalCompliance from "./AverageTotalCompliance/AverageTotalCompiance";
import TotalBranches from "./TotalBranches/TotalBranches";
import TotalOrders from "./TotalOrders/TotalOrders";
import ComplianceFilters from "./ComplianceFilters/ComplianceFilters";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { colorCodes } from "../../colorCodes";
import "./DriverComplianceAnalytics.css";

const theme = getDefaultTheme();
theme.typography.fontFamily = "inherit";

export interface ISelectedKpis {
  clientId: number;
  clientRefMasterCd: string;
  clientRefMasterDesc: string;
  clientRefMasterId: string;
  clientRefMasterType: string;
  id: number;
  isDeleteFl: string;
  label: string;
  name: string;
  value: string;
}

export interface IListViewParams {
  searchAfter: string | null
  searchBy?: string
  searchText?: string | number
  size: number
}
export interface IBranchData {
  alreadyOfferedCnt: number
  clientBranchId: number
  clientId: number
  emailAddress: string
  mobileNumber: string
  lng: number
  lat: number
  isActiveFl: boolean
  name: string
}
const DriverComplianceAnalytics = () => {

  const toast = useToast();

  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.driverComplianceAnalytics);

  // react hooks
  const dispatch = useDispatch<Dispatch<DriverComplianceAnalyticsActions>>();

  const pageLabels = useTypedSelector(state => state.pageLabels.driverCompliance);

  const isLoading = useTypedSelector(
    (state) => state.analytics.driverComplianceAnalytics.loading
  );
  const kpiList = useTypedSelector(
    (state) => state.analytics.driverComplianceAnalytics.kpiList
  );
  const cardDetails = useTypedSelector(
    (state) => state.analytics.driverComplianceAnalytics.cardDetails
  );
  const overAllComplianceSummaryData = useTypedSelector(
    (state) =>
      state.analytics.driverComplianceAnalytics.overAllComplianceSummaryData
  );
  const deliveryAssociateComplianceSummaryData = useTypedSelector(
    (state) =>
      state.analytics.driverComplianceAnalytics
        .deliveryAssociateComplianceSummaryData
  );

  const totalOrdersReports = useTypedSelector(
    (state) => state.analytics.driverComplianceAnalytics.totalOrdersReports
  );

  const branchList = useTypedSelector(
    (state) => state.analytics.driverComplianceAnalytics.branchList
  );

  const skillList = useTypedSelector(
    (state) => state.analytics.driverComplianceAnalytics.skillList
  );

  const totalBranchCompliance = useTypedSelector(
    (state) =>
      state.analytics.driverComplianceAnalytics.totalBranchComplianceData
  );

  const branchDeliveryAssociateComplianceSummaryData = useTypedSelector(
    (state) =>
      state.analytics.driverComplianceAnalytics
        .branchDeliveryAssociateComplianceSummaryData
  );

  const filterData = useTypedSelector(
    (state) => state.analytics.driverComplianceAnalytics.filterData
  );

  const complianceTrendData = useTypedSelector(
    (state) => state.analytics.driverComplianceAnalytics.deliveryAssociatesComplianceTrend
  );
  const plannedRouteConfigureKPI = useTypedSelector((state) => state.analytics.driverComplianceAnalytics.plannedRouteConfigureKPI);

  kpiList.slice(0, 8);

  const [overallComplianceDiff, setOverallComplianceDiff] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("average-compliance");
  const [hideAllPopups, setHideAllPopups] = useState<boolean>(true);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [reLoadComponent, setReLoadComponent] = useState<boolean>(false)
  const [isFilterChange, setIsFilterChange] = useState<boolean>(false)

  // fetch the compliance for the previous daterange for first cad


  const getTotalComplianceDifference = async (kpiListArray: any) => {
    try {
      const startDate = moment(selectedDates.startDate);
      const endDate = moment(selectedDates.endDate);
      const duration = moment.duration(endDate.diff(startDate)).asDays();
      const {
        data: { status, data },
      } = await axios.post(apiMappings.analytics.driverCompliance.cardDetails, {
        startDate:
          selectedDates && Object.keys(selectedDates).length
          && startDate.subtract(duration, "days").format("YYYY-MM-DDT")+"00:00:00Z",
        endDate:
          selectedDates && Object.keys(selectedDates).length
          && endDate.subtract(duration, "days").format("YYYY-MM-DDT")+"23:59:59Z",
        branches: selectedBranches,
        clientId: clientId,
        kpiList: kpiListArray,
        dmType: selectedSkills,
        requestFor: "",
      });

      if (status === 200) {
        setOverallComplianceDiff(
          data.avgTotalCompliance ? data.avgTotalCompliance : 0
        );
        return;
      }
    } catch (errorMessage) {
      console.log(errorMessage);
    }

  };


  // Get Delivery associate compliance summary in Total Compliance Tab
  const getdeliveryAssociateComplianceSummary = (params: any) => {
    dispatch({
      type: "@@driverCompliance/SET_LOADING",
    });
    dispatch({
      type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY",
      payload: params,
    });
  };

  // Get Branch Delivery associate compliance summary in Total Branch Tab
  const getBranchDeliveryAssociateComplainceSummary = (payload: any) => {
    dispatch({
      type:
        "@@driverCompliance/FETCH_BRANCH_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY",
      payload: payload,
    });
  };

  // Branches for global Filters
  const branchesArray = branchList.map((branch: IBranchData) => {
    return { id: branch.clientBranchId, value: branch.name, label: branch.name };
  });
  
  const branches = branchesArray.sort((a: { value: string }, b: { value: string }) => {
    return (a.value.length) - (b.value.length);
  });
  // skills for global Filters
  const skills = skillList.map((skill: any) => {
    return { id: skill.id, value: skill.name, label: skill.name };
  });

  // filter data
  const { selectedBranches, selectedSkills, selectedDates } = filterData;

  // Client id for apis
  const clientId = JSON.parse(localStorage.getItem("userAccessInfo") || "{}")
    .clientId;

  // hook to get initila data from api - kpilist, branchlist, skillsList, device compatibility column structure

  useEffect(() => {
    const clientID = JSON.parse(localStorage.getItem("userAccessInfo") || "{}")
      .clientId;
    if (!kpiList.length) {
      dispatch({ type: "@@driverCompliance/FETCH_KPI_LIST" });
    }
    dispatch({ type: "@@driverCompliance/FETCH_BRANCH_LIST", clientID });
    dispatch({ type: "@@driverCompliance/FETCH_SKILL_LIST" });
    dispatch({ type: "@@driverCompliance/FETCH_PLANNED_ROUTE_KPI_CONFIGURATION" });
  }, []);

  
  
  // hook to fetch Cardetails and Boxplot data
  useEffect(() => {
    if (!(kpiList.length && (selectedDates && Object.keys(selectedDates).length && selectedDates.startDate && selectedDates.endDate))) {
      return;
    }
    const kpiListArray = kpiList.map(
      (kpi: { clientRefMasterCd: any }) => kpi.clientRefMasterCd
    );
    const payLoad = {
      startDate:
        selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.startDate,
      endDate:
        selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.endDate,
      branches: selectedBranches,
      clientId: clientId,
      kpiList: kpiListArray,
      dmType: selectedSkills,
    };

    const kpiListForOverallSummaryArray = kpiList.map(
      (kpi: { clientRefMasterCd: any }) => kpi.clientRefMasterCd
    );
    const overallSummaryPayLoad = {
      startDate:
        selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.startDate,
      endDate:
        selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.endDate,
      branches: selectedBranches,
      clientId: clientId,
      kpiList: kpiListForOverallSummaryArray.slice(0,8),
      dmType: selectedSkills,
    };
    dispatch({
      type: "@@driverCompliance/FETCH_CARD_DETAILS",
      payload: {
        ...payLoad,
        requestFor: "",
      },
    });
    dispatch({
      type: "@@driverCompliance/FETCH_ORDERS_CARD_DETAILS",
      payload: {
        ...payLoad,
        requestFor: "totalOrders",
      },
    });
    dispatch({
      type: "@@driverCompliance/FETCH_BRANCHES_CARD_DETAILS",
      payload: {
        ...payLoad,
        requestFor: "totalBranch",
      },
    });


    if (isFilterChange || !overAllComplianceSummaryData?.deliveryAssociateOverallComplianceSummaryDTO) {
      if(isFilterChange){
        dispatch({
          type: "@@driverCompliance/RESET_DELIVERY_ASSOCIATE_COMPLIANCE_DATA",
          payload: {},
        });
      }
      if (kpiList.length < 8) {
        setTimeout(() => {
          dispatch({
            type: "@@driverCompliance/FETCH_OVER_ALL_COMPLIANCE_SUMMARY",
            payload: {
              ...overallSummaryPayLoad,
              requestFor: "boxplot",
            },
          });
        }, 2000)
      } else {
        setTimeout(() => {
          dispatch({
            type: "@@driverCompliance/FETCH_OVER_ALL_COMPLIANCE_SUMMARY",
            payload: {
              ...payLoad,
              requestFor: "boxplot",
            },
          });
        }, 2000)
      }
      setIsFilterChange(false);
    }
    
    // const overallDACompliancePayload = {
    //   startDate:  selectedDates && Object.keys(selectedDates).length !== 0
    //   && selectedDates.startDate,
    //   endDate: selectedDates && Object.keys(selectedDates).length !== 0
    //   && selectedDates.endDate,
    //   branches: selectedBranches,
    //   clientId: clientId,
    //   kpiList: kpiListArray,
    //   dmType: selectedSkills,
    //   rangeMin: 0,
    //   rangeMax: 100
    // }

    // dispatch({
    //   type: "@@driverCompliance/FETCH_OVERALL_DELIVERY_ASSOCIATE_COMPLIANCE_SUMMARY",
    //   payload: overallDACompliancePayload,
    // });
    
    getTotalComplianceDifference(kpiListArray);

  }, [kpiList, selectedBranches, selectedSkills, selectedDates]);

  // get Trends Graph data 
  const fetchComplianceTrendData = (trendType: string, DAs: number[], KPIs: string[], interval: any) => {
    if (!DAs?.length || !KPIs?.length) {
      return;
    }
    dispatch({
      type: "@@driverCompliance/FETCH_COMPLIANCE_TREND",
      payload: {
        startDate:
          selectedDates &&
          Object.keys(selectedDates).length !== 0 &&
          selectedDates.startDate,
        endDate:
          selectedDates &&
          Object.keys(selectedDates).length !== 0 &&
          selectedDates.endDate,
        branches: selectedBranches,
        clientId: clientId,
        dmType: selectedSkills,
        kpiList: KPIs,
        deliveryAssociateIds: DAs,
        requestFor: trendType,
        interval: interval,
      },
    });
  }


  // Get data for device compatibility report
  const fetchDeviceCompatibilityReport = (fetchOptions: any) => {
    dispatch({
      type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICE_COMPATIBILITY",
      payload: {

        startDate: selectedDates && Object.keys(selectedDates).length !== 0 && selectedDates.startDate,
        endDate: selectedDates && Object.keys(selectedDates).length !== 0 && selectedDates.endDate,
        branches: selectedBranches,
        clientId: clientId,
        dmType: selectedSkills,
        requestFor: "",
        ...fetchOptions
      }
    })
  }

  // Updating Device Compatibility Reports table Preferences
  const updateDeviceCompatibilityColumnPreferences = async (columns: any) => {
    try {
      dispatch({ type: "@@driverCompliance/SET_LISTVIEW_LOADING", payload: {
        listview: 'deviceCompatibility',
        status: true
      } })
      const { data: { data, message } } = await axios.put(
        apiMappings.analytics.driverCompliance.avgTotalCompliance
        .getDeviceCompatibilityColumnStructure,
        columns
        );
        dispatch({ type: "@@driverCompliance/SET_LISTVIEW_LOADING", payload: {
          listview: 'deviceCompatibility',
          status: !data
        } })
        message && toast.add(message, 'check-round', false)
  } catch(error) {
    console.log(error, error?.response)
  }

  };


  // Get Planned route KPI configuration 
  const fetchPlannedRouteKpiConfiguration = () => {
    dispatch({ type: "@@driverCompliance/FETCH_PLANNED_ROUTE_KPI_CONFIGURATION" });
  }

  // update Planned route KPI configuration

  const updatePlannedRouteKpiConfiguration = async (payload: any) => {
    const { data } = await axios.put(apiMappings.analytics.driverCompliance.savePlannedRouteKpiConfiguration, payload);
    if (data) {
      const kpiListArray = kpiList.map(
        (kpi: { clientRefMasterCd: any }) => kpi.clientRefMasterCd
      );
      const payLoad = {
        startDate:
          selectedDates && Object.keys(selectedDates).length !== 0
          && selectedDates.startDate,
        endDate:
          selectedDates && Object.keys(selectedDates).length !== 0
          && selectedDates.endDate,
        branches: selectedBranches,
        clientId: clientId,
        kpiList: kpiListArray,
        dmType: selectedSkills,
      };


      dispatch({
        type: "@@driverCompliance/FETCH_CARD_DETAILS",
        payload: {
          ...payLoad,
          requestFor: "",
        },
      });
      dispatch({
        type: "@@driverCompliance/FETCH_ORDERS_CARD_DETAILS",
        payload: {
          ...payLoad,
          requestFor: "totalOrders",
        },
      });
      dispatch({
        type: "@@driverCompliance/FETCH_BRANCHES_CARD_DETAILS",
        payload: {
          ...payLoad,
          requestFor: "totalBranch",
        },
      });

      dispatch({
        type: "@@driverCompliance/FETCH_OVER_ALL_COMPLIANCE_SUMMARY",
        payload: {
          ...payLoad,
          requestFor: "boxplot",
        },
      });      
   
      getTotalComplianceDifference(kpiListArray);

      setReLoadComponent(true);
    } else {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  // Get data for pieCharts in Total orders Tab
  const fetchTotalOrderReports = () => {
    const params = {
      startDate:
        selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.startDate,
      endDate:
        selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.endDate,
      branches: [],
      clientId: clientId,
      dmType: selectedSkills,
    };

    dispatch({
      type: "@@driverCompliance/FETCH_TOTAL_ORDERS_COLUMN_STRUCTURE",
    });

    dispatch({
      type: "@@driverCompliance/FETCH_TOTAL_ORDERS_REPORT",
      payload: {
        ...params,
        reportCode: "ordersCompliance",
      },
    });

    dispatch({
      type: "@@driverCompliance/FETCH_CHECKIN_ORDERS_REPORT",
      payload: {
        ...params,
        reportCode: "checkInOrdersCompliance",
      },
    });

    dispatch({
      type: "@@driverCompliance/FETCH_CHECKOUT_ORDERS_REPORT",
      payload: {
        ...params,
        reportCode: "checkoutOrdersCompliance",
      },
    });

    dispatch({
      type: "@@driverCompliance/FETCH_ONTIME_DELIVERY_REPORT",
      payload: {
        ...params,
        reportCode: "onTimeDeliveryCompliance",
      },
    });

    dispatch({
      type: "@@driverCompliance/FETCH_DISTANCE_COMPLIANCE_REPORT",
      payload: {
        ...params,
        reportCode: "distanceCompliance",
      },
    });

    dispatch({
      type: "@@driverCompliance/FETCH_SERVICE_TIME_COMPLIANCE_REPORT",
      payload: {
        ...params,
        reportCode: "serviceTimeCompliance",
      },
    });
  };

  const getFilterData = (selectedKPIs: { clientRefMasterCd: any; }[]) => {
    const KPIList = selectedKPIs.map(
      (kpi: { clientRefMasterCd: any }) => kpi.clientRefMasterCd
    );
    return {
      startDate: selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.startDate,
      endDate: selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.endDate,
      branches: selectedBranches,
      kpiList: KPIList,
      clientId: clientId,
      dmType: selectedSkills,
    }
  }
  // Download Tracking Data Report

  const handleTrackingComplianceReportDownload = async (reportType: string, selectedKPIs: Array<ISelectedKpis>) => {
    const payload = {
      ...getFilterData(selectedKPIs),
      reportType: reportType,
    }
    try {
      const { data } = await axios.post(apiMappings.analytics.driverCompliance.avgTotalCompliance.downloadTrackingComplianceReport, payload, { responseType: "arraybuffer" })
      FileSaver.saveAs(new Blob([data], { type: "application/zip" }), `${dynamicLabels.Tracking}""${dynamicLabels.Compliance}""${moment().format(`DD-MM-YYYY_HH${"-"}mm`)}.zip`)
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  // Download Branch compliance report
  const handleBranchComplianceReportDownload = async (reportType: string, selectedKPIs: any) => {
    setShowInfoModal(true);
    const payload = {
      ...getFilterData(selectedKPIs),
      requestFor: "totalBranch",
      reportType: reportType,
    }
    try {
      const { data } = await axios.post(apiMappings.analytics.driverCompliance.totalBranchCompliance.downloadBranchCompliance, payload, { responseType: "arraybuffer" })
      FileSaver.saveAs(new Blob([data], { type: `application/zip` }), `${dynamicLabels.branch}""${dynamicLabels.Compliance}""${dynamicLabels.summary}""${moment().format(`DD-MM-YYYY_HH${"-"}mm`)}.zip`)
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }

  }

  // Download Order compliance report
  const handleOrderComplianceReportDownload = async (reportType: string, params: any) => {
    setShowInfoModal(true);
    const payload = {
      ...getFilterData([]),
      reportType: reportType,
      ...params
    };
    try {
      const { data } = await axios.post(apiMappings.analytics.driverCompliance.totalOrderCompliance.downloadOrderCompliance, payload, { responseType: "arraybuffer" })
      FileSaver.saveAs(new Blob([data], { type: "application/zip" }), `${dynamicLabels.order}""${dynamicLabels.Compliance}""${dynamicLabels.summary}""${moment().format(`DD-MM-YYYY_HH${"-"}mm`)}.zip`)
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  // Download Associate compliance report
  const handleAssociateComplianceDownload = async (reportType: string, selectedKPIs: any) => {
    setShowInfoModal(true);
    const payload = {
      ...getFilterData(selectedKPIs),
      requestFor: "",
      reportType: reportType
    };
    try {
      const { data } = await axios.post(apiMappings.analytics.driverCompliance.avgTotalCompliance.downloadDeliveryAssociateCompliance, payload, { responseType: "arraybuffer" })
      FileSaver.saveAs(new Blob([data], { type: "application/zip" }), `${dynamicLabels.Compliance}""${dynamicLabels.summary}""${moment().format(`DD-MM-YYYY_HH${"-"}mm`)}.zip`)
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  // Download Device Compatability report
  const handleDeviceCompatibilityReportDownload = async (reportType: string, selectedKPIs: any, params: any) => {
    setShowInfoModal(true);
    const payload = {
      ...getFilterData(selectedKPIs),
      requestFor: "",
      reportType: reportType,
      ...params
    }
    try {
      const { data } = await axios.post(apiMappings.analytics.driverCompliance.avgTotalCompliance.downloadDeviceCompatibilityReport, payload, { responseType: 'arraybuffer' })
      FileSaver.saveAs(new Blob([data], { type: "application/zip" }), `${dynamicLabels.Login || "Login"}""${dynamicLabels.logout || "Logout"}""${moment().format(`DD-MM-YYYY_HH${"-"}mm`)}.zip`)
    }
    catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  // Fetch Data for Order reports in Total Ordrs Tab
  const fetchTotalOrderComplianceReport = (fetchOptions: any) => {
    const params = {
      startDate:
        selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.startDate,
      endDate:
        selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.endDate,
      branches: selectedBranches,
      clientId: clientId,
      dmType: selectedSkills,
      ...fetchOptions,
    };
    dispatch({
      type: "@@driverCompliance/FETCH_TOTAL_ORDERS_COMPLIANCE_SUMMARY",
      payload: params,
    });
    setReLoadComponent(false);
  };


  // Updating Order Reports table Preferences
  const updateTotalOrdersColumnPreferences = async (columns: any) => {
    try {
      dispatch({ type: "@@driverCompliance/SET_LISTVIEW_LOADING", payload: {
        listview: 'totalOrders',
        status: true
      } })
      const { data: { data, message } } = await axios.put(
        apiMappings.analytics.driverCompliance.totalOrderCompliance
          .getTotalOrdersColumnStructure,
        columns
      );
      dispatch({ type: "@@driverCompliance/SET_LISTVIEW_LOADING", payload: {
        listview: 'totalOrders',
        status: !data
      } })
      message && toast.add(message, 'check-round', false)
    } catch (error) {
      console.log(error, error?.response)  
    }
    
   
  };

  // fetch login history for associate

  const fetchDeliveryAssociateLoginHistory = (deliveryAssociateId: number, params: IListViewParams) => {
    const payload = {
      startDate: selectedDates && Object.keys(selectedDates).length !== 0 && selectedDates.startDate,
      endDate: selectedDates && Object.keys(selectedDates).length !== 0 && selectedDates.endDate,
      deliveryAssociateIds: [deliveryAssociateId],
      ...params
    }
    dispatch({ type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_LOGIN_HISTORY", payload })
  }

  const fetchDeliveryAssociateDevices = (deliveryAssociateId: number, params: IListViewParams) => {
    const payload = {
      startDate: selectedDates && Object.keys(selectedDates).length !== 0 && selectedDates.startDate,
      endDate: selectedDates && Object.keys(selectedDates).length !== 0 && selectedDates.endDate,
      deliveryAssociateIds: [deliveryAssociateId],
      ...params
    }
    dispatch({ type: "@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICES", payload })

  }

  // Tab cahnges function
  const handleTabChange = (tab: string) => {
    if (activeTab === tab) {
      return;
    }

    dispatch({
      type: "@@driverCompliance/SET_LOADER_COUNT",
      payload: 0
    });

    dispatch({
      type: "@@driverCompliance/TAB_CHANGE",
      payload: tab
    });

    setActiveTab(tab);
  };

  // Fetch Total Branch compliance for Total barnches tab
  const fetchTotalBranchCompliance = (kpi: string) => {
    dispatch({
      type: "@@driverCompliance/FETCH_TOTAL_BRANCH_COMPLIANCE",
      payload: {
        startDate:
          selectedDates && Object.keys(selectedDates).length !== 0
          && selectedDates.startDate,
        endDate:
          selectedDates && Object.keys(selectedDates).length !== 0
          && selectedDates.endDate,
        branches: selectedBranches,
        dmType: selectedSkills,
        clientId: clientId,
        kpiList: [kpi],
        rangeMin: 0,
        rangeMax: 0,
        requestFor: "totalBranch",
      },
    });
    setReLoadComponent(false);
  };

  // bread crumbs
  const breadCrumbOptions = React.useMemo(
    () => [
      {
        id: "analytics",
        label: dynamicLabels.Analytics,
        disabled: true,
      },
      {
        id: "#",
        label: dynamicLabels.deliveryAssociate + " " + dynamicLabels.Analytics,
        disabled: true,
      },
      {
        id: "deliveryBoyComplianceAnalytics",
        label: dynamicLabels.deliveryAssociate + " " + dynamicLabels.Compliance,
        disabled: true,
      },
    ],
    [dynamicLabels]
  );

  // Global filter changes function
  const handleFilterSubmit = (payload: any) => {
    setIsFilterChange(true);
    dispatch({
      type: "@@driverCompliance/SET_FILTER_DATA",
      payload: payload,
    });
  };

  const closePopups = () => {
    setHideAllPopups(!hideAllPopups);
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        style={{ width: '100%', height: '100%', paddingTop: '64px', position: 'relative' }}
        p="1em"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ width: '100%' }}
          p="0px"
        >
          <div className="cursor">
            <Box p="1em" bgColor="grey.50">
              <BreadCrumb
                options={breadCrumbOptions}
                onClick={(id: string) => {
                  hybridRouteTo(id);
                }}
              />
            </Box>
          </div>
          <ComplianceFilters
            pageLabels={pageLabels}
            handleFilterSubmit={handleFilterSubmit}
            plannedRouteConfigureKPI={plannedRouteConfigureKPI}
            fetchPlannedRouteKpiConfiguration={fetchPlannedRouteKpiConfiguration}
            updatePlannedRouteKpiConfiguration={updatePlannedRouteKpiConfiguration}
            skills={skills}
            branches={branches}
            setHideAllPopups={closePopups}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ width: '100%', height: '100px', marginBottom: '14px' }}
        >
          <Card
            onClick={() => handleTabChange('average-compliance')}
            style={{
              flexGrow: 1,
              color:
                activeTab === 'average-compliance'
                  ? colorCodes.white
                  : colorCodes.fontColor,
              backgroundColor:
                activeTab === 'average-compliance'
                  ? colorCodes.blue
                  : colorCodes.white,
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              marginLeft: 0,
              cursor: 'pointer',
            }}
          >
            <BoxCard>
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '17px',
                }}
              >
                {cardDetails &&
                  cardDetails.deliveryAssociateTotalCompliance &&
                  cardDetails.deliveryAssociateTotalCompliance.length &&
                  cardDetails.avgTotalCompliance
                  ? cardDetails.avgTotalCompliance
                  : 0}
                %
              </div>
              {cardDetails.deliveryAssociateTotalCompliance &&
                cardDetails.deliveryAssociateTotalCompliance.length &&
                cardDetails.avgTotalCompliance ? (
                  <div
                    className={
                      activeTab !== 'average-compliance'
                        ? cardDetails.avgTotalCompliance -
                          overallComplianceDiff >=
                          0
                          ? 'green'
                          : 'red'
                        : ''
                    }
                    style={{ position: 'absolute', top: '15px', right: 0 }}
                  >
                    {cardDetails.avgTotalCompliance - overallComplianceDiff >= 0
                      ? '+'
                      : ''}
                    {(
                      cardDetails.avgTotalCompliance - overallComplianceDiff
                    ).toFixed(2)}
                  %
                  </div>
                ) : (
                  <div
                    className={activeTab !== 'average-compliance' ? 'red' : ''}
                    style={{ position: 'absolute', top: '15px', right: 0 }}
                  >
                    -{overallComplianceDiff.toFixed(2)}%
                  </div>
                )}
            </BoxCard>
            <BoxCard>
              {dynamicLabels.AverageTotal} {dynamicLabels.Compliance}{' '}
              {dynamicLabels.Achievement}
            </BoxCard>
          </Card>
          <Card
            onClick={() => handleTabChange('total-branches')}
            style={{
              flexGrow: 1,
              color:
                activeTab === 'total-branches'
                  ? colorCodes.white
                  : colorCodes.fontColor,
              backgroundColor:
                activeTab === 'total-branches'
                  ? colorCodes.blue
                  : colorCodes.white,
              overflow: 'hidden',
              width: '100%',
              marginLeft: 15,
              marginRight: 15,
              height: '100%',
              margin: '0 15px',
              cursor: 'pointer',
            }}
          >
            <BoxCard style={{ fontSize: '17px' }}>
              {cardDetails &&
                cardDetails.totalComplianceForBranches &&
                Object.keys(cardDetails.totalComplianceForBranches).length &&
                cardDetails.totalBranches
                ? cardDetails.totalBranches
                : 0}
            </BoxCard>
            <BoxCard>
              {dynamicLabels.total} {dynamicLabels.branches}
            </BoxCard>
          </Card>
          <Card
            onClick={() => handleTabChange('total-orders')}
            style={{
              flexGrow: 1,
              color:
                activeTab === 'total-orders'
                  ? colorCodes.white
                  : colorCodes.fontColor,
              backgroundColor:
                activeTab === 'total-orders'
                  ? colorCodes.blue
                  : colorCodes.white,
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              marginRight: 0,
              cursor: 'pointer',
            }}
          >
            <BoxCard style={{ fontSize: '17px' }}>
              {Object.keys(cardDetails).length && cardDetails.totalOrders
                ? cardDetails.totalOrders
                : 0}
            </BoxCard>
            <BoxCard>
              {dynamicLabels.total} {dynamicLabels.orders}
            </BoxCard>
          </Card>
        </Box>

        {/* Acerage compliance Tab */}
        {activeTab === 'average-compliance' &&
          (
            <AverageTotalCompliance
              cardDetails={cardDetails}
              kpiList={kpiList}
              overAllComplianceData={overAllComplianceSummaryData}
              getDeliveryAssociateComplianceSummary={
                getdeliveryAssociateComplianceSummary
              }
              deliveryAssociateComplianceSummaryData={
                deliveryAssociateComplianceSummaryData
                  ? deliveryAssociateComplianceSummaryData
                  : null
              }
              fetchDeviceCompatibilityReport={fetchDeviceCompatibilityReport}
              updateDeviceCompatibilityColumnPreferences={updateDeviceCompatibilityColumnPreferences}
              fetchDeliveryAssociateLoginHistory={fetchDeliveryAssociateLoginHistory}
              fetchDeliveryAssociateDevices={fetchDeliveryAssociateDevices}
              filterData={filterData}
              dynamicLabels={dynamicLabels}
              handleComplianceReportDownload={handleAssociateComplianceDownload}
              handleTrackingReportDownload={handleTrackingComplianceReportDownload}
              handleDeviceCompatibilityReportDownload={handleDeviceCompatibilityReportDownload}
              isLoading={isLoading}
              fetchComplianceTrendData={fetchComplianceTrendData}
              complianceTrendData={complianceTrendData}
              hideAllPopups={!hideAllPopups}
              setShowInfoModal={setShowInfoModal}
            />
          )}

        {/* Total Branches Tap */}
        {activeTab === 'total-branches' && (
          <TotalBranches
            filterData={filterData}
            cardDetails={cardDetails}
            totalBranchCompliance={totalBranchCompliance}
            getBranchDeliveryAssociateComplainceSummary={
              getBranchDeliveryAssociateComplainceSummary
            }
            branchDeliveryAssociateComplianceSummaryData={
              branchDeliveryAssociateComplianceSummaryData
            }
            fetchTotalBranchCompliance={fetchTotalBranchCompliance}
            handleComplianceReportDownload={handleBranchComplianceReportDownload}
            clientId={clientId}
            kpiList={kpiList}
            dynamicLabels={dynamicLabels}
            isLoading={isLoading}
            reLoadComponent={reLoadComponent}
          />
        )}

        {/* Total orders tab */}
        {activeTab === 'total-orders' && (
          <TotalOrders
            dynamicLabels={dynamicLabels}
            totalOrdersReports={totalOrdersReports}
            filterData={filterData}
            fetchTotalOrderReports={fetchTotalOrderReports}
            fetchTotalOrderComplianceReport={fetchTotalOrderComplianceReport}
            updateTotalOrdersColumnPreferences={
              updateTotalOrdersColumnPreferences
            }
            handleComplianceReportDownload={handleOrderComplianceReportDownload}
            isLoading={isLoading}
            reLoadComponent={reLoadComponent}
          />
        )}
        {/* {isLoading &&
          !overAllComplianceSummaryData.deliveryAssociateOverallComplianceSummaryDTO && (
            <Loader center={true} fadeBackground={true} speed={1} />
          )} */}
      </Box>
      <Modal
        open={showInfoModal}
        onToggle={() => { setShowInfoModal(false) }}
        children={{
          header: (
            <ModalHeader
              headerTitle='Information'
              handleClose={() => { setShowInfoModal(false) }}
              imageVariant='close'
            />
          ),
          content: (
            <div style={{ fontSize: '14px', color: colorCodes.infoColor }}>
              <div>Thank you! Your report is being generated and will be  downloaded soon.</div>
              <br />
              <br />
              <div>You may continue to use the app.</div>
            </div>
          )
        }}
        width='600px'
      />
    </>
  );
};

const BoxCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  position: relative;
`;

export default withThemeProvider(
  withToastProvider(withRedux(withPopup(DriverComplianceAnalytics)))
);
