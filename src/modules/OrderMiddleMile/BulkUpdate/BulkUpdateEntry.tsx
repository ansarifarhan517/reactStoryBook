import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { IconButton, Modal, ModalHeader, Box, SectionHeader, Grid, useToast, Loader } from 'ui-library';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import FormField from '../../../utils/components/Form/FormField';
import { withReactOptimized } from '../../../utils/components/withReact';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { BulkUpdateWrapper, SectionHeaderContainer } from './StyledBulkUpdate';
import DropDownComponent from './utils/DropdownComponent';
import { useCustomFieldsForm } from '../../../utils/components/Form/useCustomFieldsForm';
import { IBranchOptionData, IRouteConfigurationOptionData, ISkillSetOptionData } from './BulkUpdate.models';
import { generateCustomFieldsFormData, getTimezoneDateObject } from './utils/BulkUpdateForm.utils';
import { getTimezoneDate, metricsConversion } from '../../../utils/helper';
import { IMongoFormStructure } from '../../../utils/mongo/interfaces';

interface IBulUpdateEntryProps {
    isOpen: boolean
    onClose: (isReloadRequired?: boolean) => void
    page: string
    selectedOrderStatus?: string
    isTripNoExists?: boolean;
    selectedRows: any;
}
const BulkUpdateEntry = ({isOpen, onClose, selectedRows, page, selectedOrderStatus, isTripNoExists} : IBulUpdateEntryProps) => {

    const dispatch = useDispatch();
    const toast = useToast();
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.middleMileOrderListView)
    const clientProperties = useTypedSelector(state=>state.clientProperties);
    const structure = useTypedSelector(state => state.middleMileOrder.listView.bulkUpdate.structure);
    const isLoading = useTypedSelector(state => state.middleMileOrder.listView.bulkUpdate.apiLoading);
    const clientMetric = useTypedSelector(state => state.middleMileOrder.listView.bulkUpdate.clientMetric)
    const sectionKeys = Object.keys(structure);
    const formInstance = useForm<Record<string, any>>({
        mode: 'all', shouldUnregister: false
    })
    const { getCustomFieldsFormData} = useCustomFieldsForm()

    const [newStr, setNewStr] = useState<any>({});
    const [selectedOrderTypes, setSelectedOrderTypes] = useState<any[]>([]);
    const [isServiceTypeMenuOpen, setIsServiceTypeMenuOpen] = useState<boolean>(false);
    const [isRouteMenuOpen, setIsRouteMenuOpen] = useState<boolean>(false);
    const [isDropdownLoading, setIsDropdownLoading] = useState<boolean>(false)
    const [isRouteDropdownLoading, setIsRouteDropdownLoading] = useState<boolean>(false)
    const [serviceTypeOptionList, setServiceTypeOptionList] = useState<{value: any, label: string, id?:any}[]>([])
    const [routeOptionList, setRouteOptionList] = useState<{value: any, label: string, id?:any}[]>([])
    const [serviceTypeOptionMapping, setServiceTypeOptionMapping] = useState<object>({})
    const [routeOptionMapping, setRouteOptionMapping] = useState<object>({})
    const [disableUpdateBtn, setDisableUpdateBtn] = useState<boolean>(false);
    const [orderData, setOrderData] = useState<any>({});
    const [pickupStartDateValue, setPickupStartDateValue] = useState<Date>();
    const [pickupStartTimeValue, setPickupStartTimeValue] = useState<Date>();
    const [pickupEndDateValue, setPickupEndDateValue] = useState<Date>();
    const [pickupEndTimeValue, setPickupEndTimeValue] = useState<Date>();
    const [deliverStartDateValue, setDeliverStartDateValue] = useState<Date>();
    const [deliverStartTimeValue, setDeliverStartTimeValue] = useState<Date>();
    const [deliverEndDateValue, setDeliverEndDateValue] = useState<Date>();
    const [deliverEndTimeValue, setDeliverEndTimeValue] = useState<Date>();
    const { handleSubmit, watch, setValue, reset } = formInstance
    const skillSets = watch('deliveryType');
    const serviceTypeCd = watch('serviceTypeCd');
    const originBranchId = watch('originBranchId');
    const destinationBranchId = watch('destinationBranchId');
    const allMileFields = ['serviceTypeCd', 'originBranchId', 'destinationBranchId', 'routeConfigurationId'];
    const orderValues : any = Object.values(selectedRows);

    useEffect(() => {
        if (isOpen) {
            setDisableUpdateBtn(false);
            dispatch({ type: '@@MMO/BulkUpdate/GET_CLIENT_METRIC_SYSTEM' });
            let structureParams = {};
            if (page === 'MiddleMileOrders') {
                structureParams['pageName'] = 'MIDDLEMILEORDERS';
                structureParams['sectionName'] = 'ALL_ORDER_MIDDLE_MILE_BULK_UPDATE'
            }
            dispatch({type: '@@MMO/BulkUpdate/FETCH_STRUCTURE', payload: structureParams});
        }
    }, [isOpen])

    useEffect(() => {
        if (Object.keys(structure).length && clientMetric?.length) {
            const types = [...Array.from(new Set(orderValues.map((ord: any) => ord.orderTypeCd)))];
            setSelectedOrderTypes(types);
            renderForm(structure, types);
            if (types?.length && orderValues.length === 1) {
                fetchOrderData(orderValues[0].orderId, types);
            }
        }
    }, [structure, clientMetric])

    useEffect(() => {
        setServiceTypeOptionList([])
        setRouteOptionList([]);
        setValue('serviceTypeCd', null);
        setValue('routeConfigurationId', null);
    }, [skillSets])

    useEffect(() => {
        setRouteOptionList([]);
        setValue('routeConfigurationId', null);
    }, [serviceTypeCd, originBranchId, destinationBranchId])

    const renderForm = (structure: IMongoFormStructure, types: any[]) => {
        dispatch({type: '@@MMO/BulkUpdate/SET_API_LOADING', payload: true});
        sectionKeys.forEach(section => {
            if (section !== 'additional information') {
                Object.keys(structure[section]).forEach((fieldKey) => {
                    if (selectedOrderStatus === 'INTRANSIT' || (selectedOrderStatus === 'NOTDISPATCHED' && isTripNoExists)) {
                        if (fieldKey === 'packageWeight' || fieldKey === 'packageVolume') {
                            structure[section][fieldKey].permission = true
                        } else if (fieldKey === 'pickupNotes' && (types.includes('FM') || types.includes('ALLMILE'))) {
                            structure[section][fieldKey].permission = true
                        } else if(fieldKey === 'deliverNotes' && (types.includes('LM') || types.includes('ALLMILE'))) {
                            structure[section][fieldKey].permission = true
                        } else {
                            structure[section][fieldKey].permission = false;
                        }
                    } else if (selectedOrderStatus === 'NOTDISPATCHED') {
                        if (allMileFields.includes(fieldKey)) {
                            structure[section][fieldKey].permission = types.includes('ALLMILE')
                        } else if (fieldKey === 'paymentType') {
                            structure[section][fieldKey].permission = types.length === 1;
                        } else if (section === 'pick up details') {
                            structure[section][fieldKey].permission = types.includes('FM') || types.includes('ALLMILE')
                        } else if (section === 'delivery details') {
                            structure[section][fieldKey].permission = types.includes('LM') || types.includes('ALLMILE')
                        }
                    }
                })
            }
        })
        setNewStr(structure);
        dispatch({type: '@@MMO/BulkUpdate/SET_API_LOADING', payload: false});
    } 

    const fetchPriorityData = async (selectedvalue: string) => {
        const {data: proprityData} = await axios.get(apiMappings.common.lookup.priority);
        if (!proprityData?.hasError && proprityData?.data?.length) {
            const selectedPrioprity = proprityData.data.filter((priority: ISkillSetOptionData) => {return (priority.clientRefMasterCd === selectedvalue || priority.clientRefMasterDesc === selectedvalue)}) 
            if (selectedPrioprity?.length) {
                selectedPrioprity[0].id = selectedPrioprity[0].clientRefMasterId
                selectedPrioprity[0].value = selectedPrioprity[0].clientRefMasterDesc
                selectedPrioprity[0].label = selectedPrioprity[0].clientRefMasterDesc
                return selectedPrioprity[0];
            } else {
                return {};
            }
        } else {
            return null
        }
    }

    const fetchPaymentType = async (selectedvalue: string) => {
        const {data} = await axios.get(apiMappings.common.lookup.paymentMode);
        if (data?.length) {
            const selectedPaymentMode= data.filter((priority: ISkillSetOptionData) => priority.clientRefMasterCd === selectedvalue) 
            if (selectedPaymentMode?.length) {
                selectedPaymentMode[0].name = selectedPaymentMode[0].clientRefMasterDesc;
                return selectedPaymentMode[0];
            } else {
                return {}
            }
        } else {
            return null
        }
    }

    const fetchDeliveryType = async (selectedvalue: string) => {
        const selectedSkills = selectedvalue.split(',')
        const {data} = await axios.get(apiMappings.common.lookup.deliveryType);
        if (data?.length) {
            const selectedSkillSet= data.filter((skill: ISkillSetOptionData) => selectedSkills.includes(skill.clientRefMasterCd))
            return selectedSkillSet;
        } else {
            return null
        }
    }

    const fetchBranchData = async (selectedValue: number | string) => {
        const {data} = await axios.get(apiMappings.common.lookup.getBranches, {data: {}, params: {}, headers: {'Content-Type': 'application/json'}});
        const selectedBranch = data.filter((branch: IBranchOptionData) => branch.branchId == selectedValue || branch.name == selectedValue);
        return selectedBranch?.length ? selectedBranch[0] : {};
    }

    const fetchOriginBranchData = async (selectedValue: number | string) => {
        const {data} = await axios.get(apiMappings.common.lookup.getBranches, {data: {}, params: {}, headers: {'Content-Type': 'application/json'}});     
        const selectedOriginBranch = data.filter((branch: IBranchOptionData) => branch.branchId == selectedValue);
        return selectedOriginBranch?.length ? selectedOriginBranch[0] : {};
    }

    const fetchDestinationBranchData = async (selectedValue: number | string) => {
        const {data} = await axios.get(apiMappings.common.lookup.getBranches, {data: {}, params: {}, headers: {'Content-Type': 'application/json'}});      
        const selectedDestinationBranch = data.filter((branch: IBranchOptionData) => branch.branchId == selectedValue);
        return selectedDestinationBranch?.length ? selectedDestinationBranch[0] : {};
    }

    const fetchOrderData = async (orderId: number, types: any[]) => {
        dispatch({type: '@@MMO/BulkUpdate/SET_API_LOADING', payload: true});
        const { data } = await axios.get(`${apiMappings.middleMileOrder.listView.bulkUpdate.getOrderDetails}?orderId=${orderId}`);
        if (data) {
            setOrderData(data);
            const customFieldData = getCustomFieldsFormData(data.customFieldsList)
            const _resetData = {
                ...customFieldData,
                awbNumber: (selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) ? data.awbNumber : null,  
                shipmentOrderDt: (selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) ? getTimezoneDateObject(getTimezoneDate(data.shipmentOrderDt, data.shipmentOrderDtTZ)): null,
                packageValue: (selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) ? data.packageValue: null,
                shippingCost: (selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) ? data.shippingCost: null,
                priority: await (data.priority ? fetchPriorityData(data.priority) : null),
                paymentType: await (data.paymentType ? fetchPaymentType(data.paymentType) : null),
                deliveryType: await ((data.deliveryType && selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) ? fetchDeliveryType(data.deliveryType) : null), 
                distributionCenter: await ((data.clientBranchName && selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) ? fetchBranchData(data.clientBranchName) : null),
                originBranchId: await ((data.originBranchId && selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) ? fetchOriginBranchData(data.originBranchId) : null),
                destinationBranchId: await ((data.destinationBranchId && selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) ? fetchDestinationBranchData(data.destinationBranchId) : null),
            }
            if (data.packageWeight || data.packageWeight === 0) {
                const clientObj = clientMetric?.find(c => c.name === 'weight')
                const val = metricsConversion(data.packageWeight, 'GET', clientObj?.conversionFactor)
                _resetData['packageWeight'] = Number(val.toFixed(2))
            }

            if (data.packageVolume || data.packageVolume === 0) {
                const clientObj = clientMetric?.find(c => c.name === 'volume')
                const val = metricsConversion(data.packageVolume, 'GET', clientObj?.conversionFactor)
                _resetData['packageVolume'] = Number(val.toFixed(2))
            }


            if (types.includes('FM') || types.includes('ALLMILE')) {
                if (data.pickupServiceTime && selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) {
                    _resetData['pickupServiceTime'] = data.pickupServiceTime;
                }
                if (data.startTimeWindow && selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) {
                    _resetData['pickupStartTimeWindow'] = getTimezoneDate(data.startTimeWindow, data.shipmentOrderDtTZ)
                    _resetData['pickupStartDate'] =  getTimezoneDateObject(_resetData['pickupStartTimeWindow']);
                    _resetData['pickupStartTime'] =  getTimezoneDateObject(_resetData['pickupStartTimeWindow']);
                }
                if (data.endTimeWindow && selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) {
                    _resetData['pickupEndTimeWindow'] = getTimezoneDate(data.endTimeWindow, data.shipmentOrderDtTZ);
                    _resetData['pickupEndDate'] = getTimezoneDateObject(_resetData['pickupEndTimeWindow']);
                    _resetData['pickupEndTime'] = getTimezoneDateObject(_resetData['pickupEndTimeWindow']);
                }
                if (data.pickupNotes) {
                    _resetData['pickupNotes'] = data.pickupNotes;
                }
            }
            if (types.includes('LM') || types.includes('ALLMILE')) {
                if (data.deliverServiceTime && selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) {
                    _resetData['deliverServiceTime'] = data.deliverServiceTime;
                }
                if (data.startTimeWindow && selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) {
                    _resetData['deliverStartTimeWindow'] = getTimezoneDate(data.startTimeWindow, data.shipmentOrderDtTZ);
                    _resetData['deliverStartDate'] = getTimezoneDateObject(_resetData['deliverStartTimeWindow']);
                    _resetData['deliverStartTime'] = getTimezoneDateObject(_resetData['deliverStartTimeWindow']);;
                }
                if (data.endTimeWindow && selectedOrderStatus === 'NOTDISPATCHED' && !isTripNoExists) {
                    _resetData['deliverEndTimeWindow'] = getTimezoneDate(data.endTimeWindow, data.shipmentOrderDtTZ);
                    _resetData['deliverEndDate'] = getTimezoneDateObject(_resetData['deliverEndTimeWindow']);
                    _resetData['deliverEndTime'] = getTimezoneDateObject(_resetData['deliverEndTimeWindow']);
                }
                if (data.deliverNotes) {
                    _resetData['deliverNotes'] = data.deliverNotes;
                }
            }
            reset({..._resetData});
            if (types.includes('ALLMILE')) {
                setTimeout(async () => {
                    let selectedServiceType = []
                    if (data.serviceType && _resetData['deliveryType']?.[0]) {
                        const {data: serviceData} = await axios.post(apiMappings.middleMileOrder.listView.bulkUpdate.getServiceTypeBYSkillSet, [_resetData['deliveryType'][0]['id']]);
                        if (serviceData && !serviceData?.hasError) {
                            selectedServiceType = serviceData.data?.filter((service: ISkillSetOptionData) => service.clientRefMasterDesc === data.serviceType)
                            selectedServiceType[0].label = selectedServiceType[0].clientRefMasterDesc;
                            selectedServiceType[0].value = selectedServiceType[0].id;
                            setValue('serviceTypeCd', selectedServiceType[0]);
                            setServiceTypeOptionList(selectedServiceType)
                        }
                    }
                    if (data.routeName && _resetData['deliveryType']?.[0] && selectedServiceType.length && _resetData.originBranchId && _resetData.destinationBranchId) {
                        const requestObject = {
                            deliveryTypes : _resetData['deliveryType'].map((skill: ISkillSetOptionData) => skill.id),
                            destinationBranchId: _resetData.destinationBranchId['id'],
                            originBranchId: _resetData.originBranchId['id'],
                            serviceType: [selectedServiceType[0].id]
                        }
                        const {data: routeData} = await axios.post(apiMappings.middleMileOrder.listView.bulkUpdate.findRoute, requestObject)
                        if (routeData && !routeData.hasError) {
                            const selectedRoute = routeData.data.filter((route: IRouteConfigurationOptionData) => route.routeConfigurationName === data.routeName);
                            selectedRoute[0].label = selectedRoute[0].routeConfigurationName;
                            selectedRoute[0].value = selectedRoute[0].routeConfigurationId;
                            selectedRoute[0].id = selectedRoute[0].routeConfigurationId;
                            setValue('routeConfigurationId', selectedRoute[0]);
                            setRouteOptionList(selectedRoute)
                        }
                    }
                    
                }, 100)
            }
            dispatch({type: '@@MMO/BulkUpdate/SET_API_LOADING', payload: false});
        }
    }

    const handleServiceTypeChange = (data: string) => {
        if (data) {
            setValue('serviceTypeCd', serviceTypeOptionMapping[data]);
        } else {
            setValue('serviceTypeCd', {});
        }
    }

    const handleServiceTypeMenuOpen = async () => {
        if (!skillSets || !skillSets?.length) {
            toast.add(dynamicLabels?.SELECT_SKILL_SET_FIRST_KEY, 'warning', false)
        } else {
            setIsServiceTypeMenuOpen(true);
            setIsDropdownLoading(true);
            const selectedSkillSets = skillSets.map((skill: ISkillSetOptionData) => skill.id);
            const {data} = await axios.post(apiMappings.middleMileOrder.listView.bulkUpdate.getServiceTypeBYSkillSet, selectedSkillSets);
            if (data && !data?.hasError) {
                const mapping = {}
                const serviceTypeData = data?.data?.map((option: ISkillSetOptionData) => {
                    mapping[option.id] = option;
                    return {id: option.id, label: option.clientRefMasterDesc, value: option.id}
                })
                setServiceTypeOptionMapping(mapping)
                setServiceTypeOptionList(serviceTypeData)
            }
            setIsDropdownLoading(false);

        }
    }

    const handleServiceTypeMenuClose = () => {
        setIsServiceTypeMenuOpen(false);
    }

    const handleRouteMenuOpen = async () => {
        setIsRouteMenuOpen(true);
        setIsRouteDropdownLoading(true);
        let request = {};
        if (skillSets?.length && destinationBranchId && originBranchId && serviceTypeCd) {
            request = {
                deliveryTypes : skillSets.map((skill: ISkillSetOptionData) => skill.id),
                destinationBranchId: destinationBranchId?.id,
                originBranchId: originBranchId?.id,
                serviceType: [serviceTypeCd?.id]
            }
        }
        const {data} = await axios.post(apiMappings.middleMileOrder.listView.bulkUpdate.findRoute, request);
        if (!data.hasError) {
            const mapping = {};
            const routeData = data.data.map((option: IRouteConfigurationOptionData) => {
                mapping[option.routeConfigurationId] = option;
                return {id: option.routeConfigurationId, label: option.routeConfigurationName, value: option.routeConfigurationId}
            })
            setRouteOptionList(routeData);
            setRouteOptionMapping(mapping);
        }
        setIsRouteDropdownLoading(false);
    }

    const handleRouteChange = (data: string) => {
        if (data) {
            setValue('routeConfigurationId', routeOptionMapping[data]);
        } else {
            setValue('routeConfigurationId', {});
        }
    }

    const handleRouteMenuClose = () => {
        setIsRouteMenuOpen(false);
    }

    const getUTCDateTZ = (dateVal, timezone) => {
        return moment.tz(dateVal, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' ' + 'HH:mm', timezone).utc();
    }

    const formatDateTime = (selectedDate, selectedTime, orderDate, orderTZ) => {
        const date = selectedDate ? selectedDate : moment.tz(orderDate, orderTZ);
        const formattedDate = moment(date).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`);
        const formattedTime = selectedTime ? moment(selectedTime).format('HH:mm') : moment(orderDate).tz(orderTZ).format('HH:mm');
        const formattedDateTime = formattedDate + " " + formattedTime
        return JSON.parse(JSON.stringify(getUTCDateTZ(formattedDateTime, orderTZ)));
    }

    const updateOrder = async (payload: any) => {
        const orderIds = Object.keys(selectedRows);
        const customFieldsData = generateCustomFieldsFormData(structure, payload);

        dispatch({ type: '@@MMO/BulkUpdate/SET_API_LOADING', payload: true });
        setDisableUpdateBtn(true);

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
        
        // For each orderId add an entry in requestPaylaod for API request.
        const requestData = orderIds.map((id: string) => {
            let requestObject = {};
            Object.keys(payload).forEach(key => {
                requestObject['orderId'] = id;

                if (payload[key] && !key.includes('cf_')) {
                    if (key === 'deliveryType') {
                        requestObject[key] = (payload[key].map((skill: ISkillSetOptionData) => skill.clientRefMasterCd)).toString();
                    } else if (key === 'destinationBranchId' || key === 'originBranchId') {
                        requestObject[key] = payload[key]['id']
                    } else if (key === 'distributionCenter') {
                        requestObject[key] = payload[key]['name']
                    } else if (key === 'paymentType' || key === 'priority') {
                        requestObject[key] = payload[key]['clientRefMasterCd']
                    } else if (key === 'serviceTypeCd') {
                        requestObject[key] = payload[key]['clientRefMasterDesc']
                    } else if (key === 'routeConfigurationId') {
                        requestObject[key] = payload[key]['routeConfigurationId'];
                        requestObject['routeConfigurationName'] = payload[key]['routeConfigurationName'];
                    } else if (key === 'shipmentOrderDt') {
                        requestObject[key] = moment.utc(payload[key]).format('YYYY-MM-DDTHH:mm:ss') // moment.utc(payload[key]).format('')
                    } else if (key === 'packageWeight') {
                        requestObject[key] = weight;
                    } else if (key === 'packageVolume') {
                        requestObject[key] = volume;
                    } else {
                        requestObject[key] = payload[key]
                    }
                }
            });
            
            if (payload.pickupStartTime || payload.pickupStartDate) {
                requestObject['pickupStartTimeWindow'] = formatDateTime(pickupStartDateValue, pickupStartTimeValue, orderData.startTimeWindow, selectedRows[id]['shipmentOrderDtTZ'])
                delete requestObject['pickupStartDate'];
                delete requestObject['pickupStartTime'];
            }
            if (payload.pickupEndDate || payload.pickupEndTime) {
                requestObject['pickupEndTimeWindow'] = formatDateTime(pickupEndDateValue, pickupEndTimeValue, orderData.endTimeWindow, selectedRows[id]['shipmentOrderDtTZ'])
                delete requestObject['pickupEndDate'];
                delete requestObject['pickupEndTime'];
            }
            if (payload.deliverStartDate || payload.deliverStartTime) {
                requestObject['deliverStartTimeWindow'] = formatDateTime(deliverStartDateValue, deliverStartTimeValue, orderData.startTimeWindow, selectedRows[id]['shipmentOrderDtTZ']);
                delete requestObject['deliverStartDate']
                delete requestObject['deliverStartTime']
            }
            if (payload.deliverEndDate || payload.deliverEndTime) {
                requestObject['deliverEndTimeWindow'] = formatDateTime(deliverEndDateValue, deliverEndTimeValue, orderData.endTimeWindow, selectedRows[id]['shipmentOrderDtTZ']);
                delete requestObject['deliverEndDate']
                delete requestObject['deliverEndTime']
            }
            requestObject['customFields'] = customFieldsData;

            console.log("shivam id requestObject", id, requestObject);
            return requestObject;
        });
        try {
            const { data } = await axios.put(apiMappings.middleMileOrder.listView.bulkUpdate.updateOrder, requestData);
            if (!data.hasError) {
                toast.add(data.message, 'check-round', false);
                setNewStr({});
                reset({})
                onClose(true);
            } else {
                setDisableUpdateBtn(false);
                toast.add(data.message, 'warning', false);
            }
            dispatch({ type: '@@MMO/BulkUpdate/SET_API_LOADING', payload: false });
        } catch (error: any) {
            setDisableUpdateBtn(false);
            toast.add(error?.response?.data?.message, 'warning', false);
            dispatch({ type: '@@MMO/BulkUpdate/SET_API_LOADING', payload: false });
        }
    }

    const setDate = (date, fieldName) => {
        switch (fieldName) {
            case 'pickupStartDate':
                setPickupStartDateValue(date);
                break;
            case 'pickupStartTime':
                setPickupStartTimeValue(date);
                break;
            case 'pickupEndDate':
                setPickupEndDateValue(date);
                break;
            case 'pickupEndTime':
                setPickupEndTimeValue(date);
                break;
            case 'deliverStartDate':
                setDeliverStartDateValue(date);
                break;
            case 'deliverStartTime':
                setDeliverStartTimeValue(date);
                break;
            case 'deliverEndDate':
                setDeliverEndDateValue(date);
                break;
            case 'deliverEndTime':
                setDeliverEndTimeValue(date);
                break;
        }
    }


    return <BulkUpdateWrapper className="bulk-update-wrapper">
    <Modal
        open={isOpen}
        onToggle={() => {setNewStr({}); onClose();}}
        width='1080px'
        children={{
            header: (
                <ModalHeader
                    headerTitle='Update Orders'
                    handleClose={() => {setNewStr({}); reset({}); onClose();}}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (
                <>
                <Box style={{maxHeight: '300px', overflow: 'auto', overflowX: 'hidden', paddingRight: '10px'}}>
                    {isLoading && <Loader center fadeBackground />}
                    {!!sectionKeys?.length && !!Object.keys(newStr).length && 
                        sectionKeys.map((sectionName) => (
                            <div key={sectionName}>
                                { Object.keys(structure[sectionName]).some(
                                    (fieldKey) => structure[sectionName][fieldKey].permission
                                ) && (
                                    <SectionHeaderContainer>
                                    <SectionHeader headerTitle={ dynamicLabels?.[sectionName] || sectionName }/>
                                    </SectionHeaderContainer>
                                )}
                                <Grid container spacing="10px" style={{ marginBottom: "15px" }}>
                                    {Object.keys(structure[sectionName]).map(fieldName => {
                                        const meta = structure[sectionName][fieldName]
                                        meta.multipleFiles = false
                                        if (fieldName === 'paymentType') {
                                            meta['orderType'] = selectedOrderTypes[0]
                                        }
                                        const { permission } = meta
                                        if (!permission) {
                                            return undefined
                                        } 
                                        if (fieldName === 'serviceTypeCd') {
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={6} md={4} className='grid-item'>
                                                    <DropDownComponent
                                                        name={fieldName}
                                                        meta={meta}
                                                        formInstance={formInstance}
                                                        dropdownOptions={serviceTypeOptionList}
                                                        handleChange={(value: string) => handleServiceTypeChange(value)}
                                                        handleMenuOpen={handleServiceTypeMenuOpen}
                                                        handleMenuClose={handleServiceTypeMenuClose}
                                                        menuIsOpen={isServiceTypeMenuOpen}
                                                        isDropdownLoading={isDropdownLoading}
                                                    />
                                                </Grid>
                                            )
                                        } else if (fieldName === 'routeConfigurationId') {
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={6} md={4} className='grid-item'>
                                                    <DropDownComponent
                                                        name={fieldName}
                                                        meta={meta}
                                                        formInstance={formInstance}
                                                        dropdownOptions={routeOptionList}
                                                        handleChange={(value: string) => handleRouteChange(value)}
                                                        handleMenuOpen={handleRouteMenuOpen}
                                                        handleMenuClose={handleRouteMenuClose}
                                                        menuIsOpen={isRouteMenuOpen}
                                                        isDropdownLoading={isRouteDropdownLoading}
                                                    />
                                                </Grid>
                                            )
                                        } else if (fieldName === 'pickupStartDate' || fieldName === 'pickupStartTime' || fieldName === 'pickupEndDate' || fieldName === 'pickupEndTime' || fieldName === 'deliverStartDate' || fieldName === 'deliverStartTime' || fieldName === 'deliverEndDate' || fieldName === 'deliverEndTime') {
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
                    ))}
                </Box>
                </>),

            footer: (
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    justifyContent="flex-end"
                    p="15px"
                >
                    <IconButton
                        iconVariant="icomoon-save"
                        primary
                        onClick={handleSubmit((data)=>updateOrder(data))}
                        disabled={disableUpdateBtn}
                    >
                        {dynamicLabels.update}
                    </IconButton>
                    <IconButton
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => {setNewStr({}); reset({}); onClose();}}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            ),

        }}

    />
    </BulkUpdateWrapper>
}

export default withReactOptimized(BulkUpdateEntry);