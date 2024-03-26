import React from 'react'
import { Box, IconButton, useToast } from "ui-library";
import apiMappings from '../../../../../utils/apiMapping';
import axios from '../../../../../utils/axios';
import { userAccessInfo } from '../../../../../utils/constants';
import firebaseRef from '../../../../../utils/firebase';
import { sendGA } from '../../../../../utils/ga';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import { ITripFilterOptions } from '../TripsListView.model';

interface IDownloadReportPopup {
    filterData: ITripFilterOptions;
    dynamicLabels: Record<string, string>;
    handleShowPopup: (value: boolean) => void;
    setShowDownloadSucess: React.Dispatch<React.SetStateAction<boolean>>;
}

const SOCKET_MAPPING = {
    trip: { key: "triplistreport", error: "TRIP_REPORT_FAILED"},
    tracker: { key: "triptrackerreport", error: "triptrackerreport_FAILED" }
}

const DownloadReportPopup = ({ filterData, dynamicLabels, handleShowPopup, setShowDownloadSucess }: IDownloadReportPopup) => {

    const toast = useToast();
    const totalCount = useTypedSelector((state) => state.trips.listView.mile.totalRows);

    const getSocketConnection = (timestamp: string, type: string) => {
        let accessToken = localStorage.getItem("userAccessInfo");
        accessToken = accessToken ? JSON.parse(accessToken).token : null;
        const tripReportRef = firebaseRef.database().ref(`sockets/${SOCKET_MAPPING[type].key}/${accessToken}/${timestamp}`);

        tripReportRef.on("value", function (snapshot) {
        if (snapshot.val()) {
            var reportURL = snapshot.val().value;
            if (reportURL && reportURL == `${SOCKET_MAPPING[type].error}`) {
                toast.add(
                    dynamicLabels["internal.server.error"] != null ? dynamicLabels["internal.server.error"] : "Internal Server Error",
                    "warning",
                    false
                );
            } else if (reportURL && reportURL.length > 0) {
                window.location.href = reportURL;
            }
            tripReportRef.off("value");
        }
        });
    };

    const handleDownloadReport = async (reportType: string) => {
        setShowDownloadSucess(true);
        handleShowPopup(false);

        const hitStamp = new Date().getTime().toString();
        const commonPayload = {
            hitStamp,
            totalCount,
            status: filterData.status,
            endDateFilter: filterData.endDateFilter.replace(" ", "+"),
            startDateFilter: filterData.startDateFilter.replace(" ", "+"),
        }
        const filterPayload = {
            ...(filterData?.searchBy && filterData?.searchText && {
                searchBy: filterData.searchBy,
                searchText: filterData.searchText
            }),
            ...(filterData.sortBy && filterData.sortOrder && {
                sortBy: filterData.sortBy,
                sortOrder: filterData.sortOrder
            })
        }

        try {
            switch (reportType) {
                case "trip": {
                    sendGA('Trip action button', 'Trip - Download Trip List View');
                    getSocketConnection(hitStamp, "trip");
                    await axios.post(apiMappings.trips.mile.listview.tripReportDownload, null, {
                        responseType: "arraybuffer",
                        params: { ...commonPayload, ...filterPayload },
                    });
                    return;
                }
                case "tracker": {
                    sendGA('Trip action button', 'Tracker Report Download');
                    getSocketConnection(hitStamp, "tracker");
                    await axios.post(apiMappings.trips.mile.trackers.reportDownload, commonPayload, {
                        params: { ...filterPayload }
                    })
                    return;
                }
            }
        } catch(e) {
            toast.add(dynamicLabels.somethingWendWrong, "warning", false);
        }
    }

    return (
        <Box p="15px">
            <Box mb='15px' style={{ fontSize: 12, color: "#000" }}>
                {dynamicLabels?.tripDownloadReportTitle || `Click on the below buttons to download the ${dynamicLabels.trip_s} reports.`}
            </Box>
            <Box display="flex" horizontalSpacing="10px">
                <IconButton
                    id="btn-tripList-trip-report"
                    iconVariant="icomoon-download-excel"
                    primary
                    color='white'
                    onClick={() => handleDownloadReport('trip')}
                    children={`${dynamicLabels.trip_s} Report`}
                />
                {userAccessInfo.superType == "MIDDLEMILE" ? 
                    <IconButton
                        id="btn-tripList-tracker-report"
                        iconVariant="icomoon-download-excel"
                        iconSize={11}
                        onClick={() => handleDownloadReport('tracker')}
                        primary
                        children={`${dynamicLabels.tracker_s} ${dynamicLabels.trip_s} Report`}
                    /> : null
                }
            </Box>
        </Box>
  )
}

export default DownloadReportPopup