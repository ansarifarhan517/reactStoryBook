import { IRowData as IDriverData } from '../../Driver/DriverListView/DriverListView.models';
import { IRowData as IVehicleData } from '../../Vehicle/VehicleListView/VehicleListView.models';
import { IRowData as IDeliveryAssociateData } from '../../DeliveryAssociate/DeliveryAssociateListView/DeliveryAssociate.models';
import { IBranchLookupResponse } from '../../../utils/common.interface';
import React from 'react';
import { IMongoFormStructure } from '../../../utils/mongo/interfaces';
import { UseFormMethods } from 'react-hook-form';
import { IDropDownOptions } from '../../OnboardingWrapper/CustomForms/CustomForms.models';

export interface ISendEmailProps {
  title: string
  showSendEmailPopup: boolean
  sendEmailHandler: (email:string) => void
  setShowSendEmailPopup: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IRouteParams {
  report?: string;
}

export interface ITripResults{
  tripId: number;
  tripName: string;
}

export interface ITracker {
  isActiveFl: boolean;
  deviceId: number;
  trackeeId: string;
  vehicleId: number;
  excelRowIndex: number;
}

export interface IReportFormState {
  reportType: ReportType;
  branch?: IBranchLookupResponse[];
  vehicle?: IVehicleData;
  deliveryAssociate?: IDeliveryAssociateData;
  driver?: IDriverData;
  trip?: ITripResults[];
  tripSingle?: ITripResults;
  dataSource?: IDropDownOptions;
  trackerId?: ITracker;
};

export interface ISelectedDateRange {
  startDate: string;
  endDate: string;
}

export interface IDeviationSummaryReportData {
  tripId: number;
  tripName: string;
  clientId: number;
  speedDeviation: number;
  tempratureDeviation: number;
  gpsGridDeviation: number;
  drivingHourDeviation: number;
  tripStatus: string;
  vehicleNo: string;
  deliveryMediumMasterName: string;
  driverName: string;
  driverContact: string;
  dmContact: string;
  tripStartDate: number;
  tripEndDate: number;
  branchName: string;
  moduleId: number;
  moduleName: string;
  trackerId: string;
  toleranceSettings: ToleranceSettings;
}

export interface ToleranceSettings {
  maxSpeed: number;
  minSpeed: number;
  maxTemprature: number;
  minTemprature: number;
  speedCheck?: number;
  tempratureCheck?: number;
  gpsCheck?: number;
  drivingCheck?: number;
}

export interface IListViewResponsePayload {
  results: IDeviationSummaryReportData[];
  totalCount: number;
  otherCount?: number;
  clientBranchId?: number;
}

export interface IReportTypeDropdownProps {
  structure: IMongoFormStructure;
  formInstance: UseFormMethods<any>;
  dynamicLabels: Record<string,string>;
}

export interface IReportFiltersProps {
  structure: IMongoFormStructure;
  formInstance: UseFormMethods<any>;
  selectedDateRange: ISelectedDateRange
  setSelectedDateRange: React.Dispatch<React.SetStateAction<ISelectedDateRange>>;
}

export enum REPORT_TYPES {
  DEVIATION_SUMMARY = "DEVIATION_SUMMARY",
  RESTRICTED_DRIVING_TIME_DEVIATION = "RESTRICTED_DRIVING_TIME_DEVIATION",
  GPS_GRID_OFF_DEVIATION = "GPS_GRID_OFF_DEVIATION",
  OVERSPEED_DEVIATION = "OVERSPEED_DEVIATION",
  TEMPERATURE_DEVIATION = "TEMPERATURE_DEVIATION",
  FLEET_MOVEMENT_STUCK_REPORT = "FLEET_MOVEMENT_STUCK_REPORT",
  VEHICLE_TRIP_JOURNEY_REPORT = "VEHICLE_TRIP_JOURNEY_REPORT"
}

export type ReportType = keyof typeof REPORT_TYPES;

export interface IFilterParams {
  startDateFilter: string;
  endDateFilter: string;
  hitStamp: string;
  branchIds?: string[];
  vehicleId?: string;
  driverId?: string;
  deliveryMediumId?: string;
};

export interface ISetFilters {
  filters: IFilterParams;
  reportType: ReportType;
};

export type ReportMappingType = {
  [key in REPORT_TYPES]: {
    reportURLKey: string;
    title: string | ((dynamicLabels?: Record<string, string>) => string);
    typeOfReport: "deviationReport" | "vehicleReport";
    filters: string[];
    pageName: string;
    sectionName:string;
    cellMappingKey: string;
    socketMappingKey: string;
  };
};

const commonFilters = ["reportType", "date", "branch", "vehicle", "deliveryAssociate", "driver"];

export const DEVIATION_REPORTS_MAPPING: ReportMappingType = {
  [REPORT_TYPES.DEVIATION_SUMMARY]: {
    filters: [...commonFilters],
    title: "Deviation Summary",
    typeOfReport: "deviationReport",
    reportURLKey: "deviationSummaryReport",
    pageName: "DEVIATION_SUMMARY_REPORT",
    sectionName: "DEVIATION_SUMMARY_REPORT_LIST_VIEW",
    cellMappingKey: "deviationSummaryReport",
    socketMappingKey: "deviationreport"
  },
  [REPORT_TYPES.RESTRICTED_DRIVING_TIME_DEVIATION]: {
    filters: [...commonFilters,"trip"],
    typeOfReport: "deviationReport",
    title: "Restricted Driving Time Deviation",
    reportURLKey: "deviation/detail/restrictedDrivingTime",
    pageName: "RESTRICTED_DRIVING_TIME_DEVIATION",
    sectionName: "RESTRICTED_DRIVING_TIME_DEVIATION_LIST_VIEW",
    cellMappingKey: "restrictedDrivingTimeDeviation",
    socketMappingKey: "deviationreport"
  },
  [REPORT_TYPES.GPS_GRID_OFF_DEVIATION]: {
    filters: [...commonFilters,"trip"],
    title: "GPS Grid Offline Deviation",
    typeOfReport: "deviationReport",
    reportURLKey: "deviation/detail/gpsgridoff",
    pageName: "GPS_GRID_OFF_DEVIATION",
    sectionName: "GPS_GRID_OFF_DEVIATION_LIST_VIEW",
    cellMappingKey: "gpsGridOffDeviation",
    socketMappingKey: "deviationreport"
  },
  [REPORT_TYPES.OVERSPEED_DEVIATION]: {
    filters: [...commonFilters,"trip"],
    title: "Overspeed Deviation",
    typeOfReport: "deviationReport",
    reportURLKey: "deviation/detail/overspeed",
    pageName: "OVERSPEED_DEVIATION",
    sectionName: "OVERSPEED_DEVIATION_LIST_VIEW",
    cellMappingKey:"overSpeedDeviation",
    socketMappingKey: "deviationreport"
  },
  [REPORT_TYPES.TEMPERATURE_DEVIATION]: {
    filters: [...commonFilters,"trip"],
    title: "Temperature Deviation",
    typeOfReport: "deviationReport",
    reportURLKey: "deviation/detail/temperature",
    pageName: "TEMPERATURE_DEVIATION",
    sectionName: "TEMPERATURE_DEVIATION_LIST_VIEW",
    cellMappingKey: "temperatureDeviation",
    socketMappingKey: "deviationreport"
  },
  [REPORT_TYPES.FLEET_MOVEMENT_STUCK_REPORT]: {
    filters: [...commonFilters, "trip"],
    typeOfReport: "vehicleReport",
    title: "Fleet Stuck Movement Report",
    reportURLKey: "vehicle/report/fleet/stuck",
    pageName: "VEHICLE_REPORTS",
    sectionName: "FLEET_MOVEMENT_STUCK_LIST_VIEW",
    cellMappingKey: "fleetMovementStuckReport",
    socketMappingKey: "deviationreport"
  },
  [REPORT_TYPES.VEHICLE_TRIP_JOURNEY_REPORT]: {
    filters: ["reportType", "date", "tripSingle", "dataSource", "trackerId"],
    typeOfReport: "vehicleReport",
    title: (dynamicLabels) => `${dynamicLabels?.vehicle_s} ${dynamicLabels?.trip_s} Journey Report`,
    reportURLKey: "vehicle/report/tripjourney",
    pageName: "",
    sectionName: "",
    cellMappingKey: "",
    socketMappingKey: "tripjourneyreport"
  },
}
