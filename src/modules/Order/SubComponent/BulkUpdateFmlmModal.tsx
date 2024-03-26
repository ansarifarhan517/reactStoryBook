import React, { useEffect, useState } from 'react';
import { BulkUpdateWrapper } from '../OrderListView/StyledOrderListView';
import { Modal, ModalHeader, Box, IconButton, useToast, SectionHeader, Grid, Loader, DropDown, TextInput } from 'ui-library'; 
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SectionHeaderContainer } from '../OrderListView/StyledOrderListView';
import FormField from '../../../utils/components/Form/FormField';
import { generateCustomFieldsFormData } from '../../OrderMiddleMile/BulkUpdate/utils/BulkUpdateForm.utils';
import { metricsConversion } from '../../../utils/helper';
import { ISkillSetOptionData } from '../../OrderMiddleMile/BulkUpdate/BulkUpdate.models';
import DropDownComponent from '../../OrderMiddleMile/BulkUpdate/utils/DropdownComponent';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import moment from 'moment';
import { timeWindowConfirmedByArray } from '../../../utils/constants';
import { IMongoFormStructure } from '../../../utils/mongo/interfaces';

const BulkUpdateFmlmModal = (props: any) => {
    const { showBulkUploadModalFmlm, setShowBulkUploadModalFmlm, selectedRows, successCallBack, selectedOrderStatus } = props
    const toast = useToast();
    const dispatch = useDispatch();
    const clientProperties = useTypedSelector(state=>state.clientProperties);
    const dynamicLabels = useTypedSelector(state=>state.dynamicLabels);
    const structure = useTypedSelector(state => state.order.listView.bulkUpdateStructure);
    const clientMetric = useTypedSelector(state => state.order.listView.clientMetric);
    const isLoading = useTypedSelector(state => state.order.listView.apiLoading);
    const buttonStructure = useTypedSelector(state=>state.order.listView.structure.buttons);
    const formInstance = useForm<Record<string, any>>({
        mode: 'all', shouldUnregister: false
    })
    const sectionKeys = Object.keys(structure);

    const [isUpdateBtnDisabled, setIsUpdateBtnDisabled] = useState<boolean>(false)
    const [isTimeWindowMenuOpen, setIsTimeWindowMenuOpen] = useState<boolean>(false);
    const [isDropdownLoading, setIsDropdownLoading] = useState<boolean>(false);
    const [timeWindowOptionMapping, setTimeWindowOptionMapping] = useState<object>({});
    const [timeWindowOptionList, setTimeWindowOptionList] = useState<{value: any, label: string, id?:any}[]>([]);
    const [startDateValue, setStartDateValue] = useState<string>();
    const [startTimeValue, setStartTimeValue] = useState<string>();
    const [endDateValue, setEndDateValue] = useState<string>();
    const [endTimeValue, setEndTimeValue] = useState<string>();
    const [selectedStatus,setSelectedStatus] = useState<string>('');
    const [reasonMessage, setReasonMessage] = useState([]);
    const [showReason,setShowReason]= useState<boolean>(false);
    const [reasonSelectedValue, setReasonSelectedValue] = useState({ reason: '', reasonId: '', reasonCd: ''});
    const [showReasonTextbox, setShowReasonTextbox] = useState<boolean>(false);
    const [reasonOtherMessage, setReasonOtherMessage] = useState("");
    const [newStr, setNewStr] = useState<any>({});
    let reasonMapping = {};

    const { handleSubmit, setValue, reset } = formInstance;

    useEffect(() => {
        if (showBulkUploadModalFmlm) {
            dispatch({type: '@@orderListView/FETCH_BULK_UPDATE_STRUCTURE'});
        }
    }, [showBulkUploadModalFmlm])

    useEffect(() => {
        renderForm(structure);
    }, [structure])

    const renderForm = (structure: IMongoFormStructure) => {
        dispatch({type: '@@orderListView/SET_API_LOADING', payload: true});
        sectionKeys.forEach(section => {
            if (section !== 'additional information') {
                Object.keys(structure[section]).forEach((fieldKey) => {
                    if (selectedOrderStatus === 'INTRANSIT' || selectedOrderStatus === 'PICKEDUP') {
                        if (fieldKey === 'packageWeight' || fieldKey === 'packageVolume') {
                            structure[section][fieldKey].permission = true
                        } else {
                            structure[section][fieldKey].permission = false;
                        }
                    }
                })
            }
        })
        setNewStr(structure);
        dispatch({type: '@@orderListView/SET_API_LOADING', payload: false});
    }

    const getUTCDateTZ = (dateVal: string, dateFormatFrom?: string, timezone?: string) => {
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

    const getStatusOptions =React.useMemo(() => {
        if(Object.keys(buttonStructure).length && buttonStructure.markAs && buttonStructure?.markAs?.childNodes){
            return Object.keys(buttonStructure?.markAs?.childNodes).map((key) => {
                return {value : key, label: buttonStructure?.markAs?.childNodes?.[key].label}
            })
        } else {
            return {}
        }
    },[buttonStructure])

    const handleTimeWindowChange = (data: string) => {
        if (data) {
            setValue('timeWindowConfirmedBy', timeWindowOptionMapping[data]);
        } else {
            setValue('timeWindowConfirmedBy', {});
        }
    }

    const handleTimeWindowMenuOpen = async () => {
        setIsTimeWindowMenuOpen(true);
        setIsDropdownLoading(true);
        const mapping = {}
        const timeWindowOptionsData = timeWindowConfirmedByArray?.map((option) => {
            mapping[option.value] = option;
            return {label: option.label, value: option.value}
        })
        setTimeWindowOptionMapping(mapping)
        setTimeWindowOptionList(timeWindowOptionsData)
        setIsDropdownLoading(false);
    }

    const handleTimeWindowMenuClose = () => {
        setIsTimeWindowMenuOpen(false);
    }

    const handleStatusChange = async (action: string) => {
        setShowReasonTextbox(false);
        setReasonSelectedValue({reason: '', reasonId: '', reasonCd: ''});
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

    const getOptions = () => {
        return Object.keys(reasonMessage).map(key => {
            reasonMapping[reasonMessage[key].clientRefMasterId] = reasonMessage[key];
            return { value: reasonMessage[key].clientRefMasterId, label: reasonMessage[key].clientRefMasterDesc }
        })
    }

    const handleChange = (value: string) =>{
        (reasonMapping[value].reasonCd == "Other" || reasonMapping[value].clientRefMasterCd == "Other") ? setShowReasonTextbox(true) : setShowReasonTextbox(false);
        (reasonMapping[value].reasonCd == "Other" || reasonMapping[value].clientRefMasterCd == "Other") ? setIsUpdateBtnDisabled(true) : setIsUpdateBtnDisabled(false);
        setReasonSelectedValue({ reason: reasonMapping?.[value]['clientRefMasterDesc'], reasonId: reasonMapping?.[value]['clientRefMasterId'], reasonCd: reasonMapping?.[value]['clientRefMasterCd']});
    }

    const updateOrder = async (payload) => {
        dispatch({type: '@@orderListView/SET_API_LOADING', payload: true});
        setIsUpdateBtnDisabled(true);
        let weight: any = undefined, volume: any = undefined;
        
        if (payload['packageWeight']) {
            const clientObj = clientMetric?.find(c => c.name === 'weight')
            const val = metricsConversion(payload['packageWeight'], 'POST', clientObj?.conversionFactor)
            weight = Number(val.toFixed(4))
        }
        if (payload['packageVolume']) {
            const clientObj = clientMetric?.find(c => c.name === 'volume')
            const val = metricsConversion(payload['packageVolume'], 'POST', clientObj?.conversionFactor)
            volume = Number(val.toFixed(4))
        }
        const customFieldsData = generateCustomFieldsFormData(structure, payload);

        let requestData: any = [];
        let isValidDates = true;

        Object.keys(selectedRows).map((key) => {
            
            let requestObject = {};
            const userTimezone = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : '';
            let selectedStartDate: string = startDateValue ? startDateValue : moment(selectedRows[key].startTimeWindow).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`);
            let seelctedStartTime: string = startTimeValue ? startTimeValue : moment(selectedRows[key].startTimeWindow).tz(userTimezone).format('HH:mm');
            var selectedEndDate = endDateValue ? endDateValue : moment(selectedRows[key].endTimeWindow).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`);
            var selectedEndTime = endTimeValue ? endTimeValue : moment(selectedRows[key].endTimeWindow).tz(userTimezone).format('HH:mm');

            let startDateTimeWindow = selectedStartDate + " " + seelctedStartTime;
            let endDateTimeWindow = selectedEndDate + " " + selectedEndTime;

            //when startTime && endtime both are there
            let errorMsg = "";
            if (startDateTimeWindow && endDateTimeWindow) {
                if (!moment(moment(startDateTimeWindow, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)).isSameOrAfter(moment(selectedRows[key].orderDate))) {
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
                setIsUpdateBtnDisabled(false);
                dispatch({type: '@@orderListView/SET_API_LOADING', payload: false});
                return;
            } else {
                requestObject['startTimeWindow'] = JSON.parse(JSON.stringify(getUTCDateTZ(startDateTimeWindow)));
                requestObject['startTimeWindowTZ'] = selectedRows[key]['startTimeWindowTZ'];
                requestObject['endTimeWindow'] = JSON.parse(JSON.stringify(getUTCDateTZ(endDateTimeWindow)));
                requestObject['endTimeWindowTZ'] = selectedRows[key]['endTimeWindowTZ'];
                requestObject['shipmentId'] = selectedRows[key]['shipmentId'];
                requestObject['customFields'] = customFieldsData;
                delete payload['startDate']
                delete payload['startTime']
                delete payload['endDate']
                delete payload['endTime']
                Object.keys(payload).forEach(key => {
                    if (payload[key] && !key.includes('cf_')) {
                        if (key === 'deliveryType') {
                            requestObject[key] = (payload[key].map((skill: ISkillSetOptionData) => skill.clientRefMasterCd)).toString();
                        } else if(key === 'packageWeight') {
                            requestObject[key] = weight;
                        } else if(key === 'packageVolume') {
                            requestObject[key] = volume;
                        } else if (key === 'paymentType' || key === 'priority' || key === 'serviceType') {
                            requestObject[key] = payload[key]['clientRefMasterCd'];
                        } else if (key === 'distributionCenter') {
                            requestObject['clientBranchId'] = payload[key]['branchId'];
                        } else if (key === 'deliverNotes') {
                            requestObject['shipmentNotes'] = payload[key];
                        } else if (key === 'timeWindowConfirmedBy') {
                            requestObject[key] = payload[key].value
                        } else if (key === 'deliverServiceTime') {
                            requestObject['serviceTime'] = payload[key]
                        } else {
                            requestObject[key] = payload[key];
                        }
                    }
                });
                
                requestData.push(requestObject);
            }
        })

        setIsUpdateBtnDisabled(false);
        if (isValidDates) {
            try {
                const {data} =  await axios.put(apiMappings.order.listView.bulkUpdateFmlm, requestData);
                if (data.status === 200 && !data.hasError) {
                    setIsUpdateBtnDisabled(false);
                    if(selectedStatus){
                        let params = Object.values(selectedRows).map((value:any)=>{
                            return {"shipmentId":value.shipmentId,
                            "currentStatus":value.orderStatus,
                            "isPartiallyDelivered":value.isPartialDeliveredFl,
                            "reason": reasonSelectedValue?.reason == "Other" ? reasonOtherMessage : reasonSelectedValue?.reason,
                            "reasonId": reasonSelectedValue.reasonId,
                            "reasonSelected": reasonSelectedValue.reason
                        }
                        })
        
                        const data = await axios.put(`${apiMappings.order.listView.changeStatus}?status=${selectedStatus.toUpperCase()}`,params)
                        if (data.status === 200 && !data.data.hasError) {
                            toast.add(data.data.message, 'check-round', false);
                            successCallBack(); 
                            handleReset();
                        }else{
                            toast.add(data.data.message, "warning", false);
                        }
                    } else{
                        toast.add(data.message, 'check-round', false);
                        successCallBack();
                        handleReset();
                    }
                    reset({});
                } else {
                    setIsUpdateBtnDisabled(false);
                    toast.add(data.message, 'error', false);
                }
                dispatch({type: '@@orderListView/SET_API_LOADING', payload: false});
            } catch (error) {
                setIsUpdateBtnDisabled(false);
                toast.add(error?.response?.data?.message, 'warning', false);
                dispatch({type: '@@orderListView/SET_API_LOADING', payload: false});
            }
        }
    }

    const setDate = (date, fieldName) => {
        let newDate = "";
        switch (fieldName) {
            case 'startDate':
                newDate = moment(date).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`);
                setStartDateValue(newDate);
                break;
            case 'startTime':
                newDate = moment(date).format('HH:mm');
                setStartTimeValue(newDate);
                break;
            case 'endDate':
                newDate = moment(date).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`);
                setEndDateValue(newDate);
                break;
            case 'endTime':
                newDate = moment(date).format('HH:mm');
                setEndTimeValue(newDate);
                break;
        }
    }

    const handleReset = () => {
        setNewStr({});
        setSelectedStatus("");
        setShowReasonTextbox(false);
        setShowReason(false);
        setReasonSelectedValue({reason: '', reasonId: '', reasonCd: ''});
        setReasonOtherMessage("");
        reset({});
        setShowBulkUploadModalFmlm(false);
    }

    return (
        <BulkUpdateWrapper className="bulk-update-wrapper">
            <Modal
                open={showBulkUploadModalFmlm}
                onToggle={() => {handleReset()}}
                width='1080px'
                children={{
                    header: (
                        <ModalHeader
                            headerTitle='Update Orders'
                            handleClose={() => {handleReset()}}
                            imageVariant="icomoon-close"
                            headerStyle={{ fontSize: "15px" }}
                            width='100%'
                        />
                    ),
                    content: (
                        <Box style={{maxHeight: '300px', overflow: 'auto', overflowX: 'hidden', paddingRight: '10px'}}>
                            {isLoading && <Loader center fadeBackground />}
                            {!!sectionKeys?.length && !!Object.keys(newStr).length &&
                                sectionKeys.map((sectionName) => (
                                    <div key={sectionName}>
                                        <SectionHeaderContainer>
                                            <SectionHeader headerTitle={ dynamicLabels?.[sectionName] || sectionName }/>
                                        </SectionHeaderContainer>
                                        <Grid container spacing="10px" style={{ marginBottom: "15px" }}>
                                            {Object.keys(structure[sectionName]).map(fieldName => {
                                                const meta = structure[sectionName][fieldName]
                                                meta.multipleFiles = false
                                                const { permission } = meta
                                                if (!permission) {
                                                    return undefined
                                                }
                                                if (fieldName === 'orderStatus' && buttonStructure?.markAs && buttonStructure?.markAs?.childNodes) {
                                                    return (
                                                        <>
                                                            <Grid item key={fieldName} xs={12} sm={6} md={4} className='grid-item'>
                                                                <DropDown
                                                                    optionList={getStatusOptions}
                                                                    label={"Status"}
                                                                    onChange={(val:any)=>{
                                                                        setSelectedStatus(val);
                                                                        handleStatusChange(val);
                                                                    }}
                                                                    placeholder={"Select Status"}
                                                                />
                                                            </Grid>
                                                            {showReason && 
                                                                <Grid item key={`${fieldName}-reason`} xs={12} sm={6} md={4} className='grid-item'>
                                                                    <DropDown
                                                                    //   variant={text('variant', 'default-select') as tSelectVariant}
                                                                    optionList={getOptions()}
                                                                    label={"Reason"}
                                                                    onChange={handleChange}
                                                                    placeholder={"Select Reason"}
                                                                    value={reasonSelectedValue.reasonId}
                                                                    />
                                                                </Grid>
                                                            }
                                                            {showReasonTextbox && 
                                                            
                                                                <Grid item key={`${fieldName}-reasonText`} xs={12} sm={6} md={4} className='grid-item'>
                                                                    <TextInput
                                                                        id='id-reasonText'
                                                                        name='reasonText'
                                                                        className='someClassName'
                                                                        value={reasonOtherMessage}
                                                                        onChange={(e: { target: { value: any } }) => {
                                                                            e.target.value !== "" ? setIsUpdateBtnDisabled(false) : setIsUpdateBtnDisabled(true);
                                                                            setReasonOtherMessage(e.target.value)
                                                                        }}
                                                                        label={dynamicLabels?.reason ? dynamicLabels?.reason : 'Reason'}
                                                                        labelColor={'text.inputLabel.default'}
                                                                        placeholder={'Enter Reason here'}
                                                                        errorMessage={dynamicLabels?.brandProfileNameErrorMessage}
                                                                        required={true}
                                                                        fullWidth={true}
                                                                    />
                                                                </Grid>
                                                            }
                                                        </>
                                                    )
                                                } else if (fieldName === 'timeWindowConfirmedBy') {
                                                    return (
                                                        <Grid item key={fieldName} xs={12} sm={6} md={4} className='grid-item'>
                                                            <DropDownComponent
                                                                name={fieldName}
                                                                meta={meta}
                                                                formInstance={formInstance}
                                                                dropdownOptions={timeWindowOptionList}
                                                                handleChange={(value: string) => handleTimeWindowChange(value)}
                                                                handleMenuOpen={handleTimeWindowMenuOpen}
                                                                handleMenuClose={handleTimeWindowMenuClose}
                                                                menuIsOpen={isTimeWindowMenuOpen}
                                                                isDropdownLoading={isDropdownLoading}
                                                            />
                                                        </Grid>
                                                    )
                                                } else if(fieldName === 'startDate' || fieldName === 'startTime' || fieldName === 'endDate' || fieldName === 'endTime') {
                                                    return (
                                                        <Grid item key={fieldName} xs={12} sm={6} md={4} className='grid-item'>
                                                            <FormField
                                                                name={fieldName}
                                                                meta={meta}
                                                                formInstance={formInstance} 
                                                                onChange={(e => setDate(e, fieldName))}/>
                                                        </Grid>
                                                    )

                                                } else {
                                                    return (
                                                        <Grid item key={fieldName} xs={12} sm={6} md={4} className='grid-item'>
                                                            <FormField
                                                                name={fieldName}
                                                                meta={meta}
                                                                formInstance={formInstance} />
                                                        </Grid>
                                                    )
                                                }
                                            })}
                                        </Grid>
                                    </div>
                                ))
                            }
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
                                id='bulkUpdateFMLM-button-Save'
                                iconVariant="icomoon-save"
                                primary
                                onClick={handleSubmit((data)=>updateOrder(data))}
                                disabled={isUpdateBtnDisabled}
                            >
                                {dynamicLabels.update}
                            </IconButton>
                            <IconButton
                                id='bulkUpdateFMLM-button-Cancel'
                                iconVariant="icomoon-close"
                                iconSize={11}
                                onClick={() => {handleReset()}}
                            >
                                {dynamicLabels.cancel}
                            </IconButton>
                        </Box>
                    ),

                }}

        />


        </BulkUpdateWrapper>
    )
} 

export default BulkUpdateFmlmModal