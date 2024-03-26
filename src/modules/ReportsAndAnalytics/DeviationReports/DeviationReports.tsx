import moment from 'moment';
import React, { Dispatch, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withReactOptimized } from "../../../utils/components/withReact";
import { MemoryRouter } from 'react-router-dom'
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { Box, Grid, BreadCrumb, IconButton, useToast, Loader } from "ui-library";
import { DeviationReportsActions } from "./DeviationReports.actions";
import { ISelectedDateRange, DEVIATION_REPORTS_MAPPING, ReportType, IFilterParams, IReportFormState, ITripResults, REPORT_TYPES } from "./DeviationReports.models";
import { useForm } from 'react-hook-form';
import { BreadCrumbContainer, AddFormButtonContainer, FormWrapper, ListWrapper } from './DeviationReportsStyledComponents'
import { deepCopy } from '../../../utils/helper';
import DownloadMessage from '../../../utils/components/DownloadMessage';
import ReportFiltersComponent from './SubComponents/ReportFiltersComponent';
import ReportsListViewComponent from './SubComponents/ReportsListViewComponent';
import ReportTypeDropdown from './SubComponents/ReportTypeDropdown';
import { IBranchLookupResponse } from '../../../utils/common.interface';
import axios from '../../../utils/axios';
import { sendGA } from '../../../utils/ga';
import firebaseRef from '../../../utils/firebase';
import apiMappings from '../../../utils/apiMapping';
import SendAsEmailPopup from './SubComponents/SendAsEmailPopup';
import EmailMessage from '../../../utils/components/EmailMessage';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { routeContains } from '../../../utils/hybridRouting';

export const basename = '';

