import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from 'react'
import FileSaver from 'file-saver'
import { PopupWrapper, Box, IconButton, IFetchDataOptions, useToast } from 'ui-library'
import { HeaderWrapper, IconButtonStyled, ModalWrapper } from '../StyledSubComponent'
import DateRangePicker from './DateRangePicker'
import apiMappings from '../../../../../utils/apiMapping'
import axios from '../../../../../utils/axios'
import DownloadMessage from '../../../../../utils/components/DownloadMessage'
import { sendGA } from '../../../../../utils/ga';
import withRedux from '../../../../../utils/redux/withRedux';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import useClientProperties from '../../../../common/ClientProperties/useClientProperties';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import firebaseRef from "../../../../../utils/firebase";


export interface IDownloadModal {
    isShowDownloadModal: boolean
    fetchOptions: IFetchDataOptions
    setShowDownload: (value: boolean) => void
    selectedRows: any
}

const Header = ({ setShowDownload }: any) => (
    <HeaderWrapper type='relative' display='block' id='header'>
        <span style={{ marginLeft: '40%' }}> Download Report</span>
        <IconButtonStyled
            onClick={() => setShowDownload(false)}
            intent='default'
            iconVariant='close'
            onlyIcon
            iconSize='xs'
            color='white'
            hoverFeedback={false}
        />
    </HeaderWrapper>
)
const DownloadModal = ({ isShowDownloadModal, setShowDownload, fetchOptions, selectedRows }: IDownloadModal) => {

 
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);
    const viewMode = useTypedSelector(state => state.deliveryMedium.listView.viewMode);
    const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
    const node = useRef(null)

    const [startDate, setStartDate] = useState<Date>(moment().subtract(8, "days").toDate());
    const [endDate, setEndDate] = useState<Date>(moment().subtract(1, "days").toDate());
    const format = clientProperties?.DATEFORMAT?.propertyValue ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() : ' YYYY-MM-DD'
    const dateFormatting = `${moment(startDate).format(`${format}`)} - ${moment(endDate).format(`${format}`)}`;
    const [dateRangePickerText, setDateRangePickerText] = useState<string>(
        dateFormatting
    );
    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)
    const toast = useToast();
    // close
    const handleOutsideClick = (e: any) => {
        const n = (node.current as unknown) as Node
        if (n.contains(e.target)) return
        setShowDownload(false)
        setShowDownloadSuccess(false)

    }
    useEffect(() => {
        // inital load each time keep it close
        setShowDownloadSuccess(false)
        isShowDownloadModal && document.addEventListener('mousedown', handleOutsideClick)
        return () => {
            isShowDownloadModal && document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [isShowDownloadModal])

        //firebase Socket Connection start here 
    const getSocketConnection = (timestamp: any) => {
        let timeStampString = timestamp.toString();
        let accessToken = localStorage.getItem('userAccessInfo');
        console.log('Connected to Firebase!!');
        accessToken = accessToken ? JSON.parse(accessToken).token : null;
        console.log(timeStampString,"Connected to Firebase and htmap" )
        const driverCreateRef = firebaseRef.database().ref(`sockets/dynamicreport/${accessToken}/${timeStampString}`)

        driverCreateRef.on('value', function (snapshot) {
            console.log('on update:', snapshot.val());
            if (snapshot.val()) {
                var reportURL = snapshot.val().value;
                if (reportURL && reportURL == "dynamicreport_FAILED") {
                    console.log("Failed");
                    toast.add(dynamicLabels["internal.server.error"] != null ? dynamicLabels["internal.server.error"] : "Internal Server Error", 'error', false);
                } else if (reportURL && reportURL.length > 0) {
                    console.log('Download Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                    console.log(reportURL, "Done");
                    window.location.href = reportURL;

                }
                driverCreateRef.off('value');
            }
        });
    }
    //firebase Socket Connection  end here 

    const handleDownloadReport = async (type: string) => {
        const hitStampNow = Date.now().toString();
        const stDate= filterDateFormatter(startDate);
        const eDate = filterDateFormatter(endDate);
        
        const timeZone= clientProperties?.TIMEZONE?.propertyValue || JSON.parse(localStorage.getItem('userAccessInfo') || '{}').timezone;
        let params: any = {
            pageNumber: fetchOptions.pageNumber,
            pageSize: fetchOptions.pageSize,
            searchBy: fetchOptions.filterOptions?.searchBy,
            searchText: fetchOptions.filterOptions?.searchText,
            sortBy: fetchOptions.sortOptions?.sortBy,
            sortOrder: fetchOptions.sortOptions?.sortOrder
        }
        if (type === 'performanceReport') {
            sendGA('Download Action','Delivery Associate Button Click - Performance Report')
            // Future date selection is not allowed for performance report!( take yesterdays as current date-prod behaviour)
            const currentDate = moment().subtract(1, "days").toDate()
            if (endDate > currentDate) {
                return toast.add('Future date selection is not allowed for performance report!', 'warning', false)
            }
            // ( take yesterdays as current date-prod behaviour) hence -8 days
            //Selected date range should cover less than or equal to 7 days to download the report

            const startMomentDate = moment(startDate)
            const endMomentDate = moment(endDate)
            const diff = endMomentDate.diff(startMomentDate, 'days')
            

            // if end date is equal or less than current date and start date is less than (current date - 7)
            if (endDate <= currentDate && 7 < diff) {
                return toast.add('Selected date range should cover less than or equal to 7 days to download the report.', 'warning', false)
            }
          
          // hardcoding format as backend taking below
            params = {
                endTimeWindow: eDate.tz(timeZone).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
                startTimeWindow: stDate.tz(timeZone).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
                hitStamp: hitStampNow,
                pageNumber: fetchOptions.pageNumber,
                pageSize: fetchOptions.pageSize,
                searchBy: fetchOptions.filterOptions?.searchBy,
                searchText: fetchOptions.filterOptions?.searchText
            }
        } if (type === 'payoutReport') {
            sendGA('Download Action','Delivery Associate Button Click - Payout Report')
            // Future date selection is not allowed for performance report!( take yesterdays as current date-prod behaviour)
            const currentDate = moment().subtract(1, "days").toDate()
            if (endDate > currentDate) {
                return toast.add('Future date selection is not allowed for performance report!', 'warning', false)
            }
            // ( take yesterdays as current date-prod behaviour) hence -8 days
            //Selected date range should cover less than or equal to 7 days to download the report

            const startMomentDate = moment(startDate)
            const endMomentDate = moment(endDate)
            const diff = endMomentDate.diff(startMomentDate, 'days')
            
            // if end date is equal or less than current date and start date is less than (current date - 7)
            //Selected date range should cover less than or equal to 90 days to download the report. Date range limit changed to 90 days
            if (endDate <= currentDate && 91 < diff) {
                return toast.add('Selected date range should cover less than or equal to 90 days to download the report.', 'warning', false)
            }
          
          // hardcoding format as backend taking below
            params = {
                endTimeWindow: eDate.tz(timeZone).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
                startTimeWindow: stDate.tz(timeZone).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
                hitStamp: hitStampNow,
                pageNumber: fetchOptions.pageNumber,
                pageSize: fetchOptions.pageSize,
                searchBy: fetchOptions.filterOptions?.searchBy,
                searchText: fetchOptions.filterOptions?.searchText
            }
        } else if (type === 'odometerProofs') {
            sendGA('Download Action','Delivery Associate Button Click - Odometer Proofs')
            if (Object.values(selectedRows).length === 0) {
                //Select some da first and then click this button to download their Odometer readings.
                return toast.add(`Select some ${dynamicLabels?.deliveryboy_s} first and then click this button to download their Odometer readings.`, 'warning', false)
            }
             // hardcoding format as backend taking below
            params = {
                endDt: eDate.tz(timeZone).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
                startDt: stDate.tz(timeZone).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss')
                
            }
        }
      
        // show success download popup
        setShowDownloadSuccess(true)
        let bufferData: any = {}
        try {
            if (type === 'odometerProofs') {
                console.log('Download Odometer  Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                const selectedRow = Object.values(selectedRows)?.map((row: any) => row.deliveryMediumMasterId)
                if (selectedRow.length > 0) {
                    bufferData = await axios.post(apiMappings.deliveryMedium.listView.downloadOdometerReadingProofs_new, selectedRow, {
                        params,
                        responseType: 'arraybuffer'
                    })
                }

            } else if (type === 'excel') {
                console.log('Download   Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                sendGA('Download Action',`Delivery Associate Button Click - ${dynamicLabels?.DeliveryBoyList}`)
                bufferData = await axios.post(apiMappings.deliveryMedium.listView.downloadDBListView, filterListPayload, {
                    params,
                    responseType: 'arraybuffer',
                })
            }
            //payout report
            else if (type === 'payoutReport') {
                console.log('Download PayoutReport  Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                bufferData = await axios.post(apiMappings.deliveryMedium.listView.payoutReportDownload, filterListPayload, {
                    params,
                    responseType: 'arraybuffer',
                })
            }
            //performance report
            else {
                console.log('Download Performance  Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                bufferData = await axios.post(apiMappings.deliveryMedium.listView.performanceReportDownload, filterListPayload, {
                    params,
                    responseType: 'arraybuffer',
                })
            }

            const { data, status, statusText } = bufferData
            if (status === 200) {
                const downloadLabel = {
                    excel: `${dynamicLabels?.DeliveryBoyList}`,
                    performanceReport: `${dynamicLabels?.DeliveryBoyPerformanceReport}`,
                    odometerProofs: `OdometerProofs`
                }
                if (type === 'odometerProofs') {
                    console.log('Download odometerProofs  Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                    const blob = new Blob([data], {
                        type: 'application/octet-stream'
                    })
                    FileSaver.saveAs(blob, `${downloadLabel[type]}.zip`)

                } 
                else if (type === 'performanceReport' || type === "payoutReport") {
                    getSocketConnection(hitStampNow);
                } else {
                    console.log('Download Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                    FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${downloadLabel[type]}.xlsx`)
                      }

                return
            }
            throw statusText

        } catch (errorMessage) {
            setShowDownload(false)
            setShowDownloadSuccess(false)
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels?.somethingWendWrong, '', false)
        }
    }



    const filterDateFormatter = (date: Date) => {
        const timeZone= JSON.parse(localStorage.getItem('userAccessInfo') || '""').timezone
        return moment
            .tz(date, timeZone)
    }


    return isShowDownloadModal ? (
        <>
            <ModalWrapper ref={node} viewMode={viewMode}>
                <PopupWrapper
                    header={<Header setShowDownload={setShowDownload} />}
                    content={
                        <div style={{ padding: '10px' }}>
                            <div title='Select Date:' style={{ color: '#000', fontSize: 14, padding: '10px' }}>{`${dynamicLabels?.selectDate}: `}</div>
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
                            <IconButton id='DAList-DownloadModal-button-PayoutReport' iconVariant='icomoon-download'  onClick={() => handleDownloadReport('payoutReport')} primary ><span style={{ fontSize: '13px' }}>{`${dynamicLabels?.payout_s} Report`}</span></IconButton>
                            <IconButton id='DAList-DownloadModal-button-DAReport' iconVariant='icomoon-download'  onClick={() => handleDownloadReport('excel')} primary ><span style={{ fontSize: '13px' }}>{`${dynamicLabels?.deliveryboy_s} Report` || 'Excel'}</span></IconButton>
                            <IconButton id='DAList-DownloadModal-button-PerformanceReport' iconVariant='icomoon-download'  primary iconSize={11} onClick={() => handleDownloadReport('performanceReport')}><span style={{ fontSize: '13px' }}>Performance Report</span></IconButton>
                            <IconButton id='DAList-DownloadModal-button-OdometerProofs' iconVariant='icomoon-download'  primary iconSize={11} onClick={() => handleDownloadReport('odometerProofs')}><span style={{ fontSize: '13px' }}>Odometer Proofs</span></IconButton>
                        </Box>
                    }
                />

            </ModalWrapper>
            {showDownloadSuccess && <DownloadMessage
                showInfoModal={showDownloadSuccess}
                onToggle={setShowDownloadSuccess}
            />}
        </>

    )
        : null

}
export default withRedux(DownloadModal)
