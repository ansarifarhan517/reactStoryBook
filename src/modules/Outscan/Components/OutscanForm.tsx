import React, { Dispatch, useEffect, useState, memo } from "react";
import { Box, Card, Grid, useToast, TextInput, IconButton, ButtonGroup } from "ui-library";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { convertVolume, convertWeight, isEmpty } from "../utils";
import SelectConflictingRecordsModal from "./SelectConficlitingRecordsModal";
import ContentWrapper from "./ContentWrapper";
import OrderOutscanListview from "./OrderOutscanListview";
import ManifestOutscanListview from "./ManifestOutscanListview";
import ManifestIDConfirmationPopup from "./ManifestIDConfirmationPopup";
import { tGlobalPopupAction } from "../../common/GlobalPopup/GlobalPopup.reducer";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { OutscanOrderManifestActions } from "../OutscanOrderManifest.actions";
import useAudio from "../../../utils/useAudio";
import { IMongoFormStructure } from "../../../utils/mongo/interfaces";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { deepCopy } from "../../../utils/helper";
import { PRODUCT_TYPE } from "../../../utils/constants";
import FormLoader from "../../../utils/components/FormLoader";
import FormField from "../../../utils/components/Form/FormField";
import { ButtonContainer, FormContainer, FormFieldWapper, TabButtonContainer } from "./OutscanStyledComponent";
import { handedOverStatus, hubScanStatusWithoutInscan, IExceptionRecord, IManifestOfManifests, IManifestRecord, IOrderRecord, IOutscanFormProps, IPromiseResponse, ISelectedOrder } from "../OutscanOrderManifest.models";
import ExceptionListModal from "./ExceptionListModal";
import { userAccessInfo } from "../../../utils/constants"

const OutscanForm = (props: IOutscanFormProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.outscan);
    const defaultValues = {outscanBy: { 'clientRefMasterCd': 'Order', 'id': 'Order', 'name': userAccessInfo.superType == "MIDDLEMILE" ? dynamicLabels.mm_order_s ? dynamicLabels.mm_order_s : '' : dynamicLabels.order_s ? dynamicLabels.order_s : ''}, totalOutscannedOrders: 0, totalCrateCodes: 0, totalWeight: 0, totalVolume: 0, pendingForOutscan: 0, pendingForInscan: 0};
    const { tableData, setTabledata, totalCratesCount, setTotalCratesCount, totalWeight, setTotalWeight, totalVolume, setTotalVolume, totalPendingOrders, setTotalPendingOrders, scannedShipmentIds, setScannedShipmentIds, ngStateRouter, resetForm, updateTripFields, updateCourierFields, updateOrderFields, updateBranchFields } = props;
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
    
    const playSuccess = useAudio('sounds/success_beep.mp3');
    const playDuplicate = useAudio('sounds/Duplicate.wav');
    const playError = useAudio("sounds/Error.wav");
    const playFail = useAudio("sounds/beep_fail.wav");
    const playReturn = useAudio("sounds/Return.wav");

    const isFormLoading = useTypedSelector((state) => state.outscan.form.loading);
    const structure = useTypedSelector((state) => state.outscan.form.structure);
    const manifestList = useTypedSelector((state) => state.outscan.listview.manifestOfManifests.data.results);
    const isFormEditable = useTypedSelector((state) => state.outscan.form.isEditable);
    const manifestData = useTypedSelector((state) => state.outscan.form.manifestData);
    const dispatchNumber = useTypedSelector((state) => state.outscan.dispatchNum);
    const inscanStatus = ['INSCANNED_DESTINATION_BRANCH', 'INSCANNED_ORIGIN_BRANCH', 'INSCANNED'];

    const sectionKeys = !isEmpty(structure) ? Object.keys(structure) : [];
    const loaderRef = React.useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch<Dispatch<OutscanOrderManifestActions>>();
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: true, defaultValues: defaultValues });
    const toast = useToast();
    const { watch, setValue } = formInstance;
    const [scanId, setScanId] = useState<string>('');
    const [scanningInProgress, setScanningInProgress] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [showSaveUpdate, setShowSaveUpdate] = useState<boolean>(true);
    const [conflictsData, setConflictsData] = useState<Record<string, any>>({});
    const [bagNum, setBagNum] = useState<number>(1);
    const [totalOutscannedOrders, setTotalOutscannedOrders] = useState<number>(0);
    const [existingShipments, setExistingShipment] = useState<Array<number>>([]);
    const [existingManifests, setExistingManifests] = useState<Array<number>>([]);
    const [exceptionModalOpen, setExceptionModalOpen] = useState<boolean>(false);
    const [exceptionList, setExceptionList] = useState<IExceptionRecord[]>([]);
    const [scanSelectedType, setScanSelectedType] = useState<Record<string, any>>({});
    const [selectedAccordianType, setSelectedAccordionType] = useState<string>('');
    const [isConflict, setConflict] = useState<boolean>(false);
    const [manifestResponseData, setManifestResponseData] = useState<Record<string, any>>({});
    const [scanApiPayload, setScanApiPayload] = useState<Record<string, any>>({});
    const [actionType, setActionType] = useState<string>('');
    const [isIdConfirmationModalOpen, setIDConfirmationModalOpen] = useState<boolean>(false);
    const [pendingForOutscan, setPendingForOutscan] = useState<number>(0);
    const [scanIdentifier, setScanIdentifier] = useState<string>('');
    const [orderCount, setOrderCount] = useState<number>(0);
    const [toggledIDgenerate, setToggleIDgenerate] = useState<boolean>(false);
    const counters = ['totalOutscannedOrders', 'totalCrateCodes', 'totalWeight', 'totalVolume', 'pendingForOutscan', 'pendingForInscan'];

    const outscanBy = watch('outscanBy','');
    const manifestId = watch('manifestId', '')
    const selectDm = watch('selectDm', '');
    const selectTrip = watch('selectTrip', '');
    const cancelledOrderAllowedFl = watch('cancelledOrderAllowedFl', '');
    const originBranchFilter = watch('originBranchFilter', '');
    const nextBranchFilter = watch('nextBranchFilter', '');
    const selectCourier = watch('selectCourier', '');
    const serviceTypeFilter = watch('serviceTypeFilter', '');
    const manifestCategory = watch('manifestCategory', '');
    const [activeTab, setTabActive] = useState<string>('orders');

    const buttonData = React.useMemo(() => {
        return [{
            id: "orders",
            label: `${dynamicLabels.orders}${tableData.length > 0 ? ` (${tableData.length})` :''}`,
            selected: activeTab === "orders"
        }, {
            id: "manifests",
            label: `${dynamicLabels.manifest}s${manifestList?.length > 0 ? ` (${manifestList?.length})` :''}`,
            selected: activeTab === "manifests"
        }]
    }, [activeTab, dynamicLabels, tableData, manifestList]);


    const updateFormStructure = (newStructure: IMongoFormStructure) => {
        dispatch({ type: '@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS', payload: newStructure })
        dispatch({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: false });
    }
    // intial form structure loading
    useEffect(() => {
        !isFormEditable && dispatch({ type: '@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE' });
    },[isFormEditable])
    // fetching client selected metric system
    useEffect(() => {
        dispatch({ type: '@@outscanOrderManifest/GET_CLIENT_METRIC_SYSTEM'});
    }, []);

    // adding restritive icon to exception listview rows
    useEffect(() => {
        if (exceptionList.length > 0) {
            exceptionList.forEach((row: IExceptionRecord) => {
                const rowObj = row;
                if (row.exceptionType === "Restrictive") {
                    rowObj.editIconButtonProps = {
                        "style": {
                            "backgroundImage": "url(images/alert-for-list.svg)",
                            "backgroundSize": "contain",
                            "height": "10px",
                            "width": "10px",
                            "backgroundRepeat": "no-repeat",
                            "opacity": 1,
                            "margin": "7px 5px 8px"
                        },
                        "title": "Action Required",
                        "iconVariant": ''
                    }
                } else {
                    rowObj.editIconButtonProps = {
                        "style": {},
                        "title": "",
                        "iconVariant": ''
                    }
                }
                return rowObj
            })
            const exceptionData = {
                clientBranchId: 0,
                otherCount: 0,
                results: exceptionList,
                totalCount: exceptionList.length
            }
            dispatch({ type: '@@outscanOrderManifest/SET_EXCEPTION_LISTVIEW_DATA', payload: exceptionData });
        } else {
            const exceptionData = {
                clientBranchId: 0,
                otherCount: 0,
                results: [],
                totalCount: 0
            }
            dispatch({ type: '@@outscanOrderManifest/SET_EXCEPTION_LISTVIEW_DATA', payload: exceptionData });
        }
    }, [exceptionList])

    /* setting counter field values*/

    useEffect(() => {
        setValue('totalCrateCodes', totalCratesCount < 0 ? 0 : totalCratesCount)
    }, [totalCratesCount]);

    useEffect(() => {
        setValue('pendingForInscan', totalPendingOrders < 0 ? 0 : totalPendingOrders);
    }, [totalPendingOrders]);

    useEffect(() => {
        setValue('pendingForOutscan', pendingForOutscan < 0 ? 0 : pendingForOutscan);
    },[pendingForOutscan])

    useEffect(() => {
        setValue('totalVolume', totalVolume < 0 ? 0 : totalVolume <= 0 ? 0 : convertVolume(totalVolume));
    }, [totalVolume]);

    useEffect(() => {
        setValue('totalWeight', totalWeight < 0 ? 0 : totalWeight <= 0 ? 0 : convertWeight(totalWeight));
    }, [totalWeight]);
    
    useEffect(() => {
        setValue('totalOutscannedOrders', totalOutscannedOrders < 0 ? 0 : totalOutscannedOrders)
    }, [totalOutscannedOrders]);
    /* setting counter field values */

    // fetchin data based on edited manifest id
    useEffect(() => {
        if (ngStateRouter.params.id) {
            dispatch({ type: '@@outscanOrderManifest/SET_FORM_EDITABLE', payload: true });
            dispatch({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: true });
            dispatch({ type: '@@outscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID', payload: ngStateRouter.params.id });
        }
    }, [ngStateRouter]);

    //updating form structure and values in edit mode
    useEffect(() => {
        if (isFormEditable && !isEmpty(manifestData) && structure.hasOwnProperty('general details') && !isEmpty(structure['general details'])) {
           
            const data = manifestData;
            if (data.tripId && data.tripStatus == 'STARTED') {
                setShowSaveUpdate(false);
            }
            switch (data.manifestType) {
                case "TRIP":
                    {
                            updateTripFields(setValue, data);
                            setTotalPendingOrders(0);
                    }
                    break;
                case 'COURIER': {
                        updateCourierFields(setValue, data);
                        setTotalPendingOrders(0);
                }
                    break;
                case 'ORDER': {
                            updateOrderFields(setValue, data);
                }

                    break;
                case 'BRANCH': {
                        updateBranchFields(setValue, data);
                }
                    break;
            }
            
            setTotalOutscannedOrders(data.totalOrders);
            setTotalCratesCount(data.totalCrates);
            setTotalWeight(data.totalWeight ? data.totalWeight?.toFixed(2) : 0);
            setTotalVolume(data.totalVolume ? data.totalVolume?.toFixed(2) : 0);
            
            let orderNoShipmentMap = {};
            let addedOrdernoMap = {};
            let count = 0;
            if (data.childManifests) {
                const manifestListData = {
                    clientBranchId: 0,
                    otherCount: 0,
                    results: data.childManifests,
                    totalCount: data?.childManifests.length
                }
                setExistingManifests(data.childManifests.map((obj: IManifestOfManifests) => { return obj.manifestId }));
                dispatch({ type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: manifestListData });
            }
            const checkboxval = data.cancelledOrderAllowedFl;
            if (data?.shipmentList && data?.shipmentList.length > 0) {
                const shipmentData: IOrderRecord[] = [];
                data?.shipmentList.forEach((shipment: IOrderRecord) => {
                        shipment.orderNoMM = shipment.orderNo
                        // shipment.orderNoMM = shipment.orderNo
                    if (shipment.outwardMFId == data.manifestId) {
                        addedOrdernoMap[shipment.orderNo.toUpperCase()] = shipment;
                    }
                    shipmentData.push(shipment);
                    orderNoShipmentMap[shipment.orderNo.toUpperCase()] = shipment;
                    if ((!shipment.outwardMFId && shipment.packageStatusCd != "CANCELLED") || (!shipment.outwardMFId && shipment.packageStatusCd == "CANCELLED" && checkboxval && !handedOverStatus.includes(shipment.hubScanStatus))) {
                        count = count + 1;
                    }
                });
                setTabledata(shipmentData);
                setValue('pendingForOutscan', count);

                setExistingShipment(shipmentData.map((obj: IOrderRecord) => { return obj.shipmentId }));
            }
        }
    }, [isFormEditable, manifestData])


