import React, { useState } from "react";
import { Box, IconButton, Modal, ModalHeader, DatePicker, TextInput, useToast,DropDown } from "ui-library";
import moment from 'moment';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping'
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { sendGA } from "../../../utils/ga";


const BulkUploadModal = (props: any) => {
    const { showBulkUploadModal, setShowBulkUploadModal, selectedRows, successCallBack } = props
    const toast = useToast();
    const clientProperties = useTypedSelector(state=>state.clientProperties);
    const dynamicLabels = useTypedSelector(state=>state.dynamicLabels);
    const [startDate, setStartDate] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [selectedStatus,setSelectedStatus] = useState<string>('');
    const [selectedBranch,setSelectedBranch] = useState<string>('');
    const buttonStructure = useTypedSelector(state=>state.order.listView.structure.buttons);
    const [disableUpdate,setDisableUpdate] = useState<boolean>(false);
    const branches = useTypedSelector(state=>state.order.listView.branches);
    const [showReasonTextbox, setShowReasonTextbox] = useState<boolean>(false);
    const [reasonOtherMessage, setReasonOtherMessage] = useState("");
    const [reasonMessage, setReasonMessage] = useState([]);
    const [showReason,setShowReason]= useState<boolean>(false);
    const [reasonSelectedValue, setReasonSelectedValue] = useState({ reason: '', reasonId: '', reasonCd: ''});
    let reasonMapping = {};
    const getUTCDateTZ = (dateVal: string, dateFormatFrom?: string, timezone?: string) => {
        // const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
        const userTimezone = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : '';
        if (dateFormatFrom && dateFormatFrom.length > 0 && timezone && timezone.length > 0) {
            return moment.tz(dateVal, dateFormatFrom, timezone).utc();
        } else if (dateFormatFrom && dateFormatFrom.length > 0 && (!timezone || timezone.length <= 0)) {
            return moment.tz(dateVal, dateFormatFrom, userTimezone).utc();
        } else if (timezone && timezone.length > 0 && (!dateFormatFrom || dateFormatFrom.length <= 0)) {
            return moment.tz(dateVal, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' ' + 'HH:mm', timezone).utc();
        } else if ((!dateFormatFrom || dateFormatFrom.length <= 0) && (!timezone || timezone.length <= 0) && userTimezone) {
            return moment.tz(dateVal, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' ' + 'HH:mm', userTimezone).utc();
        } else {
            return undefined;
        }
    }
    const updateOrder = async () => {
        setDisableUpdate(true);
        sendGA('Event New',`Assign Now - bulk`)
        const updateOrderList: any = [];
        Object.keys(selectedRows).map((key) => {
            
            let updateObj = {};
            const userTimezone = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : '';
            let selectedStartDate: string = startDate ? startDate : moment(selectedRows[key].startTimeWindow).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`);
            let seelctedStartTime: string = startTime ? startTime : moment(selectedRows[key].startTimeWindow).tz(userTimezone).format('HH:mm');
            var selectedEndDate = endDate ? endDate : moment(selectedRows[key].endTimeWindow).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`);
            var selectedEndTime = endTime ? endTime : moment(selectedRows[key].endTimeWindow).tz(userTimezone).format('HH:mm');

            let startDateTimeWindow = selectedStartDate + " " + seelctedStartTime;
            let endDateTimeWindow = selectedEndDate + " " + selectedEndTime;
            // let startDateTimeWindow = startDate + " " + startTime
            //when startTime && endtime both are there
            var isValidDates = true;
            let errorMsg = "";
            if (startDateTimeWindow && endDateTimeWindow) {
                if (!moment(moment(startDateTimeWindow, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)).isAfter(moment(selectedRows[key].orderDate))) {
                    isValidDates = false;
                    errorMsg = dynamicLabels.startDateShouldBeGreaterThanOrderDate;
                } else if (!moment(moment(endDateTimeWindow, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)).isAfter(moment(moment(startDateTimeWindow, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)))) {
                    isValidDates = false;
                    errorMsg = dynamicLabels.startTimewindowShouldBeLesserThanEndTimeWindow;
                }
            } else {
                //when startTime && endtime one of them is there
                if (startDateTimeWindow && !endDateTimeWindow) {
                    if (!moment(moment(startDateTimeWindow, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)).isAfter(moment(selectedRows[key].orderDate))) {
                        isValidDates = false;
                        errorMsg = dynamicLabels.startTimewindowShouldBeLesserThanEndTimeWindow;
                    }
                } else if (!startDateTimeWindow && endDateTimeWindow) {
                    if (!moment(moment(endDateTimeWindow, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)).isAfter(moment(selectedRows[key].orderDate))) {
                        isValidDates = false;
                        errorMsg = dynamicLabels.endDateShouldBeGreaterThanOrderDate;
                    }
                }
            }
            if (!isValidDates) {
                toast.add(errorMsg, 'warning', false);
                setDisableUpdate(false);
                return;
            }
            updateObj['startTimeWindow'] = JSON.parse(JSON.stringify(getUTCDateTZ(startDateTimeWindow)));
            updateObj['startTimeWindowTZ'] = selectedRows[key]['startTimeWindowTZ'];
            updateObj['endTimeWindow'] = JSON.parse(JSON.stringify(getUTCDateTZ(endDateTimeWindow)));
            updateObj['endTimeWindowTZ'] = selectedRows[key]['endTimeWindowTZ'];
            updateObj['shipmentId'] = selectedRows[key]['shipmentId'];
            if(selectedBranch){
                updateObj["clientBranchId"] = selectedBranch;
                updateObj["deliveryType"]= selectedRows[key]['deliveryType']
            }
            updateOrderList.push(updateObj);
            // console.log(isValidDates);
            // console.log(errorMsg);
        })
        const data = await axios.put(`${apiMappings.order.listView.bulkUpdate}`, updateOrderList);
        
        if (data.status === 200 && !data.data.hasError) {
            setDisableUpdate(false);
            if(selectedStatus){
                let params = Object.values(selectedRows).map((value:any)=>{
                    return {"shipmentId":value.shipmentId,
                    "currentStatus":value.orderStatus,
                    "isPartiallyDelivered":value.isPartialDeliveredFl,
                    ...reasonSelectedValue}
                })

                const data = await axios.put(`ShipmentApp/shipment/fmlm/status?status=${selectedStatus.toUpperCase()}`,params)
                if (data.status === 200 && !data.data.hasError) {
                    toast.add(data.data.message, 'check-round', false);
                    setShowBulkUploadModal(false);
                    successCallBack(); 
                    setSelectedBranch("");
                    setSelectedStatus("");                   
                    setShowReasonTextbox(false);
                }else{
                    toast.add(data.data.message, "warning", false);
                }
            } else{
                toast.add(data.data.message, 'check-round', false);
                setShowBulkUploadModal(false);
                successCallBack();
                setSelectedBranch("");
                setSelectedStatus("");
                setShowReasonTextbox(false);
            }
            setStartDate("")
            setEndDate("")
        } else {
            setDisableUpdate(false);
            toast.add(data.data.message, "error", false);
            
        }
        return;
    }
    const setDate = (date: any, field: string) => {
        let newDate = "";
        switch (field) {
            case 'startDate':
                newDate = moment(date).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`);
                setStartDate(newDate);
                break;
            case 'startTime':
                newDate = moment(date).format('HH:mm');
                setStartTime(newDate);
                break;
            case 'endDate':
                newDate = moment(date).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`);
                setEndDate(newDate);
                break;
            case 'endTime':
                newDate = moment(date).format('HH:mm');
                setEndTime(newDate);
                break;
        }

        return;
    }

    const getStatusOptions =React.useMemo(() => {
        if(Object.keys(buttonStructure).length && buttonStructure.markAs && buttonStructure?.markAs?.childNodes){
            return Object.keys(buttonStructure?.markAs?.childNodes).map((key) => {
                return {value : key, label: buttonStructure?.markAs?.childNodes?.[key].label}
            })
        } else {
            return {}
        }
    },[buttonStructure])

    const getBranchOptions =React.useMemo(() => {
        if(Object.keys(branches).length){
            return Object.keys(branches).map((key) => {
                return {value : branches[key].id, label: branches[key].name}
            })
        } else{
            return {}
        }
    },[branches])

    const getOptions = () => {
        return Object.keys(reasonMessage).map(key => {
            reasonMapping[reasonMessage[key].clientRefMasterId] = reasonMessage[key];
            return { value: reasonMessage[key].clientRefMasterId, label: reasonMessage[key].clientRefMasterDesc }
        })
    }
    const handleChange = (value: string) =>{
        (reasonMapping[value].reasonCd == "Other" || reasonMapping[value].clientRefMasterCd == "Other") ? setShowReasonTextbox(true) : setShowReasonTextbox(false);
            // reasonOtherMessage !== "" ? 
        (reasonMapping[value].reasonCd == "Other" || reasonMapping[value].clientRefMasterCd == "Other") ? setDisableUpdate(true) : setDisableUpdate(false);
        setReasonSelectedValue({ reason: reasonMapping?.[value]['clientRefMasterDesc'], reasonId: reasonMapping?.[value]['clientRefMasterId'], reasonCd: reasonMapping?.[value]['clientRefMasterCd']});
        console.log(reasonSelectedValue)
    }
    const handleStatusChange = async (action: string) => {
        
        if (action === 'cancelled' || action == 'notPickedUp' || action == 'notDelivered' || action == 'rtm') {
            let type:string = "";    
            switch(action){
                case "cancelled":
                    type = 'CANCELREASONS'
                    break;
                    case "notPickedUp":
                        type = 'NOTPICKEDUP'
                        break;
                        case "notDelivered":
                            type = 'NOTDELIVERED'
                            break;
                            case "rtm":
                                type = 'REATTEMPT'
                                break;
                                default:
                                    type = 'REJECTREASON'
                                    break;
            }


            const res = await axios.get(apiMappings.order.listView.getReasons,{
                params: {
                  type: type
                }
              });
             if(res.data){
                setReasonMessage(res.data);
                setShowReason(true);
             } 
            
        } else {
            setShowReason(false);
        }


        

    }
    return <Modal
        open={showBulkUploadModal}
        onToggle={(value: boolean) => {
            setShowBulkUploadModal(value);
        }}
        // width='800px'
        children={{
            header: (
                <ModalHeader
                    headerTitle='Bulk Update'
                    handleClose={() => setShowBulkUploadModal(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (
                <>
                    <Box display='flex' justifyContent='space-between'>
                        <DatePicker
                            onChange={(e: any) => {
                                setDate(e, 'startDate');
                            }
                            }
                            variant='date'
                            label={dynamicLabels['selectDate']}
                            placeholder={dynamicLabels['selectDate']}
                            timeFormat={24}
                            style={{
                                position: 'absolute',
                                top: "60px",
                                right: 'auto',
                                zIndex: 999
                            }}
                        >
                            {({ open, setOpen }) => (
                                <div onClick={() => setOpen(!open)}>
                                    <TextInput
                                        id='transactionDate'
                                        name='transactionDate'
                                        label={dynamicLabels['startDate']}
                                        labelColor='text.inputLabel.default'
                                        className='transactionDate'
                                        placeholder={dynamicLabels['startDate']}
                                        variant='withIcon'
                                        iconVariant='calendar'
                                        iconSize='md'
                                        style={{width:"240px"}}
                                        autoComplete="off"
                                        // required
                                        //   error={transactionDateError}
                                        // errorMessage='Mandatory field'
                                        value={startDate}
                                        onChange={() => { }}
                                        iconStyle={{ padding: '8px 8px 8px 8px' }}
                                    />
                                </div>
                            )}
                        </DatePicker>
                        <DatePicker
                            onChange={(e: any) => {
                                setDate(e, 'startTime');
                            }
                            }
                            variant='time'
                            label={dynamicLabels['selectTime']}
                            placeholder={dynamicLabels['selectTime']}
                            timeFormat={24}
                            style={{
                                position: 'absolute',
                                top: "60px",
                                right: 'auto',
                                zIndex: 999
                            }}
                        >
                            {({ open, setOpen }) => (
                                <div onClick={() => setOpen(!open)}>
                                    <TextInput
                                        id='transactionDate'
                                        name='transactionDate'
                                        label={dynamicLabels['startTime']}
                                        labelColor='text.inputLabel.default'
                                        className='transactionDate'
                                        placeholder={dynamicLabels['startTime']}
                                        variant='withIcon'
                                        iconVariant='calendar'
                                        iconSize='md'
                                        style={{width:"240px"}}
                                        autoComplete="off"
                                        // required
                                        //   error={transactionDateError}
                                        // errorMessage='Mandatory field'
                                        value={startTime}
                                        onChange={() => { }}
                                        iconStyle={{ padding: '8px 8px 8px 8px' }}

                                    />
                                </div>
                            )}
                        </DatePicker>
                    </Box>
                    <Box display='flex' justifyContent='space-between'>
                        <DatePicker
                            onChange={(e: any) => {
                                setDate(e, 'endDate');
                            }
                            }
                            variant='date'
                            label={dynamicLabels['selectDate']}
                            placeholder={dynamicLabels['selectDate']}
                            timeFormat={24}
                            style={{
                                position: 'absolute',
                                top: "60px",
                                right: 'auto',
                                zIndex: 999
                            }}
                        >
                            {({ open, setOpen }) => (
                                <div onClick={() => setOpen(!open)}>
                                    <TextInput
                                        id='transactionDate'
                                        name='transactionDate'
                                        label={dynamicLabels['endDate']}
                                        labelColor='text.inputLabel.default'
                                        className='transactionDate'
                                        placeholder={dynamicLabels['endDate']}
                                        variant='withIcon'
                                        iconVariant='calendar'
                                        iconSize='md'
                                        style={{width:"240px"}}
                                        // required
                                        //   error={transactionDateError}
                                        // errorMessage='Mandatory field'
                                        autoComplete="off"
                                        value={endDate}
                                        onChange={() => { }}
                                        iconStyle={{ padding: '8px 8px 8px 8px' }}

                                    />
                                </div>
                            )}
                        </DatePicker>
                        <DatePicker
                            onChange={(e: any) => {
                                setDate(e, 'endTime');
                            }
                            }
                            variant='time'
                            label={dynamicLabels['selectDate']}
                            placeholder={dynamicLabels['selectDate']}
                            timeFormat={24}
                            style={{
                                position: 'absolute',
                                top: "60px",
                                right: 'auto',
                                zIndex: 999
                            }}
                        >
                            {({ open, setOpen }) => (
                                <div onClick={() => setOpen(!open)}>
                                    <TextInput
                                        id='transactionDate'
                                        name='transactionDate'
                                        label={dynamicLabels['endTime']}
                                        labelColor='text.inputLabel.default'
                                        className='transactionDate'
                                        placeholder={dynamicLabels['endTime']}
                                        variant='withIcon'
                                        iconVariant='calendar'
                                        iconSize='md'
                                        style={{width:"240px"}}
                                        autoComplete="off"
                                        // required
                                        //   error={transactionDateError}
                                        // errorMessage='Mandatory field'
                                        value={endTime}
                                        onChange={() => { }}
                                        iconStyle={{ padding: '8px 8px 8px 8px' }}

                                    />
                                </div>
                            )}
                        </DatePicker>
                        
                    </Box>
                    {buttonStructure?.markAs && buttonStructure?.markAs?.childNodes && 
                    <><DropDown
                    //   variant={text('variant', 'default-select') as tSelectVariant}
                    optionList={getStatusOptions}
                    label={"Status"}
                    onChange={(val:any)=>{
                        setSelectedStatus(val);
                        handleStatusChange(val);
                    }}
                    placeholder={"Select Status"}
                />
                       {showReason && <DropDown
                    //   variant={text('variant', 'default-select') as tSelectVariant}
                    optionList={getOptions()}
                    label={"Reason"}
                    onChange={handleChange}
                    placeholder={"Select Reason"}
                    value={reasonSelectedValue.reasonId}

                />}
                                    {showReasonTextbox && <TextInput
                        id='id-brandProfileName'
                        name='brandProfileName'
                        className='someClassName'
                        value={reasonOtherMessage}
                        onChange={(e: { target: { value: any } }) => {
                            e.target.value !== "" ? setDisableUpdate(false) : setDisableUpdate(true);
                            setReasonOtherMessage(e.target.value)
                        }}
                        label={dynamicLabels?.reason ? dynamicLabels?.reason : 'Reason'}
                        labelColor={'text.inputLabel.default'}
                        placeholder={'Enter Reason here'}
                        errorMessage={dynamicLabels?.brandProfileNameErrorMessage}
                        required={true}
                        fullWidth={true}
                    />}
                
                </>
        }
                 
                <DropDown
                    //   variant={text('variant', 'default-select') as tSelectVariant}
                    optionList={getBranchOptions}
                    label={"Branch"}
                    onChange={(val:any)=>{
                        console.log(val,selectedBranch);
                        setSelectedBranch(val)
                    }}
                    placeholder={"Select Branch"}
                    // value={reasonSelectedValue.reasonId}
                    
                />

                
                
                </>),

            footer: (
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    justifyContent="flex-end"
                    p="15px"
                >
                    <IconButton
                         id='BulkUpload-Modal-button-Update'
                        iconVariant="icomoon-save"
                        primary
                        onClick={updateOrder}
                        disabled={disableUpdate}
                    >
                        {dynamicLabels.update}
                    </IconButton>
                    <IconButton
                         id='BulkUpload-Modal-button-Close'
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => {setShowBulkUploadModal(false);
                            setShowReason(false);
                            setReasonSelectedValue({ reason: '', reasonId: '', reasonCd: ''})
                            setShowReasonTextbox(false);
                        }}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            ),

        }}

    />


}

export default BulkUploadModal