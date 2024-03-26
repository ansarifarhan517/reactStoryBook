import React, { Dispatch, useCallback, useState } from "react";
import { Box, DateRangePicker, TextInput, BreadCrumb, Position,useToast, IconButton } from "ui-library";
import moment from 'moment';
import useClientProperties from "../../../common/ClientProperties/useClientProperties";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { useDispatch } from "react-redux";
import { AdminDashboardActions } from "../../AdminDashboard.actions";
import axios from "../../../../utils/axios";
import FileSaver from 'file-saver';
import DownloadInformationModal from "../../../Order/SubComponent/DownloadInformationModal";
import firebaseRef from "../../../../utils/firebase";
// import { getUTCDateTZ } from "../../../../utils/helper";
const ChartContainerHeader = () => {
    const dispatch = useDispatch<Dispatch<AdminDashboardActions>>()
    const toast = useToast();
    const breadCrumbList = [
        { id: "dashboard", label: "Product Usage Analytics", disabled: true }, 
        { id: "ORDERUSAGE", label: "Order/Milestone Usage", disabled: false }
    ];
    const dateRangePickerRef = React.createRef<HTMLDivElement>();
    const [showDateFilterFlag, setShowDateFilterFlag] = useState(true);
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const format = clientProperties?.DATEFORMAT?.propertyValue ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' HH:mm' : 'DD-MM-YYYY'
    const [showInformationModal,setShowInformationModal] = useState(false);
    
    const dateFormatter = useCallback((date: Date) => {
        return moment(date).format(`${format}`);
    }, [])
    const breadCrumbListOptionList = [
        { value: "ORDERUSAGE", label: "Order/Milestone Usage", id: "ORDERUSAGE" },
        {
            value: "ALLMILEORDERUSAGE",
            label: `AllMile - Order Usage`,
            id: "ALLMILEORDERUSAGE",
        },
        {
            value: "TRIPUSAGE",
            label: `Trip Usage`,
            id: "TRIPUSAGE",
        },
        {
            value: "APIUSAGE",
            label: `API Usage`,
            id: "APIUSAGE",
        },
        {
            value: "USERUSAGE",
            label: `Active Users`,
            id: "USERUSAGE",
        },


    ]
    const dateRange = useTypedSelector(state => state.adminDashboard.adminDashboard.noUsage.dateRange)
    const dateFormatting = `${moment(dateRange.startDate).format(`${format}`)} - ${moment(dateRange.endDate).format(`${format}`)}`;
    const [dateRangePickerText, setDateRangePickerText] = useState<string>(
        dateFormatting
    );

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
                } else if (reportURL && reportURL.length > 0) {
                    console.log(reportURL, "Done");
                    window.location.href = reportURL;

                }
                driverCreateRef.off('value');
            }
        });
    }


    const convertStringToDate = (input: string) => {
        const isValidDateEntered = moment(input, `${format}`).isValid()
        if (isValidDateEntered) {
            return moment(input, `${format}`).toDate()
        }
        return undefined
    }
    const dateToString = (d: Date) => {
        return moment(d).format(format)
    }
    const downloadReport = async ()=>{
        const hitStampNow = Date.now().toString();
        let startDate = moment(dateRange.startDate).format('YYYY-MM-DD HH:mm')
        let endDate = moment(dateRange.endDate).format('YYYY-MM-DD HH:mm')
        const userTimezone = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : '';
        const params = {
            startDt: moment.tz(startDate,'YYYY-MM-DD HH:mm', userTimezone).utc().format("YYYY-MM-DD HH:mm:ss"),
            endDt: moment.tz(endDate, 'YYYY-MM-DD HH:mm', userTimezone).utc().format("YYYY-MM-DD HH:mm:ss"),
            hitStampNow: hitStampNow
        }
        
        
        let morethan_30 = moment(dateRange.endDate).diff(moment(dateRange.startDate), 'days') > 30

        try {
            if (!morethan_30) {
                getSocketConnection(hitStampNow)
                const { data } = await axios.post("/ReportingApp/product/usage/download" + "?startDt=" + params.startDt + "&endDt=" + params.endDt + "&hitStamp=" + params.hitStampNow)
                setShowInformationModal(true);
                console.log(data)
            } else {
                toast.add("Selected date range should cover less than or equal to 31 days to download the report", 'warning', false);
            }
        } catch (error) {
            console.log(error, "asd")
            debugger;
            toast.add("Report download already in progress", "warning", false);
        } //xxxx
       
            
        
         
    }
    return (
        <>
            <Box display="flex" style={{ padding: "15px" }} justifyContent="space-between" id="chartHeader">
                <Box>
                    <BreadCrumb options={breadCrumbList} optionList={breadCrumbListOptionList} onClick={(id: string) => {
                        setShowDateFilterFlag(id !== "USERUSAGE")
                        dispatch({
                            type: "@@adminDashboard/SET_USAGE_MODE",
                            payload: id
                        })

                    }}></BreadCrumb>
                </Box>
                <Box display="flex">
                    <IconButton
                        intent="page"
                        style={{height: "40px", maxHeight:"40px",width:"40px",marginRight: "10px"}}
                        onlyIcon
                        iconVariant="icomoon-download"
                        iconSize={20}
                        onClick={downloadReport}
                        className="overALlSummaryDownloadBtn"
                    />
                    {showDateFilterFlag &&<DateRangePicker
                        id="orderListDateRangePicker"
                        variant="daterange"
                        style={{ position: "absolute", right:0,  top:"40px", zIndex: 99999 }}
                        open={false}
                        startDate={new Date(dateRange.startDate)}
                        endDate={new Date(dateRange.endDate)}
                        showTime={true}
                        fromDateFormatter={dateFormatter}
                        toDateFormatter={dateFormatter}
                        stringToDate={convertStringToDate}
                        dateToString={dateToString}
                        timeFormat={12}
                        tillMaxDate={ new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            new Date().getDate(),
                            )}
                         onApply={(range) => {
                            if (range) {
                                const stDate = moment(range[0]).format(`${format}`)
                                const eDate = moment(range[1]).format(`${format}`)
                                // setFetchOptions({ ...fetchOptions, startDateFilter: filterDateFormatter(range[0]), endDateFilter: filterDateFormatter(range[1]) })
                                dispatch({
                                    type: "@@adminDashboard/SET_DATE_RANGE",
                                    payload: { dateRange: { startDate: new Date(range[0]).getTime(), endDate: new Date(range[1]).getTime() } },
                                });
                                setDateRangePickerText(`${stDate} - ${eDate}`);
                            }
                        }}
                    >
                        {({ setOpen }) => {
                            return (
                                <div ref={dateRangePickerRef}>
                                    <Position
                                        type="relative"
                                        display="inline-block"
                                        style={{ boxShadow: "0 2px 11px -5px #000", width: "220px" }}
                                    >
                                        <TextInput
                                            id="orderListDateRange"
                                            variant="withIcon"
                                            iconVariant="calendar"
                                            border={false}
                                            color={"primary.main"}
                                            style={{ width: "194px", minHeight: "30px" }}
                                            iconSize="xs"
                                            iconStyle={{ padding: "7px 7px 7px 7px" }}
                                            onClick={() => {

                                                setOpen(true);

                                            }}
                                            onIconClick={() => {

                                                setOpen(true);

                                            }}
                                            value={dateRangePickerText}
                                        />
                                    </Position>
                                </div>
                            );
                            // <div onClick={() => setOpen(!open)}>{value[0] + ' - ' + value[1]}</div>
                        }}
                    </DateRangePicker>}
                </Box>



            </Box>
            <DownloadInformationModal showModal={showInformationModal} setShowModal={(value:boolean)=>setShowInformationModal(value)} />
        </>
    );
}

export default ChartContainerHeader;