// disptaching scanned id list to redux
    useEffect(() => {
        const orderTableData = {
            clientBranchId: 0,
            otherCount: 0,
            results: tableData,
            totalCount: tableData.length
        }

        if(!isFormEditable) { 
            setTotalOutscannedOrders(tableData.length + manifestList?.reduce((total: number, current:IManifestOfManifests) => total += current.orderCount || 0, 0));
        }
        if(tableData.length === 0) {
            setScannedShipmentIds([])
        }
        setValue('totalOutscannedOrders', totalOutscannedOrders < 0 ? 0 : totalOutscannedOrders)
        dispatch({ type: '@@outscanOrderManifest/FETCH_SCANNED_ORDER_LIST_SUCCESS', payload: orderTableData });
    }, [tableData, isFormEditable, structure])


    const playDuplicateBeep = () => {
        playFail();
        setTimeout(function () {
            playDuplicate();
        }, 500);    
    }

    const resetSaveAndNew = (category: string, type: string) => {
        const originalCategory = deepCopy(category);
        const originBranchFilterValue = deepCopy(originBranchFilter);
        const nextBranchFilterValue = deepCopy(nextBranchFilter);
        const selectCourierValue = deepCopy(selectCourier);
        const selectDmValue = deepCopy(selectDm);
        const serviceTypeFilterValue = deepCopy(serviceTypeFilter);
        const selectTripValue = deepCopy(selectTrip);
        setIDConfirmationModalOpen(false);
        setValue('scanId', '');
        setScanId('');
        setTabledata([]);
        setExistingShipment([])
        setExistingManifests([])
        setExceptionList([]);
        setTotalCratesCount(0);
        setTotalWeight(0);
        setTotalVolume(0);
        setTotalPendingOrders(0);
        setScannedShipmentIds([]);
        
        formInstance.reset();
        setScanIdentifier('');
        localStorage.setItem('scanIdentifier','')
        dispatch({ type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: { clientBranchId: 0,  otherCount: 0, results: [], totalCount: 0} });
        if (!isFormEditable && !isEmpty(structure) && structure.hasOwnProperty('general details')) {
            const newStructure = deepCopy(structure);
                if (Object.keys(newStructure).length > 0) {
                    setTimeout(() => {
                        newStructure['general details'].serviceTypeFilter.editable = false;
                        newStructure['general details'].originBranchFilter.editable = false;
                        newStructure['general details'].nextBranchFilter.editable = false;
                        newStructure['general details'].selectDm.editable = false;
                        newStructure['general details'].selectTrip.editable = true;
                        newStructure['general details'].outscanBy.editable = false;
                        newStructure['general details'].cancelledOrderAllowedFl.editable = false;
                        newStructure['general details'].manifestCategory.editable = true;
                        newStructure['general details'].manifestId.editable = true;
                        updateFormStructure(newStructure);
                    }, 100);
                }
            }
        setTimeout(() => {
            setValue('outscanBy', type);
            setValue('manifestCategory', originalCategory);
            setValue('originBranchFilter', originBranchFilterValue);
            setValue('nextBranchFilter', nextBranchFilterValue);
            setValue('selectCourier', selectCourierValue);
            setValue('selectDm', selectDmValue);
            setValue('serviceTypeFilter', serviceTypeFilterValue);
            setValue('selectTrip', selectTripValue);
            setValue('cancelledOrderAllowedFl', scanApiPayload.cancelledOrderAllowedFl ? "Y" : "N");
            setValue('manifestId','')
        },100)
        setScanApiPayload({})
     }

    const checkMileStones = async (id: number, type: string) => {

        try {
            const { data: data } = await axios.get(`${apiMappings.outscan.form.getOrders}?id=${id}&type=${type}`);
            if (data.status === 200 && data.data.length === 0) {
                toast.add(`${data.message}`, 'warning', false);
                setTotalPendingOrders(data.data.length);
                setValue('pendingForInscan', data.data.length);
                setValue('pendingForOutscan', data.data.length)
                setPendingForOutscan(data.data.length)
                if (outscanBy.clientRefMasterCd === 'Trip') {
                    const newStucture = deepCopy(structure);
                    setTimeout(() => {
                        newStucture['general details'].totalOutscannedOrders.permission = false;
                        newStucture['general details'].totalCrateCodes.permission = false;
                        newStucture['general details'].pendingForInscan.permission = false;
                        newStucture['general details'].pendingForOutscan.permission = false;
                        newStucture['general details'].totalWeight.permission = false;
                        newStucture['general details'].totalVolume.permission = false;
                        updateFormStructure(newStucture)
                    }, 100)
                  
                }
                return;
            } else if (data.status === 200 && data.data.length > 0 && !isEmpty(structure)) {
                if (outscanBy.clientRefMasterCd === 'Trip') {
                    const newStucture = deepCopy(structure);
                    setTimeout(() => {
                        newStucture['general details'].totalOutscannedOrders.permission = true;
                        newStucture['general details'].totalCrateCodes.permission = true;
                        newStucture['general details'].pendingForInscan.permission = true;
                        newStucture['general details'].pendingForOutscan.permission = true;
                        newStucture['general details'].totalWeight.permission = true;
                        newStucture['general details'].totalVolume.permission = true;
                        updateFormStructure(newStucture)
                    }, 100)
                }
                let count = 0;
                let pendingForInscanCount = 0;
                const orderNoShipmentMap = {};
                const checkboxval = cancelledOrderAllowedFl === "Y" ? true : false;
                data.data.forEach((shipment:IOrderRecord) => {
                    orderNoShipmentMap[shipment.orderNo.toUpperCase()] = shipment;
                                                                                                                                                        // changed from shipment.hubScanStatus != "HANDEDOVER" on suggestion of vishwa
                    if ((!shipment.outwardMFId && shipment.packageStatusCd != "CANCELLED") || (!shipment.outwardMFId && shipment.packageStatusCd == "CANCELLED" && checkboxval && !handedOverStatus.includes(shipment.hubScanStatus))) { 
                        count = count + 1;
                    }
                    if (shipment.hubScanStatus == 'NOTSCANNED') {
                        pendingForInscanCount = pendingForInscanCount + 1;
                    }
                });
                    setTimeout(() => {
                        setTotalPendingOrders(pendingForInscanCount);
                        setValue('pendingForInscan', pendingForInscanCount);
                        setPendingForOutscan(count)
                        setValue('pendingForOutscan', count)
                    },100)
                return;
            }
        } catch (error) {
            console.log(error)
            toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
        }

    }

    // conditional rendering on selecting DA
    useEffect(() => {
        watch();
        if(!isFormEditable) {
            if (Object.keys(selectDm).length > 0) {
            const newStructure = deepCopy(structure);
            setTimeout(() => {
                newStructure['general details']["selectTrip"].countryFieldName = selectDm;
                newStructure['general details']["selectTrip"].permission = true;
                newStructure['general details']["totalOutscannedOrders"].permission = true;
                updateFormStructure(newStructure);
            }, 100);
        }
    }
    }, [selectDm, isFormEditable]);
    
    
    // conditional rendering on selecting TRIP
    useEffect(() => {
        if (Object.keys(selectTrip).length > 0 && !isFormEditable) {
            checkMileStones(selectTrip.id, 'TRIP')
        } else {
            setTotalPendingOrders(0)
        }
    }, [selectTrip, isFormEditable])

    // conditional rendering on selecting Courier
    useEffect(() => {
        if (Object.keys(selectTrip).length > 0 && !isFormEditable) {
            checkMileStones(selectTrip.id, 'COURIER')
        } else {
            setTotalPendingOrders(0)
        }
    }, [selectCourier, isFormEditable])

    // reinitializing form instance values on state update
    useEffect(() => { watch(); },[scanId]); 
   
    // conditional rendering on selction of outscanby
    useEffect(() => {
        if (!isFormEditable && !isEmpty(structure) && structure.hasOwnProperty('general details')) {
                    switch (outscanBy.clientRefMasterCd) {
                        case 'Trip': {
                            updateTripFields()
                        }
                            break;
                        case 'Courier': {
                            updateCourierFields();
                        }
                            break;
                        case 'Order': {
                            updateOrderFields();
                        }
                            break;
                        case 'Branch': {
                            updateBranchFields();
                        }
                            break;
                    }
                }
    }, [outscanBy, isFormEditable]);

    const handleBackendValidation = (response: IPromiseResponse) => {
        if (response.status == 409) {
            playError();
            toast.add(response.message + ' ' + ((response.data && null !== response.data) ? response.data : ''), 'warning', false);
            return false;
        }

        if (response.hasError || response.data === null) {
            playError();
            toast.add(response.message as string, 'warning', false);
            return false;
        }

        return true
    }

    const disableFilters = async () => {
            const newStructure = deepCopy(structure);
            setTimeout(() => {
                newStructure['general details']['selectTrip']['editable'] = false;  
                newStructure['general details']['selectDm']['editable'] = false;
                newStructure['general details']['cancelledOrderAllowedFl']['editable'] = false;
                newStructure['general details'].originBranchFilter.editable = false;
                newStructure['general details'].nextBranchFilter.editable = false;
                newStructure['general details'].serviceTypeFilter.editable = false;
                newStructure['general details'].tripNameFilter.editable = false;
                newStructure['general details'].manifestCategory.editable = false;
                newStructure['general details'].outscanBy.editable = false;
                updateFormStructure(newStructure);
            }, 100);
        } 

    const handleSuccess = (ordersList: ISelectedOrder[], isCrate = false) => {
        playSuccess();
        if (isCrate) {
            const existingInscanOrderIndex = tableData.findIndex((o: IOrderRecord) => o.shipmentId === ordersList[0].shipmentId)
            const existingInscanOrder = existingInscanOrderIndex === -1 ? undefined : tableData[existingInscanOrderIndex]
            if (existingInscanOrder) {
                const crateCdAlreadyScanned = existingInscanOrder.scannedCrateCodes ? existingInscanOrder.scannedCrateCodes.has(localStorage.getItem('scanIdentifier')) : true
                if (crateCdAlreadyScanned) {
                } else {
                    const scannedCrateCodes = tableData[existingInscanOrderIndex].scannedCrateCodes
                    if (scannedCrateCodes) {
                        scannedCrateCodes.add(localStorage.getItem('scanIdentifier'))
                    } else {
                        tableData[existingInscanOrderIndex].scannedCrateCodes = new Set([localStorage.getItem('scanIdentifier')])
                        const newTableData = [...tableData, ...[{...tableData[existingInscanOrderIndex], ...tableData[existingInscanOrderIndex].scannedCrateCodes}]]
                        setTabledata(newTableData);
                    }
                    setTotalCratesCount((totalCratesCount) => totalCratesCount+1);
                }
            } else {
                setScannedShipmentIds([...scannedShipmentIds, ...ordersList.map((o: ISelectedOrder) => o?.shipmentId.toString())])
                ordersList[0].scannedCrateCodes = new Set([localStorage.getItem('scanIdentifier')])
                setTabledata([...ordersList, ...tableData] as IOrderRecord[]);
                setTotalWeight((totalWeight) => totalWeight += ordersList.reduce((total: number, current: ISelectedOrder) => total += current.packageWeight || 0, 0));
                setTotalVolume((totalVolume) => totalVolume += ordersList.reduce((total: number, current: ISelectedOrder) => total += current.packageVolume || 0, 0));
                setTotalPendingOrders((totalPendingOrders) => totalPendingOrders-1);
                setPendingForOutscan((totalPendingOrders) => totalPendingOrders-1)
                setTotalCratesCount((totalCratesCount) => totalCratesCount+1);
            }
        } else {
            setScannedShipmentIds([...scannedShipmentIds, ...ordersList.map((o: ISelectedOrder) => o.shipmentId.toString())])
            setTabledata([...ordersList, ...tableData] as IOrderRecord[])
            setTotalWeight((totalWeight) => totalWeight += ordersList.reduce((total: number, current: ISelectedOrder) => total += current.packageWeight || 0, 0));
            setTotalVolume((totalVolume) => totalVolume += ordersList.reduce((total: number, current: ISelectedOrder) => total += current.packageVolume || 0, 0));
            setTotalPendingOrders((totalPendingOrders) => totalPendingOrders-1);
            setPendingForOutscan((totalPendingOrders) => totalPendingOrders-1)
            ordersList.forEach((o: ISelectedOrder) => {
                setTotalCratesCount((totalCratesCount) => totalCratesCount += o.crates ? (o.totalCrates || o.crates.length) : o.totalCrates ? o.totalCrates : 0);
            })
        }

        if (ordersList[0].orderState == 'RTM') {
            setTimeout(() => {
                playReturn();
            }, 500);
        }
    }
    const onSelectConflictingOrder = (orderDetails: ISelectedOrder, type: string) => {
        if (exceptionList.length > 0) {
            const filteredExceptions = exceptionList.filter((exception:IExceptionRecord) => type !== "manifest" ? exception.orderNo === orderDetails.orderNo : exception?.manifestId === orderDetails.manifestName);
            if(filteredExceptions?.length > 0) {
                setExceptionList(filteredExceptions);
                setExceptionModalOpen(true);
            } else {
                addScannedShipment(orderDetails)
            }
        } else {
            if (type === 'manifest') {
                addScannedShipment(orderDetails)
            } else {
                const scannedShipmentIdsSet = new Set(scannedShipmentIds)
                if(scannedShipmentIdsSet.has(orderDetails.shipmentId.toString())) {
                    if(tableData.find((order) => order.shipmentId === orderDetails.shipmentId)?.scannedCrateCodes.size < (orderDetails.crates.length || orderDetails.totalCrates)) {
                        handleSuccess([orderDetails], type === 'crate')
                    } else {
                    playDuplicateBeep()
                    toast.add(dynamicLabels.orderAlreadyScanned, 'warning', false);
                }
                } else {
                    handleSuccess([orderDetails], type === 'crate')
                }
            }
        }
        setConflictsData({});
        setModalOpen(false);
    }

    const continueScanning = async (orderDetails: ISelectedOrder, type: string) => {
        if (isConflict) {
            if (type === 'manifest') {
                handleSuccess(orderDetails.orders)
            } else {
                handleSuccess([orderDetails], type === 'crate')
            }
        } else {
            addScannedShipment(Object.keys(manifestResponseData).filter(key => key !== 'exceptionList').reduce((obj, key) => { obj[key] = manifestResponseData[key]; return obj; }, {}));
        }
        setExceptionList([]);
        setExceptionModalOpen(false)
    }
    const addScannedShipment = async (responseData: ISelectedOrder) => {
        if(scanningInProgress) { return; }
  
        setScanApiPayload({});
        const scannedManifestIdsSet = new Set(manifestList?.map((manifest: IManifestRecord) => manifest.manifestId))
        const scannedManifestParentIdsSet = new Set(manifestList.map((manifest: IManifestRecord) => manifest.hasOwnProperty('parentManifestId') ? manifest.parentManifestId : ''))
        const scannedManifests = new Set(manifestList?.map((manifest: IManifestRecord) => manifest.manifestName))
        const scannedOrders = new Set(tableData?.map((order) => order.hasOwnProperty('manifestId') ? order.manifestId : order.hasOwnProperty('outwardMFId') ? order.outwardMFId : null))
        const scannedShipmentIdsSet = new Set(scannedShipmentIds)
        if (!isEmpty(responseData) && responseData.hasOwnProperty('manifest')  || (!responseData.hasOwnProperty('order') && !responseData.hasOwnProperty('awb') && !responseData.hasOwnProperty('crate'))) {

            if(responseData.hasOwnProperty('parentManifestId') || responseData?.manifest?.hasOwnProperty('parentManifestId')) {
                let removePayload = {
                    "manifestId": responseData.parentManifestId || responseData?.manifest?.parentManifestId, // update id
                    'manifestName': responseData?.parentManifestName || responseData?.manifest?.parentManifestName,
                    "removeChildManifestIds": [responseData.manifestId || responseData.manifest?.manifestId]
                }
                const message = `${dynamicLabels.manifest_s} ${responseData.manifestName || responseData.manifest?.manifestName} ${dynamicLabels.isAlreadyPartOf} ${dynamicLabels.manifest_s} ${responseData.parentManifestName || responseData?.manifest?.parentManifestName}. ${dynamicLabels.doYouWantToRemoveAndContinueScan}`
                globalPopupDispatch({
                    type: '@@globalPopup/SET_PROPS',
                    payload: {
                        isOpen: true,
                        title: dynamicLabels.outscanConfirmmation,
                        content: message,
                        footer: (
                        <>
                            <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => {globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' }); removeChildManifestFromParent(removePayload, responseData)}}>{dynamicLabels.continue}</IconButton>
                            <IconButton iconVariant='cancel-button' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
                        </>
                        )
                    }
                });
                return;
            }
          
            if(scannedManifestIdsSet.has(responseData.manifest?.manifestId) || scannedManifestIdsSet.has(responseData.manifestId) || scannedOrders.has(responseData?.manifestName) || scannedOrders.has(responseData?.manifest?.manifestName) || scannedManifestIdsSet.has(responseData.parentManifestId) || scannedManifestIdsSet.has(responseData?.manifest?.parentManifestId) || scannedManifestParentIdsSet.has(responseData.manifestId) || scannedManifestParentIdsSet.has(responseData.manifest?.manifestId)) {
                playDuplicateBeep();
                toast.add(dynamicLabels.manifestIdAlreadyScanned, 'warning', false);
                return
            }
           
            if(isEmpty(responseData) && !isEmpty(scannedShipmentIds)) {
                playDuplicateBeep();    
                toast.add(dynamicLabels.awbAlreadyScanned || 'This AWB Number is already scanned.', 'warning', false);
                return
            }

            const manifestTableData = responseData.hasOwnProperty('manifest') ? [responseData.manifest].map((manifest: IManifestRecord) => {

                manifest['numberOfOrders'] = manifest['orderCount']
                manifest['scanStatus'] = manifest['hubScanStatus']
                manifest['originHub'] = manifest['originBranch']
                manifest['destinationHub'] = manifest['destBranch']
                return manifest;
            }) : [responseData].map((manifest: ISelectedOrder) => {

                manifest['numberOfOrders'] = manifest['orderCount']
                manifest['scanStatus'] = manifest['hubScanStatus']
                manifest['originHub'] = manifest['originBranch']
                manifest['destinationHub'] = manifest['destBranch']
                return manifest;
            })

            const manifestData = {
                clientBranchId: 0,
                otherCount: 0,
                results: manifestList?.length > 0 ? [ ...manifestList, ...manifestTableData] : manifestTableData,
                totalCount: [ ...manifestList, ...manifestTableData].length
            }
            playSuccess();
            dispatch({ type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: manifestData });
            setTabActive("manifests");
            setTotalVolume((totalVolume) => totalVolume += responseData.hasOwnProperty('manifest') ? Number(responseData.manifest.totalVolume?.toFixed(2)) || 0 : Number(responseData.totalVolume?.toFixed(2) || 0))
            setTotalWeight((totalWeight) => totalWeight += responseData.hasOwnProperty('manifest') ? Number(responseData.manifest.totalWeight?.toFixed(2)) || 0 : Number(responseData.totalWeight?.toFixed(2) || 0))
            setTotalCratesCount((totalCratesCount) => totalCratesCount += responseData.hasOwnProperty('manifest') ? responseData.manifest.totalCrates || 0 : responseData.totalCrates);
            setTotalOutscannedOrders((totalOutscannedOrders) => totalOutscannedOrders +=  responseData.hasOwnProperty('manifest') ? responseData.manifest.orderCount : responseData.orderCount);
            // disableFilters();
        }

        Object.keys(responseData).forEach((key) => {
            switch (key) {
                case 'order':
                    {
                        if (scannedShipmentIdsSet.has(responseData[key].shipmentId.toString())) {
                            delete responseData[key]
                        }

                        const dataKeys = Object.keys(responseData)
                        if (!responseData[key] && dataKeys.length === 0 || scannedManifests.has(responseData[key]?.manifestId || responseData[key]?.outwardMFId)) {
                            playDuplicateBeep();
                            toast.add(dynamicLabels.orderAlreadyScanned, 'warning', false);
                            return
                        }
                        if (dataKeys.length === 1) {
                            handleSuccess([responseData[key]])
                        }
                    }
                    break;

                case 'awb':
                    {
                        responseData[key] = responseData[key].filter((orderObj: ISelectedOrder) => !scannedShipmentIdsSet.has(orderObj.shipmentId.toString()))

                        if (responseData[key].length === 0) {
                            if (Object.keys(responseData).length === 1 || scannedManifests.has(responseData[key]?.manifestId || responseData[key]?.outwardMFId)) {
                                playDuplicateBeep()
                                toast.add(dynamicLabels.awbAlreadyScanned, 'warning', false);
                            }
                            delete responseData[key]
                            return
                        }

                        if (Object.keys(responseData).length === 1 && responseData[key].length === 1) {
                            handleSuccess(responseData[key])
                        }
                    }
                    break;

                case 'crate':
                    {
                        const scannedOrdersIndexMap = new Map();
                        tableData.forEach((ord: ISelectedOrder, index: number) => {
                            scannedOrdersIndexMap.set(ord.shipmentId, index)
                        })

                        responseData[key] = responseData[key].filter((ord: ISelectedOrder) => {
                            const index = scannedOrdersIndexMap.get(ord.shipmentId)
                            const crateCdAlreadyScannedForOrder =
                                index !== undefined &&
                                (tableData[index].scannedCrateCodes && tableData[index].crates ? (tableData[index].scannedCrateCodes.has(localStorage.getItem('scanIdentifier')))
                                    : true)

                            return !crateCdAlreadyScannedForOrder
                        })

                        if (responseData[key].length === 0) {
                            if (Object.keys(responseData).length === 1 || scannedManifests.has(responseData[key]?.manifestId || responseData[key]?.outwardMFId)) {
                                playDuplicateBeep()
                                toast.add(dynamicLabels.crateAlreadyScanned, 'warning', false);
                            }
                            delete responseData[key]
                            return
                        }

                        if (Object.keys(responseData).length === 1 && responseData[key].length === 1) {

                            handleSuccess(responseData[key], true)
                        }
                    }
                    break;
            }

        })
    }

    const scanById = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event?.key === 'Enter') {
            /** Pre scan validations */
            if (scanId.length && !outscanBy) {
                toast.add(dynamicLabels.pleaseSelectOutscanBy, 'warning', false);
                return;
            }
            if (scanId.length && outscanBy.clientRefMasterCd === "Trip" && (!selectDm || selectDm === '')) {
                toast.add(dynamicLabels.pleaseSelectDeliveryBoy, 'warning', false);
                return;
            }
            if (scanId.length && outscanBy.clientRefMasterCd === "Trip" && selectDm.id && (!selectTrip || selectTrip === '')) {
                toast.add(dynamicLabels.pleaseSelectTrip, 'warning', false);
                return;
            }
            if (scanId.length && outscanBy.clientRefMasterCd === "Courier" && !selectCourier) {
                toast.add(dynamicLabels.pleaseSelectCourier, 'warning', false);
                return;
            }

            if (scanId.length && outscanBy.clientRefMasterCd === 'Branch' && (!originBranchFilter || originBranchFilter === '')) {
                toast.add(dynamicLabels.originBranchIsMandatory || 'Origin Branch is Mandatory', 'warning', false);
                return;
            }

            if (scanId.length && outscanBy.clientRefMasterCd === 'Branch' && (!nextBranchFilter || nextBranchFilter === '')) {
                toast.add(dynamicLabels.nextBranchIsMandatory || 'Next Branch is Mandatory', 'warning', false);
                return;
            }

            const apiDataPayload: Record<string, any> = {
                scanIdentifier: event?.currentTarget.value,
                cancelledOrderAllowedFl: cancelledOrderAllowedFl === 'Y' ? true : false,
            }

            if (outscanBy.clientRefMasterCd === 'Branch') {
                const originBranchId = originBranchFilter.clientNodeId
                const nextBranchId = nextBranchFilter.clientNodeId
                const serviceTypeId = serviceTypeFilter.clientRefMasterCd
                const tripId = selectTrip.id

                apiDataPayload.orignBranchNodeId = originBranchId
                apiDataPayload.nextBranchNodeId = nextBranchId
                apiDataPayload.type = 'BRANCH'

                if (serviceTypeId) {
                    apiDataPayload.serviceTypeCd = serviceTypeId
                }

                if (tripId) {
                    apiDataPayload.tripId = tripId
                }
            }
            if (outscanBy.clientRefMasterCd === 'Trip') {
                const tripId = selectTrip.id
                apiDataPayload.type = 'TRIP'
                if(tripId) {
                    apiDataPayload.tripId = tripId
                }
            }
            

            if (apiDataPayload.scanIdentifier != "" && !scanningInProgress) {
                setScanningInProgress(true);
                try {
                    setScanApiPayload(apiDataPayload);
                    const { data: data } = await axios.post(apiMappings.outscan.form.outscan, apiDataPayload);
                    setScanningInProgress(false)
                    setScanId('');
                    disableFilters();
                    setScanIdentifier(apiDataPayload.scanIdentifier.trim().toLowerCase())
                    localStorage.setItem('scanIdentifier',apiDataPayload.scanIdentifier.trim().toLowerCase())
                    const backendValidationPassed = handleBackendValidation(data)
                    if (!backendValidationPassed) return

                    const responseData = data.data

                    if(responseData.hasOwnProperty('awb')) {
                        if(responseData.awb.filter((awb: ISelectedOrder) => !scannedShipmentIds.includes(awb.shipmentId.toString())).length > 0) {
                            responseData['awb'] = responseData.awb.filter((awb: ISelectedOrder) => !scannedShipmentIds.includes(awb.shipmentId.toString()))
                        } else {
                            delete responseData['awb']
                        }
                    }
                    setManifestResponseData(responseData);
                    let conflictsData = {}
                    if (Object.keys(responseData).length === 2 && responseData.hasOwnProperty('exceptionList') && ((responseData.hasOwnProperty('awb') || responseData.hasOwnProperty('manifest') || responseData.hasOwnProperty('order'))) && responseData.exceptionList.length > 0) {
                        setExceptionModalOpen(true);
                        setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                    } else if(Object.keys(responseData).length > 1 && !responseData.hasOwnProperty('exceptionList') && ((responseData.hasOwnProperty('awb') || responseData.hasOwnProperty('manifest') || responseData.hasOwnProperty('order')))){
                            conflictsData = {
                                ...data.data,
                                ...(data.data.order ? { order: [data.data.order] } : {}),
                                ...(data.data.manifest ? { manifest: [data.data.manifest] } : {}),
                            }
                    } else if (Object.keys(responseData).length === 1 && responseData.hasOwnProperty('awb') && responseData.awb.length > 1) {
                        conflictsData = { ...data.data }
                        setConflictsData({});
                        if (conflictsData.hasOwnProperty('exceptionList')) {
                            setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                            conflictsData = Object.keys(conflictsData).filter(key =>
                                key !== 'exceptionList').reduce((obj, key) => {
                                    obj[key] = conflictsData[key];
                                    return obj;
                                }, {}
                                );
                        }
                        setConflictsData(conflictsData);
                        setModalOpen(true);
                        setConflict(true);
                    } else if(Object.keys(responseData).length > 1 && responseData.hasOwnProperty('awb') && responseData.awb.length > 1) {
                        if(responseData.hasOwnProperty('awb') && responseData['awb'].length > 0) {
                            conflictsData = { ...data.data }
                            setConflictsData({});
                            
                            if (conflictsData.hasOwnProperty('exceptionList')) {
                                setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                                conflictsData = Object.keys(conflictsData).filter(key =>
                                    key !== 'exceptionList').reduce((obj, key) => {
                                        obj[key] = conflictsData[key];
                                        return obj;
                                    }, {}
                                    );
                            }
                        
                            if (conflictsData.hasOwnProperty('order') && scannedShipmentIds.includes(responseData.order.shipmentId.toString())) {
                                delete responseData['order'];
                                delete conflictsData['order'];
                            }
                            setConflictsData(conflictsData);
                            setModalOpen(true);
                            setConflict(true);
                        } 
                    } else {
                        if(isEmpty(conflictsData)) {
                            addScannedShipment(responseData);
                        } else {
                            setConflictsData(conflictsData);
                            setModalOpen(true);
                            setConflict(true);
                        }
                    }
                    if (Object.keys(responseData).length > 1 || (responseData.crate && responseData.crate.length > 1)) {

                        if (Object.keys(responseData).length === 2 && responseData.hasOwnProperty('exceptionList') && ((responseData.hasOwnProperty('awb') || responseData.hasOwnProperty('manifest') || responseData.hasOwnProperty('order')))) {
                            if(responseData.hasOwnProperty('awb') && responseData['awb'].length > 0) {
                                setConflictsData(conflictsData);
                                // setModalOpen(true);
                                // setConflict(true);
                            } else {
                                setExceptionModalOpen(true);
                                setConflict(false);
                                setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                            }
                        } else if(Object.keys(responseData).length === 2 && responseData.hasOwnProperty('manifest') && responseData.hasOwnProperty('order')) {
                            const scannedManifestIds = manifestList.map((manifest) => manifest.manifestId); 
                            const scannedManifestIdsSet = new Set(scannedManifestIds);
                            const scannedShipmentIds = tableData.map((order) => order.shipmentId); 
                            const scannedShipmentIdsSet = new Set(scannedShipmentIds);
                            conflictsData = {
                                ...(data.data.order && !scannedShipmentIdsSet.has(data.data.order.shipmentId) ? { order: [data.data.order] } : {}),
                                ...(data.data.manifest && !scannedManifestIdsSet.has(data.data.manifest.manifestId) ? { manifest: [data.data.manifest] } : {}),
                            }
                            setConflictsData({})
                            if(Object.keys(conflictsData)?.length > 1) {
                                if (conflictsData.hasOwnProperty('exceptionList')) {
                                    setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                                    conflictsData = Object.keys(conflictsData).filter(key =>
                                        key !== 'exceptionList').reduce((obj, key) => {
                                            obj[key] = conflictsData[key];
                                            return obj;
                                        }, {}
                                        );
                                }
                                setConflictsData(conflictsData);
                                setModalOpen(true);
                                setConflict(true);
                            } else {
                                const key = Object.keys(conflictsData).toString()
                                let scanningData = {}
                                scanningData = {[key]: conflictsData[key][0] }
                                addScannedShipment(scanningData);
                            }
                        } else {
                        // Show Conflicting Resolution Popup
                        conflictsData = {
                            ...data.data,
                            ...(data.data.order ? { order: [data.data.order] } : {}),
                            ...(data.data.manifest ? { manifest: [data.data.manifest] } : {}),
                        
                        }
                        setConflictsData({})
                        if (conflictsData.hasOwnProperty('exceptionList')) {
                            setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                            conflictsData = Object.keys(conflictsData).filter(key =>
                                key !== 'exceptionList').reduce((obj, key) => {
                                    obj[key] = conflictsData[key];
                                    return obj;
                                }, {}
                                );
                        }

                        setConflictsData(conflictsData);
                        setModalOpen(true);
                        setConflict(true);
                    }

                        if (conflictsData.hasOwnProperty('exceptionList')) {
                            setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                            conflictsData = Object.keys(conflictsData).filter(key =>
                                key !== 'exceptionList').reduce((obj, key) => {
                                    obj[key] = conflictsData[key];
                                    return obj;
                                }, {}
                            );
                        }
                    
                    }

                } catch (error) {
                    console.log(error)
                    setScanId('');
                    disableFilters();
                    setScanningInProgress(false);
                    setScanApiPayload({});
                    toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
                }
            }
        }
    }


    const handleConfirmation = (action: string, updateFlag: boolean) => {
        globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
        finalSubmit(action, updateFlag);
    }


    const saveManifest = function (action: string, updateFlag: boolean) {
        setActionType(action);
        if (pendingForOutscan > 0 && outscanBy.clientRefMasterCd === 'Trip') {
            const isTripStarted = selectTrip.name.split(',').indexOf('STARTED');
            if (isTripStarted >= 0) {
                const message = pendingForOutscan + ' ' + dynamicLabels.outOf + ' ' + (pendingForOutscan + totalOutscannedOrders) + dynamicLabels.pendingOutscanMessageForStartTrip;

                globalPopupDispatch({
                    type: '@@globalPopup/SET_PROPS',
                    payload: {
                        isOpen: true,
                        title: dynamicLabels.outscanConfirmmation,
                        content: message,
                        footer: (<IconButton iconVariant='icomoon-tick-circled' primary onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.ok}</IconButton>)
                    }
                });
            } else {
                const msg = pendingForOutscan + ' ' + dynamicLabels.outOf + ' ' + (pendingForOutscan + totalOutscannedOrders) + dynamicLabels.pendingOutscanWarning;
                globalPopupDispatch({
                    type: '@@globalPopup/SET_PROPS',
                    payload: {
                        isOpen: true,
                        title: dynamicLabels.outscanConfirmmation,
                        content: msg,
                        footer: (
                            <>
                                <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => handleConfirmation(action, updateFlag)}>{dynamicLabels.ok}</IconButton>
                            </>
                        )
                    }
                });

            }
        } else {
            finalSubmit(action, updateFlag);
        }
    }

    const removeChildManifestFromParent = async (payload: Record<string, any>, responseData: Record<string, any>) => {
            if (payload.removeChildManifestIds.length === 0) {
                toast.add(dynamicLabels.noDataChangesMessage, 'warning', false);
                return;
            } else {
                try {
                    const { data } = await axios.put(apiMappings.outscan.form.update, payload)
                    if(data.status === 200 && data.data) {
                        delete responseData['parentManifestId']
                        delete responseData['parentManifestName']
                        delete responseData?.manifest?.['parentManifestId']
                        delete responseData?.manifest?.['parentManifestName']
                        addScannedShipment(responseData);
                    }
                } catch (error) {
                    toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
                }
            }
    }

    const submitAPICall = async (action: string, useExisting?: boolean) => {
        let payload: Record<string, any> = {}
        if (isFormEditable && ngStateRouter?.params?.id) {
            const allShipments = tableData.map((obj: IOrderRecord) => { return obj.shipmentId })
            const allManifestList = manifestList.map((obj: IManifestOfManifests) => { return obj.manifestId });
            payload = {
                "manifestId": Number(ngStateRouter.params.id), // update id
                "manifestName": manifestId,
                "manifestType": outscanBy ? outscanBy.clientRefMasterCd.toUpperCase() : '',
                "manifestCategory": manifestCategory ? manifestCategory.clientRefMasterCd : '',
                "hubScanStatus": "OUTSCANNED",
                "shipmentIds": allShipments,
                "removeShipmentIds": existingShipments.filter((ele: number) => { return allShipments.indexOf(ele) < 0 }),
                "childManifestIds": manifestList ? manifestList.map((obj: IManifestOfManifests) => { return obj.manifestId }) : [],
                "removeChildManifestIds": existingManifests.filter((ele: number) => { return allManifestList.indexOf(ele) < 0 })
            };
            if (payload.removeShipmentIds.length === 0 && payload.removeChildManifestIds.length === 0) {
                toast.add(dynamicLabels.noDataChangesMessage, 'warning', false);
                return;
            } else {
                try {
                    const { data } = await axios.put(apiMappings.outscan.form.update, payload)
                    toast.add(data.message, 'check-round', false);
                    resetForm();
                } catch (error) {
                    toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
                }
            }
        } else {
            payload = {
                "manifestName": manifestId,
                "cancelledOrderAllowedFl": cancelledOrderAllowedFl === 'Y' ? true : false,
                "manifestType": outscanBy ? outscanBy.clientRefMasterCd.toUpperCase() : '',
                "manifestCategory": manifestCategory.clientRefMasterCd,
                "hubScanStatus": "OUTSCANNED",
                "shipmentIds": tableData.map((obj: IOrderRecord) => { return obj.shipmentId }),
                "childManifestIds": manifestList ? manifestList.map((obj: IManifestOfManifests) => { return obj.manifestId }) : []
            };

            if(toggledIDgenerate) {
                if(orderCount > 0 && orderCount === tableData.length || manifestList.length === 1 && tableData.length === 0 && inscanStatus.includes(manifestList[0].hubScanStatus)) {
                    if (!useExisting) {
                        payload.useExistingId = true
                        payload.manifestName = tableData.length > 0 ? tableData[0].manifestId : manifestList.length === 1 &&  tableData.length === 0 ? manifestList[0].manifestName : undefined
                            if(manifestList.length === 1 && tableData.length === 0 && inscanStatus.includes(manifestList[0].hubScanStatus)) {
                                payload.hubScanStatus = "INSCANNED"
                            } else if(orderCount > 0 && orderCount === tableData.length) {
                                payload.hubScanStatus = "OUTSCANNED"
                            }
                    } else {
                        payload.useExistingId = false
                        payload.manifestName = manifestId
                        payload.hubScanStatus = "INSCANNED"
                    }
                } else {
                    if (!useExisting) {
                        payload.useExistingId = true
                        payload.manifestName = tableData[0].manifestId || manifestList[0].manifestName
                        payload.hubScanStatus = "OUTSCANNED"
                    } else {
                        payload.useExistingId = false
                        payload.manifestName = manifestId
                        payload.hubScanStatus = "OUTSCANNED"
                    }
                }
            } else {
                if(orderCount > 0 && orderCount === tableData.length || manifestList.length === 1 && tableData.length === 0 && inscanStatus.includes(manifestList[0].hubScanStatus)) {
                        payload.manifestName = tableData.length > 0 ? manifestId ? manifestId : tableData[0].manifestId : manifestList.length === 1 && tableData.length === 0 ? manifestId ? manifestId : manifestList[0].manifestName : undefined
                        if(manifestList.length === 1 && tableData.length === 0 && inscanStatus.includes(manifestList[0].hubScanStatus)) {
                            payload.hubScanStatus = "INSCANNED"
                        } else if(orderCount > 0 && orderCount === tableData.length) {
                            payload.hubScanStatus = "OUTSCANNED"
                        }
                    } else {
                        payload.manifestName = manifestId
                        payload.hubScanStatus = "OUTSCANNED"
                    }
            }
            if (outscanBy.clientRefMasterCd === 'Branch') {
                payload.metaData = {
                    originBranchCd: originBranchFilter.name, //
                    destBranchCd: nextBranchFilter.name, //
                    bagNum: bagNum,
                    manifestWght: totalWeight,
                    manifestVol: totalVolume,
                    totalOrders: tableData.length,
                    totalCrates: totalCratesCount,
                    serviceTypeCd: serviceTypeFilter ? serviceTypeFilter.clientRefMasterCd : '',
                }
                
                if (dispatchNumber > 0) {
                    payload.metaData = {
                        ...payload.metaData,
                        dispatchNum: dispatchNumber
                    }
                }
            }

            try {
                    const { data } = await axios.post(apiMappings.outscan.form.create, payload)
                    dispatch({type: '@@outscanOrderManifest/SET_DISPATCH_NUMBER', payload: data?.data?.metaData?.dispatchNum})
                    toast.add(data.message, 'check-round', false);
                    if(data?.status === 400) {
                        toast.add(data.message, 'warning', false);
                    }

                if (action === 'saveAndAsign') {
                    resetSaveAndNew(manifestCategory, outscanBy);
                    setBagNum((bagNum) => bagNum+1);
                } else {
                    resetForm();
                }
            } catch (error) {
                console.log(error)
                toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
            }
        }
    }
    
    const finalSubmit = async (action: string, updateFlag?: boolean) => {
        const partialCratesScannedShipments: string[] = []

        const commonManifestId = tableData[0] && tableData[0].manifestId
        let allOrdersHaveSameManifestId = true
        tableData.forEach(({ orderNo, orderNoMM, scannedCrateCodes, crates, totalCrates, manifestId }) => {
            if (commonManifestId !== manifestId) {
                allOrdersHaveSameManifestId = false
            }
            if (scannedCrateCodes && scannedCrateCodes.size !== (totalCrates || crates.length)) {
                partialCratesScannedShipments.push(PRODUCT_TYPE === 'allmile' ? orderNoMM : orderNo)
            }
        })

        if (partialCratesScannedShipments.length) {
            toast.add(dynamicLabels.scanAllCratesValidationMessage.replace(':1', partialCratesScannedShipments.join(', ')), 'warning', false);
            return
        }

        const searchManifestId = tableData.length > 0 ? tableData[0].manifestId : undefined;
        if (allOrdersHaveSameManifestId && PRODUCT_TYPE === 'allmile' && searchManifestId) {

            try {
                const { data } = await axios.get(`${apiMappings.outscan.form.manifestOrderCount}?manifestId=${searchManifestId}`);
                const count = Number(data.data);
                setOrderCount(count);
                if (count === tableData.length && !manifestId) {
                    setIDConfirmationModalOpen(true)
                } else {
                    submitAPICall(action)
                    return
                }
            } catch (error) {
                console.log('Failed to fetch Order Count for manifest ID: ', searchManifestId, error)
            }
            return
        } else if (manifestList && manifestList?.length === 1 && inscanStatus.includes(manifestList[0].hubScanStatus) && tableData.length === 0 && !isFormEditable && !manifestId) {
            setIDConfirmationModalOpen(true)
        } else {
            submitAPICall(action)
        }

    }


    return (
        <>
            <Box style={{ padding: 15, paddingBottom: 5, paddingTop: 0 }}>
                <Card>
                    {isFormLoading || sectionKeys.length === 0 ? (
                        <div ref={loaderRef}>
                            <FormLoader />
                        </div>
                    ) :
                        <FormContainer>
                            {sectionKeys.length > 0 && !isEmpty(structure) && sectionKeys.map((sectioName) => {
                                return (
                                    <Grid container spacing='15px' style={{ padding: "15px 5px" }}>
                                        {Object.keys(structure[sectioName]).map((fieldName) => {
                                            const meta = structure[sectioName][fieldName];
                                            meta.multipleFiles = false;
                                            const { permission } = meta;

                                            if (!permission) {
                                                return undefined;
                                            }

                                            if (counters.includes(fieldName)) {
                                                return (
                                                    <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item form-fields'>
                                                        <Grid container style={{ padding: "0px" }}>
                                                            <Grid item xs={12} sm={5} md={5} style={{ paddingRight: '0px!important' }} className='grid-item form-fields pr-0'>
                                                                <FormFieldWapper>
                                                                    {meta.label}
                                                                </FormFieldWapper>
                                                            </Grid>
                                                            <Grid item xs={12} sm={5} md={5} style={{ paddingLeft: '0px!important' }} className='grid-item form-fields noLabel pl-0'>
                                                                <FormFieldWapper>
                                                                    <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                                </FormFieldWapper>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                );
                                            }

                                            return (
                                                <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item form-fields'>
                                                    <FormFieldWapper>
                                                        <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                    </FormFieldWapper>
                                                </Grid>
                                            );
                                        })}



                                    </Grid>
                                )
                            })}

                            <Grid container spacing='15px' style={{ padding: "0 15px 15px 5px" }}>
                                <Grid item xs={12} sm={6} md={3} className='grid-item form-fields scanid'>
                                    <FormFieldWapper>
                                        <TextInput disabled={isFormEditable} name="scanId" label={dynamicLabels.scanId} placeholder={dynamicLabels.enterScanId} value={scanId} onKeyDown={(e) => scanById(e)} onChange={(e) => setScanId(e.target.value)} />
                                    </FormFieldWapper>
                                </Grid>
                            </Grid>
                        </FormContainer>}
                    <SelectConflictingRecordsModal setModalOpen={setModalOpen} isModalOpen={isModalOpen} conflictsData={conflictsData} onSelectConflictingOrder={onSelectConflictingOrder} scanSelectedType={scanSelectedType} setScanSelectedType={setScanSelectedType} selectedAccordianType={selectedAccordianType} setSelectedAccordionType={setSelectedAccordionType} scanId={localStorage.getItem('scanIdentifier') || ''} />
                </Card>
            </Box>
            <Box style={{ padding: 15 }}>
                <TabButtonContainer>
                    <ButtonGroup
                        data={buttonData}
                        onChange={(id) => { setTabActive(id) }}
                    />
                </TabButtonContainer>
                <ContentWrapper>
                    {activeTab === 'orders' ?
                        <OrderOutscanListview
                            tableData={tableData}
                            setTabledata={setTabledata}
                            totalCratesCount={totalCratesCount}
                            setTotalCratesCount={setTotalCratesCount}
                            totalWeight={totalWeight}
                            setTotalWeight={setTotalWeight}
                            totalVolume={totalVolume}
                            setTotalVolume={setTotalVolume}
                            totalPendingOrders={totalPendingOrders}
                            setTotalPendingOrders={setTotalPendingOrders}
                            scannedShipmentIds={scannedShipmentIds}
                            setScannedShipmentIds={setScannedShipmentIds}
                            totalOutscannedOrders={totalOutscannedOrders}
                            setTotalOutscannedOrders={setTotalOutscannedOrders}
                        /> :
                        <ManifestOutscanListview
                            tableData={tableData}
                            setTabledata={setTabledata}
                            totalCratesCount={totalCratesCount}
                            setTotalCratesCount={setTotalCratesCount}
                            totalWeight={totalWeight}
                            setTotalWeight={setTotalWeight}
                            totalVolume={totalVolume}
                            setTotalVolume={setTotalVolume}
                            totalPendingOrders={totalPendingOrders}
                            setTotalPendingOrders={setTotalPendingOrders}
                            scannedShipmentIds={scannedShipmentIds}
                            setScannedShipmentIds={setScannedShipmentIds}
                            totalOutscannedOrders={totalOutscannedOrders}
                            setTotalOutscannedOrders={setTotalOutscannedOrders}
                        />
                    }
                    <ButtonContainer>
                        {showSaveUpdate && <IconButton id="manifestform--actionbar--save" disabled={isFormEditable ? (existingManifests.filter((ele: number) => { return  manifestList.map((obj: IManifestOfManifests) => { return obj.manifestId })?.indexOf(ele) < 0 }).length === 0) && (existingShipments.filter((ele: number) => { return tableData.map((obj: IOrderRecord) => { return obj.shipmentId }).indexOf(ele) < 0 }).length === 0) : tableData.length == 0 && ((manifestList && manifestList?.length < 2) && !(manifestList && manifestList?.length === 1 && !hubScanStatusWithoutInscan.includes(manifestList[0]?.hubScanStatus) && tableData.length === 0)) && !isFormEditable} iconVariant='icomoon-save' primary onClick={() => saveManifest('save', isFormEditable)}>{isFormEditable ? dynamicLabels.update : dynamicLabels.save}</IconButton>}
                        {!isFormEditable && <IconButton id="manifestform--actionbar--save_and_new" disabled={isFormEditable ? (existingManifests.filter((ele: number) => { return  manifestList.map((obj: IManifestOfManifests) => { return obj.manifestId })?.indexOf(ele) < 0 }).length === 0) && (existingShipments.filter((ele: number) => { return tableData.map((obj: IOrderRecord) => { return obj.shipmentId }).indexOf(ele) < 0 }).length === 0)  : tableData.length == 0 && ((manifestList && manifestList?.length < 2) && !(manifestList && manifestList?.length === 1 && !hubScanStatusWithoutInscan.includes(manifestList[0]?.hubScanStatus) && tableData.length === 0)) && !isFormEditable} iconVariant='icomoon-save-and-assign' primary onClick={() => saveManifest('saveAndAsign', false)}>{dynamicLabels.manifestSaveAndNew}</IconButton>}
                        <IconButton id="manifestform--actionbar--cancle" iconVariant='cancel-button' onClick={() => resetForm()}>{dynamicLabels.cancel}</IconButton>
                    </ButtonContainer>
                </ContentWrapper>
            </Box>
            <ManifestIDConfirmationPopup isOpen={isIdConfirmationModalOpen} actionType={actionType} submitAPICall={submitAPICall} onClose={setIDConfirmationModalOpen} dynamicLabelsAngular={dynamicLabels} setToggleIDgenerate={setToggleIDgenerate} toggledIDgenerate={toggledIDgenerate} />
            <ExceptionListModal isOpen={exceptionModalOpen} onClose={setExceptionModalOpen} scanSelectedType={scanSelectedType} selectedAccordianType={selectedAccordianType} continueScanning={continueScanning} scanApiPayload={scanApiPayload} setExceptionList={setExceptionList} />

        </>
    )
}

export default memo(OutscanForm);