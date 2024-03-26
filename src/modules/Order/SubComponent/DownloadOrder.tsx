import moment from 'moment';
import React from "react";
import {
    Box,
    IconButton,
    useToast,
} from "ui-library";
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import firebaseRef from '../../../utils/firebase'
import { useTypedSelector } from '../../../utils/redux/rootReducer';
const DownloadOrder = (props: any) => {
    const { isShowDowloadModal, selectedRows, startDate: stDate, endDate: eDate, selectedStatus, setIsShowDowloadModal, fetchOptions, setShowInformationModal } = props
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    const filterDateFormatter = React.useCallback((date?: Date) => {
        let formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
        let timezone = JSON.parse(localStorage.getItem('userAccessInfo') || "")['timezone'] || "";
        return moment.tz(formattedDate, "YYYY-MM-DD HH:mm:ss", timezone,).utc().format("YYYY-MM-DD HH:mm:ss");
      }, []);
    const startDate = filterDateFormatter(stDate)
    const endDate = filterDateFormatter(eDate)
    const toast = useToast();
    const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload);

    const getSocketConnection = (timestamp: any) => {
        let timeStampString = timestamp.toString();
        let accessToken = localStorage.getItem('userAccessInfo');
        accessToken = accessToken ? JSON.parse(accessToken).token : null;
        const driverCreateRef = firebaseRef.database().ref(`sockets/orderreport/${accessToken}/${timeStampString}`)

        driverCreateRef.on('value', function (snapshot) {
            console.log('on update:', snapshot.val());
            if (snapshot.val()) {
                var reportURL = snapshot.val().value;
                if (reportURL && reportURL == "ORDER_REPORT_FAILED") {
                    console.log("Failed");
                    toast.add(dynamicLabels["internal.server.error"] != null ? dynamicLabels["internal.server.error"] : "Internal Server Error", 'warning', false);
                } else if (reportURL && reportURL.length > 0) {
                    console.log('Download Complete ', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                    console.log(reportURL, "Done");
                    window.location.href = reportURL;

                }
                driverCreateRef.off('value');
            }
        });
    }
    const handleBoxesOnly = async () => {
        setIsShowDowloadModal(false)
        setShowInformationModal(true)
        let newURl = apiMappings.order.listView.download
        let params = {};
        newURl = newURl.replace('${endDateFilter}', endDate)
        newURl = newURl.replace('${startDateFilter}', startDate)
        newURl = newURl.replace('${areCratesRequired}', 'true')
        newURl = newURl.replace('${status}', selectedStatus)
        newURl = newURl.replace('${hitStamp}', new Date().getTime().toString())

        params = {
            searchBy: fetchOptions?.filterOptions?.searchBy,
            searchText: fetchOptions?.filterOptions?.searchText
        }


        // if (fetchOptions.filterOptions && fetchOptions.filterOptions.searchBy && fetchOptions.filterOptions.searchText) {
        //     newURl = newURl = `${newURl}&searchBy=${fetchOptions.filterOptions.searchBy}&searchText=${fetchOptions.filterOptions.searchText}`
        // }
        // console.log(newURl, 'handlePackages')
        console.log('Download Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
        getSocketConnection(new Date().getTime().toString());
        const packageData = await axios.post(newURl, filterListPayload, { params })
        console.log(packageData, 'packageData')

        // saveAs(new Blob([packageData?.data], { type: "application/vnd.ms-excel xlsx" }), 'OrderReport' + ".xlsx");

        // console.log(packageData, 'handleoPKG')
    }

    const handlePackages = async () => {
        setIsShowDowloadModal(false)
        setShowInformationModal(true)
        let newURl = apiMappings.order.listView.download
        let params = {};
        console.log(fetchOptions);
        newURl = newURl.replace('${endDateFilter}', endDate.replace(' ', '+'))
        newURl = newURl.replace('${startDateFilter}', startDate.replace(' ', '+'))
        newURl = newURl.replace('${areCratesRequired}', 'false')
        newURl = newURl.replace('${status}', selectedStatus)
        newURl = newURl.replace('${hitStamp}', Date.now().toString())

        params = {
            searchBy: fetchOptions?.filterOptions?.searchBy,
            searchText: fetchOptions?.filterOptions?.searchText
        }



        // if (fetchOptions.filterOptions && fetchOptions.filterOptions.searchBy && fetchOptions.filterOptions.searchText) {
        //     newURl = newURl = `${newURl}&searchBy=${fetchOptions.filterOptions.searchBy}&searchText=${fetchOptions.filterOptions.searchText}`
        // }
        console.log('Download Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
        getSocketConnection(new Date().getTime().toString());
        console.log(newURl, 'handlePackages')
        const packageData = await axios.post(newURl, filterListPayload, { params })
        console.log(packageData, 'packageData')
        // saveAs(new Blob([packageData?.data], { type: "application/vnd.ms-excel xlsx" }), 'OrderReport' + ".xlsx");

        console.log(packageData, 'handleoPKG')

    }

    const handleEpod = async () => {
        setIsShowDowloadModal(false)
        const shipmentIds = Object.values(selectedRows).map((row: any) => row.shipmentId.toString())
        if(shipmentIds.length > 200){
            toast.add(dynamicLabels.onlySelectCount ? dynamicLabels.onlySelectCount : "You can only Select 200 Orders", "warning", false)
            return 
        }
        
        if (shipmentIds.length < 1) {
            toast.add(dynamicLabels.selectOrdersEpod, "warning", false)
        } else {
            let userAccessInfo = localStorage.getItem('userAccessInfo') || "";
            try {
                const data = await axios.post(apiMappings.order.listView.epod, shipmentIds, {
                    params: {
                        'access_token': JSON.parse(userAccessInfo)['accessToken'].split('BASIC ')[1].trim(),
                        'CLIENT_SECRET_KEY': JSON.parse(userAccessInfo)['CLIENT_SECRET_KEY']
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: false,
                    responseType: 'arraybuffer'
                });

                if (data.data) {
                    saveAs(new Blob([data.data], { type: "application/zip" }), "EPOD" + ".zip");
                }
            } catch (error) {
                console.log(error, "Download EPOD error");
            }

        }
    }
    const handleCreateBarcode = async () => {
        setIsShowDowloadModal(false)
        let newURl = apiMappings.order.listView.barcode
        newURl = newURl.replace('${endTimeFilter}', endDate)
        newURl = newURl.replace('${startTimeFilter}', startDate)
        const data = await axios.post(newURl);
        // var divToPrint = document.getElementById("printBarcode");
        if (data.data) {
            printCrateBarcode(data.data);
        }
    }

    // var data="null";
    const printCrateBarcode = function (data: any) {
        var style = '<style type="text/css">' +
            '<style type="text/css">' +
            'table{' +
            ' border: 1px solid gray;' +
            ' border-collapse: collapse;' +
            ' border-spacing: 0;' +
            ' page-break-inside:auto;' +
            '}' +
            'tbody, tr, td { page-break-inside:avoid; page-break-after:auto }' +
            '#breakBody::after {' +
            '   content: ""; display: block;' +
            '   page-break-after: always;' +
            '   page-break-inside: avoid;' +
            '   page-break-before: avoid;' +
            '   -webkit-region-break-inside: avoid;' +
            '   break-inside: avoid;' +
            '}' +
            'table td{' +
            ' border: 1px solid gray;' +
            ' font-family: OpenSans !important;' +
            ' font-size: 8px;' +
            ' font-weight: normal;' +
            '}' +
            'table th{' +
            ' font-family: OpenSans-Bold !important;' +
            ' font-size: 10px;' +
            '}' +
            '.colmd-1{' +
            ' width: 31% !important; float:left;' +
            'padding:5px; !important;' +
            '}' +
            '.crateOrderNo, .crateCd, .crateBarcode{' +
            'display:inline-block;width: 200px; padding: 3px !important;' +
            'text-align:center !important;' +
            '</style>';
        var script = '<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/JsBarcode.all.min.js"></script>'
        var html = "";
        data.data.forEach(function (value: any) {
            html += `<div class='crateOrderNo'>
                                <span>${value.orderNo}</span>
                                <svg class="barcode" jsbarcode-value=${value.crateCd[0]} jsbarcode-width='2'></svg>
                            </div>`
        })

        // console.log("Barcode calling");
        var newWin = open("");
        newWin?.document.open("text/html");
        newWin?.document.write("<html><head>");
        newWin?.document.write(html);
        newWin?.document.write(script);
        newWin?.document.write(style);
        newWin?.document.write("</head><body>");
        newWin?.document.write(`<script>JsBarcode(".barcode",{format: "pharmacode",
            lineColor: "#fff",
            width: 4,
            height: 40,
            displayValue: false}).init();</script></body></html>`);

        // var ctlTd = document.getElementById('printBarcode');
        // if (ctlTd) {
        //     ctlTd?.wrapInner('<div class="avoidBreak" />');
        // }
        setTimeout(function () { // wait until all resources loaded
            // newWin.document.close(); // necessary for IE >= 10
            newWin?.focus(); // necessary for IE >= 10
            setTimeout(() => {
                newWin?.print(); // change window to winPrint
                newWin?.close(); // change window to winPrint
            }, 500)

        }, 0);


        return true;

    }
    return isShowDowloadModal && <>
        <div
        >

            <div style={{ fontSize: 12, color: '#000', padding: "15px" }}>{dynamicLabels['downloadOrderCrateText'] || "Click on the below buttons to download the Package reports."}</div>
            <Box
                horizontalSpacing="10px"
                display="flex"
                style={{ padding: '15px' }}
                justifyContent="flex-end"
            >
                <IconButton
                    id="OrderList-DownloadModal-button-OrderReport"
                    iconVariant="icomoon-download-excel"
                    primary
                    color='white'
                    onClick={() => handlePackages()}
                    children={dynamicLabels.downloadOrderCsv}
                />
                <IconButton
                    id="OrderList-DownloadModal-button-CrateReport"
                    iconVariant="icomoon-download-excel"
                    iconSize={11}
                    onClick={() => handleBoxesOnly()}
                    primary
                    children={dynamicLabels.downloadCrateCsv}
                />
                <IconButton
                    id="OrderList-DownloadModal-button-CrateBarcodes"
                    iconVariant="barcode"
                    iconSize={11}
                    onClick={() => handleCreateBarcode()}
                    primary
                    children='Crate Barcodes'
                />
                <IconButton
                    id="OrderList-DownloadModal-button-EPODReport"
                    iconVariant="icomoon-download-image"
                    iconSize={11}
                    onClick={() => handleEpod()}
                    primary
                    children={dynamicLabels.downloadEpod}
                />
            </Box>
        </div>
    </>


}


export default DownloadOrder