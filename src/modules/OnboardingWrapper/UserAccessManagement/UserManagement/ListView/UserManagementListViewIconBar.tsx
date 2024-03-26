import React, { useState, useRef, useEffect } from "react";

import { IconButton, Box, PopupWrapper, useToast, IFetchDataOptions } from 'ui-library'

import DateRangePicker from '../../../../DeliveryAssociate/DeliveryAssociateListView/SubComponent/Popups/DateRangePicker'
import moment from "moment-timezone";
import useClientProperties from '../../../../common/ClientProperties/useClientProperties';
import { HeaderWrapper, IconButtonStyled } from '../../../../DeliveryAssociate/DeliveryAssociateListView/SubComponent/StyledSubComponent'
import firebaseRef from "../../../../../utils/firebase";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";
import DownloadMessage from "../../../../../utils/components/DownloadMessage";
import { sendGA } from '../../../../../utils/ga'
import { DownloadModalWrapper } from "./styles";
interface IDownloadModal {
    fetchOptions: IFetchDataOptions,
    usersDynamicLabels: any,
    setShowDownloadModal: (value: boolean) => void;
    showDownloadModal: boolean;
}

const DownloadUsersReport = ({ fetchOptions, usersDynamicLabels, setShowDownloadModal, showDownloadModal }: IDownloadModal) => {
    const [showDatepickerModal, setShowDatepickerModal] = useState<boolean>(false)
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const timeZone = clientProperties?.TIMEZONE?.propertyValue || JSON.parse(localStorage.getItem('userAccessInfo') || '{}').timezone;
    const downloadModalNode = useRef(null);
    const datepickerModalNode = useRef(null)
    const toast = useToast();
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    const [startDate, setStartDate] = useState<Date>(moment().subtract(8, "days").toDate());
    const [endDate, setEndDate] = useState<Date>(moment().subtract(1, "days").toDate());
    const format = clientProperties?.DATEFORMAT?.propertyValue ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() : ' YYYY-MM-DD'
    const dateFormatting = `${moment(startDate).format(`${format}`)} - ${moment(endDate).format(`${format}`)}`;
    const [dateRangePickerText, setDateRangePickerText] = useState<string>(
        dateFormatting
    );
    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)

    const filterDateFormatter = (date: Date) => {
        const timeZone = JSON.parse(localStorage.getItem('userAccessInfo') || '""')?.timezone
        return moment
            .tz(date, timeZone)
    }

    const getSocketConnection = (timestamp: any, reportType) => {
        const timeStampString = timestamp.toString();

        let accessToken = localStorage.getItem('userAccessInfo');
        accessToken = accessToken ? JSON.parse(accessToken).token : null;
        const driverCreateRef = firebaseRef.database().ref(`sockets/${reportType}/${accessToken}/${timeStampString}`)
        driverCreateRef.on('value', function (snapshot) {
            if (snapshot.val()) {
                var reportURL = snapshot.val().value;

                if (reportURL && reportURL == "usermasterreport_FAILED") {
                    console.log("Failed");
                    toast.add(dynamicLabels["internal.server.error"] != null ? dynamicLabels["internal.server.error"] : "Internal Server Error", 'warning', false);
                } else if (reportURL && reportURL?.length) {

                    window.location.href = reportURL;
                }
                driverCreateRef.off('value');
            }
        });
    }
    const DatePickerHeader = ({ setShowDownload }: any) => (
        <HeaderWrapper type='relative' display='block' id='header'>
            <span style={{ marginLeft: '40%' }}>{usersDynamicLabels?.downloadReport}</span>
            <IconButtonStyled
                onClick={() => {
                    setShowDownload(false);
                    setShowDownloadModal(false);
                }}
                intent='default'
                iconVariant='close'
                onlyIcon
                iconSize='xs'
                color='white'
                hoverFeedback={false}
            />
        </HeaderWrapper>
    )

    const DownloadHeader = () => (
        <HeaderWrapper type='relative' display='block' id='header'>
            <span style={{ marginLeft: '40%' }}>{usersDynamicLabels?.downloadReport}</span>
            <IconButtonStyled
                onClick={() => {
                    setShowDownloadModal(false);
                }}
                intent='default'
                iconVariant='close'
                onlyIcon
                iconSize='xs'
                color='white'
                hoverFeedback={false}
            />
        </HeaderWrapper>
    )

    const handleLoginLogoutModal = () => {
        setShowDownloadModal(false);
        setShowDatepickerModal(true);
    }

    const handleUserReportDownload = async () => {
        sendGA('Download Action', 'Users Download Button Click - User Report')
        const hitStamp = Date.now().toString()
        getSocketConnection(hitStamp, 'usermasterreport')
        const params: any = {
            pageNumber: fetchOptions.pageNumber,
            pageSize: fetchOptions.pageSize,
            searchBy: fetchOptions.filterOptions?.searchBy,
            searchText: fetchOptions.filterOptions?.searchText,
            sortBy: fetchOptions.sortOptions?.sortBy,
            sortOrder: fetchOptions.sortOptions?.sortOrder,
            hitStamp: hitStamp
        }
        setShowDownloadSuccess(true)

        try {
            await axios.post(apiMappings.userManagement.listView.downloadUserReport, {}, {
                params
            })
        } catch (errorMessage) {
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels?.somethingWendWrong, '', false)
        }

    }


    const handleLoginLogoutReportDownload = async () => {
        const  hitStamp = Date.now().toString()

        let params: any = {}
        const stDate = filterDateFormatter(startDate);
        const eDate = filterDateFormatter(endDate);
        const currentDate = moment().toDate()
        if (endDate > currentDate) {
            return toast.add('Future date selection is not allowed for Login/Logout report!', 'warning', false)
        }

        const startMomentDate = moment(startDate)
        const endMomentDate = moment(endDate)
        const diff = endMomentDate.diff(startMomentDate, 'days')

        // if end date is equal or less than current date and start date is less than (current date - 7)
        if (endDate <= currentDate && 31 < diff) {
            return toast.add('Selected date range should cover less than or equal to 31 days to download the report.', 'warning', false)
        }

        params = {
            endDateFilter: moment(eDate).tz(timeZone).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
            startDateFilter: moment(stDate).tz(timeZone).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
            hitStamp: hitStamp
        }
        sendGA('Download Action', 'Users Download Button Click - User Audit Report')
        getSocketConnection(hitStamp, 'userauditreport')
        setShowDownloadSuccess(true)
        setShowDatepickerModal(false)
        try {
            await axios.post(apiMappings.userManagement.listView.downloadLoginLogoutReport, {}, {
                params
            })
        } catch (errorMessage) {
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels?.somethingWendWrong, '', false)
        }
    }

    const handleOutsideClick = (node: any, e: any, modalType: 'downloadModal' | 'datepickerModal') => {
        const n = (node.current as unknown) as Node;
        if (n.contains(e.target)) return;
        modalType === "downloadModal" ? setShowDownloadModal(false) : setShowDatepickerModal(false);
        setShowDownloadSuccess(false)
    }

    useEffect(() => {
        // inital load each time keep it close
        setShowDownloadSuccess(false)
        showDownloadModal && document.addEventListener('mousedown', (event) => handleOutsideClick(downloadModalNode, event, "downloadModal"));
        showDatepickerModal && document.addEventListener('mousedown', (event) => handleOutsideClick(datepickerModalNode, event, "datepickerModal"));
        return () => {
            showDownloadModal && document.removeEventListener('mousedown', (event) => handleOutsideClick(downloadModalNode, event, "downloadModal"));
            showDatepickerModal && document.removeEventListener('mousedown', (event) => handleOutsideClick(datepickerModalNode, event, "datepickerModal"));
        }
    }, [showDownloadModal])

    return (
        <>
            {showDownloadModal ?
                <DownloadModalWrapper ref={downloadModalNode} >
                    <PopupWrapper
                        header={<DownloadHeader />}
                        content={
                            <div style={{ fontSize: 12, color: '#000', padding: "15px" }}>{`Click on the below buttons to download the ${usersDynamicLabels?.user} ${usersDynamicLabels?.report}.`}</div>
                        }
                        footer={
                            <Box
                                horizontalSpacing="10px"
                                display="flex"
                                style={{ padding: '15px' }}
                                justifyContent="flex-end"
                            >
                                <IconButton
                                    id='userManagementListView-Download-UserReport'
                                    iconVariant="icomoon-download-excel"
                                    iconSize={11}
                                    primary
                                    color='white'
                                    onClick={handleUserReportDownload}
                                    children={`${usersDynamicLabels?.user} ${usersDynamicLabels?.report}`}
                                />
                                <IconButton
                                    id='userManagementListView-Download-Login-Logout-Report'
                                    iconVariant="icomoon-download"
                                    iconSize={11}
                                    primary
                                    color='white'
                                    onClick={handleLoginLogoutModal}
                                    children={`Login/Logout ${usersDynamicLabels?.report}`}
                                />
                            </Box>}
                    />
                </DownloadModalWrapper> : null}

            {showDatepickerModal ?
                <DownloadModalWrapper ref={datepickerModalNode}>
                    <PopupWrapper
                        header={<DatePickerHeader setShowDownload={setShowDatepickerModal} />}
                        content={
                            <div style={{ padding: '10px' }}>
                                <div title='Select Date:' style={{ color: '#000', fontSize: 14, padding: '10px' }}>Select Date:</div>
                                <DateRangePicker
                                    startDate={startDate}
                                    endDate={endDate}
                                    setDateRangePickerText={setDateRangePickerText}
                                    dateRangePickerText={dateRangePickerText}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                />
                            </div>

                        }
                        footer={
                            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                                <IconButton
                                    iconVariant="icomoon-download-excel"
                                    iconSize={11}
                                    primary
                                    color='white'
                                    onClick={handleLoginLogoutReportDownload}
                                    children={`${usersDynamicLabels?.download}`}
                                />
                            </Box>
                        }
                    />
                </DownloadModalWrapper> : null}

            {showDownloadSuccess && <DownloadMessage
                showInfoModal={showDownloadSuccess}
                onToggle={setShowDownloadSuccess}
            />}
        </>
    )

}

export default DownloadUsersReport