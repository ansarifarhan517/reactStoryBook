import React, { useEffect, useState, Dispatch, useMemo, useRef } from 'react';
import { ColumnInstance } from 'react-table';
import {
  Card,
  Box,
  Modal,
  ModalHeader,
  ISortOptions,
  Loader,
  BoxPlot,
  BarChart,
  DropDown,
  IListViewColumn,
  MultiSelect,
  ListView,
  Button,
  FontIcon,
  Position,
  LineChart,
  ButtonGroup,
  IconButton,
  useToast,
  Tooltip,
  IMultiSelectOptions
} from "ui-library";

import axios from "../../../../../utils/axios";
import {
  getKPInameBySlug,
  getKPICodeByCode,
  handleDeviceSearch
} from '../../../../../utils/helper';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { transformMongoListViewToColumns } from '../../../../../utils/mongo/ListView';
import DownloadReportModal from "../DownloadReportModal";

import { colorCodes } from '../../../colorCodes';
import apiMappings from "../../../../../utils/apiMapping";
import moment from "moment";
import FileSaver from 'file-saver';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DriverComplianceAnalyticsActions } from '../DriverComplianceAnalytics.actions';
import TrendLineChartTooltip from "../TrendLineChartTooltip/TrendLineChartTooltip";
import BarChartTooltip from "../BarChartTooltip/BarChartTooltip";
import useClientProperties from '../../../../common/ClientProperties/useClientProperties';

export const TrendCardLabel = styled.span`
  font-size: 17px;
  font-weight: 500; 
  color: ${colorCodes.fontColor}; 
  letter-spacing: -0.11px;
`;

export const AssociateMeta = styled.div`
    padding: 10px 15px;
    min-width: 225px;
`;

export const AssociateLabel = styled.h5`
    font-size: 13px;
    line-height: 14px;
    font-weight: 500;
    color: #000000;
`;

export const AssociateDesc = styled.p`
   font-size: 13px;
    color: rgba(0, 0, 0, 0.7);
`;



const colorCodesForTrendGraphLend = [
  "#9B4848",
  "#48979B",
  "#B24DD9",
  "#006279",
  "#5698D3",
  "#F0AD48",
  "#F05548",
  "#8CC54D",
  "#2CC6FF",
  "#2C00C2",
];


export interface IAssociateAchievement {
  startDate: number;
  deliveryAssociateAchievements?: Array<any>;
}

export interface IBarChartTooltip {
  value?: string | number | React.ReactText[];
  name?: string | number | React.ReactText[];
  color?: string;
  legend?: string;
}

const trackingData = ["trackingData", "trackingDataOnTrip", "trackingDataOffTrip"];

export interface IOptions {
  clientId?: number;
  clientRefMasterCd: string;
  clientRefMasterDesc: string;
  clientRefMasterId?: number;
  clientRefMasterType?: string;
  id?: number;
  isDeleteFl?: string;
  label: string;
  name?: string;
  value: string;
}

export interface IDeliveryAssociates {
  branchId: number;
  branchName: string;
  deliveryAssociateId: number;
  deliveryAssociateName: string;
  employeeId: string;
  phoneNumber: string;
  userName: string;
  label: string;
  value: string;
}

export interface IAverageAverageTotalCompliance {
  cardDetails: any;
  kpiList: [];
  overAllComplianceData: any;
  getDeliveryAssociateComplianceSummary: Function;
  deliveryAssociateComplianceSummaryData: any;
  filterData: any;
  dynamicLabels: any;
  isLoading: boolean;
  fetchComplianceTrendData: Function;
  complianceTrendData: any;
  hideAllPopups: boolean;
  updateDeviceCompatibilityColumnPreferences: Function;
  fetchDeviceCompatibilityReport: Function;
  fetchDeliveryAssociateLoginHistory: Function;
  fetchDeliveryAssociateDevices: Function;
  handleComplianceReportDownload: Function;
  handleTrackingReportDownload: Function;
  handleDeviceCompatibilityReportDownload: Function;
  setShowInfoModal: Function
}

export interface IScatterTooltip {
  key?: string;
  value?: string | number;
}

export interface IDAComplianceDropDownOptions {
  value: number;
  label: string;
  toolTipText: string;
}
export interface IOutliersList {
  deliveryAssociateName: string;
  kpiAchievment: number;
}

export interface IBarchartLegends {
  name: string
  value: number
  color: string
  active: boolean
}

export interface IOverallComplianceBarChart {
  [key: string]: any
  name: string
}

export interface IParams {
  searchAfter: string | null
  searchBy?: string
  searchText?: string
  size: number
}

export interface IDeliveryAssociate {
  deliveryAssociate: string;
  deliveryAssociateId: number;
  deviceCount: number;
  phoneNumber: string;
  userName: string;
}


export interface IPageOpt {  
  deliveryAssociate: string | undefined
  deliveryAssociateId: number | undefined
  pageNum: number;
}


export interface IOutlier {
  deliveryAssociateName: string;
  kpiAchievment: number;
}
export interface ISelectedKpiData {
  countFirstQAndMedian: number;
  countFirstRange: number;
  countFourthRange: number;
  countMedianAndThirdQ: number;
  countMinAndFirstQ: number;
  countSecondRange: number;
  countThirdQAndMax: number;
  countThirdRange: number;
  firstQuartile: number;
  kpiCode: string;
  listOfOutliers: Array<IOutlier> | []
  max: number;
  mean: number;
  median: number;
  min: number;
  thirdQuartile: number;
}

export interface ILoginHistoryFetchOption {
  pageSize?: number | undefined;
  filterOptions?: {
    searchBy?: string | undefined;
    searchText?: string | number | undefined;
  } | undefined
}