const DeviationReports = () => {
    const formInstance = useForm<IReportFormState>({ mode: 'all', shouldUnregister: false });
    const { watch, reset, getValues, setValue } = formInstance;
    const { reportType, branch, tripSingle, dataSource, trackerId } = watch();

    const toast = useToast();
    const dispatch = useDispatch<Dispatch<DeviationReportsActions>>();
    const dynamicLabels =  useDynamicLabels(DYNAMIC_LABELS_MAPPING.trackerReports);
    const isFormLoading = useTypedSelector((state) => state.deviationReports.form.loading)
    const structure = useTypedSelector((state) => state.deviationReports.form.structure);
    const prevReportType = useTypedSelector((state) => state.deviationReports.form.reportType);
    const columns = useTypedSelector((state) => state.deviationReports.listView.structure.columns);
    const results = useTypedSelector((state) => state.deviationReports.listView.data.results);
    
    const sectionKeys = Object.keys(structure);
    const hitStamp = Date.now().toString();

    const [email, setEmail] = useState("");
    const [showSendEmailPopup, setShowSendEmailPopup] = useState(false);
    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
    const [emailSentSuccess, setSendEmailSuccess] = useState(false);
    
    const initialDateRange: ISelectedDateRange = useMemo(() => {
        return {
            startDate: moment(new Date()).subtract(6, 'days').startOf('day').utc().format("YYYY-MM-DD HH:mm:ss"),
            endDate: moment(new Date()).endOf('day').utc().format("YYYY-MM-DD HH:mm:ss"),
        }
    }, []);
    const [selectedDateRange, setSelectedDateRange] = useState<ISelectedDateRange>({ ...initialDateRange });

    const reportTitle = React.useMemo(
        () => {
            const reportConfig = DEVIATION_REPORTS_MAPPING[reportType as ReportType];
            const reportTitle: string = typeof reportConfig?.title === 'string' ? reportConfig?.title : reportConfig?.title(dynamicLabels);
            return reportTitle;
        },
        [dynamicLabels, reportType]
    );

    const breadCrumbOptions = React.useMemo(
        () => { 
            const initialOptions = [
                { id: "Analytics", label: "Report", disabled: true },
                { ...routeContains("VehicleReport") ? { id: "vehicleReports", label: `${dynamicLabels?.vehicle_s} Reports`, disabled: true } : { id: "deviationReports", label: "Deviation Reports", disabled: true }},
            ]
            if (reportType?.length > 0) {
                initialOptions.push({ id: "typeOfReports", label: reportTitle, disabled: true });
                return initialOptions;
            } else {
                return initialOptions;
            }
        },
        [dynamicLabels, reportType, reportTitle]
    );

    useEffect(() => {
        routeContains("VehicleReport") ? dispatch({ type: '@@vehicleReports/FETCH_FILTER_STRUCTURE' }) : dispatch({ type: '@@deviationReports/FETCH_FILTER_STRUCTURE' });
        return () => {
            dispatch({type: '@@deviationReports/RESET_INITIAL_STATE'})
        }
    }, []);

    useEffect(() => {
        const filterStructure = deepCopy(structure);
        if (!branch || Object.keys(filterStructure).length === 0) return;
        // Reset dropdowns for branch change
        reset({ branch: branch, reportType: reportType });
        // Dynamically change the lookup and payload based on number of branches selected
        if (branch?.length > 0) {
            filterStructure['general details']['vehicle'].lookupType = "getBranchVehiclesList";
            filterStructure['general details']['deliveryAssociate'].lookupType = "getBranchDAList";
            filterStructure['general details']['driver'].lookupType = "getBranchDriversList";

            const branchIds = branch.map((b: IBranchLookupResponse) => b.branchId);

            filterStructure['general details']['vehicle'].httpPostPayload = branchIds;
            filterStructure['general details']['deliveryAssociate'].httpPostPayload = branchIds;
            filterStructure['general details']['driver'].httpPostPayload = branchIds;
            filterStructure['general details']['trip'].httpPostPayload = branchIds;
        } else if (branch?.length === 0) {
            filterStructure['general details']['vehicle'].lookupType = "getVehiclesList";
            filterStructure['general details']['deliveryAssociate'].lookupType = "getDAList";
            filterStructure['general details']['driver'].lookupType = "getDriversList"; 

            filterStructure['general details']['vehicle'].httpPostPayload = undefined;
            filterStructure['general details']['deliveryAssociate'].httpPostPayload = undefined;
            filterStructure['general details']['driver'].httpPostPayload = undefined;
            filterStructure['general details']['trip'].httpPostPayload = null;
        }
        dispatch({ type: "@@deviationReports/FETCH_FILTER_STRUCTURE_SUCCESS", payload: filterStructure });
    }, [branch])

    useEffect(() => {
        const filterStructure = deepCopy(structure);
        if ((reportType !== REPORT_TYPES.VEHICLE_TRIP_JOURNEY_REPORT && !tripSingle) || Object.keys(filterStructure).length === 0) return;

        setValue('dataSource', undefined);
        setValue('trackerId', undefined);

        if (tripSingle && Object.keys(tripSingle)?.length > 0) {
            filterStructure['general details']['dataSource'].permission = true;
            filterStructure['general details']['trackerId'].permission = false;
        } else {
            filterStructure['general details']['dataSource'].permission = false;
            filterStructure['general details']['trackerId'].permission = false;
        }
        dispatch({ type: "@@deviationReports/FETCH_FILTER_STRUCTURE_SUCCESS", payload: filterStructure });
    }, [tripSingle]);

    useEffect(() => {
        const filterStructure = deepCopy(structure);
        if ((reportType !== REPORT_TYPES.VEHICLE_TRIP_JOURNEY_REPORT && !dataSource) || Object.keys(filterStructure).length === 0) return;        

        dataSource && Object.keys(dataSource)?.length > 0 && dataSource?.clientRefMasterCd === "TRACKER" 
            ? filterStructure['general details']['trackerId'].permission = true
            : filterStructure['general details']['trackerId'].permission = false;

        dispatch({ type: "@@deviationReports/FETCH_FILTER_STRUCTURE_SUCCESS", payload: filterStructure });
    }, [dataSource]);

    useEffect(() => {
        // Reset ListView Structure & Data
        dispatch({ type: "@@deviationReports/RESET_LISTVIEW_STATE"});
        // Reset date range
        const copySelectedDate = deepCopy(initialDateRange)
        setSelectedDateRange(copySelectedDate);
        // Reset dropdowns
        reset({ reportType: reportType, branch: [] });
        // Dynamically change the form structure based on report type
        if (structure?.['general details']) { handleConstructStructure(reportType) }
    }, [reportType]);

    const handleConstructStructure = (reportType:string) => {
        if (!reportType || !reportType.length) return;

        const filterStructure = deepCopy(structure);
        const filters: string[] = DEVIATION_REPORTS_MAPPING[reportType as ReportType].filters;
        const filterKeys = Object.keys(filterStructure['general details']);
        filterKeys.forEach((key: any) => {
            if (["dataSource", "trackerId"].includes(key) && reportType === REPORT_TYPES.VEHICLE_TRIP_JOURNEY_REPORT) return;

            !filters.includes(key) 
                ? filterStructure['general details'][key].permission = false
                : filterStructure['general details'][key].permission = true;
        })
        dispatch({ type: "@@deviationReports/FETCH_FILTER_STRUCTURE_SUCCESS", payload: filterStructure });
    }

    const createPayload = (hitStamp: string) => {
        const { branch, vehicle, driver, deliveryAssociate, trip, tripSingle, dataSource, trackerId } = getValues();
        let branchIds: number[] = [], branchNames: string[] = [] , tripIds: number[] = [], tripNames: string[] = [];
        if(branch && branch.length > 0) {
            branch.forEach((b: IBranchLookupResponse) => {
                branchIds.push(b.branchId);
                branchNames.push(b.name as string);
            });
        }
        if(trip && trip.length > 0) {
            trip.forEach((t: ITripResults) => {
                tripIds.push(t.tripId);
                tripNames.push(t.tripName as string);
            });
        }
        return {
            startDateFilter: selectedDateRange.startDate,
            endDateFilter: selectedDateRange.endDate,
            hitStamp,
            ...(tripIds.length > 0 ? { tripIds } : {}),
            ...(tripNames.length > 0 ? { tripNames } : {}),
            ...(branchIds.length > 0 ? { branchIds } : {}),
            ...(branchNames.length > 0 ? { branchNames } : {}),
            ...(vehicle && Object.keys(vehicle).length > 0 ? { vehicleId: vehicle.vehicleId, vehicleNumber: vehicle.vehicleNumber } : {}),
            ...(driver && Object.keys(driver).length > 0 ? { driverId: driver.driverId, driverName: driver.driverName } : {}),
            ...(deliveryAssociate && Object.keys(deliveryAssociate).length > 0 ? { deliveryMediumId: deliveryAssociate.deliveryMediumMasterId, daName: deliveryAssociate.deliveryMediumMasterName } : {}),
            ...(tripSingle && Object.keys(tripSingle).length > 0 ? { tripId: tripSingle.tripId, tripName: tripSingle.tripName } : {}),
            ...(dataSource && Object.keys(dataSource).length > 0 ? { dataSource: dataSource.clientRefMasterCd } : {}),
            ...(trackerId && Object.keys(trackerId).length > 0 ? { trackerId: trackerId.trackeeId } : {}),
        } as IFilterParams;
    };

    const getSocketConnection = () => {
        let accessToken = localStorage.getItem("userAccessInfo");
        accessToken = accessToken ? JSON.parse(accessToken).token : null;
        const driverCreateRef = firebaseRef.database().ref(`sockets/${DEVIATION_REPORTS_MAPPING[reportType as ReportType].socketMappingKey}/${accessToken}/${hitStamp}`);

        driverCreateRef.on("value", function (snapshot) {
            if (snapshot.val()) {
                let reportURL = snapshot.val().value;
                if (reportURL && reportURL == `${DEVIATION_REPORTS_MAPPING[reportType as ReportType].socketMappingKey}_FAILED`) {
                    toast.add(dynamicLabels["internal.server.error"] ?? "Internal Server Error", "warning",false);
                } else if (reportURL?.length) {
                    window.location.href = reportURL;
                }
                driverCreateRef.off("value");
            }
        });
    };

    const handleDownloadReport = async () => {
        sendGA("Download Action", `Users Download Button Click - ${DEVIATION_REPORTS_MAPPING[reportType as ReportType].title} Report`);
        getSocketConnection();
        setShowDownloadSuccess(true);
        try {
            const payload = createPayload(hitStamp);
            let downloadReportAPI = apiMappings.deviationReports.downloadReport;
            downloadReportAPI = downloadReportAPI.replace("${reportType}", DEVIATION_REPORTS_MAPPING[reportType as ReportType].reportURLKey)
            await axios.post(downloadReportAPI, payload);
        } catch (error) { 
            toast.add(typeof error === "string" ? error : dynamicLabels?.somethingWendWrong, "", false);
        }
    };

    const handleSendEmail = async (emailId: string) => {
        setEmail(emailId);
        setShowSendEmailPopup(false);
        setSendEmailSuccess(true);
        try {
            const payload = createPayload(hitStamp);
            let sendEmailAPI = apiMappings.deviationReports.sendEmail;
            sendEmailAPI = sendEmailAPI.replace('${reportType}', DEVIATION_REPORTS_MAPPING[reportType as ReportType].reportURLKey);
            await axios.post(sendEmailAPI, { ...payload, emailId });
        } catch (error) {
            toast.add(typeof error === "string" ? error : dynamicLabels?.somethingWendWrong, "", false);
        }
    };

    const handleViewReport = () => {
        const filters = createPayload(hitStamp);
        const payload = { reportType, filters };
        dispatch({ type: '@@deviationReports/SAVE_FILTERS', payload });

        if (columns && Object.keys(columns).length === 0 && prevReportType !== reportType) {
            dispatch({ type: '@@deviationReports/FETCH_LISTVIEW_STRUCTURE' });
        }
    };

    const disableButtons = reportType === REPORT_TYPES.VEHICLE_TRIP_JOURNEY_REPORT ? dataSource?.clientRefMasterCd === "TRACKER" ? !(tripSingle && dataSource && trackerId) : !(tripSingle && dataSource) : !reportType;

    return (
            <>
                <BreadCrumbContainer>̀
                    <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />
                </BreadCrumbContainer>
                <FormWrapper>
                    {isFormLoading || sectionKeys.length === 0 ? 
                        <Box style={{padding: "65px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Loader />
                        </Box> : 
                        <>
                        <Grid container spacing='10px'>
                            <ReportTypeDropdown structure={structure} formInstance={formInstance} dynamicLabels={dynamicLabels} /> 
                            {reportType?.length > 0 
                                ? <ReportFiltersComponent key={reportType} structure={structure} formInstance={formInstance} selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange} />
                                : null
                            }
                        </Grid>
                        <AddFormButtonContainer item xs={6} sm={6} md={6}>
                            {reportType !== REPORT_TYPES.VEHICLE_TRIP_JOURNEY_REPORT 
                                ? <IconButton iconVariant="icon-notes" id="btn_deviationreport_view" primary onClick={handleViewReport} disabled={!reportType}>View Report</IconButton>
                                : null
                            }
                            {results?.length > 0 || (reportType === REPORT_TYPES.VEHICLE_TRIP_JOURNEY_REPORT) ? 
                                <>
                                <IconButton iconVariant="send-mail" id="btn_deviationreport_email" onClick={() => setShowSendEmailPopup(true)} disabled={disableButtons}>Send Email</IconButton>
                                <IconButton iconVariant="icomoon-download-report" id="btn_deviationreport_download" primary onClick={handleDownloadReport} disabled={disableButtons}>{dynamicLabels.download}</IconButton>
                                </> : null
                            }
                        </AddFormButtonContainer>
                        </>
                    }
                </FormWrapper>
                {columns && Object.keys(columns).length > 0 ? 
                    <ListWrapper><ReportsListViewComponent /></ListWrapper>
                : null}
                {showSendEmailPopup && (
                    <SendAsEmailPopup
                        showSendEmailPopup={showSendEmailPopup}
                        setShowSendEmailPopup={setShowSendEmailPopup}
                        sendEmailHandler={handleSendEmail}
                        title={reportTitle}
                    />
                )}
                {emailSentSuccess && (
                    <EmailMessage
                        showInfoModal={emailSentSuccess}
                        onToggle={setSendEmailSuccess}
                        email={email}
                    />
                )}
                {showDownloadSuccess && (
                    <DownloadMessage
                        showInfoModal={showDownloadSuccess}
                        onToggle={setShowDownloadSuccess}
                    />
                )}
            </>
    )
}
const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
    (props: P) => {
        return <MemoryRouter><Component {...props} /></MemoryRouter>
    }
export default withReactOptimized(withMemoryRouter(DeviationReports))