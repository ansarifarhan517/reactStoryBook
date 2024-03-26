import React, { Dispatch, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels' 
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { Box, BreadCrumb, Card, IconButton, useToast, IconDropdown, Loader, ISelectedRows } from 'ui-library'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { useDispatch } from 'react-redux';
import { IAddOrderFormActions } from './AddOrderForm.actions';
import { AddOrderFormWrapper, IconButtonWrapper } from './AddOrderFormStyledComponents';
import FormLoader from '../../../utils/components/FormLoader';
import withReact from '../../../utils/components/withReact';
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { routeContains, getQueryParams, hybridRouteTo } from '../../../utils/hybridRouting'
import { useGoogleAnalytics, ListViewOption, useBreadCrumbs, useReactPath } from "./AddOrderForm.utils";
import AssignDAModal from '../SubComponents/AssignDAModal';
import TripDateChangeModal from '../SubComponents/TripDateChangeModal';
import { tGlobalToastActions } from '../../common/GlobalToasts/globalToast.reducer';
import CrateModal from '../SubComponents/CrateModal'
import FormRenderComponent from './FormRenderComponent';
import { IAddOrderFormData, ICrateData } from './AddOrderForm.models';
import { getOrderData } from './GetOrderData';
import { deepCopy } from '../../../utils/helper';
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { unitSystemConversionCrateItem } from '../../../utils/components/Form/utils';
const FALLBACK_CENTER = [37.09024, -95.71289100000001];
const AddOrderForm = () => {
    const userAccessInfo = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");
    const _center = userAccessInfo?.['countryLatLng']?.split(',') || FALLBACK_CENTER;
    const clientProperties = useTypedSelector(state => state.clientProperties)
    const toast = useToast();
    const path = useReactPath();
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.addOrder)
    const formInstance = useForm<Record<string, any>>({
        mode: 'all', shouldUnregister: false
    })
    console.log(formInstance.formState.isDirty) // make sure formState is read before render to enable the Proxy
    const [isP2POrder, setisP2POrder] = useState<boolean>(false);

    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<IAddOrderFormActions>>()
    const { handleSubmit, watch, setValue, reset, clearErrors, getValues, control } = formInstance;
    const { gaOnSubmit, gaOnCancel } = useGoogleAnalytics()
    const { getOrderDetails, getCustomerData, prepareData } = getOrderData(formInstance)
    const { breadCrumbOptions, handleBreadCrumbClick } = useBreadCrumbs(formInstance)
    const watchShipmentsType = watch('shipmentsType', '')
    /* watchers for pickup address fields*/
    const pickupAccountCode = watch('pickupAccountCode', '')
    const deliverAccountCode = watch('deliverAccountCode', '')
    const returnAccountCode = watch('returnAccountCode', '')  
    const AccountCode = watch('AccountCode', '')
    const structure = useTypedSelector(state => state.orderForm?.structure)
    const isStructureLoading = useTypedSelector(state => state.orderForm.loading)
    const orderNumber = useTypedSelector(state => state.orderForm.orderNumber);
    const resetData = useTypedSelector(state => state.orderForm.resetData);
    const apiLoading = useTypedSelector(state => state.orderForm.apiLoading)
    const crateType = useTypedSelector(state => state.orderForm.crateType)
    const timeZoneList = useTypedSelector(state => state.orderForm.timeZoneList)
    const isOrderCloned = useTypedSelector(state => state.orderForm.isOrderCloned);
    const countryList = useTypedSelector(state => state.orderForm.localeData);
    const sectionKeys = Object.keys(structure)
    const [isOrderDataLoading, setIsOrderDataLoading] = useState<boolean>(false);
    const [returnOrderAddress, setReturnOrderAddress] = useState<boolean>(false);
    const [pickupLeg, setPickupLeg] = useState<boolean>(true);
    const [showAssignDAModal, setAssignDAModal] = useState<boolean>(false)
    const [tripData, setTripData] = useState({});
    const [showTripDateChangeModal, setShowTripDateChangeModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<object>({})
    const [showCrateModal, setShowCrateModal] = useState<boolean>(false)
    const [crateItems, setCrateItems] = useState<Array<ICrateData>>([])
    const [userType, setUserType] = useState<string>(userAccessInfo['modelType'])
    const [deliveryLeg, setDeliveryLeg] = useState<boolean>(true);
    const [pickupMapPosition, setPickupMapPosition] = useState<Array<number>>([_center[0], _center[1]])
    const [returnMapPosition, setReturnMapPosition] = useState<Array<number>>([_center[0], _center[1]])
    const [deliverMapPosition, setDeliverMapPosition] = useState<Array<number>>([_center[0], _center[1]])
    const [customerMapPosition, setCustomerMapPosition] = useState<Array<number>>([_center[0], _center[1]])
    const [isOrderDataFetched, setIsOrderDataFetched] = useState<boolean>(false)
    const [isGetDataFunctionCalled, setIsGetDataFunctionCalled] = useState<boolean>(false)
    const isLoading = React.useMemo(() => isStructureLoading || isOrderDataLoading , [isStructureLoading, isOrderDataLoading])
    const loaderRef = React.useRef<HTMLDivElement | null>(null)
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
    const shipmentOrderDtTZ = watch('shipmentOrderDtTZ')
    const shipmentOrderDt = watch('shipmentOrderDt')
    const pickupTimezone = watch('pickupTimezone')
    const deliverTimezone = watch('deliverTimezone')
    const returnTimezone = watch('returnTimezone')
    const pickupCountry = watch('pickupCountry')
    const deliverCountry = watch('deliverCountry')
    const returnCountry = watch('returnCountry');
    const Country = watch('Country');
    const baseCountry = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.['countryCode']
    const selectedCountry = countryList?.filter(o => {return o['googleCountryCode'] === baseCountry})
    const isOptimizeFl = useTypedSelector(state => state.orderForm.isOptimizeFl)
    const deliverStartTimeWindow = watch("deliverStartTimeWindow")
    const deliverEndTimeWindow = watch("deliverEndTimeWindow")
    const watchPhoneNumbers = useWatch({control, name: ["deliverPhoneNumber", "pickupPhoneNumber", "returnPhoneNumber"]});
    const currentPage = 'addOrder';
    useEffect(() => {
        dispatch({ type: '@@addOrderForm/SET_DYNAMIC_LABELS', payload: dynamicLabels });
    },[dynamicLabels])

    useEffect(() => {
        if(!isOrderCloned) {
        // if (pickupAccountCode) {getCustomerData(pickupAccountCode, 'pick up details')}
            getCustomerData(pickupAccountCode, 'pick up details')
        }

    },[pickupAccountCode, isOrderCloned])

    useEffect(() => {
        if(!isOrderCloned) {
            getCustomerData(deliverAccountCode, 'delivery details')
        }
    },[deliverAccountCode, isOrderCloned])

    useEffect(() => {
        if(!isOrderCloned) {
            getCustomerData(returnAccountCode, 'return address details')
        }

    },[returnAccountCode])

    useEffect(() => {
        if (!isOrderCloned) {
            getCustomerData(AccountCode, 'customer details')
        }

    },[AccountCode])

    useEffect(() => {
        setIsOrderDataLoading(true)
        dispatch({ type: '@@addOrderForm/SET_IS_MAP_LOADING_FIRST_TIME', payload: true});
        dispatch({ type: '@@addOrderForm/GOOGLE_API_KEY' })
        dispatch({ type: '@@addOrderForm/FETCH_OPTIMIZE_FLAG' })
        dispatch({ type: '@@addOrderForm/FETCH_CRATE_TYPE' })
        dispatch({ type: '@@addOrderForm/FETCH_STRUCTURE' })
        dispatch({ type: '@@addOrderForm/FETCH_ORDER_NUMBER_SUCCESS', payload: '' });
        dispatch({ type: '@@addOrderForm/GET_CLIENT_METRIC_SYSTEM' });
        dispatch({ type: '@@addOrderForm/FETCH_LOCALE' });
        dispatch({ type: '@@addOrderForm/FETCH_TIMEZONELIST' });
        dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: [] });
        setIsOrderDataLoading(false)
        return () => {
            dispatch({ type: '@@addOrderForm/SET_STRUCTURE_DATA', payload: {} })
        }
    },[]);

    useEffect(() => {
        if (!isOrderDataFetched && Object.keys(structure).length) {
            const { shipmentId } = getQueryParams();
            if(routeContains(shipmentId)) {
                if (!isGetDataFunctionCalled) {
                    fetchOrderData(shipmentId)
                    dispatch({ type: '@@addOrderForm/FETCH_SUBCLIENTS'})
                }
            } else if(path.includes('addOrder')) {
                reset({...resetData})
            }
        }
    }, [path, structure])

    const moduleKeyField = watch('moduleKey')
    useEffect(() => {
        if (!moduleKeyField) {
            setValue('moduleKey','ORDERS')
        }
    }, [moduleKeyField])

    useEffect(() => {
        if (Object.keys(structure).length) {
            if (!shipmentOrderDt) {
                setValue('shipmentOrderDt', new Date())
            }
            if (!watchShipmentsType && structure['fromConfigurations'] && structure['fromConfigurations']['orderTypeCheckbox'] && structure['fromConfigurations']['orderTypeCheckbox']['defaultValue']) {
                if (userType == 'VM' || userType == 'FMLM' || userType == 'SM') {
                    setUserType('both');
                }
                if (structure['fromConfigurations']['orderTypeCheckbox']['defaultValue'] == "LM") {
                    setPickupLeg(false)
                    setDeliveryLeg(true)
                    setValue('shipmentsType', `${dynamicLabels.deliveryLeg}`)
                } else if (structure['fromConfigurations']['orderTypeCheckbox']['defaultValue'] == "FM") {
                    setPickupLeg(true)
                    setDeliveryLeg(false)
                    setValue('shipmentsType', `${dynamicLabels.pickUpLeg}`)
                    structure['general details'].hubName ? structure['general details'].hubName.permission = false : '';
                } else if (structure['fromConfigurations']['orderTypeCheckbox']['defaultValue'] == 'VM' || structure['fromConfigurations']['orderTypeCheckbox']['defaultValue'] == 'FMLM') {
                    setPickupLeg(true)
                    setDeliveryLeg(true)
                    setValue('shipmentsType', `${dynamicLabels.pickUpLeg},${dynamicLabels.deliveryLeg}`)
                } else if (structure['fromConfigurations']['orderTypeCheckbox']['defaultValue'] == 'SM') {
                    setPickupLeg(true)
                    setDeliveryLeg(false)
                    setValue('shipmentsType', `${dynamicLabels.pickUpLeg}`)
                }
            }
            else {
                if (userType == "LM") {
                    setPickupLeg(false)
                    setDeliveryLeg(true)
                } else if (userType == "FM") {
                    setPickupLeg(true)
                    setDeliveryLeg(false)
                } else if (userType == 'VM' || userType == 'FMLM') {
                    setPickupLeg(true)
                    setDeliveryLeg(true)
                    setUserType('both')
                }
            }
            if (!watchShipmentsType && structure['general details']['shipmentsType'] && !structure['fromConfigurations']) {
                setValue('shipmentsType', `${dynamicLabels.pickUpLeg},${dynamicLabels.deliveryLeg}`)
                setValue('returnShipment', 'No')
            }
            if(structure['order details']?.shipmentOrderDtTZ || structure['pickup details']?.pickupTimezone || structure['deliver details']?.deliverTimezone || structure['return details'].returnTimezone){
                const userTimeZone = timeZoneList?.filter((o) => {return o['canonicalId'] === JSON.parse(localStorage.getItem('userAccessInfo')|| "")['timezone']})
                if(!shipmentOrderDtTZ) {
                    setValue('shipmentOrderDtTZ', { 'canonicalId': userTimeZone?.[0].canonicalId, 'gmtoffset': userTimeZone?.[0].gmtoffset, id:userTimeZone?.[0].gmtoffset, name: userTimeZone?.[0].gmtoffset })
                }
                if(!pickupTimezone) {
                    setValue('pickupTimezone', { 'canonicalId': userTimeZone?.[0].canonicalId, 'gmtoffset': userTimeZone?.[0].gmtoffset, id:userTimeZone?.[0].gmtoffset, name: userTimeZone?.[0].gmtoffset })
                }
                if(!deliverTimezone) {
                    setValue('deliverTimezone', { 'canonicalId': userTimeZone?.[0].canonicalId, 'gmtoffset': userTimeZone?.[0].gmtoffset, id:userTimeZone?.[0].gmtoffset, name: userTimeZone?.[0].gmtoffset })
                }
                if(!returnTimezone) {
                    setValue('returnTimezone', { 'canonicalId': userTimeZone?.[0].canonicalId, 'gmtoffset': userTimeZone?.[0].gmtoffset, id:userTimeZone?.[0].gmtoffset, name: userTimeZone?.[0].gmtoffset })
                }
                if(!deliverStartTimeWindow && structure["delivery details"]?.['deliverStartTimeWindow']?.['fieldType'] === "moreValidity" && structure["delivery details"]?.['deliverStartTimeWindow']?.['defaultValue'] !== undefined){
                    setValue('deliverStartTimeWindow',new Date());
                }
                if(!deliverEndTimeWindow && structure["delivery details"]?.['deliverEndTimeWindow']?.['fieldType'] === "moreValidity" && structure["delivery details"]?.['deliverStartTimeWindow']?.['defaultValue'] !== undefined){
                    const timeInMins : any = structure["delivery details"]?.['deliverEndTimeWindow']?.['defaultValue']
                    console.log("timeInMins ",timeInMins)
                    let date = new Date()
                    date.setMinutes(date.getMinutes() + Number(timeInMins))
                    console.log("DATE ",date)
                    setValue('deliverEndTimeWindow',date);
                }
            }
            if (structure['pick up details']?.['addressFields']?.['childNodes']?.['pickupCountry'] && !pickupCountry) {
                setValue('pickupCountry', {id: selectedCountry?.[0]?.id, name: selectedCountry?.[0]?.name})
            }
            if (structure['delivery details']?.['addressFields']?.['childNodes']?.['deliverCountry'] && !deliverCountry) {
                setValue('deliverCountry', {id: selectedCountry?.[0]?.id, name: selectedCountry?.[0]?.name})
            }
            if (structure['return address details']?.['addressFields']?.['childNodes']?.['returnCountry'] && !returnCountry) {
                setValue('returnCountry', {id: selectedCountry?.[0]?.id, name: selectedCountry?.[0]?.name})
            }
            if (structure['customer details']?.['addressFields']?.['childNodes']?.['Country'] && !Country) {
                setValue('Country', {id: baseCountry, name: baseCountry})
            }
            if (structure['pick up details']?.['pickupWhatsappOptin']?.permission && !getValues('pickupWhatsappOptin')) {
                setValue('pickupWhatsappOptin', 'N')
            }
            if (structure['delivery details']?.['deliverWhatsappOptin']?.permission && !getValues('deliverWhatsappOptin')) {
                setValue('deliverWhatsappOptin', 'N')
            }
            if (structure['return address details']?.['returnWhatsappOptin']?.permission && !getValues('returnWhatsappOptin')) {
                setValue('returnWhatsappOptin', 'N')
            }
            
        }
    },[structure])

    useEffect(() => {
        if(Object.keys(structure).length) {      
            dispatch({ type: '@@addOrderForm/SET_FORM_TYPE', payload : watchShipmentsType})
            if (watchShipmentsType.includes("Point to Point")) {
                setValue('shipmentsType', 'Point to Point')
                setisP2POrder(true)
                setReturnOrderAddress(true);
            } else {
                setisP2POrder(false)
                if (watchShipmentsType === dynamicLabels.pickUpLeg && structure['general details'].distributionCenter) { 
                    setPickupLeg(true);
                    setDeliveryLeg(false);
                    clearErrors(["returnAccountCode","returnAccountName","returnEmail","returnStartTimeWindow","returnEndTimeWindow","returnBranch","returnPhoneNumber","returnApartment", "returnCity","returnCountry", "returnLandmark", "returnLocality", "returnPinCode", "returnState", "returnStreetName"])
                    clearErrors(["deliverStartTimeWindow","deliverEndTimeWindow","deliverAccountCode","deliverApartment", "deliverCity","deliverCountry", "deliverLandmark", "deliverLocality", "deliverPinCode", "deliverState", "deliverStreetName"])

                } else if (watchShipmentsType === dynamicLabels.deliveryLeg && structure['general details'].distributionCenter) { 
                    setDeliveryLeg(true);
                    setPickupLeg(false);
                    clearErrors(["pickupApartment", "pickupCity","pickupCountry", "pickupLandmark", "pickupLocality", "pickupPinCode", "pickupState", "pickupStreetName"]);
                    clearErrors(["returnApartment", "returnCity","returnCountry", "returnLandmark", "returnLocality", "returnPinCode", "returnState", "returnStreetName"]);

                } else if (watchShipmentsType.includes(dynamicLabels.pickUpLeg) && watchShipmentsType.includes(dynamicLabels.deliveryLeg) && structure['general details'].distributionCenter) {
                    if (watchShipmentsType.includes(dynamicLabels.pickUpLeg)) {
                        setPickupLeg(true);
                    }
                    if (watchShipmentsType.includes(dynamicLabels.deliveryLeg)) {
                        setDeliveryLeg(true);
                    }
                }
            }        
        }
    },[watchShipmentsType])

    useEffect(() => {
        setValue('orderNo', orderNumber)
        clearErrors("orderNo")
    },[orderNumber]);

    const setCrateData = (data: Array<ICrateData>) => {
        let saveCrate = false
        let dataList: Array<ICrateData> = []
        data.forEach(e => {
            e['statusCd'] = "PACKED";
            if (e.crateTemperatureCategory) {
                e.crateTemperatureCategory = {id: e.crateTemperatureCategory, name: e.crateTemperatureCategory}
            }

            e = unitSystemConversionCrateItem(e, "GET")

            if (e.shipmentlineitems && e.shipmentlineitems.length) {
                e.shipmentlineitems.forEach(item => {
                    item['statusCd'] = "PACKED";
                    if (item.temperatureCategory) {
                        item.temperatureCategory = {id: item.temperatureCategory, name: item.temperatureCategory}
                    }
                    item = unitSystemConversionCrateItem(item, "GET")

                })
            }
            if(isOptimizeFl && e.crateName){
               e.crateName = {id: e.crateName, name: e.crateName}
            }
            if (e['isDeleteFl'] == 'N') {
                e['isActiveFl']="Y";
                if (crateType == 'b') {
                    if (e['crateCd'] != '' && e['crateType'] != '' && e['noOfUnits'] && e['crateAmount'] != '') {
                        saveCrate = true
                        dataList.push(e)
                    }
                } else {
                    saveCrate = true
                    dataList.push(e);
                }
            }
        })
        if (saveCrate && dataList.length) {
            setCrateItems(dataList)
            dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: dataList });
            setValue('numberOfItems', dataList.length)
            clearErrors('numberOfItems')
        }
    }

    const handleSaveAndAssign = (data: string) => {
        handleSubmit((formInputs) => onSubmit(formInputs, true, data))();
    }
    const setMapLatLongValues = (orderData: any) => {
        const isorderTypeIsFMLM = orderData.secondLegClientNodeId ? true : false;
        if (orderData["orderType"] == 'PICKUP' && !isorderTypeIsFMLM) {
            if ('-200' != String(orderData['lat']) && '-200' != String(orderData['lng'])) {
                setPickupMapPosition([orderData.lat,orderData.lng ])
            }
        } else if (orderData["orderType"] == 'DELIVER' && !isorderTypeIsFMLM) {
            if ('-200' != String(orderData['deliverLatitude']) && '-200' != String(orderData['deliverLongitude'])) {
                setDeliverMapPosition([orderData.deliverLatitude,orderData.deliverLongitude ])
                if (orderData.isP2POrder && '-200' != String(orderData['pickupLatitude']) && '-200' != String(orderData['pickupLongitude'])) {
                    setPickupMapPosition([orderData.pickupLatitude, orderData.pickupLongitude])
                }
            }
        } else if (isorderTypeIsFMLM) {
            if ('-200' != String(orderData['lat']) && '-200' != String(orderData['lng'])) {
                setPickupMapPosition([orderData.lat,orderData.lng ])
            }
            if ('-200' != String(orderData['deliverLatitude']) && '-200' != String(orderData['deliverLongitude'])) {
                setDeliverMapPosition([orderData.deliverLatitude,orderData.deliverLongitude ])
            }
            if ('-200' != String(orderData['returnLatitude']) && '200' != String(orderData['returnLongitude'])) {
                setReturnMapPosition([orderData.returnLatitude, orderData.returnLongitude])
            }
        }
    }
    const onSubmit = async (formInputs: IAddOrderFormData, assign?:boolean, assignmentFlavor?: string) => {
        gaOnSubmit();
        // const isValidTime = validateTime(formInputs, pickupLeg, deliveryLeg);
        // if(isValidTime){
            const payload = prepareData(formInputs, pickupLeg, deliveryLeg, isP2POrder, returnOrderAddress, pickupMapPosition, deliverMapPosition, returnMapPosition, crateItems)
            if (payload['orderType']) {
                delete payload['orderType']
            }
            setFormData(payload);
            if (assign && assignmentFlavor === "save and assign") {
                setAssignDAModal(true)
            } else {
                if (assign && assignmentFlavor) { //if assignment flavor is also present
                    if (assignmentFlavor == "save and auto-assign to nearest driver") {
                        payload["autoAllocateFl"] = "Y"; // Auto allocate to the nearest driver
                    } else {
                        payload["autoAllocateFl"] = "P"; // Auto allocate to planned trips
                    }
                    finalSubmit(payload, {});
                }
            }
            if(!assign && !assignmentFlavor){
                finalSubmit(payload, {});
            }
        // }
    }

    const fetchOrderData = async (shipmentId: string | number) => {
            try {
                setIsOrderDataLoading(true)
                setIsGetDataFunctionCalled(true)
                const { data } = await axios.get(`${apiMappings.order.form.getOrdeById}?shipmentId=${shipmentId}&fetchMode=cloneOrder`)
                if (data.length) {
                        const orderData = data[0];
                        if (orderData['noOfItems']) {
                            const { shipmentId } = getQueryParams();
                            var url = apiMappings.order.form.orderCrate;
                            const {data} = await axios.get(`${url}?shipment_ids=${shipmentId.toString()}&fetchMode=cloneOrder`)
                            if (data) {
                                setCrateData(data.data);
                            }
                        }
                        const _resetData = getOrderDetails(orderData,setisP2POrder, clientProperties)
                        setMapLatLongValues(orderData)
                        if(_resetData.shipmentsType !== 'Point to Point')
                            setReturnOrderAddress(_resetData.returnOrderAddress)
                        if(_resetData.shipmentsType  === `${dynamicLabels.pickUpLeg}` ){
                            setPickupLeg(true)
                            setDeliveryLeg(false)
                        } else if (_resetData.shipmentsType  === `${dynamicLabels.pickUpLeg},${dynamicLabels.deliveryLeg}` || _resetData.shipmentsType === 'Point to Point') {
                            setPickupLeg(true)
                            setDeliveryLeg(true)
                        } else if (_resetData.shipmentsType  === `${dynamicLabels.deliveryLeg}`) {
                            setPickupLeg(false)
                            setDeliveryLeg(true)
                        }
                        dispatch({ type: '@@addOrderForm/SET_FORM_TYPE', payload : _resetData.shipmentsType})
                        reset({..._resetData});     
                        dispatch({type:'@@addOrderForm/SET_FORM_RESET_DATA', payload: _resetData})
                        setIsOrderDataFetched(true)
                        setIsOrderDataLoading(false)
                    }
                } catch (error) {
                toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
              }
    }

    const manualAssignClick = () => {
        let tripSelected = false;
        let formObject = deepCopy(formData);
        const selectedTrip = Object.keys(tripData)[0]
        if (Object.keys(tripData).length) {
            const dict = {
                "tripId": tripData[selectedTrip]['tripId'],
                "tripStatus": tripData[selectedTrip]['tripStatus']
            }
            
            if(tripData && tripData[selectedTrip] && tripData[selectedTrip]['routePlanningId'] === -1) {
                const manualDBMode = {
                    "mode": "MANUALDBASSIGNMENT",
                    "routePlanningId": -1
                }
                formObject = {...formObject, ...dict, ...manualDBMode}
            }

            formObject = {...formObject, ...dict}
            tripSelected = true;
        }

        if (!tripSelected) {
            toast.add(dynamicLabels.pleaseSelectTrip, "error", false);
        } else {
            finalSubmit(formObject, tripData);
        }
    }

    const formatCrateData = (data: Array<ICrateData>) => {
        
        setCrateItems(data);
        setValue('numberOfItems', data?.length ? data.length : null)
        clearErrors('numberOfItems')
    }

    const finalSubmit = async (formData: IAddOrderFormData, tripData: ISelectedRows) => {
        const selectedTrip = Object.keys(tripData)[0]
        if (pickupLeg && !deliveryLeg) {
            formData["format"] = "FM"
        } else if (!pickupLeg && deliveryLeg) {
            formData["format"] = "LM"
        } else {
            formData["format"] = "FMLM"
        }
        var formOrderData = [];
        formOrderData.push(formData);
        setAssignDAModal(false)
        // jQ(".loaderContainer").show();
        try {
            dispatch({ type: '@@addOrderForm/SET_API_LOADING', payload: true });
            const {data} = await axios.post(apiMappings.order.form.createOrder, formOrderData)
            if (data.hasError) {
                // jQ(".loaderContainer").hide();
                dispatch({ type: '@@addOrderForm/SET_API_LOADING', payload: false });
                if (data.status == 432 || data.status == 433) {
                    toast.add(data.message, "warning", false);
                }
                if (data.error?.order_0) {
                    if (data.error.order_0[0]['key']) {
                        toast.add(data.error.order_0[0]['message'][0], "warning", false);
                    } 
                    else {
                        if (data.error.order_0[1]) {
                            if (data.error.order_0[1]['key']) {
                                toast.add(data.error.order_0[1]['message'][0], "warning", false);
                            }               
                        }
                        if(data.error.order_0[0] && data.error.order_0[0].shipmentCrateMappings_0 && data.error.order_0[0].shipmentCrateMappings_0[0] && data.error.order_0[0].shipmentCrateMappings_0[0].message){
                            toast.add(data.error.order_0[0].shipmentCrateMappings_0[0].message[0], "warning", false);
                        }
                    }
                }
            } else {
                dispatch({ type: '@@addOrderForm/SET_API_LOADING', payload: false });
                dispatch({ type: '@@addOrderForm/SET_ORDER_CLONED', payload: false });
                //here ask for the trip date change confirmation IF the trip is not started and modeltype is not OD, and user has asked not to never show the popup again
                if (userAccessInfo['modelType'] !== "OD" && Object.keys(tripData).length && (tripData[selectedTrip]['tripStatus'] == "NOTSTARTED")) {
                    // orderService.assigneeTripDTO = tripData;
                    setTimeout( () => {
                        // jQ(".loaderContainer").hide();
                        setShowTripDateChangeModal(true)
                    }, 0)
                } else {
                    // jQ(".loaderContainer").hide();
                    toastDispatch({type: '@@globalToast/add', payload: {message: dynamicLabels.orderAddedSuccessfully ? dynamicLabels.orderAddedSuccessfully : 'Order added successfully.', icon: 'check-round', remove: false}})
                    hybridRouteTo('order');
                    dispatch({ type: '@@addOrderForm/SET_STRUCTURE_DATA', payload : {}});
                }
            }
        } catch(error) {
            dispatch({ type: '@@addOrderForm/SET_API_LOADING', payload: false });
            if (error?.response?.data?.error.CRATE_WITH_ITEM_PACKING ) 
                toast.add(error?.response?.data?.error.CRATE_WITH_ITEM_PACKING[0],"warning", false);
            else
                toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
        }        
    };

    const handleCancel = () => {
        
        gaOnCancel(); 
        handleBreadCrumbClick('orders');
        
        if (!formInstance.formState.isDirty) {
            dispatch({ type: '@@addOrderForm/SET_STRUCTURE_DATA', payload : {}});
            hybridRouteTo('order')
            dispatch({ type: '@@addOrderForm/SET_ORDER_CLONED', payload: false });
          } else {
            globalPopupDispatch({
              type: '@@globalPopup/SET_PROPS',
              payload: {
                isOpen: true,
                title: dynamicLabels.navigationConfirmation,
                content: dynamicLabels.dataLostWarningMsg,
                footer: (
                  <>
                    <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => { globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' }); hybridRouteTo('order'); reset(); dispatch({ type: '@@addOrderForm/SET_ORDER_CLONED', payload: false}); dispatch({ type: '@@addOrderForm/SET_STRUCTURE_DATA', payload : {}});}}>{dynamicLabels.ok}</IconButton>
                    <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
                  </>
                )
              }
            })
          }
    }

    return(
        <AddOrderFormWrapper>
             <div id='toast-inject-here'></div>
             <Box py='15px'>
                <BreadCrumb options={breadCrumbOptions} onClick={handleBreadCrumbClick}  />
            </Box>
            {apiLoading && <Loader center={true} fadeBackground={true} speed={1}/>}

            <Box bgColor='white'>
                <Card style={{ minHeight: '80vh', position: 'relative' }}>
                    {isLoading && <div ref={loaderRef}><FormLoader /></div>}

                    <div style={isLoading ? { display: 'none' } : {}}>
                        {sectionKeys.length > 0 && sectionKeys.map((sectionName) =>
                            <div>
                            {(((sectionName !== 'fromConfigurations') && (deliveryLeg && pickupLeg) && (sectionName !== 'customer details')) || ((!deliveryLeg && pickupLeg) && (sectionName === 'order details' || sectionName === 'pick up details' || sectionName === 'general details' || sectionName=='additional information')) || ((deliveryLeg && !pickupLeg) && (sectionName === 'order details' || sectionName === 'delivery details' || sectionName === 'general details' || sectionName=='additional information')) || (isP2POrder && (sectionName === 'order details' || sectionName === 'pick up details' || sectionName === 'delivery details' || sectionName === 'general details' || sectionName=='additional information'))) && 

                                <div key={sectionName}>
                                    <FormRenderComponent 
                                        sectionName = {sectionName}
                                        formInstance = {formInstance}
                                        watchShipmentsType = {watchShipmentsType}
                                        watchPhoneNumbers = {watchPhoneNumbers}
                                        returnOrderAddress = {returnOrderAddress}
                                        handleCrateModalPopup = {(flag: boolean) => setShowCrateModal(flag)}
                                        returnOrderAddressValue = {(flag: boolean) => setReturnOrderAddress(flag)}
                                        isLoading = {isLoading}
                                        pickupMapPosition = {pickupMapPosition}
                                        deliverMapPosition = {deliverMapPosition}
                                        returnMapPosition = {returnMapPosition}
                                        customerMapPosition = {customerMapPosition}
                                        setPickupMapPosition = {setPickupMapPosition}
                                        setDeliverMapPosition = {setDeliverMapPosition}
                                        setReturnMapPosition = {setReturnMapPosition}
                                        setCustomerMapPosition = {setCustomerMapPosition}
                                        userType = {userType}
                                        deliveryLeg = {deliveryLeg}
                                        pickupLeg = {pickupLeg}
                                        isP2POrder={isP2POrder}
                                    />
                                </div>
                            }
                            </div>
                        )}
                    </div>
                    <Box horizontalSpacing='15px' display='flex' mt='30px'>
                        <IconButton iconVariant='icomoon-save' style={{ padding: '0px 15px' }} id="addorderform--add--save" disabled={isLoading} onClick={handleSubmit((data)=>onSubmit(data))} primary>{dynamicLabels.save}</IconButton>
                        <IconButtonWrapper className='icon-button-wrapper'>
                            <IconDropdown
                                    id="addorderform--add--save_and_apply"
                                    variant={ 'button-dropdown'}
                                    optionList={ ListViewOption }
                                    width={ '120px'}
                                    menuIsOpen={false}
                                    iconButtonDetails={[
                                    'icomoon-save-and-assign',
                                    'Save And Assign',
                                    'angle-down'
                                    ]}
                                    primary={true}
                                    intent={'page'}
                                    onChange={handleSaveAndAssign}
                                    isSingleClickOption={true}
                                    disabled={false}
                                    showOptionIcon= {true}
                                    dropdownPosition={{ left: '140px', top: '-105px' }}
                                />
                        </IconButtonWrapper>
                        <IconButton iconVariant='icomoon-close' id="addorderform--add--cancel" style={{ padding: '0px 15px' }} disabled={isLoading} onClick={() => handleCancel()}>{dynamicLabels.cancel}</IconButton>
                    </Box>
                </Card>
            </Box>
             {/*** SHOW ASSIGN DELIEVERY ASSOCIATE MODAL */}
            <AssignDAModal showAssignDAModal={showAssignDAModal} setAssignDAModal={setAssignDAModal} manualAssignFunc={(data: ISelectedRows) => setTripData(data)} manualAssignClick={manualAssignClick}/>

            <TripDateChangeModal showTripDateChangeModal={showTripDateChangeModal} setShowTripDateChangeModal={(value: boolean) => setShowTripDateChangeModal(value)} tripData={tripData} dateFormat={clientProperties?.DATEFORMAT}/>

            {showCrateModal && 
                <CrateModal
                    showCrateModal={showCrateModal}
                    setShowCrateModal={(value: boolean) => setShowCrateModal(value)}
                    value={crateItems}
                    currentPage = {currentPage}
                    formatCrateData = {(data: Array<ICrateData>) => formatCrateData(data)}
                />
            }
        </AddOrderFormWrapper>
    )
}
export default withReact(AddOrderForm)