const AverageTotalCompliance = (props: IAverageAverageTotalCompliance) => {
  const [selectedKPIs, setSelectedKPIs] = useState<IMultiSelectOptions[]>([]);
  const [kpiListOptionForOverAllSymmary, setKpiListOptionForOverAllSymmary] = useState<IMultiSelectOptions[]>([]);
  const [kpiListForDAComplianceSummary, setKpiListForDAComplianceSumary] = useState<IMultiSelectOptions[]>([]);
  const [selectedKpiForDAComplianceSummary, setSelectedKpiForDAComplianceSummary] = useState<IMultiSelectOptions[]>([]);
  const [kpiListOption, setKpiListOption] = useState<any>([]);
  const [barchartMin, setBarchartMin] = useState<number>(50);
  const [barchartMax, setBarchartMax] = useState<number>(100);
  const [selectedKpiForBarchart, setSelectedKpiForBarchart] = useState<any>();
  const [trendType, setTrendTye] = useState<string>();
  const [DAsForKPIVSDAS, setDAsForKPIVSDAS] = useState<number[]>([]);
  const [KPIsForKPIVSDAS, setKPIsForKPIVSDAS] = useState<string[]>([]);
  const [DAsForDAVSKPIS, setDAsForDAVSKPIS] = useState<number[]>([]);
  const [KPIsForDAVSKPIS, setKPIsForDAVSKPIS] = useState<string[]>([]);
  const [trendLineData, setTrendLineData] = useState<[]>([]);
  const [trendLineLegendData, setTrendLineLegendData] = useState<
    { name: string; color: string; active: boolean }[]
  >([]);
  const [yAxisTicks, setYaxisTicks] = useState<any[]>([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  const [isKpiOrDa, setIsKpiOrDa] = useState<boolean>(false);
  const [daListData, setDaListData] = useState<[]>([]);
  const [daListOptions, setdaListOptions] = useState<[]>([]);
  const [selectedKpisLHS, setSelectedKpisLHS] = useState<any[]>([]);
  const [selectedDasRHS, setSelectedDasRHS] = useState<any[]>([]);
  const [selectedKpisRHS, setSelectedKpisRHS] = useState<any[]>([]);
  const [selectedDasLHS, setSelectedDasLHS] = useState<any[]>([]);
  const [kpisOptionsLHS, setKpisOptionsLHS] = useState<IMultiSelectOptions[]>([]);
  const [dasOptionsRHS, setDasOptionsRHS] = useState<IMultiSelectOptions[]>([]);
  const [kpisOptionsRHS, setKpisOptionsRHS] = useState<IMultiSelectOptions[]>([]);
  const [dasOptionsLHS, setDasOptionsLHS] = useState<IMultiSelectOptions[]>([]);
  const [intervalType, setIntervalType] = useState<string>("DAY");
  const [isReportModalVisible, setReportModalVisible] = useState<boolean>(false);
  const [isTrendReportModalVisible, setTrendReportModalVisible] = useState<boolean>(false);
  const [isDeviceCompaitibilityModalVisible, setDeviceCompaitibilityModalVisible] = useState<boolean>(false);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const dispatch = useDispatch<Dispatch<DriverComplianceAnalyticsActions>>();
  const clientProperties = useClientProperties(["DATEFORMAT"]);

  const[chartType, setChartType] = useState<string>('BOXPLOT');

  const deliveryAssociateList = useTypedSelector(
    (state) => state.analytics.driverComplianceAnalytics.cardDetails?.deliveryAssociateTotalCompliance
  );

  const overAllComplianceSummaryData = useTypedSelector(
    (state) =>
      state.analytics.driverComplianceAnalytics.overAllComplianceSummaryData
  );


  const isListViewLoading = useTypedSelector((state) => state.analytics.driverComplianceAnalytics.listview.deviceCompatibility);
  const filteredDates = useTypedSelector((state) => state.analytics.driverComplianceAnalytics.filterData?.selectedDates);

  const [isLoginHistoryVisible, setLoginHistoryVisible] = useState<boolean>(
    false
  );
  const [isDevicesVisible, setDevicesVisible] = useState<boolean>(false);

  const [params, setParams] = useState<any>("");

  const kpiListDropdownData = useTypedSelector((state) => state.analytics.driverComplianceAnalytics.kpiDropdownData);
  const {
    cardDetails,
    kpiList,
    overAllComplianceData,
    getDeliveryAssociateComplianceSummary,
    deliveryAssociateComplianceSummaryData,
    filterData,
    dynamicLabels,
    isLoading,
    fetchComplianceTrendData,
    complianceTrendData,
    hideAllPopups,
    updateDeviceCompatibilityColumnPreferences,
    fetchDeviceCompatibilityReport,
    fetchDeliveryAssociateLoginHistory,
    fetchDeliveryAssociateDevices,
    handleComplianceReportDownload,
    handleTrackingReportDownload,
    handleDeviceCompatibilityReportDownload,
    setShowInfoModal
  } = props;

  const buttonGroupOptions = useMemo(() => [
    { id: "YEAR", label: dynamicLabels.year },
    { id: "MONTH", label: dynamicLabels.month },
    { id: "WEEK", label: dynamicLabels.week },
    { id: "DAY", label: dynamicLabels.day, selected: true }
  ],[dynamicLabels])
  
  const buttonGroupOptionsWithHour = useMemo(() => [
    { id: "YEAR", label: dynamicLabels.year },
    { id: "MONTH", label: dynamicLabels.month },
    { id: "WEEK", label: dynamicLabels.week },
    { id: "DAY", label: dynamicLabels.day, selected: true },
    { id: "HOUR", label: dynamicLabels.hour }
  ],[dynamicLabels])

  const clientId = JSON.parse(localStorage.getItem("userAccessInfo") || "{}").clientId;

  const { selectedBranches, selectedSkills, selectedDates } = filterData;
  const toast = useToast();

  const yAxisLabels = {
    totalLoginCount: dynamicLabels.totalLoginCount || "Total Login Count",
    onDutyAnalysis: dynamicLabels.onDutyInHours || "On Duty (Hours)",
    actualBreakDuration: dynamicLabels.actualBreakDurationInMins || 'Actual Break Duration (in mins)'
  }
  
  const structure = useTypedSelector(
    (state) =>
      state.analytics.driverComplianceAnalytics
      .deviceCompatibilityColumnStructure
  );
  const columnsSelector = useTypedSelector(
    (state) =>
    state.analytics.driverComplianceAnalytics
    .deviceCompatibilityColumnStructure.columns
  );
  const rowsSelector = useTypedSelector(
    (state) =>
      state.analytics.driverComplianceAnalytics
      .deliveryAssociateDeviceCompatibility.results
  );
  
  // const avgLoginDurationInMins = useTypedSelector(
  //   (state) =>
  //   state.analytics.driverComplianceAnalytics.deliveryAssociateLoginHistory?.results &&
  //     state.analytics.driverComplianceAnalytics
  //       .deliveryAssociateLoginHistory.results[0].avgLoginDurationInMins
  // );
  
  const totalRowsSelector = useTypedSelector(
    (state) =>
      state.analytics.driverComplianceAnalytics
        .deliveryAssociateDeviceCompatibility.totalCount
  );
  
  const loginHistoryColumnsSelector = useTypedSelector(
    (state) =>
      state.analytics.driverComplianceAnalytics.deliveryAssociateLoginHistoryColumnStructure.columns
      );
      const loginHistoryRowsSelector = useTypedSelector(
        (state) => state.analytics.driverComplianceAnalytics.deliveryAssociateLoginHistory?.results?.[0]?.loginHistory
    );

    const deviceListColumnsSelector = useTypedSelector(
      (state) =>
      state.analytics.driverComplianceAnalytics.deliveryAssociateDevicesColumnStructure.columns
  );  

  const deviceListRowsSelector = useTypedSelector(
    (state) =>
    state.analytics.driverComplianceAnalytics.deliveryAssociateDevices.results 
    ); 

  const isDeviceListViewLoading = useTypedSelector((state) => state.analytics.driverComplianceAnalytics.listview.deviceList)
  const isLoginHistoryListViewLoading = useTypedSelector((state) => state.analytics.driverComplianceAnalytics.listview.loginHistory)
    
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [pageOptions, setPageOptions] = useState<Array<IPageOpt>>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [loginHistoryColumns, setLoginHistoryColumns] = useState<IListViewColumn[]>([]);

  const [deviceListColumns,setDeviceListColumns] = useState<IListViewColumn[]>([]);
  
  const [currentAssociate, setCurrentAssociate] = useState<IDeliveryAssociate>({
    deliveryAssociate: '',
    deliveryAssociateId: 0,
    deviceCount: 0,
    phoneNumber: '',
    userName: ''
  });
  
  const handleLoginHistory = (deliveryAssociate: IDeliveryAssociate) => {
    setCurrentAssociate(deliveryAssociate);
    setLoginHistoryVisible(true);
  };
  
  const handleDeviceCount = (deliveryAssociate: IDeliveryAssociate) => {
    if (!deliveryAssociate?.deviceCount) {
      return;
    }
    setCurrentAssociate(deliveryAssociate);
    setDevicesVisible(true);
  };
  
  const cellCallbackMapping = {
    logInHistory: handleLoginHistory,
    deviceCount: handleDeviceCount,
  };
  
  useEffect(() => {
    const mongoStructure = columnsSelector;

    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        'analyticsDACompliance',
        cellCallbackMapping
      );
      setColumns(newColumns);
    }
  }, [rowsSelector, columnsSelector]);

  const valueRef = React.useRef(rowsSelector);
  
  const currentPagevalueRef = React.useRef(currentPage);
  
  useEffect(() => {
    valueRef.current = rowsSelector;
  }, [rowsSelector]);

  useEffect(() => {
    currentPagevalueRef.current = currentPage;
  }, [currentPage]);
  
  const handlePageChange = (pageNumber: number, pageOpt: Array<IPageOpt>) => {
    setPageOptions(pageOpt);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const mongoStructure = loginHistoryColumnsSelector;
    
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        'analyticsDACompliance',
        cellCallbackMapping
      );
      setLoginHistoryColumns(newColumns);
    }
  }, [loginHistoryColumnsSelector]);
  
  useEffect(() => {
    const mongoStructure = deviceListColumnsSelector;

    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        'analyticsDACompliance',
        cellCallbackMapping
        );
      setDeviceListColumns(newColumns);
    }
  }, [deviceListRowsSelector, deviceListColumnsSelector]);
  
  const scatterPlotData: number[][] = [];
  const xAxisTicks: string[] = [];
  const averageCompliance: number[] = [];
  let xboxPlotData: any[] = [];
  const toolTip = {};
  
  // barchart Data
  let tinyChardData: any = [];
  
  // Kpi list options
  const options = Object.keys(kpiList).map((key) => {
    kpiList[key]['value'] = kpiList[key].clientRefMasterCd;
    kpiList[key]['label'] = kpiList[key].clientRefMasterDesc;
    return kpiList[key];
  });
  
  const firstKpis = options.slice(1, 9);
  useEffect(() => {
    if (!kpiListOption.length) {
      const kpiForState = [
        "totalCompliance",
        "plannedRoute",
        "trackingData",
        "onTimeDelivery",
        "serviceTimeKpi",
        "cashCompliance",
        "esignCapture",
        "epodCapture",
        "customerRatingCapture",
        "onTimeLogin",
      ]

      const tempOptions = Object.keys(kpiList).map((key) => {
        kpiList[key]['value'] = kpiList[key].clientRefMasterCd;
        kpiList[key]['label'] = kpiList[key].clientRefMasterDesc;
        return kpiList[key];
      });
      const filterdKpis = tempOptions.filter(option => kpiForState.indexOf(option.clientRefMasterCd) > -1);
      const kpis = tempOptions.filter(option => option.clientRefMasterCd !== "actualBreakDuration");
      setSelectedKpisLHS(filterdKpis);
      setKpiListOption(tempOptions);
      setKpisOptionsLHS(tempOptions);
      setKpisOptionsRHS(tempOptions);
      setKpiListOptionForOverAllSymmary(kpis.slice(0, kpis.length) );
      setKpiListForDAComplianceSumary(kpis.slice(1, kpis.length - 1));
      setKPIsForDAVSKPIS(kpiForState);
      setKPIsForKPIVSDAS([tempOptions[0]?.clientRefMasterCd]);
      setSelectedKPIs(tempOptions.slice(0, 8));
      setSelectedKpisRHS(tempOptions.slice(0, 1));
      setSelectedKpiForDAComplianceSummary(tempOptions.slice(0, 1))
    }
  }, [kpiList]);

  
  useEffect(() => {
    if(!!kpiList) {
      const plannedRouteKpi = kpiList.filter((kpi: any) => kpi.clientRefMasterCd === 'plannedRoute');
      setSelectedKpiForDAComplianceSummary(plannedRouteKpi);
    }
  },[kpiList]);
  
  // boxplot legend colors
  const boxPlotPartColor = {
    first: colorCodes.boxPlotLegendBlue,
    q3: colorCodes.yellow,
    q1: colorCodes.yellow,
    median: colorCodes.medianColor
  };
  
  const buildDataForboxPlot = (data: { [x: string]: any }) => {
    const selectedDataForKpis = data?.filter(
      (kpiData: { kpiCode: string | undefined } | null) =>
        kpiData != null &&
        selectedKPIs.find((kpi) => kpi.clientRefMasterCd === kpiData.kpiCode)
    ).sort((a: { max: number; }, b: { max: number; }) => b.max - a.max);
    // selectedDataForKpis.splice(0, 0, data[0]);

    const boxPlotSummary = selectedDataForKpis.map(
      (selectedData: any, index: string) => {
        const temp = selectedData;
        const lKpiName = getKPInameBySlug(temp.kpiCode)
          ? getKPInameBySlug(temp.kpiCode).clientRefMasterDesc
          : "Total Compliance";
        xAxisTicks.push(lKpiName);
        const tempPlotData = [
          temp.min,
          temp.firstQuartile,
          temp.median,
          temp.thirdQuartile,
          temp.max,
        ];
        averageCompliance.push(temp.mean);
        
        // creating tool tip with data
        toolTip[lKpiName] = {
          first: temp.min,
          q1: temp.firstQuartile,
          median: temp.median,
          q3: temp.thirdQuartile,
          last: temp.max,
        };
        if (temp.listOfOutliers && temp.listOfOutliers.length) {
          Object.keys(temp.listOfOutliers).forEach((subkey) => {
            scatterPlotData.push([
              parseInt(index),
              temp.listOfOutliers[subkey].kpiAchievment,
            ]);
          });
        }
        return tempPlotData;
      }
    );
    xboxPlotData = boxPlotSummary;
    
  };
  
  // Box plot data
  if(overAllComplianceData && overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO ){
    buildDataForboxPlot(
      overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO
      );
    }
  
    
    // bar chart data
    const [barChartTinyChartTitleList, setBarChartTinyChartTitleList] = useState<any[]>([]);
    const [barChartLegendData, setBarChartLegendData] = useState<any[]>([]);
    const [barChartLineData, setBarChartLineData] = useState<any[]>([]);
    const [barChartMinOptions, setBarChartMinOptions] = useState<any[]>([]);
    const [barChartMaxOptions, setBarChartMaxOptions] = useState<any[]>([]);
    const [barChartTinyChartData, setBarChartTinyChardData] = useState<any[]>([]);
    const [barChartData, setBarChartData] = useState<any[]>([]);
    
    const [overAllComplianceBartChartLegends, setOverAllComplianceBartChartLegends] = useState<Array<IBarchartLegends>>([]);
    const [overAllComplianceBarChartData, setOverAllComplianceBarChartData] = useState<Array<IOverallComplianceBarChart>>([]);
    const buildDataForBarChar = (deliveryAssociateComplianceSummary: { kpiCode?: any; listOfKPIDetails?: any; }) => {
      const kpiName =
      Object.keys(deliveryAssociateComplianceSummary).length &&
      getKPInameBySlug(
        deliveryAssociateComplianceSummary &&
        deliveryAssociateComplianceSummary.kpiCode
        ).name;

        setBarChartTinyChartTitleList([dynamicLabels.TotalCompliance, kpiName]);
        
    let selectedKpi = overAllComplianceData?.deliveryAssociateOverallComplianceSummaryDTO?.find(
      (kpi: any) => {
        return (
          kpi && kpi.kpiCode === deliveryAssociateComplianceSummary.kpiCode
        );
      }
    );

    let totalCompliance = overAllComplianceData?.deliveryAssociateOverallComplianceSummaryDTO?.find(
      (kpi: any) => {
        return kpi.kpiCode === 'totalCompliance';
      }
    );

    setBarChartLegendData([
      {
        name: dynamicLabels.avgTotalCompliance,
        value: totalCompliance ? totalCompliance.mean : 0,
        color: colorCodes.yellow,
        active: true,
      },
      {
        name: dynamicLabels.TotalCompliance,
        color: colorCodes.blue,
        active: true,
        value: 0,
      },
      {
        name: dynamicLabels.Avg + ' ' + kpiName,
        value: selectedKpi?.mean,
        color: colorCodes.legendBlue,
        active: true,
      },
      {
        name: kpiName,
        color: colorCodes.red,
        value: 0,
        active: true,
      },
    ]);
    
    setBarChartLineData([
      {
        [dynamicLabels.avgTotalCompliance]: totalCompliance
          ? totalCompliance.mean
          : 0,
      },
      { [dynamicLabels.Avg + " " + kpiName]: selectedKpi?.mean },
    ]);
    
    setBarChartMinOptions([
      {label: `0 ${dynamicLabels.percent}`, value: 0, tooltipText: `0 ${dynamicLabels.percent}`},
      {label: `25 ${dynamicLabels.percent}`, value: 25, tooltipText: `25 ${dynamicLabels.percent}`},
      {label: `50 ${dynamicLabels.percent}`, value: 50, tooltipText: `50 ${dynamicLabels.percent}`},
      {label: `75 ${dynamicLabels.percent}`, value: 75, tooltipText: `75 ${dynamicLabels.percent}`}
    ]);
    
    setBarChartMaxOptions([
      {label: `25 ${dynamicLabels.percent}`, value: 25, tooltipText: `25 ${dynamicLabels.percent}`},
      {label: `50 ${dynamicLabels.percent}`, value: 50, tooltipText: `50 ${dynamicLabels.percent}`},
      {label: `75 ${dynamicLabels.percent}`, value: 75, tooltipText: `75 ${dynamicLabels.percent}`},
      {label: `100 ${dynamicLabels.percent}`, value: 100, tooltipText: `100 ${dynamicLabels.percent}`}
    ]);
    
    let chartData =
    Object.keys(deliveryAssociateComplianceSummary).length &&
    deliveryAssociateComplianceSummary.listOfKPIDetails
    .sort(
          (a: { kpiAchievment: number }, b: { kpiAchievment: number }) =>
          b.kpiAchievment - a.kpiAchievment
          )
          .map((data: any) => {
            const overAllTotalCompliance =
            cardDetails.deliveryAssociateTotalCompliance.find((da: { deliveryAssociateId: string; }) => da.deliveryAssociateId === data.deliveryAssociateId)?.kpiAchievment;
            
          tinyChardData.push({
            name: data.deliveryAssociateName,
            [dynamicLabels.TotalCompliance]: overAllTotalCompliance,
            [kpiName]: data.kpiAchievment,
          });
          
          return {
            [dynamicLabels.avgTotalCompliance]: totalCompliance
              ? totalCompliance.mean
              : 0,
              [dynamicLabels.Avg + ' ' + kpiName]: selectedKpi?.mean,
              [dynamicLabels.TotalCompliance]: overAllTotalCompliance,
              [kpiName]: data.kpiAchievment,
              name: data.deliveryAssociateName,
            };
          });
    setBarChartTinyChardData(tinyChardData);
    setBarChartData(chartData);
  }
  const buildDataForOverallComplianceBarChart = (deliveryAssociateComplianceSummary: { [x: string]: any}) => {
    const selectedDataForKpis = deliveryAssociateComplianceSummary.filter(
      (kpiData: { kpiCode: string | undefined } | null) =>
      kpiData != null &&
        selectedKPIs.find((kpi) => kpi.clientRefMasterCd === kpiData.kpiCode)
        ).sort((a: { mean: number; }, b: { mean: number; }) => b.mean - a.mean);
        selectedDataForKpis.splice(0, 0, deliveryAssociateComplianceSummary[0]);
        const barChartSummary = selectedDataForKpis.map(
          (selectedData: ISelectedKpiData) => {
            const temp = selectedData;
        const lKpiName = getKPInameBySlug(temp.kpiCode)
        ? getKPInameBySlug(temp.kpiCode).clientRefMasterDesc
        : "Total Compliance";
        return {
          name: lKpiName,
          [dynamicLabels.AverageCompliance]: temp.mean
        }
      })
      
      
      setOverAllComplianceBarChartData(barChartSummary);
      setOverAllComplianceBartChartLegends([{
        name: dynamicLabels.AverageCompliance,
        value: 0,
        color: colorCodes.blue,
        active: true,
      }]);
    }

    useEffect(() => {
    if(overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO && chartType === "BARCHART") {
      buildDataForOverallComplianceBarChart(overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO)
    }
  },[overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO, selectedKPIs, chartType])

  

  useEffect(() => {
    if (deliveryAssociateComplianceSummaryData && deliveryAssociateComplianceSummaryData.kpiCode) {
      buildDataForBarChar(deliveryAssociateComplianceSummaryData);
    }
  }, [deliveryAssociateComplianceSummaryData])
  
  const handlePercentChange = (
    min: number | undefined,
    max: number | undefined,
    kpiCode: string | undefined
  ) => {
    if (kpiCode === "totalCompliance") {
      buildDataForTotalComplianceKpi(min || 0, max || 0);
      return;
    }
    getDeliveryAssociateComplianceSummary({
      startDate:
        selectedDates &&
        Object.keys(selectedDates).length &&
        selectedDates.startDate,
      endDate:
        selectedDates &&
        Object.keys(selectedDates).length &&
        selectedDates.endDate,
        branches: selectedBranches,
      clientId: clientId,
      kpiList: [
        getKPInameBySlug(kpiCode)
          ? getKPInameBySlug(kpiCode).clientRefMasterCd
          : 'totalCompliance',
        ],
      dmType: selectedSkills,
      rangeMin: min,
      rangeMax: max,
    });
  };

  const buildDataForTotalComplianceKpi = (min: number, max: number) => {
    const DAsInGivenRannge = deliveryAssociateList.filter((da: { kpiAchievment: number; }) => da.kpiAchievment >= min && da.kpiAchievment <= max);
    
    setBarChartTinyChartTitleList([dynamicLabels.TotalCompliance]);
    
    const totalCompliance = overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO.find(
      (kpi: any) => {
        return kpi.kpiCode === 'totalCompliance';
      }
      );
      
    setBarChartLegendData([
      {
        name: dynamicLabels.avgTotalCompliance,
        value: totalCompliance ? totalCompliance.mean : 0,
        color: colorCodes.yellow,
        active: true,
      },
      {
        name: dynamicLabels.TotalCompliance,
        color: colorCodes.blue,
        active: true,
        value: 0,
      }
    ]);

    setBarChartLineData([
      {
        [dynamicLabels.avgTotalCompliance]: totalCompliance
          ? totalCompliance.mean
          : 0,
      }
    ]);

    setBarChartMinOptions([
      {label: `0 ${dynamicLabels.percent}`, value: 0, tooltipText: `0 ${dynamicLabels.percent}`},
      {label: `25 ${dynamicLabels.percent}`, value: 25, tooltipText: `25 ${dynamicLabels.percent}`},
      {label: `50 ${dynamicLabels.percent}`, value: 50, tooltipText: `50 ${dynamicLabels.percent}`},
      {label: `75 ${dynamicLabels.percent}`, value: 75, tooltipText: `75 ${dynamicLabels.percent}`}
    ]);

    setBarChartMaxOptions([
      {label: `25 ${dynamicLabels.percent}`, value: 25, tooltipText: `25 ${dynamicLabels.percent}`},
      {label: `50 ${dynamicLabels.percent}`, value: 50, tooltipText: `50 ${dynamicLabels.percent}`},
      {label: `75 ${dynamicLabels.percent}`, value: 75, tooltipText: `75 ${dynamicLabels.percent}`},
      {label: `100 ${dynamicLabels.percent}`, value: 100, tooltipText: `100 ${dynamicLabels.percent}`}
    ]);
    
    let chartData =
      DAsInGivenRannge.length &&
      DAsInGivenRannge
      .sort(
        (a: { kpiAchievment: number }, b: { kpiAchievment: number }) =>
        b.kpiAchievment - a.kpiAchievment
        )
        .map((data: any) => {
          const overAllTotalCompliance =
            cardDetails.deliveryAssociateTotalCompliance.find((da: { deliveryAssociateId: string; }) => da.deliveryAssociateId === data.deliveryAssociateId)?.kpiAchievment;
            
            tinyChardData.push({
              name: data.deliveryAssociateName,
            [dynamicLabels.TotalCompliance]: overAllTotalCompliance
          });
          
          return {
            [dynamicLabels.avgTotalCompliance]: totalCompliance
              ? totalCompliance.mean
              : 0,
              [dynamicLabels.TotalCompliance]: overAllTotalCompliance,
              name: data.deliveryAssociateName,
            };
        });

    setBarChartTinyChardData(tinyChardData);
    setBarChartData(chartData);
  };

  useEffect(() => {
    if (
      overAllComplianceData &&
      overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO &&
      overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO.length
      ) {
      const kpi =
        overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO.filter((SummaryDTO: { kpiCode: any; }) => SummaryDTO && SummaryDTO.kpiCode === firstKpis[0].clientRefMasterCd)[0];
      setBarchartMax(100);
      setBarchartMin(50);
      setSelectedKpiForBarchart({
        category: kpi.kpiCode,
        median: parseFloat(kpi.median),
        q1: parseFloat(kpi.firstQuartile),
        q3: parseFloat(kpi.thirdQuartile),
        whiskerHigh: parseFloat(kpi.max),
        whiskerLow: parseFloat(kpi.min),
      });
      getDeliveryAssociateComplianceSummary({
        startDate:
          selectedDates &&
          Object.keys(selectedDates).length &&
          selectedDates.startDate,
        endDate:
          selectedDates &&
          Object.keys(selectedDates).length &&
          selectedDates.endDate,
        branches: selectedBranches,
        clientId: clientId,
        kpiList: [options ? options[0]['clientRefMasterCd'] : "plannedRoute"],
        dmType: selectedSkills,
        rangeMin: kpi.median,
        rangeMax: kpi.thirdQuartile,
      });
    }
  }, [overAllComplianceData]);

  // Line chart for trends

  const getXaxisIntervelValue = (interval: string, date: moment.MomentInput) => {
    switch (interval) {
      case "YEAR":
        return moment(date).format("YYYY");
      case "MONTH":
        return moment(date).format("MMM-YYYY");
      case "WEEK":
        return "Week " +
          moment(date).week() +
          " (" +
          moment(date).format("DD-MM-YYYY") + ")";
      case 'HOUR':
        return moment(date).format("DD-MM-YYYY:HH:mm:ss");
        break;
      default:
          return moment(date).format(clientProperties?.DATEFORMAT?.propertyValue ? clientProperties?.DATEFORMAT?.propertyValue.toUpperCase() : 'DD-MM-YYYY');
    }
  }

  useEffect(() => {
    if (deliveryAssociateList?.length) {
      setDaListData(deliveryAssociateList);
      const tempList = deliveryAssociateList.map((item: { [x: string]: any }) => {
        item["label"] = item["deliveryAssociateName"];
        item["value"] = item["deliveryAssociateId"];
        return item;
      });
      setdaListOptions(tempList);
      setDasOptionsLHS(tempList);
      setDasOptionsRHS(tempList.sort((a: { kpiAchievment: number; }, b: { kpiAchievment: number; }) => b.kpiAchievment - a.kpiAchievment));
      setSelectedDasRHS([tempList.sort((a: { kpiAchievment: number; }, b: { kpiAchievment: number; }) => b.kpiAchievment - a.kpiAchievment)[0]]);
      setSelectedDasLHS([tempList[0]]);
      setDAsForDAVSKPIS([tempList[0]?.deliveryAssociateId]);
      setDAsForKPIVSDAS([tempList[0]?.deliveryAssociateId]);
    }
  }, [deliveryAssociateList])

  const findDeliveryAssociateById = (id: any) => {
    return daListData.find((driver: any) => { return driver.deliveryAssociateId === id });
  }

  
  const buildComplianceTrendData = (trendData: any) => {
    if (trendType === "DAVSKPIS") {
      if(intervalType === 'HOUR' && KPIsForDAVSKPIS.some((val) => trackingData.includes(val))) {

        let KPIs = KPIsForDAVSKPIS.filter(kpi => trackingData.includes(kpi));
        const xtrendLineLegendData = KPIs.map((code, index) => {
          const KPI = getKPInameBySlug(code);
          return {
            name: KPI.clientRefMasterDesc,
            color: colorCodesForTrendGraphLend[index],
            active: true,
          };
        });
      setTrendLineLegendData(xtrendLineLegendData);

      
      const xTrendLineData = trendData?.map(
        (kpiData: {
          kpiAchievementForDA: { kpiCode: string; achievement: any }[];
          startDate: any;
        }) => {
          const lineDetails = {};

        KPIs.forEach((kpiCode) => {
            const kpiAchievement = kpiData.kpiAchievementForDA.find(
              (item: { kpiCode: string }) => item.kpiCode === kpiCode
            );
            lineDetails[
              getKPInameBySlug(kpiCode)?.clientRefMasterDesc
            ] = kpiAchievement ? kpiAchievement.achievement : 0;
          });

          lineDetails["name"] = getXaxisIntervelValue(intervalType, kpiData.startDate);
          return lineDetails;
        }
      );
      setTrendLineData(xTrendLineData);
      } else {
      const xtrendLineLegendData = KPIsForDAVSKPIS?.map((code, index) => {
        const KPI = getKPInameBySlug(code);
        return {
          name: KPI?.clientRefMasterDesc,
          color: colorCodesForTrendGraphLend[index],
          active: true,
        };
      });
      setTrendLineLegendData(xtrendLineLegendData);

      const xTrendLineData = trendData?.map(
        (kpiData: {
          kpiAchievementForDA: { kpiCode: string; achievement: any }[];
          startDate: any;
        }) => {
          const lineDetails = {};
          KPIsForDAVSKPIS.forEach((kpiCode) => {
            const kpiAchievement = kpiData.kpiAchievementForDA.find(
              (item: { kpiCode: string }) => item.kpiCode === kpiCode
            );
            lineDetails[
              getKPInameBySlug(kpiCode)?.clientRefMasterDesc
            ] = kpiAchievement ? kpiAchievement.achievement : 0;
          });

          lineDetails["name"] = getXaxisIntervelValue(intervalType, kpiData.startDate);
          return lineDetails;
        }
      );
      setTrendLineData(xTrendLineData);
      }
    } else {
      if (KPIsForKPIVSDAS.length && (KPIsForKPIVSDAS.includes("totalLoginCount") || KPIsForKPIVSDAS.includes("onDutyAnalysis"))) {
        if (intervalType === "DAY") {
          setYaxisTicks(generateNumners(0, 24, 2));
        } else if (intervalType === "WEEK") {
          setYaxisTicks(generateNumners(0, 60, 5));
        } else if (intervalType === "MONTH") {
          setYaxisTicks(generateNumners(0, 250, 25));
        } else {
          setYaxisTicks(generateNumners(0, 100, 10));
        }
      } else if(KPIsForKPIVSDAS.length && KPIsForKPIVSDAS[0] === "actualBreakDuration") {
        let actualBreakDuration = complianceTrendData.map((associate: IAssociateAchievement) => {
          const actualBreakDurationArray:Array<number> = [];
          associate.deliveryAssociateAchievements &&
          associate.deliveryAssociateAchievements.length &&  
          associate.deliveryAssociateAchievements.map((kpi:any) => {
            actualBreakDurationArray.push(kpi.actualBreakDuration)
          })
          return actualBreakDurationArray;
        })
        let max = Math.max(...actualBreakDuration);
        max = max < 6 ? 6 : max;
        setYaxisTicks(generateNumners(0, max, 6));
      } else {
        setYaxisTicks(generateNumners(0, 100, 10));
      }
      const xtrendLineLegendData = DAsForKPIVSDAS.map((code, index) => {

        const DA: any = findDeliveryAssociateById(code);
        return {
          name: DA && DA.deliveryAssociateName,
          color: colorCodesForTrendGraphLend[index],
          active: true,
        };
      });
      setTrendLineLegendData(xtrendLineLegendData);

      const xTrendLineData = trendData.map(
        (daData: { deliveryAssociateAchievements: any[]; startDate: any; }) => {
          const lineDetails = {};
          DAsForKPIVSDAS.forEach((daId) => {
            const DA: any = findDeliveryAssociateById(daId);
            const daAchievement = daData.deliveryAssociateAchievements.find(
              (item) => item.deliveryAssociateId === daId
            );
            if (KPIsForKPIVSDAS.length && KPIsForKPIVSDAS[0] === "totalLoginCount") {
              lineDetails[
                DA && DA.deliveryAssociateName
              ] = daAchievement ? daAchievement.loginCount : 0;
            } else if(KPIsForKPIVSDAS.length && KPIsForKPIVSDAS[0] === "actualBreakDuration"){
              DAsForKPIVSDAS.forEach((Id) => {

                const PlannedDA: any = findDeliveryAssociateById(Id);
                const PlannedaAchievement = daData.deliveryAssociateAchievements.find(
                  (item) => item.deliveryAssociateId === Id
                );

                lineDetails['deliveryAssociate'+PlannedDA.deliveryAssociateName] = PlannedaAchievement && PlannedaAchievement.deliveryAssociateName ? PlannedaAchievement.deliveryAssociateName : '';
                lineDetails['actualBreakDuration'+PlannedDA.deliveryAssociateName] = PlannedaAchievement && PlannedaAchievement.actualBreakDuration ? PlannedaAchievement.actualBreakDuration : 0;
                lineDetails['plannedBreakDuration'+PlannedDA.deliveryAssociateName] = PlannedaAchievement && PlannedaAchievement.plannedBreakDuration ? PlannedaAchievement.plannedBreakDuration : "N/A";             
               
              })

              lineDetails[
                DA && DA.deliveryAssociateName
              ] = daAchievement ? daAchievement.actualBreakDuration : 0;
              
              
              lineDetails['kpi'] = "actualBreakDuration"; 

             
            } else {
              lineDetails[
                DA && DA.deliveryAssociateName
              ] = daAchievement ? daAchievement.kpiAchievment : 0;
            }
          });
          lineDetails["name"] = getXaxisIntervelValue(intervalType, daData.startDate);
          return lineDetails;
        }
      );
      setTrendLineData(xTrendLineData);
    }
  };

  const generateNumners = (min: number, max: number, interval: number) => {
    const numArray = [];
    for (let i = min; i <= max; i += interval) {
      numArray.push(i);
    }
    return numArray;
  }
  const handleComplianceTrendReportDownload = async (reportType: string) => {
    setShowInfoModal(true);
    const KPIList = kpiList.map(
      (kpi: { clientRefMasterCd: any }) => kpi.clientRefMasterCd
    );
    const payload = {
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
      kpiList: KPIList,
      dmType: selectedSkills,
      reportType: reportType,
    };
    try {
      const { data } = await axios.post(apiMappings.analytics.driverCompliance.avgTotalCompliance.downloadComplianceTrendReport, payload, { responseType: "arraybuffer" })
      FileSaver.saveAs(new Blob([data], { type: `application/zip` }), `${dynamicLabels.Compliance}""${dynamicLabels.Trend}""${moment().format(`DD-MM-YYYY_HH${"-"}mm`)}.zip`)
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  useEffect(() => {
    if (kpiList.length && daListData.length) {
      setTrendTye("DAVSKPIS");
    }
  }, [kpiList, daListData]);

  useEffect(() => {
    setIsKpiOrDa(false);
  }, [hideAllPopups])

  useEffect(() => {
    dasOptionsLHS.sort((a, b) => selectedDasLHS.indexOf(b) - selectedDasLHS.indexOf(a));
    kpisOptionsLHS.sort((a, b) => selectedKpisLHS.indexOf(b) - selectedKpisLHS.indexOf(a));
    dasOptionsRHS.sort((a, b) => selectedDasRHS.indexOf(b) - selectedDasRHS.indexOf(a));
    kpisOptionsRHS.sort((a, b) => selectedKpisRHS.indexOf(b) - selectedKpisRHS.indexOf(a));
  }, [isKpiOrDa])

  useEffect(() => {
    if (trendType) {
      const DAs = trendType === "KPIVSDAS" ? DAsForKPIVSDAS : DAsForDAVSKPIS;
      const KPIs = trendType === "KPIVSDAS" ? KPIsForKPIVSDAS : KPIsForDAVSKPIS;
      fetchComplianceTrendData(trendType, DAs, KPIs, intervalType);
    }
  }, [
    filterData,
    trendType,
    DAsForDAVSKPIS,
    KPIsForDAVSKPIS,
    DAsForKPIVSDAS,
    KPIsForKPIVSDAS,
    intervalType,
  ]);

  useEffect(() => {
    if (complianceTrendData && complianceTrendData.length) {
      buildComplianceTrendData(complianceTrendData);
    } else {
      setTrendLineLegendData([]);
      setTrendLineData([]);
    }
  }, [complianceTrendData, intervalType]);

  useEffect(() => {
    setBarChartData([]);
    setIsKpiOrDa(false);
    dispatch({ type: "@@driverCompliance/FETCH_DEVICE_COMPATIBILITY_COLUMN_STRUCTURE" });    
    dispatch({type: "@@driverCompliance/FETCH_LOGIN_HISTORY_COLUMN_STRUCTURE"});
    dispatch({type: "@@driverCompliance/FETCH_DEVICE_LIST_COLUMN_STRUCTURE"});    
  }, []);
  const handleFetchData = React.useCallback(
    ({
      pageSize,
      pageNumber,
      // sortOptions,
      filterOptions,
    }: any) => {
      const last =
        totalRowsSelector > 0 &&
        valueRef.current &&
        valueRef.current.length &&
        valueRef.current[valueRef.current.length - 1];
      let searchAfter = null;
      const PageOpt = pageOptions;
      if (pageNumber === 1) {
        searchAfter = null;
        setPageOptions([]);
      } else if (currentPagevalueRef.current < pageNumber) {
        const temp = PageOpt.filter(
          (option) => option['pageNum'] === pageNumber - 1
        );
        !temp[0] &&
          PageOpt.push({
            pageNum: pageNumber - 1,
            deliveryAssociate: last['deliveryAssociate'],
            deliveryAssociateId: last['deliveryAssociateId'],
          });
        searchAfter = [last['deliveryAssociate'], last['deliveryAssociateId']];
      } else {
        // const temp = Object.keys(PageOpt).filter((key)=>pageOptions[key].pageNum===pageNumber-1);
        const temp = PageOpt.filter(
          (option) => option['pageNum'] === pageNumber - 1
        );
        searchAfter = [
          temp[0]['deliveryAssociate'],
          temp[0]['deliveryAssociateId'],
        ];
      }
      handlePageChange(pageNumber, PageOpt);
      const payload = {
        size: pageSize,
        searchBy:
          filterOptions && Object.keys(filterOptions).length !== 0
            ? filterOptions.searchBy
            : '',
        searchText:
          filterOptions && Object.keys(filterOptions).length !== 0
            ? filterOptions.searchText
            : '',
        searchAfter: searchAfter,
        startDate: filteredDates?.startDate,
        endDate: filteredDates?.endDate
      };
      setParams(payload);      
      fetchDeviceCompatibilityReport(payload);
    },
    [filteredDates, selectedBranches, selectedDates, selectedSkills]
  );

  const handleFetchLoginHistoryData = React.useCallback(
    ({
      pageSize,
      // pageNumber,
      // sortOptions,
      filterOptions,
    }: ILoginHistoryFetchOption) => {
      let searchAfter = null;
      const payload = {
        size: pageSize,
        searchBy:
          filterOptions && Object.keys(filterOptions).length !== 0
            ? filterOptions.searchBy
            : '',
        searchText:
          filterOptions && Object.keys(filterOptions).length !== 0
            ? filterOptions.searchText
            : '',
        searchAfter: searchAfter,
      };
      const { deliveryAssociateId } = currentAssociate;
      fetchDeliveryAssociateLoginHistory(deliveryAssociateId, payload)
    },
    [currentAssociate]
  );


  const handleFetchDeviceListData = React.useCallback(
    ({
      pageSize,
      // pageNumber,
      // sortOptions,
      filterOptions,
    }: ILoginHistoryFetchOption) => {
      let searchAfter = null;
      const payload = {
        size: pageSize,
        searchBy:
          filterOptions && Object.keys(filterOptions).length !== 0
            ? filterOptions.searchBy
            : '',
        searchText:
          filterOptions && Object.keys(filterOptions).length !== 0
            ? filterOptions.searchText
            : '',
        searchAfter: searchAfter,
      };
      const { deliveryAssociateId } = currentAssociate;
      if(payload.searchBy !== '') {        
           const result = handleDeviceSearch(filterOptions)    
           dispatch({type: '@@driverCompliance/FETCH_DELIVERY_ASSOCIATE_DEVICES_SUCCESS', payload: result})
      } else {
      fetchDeliveryAssociateDevices(deliveryAssociateId, payload)
      }
    },
    [currentAssociate]
  );

  const onSaveColumnPreferences = React.useCallback(
    (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      const columns = { ...columnsSelector };
      Object.keys(columns).forEach((columnKey) => {
        columns[columnKey].permission = !!visibleColumns[columnKey];
      });

      const payload = {
        ...structure,
        columns,
      };
      updateDeviceCompatibilityColumnPreferences(payload);
    },
    [columnsSelector]
  );

  const onSortChange = React.useCallback((sortBy: ISortOptions) => {
    console.log('Sort Changed: ', sortBy);
  }, []);

  const DAcomplainceRef = useRef<HTMLDivElement>(null);

  const handelBoxPlotScroll = () => {
    DAcomplainceRef?.current?.scrollIntoView({behavior: "smooth"});  
  }


  const chartButtonOptions = useMemo(() => [
    { id: "BOXPLOT", label: <FontIcon variant="icon icon-boxplot" size={16} />, selected: chartType === "BOXPLOT"},
    { id: "BARCHART", label: <FontIcon variant="icon icon-barchart" size={16}/>, selected: chartType === "BARCHART"}
  ],[chartType]);

  const selectedCategoryName = useMemo(() => { 
    let kpi = ''
    if(selectedKpiForDAComplianceSummary.length) {
      kpi = selectedKpiForDAComplianceSummary[0].clientRefMasterDesc
    }
    return kpi;
  },[selectedKpiForDAComplianceSummary]);

  const handleDeliveryAssociateLoginHistoryReport = (reportType: string, selectedKPIs: IMultiSelectOptions[]) => {
    handleDeviceCompatibilityReportDownload(reportType, selectedKPIs, params)
  }
 
  const handleFetchSelectedKPIResponse = (selectedArray: IMultiSelectOptions[]) => {
    setSummaryLoading(true)
    const requiredKPIList = [];
    selectedArray.forEach(selectKpi => {
      if (!kpiListDropdownData[selectKpi.clientRefMasterCd]) {
        requiredKPIList.push(selectKpi.clientRefMasterCd)
      }
    });
    const overallSummaryPayLoad = {
      startDate:
        selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.startDate,
      endDate:
        selectedDates && Object.keys(selectedDates).length !== 0
        && selectedDates.endDate,
      branches: selectedBranches,
      clientId: clientId,
      kpiList: requiredKPIList,
      dmType: selectedSkills,
    };
    console.log(overallSummaryPayLoad, "overallSummaryPayLoad");
    if(requiredKPIList.length > 0){
      dispatch({
        type: "@@driverCompliance/FETCH_OVER_ALL_COMPLIANCE_SUMMARY",
        payload: {
          ...overallSummaryPayLoad,
          requestFor: "boxplot",
        },
      });
    }
    setSummaryLoading(false)
  }

  useEffect(() => {
  }, [summaryLoading])

  return (
    <>    
      <div
        style={{
          width: "100%",
          height: "auto",
          minHeight: "400px",
          position: "relative",
        }}
        onClick={() => setIsKpiOrDa(false)}
      >
        <Card
          style={{
            flexGrow: 1,
            backgroundColor: colorCodes.white,
            overflow: "hidden",
            width: "100%",
            marginBottom: "25px",
            minHeight: "300px",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            style={{ width: "100%" }}
            mb="20px"
            mt="10px"
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: 500,
                letterSpacing: "-0.1px",
                color: colorCodes.fontColor,
              }}
            >
              {dynamicLabels.OverallComplianceSummary} of{" "}
              {overAllComplianceData &&
                overAllComplianceData.totalDeliveryAssociates
                ? overAllComplianceData.totalDeliveryAssociates
                : 0}{" "}
              {dynamicLabels.deliveryMedium}
            </div>

            {/* Page Action Buttons */}
            <Box
              display="flex"
              justifyContent="space-evenly"
              horizontalSpacing="10px"
            >                  
              <Position type="relative">
                <MultiSelect
                  id="Colors"
                  width={"300px"}
                  options={kpiListOptionForOverAllSymmary}
                  onChange={(_event, value, _isChecked, selectedArray: any) => {
                    setSelectedKPIs(selectedArray);//xxxxxxx
                    handleFetchSelectedKPIResponse(selectedArray);
                    if (value === "maximum exceeded") {
                      toast.add(`${dynamicLabels.MaximumOf} 8 ${dynamicLabels.KPIsCanBeSelected}.`, "icomoon-warning-circled", true);
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: "0px",
                    zIndex: 9,
                    backgroundColor: colorCodes.white
                  }}
                  isLoading={false}
                  isNoOption={false}
                  menuOpen={false}
                  selected={selectedKPIs}
                  allowSelectAll={false}
                  maximumSelected={8}
                >
                  {({ isMenuOpen, openMenu }) => (
                  <Tooltip message={`${dynamicLabels.selectKpis}`} hover={true} messagePlacement='end'>
                    <Button
                      id="id"
                      variant="button"
                      onClick={() => {
                        openMenu(!isMenuOpen);
                      }}
                      style={{
                        height: "34px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 0px 2px 0px",
                      }}
                    >
                      <React.Fragment>
                        <span>
                          {dynamicLabels.KPI}: 
                          {selectedKPIs.length
                            ? `${selectedKPIs[0].label},  ${selectedKPIs.length - 1} ${dynamicLabels.More}`
                            : ""}
                        </span>
                        <FontIcon
                          style={{
                            fontSize: '9px',
                            height: '9px',
                            lineHeight: "9px"
                          }}
                          variant={isMenuOpen ? "triangle-up" : "triangle-down"}
                          size="xs"
                        />
                      </React.Fragment>
                    </Button>
                    </Tooltip>
                  )}
                </MultiSelect>
              </Position>      
              <ButtonGroup data={chartButtonOptions} onChange={(id) => setChartType(id)}/>
              <IconButton
                intent="page"
                onlyIcon
                iconVariant="icomoon-download"
                iconSize="sm"
                id='delivery_associate_compliance_analytics--actionbar--download'
                onClick={() => setReportModalVisible(true)}
                className="overALlSummaryDownloadBtn"
              />
            </Box>
            {isReportModalVisible && (
              <DownloadReportModal
                title={`${dynamicLabels.download} ${dynamicLabels.report}`}
                handleClose={setReportModalVisible}
                params={params}
                handleComplianceReportDownload={handleComplianceReportDownload}
                handleTrackingReportDownload={handleTrackingReportDownload}
                selectedKPIs={kpiListOptionForOverAllSymmary}
                complianceReport={true}
                trackingReport={true}
                complianceReportButtonTitle={`${dynamicLabels.Compliance} ${dynamicLabels.summary}`}
                trackingReportButtonTitle={`${dynamicLabels.Tracking} ${dynamicLabels.Compliance}`}
                position={{ right: "0px", top: "70px" }}
                dynamicLabels={dynamicLabels}
              />
            )}
          </Box>
        {chartType === "BOXPLOT" ?    //Overall Compliance Summary of 18 Delivery Associates Graph loaders
          <Box mb="20px">
              {!summaryLoading && overAllComplianceSummaryData.deliveryAssociateOverallComplianceSummaryDTO &&
                overAllComplianceSummaryData
                  .deliveryAssociateOverallComplianceSummaryDTO.length ?
          <BoxPlot
            xAxisLabel={`${dynamicLabels.Compliance} ${dynamicLabels.KeyPerformanceIndicator} (${dynamicLabels.KPI})`}
            yAxisLabel={`${dynamicLabels.Achievement} (%)`}
            height={300}
            xAxisTicks={xAxisTicks}
            yAxisTickInterval={20}
            boxPlotData={xboxPlotData}
            scatterPlotData={scatterPlotData}
            lineData={averageCompliance}
            scatterPlotName="OutLiar"
            boxPlotName={dynamicLabels.ComplianceKPI}
            lineName={dynamicLabels.AverageCompliance}
            boxPlotPartColor={boxPlotPartColor}
            tooltipData={toolTip}
            selectedCategoryName={selectedCategoryName}
            onClick={(e) => {
              handelBoxPlotScroll();
              const kpiCd = getKPICodeByCode(e.category)
                ? getKPICodeByCode(e.category).clientRefMasterCd
                : 'totalCompliance'
              const kpi = kpiList.filter((kpi: any) => kpi.clientRefMasterDesc === e.category)
              const kpiForToolTip = overAllComplianceData?.deliveryAssociateOverallComplianceSummaryDTO.find((kpi: { kpiCode: string; }) => kpi && kpi.kpiCode === kpiCd);
              setBarchartMax(100);
              setBarchartMin(50);
              setSelectedKpiForDAComplianceSummary(kpi)
              setSelectedKpiForBarchart({
                category: kpiForToolTip.kpiCode,
                median: parseFloat(kpiForToolTip.median),
                q1: parseFloat(kpiForToolTip.firstQuartile),
                q3: parseFloat(kpiForToolTip.thirdQuartile),
                whiskerHigh: parseFloat(kpiForToolTip.max),
                whiskerLow: parseFloat(kpiForToolTip.min)
              });

              handlePercentChange(
                50,100,
                kpiCd
              );
            }}
            scrattorTooltip={({ value, key }: IScatterTooltip) => {
              let selectedKpi = getKPICodeByCode(key || "");
              const { listOfOutliers } = overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO.filter((kpi: { kpiCode: string; }) => kpi && kpi.kpiCode === selectedKpi.value)[0];
              let deliveryAssociateCount = listOfOutliers.length ? 
              listOfOutliers.filter((kpi: { kpiAchievment: number }) => kpi && kpi.kpiAchievment === value).length : 0;             
              return `<div>Outlier: ${value}${dynamicLabels.percent}</div>
                      <div>No. of ${dynamicLabels.deliveryAssociate}s: ${deliveryAssociateCount}</div>`;
            }}
            boxPlotToolTip={({
              category
            }: any) => {
              const kpiCd = getKPICodeByCode(category)
                ? getKPICodeByCode(category).clientRefMasterCd
                : 'totalCompliance'
              const kpiForToolTip = overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO.filter((kpi: { kpiCode: string; }) => kpi && kpi.kpiCode === kpiCd)[0];
              const tooltipText = `
                      <table style="border-collapse:separate;border-spacing: 0 5px;overflow-wrap: break-word;padding-left:5px;">
                        <tr>
                          <td style="width:20px;height:15px;margin-right: 5px;">
                            <div style="display:inline;">25th ${dynamicLabels.Percentile}: ${kpiForToolTip.firstQuartile}%</div>
                          </td>
                          <td style="width:20px;height:15px;margin-right: 5px;">
                            <div class="color-box"  style="background-color: ${colorCodes.medianColor};width:10px !important;height:10px !important"></div>
                            <div style="display:inline;">50th ${dynamicLabels.Percentile}: ${kpiForToolTip.median}%</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="width:20px;height:15px;margin-right: 5px;">
                            <div style="display:inline;">75th ${dynamicLabels.Percentile}: ${kpiForToolTip.thirdQuartile}%</div>
                          </td>
                          <td style="width:20px;height:15px;margin-right: 5px;">
                            <div class="color-box"  style="background-color: #f05548;width:10px !important;height:10px !important"></div>
                            <div style="display:inline;">Average: ${kpiForToolTip.mean}%</div>
                          </td>
                        </tr>
                      </table>
                      <table style="border-collapse:separate;border-spacing: 0 5px;overflow-wrap: break-word;border-top: 2px solid #fff;margin: 10px 0 0;padding:10px 0 0">
                        <tr>
                          <th style="height:15px;margin-right: 5px;text-align:center">
                            <div style="display:inline;">${dynamicLabels.Achievement} (%)</div>
                          </th>
                          <th style="text-align:center">
                            <div style="display:inline;">No. of ${dynamicLabels.deliveryMedium}</div>
                          </th>
                        </tr>
                        ${kpiForToolTip.min !== kpiForToolTip.firstQuartile ? `
                        <tr>
                          <td style="height:15px;margin-right: 5px;text-align:center">
                            <div style="display:inline;">${kpiForToolTip.min}% - ${kpiForToolTip.firstQuartile}%</div> 
                          </td>
                          <td style="text-align:center">
                            <div style="display:inline;">${kpiForToolTip.countMinAndFirstQ}</div>
                          </td>
                        </tr>`
                        : ''}
                        ${kpiForToolTip.firstQuartile !== kpiForToolTip.median ? 
                          `<tr>
                            <td style="width:20px;height:15px;margin-right: 5px;text-align:center">
                              <div style="display:inline;">${kpiForToolTip.min !== kpiForToolTip.firstQuartile ? (kpiForToolTip.firstQuartile + 0.01).toFixed(2) : kpiForToolTip.firstQuartile}% - ${kpiForToolTip.median}%</div> 
                            </td>
                            <td style="text-align:center">
                              <div style="display:inline;">${kpiForToolTip.countFirstQAndMedian}</div>
                            </td>
                          </tr>`
                        :''}

                        ${kpiForToolTip.median !== kpiForToolTip.thirdQuartile ?                     
                          `<tr>
                            <td style="width:20px;height:15px;margin-right: 5px;text-align:center">
                              <div style="display:inline;">${kpiForToolTip.firstQuartile !== kpiForToolTip.median ? (kpiForToolTip.median + 0.01).toFixed(2) : kpiForToolTip.median}% - ${kpiForToolTip.thirdQuartile}%</div>
                            </td>
                            <td style="text-align:center">
                              <div style="display:inline;">${kpiForToolTip.countMedianAndThirdQ}</div>
                            </td>
                          </tr>`
                        :''}
                        ${kpiForToolTip.thirdQuartile !== kpiForToolTip.max ?
                          `<tr>
                          <td style="width:20px;height:15px;margin-right: 5px;text-align:center">
                            <div style="display:inline;">${kpiForToolTip.thirdQuartile !== 0 && kpiForToolTip.max !== 0 ? (kpiForToolTip.thirdQuartile + 0.01).toFixed(2): kpiForToolTip.thirdQuartile}% - ${kpiForToolTip.max}%</div>
                          </td>
                          <td style="text-align:center">
                            <div style="display:inline;">${kpiForToolTip.countThirdQAndMax}</div>
                          </td>
                        </tr>`
                        : ""}

                        ${kpiForToolTip.min === 0 && kpiForToolTip.firstQuartile === 0 && kpiForToolTip.median === 0 && kpiForToolTip.thirdQuartile === 0 && kpiForToolTip.max === 0 ?
                          `<tr>
                          <td style="width:20px;height:15px;margin-right: 5px;text-align:center">
                            <div style="display:inline;">${kpiForToolTip.min}%</div>
                          </td>
                          <td style="text-align:center">
                            <div style="display:inline;">${kpiForToolTip.countMinAndFirstQ}</div>
                          </td>
                        </tr>` : 
                        kpiForToolTip.min === 100 && kpiForToolTip.firstQuartile === 100 && kpiForToolTip.median === 100 && kpiForToolTip.thirdQuartile === 100 && kpiForToolTip.max === 100 ?
                        `<tr>
                        <td style="width:20px;height:15px;margin-right: 5px;text-align:center">
                          <div style="display:inline;">${kpiForToolTip.max}%</div>
                        </td>
                        <td style="text-align:center">
                          <div style="display:inline;">${kpiForToolTip.countThirdQAndMax}</div>
                        </td>
                      </tr>`
                      : kpiForToolTip.min === 0 && kpiForToolTip.firstQuartile === 0 && kpiForToolTip.median === 0 && kpiForToolTip.thirdQuartile === 0 && kpiForToolTip.max === 0 ?
                        `<tr>
                        <td style="width:20px;height:15px;margin-right: 5px;text-align:center">
                          <div style="display:inline;">${kpiForToolTip.min}%</div>
                        </td>
                        <td style="text-align:center">
                          <div style="display:inline;">${kpiForToolTip.countMinAndFirstQ}</div>
                        </td>
                      </tr>`:''}
                       
                       </table>`
              return tooltipText
            }}
          />
          : <div id="loader" style={{ zIndex: 1, display: "flex", height: "300px", padding: "10px", alignItems: "center", justifyContent: "center", background: "white", width: "98%", position: "relative", top: "0px" }}>
          <div className="logi-spinner" style={{ marginTop: "20px" }}>
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>}
          </Box>
        :
        <Box style={{marginTop: 70}} className="overall-compliance-barchart">
          {!summaryLoading && overAllComplianceSummaryData.deliveryAssociateOverallComplianceSummaryDTO &&
            overAllComplianceSummaryData
            .deliveryAssociateOverallComplianceSummaryDTO.length?

          <BarChart
            details={overAllComplianceBarChartData}             
            barGap={100}
            labelAngle={0}
            showXaxis={true}
            xAxisLabel={`${dynamicLabels.Compliance} ${dynamicLabels.KeyPerformanceIndicator} (${dynamicLabels.KPI})`}
            yAxisLabel={`${dynamicLabels.Average} ${dynamicLabels.Achievement} (%)`}
            legendData={overAllComplianceBartChartLegends}
            lineData={[]}
            showYaxis={true}
            height={380}
            toolTipVariant="withKpi"
            tinyChartData={[]}
            tinyChartTitleList={[]}
            tinyChartLabelAngle={0}
            onChange={(e) => console.log(e)}
            showTinyChart={false}
            selectedBarName={selectedCategoryName}
            legendFullwidth={true}
            onClick={(e) => {      
              handelBoxPlotScroll();
              const kpiCd = getKPICodeByCode(e.name)
                ? getKPICodeByCode(e.name).clientRefMasterCd
                : 'totalCompliance'
              const kpiForToolTip = overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO.find((kpi: { kpiCode: string; }) => kpi && kpi.kpiCode === kpiCd);
              setBarchartMax(100);
              setBarchartMin(50);
              setSelectedKpiForBarchart({
                category: kpiForToolTip.kpiCode,
                median: parseFloat(kpiForToolTip.median),
                q1: parseFloat(kpiForToolTip.firstQuartile),
                q3: parseFloat(kpiForToolTip.thirdQuartile),
                whiskerHigh: parseFloat(kpiForToolTip.max),
                whiskerLow: parseFloat(kpiForToolTip.min)
              });
              const kpi = kpiList.filter((kpi: any) => kpi.clientRefMasterDesc === e.name)
              setSelectedKpiForDAComplianceSummary(kpi);              
              handlePercentChange(
                50,
                100,
                kpiCd
              );
            }}
            barChartTooltip={({ value, name }: IBarChartTooltip) => {
              const kpiCd = getKPICodeByCode(String(name))
              ? getKPICodeByCode(String(name)).clientRefMasterCd
              : 'totalCompliance'
              const kpiForToolTip = overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO.filter((kpi: { kpiCode: string; }) => kpi && kpi.kpiCode === kpiCd)[0];
              return <BarChartTooltip 
                        kpiAchivement={value}
                        percentage={kpiForToolTip}
                    />;
            }}
            />
            : <div id="loader" style={{ zIndex: 1, display: "flex", height: "300px", padding: "10px", alignItems: "center", justifyContent: "center", background: "white", width: "98%", position: "relative", top: "0px" }}>
                  <div className="logi-spinner" style={{ marginTop: "20px" }}>
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div>
                </div>
                }
          </Box>
          }
        </Card>
          <Card
            style={{
              flexGrow: 1,
              backgroundColor: colorCodes.white,
              overflow: "hidden",
              width: "100%",
              marginTop: 20,
            }}
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-start"
              style={{ width: "100%" }}
              mb="70px"
              mt="10px"
            >
              <div>
              <div
                ref={DAcomplainceRef}
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: colorCodes.fontColor,
                  marginBottom: "5px",
                  letterSpacing: "-0.1px"
                }}
              >
                {dynamicLabels.deliveryMedium} {dynamicLabels.Compliance}{" "}
                {dynamicLabels.summary}
              </div>
              <div className="complianceSummaryDropdown">
                <span style={{ opacity: 0.73 }}>
                  {dynamicLabels.deliveryMedium}{" "}
                  {dynamicLabels.havingAchievementBetween}
                </span>
                <DropDown
                  variant="list-view"
                  optionList={barChartMinOptions}
                  onChange={(e: number) => {
                    setBarchartMin(e);
                    handlePercentChange(
                      e,
                      barchartMax,
                      selectedKpiForBarchart.category
                    );
                  }}
                  value={barchartMin}
                  width="65px"
                />

                <span style={{ opacity: 1 }}>{` and `}</span>

                <DropDown
                  variant="list-view"
                  optionList={barChartMaxOptions}
                  onChange={(e: number) => {
                    setBarchartMax(e);
                    handlePercentChange(
                      barchartMin,
                      e,
                      selectedKpiForBarchart.category
                    );
                  }}
                  value={barchartMax}
                  width="65px"
                />
              </div>
              </div>
             <Box className="totalOrdersKpi">
             <Position type="relative">
                <MultiSelect
                  id="Colors"
                  width={"300px"}
                  options={kpiListForDAComplianceSummary}
                  onChange={(_event, _value, _isChecked, selectedArray: any) => {
                      const selectedDataTemp = selectedArray.filter((a: any) => !selectedKpiForDAComplianceSummary.includes(a));  
                      const selectedKpi = overAllComplianceData.deliveryAssociateOverallComplianceSummaryDTO.find((kpi: { kpiCode: string; }) => kpi && kpi.kpiCode === _value);
                      setSelectedKpiForBarchart({
                        category: selectedKpi.kpiCode,
                        median: parseFloat(selectedKpi.median),
                        q1: parseFloat(selectedKpi.firstQuartile),
                        q3: parseFloat(selectedKpi.thirdQuartile),
                        whiskerHigh: parseFloat(selectedKpi.max),
                        whiskerLow: parseFloat(selectedKpi.min)
                      });
                      setSelectedKpiForDAComplianceSummary(selectedDataTemp)
                      handlePercentChange(50,100,_value)                      
                  }}
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: "0px",
                    zIndex: 9,
                    backgroundColor: colorCodes.white
                  }}
                  isLoading={false}
                  isNoOption={false}
                  menuOpen={false}
                  allowSelectAll={false}                  
                  selected={selectedKpiForDAComplianceSummary}
                >
                  {({ isMenuOpen, openMenu }) => (
                  <Tooltip message={`${dynamicLabels.selectKpi}`} hover={true} messagePlacement='end'>
                    <Button
                      id="id"
                      variant="button"
                      onClick={() => {
                        openMenu(!isMenuOpen);
                      }}
                      style={{
                        height: "34px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 0px 2px 0px",
                      }}
                    >
                      <React.Fragment>
                        <span>
                          {dynamicLabels.KPI}: {dynamicLabels.TotalCompliance}
                          {selectedKpiForDAComplianceSummary.length
                            ? `,  ${selectedKpiForDAComplianceSummary.length} ${dynamicLabels.More}`
                            : ""}
                        </span>
                        <FontIcon
                          style={{
                            fontSize: '9px',
                            height: '9px',
                            lineHeight: "9px"
                          }}
                          variant={isMenuOpen ? "triangle-up" : "triangle-down"}
                          size="xs"
                        />
                      </React.Fragment>
                    </Button>
                    </Tooltip>
                  )}
                </MultiSelect>
              </Position>
            </Box>
            </Box>
            {barChartData.length ? (  
            <BarChart
              details={barChartData}
              barGap={0}
              labelAngle={330}
              showXaxis={true}
              xAxisLabel={dynamicLabels.deliveryMedium}
              yAxisLabel={`${dynamicLabels.Achievement} (%)`}
              legendData={barChartLegendData}
              lineData={barChartLineData}
              showYaxis={true}
              height={650}
              toolTipVariant="withKpi"
              tinyChartData={barChartTinyChartData}
              tinyChartTitleList={barChartTinyChartTitleList}
              onChange={(e) => console.log(e)}
              tinyChartLabelAngle={330}
              disableClick={true}
              showTinyChart={barChartData.length >= 20 ? true : false}
              magnifierEndIndex={barChartData.length > 30 ? 30 : barChartTinyChartData.length}
              tooltipTitleList={[
                `${dynamicLabels.KPI}:`,
                `${dynamicLabels.deliveryAssociate}:`,
                `${dynamicLabels.Achievement}:`
              ]}
                />          
            ) : (
              <div>                
                  <Box
                    display="flex"
                    justifyContent="center"
                    style={{ width: "100%", height: 300, overflow: "hidden" }}
                    mb="20px"
                    mt="20px"
                  >
                    <div>
                      {dynamicLabels.noDataAvailableFor}{" "}
                      {dynamicLabels.deliveryMedium} {dynamicLabels.Compliance}{" "}
                      {dynamicLabels.summary}
                    </div>
                  </Box>
              </div>
              )}
          </Card>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="flex-start"
          style={{
            width: "100%",
            fontSize: "17px",
            fontWeight: "normal",
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: "normal",
            color: colorCodes.black,
            letterSpacing: '0.17px'
          }}
          mb="20px"
          mt="20px"
        >
          {dynamicLabels.deliveryAssociate} {dynamicLabels.Compliance}{" "}
          {dynamicLabels.Trend}
        </Box>
        {daListOptions?.length ? (
          <Card
            style={{
              flexGrow: 1,
              backgroundColor: "#fff",
              overflow: "hidden",
              width: "100%",
              marginTop: 20,
            }}
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="flex-start"
              justifyContent="space-between"
              style={{ width: "100%" }}
              mb="100px"
              mt="10px"
            >
              <Box
                display="flex"
                flexDirection="row"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <div
                  style={{
                    fontWeight: 500,
                    color: colorCodes.gray,
                    marginBottom: "5px",
                  }}
                >
                  <TrendCardLabel>{dynamicLabels.Compliance} {dynamicLabels.Achievement} {dynamicLabels.Comparision}</TrendCardLabel>
                  <div style={{ margin: "0 10px", display: "inline" }}>
                    <FontIcon
                      variant="angle-right"
                      color={colorCodes.gray}
                      size={10}
                      style={{ margin: "0 10px", verticalAlign: "unset" }}
                    />
                  </div>
                  <span className="select-dropdown-davskpis-wrapper kpiVsDa">
                    <IconButton
                      onClick={(e) => {
                        setIsKpiOrDa(!isKpiOrDa);
                        e.stopPropagation();
                      }}
                      primary={false}
                      disabled={false}
                      intent="page"
                      iconVariant="angle-down"
                      className="select-dropdown-davskpis"
                    >
                      {trendType === "DAVSKPIS"
                        ? dynamicLabels.ComplianceKPI
                        : dynamicLabels.deliveryMedium}
                    </IconButton>
                    {isKpiOrDa && (
                      <Box
                        className="with-button-dropdown-wrapper"
                        style={{ position: "absolute", zIndex: 9 }}
                      >
                        <Position type="relative">
                          <MultiSelect
                            id="dasLHS"
                            width={"300px"}
                            onClick={(e) => e.stopPropagation()}
                            options={dasOptionsLHS}
                            onChange={(
                              _event,
                              value,
                              _isChecked,
                              selectedArray: any
                            ) => {
                              setSelectedDasLHS(selectedArray);
                              setDAsForKPIVSDAS(
                                selectedArray.map(
                                  (selected: { value: any }) => selected.value
                                )
                              );
                              if (value === "maximum exceeded") {
                                toast.add(`${dynamicLabels.MaximumOf} 10 ${dynamicLabels.DeliveryAssociatesCanBeSelected}.`, "icomoon-warning-circled", true);
                              }
                            }}
                            style={{
                              position: "absolute",
                              top: "0px",
                              left: "170px",
                              zIndex: 9,
                              backgroundColor: colorCodes.white
                            }}
                            isLoading={false}
                            isNoOption={false}
                            menuOpen={false}
                            allowSelectAll={false}
                            selected={selectedDasLHS}
                            maximumSelected={10}
                            searchableKeys={["phoneNumber", "userName", "label"]}
                          >
                            {({ isMenuOpen, openMenu }) => (
                              <Button
                                id="dasLHSButton"
                                variant="button"
                                onClick={(e) => {
                                  openMenu(!isMenuOpen);
                                  setTrendTye("KPIVSDAS");
                                  e.stopPropagation();
                                }}
                                style={{
                                  height: "34px",
                                  boxShadow:
                                    "rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 0px 2px 0px",
                                  fontSize: "15px",
                                }}
                              >
                                <React.Fragment>
                                  <span>{dynamicLabels.deliveryMedium}</span>
                                  <FontIcon variant="angle-right" size="sm" />
                                </React.Fragment>
                              </Button>
                            )}
                          </MultiSelect>
                        </Position>
                        <Position type="relative">
                          <MultiSelect
                            id="kpisLHS"
                            width={"300px"}
                            options={kpisOptionsLHS.filter((kpi: { value: string; }) => kpi.value !== "totalLoginCount" && kpi.value !== "onDutyAnalysis" && kpi.value !== "actualBreakDuration")}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(
                              _event,
                              value,
                              _isChecked,
                              selectedArray: any
                            ) => {
                              setSelectedKpisLHS(selectedArray);
                              setKPIsForDAVSKPIS(
                                selectedArray.map(
                                  (selected: { value: any }) => selected.value
                                )
                              );
                              if (value === "maximum exceeded") {
                                toast.add(`${dynamicLabels.MaximumOf} 10 ${dynamicLabels.KPIsCanBeSelected}.`, "icomoon-warning-circled", true);
                              }
                            }}
                            style={{
                              position: "absolute",
                              top: "0px",
                              left: "170px",
                              zIndex: 9,
                              backgroundColor: colorCodes.white
                            }}
                            isLoading={false}
                            isNoOption={false}
                            menuOpen={false}
                            allowSelectAll={false}
                            selected={selectedKpisLHS}
                            maximumSelected={10}
                          >
                            {({ isMenuOpen, openMenu }) => (
                              <Button
                                id="kpisLHSButton"
                                variant="button"
                                onClick={(e) => {
                                  openMenu(!isMenuOpen);
                                  setTrendTye("DAVSKPIS");
                                  e.stopPropagation();
                                }}
                                style={{
                                  height: "34px",
                                  boxShadow:
                                    "rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 0px 2px 0px",
                                  fontSize: "15px",
                                }}
                              >
                                <React.Fragment>
                                  <span>{dynamicLabels.ComplianceKPI}</span>
                                  <FontIcon variant="angle-right" size="sm" />
                                </React.Fragment>
                              </Button>
                            )}
                          </MultiSelect>
                        </Position>
                      </Box>
                    )}
                  </span>
                  <span
                    style={{
                      margin: "0 10px",
                      fontSize: "17px",
                      fontWeight: 500,
                      color: colorCodes.gray,
                    }}
                  >
                    v/s
                  </span>
                  <span className="select-dropdown-davskpis-wrapper">
                    {trendType === "DAVSKPIS" && (
                      <Position type="relative">
                        <MultiSelect
                          id="dasRHS"
                          width={"300px"}
                          options={dasOptionsRHS}
                          onChange={(
                            _event,
                            _value,
                            _isChecked,
                            selectedArray: any
                          ) => {
                            const selectedDataTemp = selectedArray.filter((a: any) => !selectedDasRHS.includes(a));
                            setSelectedDasRHS(selectedDataTemp);
                            setDAsForDAVSKPIS(
                              selectedDataTemp.map(
                                (selected: { value: any }) => selected.value
                              )
                            );
                          }}
                          style={{
                            position: "absolute",
                            top: "45px",
                            right: "0px",
                            zIndex: 9,
                            backgroundColor: colorCodes.white
                          }}
                          isLoading={false}
                          isNoOption={false}
                          menuOpen={false}
                          allowSelectAll={false}
                          selected={selectedDasRHS}
                          searchableKeys={["phoneNumber", "userName", "label"]}
                        >
                          {({ isMenuOpen, openMenu }) => (
                            <Button
                              id="dasRHSButton"
                              variant="button"
                              onClick={() => {
                                openMenu(!isMenuOpen);
                                setIsKpiOrDa(false);
                              }}
                              style={{
                                height: "34px",
                                boxShadow: "none",
                                paddingLeft: 0,
                                fontSize: "17px",
                              }}
                            >
                              <React.Fragment>
                                <span>{dynamicLabels.deliveryMedium}</span>
                                <FontIcon variant="angle-down" size="sm" />
                              </React.Fragment>
                            </Button>
                          )}
                        </MultiSelect>
                      </Position>
                    )}
                    {trendType === "KPIVSDAS" && (
                      <Position type="relative">
                        <MultiSelect
                          id="kpisRHS"
                          width={"300px"}
                          options={kpisOptionsRHS}
                          onChange={(
                            _event,
                            _value,
                            _isChecked,
                            selectedArray: any
                          ) => {
                            const selectedDataTemp = selectedArray.filter((a: any) => !selectedKpisRHS.includes(a));
                            setSelectedKpisRHS(selectedDataTemp);
                            setKPIsForKPIVSDAS(
                              selectedDataTemp.map(
                                (selected: { value: any }) => selected.value
                              )
                            );
                          }}
                          style={{
                            position: "absolute",
                            top: "45px",
                            right: "0px",
                            zIndex: 9,
                            backgroundColor: colorCodes.white
                          }}
                          isLoading={false}
                          isNoOption={false}
                          menuOpen={false}
                          allowSelectAll={false}
                          selected={selectedKpisRHS}
                        >
                          {({ isMenuOpen, openMenu }) => (
                            <Button
                              id="kpisRHSButton"
                              variant="button"
                              onClick={() => {
                                openMenu(!isMenuOpen);
                                setIsKpiOrDa(false);
                              }}
                              style={{
                                height: "34px",
                                boxShadow: "none",
                                paddingLeft: 0,
                                fontSize: "17px",
                              }}
                            >
                              <React.Fragment>
                                <span>{dynamicLabels.ComplianceKPI}</span>
                                <FontIcon variant="angle-down" size="sm" />
                              </React.Fragment>
                            </Button>
                          )}
                        </MultiSelect>
                      </Position>
                    )}
                  </span>
                </div>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                style={{ position: "relative" }}
                mt="4px"
              >
                <ButtonGroup
                  data={(KPIsForDAVSKPIS.some((val)=>trackingData.includes(val)) || trackingData.includes(KPIsForKPIVSDAS.toString())) ? buttonGroupOptionsWithHour : buttonGroupOptions}
                  onChange={(id) => setIntervalType(id)}
                />
                <IconButton
                  id="DACompliance-Download-actionBar-Average"
                  intent="page"
                  onlyIcon
                  iconVariant="icomoon-download"
                  iconSize="sm"
                  onClick={() => setTrendReportModalVisible(true)}
                  className="trendLineDownloadBtn"
                />
                {isTrendReportModalVisible && (
                  <DownloadReportModal
                    title={`${dynamicLabels.download} ${dynamicLabels.report} Trend`}
                    handleClose={setTrendReportModalVisible}
                    handleComplianceReportDownload={
                      handleComplianceTrendReportDownload
                    }
                    selectedKPIs={kpiList}
                    complianceReport={true}
                    trackingReport={false}
                    complianceReportButtonTitle={`${dynamicLabels.Compliance} ${dynamicLabels.Trend}`}
                    position={{ right: "0px", top: "50px" }}
                    dynamicLabels={dynamicLabels}
                  />
                )}
              </Box>
            </Box>
            
            {trendLineData && trendLineData.length ? (  
              <LineChart
                details={(trendType === "DAVSKPIS" && DAsForDAVSKPIS?.length) || (trendType === "KPIVSDAS" && KPIsForKPIVSDAS?.length) ? trendLineData : []}
                labelAngle={trendLineData?.length > 10 ? -30 : -10}
                showXaxis={true}
                xAxisLabel={"Date"}
                yAxisLabel={(trendType === "KPIVSDAS" && (KPIsForKPIVSDAS.length && yAxisLabels[KPIsForKPIVSDAS[0]])) ? yAxisLabels[KPIsForKPIVSDAS[0]] : `${dynamicLabels.Achievement} (%)`}
                legendData={trendLineLegendData}
                showYaxis={true}
                height={800}
                _ticks={yAxisTicks}
                onChange={() => { console.log("Legend data changed") }}
                showTinyChart={trendLineData.length >= 20 ? true : false}
                magnifierStartIndex={trendLineData.length >= 30 ? trendLineData.length - 30 : trendLineData.length}
                startWithXaxis={true}
                onClick={() => console.log("Line Clicked")}
                tickInPercentage={!(trendType === "KPIVSDAS" && (KPIsForKPIVSDAS.length && KPIsForKPIVSDAS[0] === "totalLoginCount" || KPIsForKPIVSDAS[0] === "actualBreakDuration"))}
                lineChartTooltip={({ label, selectedColor, legendData, details }) => {
                  return (
                    <TrendLineChartTooltip
                      dynamicLabels={dynamicLabels}
                      activeKpi={trendType === "KPIVSDAS" ? KPIsForKPIVSDAS[0] : "plannedRoute"}
                      label={label || ''}
                      legendData={legendData || []}
                      selectedColor={selectedColor || colorCodes.blue}
                      details={details || []}
                    />
                    ) 
                }}
              />
            ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  style={{ width: "100%", height: "600px" }}
                  mb="20px"
                  mt="20px"
                >
                  <div>
                    {dynamicLabels.noDataAvailableFor}{" "}
                    {dynamicLabels.deliveryMedium} {dynamicLabels.Compliance}{" "}
                    {dynamicLabels.trend}
                  </div>
                </Box>
              )}
          </Card>
        ) : (
            <Card
              style={{
                flexGrow: 1,
                backgroundColor: colorCodes.white,
                overflow: "hidden",
                width: "100%",
                marginTop: "20px",
                height: 300,
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                style={{ width: "100%" }}
                mb="20px"
                mt="20px"
              >
                <div>
                  {dynamicLabels.noDataAvailableFor}{" "}
                  {dynamicLabels.deliveryMedium} {dynamicLabels.Compliance}{" "}
                  {dynamicLabels.trend}
                </div>
              </Box>
            </Card>
          )}
        {(isLoading || summaryLoading) && <Loader center={true} fadeBackground={false} speed={1} />}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="flex-start"
          style={{
            width: "100%",
            fontSize: "17px",
            fontWeight: "normal",
            fontStretch: "normal",
            fontStyle: "normal",
            lineHeight: "normal",
            letterSpacing: "0.17px",
            color: colorCodes.black
          }}
          mb="20px"
          mt="20px"
        >
          {dynamicLabels.deliveryAssociate} {dynamicLabels.Device}{" "}
          {dynamicLabels.Compatibility}
        </Box>
        {/* device compatibility report*/}
        <Card
          style={{
            width: "100%",
            background: colorCodes.white,
            padding: "20px 10px",
            margin: "15px 0",
            display: "flex",
            minHeight: "400px",
            position: "relative",
          }}
        >
          {columns.length > 0 && (
            <ListView
              rowIdentifier="deliveryAssociateId"
              className="delivery-associate-device-compatibility-report"
              columns={columns}
              isColumnLoading={isListViewLoading}
              data={rowsSelector}
              totalRows={totalRowsSelector}
              loading={isListViewLoading}
              onSortChange={onSortChange}
              onSaveColumnPreferences={onSaveColumnPreferences}
              onFetchData={handleFetchData}
              style={{ height: "90vh", width: "100%" }}
            >
              {{
                IconBar: 
                <Tooltip message={`${dynamicLabels.download} ${dynamicLabels.Device} ${dynamicLabels.Compatibility} ${dynamicLabels.report}`} hover messagePlacement='end'>
                  <IconButton
                    onlyIcon
                    id="DACompliance-Download-Average"
                    iconVariant="icomoon-download"
                    onClick={() => setDeviceCompaitibilityModalVisible(true)}
                    iconSize={16} 
                    style={{ color: 'inherit' }}
                    className="deviceCompatibilityReportDownloadBtn"
                  />
                </Tooltip>
              }}
            </ListView>
          )}
          {/* {(loading || isLoading) && (
            <Loader center={true} fadeBackground={true} speed={1} />
          )} */}
          {isDeviceCompaitibilityModalVisible && (
            <DownloadReportModal
              title={`${dynamicLabels.download} ${dynamicLabels.report} ${dynamicLabels.Login} ${dynamicLabels.logout}`}
              handleClose={setDeviceCompaitibilityModalVisible}
              handleComplianceReportDownload={
                handleDeliveryAssociateLoginHistoryReport
              }
              selectedKPIs={kpiList}
              complianceReport={true}
              trackingReport={false}
              params={params}
              complianceReportButtonTitle={`${dynamicLabels.Login || "Login"} ${dynamicLabels.logout || "Logout"} ${dynamicLabels.report}`}
              position={{ right: "0px", top: "50px" }}
              dynamicLabels={dynamicLabels}
            />
          )}
        </Card>


        {/* LOGIN HISTORY MODAL */}
        <Modal
          onToggle={() => {
            setLoginHistoryVisible(false)
            dispatch({type: "@@driverCompliance/SET_DELIVERY_ASSOCIATE_LOGIN_HISTORY_LOADING"})
          }}
          open={isLoginHistoryVisible}
          width="715px"
          children={{
            header: (
              <ModalHeader
                headerTitle={dynamicLabels.LogInHistory}
                width="715px"
                handleClose={() => {
                  setLoginHistoryVisible(false)
                  dispatch({type: "@@driverCompliance/SET_DELIVERY_ASSOCIATE_LOGIN_HISTORY_LOADING"})                  
                }}
                imageVariant="icomoon-close"
                headerStyle={{ fontSize: "15px" }}
              />
            ),
            content: (
              <>
                <Box display="flex" justifyContent="flex-start">
                    <AssociateMeta className="associate-meta">
                    <AssociateLabel>
                      {dynamicLabels.deliveryAssociate} {dynamicLabels.name}
                    </AssociateLabel>
                    <AssociateDesc>{currentAssociate?.deliveryAssociate}</AssociateDesc>
                    </AssociateMeta>
                  <AssociateMeta className="associate-meta">
                    <AssociateLabel>
                      {dynamicLabels.user}{dynamicLabels.name}
                    </AssociateLabel>
                    <AssociateDesc>{currentAssociate?.userName}</AssociateDesc>
                  </AssociateMeta>
                  <AssociateMeta className="associate-meta">
                    <AssociateLabel>
                      {dynamicLabels.Phone} {dynamicLabels.Number}
                    </AssociateLabel>
                    <AssociateDesc>{currentAssociate?.phoneNumber}</AssociateDesc>
                  </AssociateMeta>
                </Box>
                <Box
                  horizontalSpacing="5px"
                  style={{ maxHeight: 250, boxShadow: "0 1px 8px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)", overflow: "hidden" }}
                  justifyContent="center"
                >

                {loginHistoryColumns.length > 0 && (
                  <ListView
                    rowIdentifier="loginTime"
                    hideColumnSettings={true}
                    hidePaginationBar={true}
                    hideRefresh={true}
                    className="delivery-associate-login-history-report"
                    columns={loginHistoryColumns}
                    data={loginHistoryRowsSelector}
                    loading={isLoginHistoryListViewLoading}
                    isColumnLoading={isLoginHistoryListViewLoading}
                    onFetchData={handleFetchLoginHistoryData}
                    style={{ height: "45vh", width: "100%" }}
                  />
                )}
                
                </Box>
              </>
            ),
            footer: (
              <Box
                horizontalSpacing="10px"
                display="flex"
                justifyContent="flex-end"
                p="15px"
              >
                <IconButton
                  iconVariant="icomoon-close"
                  iconSize={11}
                  onClick={() => {
                    setLoginHistoryVisible(false)
                    dispatch({type: "@@driverCompliance/SET_DELIVERY_ASSOCIATE_LOGIN_HISTORY_LOADING"})
                  }}
                >
                  {dynamicLabels.cancel}
                </IconButton>
              </Box>
            ),
          }}
        />

        {/* DEVICE LIST MODAL */}
        <Modal
          onToggle={() => {
            setDevicesVisible(false)
            dispatch({type: "@@driverCompliance/SET_DEVICELIST_LOADING"})            
          }}
          open={isDevicesVisible}
          width="960px"
          children={{
            header: (
              <ModalHeader
                headerTitle={dynamicLabels.Devices}
                width="960px"
                handleClose={() => {
                  setDevicesVisible(false)
                  dispatch({type: "@@driverCompliance/SET_DEVICELIST_LOADING"})
                }}
                imageVariant="icomoon-close"
                headerStyle={{ fontSize: "15px" }}
              />
            ),
            content: (
              <Box
                horizontalSpacing="5px"
                style={{ maxHeight: 250, boxShadow: "0 1px 8px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)" }}
              >

                {deviceListColumns.length > 0 && (
                  <ListView
                    rowIdentifier="phoneModel"
                    hideColumnSettings={true}
                    hidePaginationBar={true}
                    hideRefresh={true}
                    className="delivery-associate-device-list-report"
                    columns={deviceListColumns}
                    data={deviceListRowsSelector}
                    isColumnLoading={isDeviceListViewLoading}
                    loading={isDeviceListViewLoading}
                    onFetchData={handleFetchDeviceListData}
                    style={{ height: "45vh", width: "100%", overflow: 'auto' }}
                  />
                  )}
              </Box>
            ),
            footer: (
              <Box
                horizontalSpacing="10px"
                display="flex"
                justifyContent="flex-end"
                p="15px"
              >
                <IconButton
                  iconVariant="icomoon-close"
                  iconSize={11}
                  onClick={() => {
                    setDevicesVisible(false)
                    dispatch({type: "@@driverCompliance/SET_DEVICELIST_LOADING"})
                  }}
                >
                  {dynamicLabels.cancel}
                </IconButton>
              </Box>
            ),
          }}
        />
      </div>
    </>
  );
};

export default AverageTotalCompliance;
