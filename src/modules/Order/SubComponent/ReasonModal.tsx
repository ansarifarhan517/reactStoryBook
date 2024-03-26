import React, { useState, useEffect } from 'react';
import { tDatePickerChildren } from './SubCompoenent.models';
import moment from "moment";
import {
    Box,
    IconButton,
    Modal,
    ModalHeader,
    DropDown, TextInput,
    DatePicker,
    useToast

} from "ui-library";
import { useTypedSelector } from '../../../utils/redux/rootReducer';
const ReasonModal = (props: any) => {
    const { isAttemtedDate, selectedRows, isShowReasonModal, setIsShowReasonModal, reasonMessage, setReasonOtherMessage, reasonOtherMessage, setShowConfirmationModal, setReasonSelectedValue, reasonSelectedValue, onRescheduleDateChange } = props

    const clientProperties = useTypedSelector(state => state.clientProperties)
    const dateInAttemptedStatus = useTypedSelector(state => state.order.listView.dateInAttemptedStatus)
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    const [disableUpdate, setDisableUpdate] = useState<boolean>(true);
    const [showReasonTextbox, setShowReasonTextbox] = useState<boolean>(false);
    const today = new Date();
    const [rescheduledDate, setRescheduledDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
    const [deliveryTypeOrderCount, setDeliveryTypeOrderCount] = useState<number>(0)
    const [pickupStartTime, setPickupStartTime] = useState<string>('');
    const [pickupEndTime, setPickupEndTime] = useState<string>('');
    const [deliverStartTime, setDeliverStartTime] = useState<string>('');
    const [deliverEndTime, setDeliverEndTime] = useState<string>('');
    let reasonMapping = {};
    const toast = useToast();
    const handleChange = (value: string) => {
        if (value) {
            (reasonMapping[value].reasonCd == "Other" || reasonMapping[value].clientRefMasterCd == "Other") ? setShowReasonTextbox(true) : setShowReasonTextbox(false);
            // reasonOtherMessage !== "" ? 
            (reasonMapping[value].reasonCd == "Other" || reasonMapping[value].clientRefMasterCd == "Other") ? setDisableUpdate(true) : setDisableUpdate(false);
            let attemptedDate = {
                pickupStartTime: pickupStartTime,
                pickupEndTime: pickupEndTime,
                deliverStartTime: deliverStartTime,
                deliverEndTime: deliverEndTime
            }

            setReasonSelectedValue({ reason: reasonMapping?.[value]['clientRefMasterDesc'], reasonId: reasonMapping?.[value]['clientRefMasterId'], reasonCd: reasonMapping?.[value]['clientRefMasterCd'], attemptedDate: attemptedDate });
            if (reasonMapping?.[value]['clientRefMasterCd'].toLowerCase().includes('reschedule')) {
                onRescheduleDateChange(rescheduledDate)
            }
            // setDisableUpdate(false)
        } else {
            setReasonSelectedValue({ reason: '', reasonId: '', reasonCd: '', attemptedDate: {} });
        }


        // if(value){
        //     (reasonMapping[value].reasonCd == "Other" || reasonMapping[value].clientRefMasterCd == "Other")? setShowReasonTextbox(true) : setShowReasonTextbox(false);
        //     // reasonOtherMessage !== "" ? 
        //     (reasonMapping[value].reasonCd == "Other" || reasonMapping[value].clientRefMasterCd == "Other")? setDisableUpdate(true): setDisableUpdate(false);
        //     setReasonSelectedValue({reason: reasonMapping?.[value]['clientRefMasterDesc'],reasonId:  reasonMapping?.[value]['clientRefMasterId']});
        // } else{
        //     setDisableUpdate(true);
        //     setShowReasonTextbox(false);
        //     setReasonSelectedValue({});
        // }
    }

    const handleRescheduleDateChange = (d: any) => {
        setRescheduledDate(d)
        onRescheduleDateChange(d);
    }

    const getOptions = () => {
        return Object.keys(reasonMessage).map(key => {
            reasonMapping[reasonMessage[key].clientRefMasterId] = reasonMessage[key];
            return { value: reasonMessage[key].clientRefMasterId, label: reasonMessage[key].clientRefMasterDesc }
        })
    }

    useEffect(() => {
        const rowsSelected = Object.keys(selectedRows).map(key => selectedRows[key])
        setDeliveryTypeOrderCount(rowsSelected.filter(row => row?.orderType === 'DELIVER').length)
    }, [selectedRows])


    const checkAttepmted = () => {
        if (isAttemtedDate) {
            if (dateInAttemptedStatus && Object.keys(dateInAttemptedStatus).length) {

                if (pickupStartTime && !pickupEndTime) {
                    toast.add(dynamicLabels.pickupEndTimeRequired, 'warning', false);
                    return false;
                } else if (!pickupStartTime && pickupEndTime) {
                    toast.add(dynamicLabels.pickupStartTimeRequired, 'warning', false);
                    return false;
                } else if (pickupStartTime && pickupEndTime && moment(moment(pickupStartTime, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' HH:mm')).isAfter(moment(pickupEndTime, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' HH:mm'))) {
                    toast.add(dynamicLabels.pickupEndTimeShouldBeGreaterThanPickupStartTime, 'warning', false);
                    return false;
                }
                if (deliverStartTime && !deliverEndTime) {
                    toast.add(dynamicLabels.deliveryEndTimeRequired, 'warning', false);
                    return false;
                } else if (!deliverStartTime && deliverEndTime) {
                    toast.add(dynamicLabels.deliveryStartTimeRequired, 'warning', false);
                    return false;
                } else if (deliverStartTime && deliverEndTime && moment(moment(deliverStartTime, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' HH:mm')).isAfter(moment(deliverEndTime, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' HH:mm'))) {
                    toast.add(dynamicLabels.deliveryendTimeShouldBeGreaterThanDeliveryStartTime, 'warning', false);
                    return false;
                } else if (pickupStartTime && deliverStartTime && moment(moment(pickupStartTime, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' HH:mm')).isAfter(moment(deliverStartTime, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' HH:mm'))) {
                    toast.add(dynamicLabels.deliveryStartTimeShouldBeGreaterThanPickupStartTime, 'warning', false);
                    return false;
                }
            }
        }
        return true;
    }



    const updateStatus = (value: boolean) => {

        let attemptedDateValid = checkAttepmted();



        if (attemptedDateValid) {
            let attemptedDate = {
                pickupStartTime: pickupStartTime,
                pickupEndTime: pickupEndTime,
                deliverStartTime: deliverStartTime,
                deliverEndTime: deliverEndTime
            }
            setReasonSelectedValue({ reason: reasonSelectedValue.reason, reasonId: reasonSelectedValue.reasonId, reasonCd: reasonSelectedValue.reasonCd, attemptedDate: attemptedDate });
            // setReasonSelectedValue({reasonSelectedValue, ...attemptedDate})
            setIsShowReasonModal(false);
            if (value) {
                setShowConfirmationModal(true);
                setDisableUpdate(true);
                setShowReasonTextbox(false);
                setPickupEndTime("");
                setPickupStartTime("");
                setDeliverEndTime("");
                setDeliverStartTime("");
            }
        }


    }
    const closeReasonModal = () => {
        setIsShowReasonModal(false);
        setDisableUpdate(true);
        setShowReasonTextbox(false);
        setReasonOtherMessage("");
        setPickupEndTime("");
        setPickupStartTime("");
        setDeliverEndTime("");
        setDeliverStartTime("");
        setReasonSelectedValue({ reason: '', reasonId: '', reasonCd: '', attemptedDate: {} });
        onRescheduleDateChange(undefined)
    }

    const setDate = (date: any, field: string) => {
        let newDate = "";
        newDate = moment(date).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm:ss`);
        switch (field) {
            case 'startDate':
                setPickupStartTime(newDate);
                break;
            case 'startTime':
                setPickupEndTime(newDate);
                break;
            case 'endDate':
                setDeliverStartTime(newDate);
                break;
            case 'endTime':
                setDeliverEndTime(newDate);
                break;
        }

        return;
    }
    return <><Modal
        open={isShowReasonModal}
        onToggle={() => {
            // setIsShowReasonModal(value);
        }}
        size='md'
        children={{
            header: (
                <ModalHeader
                    headerTitle='Select Reason'
                    handleClose={() => closeReasonModal()}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px", justifyContent: 'left' }}
                    width='100%'
                />
            ),
            content: (
                <><DropDown
                    //   variant={text('variant', 'default-select') as tSelectVariant}
                    optionList={getOptions()}
                    label={"Reason"}
                    onChange={handleChange}
                    placeholder={"Select Reason"}
                    value={reasonSelectedValue.reasonId}

                />
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
                    {((reasonSelectedValue?.reasonCd.toLowerCase().includes('reschedule')) && deliveryTypeOrderCount) ? (<DatePicker
                        onChange={handleRescheduleDateChange}
                        label={dynamicLabels.RescheduleOrderDate || 'Reschedule Order Date'}
                        variant='datetime'
                        dropdown
                        className='RescheduleOrderDate'
                        selected={rescheduledDate}
                        excludeDates={[]}
                        error={false}
                        disabled={false}
                        required={false}
                        errorMessage=''
                        style={{ width: '100%', zIndex: "1", top: "60px" }}
                        tillMinDate={new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)}
                        dateToString={(date: Date) => {
                            return moment(date).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())
                        }}
                    >
                        {({ value, open, setOpen }: tDatePickerChildren) => (
                            <div onClick={() => setOpen(!open)}>
                                <TextInput
                                    id='someId'
                                    className='rescheduledOrderDateValue'
                                    placeholder={dynamicLabels.RescheduleOrderDate || 'Reschedule Order Date'}
                                    label={dynamicLabels.RescheduleOrderDate || 'Reschedule Order Date'}
                                    variant='withIcon'
                                    iconVariant='calendar'
                                    iconSize='md'
                                    value={moment(value).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}
                                    onChange={() => { }}
                                    iconStyle={{ padding: '9px 9px 9px 9px' }}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        )}
                    </DatePicker>) :
                        <></>
                    }

                    {(isAttemtedDate && dateInAttemptedStatus?.['general details']) && <>
                        <Box display='flex' justifyContent='space-between'>
                            <DatePicker
                                onChange={(e: any) => {
                                    setDate(e, 'startDate');
                                }
                                }
                                variant='datetime'
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
                                            label={"Pickup Start Time"}
                                            labelColor='text.inputLabel.default'
                                            className='transactionDate'
                                            placeholder={"Pickup Start Time"}
                                            variant='withIcon'
                                            iconVariant='calendar'
                                            iconSize='md'
                                            style={{ width: "240px" }}
                                            // required
                                            //   error={transactionDateError}
                                            // errorMessage='Mandatory field'
                                            value={pickupStartTime}
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
                                variant='datetime'
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
                                            label={"Pickup End Time"}
                                            labelColor='text.inputLabel.default'
                                            className='transactionDate'
                                            placeholder={"Pickup End Time"}
                                            variant='withIcon'
                                            iconVariant='calendar'
                                            iconSize='md'
                                            style={{ width: "240px" }}
                                            // required
                                            //   error={transactionDateError}
                                            // errorMessage='Mandatory field'
                                            value={pickupEndTime}
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
                                variant='datetime'
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
                                            label={"Delivery Start Time"}
                                            labelColor='text.inputLabel.default'
                                            className='transactionDate'
                                            placeholder={"Delivery Start Time"}
                                            variant='withIcon'
                                            iconVariant='calendar'
                                            iconSize='md'
                                            style={{ width: "240px" }}
                                            // required
                                            //   error={transactionDateError}
                                            // errorMessage='Mandatory field'
                                            value={deliverStartTime}
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
                                variant='datetime'
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
                                            label={"Delivery End Time"}
                                            labelColor='text.inputLabel.default'
                                            className='transactionDate'
                                            placeholder={"Delivery End Time"}
                                            variant='withIcon'
                                            iconVariant='calendar'
                                            iconSize='md'
                                            style={{ width: "240px" }}
                                            // required
                                            //   error={transactionDateError}
                                            // errorMessage='Mandatory field'
                                            value={deliverEndTime}
                                            onChange={() => { }}
                                            iconStyle={{ padding: '8px 8px 8px 8px' }}

                                        />
                                    </div>
                                )}
                            </DatePicker>

                        </Box>
                    </>}



                </>

            ),
            footer: (<>
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    style={{ paddingRight: '15px', paddingBottom: '15px' }}
                    justifyContent="flex-end"
                >
                    <IconButton
                        iconVariant="icomoon-save"
                        id="Order-ReasonModal-button-save"
                        disabled={disableUpdate}
                        iconSize={11}
                        primary
                        onClick={() => updateStatus(true)}
                    >
                        {dynamicLabels.save || "Save"}
                    </IconButton>
                    <IconButton
                        iconVariant="icomoon-close"
                        id="Order-ReasonModal-button-close"
                        iconSize={11}
                        onClick={() => closeReasonModal()}
                    >
                        Cancel
                    </IconButton>
                </Box>
            </>
            )
        }}

    />
        {/* <InformationModal isShowModal={showInformationModal} /> */}
    </>
}

export default ReasonModal;